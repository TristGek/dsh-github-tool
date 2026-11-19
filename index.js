/**
 * Host half of the GitHub bundle.
 *
 * One same-origin HTTP route (`/dsh-github-tool/api/*`) proxies the GitHub REST API,
 * so the browser never holds the token and never has to leave the DSH origin.
 * The personal access token lives in the credential store as a `grant` record;
 * it is written on sign-in, read on every request, and removed on sign-out.
 */

/** This row needs the HTTP carrier and the Peer admission checks. */
export const inject = ['webServer', 'connection']

/** Route prefix the matching browser half posts to. */
const ROUTE_PREFIX = '/dsh-github-tool/api'

/** Credential record address: `<scope>/<id>`, both lowercase hyphenated segments. */
const RECORD_KEY = 'dsh-github-tool/account'

/** The record written before the bundle was renamed; migrated on activation. */
const LEGACY_RECORD_KEY = 'dsh-github/account'

const API_ORIGIN = 'https://api.github.com'
const USER_AGENT = 'dsh-github-tool-plugin/1.0'
const API_VERSION = '2022-11-28'

/** Recommendations: repositories created within this many days, sorted by stars. */
const CREATED_WINDOW_DAYS = 7
const RECOMMEND_PAGE_SIZE = 50
/** Top pages only: rank 1-200 by stars, with page 1 favoured so the list stays genuinely popular. */
const RECOMMEND_PAGES = 4
const RECOMMEND_COUNT = 18

const SEARCH_PAGE_SIZE_DEFAULT = 10
const CACHE_TTL_MS = 5 * 60 * 1000
const PROFILE_TTL_MS = 5 * 60 * 1000
const REQUEST_TIMEOUT_MS = 20000
const MAX_BODY_BYTES = 64 * 1024

/** A failed Host operation that the browser half renders by its `code`. */
class ApiError extends Error {
  constructor(code, message, status = 400, details = {}) {
    super(message)
    this.name = 'GitHubApiError'
    this.code = code
    this.status = status
    this.details = details
  }
}

function writeJson(res, status, body) {
  const payload = JSON.stringify(body)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': String(Buffer.byteLength(payload)),
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  })
  res.end(payload)
}

function writeOk(res, value) {
  writeJson(res, 200, { ok: true, value })
}

function writeFailure(res, error) {
  if (error instanceof ApiError) {
    writeJson(res, error.status, {
      ok: false,
      error: { code: error.code, message: error.message, details: error.details },
    })
    return
  }
  writeJson(res, 500, {
    ok: false,
    error: { code: 'internal', message: 'The GitHub proxy failed unexpectedly.', details: {} },
  })
}

/** Read at most `limit` bytes of a JSON request body. */
function readJsonBody(req, limit = MAX_BODY_BYTES) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    let settled = false
    const finish = (error, value) => {
      if (settled) return
      settled = true
      if (error) reject(error)
      else resolve(value)
    }
    req.on('data', (chunk) => {
      if (settled) return
      size += chunk.length
      if (size > limit) {
        finish(new ApiError('too-large', 'The request body is too large.', 413))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      if (settled) return
      const text = Buffer.concat(chunks).toString('utf8')
      if (text.trim() === '') {
        finish(undefined, {})
        return
      }
      try {
        const parsed = JSON.parse(text)
        finish(undefined, parsed !== null && typeof parsed === 'object' ? parsed : {})
      } catch {
        finish(new ApiError('bad-request', 'The request body is not valid JSON.', 400))
      }
    })
    req.on('error', (error) => finish(error))
  })
}

/** Shape one GitHub repository for the browser half; no token or raw payload leaks through. */
function normalizeRepo(item) {
  if (item === null || typeof item !== 'object') return null
  const owner = item.owner !== null && typeof item.owner === 'object' ? item.owner : {}
  return {
    id: typeof item.id === 'number' ? item.id : 0,
    name: typeof item.name === 'string' ? item.name : '',
    fullName: typeof item.full_name === 'string' ? item.full_name : '',
    description: typeof item.description === 'string' ? item.description : '',
    url: typeof item.html_url === 'string' ? item.html_url : '',
    stars: typeof item.stargazers_count === 'number' ? item.stargazers_count : 0,
    forks: typeof item.forks_count === 'number' ? item.forks_count : 0,
    language: typeof item.language === 'string' ? item.language : '',
    topics: Array.isArray(item.topics) ? item.topics.filter((topic) => typeof topic === 'string').slice(0, 4) : [],
    createdAt: typeof item.created_at === 'string' ? item.created_at : '',
    pushedAt: typeof item.pushed_at === 'string' ? item.pushed_at : '',
    avatarUrl: typeof owner.avatar_url === 'string' ? owner.avatar_url : '',
    owner: typeof owner.login === 'string' ? owner.login : '',
  }
}

function paginate(items) {
  const list = Array.isArray(items) ? items : []
  const normalized = []
  for (const item of list) {
    const repo = normalizeRepo(item)
    if (repo !== null) normalized.push(repo)
  }
  return normalized
}

function shuffle(list) {
  const copy = list.slice()
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    const current = copy[index]
    copy[index] = copy[swap]
    copy[swap] = current
  }
  return copy
}

/** Clamp a request field to an integer range, falling back for anything unusable. */
function clampInt(value, min, max, fallback) {
  const number = typeof value === 'number' ? value : Number.parseInt(String(value ?? ''), 10)
  if (!Number.isFinite(number)) return fallback
  return Math.min(max, Math.max(min, Math.trunc(number)))
}

/** Normalize and encode one repository path; rejects traversal and empty segments. */
function cleanPath(value) {
  const path = typeof value === 'string' ? value.replace(/^\/+|\/+$/g, '') : ''
  if (path === '') return ''
  const segments = path.split('/')
  if (segments.some((segment) => segment === '' || segment === '.' || segment === '..')) {
    throw new ApiError('bad-request', 'The path is not valid.', 400)
  }
  return segments.map((segment) => encodeURIComponent(segment)).join('/')
}

/** `YYYY-MM-DD` for a day offset from now, in UTC as GitHub's search grammar expects. */
function isoDateDaysAgo(days) {
  const date = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  return date.toISOString().slice(0, 10)
}

function tokenFromRecord(record) {
  if (record === undefined || record === null || record.kind !== 'grant') return undefined
  const payload = record.payload
  if (payload === null || typeof payload !== 'object') return undefined
  const token = payload.token
  return typeof token === 'string' && token.trim() !== '' ? token.trim() : undefined
}

function profileFromPayload(payload) {
  const count = (value) => (typeof value === 'number' ? value : undefined)
  const text = (value) => (typeof value === 'string' ? value : '')
  return {
    login: text(payload.login),
    name: text(payload.name),
    avatarUrl: text(payload.avatarUrl),
    htmlUrl: text(payload.htmlUrl),
    bio: text(payload.bio),
    company: text(payload.company),
    location: text(payload.location),
    blog: text(payload.blog),
    createdAt: text(payload.createdAt),
    publicRepos: count(payload.publicRepos),
    followers: count(payload.followers),
    following: count(payload.following),
  }
}

/**
 * Register the GitHub proxy route for the lifetime of this plugin row.
 * @param {import('@deepseek-ai/cordis').Context} ctx - Host plugin context.
 */
export function apply(ctx) {
  /** Per-row caches: recommendation pages, search answers, repository details, and the current profile. */
  const cache = {
    pages: new Map(),
    searches: new Map(),
    repos: new Map(),
    listings: new Map(),
    files: new Map(),
    commits: new Map(),
    branches: new Map(),
    issues: new Map(),
    profile: undefined,
    lastFetchAt: 0,
  }

  const credentialsOf = () => {
    const service = ctx.get('credentials')
    return service === undefined ? undefined : service
  }

  const readRecord = async () => {
    const credentials = credentialsOf()
    if (credentials === undefined) return undefined
    try {
      const current = await credentials.readRecord(RECORD_KEY)
      if (current !== undefined) return current
      // A sign-in saved before the rename still answers until the migration below finishes.
      return await credentials.readRecord(LEGACY_RECORD_KEY)
    } catch (error) {
      ctx.logger?.warn?.('dsh-github-tool: reading the stored credential failed', error)
      return undefined
    }
  }

  // Keep a sign-in created under the previous bundle name.
  void (async () => {
    const credentials = credentialsOf()
    if (credentials === undefined) return
    try {
      const current = await credentials.readRecord(RECORD_KEY)
      if (current !== undefined) return
      const legacy = await credentials.readRecord(LEGACY_RECORD_KEY)
      if (legacy === undefined) return
      await credentials.modifyRecord(RECORD_KEY, async () => legacy)
      await credentials.deleteRecord(LEGACY_RECORD_KEY)
    } catch (error) {
      ctx.logger?.warn?.('dsh-github-tool: credential migration failed', error)
    }
  })()

  const readToken = async () => tokenFromRecord(await readRecord())

  const requireCredentials = () => {
    const credentials = credentialsOf()
    if (credentials === undefined) {
      throw new ApiError(
        'credentials-unavailable',
        'This profile has no credential store, so the token cannot be saved.',
        503,
      )
    }
    return credentials
  }

  const githubFetch = async (path, token, signal) => {
    const headers = {
      accept: 'application/vnd.github+json',
      'x-github-api-version': API_VERSION,
      'user-agent': USER_AGENT,
    }
    if (token !== undefined) headers.authorization = `Bearer ${token}`
    let response
    try {
      response = await fetch(`${API_ORIGIN}${path}`, {
        headers,
        signal: signal ?? AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    } catch (error) {
      if (error !== null && typeof error === 'object' && error.name === 'AbortError') {
        throw new ApiError('timeout', 'GitHub did not answer in time.', 504)
      }
      throw new ApiError('network', 'GitHub could not be reached from this machine.', 502)
    }
    let data
    try {
      data = await response.json()
    } catch {
      data = undefined
    }
    if (!response.ok) {
      if (response.status === 401) {
        throw new ApiError('invalid-token', 'GitHub rejected the access token.', 401)
      }
      if (response.status === 403 || response.status === 429) {
        const remaining = response.headers.get('x-ratelimit-remaining')
        const reset = Number(response.headers.get('x-ratelimit-reset') ?? '0')
        if (remaining === '0' || response.status === 429) {
          throw new ApiError('rate-limited', 'The GitHub API rate limit is exhausted.', 429, {
            resetAt: Number.isFinite(reset) && reset > 0 ? reset * 1000 : undefined,
          })
        }
      }
      const message =
        data !== undefined && typeof data.message === 'string' && data.message !== ''
          ? data.message
          : `GitHub responded with HTTP ${response.status}.`
      throw new ApiError('github-error', message, response.status)
    }
    const remaining = Number(response.headers.get('x-ratelimit-remaining') ?? '')
    const reset = Number(response.headers.get('x-ratelimit-reset') ?? '')
    return {
      data,
      rate: {
        remaining: Number.isFinite(remaining) ? remaining : undefined,
        resetAt: Number.isFinite(reset) && reset > 0 ? reset * 1000 : undefined,
      },
    }
  }

  /** The newest unexpired recommendation page, if one exists. */
  const freshestPage = () => {
    const now = Date.now()
    let best
    for (const page of cache.pages.values()) {
      if (now - page.at > CACHE_TTL_MS) continue
      if (best === undefined || page.at > best.at) best = page
    }
    return best
  }

  /**
   * One recommendation page. A refresh prefers a page this process has not
   * fetched yet, then a page still inside the cache window, and only fetches
   * when every page is stale — so repeated refreshes stay inside GitHub's
   * anonymous search quota while still cycling through different batches.
   */
  const recommendationPage = async (force) => {
    const now = Date.now()
    if (force !== true) {
      const cached = freshestPage()
      if (cached !== undefined) return { entry: cached, fetched: false }
    }
    const uncached = []
    const fresh = []
    for (let candidate = 1; candidate <= RECOMMEND_PAGES; candidate += 1) {
      const entry = cache.pages.get(candidate)
      if (entry === undefined || now - entry.at >= CACHE_TTL_MS) uncached.push(candidate)
      else fresh.push(candidate)
    }
    let page
    let fetchIt
    if (uncached.length > 0) {
      page = uncached[Math.min(uncached.length - 1, Math.floor(Math.random() ** 2 * uncached.length))]
      fetchIt = true
    } else if (fresh.length > 0) {
      page = fresh[Math.floor(Math.random() * fresh.length)]
      fetchIt = false
    } else {
      page = 1 + Math.floor(Math.random() ** 2 * RECOMMEND_PAGES)
      fetchIt = true
    }
    if (!fetchIt) {
      const entry = cache.pages.get(page)
      if (entry !== undefined) return { entry, fetched: false }
    }
    const token = await readToken()
    const query = encodeURIComponent(`created:>${isoDateDaysAgo(CREATED_WINDOW_DAYS)} is:public`)
    const { data, rate } = await githubFetch(
      `/search/repositories?q=${query}&sort=stars&order=desc&per_page=${RECOMMEND_PAGE_SIZE}&page=${page}`,
      token,
    )
    cache.lastFetchAt = now
    const entry = {
      at: now,
      page,
      total: typeof data.total_count === 'number' ? data.total_count : 0,
      items: paginate(data.items),
      rate,
    }
    cache.pages.set(page, entry)
    return { entry, fetched: true }
  }

  const methods = {
    /** Report whether a token is stored, with the profile cached on the record. */
    async state() {
      const record = await readRecord()
      const token = tokenFromRecord(record)
      if (token === undefined) return { signedIn: false }
      return {
        signedIn: true,
        profile: profileFromPayload(record.payload),
        signedInAt: typeof record.payload.signedInAt === 'string' ? record.payload.signedInAt : '',
      }
    },

    /** Validate a personal access token, then keep it as the account record. */
    async signIn(payload) {
      const token = typeof payload.token === 'string' ? payload.token.trim() : ''
      if (token === '') throw new ApiError('token-required', 'Enter a personal access token first.', 400)
      if (/\s/.test(token) || token.length < 20) {
        throw new ApiError('token-malformed', 'That does not look like a GitHub access token.', 400)
      }
      const { data } = await githubFetch('/user', token)
      const profile = {
        login: typeof data.login === 'string' ? data.login : '',
        name: typeof data.name === 'string' ? data.name : '',
        avatarUrl: typeof data.avatar_url === 'string' ? data.avatar_url : '',
        htmlUrl: typeof data.html_url === 'string' ? data.html_url : '',
        bio: typeof data.bio === 'string' ? data.bio : '',
        company: typeof data.company === 'string' ? data.company : '',
        location: typeof data.location === 'string' ? data.location : '',
        blog: typeof data.blog === 'string' ? data.blog : '',
        createdAt: typeof data.created_at === 'string' ? data.created_at : '',
        publicRepos: typeof data.public_repos === 'number' ? data.public_repos : 0,
        followers: typeof data.followers === 'number' ? data.followers : 0,
        following: typeof data.following === 'number' ? data.following : 0,
      }
      if (profile.login === '') throw new ApiError('invalid-token', 'GitHub returned no account for this token.', 401)
      const credentials = requireCredentials()
      await credentials.modifyRecord(RECORD_KEY, async () => ({
        kind: 'grant',
        payload: { token, ...profile, signedInAt: new Date().toISOString() },
      }))
      cache.profile = { at: Date.now(), value: { token, profile } }
      // Recommendation and search pages fetched for another account must not survive the switch.
      cache.pages.clear()
      cache.searches.clear()
      cache.lastFetchAt = 0
      return { signedIn: true, profile }
    },

    /** Remove the stored token. */
    async signOut() {
      const credentials = credentialsOf()
      if (credentials !== undefined) {
        await credentials.deleteRecord(RECORD_KEY)
        await credentials.deleteRecord(LEGACY_RECORD_KEY)
      }
      cache.pages.clear()
      cache.searches.clear()
      cache.profile = undefined
      cache.lastFetchAt = 0
      return { signedIn: false }
    },

    /** Re-read the signed-in account so the profile card carries its bio, company, and join date. */
    async refreshProfile() {
      const token = await readToken()
      if (token === undefined) return { signedIn: false }
      const now = Date.now()
      if (
        cache.profile !== undefined &&
        now - cache.profile.at < PROFILE_TTL_MS &&
        cache.profile.value.token === token
      ) {
        return { signedIn: true, profile: cache.profile.value.profile }
      }
      const { data } = await githubFetch('/user', token)
      const profile = {
        login: typeof data.login === 'string' ? data.login : '',
        name: typeof data.name === 'string' ? data.name : '',
        avatarUrl: typeof data.avatar_url === 'string' ? data.avatar_url : '',
        htmlUrl: typeof data.html_url === 'string' ? data.html_url : '',
        bio: typeof data.bio === 'string' ? data.bio : '',
        company: typeof data.company === 'string' ? data.company : '',
        location: typeof data.location === 'string' ? data.location : '',
        blog: typeof data.blog === 'string' ? data.blog : '',
        createdAt: typeof data.created_at === 'string' ? data.created_at : '',
        publicRepos: typeof data.public_repos === 'number' ? data.public_repos : 0,
        followers: typeof data.followers === 'number' ? data.followers : 0,
        following: typeof data.following === 'number' ? data.following : 0,
      }
      if (profile.login === '') throw new ApiError('invalid-token', 'GitHub returned no account for this token.', 401)
      const credentials = credentialsOf()
      if (credentials !== undefined) {
        await credentials.modifyRecord(RECORD_KEY, async (current) => {
          const payload =
            current !== undefined &&
            current !== null &&
            current.kind === 'grant' &&
            current.payload !== null &&
            typeof current.payload === 'object'
              ? current.payload
              : {}
          return {
            kind: 'grant',
            payload: {
              ...payload,
              ...profile,
              token: typeof payload.token === 'string' ? payload.token : token,
              signedInAt: typeof payload.signedInAt === 'string' ? payload.signedInAt : new Date().toISOString(),
            },
          }
        })
      }
      cache.profile = { at: now, value: { token, profile } }
      return { signedIn: true, profile }
    },

    /** Random page of repositories created in the last week, ordered by stars. */
    async recommend(payload) {
      const { entry, fetched } = await recommendationPage(payload.force === true)
      return {
        items: shuffle(entry.items).slice(0, RECOMMEND_COUNT),
        total: entry.total,
        fetchedAt: new Date(entry.at).toISOString(),
        windowDays: CREATED_WINDOW_DAYS,
        rate: entry.rate,
        cached: fetched !== true,
      }
    },

    /** Search repositories with GitHub's own query grammar, one page at a time. */
    async search(payload) {
      const query = typeof payload.q === 'string' ? payload.q.trim() : ''
      if (query === '') throw new ApiError('query-required', 'Type something to search for.', 400)
      const page = clampInt(payload.page, 1, 100, 1)
      const perPage = clampInt(payload.perPage, 1, 50, SEARCH_PAGE_SIZE_DEFAULT)
      const key = `${perPage}|${page}|${query.toLowerCase()}`
      const now = Date.now()
      const known = cache.searches.get(key)
      if (known !== undefined && now - known.at < CACHE_TTL_MS) {
        return { ...known.value, cached: true }
      }
      const token = await readToken()
      const { data, rate } = await githubFetch(
        `/search/repositories?q=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`,
        token,
      )
      const total = typeof data.total_count === 'number' ? data.total_count : 0
      // GitHub's search surfaces at most the first 1000 matches.
      const pageCount = Math.max(1, Math.min(100, Math.ceil(total / perPage)))
      const value = {
        query,
        total,
        items: paginate(data.items),
        page: Math.min(page, pageCount),
        perPage,
        pageCount,
        capped: total > 1000,
        fetchedAt: new Date().toISOString(),
        rate,
      }
      cache.searches.set(key, { at: now, value })
      return value
    },

    /** Star or unstar one repository for the signed-in account. */
    async star(payload) {
      const owner = typeof payload.owner === 'string' ? payload.owner.trim() : ''
      const name = typeof payload.name === 'string' ? payload.name.trim() : ''
      if (!/^[A-Za-z0-9_.-]+$/.test(owner) || !/^[A-Za-z0-9_.-]+$/.test(name)) {
        throw new ApiError('bad-request', 'A repository owner and name are required.', 400)
      }
      const starred = payload.starred === true
      const token = await readToken()
      if (token === undefined) throw new ApiError('not-signed-in', 'Sign in to star repositories.', 401)
      const init = {
        method: starred ? 'PUT' : 'DELETE',
        headers: {
          accept: 'application/vnd.github+json',
          'x-github-api-version': API_VERSION,
          'user-agent': USER_AGENT,
          authorization: `Bearer ${token}`,
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      }
      // GitHub requires an explicit zero-length body for the PUT variant.
      if (starred) init.body = ''
      let response
      try {
        response = await fetch(`${API_ORIGIN}/user/starred/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`, init)
      } catch {
        throw new ApiError('network', 'GitHub could not be reached from this machine.', 502)
      }
      if (response.status === 204) return { owner, name, starred }
      if (response.status === 401) throw new ApiError('invalid-token', 'GitHub rejected the access token.', 401)
      if (response.status === 403) {
        // Surface what GitHub actually said, so the panel can explain the missing grant.
        let detail = ''
        try {
          const body = await response.json()
          if (body !== null && typeof body === 'object' && typeof body.message === 'string') detail = body.message
        } catch {
          detail = ''
        }
        const acceptedPermissions = response.headers.get('x-accepted-github-permissions') ?? ''
        const acceptedScopes = response.headers.get('x-accepted-oauth-scopes') ?? ''
        const tokenScopes = response.headers.get('x-oauth-scopes') ?? ''
        throw new ApiError(
          'star-forbidden',
          'GitHub refused to star this repository for this token.',
          403,
          {
            detail: detail === '' ? undefined : detail,
            acceptedPermissions: acceptedPermissions === '' ? undefined : acceptedPermissions,
            acceptedScopes: acceptedScopes === '' ? undefined : acceptedScopes,
            tokenScopes: tokenScopes === '' ? undefined : tokenScopes,
            tokenKind: token.startsWith('github_pat_') ? 'fine-grained' : 'classic',
          },
        )
      }
      if (response.status === 404) {
        throw new ApiError('repo-not-found', 'That repository is not available to this account.', 404)
      }
      throw new ApiError('github-error', `GitHub responded with HTTP ${response.status}.`, response.status)
    },

    /** One repository's metadata plus a plain-text README preview. */
    async repo(payload) {
      const owner = typeof payload.owner === 'string' ? payload.owner.trim() : ''
      const name = typeof payload.name === 'string' ? payload.name.trim() : ''
      if (!/^[A-Za-z0-9_.-]+$/.test(owner) || !/^[A-Za-z0-9_.-]+$/.test(name)) {
        throw new ApiError('bad-request', 'A repository owner and name are required.', 400)
      }
      const key = `${owner}/${name}`.toLowerCase()
      const now = Date.now()
      const known = cache.repos.get(key)
      if (known !== undefined && now - known.at < CACHE_TTL_MS) return { ...known.value, cached: true }
      const token = await readToken()
      const encoded = `${encodeURIComponent(owner)}/${encodeURIComponent(name)}`
      const { data } = await githubFetch(`/repos/${encoded}`, token)
      const license =
        data.license !== null && typeof data.license === 'object'
          ? typeof data.license.spdx_id === 'string' && data.license.spdx_id !== 'NOASSERTION'
            ? data.license.spdx_id
            : typeof data.license.name === 'string'
              ? data.license.name
              : ''
          : ''
      const detail = {
        id: typeof data.id === 'number' ? data.id : 0,
        name: typeof data.name === 'string' ? data.name : name,
        fullName: typeof data.full_name === 'string' ? data.full_name : `${owner}/${name}`,
        owner: data.owner !== undefined && typeof data.owner.login === 'string' ? data.owner.login : owner,
        avatarUrl: data.owner !== undefined && typeof data.owner.avatar_url === 'string' ? data.owner.avatar_url : '',
        description: typeof data.description === 'string' ? data.description : '',
        url: typeof data.html_url === 'string' ? data.html_url : `https://github.com/${owner}/${name}`,
        homepage: typeof data.homepage === 'string' ? data.homepage : '',
        stars: typeof data.stargazers_count === 'number' ? data.stargazers_count : 0,
        forks: typeof data.forks_count === 'number' ? data.forks_count : 0,
        watchers: typeof data.subscribers_count === 'number' ? data.subscribers_count : 0,
        openIssues: typeof data.open_issues_count === 'number' ? data.open_issues_count : 0,
        language: typeof data.language === 'string' ? data.language : '',
        topics: Array.isArray(data.topics)
          ? data.topics.filter((topic) => typeof topic === 'string').slice(0, 8)
          : [],
        license,
        defaultBranch: typeof data.default_branch === 'string' ? data.default_branch : '',
        createdAt: typeof data.created_at === 'string' ? data.created_at : '',
        pushedAt: typeof data.pushed_at === 'string' ? data.pushed_at : '',
        archived: data.archived === true,
        isFork: data.fork === true,
        readme: null,
        languages: [],
        contributors: [],
      }
      const [languagesResult, contributorsResult] = await Promise.allSettled([
        githubFetch(`/repos/${encoded}/languages`, token),
        githubFetch(`/repos/${encoded}/contributors?per_page=6`, token),
      ])
      if (languagesResult.status === 'fulfilled') {
        const payload = languagesResult.value.data
        if (payload !== null && typeof payload === 'object' && !Array.isArray(payload)) {
          const entries = Object.entries(payload)
            .map(([languageName, bytes]) => ({ name: languageName, bytes: Number(bytes) || 0 }))
            .filter((entry) => entry.bytes > 0)
            .sort((left, right) => right.bytes - left.bytes)
            .slice(0, 6)
          const total = entries.reduce((sum, entry) => sum + entry.bytes, 0)
          detail.languages = entries.map((entry) => ({
            name: entry.name,
            bytes: entry.bytes,
            percent: total > 0 ? (entry.bytes / total) * 100 : 0,
          }))
        }
      }
      if (contributorsResult.status === 'fulfilled') {
        const payload = contributorsResult.value.data
        if (Array.isArray(payload)) {
          detail.contributors = payload
            .filter((item) => item !== null && typeof item.login === 'string')
            .slice(0, 6)
            .map((item) => ({
              login: item.login,
              avatarUrl: typeof item.avatar_url === 'string' ? item.avatar_url : '',
              url: typeof item.html_url === 'string' ? item.html_url : '',
            }))
        }
      }
      try {
        const { data: readmeData } = await githubFetch(`/repos/${encoded}/readme`, token)
        const text =
          typeof readmeData.content === 'string' ? Buffer.from(readmeData.content, 'base64').toString('utf8') : ''
        if (text.trim() !== '') {
          detail.readme = {
            name: typeof readmeData.name === 'string' ? readmeData.name : 'README',
            text: text.slice(0, 12000),
            truncated: text.length > 12000,
          }
        }
      } catch {
        // A repository without a README is a normal state, not a page failure.
      }
      cache.repos.set(key, { at: now, value: detail })
      return detail
    },

    /** List one directory of the repository, directories first. */
    async ls(payload) {
      const owner = typeof payload.owner === 'string' ? payload.owner.trim() : ''
      const name = typeof payload.name === 'string' ? payload.name.trim() : ''
      if (!/^[A-Za-z0-9_.-]+$/.test(owner) || !/^[A-Za-z0-9_.-]+$/.test(name)) {
        throw new ApiError('bad-request', 'A repository owner and name are required.', 400)
      }
      const displayPath = typeof payload.path === 'string' ? payload.path.replace(/^\/+|\/+$/g, '') : ''
      const encodedPath = cleanPath(displayPath)
      const ref = typeof payload.ref === 'string' ? payload.ref.trim() : ''
      const key = `${owner}/${name}@${ref}@${displayPath}`.toLowerCase()
      const now = Date.now()
      const known = cache.listings.get(key)
      if (known !== undefined && now - known.at < CACHE_TTL_MS) return { ...known.value, cached: true }
      const token = await readToken()
      const encoded = `${encodeURIComponent(owner)}/${encodeURIComponent(name)}`
      const url = `/repos/${encoded}/contents${encodedPath === '' ? '' : `/${encodedPath}`}${
        ref === '' ? '' : `?ref=${encodeURIComponent(ref)}`
      }`
      const { data } = await githubFetch(url, token)
      if (!Array.isArray(data)) throw new ApiError('not-a-directory', 'That path is a file.', 400)
      const entries = data
        .filter((item) => item !== null && typeof item.name === 'string')
        .map((item) => ({
          name: item.name,
          path: typeof item.path === 'string' ? item.path : displayPath === '' ? item.name : `${displayPath}/${item.name}`,
          type: item.type === 'dir' ? 'dir' : 'file',
          size: typeof item.size === 'number' ? item.size : 0,
        }))
        .sort((left, right) => {
          if (left.type !== right.type) return left.type === 'dir' ? -1 : 1
          return left.name.localeCompare(right.name)
        })
      const value = { path: displayPath, entries }
      cache.listings.set(key, { at: now, value })
      return value
    },

    /** Read one text file of the repository. */
    async read(payload) {
      const owner = typeof payload.owner === 'string' ? payload.owner.trim() : ''
      const name = typeof payload.name === 'string' ? payload.name.trim() : ''
      if (!/^[A-Za-z0-9_.-]+$/.test(owner) || !/^[A-Za-z0-9_.-]+$/.test(name)) {
        throw new ApiError('bad-request', 'A repository owner and name are required.', 400)
      }
      const displayPath = typeof payload.path === 'string' ? payload.path.replace(/^\/+|\/+$/g, '') : ''
      if (displayPath === '') throw new ApiError('bad-request', 'A file path is required.', 400)
      const encodedPath = cleanPath(displayPath)
      const ref = typeof payload.ref === 'string' ? payload.ref.trim() : ''
      const key = `${owner}/${name}@${ref}@${displayPath}`.toLowerCase()
      const now = Date.now()
      const known = cache.files.get(key)
      if (known !== undefined && now - known.at < CACHE_TTL_MS) return { ...known.value, cached: true }
      const token = await readToken()
      const encoded = `${encodeURIComponent(owner)}/${encodeURIComponent(name)}`
      const { data } = await githubFetch(
        `/repos/${encoded}/contents/${encodedPath}${ref === '' ? '' : `?ref=${encodeURIComponent(ref)}`}`,
        token,
      )
      if (Array.isArray(data)) throw new ApiError('not-a-file', 'That path is a directory.', 400)
      let text = ''
      if (typeof data.content === 'string' && data.content !== '') {
        text = Buffer.from(data.content, 'base64').toString('utf8')
      } else if (typeof data.download_url === 'string' && data.download_url !== '') {
        const raw = await fetch(data.download_url, {
          headers: token === undefined ? {} : { authorization: `Bearer ${token}` },
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        })
        if (!raw.ok) throw new ApiError('too-large', 'This file is too large to preview.', 413)
        text = await raw.text()
      }
      const limit = 400000
      const binary = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(text)
      const truncated = text.length > limit
      if (truncated) text = text.slice(0, limit)
      const value = {
        path: typeof data.path === 'string' ? data.path : displayPath,
        name: typeof data.name === 'string' ? data.name : displayPath.split('/').pop(),
        size: typeof data.size === 'number' ? data.size : text.length,
        text: binary ? '' : text,
        binary,
        truncated,
      }
      cache.files.set(key, { at: now, value })
      return value
    },

    /** The newest commit on one branch, for the file table's header row. */
    async commit(payload) {
      const owner = typeof payload.owner === 'string' ? payload.owner.trim() : ''
      const name = typeof payload.name === 'string' ? payload.name.trim() : ''
      if (!/^[A-Za-z0-9_.-]+$/.test(owner) || !/^[A-Za-z0-9_.-]+$/.test(name)) {
        throw new ApiError('bad-request', 'A repository owner and name are required.', 400)
      }
      const ref = typeof payload.ref === 'string' ? payload.ref.trim() : ''
      const key = `${owner}/${name}@${ref}`.toLowerCase()
      const now = Date.now()
      const known = cache.commits.get(key)
      if (known !== undefined && now - known.at < CACHE_TTL_MS) return known.value
      const token = await readToken()
      const encoded = `${encodeURIComponent(owner)}/${encodeURIComponent(name)}`
      const { data } = await githubFetch(
        `/repos/${encoded}/commits?per_page=1${ref === '' ? '' : `&sha=${encodeURIComponent(ref)}`}`,
        token,
      )
      const first = Array.isArray(data) ? data[0] : undefined
      let value = null
      if (first !== undefined && first !== null) {
        const author = first.author !== undefined && first.author !== null ? first.author : {}
        const commit = first.commit !== undefined && first.commit !== null ? first.commit : {}
        value = {
          sha: typeof first.sha === 'string' ? first.sha : '',
          message: typeof commit.message === 'string' ? commit.message.split('\n')[0] : '',
          author:
            typeof author.login === 'string'
              ? author.login
              : commit.author !== undefined && typeof commit.author.name === 'string'
                ? commit.author.name
                : '',
          avatarUrl: typeof author.avatar_url === 'string' ? author.avatar_url : '',
          date:
            commit.author !== undefined && typeof commit.author.date === 'string' ? commit.author.date : '',
          url: typeof first.html_url === 'string' ? first.html_url : '',
        }
      }
      cache.commits.set(key, { at: now, value })
      return value
    },

    /** Branch names for the branch switcher. */
    async branches(payload) {
      const owner = typeof payload.owner === 'string' ? payload.owner.trim() : ''
      const name = typeof payload.name === 'string' ? payload.name.trim() : ''
      if (!/^[A-Za-z0-9_.-]+$/.test(owner) || !/^[A-Za-z0-9_.-]+$/.test(name)) {
        throw new ApiError('bad-request', 'A repository owner and name are required.', 400)
      }
      const key = `${owner}/${name}`.toLowerCase()
      const now = Date.now()
      const known = cache.branches.get(key)
      if (known !== undefined && now - known.at < CACHE_TTL_MS) return { ...known.value, cached: true }
      const token = await readToken()
      const encoded = `${encodeURIComponent(owner)}/${encodeURIComponent(name)}`
      const { data } = await githubFetch(`/repos/${encoded}/branches?per_page=100`, token)
      const branches = Array.isArray(data)
        ? data
            .filter((item) => item !== null && typeof item.name === 'string')
            .map((item) => ({
              name: item.name,
              sha: item.commit !== undefined && typeof item.commit.sha === 'string' ? item.commit.sha : '',
            }))
        : []
      const value = { branches }
      cache.branches.set(key, { at: now, value })
      return value
    },

    /** The repository's open issues (pull requests excluded). */
    async issues(payload) {
      const owner = typeof payload.owner === 'string' ? payload.owner.trim() : ''
      const name = typeof payload.name === 'string' ? payload.name.trim() : ''
      if (!/^[A-Za-z0-9_.-]+$/.test(owner) || !/^[A-Za-z0-9_.-]+$/.test(name)) {
        throw new ApiError('bad-request', 'A repository owner and name are required.', 400)
      }
      const state = payload.state === 'closed' ? 'closed' : 'open'
      const key = `${owner}/${name}@${state}`.toLowerCase()
      const now = Date.now()
      const known = cache.issues.get(key)
      if (known !== undefined && now - known.at < CACHE_TTL_MS) return { ...known.value, cached: true }
      const token = await readToken()
      const encoded = `${encodeURIComponent(owner)}/${encodeURIComponent(name)}`
      const { data } = await githubFetch(
        `/repos/${encoded}/issues?state=${state}&per_page=30&sort=created&direction=desc`,
        token,
      )
      const issues = Array.isArray(data)
        ? data
            .filter((item) => item !== null && item.pull_request === undefined)
            .map((item) => {
              const user = item.user !== undefined && item.user !== null ? item.user : {}
              return {
                number: typeof item.number === 'number' ? item.number : 0,
                title: typeof item.title === 'string' ? item.title : '',
                url: typeof item.html_url === 'string' ? item.html_url : '',
                state: typeof item.state === 'string' ? item.state : state,
                author: typeof user.login === 'string' ? user.login : '',
                avatarUrl: typeof user.avatar_url === 'string' ? user.avatar_url : '',
                comments: typeof item.comments === 'number' ? item.comments : 0,
                createdAt: typeof item.created_at === 'string' ? item.created_at : '',
                labels: Array.isArray(item.labels)
                  ? item.labels
                      .filter((label) => label !== null && typeof label.name === 'string')
                      .slice(0, 4)
                      .map((label) => ({
                        name: label.name,
                        color: typeof label.color === 'string' ? label.color : '8b949e',
                      }))
                  : [],
              }
            })
        : []
      const value = { state, issues }
      cache.issues.set(key, { at: now, value })
      return value
    },
  }

  ctx.effect(
    () =>
      ctx.webServer.register({
        kind: 'prefix',
        path: ROUTE_PREFIX,
        handler: async (req, res) => {
          const rejection = ctx.connection.requestRejection(req)
          if (rejection !== undefined) {
            writeFailure(res, new ApiError('forbidden', 'Only the DeepSeek Harness window may call this route.', rejection))
            return
          }
          if (req.method !== 'POST') {
            writeFailure(res, new ApiError('method-error', 'This route accepts POST only.', 405))
            return
          }
          const contentType = String(req.headers['content-type'] ?? '')
          if (!contentType.toLowerCase().startsWith('application/json')) {
            writeFailure(res, new ApiError('method-error', 'Send application/json.', 415))
            return
          }
          const url = new URL(req.url ?? '/', 'http://dsh.internal')
          if (!url.pathname.startsWith(`${ROUTE_PREFIX}/`)) {
            writeFailure(res, new ApiError('not-found', 'Unknown GitHub API method.', 404))
            return
          }
          const method = url.pathname.slice(ROUTE_PREFIX.length + 1)
          if (method.includes('/') || !Object.hasOwn(methods, method)) {
            writeFailure(res, new ApiError('not-found', `Unknown GitHub API method "${method}".`, 404))
            return
          }
          try {
            const payload = await readJsonBody(req)
            const value = await methods[method](payload)
            writeOk(res, value === undefined ? null : value)
          } catch (error) {
            if (!(error instanceof ApiError)) {
              ctx.logger?.warn?.('dsh-github-tool: request failed', error)
            }
            writeFailure(res, error)
          }
        },
      }),
    'dsh-github-tool: /dsh-github-tool/api route',
  )
}
