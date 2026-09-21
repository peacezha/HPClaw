# HPClaw —— HPC 集群智能工作台

面向生物信息与高性能计算场景的桌面客户端：AI 智能体 + 集群作业管理 + 文件传输 + 生信分析流程库，开箱即用。

## 下载安装（推荐给绝大多数用户）

**[⬇️ 点击下载 HPClaw 最新版（Windows x64 安装包）](https://github.com/peacezha/HPClaw/releases/latest)**

下载 `HPClaw-Setup-x64.exe` 后双击安装即可，**无需安装 Node.js 或任何其他依赖**。

> 历史版本与校验信息见 [Releases 页面](https://github.com/peacezha/HPClaw/releases)。

## 快速上手

1. 启动 HPClaw，输入集群地址、端口、用户名和密码（首次连接需确认主机指纹）；
2. 登录后即可使用：AI 对话与任务执行、SSH 终端、集群与本地文件互传、流程库一键运行；
3. 流程库内置 53 条精选流程（含 12 条 ENCODE 金标准流程），每条流程第 1 步自动做环境检查，分析代码为固定金脚本，只需在运行面板确认参数。

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
npm run test         # 运行测试（168 个测试文件，1296 项）
npm run electron:dist  # 打包 Windows 安装包（输出到 release/）
```

技术栈：Electron + React + TypeScript + Express。详见 [开发总说明](docs/DEVELOPMENT_GUIDE.md)。

## 文档

- [ENCODE 流程设计与质控阈值解读](docs/ENCODE生物信息分析与质控流程.md)
- [ENCODE 流程与代码全文](docs/ENCODE流程与代码全文_v0.4.12.md)
- [流程自动化约定](docs/FLOW_AUTOMATION.md)

## License

[MIT](LICENSE)
