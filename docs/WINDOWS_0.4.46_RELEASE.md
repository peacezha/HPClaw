# HPClaw v0.4.46 — Windows update / Windows 更新

This release updates Windows x64 only. Mac and public Linux web packages remain available in [v0.4.43](https://github.com/peacezha/HPClaw/releases/tag/v0.4.43); they are not replaced by this release.

本次仅更新 Windows x64。Mac 和公共 Linux 网页包仍使用 [v0.4.43](https://github.com/peacezha/HPClaw/releases/tag/v0.4.43)，不随本次替换。

## Windows changes / Windows 更新内容

- **QC risk warnings:** failed QC displays a prominent “poor quality; downstream analysis is not recommended” notice and pauses automatic progression. Scheduler completion is not a QC pass. Users may explicitly acknowledge the risk to continue, but the failure, measured metrics and acknowledgement remain recorded. Warnings and failures are distinguished; no assay thresholds are silently changed.
- **质控风险提醒：** 未通过时醒目提示“质量不佳，不建议继续下游分析”，暂停自动推进；调度器成功不等于质控通过。明确确认风险后可继续，但失败指标与确认记录保留。警告和失败分开显示，不擅自调整阈值。
- **Cluster HTML reports:** relative report paths are resolved against verified project/RUN directories. Reports and relative CSS, JavaScript and images use the existing isolated streaming preview. Ambiguous reports require a choice rather than opening another project's file.
- **集群 HTML 报告：** 修复相对路径无法预览，核实项目/RUN 目录后流式读取 HTML 及相对资源；同名报告需明确选择，不跨项目猜测。
- **Professional bilingual interface:** Chinese/English installation selection and an in-app language toggle, including reviewed translations for built-in workflow descriptions, steps, parameters and QC criteria. Commands, paths, sample identifiers, values and original evidence are not rewritten.
- **专业中英文界面：** 安装时选择语言，应用内随时切换；补齐内置流程说明、步骤、参数与质控标准的专业英文。命令、路径、样本标识、数值与原始证据不改写。
- **DSH recovery and cleaner conversations:** bounded tool-response waits, stale-session recovery and precise failure reporting; verbose execution details are folded by default. The classic interface and previous literature-learning/download improvements are retained.
- **DSH 恢复与聊天显示：** 工具响应等待有界，恢复失效会话，错误原因明确；冗长执行详情默认折叠。保留经典界面和先前文献学习、原始数据下载改进。

## Verification / 验证

202 test files passed; 1,572 tests passed and 2 optional tests were skipped. TypeScript checks, production builds, installer CRC verification, packaged backend/DSH/language/report/literature-learning checks and update-manifest SHA-512 verification passed. UI checks used isolated demonstration data, not a verdict on user samples.

202 个测试文件通过，1572 项测试通过、2 项可选测试跳过；类型检查、生产构建、安装包 CRC、打包后功能检查和更新清单 SHA-512 校验均通过。界面检查使用隔离演示数据，不代表用户样本质控结论。

## Install / 安装

Windows users can open **Updates → Check for updates** in HPClaw, then download and install v0.4.46; alternatively download `HPClaw-Setup-0.4.46-x64.exe` below. Close HPClaw normally before manual installation. Do not delete application data.

Windows 用户可以在软件中打开“更新 → 检查更新”，下载并安装 v0.4.46；或下载下方的 `HPClaw-Setup-0.4.46-x64.exe`。手动安装前正常关闭 HPClaw，无需删除应用数据。

The installer is not digitally signed; Windows may show “Unknown publisher.” Existing running cluster jobs are not automatically cancelled by the QC warning. Custom scripts still need to report structured QC; this release does not infer universal numeric thresholds from arbitrary logs.

安装包未数字签名，Windows 可能提示“未知发布者”。QC 提醒不会自动取消已有集群作业；自定义脚本仍需记录结构化 QC，不从任意日志猜测通用数值阈值。

Installer SHA-256 / 安装包 SHA-256:
`78206e70d4a08e78d490f1dff5b9f664cd6a87ffcc5351424183878caede071c`
