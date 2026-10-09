# HPClaw v0.4.48 — Reliable user-question dialogs

## 中文

本次仅更新 Windows x64 安装包，保留现有界面及中英文切换；Mac 和 Linux 网页安装包不变。

- 修复 `ask_user_question` 的主要故障：问题写入聊天记录后，消息更新的副作用立即清空待回答卡片，导致 Agent 一直等待但用户看不到作答入口。现在只有真正切换对话或结束任务时清理交互。
- 问题改为独立弹窗，支持单选、多选、选项说明和自由输入；选择选项不自动提交，必须点击“提交回答”。问题文本、样本名、路径、科学标识符保持原样。
- “稍后回答”只收起弹窗并保留草稿，不取消原任务；点击“回答问题”重新打开。在主输入框作答后若送达失败，答案也会保留到弹窗草稿。取消本次问答是明确、独立的操作，不会终止集群作业。
- 先登记待回答请求再通知前端，避免即时回答时丢失；保留回答、取消、过期的回执，不把超时解释为用户拒绝。
- 网络错误、HTTP 错误或回执未核验时保留问题和答案，只重送相同问题 ID，不自动重投 Agent 任务或集群作业。防止重复点击以及切换对话后的迟到结果污染新对话。
- 切回后台运行的对话时恢复尚未回答的问题；已回答的问题不重新弹出，长执行日志裁剪不会丢失待回答请求。
- 回答按原始 question RPC 和问题 ID 送回 DSH；等待用户时不触发引擎空闲超时。多选内容作为结构化答案传递，不压成一个字符串。
- 中英文弹窗、回答送达提示、错误提示随界面语言切换；修正弹窗键盘焦点循环。

更新后重启软件以加载新版前后端。更新不会给旧版正在等待的任务自动补答，也不会自动取消、恢复或重提已有集群作业。旧会话若仍停在问答中，重启后打开该对话，让软件恢复尚未回答的问题；若引擎待回答请求已过期，需重新明确发出任务指令。Windows 安装包未代码签名。

## English

This release updates the Windows x64 installer only. The existing interface and language switch are retained; macOS installers and the Linux public-web package are unchanged.

- Fixes the root cause of missing `ask_user_question` controls: appending the question to the conversation triggered a message-change effect that immediately cleared the pending question. Interactions are now cleared only on a real conversation switch or task termination.
- Displays a dedicated question dialog with single-choice, multiple-choice, option descriptions, and free-text answers. Selecting an option does not submit it automatically. Question text, sample identifiers, paths, and scientific identifiers remain unchanged.
- “Answer later” dismisses the dialog without cancelling the task and retains the draft. “Answer question” reopens it. Answers entered in the main composer are also retained in the dialog after an unverified delivery. Cancelling the question is explicit and does not terminate cluster jobs.
- Registers the pending request before notifying the UI and distinguishes answered, cancelled, and expired receipts. An unanswered or expired question is not an explicit user rejection.
- Retains the question and draft after an unverified delivery, and retries only the same question ID. It does not resubmit the Agent task or cluster job. Guards against duplicate clicks and late replies after a conversation switch.
- Restores unanswered questions when reattaching to a background conversation, excludes settled requests from replay, and preserves pending requests when execution-log buffers are truncated.
- Routes structured answers, including multiple selections, to the original DSH question RPC. Waiting for the user does not trigger the engine's idle timeout.
- Updates dialog labels and delivery/error notices when the interface language changes, and corrects keyboard focus trapping.

Restart HPClaw after updating to load the new frontend and backend. The update does not automatically answer an old request or cancel, resume, or resubmit cluster jobs. Reopen a waiting conversation after restarting to recover any question still pending in the engine. If it has expired, explicitly issue a new task instruction. The Windows installer is unsigned.

## Verification / 验证

207 test files passed: 1,616 tests passed and two optional tests were skipped. TypeScript checks passed. Tests cover live question dialogs surviving conversation-message updates, reattachment, structured multiple selections, free-text input, unverified-delivery retry, draft retention after answering from the deferred composer, stale-response isolation, expiry, and native-engine compatibility. The packaged backend, frontend, DSH CLI, language persistence, QC gates, report paths, and literature-learning API passed isolated smoke checks. No real cluster job or paid model was used in these tests.

207 个测试文件通过，1,616 项测试通过、2 项可选测试跳过；TypeScript 检查通过。已验证消息更新不清掉问题、后台重连恢复、多选结构化回答、自由输入、送达失败重试、收起弹窗后主输入框作答的草稿保留、迟到回答隔离、过期以及内置引擎兼容。打包后的前后端、DSH CLI、语言持久化、质控门控、报告路径和文献学习 API 通过隔离检查；测试没有执行真实集群作业或调用付费模型。
