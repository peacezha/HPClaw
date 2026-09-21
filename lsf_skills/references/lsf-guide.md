# LSF 完整使用文档

## 目录

1. [编写规范](#编写规范)
2. [作业提交详解](#作业提交详解)
3. [资源需求语法](#资源需求语法)
4. [批量提交策略](#批量提交策略)
5. [作业依赖](#作业依赖)
6. [内存管理](#内存管理)

## 编写规范

### 网络访问规范

**由于计算节点没有联网，所有需要网络的任务都必须在当前登录节点进行，不得提交到计算节点。**

| 任务类型 | 执行位置 | 说明 |
|---------|---------|------|
| 需要网络（下载数据、下载参考基因组、安装软件包等） | **登录节点** | 直接在登录节点执行，不能通过bsub提交 |
| 纯计算（比对、定量、组装、分析等） | 计算节点（通过LSF提交） | 通过编写 `.lsf` 脚本提交到计算节点 |

### 脚本命名规范

**LSF作业脚本后缀必须使用 `.lsf`**，以便与普通shell脚本区分。

```bash
# 正确命名
my_job.lsf
bwa_mem.lsf
rnaseq_pipeline.lsf

# 不推荐命名
my_job.sh
my_job.bash
my_job.txt
```

### 资源规划规范

**设置核数前，必须先使用 `bhosts` 查看集群资源状况**。

#### 查看资源命令

```bash
# 查看所有节点状态
bhosts

# 只看有可用资源的节点
bhosts | grep ok

# 查看特定队列的节点
bqueues -m normal
```

#### 输出解读

```
HOST_NAME      STATUS   JL/U   MAX  NJOBS  RUN  SSUSP  USUSP  RSV
c01n01         closed    -      36    36    36      0      0    0   <- 已满
c01n02         ok        -      36    30    30      0      0    0   <- 有6个空闲
c02n01         ok        -      36    24    24      0      0    0   <- 有12个空闲
```

- `STATUS=ok`: 节点可以接收新作业
- `STATUS=closed`: 节点已满，不接受新作业
- `MAX`: 节点总核心数
- `NJOBS`: 当前已分配的核心数
- `MAX - NJOBS`: 空闲核心数

#### 核数设置策略

| 资源状况 | bhosts输出特征 | 建议核数 | 理由 |
|----------|----------------|----------|------|
| 资源紧张 | 多数节点为`closed` | 2-4核 | 容易找到空闲资源，快速调度 |
| 资源一般 | 少数节点`ok`，空闲核心<10 | 4-6核 | 平衡速度和调度成功率 |
| 资源充足 | 多节点`ok`，空闲核心>15 | 8-16核 | 充分利用资源，加速计算 |
| 急需结果 | 任何状况 | 1-2核 | 最容易调度，几乎可以立即运行 |

#### 示例工作流程

```bash
# 第1步：查看资源
$ bhosts | grep -E "ok|closed" | head -10
HOST_NAME      STATUS   MAX  NJOBS
c01n01         closed    36    36
c01n02         closed    36    36
c01n03         ok        36    32   <- 有4个空闲
c02n01         ok        36    28   <- 有8个空闲

# 第2步：根据结果设置核数
# 看到只有少量空闲核心，申请4核
#BSUB -n 4

# 第3步：如果资源充足，可以申请更多
# 看到多节点有很多空闲，申请8核
#BSUB -n 8
```

#### 常见错误

**错误1**: 不看资源直接申请32核
```bash
# 结果：长时间排队，无法调度
#BSUB -n 32
```

**错误2**: 资源紧张时仍申请大量核心
```bash
# 当所有节点都closed时，应该申请1-4核
# 而不是继续申请8+核
```

**正确做法**:
```bash
# 资源紧张时，用小核数快速获得计算资源
#BSUB -n 2
# 或者使用q2680v2队列（通常较空闲）
#BSUB -q q2680v2
#BSUB -n 4
```

## 作业提交详解

### 行命令提交

适合简单的一次性作业：

```bash
bsub -J blast -n 10 -R span[hosts=1] -o %J.out -e %J.err -q normal \
    "blastn -query input.fa -db ref -num_threads \$LSB_DJOB_NUMPROC"
```

注意：双引号内的 `$` 需要转义为 `\$`，或者使用单引号。

### 脚本提交

推荐方式，便于复用和版本控制。

## 资源需求语法 (-R)

### span选项

| 语法 | 说明 |
|------|------|
| `span[hosts=1]` | 单节点运行 |
| `span[ptile=N]` | 每节点N个核心 |
| `span[ptile=auto]` | 自动分配 |

### rusage选项

```bash
# 内存预留
-R "rusage[mem=20GB]"

# 多资源
-R "rusage[mem=20GB:tmp=50GB]"

# 累积预留
-R "rusage[mem=20GB]" -R "rusage[tmp=50GB]"
```

### select选项

选择特定节点：

```bash
# 大内存节点(>220GB)
-R "select[maxmem>224800]"

# 特定主机
-R "select[hname=='c01n01']"

# 组合条件
-R "select[maxmem>224800] rusage[mem=20GB] span[hosts=1]"
```

## 批量提交策略

### 策略对比

| 方式 | 适用场景 | 优点 | 缺点 |
|------|----------|------|------|
| Shell循环 | 简单批量 | 简单直接 | 不易管理依赖 |
| 流程脚本+bsub -K | 复杂流程 | 支持依赖 | 脚本较复杂 |
| 数组作业 | 参数扫描 | 管理方便 | 需用索引区分 |

### 大批量小作业合并

当作业数量>1000且单个作业<10分钟时，建议合并：

```bash
# 原：提交1000个1分钟作业
# 改为：提交10个作业，每个跑100个任务

#BSUB -J batch
#BSUB -n 1
#BSUB -W 02:00

for args in {1..100}; do
    python process.py $args
done
```

### RNA-Seq流程示例

**RNA.sh** (单样本处理):
```bash
#!/bin/sh
sample=$1
index=$(basename $sample | sed 's/_trim_1.fq.gz//')
prefix=$(dirname $sample)

# Step1: 比对 (8核)
bsub -K -J STAR1 -n 8 -R span[hosts=1] \
    "STAR --runThreadN 8 --readFilesIn ${prefix}/${index}_trim_*.fq.gz ..."

# Step2: 提取唯一比对 (1核)
bsub -K -J STAR2 -n 1 -R span[hosts=1] \
    "grep -E '@|NH:i:1' ${index}.Aligned.out.sam > ${index}.uniq.sam"

# Step3: 排序 (2核)
bsub -K -J STAR3 -n 2 -R span[hosts=1] \
    "samtools sort -@2 ${index}.uniq.sam > ${index}.bam"

# Step4: 计数 (1核)
bsub -K -J STAR4 -n 1 -R span[hosts=1] \
    "htseq-count -f bam ${index}.bam $gtf > ${index}.counts"
```

**batch_run.lsf** (批量提交):
```bash
#BSUB -J STAR_batch
#BSUB -n 1
#BSUB -R span[hosts=1]
#BSUB -o %J.out
#BSUB -e %J.err

for sample in /path/to/data/*_trim_1.fq.gz; do
    sh RNA.sh $sample &
    sleep 10
done
wait
```

## 作业依赖

### 基本依赖

```bash
# jobB在jobA完成后运行
bsub -J jobA ... "commandA"
bsub -w "done(jobA)" -J jobB ... "commandB"
```

### 依赖类型

| 类型 | 说明 |
|------|------|
| `done(job)` | 作业正常完成 |
| `ended(job)` | 作业结束（无论成功与否）|
| `started(job)` | 作业开始运行 |
| `exit(job, [!=0])` | 作业以非0退出码结束 |
| `done(jobA) && done(jobB)` | 多作业依赖 |

### 外部依赖

```bash
# 依赖外部作业ID
bsub -w "done(12345)" ...
```

## 软件环境管理

### 使用module加载集群已安装软件

**重要规则：**
1. **优先原则**：只要应用软件已通过module安装在集群，**必须优先**使用module版本
2. 如果用户使用集群已安装的软件，**必须使用`module`命令加载**才能使用

#### 查看可用软件

```bash
# 查看所有可用模块
module av

# 查看特定软件
module av bwa
module av STAR
module av samtools
module av picard

# 模糊搜索
module av 2>&1 | grep -i aligner
```

**示例输出**：
```
------------------------- /opt/modulefiles -------------------------
BWA/0.7.15-foss-2016b    BWA/0.7.17-foss-2018b (D)
STAR/2.6.0a-foss-2016b   STAR/2.7.0f-foss-2018b
SAMtools/1.3             SAMtools/1.9-foss-2018b (D)
...
```

#### 在作业脚本中使用module

```bash
#!/bin/bash
#BSUB -J bwa_job
#BSUB -n 8
#BSUB -R "span[hosts=1]"
#BSUB -o %J.out
#BSUB -e %J.err

# 加载集群已安装的软件
module load BWA/0.7.17-foss-2018b

# 可选：验证加载成功
module list
which bwa
bwa --version

# 使用软件
bwa mem -t $LSB_DJOB_NUMPROC ref.fa read1.fq read2.fq > output.sam
```

#### 常用生物信息软件模块

| 软件 | 模块名示例 |
|------|-----------|
| BWA | `BWA/0.7.17-foss-2018b` |
| STAR | `STAR/2.6.0a-foss-2016b`, `STAR/2.7.0f-foss-2018b` |
| SAMtools | `SAMtools/1.3`, `SAMtools/1.9-foss-2018b` |
| Picard | `picard/2.18.27` |
| HTSeq | `HTSeq/0.8.0` |
| GATK | `GATK/4.1.4.1-foss-2018b-Python-3.7.2` |
| BLAST+ | `BLAST+/2.9.0-foss-2018b` |
| Bowtie2 | `Bowtie2/2.3.5.1-foss-2018b` |

#### module常用命令

```bash
module av <软件名>        # 查看可用版本
module load <模块名>      # 加载模块
module unload <模块名>    # 卸载模块
module list               # 查看已加载模块
module purge              # 卸载所有模块
module show <模块名>      # 显示模块详情
```

#### 注意事项

1. **不要假设软件在PATH中**：即使软件已安装在集群，也必须`module load`后才能使用
2. **版本选择**：同一软件可能有多个版本，用`module av`查看并选择合适版本
3. **冲突处理**：如果模块加载冲突，先用`module purge`清空再重新加载
4. **依赖关系**：有些模块会自动加载依赖的其他模块

## 内存管理

### 极简原则：不设置内存参数

**所有队列都已配置内存限制，用户无需在作业脚本中设置 `-M` 和 `rusage[mem=...]`。**

#### 队列内存配置

| 队列 | 默认内存 | 最大内存 | 说明 |
|------|---------|---------|------|
| **normal** | 6 GB | 10 GB | 无需设置内存参数 |
| **smp** | 12 GB | 20 GB | 无需设置内存参数 |
| **high** | 11 GB | 15 GB | 无需设置内存参数 |
| **q2680v2** | 6 GB | 10 GB | 无需设置内存参数 |
| **interactive** | 30 GB | 500 GB | 无需设置内存参数 |

#### 推荐写法（极简）

```bash
#!/bin/bash
#BSUB -J my_job
#BSUB -q normal
#BSUB -n 4
#BSUB -R "span[hosts=1]"
#BSUB -o %J.out
#BSUB -e %J.err
# 不设置 -M
# 不设置 rusage[mem=...]
# 不设置 -W

your_program --threads $LSB_DJOB_NUMPROC
```

#### 内存超限处理

- **超出默认限制（如normal的6GB）**：作业会被挂起(SSUSP)，稍后自动恢复
- **超出最大限制（如normal的10GB）**：作业会被终止(EXIT)
- **频繁被挂起**：换到smp/high队列（更大内存限制）或优化程序

#### 查看队列内存配置

```bash
# 查看队列详细配置
bqueues -l normal | grep -A5 "MEMLIMIT"
bqueues -l gpu | grep -A5 "MEMLIMIT"
```

### 内存参数对比

| 参数 | 作用 | 行为 |
|------|------|------|
| `-R "rusage[mem=X]"` | 预留内存 | 调度器预留，可超用 |
| `-M X` | 硬限制 | 超过则kill |
| `-R "select[maxmem>X]"` | 节点选择 | 选择大内存节点 |

### 内存问题排查

**作业被SSUSP（系统挂起）**:

```bash
# 1. 查看节点内存
lsload | grep <nodename>

# 2. 查看作业实际内存使用
bjobs -l <jobid> | grep mem

# 3. 调整内存申请
bmod -R "rusage[mem=30GB]" <jobid>
brequeue <jobid>
```

**内存申请建议值**：
- fastlmmc/tassel等: 根据实际使用设置15-30GB
- 基因组比对: 通常8-16GB足够
- 转录组分析: 通常8-20GB

### 避免内存浪费

1. 先测试一个作业确定实际内存需求
2. 使用 `bbjobs` 别名监控max_mem
3. 批量提交时使用合理的rusage值
4. 避免盲目申请100GB+内存

## 高级用法

### 作业重运行

```bash
# 失败自动重试
bsub -r ... "command"

# 手动重跑
brequeue <jobid>
```

### Project统计

```bash
# 提交时指定project
bsub -P project_name ...

# 按project统计资源
bacct -P project_name
```

### 邮件通知

```bash
# 作业完成发邮件
bsub -u your_email@example.com -N ...
```

### 指定运行节点

```bash
bsub -m "c01n01" ...        # 指定节点
bsub -m "c01n01 c01n02" ... # 指定多个候选节点
```
