# GitHub workspace for DeepSeek Harness

A local DSH bundle that adds a GitHub workspace to the left rail, between
**Plugins** and **Automation tasks**: sign in, discover recently popular
repositories, search, browse a repository's files and issues, read its README,
clone it, and star it without leaving the app.

English | [中文](README.zh.md)

## Features

- **Persistent sign-in** with a GitHub personal access token. The token is
  validated against `GET /user` and kept in the DSH credential store
  (`dsh-github-tool/account`); it never reaches the browser.
- **Trending in the last 7 days**: public repositories created in the last week,
  ranked by stars. The pool is the top 200 and each **Refresh** picks 18 at
  random, so the list changes every time.
- **Repository search** with GitHub's own query syntax (`language:rust`,
  `stars:>1000`, `topic:cli`, …), a GitHub-style results page, and pagination
  (10 / 20 / 50 per page, page jump).
- **In-panel repository page**: Code and Issues tabs, branch switcher, green
  **Code** menu with HTTPS/SSH clone URLs, copy, GitHub Desktop, and ZIP
  download, a file table with the latest commit, a line-numbered file view, a
  rendered README, and an About sidebar with stats, contributors, and languages.
- **Star** from the repository page or a card; **Open in GitHub** links are the
  only actions that leave the app.
- **State is preserved** across panel switches: view, repository (tab, branch,
  directory, file, filter), search query/page, and scroll position.
- All GitHub calls go through the Host half (`/dsh-github-tool/api/*`); the
  browser never talks to `api.github.com` and never sees the token.

## Install

The package is `@tristgek/dsh-github-tool` (row id `dsh-github-tool`), with no
dependencies and no build step.

**From GitHub (needs Git)** — in **Plugins → Add plugin** paste:

```
github:TristGek/dsh-github-tool
```

Pin a commit for reproducibility: `github:TristGek/dsh-github-tool#<commit-sha>`.
The installer runs `git ls-remote` first, so `git` must be on `PATH`; an
`https://github.com/…` URL also works.

**From a downloaded directory (no Git)** — download the repository ZIP, unpack
it, and pick that folder in **Plugins → Add plugin**.

## Usage

1. Click the **GitHub** icon in the left rail.
2. Sign in with a personal access token from
   <https://github.com/settings/tokens>.
   - No scope is needed to search public repositories and read public data.
   - To star someone else's public repository use a **classic** token with
     `public_repo` (or `repo` for private repositories). GitHub does not allow
     fine-grained tokens to star repositories you do not own or belong to.
3. Browse **Trending**, press **Refresh**, or search; click a card to open the
   repository page. **Sign out** removes the stored token.

## Limits

- Unauthenticated REST quota is 60 requests/hour and 10 searches/minute; a token
  raises it. Rate-limit errors show a localized message.
- Search exposes at most the first 1000 matches; branches list up to 100 (no
  tags); Issues shows the 30 newest open issues (no pull requests).
- README rendering covers a Markdown subset (no images, tables, or HTML); code
  has no syntax highlighting. Files are text-previewed up to 400,000 characters
  and 5,000 lines; binary files show a notice.

## Development

Test scripts live outside the package in the workspace's `_dev/` directory
(`route-test.mjs`, `state-test.mjs`, `check-bundle.mjs`); they are not shipped.
After editing the runtime files, disable and re-enable the bundle to reload it.

## License

[MIT](LICENSE) © 2026 TristGek
