# HPClaw v0.2.14 — HPC 集群智能工作台

基于 Electron + React + TypeScript 构建的 HPC 集群管理客户端，集成 AI 辅助、文件传输、SSH 终端和正式流程运行。

> 开发者和后续 AI 请先阅读 [开发总说明](docs/DEVELOPMENT_GUIDE.md)。当前源码与测试是最高事实来源，历史设计文档可能已过时。

## 快速使用

运行 `release/HPClaw-Setup-0.2.14-x64.exe` 完成安装；应用运行时无需另装 Node.js。

1. 启动后输入集群地址、端口、用户名和密码
2. 首次连接需确认主机指纹
3. 登录后可使用终端、AI 助理、文件管理等全部功能

## 目录结构

```
src/                  # React 前端源码
server/               # Express 后端与 Agent/流程实现
electron/             # Electron 主进程
shared/               # 前后端共享类型和规则
skills/               # AI 技能
lsf_skills/           # LSF 调度器技能
workflows/            # 流程种子与资产
vendor/               # 随包 dsh、插件和 Node 运行时
docs/                 # 开发、功能和历史设计文档
dist*/、release/      # 生成产物，不应直接修改
```

## 开发环境搭建

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 打包 Electron 应用
npm run electron:dist
```

## 技术栈

- **前端**: React 19 + Tailwind CSS + xterm.js
- **后端**: Express + Socket.IO + ssh2
- **桌面**: Electron 42
- **语言**: TypeScript
- **构建**: Vite + electron-builder

## 远程文件打开与预览

- 双击远程文件会先下载到 HPClaw 的安全缓存，再调用 Windows 默认软件打开。
- 在默认软件中保存修改后，HPClaw 自动把文件上传覆盖到原集群路径；关闭软件时还会执行最终同步检查。
- 同步失败时不会删除本地副本，可在文件工作区点击“重试上传”或“打开本地副本”。
- 双击本地文件只调用系统默认软件，不会上传到集群。
- 右键选择“预览”可在应用内只读查看图片、PDF、DOCX、XLS/XLSX、CSV/TSV、Markdown、代码、日志和常见生物信息文本。
- 100 MiB 及以上的 FASTA、FASTQ、日志等行式文本仅流式读取并显示前 20 行。

## 流程自动化（四板块工作区）

- 每个分析流程在集群上拥有持久目录 `~/hpclaw_flows/<流程>/`，每次运行在 `03_workspace/runs/<runId>/` 下创建独立代码、日志、结果、配置、流程快照和 `run.json`。
- 预检可检查调度器、软件 Module、版本、参考数据与资产；缺失时可让 AI 引导处理。当前版本仍要求用户确认预检结果。
- 运行中由 `run.json` 状态机记录步骤，长作业交给 LSF/Slurm/PBS 后台监控；最终报告由具体流程决定，并非所有流程都会自动生成统一报告。
- 当前种子库包含 6 个内置流程和 41 条 BioSkills 流程。完整实现与已知边界见 `docs/DEVELOPMENT_GUIDE.md`。

## 系统要求

- Windows 10/11 x64
- 无需额外依赖（Node.js 运行时已内置）
