# HPClaw v0.4.43 公共网页端（Linux / npm）

此包面向多位访客，保留经典 v0.4.41 界面。**不要把旧的 `web-linux-x64` 单用户包去掉口令后公开**；请选择名称含 `public-web` 的新包。无需 Docker，无需统一网站密码。

## 最短部署步骤

前提：Linux x64、Node.js **20.19.5 或更新正式版**和 npm；已有网站的 HTTPS 域名/反向代理可继续使用。以下命令不修改其他网站，也不安装系统软件。本兼容包支持现有 Node.js 20.19.5，但 Node.js 20 已[结束官方维护](https://nodejs.org/en/about/previous-releases)，长期公网部署建议使用受支持的 LTS。

```bash
tar -xzf HPClaw-0.4.43-public-web-linux-x64-node20.tar.gz
cd HPClaw-0.4.43-public-web-linux-x64-node20
npm ci --omit=dev --ignore-scripts
npm start -- --url https://你的实际域名
```

请下载名称带 `node20` 的兼容更新包，原先不带此后缀的公共包仍要求 Node.js 22。升级时解压到上述新目录，保留原目录；停掉旧 HPClaw 进程后使用相同域名、端口和环境变量启动新包，并调整服务管理器的工作目录。不迁移或删除集群中的用户数据，也不更改 v0.4.41 界面。仅删除旧包的版本检查不等于完成兼容性升级。

最后一条是前台服务，默认监听 `127.0.0.1:3003`。生产环境请交给现有 systemd、PM2 或服务管理器保持运行；域名须与浏览器实际访问的 origin 一致。域名不是自动申请的，npm 启动也不会自动配置 HTTPS。本机测试可直接 `npm start`，访问 `http://127.0.0.1:3003`。

端口变化：`npm start -- --url https://你的域名 --port 3013`。容器/已有网关需要对外监听时明确添加 `--host 0.0.0.0`，务必将该端口限制到可信反向代理。暂不支持 `/hpclaw/` 子路径部署，建议独立域名或子域名；不能只上传静态网页。

从源码构建：`npm ci` → `npm run web:build` → `npm run web:start -- --url https://你的域名`。源码根目录原有 `npm start` 仍是桌面/私有后端；部署包中的 `npm start` 才是公共入口。

## 复用现有 Nginx 网站

将下面 location 放进**自己的 HTTPS server 块**，保留现有证书配置。不要直接覆盖其他网站的配置。

```nginx
location / {
    proxy_pass http://127.0.0.1:3003;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_buffering off;
    proxy_read_timeout 3600s;
    proxy_send_timeout 3600s;
    client_max_body_size 0;
}
```

这里关闭代理缓冲以支持 SSE，保留 WebSocket 升级以支持终端；取消 Nginx 上传大小限制时，请按站点资源策略调整。HPClaw 的浏览器上传直接流到集群 SFTP，不在部署机暂存完整附件。仅当后端只能被这一层可信代理访问时，启用 `HPCLAW_TRUST_PROXY=1`，才能按真实访客 IP 限速。

## 用户登录与数据位置

- 用户填写自己的 SSH 地址、端口、账号、密码/动态验证码，并确认主机指纹。平台不固定集群地址，不共用管理员集群账号。
- AI API Key、模型、HTTPS API 地址由各用户填写。公网 API 域名和 OpenAI-compatible 接口可自定义；禁止 HTTP、内网 API、URL 内嵌密码和自动重定向。
- 对话/记忆保存于个人集群 `~/hpclaw_conversations/`。私人流程、文献学习草稿、AI 配置、流程运行配置、命令历史、作业恢复信息等保存于 `~/hpclaw_web/state.json`。退出后重新登录同一账号可恢复已提交的数据。
- 设置目录权限为 0700，文件为 0600。API Key 是加密字段，但解密密钥也在该账号的状态文件内；安全边界是账号文件权限，**不是**对集群管理员或网站运维方保密。网站后端执行 AI 请求时需要接触 API Key。仅使用可信部署方。
- SSH 密码/TOTP 种子不写入浏览器持久存储；API Key 仅在页面内存及个人集群设置中保存。主题、语言、主机指纹等非机密界面设置可以留在浏览器。
- 每个集群连接使用独立私有工作进程，HTTP、终端、报告资源均检查访客归属。公共网页禁用部署服务器本地文件/命令和 DSH；使用原生 Agent 在个人集群上执行。保留文件上传/下载，但不提供桌面端的本地传输队列或跨集群传输引擎。
- 临时设置缓存不属于本地工作台。Linux 默认使用 `/dev/shm`，否则使用系统临时目录，权限 0700；正常退出清理缓存。系统崩溃、强制杀进程或切换磁盘缓存不能保证立即清除，运维须管理临时目录与备份策略。

报告页面继续使用无同源权限的安全沙箱。目录资源使用登录后签发的 30 分钟只读令牌，支持沙箱加载 CSS/脚本/图表数据；退出立即失效，不能用于其他 API。令牌是限定目录的临时授权，不应分享报告资源 URL；隐藏文件和 HPClaw 私人设置目录不作为报告依赖开放。报告放在专用目录，勿与凭据/私人文件混放；到期后重新打开报告。

## 可连接地址与容量

默认允许用户输入任意可解析的**公网 SSH 主机**，并固定到已校验 IP。始终拒绝部署服务器 loopback、链路本地和云元数据地址。若旧服务位于内网、需要连接私网集群，可由管理员启动时指定：

```bash
HPCLAW_ALLOW_PRIVATE_CLUSTERS=1 npm start -- --url https://你的域名
```

开启后允许 RFC1918/ULA 等私网 SSH 地址，但仍不允许本机/元数据地址；这是站点级放开，须搭配防火墙限制网关进程可达的 SSH 网段和端口。公共服务建议部署在隔离主机，勿使部署机成为敏感内网代理。不能将“任意地址”解释为取消所有网络安全边界。

默认全站最多 16 个集群连接、每位访客最多 4 个。可通过 `HPCLAW_MAX_CLUSTER_CONNECTIONS=32` 调整（1–256）；实际容量取决于内存、CPU、连接与 API 使用量，本版未做大规模负载认证。访客两小时无活动会释放连接；页面刷新后重新登录。已提交的集群批处理不会因网页退出被删除，但网站 AI/监控不保证离线永久运行，需重新登录恢复。

同一集群账号多窗口修改同一个设置文件会检测冲突，拒绝覆盖并提示重新登录；不要用同一 SSH 账号给不同人提供所谓隔离。若进程恰在远程写入期间被强杀，可能残留 `~/hpclaw_web/state.lock`；确认该账号没有任何正在保存的网页连接后，才可手动 `rmdir ~/hpclaw_web/state.lock`。不自动删除无法确认归属的锁。

升级时停止旧服务，将新包解压到新目录，安装依赖并用同一域名/端口启动。不需要复制网页服务器的用户数据库；用户数据在各自集群。回滚到之前的**公共网页包**，不要回滚为无口令的单用户服务。v0.4.43 同时提供 Windows/Mac 文献学习修复；历史版本标签和资产不覆盖。已有文献草稿不会自动改写，升级后重新上传 PDF 学习即可使用原始数据查询与分批生成逻辑。

## 验证范围

自动化覆盖访客越权/CSRF、目标路由、私网地址校验、集群持久化/冲突、浏览器敏感存储与桌面回归；Linux CI 使用两个临时真实 SSH 账号验证打包后端、SFTP 上传下载、对话与配置恢复、WebSocket 终端。未接入用户生产集群，未调用真实付费 AI Key，也未验证其 Nginx 配置或生信流程计算结果。公开运营前仍需在实际域名和网络策略下验收。
