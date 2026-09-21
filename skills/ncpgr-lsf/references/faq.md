# LSF 常见问题解答

## 作业提交问题

### Q: 如何快速让我的作业跑起来？

**策略**: 提交前先用 `bhosts` 查看资源，合理设置核数

```bash
# 第1步：查看资源
bhosts | grep -E "ok|closed" | head -20

# 第2步：根据结果设置核数
# 如果多数节点是 closed → 申请 2-4 核
#BSUB -n 2

# 如果有空闲节点 → 可申请 8+ 核
#BSUB -n 8
```

**原理**: 申请的核数越多，需要的空闲节点资源越多，排队时间越长。申请1-2核的作业几乎可以立即调度。

### Q: 需要设置内存参数吗？

**不需要！** 所有队列都已配置内存限制：

| 队列 | 内存限制 |
|------|---------|
| **normal** | 默认6GB，最大10GB |
| **smp** | 默认12GB，最大20GB |
| **high** | 默认11GB，最大15GB |
| **q2680v2** | 默认6GB，最大10GB |
| **interactive** | 默认30GB，最大500GB |

**极简原则**：
- ✅ **不要设置** `-M` 和 `rusage[mem=...]`
- ✅ **不要设置** `-W` 时间限制
- ✅ **只设置** `-n` 核心数、`-q` 队列、`-J` 作业名

**如果内存超限**：
- 超出默认限制 → 作业挂起(SSUSP)，稍后恢复
- 超出最大限制 → 作业终止(EXIT)，换到smp/high队列

### Q: 如何使用集群已安装的软件？

**必须使用 `module` 命令加载：**

```bash
# 第1步：查看可用软件
module av bwa              # 查看bwa相关模块
module av STAR             # 查看STAR相关模块
module av samtools         # 查看samtools相关模块
```

**示例输出**：
```
------------------------- /opt/modulefiles -------------------------
BWA/0.7.15-foss-2016b    BWA/0.7.17-foss-2018b (D)
STAR/2.6.0a-foss-2016b   STAR/2.7.0f-foss-2018b
SAMtools/1.3             SAMtools/1.9-foss-2018b (D)
```

**第2步：在作业脚本中加载**：
```bash
#!/bin/bash
#BSUB -J my_job
#BSUB -n 4
#BSUB -R "span[hosts=1]"
#BSUB -o %J.out
#BSUB -e %J.err

# 加载集群已安装的软件
module load BWA/0.7.17-foss-2018b

# 验证加载成功
module list
which bwa

# 使用软件
bwa mem -t $LSB_DJOB_NUMPROC ref.fa read1.fq read2.fq > output.sam
```

**常用软件模块**：
- `module load BWA/0.7.17-foss-2018b`
- `module load STAR/2.6.0a-foss-2016b`
- `module load SAMtools/1.3`
- `module load picard/2.18.27`
- `module load HTSeq/0.8.0`

**注意事项**：
- **优先原则**：只要软件已通过module安装在集群，必须优先使用module版本
- **不要**假设软件已在PATH中，必须显式`module load`
- 如果不知道模块名，先用`module av 软件名`查看
- 可以在脚本中加入`module list`确认加载成功

### Q: 作业一直处于PEND状态？

**排查步骤**:

1. 查看具体原因：
```bash
bjobs -p <jobid>
```

2. 常见原因及解决：

| 提示 | 含义 | 解决 |
|------|------|------|
| `User has reached the pre-user job slot limit of the queue` | 该队列用户作业数达上限 | 等待队列中作业完成，或换队列 |
| `The user has reached his job slot limit` | 用户总作业数达系统上限 | 等待现有作业完成 |
| `The queue has reached its job slot limit` | 队列总核数已满 | 等待队列作业完成 |
| `The slot limit reached;4 hosts` | 队列可用节点数达上限 | 等待 |
| `Pending job threshold reached` | 提交作业数超系统上限 | 等待后重试 |

### Q: 作业被SSUSP（系统挂起）？

**原因**: 节点内存不足，系统自动挂起部分作业

**解决**:
```bash
# 1. 查看节点内存
lsload | grep <nodename>

# 2. 查看作业内存使用
bjobs -l <jobid>

# 3. 调整内存申请后重新提交
bmod -R "rusage[mem=30GB]" <jobid>
brequeue <jobid>
```

**注意**: 多次出现作业大面积挂起未处理，将被降低可用核数。

### Q: 作业被kill？

**可能原因**:

1. **内存溢出**: 超过 `-M` 设置的内存限制
2. **超时**: 超过 `-W` 设置的时间限制
3. **节点故障**: 运行节点出现问题

**排查**:
```bash
bhist -l <jobid>    # 查看终止原因
cat <jobid>.err     # 查看错误输出
```

## 作业运行问题

### Q: 申请了多核但程序只跑单核？

**检查**:

1. 是否正确传递线程参数：
```bash
# 错误
program -t 4          # 固定4核

# 正确
program -t $LSB_DJOB_NUMPROC   # 使用LSF变量
```

2. 程序是否支持多线程（检查文档）

### Q: 作业申请了多节点但实际只用了一个？

**原因**: 程序不支持MPI跨节点并行

**解决**: 
- 生物软件绝大多数只支持单节点多线程
- 使用 `-R "span[hosts=1]"` 限制单节点
- 不要申请超过单节点核数（通常36核）

### Q: CPU时间远低于运行时间×核数？

**现象**: `cputime << runtime * slots`

**原因**:
- 作业实际没有计算（空跑）
- 程序出错但未退出
- IO等待严重

**检查**:
```bash
bpeek <jobid>       # 查看实时输出
cat <jobid>.err     # 查看错误
```

**常见情况**: hisat2比对时参考基因组路径错误，程序报错但不退出。

## 资源申请问题

### Q: 如何确定内存申请量？

**步骤**:

1. 先用默认设置跑一个测试作业
2. 使用别名监控实际内存：
```bash
bbjobs    # 查看max_mem列
```
3. 批量提交时按实际max_mem设置：
```bash
# 若max_mem显示15.3GB
bsub -R "rusage[mem=16GB]" -M 16G ...
```

### Q: 内存申请过大有什么影响？

**影响**:
- 节点预留大量内存，无法接收其他作业
- 集群整体吞吐量下降
- 自己作业也可能因此排队更久

**建议**: 按实际使用申请，留出10-20%余量即可。

### Q: 如何申请大内存节点？

```bash
# 选择物理内存>220GB的节点
bsub -R "select[maxmem>224800] rusage[mem=50GB]" -q high ...
```

## 批量提交问题

### Q: 如何批量提交上千个作业？

**策略**:

1. **作业运行时间>10分钟**: 直接循环提交
```bash
for i in {1..1000}; do
    bsub -J job_$i -n 1 ... "command $i"
    sleep 1
done
```

2. **作业运行时间<10分钟**: 合并提交
```bash
# 每100个任务合并为一个作业
for batch in {1..10}; do
    #BSUB -J batch_$batch
    for i in {1..100}; do
        task_id=$(( (batch-1)*100 + i ))
        command $task_id
    done
done
```

### Q: 批量提交时如何设置依赖？

**方法1: 使用 -K 参数（推荐）**

在流程脚本中使用 `-K` 让步骤顺序执行：
```bash
bsub -K -J step1 ... "command1"  # 等待完成
bsub -K -J step2 ... "command2"  # step1后执行
```

**方法2: 使用 -w 参数**
```bash
job1=$(bsub -J step1 ... "command1" | awk '{print $2}')
bsub -w "done($job1)" -J step2 ... "command2"
```

### Q: 如何避免循环提交时系统过载？

添加 `sleep` 控制提交速度：
```bash
for sample in *.fq.gz; do
    bsub ... "process $sample"
    sleep 10   # 每10秒提交一个
done
```

## 交互式作业问题

### Q: 交互式作业无法启动？

**原因**: 只能在 `interactive` 队列使用交互模式

**正确用法**:
```bash
bsub -q interactive -Is bash
```

### Q: 交互式作业被kill？

**原因**: interactive队列限制48小时，超时自动终止。

## 其他问题

### Q: 如何查看作业输出？

```bash
bpeek <jobid>           # 实时查看
cat <jobid>.out         # 查看输出文件
cat <jobid>.err         # 查看错误文件
```

### Q: 如何终止所有作业？

```bash
bkill 0                 # 终止用户所有作业
bkill $(bjobs | awk 'NR>1 {print $1}')  # 或者
```

### Q: 作业输出文件太大？

**解决**:
1. 程序重定向输出到/dev/null
2. 程序使用 `--quiet` 等安静模式
3. 定期清理输出文件

### Q: 如何查看历史作业？

```bash
bhist                   # 最近作业
bhist -n 100            # 最近100个
bhist -l <jobid>        # 特定作业详情
bacct                   # 计费统计
```
