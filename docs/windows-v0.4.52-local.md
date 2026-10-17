# HPClaw v0.4.52 本地 Windows 更新

本次仅提供本地 Windows 安装包，不上传 GitHub，也不覆盖正在运行的软件或修改集群任务。

## 流程整理

保留 TF ChIP-seq 分支 DAG（encode-chipseq-tf-dag），移除重复的线性定义及其独立英文别名。升级前会将未修改的旧定义备份到用户数据目录 workflows/deleted-definitions/。用户编辑过的定义、历史 RUN 快照、集群文件及作业均保留，不做迁移覆盖。

## DAP-seq IDR

新增第 7 步：生物学重复 IDR 一致性评估。第 8 步基序富集/峰关联基因注释使用 IDR 可重复峰，第 9 步报告汇总信号质控、IDR 和注释结果。

需要显式提供 TSV 分组表，每组是同一转录因子、同一实验条件，至少两个独立生物学重复。表中只列实验文库，对照通过 control_bam 指定，不能作为实验重复。不要混用不同转录因子、条件或技术重复。

下例使用相对 INPUT_DIR 的处理后 BAM 路径；文件尚未生成时可以先填写，前面的步骤会生成 sample.dedup.bam。样本名必须对应 FASTQ 文件名前缀。对照也必须用相同比对/过滤/去重参数处理。

```tsv
sample	target	condition	replicate	bam	control_bam
TF_A_rep1	TF_A	seedling	1	TF_A_rep1.dedup.bam	gDNA.dedup.bam
TF_A_rep2	TF_A	seedling	2	TF_A_rep2.dedup.bam	gDNA.dedup.bam
```

默认全局 IDR 阈值 0.05，独立候选峰使用 MACS2 p=0.001；常规峰仍使用 q=0.05。IDR 候选峰不能用严格筛选后的最终峰代替。有效基因组大小现在是必填项、不预设 hs，需按实际物种填写。处理后 BAM 使用 CSI 索引，以支持较长染色体；富集质控只评估分组表中的实验文库，不把阴性对照作为应当富集的文库。

采用 IDR narrowPeak 第 12 列 -log10(global IDR) 判定，与合并样本候选峰匹配；超过两个重复时取所有重复对一致通过的合并候选峰。输出包括 idr/idr_summary.tsv、qc/idr_qc.json、重复对诊断图及 idr/final/*.peaks.final.bed。单重复、零可重复峰、缺证据或计算失败不标记通过，并提示不建议继续下游。重跑前将旧 final 目录移入 idr/previous-final-*，保留可恢复备份，避免用旧结果冒充新结果。

这是 HPClaw 的 DAP-seq 扩展，并非 ENCODE 官方 DAP 流程。实现依据：[IDR 官方文档](https://github.com/nboley/idr)。集群需具备 Python 3、MACS2、SAMtools 和 IDR；软件模块名可在流程配置中按集群调整。

## 语言

内置流程的名称、步骤、参数标签/帮助、参考数据说明和质控规则跟随语言切换。中英文报告语言在启动任务时保存为 config.reportLanguage，后台续跑保持一致。运行摘要、染色质分析报告和 HiDOG 报告均支持两种语言。

任务启动后的界面语言切换不重写历史报告或已提交脚本；新的任务使用新语言。路径、样本标识、命令、原始证据和用户自定义文字保留原样，不做猜测式翻译。

## 验证边界

回归测试覆盖流程迁移、界面切换、运行语言持久化、确定性报告、IDR 分组与阈值判断及失败证据。IDR/MACS2 测试使用模拟命令夹具；未在用户集群上运行真实数据，不能代替项目级结果验收。

## 本地交付核验

Windows 安装包：E:/hpclaw--/0820/output/Windows-v0.4.52-local-20261012/HPClaw-Setup-0.4.52-x64.exe（243451011 bytes）。

SHA-256：283462F3B7CB8A5F26FD51F3A48CB36680701D7CD1A4F9B4A4D1A3B3001D7891。

TypeScript 类型检查通过；218 个测试文件全部通过（1685 项通过，2 项原有跳过）；内置流程运行元数据英译审计无中文残留；安装包内嵌压缩数据 CRC 校验通过；使用独立临时数据目录启动打包后的后端、前端和 DSH CLI，流程目录 API 验证通过。此次跳过与本次修改无关的文献元数据网络测试，不计作通过。

未上传 GitHub、未覆盖安装、未连接用户集群或创建/取消任何集群作业。
