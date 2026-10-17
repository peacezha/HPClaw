# TRACE v0.4.53

软件对外名称统一改为 TRACE。Windows 安装包、应用窗口、侧边栏、快捷方式、AI 身份提示、报告署名，以及 Mac/Linux 网页包的构建名称已同步更新。

GitHub 仓库及默认更新源使用 https://github.com/peacezha/TRACE。

## 升级兼容

- 保留原安装 appId，避免把升级识别为另一款软件。
- 已有用户继续读取旧数据目录，不移动或删除对话、集群账号、密钥和流程记录。新安装使用 TRACE 数据目录。
- Windows 安装器能识别旧版可执行文件。新版语言文件使用 trace-install-locale.json，并兼容旧安装器的语言选择。
- Mac/Linux 旧用户保留原 safeStorage 加密身份。产品展示使用 TRACE。
- 旧 IPC、HTTP 鉴权头、环境变量、存储键与已有集群目录作为兼容接口保留，不做全局文本替换。
- 历史对话、脚本路径与原始日志保持原样。保存流程的展示文案和本仓库链接会显示当前产品名称。

## 本次发布范围

Windows 安装包在本机生成与验证。Mac/Linux 公共网页构建配置同步改名，但需要对应平台验证后另行构建。此说明不代表新安装包已上传 GitHub Release。
