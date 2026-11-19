# DeepSeek Harness 的 GitHub 工作区

一个本地 DSH bundle，在左侧栏「插件」和「自动化任务」之间新增 GitHub 工作区：登录、发现最近热门仓库、搜索、浏览仓库文件与 Issue、阅读 README、克隆和 Star，全程不用离开应用。

[English](README.md) | 中文

界面跟随 DSH 的界面语言：English、中文、日本語、Español、Français、Deutsch、
Русский、Português (BR)。

## 功能

- **登录保持**：用 GitHub 个人访问令牌登录，令牌经 `GET /user` 校验后存进 DSH 凭据库（`dsh-github-tool/account`），不会回传浏览器，重启后自动恢复。
- **最近 7 天热门**：最近一周新建的公开仓库按 star 排序，候选池前 200 名，每次「换一批」随机抽 18 个。
- **仓库搜索**：支持 GitHub 查询语法（`language:rust`、`stars:>1000`、`topic:cli` 等），独立结果页，每页 10/20/50 条并支持跳页。
- **插件内仓库页**：Code / Issues 标签、分支切换、绿色 Code 菜单（HTTPS/SSH 克隆地址、复制、GitHub Desktop、下载 ZIP）、带最新提交的文件列表、带行号的代码页、渲染后的 README，以及含统计、贡献者、语言的右侧信息栏。
- **Star** 可在仓库页或卡片操作；只有「在 GitHub 打开」这类显式链接才会离开应用。
- **状态保留**：面板切走再回来，视图、仓库（标签、分支、目录、文件、筛选）、搜索词/页码、滚动位置都还在。
- 所有 GitHub 请求都走 Host 侧 `/dsh-github-tool/api/*`，浏览器不直接访问 `api.github.com`，也拿不到令牌。

## 安装

包名 `@tristgek/dsh-github-tool`（行 id `dsh-github-tool`），无依赖、无需构建。

**从 GitHub 安装（需要 Git）**：在 **插件 → 添加插件** 填入：

```
github:TristGek/dsh-github-tool
```

固定提交：`github:TristGek/dsh-github-tool#<commit-sha>`。安装器会先执行 `git ls-remote`，所以 `PATH` 中要有 `git`；填 `https://github.com/…` 地址也可以。

**用下载目录安装（不需要 Git）**：下载仓库 ZIP、解压，在 **插件 → 添加插件** 里选择该目录。

## 使用

1. 点左侧栏的 **GitHub** 图标。
2. 用 <https://github.com/settings/tokens> 生成的个人访问令牌登录。
   - 只搜索公开仓库、读取公开数据时不需要任何 scope。
   - Star 他人公开仓库需要 **Classic token** 并勾选 `public_repo`（私有仓库用 `repo`）；GitHub 不允许 Fine-grained token Star 非本人或非本组织的仓库。
3. 在「最近 7 天热门」里换一批或搜索，点卡片进入仓库页；在个人资料卡点「退出」删除已保存的令牌。

## 限制

- GitHub 未登录 REST 配额为每小时 60 次、搜索每分钟 10 次；登录后更高。限流会显示本地化提示。
- 搜索最多返回前 1000 条；分支最多 100 个（不含 Tags）；Issues 只列最近 30 个未关闭项（排除 PR）。
- README 渲染支持 Markdown 子集（无图片、表格、HTML），代码无语法高亮；文件以文本预览，上限 40 万字符、5000 行，二进制文件会提示不可预览。

## 开发

测试脚本放在工作区的 `_dev/` 目录（`route-test.mjs`、`state-test.mjs`、`check-bundle.mjs`），不随插件发布。改完运行时代码后停用再启用 bundle 即可重新加载。

## 许可证

[MIT](LICENSE) © 2026 TristGek
