# TRACE —— HPC 集群智能工作台

面向生物信息与高性能计算场景的桌面客户端：AI 智能体 + 集群作业管理 + 文件传输 + 生信分析流程库，开箱即用。

## 下载安装（推荐给绝大多数用户）

**[⬇️ 点击下载 TRACE 最新版（Windows x64 安装包）](https://github.com/peacezha/TRACE/releases/latest)**

下载 `TRACE-Setup-<版本>-x64.exe` 后双击安装即可，**无需安装 Node.js 或任何其他依赖**。

> 历史版本与校验信息见 [Releases 页面](https://github.com/peacezha/TRACE/releases)。

当前本地 Windows 构建为 v0.4.56，完整统一 TRACE 名称、插件与新生成目录，并提供旧数据迁移；包含 v0.4.55 的问答防循环和有效执行计时修复。本地构建尚未发布到 GitHub，线上最新版本以 Releases 页面为准。[完整改名说明](docs/windows-v0.4.56-complete-trace.md) · [Agent 修复说明](docs/windows-v0.4.55-agent-continuity.md)。

Mac（Apple 芯片 / Intel）和公共 Linux 网页包仍使用 [v0.4.43](https://github.com/peacezha/TRACE/releases/tag/v0.4.43)。文献学习的数据下载和完整流程修复继续包含在 Windows 新版本中。[上一版说明](v0.4.43_更新说明.md) · [Mac 安装说明](docs/MAC_WEB_DEPLOYMENT.md)。

面向大众的网页服务请选择 **public-web-linux-x64-node20** 包（Node.js 20.19.5+）：[npm 公共网页部署说明](docs/PUBLIC_WEB_DEPLOYMENT.md)。用户自带集群账号和 API Key，无统一网站口令，无部署服务器本地工作台；旧 `web-linux-x64` 包仍是单用户私有版。

## 快速上手

1. 启动 TRACE，输入集群地址、端口、用户名和密码（首次连接需确认主机指纹）；
2. 登录后即可使用：AI 对话与任务执行、SSH 终端、集群与本地文件互传、流程库一键运行；
3. 在流程库选择分析流程，先检查输入、软件和参考数据，再确认参数。来源分别标注 ENCODE 官方流程、参考扩展实现、BioSkills 和用户自建流程。

## 功能一览

- **AI 智能体**：对话式驱动集群作业（提交、监控、自动续跑、完成后自动分析结果），支持本地文件分析（无集群也能用）；
- **流程库**：ENCODE 金标准流程（RNA-seq / ChIP-seq / ATAC-seq / WGBS / Hi-C 等 12 条）+ 35 条精选 BioSkills 流程；固定脚本 + 全局参数微调；植物样本适配（叶绿体去除）；
- **集群工作台**：LSF 作业提交/监控/排障，终端右键菜单与 AI 辅助小窗；
- **文件传输**：集群与本地双向互传、远程文件在线编辑同步；
- **网络数据资源**：内置 NCBI / Ensembl / UniProt 等公共数据库接口，AI 可直接查询序列与注释。

## 从源码构建（开发者）

```bash
npm install          # 安装依赖
npm run dev          # 开发模式
npm run test         # 运行回归测试
npm run electron:dist  # 打包 Windows 安装包（输出到 release/）
```

技术栈：Electron + React + TypeScript + Express。详见 [开发总说明](docs/DEVELOPMENT_GUIDE.md)。

## 文档

- [ENCODE 流程设计与质控阈值解读](docs/ENCODE生物信息分析与质控流程.md)
- [ENCODE 流程与代码全文](docs/ENCODE流程与代码全文_v0.4.12.md)
- [流程自动化约定](docs/FLOW_AUTOMATION.md)

## License

[MIT](LICENSE)
