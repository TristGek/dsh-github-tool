window.__ModuleLoader__.load({
  id: '@tristgek/dsh-github-tool',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const { useCallback, useEffect, useMemo, useRef, useState } = React

    /** Locale namespace and the id shared by the sidebar entry and its panel. */
    const NS = 'dsh-github-tool'
    const PANEL_ID = 'github'
    const PACKAGE_NAME = '@tristgek/dsh-github-tool'
    const API_ROUTE = 'dsh-github-tool/api'

    const zh = {
      panel: 'GitHub',
      title: 'GitHub',
      subtitle: '登录 GitHub 账号、发现最近热门的新仓库，或直接搜索 GitHub。',
      'account.loading': '正在检查登录状态…',
      'account.signedOut': '未登录',
      'account.signIn': '登录',
      'account.signOut': '退出',
      'me.label': 'GitHub 账号',
      'me.repos': '仓库',
      'me.followers': '关注者',
      'me.following': '正在关注',
      'profile.edit': '编辑资料',
      'profile.view': '查看 GitHub 主页',
      'profile.repos': '仓库',
      'profile.followers': '关注者',
      'profile.following': '正在关注',
      'profile.joined': '加入于 {year} 年',
      'login.title': '登录 GitHub',
      'login.intro':
        '用个人访问令牌（PAT）登录。令牌只保存在本机的 DSH 凭据库里，只用于本机后台转发到 GitHub 的请求，不会写进配置文件。',
      'login.step1': '打开 GitHub 的令牌页面，新建一个令牌：',
      'login.step2': '只搜索公开仓库时不需要勾选任何权限。Star 他人公开仓库必须使用 Classic token 并勾选 public_repo（需要私有仓库再勾选 repo）；Fine-grained token 受 GitHub 限制，无法 Star 非本人或非本组织的公开仓库。',
      'login.tokenLabel': '访问令牌',
      'login.tokenPlaceholder': '粘贴令牌，例如 ghp_… 或 github_pat_…',
      'login.submit': '登录',
      'login.busy': '登录中…',
      'login.openTokens': '打开令牌页面',
      'login.emptyToken': '请先粘贴访问令牌。',
      'recs.title': '最近 7 天热门仓库',
      'recs.subtitle': '最近一周新建、按 star 数排序的前 200 个公开仓库里，每次刷新随机挑一批。',
      'recs.refresh': '换一批',
      'recs.loading': '正在获取推荐…',
      'recs.empty': '这次没有取到推荐，稍后再试。',
      'recs.cached': '来自缓存',
      'search.title': '搜索仓库',
      'search.placeholder': '搜索 GitHub 仓库，例如 rust async runtime 或 language:go stars:>2000',
      'search.action': '搜索',
      'search.loading': '搜索中…',
      'search.empty': '没有找到匹配的仓库。',
      'search.total': '共 {total} 个结果',
      'search.hint': '支持 GitHub 搜索语法：language:、stars:>、topic:、org: 等。按回车搜索。',
      'results.title': '搜索结果',
      'results.back': '返回',
      'results.query': '关键词：{q}',
      'results.page': '第 {page} / {pages} 页',
      'results.prev': '上一页',
      'results.next': '下一页',
      'results.jump': '跳至',
      'results.jumpUnit': '页',
      'results.go': '前往',
      'results.perPage': '每页',
      'results.perPageUnit': '条',
      'results.pager': '搜索结果分页',
      'results.capped': 'GitHub 搜索最多返回前 1000 条结果。',
      'results.tab': '仓库',
      'star.star': 'Star',
      'star.unstar': '取消 Star',
      'star.needLogin': '请先登录 GitHub 后再 Star 仓库。',
      'star.forbidden': '当前令牌没有 Star 权限：请使用 Classic token 并勾选 public_repo（公开仓库）或 repo（含私有仓库）后重新登录。',
      'star.forbiddenFineGrained': 'GitHub 不允许 Fine-grained token Star 不属于你或你所在组织的公开仓库，加 Starring 权限也无法解决，这是令牌类型的限制。请改用 Classic token 并勾选 public_repo（或 repo）后重新登录。',
      'star.failed': 'Star 操作失败，请稍后重试。',
      'detail.openExternal': '在 GitHub 打开',
      'detail.loading': '正在加载仓库…',
      'detail.retry': '重试',
      'detail.readme': 'README 预览',
      'detail.readmeTruncated': '内容较长，已截断',
      'detail.noReadme': '这个仓库没有可预览的 README。',
      'detail.archived': '已归档',
      'detail.stars': 'Star',
      'detail.forks': 'Fork',
      'detail.watchers': '关注',
      'detail.issues': 'Issue',
      'detail.license': '许可证',
      'detail.branch': '默认分支',
      'detail.updated': '最近推送',
      'repo.codeTab': 'Code',
      'repo.issuesTab': 'Issues',
      'repo.public': 'Public',
      'repo.entryCount': '{n} 项',
      'repo.filter': '筛选文件…',
      'repo.emptyDir': '这个目录是空的。',
      'repo.noMatch': '没有匹配的文件。',
      'repo.loadingFiles': '正在加载文件…',
      'repo.loadingFile': '正在加载文件内容…',
      'repo.backToFiles': '返回文件列表',
      'repo.lines': '{n} 行',
      'repo.binary': '这个文件是二进制内容，无法以文本预览。',
      'repo.about': '关于',
      'repo.contributors': '贡献者',
      'repo.languages': '语言',
      'repo.loadingSide': '正在加载仓库信息…',
      'repo.sideUnavailable': '仓库信息暂时不可用。',
      'repo.switchBranch': '切换分支',
      'repo.filterBranches': '筛选分支…',
      'repo.loadingBranches': '正在加载分支…',
      'repo.noBranch': '没有匹配的分支。',
      'repo.codeButton': 'Code',
      'repo.clone': '克隆',
      'repo.cloneWeb': '使用 Web URL 克隆',
      'repo.cloneDesktop': '使用 GitHub Desktop 打开',
      'repo.cloneUrl': '克隆地址',
      'repo.copy': '复制',
      'repo.copied': '已复制',
      'repo.downloadZip': '下载 ZIP',
      'repo.loadingIssues': '正在加载 Issue…',
      'repo.noIssues': '没有未关闭的 Issue。',
      'repo.allIssues': '在 GitHub 查看全部 Issue',
      'repo.comments': '评论数',
      'repo.noDescription': '暂无简介',
      'repo.forks': 'Fork 数',
      'action.openPanel': '打开 GitHub 工作区',
      'time.justNow': '刚刚',
      'time.minutes': '{n} 分钟前',
      'time.hours': '{n} 小时前',
      'time.days': '{n} 天前',
      'time.months': '{n} 个月前',
      'time.years': '{n} 年前',
      'error.network': '连不上 GitHub 或本机后台服务，请检查网络后重试。',
      'error.rateLimited': 'GitHub 接口额度已用完，请稍后再试。',
      'error.resetAt': '额度预计在 {time} 恢复。',
      'error.invalidToken': '令牌无效或已过期，请重新登录。',
      'error.tokenMalformed': '令牌格式不对，请确认完整复制。',
      'error.github': 'GitHub 拒绝了这次请求，请稍后重试。',
      'error.hostUnreachable': '连不上本机后台服务，插件暂时不可用。',
      'error.signOut': '退出登录失败，请重试。',
      'error.forbidden': '只有 DeepSeek Harness 界面可以调用这个接口。',
      'error.credentialsUnavailable': '当前配置没有凭据库，无法保存令牌。',
      'error.generic': '操作失败，请稍后重试。',
      'foot.source': '数据来自 GitHub REST API。未登录时每小时 60 次、搜索每分钟 10 次；登录后额度更高。',
      'foot.window': '推荐范围：最近 7 天新建、star 最多的前 200 个公开仓库。',
    }

    const en = {
      panel: 'GitHub',
      title: 'GitHub',
      subtitle: 'Sign in to GitHub, browse recently trending repositories, or search GitHub directly.',
      'account.loading': 'Checking sign-in…',
      'account.signedOut': 'Signed out',
      'account.signIn': 'Sign in',
      'account.signOut': 'Sign out',
      'me.label': 'GitHub account',
      'me.repos': 'Repos',
      'me.followers': 'Followers',
      'me.following': 'Following',
      'profile.edit': 'Edit profile',
      'profile.view': 'View GitHub profile',
      'profile.repos': 'Repositories',
      'profile.followers': 'Followers',
      'profile.following': 'Following',
      'profile.joined': 'Joined {year}',
      'login.title': 'Sign in to GitHub',
      'login.intro':
        'Sign in with a personal access token (PAT). It is kept in this machine’s DSH credential store and used only by the local Host when it calls GitHub — never written to configuration files.',
      'login.step1': 'Open GitHub’s token page and create a new token:',
      'login.step2': 'No scopes are needed to search public repositories. Starring someone else’s public repository requires a classic token with public_repo (add repo for private repositories); GitHub does not allow fine-grained tokens to star public repositories you do not own or belong to.',
      'login.tokenLabel': 'Access token',
      'login.tokenPlaceholder': 'Paste a token such as ghp_… or github_pat_…',
      'login.submit': 'Sign in',
      'login.busy': 'Signing in…',
      'login.openTokens': 'Open token page',
      'login.emptyToken': 'Paste an access token first.',
      'recs.title': 'Trending in the last 7 days',
      'recs.subtitle':
        'Public repositories created this week, ranked by stars — each refresh picks a random batch from the top 200.',
      'recs.refresh': 'Refresh',
      'recs.loading': 'Loading recommendations…',
      'recs.empty': 'No recommendations this time. Try again later.',
      'recs.cached': 'from cache',
      'search.title': 'Search repositories',
      'search.placeholder': 'Search GitHub repositories, e.g. rust async runtime or language:go stars:>2000',
      'search.action': 'Search',
      'search.loading': 'Searching…',
      'search.empty': 'No repositories matched.',
      'search.total': '{total} results',
      'search.hint': 'GitHub query syntax works: language:, stars:>, topic:, org:. Press Enter to search.',
      'results.title': 'Search results',
      'results.back': 'Back',
      'results.query': 'Query: {q}',
      'results.page': 'Page {page} of {pages}',
      'results.prev': 'Previous',
      'results.next': 'Next',
      'results.jump': 'Go to',
      'results.jumpUnit': 'page',
      'results.go': 'Go',
      'results.perPage': 'Per page',
      'results.perPageUnit': 'items',
      'results.pager': 'Search result pages',
      'results.capped': 'GitHub search returns at most the first 1000 matches.',
      'results.tab': 'Repositories',
      'star.star': 'Star',
      'star.unstar': 'Unstar',
      'star.needLogin': 'Sign in to GitHub before starring a repository.',
      'star.forbidden': 'This token cannot star repositories. Use a classic token with public_repo (public repositories) or repo (private repositories), then sign in again.',
      'star.forbiddenFineGrained': 'GitHub does not allow fine-grained tokens to star public repositories you do not own or belong to, no matter which permission is granted. Use a classic token with public_repo (or repo) and sign in again.',
      'star.failed': 'The star request failed. Try again later.',
      'detail.openExternal': 'Open in GitHub',
      'detail.loading': 'Loading repository…',
      'detail.retry': 'Retry',
      'detail.readme': 'README preview',
      'detail.readmeTruncated': 'Long README, preview truncated',
      'detail.noReadme': 'This repository has no previewable README.',
      'detail.archived': 'Archived',
      'detail.stars': 'Stars',
      'detail.forks': 'Forks',
      'detail.watchers': 'Watchers',
      'detail.issues': 'Issues',
      'detail.license': 'License',
      'detail.branch': 'Default branch',
      'detail.updated': 'Last pushed',
      'repo.codeTab': 'Code',
      'repo.issuesTab': 'Issues',
      'repo.public': 'Public',
      'repo.entryCount': '{n} items',
      'repo.filter': 'Filter files…',
      'repo.emptyDir': 'This directory is empty.',
      'repo.noMatch': 'No files match.',
      'repo.loadingFiles': 'Loading files…',
      'repo.loadingFile': 'Loading file…',
      'repo.backToFiles': 'Back to files',
      'repo.lines': '{n} lines',
      'repo.binary': 'This file is binary and cannot be previewed as text.',
      'repo.about': 'About',
      'repo.contributors': 'Contributors',
      'repo.languages': 'Languages',
      'repo.loadingSide': 'Loading repository details…',
      'repo.sideUnavailable': 'Repository details are unavailable.',
      'repo.switchBranch': 'Switch branch',
      'repo.filterBranches': 'Filter branches…',
      'repo.loadingBranches': 'Loading branches…',
      'repo.noBranch': 'No branches match.',
      'repo.codeButton': 'Code',
      'repo.clone': 'Clone',
      'repo.cloneWeb': 'Clone using the web URL',
      'repo.cloneDesktop': 'Open with GitHub Desktop',
      'repo.cloneUrl': 'Clone URL',
      'repo.copy': 'Copy',
      'repo.copied': 'Copied',
      'repo.downloadZip': 'Download ZIP',
      'repo.loadingIssues': 'Loading issues…',
      'repo.noIssues': 'No open issues.',
      'repo.allIssues': 'View all issues on GitHub',
      'repo.comments': 'Comments',
      'repo.noDescription': 'No description',
      'repo.forks': 'Forks',
      'action.openPanel': 'Open the GitHub workspace',
      'time.justNow': 'just now',
      'time.minutes': '{n} min ago',
      'time.hours': '{n} h ago',
      'time.days': '{n} d ago',
      'time.months': '{n} mo ago',
      'time.years': '{n} y ago',
      'error.network': 'GitHub or the local Harness service is unreachable. Check the connection and retry.',
      'error.rateLimited': 'The GitHub API rate limit is exhausted. Try again later.',
      'error.resetAt': 'The limit resets around {time}.',
      'error.invalidToken': 'That token is invalid or expired. Sign in again.',
      'error.tokenMalformed': 'That token format looks wrong — copy the whole token.',
      'error.github': 'GitHub refused the request. Try again later.',
      'error.hostUnreachable': 'The local Host service is unreachable, so the panel is unavailable.',
      'error.signOut': 'Sign-out failed. Try again.',
      'error.forbidden': 'Only the DeepSeek Harness window may call this route.',
      'error.credentialsUnavailable': 'This configuration has no credential store, so the token cannot be saved.',
      'error.generic': 'The operation failed. Try again later.',
      'foot.source':
        'Data comes from the GitHub REST API. Unauthenticated access allows 60 requests an hour and 10 searches a minute; signing in raises them.',
      'foot.window': 'Recommendations cover the 200 public repositories created in the last 7 days with the most stars.',
    }

    const ja = {
      panel: 'GitHub',
      title: 'GitHub',
      subtitle: 'GitHub にサインインして、最近の人気リポジトリを眺めたり、GitHub を直接検索したりできます。',
      'account.loading': 'サインイン状態を確認中…',
      'account.signedOut': '未サインイン',
      'account.signIn': 'サインイン',
      'account.signOut': 'サインアウト',
      'me.label': 'GitHub アカウント',
      'me.repos': 'リポジトリ',
      'me.followers': 'フォロワー',
      'me.following': 'フォロー中',
      'profile.edit': 'プロフィールを編集',
      'profile.view': 'GitHub プロフィールを表示',
      'profile.repos': 'リポジトリ',
      'profile.followers': 'フォロワー',
      'profile.following': 'フォロー中',
      'profile.joined': '{year} 年に参加',
      'login.title': 'GitHub にサインイン',
      'login.intro':
        '個人アクセストークン（PAT）でサインインします。トークンはこのマシンの DSH 資格情報ストアにのみ保存され、ローカルの Host が GitHub を呼ぶときだけ使われます。設定ファイルには書き込まれません。',
      'login.step1': 'GitHub のトークンページを開いて新しいトークンを作成します：',
      'login.step2':
        '公開リポジトリの検索だけならスコープは不要です。他人の公開リポジトリに Star するには public_repo を付けた Classic token（プライベートリポジトリなら repo も）が必要です。Fine-grained token は本人または所属組織のものでない公開リポジトリに Star できません。',
      'login.tokenLabel': 'アクセストークン',
      'login.tokenPlaceholder': 'ghp_… や github_pat_… などのトークンを貼り付け',
      'login.submit': 'サインイン',
      'login.busy': 'サインイン中…',
      'login.openTokens': 'トークンページを開く',
      'login.emptyToken': '先にアクセストークンを貼り付けてください。',
      'recs.title': '過去 7 日間の人気リポジトリ',
      'recs.subtitle':
        '今週作成された公開リポジトリを star 数順に並べた上位 200 件から、更新のたびにランダムな一批を選びます。',
      'recs.refresh': '更新',
      'recs.loading': 'おすすめを読み込み中…',
      'recs.empty': '今回はおすすめを取得できませんでした。しばらくしてから再試行してください。',
      'recs.cached': 'キャッシュから',
      'search.title': 'リポジトリを検索',
      'search.placeholder': 'GitHub リポジトリを検索（例：rust async runtime、language:go stars:>2000）',
      'search.action': '検索',
      'search.loading': '検索中…',
      'search.empty': '一致するリポジトリはありません。',
      'search.total': '{total} 件の結果',
      'search.hint': 'GitHub の検索構文が使えます：language:、stars:>、topic:、org: など。Enter で検索します。',
      'results.title': '検索結果',
      'results.back': '戻る',
      'results.query': 'クエリ：{q}',
      'results.page': '{pages} ページ中 {page} ページ',
      'results.prev': '前へ',
      'results.next': '次へ',
      'results.jump': '移動',
      'results.jumpUnit': 'ページ',
      'results.go': '移動',
      'results.perPage': '1 ページあたり',
      'results.perPageUnit': '件',
      'results.pager': '検索結果のページ',
      'results.capped': 'GitHub の検索は最大 1000 件までしか返しません。',
      'results.tab': 'リポジトリ',
      'star.star': 'Star',
      'star.unstar': 'Star を解除',
      'star.needLogin': 'リポジトリに Star する前に GitHub にサインインしてください。',
      'star.forbidden':
        'このトークンには Star 権限がありません。public_repo（公開リポジトリ）または repo（プライベートリポジトリ）を付けた Classic token でサインインし直してください。',
      'star.forbiddenFineGrained':
        'GitHub は Fine-grained token で、本人または所属組織のものでない公開リポジトリに Star することを許可していません。Starring 権限を付けても解決しません。public_repo（または repo）を付けた Classic token に切り替えてサインインし直してください。',
      'star.failed': 'Star に失敗しました。しばらくしてから再試行してください。',
      'detail.openExternal': 'GitHub で開く',
      'detail.loading': 'リポジトリを読み込み中…',
      'detail.retry': '再試行',
      'detail.readme': 'README プレビュー',
      'detail.readmeTruncated': 'README が長いため、プレビューは切り詰められています',
      'detail.noReadme': 'このリポジトリにはプレビューできる README がありません。',
      'detail.archived': 'アーカイブ済み',
      'detail.stars': 'Star',
      'detail.forks': 'Fork',
      'detail.watchers': 'ウォッチ',
      'detail.issues': 'Issue',
      'detail.license': 'ライセンス',
      'detail.branch': 'デフォルトブランチ',
      'detail.updated': '最終プッシュ',
      'repo.codeTab': 'Code',
      'repo.issuesTab': 'Issues',
      'repo.public': 'Public',
      'repo.entryCount': '{n} 件',
      'repo.filter': 'ファイルを絞り込む…',
      'repo.emptyDir': 'このディレクトリは空です。',
      'repo.noMatch': '一致するファイルはありません。',
      'repo.loadingFiles': 'ファイルを読み込み中…',
      'repo.loadingFile': 'ファイルの内容を読み込み中…',
      'repo.backToFiles': 'ファイル一覧に戻る',
      'repo.lines': '{n} 行',
      'repo.binary': 'このファイルはバイナリのため、テキストとしてプレビューできません。',
      'repo.about': '概要',
      'repo.contributors': 'コントリビューター',
      'repo.languages': '言語',
      'repo.loadingSide': 'リポジトリの詳細を読み込み中…',
      'repo.sideUnavailable': 'リポジトリの詳細を取得できません。',
      'repo.switchBranch': 'ブランチを切り替え',
      'repo.filterBranches': 'ブランチを絞り込む…',
      'repo.loadingBranches': 'ブランチを読み込み中…',
      'repo.noBranch': '一致するブランチはありません。',
      'repo.codeButton': 'Code',
      'repo.clone': 'クローン',
      'repo.cloneWeb': 'Web URL でクローン',
      'repo.cloneDesktop': 'GitHub Desktop で開く',
      'repo.cloneUrl': 'クローン URL',
      'repo.copy': 'コピー',
      'repo.copied': 'コピーしました',
      'repo.downloadZip': 'ZIP をダウンロード',
      'repo.loadingIssues': 'Issue を読み込み中…',
      'repo.noIssues': '未クローズの Issue はありません。',
      'repo.allIssues': 'GitHub ですべての Issue を見る',
      'repo.comments': 'コメント',
      'repo.noDescription': '説明なし',
      'repo.forks': 'Fork 数',
      'action.openPanel': 'GitHub ワークスペースを開く',
      'time.justNow': 'たった今',
      'time.minutes': '{n} 分前',
      'time.hours': '{n} 時間前',
      'time.days': '{n} 日前',
      'time.months': '{n} か月前',
      'time.years': '{n} 年前',
      'error.network': 'GitHub またはローカルの Harness サービスに接続できません。接続を確認して再試行してください。',
      'error.rateLimited': 'GitHub API のレート制限に達しました。しばらくしてから再試行してください。',
      'error.resetAt': '制限は {time} 頃にリセットされます。',
      'error.invalidToken': 'トークンが無効か期限切れです。もう一度サインインしてください。',
      'error.tokenMalformed': 'トークンの形式が正しくないようです。全体をコピーしてください。',
      'error.github': 'GitHub がリクエストを拒否しました。しばらくしてから再試行してください。',
      'error.hostUnreachable': 'ローカルの Host サービスに接続できないため、パネルを利用できません。',
      'error.signOut': 'サインアウトに失敗しました。再試行してください。',
      'error.forbidden': 'DeepSeek Harness のウィンドウだけがこのルートを呼び出せます。',
      'error.credentialsUnavailable': 'この構成には資格情報ストアがないため、トークンを保存できません。',
      'error.generic': '操作に失敗しました。しばらくしてから再試行してください。',
      'foot.source':
        'データは GitHub REST API から取得しています。未認証では 1 時間 60 リクエスト、検索は 1 分 10 回までです。サインインすると上限が上がります。',
      'foot.window': 'おすすめの対象は、過去 7 日間に作成された star 数の多い公開リポジトリ上位 200 件です。',
    }

    const es = {
      panel: 'GitHub',
      title: 'GitHub',
      subtitle: 'Inicia sesión en GitHub para descubrir repositorios populares recientes o buscar en GitHub directamente.',
      'account.loading': 'Comprobando la sesión…',
      'account.signedOut': 'Sesión cerrada',
      'account.signIn': 'Iniciar sesión',
      'account.signOut': 'Cerrar sesión',
      'me.label': 'Cuenta de GitHub',
      'me.repos': 'Repos',
      'me.followers': 'Seguidores',
      'me.following': 'Siguiendo',
      'profile.edit': 'Editar perfil',
      'profile.view': 'Ver perfil de GitHub',
      'profile.repos': 'Repositorios',
      'profile.followers': 'Seguidores',
      'profile.following': 'Siguiendo',
      'profile.joined': 'Se unió en {year}',
      'login.title': 'Inicia sesión en GitHub',
      'login.intro':
        'Inicia sesión con un token de acceso personal (PAT). Se guarda solo en el almacén de credenciales de DSH de este equipo y lo usa únicamente el Host local al llamar a GitHub; nunca se escribe en archivos de configuración.',
      'login.step1': 'Abre la página de tokens de GitHub y crea un token nuevo:',
      'login.step2':
        'No hace falta ningún scope para buscar repositorios públicos. Para dar Star a un repositorio público ajeno hace falta un token Classic con public_repo (y repo para repositorios privados); GitHub no permite que los tokens Fine-grained den Star a repositorios públicos que no sean tuyos o de tu organización.',
      'login.tokenLabel': 'Token de acceso',
      'login.tokenPlaceholder': 'Pega un token como ghp_… o github_pat_…',
      'login.submit': 'Iniciar sesión',
      'login.busy': 'Iniciando sesión…',
      'login.openTokens': 'Abrir página de tokens',
      'login.emptyToken': 'Pega primero un token de acceso.',
      'recs.title': 'Tendencias de los últimos 7 días',
      'recs.subtitle':
        'Repositorios públicos creados esta semana, ordenados por stars: cada actualización elige un lote aleatorio entre los 200 primeros.',
      'recs.refresh': 'Actualizar',
      'recs.loading': 'Cargando recomendaciones…',
      'recs.empty': 'Esta vez no hay recomendaciones. Inténtalo más tarde.',
      'recs.cached': 'desde la caché',
      'search.title': 'Buscar repositorios',
      'search.placeholder': 'Busca repositorios de GitHub, p. ej. rust async runtime o language:go stars:>2000',
      'search.action': 'Buscar',
      'search.loading': 'Buscando…',
      'search.empty': 'Ningún repositorio coincide.',
      'search.total': '{total} resultados',
      'search.hint': 'Funciona la sintaxis de GitHub: language:, stars:>, topic:, org:. Pulsa Enter para buscar.',
      'results.title': 'Resultados de la búsqueda',
      'results.back': 'Atrás',
      'results.query': 'Consulta: {q}',
      'results.page': 'Página {page} de {pages}',
      'results.prev': 'Anterior',
      'results.next': 'Siguiente',
      'results.jump': 'Ir a',
      'results.jumpUnit': 'página',
      'results.go': 'Ir',
      'results.perPage': 'Por página',
      'results.perPageUnit': 'elementos',
      'results.pager': 'Páginas de resultados',
      'results.capped': 'La búsqueda de GitHub devuelve como máximo las primeras 1000 coincidencias.',
      'results.tab': 'Repositorios',
      'star.star': 'Star',
      'star.unstar': 'Quitar Star',
      'star.needLogin': 'Inicia sesión en GitHub antes de dar Star a un repositorio.',
      'star.forbidden':
        'Este token no puede dar Star. Usa un token Classic con public_repo (repositorios públicos) o repo (privados) y vuelve a iniciar sesión.',
      'star.forbiddenFineGrained':
        'GitHub no permite que los tokens Fine-grained den Star a repositorios públicos que no sean tuyos o de tu organización, aunque concedas el permiso Starring. Usa un token Classic con public_repo (o repo) y vuelve a iniciar sesión.',
      'star.failed': 'No se pudo dar Star. Inténtalo más tarde.',
      'detail.openExternal': 'Abrir en GitHub',
      'detail.loading': 'Cargando repositorio…',
      'detail.retry': 'Reintentar',
      'detail.readme': 'Vista previa del README',
      'detail.readmeTruncated': 'README largo, vista previa truncada',
      'detail.noReadme': 'Este repositorio no tiene un README que se pueda previsualizar.',
      'detail.archived': 'Archivado',
      'detail.stars': 'Stars',
      'detail.forks': 'Forks',
      'detail.watchers': 'Observadores',
      'detail.issues': 'Issues',
      'detail.license': 'Licencia',
      'detail.branch': 'Rama predeterminada',
      'detail.updated': 'Último push',
      'repo.codeTab': 'Code',
      'repo.issuesTab': 'Issues',
      'repo.public': 'Public',
      'repo.entryCount': '{n} elementos',
      'repo.filter': 'Filtrar archivos…',
      'repo.emptyDir': 'Este directorio está vacío.',
      'repo.noMatch': 'Ningún archivo coincide.',
      'repo.loadingFiles': 'Cargando archivos…',
      'repo.loadingFile': 'Cargando archivo…',
      'repo.backToFiles': 'Volver a los archivos',
      'repo.lines': '{n} líneas',
      'repo.binary': 'Este archivo es binario y no se puede previsualizar como texto.',
      'repo.about': 'Acerca de',
      'repo.contributors': 'Colaboradores',
      'repo.languages': 'Lenguajes',
      'repo.loadingSide': 'Cargando detalles del repositorio…',
      'repo.sideUnavailable': 'Los detalles del repositorio no están disponibles.',
      'repo.switchBranch': 'Cambiar de rama',
      'repo.filterBranches': 'Filtrar ramas…',
      'repo.loadingBranches': 'Cargando ramas…',
      'repo.noBranch': 'Ninguna rama coincide.',
      'repo.codeButton': 'Code',
      'repo.clone': 'Clonar',
      'repo.cloneWeb': 'Clonar con la URL web',
      'repo.cloneDesktop': 'Abrir con GitHub Desktop',
      'repo.cloneUrl': 'URL de clonación',
      'repo.copy': 'Copiar',
      'repo.copied': 'Copiado',
      'repo.downloadZip': 'Descargar ZIP',
      'repo.loadingIssues': 'Cargando issues…',
      'repo.noIssues': 'No hay issues abiertos.',
      'repo.allIssues': 'Ver todos los issues en GitHub',
      'repo.comments': 'Comentarios',
      'repo.noDescription': 'Sin descripción',
      'repo.forks': 'Forks',
      'action.openPanel': 'Abrir el espacio de trabajo de GitHub',
      'time.justNow': 'ahora mismo',
      'time.minutes': 'hace {n} min',
      'time.hours': 'hace {n} h',
      'time.days': 'hace {n} días',
      'time.months': 'hace {n} meses',
      'time.years': 'hace {n} años',
      'error.network': 'No se puede contactar con GitHub ni con el servicio Harness local. Comprueba la conexión y reinténtalo.',
      'error.rateLimited': 'Se agotó el límite de la API de GitHub. Inténtalo más tarde.',
      'error.resetAt': 'El límite se restablece hacia las {time}.',
      'error.invalidToken': 'El token no es válido o ha caducado. Inicia sesión de nuevo.',
      'error.tokenMalformed': 'El formato del token parece incorrecto; copia el token completo.',
      'error.github': 'GitHub rechazó la solicitud. Inténtalo más tarde.',
      'error.hostUnreachable': 'No se puede contactar con el Host local, así que el panel no está disponible.',
      'error.signOut': 'No se pudo cerrar sesión. Inténtalo de nuevo.',
      'error.forbidden': 'Solo la ventana de DeepSeek Harness puede llamar a esta ruta.',
      'error.credentialsUnavailable': 'Esta configuración no tiene almacén de credenciales, así que no se puede guardar el token.',
      'error.generic': 'La operación falló. Inténtalo más tarde.',
      'foot.source':
        'Los datos vienen de la API REST de GitHub. Sin autenticación: 60 solicitudes por hora y 10 búsquedas por minuto; iniciar sesión los amplía.',
      'foot.window': 'Las recomendaciones abarcan los 200 repositorios públicos con más stars creados en los últimos 7 días.',
    }

    const fr = {
      panel: 'GitHub',
      title: 'GitHub',
      subtitle: 'Connectez-vous à GitHub, découvrez les dépôts populaires récents ou recherchez directement sur GitHub.',
      'account.loading': 'Vérification de la connexion…',
      'account.signedOut': 'Déconnecté',
      'account.signIn': 'Se connecter',
      'account.signOut': 'Se déconnecter',
      'me.label': 'Compte GitHub',
      'me.repos': 'Dépôts',
      'me.followers': 'Abonnés',
      'me.following': 'Abonnements',
      'profile.edit': 'Modifier le profil',
      'profile.view': 'Voir le profil GitHub',
      'profile.repos': 'Dépôts',
      'profile.followers': 'Abonnés',
      'profile.following': 'Abonnements',
      'profile.joined': 'Inscrit en {year}',
      'login.title': 'Se connecter à GitHub',
      'login.intro':
        'Connectez-vous avec un jeton d’accès personnel (PAT). Il est conservé uniquement dans le magasin d’identifiants DSH de cette machine et n’est utilisé que par le Host local pour appeler GitHub ; il n’est jamais écrit dans des fichiers de configuration.',
      'login.step1': 'Ouvrez la page des jetons GitHub et créez un nouveau jeton :',
      'login.step2':
        'Aucun scope n’est nécessaire pour rechercher des dépôts publics. Pour ajouter une Star à un dépôt public qui ne vous appartient pas, il faut un jeton Classic avec public_repo (et repo pour les dépôts privés) ; GitHub interdit aux jetons Fine-grained de mettre une Star sur des dépôts publics dont vous n’êtes pas propriétaire ou membre.',
      'login.tokenLabel': 'Jeton d’accès',
      'login.tokenPlaceholder': 'Collez un jeton tel que ghp_… ou github_pat_…',
      'login.submit': 'Se connecter',
      'login.busy': 'Connexion…',
      'login.openTokens': 'Ouvrir la page des jetons',
      'login.emptyToken': 'Collez d’abord un jeton d’accès.',
      'recs.title': 'Tendances des 7 derniers jours',
      'recs.subtitle':
        'Dépôts publics créés cette semaine, classés par stars : chaque actualisation choisit un lot aléatoire parmi les 200 premiers.',
      'recs.refresh': 'Actualiser',
      'recs.loading': 'Chargement des recommandations…',
      'recs.empty': 'Aucune recommandation cette fois. Réessayez plus tard.',
      'recs.cached': 'depuis le cache',
      'search.title': 'Rechercher des dépôts',
      'search.placeholder': 'Rechercher des dépôts GitHub, par ex. rust async runtime ou language:go stars:>2000',
      'search.action': 'Rechercher',
      'search.loading': 'Recherche…',
      'search.empty': 'Aucun dépôt ne correspond.',
      'search.total': '{total} résultats',
      'search.hint': 'La syntaxe GitHub fonctionne : language:, stars:>, topic:, org:. Appuyez sur Entrée pour rechercher.',
      'results.title': 'Résultats de recherche',
      'results.back': 'Retour',
      'results.query': 'Requête : {q}',
      'results.page': 'Page {page} sur {pages}',
      'results.prev': 'Précédent',
      'results.next': 'Suivant',
      'results.jump': 'Aller à',
      'results.jumpUnit': 'page',
      'results.go': 'Aller',
      'results.perPage': 'Par page',
      'results.perPageUnit': 'éléments',
      'results.pager': 'Pages de résultats',
      'results.capped': 'La recherche GitHub renvoie au maximum les 1000 premiers résultats.',
      'results.tab': 'Dépôts',
      'star.star': 'Star',
      'star.unstar': 'Retirer la Star',
      'star.needLogin': 'Connectez-vous à GitHub avant d’ajouter une Star à un dépôt.',
      'star.forbidden':
        'Ce jeton ne peut pas ajouter de Star. Utilisez un jeton Classic avec public_repo (dépôts publics) ou repo (dépôts privés), puis reconnectez-vous.',
      'star.forbiddenFineGrained':
        'GitHub interdit aux jetons Fine-grained d’ajouter une Star à des dépôts publics dont vous n’êtes pas propriétaire ou membre, même avec l’autorisation Starring. Utilisez un jeton Classic avec public_repo (ou repo) et reconnectez-vous.',
      'star.failed': 'La demande de Star a échoué. Réessayez plus tard.',
      'detail.openExternal': 'Ouvrir dans GitHub',
      'detail.loading': 'Chargement du dépôt…',
      'detail.retry': 'Réessayer',
      'detail.readme': 'Aperçu du README',
      'detail.readmeTruncated': 'README long, aperçu tronqué',
      'detail.noReadme': 'Ce dépôt n’a pas de README prévisualisable.',
      'detail.archived': 'Archivé',
      'detail.stars': 'Stars',
      'detail.forks': 'Forks',
      'detail.watchers': 'Observateurs',
      'detail.issues': 'Issues',
      'detail.license': 'Licence',
      'detail.branch': 'Branche par défaut',
      'detail.updated': 'Dernier push',
      'repo.codeTab': 'Code',
      'repo.issuesTab': 'Issues',
      'repo.public': 'Public',
      'repo.entryCount': '{n} éléments',
      'repo.filter': 'Filtrer les fichiers…',
      'repo.emptyDir': 'Ce dossier est vide.',
      'repo.noMatch': 'Aucun fichier ne correspond.',
      'repo.loadingFiles': 'Chargement des fichiers…',
      'repo.loadingFile': 'Chargement du fichier…',
      'repo.backToFiles': 'Retour aux fichiers',
      'repo.lines': '{n} lignes',
      'repo.binary': 'Ce fichier est binaire et ne peut pas être prévisualisé comme du texte.',
      'repo.about': 'À propos',
      'repo.contributors': 'Contributeurs',
      'repo.languages': 'Langages',
      'repo.loadingSide': 'Chargement des détails du dépôt…',
      'repo.sideUnavailable': 'Les détails du dépôt sont indisponibles.',
      'repo.switchBranch': 'Changer de branche',
      'repo.filterBranches': 'Filtrer les branches…',
      'repo.loadingBranches': 'Chargement des branches…',
      'repo.noBranch': 'Aucune branche ne correspond.',
      'repo.codeButton': 'Code',
      'repo.clone': 'Cloner',
      'repo.cloneWeb': 'Cloner avec l’URL web',
      'repo.cloneDesktop': 'Ouvrir avec GitHub Desktop',
      'repo.cloneUrl': 'URL de clonage',
      'repo.copy': 'Copier',
      'repo.copied': 'Copié',
      'repo.downloadZip': 'Télécharger le ZIP',
      'repo.loadingIssues': 'Chargement des issues…',
      'repo.noIssues': 'Aucune issue ouverte.',
      'repo.allIssues': 'Voir toutes les issues sur GitHub',
      'repo.comments': 'Commentaires',
      'repo.noDescription': 'Aucune description',
      'repo.forks': 'Forks',
      'action.openPanel': 'Ouvrir l’espace de travail GitHub',
      'time.justNow': 'à l’instant',
      'time.minutes': 'il y a {n} min',
      'time.hours': 'il y a {n} h',
      'time.days': 'il y a {n} j',
      'time.months': 'il y a {n} mois',
      'time.years': 'il y a {n} ans',
      'error.network': 'Impossible de joindre GitHub ou le service Harness local. Vérifiez la connexion et réessayez.',
      'error.rateLimited': 'La limite de l’API GitHub est épuisée. Réessayez plus tard.',
      'error.resetAt': 'La limite se réinitialise vers {time}.',
      'error.invalidToken': 'Ce jeton est invalide ou expiré. Reconnectez-vous.',
      'error.tokenMalformed': 'Le format du jeton semble incorrect : copiez le jeton en entier.',
      'error.github': 'GitHub a refusé la requête. Réessayez plus tard.',
      'error.hostUnreachable': 'Le Host local est injoignable, le panneau est donc indisponible.',
      'error.signOut': 'La déconnexion a échoué. Réessayez.',
      'error.forbidden': 'Seule la fenêtre DeepSeek Harness peut appeler cette route.',
      'error.credentialsUnavailable': 'Cette configuration n’a pas de magasin d’identifiants, le jeton ne peut pas être enregistré.',
      'error.generic': 'L’opération a échoué. Réessayez plus tard.',
      'foot.source':
        'Les données proviennent de l’API REST GitHub. Sans authentification : 60 requêtes par heure et 10 recherches par minute ; la connexion augmente ces limites.',
      'foot.window': 'Les recommandations couvrent les 200 dépôts publics créés ces 7 derniers jours ayant le plus de stars.',
    }

    const de = {
      panel: 'GitHub',
      title: 'GitHub',
      subtitle: 'Melde dich bei GitHub an, entdecke aktuelle beliebte Repositories oder durchsuche GitHub direkt.',
      'account.loading': 'Anmeldestatus wird geprüft…',
      'account.signedOut': 'Abgemeldet',
      'account.signIn': 'Anmelden',
      'account.signOut': 'Abmelden',
      'me.label': 'GitHub-Konto',
      'me.repos': 'Repos',
      'me.followers': 'Follower',
      'me.following': 'Gefolgt',
      'profile.edit': 'Profil bearbeiten',
      'profile.view': 'GitHub-Profil ansehen',
      'profile.repos': 'Repositories',
      'profile.followers': 'Follower',
      'profile.following': 'Gefolgt',
      'profile.joined': 'Beigetreten {year}',
      'login.title': 'Bei GitHub anmelden',
      'login.intro':
        'Melde dich mit einem persönlichen Zugriffstoken (PAT) an. Es wird nur im DSH-Anmeldeinformationsspeicher dieses Rechners gespeichert und ausschließlich vom lokalen Host für GitHub-Aufrufe verwendet; es wird nie in Konfigurationsdateien geschrieben.',
      'login.step1': 'Öffne die Token-Seite von GitHub und erstelle ein neues Token:',
      'login.step2':
        'Für die Suche in öffentlichen Repositories sind keine Scopes nötig. Um ein fremdes öffentliches Repository zu starren, brauchst du ein Classic-Token mit public_repo (für private Repositories zusätzlich repo); GitHub erlaubt Fine-grained-Tokens nicht, öffentliche Repositories zu starren, die dir oder deiner Organisation nicht gehören.',
      'login.tokenLabel': 'Zugriffstoken',
      'login.tokenPlaceholder': 'Token einfügen, z. B. ghp_… oder github_pat_…',
      'login.submit': 'Anmelden',
      'login.busy': 'Anmeldung läuft…',
      'login.openTokens': 'Token-Seite öffnen',
      'login.emptyToken': 'Füge zuerst ein Zugriffstoken ein.',
      'recs.title': 'Trends der letzten 7 Tage',
      'recs.subtitle':
        'Öffentliche Repositories der letzten Woche, nach Stars sortiert – jede Aktualisierung wählt zufällig einen Teil der Top 200.',
      'recs.refresh': 'Aktualisieren',
      'recs.loading': 'Empfehlungen werden geladen…',
      'recs.empty': 'Diesmal keine Empfehlungen. Versuche es später erneut.',
      'recs.cached': 'aus dem Cache',
      'search.title': 'Repositories suchen',
      'search.placeholder': 'GitHub-Repositories suchen, z. B. rust async runtime oder language:go stars:>2000',
      'search.action': 'Suchen',
      'search.loading': 'Suche läuft…',
      'search.empty': 'Keine passenden Repositories.',
      'search.total': '{total} Ergebnisse',
      'search.hint': 'GitHub-Syntax funktioniert: language:, stars:>, topic:, org:. Enter zum Suchen.',
      'results.title': 'Suchergebnisse',
      'results.back': 'Zurück',
      'results.query': 'Suche: {q}',
      'results.page': 'Seite {page} von {pages}',
      'results.prev': 'Zurück',
      'results.next': 'Weiter',
      'results.jump': 'Gehe zu',
      'results.jumpUnit': 'Seite',
      'results.go': 'Los',
      'results.perPage': 'Pro Seite',
      'results.perPageUnit': 'Einträge',
      'results.pager': 'Ergebnisseiten',
      'results.capped': 'Die GitHub-Suche liefert höchstens die ersten 1000 Treffer.',
      'results.tab': 'Repositories',
      'star.star': 'Star',
      'star.unstar': 'Star entfernen',
      'star.needLogin': 'Melde dich bei GitHub an, bevor du ein Repository starrest.',
      'star.forbidden':
        'Dieses Token kann keine Stars vergeben. Verwende ein Classic-Token mit public_repo (öffentliche Repositories) oder repo (private Repositories) und melde dich erneut an.',
      'star.forbiddenFineGrained':
        'GitHub erlaubt Fine-grained-Tokens nicht, öffentliche Repositories zu starren, die dir oder deiner Organisation nicht gehören, unabhängig von der Starring-Berechtigung. Verwende ein Classic-Token mit public_repo (oder repo) und melde dich erneut an.',
      'star.failed': 'Die Star-Anfrage ist fehlgeschlagen. Versuche es später erneut.',
      'detail.openExternal': 'In GitHub öffnen',
      'detail.loading': 'Repository wird geladen…',
      'detail.retry': 'Erneut versuchen',
      'detail.readme': 'README-Vorschau',
      'detail.readmeTruncated': 'README zu lang, Vorschau gekürzt',
      'detail.noReadme': 'Dieses Repository hat kein README für die Vorschau.',
      'detail.archived': 'Archiviert',
      'detail.stars': 'Sterne',
      'detail.forks': 'Forks',
      'detail.watchers': 'Beobachter',
      'detail.issues': 'Issues',
      'detail.license': 'Lizenz',
      'detail.branch': 'Standardbranch',
      'detail.updated': 'Letzter Push',
      'repo.codeTab': 'Code',
      'repo.issuesTab': 'Issues',
      'repo.public': 'Public',
      'repo.entryCount': '{n} Einträge',
      'repo.filter': 'Dateien filtern…',
      'repo.emptyDir': 'Dieses Verzeichnis ist leer.',
      'repo.noMatch': 'Keine passenden Dateien.',
      'repo.loadingFiles': 'Dateien werden geladen…',
      'repo.loadingFile': 'Datei wird geladen…',
      'repo.backToFiles': 'Zurück zu den Dateien',
      'repo.lines': '{n} Zeilen',
      'repo.binary': 'Diese Datei ist binär und kann nicht als Text angezeigt werden.',
      'repo.about': 'Über',
      'repo.contributors': 'Mitwirkende',
      'repo.languages': 'Sprachen',
      'repo.loadingSide': 'Repository-Details werden geladen…',
      'repo.sideUnavailable': 'Repository-Details sind nicht verfügbar.',
      'repo.switchBranch': 'Branch wechseln',
      'repo.filterBranches': 'Branches filtern…',
      'repo.loadingBranches': 'Branches werden geladen…',
      'repo.noBranch': 'Keine passenden Branches.',
      'repo.codeButton': 'Code',
      'repo.clone': 'Klonen',
      'repo.cloneWeb': 'Mit Web-URL klonen',
      'repo.cloneDesktop': 'Mit GitHub Desktop öffnen',
      'repo.cloneUrl': 'Klon-URL',
      'repo.copy': 'Kopieren',
      'repo.copied': 'Kopiert',
      'repo.downloadZip': 'ZIP herunterladen',
      'repo.loadingIssues': 'Issues werden geladen…',
      'repo.noIssues': 'Keine offenen Issues.',
      'repo.allIssues': 'Alle Issues auf GitHub ansehen',
      'repo.comments': 'Kommentare',
      'repo.noDescription': 'Keine Beschreibung',
      'repo.forks': 'Forks',
      'action.openPanel': 'GitHub-Arbeitsbereich öffnen',
      'time.justNow': 'gerade eben',
      'time.minutes': 'vor {n} Min.',
      'time.hours': 'vor {n} Std.',
      'time.days': 'vor {n} T.',
      'time.months': 'vor {n} Mon.',
      'time.years': 'vor {n} J.',
      'error.network': 'GitHub oder der lokale Harness-Dienst ist nicht erreichbar. Prüfe die Verbindung und versuche es erneut.',
      'error.rateLimited': 'Das GitHub-API-Limit ist erschöpft. Versuche es später erneut.',
      'error.resetAt': 'Das Limit wird gegen {time} zurückgesetzt.',
      'error.invalidToken': 'Das Token ist ungültig oder abgelaufen. Melde dich erneut an.',
      'error.tokenMalformed': 'Das Token-Format scheint falsch zu sein – kopiere das ganze Token.',
      'error.github': 'GitHub hat die Anfrage abgelehnt. Versuche es später erneut.',
      'error.hostUnreachable': 'Der lokale Host ist nicht erreichbar, daher ist das Panel nicht verfügbar.',
      'error.signOut': 'Abmelden fehlgeschlagen. Versuche es erneut.',
      'error.forbidden': 'Nur das DeepSeek-Harness-Fenster darf diese Route aufrufen.',
      'error.credentialsUnavailable': 'Diese Konfiguration hat keinen Anmeldeinformationsspeicher, das Token kann nicht gespeichert werden.',
      'error.generic': 'Der Vorgang ist fehlgeschlagen. Versuche es später erneut.',
      'foot.source':
        'Daten stammen von der GitHub-REST-API. Ohne Anmeldung: 60 Anfragen pro Stunde und 10 Suchen pro Minute; eine Anmeldung erhöht die Limits.',
      'foot.window':
        'Die Empfehlungen umfassen die 200 öffentlichen Repositories der letzten 7 Tage mit den meisten Sternen.',
    }

    const ru = {
      panel: 'GitHub',
      title: 'GitHub',
      subtitle: 'Войдите в GitHub, чтобы смотреть недавно популярные репозитории или искать на GitHub напрямую.',
      'account.loading': 'Проверка входа…',
      'account.signedOut': 'Вы не вошли',
      'account.signIn': 'Войти',
      'account.signOut': 'Выйти',
      'me.label': 'Аккаунт GitHub',
      'me.repos': 'Репозитории',
      'me.followers': 'Подписчики',
      'me.following': 'Подписки',
      'profile.edit': 'Изменить профиль',
      'profile.view': 'Открыть профиль GitHub',
      'profile.repos': 'Репозитории',
      'profile.followers': 'Подписчики',
      'profile.following': 'Подписки',
      'profile.joined': 'С нами с {year}',
      'login.title': 'Вход в GitHub',
      'login.intro':
        'Войдите с помощью личного токена доступа (PAT). Он хранится только в хранилище учётных данных DSH на этом компьютере и используется лишь локальным Host при обращении к GitHub; в файлы конфигурации он не записывается.',
      'login.step1': 'Откройте страницу токенов GitHub и создайте новый токен:',
      'login.step2':
        'Для поиска по публичным репозиториям scopes не нужны. Чтобы поставить Star чужому публичному репозиторию, нужен Classic-токен с public_repo (для приватных репозиториев — ещё и repo); GitHub не разрешает Fine-grained-токенам ставить Star публичным репозиториям, которыми вы не владеете и не являетесь участником организации.',
      'login.tokenLabel': 'Токен доступа',
      'login.tokenPlaceholder': 'Вставьте токен, например ghp_… или github_pat_…',
      'login.submit': 'Войти',
      'login.busy': 'Вход…',
      'login.openTokens': 'Открыть страницу токенов',
      'login.emptyToken': 'Сначала вставьте токен доступа.',
      'recs.title': 'Популярное за последние 7 дней',
      'recs.subtitle':
        'Публичные репозитории, созданные за неделю, по числу звёзд — при каждом обновлении выбирается случайная часть из первых 200.',
      'recs.refresh': 'Обновить',
      'recs.loading': 'Загрузка рекомендаций…',
      'recs.empty': 'На этот раз рекомендаций нет. Попробуйте позже.',
      'recs.cached': 'из кеша',
      'search.title': 'Поиск репозиториев',
      'search.placeholder': 'Поиск репозиториев GitHub, например rust async runtime или language:go stars:>2000',
      'search.action': 'Найти',
      'search.loading': 'Поиск…',
      'search.empty': 'Репозитории не найдены.',
      'search.total': 'Результатов: {total}',
      'search.hint': 'Работает синтаксис GitHub: language:, stars:>, topic:, org:. Нажмите Enter для поиска.',
      'results.title': 'Результаты поиска',
      'results.back': 'Назад',
      'results.query': 'Запрос: {q}',
      'results.page': 'Страница {page} из {pages}',
      'results.prev': 'Назад',
      'results.next': 'Далее',
      'results.jump': 'Перейти к',
      'results.jumpUnit': 'странице',
      'results.go': 'Перейти',
      'results.perPage': 'На странице',
      'results.perPageUnit': 'шт.',
      'results.pager': 'Страницы результатов',
      'results.capped': 'Поиск GitHub возвращает не более первых 1000 совпадений.',
      'results.tab': 'Репозитории',
      'star.star': 'Star',
      'star.unstar': 'Убрать Star',
      'star.needLogin': 'Войдите в GitHub, прежде чем ставить Star репозиторию.',
      'star.forbidden':
        'У этого токена нет права ставить Star. Используйте Classic-токен с public_repo (публичные репозитории) или repo (приватные) и войдите снова.',
      'star.forbiddenFineGrained':
        'GitHub не разрешает Fine-grained-токенам ставить Star публичным репозиториям, которыми вы не владеете и не являетесь участником организации, даже с разрешением Starring. Используйте Classic-токен с public_repo (или repo) и войдите снова.',
      'star.failed': 'Не удалось поставить Star. Попробуйте позже.',
      'detail.openExternal': 'Открыть в GitHub',
      'detail.loading': 'Загрузка репозитория…',
      'detail.retry': 'Повторить',
      'detail.readme': 'Предпросмотр README',
      'detail.readmeTruncated': 'README длинный, предпросмотр обрезан',
      'detail.noReadme': 'В этом репозитории нет README для предпросмотра.',
      'detail.archived': 'Архивирован',
      'detail.stars': 'Звёзды',
      'detail.forks': 'Форки',
      'detail.watchers': 'Наблюдатели',
      'detail.issues': 'Issues',
      'detail.license': 'Лицензия',
      'detail.branch': 'Ветка по умолчанию',
      'detail.updated': 'Последний push',
      'repo.codeTab': 'Code',
      'repo.issuesTab': 'Issues',
      'repo.public': 'Public',
      'repo.entryCount': 'Элементов: {n}',
      'repo.filter': 'Фильтр файлов…',
      'repo.emptyDir': 'Этот каталог пуст.',
      'repo.noMatch': 'Нет подходящих файлов.',
      'repo.loadingFiles': 'Загрузка файлов…',
      'repo.loadingFile': 'Загрузка файла…',
      'repo.backToFiles': 'Назад к файлам',
      'repo.lines': 'Строк: {n}',
      'repo.binary': 'Файл двоичный, его нельзя показать как текст.',
      'repo.about': 'О репозитории',
      'repo.contributors': 'Участники',
      'repo.languages': 'Языки',
      'repo.loadingSide': 'Загрузка сведений о репозитории…',
      'repo.sideUnavailable': 'Сведения о репозитории недоступны.',
      'repo.switchBranch': 'Сменить ветку',
      'repo.filterBranches': 'Фильтр веток…',
      'repo.loadingBranches': 'Загрузка веток…',
      'repo.noBranch': 'Нет подходящих веток.',
      'repo.codeButton': 'Code',
      'repo.clone': 'Клонировать',
      'repo.cloneWeb': 'Клонировать по веб-URL',
      'repo.cloneDesktop': 'Открыть в GitHub Desktop',
      'repo.cloneUrl': 'URL клонирования',
      'repo.copy': 'Копировать',
      'repo.copied': 'Скопировано',
      'repo.downloadZip': 'Скачать ZIP',
      'repo.loadingIssues': 'Загрузка issues…',
      'repo.noIssues': 'Открытых issues нет.',
      'repo.allIssues': 'Все issues на GitHub',
      'repo.comments': 'Комментарии',
      'repo.noDescription': 'Без описания',
      'repo.forks': 'Форки',
      'action.openPanel': 'Открыть рабочее пространство GitHub',
      'time.justNow': 'только что',
      'time.minutes': '{n} мин назад',
      'time.hours': '{n} ч назад',
      'time.days': '{n} дн. назад',
      'time.months': '{n} мес. назад',
      'time.years': '{n} г. назад',
      'error.network': 'GitHub или локальный сервис Harness недоступны. Проверьте соединение и повторите.',
      'error.rateLimited': 'Лимит GitHub API исчерпан. Попробуйте позже.',
      'error.resetAt': 'Лимит сбросится примерно в {time}.',
      'error.invalidToken': 'Токен недействителен или истёк. Войдите снова.',
      'error.tokenMalformed': 'Формат токена неверен — скопируйте токен целиком.',
      'error.github': 'GitHub отклонил запрос. Попробуйте позже.',
      'error.hostUnreachable': 'Локальный Host недоступен, поэтому панель недоступна.',
      'error.signOut': 'Не удалось выйти. Повторите попытку.',
      'error.forbidden': 'Этот маршрут может вызывать только окно DeepSeek Harness.',
      'error.credentialsUnavailable': 'В этой конфигурации нет хранилища учётных данных, токен нельзя сохранить.',
      'error.generic': 'Операция не удалась. Попробуйте позже.',
      'foot.source':
        'Данные из GitHub REST API. Без входа: 60 запросов в час и 10 поисков в минуту; вход повышает лимиты.',
      'foot.window':
        'Рекомендации охватывают 200 публичных репозиториев, созданных за последние 7 дней, с наибольшим числом звёзд.',
    }

    const pt = {
      panel: 'GitHub',
      title: 'GitHub',
      subtitle: 'Entre no GitHub, descubra repositórios populares recentes ou pesquise diretamente no GitHub.',
      'account.loading': 'Verificando a sessão…',
      'account.signedOut': 'Sessão encerrada',
      'account.signIn': 'Entrar',
      'account.signOut': 'Sair',
      'me.label': 'Conta do GitHub',
      'me.repos': 'Repos',
      'me.followers': 'Seguidores',
      'me.following': 'Seguindo',
      'profile.edit': 'Editar perfil',
      'profile.view': 'Ver perfil no GitHub',
      'profile.repos': 'Repositórios',
      'profile.followers': 'Seguidores',
      'profile.following': 'Seguindo',
      'profile.joined': 'Entrou em {year}',
      'login.title': 'Entrar no GitHub',
      'login.intro':
        'Entre com um token de acesso pessoal (PAT). Ele fica apenas no armazenamento de credenciais do DSH desta máquina e é usado somente pelo Host local ao chamar o GitHub; nunca é gravado em arquivos de configuração.',
      'login.step1': 'Abra a página de tokens do GitHub e crie um novo token:',
      'login.step2':
        'Nenhum scope é necessário para pesquisar repositórios públicos. Para dar Star em um repositório público de outra pessoa, use um token Classic com public_repo (e repo para repositórios privados); o GitHub não permite que tokens Fine-grained deem Star em repositórios públicos que não são seus ou da sua organização.',
      'login.tokenLabel': 'Token de acesso',
      'login.tokenPlaceholder': 'Cole um token como ghp_… ou github_pat_…',
      'login.submit': 'Entrar',
      'login.busy': 'Entrando…',
      'login.openTokens': 'Abrir página de tokens',
      'login.emptyToken': 'Cole um token de acesso primeiro.',
      'recs.title': 'Em alta nos últimos 7 dias',
      'recs.subtitle':
        'Repositórios públicos criados nesta semana, ordenados por stars — cada atualização escolhe um lote aleatório entre os 200 primeiros.',
      'recs.refresh': 'Atualizar',
      'recs.loading': 'Carregando recomendações…',
      'recs.empty': 'Nenhuma recomendação desta vez. Tente novamente mais tarde.',
      'recs.cached': 'do cache',
      'search.title': 'Pesquisar repositórios',
      'search.placeholder': 'Pesquise repositórios do GitHub, por exemplo rust async runtime ou language:go stars:>2000',
      'search.action': 'Pesquisar',
      'search.loading': 'Pesquisando…',
      'search.empty': 'Nenhum repositório corresponde.',
      'search.total': '{total} resultados',
      'search.hint': 'A sintaxe do GitHub funciona: language:, stars:>, topic:, org:. Pressione Enter para pesquisar.',
      'results.title': 'Resultados da pesquisa',
      'results.back': 'Voltar',
      'results.query': 'Consulta: {q}',
      'results.page': 'Página {page} de {pages}',
      'results.prev': 'Anterior',
      'results.next': 'Próxima',
      'results.jump': 'Ir para',
      'results.jumpUnit': 'página',
      'results.go': 'Ir',
      'results.perPage': 'Por página',
      'results.perPageUnit': 'itens',
      'results.pager': 'Páginas de resultados',
      'results.capped': 'A pesquisa do GitHub retorna no máximo as primeiras 1000 correspondências.',
      'results.tab': 'Repositórios',
      'star.star': 'Star',
      'star.unstar': 'Remover Star',
      'star.needLogin': 'Entre no GitHub antes de dar Star em um repositório.',
      'star.forbidden':
        'Este token não pode dar Star. Use um token Classic com public_repo (repositórios públicos) ou repo (privados) e entre novamente.',
      'star.forbiddenFineGrained':
        'O GitHub não permite que tokens Fine-grained deem Star em repositórios públicos que não são seus ou da sua organização, mesmo com a permissão Starring. Use um token Classic com public_repo (ou repo) e entre novamente.',
      'star.failed': 'Não foi possível dar Star. Tente novamente mais tarde.',
      'detail.openExternal': 'Abrir no GitHub',
      'detail.loading': 'Carregando repositório…',
      'detail.retry': 'Tentar novamente',
      'detail.readme': 'Prévia do README',
      'detail.readmeTruncated': 'README longo, prévia truncada',
      'detail.noReadme': 'Este repositório não tem README para pré-visualizar.',
      'detail.archived': 'Arquivado',
      'detail.stars': 'Stars',
      'detail.forks': 'Forks',
      'detail.watchers': 'Observadores',
      'detail.issues': 'Issues',
      'detail.license': 'Licença',
      'detail.branch': 'Branch padrão',
      'detail.updated': 'Último push',
      'repo.codeTab': 'Code',
      'repo.issuesTab': 'Issues',
      'repo.public': 'Public',
      'repo.entryCount': '{n} itens',
      'repo.filter': 'Filtrar arquivos…',
      'repo.emptyDir': 'Este diretório está vazio.',
      'repo.noMatch': 'Nenhum arquivo corresponde.',
      'repo.loadingFiles': 'Carregando arquivos…',
      'repo.loadingFile': 'Carregando arquivo…',
      'repo.backToFiles': 'Voltar aos arquivos',
      'repo.lines': '{n} linhas',
      'repo.binary': 'Este arquivo é binário e não pode ser pré-visualizado como texto.',
      'repo.about': 'Sobre',
      'repo.contributors': 'Colaboradores',
      'repo.languages': 'Linguagens',
      'repo.loadingSide': 'Carregando detalhes do repositório…',
      'repo.sideUnavailable': 'Os detalhes do repositório não estão disponíveis.',
      'repo.switchBranch': 'Trocar de branch',
      'repo.filterBranches': 'Filtrar branches…',
      'repo.loadingBranches': 'Carregando branches…',
      'repo.noBranch': 'Nenhuma branch corresponde.',
      'repo.codeButton': 'Code',
      'repo.clone': 'Clonar',
      'repo.cloneWeb': 'Clonar usando a URL da web',
      'repo.cloneDesktop': 'Abrir com o GitHub Desktop',
      'repo.cloneUrl': 'URL de clonagem',
      'repo.copy': 'Copiar',
      'repo.copied': 'Copiado',
      'repo.downloadZip': 'Baixar ZIP',
      'repo.loadingIssues': 'Carregando issues…',
      'repo.noIssues': 'Nenhuma issue aberta.',
      'repo.allIssues': 'Ver todas as issues no GitHub',
      'repo.comments': 'Comentários',
      'repo.noDescription': 'Sem descrição',
      'repo.forks': 'Forks',
      'action.openPanel': 'Abrir o espaço de trabalho do GitHub',
      'time.justNow': 'agora mesmo',
      'time.minutes': 'há {n} min',
      'time.hours': 'há {n} h',
      'time.days': 'há {n} dias',
      'time.months': 'há {n} meses',
      'time.years': 'há {n} anos',
      'error.network': 'Não foi possível acessar o GitHub ou o serviço Harness local. Verifique a conexão e tente novamente.',
      'error.rateLimited': 'O limite da API do GitHub foi atingido. Tente novamente mais tarde.',
      'error.resetAt': 'O limite é redefinido por volta de {time}.',
      'error.invalidToken': 'O token é inválido ou expirou. Entre novamente.',
      'error.tokenMalformed': 'O formato do token parece errado — copie o token inteiro.',
      'error.github': 'O GitHub recusou a solicitação. Tente novamente mais tarde.',
      'error.hostUnreachable': 'O Host local está inacessível, então o painel não está disponível.',
      'error.signOut': 'Falha ao sair. Tente novamente.',
      'error.forbidden': 'Apenas a janela do DeepSeek Harness pode chamar esta rota.',
      'error.credentialsUnavailable': 'Esta configuração não tem armazenamento de credenciais, então o token não pode ser salvo.',
      'error.generic': 'A operação falhou. Tente novamente mais tarde.',
      'foot.source':
        'Os dados vêm da API REST do GitHub. Sem autenticação: 60 requisições por hora e 10 pesquisas por minuto; entrar aumenta os limites.',
      'foot.window':
        'As recomendações cobrem os 200 repositórios públicos criados nos últimos 7 dias com mais stars.',
    }

    const CSS = `
.dsg-page{display:flex;flex-direction:column;width:100%;height:100%;min-width:0;min-height:0;overflow:hidden;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base);font-size:14px;line-height:1.6}
.dsg-scroll{flex:1;min-height:0;overflow:auto;scrollbar-gutter:stable}
.dsg-content{max-width:1080px;margin:0 auto;padding:0 clamp(24px,4vw,48px) 56px}
.dsg-head{display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:16px;padding-top:28px;margin-bottom:24px}
.dsg-head h1{margin:0;font-size:20px;line-height:28px;font-weight:500}
.dsg-sub{margin:4px 0 0;max-width:560px;font-size:13px;line-height:20px;color:var(--dsw-alias-label-secondary)}
.dsg-account{display:flex;flex:none;align-items:center;gap:8px;min-height:32px}
.dsg-account-state{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--dsw-alias-label-secondary)}
.dsg-round-avatar{border-radius:50%;overflow:hidden;background-position:center;background-size:cover}
.dsg-me-wrap{padding-top:28px;margin-bottom:24px}
.dsg-profile{display:flex;box-sizing:border-box;align-items:flex-start;gap:20px;width:100%;padding:20px 22px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-card-fill)}
.dsg-profile-main{display:flex;flex:1;flex-direction:column;gap:6px;min-width:0}
.dsg-profile-name-row{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px;min-width:0}
.dsg-profile-name{margin:0;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:22px;line-height:30px;font-weight:600}
.dsg-profile-login{font-size:15px;line-height:24px;color:var(--dsw-alias-label-secondary);text-decoration:none}
a.dsg-profile-login:hover{text-decoration:underline}
.dsg-profile-bio{margin:2px 0 0;max-width:640px;font-size:14px;line-height:21px;color:var(--dsw-alias-label-primary);overflow-wrap:anywhere}
.dsg-profile-meta{display:flex;flex-wrap:wrap;align-items:center;gap:4px 14px;margin-top:2px;font-size:13px;line-height:20px;color:var(--dsw-alias-label-secondary)}
.dsg-profile-meta-item{display:inline-flex;align-items:center;gap:4px}
.dsg-profile-meta-link{max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-link);text-decoration:none}
.dsg-profile-meta-link:hover{text-decoration:underline}
.dsg-profile-stats{display:flex;flex-wrap:wrap;gap:16px;margin-top:4px;font-size:13px;line-height:20px;color:var(--dsw-alias-label-secondary)}
.dsg-profile-stat{color:var(--dsw-alias-label-secondary);text-decoration:none;cursor:pointer}
.dsg-profile-stat:hover{color:var(--dsw-alias-label-primary);text-decoration:underline}
.dsg-profile-stat b{font-weight:600;color:var(--dsw-alias-label-primary)}
.dsg-profile-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.dsg-btn{display:inline-flex;flex:none;align-items:center;justify-content:center;gap:6px;height:32px;padding:0 14px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-sm);background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;white-space:nowrap;text-decoration:none;cursor:pointer;transition:background .15s,border-color .15s,opacity .15s}
.dsg-btn:hover:not(:disabled){background:var(--dsw-alias-card-fill-hover)}
.dsg-btn:disabled{opacity:.55;cursor:default}
.dsg-btn-primary{border-color:transparent;background:var(--dsw-alias-button-primary-fill);color:var(--dsw-alias-label-primary-inverted)}
.dsg-btn-primary:hover:not(:disabled){background:var(--dsw-alias-button-primary-fill);opacity:.9}
.dsg-login{margin-bottom:24px;padding:18px 20px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-card-fill)}
.dsg-login h2{margin:0 0 6px;font-size:15px;line-height:24px;font-weight:500}
.dsg-login p{margin:0 0 12px;font-size:13px;line-height:20px;color:var(--dsw-alias-label-secondary)}
.dsg-steps{margin:0 0 14px;padding-left:18px;font-size:13px;line-height:22px;color:var(--dsw-alias-label-secondary)}
.dsg-link{color:var(--dsw-alias-link);text-decoration:none}
.dsg-link:hover{text-decoration:underline}
.dsg-field{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.dsg-label{display:block;flex-basis:100%;margin:0 0 2px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}
.dsg-input{flex:1;box-sizing:border-box;min-width:220px;height:36px;padding:0 12px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;transition:border-color .15s}
.dsg-input::placeholder{color:var(--dsw-alias-label-secondary);opacity:.85}
.dsg-input:focus{border-color:var(--dsw-alias-brand-primary)}
.dsg-section{margin-bottom:24px}
.dsg-section-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin-bottom:12px}
.dsg-section-head h2{margin:0;font-size:15px;line-height:24px;font-weight:500}
.dsg-section-sub{margin:2px 0 0;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}
.dsg-search-row{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.dsg-search-field{display:flex;flex:1;box-sizing:border-box;min-width:240px;align-items:center;gap:8px;height:38px;padding:0 12px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-bg-base);transition:border-color .15s,box-shadow .15s}
.dsg-search-field:focus-within{border-color:var(--dsw-alias-brand-primary);box-shadow:inset 0 0 0 1px var(--dsw-alias-brand-primary)}
.dsg-search-glyph{display:inline-flex;flex:none;color:var(--dsw-alias-label-secondary)}
.dsg-search-input{flex:1;min-width:0;height:100%;padding:0;border:0;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px}
.dsg-search-input:focus{outline:none}
.dsg-search-input::placeholder{color:var(--dsw-alias-label-secondary);opacity:.85}
.dsg-results{display:flex;flex-direction:column;gap:10px;margin-top:16px}
.dsg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:12px}
.dsg-card{position:relative;display:flex;flex-direction:column;gap:8px;padding:16px 18px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-card-fill);transition:background .15s,border-color .15s}
.dsg-card:hover{background:var(--dsw-alias-card-fill-hover)}
.dsg-card-cover{position:absolute;inset:0;padding:0;border:0;border-radius:inherit;background:transparent;cursor:pointer}
.dsg-card-head,.dsg-card-desc,.dsg-meta{pointer-events:none}
.dsg-card-name,.dsg-star-btn{position:relative;z-index:1;pointer-events:auto}
.dsg-card-head{display:flex;align-items:center;gap:12px;min-width:0}
.dsg-repo-avatar{flex:none;width:32px;height:32px;border:0;border-radius:9999px;overflow:hidden;object-fit:cover;aspect-ratio:1;background:var(--dsw-alias-bg-layer-2)}
.dsg-card-id{display:flex;flex:1;flex-direction:column;gap:0;min-width:0}
.dsg-card-owner{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13.5px;line-height:18px;font-weight:400;color:var(--dsw-alias-link);text-decoration:none}
.dsg-card-owner:hover{text-decoration:underline}
.dsg-card-name{display:block;width:100%;padding:0;border:0;background:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left;font-family:inherit;font-size:15px;line-height:22px;font-weight:600;color:var(--dsw-alias-label-primary);cursor:pointer}
.dsg-card-name:hover{text-decoration:underline}
.dsg-star-btn{display:inline-flex;flex:none;align-items:center;gap:5px;height:28px;padding:0 10px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-sm);background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;line-height:18px;cursor:pointer;transition:background .15s,color .15s,border-color .15s}
.dsg-star-btn:hover:not(:disabled){background:var(--dsw-alias-card-fill-hover);color:var(--dsw-alias-label-primary)}
.dsg-star-btn:disabled{opacity:.6;cursor:default}
.dsg-star-btn-on{border-color:var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary)}
.dsg-star-btn-on svg{color:var(--dsw-alias-state-warn-primary)}
.dsg-star-count{font-variant-numeric:tabular-nums}
.dsg-card-desc{display:-webkit-box;margin:0;overflow:hidden;font-size:13px;line-height:20px;color:var(--dsw-alias-label-secondary);-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow-wrap:anywhere}
.dsg-grid .dsg-card-desc{flex:1;-webkit-line-clamp:3}
.dsg-meta{display:flex;flex-wrap:wrap;align-items:center;gap:10px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}
.dsg-meta-item{display:inline-flex;align-items:center;gap:4px}
.dsg-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--dsw-alias-state-idle-primary)}
.dsg-state{display:flex;align-items:center;gap:8px;padding:16px 2px;font-size:13px;color:var(--dsw-alias-label-secondary)}
.dsg-alert{display:flex;align-items:flex-start;gap:8px;margin:10px 0 0;padding:10px 12px;border:0.5px solid color-mix(in srgb,var(--dsw-alias-state-error-primary) 45%,transparent);border-radius:var(--dsw-radius-sm);background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 8%,transparent);font-size:13px;line-height:20px;color:var(--dsw-alias-label-primary)}
.dsg-hint{margin:10px 0 0;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}
.dsg-spinner{display:inline-block;width:13px;height:13px;border:1.5px solid color-mix(in srgb,var(--dsw-alias-label-secondary) 35%,transparent);border-top-color:var(--dsw-alias-label-primary);border-radius:50%;animation:dsg-spin .8s linear infinite}
@keyframes dsg-spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.dsg-spinner{animation:none;opacity:.55}}
.dsg-foot{margin-top:28px;padding-top:14px;border-top:0.5px solid var(--dsw-alias-border-l3);font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}
.dsg-foot p{margin:0}
.dsg-subpage{padding-top:28px}
.dsg-subhead{display:flex;align-items:center;gap:10px;margin-bottom:16px}
.dsg-subhead h1{margin:0;font-size:20px;line-height:28px;font-weight:500}
.dsg-back{flex:none}
.dsg-tabs{display:flex;align-items:center;gap:4px;margin-top:18px;border-bottom:0.5px solid var(--dsw-alias-border-l3)}
.dsg-tab{display:inline-flex;align-items:center;gap:8px;padding:8px 10px;margin-bottom:-0.5px;border-bottom:2px solid transparent;font-size:14px;line-height:20px;color:var(--dsw-alias-label-secondary)}
.dsg-tab-active{border-bottom-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-label-primary);font-weight:500}
.dsg-tab-count{display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:18px;padding:0 6px;border-radius:9px;background:var(--dsw-alias-bg-layer-2);font-size:11px;line-height:18px;font-weight:500;color:var(--dsw-alias-label-secondary)}
.dsg-pager{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:6px;margin-top:20px}
.dsg-page-btn{display:inline-flex;align-items:center;justify-content:center;min-width:30px;height:30px;padding:0 8px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-sm);background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;line-height:18px;cursor:pointer;transition:background .15s,border-color .15s,color .15s}
.dsg-page-btn:hover:not(:disabled):not([aria-current='page']){background:var(--dsw-alias-card-fill-hover)}
.dsg-page-btn:disabled{opacity:.45;cursor:default}
.dsg-page-btn-current{border-color:transparent;background:var(--dsw-alias-button-primary-fill);color:var(--dsw-alias-label-primary-inverted);font-weight:500}
.dsg-page-gap{min-width:18px;text-align:center;font-size:12px;color:var(--dsw-alias-label-secondary)}
.dsg-pager-tools{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:14px;margin-top:12px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}
.dsg-jump{display:flex;align-items:center;gap:6px}
.dsg-jump-input{flex:none;width:64px;min-width:0;height:28px;padding:0 8px;font-size:12px}
.dsg-jump-unit{white-space:nowrap}
.dsg-pagesize{display:flex;align-items:center;gap:6px}
.dsg-select{height:28px;padding:0 6px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-sm);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;cursor:pointer}
.dsg-detail-actions{display:flex;flex:none;align-items:center;gap:8px;margin-left:auto}
.dsg-detail-desc{margin:14px 0 0;font-size:14px;line-height:22px;color:var(--dsw-alias-label-secondary);overflow-wrap:anywhere}
.dsg-topics{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}
.dsg-topic{padding:2px 10px;border-radius:9999px;background:color-mix(in srgb,var(--dsw-alias-link) 12%,transparent);color:var(--dsw-alias-link);font-size:12px;line-height:18px}
.dsg-stats{display:flex;flex-wrap:wrap;gap:18px;margin-top:16px}
.dsg-stat{display:flex;flex-direction:column;gap:2px}
.dsg-stat-value{font-size:16px;line-height:22px;font-weight:600}
.dsg-stat-label{font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}
.dsg-detail-meta{display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;margin-top:14px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}
.dsg-pill{padding:1px 8px;border-radius:9999px;border:0.5px solid var(--dsw-alias-state-warn-primary);color:var(--dsw-alias-state-warn-primary);font-size:11px;line-height:16px}
.dsg-readme-wrap{margin-top:22px;padding-top:16px;border-top:0.5px solid var(--dsw-alias-border-l3)}
.dsg-readme-head{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:8px;margin-bottom:8px}
.dsg-readme-head h2{margin:0;font-size:14px;line-height:20px;font-weight:500}
.dsg-readme-note{font-size:12px;color:var(--dsw-alias-label-secondary)}
.dsg-readme{margin:0;max-height:460px;overflow:auto;padding:14px 16px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font-family:ui-monospace,SFMono-Regular,Consolas,'Liberation Mono',monospace;font-size:12px;line-height:1.7;white-space:pre-wrap;overflow-wrap:anywhere}
.dsg-detail-retry{margin-top:12px}
.dsg-repo{display:flex;flex-direction:column;padding-top:28px}
.dsg-crumb{display:flex;align-items:center;gap:6px;min-width:0;font-size:16px;line-height:24px;font-weight:500}
.dsg-crumb-owner{color:var(--dsw-alias-link)}
.dsg-crumb-sep{color:var(--dsw-alias-label-secondary)}
.dsg-crumb-repo{color:var(--dsw-alias-label-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsg-repo-title{display:flex;align-items:center;gap:10px;margin-top:14px;min-width:0}
.dsg-repo-title h1{margin:0;font-size:20px;line-height:28px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsg-visibility{padding:1px 8px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:9999px;font-size:11px;line-height:16px;color:var(--dsw-alias-label-secondary)}
.dsg-repo-tabs{display:flex;align-items:center;gap:18px;margin-top:14px;border-bottom:0.5px solid var(--dsw-alias-border-l3)}
.dsg-repo-tab{display:inline-flex;align-items:center;gap:8px;padding:8px 2px;margin-bottom:-0.5px;border:0;border-bottom:2px solid transparent;background:none;font-family:inherit;font-size:14px;line-height:20px;color:var(--dsw-alias-label-secondary);cursor:pointer}
.dsg-repo-tab-active{border-bottom-color:var(--dsw-alias-state-warn-primary);color:var(--dsw-alias-label-primary);font-weight:500}
.dsg-repo-body{display:flex;align-items:flex-start;gap:24px;margin-top:18px}
.dsg-repo-main{flex:1;min-width:0}
.dsg-repo-side{display:flex;flex:none;width:280px;flex-direction:column;gap:22px}
@media (max-width: 960px){.dsg-repo-body{flex-direction:column}.dsg-repo-side{width:100%}}
.dsg-branchbar{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-bottom:12px}
.dsg-branch{display:inline-flex;align-items:center;gap:6px;min-width:110px;height:32px;padding:0 12px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-sm);background:var(--dsw-alias-bg-base);font-size:13px;line-height:20px}
.dsg-branch-meta{font-size:12px;color:var(--dsw-alias-label-secondary)}
.dsg-filefilter{flex:1;min-width:160px;max-width:260px;height:32px}
.dsg-pathbar{display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin:0 0 10px;font-size:13px;line-height:20px;min-width:0}
.dsg-crumb-link{padding:0;border:0;background:none;font:inherit;color:var(--dsw-alias-link);cursor:pointer}
.dsg-crumb-link:hover{text-decoration:underline}
.dsg-crumb-current{color:var(--dsw-alias-label-primary)}
.dsg-filetable{border:0.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-md);overflow:hidden;background:var(--dsw-alias-card-fill)}
.dsg-filetable-head{display:flex;align-items:center;gap:10px;padding:10px 14px;background:color-mix(in srgb,var(--dsw-alias-bg-base) 55%,transparent);border-bottom:0.5px solid var(--dsw-alias-border-l3);font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary);min-width:0}
.dsg-commit-author{flex:none;font-weight:500;color:var(--dsw-alias-label-primary)}
.dsg-commit-msg{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsg-commit-time{flex:none}
.dsg-filerow{display:flex;align-items:center;gap:10px;padding:8px 14px;border-top:0.5px solid var(--dsw-alias-border-l3);min-width:0}
.dsg-filerow:hover{background:var(--dsw-alias-card-fill-hover)}
.dsg-fileicon{display:inline-flex;flex:none;color:var(--dsw-alias-label-secondary)}
.dsg-filename{flex:1;min-width:0;padding:0;border:0;background:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left;font-family:inherit;font-size:13px;line-height:20px;color:var(--dsw-alias-label-primary);cursor:pointer}
.dsg-filename:hover{text-decoration:underline;color:var(--dsw-alias-link)}
.dsg-filesize{flex:none;font-size:12px;color:var(--dsw-alias-label-secondary)}
.dsg-readme-card{margin-top:20px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-md);overflow:hidden;background:var(--dsw-alias-card-fill)}
.dsg-readme-card-head{display:flex;align-items:center;gap:8px;padding:10px 16px;border-bottom:0.5px solid var(--dsw-alias-border-l3);font-size:12px;line-height:18px;font-weight:500;color:var(--dsw-alias-label-secondary)}
.dsg-markdown{padding:20px 24px;font-size:14px;line-height:1.7;color:var(--dsw-alias-label-primary);overflow-wrap:anywhere}
.dsg-markdown h1,.dsg-markdown h2,.dsg-markdown h3,.dsg-markdown h4{margin:18px 0 8px;padding-bottom:6px;border-bottom:0.5px solid var(--dsw-alias-border-l3);font-weight:600;line-height:1.35}
.dsg-markdown h1:first-child,.dsg-markdown h2:first-child{margin-top:0;padding-bottom:0;border-bottom:0}
.dsg-markdown h1{font-size:22px}
.dsg-markdown h2{font-size:18px}
.dsg-markdown h3{font-size:16px}
.dsg-markdown p{margin:10px 0}
.dsg-markdown ul,.dsg-markdown ol{margin:10px 0;padding-left:22px}
.dsg-markdown li{margin:4px 0}
.dsg-markdown a{color:var(--dsw-alias-link);text-decoration:none}
.dsg-markdown a:hover{text-decoration:underline}
.dsg-markdown code{padding:1px 5px;border-radius:4px;background:var(--dsw-alias-bg-layer-2);font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:12.5px}
.dsg-md-pre{margin:12px 0;padding:12px 14px;overflow:auto;border:0.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-sm);background:var(--dsw-alias-bg-layer-1)}
.dsg-md-pre code{padding:0;background:none;font-size:12px;line-height:1.6;white-space:pre}
.dsg-markdown blockquote{margin:12px 0;padding:2px 14px;border-left:3px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary)}
.dsg-markdown hr{margin:16px 0;border:0;border-top:0.5px solid var(--dsw-alias-border-l3)}
.dsg-about-card h2{margin:0 0 8px;font-size:14px;line-height:20px;font-weight:600}
.dsg-about-desc{margin:0 0 10px;font-size:13px;line-height:20px;color:var(--dsw-alias-label-primary)}
.dsg-about-link{display:block;margin:0 0 10px;font-size:12px;line-height:18px;color:var(--dsw-alias-link);text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsg-about-link:hover{text-decoration:underline}
.dsg-about-stats{display:flex;flex-wrap:wrap;gap:14px;margin:12px 0 8px}
.dsg-about-stats .dsg-stat{min-width:56px}
.dsg-about-row{display:flex;justify-content:space-between;gap:10px;padding:5px 0;border-top:0.5px solid var(--dsw-alias-border-l3);font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}
.dsg-about-row span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-primary)}
.dsg-contributor{display:flex;align-items:center;gap:8px;padding:4px 0;font-size:13px;line-height:20px;color:var(--dsw-alias-label-primary);text-decoration:none}
.dsg-contributor:hover{text-decoration:underline}
.dsg-langbar{display:flex;height:8px;margin:2px 0 10px;border-radius:9999px;overflow:hidden;background:var(--dsw-alias-bg-layer-2)}
.dsg-langbar-seg{display:block;height:100%}
.dsg-langlegend{display:flex;flex-wrap:wrap;gap:6px 14px;margin:0;padding:0;list-style:none;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}
.dsg-langlegend li{display:inline-flex;align-items:center;gap:6px}
.dsg-langdot{display:inline-block;width:8px;height:8px;border-radius:50%}
.dsg-fileview-head{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-bottom:12px}
.dsg-fileview-path{flex:1;min-width:0;font-size:13px;line-height:20px;color:var(--dsw-alias-label-secondary);overflow-wrap:anywhere}
.dsg-fileview-meta{display:flex;flex-wrap:wrap;gap:14px;margin-bottom:8px;font-size:12px;color:var(--dsw-alias-label-secondary)}
.dsg-codebox{max-height:68vh;overflow:auto;border:0.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-bg-layer-1)}
.dsg-codeline{display:flex;min-width:max-content;white-space:pre;font-family:ui-monospace,SFMono-Regular,Consolas,'Liberation Mono',monospace;font-size:12.5px;line-height:20px}
.dsg-lineno{flex:none;width:52px;padding:0 10px;text-align:right;color:var(--dsw-alias-label-secondary);opacity:.7;user-select:none;border-right:0.5px solid var(--dsw-alias-border-l3)}
.dsg-linecode{padding:0 14px;white-space:pre}
.dsg-popover-wrap{position:relative}
.dsg-popover{position:absolute;top:calc(100% + 6px);left:0;z-index:20;min-width:260px;padding:8px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-card-fill);box-shadow:0 10px 28px color-mix(in srgb,var(--dsw-alias-label-primary) 18%,transparent)}
.dsg-popover-filter{width:100%;min-width:0;height:32px;margin-bottom:6px}
.dsg-popover-list{display:flex;flex-direction:column;max-height:260px;overflow:auto}
.dsg-menu-item{display:flex;align-items:center;gap:8px;width:100%;padding:6px 10px;border:0;border-radius:var(--dsw-radius-sm);background:none;text-align:left;font-family:inherit;font-size:13px;line-height:20px;color:var(--dsw-alias-label-primary);text-decoration:none;cursor:pointer}
.dsg-menu-item:hover{background:var(--dsw-alias-card-fill-hover)}
.dsg-menu-item-active{font-weight:600}
.dsg-menu-item-label{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsg-menu-check{color:var(--dsw-alias-state-success-primary)}
.dsg-popover-title{padding:4px 6px 8px;font-size:12px;font-weight:600;color:var(--dsw-alias-label-secondary)}
.dsg-repo-actions{display:flex;flex:none;align-items:center;gap:8px;margin-left:auto}
.dsg-repo-actions .dsg-star-btn{height:32px;padding:0 14px;gap:6px;font-size:13px;line-height:20px}
.dsg-code-btn{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 14px;border:0.5px solid transparent;border-radius:var(--dsw-radius-sm);background:#1f883d;color:#ffffff;font-family:inherit;font-size:13px;font-weight:500;line-height:20px;cursor:pointer}
.dsg-code-btn:hover{background:#1a7f37}
.dsg-clone-menu{left:auto;right:0;width:380px;max-width:calc(100vw - 48px);padding:12px}
.dsg-clone-head{display:flex;align-items:center;gap:8px;margin:2px 4px 10px;font-size:14px;font-weight:600;color:var(--dsw-alias-label-primary)}
.dsg-clone-tabs{display:flex;gap:4px;margin-bottom:8px;border-bottom:0.5px solid var(--dsw-alias-border-l3)}
.dsg-clone-tab{padding:6px 10px;border:0;border-bottom:2px solid transparent;background:none;font-family:inherit;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary);cursor:pointer}
.dsg-clone-tab-active{border-bottom-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-label-primary);font-weight:500}
.dsg-clone-row{display:flex;gap:8px;margin-bottom:6px}
.dsg-clone-input{flex:1;min-width:0;height:32px;font-size:12px}
.dsg-copy-btn{display:inline-flex;flex:none;align-items:center;justify-content:center;width:32px;height:32px;border:0.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-sm);background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;transition:background .15s,color .15s}
.dsg-copy-btn:hover{background:var(--dsw-alias-card-fill-hover);color:var(--dsw-alias-label-primary)}
.dsg-clone-menu .dsg-menu-item{padding:8px 6px;gap:10px}
.dsg-clone-menu .dsg-menu-item svg{flex:none;color:var(--dsw-alias-label-secondary)}
.dsg-issue-panel{display:flex;flex-direction:column;gap:8px}
.dsg-issue-list{display:flex;flex-direction:column;border:0.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-md);overflow:hidden;background:var(--dsw-alias-card-fill)}
.dsg-issue-row{display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border-top:0.5px solid var(--dsw-alias-border-l3)}
.dsg-issue-row:first-child{border-top:0}
.dsg-issue-row:hover{background:var(--dsw-alias-card-fill-hover)}
.dsg-issue-icon{display:inline-flex;flex:none;margin-top:2px;color:var(--dsw-alias-state-success-primary)}
.dsg-issue-main{flex:1;min-width:0}
.dsg-issue-title{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;line-height:20px;font-weight:500;color:var(--dsw-alias-label-primary);text-decoration:none}
.dsg-issue-title:hover{color:var(--dsw-alias-link);text-decoration:underline}
.dsg-issue-meta{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:2px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}
.dsg-label-pill{padding:0 8px;border:0.5px solid;border-radius:9999px;font-size:11px;line-height:16px}
.dsg-issue-comments{flex:none;font-size:12px;color:var(--dsw-alias-label-secondary)}
.dsg-issue-more{margin-top:4px;font-size:12px;line-height:18px;color:var(--dsw-alias-link);text-decoration:none}
.dsg-issue-more:hover{text-decoration:underline}
.dsg-skel{background:color-mix(in srgb,var(--dsw-alias-label-primary) 9%,transparent);border-radius:6px;animation:dsg-skel-pulse 1.4s ease-in-out infinite}
.dsg-skel-title{width:96px;height:14px;margin:0 0 12px}
.dsg-skel-line{width:100%;height:10px;margin:8px 0}
.dsg-skel-medium{width:78%}
.dsg-skel-short{width:55%}
.dsg-skel-stat{width:56px;height:32px}
.dsg-skel-row{width:100%;height:10px;margin-top:10px}
.dsg-skel-contrib{width:70%;height:24px;margin:10px 0;border-radius:12px}
.dsg-skel-bar{width:100%;height:8px;margin:10px 0;border-radius:9999px}
.dsg-skel-btn{display:inline-block;width:112px;height:32px;border-radius:var(--dsw-radius-sm)}
.dsg-skel-count{min-width:22px;height:18px;border-radius:9px}
.dsg-skel-heading{width:180px;height:22px;margin:6px 0 14px}
.dsg-skel-inline{display:inline-block;width:72px;height:12px;margin:0}
@keyframes dsg-skel-pulse{0%,100%{opacity:.5}50%{opacity:1}}
@media (prefers-reduced-motion:reduce){.dsg-skel{animation:none;opacity:.65}}
`

    /** One failed browser-to-Host call, carrying the Host's error code. */
    class ApiError extends Error {
      constructor(code, message, details) {
        super(message)
        this.name = 'GitHubApiError'
        this.code = code
        this.details = details
      }
    }

    function format(template, values) {
      return String(template).replace(/\{(\w+)\}/g, (match, key) =>
        values[key] === undefined ? match : String(values[key]),
      )
    }

    function compactNumber(value, locale) {
      try {
        return new Intl.NumberFormat(locale === '' ? undefined : locale, {
          notation: 'compact',
          maximumFractionDigits: 1,
        }).format(value)
      } catch {
        return String(value)
      }
    }

    function relativeTime(t, iso) {
      const time = Date.parse(iso)
      if (!Number.isFinite(time)) return ''
      const minutes = Math.max(0, Math.round((Date.now() - time) / 60000))
      if (minutes < 1) return t('time.justNow')
      if (minutes < 60) return format(t('time.minutes'), { n: minutes })
      const hours = Math.round(minutes / 60)
      if (hours < 24) return format(t('time.hours'), { n: hours })
      const days = Math.round(hours / 24)
      if (days < 31) return format(t('time.days'), { n: days })
      const months = Math.round(days / 30)
      if (months < 12) return format(t('time.months'), { n: months })
      return format(t('time.years'), { n: Math.round(days / 365) })
    }

    /** Resolve one Host route against the page's own base, keeping any proxy prefix. */
    function apiUrl(method) {
      const base = new URL(
        typeof document !== 'undefined' && typeof document.baseURI === 'string'
          ? document.baseURI
          : 'http://dsh.internal/',
      )
      base.search = ''
      base.hash = ''
      if (!base.pathname.endsWith('/')) base.pathname += '/'
      return new URL(`${API_ROUTE}/${method}`, base).href
    }

    async function callApi(method, payload, signal) {
      let response
      try {
        response = await fetch(apiUrl(method), {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload === undefined ? {} : payload),
          signal,
          credentials: 'same-origin',
        })
      } catch (error) {
        if (error !== null && typeof error === 'object' && error.name === 'AbortError') throw error
        throw new ApiError('network', 'The Harness Host is unreachable.')
      }
      let envelope = null
      try {
        envelope = await response.json()
      } catch {
        envelope = null
      }
      if (response.ok && envelope !== null && envelope.ok === true) return envelope.value
      const failure = envelope !== null && envelope.error !== undefined && envelope.error !== null ? envelope.error : {}
      throw new ApiError(
        typeof failure.code === 'string' ? failure.code : `http-${response.status}`,
        typeof failure.message === 'string' ? failure.message : `HTTP ${response.status}`,
        failure.details,
      )
    }

    function describeError(t, error) {
      if (!(error instanceof ApiError)) return t('error.generic')
      switch (error.code) {
        case 'invalid-token':
          return t('error.invalidToken')
        case 'token-malformed':
          return t('error.tokenMalformed')
        case 'rate-limited': {
          const resetAt = error.details !== null && typeof error.details === 'object' ? error.details.resetAt : undefined
          if (typeof resetAt !== 'number') return t('error.rateLimited')
          const when = new Date(resetAt)
          const time = `${String(when.getHours()).padStart(2, '0')}:${String(when.getMinutes()).padStart(2, '0')}`
          return `${t('error.rateLimited')} ${format(t('error.resetAt'), { time })}`
        }
        case 'network':
        case 'timeout':
          return t('error.network')
        case 'forbidden':
          return t('error.forbidden')
        case 'credentials-unavailable':
          return t('error.credentialsUnavailable')
        case 'token-required':
          return t('login.emptyToken')
        case 'github-error':
          return t('error.github')
        case 'http-404':
          return t('error.hostUnreachable')
        default:
          return error.message === '' ? t('error.generic') : error.message
      }
    }

    function Spinner() {
      return h('span', { className: 'dsg-spinner', 'aria-hidden': true })
    }

    function Style() {
      return h('style', null, CSS)
    }

    function Alert({ message }) {
      return h('div', { className: 'dsg-alert', role: 'alert' }, message)
    }

    function StarGlyph({ size = 12 }) {
      return h(
        'svg',
        { width: size, height: size, viewBox: '0 0 16 16', 'aria-hidden': true, focusable: 'false' },
        h('path', {
          fill: 'currentColor',
          d: 'M8 1.6l1.9 3.9 4.3.6-3.1 3 0.7 4.3L8 11.4l-3.8 2 0.7-4.3-3.1-3 4.3-.6z',
        }),
      )
    }

    /** GitHub's Octocat mark: one silhouette, filled with the surrounding ink. */
    function OctocatGlyph({ size = 16 }) {
      return h(
        'svg',
        { width: size, height: size, viewBox: '0 0 16 16', 'aria-hidden': true, focusable: 'false' },
        h('path', {
          fill: 'currentColor',
          d: 'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z',
        }),
      )
    }

    function BackGlyph({ size = 14 }) {
      return h(
        'svg',
        { width: size, height: size, viewBox: '0 0 16 16', 'aria-hidden': true, focusable: 'false' },
        h('path', {
          d: 'M9.6 3.4L5 8l4.6 4.6',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.6,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      )
    }

    function SearchGlyph({ size = 14 }) {
      return h(
        'svg',
        { width: size, height: size, viewBox: '0 0 16 16', 'aria-hidden': true, focusable: 'false' },
        h('circle', { cx: 7, cy: 7, r: 4.6, fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 }),
        h('path', {
          d: 'M10.4 10.4l3.1 3.1',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.6,
          strokeLinecap: 'round',
        }),
      )
    }

    function ChevronGlyph({ direction, size = 14 }) {
      const path = direction === 'left' ? 'M9.8 3.6L5.4 8l4.4 4.4' : 'M6.2 3.6L10.6 8l-4.4 4.4'
      return h(
        'svg',
        { width: size, height: size, viewBox: '0 0 16 16', 'aria-hidden': true, focusable: 'false' },
        h('path', {
          d: path,
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.7,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      )
    }

    function ExternalGlyph({ size = 13 }) {
      return h(
        'svg',
        { width: size, height: size, viewBox: '0 0 16 16', 'aria-hidden': true, focusable: 'false' },
        h('path', {
          d: 'M6.4 3.6H3.6v8.8h8.8V9.6',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.6,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
        h('path', {
          d: 'M9.4 3.6h3v3M12.4 3.6L7.6 8.4',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.6,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      )
    }

    function ChevronDownGlyph({ size = 12 }) {
      return h(
        'svg',
        { width: size, height: size, viewBox: '0 0 16 16', 'aria-hidden': true, focusable: 'false' },
        h('path', {
          d: 'M3.6 6.2L8 10.6l4.4-4.4',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.6,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      )
    }

    function IssueGlyph({ size = 14 }) {
      return h(
        'svg',
        { width: size, height: size, viewBox: '0 0 16 16', 'aria-hidden': true, focusable: 'false' },
        h('circle', { cx: 8, cy: 8, r: 6.1, fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 }),
        h('circle', { cx: 8, cy: 8, r: 1.6, fill: 'currentColor' }),
      )
    }

    function CodeGlyph({ size = 14 }) {
      return h(
        'svg',
        { width: size, height: size, viewBox: '0 0 16 16', 'aria-hidden': true, focusable: 'false' },
        h('path', {
          d: 'M5.6 4.4L2 8l3.6 3.6M10.4 4.4L14 8l-3.6 3.6',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.6,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      )
    }

    function CopyGlyph({ size = 14 }) {
      return h(
        'svg',
        { width: size, height: size, viewBox: '0 0 16 16', 'aria-hidden': true, focusable: 'false' },
        h('rect', {
          x: 5.5,
          y: 5.5,
          width: 8,
          height: 8,
          rx: 1.6,
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.5,
        }),
        h('path', {
          d: 'M10.5 3.6H4.2c-.6 0-1.1.5-1.1 1.1v6.3',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.5,
          strokeLinecap: 'round',
        }),
      )
    }

    function CheckGlyph({ size = 14 }) {
      return h(
        'svg',
        { width: size, height: size, viewBox: '0 0 16 16', 'aria-hidden': true, focusable: 'false' },
        h('path', {
          d: 'M3.2 8.4l3 3 6.6-6.8',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.7,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      )
    }

    function GlobeGlyph({ size = 14 }) {
      return h(
        'svg',
        { width: size, height: size, viewBox: '0 0 16 16', 'aria-hidden': true, focusable: 'false' },
        h('circle', { cx: 8, cy: 8, r: 6, fill: 'none', stroke: 'currentColor', strokeWidth: 1.4 }),
        h('path', {
          d: 'M2 8h12M8 2c1.8 1.7 2.8 3.8 2.8 6s-1 4.3-2.8 6c-1.8-1.7-2.8-3.8-2.8-6s1-4.3 2.8-6z',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.2,
        }),
      )
    }

    function DesktopGlyph({ size = 14 }) {
      return h(
        'svg',
        { width: size, height: size, viewBox: '0 0 16 16', 'aria-hidden': true, focusable: 'false' },
        h('rect', {
          x: 2.2,
          y: 3.2,
          width: 11.6,
          height: 8,
          rx: 1.4,
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.4,
        }),
        h('path', {
          d: 'M6 13.6h4M8 11.2v2.4',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.4,
          strokeLinecap: 'round',
        }),
      )
    }

    function DownloadGlyph({ size = 14 }) {
      return h(
        'svg',
        { width: size, height: size, viewBox: '0 0 16 16', 'aria-hidden': true, focusable: 'false' },
        h('path', {
          d: 'M8 2.4v7.2M4.8 6.6L8 9.8l3.2-3.2M3.2 12.4h9.6',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.5,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      )
    }

    function RefreshGlyph({ size = 14 }) {
      return h(
        'svg',
        { width: size, height: size, viewBox: '0 0 16 16', 'aria-hidden': true, focusable: 'false' },
        h('path', {
          d: 'M13.1 8a5.1 5.1 0 1 1-1.5-3.6',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.6,
          strokeLinecap: 'round',
        }),
        h('path', {
          d: 'M13.4 2.6v3.3H10.1',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.6,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      )
    }

    function ForkGlyph({ size = 11 }) {
      return h(
        'svg',
        { width: size, height: size, viewBox: '0 0 16 16', 'aria-hidden': true, focusable: 'false' },
        h('circle', { cx: 4, cy: 3.2, r: 1.7, fill: 'none', stroke: 'currentColor', strokeWidth: 1.4 }),
        h('circle', { cx: 12, cy: 3.2, r: 1.7, fill: 'none', stroke: 'currentColor', strokeWidth: 1.4 }),
        h('circle', { cx: 8, cy: 12.8, r: 1.7, fill: 'none', stroke: 'currentColor', strokeWidth: 1.4 }),
        h('path', {
          d: 'M4 4.9v1.3c0 1.8 1.5 3.3 3.3 3.3h1.4c1.8 0 3.3-1.5 3.3-3.3V4.9M8 9.5v1.6',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.4,
          strokeLinecap: 'round',
        }),
      )
    }

    /**
     * A circular avatar drawn as a background image on a round span: the shape
     * never depends on how an image paints, and a failed request leaves the
     * neutral circle instead of a broken-image glyph.
     */
    function RoundAvatar({ url, label, size }) {
      const initial = label === '' ? '?' : label.slice(0, 1).toUpperCase()
      return h(
        'span',
        {
          className: 'dsg-round-avatar',
          role: 'img',
          'aria-label': label,
          style: {
            display: 'inline-flex',
            flex: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundColor: 'var(--dsw-alias-bg-layer-2)',
            backgroundImage: url === '' ? 'none' : `url("${url}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'var(--dsw-alias-label-secondary)',
            fontSize: size > 40 ? '16px' : '13px',
            fontWeight: 600,
          },
        },
        url === '' ? initial : null,
      )
    }

    function Avatar({ profile }) {
      const login = profile !== null && profile !== undefined && typeof profile.login === 'string' ? profile.login : ''
      const avatarUrl =
        profile !== null && profile !== undefined && typeof profile.avatarUrl === 'string' ? profile.avatarUrl : ''
      return h(RoundAvatar, { url: avatarUrl, label: login, size: 48 })
    }

    function RepoMeta({ repo, t, locale }) {
      return h(
        'div',
        { className: 'dsg-meta' },
        repo.language === ''
          ? null
          : h('span', { className: 'dsg-meta-item' }, h('span', { className: 'dsg-dot' }), repo.language),
        repo.forks > 0
          ? h('span', { className: 'dsg-meta-item', title: t('repo.forks') }, h(ForkGlyph), compactNumber(repo.forks, locale))
          : null,
        repo.createdAt === '' ? null : h('span', { className: 'dsg-meta-item' }, relativeTime(t, repo.createdAt)),
      )
    }

    /** The repository owner's avatar, falling back to its initial. */
    function OwnerAvatar({ repo }) {
      return h(RoundAvatar, { url: repo.avatarUrl, label: repo.owner, size: 32 })
    }

    /** The star toggle GitHub shows beside a repository, with its live count. */
    function StarButton({ t, locale, starred, busy, count, onClick }) {
      return h(
        'button',
        {
          className: starred === true ? 'dsg-star-btn dsg-star-btn-on' : 'dsg-star-btn',
          type: 'button',
          onClick,
          disabled: busy === true,
          'aria-pressed': starred === true,
          title: starred === true ? t('star.unstar') : t('star.star'),
        },
        busy === true ? h(Spinner) : h(StarGlyph, { size: 14 }),
        h('span', { className: 'dsg-star-count' }, compactNumber(count, locale)),
      )
    }

    /** One numeric repository statistic with its label. */
    function Stat({ label, value }) {
      return h(
        'div',
        { className: 'dsg-stat' },
        h('span', { className: 'dsg-stat-value' }, value),
        h('span', { className: 'dsg-stat-label' }, label),
      )
    }

    /** Colors used for the language bar and legend, in the order the languages arrive. */
    const LANG_COLORS = ['#3178c6', '#f1e05a', '#e34c26', '#563d7c', '#41b883', '#b07219']

    /**
     * Panel state that outlives the slot component: leaving the plugin page for a
     * conversation unmounts it, so the current view, open repository page, search
     * paging, and scroll offsets live here and are restored on the next mount.
     */
    const PANEL_STATE = {
      view: { kind: 'browse' },
      searchText: '',
      detail: null,
      searchPages: {},
      repoViews: {},
      scroll: {},
    }

    function formatBytes(bytes) {
      if (!Number.isFinite(bytes) || bytes <= 0) return ''
      const units = ['B', 'KB', 'MB', 'GB']
      let value = bytes
      let unit = 0
      while (value >= 1024 && unit < units.length - 1) {
        value /= 1024
        unit += 1
      }
      return `${value >= 10 || unit === 0 ? Math.round(value) : value.toFixed(1)} ${units[unit]}`
    }

    function FileGlyph({ folder, size = 16 }) {
      if (folder === true) {
        return h(
          'svg',
          { width: size, height: size, viewBox: '0 0 16 16', 'aria-hidden': true, focusable: 'false' },
          h('path', {
            fill: 'currentColor',
            d: 'M1.75 2.5A1.25 1.25 0 0 1 3 1.25h3.1c.42 0 .82.2 1.07.55l.75 1c.1.14.26.2.42.2h4.16A1.25 1.25 0 0 1 13.75 4.25v1H1.75v-2.75z',
          }),
          h('path', {
            fill: 'currentColor',
            opacity: 0.55,
            d: 'M1.75 6h12.5v6.5A1.25 1.25 0 0 1 13 13.75H3A1.25 1.25 0 0 1 1.75 12.5V6z',
          }),
        )
      }
      return h(
        'svg',
        { width: size, height: size, viewBox: '0 0 16 16', 'aria-hidden': true, focusable: 'false' },
        h('path', {
          fill: 'currentColor',
          d: 'M3.75 1.5h4.9L13 5.85v8.4c0 .41-.34.75-.75.75h-8.5a.75.75 0 0 1-.75-.75V2.25c0-.41.34-.75.75-.75z',
          opacity: 0.55,
        }),
        h('path', { fill: 'currentColor', d: 'M8.75 1.5v3.6c0 .42.33.75.75.75h3.4L8.75 1.5z' }),
      )
    }

    /** Inline Markdown spans: code, bold, italic, and links. */
    function renderInline(text, prefix) {
      const nodes = []
      const pattern = /(`[^`]*`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)]+\))/g
      let last = 0
      let match
      let index = 0
      while ((match = pattern.exec(text)) !== null) {
        if (match.index > last) nodes.push(text.slice(last, match.index))
        const token = match[0]
        const key = `${prefix}-${index}`
        if (token.startsWith('`')) nodes.push(h('code', { key }, token.slice(1, -1)))
        else if (token.startsWith('**')) nodes.push(h('strong', { key }, token.slice(2, -2)))
        else if (token.startsWith('*')) nodes.push(h('em', { key }, token.slice(1, -1)))
        else {
          const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token)
          if (link === null) nodes.push(token)
          else {
            nodes.push(
              h(
                'a',
                { key, href: link[2], target: '_blank', rel: 'noreferrer noopener' },
                link[1],
              ),
            )
          }
        }
        last = match.index + token.length
        index += 1
      }
      if (last < text.length) nodes.push(text.slice(last))
      return nodes.length === 0 ? text : nodes
    }

    /** A compact Markdown block renderer for README previews. */
    function Markdown({ text }) {
      const lines = String(text).replace(/\r\n/g, '\n').split('\n')
      const blocks = []
      let index = 0
      let key = 0
      while (index < lines.length) {
        const line = lines[index]
        if (line.trim() === '') {
          index += 1
          continue
        }
        if (/^```/.test(line)) {
          const code = []
          index += 1
          while (index < lines.length && !/^```/.test(lines[index])) {
            code.push(lines[index])
            index += 1
          }
          index += 1
          blocks.push(
            h('pre', { key: `md-${key++}`, className: 'dsg-md-pre' }, h('code', null, code.join('\n'))),
          )
          continue
        }
        const heading = /^(#{1,6})\s+(.*)$/.exec(line)
        if (heading !== null) {
          const level = Math.min(6, heading[1].length)
          blocks.push(h(`h${level}`, { key: `md-${key++}` }, renderInline(heading[2], `md-h-${key}`)))
          index += 1
          continue
        }
        if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
          blocks.push(h('hr', { key: `md-${key++}` }))
          index += 1
          continue
        }
        if (/^>\s?/.test(line)) {
          const quoted = []
          while (index < lines.length && /^>\s?/.test(lines[index])) {
            quoted.push(lines[index].replace(/^>\s?/, ''))
            index += 1
          }
          blocks.push(
            h('blockquote', { key: `md-${key++}` }, h('p', null, renderInline(quoted.join(' '), `md-q-${key}`))),
          )
          continue
        }
        if (/^[-*+]\s+/.test(line)) {
          const items = []
          while (index < lines.length && /^[-*+]\s+/.test(lines[index])) {
            items.push(
              h(
                'li',
                { key: `md-li-${index}` },
                renderInline(lines[index].replace(/^[-*+]\s+/, ''), `md-li-${index}`),
              ),
            )
            index += 1
          }
          blocks.push(h('ul', { key: `md-${key++}` }, ...items))
          continue
        }
        if (/^\d+\.\s+/.test(line)) {
          const items = []
          while (index < lines.length && /^\d+\.\s+/.test(lines[index])) {
            items.push(
              h(
                'li',
                { key: `md-li-${index}` },
                renderInline(lines[index].replace(/^\d+\.\s+/, ''), `md-li-${index}`),
              ),
            )
            index += 1
          }
          blocks.push(h('ol', { key: `md-${key++}` }, ...items))
          continue
        }
        const paragraph = []
        while (
          index < lines.length &&
          lines[index].trim() !== '' &&
          !/^(#{1,6})\s+/.test(lines[index]) &&
          !/^```/.test(lines[index]) &&
          !/^[-*+]\s+/.test(lines[index]) &&
          !/^\d+\.\s+/.test(lines[index]) &&
          !/^>\s?/.test(lines[index])
        ) {
          paragraph.push(lines[index])
          index += 1
        }
        blocks.push(h('p', { key: `md-${key++}` }, renderInline(paragraph.join(' '), `md-p-${key}`)))
      }
      return h('div', { className: 'dsg-markdown' }, ...blocks)
    }

    /**
     * One repository row or grid card: owner avatar, owner and repository name
     * on separate lines, description, metadata, and the star toggle on the right.
     * Opening the card stays inside the plugin.
     */
    function RepoCard({ repo, t, locale, layout, starred, starBusy, onStar, onOpen }) {
      const shortName = repo.name === '' ? repo.fullName.split('/').pop() : repo.name
      const count = repo.stars + (starred === true ? 1 : 0)
      return h(
        'article',
        { className: layout === 'grid' ? 'dsg-card' : 'dsg-card dsg-card-row' },
        h('button', {
          className: 'dsg-card-cover',
          type: 'button',
          tabIndex: -1,
          'aria-hidden': true,
          onClick: onOpen,
        }),
        h(
          'div',
          { className: 'dsg-card-head' },
          h(OwnerAvatar, { repo }),
          h(
            'div',
            { className: 'dsg-card-id' },
            repo.owner === ''
              ? null
              : h(
                  'span',
                  {
                    className: 'dsg-card-owner',
                    title: repo.owner,
                    style: { color: 'var(--dsw-alias-link)' },
                  },
                  repo.owner,
                ),
            h(
              'button',
              {
                className: 'dsg-card-name',
                type: 'button',
                title: repo.fullName,
                onClick: onOpen,
              },
              shortName,
            ),
          ),
          h(StarButton, {
            t,
            locale,
            starred: starred === true,
            busy: starBusy === true,
            count,
            onClick: onStar,
          }),
        ),
        h('p', { className: 'dsg-card-desc' }, repo.description === '' ? t('repo.noDescription') : repo.description),
        h(RepoMeta, { repo, t, locale }),
      )
    }

    /** Bundles the panel's remote state, translations, and DOM shell. */
    function createPanel(ctx) {
      function useTranslate() {
        const [snapshot, setSnapshot] = useState(() => ctx.locale.getSnapshot())
        useEffect(() => ctx.locale.subscribe(() => setSnapshot(ctx.locale.getSnapshot())), [])
        return useMemo(() => ctx.locale.bind(NS), [snapshot])
      }

      /** The active DSH locale id, for Intl formatting that should follow the interface language. */
      function useLocale() {
        const [snapshot, setSnapshot] = useState(() => ctx.locale.getSnapshot())
        useEffect(() => ctx.locale.subscribe(() => setSnapshot(ctx.locale.getSnapshot())), [])
        return snapshot.active
      }

      function LoginCard({ t, onSignedIn }) {
        const [token, setToken] = useState('')
        const [busy, setBusy] = useState(false)
        const [error, setError] = useState('')
        const inputRef = useRef(null)

        const submit = async (event) => {
          event.preventDefault()
          if (busy) return
          const value = token.trim()
          if (value === '') {
            setError(t('login.emptyToken'))
            inputRef.current?.focus()
            return
          }
          setBusy(true)
          setError('')
          try {
            const next = await callApi('signIn', { token: value })
            setToken('')
            onSignedIn(next.profile)
          } catch (failure) {
            setError(describeError(t, failure))
          } finally {
            setBusy(false)
          }
        }

        return h(
          'section',
          { className: 'dsg-login', 'aria-labelledby': 'dsg-login-title' },
          h('h2', { id: 'dsg-login-title' }, t('login.title')),
          h('p', null, t('login.intro')),
          h(
            'ol',
            { className: 'dsg-steps' },
            h(
              'li',
              null,
              t('login.step1'),
              ' ',
              h(
                'a',
                {
                  className: 'dsg-link',
                  href: 'https://github.com/settings/tokens',
                  target: '_blank',
                  rel: 'noreferrer noopener',
                },
                t('login.openTokens'),
              ),
            ),
            h('li', null, t('login.step2')),
          ),
          h(
            'form',
            { className: 'dsg-field', onSubmit: submit },
            h('label', { className: 'dsg-label', htmlFor: 'dsg-github-token' }, t('login.tokenLabel')),
            h('input', {
              id: 'dsg-github-token',
              ref: inputRef,
              className: 'dsg-input',
              type: 'password',
              value: token,
              placeholder: t('login.tokenPlaceholder'),
              autoComplete: 'new-password',
              spellCheck: false,
              onChange: (event) => setToken(event.target.value),
            }),
            h(
              'button',
              { className: 'dsg-btn dsg-btn-primary', type: 'submit', disabled: busy },
              busy ? h(Spinner) : null,
              busy ? t('login.busy') : t('login.submit'),
            ),
          ),
          error === '' ? null : h(Alert, { message: error }),
        )
      }

      function AccountArea({ t, auth }) {
        if (auth.status === 'loading') {
          return h('div', { className: 'dsg-account' }, h('span', { className: 'dsg-account-state' }, h(Spinner), t('account.loading')))
        }
        return null
      }

      /** The signed-in account shown like a GitHub profile header: big avatar, bio, meta, counts, actions. */
      function AccountCard({ t, locale, profile, onSignOut, signingOut }) {
        const name = profile.name === '' ? profile.login : profile.name
        const handle = `@${profile.login}`
        const profileUrl = profile.htmlUrl === '' ? '' : profile.htmlUrl
        const stats = []
        if (typeof profile.publicRepos === 'number') {
          stats.push({
            key: 'repos',
            value: compactNumber(profile.publicRepos, locale),
            label: t('profile.repos'),
            href: profileUrl === '' ? '' : `${profileUrl}?tab=repositories`,
          })
        }
        if (typeof profile.followers === 'number') {
          stats.push({
            key: 'followers',
            value: compactNumber(profile.followers, locale),
            label: t('profile.followers'),
            href: profileUrl === '' ? '' : `${profileUrl}?tab=followers`,
          })
        }
        if (typeof profile.following === 'number') {
          stats.push({
            key: 'following',
            value: compactNumber(profile.following, locale),
            label: t('profile.following'),
            href: profileUrl === '' ? '' : `${profileUrl}?tab=following`,
          })
        }
        const meta = []
        if (profile.company !== '') meta.push(profile.company)
        if (profile.location !== '') meta.push(profile.location)
        const joined =
          typeof profile.createdAt === 'string' && profile.createdAt !== ''
            ? String(new Date(profile.createdAt).getFullYear())
            : ''
        return h(
          'section',
          { className: 'dsg-profile', 'aria-label': t('me.label') },
          h(RoundAvatar, { url: profile.avatarUrl, label: profile.login, size: 76 }),
          h(
            'div',
            { className: 'dsg-profile-main' },
            h(
              'div',
              { className: 'dsg-profile-name-row' },
              h('h1', { className: 'dsg-profile-name' }, name),
              profile.htmlUrl === ''
                ? h('span', { className: 'dsg-profile-login' }, handle)
                : h(
                    'a',
                    {
                      className: 'dsg-profile-login',
                      href: profile.htmlUrl,
                      target: '_blank',
                      rel: 'noreferrer noopener',
                    },
                    handle,
                  ),
            ),
            profile.bio === '' ? null : h('p', { className: 'dsg-profile-bio' }, profile.bio),
            meta.length === 0 && joined === '' && profile.blog === ''
              ? null
              : h(
                  'div',
                  { className: 'dsg-profile-meta' },
                  ...meta.map((item) => h('span', { key: item, className: 'dsg-profile-meta-item' }, item)),
                  profile.blog === ''
                    ? null
                    : h(
                        'a',
                        {
                          className: 'dsg-profile-meta-link',
                          href: /^https?:\/\//.test(profile.blog) ? profile.blog : `https://${profile.blog}`,
                          target: '_blank',
                          rel: 'noreferrer noopener',
                        },
                        profile.blog,
                      ),
                  joined === ''
                    ? null
                    : h('span', { className: 'dsg-profile-meta-item' }, format(t('profile.joined'), { year: joined })),
                ),
            stats.length === 0
              ? null
              : h(
                  'div',
                  { className: 'dsg-profile-stats' },
                  ...stats.map((stat) =>
                    stat.href === ''
                      ? h(
                          'span',
                          { key: stat.key, className: 'dsg-profile-stat' },
                          h('b', null, stat.value),
                          ' ',
                          stat.label,
                        )
                      : h(
                          'a',
                          {
                            key: stat.key,
                            className: 'dsg-profile-stat',
                            href: stat.href,
                            target: '_blank',
                            rel: 'noreferrer noopener',
                          },
                          h('b', null, stat.value),
                          ' ',
                          stat.label,
                        ),
                  ),
                ),
            h(
              'div',
              { className: 'dsg-profile-actions' },
              h(
                'a',
                {
                  className: 'dsg-btn',
                  href: 'https://github.com/settings/profile',
                  target: '_blank',
                  rel: 'noreferrer noopener',
                },
                t('profile.edit'),
              ),
              profile.htmlUrl === ''
                ? null
                : h(
                    'a',
                    { className: 'dsg-btn', href: profile.htmlUrl, target: '_blank', rel: 'noreferrer noopener' },
                    t('profile.view'),
                  ),
              h(
                'button',
                { className: 'dsg-btn', type: 'button', onClick: onSignOut, disabled: signingOut },
                signingOut ? h(Spinner) : null,
                t('account.signOut'),
              ),
            ),
          ),
        )
      }

      function Recommendations({ t, locale, recs, busy, onRefresh, starStates, onToggleStar, onOpen }) {
        const loading = recs.status === 'loading'
        const count = recs.items.length
        return h(
          'section',
          { className: 'dsg-section', 'aria-labelledby': 'dsg-recs-title' },
          h(
            'div',
            { className: 'dsg-section-head' },
            h(
              'div',
              null,
              h('h2', { id: 'dsg-recs-title' }, t('recs.title')),
              h(
                'p',
                { className: 'dsg-section-sub' },
                recs.cached === true ? `${t('recs.subtitle')} · ${t('recs.cached')}` : t('recs.subtitle'),
              ),
            ),
            h(
              'button',
              { className: 'dsg-btn', type: 'button', onClick: onRefresh, disabled: busy },
              busy ? h(Spinner) : h(RefreshGlyph),
              t('recs.refresh'),
            ),
          ),
          recs.error === '' ? null : h(Alert, { message: recs.error }),
          loading && count === 0
            ? h('div', { className: 'dsg-state', role: 'status' }, h(Spinner), t('recs.loading'))
            : count === 0
              ? recs.status === 'error'
                ? null
                : h('div', { className: 'dsg-state' }, t('recs.empty'))
              : h(
                  'div',
                  { className: 'dsg-grid', 'aria-busy': busy },
                  ...recs.items.map((repo) => {
                    const star = starStates[repo.fullName]
                    return h(RepoCard, {
                      key: repo.id || repo.url,
                      repo,
                      t,
                      locale,
                      layout: 'grid',
                      starred: star !== undefined && star.starred === true,
                      starBusy: star !== undefined && star.busy === true,
                      onStar: () => onToggleStar(repo),
                      onOpen: () => onOpen(repo),
                    })
                  }),
                ),
        )
      }

      /** The search field shared by the home page and the results page. */
      function SearchForm({ t, value, onChange, onSubmit }) {
        const submit = (event) => {
          event.preventDefault()
          const query = value.trim()
          if (query === '') return
          onSubmit(query)
        }
        return h(
          'form',
          { className: 'dsg-search-row', role: 'search', onSubmit: submit },
          h(
            'div',
            { className: 'dsg-search-field' },
            h('span', { className: 'dsg-search-glyph', 'aria-hidden': true }, h(SearchGlyph)),
            h('input', {
              className: 'dsg-search-input',
              type: 'search',
              value,
              placeholder: t('search.placeholder'),
              'aria-label': t('search.title'),
              spellCheck: false,
              onChange: (event) => onChange(event.target.value),
            }),
          ),
          h(
            'button',
            { className: 'dsg-btn dsg-btn-primary', type: 'submit', disabled: value.trim() === '' },
            t('search.action'),
          ),
        )
      }

      /** The pager's page-number window: first page, a few around the current one, last page. */
      function pageWindow(current, total) {
        if (total <= 7) {
          const pages = []
          for (let page = 1; page <= total; page += 1) pages.push(page)
          return pages
        }
        const pages = [1]
        const start = Math.max(2, current - 2)
        const end = Math.min(total - 1, current + 2)
        if (start > 2) pages.push('gap-start')
        for (let page = start; page <= end; page += 1) pages.push(page)
        if (end < total - 1) pages.push('gap-end')
        pages.push(total)
        return pages
      }

      function SearchLauncher({ t, value, onChange, onOpen }) {
        return h(
          'section',
          { className: 'dsg-section', 'aria-labelledby': 'dsg-search-title' },
          h(
            'div',
            { className: 'dsg-section-head' },
            h('div', null, h('h2', { id: 'dsg-search-title' }, t('search.title'))),
          ),
          h(SearchForm, { t, value, onChange, onSubmit: onOpen }),
          h('p', { className: 'dsg-hint' }, t('search.hint')),
        )
      }

      /**
       * The search-results page: its own view with a back action and paging,
       * reached from the search launcher and replaced by the launcher on back.
       */
      function SearchResultsPage({ t, locale, query, notice, initialPage, initialPerPage, onBack, onSearch, starStates, onToggleStar, onOpen }) {
        const [perPage, setPerPage] = useState(initialPerPage ?? 10)
        const [page, setPage] = useState(initialPage ?? 1)
        const [jump, setJump] = useState('')
        const [draft, setDraft] = useState(query)
        const [state, setState] = useState({
          status: 'loading',
          items: [],
          total: 0,
          page: 1,
          pageCount: 1,
          error: '',
          capped: false,
        })
        const requestId = useRef(0)

        useEffect(() => {
          PANEL_STATE.searchPages[query] = { page, perPage }
        }, [query, page, perPage])

        useEffect(() => {
          const controller = new AbortController()
          const id = requestId.current + 1
          requestId.current = id
          setState((current) => ({ ...current, status: 'loading', error: '' }))
          void (async () => {
            try {
              const value = await callApi('search', { q: query, page, perPage }, controller.signal)
              if (id !== requestId.current) return
              setState({
                status: 'ready',
                items: value.items,
                total: value.total,
                page: value.page,
                pageCount: value.pageCount,
                error: '',
                capped: value.capped === true,
              })
            } catch (failure) {
              if (failure !== null && typeof failure === 'object' && failure.name === 'AbortError') return
              if (id !== requestId.current) return
              setState({
                status: 'error',
                items: [],
                total: 0,
                page,
                pageCount: 1,
                error: describeError(t, failure),
                capped: false,
              })
            }
          })()
          return () => controller.abort()
        }, [query, page, perPage, t])

        const loading = state.status === 'loading'
        const pageCount = Math.max(1, state.pageCount)
        const currentPage = state.page

        const goTo = (next) => {
          const clamped = Math.min(pageCount, Math.max(1, next))
          if (clamped !== page) setPage(clamped)
        }
        const submitJump = (event) => {
          event.preventDefault()
          const parsed = Number.parseInt(jump, 10)
          if (Number.isFinite(parsed)) goTo(parsed)
          setJump('')
        }
        const submitSearch = (nextQuery) => {
          if (nextQuery === query) {
            setPage(1)
            return
          }
          onSearch(nextQuery)
        }

        return h(
          'div',
          { className: 'dsg-subpage' },
          h(
            'div',
            { className: 'dsg-subhead' },
            h(
              'button',
              { className: 'dsg-btn dsg-back', type: 'button', onClick: onBack },
              h(BackGlyph),
              t('results.back'),
            ),
            h('div', { className: 'dsg-subhead-text' }, h('h1', null, t('results.title'))),
          ),
          h(SearchForm, { t, value: draft, onChange: setDraft, onSubmit: submitSearch }),
          h(
            'div',
            { className: 'dsg-tabs' },
            h(
              'span',
              { className: 'dsg-tab dsg-tab-active' },
              t('results.tab'),
              state.status === 'ready'
                ? h('span', { className: 'dsg-tab-count' }, compactNumber(state.total, locale))
                : null,
            ),
          ),
          notice === '' ? null : h(Alert, { message: notice }),
          state.error === '' ? null : h(Alert, { message: state.error }),
          loading ? h('div', { className: 'dsg-state', role: 'status' }, h(Spinner), t('search.loading')) : null,
          state.items.length === 0
            ? loading || state.error !== ''
              ? null
              : h('div', { className: 'dsg-state' }, t('search.empty'))
            : h(
                'div',
                { className: 'dsg-results', 'aria-busy': loading },
                ...state.items.map((repo) => {
                  const star = starStates[repo.fullName]
                  return h(RepoCard, {
                    key: repo.id || repo.url,
                    repo,
                    t,
                    locale,
                    layout: 'row',
                    starred: star !== undefined && star.starred === true,
                    starBusy: star !== undefined && star.busy === true,
                    onStar: () => onToggleStar(repo),
                    onOpen: () => onOpen(repo),
                  })
                }),
              ),
          h(
            'nav',
            { className: 'dsg-pager', 'aria-label': t('results.pager') },
            h(
              'button',
              {
                className: 'dsg-page-btn',
                type: 'button',
                'aria-label': t('results.prev'),
                disabled: loading || currentPage <= 1,
                onClick: () => goTo(currentPage - 1),
              },
              h(ChevronGlyph, { direction: 'left' }),
            ),
            ...pageWindow(currentPage, pageCount).map((entry) =>
              typeof entry === 'string'
                ? h('span', { key: entry, className: 'dsg-page-gap', 'aria-hidden': true }, '…')
                : h(
                    'button',
                    {
                      key: entry,
                      className: entry === currentPage ? 'dsg-page-btn dsg-page-btn-current' : 'dsg-page-btn',
                      type: 'button',
                      'aria-current': entry === currentPage ? 'page' : undefined,
                      disabled: loading,
                      onClick: () => goTo(entry),
                    },
                    String(entry),
                  ),
            ),
            h(
              'button',
              {
                className: 'dsg-page-btn',
                type: 'button',
                'aria-label': t('results.next'),
                disabled: loading || currentPage >= pageCount,
                onClick: () => goTo(currentPage + 1),
              },
              h(ChevronGlyph, { direction: 'right' }),
            ),
          ),
          h(
            'div',
            { className: 'dsg-pager-tools' },
            h(
              'span',
              { role: 'status', 'aria-live': 'polite' },
              format(t('results.page'), { page: currentPage, pages: pageCount }),
            ),
            h(
              'form',
              { className: 'dsg-jump', onSubmit: submitJump },
              h('label', { className: 'dsg-jump-label', htmlFor: 'dsg-page-jump' }, t('results.jump')),
              h('input', {
                id: 'dsg-page-jump',
                className: 'dsg-input dsg-jump-input',
                type: 'number',
                min: 1,
                max: pageCount,
                value: jump,
                onChange: (event) => setJump(event.target.value),
              }),
              h('span', { className: 'dsg-jump-unit' }, t('results.jumpUnit')),
              h('button', { className: 'dsg-btn', type: 'submit' }, t('results.go')),
            ),
            h(
              'label',
              { className: 'dsg-pagesize' },
              h('span', null, t('results.perPage')),
              h(
                'select',
                {
                  className: 'dsg-select',
                  value: perPage,
                  'aria-label': t('results.perPage'),
                  onChange: (event) => {
                    setPerPage(Number(event.target.value))
                    setPage(1)
                  },
                },
                h('option', { value: 10 }, '10'),
                h('option', { value: 20 }, '20'),
                h('option', { value: 50 }, '50'),
              ),
              h('span', null, t('results.perPageUnit')),
            ),
          ),
          state.capped ? h('p', { className: 'dsg-hint' }, t('results.capped')) : null,
        )
      }

      function BranchIcon({ size = 13 }) {
        return h(
          'svg',
          { width: size, height: size, viewBox: '0 0 16 16', 'aria-hidden': true, focusable: 'false' },
          h('circle', { cx: 4.2, cy: 3.4, r: 1.7, fill: 'none', stroke: 'currentColor', strokeWidth: 1.4 }),
          h('circle', { cx: 11.8, cy: 3.4, r: 1.7, fill: 'none', stroke: 'currentColor', strokeWidth: 1.4 }),
          h('circle', { cx: 4.2, cy: 12.6, r: 1.7, fill: 'none', stroke: 'currentColor', strokeWidth: 1.4 }),
          h('path', {
            d: 'M4.2 5.1v5.8M11.8 5.1v1c0 1.3-1 2.3-2.3 2.3H6.5',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 1.4,
            strokeLinecap: 'round',
          }),
        )
      }

      /** One file's content, line-numbered, with a way back to the directory. */
      function FileView({ t, locale, owner, name, branch, path, onClose }) {
        const [state, setState] = useState({ status: 'loading', file: undefined, error: '' })
        const [attempt, setAttempt] = useState(0)

        useEffect(() => {
          const controller = new AbortController()
          let alive = true
          setState({ status: 'loading', file: undefined, error: '' })
          void (async () => {
            try {
              const value = await callApi('read', { owner, name, path }, controller.signal)
              if (alive) setState({ status: 'ready', file: value, error: '' })
            } catch (failure) {
              if (failure !== null && typeof failure === 'object' && failure.name === 'AbortError') return
              if (!alive) return
              setState({ status: 'error', file: undefined, error: describeError(t, failure) })
            }
          })()
          return () => {
            alive = false
            controller.abort()
          }
        }, [owner, name, path, attempt, t])

        const file = state.file
        const segments = path.split('/')
        const lines = file === undefined ? [] : file.text.split('\n')
        const shown = lines.slice(0, 5000)
        const external = `https://github.com/${owner}/${name}/blob/${branch === '' ? 'HEAD' : branch}/${path}`

        return h(
          'div',
          { className: 'dsg-fileview' },
          h(
            'div',
            { className: 'dsg-fileview-head' },
            h('button', { className: 'dsg-btn', type: 'button', onClick: onClose }, h(BackGlyph), t('repo.backToFiles')),
            h('span', { className: 'dsg-fileview-path' }, segments.join(' / ')),
            h(
              'a',
              { className: 'dsg-btn', href: external, target: '_blank', rel: 'noreferrer noopener' },
              h(ExternalGlyph),
              t('detail.openExternal'),
            ),
          ),
          state.error === '' ? null : h(Alert, { message: state.error }),
          state.status === 'loading'
            ? h('div', { className: 'dsg-state', role: 'status' }, h(Spinner), t('repo.loadingFile'))
            : null,
          state.status === 'error'
            ? h(
                'button',
                { className: 'dsg-btn', type: 'button', onClick: () => setAttempt((value) => value + 1) },
                t('detail.retry'),
              )
            : null,
          file === undefined
            ? null
            : file.binary === true
              ? h('div', { className: 'dsg-state' }, t('repo.binary'))
              : h(
                  React.Fragment,
                  null,
                h(
                  'div',
                  { className: 'dsg-fileview-meta' },
                  h('span', null, formatBytes(file.size)),
                  h('span', null, format(t('repo.lines'), { n: lines.length })),
                  file.truncated ? h('span', null, t('detail.readmeTruncated')) : null,
                ),
                h(
                  'div',
                  { className: 'dsg-codebox' },
                  ...shown.map((line, index) =>
                    h(
                      'div',
                      { key: index, className: 'dsg-codeline' },
                      h('span', { className: 'dsg-lineno', 'aria-hidden': true }, String(index + 1)),
                      h('span', { className: 'dsg-linecode' }, line === '' ? ' ' : line),
                    ),
                  ),
                ),
              ),
        )
      }

      /** The GitHub-style repository page: files, code, README, and the about sidebar. */
      function RepoPage({ t, locale, repo, notice, starred, starBusy, onStar, onBack }) {
        const saved = PANEL_STATE.repoViews[repo.fullName] ?? {}
        const [detail, setDetail] = useState(undefined)
        const [detailError, setDetailError] = useState('')
        const [dir, setDir] = useState(() => ({ path: saved.dirPath ?? '', entries: [], status: 'loading', error: '' }))
        const [commit, setCommit] = useState(null)
        const [filter, setFilter] = useState(() => saved.filter ?? '')
        const [filePath, setFilePath] = useState(() => saved.filePath ?? null)
        const [attempt, setAttempt] = useState(0)
        const [tab, setTab] = useState(() => saved.tab ?? 'code')
        const [branch, setBranch] = useState(() => saved.branch ?? '')
        const [branches, setBranches] = useState({ status: 'idle', items: [], error: '' })
        const [branchOpen, setBranchOpen] = useState(false)
        const [branchFilter, setBranchFilter] = useState('')
        const [codeOpen, setCodeOpen] = useState(false)
        const [cloneKind, setCloneKind] = useState('https')
        const [copied, setCopied] = useState(false)
        const [issues, setIssues] = useState({ status: 'idle', items: [], error: '' })
        const branchWrap = useRef(null)
        const codeWrap = useRef(null)
        const shortName = repo.name === '' ? repo.fullName.split('/').pop() : repo.name
        const owner = repo.owner === '' ? repo.fullName.split('/')[0] || '' : repo.owner

        // Close the branch and clone popovers on an outside click or Escape.
        useEffect(() => {
          if (!branchOpen && !codeOpen) return undefined
          const onPointerDown = (event) => {
            if (branchWrap.current !== null && !branchWrap.current.contains(event.target)) setBranchOpen(false)
            if (codeWrap.current !== null && !codeWrap.current.contains(event.target)) setCodeOpen(false)
          }
          const onKeyDown = (event) => {
            if (event.key === 'Escape') {
              setBranchOpen(false)
              setCodeOpen(false)
            }
          }
          document.addEventListener('pointerdown', onPointerDown)
          document.addEventListener('keydown', onKeyDown)
          return () => {
            document.removeEventListener('pointerdown', onPointerDown)
            document.removeEventListener('keydown', onKeyDown)
          }
        }, [branchOpen, codeOpen])

        // Remember the open repository's tab, branch, directory, and file for the next mount.
        useEffect(() => {
          PANEL_STATE.repoViews[repo.fullName] = { tab, branch, filePath, filter, dirPath: dir.path }
        }, [repo.fullName, tab, branch, filePath, filter, dir.path])

        useEffect(() => {
          const controller = new AbortController()
          let alive = true
          setDetailError('')
          void (async () => {
            try {
              const value = await callApi('repo', { owner, name: shortName }, controller.signal)
              if (alive) setDetail(value)
            } catch (failure) {
              if (failure !== null && typeof failure === 'object' && failure.name === 'AbortError') return
              if (!alive) return
              setDetail(undefined)
              setDetailError(describeError(t, failure))
            }
          })()
          return () => {
            alive = false
            controller.abort()
          }
        }, [owner, shortName, attempt, t])

        useEffect(() => {
          const controller = new AbortController()
          let alive = true
          setDir((current) => ({ ...current, status: 'loading', error: '' }))
          void (async () => {
            try {
              const value = await callApi('ls', { owner, name: shortName, path: dir.path, ref: branch }, controller.signal)
              if (alive) setDir({ path: value.path, entries: value.entries, status: 'ready', error: '' })
            } catch (failure) {
              if (failure !== null && typeof failure === 'object' && failure.name === 'AbortError') return
              if (!alive) return
              setDir((current) => ({ ...current, status: 'error', error: describeError(t, failure) }))
            }
          })()
          return () => {
            alive = false
            controller.abort()
          }
        }, [dir.path, branch, owner, shortName, attempt, t])

        useEffect(() => {
          const controller = new AbortController()
          let alive = true
          void (async () => {
            try {
              const value = await callApi('commit', { owner, name: shortName, ref: branch }, controller.signal)
              if (alive && value !== undefined && value !== null) setCommit(value)
            } catch {
              /* The commit row is optional. */
            }
          })()
          return () => {
            alive = false
            controller.abort()
          }
        }, [owner, shortName, branch])

        // Branches are fetched the first time the switcher opens.
        useEffect(() => {
          if (!branchOpen || branches.status !== 'idle') return
          setBranches({ status: 'loading', items: [], error: '' })
          void (async () => {
            try {
              const value = await callApi('branches', { owner, name: shortName })
              setBranches({ status: 'ready', items: value.branches, error: '' })
            } catch (failure) {
              setBranches({ status: 'error', items: [], error: describeError(t, failure) })
            }
          })()
        }, [branchOpen, owner, shortName])

        // Issues are fetched the first time the Issues tab opens.
        useEffect(() => {
          if (tab !== 'issues' || issues.status !== 'idle') return
          setIssues({ status: 'loading', items: [], error: '' })
          void (async () => {
            try {
              const value = await callApi('issues', { owner, name: shortName })
              setIssues({ status: 'ready', items: value.issues, error: '' })
            } catch (failure) {
              setIssues({ status: 'error', items: [], error: describeError(t, failure) })
            }
          })()
        }, [tab, owner, shortName])

        const navigate = (nextPath) => {
          if (nextPath === dir.path) return
          setFilter('')
          setDir({ path: nextPath, entries: [], status: 'loading', error: '' })
        }

        const stars = (detail === undefined ? repo.stars : detail.stars) + (starred === true ? 1 : 0)
        const description = detail !== undefined && detail.description !== '' ? detail.description : repo.description
        const topics = detail === undefined ? [] : detail.topics
        const visible =
          filter.trim() === ''
            ? dir.entries
            : dir.entries.filter((entry) => entry.name.toLowerCase().includes(filter.trim().toLowerCase()))
        const pathSegments = dir.path === '' ? [] : dir.path.split('/')
        const effectiveBranch =
          branch === '' ? (detail === undefined || detail.defaultBranch === '' ? 'main' : detail.defaultBranch) : branch
        const cloneUrl =
          cloneKind === 'ssh'
            ? `git@github.com:${owner}/${shortName}.git`
            : `https://github.com/${owner}/${shortName}.git`
        const zipUrl = `https://github.com/${owner}/${shortName}/archive/refs/heads/${effectiveBranch}.zip`
        const filteredBranches =
          branchFilter.trim() === ''
            ? branches.items
            : branches.items.filter((item) => item.name.toLowerCase().includes(branchFilter.trim().toLowerCase()))
        const selectBranch = (name) => {
          setBranchOpen(false)
          setBranchFilter('')
          if (name === effectiveBranch) return
          setBranch(name)
          setFilter('')
          setDir({ path: '', entries: [], status: 'loading', error: '' })
          setFilePath(null)
        }
        const copyClone = async () => {
          try {
            await navigator.clipboard.writeText(cloneUrl)
            setCopied(true)
          } catch {
            setCopied(false)
          }
        }

        const issueList = h(
          'div',
          { className: 'dsg-issue-panel' },
          issues.status === 'loading'
            ? h('div', { className: 'dsg-state', role: 'status' }, h(Spinner), t('repo.loadingIssues'))
            : null,
          issues.status === 'error' ? h(Alert, { message: issues.error }) : null,
          issues.status === 'ready' && issues.items.length === 0
            ? h('div', { className: 'dsg-state' }, t('repo.noIssues'))
            : null,
          issues.items.length === 0
            ? null
            : h(
                'div',
                { className: 'dsg-issue-list' },
                ...issues.items.map((issue) =>
                  h(
                    'div',
                    { key: issue.number, className: 'dsg-issue-row' },
                    h('span', { className: 'dsg-issue-icon' }, h(IssueGlyph)),
                    h(
                      'div',
                      { className: 'dsg-issue-main' },
                      h(
                        'a',
                        {
                          className: 'dsg-issue-title',
                          href: issue.url,
                          target: '_blank',
                          rel: 'noreferrer noopener',
                        },
                        issue.title,
                      ),
                      h(
                        'div',
                        { className: 'dsg-issue-meta' },
                        h('span', null, `#${issue.number}`),
                        issue.author === '' ? null : h('span', null, issue.author),
                        issue.createdAt === '' ? null : h('span', null, relativeTime(t, issue.createdAt)),
                        ...issue.labels.map((label) =>
                          h(
                            'span',
                            {
                              key: label.name,
                              className: 'dsg-label-pill',
                              style: { borderColor: `#${label.color}`, color: `#${label.color}` },
                            },
                            label.name,
                          ),
                        ),
                      ),
                    ),
                    issue.comments > 0
                      ? h('span', { className: 'dsg-issue-comments', title: t('repo.comments') }, String(issue.comments))
                      : null,
                  ),
                ),
              ),
          h(
            'a',
            {
              className: 'dsg-issue-more',
              href: `https://github.com/${owner}/${shortName}/issues`,
              target: '_blank',
              rel: 'noreferrer noopener',
            },
            t('repo.allIssues'),
          ),
        )

        const crumbs =
          dir.path === ''
            ? null
            : h(
                'div',
                { className: 'dsg-pathbar' },
                h(
                  'button',
                  { className: 'dsg-crumb-link', type: 'button', onClick: () => navigate('') },
                  shortName,
                ),
                ...pathSegments.map((segment, index) => {
                  const target = pathSegments.slice(0, index + 1).join('/')
                  return h(
                    React.Fragment,
                    { key: target },
                    h('span', { className: 'dsg-crumb-sep' }, '/'),
                    index === pathSegments.length - 1
                      ? h('span', { className: 'dsg-crumb-current' }, segment)
                      : h(
                          'button',
                          { className: 'dsg-crumb-link', type: 'button', onClick: () => navigate(target) },
                          segment,
                        ),
                  )
                }),
              )

        const table =
          dir.status === 'error'
            ? h(Alert, { message: dir.error })
            : h(
                'div',
                { className: 'dsg-filetable' },
                commit === null
                  ? null
                  : h(
                      'div',
                      { className: 'dsg-filetable-head' },
                      h(RoundAvatar, { url: commit.avatarUrl, label: commit.author, size: 20 }),
                      h('span', { className: 'dsg-commit-author' }, commit.author),
                      h('span', { className: 'dsg-commit-msg', title: commit.message }, commit.message),
                      h('span', { className: 'dsg-commit-time' }, commit.date === '' ? '' : relativeTime(t, commit.date)),
                    ),
                dir.status === 'loading' && dir.entries.length === 0
                  ? h('div', { className: 'dsg-state', role: 'status' }, h(Spinner), t('repo.loadingFiles'))
                  : visible.length === 0
                    ? h('div', { className: 'dsg-state' }, filter === '' ? t('repo.emptyDir') : t('repo.noMatch'))
                    : visible.map((entry) => {
                        const isFolder = entry.type === 'dir'
                        return h(
                          'div',
                          { key: entry.path, className: 'dsg-filerow' },
                          h('span', { className: 'dsg-fileicon' }, h(FileGlyph, { folder: isFolder })),
                          h(
                            'button',
                            {
                              className: 'dsg-filename',
                              type: 'button',
                              onClick: () => (isFolder ? navigate(entry.path) : setFilePath(entry.path)),
                            },
                            entry.name,
                          ),
                          h('span', { className: 'dsg-filesize' }, isFolder ? '' : formatBytes(entry.size)),
                        )
                      }),
              )

        const readme =
          detail === undefined || detail.readme === null
            ? null
            : h(
                'section',
                { className: 'dsg-readme-card' },
                h(
                  'div',
                  { className: 'dsg-readme-card-head' },
                  h(FileGlyph, { size: 14 }),
                  h('span', null, detail.readme.name),
                ),
                h(Markdown, { text: detail.readme.text }),
              )

        const readmeSkeleton =
          detail === undefined && detailError === ''
            ? h(
                'section',
                { className: 'dsg-readme-card', 'aria-hidden': true },
                h(
                  'div',
                  { className: 'dsg-readme-card-head' },
                  h('div', { className: 'dsg-skel dsg-skel-inline' }),
                ),
                h(
                  'div',
                  { className: 'dsg-markdown' },
                  h('div', { className: 'dsg-skel dsg-skel-heading' }),
                  h('div', { className: 'dsg-skel dsg-skel-line' }),
                  h('div', { className: 'dsg-skel dsg-skel-line dsg-skel-medium' }),
                  h('div', { className: 'dsg-skel dsg-skel-line dsg-skel-short' }),
                ),
              )
            : null

        // The sidebar column is reserved from the first frame so the file view never
        // starts full width and then reflows when the repository details arrive.
        const sidebarSkeleton =
          detail === undefined && detailError === ''
            ? h(
                'aside',
                { className: 'dsg-repo-side', 'aria-busy': true, 'aria-label': t('repo.loadingSide') },
                h(
                  'section',
                  { className: 'dsg-about-card' },
                  h('div', { className: 'dsg-skel dsg-skel-title' }),
                  h('div', { className: 'dsg-skel dsg-skel-line' }),
                  h('div', { className: 'dsg-skel dsg-skel-line dsg-skel-medium' }),
                  h(
                    'div',
                    { className: 'dsg-about-stats' },
                    h('div', { className: 'dsg-skel dsg-skel-stat' }),
                    h('div', { className: 'dsg-skel dsg-skel-stat' }),
                    h('div', { className: 'dsg-skel dsg-skel-stat' }),
                    h('div', { className: 'dsg-skel dsg-skel-stat' }),
                  ),
                  h('div', { className: 'dsg-skel dsg-skel-row' }),
                  h('div', { className: 'dsg-skel dsg-skel-row' }),
                ),
                h(
                  'section',
                  { className: 'dsg-about-card' },
                  h('div', { className: 'dsg-skel dsg-skel-title' }),
                  h('div', { className: 'dsg-skel dsg-skel-contrib' }),
                  h('div', { className: 'dsg-skel dsg-skel-contrib' }),
                ),
                h(
                  'section',
                  { className: 'dsg-about-card' },
                  h('div', { className: 'dsg-skel dsg-skel-title' }),
                  h('div', { className: 'dsg-skel dsg-skel-bar' }),
                  h('div', { className: 'dsg-skel dsg-skel-line dsg-skel-short' }),
                ),
              )
            : null

        const sidebar =
          detail === undefined
            ? detailError === ''
              ? sidebarSkeleton
              : h(
                  'aside',
                  { className: 'dsg-repo-side' },
                  h(
                    'div',
                    { className: 'dsg-about-card' },
                    h('p', { className: 'dsg-about-desc' }, t('repo.sideUnavailable')),
                  ),
                )
            : h(
                'aside',
                { className: 'dsg-repo-side' },
                h(
                  'section',
                  { className: 'dsg-about-card' },
                  h('h2', null, t('repo.about')),
                  description === '' ? null : h('p', { className: 'dsg-about-desc' }, description),
                  detail.homepage === ''
                    ? null
                    : h(
                        'a',
                        {
                          className: 'dsg-about-link',
                          href: /^https?:\/\//.test(detail.homepage) ? detail.homepage : `https://${detail.homepage}`,
                          target: '_blank',
                          rel: 'noreferrer noopener',
                        },
                        detail.homepage,
                      ),
                  topics.length === 0
                    ? null
                    : h(
                        'div',
                        { className: 'dsg-topics' },
                        ...topics.map((topic) => h('span', { key: topic, className: 'dsg-topic' }, topic)),
                      ),
                  h(
                    'div',
                    { className: 'dsg-about-stats' },
                    h(Stat, { label: t('detail.stars'), value: compactNumber(stars, locale) }),
                    h(Stat, { label: t('detail.forks'), value: compactNumber(detail.forks, locale) }),
                    h(Stat, { label: t('detail.watchers'), value: compactNumber(detail.watchers, locale) }),
                    h(Stat, { label: t('detail.issues'), value: compactNumber(detail.openIssues, locale) }),
                  ),
                  detail.license === ''
                    ? null
                    : h(
                        'div',
                        { className: 'dsg-about-row' },
                        h('span', null, t('detail.license')),
                        h('span', null, detail.license),
                      ),
                  detail.defaultBranch === ''
                    ? null
                    : h(
                        'div',
                        { className: 'dsg-about-row' },
                        h('span', null, t('detail.branch')),
                        h('span', null, detail.defaultBranch),
                      ),
                  detail.pushedAt === ''
                    ? null
                    : h(
                        'div',
                        { className: 'dsg-about-row' },
                        h('span', null, t('detail.updated')),
                        h('span', null, relativeTime(t, detail.pushedAt)),
                      ),
                ),
                detail.contributors.length === 0
                  ? null
                  : h(
                      'section',
                      { className: 'dsg-about-card' },
                      h('h2', null, t('repo.contributors')),
                      ...detail.contributors.map((person) =>
                        h(
                          'a',
                          {
                            key: person.login,
                            className: 'dsg-contributor',
                            href: person.url === '' ? '#' : person.url,
                            ...(person.url === ''
                              ? {}
                              : { target: '_blank', rel: 'noreferrer noopener' }),
                          },
                          h(RoundAvatar, { url: person.avatarUrl, label: person.login, size: 24 }),
                          h('span', null, person.login),
                        ),
                      ),
                    ),
                detail.languages.length === 0
                  ? null
                  : h(
                      'section',
                      { className: 'dsg-about-card' },
                      h('h2', null, t('repo.languages')),
                      h(
                        'div',
                        { className: 'dsg-langbar' },
                        ...detail.languages.map((language, index) =>
                          h('span', {
                            key: language.name,
                            className: 'dsg-langbar-seg',
                            style: {
                              width: `${Math.max(language.percent, 1)}%`,
                              backgroundColor: LANG_COLORS[index % LANG_COLORS.length],
                            },
                          }),
                        ),
                      ),
                      h(
                        'ul',
                        { className: 'dsg-langlegend' },
                        ...detail.languages.map((language, index) =>
                          h(
                            'li',
                            { key: language.name },
                            h('span', {
                              className: 'dsg-langdot',
                              style: { backgroundColor: LANG_COLORS[index % LANG_COLORS.length] },
                            }),
                            `${language.name} ${language.percent.toFixed(1)}%`,
                          ),
                        ),
                      ),
                    ),
              )

        return h(
          'div',
          { className: 'dsg-repo' },
          h(
            'div',
            { className: 'dsg-subhead' },
            h(
              'button',
              { className: 'dsg-btn dsg-back', type: 'button', onClick: onBack },
              h(BackGlyph),
              t('results.back'),
            ),
            h(
              'div',
              { className: 'dsg-crumb' },
              h('span', { className: 'dsg-crumb-owner' }, owner),
              h('span', { className: 'dsg-crumb-sep' }, '/'),
              h('span', { className: 'dsg-crumb-repo' }, shortName),
            ),
            h(
              'div',
              { className: 'dsg-detail-actions' },
              h(
                'a',
                {
                  className: 'dsg-btn',
                  href: detail === undefined ? `https://github.com/${owner}/${shortName}` : detail.url,
                  target: '_blank',
                  rel: 'noreferrer noopener',
                },
                h(ExternalGlyph),
                t('detail.openExternal'),
              ),
            ),
          ),
          h(
            'div',
            { className: 'dsg-repo-title' },
            h(RoundAvatar, { url: repo.avatarUrl, label: owner, size: 26 }),
            h('h1', null, shortName),
            h('span', { className: 'dsg-visibility' }, t('repo.public')),
          ),
          h(
            'div',
            { className: 'dsg-repo-tabs' },
            h(
              'button',
              {
                className: tab === 'code' ? 'dsg-repo-tab dsg-repo-tab-active' : 'dsg-repo-tab',
                type: 'button',
                onClick: () => setTab('code'),
              },
              t('repo.codeTab'),
            ),
            h(
              'button',
              {
                className: tab === 'issues' ? 'dsg-repo-tab dsg-repo-tab-active' : 'dsg-repo-tab',
                type: 'button',
                onClick: () => setTab('issues'),
              },
              t('repo.issuesTab'),
              detail === undefined
                ? h('span', { className: 'dsg-tab-count dsg-skel dsg-skel-count', 'aria-hidden': true })
                : detail.openIssues > 0
                  ? h('span', { className: 'dsg-tab-count' }, compactNumber(detail.openIssues, locale))
                  : null,
            ),
            tab === 'issues'
              ? h(
                  'div',
                  { className: 'dsg-repo-actions' },
                  h(StarButton, {
                    t,
                    locale,
                    starred: starred === true,
                    busy: starBusy === true,
                    count: stars,
                    onClick: onStar,
                  }),
                )
              : null,
          ),
          detailError === ''
            ? null
            : h(
                React.Fragment,
                null,
                h(Alert, { message: detailError }),
                h(
                  'button',
                  { className: 'dsg-btn dsg-detail-retry', type: 'button', onClick: () => setAttempt((value) => value + 1) },
                  t('detail.retry'),
                ),
              ),
          notice === '' ? null : h(Alert, { message: notice }),
          h(
            'div',
            { className: 'dsg-repo-body' },
            h(
              'div',
              { className: 'dsg-repo-main' },
              filePath === null
                ? tab === 'issues'
                  ? issueList
                  : h(
                      React.Fragment,
                      null,
                      h(
                        'div',
                        { className: 'dsg-branchbar' },
                        h(
                          'div',
                          { className: 'dsg-popover-wrap', ref: branchWrap },
                          h(
                            'button',
                            {
                              className: 'dsg-branch',
                              type: 'button',
                              onClick: () => {
                                setBranchOpen((value) => !value)
                                setCodeOpen(false)
                              },
                              'aria-expanded': branchOpen,
                              'aria-haspopup': 'listbox',
                            },
                            h(BranchIcon),
                            effectiveBranch,
                            h(ChevronDownGlyph),
                          ),
                          branchOpen
                            ? h(
                                'div',
                                { className: 'dsg-popover dsg-branch-menu', role: 'dialog', 'aria-label': t('repo.switchBranch') },
                                h('input', {
                                  className: 'dsg-input dsg-popover-filter',
                                  type: 'search',
                                  placeholder: t('repo.filterBranches'),
                                  'aria-label': t('repo.filterBranches'),
                                  value: branchFilter,
                                  spellCheck: false,
                                  autoFocus: true,
                                  onChange: (event) => setBranchFilter(event.target.value),
                                }),
                                branches.status === 'loading'
                                  ? h('div', { className: 'dsg-state' }, h(Spinner), t('repo.loadingBranches'))
                                  : null,
                                branches.status === 'error' ? h(Alert, { message: branches.error }) : null,
                                h(
                                  'div',
                                  { className: 'dsg-popover-list' },
                                  ...filteredBranches.map((item) =>
                                    h(
                                      'button',
                                      {
                                        key: item.name,
                                        className:
                                          item.name === effectiveBranch
                                            ? 'dsg-menu-item dsg-menu-item-active'
                                            : 'dsg-menu-item',
                                        type: 'button',
                                        onClick: () => selectBranch(item.name),
                                      },
                                      h('span', { className: 'dsg-menu-item-label' }, item.name),
                                      item.name === effectiveBranch ? h('span', { className: 'dsg-menu-check' }, '✓') : null,
                                    ),
                                  ),
                                ),
                                branches.status === 'ready' && filteredBranches.length === 0
                                  ? h('div', { className: 'dsg-state' }, t('repo.noBranch'))
                                  : null,
                              )
                            : null,
                        ),
                        h('span', { className: 'dsg-branch-meta' }, format(t('repo.entryCount'), { n: dir.entries.length })),
                        h('input', {
                          className: 'dsg-input dsg-filefilter',
                          type: 'search',
                          placeholder: t('repo.filter'),
                          'aria-label': t('repo.filter'),
                          value: filter,
                          spellCheck: false,
                          onChange: (event) => setFilter(event.target.value),
                        }),
                        h(
                          'div',
                          { className: 'dsg-repo-actions' },
                          h(StarButton, {
                            t,
                            locale,
                            starred: starred === true,
                            busy: starBusy === true,
                            count: stars,
                            onClick: onStar,
                          }),
                          h(
                            'div',
                            { className: 'dsg-popover-wrap dsg-code-wrap', ref: codeWrap },
                          h(
                            'button',
                            {
                              className: 'dsg-code-btn',
                              type: 'button',
                              onClick: () => {
                                setCodeOpen((value) => !value)
                                setBranchOpen(false)
                                setCopied(false)
                              },
                              'aria-expanded': codeOpen,
                            },
                            h(CodeGlyph, { size: 14 }),
                            t('repo.codeButton'),
                            h(ChevronDownGlyph),
                          ),
                          codeOpen
                            ? h(
                                'div',
                                { className: 'dsg-popover dsg-clone-menu', role: 'dialog', 'aria-label': t('repo.clone') },
                                h(
                                  'div',
                                  { className: 'dsg-clone-head' },
                                  h(OctocatGlyph, { size: 16 }),
                                  h('span', null, t('repo.clone')),
                                ),
                                h(
                                  'div',
                                  { className: 'dsg-clone-tabs' },
                                  h(
                                    'button',
                                    {
                                      className:
                                        cloneKind === 'https' ? 'dsg-clone-tab dsg-clone-tab-active' : 'dsg-clone-tab',
                                      type: 'button',
                                      onClick: () => {
                                        setCloneKind('https')
                                        setCopied(false)
                                      },
                                    },
                                    'HTTPS',
                                  ),
                                  h(
                                    'button',
                                    {
                                      className:
                                        cloneKind === 'ssh' ? 'dsg-clone-tab dsg-clone-tab-active' : 'dsg-clone-tab',
                                      type: 'button',
                                      onClick: () => {
                                        setCloneKind('ssh')
                                        setCopied(false)
                                      },
                                    },
                                    'SSH',
                                  ),
                                ),
                                h(
                                  'div',
                                  { className: 'dsg-clone-row' },
                                  h('input', {
                                    className: 'dsg-input dsg-clone-input',
                                    readOnly: true,
                                    value: cloneUrl,
                                    onFocus: (event) => event.target.select(),
                                  }),
                                  h(
                                    'button',
                                    {
                                      className: 'dsg-copy-btn',
                                      type: 'button',
                                      onClick: () => void copyClone(),
                                      title: t('repo.copy'),
                                      'aria-label': copied ? t('repo.copied') : t('repo.copy'),
                                    },
                                    copied ? h(CheckGlyph) : h(CopyGlyph),
                                  ),
                                ),
                                h(
                                  'a',
                                  {
                                    className: 'dsg-menu-item',
                                    href: detail === undefined ? `https://github.com/${owner}/${shortName}` : detail.url,
                                    target: '_blank',
                                    rel: 'noreferrer noopener',
                                  },
                                  h(GlobeGlyph),
                                  t('repo.cloneWeb'),
                                ),
                                h(
                                  'a',
                                  {
                                    className: 'dsg-menu-item',
                                    href: 'https://desktop.github.com/',
                                    target: '_blank',
                                    rel: 'noreferrer noopener',
                                  },
                                  h(DesktopGlyph),
                                  t('repo.cloneDesktop'),
                                ),
                                h(
                                  'a',
                                  {
                                    className: 'dsg-menu-item',
                                    href: zipUrl,
                                    target: '_blank',
                                    rel: 'noreferrer noopener',
                                  },
                                  h(DownloadGlyph),
                                  t('repo.downloadZip'),
                                ),
                              )
                            : null,
                        ),
                        ),
                      ),
                      crumbs,
                      table,
                      detail === undefined ? readmeSkeleton : readme,
                    )
                : h(FileView, {
                    t,
                    locale,
                    owner,
                    name: shortName,
                    branch: effectiveBranch,
                    path: filePath,
                    onClose: () => setFilePath(null),
                  }),
            ),
            sidebar,
          ),
        )
      }
      function GithubPanel() {
        const t = useTranslate()
        const locale = useLocale()
        const [auth, setAuth] = useState({ status: 'loading', profile: undefined })
        const [signingOut, setSigningOut] = useState(false)
        const [notice, setNotice] = useState('')
        const [view, setView] = useState(() => PANEL_STATE.view)
        const [searchText, setSearchText] = useState(() => PANEL_STATE.searchText)
        const [detail, setDetail] = useState(() => PANEL_STATE.detail)
        const scrollRef = useRef(null)
        const [recs, setRecs] = useState({ status: 'loading', items: [], total: 0, error: '', cached: false })
        const [starStates, setStarStates] = useState({})
        const [recsBusy, setRecsBusy] = useState(false)
        const recsRequest = useRef(0)
        const started = useRef(false)
        const viewKey = detail !== null ? `repo:${detail.fullName}` : view.kind === 'search' ? `search:${view.query}` : 'browse'

        useEffect(() => {
          PANEL_STATE.view = view
        }, [view])
        useEffect(() => {
          PANEL_STATE.searchText = searchText
        }, [searchText])
        useEffect(() => {
          PANEL_STATE.detail = detail
        }, [detail])

        // Leaving and re-entering the page restores its scroll offset; a new view starts at its own saved offset.
        useEffect(() => {
          const node = scrollRef.current
          if (node !== null) node.scrollTop = PANEL_STATE.scroll[viewKey] ?? 0
        }, [viewKey])

        const loadRecommendations = useCallback(
          async (force) => {
            recsRequest.current += 1
            const id = recsRequest.current
            setRecsBusy(true)
            setRecs((current) => ({
              status: current.items.length === 0 ? 'loading' : current.status,
              items: current.items,
              total: current.total,
              error: '',
              cached: current.cached,
            }))
            try {
              const value = await callApi('recommend', { force: force === true })
              if (id !== recsRequest.current) return
              setRecs({ status: 'ready', items: value.items, total: value.total, error: '', cached: value.cached === true })
            } catch (failure) {
              if (id !== recsRequest.current) return
              setRecs((current) => ({
                status: current.items.length === 0 ? 'error' : 'ready',
                items: current.items,
                total: current.total,
                error: describeError(t, failure),
                cached: current.cached,
              }))
            } finally {
              if (id === recsRequest.current) setRecsBusy(false)
            }
          },
          [t],
        )

        useEffect(() => {
          let alive = true
          void (async () => {
            try {
              const value = await callApi('state')
              if (!alive) return
              if (value.signedIn === true) {
                setAuth({ status: 'in', profile: value.profile })
                void callApi('refreshProfile')
                  .then((enriched) => {
                    if (!alive) return
                    if (enriched !== undefined && enriched.signedIn === true) {
                      setAuth({ status: 'in', profile: enriched.profile })
                    }
                  })
                  .catch(() => {})
              } else {
                setAuth({ status: 'out', profile: undefined })
              }
            } catch (failure) {
              if (!alive) return
              setAuth({ status: 'out', profile: undefined })
              setNotice(describeError(t, failure))
            }
          })()
          return () => {
            alive = false
          }
        }, [])

        useEffect(() => {
          if (started.current) return
          started.current = true
          void loadRecommendations(false)
        }, [loadRecommendations])

        const signOut = async () => {
          if (signingOut) return
          setSigningOut(true)
          setNotice('')
          try {
            await callApi('signOut')
            setAuth({ status: 'out', profile: undefined })
          } catch {
            setNotice(t('error.signOut'))
          } finally {
            setSigningOut(false)
          }
        }

        const toggleStar = async (repo) => {
          const key = repo.fullName
          const current = starStates[key]
          if (current !== undefined && current.busy === true) return
          if (auth.status !== 'in') {
            setNotice(t('star.needLogin'))
            return
          }
          const wasStarred = current !== undefined && current.starred === true
          const next = !wasStarred
          setStarStates((all) => ({ ...all, [key]: { starred: wasStarred, busy: true } }))
          try {
            await callApi('star', {
              owner: repo.owner,
              name: repo.name === '' ? repo.fullName.split('/').pop() : repo.name,
              starred: next,
            })
            setStarStates((all) => ({ ...all, [key]: { starred: next, busy: false } }))
            setNotice('')
          } catch (failure) {
            setStarStates((all) => ({ ...all, [key]: { starred: wasStarred, busy: false } }))
            const code = failure instanceof ApiError ? failure.code : ''
            if (code === 'star-forbidden') {
              const details =
                failure instanceof ApiError && failure.details !== null && typeof failure.details === 'object'
                  ? failure.details
                  : {}
              const message =
                details.tokenKind === 'fine-grained' ? t('star.forbiddenFineGrained') : t('star.forbidden')
              const parts = []
              if (typeof details.detail === 'string' && details.detail !== '') parts.push(details.detail)
              if (typeof details.acceptedPermissions === 'string' && details.acceptedPermissions !== '') {
                parts.push(details.acceptedPermissions)
              } else if (typeof details.acceptedScopes === 'string' && details.acceptedScopes !== '') {
                parts.push(details.acceptedScopes)
              }
              setNotice(parts.length === 0 ? message : `${message} [${parts.join(' · ')}]`)
            } else {
              setNotice(
                code === 'not-signed-in' || code === 'invalid-token' ? t('star.needLogin') : t('star.failed'),
              )
            }
          }
        }

        return h(
          'div',
          { className: 'dsg-page' },
          h(Style),
          h(
            'div',
            {
              className: 'dsg-scroll',
              ref: scrollRef,
              onScroll: (event) => {
                PANEL_STATE.scroll[viewKey] = event.currentTarget.scrollTop
              },
            },
            h(
              'div',
              { className: 'dsg-content', style: detail !== null ? { display: 'none' } : undefined },
              view.kind === 'search'
                ? h(SearchResultsPage, {
                    key: view.query,
                    t,
                    locale,
                    query: view.query,
                    notice,
                    initialPage: (PANEL_STATE.searchPages[view.query] ?? {}).page ?? 1,
                    initialPerPage: (PANEL_STATE.searchPages[view.query] ?? {}).perPage ?? 10,
                    onBack: () => setView({ kind: 'browse' }),
                    onSearch: (nextQuery) => setView({ kind: 'search', query: nextQuery }),
                    starStates,
                    onToggleStar: toggleStar,
                    onOpen: (repo) => setDetail(repo),
                  })
                : h(
                    React.Fragment,
                    null,
                    auth.status === 'in'
                      ? h(
                          'div',
                          { className: 'dsg-me-wrap' },
                          h(AccountCard, {
                            t,
                            locale,
                            profile: auth.profile,
                            onSignOut: signOut,
                            signingOut,
                          }),
                        )
                      : h(
                          'header',
                          { className: 'dsg-head' },
                          h(
                            'div',
                            null,
                            h('h1', null, t('title')),
                            h('p', { className: 'dsg-sub' }, t('subtitle')),
                          ),
                          h(AccountArea, { t, auth }),
                        ),
                    auth.status === 'out'
                      ? h(LoginCard, {
                          t,
                          onSignedIn: (profile) => {
                            setNotice('')
                            setAuth({ status: 'in', profile })
                          },
                        })
                      : null,
                    notice === '' ? null : h(Alert, { message: notice }),
                    h(SearchLauncher, {
                      t,
                      value: searchText,
                      onChange: setSearchText,
                      onOpen: (query) => setView({ kind: 'search', query }),
                    }),
                    h(Recommendations, {
                      t,
                      locale,
                      recs,
                      busy: recsBusy,
                      onRefresh: () => void loadRecommendations(true),
                      starStates,
                      onToggleStar: toggleStar,
                      onOpen: (repo) => setDetail(repo),
                    }),
                    h(
                      'footer',
                      { className: 'dsg-foot' },
                      h('p', null, t('foot.window')),
                      h('p', null, t('foot.source')),
                    ),
                  ),
            ),
            detail === null
              ? null
              : h(
                  'div',
                  { className: 'dsg-content' },
                  h(RepoPage, {
                    t,
                    locale,
                    repo: detail,
                    notice,
                    starred:
                      starStates[detail.fullName] !== undefined && starStates[detail.fullName].starred === true,
                    starBusy: starStates[detail.fullName] !== undefined && starStates[detail.fullName].busy === true,
                    onStar: () => void toggleStar(detail),
                    onBack: () => setDetail(null),
                  }),
                ),
          ),
        )
      }

      /** A single entry beside the page's own controls, on this bundle's detail page only. */
      function DetailActions(props) {
        const t = useTranslate()
        const subject = props !== null && typeof props === 'object' ? props.subject : undefined
        if (subject === undefined || subject === null || subject.kind !== 'bundle') return null
        if (subject.pkg === undefined || subject.pkg === null || subject.pkg.name !== PACKAGE_NAME) return null
        return h(
          React.Fragment,
          null,
          h(Style),
          h(
            'button',
            {
              className: 'dsg-btn dsg-btn-primary',
              type: 'button',
              onClick: () => ctx.layout.selectPanel(PANEL_ID),
            },
            h(OctocatGlyph, { size: 14 }),
            t('action.openPanel'),
          ),
        )
      }

      function PanelIcon(props) {
        const size = props !== null && typeof props === 'object' && typeof props.size === 'number' ? props.size : 18
        return h(OctocatGlyph, { size })
      }

      return { GithubPanel, DetailActions, PanelIcon }
    }

    return {
      inject: ['slots', 'locale', 'layout'],
      apply(ctx) {
        ctx.effect(
          () => ctx.locale.register(NS, { zh, en, ja, es, fr, de, ru, pt }),
          'dsh-github-tool: dictionaries',
        )
        const t = ctx.locale.bind(NS)
        const { GithubPanel, DetailActions, PanelIcon } = createPanel(ctx)

        ctx.slots.inject('sidebar.panellist', () =>
          ctx.slots.register(
            {
              name: 'sidebar.panellist',
              id: PANEL_ID,
              order: 5,
              label: () => t('panel'),
              locale: NS,
            },
            PanelIcon,
          ),
        )

        ctx.slots.inject('main', () =>
          ctx.slots.register(
            {
              name: 'main',
              key: PANEL_ID,
              locale: NS,
            },
            GithubPanel,
          ),
        )

        ctx.slots.inject('plugins.detail.actions', () =>
          ctx.slots.register(
            {
              name: 'plugins.detail.actions',
              id: 'dsh-github-tool-open',
              order: 50,
              locale: NS,
            },
            DetailActions,
          ),
        )
      },
    }
  },
})
