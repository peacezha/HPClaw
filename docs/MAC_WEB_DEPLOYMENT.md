# HPClaw v0.4.42：Mac 安装与 Linux 网页部署

保留经典主界面，加入文献学习底层修复。Windows、Mac 和公共 Linux 网页包均使用 v0.4.42 源码；历史 v0.4.41 安装包不覆盖。面向大众的 Linux 服务请使用 [公共网页 npm 部署说明](PUBLIC_WEB_DEPLOYMENT.md)，无需统一网站口令。下文 Docker 部分仅用于历史 v0.4.41 单用户私有服务，不是本次公共网页包的部署方式。

## Mac

- Apple 芯片：下载 `HPClaw-0.4.42-mac-arm64.dmg`。
- Intel Mac：下载 `HPClaw-0.4.42-mac-x64.dmg`。
- 打开 DMG，将 HPClaw 拖到 Applications，再从 Applications 启动。无需另装 Node.js。
- 这批安装包没有 Apple Developer ID 签名和公证。首次打开可能被 Gatekeeper 阻止；核对来源与 SHA-256 后，按 [Apple 官方说明](https://support.apple.com/102445) 在“系统设置 → 隐私与安全”中允许打开此应用。不要全局关闭 Gatekeeper。
- 当前 Mac 版手动下载更新，不能承诺未签名包可正常自动更新。后续配置 Apple 签名证书与公证凭据后再启用 Mac 自动更新。
- Mac 与 Windows 的配置/密钥保存在各自系统用户目录，不会自动跨设备同步。

## Linux：简单命令部署网页端

目标：Linux x86_64 / amd64，已安装 [Docker Engine](https://docs.docker.com/engine/install/) 与 [Docker Compose 插件](https://docs.docker.com/compose/install/)。不自动修改防火墙或安装系统软件。不支持把 x86_64 包直接放到 ARM 服务器。

在服务器的普通工作目录执行：

```bash
curl -fLO https://github.com/peacezha/HPClaw/releases/download/v0.4.41/HPClaw-0.4.41-web-linux-x64.tar.gz
curl -fLO https://github.com/peacezha/HPClaw/releases/download/v0.4.41/HPClaw-0.4.41-web-linux-x64.tar.gz.sha256
sha256sum -c HPClaw-0.4.41-web-linux-x64.tar.gz.sha256
tar -xzf HPClaw-0.4.41-web-linux-x64.tar.gz
cd HPClaw-0.4.41-web-linux-x64
./deploy.sh --url http://你的服务器IP:3003
./deploy.sh --password
```

把 URL 换成真实服务器地址，然后在浏览器打开它。浏览器先要求网页工作台账号，进入应用后再配置集群 SSH 和 AI；这两个登录不是同一账号。
访问账号初次启动自动生成，保存在数据卷的 `/data/web-access.json`，不会写入构建包或启动日志。已有 `.env` 时脚本拒绝覆盖，请直接 `./deploy.sh` 或手动编辑。

HTTP 地址仅适合受防火墙保护的内网/测试。公网必须使用 HTTPS 反向代理或 SSH 隧道，不能在明文公网 HTTP 上填写集群密码和 API 密钥。

如只想经 SSH 隧道访问，服务器执行 `./deploy.sh`（仅发布 127.0.0.1:3003），客户端执行：

```bash
ssh -L 3003:127.0.0.1:3003 用户名@服务器地址
```

然后在客户端浏览器打开 `http://127.0.0.1:3003`。

## HTTPS 反向代理

先配置域名、证书和反向代理（这些需要你自己的服务器信息）。`.env` 中设置：

```dotenv
HPCLAW_WEB_ORIGIN=https://hpclaw.example.org
HPCLAW_BIND_IP=127.0.0.1
HPCLAW_PORT=3003
HPCLAW_WEB_COOKIE_SECURE=1
HPCLAW_TRUST_PROXY=1
```

代理必须转发全部路径，包括 `/socket.io/`、HTML 文档和报告资源；转发 `Host`、`X-Forwarded-Proto`、`Upgrade` / `Connection`，关闭 AI SSE 路径的响应缓冲，延长读取超时并按数据大小设置上传限额。只允许受信任反向代理到达后端。

## 常用命令

```bash
./deploy.sh --status
./deploy.sh --logs
./deploy.sh --password
./deploy.sh --stop
./deploy.sh
```

停止与重建容器不删除数据。固定 Compose 项目名为 `hpclaw-web`，命名数据卷为 `hpclaw-web_hpclaw-data`；请备份完整数据卷，包含加密主密钥。不要执行 `docker compose down -v`，否则会删除数据卷。
启动会拉取 Docker 基础镜像和少量 npm 后端依赖，需要服务器能访问相关镜像与 npm 注册源。

## 网页与桌面的差异、安全边界

- 这是单用户、单实例的可信工作台，不是多用户 SaaS。一个实例内的配置、任务、对话和服务器本地文件共享；不能开放给不互信用户。
- AI 的“本地执行”和“本地文件”在 Linux 服务器 / 容器内执行，不是浏览器访问者的电脑。需要电脑文件时使用浏览器文件上传。
- 主机本地任意目录默认不挂载到容器；需要时只挂载明确批准的数据目录。容器中的本地 Agent 具有该容器用户的执行权限，不是面向恶意用户的沙箱。
- SSH 终端通过 WebSocket，AI 对话通过 SSE，集群报告仍使用后端流式读取。服务器必须能访问集群 SSH 和模型 API。
- 普通网站用沙箱 iframe 预览；禁止嵌入的网站须点击“新标签页打开”。集群 HTML 报告不受外部网站的 iframe 禁止策略影响。
- 浏览器不能提供 Electron 的系统密钥库、原生路径选择/外部编辑器和桌面自动更新。不要把网页端宣称为所有原生功能等价替代。
- 重启服务需要重新连接 SSH 会话；已经提交的集群批处理作业不会自动取消，自动监控/续跑需要恢复连接。重启前保存任务上下文。

## 构建和来源

GitHub 工作流 `Package v0.4.41 for Mac and Linux Web` 在原生 macOS arm64、macOS Intel 和 Linux x64 上分别准备依赖、构建与测试。固定版本来自仓库锁文件，平台依赖来自 vendored DSH 的精确版本清单，保留已有 DSH 修复。
发布包附 SHA-256 校验与 source commit 信息。不要把仅配置了构建、但未实际成功的工作流当作已生成安装包。
