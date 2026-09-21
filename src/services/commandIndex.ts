// ─── Local Command Index for Instant Autocomplete ──────────────────
// Provides zero-latency prefix matching for common Linux / HPC commands.
// AI suggestions arrive later and replace or augment these results.

interface ScoredSuggestion {
  completion: string;
  explanation: string;
  score: number; // higher = more relevant, used internally for ranking
}

export interface LocalSuggestion {
  completion: string;
  explanation: string;
}

// ─── Static registry: common commands with Chinese explanations ────

interface CmdEntry {
  cmd: string;
  expl: string;
  tags: string[];   // categories: linux, hpc, bio, file, text, process, etc.
}

const COMMANDS: CmdEntry[] = [
  // ── Navigation / Files ───────────────────────────────────────
  { cmd: "ls -la", expl: "列出目录详细信息(含隐藏文件)", tags: ["linux", "file"] },
  { cmd: "ls -lh", expl: "人类可读大小格式列出文件", tags: ["linux", "file"] },
  { cmd: "ls -ltr", expl: "按时间排序列出文件", tags: ["linux", "file"] },
  { cmd: "cd", expl: "切换工作目录", tags: ["linux"] },
  { cmd: "pwd", expl: "显示当前目录路径", tags: ["linux"] },
  { cmd: "mkdir -p", expl: "递归创建目录", tags: ["linux", "file"] },
  { cmd: "rm -rf", expl: "⚠ 递归强制删除(危险!)", tags: ["linux", "file"] },
  { cmd: "rm -i", expl: "交互式删除(逐个确认)", tags: ["linux", "file"] },
  { cmd: "cp -r", expl: "递归复制目录", tags: ["linux", "file"] },
  { cmd: "cp -a", expl: "保留权限/时间戳的完整复制", tags: ["linux", "file"] },
  { cmd: "mv", expl: "移动或重命名文件", tags: ["linux", "file"] },
  { cmd: "ln -s", expl: "创建软链接(符号链接)", tags: ["linux", "file"] },
  { cmd: "chmod +x", expl: "添加可执行权限", tags: ["linux", "file"] },
  { cmd: "chmod 755", expl: "设置 rwxr-xr-x 权限", tags: ["linux", "file"] },
  { cmd: "chown", expl: "改变文件所有者", tags: ["linux", "file"] },

  // ── File Content ──────────────────────────────────────────────
  { cmd: "cat", expl: "查看文件全部内容", tags: ["linux", "text"] },
  { cmd: "head -n 20", expl: "查看文件前20行", tags: ["linux", "text"] },
  { cmd: "tail -f", expl: "实时跟踪文件末尾更新", tags: ["linux", "text"] },
  { cmd: "tail -n 100", expl: "查看文件末尾100行", tags: ["linux", "text"] },
  { cmd: "less", expl: "分页浏览文件内容", tags: ["linux", "text"] },
  { cmd: "wc -l", expl: "统计文件行数", tags: ["linux", "text"] },
  { cmd: "sort -k1,1 -n", expl: "按第一列数值排序", tags: ["linux", "text"] },
  { cmd: "sort -u", expl: "排序并去重", tags: ["linux", "text"] },
  { cmd: "uniq -c", expl: "统计重复行出现次数", tags: ["linux", "text"] },
  { cmd: "cut -f1,3", expl: "提取第1和第3列(Tab分隔)", tags: ["linux", "text"] },
  { cmd: "cut -d',' -f1", expl: "按逗号分隔提取第1列", tags: ["linux", "text"] },
  { cmd: "tr '[:lower:]' '[:upper:]'", expl: "小写转大写", tags: ["linux", "text"] },
  { cmd: "diff file1 file2", expl: "比较两个文件的差异", tags: ["linux", "text"] },
  { cmd: "file", expl: "检测文件类型", tags: ["linux"] },
  { cmd: "stat", expl: "显示文件详细属性(大小/时间/权限)", tags: ["linux"] },

  // ── grep / find / sed / awk ───────────────────────────────────
  { cmd: "grep -r", expl: "递归搜索目录中匹配文本", tags: ["linux", "text"] },
  { cmd: "grep -i", expl: "忽略大小写搜索", tags: ["linux", "text"] },
  { cmd: "grep -v", expl: "反向匹配(排除)", tags: ["linux", "text"] },
  { cmd: "grep -c", expl: "统计匹配行数", tags: ["linux", "text"] },
  { cmd: "grep -A 2 -B 2", expl: "显示匹配行前后各2行上下文", tags: ["linux", "text"] },
  { cmd: "grep -E", expl: "扩展正则表达式匹配", tags: ["linux", "text"] },
  { cmd: "grep -o", expl: "仅输出匹配部分", tags: ["linux", "text"] },
  { cmd: "find . -name", expl: "按文件名查找(支持通配符)", tags: ["linux", "file"] },
  { cmd: "find . -type f -name", expl: "查找普通文件", tags: ["linux", "file"] },
  { cmd: "find . -type d -name", expl: "查找目录", tags: ["linux", "file"] },
  { cmd: "find . -mtime -7", expl: "查找7天内修改的文件", tags: ["linux", "file"] },
  { cmd: "find . -size +100M", expl: "查找大于100MB的文件", tags: ["linux", "file"] },
  { cmd: "find . -name '*.log' -delete", expl: "查找并删除所有.log文件", tags: ["linux", "file"] },
  { cmd: "sed 's/old/new/g'", expl: "全局替换文本", tags: ["linux", "text"] },
  { cmd: "sed -i 's/old/new/g'", expl: "就地替换(修改文件)", tags: ["linux", "text"] },
  { cmd: "sed -n '2,10p'", expl: "输出第2到第10行", tags: ["linux", "text"] },
  { cmd: "sed '/pattern/d'", expl: "删除匹配行", tags: ["linux", "text"] },
  { cmd: "awk '{print $1,$3}'", expl: "输出第1和第3列", tags: ["linux", "text"] },
  { cmd: "awk -F',' '{print $2}'", expl: "按逗号分隔输出第2列", tags: ["linux", "text"] },
  { cmd: "awk '{sum+=$1} END {print sum}'", expl: "计算第1列总和", tags: ["linux", "text"] },
  { cmd: "awk 'NR>1 {print}'", expl: "跳过第一行(header)", tags: ["linux", "text"] },
  { cmd: "xargs -I {}", expl: "将标准输入作为参数传给命令", tags: ["linux"] },

  // ── Process / System ──────────────────────────────────────────
  { cmd: "ps aux", expl: "查看所有进程", tags: ["linux", "process"] },
  { cmd: "ps aux | grep", expl: "查找特定进程", tags: ["linux", "process"] },
  { cmd: "top -c", expl: "实时进程监控(显示完整命令)", tags: ["linux", "process"] },
  { cmd: "htop", expl: "交互式进程管理", tags: ["linux", "process"] },
  { cmd: "kill -9", expl: "⚠ 强制终止进程", tags: ["linux", "process"] },
  { cmd: "pkill -f", expl: "按进程名匹配终止", tags: ["linux", "process"] },
  { cmd: "df -h", expl: "磁盘使用情况(人类可读)", tags: ["linux", "system"] },
  { cmd: "du -sh *", expl: "当前目录各文件/夹大小汇总", tags: ["linux", "system"] },
  { cmd: "du -sh .", expl: "当前目录总大小", tags: ["linux", "system"] },
  { cmd: "free -h", expl: "内存使用情况", tags: ["linux", "system"] },
  { cmd: "uptime", expl: "系统运行时间和负载", tags: ["linux", "system"] },
  { cmd: "uname -a", expl: "系统内核/架构信息", tags: ["linux", "system"] },
  { cmd: "who", expl: "当前登录用户列表", tags: ["linux"] },
  { cmd: "w", expl: "用户活动详情", tags: ["linux"] },
  { cmd: "history", expl: "命令历史记录", tags: ["linux"] },
  { cmd: "which", expl: "查找命令的完整路径", tags: ["linux"] },
  { cmd: "env", expl: "显示所有环境变量", tags: ["linux"] },
  { cmd: "export VAR=value", expl: "设置环境变量", tags: ["linux"] },
  { cmd: "echo $VAR", expl: "输出环境变量值", tags: ["linux"] },
  { cmd: "alias", expl: "查看/设置命令别名", tags: ["linux"] },

  // ── Network / Transfer ────────────────────────────────────────
  { cmd: "ssh user@host", expl: "SSH远程登录", tags: ["linux", "network"] },
  { cmd: "scp file user@host:/path/", expl: "安全复制文件到远程", tags: ["linux", "network"] },
  { cmd: "scp -r dir user@host:/path/", expl: "递归复制目录到远程", tags: ["linux", "network"] },
  { cmd: "rsync -avzP source/ dest/", expl: "断点续传同步(显示进度)", tags: ["linux", "network"] },
  { cmd: "rsync -avzP --delete source/ dest/", expl: "镜像同步(删除目标多余文件)", tags: ["linux", "network"] },
  { cmd: "wget -c url", expl: "断点续传下载", tags: ["linux", "network"] },
  { cmd: "curl -O url", expl: "下载文件(保留文件名)", tags: ["linux", "network"] },
  { cmd: "curl -s -o /dev/null -w '%{http_code}' url", expl: "检查HTTP状态码", tags: ["linux", "network"] },
  { cmd: "ping -c 4", expl: "发送4个ICMP包测试连通性", tags: ["linux", "network"] },
  { cmd: "netstat -tlnp", expl: "查看监听端口", tags: ["linux", "network"] },

  // ── Archive / Compression ─────────────────────────────────────
  { cmd: "tar -czf archive.tar.gz dir/", expl: "打包并gzip压缩目录", tags: ["linux"] },
  { cmd: "tar -xzf archive.tar.gz", expl: "解压tar.gz文件", tags: ["linux"] },
  { cmd: "tar -cjf archive.tar.bz2 dir/", expl: "打包并bzip2压缩", tags: ["linux"] },
  { cmd: "tar -xvf archive.tar", expl: "解压tar文件(显示文件列表)", tags: ["linux"] },
  { cmd: "gzip file", expl: "压缩文件(生成.gz)", tags: ["linux"] },
  { cmd: "gunzip file.gz", expl: "解压.gz文件", tags: ["linux"] },
  { cmd: "zip -r archive.zip dir/", expl: "递归压缩为zip", tags: ["linux"] },
  { cmd: "unzip archive.zip", expl: "解压zip文件", tags: ["linux"] },

  // ── Package / Environment ─────────────────────────────────────
  { cmd: "conda install", expl: "安装conda包", tags: ["linux", "env"] },
  { cmd: "conda create -n env_name python=3.10", expl: "创建conda环境(指定Python版本)", tags: ["linux", "env"] },
  { cmd: "conda activate", expl: "激活conda环境", tags: ["linux", "env"] },
  { cmd: "conda env list", expl: "列出所有conda环境", tags: ["linux", "env"] },
  { cmd: "conda env export > env.yml", expl: "导出conda环境配置", tags: ["linux", "env"] },
  { cmd: "pip install", expl: "pip安装Python包", tags: ["linux", "env"] },
  { cmd: "pip freeze > requirements.txt", expl: "导出pip包列表", tags: ["linux", "env"] },
  { cmd: "pip list", expl: "列出已安装的pip包", tags: ["linux", "env"] },
  { cmd: "module avail", expl: "列出可用软件模块", tags: ["hpc", "env"] },
  { cmd: "module load", expl: "加载软件模块", tags: ["hpc", "env"] },
  { cmd: "module list", expl: "显示已加载模块", tags: ["hpc", "env"] },
  { cmd: "module purge", expl: "清除所有已加载模块", tags: ["hpc", "env"] },
  { cmd: "module spider", expl: "搜索可用模块", tags: ["hpc", "env"] },

  // ── LSF ───────────────────────────────────────────────────────
  { cmd: "bsub -q normal -n 4 -o out.log -e err.log", expl: "提交LSF作业(4核/普通队列)", tags: ["hpc", "lsf"] },
  { cmd: "bsub -q gpu -n 4 -gpu num=1", expl: "提交GPU作业(1张GPU/4核)", tags: ["hpc", "lsf"] },
  { cmd: "bsub -Is bash", expl: "启动交互式作业会话", tags: ["hpc", "lsf"] },
  { cmd: "bsub -J 'myarray[1-100]'", expl: "提交作业数组(100个任务)", tags: ["hpc", "lsf"] },
  { cmd: "bsub -K", expl: "等待作业完成后返回", tags: ["hpc", "lsf"] },
  { cmd: "bjobs", expl: "查看所有作业状态", tags: ["hpc", "lsf"] },
  { cmd: "bjobs -w", expl: "持续刷新作业状态", tags: ["hpc", "lsf"] },
  { cmd: "bjobs -l", expl: "查看作业详细信息", tags: ["hpc", "lsf"] },
  { cmd: "bjobs -u $USER", expl: "查看自己的作业", tags: ["hpc", "lsf"] },
  { cmd: "bjobs -p", expl: "查看排队中作业", tags: ["hpc", "lsf"] },
  { cmd: "bjobs -r", expl: "查看运行中作业", tags: ["hpc", "lsf"] },
  { cmd: "bkill", expl: "终止作业", tags: ["hpc", "lsf"] },
  { cmd: "bkill 0", expl: "终止自己所有作业", tags: ["hpc", "lsf"] },
  { cmd: "bqueues", expl: "查看队列信息", tags: ["hpc", "lsf"] },
  { cmd: "bhosts", expl: "查看计算节点状态", tags: ["hpc", "lsf"] },
  { cmd: "bhist", expl: "查看作业历史", tags: ["hpc", "lsf"] },
  { cmd: "bpeek", expl: "实时查看运行中作业输出", tags: ["hpc", "lsf"] },
  { cmd: "bparams -l", expl: "查看作业资源使用详情", tags: ["hpc", "lsf"] },

  // ── Slurm ─────────────────────────────────────────────────────
  { cmd: "sbatch script.sh", expl: "提交Slurm批处理作业", tags: ["hpc", "slurm"] },
  { cmd: "sbatch --array=1-100 script.sh", expl: "提交作业数组(100个任务)", tags: ["hpc", "slurm"] },
  { cmd: "squeue -u $USER", expl: "查看自己的作业", tags: ["hpc", "slurm"] },
  { cmd: "squeue --start", expl: "显示作业预计开始时间", tags: ["hpc", "slurm"] },
  { cmd: "scancel", expl: "取消作业", tags: ["hpc", "slurm"] },
  { cmd: "sacct", expl: "查看作业历史/完成作业信息", tags: ["hpc", "slurm"] },
  { cmd: "srun --pty bash", expl: "启动交互式会话", tags: ["hpc", "slurm"] },
  { cmd: "sinfo", expl: "查看分区和节点状态", tags: ["hpc", "slurm"] },
  { cmd: "salloc -N 1 -n 4", expl: "分配4核计算资源(交互)", tags: ["hpc", "slurm"] },

  // ── Bioinformatics ────────────────────────────────────────────
  { cmd: "samtools view -bS", expl: "SAM转BAM格式", tags: ["bio"] },
  { cmd: "samtools sort -o sorted.bam", expl: "BAM排序", tags: ["bio"] },
  { cmd: "samtools index", expl: "为BAM建索引(.bai)", tags: ["bio"] },
  { cmd: "samtools flagstat", expl: "BAM比对统计", tags: ["bio"] },
  { cmd: "samtools faidx", expl: "为FASTA建索引(.fai)", tags: ["bio"] },
  { cmd: "bcftools view -v snps", expl: "从VCF提取SNP位点", tags: ["bio"] },
  { cmd: "bcftools filter -e 'QUAL<20'", expl: "按质量值过滤变异", tags: ["bio"] },
  { cmd: "bcftools merge", expl: "合并多个VCF文件", tags: ["bio"] },
  { cmd: "bcftools query -f '%CHROM\\t%POS\\t%REF\\t%ALT\\n'", expl: "提取VCF关键列", tags: ["bio"] },
  { cmd: "bedtools intersect -a a.bed -b b.bed", expl: "取两个BED文件的交集", tags: ["bio"] },
  { cmd: "bedtools merge", expl: "合并重叠的BED区间", tags: ["bio"] },
  { cmd: "bedtools coverage", expl: "计算覆盖度", tags: ["bio"] },
  { cmd: "blastn -query query.fa -db nt -outfmt 6", expl: "BLASTN核酸比对(表格输出)", tags: ["bio"] },
  { cmd: "blastp -query prot.fa -db nr -outfmt 6", expl: "BLASTP蛋白比对", tags: ["bio"] },
  { cmd: "makeblastdb -in ref.fa -dbtype nucl", expl: "创建BLAST核酸数据库", tags: ["bio"] },
  { cmd: "bwa index ref.fa", expl: "BWA建立参考基因组索引", tags: ["bio"] },
  { cmd: "bwa mem -t 8 ref.fa R1.fq R2.fq", expl: "BWA MEM比对双端reads", tags: ["bio"] },
  { cmd: "bowtie2-build ref.fa index", expl: "Bowtie2建立索引", tags: ["bio"] },
  { cmd: "bowtie2 -x idx -1 R1.fq -2 R2.fq", expl: "Bowtie2双端比对", tags: ["bio"] },
  { cmd: "minimap2 -ax map-ont ref.fa reads.fq", expl: "Minimap2 ONT长读长比对", tags: ["bio"] },
  { cmd: "minimap2 -ax sr ref.fa R1.fq R2.fq", expl: "Minimap2短读长比对", tags: ["bio"] },
  { cmd: "STAR --runThreadN 16 --genomeDir idx --readFilesIn R1.fq R2.fq", expl: "STAR RNA-seq比对", tags: ["bio"] },
  { cmd: "fastqc reads.fq", expl: "FastQC测序质量评估", tags: ["bio"] },
  { cmd: "multiqc .", expl: "MultiQC汇总所有QC报告", tags: ["bio"] },
  { cmd: "fastp -i R1.fq -I R2.fq -o clean1.fq -O clean2.fq", expl: "fastp双端数据质控/修剪", tags: ["bio"] },
  { cmd: "trimmomatic PE R1.fq R2.fq", expl: "Trimmomatic双端修剪", tags: ["bio"] },
  { cmd: "seqtk sample -s100 reads.fq 0.1", expl: "随机抽样10%的reads", tags: ["bio"] },
  { cmd: "seqkit stats", expl: "FASTA/Q文件统计信息", tags: ["bio"] },
  { cmd: "picard MarkDuplicates I=sorted.bam O=dedup.bam M=metrics.txt", expl: "Picard标记PCR重复", tags: ["bio"] },
  { cmd: "gatk HaplotypeCaller -R ref.fa -I dedup.bam -O raw.vcf", expl: "GATK变异检测(HaplotypeCaller)", tags: ["bio"] },
  { cmd: "plink --bfile input --pca 10", expl: "PLINK主成分分析(PCA)", tags: ["bio"] },

  // ── Special tools ─────────────────────────────────────────────
  { cmd: "snakemake -s Snakefile -j 8", expl: "Snakemake工作流(8并行任务)", tags: ["bio", "hpc"] },
  { cmd: "nextflow run pipeline.nf", expl: "Nextflow运行流程", tags: ["bio", "hpc"] },
  { cmd: "singularity pull docker://image:tag", expl: "拉取Docker镜像为Singularity", tags: ["hpc"] },
  { cmd: "singularity exec --nv container.sif command", expl: "在容器中执行命令(GPU)", tags: ["hpc"] },
  { cmd: "screen -S name", expl: "创建命名screen会话", tags: ["linux", "process"] },
  { cmd: "screen -r name", expl: "重新连接screen会话", tags: ["linux", "process"] },
  { cmd: "tmux new -s name", expl: "创建命名tmux会话", tags: ["linux", "process"] },
  { cmd: "tmux attach -t name", expl: "重新连接tmux会话", tags: ["linux", "process"] },
];

// ─── Build prefix index ─────────────────────────────────────────

interface IndexEntry {
  cmd: string;
  expl: string;
}

let prefixIndex: Map<string, IndexEntry[]> | null = null;

function buildIndex(): Map<string, IndexEntry[]> {
  if (prefixIndex) return prefixIndex;

  const index = new Map<string, IndexEntry[]>();

  for (const entry of COMMANDS) {
    const cmd = entry.cmd;
    // Index by first char for fast lookup
    const firstChar = cmd[0];
    if (!index.has(firstChar)) {
      index.set(firstChar, []);
    }
    index.get(firstChar)!.push({ cmd: entry.cmd, expl: entry.expl });

    // Also index multi-word commands by their second word
    // e.g. "module load" → index by "module" AND "load"
    const words = cmd.split(/\s+/);
    if (words.length > 1 && words[0].length >= 2) {
      for (let i = 1; i < words.length && i < 3; i++) {
        const w = words[i];
        if (w.length >= 2 && !/^[-(){}[\]|&;<>!]/.test(w)) {
          if (!index.has(w[0])) {
            index.set(w[0], []);
          }
          index.get(w[0])!.push({ cmd: entry.cmd, expl: entry.expl });
        }
      }
    }
  }

  prefixIndex = index;
  return index;
}

// ─── Public API ─────────────────────────────────────────────────

/**
 * Search commands by prefix. Returns up to `limit` results sorted by:
 * 1. Exact prefix match (starts with the query string)
 * 2. Command start-of-word match (sub-command matches after space)
 * 3. Containing the query anywhere
 *
 * Runs synchronously — sub-millisecond for the static registry.
 */
export function searchCommands(query: string, limit: number = 6): LocalSuggestion[] {
  const q = query.trim().toLowerCase();
  if (q.length < 1) return [];

  const index = buildIndex();
  const isMultiWord = q.includes(' ');

  const results: Map<string, ScoredSuggestion> = new Map();
  const firstChar = q[0];
  const candidates: IndexEntry[] = index.get(firstChar) || [];

  for (const entry of candidates) {
    const cmdLower = entry.cmd.toLowerCase();

    if (results.has(entry.cmd)) continue;

    let score = 0;

    if (cmdLower === q) {
      score = 100; // exact match
    } else if (cmdLower.startsWith(q + ' ') && isMultiWord) {
      score = 95; // multi-word prefix match (e.g., "module lo" → "module load")
    } else if (cmdLower.startsWith(q)) {
      score = 90; // command starts with query
    } else if (cmdLower.includes(' ' + q)) {
      score = 70; // sub-command starts with query
    } else if (cmdLower.includes(q)) {
      score = 50; // contains query somewhere
    }

    if (score > 0) {
      if (!results.has(entry.cmd) || results.get(entry.cmd)!.score < score) {
        results.set(entry.cmd, {
          completion: entry.cmd,
          explanation: entry.expl,
          score,
        });
      }
    }
  }

  // Also check other first-char buckets for wider coverage (sub-words etc.)
  for (const [, entries] of index) {
    for (const entry of entries) {
      if (results.has(entry.cmd)) continue;
      const cmdLower = entry.cmd.toLowerCase();

      let score = 0;
      if (cmdLower.includes(' ' + q)) score = 70;
      else if (cmdLower.includes(q) && !cmdLower.startsWith(q)) score = 45;
      else continue;

      results.set(entry.cmd, {
        completion: entry.cmd,
        explanation: entry.expl,
        score,
      });
    }
  }

  return Array.from(results.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ completion, explanation }) => ({ completion, explanation }));
}

/**
 * Reset the index (call when skills data is dynamically updated).
 */
export function resetIndex(): void {
  prefixIndex = null;
}

// ─── Context-Aware Grammar for Instant Completion ─────────────────

interface FlagDef {
  name: string;
  expectsValue: boolean;
  values?: string[];
  desc: string;
}
interface CmdGrammar {
  subcommands?: string[];
  flags?: FlagDef[];
  subFlags?: Record<string, FlagDef[]>;
}

const GRAMMAR: Record<string, CmdGrammar> = {
  bsub: { flags: [
    { name:"-q", expectsValue:true, values:["normal","gpu","long","short","highmem","interactive"], desc:"队列名" },
    { name:"-n", expectsValue:true, desc:"CPU核数" },
    { name:"-o", expectsValue:true, desc:"输出日志" },
    { name:"-e", expectsValue:true, desc:"错误日志" },
    { name:"-M", expectsValue:true, desc:"内存限制(MB)" },
    { name:"-W", expectsValue:true, desc:"运行时限(分)" },
    { name:"-J", expectsValue:true, desc:"作业名称" },
    { name:"-gpu", expectsValue:true, desc:"GPU参数" },
    { name:"-Is", expectsValue:false, desc:"交互式作业" },
    { name:"-K", expectsValue:false, desc:"等待完成" },
    { name:"-R", expectsValue:true, desc:"资源需求" },
    { name:"-P", expectsValue:true, desc:"项目名" },
  ]},
  bjobs: { flags: [
    { name:"-l", expectsValue:false, desc:"详细信息" },
    { name:"-w", expectsValue:false, desc:"持续刷新" },
    { name:"-u", expectsValue:true, desc:"指定用户" },
    { name:"-p", expectsValue:false, desc:"排队作业" },
    { name:"-r", expectsValue:false, desc:"运行作业" },
    { name:"-d", expectsValue:false, desc:"完成作业" },
    { name:"-q", expectsValue:true, desc:"指定队列" },
    { name:"-a", expectsValue:false, desc:"所有作业" },
  ]},
  bkill: { flags: [
    { name:"0", expectsValue:false, desc:"终止所有作业" },
    { name:"-r", expectsValue:false, desc:"强制终止" },
  ]},
  bqueues: { flags: [{ name:"-l", expectsValue:false, desc:"详细" }] },
  bhosts: { flags: [{ name:"-l", expectsValue:false, desc:"详细" }] },
  bpeek: { flags: [{ name:"-f", expectsValue:false, desc:"持续监控" }] },
  sbatch: { flags: [
    { name:"-p", expectsValue:true, desc:"分区名" },
    { name:"-N", expectsValue:true, desc:"节点数" },
    { name:"-n", expectsValue:true, desc:"任务数" },
    { name:"-c", expectsValue:true, desc:"每任务CPU数" },
    { name:"--mem", expectsValue:true, desc:"内存限制" },
    { name:"-t", expectsValue:true, desc:"运行时限" },
    { name:"-o", expectsValue:true, desc:"输出文件" },
    { name:"-e", expectsValue:true, desc:"错误文件" },
    { name:"-J", expectsValue:true, desc:"作业名" },
    { name:"--gres", expectsValue:true, desc:"通用资源(gpu:1)" },
    { name:"--array", expectsValue:true, desc:"作业数组" },
  ]},
  squeue: { flags: [
    { name:"-u", expectsValue:true, desc:"指定用户" },
    { name:"-p", expectsValue:true, desc:"分区" },
    { name:"--start", expectsValue:false, desc:"预计开始时间" },
  ]},
  scancel: { flags: [{ name:"-u", expectsValue:true, desc:"用户" }] },
  sacct: { flags: [
    { name:"-j", expectsValue:true, desc:"作业ID" },
    { name:"-u", expectsValue:true, desc:"用户" },
    { name:"--format", expectsValue:true, desc:"自定义格式" },
  ]},
  srun: { flags: [
    { name:"--pty", expectsValue:true, desc:"伪终端(bash)" },
    { name:"-N", expectsValue:true, desc:"节点数" },
    { name:"-n", expectsValue:true, desc:"任务数" },
  ]},
  module: {
    subcommands: ["load","unload","list","avail","purge","swap","spider","whatis","help","show"],
  },
  samtools: {
    subcommands: ["view","sort","index","flagstat","faidx","merge","mpileup","depth","stats","idxstats","calmd","fixmate","markdup","collate","coverage","dict","fasta","fastq","reheader","rmdup","split","tview"],
    subFlags: {
      view: [
        { name:"-b", expectsValue:false, desc:"输出BAM" },
        { name:"-S", expectsValue:false, desc:"输入SAM" },
        { name:"-h", expectsValue:false, desc:"含header" },
        { name:"-H", expectsValue:false, desc:"仅header" },
        { name:"-c", expectsValue:false, desc:"计数" },
        { name:"-o", expectsValue:true, desc:"输出文件" },
        { name:"-@", expectsValue:true, desc:"线程数" },
        { name:"-q", expectsValue:true, desc:"最低MAPQ" },
        { name:"-f", expectsValue:true, desc:"FLAG包含" },
        { name:"-F", expectsValue:true, desc:"FLAG排除" },
      ],
      sort: [
        { name:"-o", expectsValue:true, desc:"输出文件" },
        { name:"-n", expectsValue:false, desc:"按read名排序" },
        { name:"-@", expectsValue:true, desc:"线程数" },
        { name:"-m", expectsValue:true, desc:"内存" },
      ],
      index: [{ name:"-@", expectsValue:true, desc:"线程数" }],
      flagstat: [], faidx: [],
      merge: [{ name:"-@", expectsValue:true, desc:"线程数" },{ name:"-o", expectsValue:true, desc:"输出文件" }],
      mpileup: [{ name:"-f", expectsValue:true, desc:"参考FASTA" }],
      depth: [{ name:"-a", expectsValue:false, desc:"所有位置" }],
      stats: [], idxstats: [],
    },
  },
  bcftools: {
    subcommands: ["view","filter","merge","query","sort","index","stats","isec","concat","call","norm","plugin","roh"],
    subFlags: {
      view: [{ name:"-v", expectsValue:true, values:["snps","indels"], desc:"变异类型" },{ name:"-o", expectsValue:true, desc:"输出" },{ name:"-Oz", expectsValue:false, desc:"压缩VCF" }],
      filter: [{ name:"-e", expectsValue:true, desc:"排除表达式" },{ name:"-i", expectsValue:true, desc:"包含表达式" },{ name:"-o", expectsValue:true, desc:"输出" }],
      merge: [{ name:"-o", expectsValue:true, desc:"输出" }],
      query: [{ name:"-f", expectsValue:true, desc:"格式字符串" }],
      call: [{ name:"-m", expectsValue:false, desc:"多等位caller" },{ name:"-v", expectsValue:false, desc:"仅变异位点" },{ name:"-o", expectsValue:true, desc:"输出" }],
      sort: [], index: [], stats: [], isec: [], concat: [], norm: [], plugin: [], roh: [],
    },
  },
  bedtools: {
    subcommands: ["intersect","merge","coverage","subtract","closest","flank","genomecov","bamtobed","bedtobam","shuffle","sort","window","multicov","nuc","map"],
    subFlags: {
      intersect: [{ name:"-a", expectsValue:true, desc:"A文件" },{ name:"-b", expectsValue:true, desc:"B文件" },{ name:"-v", expectsValue:false, desc:"反向" },{ name:"-wa", expectsValue:false, desc:"输出原A" },{ name:"-f", expectsValue:true, desc:"最小重叠比例" }],
      merge: [{ name:"-i", expectsValue:true, desc:"输入文件" },{ name:"-d", expectsValue:true, desc:"最大间隔" }],
      coverage: [{ name:"-a", expectsValue:true, desc:"BED" },{ name:"-b", expectsValue:true, desc:"BAM" },{ name:"-hist", expectsValue:false, desc:"直方图" }],
      genomecov: [{ name:"-ibam", expectsValue:true, desc:"输入BAM" },{ name:"-bg", expectsValue:false, desc:"BedGraph" }],
      subtract: [], closest: [], flank: [], bamtobed: [], bedtobam: [], shuffle: [], sort: [], window: [], multicov: [], nuc: [], map: [],
    },
  },
  blastn: { flags: [
    { name:"-query", expectsValue:true, desc:"查询FASTA" },
    { name:"-db", expectsValue:true, desc:"数据库名" },
    { name:"-out", expectsValue:true, desc:"输出文件" },
    { name:"-outfmt", expectsValue:true, values:["6","7"], desc:"输出格式" },
    { name:"-num_threads", expectsValue:true, desc:"线程数" },
    { name:"-evalue", expectsValue:true, desc:"E-value阈值" },
    { name:"-max_target_seqs", expectsValue:true, desc:"最多匹配数" },
    { name:"-perc_identity", expectsValue:true, desc:"最小相似度%" },
  ]},
  blastp: { flags: [
    { name:"-query", expectsValue:true, desc:"查询蛋白FASTA" },
    { name:"-db", expectsValue:true, desc:"蛋白数据库" },
    { name:"-out", expectsValue:true, desc:"输出文件" },
    { name:"-outfmt", expectsValue:true, values:["6","7"], desc:"输出格式" },
    { name:"-num_threads", expectsValue:true, desc:"线程数" },
    { name:"-evalue", expectsValue:true, desc:"E-value阈值" },
  ]},
  makeblastdb: { flags: [
    { name:"-in", expectsValue:true, desc:"输入FASTA" },
    { name:"-dbtype", expectsValue:true, values:["nucl","prot"], desc:"数据库类型" },
    { name:"-out", expectsValue:true, desc:"数据库名" },
  ]},
  bwa: {
    subcommands: ["index","mem","aln","samse","sampe"],
    subFlags: {
      index: [{ name:"-p", expectsValue:true, desc:"输出前缀" }],
      mem: [{ name:"-t", expectsValue:true, desc:"线程数" },{ name:"-M", expectsValue:false, desc:"Picard兼容" },{ name:"-R", expectsValue:true, desc:"Read Group" }],
      aln: [], samse: [], sampe: [],
    },
  },
  bowtie2: {
    subcommands: ["build","align"],
    subFlags: {
      build: [{ name:"--threads", expectsValue:true, desc:"线程数" }],
      align: [{ name:"-x", expectsValue:true, desc:"索引前缀" },{ name:"-1", expectsValue:true, desc:"R1 FASTQ" },{ name:"-2", expectsValue:true, desc:"R2 FASTQ" },{ name:"-S", expectsValue:true, desc:"SAM输出" },{ name:"-p", expectsValue:true, desc:"线程数" },{ name:"--very-sensitive", expectsValue:false, desc:"高灵敏度" }],
    },
  },
  minimap2: { flags: [
    { name:"-ax", expectsValue:true, values:["map-ont","map-pb","sr","map-hifi","splice"], desc:"预设" },
    { name:"-t", expectsValue:true, desc:"线程数" },
    { name:"-o", expectsValue:true, desc:"输出SAM" },
  ]},
  STAR: { flags: [
    { name:"--runThreadN", expectsValue:true, desc:"线程数" },
    { name:"--genomeDir", expectsValue:true, desc:"基因组索引目录" },
    { name:"--readFilesIn", expectsValue:true, desc:"输入FASTQ" },
    { name:"--readFilesCommand", expectsValue:true, values:["zcat","gunzip -c"], desc:"解压命令" },
    { name:"--outSAMtype", expectsValue:true, values:["BAM SortedByCoordinate","BAM Unsorted"], desc:"输出类型" },
    { name:"--outFileNamePrefix", expectsValue:true, desc:"输出前缀" },
    { name:"--quantMode", expectsValue:true, desc:"定量模式" },
    { name:"--sjdbGTFfile", expectsValue:true, desc:"GTF注释" },
  ]},
  fastqc: { flags: [
    { name:"-t", expectsValue:true, desc:"线程数" },
    { name:"-o", expectsValue:true, desc:"输出目录" },
  ]},
  fastp: { flags: [
    { name:"-i", expectsValue:true, desc:"R1输入" },
    { name:"-I", expectsValue:true, desc:"R2输入" },
    { name:"-o", expectsValue:true, desc:"R1输出" },
    { name:"-O", expectsValue:true, desc:"R2输出" },
    { name:"-w", expectsValue:true, desc:"线程数" },
    { name:"-q", expectsValue:true, desc:"质量阈值" },
    { name:"-l", expectsValue:true, desc:"最小长度" },
  ]},
  gatk: {
    subcommands: ["HaplotypeCaller","BaseRecalibrator","ApplyBQSR","Mutect2","SelectVariants","VariantFiltration","CombineGVCFs","GenotypeGVCFs","MarkDuplicates","SplitNCigarReads"],
  },
  picard: {
    subcommands: ["MarkDuplicates","AddOrReplaceReadGroups","SortSam","CollectInsertSizeMetrics","CollectAlignmentSummaryMetrics","CreateSequenceDictionary","SamToFastq","BuildBamIndex","FixMateInformation","MergeSamFiles"],
  },
  seqtk: { subcommands: ["sample","seq","fqchk","trimfq","subseq","comp","mergepe"] },
  seqkit: { subcommands: ["stats","seq","grep","sort","rmdup","split","subseq","locate","faidx","head"] },
  grep: { flags: [
    { name:"-r", expectsValue:false, desc:"递归搜索" },
    { name:"-i", expectsValue:false, desc:"忽略大小写" },
    { name:"-v", expectsValue:false, desc:"反向匹配" },
    { name:"-c", expectsValue:false, desc:"计数" },
    { name:"-l", expectsValue:false, desc:"仅文件名" },
    { name:"-n", expectsValue:false, desc:"行号" },
    { name:"-w", expectsValue:false, desc:"整词匹配" },
    { name:"-E", expectsValue:false, desc:"扩展正则" },
    { name:"-A", expectsValue:true, desc:"后N行" },
    { name:"-B", expectsValue:true, desc:"前N行" },
    { name:"-o", expectsValue:false, desc:"仅匹配部分" },
  ]},
  find: { flags: [
    { name:".", expectsValue:false, desc:"当前目录" },
    { name:"-name", expectsValue:true, desc:"文件名模式" },
    { name:"-type", expectsValue:true, values:["f","d","l"], desc:"类型(f/d/l)" },
    { name:"-mtime", expectsValue:true, desc:"修改时间" },
    { name:"-size", expectsValue:true, desc:"文件大小" },
    { name:"-exec", expectsValue:true, desc:"执行命令" },
    { name:"-delete", expectsValue:false, desc:"删除匹配文件" },
    { name:"-maxdepth", expectsValue:true, desc:"最大深度" },
  ]},
  sed: { flags: [
    { name:"-i", expectsValue:false, desc:"就地修改" },
    { name:"-n", expectsValue:false, desc:"静默模式" },
    { name:"-e", expectsValue:true, desc:"多表达式" },
  ]},
  awk: { flags: [
    { name:"-F", expectsValue:true, desc:"字段分隔符" },
    { name:"-v", expectsValue:true, desc:"变量" },
  ]},
  ls: { flags: [
    { name:"-la", expectsValue:false, desc:"详细+隐藏" },
    { name:"-lh", expectsValue:false, desc:"人类可读" },
    { name:"-ltr", expectsValue:false, desc:"按时间排序" },
  ]},
  tar: { flags: [
    { name:"-czf", expectsValue:true, desc:"创建tar.gz" },
    { name:"-xzf", expectsValue:true, desc:"解压tar.gz" },
    { name:"-cjf", expectsValue:true, desc:"创建tar.bz2" },
    { name:"-xvf", expectsValue:true, desc:"解压(详细)" },
  ]},
  rsync: { flags: [
    { name:"-avzP", expectsValue:false, desc:"归档+压缩+进度+续传" },
    { name:"--delete", expectsValue:false, desc:"删除多余文件" },
  ]},
  conda: {
    subcommands: ["install","create","activate","deactivate","remove","list","search","update","env","clean"],
  },
  pip: {
    subcommands: ["install","uninstall","list","freeze","show","search","download"],
  },
  git: {
    subcommands: ["clone","pull","push","commit","add","status","log","diff","branch","checkout","merge","stash","rebase","reset","remote","fetch","tag"],
  },
  docker: {
    subcommands: ["run","build","pull","push","ps","images","exec","logs","stop","rm","rmi","compose"],
  },
  singularity: {
    subcommands: ["pull","build","exec","run","shell","instance"],
  },
  snakemake: { flags: [
    { name:"-s", expectsValue:true, desc:"Snakefile" },
    { name:"-j", expectsValue:true, desc:"并行任务数" },
    { name:"-n", expectsValue:false, desc:"仅预览" },
    { name:"-p", expectsValue:false, desc:"打印shell命令" },
    { name:"--cluster", expectsValue:true, desc:"计算资源提交命令" },
    { name:"--use-conda", expectsValue:false, desc:"使用conda" },
    { name:"--use-singularity", expectsValue:false, desc:"使用容器" },
  ]},
  nextflow: { flags: [
    { name:"run", expectsValue:true, desc:"运行pipeline" },
    { name:"-profile", expectsValue:true, desc:"配置文件" },
    { name:"-resume", expectsValue:false, desc:"断点续跑" },
  ]},
  ssh: { flags: [
    { name:"-i", expectsValue:true, desc:"私钥文件" },
    { name:"-p", expectsValue:true, desc:"端口" },
    { name:"-X", expectsValue:false, desc:"X11转发" },
    { name:"-L", expectsValue:true, desc:"本地端口转发" },
  ]},
  scp: { flags: [
    { name:"-r", expectsValue:false, desc:"递归复制" },
    { name:"-P", expectsValue:true, desc:"端口" },
  ]},
  wget: { flags: [
    { name:"-c", expectsValue:false, desc:"断点续传" },
    { name:"-O", expectsValue:true, desc:"输出文件名" },
  ]},
  curl: { flags: [
    { name:"-O", expectsValue:false, desc:"远程文件名保存" },
    { name:"-o", expectsValue:true, desc:"输出文件" },
    { name:"-L", expectsValue:false, desc:"跟随重定向" },
    { name:"-H", expectsValue:true, desc:"自定义Header" },
    { name:"-X", expectsValue:true, desc:"HTTP方法" },
  ]},
  trimmomatic: { flags: [
    { name:"PE", expectsValue:false, desc:"双端模式" },
    { name:"SE", expectsValue:false, desc:"单端模式" },
    { name:"-phred33", expectsValue:false, desc:"Phred+33" },
    { name:"ILLUMINACLIP:", expectsValue:true, desc:"去接头" },
    { name:"LEADING:", expectsValue:true, desc:"开头剪切" },
    { name:"TRAILING:", expectsValue:true, desc:"末尾剪切" },
    { name:"SLIDINGWINDOW:", expectsValue:true, desc:"滑窗剪切" },
    { name:"MINLEN:", expectsValue:true, desc:"最小长度" },
  ]},
  cutadapt: { flags: [
    { name:"-a", expectsValue:true, desc:"3'接头序列" },
    { name:"-g", expectsValue:true, desc:"5'接头序列" },
    { name:"-o", expectsValue:true, desc:"输出文件" },
    { name:"-q", expectsValue:true, desc:"质量阈值" },
    { name:"-m", expectsValue:true, desc:"最小长度" },
    { name:"-j", expectsValue:true, desc:"线程数" },
  ]},
  plink: { flags: [
    { name:"--bfile", expectsValue:true, desc:"二进制PLINK前缀" },
    { name:"--pca", expectsValue:true, desc:"PCA(PC数)" },
    { name:"--assoc", expectsValue:false, desc:"关联分析" },
    { name:"--make-bed", expectsValue:false, desc:"输出二进制" },
    { name:"--out", expectsValue:true, desc:"输出前缀" },
    { name:"--maf", expectsValue:true, desc:"最小等位频率" },
    { name:"--hwe", expectsValue:true, desc:"哈代温伯格" },
    { name:"--geno", expectsValue:true, desc:"缺失率阈值" },
    { name:"--chr", expectsValue:true, desc:"指定染色体" },
    { name:"--extract", expectsValue:true, desc:"提取SNP列表" },
    { name:"--exclude", expectsValue:true, desc:"排除SNP列表" },
    { name:"--keep", expectsValue:true, desc:"保留样本" },
    { name:"--remove", expectsValue:true, desc:"删除样本" },
  ]},
};

type ContextStage = "command" | "subcommand" | "flag" | "value" | "unknown";

function parseLocalContext(input: string): {
  stage: ContextStage; cmd?: string; subcmd?: string; flag?: string;
  partial: string; tokens: string[];
} {
  const trimmed = input.trim();
  const endsWithSpace = /[\s]$/.test(input);
  const rawTokens = trimmed.length > 0 ? trimmed.split(/\s+/) : [];
  if (rawTokens.length === 0) return { stage: "command", partial: "", tokens: [] };

  const partial = endsWithSpace ? "" : rawTokens[rawTokens.length - 1];
  const settled = endsWithSpace ? rawTokens : rawTokens.slice(0, -1);

  let cmdIdx = settled.findIndex(t => !t.startsWith("-") && !t.includes("/") && t.length > 1);
  if (cmdIdx < 0 && !endsWithSpace && rawTokens.length === 1 && !rawTokens[0].startsWith("-")) {
    return { stage: "command", partial: rawTokens[0], tokens: rawTokens };
  }

  const cmd = cmdIdx >= 0 ? settled[cmdIdx] : undefined;
  const grammar = cmd ? GRAMMAR[cmd] : undefined;
  if (!grammar) return { stage: "unknown", cmd, partial, tokens: rawTokens };

  const afterCmd = settled.slice(cmdIdx + 1);

  let subcmd: string | undefined;
  let subIdx = -1;
  if (grammar.subcommands) {
    for (let i = 0; i < afterCmd.length; i++) {
      if (grammar.subcommands.includes(afterCmd[i])) { subcmd = afterCmd[i]; subIdx = i; break; }
    }
    if (!subcmd && partial && !partial.startsWith("-") && afterCmd.length === 0) {
      return { stage: "subcommand", cmd, partial, tokens: rawTokens };
    }
  }

  const postSub = subIdx >= 0 ? afterCmd.slice(subIdx + 1) : afterCmd;
  const flags: FlagDef[] = (subcmd && grammar.subFlags?.[subcmd]) ? (grammar.subFlags[subcmd] || []) : (grammar.flags || []);

  if (partial) {
    if (partial.startsWith("-")) return { stage: "flag", cmd, subcmd, partial, tokens: rawTokens };
    const lastS = settled[settled.length - 1] || "";
    const lastFlag = flags.find(f => f.name === lastS);
    if (lastFlag?.expectsValue) return { stage: "value", cmd, subcmd, flag: lastS, partial, tokens: rawTokens };
    if (subcmd && postSub.length === 0) return { stage: "flag", cmd, subcmd, partial, tokens: rawTokens };
    return { stage: "unknown", cmd, subcmd, partial, tokens: rawTokens };
  }

  const lastS = settled[settled.length - 1] || "";
  const prevF = flags.find(f => f.name === lastS);
  if (prevF?.expectsValue) return { stage: "value", cmd, subcmd, flag: lastS, partial: "", tokens: rawTokens };
  if (subcmd) return { stage: "flag", cmd, subcmd, partial: "", tokens: rawTokens };
  if (grammar.subcommands && afterCmd.length === 0) return { stage: "subcommand", cmd, partial: "", tokens: rawTokens };
  return { stage: "flag", cmd, partial: "", tokens: rawTokens };
}

/**
 * Context-aware next-token suggestion. Given a partial command line,
 * returns suggestions for what should come next (subcommand, flag, value).
 * Runs synchronously — sub-millisecond.
 */
export function suggestByContext(input: string, limit: number = 6): LocalSuggestion[] {
  const ctx = parseLocalContext(input);
  const cmd = ctx.cmd;
  if (!cmd) return [];
  const grammar = GRAMMAR[cmd];
  if (!grammar) return [];

  const results: LocalSuggestion[] = [];

  if (ctx.stage === "subcommand") {
    const subs = grammar.subcommands || [];
    const hits = ctx.partial ? subs.filter(s => s.startsWith(ctx.partial)) : subs;
    for (const s of hits.slice(0, limit)) results.push({ completion: s, explanation: `${cmd} ${s} 子命令` });
  } else if (ctx.stage === "flag") {
    let flags: FlagDef[] = (ctx.subcmd && grammar.subFlags?.[ctx.subcmd]) ? (grammar.subFlags[ctx.subcmd] || []) : (grammar.flags || []);
    if (!ctx.subcmd && grammar.subcommands) {
      const subHits = ctx.partial ? grammar.subcommands.filter(s => s.startsWith(ctx.partial)) : [];
      for (const s of subHits.slice(0, 3)) results.push({ completion: s, explanation: `${cmd} 子命令` });
    }
    const hits = ctx.partial ? flags.filter(f => f.name.startsWith(ctx.partial)) : flags;
    for (const f of hits.slice(0, limit)) results.push({ completion: f.name, explanation: f.desc });
  } else if (ctx.stage === "value" && ctx.flag) {
    const flags = (ctx.subcmd && grammar.subFlags?.[ctx.subcmd]) ? (grammar.subFlags[ctx.subcmd] || []) : (grammar.flags || []);
    const flagDef = flags.find(f => f.name === ctx.flag);
    if (flagDef?.values) {
      const hits = ctx.partial ? flagDef.values.filter(v => v.startsWith(ctx.partial)) : flagDef.values;
      for (const v of hits.slice(0, limit)) results.push({ completion: v, explanation: flagDef.desc });
    }
  }

  return results;
}

// ─── Completeness Check ───────────────────────────────────────────

/**
 * Returns true when the command line is complete — no valid next token
 * can be predicted by the grammar. When complete, Tab passes through to
 * the terminal for native shell completion.
 */
export function isCommandComplete(input: string): boolean {
  const ctx = parseLocalContext(input);
  // No grammar for this command → let shell handle Tab
  if (!ctx.cmd || !GRAMMAR[ctx.cmd]) return true;
  // Still typing subcommand name
  if (ctx.stage === 'subcommand') return false;
  // Flag with active partial (user is typing a flag)
  if (ctx.stage === 'flag' && ctx.partial) return false;
  // Expecting a value for a flag
  if (ctx.stage === 'value') return false;
  // Basic command name being typed
  if (ctx.stage === 'command') return false;
  // flag with no partial (trailing space), unknown → complete
  return true;
}
