# HPClaw 开发总说明

> 文档定位：这是 HPClaw 当前源码的长期维护入口，供开发者、测试人员和后续 AI 在新增、修改、排障与发布前共同使用。
>
> 基线版本：0.2.17  
> 核对日期：2026-08-29  
> 核对范围：桌面壳、Web 前端、本地服务端、SSH/SFTP、文件传输、AI 对话、两套 Agent 引擎、正式流程、持久化、测试与 Windows 安装包。

## 0. 先读结论

HPClaw 不是一个单纯的 SSH 客户端，也不是一个只会聊天的 AI 界面。它当前是一个面向 HPC/生物信息场景的 Windows 桌面工作台，主要包含：

- 多集群 SSH 终端与主机指纹校验；
- 本地和远程文件浏览、传输、预览、编辑与搜索；
- 普通 AI 对话；
- 可执行命令、调用工具、维护计划的 Agent 模式；
- 有固定目录、步骤脚本和状态机的正式流程；
- 作业状态监控、完成通知、短作业即时登记以及任务自动续跑；
- 内置流程、BioSkills 流程与流程资产部署；
- Electron 安装、崩溃恢复和更新入口。

对“它是不是合格的智能体”的结论是：

**经过 2026-08-29 的自治闭环加固，它已经具备“受控自治 HPC 智能体”的合格技术基础：能建立权威计划、自动续跑、交接并监控长作业、按原上下文恢复、用证据判定流程步骤，并在无法安全继续时明确进入等待。它仍不能被承诺为可无监督完成任意未知科研任务的通用自治智能体。**

判断依据：

- 优点：有计划工具、命令工具、问询工具、技能检索、正式流程状态机、命令风险分类、命令次数上限、作业交接、对话隔离、持久化和恢复机制。
- 优点：工具范围已经覆盖 SSH 命令、远程文件、文件传输、浏览器、WheatOmics、镜像检索、流程状态和通知。
- 优点：正式流程比普通聊天更接近“可验证执行”，因为运行目录、脚本、步骤状态和作业状态都有明确记录。
- 改进：dsh 只承接已正确适配的 DeepSeek；其他提供方固定进入内置 Agent，避免错误路由。
- 改进：每个 dsh Session 都固定绑定 SSH Session、本地工作区、对话键和确认策略，不再使用全局“最近集群”。
- 改进：普通 Agent 计划未完成会在同一请求内自动续跑，达到安全上限后把活动步骤改为 waiting，不再把中断伪装成完成。
- 改进：正式流程的预检、运行修订号、脚本哈希、作业终态验收和自动恢复形成了服务端闭环。
- 局限：完成状态主要证明“命令执行过、状态被更新”，不能自动证明科学结果正确。

因此，当前推荐定位是：

| 使用场景 | 结论 |
| --- | --- |
| 人在回路中的 SSH、文件和分析辅助 | 合格 |
| 采用内置正式流程执行已审核步骤 | 合格的受控自治路径，科学结果仍需流程 QC/人工抽检 |
| 单集群、低风险的普通 Agent 自动化 | 合格，仍保留确认、安全预算和明确等待 |
| 多集群同时运行 dsh Agent | 已做代码级强绑定；发布前仍需真实双集群冒烟 |
| 无监督执行未知来源流程或任意命令 | 不合格 |
| 作为通用、强自治、可审计科研智能体 | 尚未达到 |

## 1. 文档与事实来源

### 1.1 事实来源优先级

项目中保留了多轮历史文档，有些设计已经落地，有些实现后来被替换。遇到冲突时按以下顺序判断：

1. 当前源码、共享类型与实际路由；
2. 当前自动化测试；
3. package.json、构建脚本与安装配置；
4. 本开发总说明；
5. 功能专项文档，例如 XFTP_WORKSPACE.md；
6. README、历史版本说明、superpowers 计划和规格；
7. 论文草稿、截图和历史构建日志。

不得仅依据旧文档修改关键执行链。特别注意：

- docs/FLOW_AUTOMATION.md 描述的是旧流程结构，不能作为当前运行状态的权威来源；
- docs/PROJECT_OVERVIEW.md 中的组件、测试数量和部分目录已经过时；
- docs/AI_IMPROVEMENT_PLAN.md 同时包含已完成事项和仍未接线的设计；
- 根目录 server.cjs 是历史产物，桌面打包实际使用 dist-electron/server.cjs；
- dist、dist-electron 和 release 都是生成目录，不是业务源码。

### 1.2 运行时的权威状态

不同功能的权威状态并不相同：

| 功能 | 权威状态 |
| --- | --- |
| 正式流程运行 | 集群运行目录中的 run.json |
| 正式流程定义 | 本地应用数据目录中的工作流 JSON；运行后以 workflow.snapshot.json 为冻结快照 |
| 正式流程实际代码 | 该次运行目录的 code/step-NN.sh |
| 普通内置 Agent 计划 | 当前会话消息中的隐藏计划检查点与前端恢复数据 |
| dsh Agent 上下文 | dsh 自身会话，加 HPClaw 保存的会话映射 |
| 聊天记录 | 按集群保存的对话文件与当前前端会话 |
| 文件传输 | 本地 transfers.json；进程内任务为实时状态 |
| 集群连接 | 服务端内存中的 SSH Session，重启后失效 |
| 密钥和登录资料 | Electron safeStorage；浏览器开发模式可能退化为本地明文存储 |

维护时最容易犯的错误，是把普通聊天计划、dsh 会话和正式流程 run.json 当成同一套状态。它们是三条独立链路。

### 1.3 本文维护规则

每次出现下列变更时，必须同步修改本文：

- 新增或删除 Agent 工具；
- 改变模型/引擎路由；
- 改变正式流程状态、目录或步骤迁移规则；
- 新增持久化文件、凭据或密钥；
- 修改安装、自动更新或运行时目录；
- 扩展文件预览、编辑或传输语义；
- 改变命令确认、安全边界或目录限制；
- 修改测试命令、测试规模或支持平台。

本文末尾保留变更记录。后续 AI 不应删除尚未修复的风险项，只能在提供代码与测试证据后更新其状态。

## 2. 项目边界与术语

### 2.1 产品边界

HPClaw 当前的主要目标平台是 Windows 10/11 x64 桌面端。应用通过 Electron 启动一个仅监听本机回环地址的 Node 服务，再由该服务连接远程 HPC 集群。

它不包含：

- 自建的大模型推理服务；
- 集群账户、VPN、SSH 服务或调度器本身；
- 科学结果正确性的自动证明；
- 通用容器级命令隔离；
- 多用户服务端权限模型；
- 在线协作数据库。

### 2.2 关键术语

- **集群 Session**：一次 SSH 连接，具有独立 sessionId。
- **对话 Context**：一个聊天的上下文标识。同一集群可以有多个互不串话的对话。
- **普通对话**：只生成回答，不运行工具。
- **Agent 模式**：允许模型计划、调用工具和执行命令。
- **内置 Agent**：server/ai/agentRunner.ts 中基于 AI SDK 的执行器。
- **dsh Agent**：随桌面应用启动的 dsh sidecar，以及 HPClaw dsh 插件和桥接工具。
- **正式流程**：由工作流定义创建独立运行目录，并由 run.json 管理步骤状态的执行方式。
- **流程定义**：可复用模板，包含参数、步骤、软件、参考数据、资产和 QC 条件。
- **流程运行**：某次具体执行，拥有独立 runId、参数快照、代码、日志和结果。
- **预检**：在执行前检查调度器、模块、软件、参考数据和流程资产。

## 3. 总体架构

    用户
      |
      v
    Electron 主进程
      |-- 安全存储、窗口、更新、本地文件、远程编辑缓存
      |-- 启动本地 Node 服务
      |-- 启动/复用 dsh sidecar
      |
      v
    React 前端  <------ Socket.IO / SSE / HTTP ------>  Express 服务
      |                                                   |
      |                                                   |-- SSH / PTY
      |                                                   |-- SFTP / 文件传输
      |                                                   |-- 内置 AI Agent
      |                                                   |-- 正式流程状态机
      |                                                   |-- 作业监控/通知
      |                                                   |-- dsh 桥
      |                                                           |
      |                                                           v
      |                                                      dsh sidecar
      |                                                           |
      +-----------------------------------------------------------+
                                                                  |
                                                                  v
                                                           远程 HPC 集群

核心设计特点：

- UI 与集群之间没有直接 SSH 连接，所有远程操作经过本地服务；
- Electron 主进程负责操作系统能力，不把 Node 权限直接暴露给页面；
- 正式流程运行在集群自己的隔离目录中；
- 长作业交给 LSF/Slurm/PBS，而不是让 AI 请求永久阻塞；
- 普通 Agent 与正式流程执行器不是同一个可靠性等级；
- dsh 提供更广的工具生态；集群桥已统一身份、路径和确认策略，浏览器与纯本地工具仍由 dsh 自身安全门治理。

## 4. 源码目录地图

| 路径 | 责任 | 修改提示 |
| --- | --- | --- |
| src/ | React 前端 | 页面状态、对话、终端、流程与文件工作区 |
| src/components/AIChat.tsx | AI 对话主组件 | 体积较大，修改时优先抽取逻辑并补流式事件测试 |
| src/features/file-transfer/ | 文件浏览、预览、编辑、传输 UI | 本地/远程语义必须同时检查 |
| src/features/workflows/ | 正式流程前端 API 与实时状态 | 以 run.json 状态为准 |
| src/services/ | AI 请求、SSE、配置、密钥前端桥 | 注意桌面与浏览器降级路径 |
| server.ts | 服务端组装入口 | 仍是较大入口文件，不宜继续堆叠完整业务模块 |
| server/ai/ | 内置 Agent、上下文、技能与安全 | 不是 dsh 的实现 |
| server/dsh/ | dsh sidecar、翻译、会话映射、桥接 | 身份和路径已加固，新增工具必须保持绑定不变量 |
| server/cluster/ | SSH Session、认证与注册 | 多集群隔离的基础 |
| server/files/ | SFTP 文件服务与路由 | 任何写操作需审查路径边界 |
| server/transfers/ | 任务队列、持久化与传输执行 | 任务必须绑定明确 Session |
| server/workflows/ | 流程库、预检、运行状态机 | 正式流程的权威后端 |
| server/notifications/ | 作业轮询和通知 | 会触发流程对账和 dsh 续跑 |
| electron/ | Electron 主进程与 IPC | 包含安全存储、本地文件、更新和崩溃恢复 |
| shared/ | 前后端共享类型和规则 | 状态枚举、预览分类、Agent 限额应优先放这里 |
| skills/ | 应用内置技能 | 被技能索引读取 |
| lsf_skills/ | LSF 相关技能/知识 | 与系统提示共同约束集群命令 |
| workflows/ | 流程种子与资产 | 与本地应用数据里的流程实例不同 |
| pipelines/ | 流程相关实现/资产 | 修改前确认是否由具体工作流引用 |
| vendor/ | dsh、插件、Node 运行时 | 第三方/随包运行内容，避免直接改生成物 |
| scripts/ | 构建、安装、回归与文档脚本 | 有部分脚本带历史环境假设 |
| tests/ | Python 辅助测试 | 不在 npm test 默认范围内 |
| docs/ | 当前说明、旧设计与论文材料 | 本文是开发入口 |
| dist/、dist-electron/、release/ | 生成产物 | 不直接修改，不作为源码依据 |

当前几个超大文件：

- src/components/AIChat.tsx；
- src/features/file-transfer/FileTransferWorkspace.tsx；
- src/features/file-transfer/FilePreview.tsx；
- server/ai/agentRunner.ts；
- server/transfers/transferEngine.ts；
- electron/main.cjs；
- server.ts。

它们是后续重构优先对象。新增功能应优先落到独立模块，而不是继续增加这些文件的条件分支。

## 5. 启动、构建与运行链路

### 5.1 开发模式

常用命令以 package.json 为准：

- npm run dev：运行 TypeScript 服务端并由 Vite 提供前端；
- npm run lint：执行 TypeScript 类型检查；
- npm test：运行 Vitest；
- npm run build：构建前端；
- npm run build:electron-server：将服务端打为 dist-electron/server.cjs；
- npm run electron:dist：构建 Windows 安装包。

注意：clean 与 start 中仍有偏 POSIX 的命令写法，在 Windows PowerShell/CMD 下不一定直接可用。Windows 开发者应优先使用上面已经验证的命令，后续应把清理和生产启动脚本改为跨平台 Node 脚本。

### 5.2 桌面启动顺序

1. Electron 获取单实例锁；
2. 准备 userData 和 runtime 目录；
3. 通过 safeStorage 读取或创建服务端加密密钥；
4. 选择从 3003 开始的可用回环端口；
5. 以 ELECTRON_RUN_AS_NODE=1 启动打包后的 dist-electron/server.cjs；
6. 注入 HPCLAW_DATA_ROOT、桌面访问令牌、加密密钥和父进程 PID；
7. 等待本地服务健康；
8. 建立 BrowserWindow，先显示启动页，再加载本地 Web UI；
9. 前端在渲染前尝试恢复桌面密钥，等待上限约 4 秒；
10. 用户登录集群后创建 SSH Session、PTY 和可选 SFTP；
11. Agent 模式按路由规则进入内置 Agent 或 dsh Agent。

本地服务只绑定 127.0.0.1，不设计为局域网服务器。父 Electron 进程退出后，服务端看门狗会终止孤儿进程。

### 5.3 打包与安装

当前打包特征：

- Electron 42.x；
- Windows x64；
- NSIS 每用户安装，可选择目录；
- 默认创建桌面和开始菜单入口；
- 安装包包含应用服务端、dsh、插件与 Node 运行时；
- 安装过程使用 nsProcess 关闭旧 HPClaw/随包 Node 进程；
- 构建脚本会对 NSIS/7zip 单线程兼容补丁和安装包 CRC 做检查；
- 卸载默认保留用户运行数据；
- 当前安装包没有代码签名。

安装包可以发给其他 Windows x64 电脑使用，但接收方仍需：

- 可访问所需 AI 服务；
- 自己的 AI API Key；
- 可连接目标集群的网络/VPN；
- SSH 账户、密码/验证码或相应认证条件；
- 接受未签名程序可能触发的 SmartScreen 提示。

安装包并不会复制发送者已保存的密钥和集群凭据。

### 5.4 不应直接修改的生成物

- dist/；
- dist-electron/；
- release/；
- 根目录 server.cjs；
- node_modules/；
- vendor 中由上游包或构建复制生成的内容。

如需修复服务端，修改 server.ts 或 server/；如需修复桌面逻辑，修改 electron/；然后重新构建验证。

## 6. 运行数据与持久化

### 6.1 本机数据

桌面端把 HPCLAW_DATA_ROOT 指向 Electron userData 下的 runtime 目录。主要数据包括：

| 数据 | 位置/机制 | 说明 |
| --- | --- | --- |
| 服务日志 | runtime/hpclaw-server.log | 后端启动、错误和退出信息 |
| 工作流定义 | runtime 下的应用数据目录 | 首次运行写入内置与 BioSkills 种子 |
| AI 服务端资料 | 本地 JSON + secretBox | 有桌面密钥时加密敏感字段 |
| 通知/QQ Bot 密钥 | 本地 JSON + secretBox | 同上 |
| 对话 | 本地对话存储 | 按集群与对话标识保存 |
| 传输任务 | transfers.json | 仅恢复可继续的任务 |
| dsh 会话映射 | dsh-sessions.json | 连接 HPClaw 对话与 dsh 会话 |
| 作业-Agent 绑定 | 本地 JSON | 支持作业结束后续跑 |
| 登录资料/API Key/TOTP | Electron safeStorage | 桌面模式受操作系统用户保护 |
| 远程编辑缓存 | Electron userData 缓存 | 保留未同步修改，重启后可恢复 |

浏览器开发模式没有 Electron safeStorage，部分敏感信息会退化到 localStorage 或没有服务端加密密钥的明文 JSON。不得把浏览器开发模式的数据保护等级描述成与桌面安装版相同。

### 6.2 集群端数据

正式流程默认位于：

    <集群 home>/hpclaw_flows/<流程 slug>/03_workspace/runs/<runId>/

典型结构：

    code/
      step-01.sh
      step-02.sh
      README.md
    logs/
    results/
    config.json
    workspace.json
    workflow.snapshot.json
    run.json

其中：

- workflow.snapshot.json 是该次运行使用的流程定义快照；
- config.json 是解析后的运行参数；
- workspace.json 描述工作区；
- code/step-NN.sh 是实际执行代码；
- run.json 是步骤和整次运行的权威状态；
- logs 和 results 由脚本与工具产生。

集群技能约定目录是 ~/hpclaw_skills。登录后及技能/AI 请求前会触发后台刷新；本地系统技能和用户技能也会共同进入索引。

## 7. SSH、终端与多集群会话

### 7.1 登录与信任

登录支持密码和键盘交互式验证码。第一次连接未知主机指纹时，服务端返回待确认状态；指纹不一致时阻止连接。前端必须把用户确认过的指纹随重试请求发送，不能跳过此步骤。

SSH Session 的主要特性：

- 最大约 8 个活动 Session，超出后淘汰最旧连接；
- keepalive 约 15 秒，连续失败后断开；
- 主连接建立后打开 PTY；
- SFTP 打开失败不会同时杀死可用终端；
- Shell channel 失效时，可在主 SSH 传输仍存活的前提下重新创建；
- 单次命令支持超时并主动关闭 channel；
- Session 关闭时终止仍在执行的命令。

HTTP 层还维护有界 Session 信息，数量和生存期受到限制，避免无限增长。

### 7.2 Session 选择规则

正常 API 请求应显式发送 X-SSH-Session-Id。Cookie 仅作为兼容路径。多集群功能不能依赖“最近登录的集群”。

新增任何集群工具时必须满足：

1. 从本次请求解析明确的 sessionId；
2. 验证 Session 仍连接；
3. 把 sessionId 记录到任务或运行；
4. 后续恢复、重试、通知继续使用同一个 sessionId；
5. 不得使用进程级全局“最后一次 Session”。

dsh 桥已按 dshSessionId 查找固定绑定的 sshSessionId，不存在进程级“最近一次集群”回退。新增桥工具必须继续遵守这一规则。

### 7.3 终端实时链路

终端使用 Socket.IO：

- 浏览器发送按键和尺寸；
- 服务端写入 SSH PTY；
- PTY 数据实时回传；
- 断线时前端显示状态；
- 主 SSH 仍活跃时尝试恢复 Shell；
- 集群完全断开时清理 Session 和相关资源。

Socket.IO CORS 配置较宽，但服务只监听回环地址。若未来允许局域网访问，必须先增加 Origin、认证、CSRF、速率限制和多用户隔离，不能只改监听地址。

## 8. 本地与远程文件系统

### 8.1 文件工作区能力

文件工作区由本地窗格、远程窗格、传输队列、同步计划和预览器组成，支持：

- 浏览本地和远程目录；
- 新建文件/文件夹；
- 重命名；
- 复制和粘贴；
- 删除；
- 路径复制；
- 搜索；
- 本地与远程互传；
- 文件夹传输；
- 本地、远程和集群到集群传输；
- 应用内预览；
- 调用系统默认软件打开；
- 远程文件下载后本地编辑并同步回集群。

右键菜单和键盘入口应共享同一套动作能力，不能分别维护两套文件语义。

### 8.2 预览类型

当前分类和默认限制大致如下：

| 类型 | 扩展名示例 | 默认策略 |
| --- | --- | --- |
| 图片 | png、jpg、gif、bmp、webp、avif、svg、ico | 应用内预览，约 25 MiB 上限 |
| PDF | pdf | 应用内预览，约 50 MiB 上限 |
| Word | docx | 应用内解析，约 25 MiB 上限 |
| 表格 | xlsx、xls、xlsm、xlsb、ods、fods | 应用内解析，约 25 MiB 上限 |
| 文本表格 | csv、tsv、tab | 应用内解析，约 2 MiB 上限 |
| HTML | html、htm | 沙箱 iframe，约 10 MiB；脚本默认关闭 |
| 音频 | 常见音频格式 | 媒体预览，约 25 MiB 上限 |
| 视频 | 常见视频格式 | 媒体预览，约 50 MiB 上限 |
| Markdown/文本 | md、txt、脚本、配置等 | 文本/Markdown 预览，通常约 2 MiB |
| 大文本 | 约 100 MiB 及以上 | 只取头部少量内容 |
| 不适合内置预览 | 老式 Office、演示文稿、TIFF/HEIC/RAW/PSD、压缩包、BAM/CRAM/BCF、bigWig、HDF5、Parquet、可执行文件 | 交给系统软件打开 |

HTML 预览通过内容安全策略阻断外部网络，脚本默认关闭；用户主动启用脚本时也运行在隔离沙箱中。扩展预览格式时必须同时检查：

- 文件分类；
- 服务端读取上限；
- MIME 类型；
- 本地与远程路径；
- 渲染沙箱；
- 截断状态；
- 编辑许可；
- “系统打开”降级。

未知扩展当前可能按文本处理，遇到二进制内容会产生乱码。后续应增加内容探测或明确的二进制兜底。

### 8.3 应用内编辑与系统编辑

应用内编辑只允许未截断的文本、Markdown 和 HTML。保存时分别调用本地或远程写接口。

“用本机软件打开并编辑远程文件”的链路是：

1. 把远程文件下载到 Electron 管理的缓存目录；
2. 调用操作系统默认应用打开；
3. 只有操作系统确认成功打开后，才标记为编辑中；
4. 文件监听器发现内容哈希变化；
5. 把修改上传回原集群路径；
6. 关闭应用时检查未同步变更；
7. 重启后恢复中断的编辑 Session。

如果用户选择放弃同步，缓存仍保留以便恢复。此处不要简单删除缓存，否则可能造成用户数据丢失。

### 8.4 删除与路径安全

本地删除优先放入系统回收站；如果回收站调用失败，当前实现会退化为永久删除。UI 在执行前必须清楚提示。

远程写操作会保护根目录、/home 和当前 home 目录本身，但并没有把所有写入强制限制在用户 home 之下。只要 SSH 账户本身有权限，某些绝对路径仍可修改。因此：

- 不要在文档或 UI 中宣称“所有远程写入只允许 home 内”；
- dsh 的远程文件工具必须补真正的根目录约束；
- 高风险删除必须有明确目标预览和二次确认；
- 远程递归删除虽然使用安全参数传递，但服务端删除预览目前只展示根项，不等于完整递归清单。

## 9. 文件传输引擎

### 9.1 任务类型与生命周期

传输引擎支持：

- 本地上传到集群；
- 集群下载到本地；
- 同一集群内远程复制；
- 集群到集群直传；
- 集群到集群经本机中继。

并发数默认 2，可配置约 1–4。任务支持单项暂停、继续、停止、重试，也支持全部暂停、全部继续和全部停止；网络类失败最多自动重试约 3 次。

文件面板的拖放语义与 Xftp 类工具一致：跨窗格拖到空白处表示传到当前目录，拖到目录行表示传到该子目录；同一窗格拖到目录行表示移动到子目录。禁止把目录移动到自身或后代目录。右键复制/粘贴与拖放共用端点和路径语义。

持久化恢复规则：

- 进行中的任务在重启后转为暂停；
- 已完成和已取消任务不保留到下次队列；
- 远程复制任务不会跨重启恢复；
- 凭据不以明文永久写入任务文件。

### 9.2 一致性与校验

上传/下载使用流式读写和临时文件，完成后按大小或 SHA-256 校验，再重命名到目标。远程端优先使用 OpenSSH 原子重命名；兼容路径可能先移除目标再改名，因此不能把所有后端都描述为完全原子。

“带宽限制”配置目前没有真正执行限速，是界面/模型字段而非已完成能力。

Socket 收到传输完成事件后会合并短时间内的连续事件，并让左右两个可见目录重新读取；不再要求用户手动刷新才能看到新增文件。目录刷新令牌只触发列表读取，不重建传输工作区和队列。

### 9.3 集群到集群

优先尝试在源集群使用 rsync/scp 直传；不满足条件时由本机中继。自动化链路可能：

- 在源集群创建持久 SSH 密钥；
- 把公钥加入目标集群 authorized_keys；
- 如果公钥方案不可用，在源集群临时保存目标密码/TOTP 种子和包装脚本；
- 将临时文件设为仅用户可读；
- 在任务结束状态清理临时凭据。

这是一项高权限操作。新增 UI 或 Agent 调用时必须明确告知用户，并让任务记录源 Session、目标 Session、目标主机指纹和使用的传输方式。

### 9.4 Session 绑定

传输创建、暂停、继续、取消、重试、移除和清理已统一使用请求解析出的 SSH Session。单项变更会核对任务的 sessionId；清理已完成记录只影响本 Session。前端批量操作也按每个任务自己的 sessionId 发出，不能用当前标签误控另一个集群的任务。

仍需真实双集群并发冒烟，重点覆盖远程互传时的 sourceSessionId、目标 sessionId、标签切换和任务恢复。

## 10. AI 请求总入口与引擎路由

### 10.1 三条执行链

HPClaw 的 AI 相关功能必须区分为三条链：

| 链路 | 入口 | 执行器 | 权威状态 |
| --- | --- | --- | --- |
| 普通聊天 | AIChat 非 Agent 模式 | 内置模型适配器 | 对话消息 |
| 普通 Agent | AIChat Agent 模式 | 内置 Agent 或 dsh Agent | 对话计划或 dsh 会话 |
| 正式流程 Agent | 带 workflowContext | 固定使用内置 Agent | 集群 run.json |

正式流程故意不走 dsh，因为它依赖内置执行器对步骤、命令目录和状态迁移的严格控制。

### 10.2 当前路由规则

server/dsh/engineRouter.ts 的当前大意是：

1. 环境变量强制 legacy 时使用内置 Agent；
2. 正式流程使用内置 Agent；
3. 非 Agent 对话使用内置模型；
4. provider 精确为 DeepSeek 的普通 Agent 才使用 dsh；
5. 用户可在设置里明确选择 auto、native 或 dsh；native 对兼容的普通 Agent 请求有显式优先权；
6. OpenAI、Gemini、Grok、Moonshot/Kimi 和自定义兼容服务全部使用内置 Agent。

路由采用能力矩阵，不允许“未知提供方默认进入 dsh”：

| 提供方 | 普通聊天 | 内置 Agent | dsh Agent | 推荐 |
| --- | --- | --- | --- | --- |
| DeepSeek | 支持 | 支持 | 支持 | 普通 Agent 默认 dsh，正式流程内置 |
| Gemini | 支持 | 支持 | 未接入 | 内置 |
| OpenAI | 支持 | 支持 | 未接入 | 内置 |
| Grok | 支持 | 支持 | 未接入 | 内置 |
| Moonshot/Kimi | 支持 | 支持 | 未接入 | 内置 |
| 自定义兼容服务 | 支持 | 支持 | 未接入 | 内置 |

### 10.3 请求与流式响应

前端请求包含：

- 显式 SSH Session；
- conversationContextId 和 conversationId；
- 经过裁剪的消息；
- 简短会话摘要；
- Agent 设置；
- Agent 引擎偏好；
- 恢复计划；
- 正式流程上下文；
- 语言；
- dsh 本地工作区。

服务端使用 SSE 回传：

- 状态；
- 文本；
- 推理；
- 工具调用与结果；
- 计划与步骤更新；
- 用户问询；
- 命令确认；
- SSH 断开；
- 完成或错误。

客户端和服务端都有总时长、空闲时长、心跳与有限网络重试。不要在新工具中创建没有超时、没有取消或没有终态的长连接。

## 11. 内置 Agent

### 11.1 能力

内置 Agent 位于 server/ai/agentRunner.ts，支持多个模型提供方和以下核心工具：

| 工具 | 用途 |
| --- | --- |
| set_plan | 创建多步骤计划 |
| reset_plan | 重置计划 |
| update_plan_step | 更新步骤状态和证据 |
| run_command | 在当前集群执行命令 |
| ask_user | 向用户提问并提供选项 |
| search_skills | 搜索可用技能 |
| search_public_resources | 查询 NCBI、Crossref、GitHub、Wikipedia，并返回来源链接 |
| save_skill | 保存新技能 |
| get_workflow | 读取流程 |
| get_workflow_step | 读取正式流程当前步骤 |
| get_workflow_run | 读取 run.json |
| update_workflow_run | 迁移正式流程状态 |

正式流程只暴露与该次运行相关的工具，不允许模型另建一套平行计划。

### 11.2 计划规则

多步骤或改变状态的任务需要先建立计划。计划步骤有合法状态迁移，完成时要求摘要和证据。普通 Agent 的计划会编码到隐藏系统消息，用于切换对话或重启后的恢复。

这套计划不是服务端数据库，也不等同于 run.json：

- 如果前端没有保存会话，计划可能无法长期恢复；
- 模型在计划未完成时结束本轮，服务端会携带权威计划自动续跑，默认最多 3 次；
- 达到续跑或模型步骤上限时，活动步骤会转为 waiting 并返回明确暂停原因；
- 同一轮已经成功执行的状态变更命令不会再次执行，模型应改用只读验证和计划更新；
- 正式流程则会读取 run.json 并最多自动续跑若干轮，仍未终结时进入 waiting_user。

### 11.3 命令治理

run_command 会进行：

- 命令风险分类：只读、写入、作业、网络、破坏性、未知；
- 硬性拒绝 rm；
- 对状态变更要求存在计划；
- 同一命令重复次数限制；
- 连续失败限制；
- 每轮命令预算；
- 按用户配置进行确认；
- 输出长度截断；
- 正式流程目录约束；
- 作业 ID 识别与交接。

Agent 配置的典型范围：

- 每轮命令约 5–200，默认约 40；
- 模型/工具步骤约 10–500，默认约 200；
- 正式流程单轮命令更低，自动续跑轮数也有限。

禁止 rm 是命令字符串级的安全门，不代表所有破坏性行为都被绝对阻止。mv 覆盖、重定向覆盖、脚本内部删除以及工具写入仍需额外治理。

### 11.4 正式流程命令约束

正式流程命令会自动进入该次运行目录，并阻止明显的：

- 离开运行目录；
- 向上级目录跳转；
- 全局递归扫描；
- 未授权路径扫描。

这套规则主要基于命令分析和路径令牌，不是 shell AST、容器或操作系统沙箱。符号链接、复杂 shell 展开和脚本内部行为仍可能绕过文本规则。因此流程脚本必须经过审核，不能把命令范围检查当成绝对隔离。

### 11.5 作业交接

当命令返回可信的 LSF/Slurm 提交信息时：

- 解析真实 jobId；
- 正式流程进入 waiting_jobs；
- 当前计划步骤进入等待；
- 本轮 AI 停止占用；
- 后台 watcher 接管轮询；
- 提交回执一出现就立即登记到 watcher，避免短作业跨过轮询窗口；
- 作业进入终态后对账流程，并自动触发 Agent 读取日志、输出和 QC 继续验收。

长任务应生成步骤脚本并提交调度器，不应让 run_command 持续等待几十分钟。

### 11.6 完成判定

内置 Agent 的“完成”有三个层级：

1. 命令执行成功；
2. 计划步骤被标为完成；
3. 科学结果经结果文件、QC 和人工复核确认。

系统当前能较好覆盖前两层，但第三层只在具体流程和 QC 脚本明确实现时成立。后续不得仅凭模型说“完成了”就认定科研任务正确。

## 12. dsh Agent 与工具生态

### 12.1 组成

dsh 链路由以下部分组成：

- server/dsh/dshSidecar.ts：准备并启动 dsh Web sidecar；
- server/dsh/dshClient.ts：连接 dsh；
- server/dsh/dshAgentRunner.ts：把 HPClaw 请求转给 dsh；
- server/dsh/dshTranslate.ts：把 dsh 流式事件转换成 HPClaw SSE；
- server/dsh/conversationScope.ts：维护对话与 dsh Session 映射；
- server/dsh/bridgeRoutes.ts：向 dsh 插件提供集群能力；
- server/dsh/jobAgentBindings.ts：持久化作业与 Agent 会话绑定；
- server/dsh/dshJobResumer.ts：作业结束后的续跑；
- vendor/dsh-plugin：HPClaw 的 dsh 工具插件；
- vendor/dsh 与 vendor/node-runtime：随安装包分发的运行时。

sidecar 只监听本机，并使用随机桥接令牌。启动失败时可退回内置 Agent；但 sidecar 已成功启动后发生的提供方配置或模型调用错误，目前不会自动切回内置 Agent。

### 12.2 当前工具

插件向 dsh 提供的主要能力包括：

| 工具组 | 主要能力 | 当前治理状态 |
| --- | --- | --- |
| run_command | 在绑定的集群执行命令 | 拒绝 rm；服从对话确认策略 |
| cluster_fs | 远程列表、读取、写入、上传、下载 | 本地限定工作区；远程限定 SSH home；写入统一确认 |
| wheatomics_query | WheatOmics 查询 | 网络工具，确认规则未与命令完全统一 |
| github_mirror_scout | 镜像/仓库检索 | 网络工具 |
| hpclaw_server_health | 检查 HPClaw 服务健康 | 只读 |
| hpclaw_api_get | 调用白名单 API | 受白名单限制 |
| browse_open/eval/click/type/screenshot/close | 独立浏览器自动化 | 使用独立配置，不继承用户日常浏览器登录 |
| dsh 本地文件/命令工具 | 操作用户选择的本地工作区 | dsh 自身安全门 + HPClaw 桥边界 |

工具数量已经足以支持多工具任务。集群命令和 cluster_fs 已统一服从 HPClaw 对话确认策略；浏览器和纯 dsh 本地工具仍保留各自的安全门，因此新增工具时仍要显式说明授权层。

### 12.3 多集群身份绑定

bridgeState 为每个 dsh Session 保存固定绑定，插件的每次桥请求都携带 X-HPClaw-Dsh-Session。服务端按下面的映射解析，不接受全局最近 Session：

    dshSessionId -> conversationContextId -> sshSessionId -> active ClusterSession

找不到绑定时返回 409 dsh_session_not_bound；绑定存在但 SSH 已断开时返回 no_cluster_session。真实双集群环境仍要做并发冒烟，但代码级全局串用路径已经移除。

### 12.4 文件边界

每个 dsh 对话会绑定一个本地工作区根目录。本地已存在路径通过 realpath 校验，新增目标通过最近已存在父目录解析，阻止符号链接/junction 越界；相对路径被拒绝。远程 cluster_fs 的读写和传输目标限定在该 SSH 用户 home，home 根本身禁止作为写入目标。

远程边界当前是词法路径边界。SFTP 服务端若允许跟随指向 home 外部的远程符号链接，仍可能形成越界，因此生产集群应限制此类链接，并在后续加入 lstat/realpath 能力后继续加固。

### 12.5 确认策略

前端允许用户选择：

- 只确认危险命令；
- 确认所有状态变更；
- 每条命令都确认。

内置 Agent 和 dsh 集群桥都使用本次对话传入的策略。cluster_fs 在需要确认时返回 428，插件发起用户审批，获准后仅重试一次。策略与 dsh Session 一起绑定，后台续跑时沿用原策略。

### 12.6 sidecar 配置生命周期

dsh sidecar 是进程级单例，但现在会对插件、技能、脚本、baseURL 和 provider 环境计算 SHA-256 指纹。指纹变化时串行停止旧进程并重建；失败状态允许后续独立请求冷恢复。指纹会覆盖 API Key 变化但不输出明文。

### 12.7 作业完成自动续跑

dsh 作业提交后会记录：

- jobId；
- scheduler；
- SSH Session；
- dsh Session；
- 对话 ID；
- 恢复次数。

后台 watcher 发现 DONE/EXIT 等终态后，获取作业尾部输出并尝试唤醒原 dsh Session。每个作业有有限续跑次数，避免无限循环。

边界：

- 如果新对话尚未持久化 conversationId，续跑消息不一定完整写回长期对话；
- LSF 作业消失后会用 bjobs -a 补查 DONE/EXIT，Slurm 用 sacct 补查；历史信息完全不可用时仍只能保守推断终态；
- 长时间前台等待仍会受到 AI 请求总超时影响。

## 13. 对话隔离、记忆与 Token

### 13.1 对话隔离

每个对话具有独立 conversationContextId：

- 新建对话创建新 ID；
- 打开已保存对话恢复原 ID；
- AIChat 组件以 Context ID 重新挂载；
- 自动保存键同时包含 SSH Session 和 Context ID；
- dsh 映射包含 SSH Session 和对话上下文。

因此当前前端已经实现“一次对话一个上下文”，不同对话不会直接共用完整消息历史。以下内容仍会共享，但不算聊天串话：

- 同一集群的实时状态摘要；
- 系统策略；
- 公共技能索引；
- 同一流程库；
- 用户主动选择的本地工作区。

若出现串话，首先检查请求里的 conversationContextId、conversationId、sshSessionId 和 dshSessionId，而不是只看 UI 标题。

### 13.2 上下文裁剪

前端发送最近约 18 条消息，总字符量约 20,000；单条用户/助手消息和系统消息也有限制。正式流程标记和关键上下文会在普通裁剪前恢复。

服务端再按模型上下文窗口估算 Token，并在以下内容之间分配预算：

- 系统与安全规则；
- 集群快照；
- 技能；
- 会话摘要；
- 最近消息；
- 正式流程状态。

Token 估算是启发式算法，模型窗口也是配置表，不是提供方实时返回值。模型升级或新增提供方时必须同步更新并做超长上下文测试。

### 13.3 摘要与记忆

当前会话摘要比较简单：主要抽取最近少量消息并进行字符裁剪，再附加技能关键词。server/ai 中存在 MemoryOrchestrator、ObservationStore 和结构化记忆实现及测试，但主请求尚未把 structuredMemory、observations 或 taskPlan 真正传入上下文构建器。

流程运行器另有一套窄范围“使用习惯”：同一流程至少使用两次后，可用最近 12 次配置的多数值预填普通参数、步骤参数和常见跳过步骤。它不保存输入/参考路径、环境变量式路径、疑似密钥、命令覆盖或聊天内容；用户可在运行器中点击“清除习惯”。这不是跨流程的语义记忆，不能把它宣传成模型自训练。

这意味着：

- 代码库中“存在高级记忆模块”不等于产品已经使用它；
- 不要在产品说明中宣称具备完整的长期语义记忆；
- 接线时应先定义隐私、生命周期、删除和跨对话隔离规则；
- 观察记录不能默认跨对话注入。

### 13.4 流程化节省 Token 的现状

正式流程已经采取：

- 只发送简短启动标记；
- 服务端直接读取 run.json；
- 只加载当前步骤；
- 注入当前步骤脚本而非整套流程；
- 限制正式流程单轮输出和工具次数；
- DeepSeek 正式流程使用更确定的模型参数；
- 作业等待交给 watcher，而不是持续占用模型；
- 最多自动续跑有限轮次。

这是真实的 Token 优化，但还不是完整的“智能流程化”。普通 Agent 仍可能反复读取信息、重新解释目标或进行重复尝试。

下一阶段应统计：

- 每个任务总输入/输出 Token；
- 每个步骤 Token；
- 缓存命中；
- 重复命令；
- 失败重试；
- 技能加载大小；
- 正式流程与自由 Agent 完成同类任务的差值。

没有这些数据，不能仅凭请求字符变少判断 Token 已经最优。

### 13.5 技能索引接线

技能索引会同时扫描安装包内系统技能和 HPCLAW_DATA_ROOT/skills 用户技能；save_skill、技能安装器和技能 API 写入用户目录，不再修改安装目录。集群技能在登录后及技能/AI 请求前后台刷新，并按 SSH Session 缓存。

三层技能来源：

| 层级 | 建议位置 | 更新方式 | 信任级别 |
| --- | --- | --- | --- |
| 系统技能 | 安装包内只读目录 | 随版本发布 | 受信策略 |
| 用户技能 | HPCLAW_DATA_ROOT/skills | UI/Agent 安装 | 参考内容，需审核执行 |
| 集群技能 | ~/hpclaw_skills | 集群扫描 | 参考内容，按集群隔离 |

后续仍应让全部索引项统一带 source、clusterId、version、hash、mtime 和 trustLevel；当前来源隔离已经接线，但完整信任分级尚未完成。

## 14. 正式流程系统

### 14.1 流程库

当前应用数据中可种子化 6 个内置流程和 41 个 BioSkills 流程，共 47 个流程。流程定义可包含：

- 名称、说明和关键词；
- 参数与默认值；
- 分步骤脚本模板；
- 软件和版本要求；
- Module 检查；
- 参考数据；
- QC；
- 资产；
- 来源与论文学习信息。

数量是当前版本的实测基线，不应写死在 UI 逻辑中。

### 14.2 创建运行

正式流程不是由模型自由创建目录。服务端负责：

1. 读取流程定义；
2. 解析参数；
3. 创建独立 runId 和运行目录；
4. 写入 config.json、workspace.json 和 workflow.snapshot.json；
5. 为每一步生成 code/step-NN.sh；
6. 写入 code/README.md；
7. 创建 run.json；
8. 尝试部署流程资产；
9. 返回运行状态；
10. AI 只在这个既定运行中执行和更新步骤。

运行历史中的工作目录可直接打开到文件传输工作区。失败、等待人工确认、环境阻断或超过心跳阈值的运行可以调用恢复接口：接口用 expectedRevision 防止覆盖后台监控的新状态，Agent 再从第一个未完成/失败步骤继续。waiting_jobs 且调度器仍显示活动的作业不会重复触发。

旧文档中由 AI 创建 run、inputs.md 或固定 04_results 报告的说法不适用于当前通用实现。

### 14.3 状态机

运行状态：

- blocked_env；
- running；
- waiting_user；
- waiting_jobs；
- done；
- failed；
- cancelled；
- unknown。

步骤状态：

- pending；
- running；
- done；
- failed；
- skipped。

主要迁移规则：

- pending 可进入 running 或 skipped；
- running 可进入 done 或 failed；
- failed 可重试进入 running，也可 skipped；
- done 需要摘要；
- 后续步骤完成前，前置步骤必须 done/skipped；
- 整次运行只有全部步骤结束后才能 done。

run.json 使用临时文件加移动的方式更新，并带单调 revision。服务端对同一 run 使用进程内串行锁，调用者可传 expectedRevision 做乐观并发校验。跨多个 HPClaw 服务进程同时写同一集群 run 的分布式锁仍未实现。

整次运行进入 done 且流程没有显式 reportPath 时，服务端会从 run.json 已验证的步骤摘要、输出和 QC 证据确定性生成 `results/run-summary.md`。这一步不调用模型、不增加 Token；若报告落盘失败，不会反向抹掉已验证完成状态。

### 14.4 步骤代码编辑

用户可在 UI 中编辑每步脚本，单文件有大小限制，修改后记录 user modified 和 scriptHash。步骤进入 running 时冻结 submittedScriptHash；已有 jobId 以及 running/done/skipped 的步骤禁止继续改脚本。若要修改已运行代码，应创建新的运行或显式重试修订，不能篡改历史运行证据。

### 14.5 预检

预检会：

- 创建流程工作区和清单；
- 探测 Module 初始化；
- 识别 LSF/Slurm/PBS；
- 检查命令和版本；
- 检查参考数据；
- 检查资产；
- 缓存结果。

它不会自动安装软件。流程定义中的 checkCmd/versionCmd 会在集群 shell 中执行，因此流程定义本质上包含可执行代码。导入或 AI 生成的流程必须经过审核。

创建运行时，如果流程存在 required 环境而缓存不存在、版本不符或 Manifest 哈希变化，服务端会自动执行当前版本预检；未知或失败结果进入 blocked_env，不会直接创建 running 运行。缓存包含 workflowId、workflowVersion 和 manifestHash。

剩余边界是 clusterIdentity 和过期时间尚未写入缓存键；若同一 home 会被不同集群复用，后续必须加入集群身份和有效期。

### 14.6 作业对账

后台 watcher 约每 45 秒检查 LSF/Slurm 状态。Agent 拿到提交回执时会立即把 jobId 写入对比基线，短作业即使在两个轮询之间结束也能触发事件。Slurm 通过 sacct、LSF 通过 bjobs -a 补查消失作业的最终状态；通知去重键包含 SSH Session，避免不同集群同号作业互相吞事件。

调度器 DONE 现在只把流程从 waiting_jobs 转为“等待 Agent 验收”，不会直接把步骤标为 done。后台 Agent 会读取日志、预期输出和 QC，再带真实 evidence/summary 更新步骤；调度器 EXIT 保持失败语义。“调度器中查不到”仍不等于科学分析成功，步骤脚本应写：

- 调度器终态；
- 退出码；
- 预期输出；
- 完成标记；
- QC 结果。

### 14.7 流程完成的证据

run.json 的步骤摘要和 evidence 主要由 Agent 提交。当前没有通用的科研证据解析器。

一个高质量流程应为每步明确：

- 成功退出码；
- 必须存在的输出文件；
- 最小/最大大小；
- 样本数量；
- 校验和或行数；
- 工具版本；
- QC 阈值；
- 可重跑性；
- 失败清理策略。

只有这些条件自动核对通过，流程状态才更接近“任务真实完成”，而不是“模型声称完成”。

## 15. 作业监控、通知与恢复

用户登录后启动 jobWatcher。它负责：

- 识别调度器；
- 轮询用户作业；
- 记录终态；
- 发送 UI 事件；
- 触发通知；
- 对账正式流程；
- 恢复绑定的 dsh Agent。

通知配置可能包含敏感信息，桌面模式使用服务端加密盒保存。新增通知渠道时必须：

- 对密钥加密；
- 不在日志和测试快照中泄露；
- 支持发送测试；
- 处理限流；
- 明确失败不会改变作业真实状态；
- 不让通知失败阻塞流程状态对账。

## 16. Electron 安全、稳定性与更新

### 16.1 桌面安全边界

窗口使用：

- contextIsolation=true；
- nodeIntegration=false；
- preload 暴露白名单 IPC；
- 后端仅监听回环；
- Electron 专用访问令牌；
- safeStorage 保存敏感桌面资料。

新增 OS 能力必须通过最小 IPC 接口，不应把任意 shell 或文件系统对象暴露给渲染页面。

### 16.2 白屏与崩溃恢复

Electron 会记录：

- renderer 进程退出；
- 页面加载失败；
- 控制台错误；
- 未响应；
- 后端日志。

渲染异常时会在约 60 秒窗口内尝试有限次数重新加载，超过阈值后提示重启。Windows 上为规避历史图形驱动白屏，当前禁用了 GPU 加速。

排查白屏时优先收集：

- runtime/hpclaw-server.log；
- Electron 主进程日志；
- renderer 崩溃原因和退出码；
- 加载 URL 与本地服务健康；
- 内存占用；
- 是否在大文件预览、大型对话或 GPU 相关操作后发生。

不要只增加无限 reload；这会掩盖根因并造成循环。

### 16.3 关闭保护

关闭窗口前检查：

- 正在进行的传输；
- 未同步的远程编辑；
- 需要保存的状态。

Windows 上结束后端会关闭整个进程树，解决打包 Node 残留导致安装器提示 HPClaw 仍在运行的问题。安装器也使用进程枚举清理旧版本残留，而不是依赖用户是否已经登录应用。

### 16.4 更新

更新中心支持在线更新和选择本地安装包。在线更新只在打包的 Windows 环境启用，默认发布地址是占位地址，必须由正式发布配置替换。

当前安装包未签名。正式分发前应：

1. 购买/配置代码签名证书；
2. 对 EXE 和更新产物签名；
3. 在应用内校验更新来源和签名；
4. 使用 HTTPS 正式地址；
5. 固化回滚策略；
6. 维护最小升级路径测试。

## 17. API、Socket 与 IPC 地图

以下是维护时的功能分组，不替代源码中的真实路由：

| 层 | 功能组 | 主要实现 |
| --- | --- | --- |
| HTTP | 登录/登出/健康 | server.ts、server/cluster |
| HTTP | AI 请求与配置 | server.ts、server/ai |
| HTTP | 技能 | server.ts、server/ai/skill* |
| HTTP | 远程文件 | server/files/registerFileRoutes.ts |
| HTTP | 传输 | server/transfers/registerTransferRoutes.ts |
| HTTP | 工作流定义 | server/workflows/registerWorkflowRoutes.ts |
| HTTP | 预检 | server/workflows/registerPreflightRoutes.ts |
| HTTP | 流程运行 | server/workflows/registerWorkflowRunRoutes.ts |
| HTTP | 通知 | server/notifications/registerNotificationRoutes.ts |
| HTTP | AI Gateway | server/ai/gatewayRoutes.ts |
| HTTP | dsh 桥 | server/dsh/bridgeRoutes.ts |
| Socket.IO | 交互终端 | server.ts、server/socketSession.ts |
| Socket.IO | 作业/运行状态事件 | server.ts、jobWatcher |
| SSE | AI 文本和工具事件 | server.ts、agentRunner/dshTranslate |
| IPC | 本地文件 | electron/local-files.cjs、preload.cjs |
| IPC | 远程编辑 | electron/remote-edit-sessions.cjs |
| IPC | 安全存储/TOTP | electron/secret-store.cjs、totp.cjs |
| IPC | 更新 | electron/update-manager.cjs |
| IPC | 窗口与关闭保护 | electron/main.cjs、window-close-guard.cjs |

新增接口的最低要求：

- 明确身份：桌面令牌、SSH Session、dsh Session 或本地 IPC 来源；
- 参数 schema 校验；
- 路径规范化；
- 超时和取消；
- 限制响应体；
- 不输出秘密；
- 错误码可区分重试、用户确认和永久失败；
- 单元测试；
- 对状态变更记录审计信息。

## 18. 安全与信任模型

### 18.1 内容信任分层

系统提示和维护者审核过的内置策略可标为受信策略。以下内容只能作为参考数据：

- 用户输入；
- 集群文件；
- 命令输出；
- 导入技能；
- 集群技能；
- 网页；
- 论文和流程描述；
- 工具返回的文本。

参考数据中出现“忽略规则”“执行命令”等内容不能提升为系统策略。技能和流程可能包含可执行命令，安装/导入不等于可信。

### 18.2 主要威胁

- Prompt injection 诱导模型执行命令；
- 恶意流程 checkCmd/versionCmd；
- 路径穿越和符号链接越界；
- 多集群 Session 串用；
- 本地 API 被其他本机进程调用；
- API Key 或临时凭据写入日志；
- 远程文件覆盖；
- 未签名安装包被替换；
- 浏览器工具访问恶意页面；
- 模型把命令成功误报为科研成功。

### 18.3 当前保护

- 回环绑定；
- Electron 桌面令牌；
- dsh 随机桥接令牌；
- SSH 主机指纹；
- safeStorage；
- 服务端敏感字段加密；
- 命令风险分类和确认；
- rm 拒绝；
- 命令/步骤上限；
- 正式流程目录约束；
- SFTP 安全参数；
- HTML 沙箱；
- 单实例和父进程看门狗；
- 有界 Session；
- 部分原子文件写。

### 18.4 仍需补齐

- 所有工具统一授权器；
- dsh Session 与 SSH Session 强绑定；
- 本地/远程真实根目录沙箱；
- 更新签名；
- 本地 API 更细粒度鉴权；
- 流程导入签名/哈希和信任状态；
- run.json 并发控制；
- 审计日志；
- 秘密扫描；
- 真实集群与真实模型的安全回归。

## 19. 测试与质量基线

### 19.1 当前验证结果

在 0.2.17 源码基线上：

- npm run lint：通过；
- npm test：通过；
- Vitest：106 个测试文件、765 项测试；
- 测试总耗时约 40 秒。

测试覆盖大量：

- Agent 计划与安全；
- SSE 生命周期；
- 模型适配；
- Token 预算；
- 技能索引与编排；
- SSH Session；
- 文件路径和 SFTP；
- 文件预览；
- 文件工作区组件；
- 传输引擎和持久化；
- 工作流定义、预检和运行状态机；
- dsh 翻译、会话、桥和作业恢复；
- Electron 密钥、编辑、更新、关闭和稳定性。

### 19.2 测试不代表什么

npm test 主要是单元、组件和模拟集成测试，它没有默认证明：

- 真实 SSH 集群连接；
- 真实 LSF/Slurm/PBS；
- 所有 AI 提供方；
- dsh sidecar 全链路；
- 网络中断后的完整恢复；
- 多集群并发；
- 大文件传输；
- 安装、升级、卸载；
- Windows 不同显卡和权限环境；
- 科学流程结果正确。

tests/test_hidog_hpclaw_helpers.py 不在 npm test 默认范围。应增加 Python 测试入口或统一测试脚本。tests/__pycache__ 不应进入源码分发。

### 19.3 类型检查边界

当前 TypeScript 配置排除了测试文件，也排除了 src/features/file-transfer/syncPlanner.ts，并启用了 skipLibCheck 等宽松设置。所以“lint 通过”不是全仓严格类型证明。

后续质量提升：

- 测试代码单独 tsconfig；
- 将 syncPlanner.ts 纳入检查；
- 逐步关闭不必要的宽松项；
- 对 server.ts 和 AIChat.tsx 拆分后启用更严格规则；
- 加 ESLint 安全与 React Hooks 规则。

### 19.4 发布前最低回归

每个版本至少执行：

1. npm run lint；
2. npm test；
3. npm run build；
4. npm run build:electron-server；
5. 构建 Windows 安装包并做 CRC 检查；
6. 全新安装；
7. 覆盖升级；
8. 未登录时安装/卸载；
9. 登录一个集群；
10. 同时登录两个集群并验证 Session 不串；
11. 终端断线恢复；
12. 上传、下载、暂停、恢复；
13. 远程文件系统打开、编辑、同步；
14. 图片、PDF、HTML、Office 和大文本预览；
15. 普通聊天和 Agent；
16. 每个支持提供方至少一次；
17. 正式流程创建、预检、提交、等待和完成；
18. 关闭时有活动传输/未同步编辑；
19. 白屏恢复；
20. 更新中心本地安装包。

### 19.5 CI 缺口

仓库当前没有 GitHub Actions 或其他可见 CI 配置。发布仍依赖本机手工执行。至少应建立：

- 每次提交：类型检查、Vitest、Python 测试、构建；
- 每次标签：Electron 服务端构建、Windows 安装包、CRC、签名、产物清单；
- 定期：真实测试集群冒烟和多提供方 AI 冒烟；
- 安全：依赖审计、秘密扫描、许可证检查。

## 20. 如何扩展项目

### 20.1 新增 UI 功能

1. 判断功能属于全局 App、具体集群 Tab、具体对话还是具体流程运行；
2. 状态尽量放在对应作用域，避免全局单例；
3. 数据访问放到 src/services 或 feature/api；
4. 组件只处理显示和交互；
5. 添加空状态、加载、失败、重试和取消；
6. 中英文文案同步；
7. 组件测试和服务测试同步。

### 20.2 新增模型提供方

1. 扩展共享 provider 类型；
2. 实现服务端模型适配器；
3. 定义默认 baseURL、模型和鉴权；
4. 增加桌面安全存储；
5. 更新能力矩阵；
6. 明确是否支持内置 Agent；
7. 未实现 dsh 适配时强制路由到内置 Agent；
8. 测试普通聊天、工具调用、流式错误和超时；
9. 更新 Token 窗口配置；
10. 禁止把 Key 输出到日志。

### 20.3 新增内置 Agent 工具

1. 定义严格 schema；
2. 标注只读/写入/网络/破坏性；
3. 接入统一确认；
4. 绑定明确 SSH Session 和对话；
5. 设置超时、输出上限和取消；
6. 提供可验证结果；
7. 让工具失败不破坏计划状态；
8. 写安全测试、重复调用测试和多 Session 测试；
9. 更新本文工具表。

### 20.4 新增 dsh 工具

除上面要求外，还必须：

- 工具请求携带 dshSessionId；
- 服务端从映射解析固定 sshSessionId；
- 不读取全局最近 Session；
- 本地路径限制在对话工作区；
- 远程路径限制在授权根；
- 使用 HPClaw 统一 Policy；
- 对浏览器/网络工具记录外部目标；
- 提供 sidecar 真集成测试。

### 20.5 新增技能

技能应包含：

- 唯一 ID、名称、版本；
- 适用条件；
- 输入和输出；
- 依赖软件；
- 安全边界；
- 失败处理；
- 来源、哈希和信任等级；
- 最小示例。

技能是“给模型的操作知识”，不是“已经验证过的程序”。含命令的技能必须以参考内容注入，除非经过维护者审核并固定版本。

### 20.6 新增正式流程

1. 定义参数和验证；
2. 将任务分成可独立验收的步骤；
3. 为每步生成幂等脚本；
4. 列出 required/optional 软件；
5. 固定参考数据来源和校验和；
6. 定义资源和调度参数；
7. 写预期输出和 QC；
8. 写失败恢复和重新运行策略；
9. 预检命令保持最小、只读、可审查；
10. 添加状态机、模板和脚本测试；
11. 在真实测试集群跑最小样本；
12. 冻结版本后再进入内置库。

### 20.7 新增预览格式

同时修改：

- shared/filePreview.ts 的分类和限制；
- 服务端预览路由；
- src/features/file-transfer/previewRenderers.tsx；
- FilePreview UI；
- 本地与远程读取；
- MIME 和沙箱；
- 大小/截断策略；
- 系统打开降级；
- 组件和共享规则测试。

对可执行文档、HTML、SVG、PDF、Office 宏和媒体元数据保持不信任。能交给系统软件安全打开的格式，不一定需要把复杂解析器打进应用。

## 21. 人类与 AI 的修改作业规范

### 21.1 接手时的阅读顺序

1. 本文；
2. package.json；
3. server.ts、src/main.tsx、src/App.tsx、electron/main.cjs；
4. 与任务相关的 feature 目录；
5. shared 中的类型和规则；
6. 同名测试；
7. 专项文档；
8. 历史设计，仅作为背景。

### 21.2 修改前

- 明确用户要解决的是症状、根因还是新能力；
- 检查是否有未提交/未归属改动；
- 找到真实入口、状态来源和持久化位置；
- 搜索同一概念在前端、服务端、Electron、shared 和测试中的所有引用；
- 列出可能影响的 Session、对话、流程和文件边界；
- 不修改生成目录。

### 21.3 修改中

- 先改共享类型和不变量；
- 再改服务端；
- 再改前端/IPC；
- 对副作用加入明确授权；
- 对长操作加入进度、取消和恢复；
- 错误信息给用户可执行的下一步；
- 保留兼容迁移；
- 不把秘密写日志；
- 不把全局变量用于用户/集群/对话归属；
- 不通过放宽安全检查来掩盖功能问题。

### 21.4 修改后

- 执行相关测试；
- 执行完整 lint 与 test；
- 涉及桌面或打包时构建安装包；
- 手工验证关键用户路径；
- 更新本文；
- 更新版本号和版本说明；
- 列出已验证与未验证范围；
- 不把“测试通过”写成“所有真实环境都通过”。

### 21.5 给后续 AI 的工作指令模板

可将下面内容作为任务开头，并补充具体需求：

    请先阅读 docs/DEVELOPMENT_GUIDE.md，并以当前源码和测试为最高事实来源。
    不要直接修改 dist、dist-electron、release、node_modules 或根目录 server.cjs。
    修改前先定位前端、服务端、Electron、shared、持久化和测试的完整链路。
    涉及多集群时必须显式绑定 sshSessionId；涉及对话时必须绑定 conversationContextId；
    涉及正式流程时以 run.json 为权威状态；涉及副作用时接入统一确认与路径约束。
    完成后运行相关测试、npm run lint、npm test，并更新本开发说明中的能力或风险状态。
    最终说明代码变更、验证证据、尚未覆盖的真实环境和回滚方式。

### 21.6 变更说明模板

    目标：
    用户可见变化：
    根因：
    修改模块：
    状态/数据迁移：
    安全影响：
    兼容性：
    自动测试：
    手工验证：
    未覆盖范围：
    回滚方式：
    文档更新：

## 22. 智能体成熟度评估

### 22.1 评估标准

| 维度 | 当前评分（5 分） | 依据 |
| --- | ---: | --- |
| 任务理解与上下文 | 3.5 | 有集群快照、会话摘要、技能和流程状态；结构化记忆未接线 |
| 计划能力 | 4.3 | 内置 Agent 有权威计划、自动续跑、等待状态和恢复；dsh 使用自身计划器 |
| 工具广度 | 4.5 | SSH、文件、传输、浏览器、领域查询、流程和通知较丰富 |
| 工具选择 | 3.8 | 有系统提示、技能编排和提供方能力路由；缺工具级效果指标 |
| 执行闭环 | 4.2 | 普通计划自动续跑；正式流程按 run.json 和证据闭环 |
| 长任务能力 | 4.2 | 提交即时登记、后台 watcher、终态补查和自动恢复已接线 |
| 上下文隔离 | 4.5 | 对话 Context、dsh Session、SSH Session 和工作区明确绑定 |
| 安全与授权 | 3.8 | 内置与 dsh 集群工具统一确认，文件根已收紧；远程符号链接仍需加固 |
| 验证与证据 | 3.7 | done 要求摘要和证据，调度器 DONE 不等于步骤 done；通用科研 QC 仍不普遍 |
| 可恢复性 | 4.0 | 终端、传输、远程编辑、流程和部分 Agent 均有恢复 |
| 可观测性 | 3.5 | 日志、SSE、任务状态较全；缺统一审计和 Token 指标 |
| 工程质量 | 3.8 | 765 项测试；无 CI、签名和完整真实 E2E |

综合约 4.0/5。它已达到“受控自治、领域明确、工具丰富、流程可审计”的 HPC 智能体基础，而不是承诺完成任意未知任务的通用 Agent。

### 22.2 能否完整完成命令和任务

**单条命令：** 在 SSH 稳定、命令合法、权限满足且不触发超时的情况下，通常可以完成并返回输出。

**多步普通任务：** 可以计划和执行；模型提前结束时服务端自动续跑，仍无法完成时转入 waiting。确认中断、权限不足和外部系统失败仍可能要求人工处理。

**正式流程任务：** 当前最接近完整闭环。它有隔离目录、步骤脚本、状态迁移、作业等待和有限自动续跑，但仍依赖流程质量、预检、退出码和 QC。

**长时间调度任务：** 可以提交后交给 watcher，避免持续消耗模型；完成后自动恢复原上下文并验收。跨应用重启的 SSH 重连和真实调度器差异仍需集群验证。

**跨多个集群：** 文件传输和 dsh Agent 都采用显式 Session 归属；自动测试已覆盖绑定拒绝和隔离，发布前仍应做真实双集群并发验证。

### 22.3 是否擅长使用多个工具

从工具数量、Session 绑定、确认策略和作业恢复看，它已经具有可靠组合多个工具的基础；工具结果 schema、幂等键和效果指标仍未完全统一。

达到真正擅长还需要：

- 一个统一工具注册表；
- 一套跨引擎 Policy；
- 每次调用的 Session/Context/Run 绑定；
- 结果 schema；
- 幂等键；
- 重试分类；
- 调用证据；
- 工具级耗时和 Token 统计；
- 任务完成条件。

### 22.4 是否真正流程化

正式流程已经是真正的状态化流程，不只是长 Prompt；普通 Agent 则仍以对话和模型自主决策为中心。

建议把任务分成三档：

| 档位 | 适用任务 | 执行方式 |
| --- | --- | --- |
| 自由问答 | 解释、建议、短命令 | 普通聊天/Agent |
| 半结构任务 | 有计划但步骤不固定 | 内置 Agent + 计划检查点 |
| 正式流程 | 高成本、长时间、可重复、需审计 | run.json 状态机 + 固定步骤脚本 |

不要把所有任务都强行流程化；只有重复、高风险、长耗时或需要验证的任务才值得固化。

## 23. 已知问题与优先级

### 已完成的自治与安全硬化（2026-08-29）

1. dsh Session 固定绑定 SSH Session、对话、工作区和确认策略，移除全局最近集群；
2. 只有 DeepSeek 普通 Agent 进入 dsh，未适配提供方统一回到内置 Agent；
3. dsh 本地文件限定工作区，远程文件限定 SSH home；
4. sidecar 按配置指纹重启并支持失败后冷恢复；
5. 普通 Agent 未完成计划自动续跑，达到上限转 waiting；
6. 正式流程强制当前版本预检，run.json 带 revision，步骤脚本带提交哈希和编辑锁；
7. 调度器 DONE 不再等同科学完成，后台 Agent 验收后才能标记步骤 done；
8. 短作业提交后立即登记，LSF/Slurm 终态补查，完成后恢复原 Agent 上下文；
9. 用户技能与集群技能刷新已接入真实请求链。

### P1：进入正式生产前修复

1. 远程 SFTP 符号链接的服务端 realpath/lstat 边界仍需加强；
2. 预检缓存还缺 clusterIdentity 和过期时间；
3. run.json 只有单进程锁，缺跨服务进程分布式锁；
4. 通用科研 QC/退出码/结果 schema 尚未覆盖所有流程；
5. 传输任务 Session 所属校验仍需统一审计；
6. 安装包未签名；
7. 没有 CI 和正式发布门禁；
8. 需要真实双集群、真实 LSF/Slurm、安装包和跨重启 E2E。

### P2：建议重构

1. MemoryOrchestrator 和 ObservationStore 未接入主上下文；
2. Token 优化缺可观测指标；
3. 带宽限制字段未实现；
4. 未知二进制可能按文本预览；
5. 远程递归删除预览不完整；
6. server.ts、AIChat.tsx 等文件过大；
7. saveResume、前端 monitorJob 等疑似旧路径应清理；
8. Windows-first 项目仍有 POSIX-only npm 脚本；
9. Python 测试未进入统一命令；
10. release 目录积累旧安装包和失败产物；
11. 在线更新 URL 仍是占位配置；
12. 前端生产构建的主 JavaScript 分块约 1.63 MB（压缩后约 496 KB），Vite 已给出大分块警告，应继续按功能懒加载和拆包。

## 24. 推荐实施路线

### 阶段 A：身份与安全（主体已完成）

1. 已重构 dsh Session -> SSH Session 映射并移除全局最近 Session；
2. 已让集群命令和 cluster_fs 服从同一对话确认策略；
3. 已限制 dsh 本地工作区和远程 SSH home；
4. 已修正 provider 能力矩阵和 sidecar 配置重启；
5. 已加入绑定缺失、路径越界、确认策略和提供方路由回归；待真实双集群冒烟。

验收标准：同时运行两个集群的 Agent，命令、文件、确认、作业和消息始终属于正确 Context。

### 阶段 B：正式流程闭环（主体已完成）

1. 已实现创建运行前自动预检和 blocked_env；
2. 已实现缓存绑定流程版本/Manifest；待补集群身份和过期；
3. 已实现 run.json revision/expectedRevision 和单进程串行写；
4. 已实现脚本哈希、提交哈希和运行中只读；
5. 已实现调度器终态后 Agent 验收；各流程仍要补具体退出码、输出与 QC 契约。

验收标准：无法在环境未知、脚本漂移或状态竞争时被错误标为成功。

### 阶段 C：统一技能、记忆和 Token

1. 三层技能目录与后台刷新已接线；
2. 继续引入统一技能来源元数据和信任分级；
3. 决定结构化记忆的隐私与生命周期后再接线；
4. 记录每任务/步骤/工具 Token 和耗时；
5. 建立重复命令与无效上下文指标；
6. 把高频任务固化为正式流程。

验收标准：同类任务流程化后，Token、失败率和人工介入有可测量下降。

### 阶段 D：工程化发布

1. 建 CI；
2. 加真实测试集群；
3. 代码签名与可信更新；
4. 清理生成物和旧版本；
5. 拆分大文件；
6. 建统一诊断包导出；
7. 建版本兼容和回滚矩阵。

验收标准：每个安装包都能追溯源码、测试、签名、哈希和升级结果。

## 25. 诊断检查表

### AI 不执行或提前结束

- 当前是聊天、普通 Agent 还是正式流程？
- 实际路由到内置 Agent 还是 dsh？
- provider 是否受 dsh 支持？
- SSE 最后一个事件是什么？
- 计划是否仍有未完成步骤？
- run.json 当前状态是什么？
- 是否等待用户确认/问询？
- 是否提交了作业并进入 watcher？
- SSH Session 是否仍连接？
- 是否达到命令、工具或总时长上限？

### 对话串话

- 两个对话的 conversationContextId 是否不同？
- conversationId 是否误复用？
- 自动保存键是否包含正确 SSH Session？
- dsh Session 映射是否按 Context 分开？
- 实际问题是共享集群摘要，还是共享历史消息？
- 桥请求的 X-HPClaw-Dsh-Session 是否存在并能解析到预期 SSH Session？

### 文件打不开或编辑不同步

- 是应用内预览还是系统打开？
- 文件类型和大小是否受支持？
- shell.openPath 是否返回错误？
- 远程文件是否成功下载到缓存？
- 编辑 Session 是否在 OS 成功打开后才建立？
- 文件 watcher 是否看到哈希变化？
- 上传时原 SSH Session 是否仍在线？
- 是否有未同步恢复项？

### 安装器提示 HPClaw 未关闭

- 任务管理器是否仍有 HPClaw.exe？
- 是否有安装包内 Node 后端残留？
- 主进程日志是否显示进程树清理？
- 是全新安装，还是旧版本卸载记录或后台自启动残留？
- 安装器是否使用当前 nsProcess 逻辑？
- 安装包 CRC 是否通过？

### 白屏或崩溃

- runtime/hpclaw-server.log；
- Electron/renderer 退出原因；
- 是否本地服务未就绪；
- 是否大文件或大对话导致内存压力；
- 是否自动 reload 已达到次数；
- 是否是旧安装残留；
- 能否在全新 userData 或开发模式复现。

## 26. 版本发布清单

发布负责人应填写：

    版本：
    提交/源码快照：
    Node/npm：
    Electron：
    npm run lint：
    npm test：
    Python 测试：
    前端构建：
    服务端构建：
    安装包：
    安装包 SHA-256：
    CRC：
    代码签名：
    全新安装：
    覆盖升级：
    卸载：
    双集群：
    AI 提供方：
    dsh：
    正式流程：
    文件编辑/预览/传输：
    白屏恢复：
    已知问题：
    回滚安装包：

## 27. 当前代码证据入口

维护者可从以下文件交叉核对本文：

- package.json；
- server.ts；
- src/main.tsx；
- src/App.tsx；
- src/components/AIChat.tsx；
- server/ai/agentRunner.ts；
- server/ai/contextBuilder.ts；
- server/ai/providerAdapters.ts；
- server/ai/workflowCommandScope.ts；
- server/dsh/engineRouter.ts；
- server/dsh/dshAgentRunner.ts；
- server/dsh/dshSidecar.ts；
- server/dsh/bridgeRoutes.ts；
- server/dsh/bridgeState.ts；
- server/dsh/conversationScope.ts；
- server/workflows/workflowRunService.ts；
- server/workflows/preflight.ts；
- server/notifications/jobWatcher.ts；
- server/files/sftpFileService.ts；
- server/transfers/transferEngine.ts；
- shared/workflowRun.ts；
- shared/filePreview.ts；
- electron/main.cjs；
- electron/preload.cjs；
- electron/local-files.cjs；
- electron/remote-edit-sessions.cjs；
- electron/update-manager.cjs；
- scripts/build-electron-server.mjs；
- scripts/build-windows-installer.mjs；
- 同目录与各模块旁的测试文件。

## 28. 变更记录

### 2026-08-29 / 0.2.17 安装升级永久修复

- 现场捕获到安装器真实错误 `Failed to uninstall old application files: 2`；外层安装器等待确认导致用户看到长期无法安装；
- 确认 electron-builder 的 `--updated` 旧卸载器依赖跨目录原子 Rename，安装目录与系统临时目录跨盘时必然失败；
- 升级统一改为“精确清理 HPClaw 自有进程后原地覆盖”，不再调用任何版本的旧卸载器；显式卸载功能保持不变；
- 保留 0.2.16 的 dsh 完整进程树、Electron 退出日志和 vendor 子树清理修复；
- 发布验证必须覆盖跨盘安装目录、运行中覆盖、dsh Node 残留覆盖、同版本重装和显式卸载。
- 发布 `HPClaw-Setup-0.2.17-x64.exe`，大小 240,673,319 字节，SHA-256 为 `469372D7D0FB90AD2245F04991DEA7F01B92DEF62033281AE0502DC5CE8AFD48`；
- 真实对照验证确认旧策略稳定返回错误 2，而 0.2.17 在跨盘、运行中、dsh Node 残留和同版本重装组合场景下完成安装，无错误窗口；显式卸载通过；
- 完整验证记录见 `release/HPClaw-Setup-0.2.17-x64.verification.md`。

### 2026-08-29 / 0.2.16 退出与安装闭环修复

- dsh 停止时在 Windows 使用 `taskkill /T /F` 结束 shell、内置 Node 与终端完整子树，避免只关闭外层 shell 后留下锁文件进程；
- Electron 退出补充原因日志、8 秒进程树清理超时和 `will-quit` 幂等兜底，渲染崩溃退出也会先清理后台；
- 安装器同时读取当前用户、所有用户和目标安装目录，只终止各安装目录内 `app.asar.unpacked\\vendor` 下的 HPClaw 自有进程；
- 0.2.13 至 0.2.15 作为已知退出不完整版本跳过旧卸载入口，由新安装器释放文件锁后覆盖修复；
- 新增 Windows 子进程树终止测试，并要求执行“启动、退出、零残留、覆盖安装、卸载”发布验证。
- 当前回归基线：106 个 Vitest 文件、765 项测试，TypeScript 检查通过。

### 2026-08-29 / 0.2.15 安装包发布

- 汇总发布 0.2.14 源码阶段完成的文件传输、流程断点续跑、双 Agent 引擎、思考折叠、流程习惯学习、公共资源查询和免 Token 运行报告改进；
- 保持安装器原生进程检测、后台残留关闭、内嵌 Node 清理和内置 CRC 验证；
- 发布前基线为 105 个 Vitest 文件、762 项测试，TypeScript 检查、前端生产构建和 Electron 服务端构建通过；
- 发布 `HPClaw-Setup-0.2.15-x64.exe`，大小 240,672,802 字节，SHA-256 为 `60F4B18538D8E4F336FC5896449078D72375EE705B9FE6A6A2438E3BB9DFCFB0`；
- 安装器 CRC、当前用户安装、隔离启动、HTTP 页面响应、优雅退出和静默卸载均通过；安装时确认旧版 5 个后台 HPClaw 进程可被自动关闭；
- 安装包尚未进行 Authenticode 代码签名；机器级覆盖升级和 UAC 路径仍需在管理员测试机人工回归；
- 完整验证记录见 `release/HPClaw-Setup-0.2.15-x64.verification.md`。

### 2026-08-29 / 0.2.14

- 基于当前源码重新梳理完整架构；
- 区分普通聊天、内置 Agent、dsh Agent 和正式流程；
- 记录文件预览与系统打开能力；
- 记录对话 Context 隔离；
- 记录安装、白屏恢复和远程编辑机制；
- 记录初始基线 103 个 Vitest 文件、739 项测试通过；
- 给出智能体成熟度结论；
- 标记多集群 dsh 错绑、提供方路由、文件边界、预检和技能接线等问题；
- 建立供人类和后续 AI 使用的维护流程。

### 2026-08-29 / 0.2.14 自治闭环加固

- dsh 会话与 SSH 集群、对话、工作区和确认策略强绑定；
- 修正提供方路由、sidecar 配置生命周期和用户/集群技能接线；
- 普通 Agent 增加自动续跑、明确等待和成功状态变更去重；
- 正式流程增加版本化预检、revision、脚本哈希、编辑锁和完成证据；
- 作业提交即时登记，LSF/Slurm 终态补查，完成后自动验收与续跑；
- 完整回归更新为 103 个 Vitest 文件、748 项测试通过。

### 2026-08-29 / 0.2.14 文件、流程与双引擎交互加固

- 文件面板支持同窗格拖入子目录、跨窗格精准投递，队列支持单项/全部暂停、继续和停止；
- 传输完成自动刷新目录，所有任务控制与清理按 owner SSH Session 隔离；
- 流程运行目录可直接跳到集群文件工作区，失败/中断/等待状态可用 revision 从断点继续；
- 流程卡片折叠时直接提供运行、修改、删除，删除流程定义不删除已有运行结果；
- 设置新增 auto/native/dsh 引擎选择，正式流程保持原生执行器，DSH 同时加载系统、用户和调度技能；
- 流式思考默认折叠，用户问询继续使用结构化选项；
- 新增隐私受限的流程参数习惯、可一键清除，不保存路径、疑似密钥或命令；
- 内置 Agent 新增 NCBI、Crossref、GitHub、Wikipedia 公共资源查询工具；
- 完成流程自动从真实运行证据生成无额外 Token 的 Markdown 报告。
- 当前回归基线：105 个 Vitest 文件、762 项测试；前端生产构建与 Electron 服务端构建通过。
