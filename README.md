# GitHub workspace for DeepSeek Harness

A local DSH bundle that adds a GitHub workspace to the left rail, between
**Plugins** and **Automation tasks**. It covers the everyday loop — sign in,
discover recently popular repositories, search, inspect a repository's files and
code, read its README, browse its issues, and star it — without leaving the app.

English | [中文](README.zh.md)

## Features

### Sign-in that survives restarts

- Sign in with a GitHub personal access token (PAT).
- The token is validated against `GET /user` and stored in this machine's DSH
  credential store as a `grant` record (`dsh-github-tool/account`). It never
  reaches the browser and is never written to configuration files.
- On the next launch the panel reads the stored record and restores the session.
- The profile card also carries name, bio, company, location, website, join
  date, and the repository/follower/following counts. Those fields are refreshed
  from `/user` when the panel opens (five-minute cache).
- Records saved by the previous bundle name (`dsh-github/account`) are migrated
  automatically on activation.

### Trending in the last 7 days

- Public repositories created in the last seven days, ranked by stars.
- The pool is the top 200 repositories; each batch picks **18** of them at
  random, so **Refresh** shows a different mix.
- Refreshes cycle through four cached search pages before reusing one, so a
  session costs at most four search requests per five minutes.

### Repository search

- Uses GitHub's own query syntax: `language:rust`, `stars:>1000`, `topic:cli`,
  `org:vercel`, and so on.
- Results open as their own in-panel page with a back action.
- Pagination: **10** results per page by default (10 / 20 / 50 selectable),
  previous/next, page-number window, and a "go to page" field.
- Search answers are cached per query/page for five minutes.

### Repository page (GitHub-style)

- **Header**: breadcrumb, repository name, `Public` badge, and an explicit
  **Open in GitHub** link.
- **Tabs**: `Code` and `Issues` (with the open-issue count).
- **Branch switcher**: lists up to 100 branches with a filter box; switching a
  branch reloads the file table, the latest commit, and file contents for that
  branch.
- **Code button**: HTTPS/SSH clone URLs with copy-to-clipboard, "Clone using the
  web URL", "Open with GitHub Desktop", and "Download ZIP" for the current
  branch.
- **File table**: the newest commit row (author avatar, message, relative time),
  then folders and files with icons and sizes; a filter box narrows the current
  directory; folders navigate deeper with a breadcrumb.
- **File view**: line-numbered monospace content, size and line count, a back
  action, and the file on the current branch on GitHub.
- **README**: rendered from the repository README (headings, paragraphs, lists,
  fenced code, quotes, links, bold/italic, inline code).
- **About sidebar**: description, homepage, topics, stars/forks/watchers/issues,
  license, default branch, last push, contributors (avatars), and a language
  bar with percentages.
- **Star**: toggle on the repository; the same state is shared by the cards and
  the repository page.
- **Nothing jumps**: the sidebar column and README area are reserved with
  skeleton placeholders from the first frame, so the layout does not reflow when
  the details arrive.

### State that survives leaving the page

Switching to a conversation and coming back resumes exactly where you were:

- the current view (home / search results / repository page);
- the open repository with its tab, branch, directory, open file, filter, and
  scroll offset;
- the search query, page, and page size;
- the scroll offset of each view.

## How data flows

```
browser half  ──POST /dsh-github-tool/api/<method>──▶  Host half  ──▶ api.github.com
      │                                                  │
      └── no token, no direct GitHub access ─────────────┘
```

- Every request goes through one same-origin Host route,
  `/dsh-github-tool/api/*`. The route only answers the authenticated DSH window
  (`ctx.connection.requestRejection`) and accepts `POST` JSON only.
- The Host half holds the token, calls the GitHub REST API, and returns
  normalized JSON; the browser never sees the token or `api.github.com`.
- Requests and caches:

| Area | GitHub endpoints | Cache |
| --- | --- | --- |
| Recommendations | `search/repositories?q=created:>7d is:public&sort=stars` | 4 pages, 5 min |
| Search | `search/repositories?q=…&per_page&page` | per query/page, 5 min |
| Repository | `repos/{owner}/{repo}` + `languages` + `contributors` + `readme` | 5 min |
| Files | `repos/{owner}/{repo}/contents[/{path}]?ref=` | 5 min |
| Latest commit | `repos/{owner}/{repo}/commits?per_page=1&sha=<branch>` | 5 min |
| Branches | `repos/{owner}/{repo}/branches?per_page=100` | 5 min |
| Issues | `repos/{owner}/{repo}/issues?state=open&per_page=30` | 5 min |
| Star | `PUT` / `DELETE /user/starred/{owner}/{repo}` | no cache |
| Profile | `GET /user` | 5 min |

## Install

The bundle is a plain package with no dependencies and no build step.

- **Plugins → Add plugin** and pick the `dsh-github-tool` directory, or
- plugin manager `install_bundle` with the absolute directory.

The package is `@local/dsh-github-tool`; its bundle patch inserts the single row
`dsh-github-tool`. After installation the bundle is enabled and the GitHub
entry appears in the left rail.

## Usage

1. Click the **GitHub** icon in the left rail (or **Open the GitHub workspace**
   on the bundle's page under **Plugins**).
2. **Sign in**: create a personal access token at
   <https://github.com/settings/tokens> and paste it into the form.
   - No scopes are needed to search public repositories and read public data.
   - Add `public_repo` if you want to star public repositories, or `repo` if you
     also need private repositories.
3. Browse **Trending in the last 7 days** and press **Refresh** for another
   batch, or type a query into **Search repositories** and press Enter.
4. Click any repository card to open its page in the panel. Folders navigate,
   files open the code view, the branch switcher and the green **Code** menu
   cover clone and download, and **Star** works from both the card and the page.
5. **Sign out** from the profile card removes the stored token.

## Limits and known behavior

- GitHub's unauthenticated REST quota is 60 requests an hour with 10 searches a
  minute; a token raises it. Rate-limit failures surface as a localized message.
- GitHub search returns at most the first 1000 matches; the pager caps at that
  window and says so when the result set is larger.
- The branch switcher lists up to 100 branches and does not list tags.
- The Issues tab shows the 30 newest open issues and excludes pull requests;
  each issue opens on GitHub.
- README rendering supports a Markdown subset (no images, tables, or HTML), and
  code has no syntax highlighting.
- Files are previewed as text up to 400,000 characters and 5,000 displayed
  lines; binary files show a notice instead of content.
- Starring needs a **classic** token with `public_repo` (or `repo`). GitHub does
  not allow fine-grained tokens to star public repositories you do not own or
  belong to — granting the "Starring" permission does not change that — and the
  panel says so when it detects a fine-grained token.
- Star state is tracked per session; it is not read back from GitHub for every
  card, which keeps the request count low.
- Only explicit links (**Open in GitHub**, the clone menu rows, issue rows, the
  profile links) open the system browser. Clicking a card or a repository row
  stays inside the panel.

## Project layout

```
dsh-github-tool/
├── index.js            Host half: /dsh-github-tool/api proxy, token record, caches
├── client.js           Browser half: slots, views, components, locale dictionaries, CSS
├── cordis.patch.yml    Bundle patch: one row, id/name dsh-github-tool
├── package.json        Bundle manifest and client declaration
├── locale/             Plugin-manager display metadata (en, zh)
├── docs/               Detail document and preview image
├── icon.svg            Octocat-style bundle icon
├── LICENSE             MIT license
├── README.md           This file
└── README.zh.md        Chinese README
```

Host methods exposed over the route: `state`, `refreshProfile`, `signIn`,
`signOut`, `recommend`, `search`, `repo`, `ls`, `read`, `commit`, `branches`,
`issues`, `star`. Every response is `{ok: true, value}` or
`{ok: false, error: {code, message, details}}`.

UI contribution points:

- `sidebar.panellist` entry `github` (order 5, between Plugins and Automation),
- `main` key `github` for the workspace,
- `plugins.detail.actions` entry `dsh-github-tool-open` for the bundle page's
  "Open the GitHub workspace" button.

## Development

The workspace keeps small development scripts outside the bundle in `_dev/`:

- `route-test.mjs` — runs the Host half against a fake context and exercises the
  route against live GitHub (recommendations, search, repository, files,
  branches, issues, error paths);
- `state-test.mjs` — checks the signed-in state payload with a fake credential
  store;
- `check-bundle.mjs` — validates the manifest exports, locale JSON, detail
  documents, artwork, and declared files.

Run them with the DSH Node runtime, for example:

```powershell
$env:ELECTRON_RUN_AS_NODE = '1'
& $env:DSH_NODE_EXECUTABLE "F:\dsh-github-cli\_dev\route-test.mjs"
```

Syntax-check the two runtime files with `node --check`. To load edited code in
the running app, disable and re-enable the bundle (or refresh the window).

## Uninstall

Disable or remove `@local/dsh-github-tool` from **Plugins**. The panel and its
sign-in entry disappear; a stored token stays in the credential store until you
sign out from the panel (removing the bundle does not delete credentials).

## License

[MIT](LICENSE) © 2026 TristGek
