# LSF 快速参考卡片

## 极简编写原则

```bash
# 1. 脚本后缀: .lsf
# 2. 不设置内存参数（-M, rusage[mem=...]）
# 3. 不设置时间限制（-W）
# 4. 只保留核心参数
# 5. 使用module加载集群软件
```

## 查看和加载软件

```bash
# 查看可用软件
module av bwa           # 查看bwa相关
module av STAR          # 查看STAR相关
module av               # 查看所有

# 在作业脚本中加载
module load BWA/0.7.17-foss-2018b
module load STAR/2.6.0a-foss-2016b
module load SAMtools/1.3
```

## 极简模板

```bash
#!/bin/bash
#BSUB -J my_job
#BSUB -n 4                  # 根据bhosts调整
#BSUB -R "span[hosts=1]"    # 生物软件必加
#BSUB -o %J.out
#BSUB -e %J.err

# 加载集群已安装的软件
module load BWA/0.7.17-foss-2018b

# 运行
bwa mem -t $LSB_DJOB_NUMPROC ref.fa read1.fq read2.fq > output.sam
```

**不需要写的**：
- ❌ `-M 8G` - 队列已自动管理
- ❌ `-R "rusage[mem=8G]"` - 队列已自动管理  
- ❌ `-W 12:00` - 不需要时间限制

## 提交前必做

```bash
# 1. 查看软件
module av your_software

# 2. 查看资源
bhosts | grep -E "ok|closed" | head -10

# 3. 根据结果设置核数
# closed多 → -n 2 或 -n 4（易调度）
# ok且空闲多 → -n 8 或 -n 16（加速）
```

## 常用命令

```bash
module av <软件名>        # 查看可用软件
module load <模块名>      # 加载软件
module list               # 查看已加载
bsub < job.lsf            # 提交作业
bjobs                     # 查看状态
bpeek <jobid>             # 看输出
bkill <jobid>             # 终止
```

## 队列资源限制

| 队列 | 内存限制 | 说明 |
|------|---------|------|
| normal | 6GB默认/10GB最大 | 无需设置内存 |
| smp | 12GB默认/20GB最大 | 无需设置内存 |
| high | 11GB默认/15GB最大 | 无需设置内存 |
| interactive | 30GB默认/500GB最大 | 限48小时 |

所有队列都已配置资源限制，用户只需设置 `-n` 核心数。
