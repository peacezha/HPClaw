# 工作流映射

仅在 `ncpgr-bio-router` 触发后使用本文件。首先查阅全量场景覆盖表，确保每个 `bioSkills` 场景家族都有 NCPGR 路由路径。然后，当请求匹配常见端到端工作流时，应用下方的详细工作流说明。

## 全量 bioSkills 场景覆盖

对于下表中的任何场景：

1. 查阅对应的 `bioSkills/<family>/<skill>` 文件获取生物学和方法级指导。
2. 在指定 module、容器、数据库或资源规模之前，先用 `ncpgr-software` 检查 NCPGR 软件可用性。
3. 仅当任务需要集群执行时使用 `ncpgr-lsf`。轻量级本地解析、规划、解读或绘图可能不需要 LSF 脚本。
4. 网络下载、API 查询和包安装保留在登录节点。计算密集型处理、模型拟合、比对、组装、模拟或批量转换提交到 LSF。

| bioSkills 场景家族 | NCPGR 路由关注点 |
| --- | --- |
| `alignment` | 验证 MAFFT/MUSCLE/Clustal/其他工具、trimAl/BMGE、结构比对工具、输入 FASTA/PDB 格式，以及批量 MSA 是否需要数组作业。 |
| `alignment-files` | 验证 samtools、sambamba、Picard、GATK、bedtools、参考索引、BAM/CRAM 排序/索引规范，以及按样本的数组作业策略。 |
| `alternative-splicing` | 验证 STAR/HISAT2/minimap2、StringTie、rMATS、SUPPA2、MAJIQ、IsoformSwitchAnalyzeR、sashimi 绘图工具、注释 GTF 一致性，以及 RNA-seq/长读长资源需求。 |
| `atac-seq` | 验证 fastp/cutadapt、Bowtie2/BWA、samtools、bedtools、MACS2/MACS3、deepTools、TOBIAS/HINT、ArchR/Signac（如相关），以及 peak/矩阵汇总作业。 |
| `causal-genomics` | 验证 PLINK/PLINK2、GCTA、LDSC、SMR/HEIDI、coloc、SuSiE/FINEMAP、TwoSampleMR、参考面板、汇总统计协调，以及全基因组扫描的 CPU/内存需求。 |
| `chemoinformatics` | 验证 RDKit/OpenBabel、AutoDock/Vina、Meeko、OpenMM/GROMACS/Amber（如需要）、ML 环境、化合物库、GPU 可用性（深度模型），以及配体批次的数组作业。 |
| `chip-seq` | 验证 fastp/cutadapt、Bowtie2/BWA、samtools、MACS2/MACS3、deepTools、HOMER/MEME、bedtools、spike-in 参考，以及队列级 peakset/差异分析作业。 |
| `clinical-biostatistics` | 优先验证 R/4.0.0 包或 Python 环境，保护本地临床数据路径，避免不必要的计算节点网络访问，对重采样、贝叶斯或模拟密集型分析使用 LSF。 |
| `clinical-databases` | 优先验证本地注释数据库，然后在登录节点进行 ClinVar/dbSNP/gnomAD/MyVariant/PharmGKB 等 API 查询；仅大批量注释任务提交 LSF。 |
| `clip-seq` | 验证 cutadapt/fastp、STAR/Bowtie、UMI 工具、CLIPper/Piranha/PureCLIP/iCount、bedtools、motif 工具、注释数据库，以及将按样本预处理与队列级 peak 分析分开。 |
| `comparative-genomics` | 验证 OrthoFinder、MCScanX、MUMmer、minimap2、LASTZ、progressiveCactus、IQ-TREE、PAML、HyPhy、eggNOG/InterPro 数据库，以及全基因组比对的内存密集型队列。 |
| `copy-number` | 验证 CNVkit、GATK CNV、Control-FREEC、ichorCNA、FACETS、Sequenza、bedtools、参考面板、目标区间，以及样本/片段汇总作业。 |
| `crispr-screens` | 验证 MAGeCK、BAGEL、JACKS、DrugZ、CRISPResso、guide 文库、计数矩阵、拷贝数校正输入，以及下游统计的 R/4.0.0（优先）或 Python 环境。 |
| `data-visualization` | 优先验证 R/4.0.0 绘图包、Python 绘图环境、基因组浏览器轨道工具、Circos，以及渲染是轻量级本地工作还是批量出图。 |
| `database-access` | 优先使用 `/share/database/` 和本地 BLAST 索引；下载/API 调用保留在登录节点；BLAST、SRA 转换、大批量序列检索或本地数据库搜索使用 LSF。 |
| `differential-expression` | 优先使用 R/4.0.0 的 DESeq2/edgeR/limma；验证计数矩阵设计、样本元数据、对比、批次变量，将重计算（归一化/建模）与绘图/报告分开。 |
| `ecological-genomics` | 验证 QIIME2/DADA2/vsearch、PLINK/VCF 工具、R 生态学包、eDNA 参考、种群/参考数据，以及读长处理或全基因组生态扫描的 LSF 使用。 |
| `epidemiological-genomics` | 验证 Nextclade、Pangolin、Snippy、MLST、AMRFinderPlus、IQ-TREE、BEAST/TreeTime、病原体参考、AMR 数据库，以及监测批量/系统发育资源需求。 |
| `epitranscriptomics` | 验证 fastp/cutadapt、STAR/HISAT2/minimap2、exomePeak2/MACS 类 peak 工具、m6Anet、Nanopolish/Tombo（如需要），以及将比对、peak/修饰识别和差异分析分开。 |
| `experimental-design` | 使用 `bioSkills` 获取设计逻辑；优先验证 R/4.0.0 或 Python 的功效/多重检验模拟包；仅大型模拟网格使用 LSF。 |
| `expression-matrix` | 优先验证 R/4.0.0、Python/scipy、Matrix Market/H5AD 支持、基因 ID 映射资源，以及稀疏矩阵运算是否需要内存优先队列。 |
| `flow-cytometry` | 验证 FlowJo 导出输入、R flowCore/CATALYST 包、Python 流式工具、FCS 文件处理，以及大批量补偿、聚类或差异检测的 LSF 作业。 |
| `gene-regulatory-networks` | 验证 SCENIC/pySCENIC、WGCNA、GENIE3/GRNBoost、CellOracle、motif 数据库、表达矩阵，以及网络推断的内存/CPU 需求。 |
| `genome-annotation` | 验证 BRAKER、Augustus、MAKER/GeMoMa、RepeatModeler/RepeatMasker、eggNOG-mapper、InterProScan、BUSCO、公共数据库，以及分阶段 LSF 脚本。 |
| `genome-assembly` | 验证 hifiasm、Flye、Canu、SPAdes/metaSPAdes、NextDenovo、polishing/QC 工具、基因组大小/读长类型，以及内存优先队列选择。 |
| `genome-engineering` | 验证 CRISPR 设计/脱靶工具、Bowtie/BWA 索引、参考 FASTA/GTF、引物设计工具，小型设计任务保留本地，除非全基因组枚举量较大。 |
| `genome-intervals` | 验证 bedtools、pybedtools、deepTools、UCSC 工具、bigWig/bigBed 工具、基因组大小文件，以及多轨道或多区间集的数组作业。 |
| `hi-c-analysis` | 验证 Juicer、HiC-Pro、pairtools、cooler/cooltools、HiCExplorer、FitHiC/Mustache、BWA、samtools，以及将按样本比对、矩阵构建与队列级分析分开。 |
| `imaging-mass-cytometry` | 验证 R/Python 图像和流式环境、Ilastik/CellProfiler/QuPath（如相关）、图像存储路径，以及分割、特征提取和空间统计的 LSF 作业。 |
| `immunoinformatics` | 验证 NetMHCpan/MHCflurry/MixMHCpred、VEP/注释工具、HLA 分型输出、肽段 FASTA/VCF 输入，以及大量肽段/HLA 组合的数组作业。 |
| `liquid-biopsy` | 验证 cfDNA 预处理、UMI 处理、BWA/samtools/GATK/Mutect2、ichorCNA、甲基化工具、panel BED、分子条形码处理，以及严格的样本元数据追踪。 |
| `long-read-sequencing` | 验证 Guppy/Dorado 可用性、NanoPlot/Porechop/Filtlong、minimap2、samtools、Clair3、Sniffles/cuteSV、WhatsHap、Medaka、modkit/Nanopolish，以及 GPU/CPU 队列需求。 |
| `machine-learning` | 验证 Python/R ML 环境、GPU 访问（如需要）、输入矩阵大小、交叉验证策略、模型产物路径，以及重采样或超参搜索的 LSF 数组作业。 |
| `metabolomics` | 验证 XCMS、MS-DIAL、MZmine、OpenMS、CAMERA、MetaboAnalystR、raw/mzML 转换工具、谱图库，以及峰拾取/对齐的批量作业。 |
| `metagenomics` | 验证 Kraken2/Bracken、MetaPhlAn、HUMAnN、AMR 工具、组装（如相关）、数据库大小/位置，以及大型分类器的高内存队列使用。 |
| `methylation-analysis` | 验证 Bismark、Bowtie2、samtools、methylKit/DSS、bedGraph/bigWig 工具、亚硫酸氢盐参考，以及 Bismark 特有的线程/资源约束。 |
| `microbiome` | 验证 QIIME2、DADA2、vsearch、cutadapt、phyloseq、PICRUSt2、参考数据库，以及按样本或批次分割去噪/分类/多样性作业。 |
| `multi-omics-integration` | 验证 mixOmics、MOFA/MOFA2、SNF 工具、矩阵协调脚本、样本 ID 一致性，以及大型多组学矩阵的内存需求。 |
| `pathway-analysis` | 优先使用 R/4.0.0 的 clusterProfiler/enrichplot/ReactomePA（如可用）；验证物种 ID、GMT/KEGG/GO 资源，API 依赖的查询保留在登录节点。 |
| `phasing-imputation` | 验证 SHAPEIT/Eagle/Beagle/Minimac/GLIMPSE、参考面板、遗传图谱、染色体分割，以及按染色体/区段的 LSF 数组作业。 |
| `phylogenetics` | 验证 IQ-TREE、RAxML/RAxML-NG、FastTree、BEAST/BEAST2、TreeTime、MAFFT、树可视化工具，以及 bootstrap/MCMC 作业的资源需求。 |
| `population-genetics` | 验证 PLINK/PLINK2、VCFtools、bcftools、ADMIXTURE、EIGENSOFT、scikit-allel、参考面板，以及按染色体/样本分割的作业策略。 |
| `primer-design` | 验证 Primer3、BLAST、e-PCR/电子 PCR 工具、参考 FASTA 索引，小型设计本地执行，全基因组特异性扫描使用 LSF。 |
| `proteomics` | 验证 MaxQuant、FragPipe/MSFragger、DIA-NN、Skyline 导出、OpenMS、Perseus/R 包、谱图库、raw/mzML 转换工具，以及批处理队列。 |
| `read-alignment` | 验证 BWA/BWA-MEM2、STAR、HISAT2、Bowtie2、minimap2、samtools、参考索引、读长类型，以及按样本比对的数组作业。 |
| `read-qc` | 验证 fastp、cutadapt、Trimmomatic、FastQC、MultiQC、UMI 工具、污染数据库，以及大量 FASTQ 文件的数组作业。 |
| `reporting` | 验证 MultiQC、Quarto/RMarkdown/Jupyter、R/4.0.0（优先）、Python 绘图环境，重型报告渲染在需要时作为小型 LSF 作业运行。 |
| `restriction-analysis` | 验证 EMBOSS/seqkit/Biopython/Primer3 等工具、酶数据库、参考 FASTA，本地执行，除非扫描多个基因组。 |
| `ribo-seq` | 验证 cutadapt/fastp、STAR/Bowtie、RiboTaper/RiboWaltz/ribORF 工具、注释文件、P-site 偏移，以及将预处理与周期性/TE 分析分开。 |
| `rna-quantification` | 验证 featureCounts/Subread、Salmon、kallisto、RSEM、tximport、STAR/HISAT2 输出、转录组索引，以及所有样本的矩阵汇总。 |
| `rna-structure` | 验证 ViennaRNA、Infernal、RNAfold/RNAplfold、协方差模型、探测工具，以及大型 ncRNA 或转录组扫描的批量作业。 |
| `sequence-io` | 验证 seqkit、seqtk、Biopython、EMBOSS、gzip/pigz、FASTA/FASTQ 规范，仅大批量文件使用 LSF 数组作业。 |
| `sequence-manipulation` | 验证 seqkit/Biopython/EMBOSS、密码子表、motif 定义，小型转换保留本地，除非处理大型基因组。 |
| `single-cell` | 验证 Cell Ranger、STARsolo、kallisto/bustools、Seurat、Scanpy、scVI、ArchR/Signac、参考包，以及按细胞/特征/内存选择队列。 |
| `small-rna-seq` | 验证 cutadapt/fastp、miRDeep2、miRge3、Bowtie、featureCounts、靶标预测数据库，以及按样本预处理的数组作业。 |
| `spatial-transcriptomics` | 验证 Space Ranger、Seurat/Scanpy/Squidpy、Giotto、空间图像工具、H5AD/Visium 格式，以及内存密集型矩阵/图像整合队列。 |
| `structural-biology` | 验证 PyMOL/ChimeraX、DSSP、Foldseek/MMseqs2、AlphaFold/ColabFold/OpenFold、GPU 可用性、结构数据库，以及批量预测/搜索策略。 |
| `systems-biology` | 验证 COBRApy、COBRA Toolbox、MEMOTE、CarveMe、模型格式、求解器，以及大型重建、FBA 网格或必需性筛选的 LSF 使用。 |
| `tcr-bcr-analysis` | 验证 MiXCR、TRUST4、Cell Ranger VDJ、scirpy、Immcantation、VDJtools、参考种系数据库，以及按样本的免疫组库提取作业。 |
| `temporal-genomics` | 验证 DESeq2/edgeR/limma、maSigPro、impulseDE2、MetaCycle、轨迹工具、时间元数据，以及排列或模型网格工作量的 LSF 使用。 |
| `variant-calling` | 验证 BWA/BWA-MEM2、samtools、GATK、bcftools、DeepVariant、GLnexus、SV 检测工具、注释工具、参考、区间，以及联合检测资源策略。 |
| `workflow-management` | 验证 Snakemake/Nextflow/CWL/WDL 可用性、与 LSF 的执行器集成、容器路径、工作目录，以及 profile/config 生成。 |
| `workflows` | 优先使用对应的端到端 `bioSkills/workflows/*-pipeline` 条目，然后在下方的详细工作流说明存在时应用，或逐步组合本地软件/LSF 规则。 |

## 常见端到端详细工作流

### RNA-seq 从 FASTQ 到差异表达

#### 必须加载的 bioSkills（严格模式下必须逐个 Read）

| 步骤 | bioSkill 路径 | 必须加载 |
|---|---|---|
| QC 质控 | `read-qc/fastp-workflow` | ✅ |
| QC 质控 | `read-qc/quality-filtering` | ✅ |
| 比对 | `read-alignment/hisat2-alignment` 或 `read-alignment/star-alignment` | ✅ |
| 比对后处理 | `alignment-files/alignment-sorting` | ✅ |
| 定量 | `rna-quantification/featurecounts-counting` | ✅ |
| QC 报告 | `reporting/automated-qc-reports` | ✅ |
| 差异分析 | `differential-expression/deseq2-basics` | ✅ |
| 差异分析 | `differential-expression/edger-basics` | ✅ |
| GO 富集 | `pathway-analysis/go-enrichment` | ✅ |
| KEGG 富集 | `pathway-analysis/kegg-pathways` | ✅ |
| 富集可视化 | `pathway-analysis/enrichment-visualization` | ✅ |
| 端到端参考 | `workflows/rnaseq-to-de` | 可选 |

#### NCPGR 本地化规则

- 使用 `module av` 或 `mii search` 查找 `fastp`、`STAR`、`HISAT2`、`Subread`、`samtools` 和 R 包。
- 多样本时优先使用样本级并行。
- 按样本的 QC 和比对使用数组作业。
- 尽量对所有 BAM 文件统一运行一次 `featureCounts`。
- 使用 `ncpgr-software` 中 STAR、HISAT2、fastp、samtools sort 和 featureCounts 的默认资源配置。
- 使用 `ncpgr-lsf` 生成 `.lsf` 脚本和作业监控。

### WGS 或 WES 变异检测

使用相关 `bioSkills`：

- `read-qc`
- `read-alignment/bwa-alignment`
- `variant-calling`
- `workflows/fastq-to-variants`

NCPGR 规则：

- 如果用户有 GPU 访问权限，对适合的 WGS/WES GPU 工作流优先使用 Parabricks。
- 根据本地可用性和用户约束选择 BWA/BWA-MEM2、samtools、GATK、bcftools、DeepVariant、GLnexus 或 HAPpy。
- 大规模联合检测时，在合适情况下优先使用 GLnexus。
- 按样本的轻量步骤使用 normal 队列，内存密集型联合检测使用 high/smp 队列，GPU 工作流使用 gpu 队列。
- 对多样本多步骤分析，询问用户选择逐步提交还是依赖链提交。

### 单细胞 RNA-seq

使用相关 `bioSkills`：

- `single-cell`
- `expression-matrix`
- `data-visualization`
- `workflows/scrnaseq-pipeline`

NCPGR 规则：

- 验证 Cell Ranger、STARsolo、kallisto/bustools、Seurat、Scanpy 及相关 module 或容器。
- Cell Ranger 通常需要 `smp` 或 `high` 队列，取决于细胞数量和参考大小。
- 下载参考和包安装保留在登录节点。
- 计算密集型步骤使用 LSF 脚本，交互式检查仅在合适时使用本地 notebook/R 脚本。

### 宏基因组

使用相关 `bioSkills`：

- `metagenomics/kraken-classification`
- `metagenomics/abundance-estimation`
- `metagenomics/functional-profiling`
- `workflows/metagenomics-pipeline`

NCPGR 规则：

- 验证 Kraken2、Bracken、MetaPhlAn、HUMAnN 和数据库可用性。
- 资源选择应依据数据库大小；大型 Kraken2 数据库可能需要 `high` 或 `smp`。
- 尽量复用公共数据库。
- 按样本的分类使用数组作业，汇总表的生成使用单独的下游作业。

### 基因组组装

使用相关 `bioSkills`：

- `genome-assembly`
- `long-read-sequencing`
- `workflows/genome-assembly-pipeline`

NCPGR 规则：

- 根据读长类型和目标选择 hifiasm、Flye、SPAdes/metaSPAdes、Canu、NextDenovo、BUSCO、QUAST 或 Merqury。
- 组装通常受内存限制；基因组大小或测序深度较大时使用 `smp` 或 `high`。
- 队列繁忙时避免过度申请核心数；优先保证足够内存和合理调度。
- 除非用户要求依赖链，否则将组装、polishing、支架构建和 QC 分成独立的 LSF 作业。

### 基因组注释

使用相关 `bioSkills`：

- `genome-annotation`
- `comparative-genomics`
- `pathway-analysis`
- `workflows/genome-annotation-pipeline`

NCPGR 规则：

- 验证 BRAKER、Augustus、RepeatModeler、RepeatMasker、eggNOG-mapper、InterProScan、BUSCO 及所需数据库。
- 尽量使用公共数据库，避免重建常用索引。
- 注释工作流通常混合 CPU 密集型和内存密集型阶段；按阶段拆分为可读的 LSF 脚本。

### Hi-C、ATAC-seq、ChIP-seq 和表观基因组

使用相关 `bioSkills`：

- `hi-c-analysis`
- `atac-seq`
- `chip-seq`
- `methylation-analysis`
- 对应的 `workflows/*-pipeline` skills

NCPGR 规则：

- 验证比对工具、samtools、bedtools、deepTools、MACS、cooler/cooltools、Bismark 及相关 module。
- 按样本的比对/QC 使用数组作业，队列级矩阵、peak 或差异分析步骤使用单独作业。
- 遵循 `ncpgr-software` 中的工具特异性线程规则，特别是 Bismark 和 samtools sort。

### 报告与 QC 汇总

使用相关 `bioSkills`：

- `reporting/automated-qc-reports`
- `reporting/quarto-reports`
- `data-visualization`

NCPGR 规则：

- MultiQC 和轻量级绘图通常需要较少核心，可在 `normal` 队列运行。
- 含大量图表的重型报告渲染可作为小型 LSF 作业提交（当消耗较多 CPU 或内存时）。
- 报告应尽可能包含输入路径、module 版本、作业 ID 和关键日志摘要。
