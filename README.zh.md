# DeepSeek Harness 的 GitHub 工作区

一个本地 DSH bundle，在左侧栏「插件」和「自动化任务」之间新增 GitHub 工作区。覆盖日常使用链路——登录、发现最近热门仓库、搜索、查看仓库文件和代码、阅读 README、浏览 Issue、Star——全程不用离开应用。

[English](README.md) | 中文

## 功能

### 登录与保持登录

- 用 GitHub 个人访问令牌（PAT）登录。
- 令牌先通过 `GET /user` 校验，然后以 `grant` 记录的形式存进本机 DSH 凭据库（`dsh-github-tool/account`），不会回传浏览器，也不会写进配置文件。
- 下次启动时读取该记录，自动恢复登录状态。
- 个人资料卡还会显示昵称、简介、公司、所在地、个人网站、加入年份，以及仓库 / 关注者 / 正在关注数量；进入面板时会从 `/user` 刷新一次（缓存 5 分钟）。
- 旧包名时期保存的记录（`dsh-github/account`）会在插件启动时自动迁移。

### 最近 7 天热门

- 取最近 7 天新建的公开仓库，按 star 数排序。
- 候选池是前 200 名，每次随机抽取 **18** 个，所以点「换一批」会换出不同的组合。
- 刷新会轮换四个已缓存的分页；一个会话每 5 分钟最多消耗四次搜索请求。

### 仓库搜索

- 支持 GitHub 查询语法：`language:rust`、`stars:>1000`、`topic:cli`、`org:vercel` 等。
- 搜索结果在插件内的独立页面展示，带「返回」。
- 分页默认 **每页 10 条**（可切 10 / 20 / 50），支持上一页 / 下一页、页码窗口，以及输入页码跳转。
- 搜索答案按「查询词 + 页码」缓存 5 分钟。

### 仓库页（GitHub 风格）

- **顶部**：面包屑、仓库名、`Public` 标签，以及显式的「在 GitHub 打开」。
- **标签**：`Code` 与 `Issues`（带未关闭数量）。
- **分支切换**：最多列出 100 个分支并支持筛选；切换后文件列表、最新提交和文件内容都会按该分支重新加载。
- **Code 按钮**：HTTPS / SSH 克隆地址与复制、使用 Web URL 克隆、使用 GitHub Desktop 打开、下载当前分支 ZIP。
- **文件列表**：最上方是最新提交行（作者头像、提交信息、相对时间），下面是带图标和大小的目录 / 文件行；筛选框可过滤当前目录，目录支持逐层进入并显示面包屑。
- **文件查看**：带行号的等宽代码、大小与行数、返回文件列表，以及当前分支上的 GitHub 链接。
- **README**：渲染仓库 README（标题、段落、列表、代码块、引用、链接、粗体 / 行内代码等）。
- **右侧信息栏**：简介、主页、主题、Star/Fork/关注/Issue、许可证、默认分支、最近推送、贡献者头像、语言占比条。
- **Star**：可在仓库页切换，状态与卡片共享。
- **不抖动**：信息栏和 README 区域从第一帧就有骨架占位，数据到达时不会重排页面。

### 离开页面后保留状态

切到会话窗口再回到 GitHub 图标，会回到上次的位置：

- 当前视图（首页 / 搜索结果 / 仓库页）；
- 打开的仓库及其标签、分支、目录、打开的文件、筛选词、滚动位置；
- 搜索词、页码、每页条数；
- 各视图各自的滚动位置。

## 数据流

```
浏览器侧  ──POST /dsh-github-tool/api/<method>──▶  Host 侧  ──▶ api.github.com
      │                                               │
      └── 不持有令牌，也不直接访问 GitHub ─────────────┘
```

- 所有请求都走同源的 Host 路由 `/dsh-github-tool/api/*`；该路由只接受已认证的 DSH 窗口（`ctx.connection.requestRejection`），且只接受 `POST` JSON。
- 令牌只保存在 Host 侧；Host 调用 GitHub REST API 并返回整理后的 JSON，浏览器拿不到令牌，也不会直接访问 `api.github.com`。
- 请求与缓存：

| 功能 | GitHub 接口 | 缓存 |
| --- | --- | --- |
| 推荐 | `search/repositories?q=created:>7d is:public&sort=stars` | 4 页，5 分钟 |
| 搜索 | `search/repositories?q=…&per_page&page` | 按查询词/页，5 分钟 |
| 仓库 | `repos/{owner}/{repo}` + `languages` + `contributors` + `readme` | 5 分钟 |
| 文件 | `repos/{owner}/{repo}/contents[/{path}]?ref=` | 5 分钟 |
| 最新提交 | `repos/{owner}/{repo}/commits?per_page=1&sha=<branch>` | 5 分钟 |
| 分支 | `repos/{owner}/{repo}/branches?per_page=100` | 5 分钟 |
| Issue | `repos/{owner}/{repo}/issues?state=open&per_page=30` | 5 分钟 |
| Star | `PUT` / `DELETE /user/starred/{owner}/{repo}` | 不缓存 |
| 个人资料 | `GET /user` | 5 分钟 |

## 安装

这是一个无依赖、无需构建的普通包：

- 在 **插件 → 添加插件** 里选择 `dsh-github-tool` 目录；或
- 用插件管理器的 `install_bundle` 指定该目录的绝对路径。

包名是 `@local/dsh-github-tool`，bundle patch 只插入一行 `dsh-github-tool`。安装后默认启用，左侧栏出现 GitHub 入口。

## 使用

1. 点左侧栏的 **GitHub** 图标（或「插件」页本插件详情页的「打开 GitHub 工作区」）。
2. **登录**：在 <https://github.com/settings/tokens> 生成个人访问令牌并粘贴。
   - 只搜索公开仓库、读取公开数据时，无需勾选任何权限。
   - 需要 Star 公开仓库时勾选 `public_repo`；需要访问私有仓库时勾选 `repo`。
3. 在「最近 7 天热门仓库」里点「换一批」刷新，或在「搜索仓库」输入查询后回车。
4. 点任意仓库卡片在插件内打开仓库页：目录可逐层进入、文件打开代码页、分支切换与绿色 `Code` 菜单覆盖克隆和下载、Star 在卡片和仓库页都可操作。
5. 在个人资料卡点「退出」会删除已保存的令牌。

## 限制与已知行为

- GitHub 未登录时 REST 配额为每小时 60 次、搜索每分钟 10 次；登录后更高。触发限流时会显示本地化提示。
- GitHub 搜索最多返回前 1000 条；分页到该上限会提示。
- 分支切换最多列出 100 个分支，不包含 Tags。
- Issues 标签只列最近 30 个未关闭 Issue 且排除 PR；单条 Issue 在 GitHub 打开。
- README 渲染是 Markdown 子集（不支持图片、表格、HTML）；代码没有语法高亮。
- 文件以纯文本预览，最多 40 万字符、显示前 5000 行；二进制文件会提示不可预览。
- Star 必须使用 **Classic token** 并具备 `public_repo`（或 `repo`）；GitHub 不允许 Fine-grained token Star 不属于本人或本组织的公开仓库（授予 Starring 权限也无法解决），插件检测到 fine-grained 令牌时会给出对应提示。
- Star 状态按会话记录，不会为每张卡片都向 GitHub 查询，以控制请求数。
- 只有显式链接（「在 GitHub 打开」、克隆菜单项、Issue 行、个人资料链接）会打开系统浏览器；点卡片或仓库行始终留在插件内。

## 目录结构

```
dsh-github-tool/
├── index.js            Host 侧：/dsh-github-tool/api 代理、令牌记录、缓存
├── client.js           浏览器侧：slot 注册、页面与组件、本地化字典、样式
├── cordis.patch.yml    bundle patch：一行，id/name 为 dsh-github-tool
├── package.json        bundle 清单与 client 声明
├── locale/             插件管理页显示元数据（en、zh）
├── docs/               详情文档与预览图
├── icon.svg            Octocat 风格的 bundle 图标
├── README.md           英文 README
└── README.zh.md        本文件
```

Host 路由暴露的方法：`state`、`refreshProfile`、`signIn`、`signOut`、`recommend`、`search`、`repo`、`ls`、`read`、`commit`、`branches`、`issues`、`star`。响应统一为 `{ok: true, value}` 或 `{ok: false, error: {code, message, details}}`。

界面挂载点：

- `sidebar.panellist` 的 `github` 条目（order 5，位于「插件」与「自动化任务」之间）；
- `main` 的 `github` 键，即工作区页面；
- `plugins.detail.actions` 的 `dsh-github-tool-open`，即插件详情页的「打开 GitHub 工作区」按钮。

## 开发

工作区里的 `_dev/` 放了几个不随插件发布的开发脚本：

- `route-test.mjs`：用假上下文运行 Host 半，并针对真实 GitHub 测推荐、搜索、仓库、文件、分支、Issue 及错误路径；
- `state-test.mjs`：用假凭据库检查登录态返回；
- `check-bundle.mjs`：校验 manifest 导出、locale JSON、详情文档、图标和 `files` 声明。

用 DSH 自带的 Node 运行，例如：

```powershell
$env:ELECTRON_RUN_AS_NODE = '1'
& $env:DSH_NODE_EXECUTABLE "F:\dsh-github-cli\_dev\route-test.mjs"
```

两个运行时文件可以用 `node --check` 做语法检查。要让改动在运行中的应用里生效，停用再启用该 bundle（或刷新窗口）。

## 卸载

在「插件」页停用或移除 `@local/dsh-github-tool` 即可，面板和登录入口会消失；已保存的令牌仍留在凭据库中，直到在面板里退出登录（移除 bundle 不会删除凭据）。
