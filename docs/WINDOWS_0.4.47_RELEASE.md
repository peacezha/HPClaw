# HPClaw v0.4.47 — Windows approval reliability

## 中文

本次更新仅发布 Windows x64 安装包，保留现有界面、安装语言选择、软件内中英文切换和质控失败提醒。Mac 与 Linux 网页包未更改。

- 修复 DSH 旧会话中 `approval=never` 自动拒绝，导致确认卡片没有出现却被报告为“用户拒绝”的策略冲突。通过正式审批接口恢复一次性确认，不自动允许高风险命令。
- 终止作业命令 `bkill`、`scancel`、`qdel` 始终需要本次确认。确认送达不等于命令执行成功。
- 区分明确拒绝、确认超时、任务取消和审批不可用；超时停止的是当前 Agent 回合，不会终止集群计算作业。
- 检查审批回执；网络或 HTTP 错误时保留确认卡片并提示送达尚未核验。支持多个确认排队，切换对话后恢复未处理确认，过滤已结束的确认，防止重复点击和过期确认重放。
- 修复确认卡片显示时的初始化顺序错误，以及后台任务恢复提示切换英文后仍显示中文的问题。
- 旧对话终态回读在延迟期间切换对话时丢弃迟到结果，防止覆盖当前对话。
- 长工具输出保留首尾并明确标注截断，降低遗漏末尾报错和作业回执的风险。
- 收紧 AI 汇报规则：排队、挂起和运行分别报告；查不到作业不等于成功；取消待运行作业不等于删除已有结果；审批不可用不推断为用户拒绝。
- 删除“SSUSP 或退出码 137 必然是内存不足”的错误诊断规则。扩资源前核实原因与站点政策；不再把处理器 slots 称为物理节点。质控结论要求核实指标来源、统计单位和冲突数值，不以高比对率代替整体文库质量。

更新后，请在完成当前对话操作后重启软件，确保新前端、后端与 DSH 插件同时生效。本次修复不会修改历史对话，不会自动取消、恢复或重新提交已有集群作业。安装包未进行数字签名。

## English

This release updates the Windows x64 installer only. It retains the existing interface, installer language selection, in-app Chinese/English switch, and QC-failure warnings. The macOS installers and Linux public-web package are unchanged.

- Fixes the mismatch where DSH's persisted `approval=never` policy rejected an approval automatically before an HPClaw confirmation card could appear. The official approval API now restores a one-time user decision without automatically authorizing high-risk commands.
- Job-termination commands (`bkill`, `scancel`, and `qdel`) always require one-time confirmation. An approval receipt is not evidence of execution success.
- Distinguishes explicit rejection, expiry, cancellation, and unavailable approval services. Approval expiry ends the current Agent turn; it does not terminate cluster jobs.
- Verifies approval receipts, retains the card after delivery failures, queues concurrent requests, restores pending confirmations on reattachment, and prevents duplicate decisions or stale approval replay.
- Fixes an initialization-order error when rendering the confirmation card and untranslated background-task restoration messages.
- Discards delayed completion reloads after a conversation switch to avoid overwriting the currently viewed conversation.
- Preserves the beginning and end of long tool outputs with an explicit truncation notice.
- Requires evidence-based reporting of pending, suspended, and running jobs. A missing scheduler entry does not prove success; cancelling a pending job does not delete existing results; unavailable approval does not prove user rejection.
- Removes the incorrect rule that treats SSUSP or exit code 137 alone as proof of out-of-memory. Resource changes require diagnosis and a verified site policy; processor slots are not physical nodes. QC conclusions require traceable metric sources and consistent units rather than inferring overall library quality from alignment rates.

Restart HPClaw after finishing your current interaction to load the updated frontend, backend, and DSH plugin together. This release does not rewrite conversation history or automatically cancel, resume, or resubmit existing cluster jobs. The installer is unsigned.

## Verification / 验证

204 test files passed: 1,588 tests passed and 2 optional tests were skipped. TypeScript checks passed. Chinese/English confirmation cards, dark/light themes, lost delivery, expiry and receipt-only retry were checked using isolated UI fixtures, not real cluster commands or a paid model.

204 个测试文件通过，1,588 项测试通过、2 项可选测试跳过；TypeScript 检查通过。中英文确认卡片、深浅主题、送达失败、过期和只重发审批回执的场景已通过隔离界面测试，没有执行真实集群命令或调用付费模型。
