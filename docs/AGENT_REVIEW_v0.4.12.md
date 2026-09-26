# HPClaw v0.4.12 Agent 综合评审

评审范围：AI 执行主链路、上下文构建、Skill 发现与注入、长任务续跑、对话隔离、集群任务可见性、安全边界与可观测性。

## 结论

HPClaw 已经是一个具备真实执行闭环的 HPC Agent，而不是简单的聊天界面。它拥有计划状态机、结构化流程状态、命令审批、SSH 工具执行、作业号绑定、作业结束自动续跑、Skill 检索、上下文预算和对话持久化。以桌面单用户科研工具衡量，当前成熟度约为 **8/10**；如果作为多人共享或远程部署的 Agent 服务，因用户级隔离与会话所有权尚未闭合，成熟度约为 **6/10**。

| 维度 | 评分 | 评价 |
| --- | ---: | --- |
| Agent 执行闭环 | 8.5/10 | 计划、执行、确认、证据、续跑链路完整 |
| 正式流程与长任务 | 9/10 | RUN 状态、作业绑定、终态唤醒和防停滞机制较成熟 |
| 上下文工程 | 7/10 | 有预算、裁剪、集群快照与摘要，但长期记忆尚未真正接线 |
| Skill 调用 | 7.5/10 | 有索引、评分、依赖图和安全标签，缺少可解释路由与版本追踪 |
| 对话隔离（桌面单用户） | 8/10 | conversationContextId、SSH session、workspace 哈希隔离合理 |
| 对话隔离（多人服务） | 4.5/10 | 本地对话库、AI 配置、确认/反问缺少 owner 绑定 |
| 安全控制 | 7/10 | 命令审批、路径限制、主机指纹与不可信上下文标签较好 |
| 可观测性与评测 | 6/10 | 有日志和大量单元测试，缺少统一 trace 与 Agent 任务集评测 |

## 已有优势

1. **对话与计算目标已解耦。** 主对话留在本地工作台，计算目标可切换；请求使用 `X-SSH-Session-Id` 显式路由，避免仅依赖 cookie。
2. **dsh 会话隔离设计正确。** 映射键由 SSH session、conversation context 和 workspace 哈希共同构成，新对话不会默认共享旧上下文。
3. **正式流程不是靠聊天记录维持。** 流程运行状态写入独立 RUN 目录并通过结构化上下文字段恢复，长对话裁剪后仍能继续。
4. **作业生命周期已经进入 Agent 外圈。** 提交作业后绑定会话，Watcher 检测终态，自动唤醒原对话继续分析，同时具备重复唤醒锁和次数上限。
5. **执行安全不只依赖提示词。** 路径越界、危险命令、确认策略、主机指纹校验和流程命令作用域均有代码约束与测试。
6. **Skill 上下文有基本的注入防护。** 系统/LSF Skill 与用户/集群参考材料分级标识，明确禁止参考文本覆盖系统策略或扩大权限。

## 主要缺口与建议

### P0：优先处理

#### 1. 建立真正的用户级会话所有权

当前隔离主要是“对话与对话”“SSH session 与 SSH session”的隔离，尚不是“用户与用户”的隔离：

- 本地对话存储是服务进程级共享目录，记录没有 `ownerId`。
- 服务端 AI Profile 会被请求同步为共享配置。
- `pendingAiConfirmations` 与 `pendingAiQuestions` 只以随机 ID 索引，确认接口没有校验发起者 session。

建议为对话、AI Profile、挂起确认、挂起反问、作业绑定统一增加 `ownerId`，由登录态派生；所有读取、更新和裁决都同时校验 owner。桌面版可固定为单一 local owner，多人部署则使用账号/租户 ID。

#### 2. 把长期记忆模块接入主链路

`MemoryCompressor`、`StructuredMemory` 和 `MemoryOrchestrator` 已存在，但当前正式请求主要只注入最近 8 条消息拼出的约 480 字启发式摘要；结构化记忆没有在保存对话时生成，也没有传入 `buildSmartContext`。

建议：

1. 对话超过消息或 token 阈值时异步压缩；
2. 将结构化记忆随 conversation 持久化并带版本号；
3. 每轮只更新发生变化的事实、决策、错误和用户偏好；
4. `buildSmartContext` 注入结构化记忆，同时保留最近连续窗口；
5. UI 提供“查看记忆 / 删除某条记忆 / 清空记忆”。

#### 3. 服务端建立“一对话一活动 Turn”的并发控制

当前浏览器会主动取消旧 SSE，但服务端缺少以 conversation key 为粒度的统一活动 Turn 注册表。网络重试、多个窗口或自动续跑与手工请求并发时，仍可能同时操作同一工作区。

建议引入 `ConversationRuntime`：`ownerId + conversationContextId + activeTurnId + engineSessionId + plan + workflowRun + boundJobs`。新请求携带幂等键；同一对话默认串行，不同对话并行。SSE 断开只取消订阅，不应天然等同于取消任务；取消任务使用显式 cancel event。

#### 4. 收紧 Skill 装载契约

当前索引会把 Skill 目录中的多种文本、脚本、配置文件都作为可检索 Skill 项。这样覆盖面大，但会造成重复命中、触发漂移和不必要的上下文注入。

建议只把 `SKILL.md` 作为技能入口，其他文件作为该技能的 resource；Skill manifest 显式声明触发词、依赖、允许工具、风险级别、版本和资源路由。每轮记录“候选技能 → 得分 → 选中原因 → 实际加载版本”，用于 UI 解释和离线评测。

### P1：下一阶段

#### 5. 从轮询作业改为服务端快照 + Socket 推送

本次已增加轻量 `/api/jobs/summary`，避免对话顶部每次刷新顺带执行 `ps`。下一步可让 JobWatcher 维护每个 SSH session 的最新快照，通过 Socket 推送 `job:snapshot`，UI 只在首次进入或断线恢复时拉取，减少大量客户端同时轮询调度器。

#### 6. 建立 Agent 评测集

现有单元测试很多，但大多验证模块行为。建议增加 30–50 个固定科研任务的端到端评测：

- 普通问答不得误调用 Skill 或命令；
- FASTQ/VCF/BAM 任务的 Skill 选择准确率；
- 路径越界、提示注入和危险命令拒绝率；
- 长流程中断恢复成功率；
- 作业提交后重复唤醒率与正确对话回写率；
- token、首包时间、命令数和失败恢复轮数。

每次发布输出一份可比较的 Agent 质量报告，而不只看测试是否通过。

#### 7. 统一运行 Trace

为每个 turn 分配稳定 `turnId`，把 context build、skill selection、model request、tool call、approval、job binding、resume 和 final outcome 写成结构化事件。日志默认脱敏 API Key、密码、Token 和用户文件内容。UI 可展示简化执行轨迹，完整 trace 用于诊断。

#### 8. 拆分超大模块

`server.ts` 与 `AIChat.tsx` 已承担过多职责。建议按以下边界拆分：

- 服务端：turn controller、conversation runtime、approval registry、context service、engine adapter、job continuation；
- 前端：chat transport、turn state、attachment composer、approval/ask UI、settings、job status。

这样能减少对话切换、SSE 重连和设置变化对整棵组件树的影响，也更容易做并发测试。

### P2：体验增强

1. 在对话中显示本轮使用的 Skill、计算目标、工作区和上下文来源摘要。
2. 为任务条增加失败作业红点、最近完成时间与一键“让 AI 分析失败原因”。
3. 为不同任务类型提供模型/预算策略，而不是所有请求共享同一套步数和上下文预算。
4. 为 conversation、workflow run、job binding 和 dsh session 建立迁移版本，发布升级时执行显式 schema migration。

## 本次已完成的优化

- 主对话标题下新增集群任务状态条。
- 显示当前计算目标、LSF/Slurm、运行数、排队数和最多 3 个活跃任务。
- 未连接时直接进入计算资源配置。
- 点击“详情”直接进入对应集群的完整作业监控面板。
- 增加 `/api/jobs/summary` 轻量接口，不额外采集登录节点进程。
- 30 秒自动刷新，并支持手动刷新与错误重试。
- 新增组件回归测试；修复 Windows junction 安全测试的临时目录清理不稳定问题。

