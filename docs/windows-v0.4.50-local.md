# Windows v0.4.50 · 本地交付

本次不推送 GitHub、不发布 Release、不触发远程构建。不安装或重启正在使用的 HPClaw，不修改集群作业、用户运行脚本或既有结果。

## 依赖结构与流程图

- 修正 ENCODE TF ChIP-seq DAG 的伪重复与 IDR 实现；将 v0.4.49 自动移入待弃置的该内置流程恢复为正式流程。手动移入、手动删除和已自定义的流程不被覆盖。
- DAP-seq 在峰调用后分出扩展 QC 与基序/峰关联基因分析，两路汇入报告。
- 原生 TF/组蛋白 ChIP-seq 明确链交叉相关性、峰调用、扩展 QC 与重复一致性依赖。ATAC 的合并步骤仍按真实输入顺序执行，未对其他分析类型凭名称推断分支。
- 流程图使用 ELK 分层正交布线、圆角折线和跨线遮罩；支持纵/横方向、缩放、适应宽度、显示全部依赖、上下游高亮、键盘选择步骤。长标签换行，完整内容保留在工具提示和无障碍名称中。
- 默认隐藏传递冗余连线只影响绘图；“显示全部依赖”可查看原始边，执行依赖不变。
- 编辑器可选择多个上游步骤。删除步骤不自动把依赖重新指向别的步骤；无效引用必须修正后才能保存。
- DAG 表达产物依赖，不代表本次新增了并行提交引擎。执行器仍按拓扑步骤顺序与依赖门禁推进。

## TF ChIP-seq DAG 的科学边界

这是 HPClaw 原生双端扩展，不是官方 ENCODE WDL，也未经实际测序数据的生物学验收。

- INPUT_DIR 必须只包含同一转录因子、同一条件的生物学重复，不得池化不同靶标。
- CONTROL_DIR 必须包含一个处理完成的匹配 Input 对照 BAM。多个对照须先显式决定池化方案，不再任取首个文件。
- 自伪重复用模板名/read group 的确定性哈希划分为互补且不重叠的两份，保留 mates；不是官方 shuffle-split 的逐字实现。
- 池化伪重复分别合并各生物学重复的 pr1、pr2，不重新独立采样。MACS2 明确使用 BAMPE，索引使用 CSI。
- IDR 全局分数是第 12 列的 -log10(IDR)。默认阈值 0.05 对应分数 ≥ -log10(0.05)。同时评估真重复、自伪重复、池化伪重复，输出 rescue 和 self-consistency ratios、conservative/optimal 峰集合。
- 工具失败、空输入或无峰不会被 `|| true` 掩盖。单生物学重复、零分母及缺失证据不能报告通过；QC 异常保留 JSON 证据并以非成功退出提示复核。
- 上述计算逻辑使用合成 SAM/IDR 和模拟子进程测试；没有提交集群任务验证软件模块、参考版本或生物学阈值。

核查来源：[SAMtools view](https://www.htslib.org/doc/samtools-view.html)、[IDR 格式](https://github.com/nboley/idr)、[ENCODE ChIP-seq WDL](https://github.com/ENCODE-DCC/chip-seq-pipeline2/blob/master/chip.wdl)、[ENCODE 可重复性实现](https://github.com/ENCODE-DCC/chip-seq-pipeline2/blob/master/src/encode_task_reproducibility.py)。

## 安装与验收

输出目录：`F:/HPClaw-builds/Windows-v0.4.50-local-20261010/`。

安装包仍支持中文/英文选择及软件内语言切换；中英文元数据与新控件纳入回归测试。安装包未做代码签名，Windows 可能显示发布者未知。请保存当前任务并自行关闭 HPClaw 后安装；本次不会替你关闭或覆盖运行中的应用。

构建明确使用 `--publish never`，包含安装载荷 CRC 检查。最终回归计数、打包后冒烟结果与 SHA-256 保存到交付目录的验收记录。

## 第三方组件

流程图布局使用未修改的 elkjs 0.12.0（EPL-2.0 OR GPL-3.0），上游：https://github.com/kieler/elkjs 。按 EPL-2.0 分发；源码可从该仓库的 0.12.0 版本取得。本项目未修改 ELK 源码。
