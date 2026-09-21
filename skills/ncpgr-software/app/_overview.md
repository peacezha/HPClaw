# 各软件注意事项与加速技巧

> 本文件从 SKILL.md 拆分而来。SKILL.md 保留总则、资源推荐、选型速查、陷阱速查等索引内容；
> 本文件保留各软件的详细坑点、加速技巧、版本推荐和示例脚本。
>
> **AI agent 使用方式**：当用户询问某个具体软件的集群使用问题时，
> 先查阅本文件中的简要注意事项，如需更完整信息再读取 `app/` 目录下对应的详细文档。

---

### Parabricks (GPU加速 NGS 分析)
> 集群文档: http://hpc.ncpgr.cn/app/098-parabricks/

30x WGS 约 **25分钟**（传统方法约30小时），从v4.0起**学术用户免费**。

**版本选择**: 除非有特殊需求，**优先使用 `4.0.1-1` 版本**（`$IMAGE/clara-parabricks/4.0.1-1.sif`）。

```bash
#BSUB -J parabricks
#BSUB -n 16
#BSUB -R span[hosts=1]
#BSUB -gpu "num=1:gmem=11G"
#BSUB -q gpu

module load Singularity/3.7.3
singularity exec --nv $IMAGE/clara-parabricks/4.0.1-1.sif pbrun fq2bam \
  --low-memory --ref hg38.fa --in-fq sample.R1.fq.gz sample.R2.fq.gz \
  --out-bam sample.sorted.dedup.bam
```

`fq2bam` 一行完成：bwa mem → sort → mark duplicates → BQSR → 输出bam。

Parabricks 还支持 `haplotypecaller`、`deepvariant`、`genotypegvcf` 等变异检测工具，均基于 GPU 加速，相比开源版本速度有大幅提升。

---

### BWA / HISAT2 比对
> 比对建议: http://hpc.ncpgr.cn/app/071-fq2bam/ | SAM→BAM: http://hpc.ncpgr.cn/app/054-sam-to-bam/ | HISAT2: http://hpc.ncpgr.cn/app/064-hisat2/
- **无需解压 fq.gz**，大部分比对软件可直接读取
- **建议直接输出 bam**（只有 sam 的 1/3 大小），下游支持可进一步压缩为 cram
- 大规模比对需要较高存储带宽，建议在 **normal队列** 运行
```bash
bwa mem -t 8 genome.fa read1.fq.gz read2.fq.gz | samtools sort -@8 -o output_sorted.bam
```

**HISAT2 特别注意**:
- 找不到索引文件时**不会自动退出**，让人误以为还在运行！
- 提交作业后务必用 `bpeek <job_id>` 查看输出确认
- 有异常及时杀掉作业重投

---

### BLAST
> 集群文档: http://hpc.ncpgr.cn/app/041-blast/

- **NR/NT 等公共数据库已配置好，用 `$NR`、`$NT` 变量直接引用**（见 SKILL.md 总则部分）
- **用 diamond 替代 blastx/blastp**，速度极大提升；`module load nr/20201013-diamond` 有格式化好的 nr 库
- **blastn 运行慢时**: 将 query 分割多段提交多个作业并行跑，线程数设 **4~8** 即可（CPU利用率不高）
- 超短序列（<50nt）用 `-task blastn-short -word_size 4 -gapopen 1 -gapextend 1`
- 小参考序列不用建索引，用 `-subject` 直接比对

---

### BUSCO
> 集群文档: http://hpc.ncpgr.cn/app/042-BUSCO/

- **计算节点无网络，必须用离线模式**: 先在登录节点下载数据库，再提交作业
```bash
# 登录节点下载数据库
singularity exec $IMAGE/busco/5.5.0_cv1.sif busco --download embryophyta_odb10
# 计算节点离线运行
singularity exec -e $IMAGE/busco/5.5.0_cv1.sif busco -i MH63.fa -l ./busco_downloads/lineages/embryophyta_odb10 -o out -m genome -c 30 --offline
```

---

### Bismark (BS-seq 甲基化比对)
> 集群文档: http://hpc.ncpgr.cn/app/040-Bismark/
- **`--multicore N` 实际调用 4N 个 bowtie 线程**！LSF 申请核心数必须是 `--multicore` 值的 **4倍**
  - 如 `--multicore 4` → 实际16线程，需 `-n 16`
- `bismark2bedGraph` 中 sort 可手动添加 `--parallel=8` 加速，用 `--buffer_size` 控制内存

---

### BS-Seeker2
> 集群文档: http://hpc.ncpgr.cn/app/072-bs-seeker/
- **产生大量临时文件写入 `/tmp`，极易写满**（单作业可达 30~70GB）
- **务必使用 `--temp_dir`** 指向自己目录：
```bash
mkdir tmp
bs_seeker2-align.py -1 R1.fq -2 R2.fq -o sample.bam -g genome.fa --temp_dir=./tmp
```

---

### RepeatModeler
> 集群文档: http://hpc.ncpgr.cn/app/182-repeatmodeler/
- **`-pa N` 实际使用 4N 线程**（每个 rmblastn 用4线程）
- `-pa 5` → 20线程，作业脚本需申请 `-n 20`，否则节点过载挂起
- 版本 2.0.6 报错 `build_lmer_table failed. Exit code 256` 需修改 RepeatScout 2行代码重编译（见 commit c5193bb）

---

### MAKER (基因组注释)
> 集群文档: http://hpc.ncpgr.cn/app/050-maker/

- MPI并行，**必须用 parallel 队列**（需申请权限，每人限120核）
- 建议申请 100 核即可（过多排队时间长）；**资源紧张时拆分染色体**各跑一个作业
- **运行时需及时关注日志** `*_master_datastore_index.log`，出现 `FAILED` 程序不会停下但会空跑
- 小基因组出错直接杀掉重跑；大基因组将出错染色体单独重跑再合并

---

### CellRanger (单细胞)
> 集群文档: http://hpc.ncpgr.cn/app/077-cellranger/
**两种加速方式组合，可将运行时间从 8h 降至 2h**：

1. **结果输出到计算节点 `/tmp`**（本地磁盘IO更快）
   - 需指定 `rusage[tmp=XXG]`，经验值为输入 fq.gz 的 **2倍**
   - 运行完移回 home
2. **添加 `--no-bam`**（不需要bam文件时）
   - 一般表达矩阵分析无需bam，RNA速率分析才需要

```bash
#BSUB -J cellranger
#BSUB -n 20
#BSUB -R "rusage[tmp=70G]"
#BSUB -q normal
module load cellranger/7.0.0

workdir=`pwd`
tmpd="/tmp/`mktemp -u cellranger_XXXXX`"; mkdir ${tmpd}; cd ${tmpd}
cellranger count --id=sample --transcriptome=ref --fastqs=data --sample=sample \
  --force-cells=8000 --localcores $LSB_DJOB_NUMPROC
mv sample/ ${workdir}
```

---

### Paragraph (SV 基因型分型)
> 集群文档: http://hpc.ncpgr.cn/app/063-paragraph/
- **每个VCF位点生成3个临时文件到 `/tmp`，程序结束后不自动删除**，积累会写满系统盘导致节点挂掉
- **建议**: VCF超10万行拆分；在 **normal队列**（SSD系统盘）；单作业申请10核；脚本中创建专属临时目录并在结束时清理
```bash
tmpd="/tmp/`mktemp -u paragraph_XXXXX`"; mkdir ${tmpd}; export TMP=${tmpd}
multigrmpy.py -i input.vcf -r ref.fa --threads $LSB_DJOB_NUMPROC --scratch-dir ${tmpd} -o out
rm -r ${tmpd}   # 务必清理
```

---

### SqueezeMeta (宏基因组)
> 集群文档: http://hpc.ncpgr.cn/app/067-SqueezeMeta/
- **第六步(06.lca.pl)极度吃IO**，数据库在远程分区时速度仅 ~8kb/s（2天的数据量）
- **解决方案**: 用胖节点 s001 的 `/tmp/squeezemeta/db` 数据库，并指定节点 s001
- 集群已有副本: `/share/database/squeezemeta/db/`
- 已运行的修改 `SqueezeMeta_conf.pl` 中数据库路径，用 `restart.pl` 继续

---

### DeepVariant (深度学习变异检测)
> 集群文档: http://hpc.ncpgr.cn/app/100-deepvariant/

> **注意**: 仅当用户明确提及需要使用 DeepVariant 时才推荐此方案，否则默认推荐 Parabricks 进行变异检测。

- GPU版仅 `call_variants` 步骤可用GPU，`make_examples` 和 `postprocess_variants` 只能用CPU
- 三个步骤互相依赖：make_examples → call_variants → postprocess_variants
- 支持 Illumina、PacBio、Nanopore

---

### GLnexus (大规模 gVCF joint call)
> 集群文档: http://hpc.ncpgr.cn/app/126-glnexus/

- 替代 GATK CombineGVCFs + GenotypeGVCFs，**速度快很多**
- **内存需求大**，建议用 high 或 smp 队列整节点（`-q high -n 36`）
- WES 需用 `--bed` 指定目标区域；WGS可不指定
- 输出 bcf 格式，可用 bcftools 转 vcf
- 内存报错 `std::bad_alloc` 时寻求管理员协助

---

### HAPpy (变异检测基准测试)
> 集群文档: http://hpc.ncpgr.cn/app/164-happy/

```bash
hap.py truth.vcf query.vcf -r ref.fa -f chr1.bed --threads 8 -o truth_vs_query
```
- `-f` 指定比较区间（bed），只比较该区间内位点
- 输出 summary.csv（精度/召回率/F1）、ROC曲线、标注VCF等

---

### faST-LMM (群体遗传)
> 集群文档: http://hpc.ncpgr.cn/app/046-fastlmmc/
- **`-maxThreads` 多线程比单线程还慢**！**不要用该选项，默认单线程即可**
- 实测：单线程 2208s vs 20线程 4112s

---

### CNVnator (CNV 检测)
> 集群文档: http://hpc.ncpgr.cn/app/044-cnvnator/
- **默认用满整个节点CPU核**，必须用环境变量控制线程数：
```bash
export MKL_NUM_THREADS=1; export OMP_NUM_THREADS=1
# 或按申请的核心数
export MKL_NUM_THREADS=$LSB_DJOB_NUMPROC; export OMP_NUM_THREADS=$LSB_DJOB_NUMPROC
```

---

### OrthoMCL (同源基因簇)
> 集群文档: http://hpc.ncpgr.cn/app/076-orthomcl/
- MySQL 在 s004 节点，数据库建议命名为 `orthomcl_username` 避免冲突
- **运行完成后及时删除 MySQL 中创建的数据库**
```bash
orthomcl-setup-database.pl --user username --password password --host s004 --database orthomcl_username --outfile orthomcl.conf
orthomcl-pipeline -i pep/ -o out -m orthomcl.conf --nocompliant -s $LSB_DJOB_NUMPROC --yes
```

---

### Trinity (转录组组装)
> 集群文档: http://hpc.ncpgr.cn/app/060-trinity/
- 使用 singularity 镜像 `/share/Singularity/Trinity/2.12.0.sif`
```bash
bsub -o trinity.log -n 30 -q smp -J trinity \
  "module purge; module load Singularity/3.7.3; singularity exec $IMAGE/Trinity/2.12.0.sif Trinity --seqType fq --max_memory 400G --samples_file samples_file --CPU 30 --SS_lib_type RF --output trinity_out"
```

---

### HiC-Pro
> 集群文档: http://hpc.ncpgr.cn/app/049-HiC-Pro/
- 集群中 `HiC-Pro/2.11.14` 已配集群模式
- 生成的 LSF 脚本不能直接提交，需删除 `#BSUB -M/W/N/u/q` 行，添加 `module load HiC-Pro/2.11.4`
- 先提交 step1，日志无报错后再提交 step2（step2 可改 `-n 1`）
- 出错直接重新提交该脚本即可

---

### InterProScan (蛋白功能注释)
> 集群文档: http://hpc.ncpgr.cn/app/123-interproscan/

- **省资源方案**: 用网页API（`iprscan5.pl`），在登录节点运行，**不消耗集群计算资源**
```bash
./iprscan5.pl --multifasta test.fasta --maxJobs 25 --email test@test.com --outformat tsv
```
- 本地运行：`module load interproscan/5.55-88.0`，消耗计算资源

---

### HOMER (Motif发现)
> 集群文档: http://hpc.ncpgr.cn/app/112-homer/

- `module load homer/4.11`
- 支持 ChIP-Seq、RNA-Seq、DNase-Seq、Hi-C 等分析

---

### Augustus (基因预测)
> 集群文档: http://hpc.ncpgr.cn/app/083-augustus/
- `module load augustus/3.3.3`
- 自带模型路径：`$AUGUSTUS_CONFIG_PATH`
- 自定义模型：`export AUGUSTUS_CONFIG_PATH=$HOME/augustus_config`

---

### PASA (转录组注释)
> 集群文档: http://hpc.ncpgr.cn/app/084-pasa/
- 推荐用 sqlite 数据库（比 mysql 方便），配置文件中 `DATABASE=` 写绝对路径
```bash
module load PASA/2.5.2
Launch_PASA_pipeline.pl -c alignAssembly.config -C -r -R --ALT_SPLICE -g genome.fa -t all.fa.clean -T -u all.fa -f accession.txt --TDN TCN.acc --transcribed_is_aligned_orient --ALIGNERS blat,gmap --CPU 20
```

---

### FunGAP (真菌基因组注释)
> 集群文档: http://hpc.ncpgr.cn/app/103-fungap/

- **必须先拷贝配置文件到本地**，否则运行过程权限报错：
```bash
singularity exec $IMAGE/FunGAP/FunGAP.sif cp -r /opt/conda/config FunGAP_config
singularity exec -B ./FunGAP_config/:/opt/conda/config/ $IMAGE/FunGAP/FunGAP.sif \
  /workspace/FunGAP/fungap.py --output_dir fungap_out ...
```
- 离线运行需修改 `check_inputs.py` 中 `check_busco_dataset` 函数，注释掉 159-168 行（禁用 `busco --list-datasets`）

---

### Kraken2 (分类学序列分类)
> 集群文档: http://hpc.ncpgr.cn/app/178-kraken2/

- 数据库含 hash.k2d, opts.k2d, taxo.k2d 三个文件
- 标准库建库：`kraken2-build --standard --threads 24 --db $DBNAME`（下载超50GB，建库用超100GB磁盘）
- 可下载预构建数据库，节省时间

---

### vg (泛基因组分析)
> 集群文档: http://hpc.ncpgr.cn/app/138-vg/

- 支持图构建、比对（BWA-MEM/minimap2/Giraffe）、变异检测、可视化
- 更新快，运行问题多在 GitHub issues 中已有解答
- `module load vg/1.53.0`

---

### PanDepth (覆盖度计算)
> 集群文档: http://hpc.ncpgr.cn/app/145-PanDepth/

- 比 samtools 快很多，多线程加速好
- **cram 输入比 bam 更快**
```bash
module load PanDepth/2.21
pandepth -i test.bam -o test1 -t 6
```

---

### Kingfisher (公共测序数据下载)
> 集群文档: http://hpc.ncpgr.cn/app/135-kingfisher/

- 从 EBI ENA/NCBI SRA/Amazon AWS/Google Cloud 下载
- 三种模式：get（下载）、annotate（样本信息）、extract（sra→fastq）
```bash
module load kingfisher/0.3.1
kingfisher get -r SRR12118866 -m ena-ftp
# 或指定多种下载方式自动选最快的
kingfisher get -r ERR1739691 -m ena-ascp aws-http prefetch
```

---

### GROMACS (分子动力学)
> 集群文档: http://hpc.ncpgr.cn/app/121-gromacs/
- 单节点：`mpirun -np $LSB_DJOB_NUMPROC gmx_mpi mdrun -ntomp 1 -noappend`
- 多节点：需 parallel 队列，`-R "span[ptile=25]"` 每节点25核
- GPU版：`module load GROMACS/2018.3-GPU`，需 gpu 队列

---

### AlphaFold3 (蛋白结构预测)
> 集群文档: http://hpc.ncpgr.cn/app/183-alphafold3/

- 需 GPU 队列，**需向管理员申请 GPU 队列使用权限**
- 两步流程：data pipeline（MSA搜索+模板）→ inference（推理输出mmcif）
- 输入为 json 格式，集群中已有权重文件
- data pipeline 阶段可在 CPU 节点运行，仅 inference 需 GPU

---

### RoseTTAFold (蛋白结构预测)
> 集群文档: http://hpc.ncpgr.cn/app/085-RoseTTAFold/

- 精度略低于 AlphaFold，但**内存和时间需求大幅降低**
- 数据库已在 `/share/database/RosettaFold`，可软链接到自己目录
- 集群默认 cuda11.4，使用 `conda env create -f RoseTTAFold-linux.yml`
- PyRosetta 需额外许可证

---

### bgzip + tabix (VCF压缩与快速访问)
> 集群文档: http://hpc.ncpgr.cn/app/124-bgzip/
- bgzip 块压缩 + tabix 索引，支持按区域快速检索，无需解压全文
```bash
module load HTSlib/1.18
bgzip data.vcf              # 压缩 → data.vcf.gz
tabix -p vcf data.vcf.gz    # 建索引 → data.vcf.gz.tbi
tabix data.vcf.gz 11:2343540-2343596  # 快速访问指定区域
```

---

### Genozip (基因组数据压缩)
> 集群文档: http://hpc.ncpgr.cn/app/109-genozip/

- 压缩率为原始大小的 10%~20%，支持 FASTA/VCF/BAM/CRAM
- **学术用户免费**，需申请 license
- **建议用相同版本压缩和解压**
- 使用 `--reference` 参考基因组压缩可获得更高压缩率
- `genozip -@4 file.fq.gz --reference ref.fa`

---

### gzip 文件操作
> 集群文档: http://hpc.ncpgr.cn/app/056-api_read_write_gzip/
- Linux命令：`zcat`/`zless`/`zmore`/`less` 直接读取
- 合并：`cat file1.gz file2.gz > file3.gz`（直接拼接，无需解压）
- 管道处理，无需解压：
```bash
# 按列合并
paste <(gzip -dc file1.gz) <(gzip -dc file2.gz) | gzip > merge.gz
# blastn 直接读gz
blastn -query <(gzip -dc data.fa.gz) -db ./ref -outfmt 6 | gzip > out.gz
```
- Python：`gzip.open("file.gz", "rt")` / `gzip.open("file.gz", "wt")`
- Perl：`open FI, "<:gzip", "file.gz"` / `open FO, ">:gzip", "file.gz"`

---

### ELAI (局部祖源推断)
> 集群文档: http://hpc.ncpgr.cn/app/162-elai/

- 直接处理二倍体数据，无需相位推断，无需重组图谱
- 集群提供多线程版本：`module load Singularity/3.7.3 elai/1.21`
```bash
singularity exec -B $ROOT:/opt/ $IMAGE/debian/debian11.sif /opt/bin/elai-mt \
  -g geno.txt -p 10 -g parv.txt -p 11 -pos pos.txt -s 20 -o chr5 -C 3 -c 20 -mg 6000 -nthreads 4
```

---

### GCC / glibc
> GCC: http://hpc.ncpgr.cn/app/034-gcc/ | glibc: http://hpc.ncpgr.cn/app/095-glibc/
- CentOS7 glibc 为 **2.17**（10年前的版本），越来越多软件不兼容
- 预装GCC：4.8.5, 4.9.2, 5.4.0, 6.2.0, 6.4.0, 7.2.0, 9.4.0, 10.3.0, 11.2.0
- 高版本glibc编译的软件无法在低版本运行 → 用 **singularity容器** 解决
- 查看系统glibc：`ldd --version`

---

### R / RStudio
> R: http://hpc.ncpgr.cn/app/006-R/ | RStudio: http://hpc.ncpgr.cn/app/105-rstudio/
- **强烈推荐 `R/4.0.0`（内置 758 个包），不要用最新版除非有明确需求**
  - R/4.0.0 内置：clusterProfiler、ggplot2、DESeq2、edgeR、limma、tidyr、pheatmap、EnhancedVolcano、GO.db、AnnotationDbi 等
  - R/4.5.1 等新版仅 120 个包，缺少上述大部分包，且安装依赖链很长（clusterProfiler 需要 ggplot2 → qvalue → DOSE → GOSemSim → enrichplot 等 30+ 依赖）
  - 写 LSF 脚本时一律用 `module load R/4.0.0`
- **⛔ 禁止安装 R/4.0.0 已内置的包**：当 R 脚本需要 clusterProfiler、DESeq2、edgeR、limma、ggplot2、pheatmap 等时，正确做法是 `module load R/4.0.0`，**不是** `install.packages("clusterProfiler")` 或 `BiocManager::install("clusterProfiler")`。在 R/4.5.1 上安装这些包会触发 30+ 依赖链，极易失败且浪费时间
- R包默认安装：`~/R/x86_64-pc-linux-gnu-library/4.0`
- 部分R包依赖高版本GCC，需先 `module load GCC/x.x.x`
- **RStudio 仅限校内使用**
- 计算节点无联网，R包须在登录节点安装：`install.packages("pkg", lib="~/R/rstudio/4.2/")`
- `rstudio_submit` 提交后用 `bpeek` 获取SSH隧道信息和登录密码

---

### Mamba (快速包管理)
> 集群文档: http://hpc.ncpgr.cn/app/099-mamba/

- C++编写，比 conda 快很多，兼容 conda 命令
- 推荐 **micromamba**（精简版，无需base环境和Python）：
```bash
curl -Ls https://micro.mamba.pm/api/micromamba/linux-64/latest | tar -xvj bin/micromamba
~/bin/micromamba shell init -s bash -p ~/micromamba
```
- 集群已有：`module load micromamba`
- 安装优先级：mamba → singularity → 源码编译

---

### Node.js
> 集群文档: http://hpc.ncpgr.cn/app/146-nodejs/
- CentOS7 需用非官方编译版本（`linux-x64-glibc-217` 后缀）
- `module load nodejs/21.6.0`
- 全局安装权限报错：`export NPM_CONFIG_PREFIX=~/.npm-global`

---

### Rust
> 集群文档: http://hpc.ncpgr.cn/app/153-rust/
- 用户调用 cargo 安装软件需设置 `CARGO_HOME` 到个人目录，否则权限拒绝
```bash
export CARGO_HOME=$HOME/.cargo
module load rust/1.76.0
cargo install ripgrep
export PATH="$HOME/.cargo/bin:$PATH"
```

---

### MySQL
> 集群文档: http://hpc.ncpgr.cn/app/014-mysql-database/
- Server 在 s005 节点，联系管理员获取账号密码
```bash
mysql -uUSERNAME -pPASSWORD -h s005
```

---

### 32位软件
> 集群文档: http://hpc.ncpgr.cn/app/101-run-32bit-software/
```bash
singularity exec -B ${PWD}:/opt/ $IMAGE/centos/centos7_32.sif /opt/32bitprogram -h
```

---

### VSCode Remote-SSH
> 集群文档: http://hpc.ncpgr.cn/app/188-vscode/
- CentOS7 glibc 低，最新版 Remote-SSH 无法使用
- **推荐版本 1.98**，提示"不受支持的OS版本"时点击 Allow，不影响使用
- 禁用自动更新：设置中 Update:Channel → 'manual'
- SSH config 添加 `KbdInteractiveAuthentication yes` 支持二次验证

---

### GitHub / Docker 加速
> 集群文档: http://hpc.ncpgr.cn/app/075-github/
- 代理：ghproxy.com, gh-proxy.com, ghfast.top, wget.la
- 多站加速：https://github.com/xixu-me/Xget
```bash
# 下载
wget https://xget.xi-xu.me/gh/samtools/samtools/releases/download/1.22.1/samtools-1.22.1.tar.bz2
# git clone
git clone https://xget.xi-xu.me/gh/samtools/samtools.git
# docker 镜像
singularity pull docker://docker.m.ixdev.cn/dfam/tetools
```
