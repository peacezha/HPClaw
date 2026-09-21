# ENCODE 生物信息分析与质控流程 · 流程与代码全文（v0.4.12 实装版）

本文档由程序直接从 HPClaw 流程库定义导出，内容与软件内实际运行的 12 条 ENCODE 金标准流程**逐字一致**（含环境检查步骤、植物适配与 HPClaw 对 ENCODE 的质控扩展：SPOT/RPKM 轨迹/峰快照）。
设计说明与阈值解读见 `docs/ENCODE生物信息分析与质控流程.md`；本文档只看"流程长什么样、代码是什么"。

约定：`{{参数}}` 是运行面板上用户填/AI 确认的全局参数；每个流程第 1 步固定为环境检查（只读，必需软件缺失即以非 0 退出阻断后续）；耗时步骤用 `bsub < 脚本` 提交。ATAC/DNase 的 `{{ORGANELLE_REGEX}}` 控制细胞器（线粒体+叶绿体）reads 去除，植物样本务必确认其覆盖叶绿体命名。

---

## ENCODE TF ChIP-seq 分析与质控流程

- 流程 id：`encode-chipseq-tf`
- 用途：ENCODE 转录因子 ChIP-seq 统一流程：BWA MEM 比对 → 过滤去重（MAPQ≥30、fixmate、MarkDuplicates）→ 黑名单去除 → MACS2 窄峰 → 重复间 IDR 一致性评估。
- 运行参数：`INPUT_DIR`、`CONTROL_DIR`〔可选〕、`BWA_INDEX`〔可选〕、`REF_FA`〔可选〕、`BLACKLIST`〔可选〕、`GENOME_SIZE`（默认 hs）〔可选〕、`QUEUE`（默认 q2680v2）、`THREADS`（默认 8）
- 软件清单（版本钉死）：FastQC=`FastQC/0.11.9`、BWA=`BWA/0.7.17`、SAMtools=`SAMtools/1.17`、Picard=`Picard/2.27.4`、MACS2=`MACS2/2.2.7.1`、BEDTools=`BEDTools/2.30.0`、deepTools=`deepTools/3.5.1`、hotspot2〔命令探测〕〔可选〕、phantompeakqualtools（run_spp.R）〔命令探测〕、IDR〔命令探测〕〔可选〕
- 参考数据：BWA 索引（index，可留空）、参考基因组 FASTA（genome，可留空）、ENCODE 黑名单区域 BED（other，可留空）
- QC 关卡：
  - 第 2 步后 · FastQC 碱基质量与接头含量：达标 Q30 >80%，接头含量 <5%；警告 Q30 70-80% 或接头 5-15%
  - 第 4 步后 · 比对率与去重后保留率：达标 比对率 >80%，去重后保留 >50%；警告 比对率 60-80% 或重复率 >70%
  - 第 5 步后 · 链相关与库复杂度：达标 NSC≥1.05、RSC≥0.8、NRF≥0.8；警告 NSC 1.0-1.05、RSC 0.5-0.8 或 NRF 0.6-0.8
  - 第 8 步后 · FRiP 与重复间 IDR：达标 FRiP≥1%，Np/Nt<2；警告 FRiP 0.5-1%

### 步骤与脚本全文

#### 步骤 1/9：环境检查（软件、输入与参考）

> 只读检查：必需软件缺失或输入目录不存在时以非 0 退出；先补齐环境（流程面板支持一键部署）再继续。可选参考留空时由 AI 在后续步骤协助补齐。

```bash
# 环境检查（只读）：确认软件可加载、输入与参考数据就绪。
# 必需项缺失时本步骤以非 0 退出；请先补齐环境（流程面板支持一键部署）再继续。
#BSUB -J chipseq_tf_env -n 1 -q {{QUEUE}}
if ! type module >/dev/null 2>&1; then
  for f in /etc/profile.d/modules.sh /etc/profile.d/lmod.sh /usr/share/Modules/init/bash /usr/share/lmod/lmod/init/bash; do
    [ -r "$f" ] && . "$f" >/dev/null 2>&1 && type module >/dev/null 2>&1 && break || true
  done
fi
FAIL=0
check_mod() {
  if module load "$2" >/dev/null 2>&1; then echo "OK   $1 ($2)"; else
    echo "MISS $1 ($2) —— 集群可用版本："; module -t avail "${2%%/*}" 2>&1 | grep -i "${2%%/*}" | head -5 || true
    if [ "$3" = "required" ]; then FAIL=1; fi
  fi
}
check_cmd() {
  if ( eval "$2" ) >/dev/null 2>&1; then echo "OK   $1"; else echo "MISS $1（检查命令：$2）"; if [ "$3" = "required" ]; then FAIL=1; fi; fi
}
check_mod "FastQC" "FastQC/0.11.9" required
check_mod "BWA" "BWA/0.7.17" required
check_mod "SAMtools" "SAMtools/1.17" required
check_mod "Picard" "Picard/2.27.4" required
check_mod "MACS2" "MACS2/2.2.7.1" required
check_mod "BEDTools" "BEDTools/2.30.0" required
check_mod "deepTools" "deepTools/3.5.1" required
check_cmd "hotspot2" "command -v hotspot2" optional
check_cmd "phantompeakqualtools（run_spp.R）" "command -v run_spp.R" required
check_cmd "IDR" "command -v idr" optional
echo "--- 输入目录 ---"
case "{{INPUT_DIR}}" in ''|*'{{'*) echo "MISS 未指定输入目录"; FAIL=1 ;;
  *) if [ -d "{{INPUT_DIR}}" ]; then echo "OK   INPUT_DIR={{INPUT_DIR}}"; ls "{{INPUT_DIR}}" | head -5 || true; else echo "MISS 目录 {{INPUT_DIR}}"; FAIL=1; fi ;;
esac
case "{{CONTROL_DIR}}" in ''|*'{{'*) echo "SKIP CONTROL_DIR（未指定，可选）" ;;
  *) if [ -d "{{CONTROL_DIR}}" ]; then echo "OK   CONTROL_DIR={{CONTROL_DIR}}"; ls "{{CONTROL_DIR}}" | head -5 || true; else echo "MISS 目录 {{CONTROL_DIR}}"; FAIL=1; fi ;;
esac
echo "--- 参考数据 ---"
chk_ref() {
  case "$1" in ''|*'{{'*) echo "SKIP $2（未指定，运行时由 AI 协助补齐）"; return 0 ;; esac
  if [ -e "$1" ] || [ -e "$1.1.bt2" ] || [ -e "$1.sa" ] || [ -e "$1.grp" ]; then echo "OK   $2"; else echo "MISS $2: $1（含常见索引后缀均未找到）"; if [ "$4" = "required" ]; then FAIL=1; fi; fi
}
chk_ref "{{BWA_INDEX}}" "BWA 索引" '' optional
chk_ref "{{REF_FA}}" "参考基因组 FASTA" '' optional
chk_ref "{{BLACKLIST}}" "ENCODE 黑名单区域 BED" '' optional
echo "--- 已加载模块 ---"
module -t list 2>&1 | tail -30 || true
exit $FAIL
```

#### 步骤 2/9：FastQC 原始数据质控

> 写成 chipseq_qc.lsf 后 bsub 提交；先看报告再决定后续

```bash
#BSUB -J chipseq_qc -n 1 -q {{QUEUE}}
module load FastQC/0.11.9
cd {{INPUT_DIR}} && mkdir -p fastqc_results
fastqc *.fq.gz -o ./fastqc_results -t {{THREADS}}
```

#### 步骤 3/9：BWA MEM 比对与排序

> 写成 chipseq_align.lsf 后 bsub 提交；单端数据只传 R1 一个文件

```bash
#BSUB -J chipseq_align -n {{THREADS}} -q {{QUEUE}}
module load BWA/0.7.17 SAMtools/1.17
cd {{INPUT_DIR}}
for i in *_R1.fq.gz; do
  s=${i%_R1.fq.gz}
  bwa mem -t {{THREADS}} {{BWA_INDEX}} "$i" "${s}_R2.fq.gz" | samtools sort -@ {{THREADS}} -o "${s}.sorted.bam" -
done
```

#### 步骤 4/9：比对过滤与 PCR 去重

> MAPQ≥30、保留正确配对、去未比对/次要比对/QC 失败 reads；fixmate + MarkDuplicates 去 PCR 重复，dup_metrics 纳入库复杂度评估

```bash
#BSUB -J chipseq_filter -n {{THREADS}} -q {{QUEUE}}
module load SAMtools/1.17 Picard/2.27.4
cd {{INPUT_DIR}} && mkdir -p qc
for b in *.sorted.bam; do
  s=${b%.sorted.bam}
  samtools view -@ {{THREADS}} -b -q 30 -f 2 -F 1804 "$b" > "${s}.filt.bam"
  samtools sort -@ {{THREADS}} -n "${s}.filt.bam" -o "${s}.filt.nsrt.bam"
  samtools fixmate -@ {{THREADS}} -m "${s}.filt.nsrt.bam" "${s}.fixmate.bam"
  samtools sort -@ {{THREADS}} "${s}.fixmate.bam" -o "${s}.fixmate.sorted.bam"
  java -jar $EBROOTPICARD/picard.jar MarkDuplicates I="${s}.fixmate.sorted.bam" O="${s}.dedup.bam" M=qc/"${s}".dup_metrics.txt REMOVE_DUPLICATES=true
  samtools index "${s}.dedup.bam"
done
```

#### 步骤 5/9：QC：链相关与库复杂度评估

> 达标：NSC≥1.05、RSC≥0.8、NRF≥0.8；警告：NSC 1.0-1.05、RSC 0.5-0.8、NRF 0.6-0.8；PBC≥0.8 可用 preseq 补充评估

```bash
#BSUB -J chipseq_libqc -n 1 -q {{QUEUE}}
module load SAMtools/1.17
cd {{INPUT_DIR}} && mkdir -p qc
for b in *.dedup.bam; do
  s=${b%.dedup.bam}
  run_spp.R -c="$b" -savp -p {{THREADS}} -out=qc/"${s}".cc.qc
done
python3 - <<'PY'
import glob, json, os
qc = {}
for cc in glob.glob("qc/*.cc.qc"):
    s = os.path.basename(cc).replace(".cc.qc", "")
    with open(cc) as fh:
        header = fh.readline().rstrip("\n").split("\t")
        row = fh.readline().rstrip("\n").split("\t")
    rec = dict(zip(header, row))
    nrf = None
    dup = os.path.join("qc", s + ".dup_metrics.txt")
    if os.path.exists(dup):
        with open(dup) as fh:
            for line in fh:
                if line.startswith("#") or line.startswith("LIBRARY") or not line.strip():
                    continue
                cols = line.rstrip("\n").split("\t")
                examined = int(cols[1]) + 2 * int(cols[2])
                duplicates = int(cols[5]) + 2 * int(cols[6])
                nrf = round(1 - duplicates / examined, 4) if examined else None
                break
    qc[s] = {"NSC": rec.get("NSC"), "RSC": rec.get("RSC"), "NRF": nrf}
with open("qc/qc.json", "w") as out:
    json.dump(qc, out, indent=2, ensure_ascii=False)
PY
```

#### 步骤 6/9：MACS2 窄峰调用与黑名单过滤

> 写成 chipseq_peak.lsf 后 bsub 提交；q=0.05 为候选峰，最终集以 IDR 筛选为准；CONTROL_DIR 有去重 BAM 时自动启用对照

```bash
#BSUB -J chipseq_peak -n {{THREADS}} -q {{QUEUE}}
module load MACS2/2.2.7.1 BEDTools/2.30.0
cd {{INPUT_DIR}} && mkdir -p peaks
CTRL=$(ls {{CONTROL_DIR}}/*.dedup.bam 2>/dev/null | head -1 || true)
for b in *.dedup.bam; do
  s=${b%.dedup.bam}
  macs2 callpeak -t "$b" ${CTRL:+-c "$CTRL"} -n "${s}" -g {{GENOME_SIZE}} -q 0.05 --outdir peaks
  bedtools intersect -a peaks/"${s}"_peaks.narrowPeak -b {{BLACKLIST}} -v > peaks/"${s}".peaks.final.bed
done
```

#### 步骤 7/9：QC：信号轨迹（RPKM bigWig）、SPOT 与峰快照

> HPClaw 对 ENCODE 基线的扩展：RPKM 标准化 bigWig（qc/tracks/*.rpkm.bw）可直接拖进 IGV/基因组浏览器；SPOT 需 hotspot2（缺失自动 SKIP）；随机抽 5 个峰画 IGV 风格覆盖图到 qc/igv/（需 matplotlib，缺失自动 SKIP；固定随机种子 42 可复现）

```bash
#BSUB -J chipseq_track_qc -n {{THREADS}} -q {{QUEUE}}
module load deepTools/3.5.1 SAMtools/1.17 BEDTools/2.30.0
cd {{INPUT_DIR}} && mkdir -p qc/tracks qc/igv
for b in *.dedup.bam; do
  s=${b%.dedup.bam}
  bamCoverage -b "$b" -o qc/tracks/"${s}".rpkm.bw -p {{THREADS}} --normalizeUsing RPKM
done
for b in *.dedup.bam; do
  s=${b%.dedup.bam}
  if command -v hotspot2 >/dev/null 2>&1; then
    mkdir -p hotspots
    samtools view -H "$b" | awk -F'\t' '/^@SQ/{split($2,a,":");split($3,c,":");print a[2]"\t"c[2]}' > qc/chrom.sizes
    hotspot2 -c qc/chrom.sizes "$b" hotspots/"${s}"
    total=$(samtools view -c "$b")
    inhot=$(bedtools intersect -a "$b" -b hotspots/"${s}".hotspots.fdr0.05.bed -u | samtools view -c - || true)
    echo -e "${s}\t${total}\t${inhot}" >> qc/spot.tsv
  else
    echo "SKIP: hotspot2 不可用，跳过 SPOT（module load 或一键部署 hotspot2 即可启用）"
  fi
done
python3 - <<'PY'
BAM_GLOB = "*.dedup.bam"
BAM_SUFFIX = ".dedup.bam"
PEAK_DIR = "peaks/"
PEAK_SUFFIX = ".peaks.final.bed"
import glob, os, random, subprocess, sys
try:
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
except Exception as exc:
    print("SKIP: 无 matplotlib，跳过峰快照绘图（%s）" % exc)
    sys.exit(0)
os.makedirs("qc/igv", exist_ok=True)
made = 0
for bam in sorted(glob.glob(BAM_GLOB)):
    s = bam[: -len(BAM_SUFFIX)]
    peak_file = PEAK_DIR + s + PEAK_SUFFIX
    if not os.path.exists(peak_file):
        continue
    peaks = []
    with open(peak_file) as fh:
        for line in fh:
            if line.startswith("#"):
                continue
            f = line.rstrip("\n").split("\t")
            if len(f) >= 3:
                try:
                    peaks.append((f[0], int(f[1]), int(f[2])))
                except ValueError:
                    pass
    if not peaks:
        continue
    random.seed(42)
    for chrom, start, end in random.sample(peaks, min(5, len(peaks))):
        a, b = max(0, start - 1500), end + 1500
        out = subprocess.run(["samtools", "depth", "-a", "-r", "%s:%d-%d" % (chrom, a, b), bam], capture_output=True, text=True)
        cov = {}
        for line in out.stdout.splitlines():
            f = line.split("\t")
            if len(f) >= 3:
                cov[int(f[1])] = int(f[2])
        xs = list(range(a, b + 1))
        ys = [cov.get(x, 0) for x in xs]
        fig, ax = plt.subplots(figsize=(8, 2.4))
        ax.fill_between(xs, ys, color="#3b82f6", lw=0)
        ax.axvspan(start, end, color="#f59e0b", alpha=0.25)
        ax.set_title("%s  %s:%d-%d" % (s, chrom, start, end))
        ax.set_xlabel(chrom)
        ax.set_ylabel("depth")
        ax.margins(x=0)
        fig.tight_layout()
        fig.savefig("qc/igv/%s_%s_%d.png" % (s, chrom, start), dpi=120)
        plt.close(fig)
        made += 1
print("IGV 风格峰快照产出 %d 张 → qc/igv/" % made)
PY
```

#### 步骤 8/9：QC：FRiP 与重复间 IDR 一致性

> 达标：FRiP≥1%、IDR Np/Nt<2（global IDR<0.05 计 Nt）；警告：FRiP 0.5-1%；idr 包缺失时先 module av 或问用户安装方式

```bash
#BSUB -J chipseq_idr -n {{THREADS}} -q {{QUEUE}}
module load SAMtools/1.17 BEDTools/2.30.0
cd {{INPUT_DIR}} && mkdir -p idr qc
for b in *.dedup.bam; do
  s=${b%.dedup.bam}
  total=$(samtools view -c "$b")
  inpeak=$(bedtools intersect -a "$b" -b peaks/"${s}".peaks.final.bed -u | samtools view -c -)
  echo -e "${s}\t${total}\t${inpeak}" >> qc/frip.tsv
done
# 重复≥2 时对真重复跑 IDR（合并池峰为 oracle）；单重复改用自我伪重复 IDR
mapfile -t PK < <(ls peaks/*.peaks.final.bed 2>/dev/null || ls *.peaks.final.bed 2>/dev/null)
if [ "${#PK[@]}" -lt 2 ]; then
  echo "SKIP: 需要至少 2 个重复 peaks 才能算 IDR"
else
  POOL=$(ls peaks/*pool*.peaks.final.bed 2>/dev/null | head -1 || true)
  idr --samples "${PK[0]}" "${PK[1]}" ${POOL:+--peak-list "$POOL"} --input-file-type narrowPeak --rank p.value -o idr/idr.txt --plot
fi
python3 - <<'PY'
import json, os
qc = {}
if os.path.exists("qc/frip.tsv"):
    with open("qc/frip.tsv") as fh:
        for line in fh:
            s, total, inpeak = line.rstrip("\n").split("\t")
            qc[s] = {"FRiP": round(int(inpeak) / int(total), 4) if int(total) else None}
n_idr = None
if os.path.exists("idr/idr.txt"):
    n_idr = 0
    with open("idr/idr.txt") as fh:
        for line in fh:
            cols = line.rstrip("\n").split("\t")
            try:
                if float(cols[10]) < 0.05:
                    n_idr += 1
            except (IndexError, ValueError):
                continue
qc["_idr"] = {"peaks_global_idr_lt_0.05": n_idr, "rule": "Np(伪重复)/Nt(真重复) < 2 达标，>= 2 判重复间不一致"}
with open("qc/idr_qc.json", "w") as out:
    json.dump(qc, out, indent=2, ensure_ascii=False)
PY
```

#### 步骤 9/9：生成分析报告

```bash
按 analysis-report 技能模板，基于本流程实际产出生成图文并茂的分析报告（reports/ 下 HTML+MD），回复给出报告与关键图绝对路径
```


---

## ENCODE 组蛋白 ChIP-seq 分析与质控流程

- 流程 id：`encode-chipseq-histone`
- 用途：ENCODE 组蛋白 ChIP-seq 统一流程：BWA MEM 比对 → 过滤去重 → SPP/GEM 宽峰 → 黑名单去除 → 重复间 IDR 一致性评估。
- 运行参数：`INPUT_DIR`、`CONTROL_DIR`〔可选〕、`BWA_INDEX`〔可选〕、`REF_FA`〔可选〕、`BLACKLIST`〔可选〕、`GENOME_SIZE`（默认 hs）〔可选〕、`QUEUE`（默认 q2680v2）、`THREADS`（默认 8）
- 软件清单（版本钉死）：FastQC=`FastQC/0.11.9`、BWA=`BWA/0.7.17`、SAMtools=`SAMtools/1.17`、Picard=`Picard/2.27.4`、BEDTools=`BEDTools/2.30.0`、deepTools=`deepTools/3.5.1`、hotspot2〔命令探测〕〔可选〕、phantompeakqualtools（run_spp.R，含宽峰模式）〔命令探测〕、MACS2（备选宽峰）=`MACS2/2.2.7.1`〔可选〕、GEM（备选宽峰）〔命令探测〕〔可选〕、IDR〔命令探测〕〔可选〕
- 参考数据：BWA 索引（index，可留空）、参考基因组 FASTA（genome，可留空）、ENCODE 黑名单区域 BED（other，可留空）
- QC 关卡：
  - 第 2 步后 · FastQC 碱基质量与接头含量：达标 Q30 >80%，接头含量 <5%；警告 Q30 70-80% 或接头 5-15%
  - 第 4 步后 · 比对率与去重后保留率：达标 比对率 >80%，去重后保留 >50%；警告 比对率 60-80% 或重复率 >70%
  - 第 5 步后 · 链相关与库复杂度：达标 NSC≥1.05、RSC≥0.8、NRF≥0.8；警告 NSC 1.0-1.05、RSC 0.5-0.8 或 NRF 0.6-0.8
  - 第 8 步后 · FRiP 与重复间 IDR：达标 FRiP≥1%，Np/Nt<2；警告 FRiP 0.5-1%

### 步骤与脚本全文

#### 步骤 1/9：环境检查（软件、输入与参考）

> 只读检查：必需软件缺失或输入目录不存在时以非 0 退出；先补齐环境（流程面板支持一键部署）再继续。可选参考留空时由 AI 在后续步骤协助补齐。

```bash
# 环境检查（只读）：确认软件可加载、输入与参考数据就绪。
# 必需项缺失时本步骤以非 0 退出；请先补齐环境（流程面板支持一键部署）再继续。
#BSUB -J chipseq_histone_env -n 1 -q {{QUEUE}}
if ! type module >/dev/null 2>&1; then
  for f in /etc/profile.d/modules.sh /etc/profile.d/lmod.sh /usr/share/Modules/init/bash /usr/share/lmod/lmod/init/bash; do
    [ -r "$f" ] && . "$f" >/dev/null 2>&1 && type module >/dev/null 2>&1 && break || true
  done
fi
FAIL=0
check_mod() {
  if module load "$2" >/dev/null 2>&1; then echo "OK   $1 ($2)"; else
    echo "MISS $1 ($2) —— 集群可用版本："; module -t avail "${2%%/*}" 2>&1 | grep -i "${2%%/*}" | head -5 || true
    if [ "$3" = "required" ]; then FAIL=1; fi
  fi
}
check_cmd() {
  if ( eval "$2" ) >/dev/null 2>&1; then echo "OK   $1"; else echo "MISS $1（检查命令：$2）"; if [ "$3" = "required" ]; then FAIL=1; fi; fi
}
check_mod "FastQC" "FastQC/0.11.9" required
check_mod "BWA" "BWA/0.7.17" required
check_mod "SAMtools" "SAMtools/1.17" required
check_mod "Picard" "Picard/2.27.4" required
check_mod "BEDTools" "BEDTools/2.30.0" required
check_mod "deepTools" "deepTools/3.5.1" required
check_cmd "hotspot2" "command -v hotspot2" optional
check_cmd "phantompeakqualtools（run_spp.R，含宽峰模式）" "command -v run_spp.R" required
check_mod "MACS2（备选宽峰）" "MACS2/2.2.7.1" optional
check_cmd "GEM（备选宽峰）" "command -v gem" optional
check_cmd "IDR" "command -v idr" optional
echo "--- 输入目录 ---"
case "{{INPUT_DIR}}" in ''|*'{{'*) echo "MISS 未指定输入目录"; FAIL=1 ;;
  *) if [ -d "{{INPUT_DIR}}" ]; then echo "OK   INPUT_DIR={{INPUT_DIR}}"; ls "{{INPUT_DIR}}" | head -5 || true; else echo "MISS 目录 {{INPUT_DIR}}"; FAIL=1; fi ;;
esac
case "{{CONTROL_DIR}}" in ''|*'{{'*) echo "SKIP CONTROL_DIR（未指定，可选）" ;;
  *) if [ -d "{{CONTROL_DIR}}" ]; then echo "OK   CONTROL_DIR={{CONTROL_DIR}}"; ls "{{CONTROL_DIR}}" | head -5 || true; else echo "MISS 目录 {{CONTROL_DIR}}"; FAIL=1; fi ;;
esac
echo "--- 参考数据 ---"
chk_ref() {
  case "$1" in ''|*'{{'*) echo "SKIP $2（未指定，运行时由 AI 协助补齐）"; return 0 ;; esac
  if [ -e "$1" ] || [ -e "$1.1.bt2" ] || [ -e "$1.sa" ] || [ -e "$1.grp" ]; then echo "OK   $2"; else echo "MISS $2: $1（含常见索引后缀均未找到）"; if [ "$4" = "required" ]; then FAIL=1; fi; fi
}
chk_ref "{{BWA_INDEX}}" "BWA 索引" '' optional
chk_ref "{{REF_FA}}" "参考基因组 FASTA" '' optional
chk_ref "{{BLACKLIST}}" "ENCODE 黑名单区域 BED" '' optional
echo "--- 已加载模块 ---"
module -t list 2>&1 | tail -30 || true
exit $FAIL
```

#### 步骤 2/9：FastQC 原始数据质控

> 写成 histone_qc.lsf 后 bsub 提交；先看报告再决定后续

```bash
#BSUB -J histone_qc -n 1 -q {{QUEUE}}
module load FastQC/0.11.9
cd {{INPUT_DIR}} && mkdir -p fastqc_results
fastqc *.fq.gz -o ./fastqc_results -t {{THREADS}}
```

#### 步骤 3/9：BWA MEM 比对与排序

> 写成 histone_align.lsf 后 bsub 提交；单端数据只传 R1 一个文件

```bash
#BSUB -J histone_align -n {{THREADS}} -q {{QUEUE}}
module load BWA/0.7.17 SAMtools/1.17
cd {{INPUT_DIR}}
for i in *_R1.fq.gz; do
  s=${i%_R1.fq.gz}
  bwa mem -t {{THREADS}} {{BWA_INDEX}} "$i" "${s}_R2.fq.gz" | samtools sort -@ {{THREADS}} -o "${s}.sorted.bam" -
done
```

#### 步骤 4/9：比对过滤与 PCR 去重

> MAPQ≥30、保留正确配对、去未比对/次要比对/QC 失败 reads；fixmate + MarkDuplicates 去 PCR 重复

```bash
#BSUB -J histone_filter -n {{THREADS}} -q {{QUEUE}}
module load SAMtools/1.17 Picard/2.27.4
cd {{INPUT_DIR}} && mkdir -p qc
for b in *.sorted.bam; do
  s=${b%.sorted.bam}
  samtools view -@ {{THREADS}} -b -q 30 -f 2 -F 1804 "$b" > "${s}.filt.bam"
  samtools sort -@ {{THREADS}} -n "${s}.filt.bam" -o "${s}.filt.nsrt.bam"
  samtools fixmate -@ {{THREADS}} -m "${s}.filt.nsrt.bam" "${s}.fixmate.bam"
  samtools sort -@ {{THREADS}} "${s}.fixmate.bam" -o "${s}.fixmate.sorted.bam"
  java -jar $EBROOTPICARD/picard.jar MarkDuplicates I="${s}.fixmate.sorted.bam" O="${s}.dedup.bam" M=qc/"${s}".dup_metrics.txt REMOVE_DUPLICATES=true
  samtools index "${s}.dedup.bam"
done
```

#### 步骤 5/9：QC：链相关与库复杂度评估

> 达标：NSC≥1.05、RSC≥0.8、NRF≥0.8；警告：NSC 1.0-1.05、RSC 0.5-0.8、NRF 0.6-0.8

```bash
#BSUB -J histone_libqc -n 1 -q {{QUEUE}}
module load SAMtools/1.17
cd {{INPUT_DIR}} && mkdir -p qc
for b in *.dedup.bam; do
  s=${b%.dedup.bam}
  run_spp.R -c="$b" -savp -p {{THREADS}} -out=qc/"${s}".cc.qc
done
python3 - <<'PY'
import glob, json, os
qc = {}
for cc in glob.glob("qc/*.cc.qc"):
    s = os.path.basename(cc).replace(".cc.qc", "")
    with open(cc) as fh:
        header = fh.readline().rstrip("\n").split("\t")
        row = fh.readline().rstrip("\n").split("\t")
    rec = dict(zip(header, row))
    nrf = None
    dup = os.path.join("qc", s + ".dup_metrics.txt")
    if os.path.exists(dup):
        with open(dup) as fh:
            for line in fh:
                if line.startswith("#") or line.startswith("LIBRARY") or not line.strip():
                    continue
                cols = line.rstrip("\n").split("\t")
                examined = int(cols[1]) + 2 * int(cols[2])
                duplicates = int(cols[5]) + 2 * int(cols[6])
                nrf = round(1 - duplicates / examined, 4) if examined else None
                break
    qc[s] = {"NSC": rec.get("NSC"), "RSC": rec.get("RSC"), "NRF": nrf}
with open("qc/qc.json", "w") as out:
    json.dump(qc, out, indent=2, ensure_ascii=False)
PY
```

#### 步骤 6/9：SPP 宽峰调用与黑名单过滤

> 写成 histone_peak.lsf 后 bsub 提交；SPP 宽峰适合 H3K27ac/H3K36me3 等宽域修饰；备选：macs2 callpeak --broad --broad-cutoff 0.1（需 MACS2 与 {{GENOME_SIZE}}）或 GEM

```bash
#BSUB -J histone_peak -n {{THREADS}} -q {{QUEUE}}
module load BEDTools/2.30.0
cd {{INPUT_DIR}} && mkdir -p peaks
CTRL=$(ls {{CONTROL_DIR}}/*.dedup.bam 2>/dev/null | head -1 || true)
for b in *.dedup.bam; do
  s=${b%.dedup.bam}
  run_spp.R -c="$b" ${CTRL:+-i="$CTRL"} -npeak=300000 -odir=peaks -speak=peaks/"${s}" -savp -rf
  zcat peaks/"${s}".regionPeak.gz > peaks/"${s}".regionPeak
  bedtools intersect -a peaks/"${s}".regionPeak -b {{BLACKLIST}} -v > peaks/"${s}".peaks.final.bed
done
```

#### 步骤 7/9：QC：信号轨迹（RPKM bigWig）、SPOT 与峰快照

> HPClaw 对 ENCODE 基线的扩展：RPKM 标准化 bigWig（qc/tracks/*.rpkm.bw）可直接拖进 IGV/基因组浏览器；SPOT 需 hotspot2（缺失自动 SKIP）；随机抽 5 个峰画 IGV 风格覆盖图到 qc/igv/（需 matplotlib，缺失自动 SKIP；固定随机种子 42 可复现）

```bash
#BSUB -J chipseq_track_qc -n {{THREADS}} -q {{QUEUE}}
module load deepTools/3.5.1 SAMtools/1.17 BEDTools/2.30.0
cd {{INPUT_DIR}} && mkdir -p qc/tracks qc/igv
for b in *.dedup.bam; do
  s=${b%.dedup.bam}
  bamCoverage -b "$b" -o qc/tracks/"${s}".rpkm.bw -p {{THREADS}} --normalizeUsing RPKM
done
for b in *.dedup.bam; do
  s=${b%.dedup.bam}
  if command -v hotspot2 >/dev/null 2>&1; then
    mkdir -p hotspots
    samtools view -H "$b" | awk -F'\t' '/^@SQ/{split($2,a,":");split($3,c,":");print a[2]"\t"c[2]}' > qc/chrom.sizes
    hotspot2 -c qc/chrom.sizes "$b" hotspots/"${s}"
    total=$(samtools view -c "$b")
    inhot=$(bedtools intersect -a "$b" -b hotspots/"${s}".hotspots.fdr0.05.bed -u | samtools view -c - || true)
    echo -e "${s}\t${total}\t${inhot}" >> qc/spot.tsv
  else
    echo "SKIP: hotspot2 不可用，跳过 SPOT（module load 或一键部署 hotspot2 即可启用）"
  fi
done
python3 - <<'PY'
BAM_GLOB = "*.dedup.bam"
BAM_SUFFIX = ".dedup.bam"
PEAK_DIR = "peaks/"
PEAK_SUFFIX = ".peaks.final.bed"
import glob, os, random, subprocess, sys
try:
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
except Exception as exc:
    print("SKIP: 无 matplotlib，跳过峰快照绘图（%s）" % exc)
    sys.exit(0)
os.makedirs("qc/igv", exist_ok=True)
made = 0
for bam in sorted(glob.glob(BAM_GLOB)):
    s = bam[: -len(BAM_SUFFIX)]
    peak_file = PEAK_DIR + s + PEAK_SUFFIX
    if not os.path.exists(peak_file):
        continue
    peaks = []
    with open(peak_file) as fh:
        for line in fh:
            if line.startswith("#"):
                continue
            f = line.rstrip("\n").split("\t")
            if len(f) >= 3:
                try:
                    peaks.append((f[0], int(f[1]), int(f[2])))
                except ValueError:
                    pass
    if not peaks:
        continue
    random.seed(42)
    for chrom, start, end in random.sample(peaks, min(5, len(peaks))):
        a, b = max(0, start - 1500), end + 1500
        out = subprocess.run(["samtools", "depth", "-a", "-r", "%s:%d-%d" % (chrom, a, b), bam], capture_output=True, text=True)
        cov = {}
        for line in out.stdout.splitlines():
            f = line.split("\t")
            if len(f) >= 3:
                cov[int(f[1])] = int(f[2])
        xs = list(range(a, b + 1))
        ys = [cov.get(x, 0) for x in xs]
        fig, ax = plt.subplots(figsize=(8, 2.4))
        ax.fill_between(xs, ys, color="#3b82f6", lw=0)
        ax.axvspan(start, end, color="#f59e0b", alpha=0.25)
        ax.set_title("%s  %s:%d-%d" % (s, chrom, start, end))
        ax.set_xlabel(chrom)
        ax.set_ylabel("depth")
        ax.margins(x=0)
        fig.tight_layout()
        fig.savefig("qc/igv/%s_%s_%d.png" % (s, chrom, start), dpi=120)
        plt.close(fig)
        made += 1
print("IGV 风格峰快照产出 %d 张 → qc/igv/" % made)
PY
```

#### 步骤 8/9：QC：FRiP 与重复间 IDR 一致性

> 达标：FRiP≥1%、IDR Np/Nt<2；警告：FRiP 0.5-1%；重复≥2 用真重复 IDR，单重复用伪重复 IDR

```bash
#BSUB -J histone_idr -n {{THREADS}} -q {{QUEUE}}
module load SAMtools/1.17 BEDTools/2.30.0
cd {{INPUT_DIR}} && mkdir -p idr qc
for b in *.dedup.bam; do
  s=${b%.dedup.bam}
  total=$(samtools view -c "$b")
  inpeak=$(bedtools intersect -a "$b" -b peaks/"${s}".peaks.final.bed -u | samtools view -c -)
  echo -e "${s}\t${total}\t${inpeak}" >> qc/frip.tsv
done
mapfile -t PK < <(ls peaks/*.peaks.final.bed 2>/dev/null || ls *.peaks.final.bed 2>/dev/null)
if [ "${#PK[@]}" -lt 2 ]; then
  echo "SKIP: 需要至少 2 个重复 peaks 才能算 IDR"
else
  POOL=$(ls peaks/*pool*.peaks.final.bed 2>/dev/null | head -1 || true)
  idr --samples "${PK[0]}" "${PK[1]}" ${POOL:+--peak-list "$POOL"} --input-file-type broadPeak --rank p.value -o idr/idr.txt --plot
fi
python3 - <<'PY'
import json, os
qc = {}
if os.path.exists("qc/frip.tsv"):
    with open("qc/frip.tsv") as fh:
        for line in fh:
            s, total, inpeak = line.rstrip("\n").split("\t")
            qc[s] = {"FRiP": round(int(inpeak) / int(total), 4) if int(total) else None}
n_idr = None
if os.path.exists("idr/idr.txt"):
    n_idr = 0
    with open("idr/idr.txt") as fh:
        for line in fh:
            cols = line.rstrip("\n").split("\t")
            try:
                if float(cols[10]) < 0.05:
                    n_idr += 1
            except (IndexError, ValueError):
                continue
qc["_idr"] = {"peaks_global_idr_lt_0.05": n_idr, "rule": "Np(伪重复)/Nt(真重复) < 2 达标，>= 2 判重复间不一致"}
with open("qc/idr_qc.json", "w") as out:
    json.dump(qc, out, indent=2, ensure_ascii=False)
PY
```

#### 步骤 9/9：生成分析报告

```bash
按 analysis-report 技能模板，基于本流程实际产出生成图文并茂的分析报告（reports/ 下 HTML+MD），回复给出报告与关键图绝对路径
```


---

## ENCODE bulk RNA-seq 分析与质控流程

- 流程 id：`encode-rnaseq-bulk`
- 用途：ENCODE bulk RNA-seq 统一流程：FastQC → STAR 比对（PE/SE、stranded/unstranded）→ RSEM 定量（gene/isoform TPM/FPKM）→ 比对率、rRNA 占比与重复间相关性评估。
- 运行参数：`INPUT_DIR`、`STAR_INDEX`〔可选〕、`RSEM_INDEX`〔可选〕、`GTF`〔可选〕、`LAYOUT`（默认 paired）、`STRANDEDNESS`（默认 unstranded）、`QUEUE`（默认 q2680v2）、`THREADS`（默认 8）
- 软件清单（版本钉死）：FastQC=`FastQC/0.11.9`、STAR=`STAR/2.7.10b`、RSEM=`RSEM/1.3.3`、SAMtools=`SAMtools/1.17`、Picard=`Picard/2.27.4`、RSeQC〔命令探测〕〔可选〕
- 参考数据：STAR 基因组索引（index，可留空）、RSEM 索引（index，可留空）、基因注释 GTF（annotation，可留空）
- QC 关卡：
  - 第 2 步后 · FastQC 碱基质量与接头含量：达标 Q30 >80%，接头含量 <5%；警告 Q30 70-80% 或接头 5-15%
  - 第 5 步后 · 比对率与 rRNA 占比：达标 比对率 >70%，rRNA 占比 <10%；警告 比对率 50-70% 或 rRNA 10-30%
  - 第 6 步后 · 重复间表达一致性：达标 Spearman >0.9；警告 0.8-0.9

### 步骤与脚本全文

#### 步骤 1/7：环境检查（软件、输入与参考）

> 只读检查：必需软件缺失或输入目录不存在时以非 0 退出；先补齐环境（流程面板支持一键部署）再继续。可选参考留空时由 AI 在后续步骤协助补齐。

```bash
# 环境检查（只读）：确认软件可加载、输入与参考数据就绪。
# 必需项缺失时本步骤以非 0 退出；请先补齐环境（流程面板支持一键部署）再继续。
#BSUB -J rnaseq_bulk_env -n 1 -q {{QUEUE}}
if ! type module >/dev/null 2>&1; then
  for f in /etc/profile.d/modules.sh /etc/profile.d/lmod.sh /usr/share/Modules/init/bash /usr/share/lmod/lmod/init/bash; do
    [ -r "$f" ] && . "$f" >/dev/null 2>&1 && type module >/dev/null 2>&1 && break || true
  done
fi
FAIL=0
check_mod() {
  if module load "$2" >/dev/null 2>&1; then echo "OK   $1 ($2)"; else
    echo "MISS $1 ($2) —— 集群可用版本："; module -t avail "${2%%/*}" 2>&1 | grep -i "${2%%/*}" | head -5 || true
    if [ "$3" = "required" ]; then FAIL=1; fi
  fi
}
check_cmd() {
  if ( eval "$2" ) >/dev/null 2>&1; then echo "OK   $1"; else echo "MISS $1（检查命令：$2）"; if [ "$3" = "required" ]; then FAIL=1; fi; fi
}
check_mod "FastQC" "FastQC/0.11.9" required
check_mod "STAR" "STAR/2.7.10b" required
check_mod "RSEM" "RSEM/1.3.3" required
check_mod "SAMtools" "SAMtools/1.17" required
check_mod "Picard" "Picard/2.27.4" required
check_cmd "RSeQC" "command -v geneBody_coverage.py" optional
echo "--- 输入目录 ---"
case "{{INPUT_DIR}}" in ''|*'{{'*) echo "MISS 未指定输入目录"; FAIL=1 ;;
  *) if [ -d "{{INPUT_DIR}}" ]; then echo "OK   INPUT_DIR={{INPUT_DIR}}"; ls "{{INPUT_DIR}}" | head -5 || true; else echo "MISS 目录 {{INPUT_DIR}}"; FAIL=1; fi ;;
esac
echo "--- 参考数据 ---"
chk_ref() {
  case "$1" in ''|*'{{'*) echo "SKIP $2（未指定，运行时由 AI 协助补齐）"; return 0 ;; esac
  if [ -e "$1" ] || [ -e "$1.1.bt2" ] || [ -e "$1.sa" ] || [ -e "$1.grp" ]; then echo "OK   $2"; else echo "MISS $2: $1（含常见索引后缀均未找到）"; if [ "$4" = "required" ]; then FAIL=1; fi; fi
}
chk_ref "{{STAR_INDEX}}" "STAR 基因组索引" '' optional
chk_ref "{{RSEM_INDEX}}" "RSEM 索引" '' optional
chk_ref "{{GTF}}" "基因注释 GTF" '' optional
echo "--- 已加载模块 ---"
module -t list 2>&1 | tail -30 || true
exit $FAIL
```

#### 步骤 2/7：FastQC 原始数据质控

> 写成 rnaseq_qc.lsf 后 bsub 提交；先看报告再决定后续

```bash
#BSUB -J rnaseq_qc -n 1 -q {{QUEUE}}
module load FastQC/0.11.9
cd {{INPUT_DIR}} && mkdir -p fastqc_results
fastqc *.fq.gz -o ./fastqc_results -t {{THREADS}}
```

#### 步骤 3/7：STAR 比对

> 写成 rnaseq_star.lsf 后 bsub 提交；{{LAYOUT}}=single 时 --readFilesIn 只传 R1；链特异性由 {{STRANDEDNESS}} 决定 RSEM 参数

```bash
#BSUB -J rnaseq_star -n {{THREADS}} -q {{QUEUE}}
module load STAR/2.7.10b
cd {{INPUT_DIR}}
for i in *_R1.fq.gz; do
  s=${i%_R1.fq.gz}
  STAR --runThreadN {{THREADS}} --genomeDir {{STAR_INDEX}} --readFilesIn "$i" "${s}_R2.fq.gz" --readFilesCommand zcat --outSAMtype BAM SortedByCoordinate --quantMode TranscriptomeSAM GeneCounts --outFilterMultimapNmax 20 --outFilterMismatchNmax 999 --outFilterMismatchNoverLmax 0.04 --alignIntronMin 20 --alignIntronMax 1000000 --alignMatesGapMax 1000000 --outFileNamePrefix "${s}."
done
```

#### 步骤 4/7：RSEM 基因与转录本定量

> 写成 rnaseq_rsem.lsf 后 bsub 提交；{{STRANDEDNESS}}=forward/reverse 时分别加 --forward-prob 1/0；{{LAYOUT}}=single 时去掉 --paired-end；产出 gene/isoform 级 TPM/FPKM

```bash
#BSUB -J rnaseq_rsem -n {{THREADS}} -q {{QUEUE}}
module load RSEM/1.3.3
cd {{INPUT_DIR}}
for t in *.Aligned.toTranscriptome.out.bam; do
  s=${t%.Aligned.toTranscriptome.out.bam}
  rsem-calculate-expression --bam --estimate-rspd --calc-ci --seed 12345 -p {{THREADS}} --paired-end "$t" {{RSEM_INDEX}} "${s}.rsem"
done
```

#### 步骤 5/7：QC：比对率、rRNA 占比与重复率评估

> 达标：总比对率 >70%；警告：50-70%；<50% 检查污染或建库失败；rRNA 占比 <10% 为理想；REF_FLAT 用 gtfToGenePred 由 GTF 生成

```bash
#BSUB -J rnaseq_align_qc -n 1 -q {{QUEUE}}
module load SAMtools/1.17 Picard/2.27.4
cd {{INPUT_DIR}} && mkdir -p qc
for b in *.Aligned.sortedByCoord.out.bam; do
  s=${b%.Aligned.sortedByCoord.out.bam}
  samtools flagstat "$b" > qc/"${s}".flagstat.txt
  REFFLAT=qc/genes.refFlat
  if [ ! -s "$REFFLAT" ] && command -v gtfToGenePred >/dev/null 2>&1; then
    gtfToGenePred -genePredExt {{GTF}} "$REFFLAT" || true
  fi
  if [ ! -s "$REFFLAT" ]; then
    echo "SKIP: 无 refFlat，跳过 RnaSeqMetrics"
    continue
  fi
  RIBO=""
  [ -s qc/rrna.intervals ] && RIBO="RIBOSOMAL_INTERVALS=qc/rrna.intervals"
  java -jar $EBROOTPICARD/picard.jar CollectRnaSeqMetrics I="$b" O=qc/"${s}".rnaseq_metrics.txt REF_FLAT="$REFFLAT" $RIBO
done
python3 - <<'PY'
import glob, json, os
qc = {}
for f in glob.glob("qc/*.flagstat.txt"):
    s = os.path.basename(f).replace(".flagstat.txt", "")
    total = mapped = 0
    with open(f) as fh:
        for line in fh:
            if "in total" in line:
                total = int(line.split()[0])
            elif "mapped (" in line and "primary" not in line:
                mapped = int(line.split()[0])
    qc[s] = {"total_reads": total, "mapped": mapped, "mapping_rate": round(mapped / total, 4) if total else None}
with open("qc/qc.json", "w") as out:
    json.dump(qc, out, indent=2, ensure_ascii=False)
PY
```

#### 步骤 6/7：QC：重复间表达相关性与 gene body 覆盖

> 达标：重复间 Spearman >0.9、gene body 覆盖均匀无 5'/3' 明显偏倚；警告：Spearman 0.8-0.9

```bash
#BSUB -J rnaseq_rep_qc -n 1 -q {{QUEUE}}
module load RSeQC
cd {{INPUT_DIR}} && mkdir -p qc
BAMS=$(ls *.Aligned.sortedByCoord.out.bam 2>/dev/null | tr '\n' ',' | sed 's/,$//' || true)
BED12=qc/genes.bed12
if [ ! -s "$BED12" ] && command -v gtfToGenePred >/dev/null 2>&1 && command -v genePredToBed >/dev/null 2>&1; then
  gtfToGenePred -genePredExt {{GTF}} qc/genes.genePred && genePredToBed qc/genes.genePred "$BED12" || true
fi
if [ -z "$BAMS" ] || [ ! -s "$BED12" ]; then
  echo "SKIP: 缺少比对 BAM 或基因注释 BED12，跳过 geneBody 覆盖评估"
else
  geneBody_coverage.py -i "$BAMS" -r "$BED12" -o qc/genebody
fi
python3 - <<'PY'
import glob, json

def tpm_col(path):
    vals = []
    with open(path) as fh:
        fh.readline()
        for line in fh:
            vals.append(float(line.split("\t")[5]))
    return vals

def rank(xs):
    order = sorted(range(len(xs)), key=lambda i: xs[i])
    r = [0.0] * len(xs)
    for pos, i in enumerate(order):
        r[i] = pos + 1
    return r

def pearson(a, b):
    n = len(a)
    ma, mb = sum(a) / n, sum(b) / n
    num = sum((x - ma) * (y - mb) for x, y in zip(a, b))
    den = (sum((x - ma) ** 2 for x in a) * sum((y - mb) ** 2 for y in b)) ** 0.5
    return num / den if den else 0.0

files = sorted(glob.glob("*.rsem.genes.results"))
qc = {"spearman": {}}
for i in range(len(files)):
    for j in range(i + 1, len(files)):
        a, b = tpm_col(files[i]), tpm_col(files[j])
        qc["spearman"][files[i] + " vs " + files[j]] = round(pearson(rank(a), rank(b)), 4)
with open("qc/rep_qc.json", "w") as out:
    json.dump(qc, out, indent=2, ensure_ascii=False)
PY
```

#### 步骤 7/7：生成分析报告

```bash
按 analysis-report 技能模板，基于本流程实际产出生成图文并茂的分析报告（reports/ 下 HTML+MD），回复给出报告与关键图绝对路径
```


---

## ENCODE ATAC-seq 分析与质控流程

- 流程 id：`encode-atacseq`
- 用途：ENCODE ATAC-seq 统一流程：FastQC → Bowtie2 比对 → 过滤（去线粒体、MAPQ≥30、去重、去黑名单）→ Tn5 偏移校正 → MACS2 峰 → TSS 富集与片段分布评估。
- 运行参数：`INPUT_DIR`、`BOWTIE2_INDEX`〔可选〕、`REF_FA`〔可选〕、`BLACKLIST`〔可选〕、`TSS_BED`〔可选〕、`GENOME_SIZE`（默认 hs）〔可选〕、`ORGANELLE_REGEX`（默认 chrM|chrMT|chrC|chrPt|ChrM|ChrMt|ChrC|ChrPt|mitochondria|chloroplast|plastid）〔可选〕、`QUEUE`（默认 q2680v2）、`THREADS`（默认 8）
- 软件清单（版本钉死）：FastQC=`FastQC/0.11.9`、Bowtie2=`Bowtie2/2.4.5`、SAMtools=`SAMtools/1.17`、Picard=`Picard/2.27.4`、MACS2=`MACS2/2.2.7.1`、deepTools=`deepTools/3.5.1`、BEDTools=`BEDTools/2.30.0`、hotspot2〔命令探测〕〔可选〕
- 参考数据：Bowtie2 索引（index，可留空）、参考基因组 FASTA（genome，可留空）、ENCODE 黑名单区域 BED（other，可留空）、TSS 注释 BED（annotation，可留空）
- QC 关卡：
  - 第 2 步后 · FastQC 碱基质量与接头含量：达标 Q30 >80%，接头含量 <5%；警告 Q30 70-80% 或接头 5-15%
  - 第 4 步后 · 比对率与细胞器 reads 占比：达标 比对率 >80%，线粒体+叶绿体占比 <20%；警告 细胞器占比 20-50%（植物样本叶绿体高时先确认 ORGANELLE_REGEX 已覆盖）
  - 第 6 步后 · TSS 富集、FRiP 与 SPOT：达标 TSS enrichment >6，FRiP≥0.2，SPOT≥0.3（需 hotspot2）；警告 TSS 4-6 或 FRiP 0.1-0.2 或 SPOT 0.2-0.3

### 步骤与脚本全文

#### 步骤 1/7：环境检查（软件、输入与参考）

> 只读检查：必需软件缺失或输入目录不存在时以非 0 退出；先补齐环境（流程面板支持一键部署）再继续。可选参考留空时由 AI 在后续步骤协助补齐。

```bash
# 环境检查（只读）：确认软件可加载、输入与参考数据就绪。
# 必需项缺失时本步骤以非 0 退出；请先补齐环境（流程面板支持一键部署）再继续。
#BSUB -J atacseq_env -n 1 -q {{QUEUE}}
if ! type module >/dev/null 2>&1; then
  for f in /etc/profile.d/modules.sh /etc/profile.d/lmod.sh /usr/share/Modules/init/bash /usr/share/lmod/lmod/init/bash; do
    [ -r "$f" ] && . "$f" >/dev/null 2>&1 && type module >/dev/null 2>&1 && break || true
  done
fi
FAIL=0
check_mod() {
  if module load "$2" >/dev/null 2>&1; then echo "OK   $1 ($2)"; else
    echo "MISS $1 ($2) —— 集群可用版本："; module -t avail "${2%%/*}" 2>&1 | grep -i "${2%%/*}" | head -5 || true
    if [ "$3" = "required" ]; then FAIL=1; fi
  fi
}
check_cmd() {
  if ( eval "$2" ) >/dev/null 2>&1; then echo "OK   $1"; else echo "MISS $1（检查命令：$2）"; if [ "$3" = "required" ]; then FAIL=1; fi; fi
}
check_mod "FastQC" "FastQC/0.11.9" required
check_mod "Bowtie2" "Bowtie2/2.4.5" required
check_mod "SAMtools" "SAMtools/1.17" required
check_mod "Picard" "Picard/2.27.4" required
check_mod "MACS2" "MACS2/2.2.7.1" required
check_mod "deepTools" "deepTools/3.5.1" required
check_mod "BEDTools" "BEDTools/2.30.0" required
check_cmd "hotspot2" "command -v hotspot2" optional
echo "--- 输入目录 ---"
case "{{INPUT_DIR}}" in ''|*'{{'*) echo "MISS 未指定输入目录"; FAIL=1 ;;
  *) if [ -d "{{INPUT_DIR}}" ]; then echo "OK   INPUT_DIR={{INPUT_DIR}}"; ls "{{INPUT_DIR}}" | head -5 || true; else echo "MISS 目录 {{INPUT_DIR}}"; FAIL=1; fi ;;
esac
echo "--- 参考数据 ---"
chk_ref() {
  case "$1" in ''|*'{{'*) echo "SKIP $2（未指定，运行时由 AI 协助补齐）"; return 0 ;; esac
  if [ -e "$1" ] || [ -e "$1.1.bt2" ] || [ -e "$1.sa" ] || [ -e "$1.grp" ]; then echo "OK   $2"; else echo "MISS $2: $1（含常见索引后缀均未找到）"; if [ "$4" = "required" ]; then FAIL=1; fi; fi
}
chk_ref "{{BOWTIE2_INDEX}}" "Bowtie2 索引" '' optional
chk_ref "{{REF_FA}}" "参考基因组 FASTA" '' optional
chk_ref "{{BLACKLIST}}" "ENCODE 黑名单区域 BED" '' optional
chk_ref "{{TSS_BED}}" "TSS 注释 BED" '' optional
echo "--- 已加载模块 ---"
module -t list 2>&1 | tail -30 || true
exit $FAIL
```

#### 步骤 2/7：FastQC 原始数据质控

> 写成 atac_qc.lsf 后 bsub 提交；先看报告再决定后续

```bash
#BSUB -J atac_qc -n 1 -q {{QUEUE}}
module load FastQC/0.11.9
cd {{INPUT_DIR}} && mkdir -p fastqc_results
fastqc *.fq.gz -o ./fastqc_results -t {{THREADS}}
```

#### 步骤 3/7：Bowtie2 比对与排序

> 写成 atac_align.lsf 后 bsub 提交；-X 2000 允许长片段

```bash
#BSUB -J atac_align -n {{THREADS}} -q {{QUEUE}}
module load Bowtie2/2.4.5 SAMtools/1.17
cd {{INPUT_DIR}}
for i in *_R1.fq.gz; do
  s=${i%_R1.fq.gz}
  bowtie2 -p {{THREADS}} -X 2000 --very-sensitive -x {{BOWTIE2_INDEX}} -1 "$i" -2 "${s}_R2.fq.gz" | samtools sort -@ {{THREADS}} -o "${s}.sorted.bam" -
done
```

#### 步骤 4/7：过滤（去细胞器·线粒体+叶绿体、MAPQ≥30、去重、去黑名单）

> ENCODE 原版只去线粒体（chrM）；植物样本必须同时去叶绿体——去除模式由 ORGANELLE_REGEX 全局参数控制（默认覆盖线粒体/叶绿体常见命名，清空则保留细胞器 reads）。MAPQ≥30、去未比对/次要/QC 失败 reads；MarkDuplicates 去重；bedtools 去黑名单；organelle.tsv 记录线粒体/叶绿体/合计占比

```bash
#BSUB -J atac_filter -n {{THREADS}} -q {{QUEUE}}
module load SAMtools/1.17 Picard/2.27.4 BEDTools/2.30.0
cd {{INPUT_DIR}} && mkdir -p qc
for b in *.sorted.bam; do
  s=${b%.sorted.bam}
  total=$(samtools view -c "$b")
  mito=$(samtools view "$b" | grep -cE 'chrM|chrMT|ChrM|ChrMt|mitochondria' || true)
  chloro=$(samtools view "$b" | grep -cE 'chrC|chrPt|ChrC|ChrPt|chloroplast|plastid' || true)
  if [ -n "{{ORGANELLE_REGEX}}" ]; then org=$(samtools view "$b" | grep -cE "{{ORGANELLE_REGEX}}" || true); else org=0; fi
  echo -e "${s}\t${total}\t${mito}\t${chloro}\t${org}" >> qc/organelle.tsv
  if [ -n "{{ORGANELLE_REGEX}}" ]; then
    samtools view -@ {{THREADS}} -h -q 30 -F 1804 "$b" | { grep -vE "{{ORGANELLE_REGEX}}" || true; } | samtools view -@ {{THREADS}} -b - > "${s}.noorg.bam"
  else
    samtools view -@ {{THREADS}} -b -q 30 -F 1804 "$b" > "${s}.noorg.bam"
  fi
  java -jar $EBROOTPICARD/picard.jar MarkDuplicates I="${s}.noorg.bam" O="${s}.dedup.bam" M=qc/"${s}".dup_metrics.txt REMOVE_DUPLICATES=true
  bedtools intersect -a "${s}.dedup.bam" -b {{BLACKLIST}} -v > "${s}.final.bam"
  samtools index "${s}.final.bam"
done
```

#### 步骤 5/7：Tn5 偏移校正与 MACS2 峰调用

> Tn5 偏移 +4/-5 bp 由 alignmentSieve --ATACshift 完成；无 deepTools 时在 BED 层平移替代

```bash
#BSUB -J atac_peak -n {{THREADS}} -q {{QUEUE}}
module load deepTools/3.5.1 MACS2/2.2.7.1 SAMtools/1.17
cd {{INPUT_DIR}} && mkdir -p peaks
for b in *.final.bam; do
  s=${b%.final.bam}
  alignmentSieve -b "$b" -o "${s}.shifted.bam" --ATACshift --numberOfProcessors {{THREADS}}
  samtools index "${s}.shifted.bam"
  macs2 callpeak -t "${s}.shifted.bam" -f BAMPE -n "${s}" -g {{GENOME_SIZE}} --nomodel --shift -75 --extsize 150 -q 0.01 --outdir peaks
done
```

#### 步骤 6/7：QC：TSS 富集、FRiP、SPOT、信号轨迹与峰快照评估

> 达标：TSS enrichment >6（>10 理想）、FRiP≥0.2、SPOT≥0.3（hotspot2 可用时才计算，缺失自动 SKIP）、NRF>0.8、细胞器（线粒体+叶绿体）占比 <20%；TSS 分数取 tss.mat.gz 中心/侧翼均值比；insert_size 图应呈核小体周期性；RPKM bigWig 在 qc/tracks/，随机 5 个峰的 IGV 风格快照在 qc/igv/（需 matplotlib，缺失自动 SKIP）

```bash
#BSUB -J atac_tss_qc -n {{THREADS}} -q {{QUEUE}}
module load deepTools/3.5.1 Picard/2.27.4 SAMtools/1.17 BEDTools/2.30.0
cd {{INPUT_DIR}} && mkdir -p qc qc/tracks qc/igv
for b in *.final.bam; do
  s=${b%.final.bam}
  bamCoverage -b "$b" -o qc/tracks/"${s}".rpkm.bw -p {{THREADS}} --normalizeUsing RPKM
  computeMatrix reference-point -S "${s}".bw -R {{TSS_BED}} -a 2000 -b 2000 -p {{THREADS}} -o qc/"${s}".tss.mat.gz
  plotProfile -m qc/"${s}".tss.mat.gz -o qc/"${s}".tss_enrichment.png
  java -jar $EBROOTPICARD/picard.jar CollectInsertSizeMetrics I="$b" O=qc/"${s}".insert_size_metrics.txt H=qc/"${s}".insert_size.png
  total=$(samtools view -c "$b")
  inpeak=$(bedtools intersect -a "$b" -b peaks/"${s}"_peaks.narrowPeak -u | samtools view -c - || true)
  echo -e "${s}\t${total}\t${inpeak}" >> qc/frip.tsv
  if command -v hotspot2 >/dev/null 2>&1; then
    mkdir -p hotspots
    samtools view -H "$b" | awk -F'\t' '/^@SQ/{split($2,a,":");split($3,c,":");print a[2]"\t"c[2]}' > qc/chrom.sizes
    hotspot2 -c qc/chrom.sizes "$b" hotspots/"${s}"
    inhot=$(bedtools intersect -a "$b" -b hotspots/"${s}".hotspots.fdr0.05.bed -u | samtools view -c - || true)
    echo -e "${s}\t${total}\t${inhot}" >> qc/spot.tsv
  else
    echo "SKIP: hotspot2 不可用，跳过 SPOT（FRiP 已覆盖类似信息；module load 或一键部署 hotspot2 即可启用）"
  fi
done
python3 - <<'PY'
BAM_GLOB = "*.final.bam"
BAM_SUFFIX = ".final.bam"
PEAK_DIR = "peaks/"
PEAK_SUFFIX = "_peaks.narrowPeak"
import glob, os, random, subprocess, sys
try:
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
except Exception as exc:
    print("SKIP: 无 matplotlib，跳过峰快照绘图（%s）" % exc)
    sys.exit(0)
os.makedirs("qc/igv", exist_ok=True)
made = 0
for bam in sorted(glob.glob(BAM_GLOB)):
    s = bam[: -len(BAM_SUFFIX)]
    peak_file = PEAK_DIR + s + PEAK_SUFFIX
    if not os.path.exists(peak_file):
        continue
    peaks = []
    with open(peak_file) as fh:
        for line in fh:
            if line.startswith("#"):
                continue
            f = line.rstrip("\n").split("\t")
            if len(f) >= 3:
                try:
                    peaks.append((f[0], int(f[1]), int(f[2])))
                except ValueError:
                    pass
    if not peaks:
        continue
    random.seed(42)
    for chrom, start, end in random.sample(peaks, min(5, len(peaks))):
        a, b = max(0, start - 1500), end + 1500
        out = subprocess.run(["samtools", "depth", "-a", "-r", "%s:%d-%d" % (chrom, a, b), bam], capture_output=True, text=True)
        cov = {}
        for line in out.stdout.splitlines():
            f = line.split("\t")
            if len(f) >= 3:
                cov[int(f[1])] = int(f[2])
        xs = list(range(a, b + 1))
        ys = [cov.get(x, 0) for x in xs]
        fig, ax = plt.subplots(figsize=(8, 2.4))
        ax.fill_between(xs, ys, color="#3b82f6", lw=0)
        ax.axvspan(start, end, color="#f59e0b", alpha=0.25)
        ax.set_title("%s  %s:%d-%d" % (s, chrom, start, end))
        ax.set_xlabel(chrom)
        ax.set_ylabel("depth")
        ax.margins(x=0)
        fig.tight_layout()
        fig.savefig("qc/igv/%s_%s_%d.png" % (s, chrom, start), dpi=120)
        plt.close(fig)
        made += 1
print("IGV 风格峰快照产出 %d 张 → qc/igv/" % made)
PY
python3 - <<'PY'
import json, os
qc = {}
if os.path.exists("qc/organelle.tsv"):
    with open("qc/organelle.tsv") as fh:
        for line in fh:
            parts = line.rstrip("\n").split("\t")
            if len(parts) < 5:
                continue
            s, total, mito, chloro, org = parts[:5]
            if int(total):
                entry = qc.setdefault(s, {})
                entry["mito_rate"] = round(int(mito) / int(total), 4)
                entry["chloro_rate"] = round(int(chloro) / int(total), 4)
                entry["organelle_rate"] = round(int(org) / int(total), 4)
if os.path.exists("qc/frip.tsv"):
    with open("qc/frip.tsv") as fh:
        for line in fh:
            s, total, inpeak = line.rstrip("\n").split("\t")
            qc.setdefault(s, {})["FRiP"] = round(int(inpeak) / int(total), 4) if int(total) else None
if os.path.exists("qc/spot.tsv"):
    with open("qc/spot.tsv") as fh:
        for line in fh:
            s, total, inhot = line.rstrip("\n").split("\t")
            qc.setdefault(s, {})["SPOT"] = round(int(inhot) / int(total), 4) if int(total) else None
with open("qc/qc.json", "w") as out:
    json.dump(qc, out, indent=2, ensure_ascii=False)
PY
```

#### 步骤 7/7：生成分析报告

```bash
按 analysis-report 技能模板，基于本流程实际产出生成图文并茂的分析报告（reports/ 下 HTML+MD），回复给出报告与关键图绝对路径
```


---

## ENCODE DNase-seq 分析与质控流程

- 流程 id：`encode-dnaseseq`
- 用途：ENCODE DNase-seq 统一流程：FastQC → Bowtie2/BWA 比对 → 过滤去重 → hotspot2/F-seq 开放区域调用 → SPOT/FRiP 与库复杂度评估。
- 运行参数：`INPUT_DIR`、`BOWTIE2_INDEX`〔可选〕、`REF_FA`〔可选〕、`BLACKLIST`〔可选〕、`CHROM_SIZES`〔可选〕、`ORGANELLE_REGEX`（默认 chrM|chrMT|chrC|chrPt|ChrM|ChrMt|ChrC|ChrPt|mitochondria|chloroplast|plastid）〔可选〕、`QUEUE`（默认 q2680v2）、`THREADS`（默认 8）
- 软件清单（版本钉死）：FastQC=`FastQC/0.11.9`、Bowtie2=`Bowtie2/2.4.5`、SAMtools=`SAMtools/1.17`、Picard=`Picard/2.27.4`、hotspot2〔命令探测〕、BEDTools=`BEDTools/2.30.0`、F-seq（备选）〔命令探测〕〔可选〕
- 参考数据：Bowtie2 索引（index，可留空）、参考基因组 FASTA（genome，可留空）、ENCODE 黑名单区域 BED（other，可留空）、染色体长度表（other，可留空）
- QC 关卡：
  - 第 2 步后 · FastQC 碱基质量与接头含量：达标 Q30 >80%，接头含量 <5%；警告 Q30 70-80% 或接头 5-15%
  - 第 3 步后 · 比对率与细胞器 reads 占比：达标 比对率 >80%，线粒体+叶绿体占比 <20%；警告 比对率 60-80% 或细胞器占比 20-50%
  - 第 5 步后 · SPOT/FRiP 与库复杂度：达标 SPOT≥0.3，NRF≥0.8；警告 SPOT 0.2-0.3

### 步骤与脚本全文

#### 步骤 1/6：环境检查（软件、输入与参考）

> 只读检查：必需软件缺失或输入目录不存在时以非 0 退出；先补齐环境（流程面板支持一键部署）再继续。可选参考留空时由 AI 在后续步骤协助补齐。

```bash
# 环境检查（只读）：确认软件可加载、输入与参考数据就绪。
# 必需项缺失时本步骤以非 0 退出；请先补齐环境（流程面板支持一键部署）再继续。
#BSUB -J dnaseseq_env -n 1 -q {{QUEUE}}
if ! type module >/dev/null 2>&1; then
  for f in /etc/profile.d/modules.sh /etc/profile.d/lmod.sh /usr/share/Modules/init/bash /usr/share/lmod/lmod/init/bash; do
    [ -r "$f" ] && . "$f" >/dev/null 2>&1 && type module >/dev/null 2>&1 && break || true
  done
fi
FAIL=0
check_mod() {
  if module load "$2" >/dev/null 2>&1; then echo "OK   $1 ($2)"; else
    echo "MISS $1 ($2) —— 集群可用版本："; module -t avail "${2%%/*}" 2>&1 | grep -i "${2%%/*}" | head -5 || true
    if [ "$3" = "required" ]; then FAIL=1; fi
  fi
}
check_cmd() {
  if ( eval "$2" ) >/dev/null 2>&1; then echo "OK   $1"; else echo "MISS $1（检查命令：$2）"; if [ "$3" = "required" ]; then FAIL=1; fi; fi
}
check_mod "FastQC" "FastQC/0.11.9" required
check_mod "Bowtie2" "Bowtie2/2.4.5" required
check_mod "SAMtools" "SAMtools/1.17" required
check_mod "Picard" "Picard/2.27.4" required
check_cmd "hotspot2" "command -v hotspot2" required
check_mod "BEDTools" "BEDTools/2.30.0" required
check_cmd "F-seq（备选）" "command -v fseq" optional
echo "--- 输入目录 ---"
case "{{INPUT_DIR}}" in ''|*'{{'*) echo "MISS 未指定输入目录"; FAIL=1 ;;
  *) if [ -d "{{INPUT_DIR}}" ]; then echo "OK   INPUT_DIR={{INPUT_DIR}}"; ls "{{INPUT_DIR}}" | head -5 || true; else echo "MISS 目录 {{INPUT_DIR}}"; FAIL=1; fi ;;
esac
echo "--- 参考数据 ---"
chk_ref() {
  case "$1" in ''|*'{{'*) echo "SKIP $2（未指定，运行时由 AI 协助补齐）"; return 0 ;; esac
  if [ -e "$1" ] || [ -e "$1.1.bt2" ] || [ -e "$1.sa" ] || [ -e "$1.grp" ]; then echo "OK   $2"; else echo "MISS $2: $1（含常见索引后缀均未找到）"; if [ "$4" = "required" ]; then FAIL=1; fi; fi
}
chk_ref "{{BOWTIE2_INDEX}}" "Bowtie2 索引" '' optional
chk_ref "{{REF_FA}}" "参考基因组 FASTA" '' optional
chk_ref "{{BLACKLIST}}" "ENCODE 黑名单区域 BED" '' optional
chk_ref "{{CHROM_SIZES}}" "染色体长度表" '' optional
echo "--- 已加载模块 ---"
module -t list 2>&1 | tail -30 || true
exit $FAIL
```

#### 步骤 2/6：FastQC 原始数据质控

> 写成 dnase_qc.lsf 后 bsub 提交；先看报告再决定后续

```bash
#BSUB -J dnase_qc -n 1 -q {{QUEUE}}
module load FastQC/0.11.9
cd {{INPUT_DIR}} && mkdir -p fastqc_results
fastqc *.fq.gz -o ./fastqc_results -t {{THREADS}}
```

#### 步骤 3/6：Bowtie2 比对、去细胞器与过滤去重

> 写成 dnase_align.lsf 后 bsub 提交；双端数据改 -1/-2；MAPQ≥30 过滤后去细胞器 reads（线粒体+叶绿体，植物样本必去，由 ORGANELLE_REGEX 控制，清空则保留）再 MarkDuplicates 去重；BWA MEM 可作备选比对器；organelle.tsv 记录线粒体/叶绿体/合计占比

```bash
#BSUB -J dnase_align -n {{THREADS}} -q {{QUEUE}}
module load Bowtie2/2.4.5 SAMtools/1.17 Picard/2.27.4
cd {{INPUT_DIR}} && mkdir -p qc
for i in *.fq.gz; do
  s=${i%.fq.gz}
  bowtie2 -p {{THREADS}} --very-sensitive -x {{BOWTIE2_INDEX}} -U "$i" | samtools view -@ {{THREADS}} -b -q 30 -F 1804 - | samtools sort -@ {{THREADS}} -o "${s}.sorted.bam" -
  total=$(samtools view -c "${s}.sorted.bam")
  mito=$(samtools view "${s}.sorted.bam" | grep -cE 'chrM|chrMT|ChrM|ChrMt|mitochondria' || true)
  chloro=$(samtools view "${s}.sorted.bam" | grep -cE 'chrC|chrPt|ChrC|ChrPt|chloroplast|plastid' || true)
  if [ -n "{{ORGANELLE_REGEX}}" ]; then org=$(samtools view "${s}.sorted.bam" | grep -cE "{{ORGANELLE_REGEX}}" || true); else org=0; fi
  echo -e "${s}\t${total}\t${mito}\t${chloro}\t${org}" >> qc/organelle.tsv
  if [ -n "{{ORGANELLE_REGEX}}" ]; then
    samtools view -@ {{THREADS}} -h "${s}.sorted.bam" | { grep -vE "{{ORGANELLE_REGEX}}" || true; } | samtools view -@ {{THREADS}} -b - > "${s}.filt.bam"
  else
    mv "${s}.sorted.bam" "${s}.filt.bam"
  fi
  java -jar $EBROOTPICARD/picard.jar MarkDuplicates I="${s}.filt.bam" O="${s}.dedup.bam" M=qc/"${s}".dup_metrics.txt REMOVE_DUPLICATES=true
  samtools index "${s}.dedup.bam"
done
```

#### 步骤 4/6：hotspot2 开放区域调用

> hotspot2 输出 *.hotspots.fdr0.05 与 peaks；无 hotspot2 时用 F-seq 备选：fseq -b 600 -f 0；mappability 文件缺失先问用户

```bash
#BSUB -J dnase_hotspot -n 1 -q {{QUEUE}}
cd {{INPUT_DIR}} && mkdir -p hotspots
for b in *.dedup.bam; do
  s=${b%.dedup.bam}
  MOPT=""
  [ -s mappability.bed ] && MOPT="-M mappability.bed"
  COPT=""
  case "{{BLACKLIST}}" in *{{*}) ;; *) [ -s "{{BLACKLIST}}" ] && COPT="-C {{BLACKLIST}}" ;; esac
  hotspot2 -c {{CHROM_SIZES}} $MOPT $COPT "$b" hotspots/"${s}"
done
ls hotspots/
```

#### 步骤 5/6：QC：SPOT/FRiP 与库复杂度评估

> 达标：SPOT/FRiP≥0.3（细胞系理想 ≥0.4）、NRF≥0.8；警告：0.2-0.3；hotspot2 自带 SPOT score 与 bedtools 估算互为印证

```bash
#BSUB -J dnase_spot_qc -n 1 -q {{QUEUE}}
module load SAMtools/1.17 BEDTools/2.30.0
cd {{INPUT_DIR}} && mkdir -p qc
for b in *.dedup.bam; do
  s=${b%.dedup.bam}
  total=$(samtools view -c "$b")
  inhot=$(bedtools intersect -a "$b" -b hotspots/"${s}".hotspots.fdr0.05.bed -u | samtools view -c -)
  echo -e "${s}\t${total}\t${inhot}" >> qc/spot.tsv
done
python3 - <<'PY'
import json, os
qc = {}
if os.path.exists("qc/organelle.tsv"):
    with open("qc/organelle.tsv") as fh:
        for line in fh:
            parts = line.rstrip("\n").split("\t")
            if len(parts) < 5:
                continue
            s, total, mito, chloro, org = parts[:5]
            if int(total):
                entry = qc.setdefault(s, {})
                entry["mito_rate"] = round(int(mito) / int(total), 4)
                entry["chloro_rate"] = round(int(chloro) / int(total), 4)
                entry["organelle_rate"] = round(int(org) / int(total), 4)
if os.path.exists("qc/spot.tsv"):
    with open("qc/spot.tsv") as fh:
        for line in fh:
            s, total, inhot = line.rstrip("\n").split("\t")
            qc.setdefault(s, {})["SPOT"] = round(int(inhot) / int(total), 4) if int(total) else None
with open("qc/qc.json", "w") as out:
    json.dump(qc, out, indent=2, ensure_ascii=False)
PY
```

#### 步骤 6/6：生成分析报告

```bash
按 analysis-report 技能模板，基于本流程实际产出生成图文并茂的分析报告（reports/ 下 HTML+MD），回复给出报告与关键图绝对路径
```


---

## ENCODE WGBS 甲基化分析与质控流程

- 流程 id：`encode-wgbs`
- 用途：ENCODE WGBS 统一流程：FastQC → Bismark（bowtie2）比对 → 去重 → 甲基化提取（CpG/CHG/CHH）→ 亚硫酸盐转化率与覆盖度评估。
- 运行参数：`INPUT_DIR`、`BISMARK_INDEX`〔可选〕、`SPIKEIN`〔可选〕、`QUEUE`（默认 q2680v2）、`THREADS`（默认 8）
- 软件清单（版本钉死）：FastQC=`FastQC/0.11.9`、Bismark=`Bismark/0.23.1`、Bowtie2=`Bowtie2/2.4.5`、SAMtools=`SAMtools/1.17`
- 参考数据：Bismark 基因组索引（index，可留空）、lambda DNA spike-in 参考（genome，可留空）
- QC 关卡：
  - 第 2 步后 · FastQC 碱基质量与接头含量：达标 Q30 >80%，接头含量 <5%；警告 Q30 70-80% 或接头 5-15%
  - 第 3 步后 · 比对效率：达标 >70%；警告 50-70%
  - 第 5 步后 · 亚硫酸盐转化率与 CpG 覆盖：达标 转化率 >99%，CpG 覆盖 ≥80%；警告 转化率 97-99%

### 步骤与脚本全文

#### 步骤 1/6：环境检查（软件、输入与参考）

> 只读检查：必需软件缺失或输入目录不存在时以非 0 退出；先补齐环境（流程面板支持一键部署）再继续。可选参考留空时由 AI 在后续步骤协助补齐。

```bash
# 环境检查（只读）：确认软件可加载、输入与参考数据就绪。
# 必需项缺失时本步骤以非 0 退出；请先补齐环境（流程面板支持一键部署）再继续。
#BSUB -J wgbs_env -n 1 -q {{QUEUE}}
if ! type module >/dev/null 2>&1; then
  for f in /etc/profile.d/modules.sh /etc/profile.d/lmod.sh /usr/share/Modules/init/bash /usr/share/lmod/lmod/init/bash; do
    [ -r "$f" ] && . "$f" >/dev/null 2>&1 && type module >/dev/null 2>&1 && break || true
  done
fi
FAIL=0
check_mod() {
  if module load "$2" >/dev/null 2>&1; then echo "OK   $1 ($2)"; else
    echo "MISS $1 ($2) —— 集群可用版本："; module -t avail "${2%%/*}" 2>&1 | grep -i "${2%%/*}" | head -5 || true
    if [ "$3" = "required" ]; then FAIL=1; fi
  fi
}
check_cmd() {
  if ( eval "$2" ) >/dev/null 2>&1; then echo "OK   $1"; else echo "MISS $1（检查命令：$2）"; if [ "$3" = "required" ]; then FAIL=1; fi; fi
}
check_mod "FastQC" "FastQC/0.11.9" required
check_mod "Bismark" "Bismark/0.23.1" required
check_mod "Bowtie2" "Bowtie2/2.4.5" required
check_mod "SAMtools" "SAMtools/1.17" required
echo "--- 输入目录 ---"
case "{{INPUT_DIR}}" in ''|*'{{'*) echo "MISS 未指定输入目录"; FAIL=1 ;;
  *) if [ -d "{{INPUT_DIR}}" ]; then echo "OK   INPUT_DIR={{INPUT_DIR}}"; ls "{{INPUT_DIR}}" | head -5 || true; else echo "MISS 目录 {{INPUT_DIR}}"; FAIL=1; fi ;;
esac
echo "--- 参考数据 ---"
chk_ref() {
  case "$1" in ''|*'{{'*) echo "SKIP $2（未指定，运行时由 AI 协助补齐）"; return 0 ;; esac
  if [ -e "$1" ] || [ -e "$1.1.bt2" ] || [ -e "$1.sa" ] || [ -e "$1.grp" ]; then echo "OK   $2"; else echo "MISS $2: $1（含常见索引后缀均未找到）"; if [ "$4" = "required" ]; then FAIL=1; fi; fi
}
chk_ref "{{BISMARK_INDEX}}" "Bismark 基因组索引" '' optional
chk_ref "{{SPIKEIN}}" "lambda DNA spike-in 参考" '' optional
echo "--- 已加载模块 ---"
module -t list 2>&1 | tail -30 || true
exit $FAIL
```

#### 步骤 2/6：FastQC 原始数据质控

> 写成 wgbs_qc.lsf 后 bsub 提交；先看报告再决定后续

```bash
#BSUB -J wgbs_qc -n 1 -q {{QUEUE}}
module load FastQC/0.11.9
cd {{INPUT_DIR}} && mkdir -p fastqc_results
fastqc *.fq.gz -o ./fastqc_results -t {{THREADS}}
```

#### 步骤 3/6：Bismark 比对

> 写成 wgbs_align.lsf 后 bsub 提交；Bismark 默认调 bowtie2；--parallel 为并行样本数、-p 为每样本线程；单端数据只传 R1

```bash
#BSUB -J wgbs_align -n {{THREADS}} -q {{QUEUE}}
module load Bismark/0.23.1
cd {{INPUT_DIR}} && mkdir -p bam
for i in *_R1.fq.gz; do
  s=${i%_R1.fq.gz}
  bismark --parallel 2 -p {{THREADS}} --genome {{BISMARK_INDEX}} -1 "$i" -2 "${s}_R2.fq.gz" -o bam --temp_dir bam/tmp --basename "${s}"
done
```

#### 步骤 4/6：去重与甲基化提取

> 提取 CpG/CHG/CHH 三种 context；产出 bedGraph/coverage/cytosine report 与 HTML 汇总报告

```bash
#BSUB -J wgbs_extract -n {{THREADS}} -q {{QUEUE}}
module load Bismark/0.23.1
cd {{INPUT_DIR}}/bam
for b in *_bismark_bt2_pe.bam; do
  deduplicate_bismark --paired --bam "$b"
done
for d in *_bismark_bt2_pe.deduplicated.bam; do
  bismark_methylation_extractor --paired-end --bedGraph --counts --cytosine_report --CX_context --genome_folder {{BISMARK_INDEX}} -p --multicore {{THREADS}} "$d"
done
bismark2report
bismark2summary
```

#### 步骤 5/6：QC：转化率、比对效率与覆盖度评估

> 达标：亚硫酸盐转化率 >99%、比对效率 >70%、CpG 覆盖 ≥80% 且平均深度 ≥10×；警告：转化率 97-99%、比对效率 50-70%

```bash
#BSUB -J wgbs_conv_qc -n 1 -q {{QUEUE}}
cd {{INPUT_DIR}}/bam && mkdir -p ../qc
python3 - <<'PY'
import glob, json, os, re
qc = {}
for rep in glob.glob("*_PE_report.txt") + glob.glob("*_SE_report.txt"):
    s = os.path.basename(rep).replace("_PE_report.txt", "").replace("_SE_report.txt", "")
    text = open(rep).read()
    m = re.search(r"Mapping efficiency:\s*([\d.]+)%", text)
    qc[s] = {"mapping_efficiency_pct": float(m.group(1)) if m else None}
qc["_conversion"] = {"rule": "转化率 = 1 - 非 CpG 背景甲基化率；优先用 lambda spike-in（{{SPIKEIN}}）比对结果，无 spike-in 用 CHH 背景", "pass": ">99%", "warn": "97-99%"}
for bg in glob.glob("*.deduplicated.bedGraph.gz"):
    qc.setdefault("_coverage", {})[os.path.basename(bg)] = "zcat 统计非零覆盖 CpG 数，与基因组总 CpG 数比较得覆盖度"
with open("../qc/qc.json", "w") as out:
    json.dump(qc, out, indent=2, ensure_ascii=False)
PY
```

#### 步骤 6/6：生成分析报告

```bash
按 analysis-report 技能模板，基于本流程实际产出生成图文并茂的分析报告（reports/ 下 HTML+MD），回复给出报告与关键图绝对路径
```


---

## ENCODE Hi-C 分析与质控流程

- 流程 id：`encode-hic`
- 用途：ENCODE Hi-C 统一流程：HiC-Pro（bowtie2 比对 → 有效互作对筛选）→ 分辨率矩阵（.cool/.hic）→ 互作图谱 → 有效互作统计评估。
- 运行参数：`INPUT_DIR`、`BOWTIE2_INDEX`〔可选〕、`REF_FA`〔可选〕、`RESTRICTION_SITE`（默认 GATC）、`CHROM_SIZES`〔可选〕、`BIN_SIZES`（默认 10000,40000,100000）、`QUEUE`（默认 q2680v2）、`THREADS`（默认 8）
- 软件清单（版本钉死）：HiC-Pro=`HiC-Pro/3.1.0`、Bowtie2=`Bowtie2/2.4.5`、SAMtools=`SAMtools/1.17`、cooler〔命令探测〕、HiCExplorer〔命令探测〕〔可选〕、juicer_tools〔命令探测〕〔可选〕
- 参考数据：Bowtie2 索引（index，可留空）、参考基因组 FASTA（genome，可留空）、染色体长度表（other，可留空）
- QC 关卡：
  - 第 2 步后 · 有效互作对产出：达标 产出 allValidPairs 且各阶段 *.stat 齐全；警告 有效对比例异常低时先查酶切配置
  - 第 4 步后 · valid pairs 率与顺式占比：达标 valid pairs ≥40%，顺式 >40%，重复率 <30%；警告 valid pairs 25-40% 或重复率 30-50%

### 步骤与脚本全文

#### 步骤 1/6：环境检查（软件、输入与参考）

> 只读检查：必需软件缺失或输入目录不存在时以非 0 退出；先补齐环境（流程面板支持一键部署）再继续。可选参考留空时由 AI 在后续步骤协助补齐。

```bash
# 环境检查（只读）：确认软件可加载、输入与参考数据就绪。
# 必需项缺失时本步骤以非 0 退出；请先补齐环境（流程面板支持一键部署）再继续。
#BSUB -J hic_env -n 1 -q {{QUEUE}}
if ! type module >/dev/null 2>&1; then
  for f in /etc/profile.d/modules.sh /etc/profile.d/lmod.sh /usr/share/Modules/init/bash /usr/share/lmod/lmod/init/bash; do
    [ -r "$f" ] && . "$f" >/dev/null 2>&1 && type module >/dev/null 2>&1 && break || true
  done
fi
FAIL=0
check_mod() {
  if module load "$2" >/dev/null 2>&1; then echo "OK   $1 ($2)"; else
    echo "MISS $1 ($2) —— 集群可用版本："; module -t avail "${2%%/*}" 2>&1 | grep -i "${2%%/*}" | head -5 || true
    if [ "$3" = "required" ]; then FAIL=1; fi
  fi
}
check_cmd() {
  if ( eval "$2" ) >/dev/null 2>&1; then echo "OK   $1"; else echo "MISS $1（检查命令：$2）"; if [ "$3" = "required" ]; then FAIL=1; fi; fi
}
check_mod "HiC-Pro" "HiC-Pro/3.1.0" required
check_mod "Bowtie2" "Bowtie2/2.4.5" required
check_mod "SAMtools" "SAMtools/1.17" required
check_cmd "cooler" "command -v cooler" required
check_cmd "HiCExplorer" "command -v hicFindTADs" optional
check_cmd "juicer_tools" "command -v juicer_tools || ls juicer_tools.jar 2>/dev/null" optional
echo "--- 输入目录 ---"
case "{{INPUT_DIR}}" in ''|*'{{'*) echo "MISS 未指定输入目录"; FAIL=1 ;;
  *) if [ -d "{{INPUT_DIR}}" ]; then echo "OK   INPUT_DIR={{INPUT_DIR}}"; ls "{{INPUT_DIR}}" | head -5 || true; else echo "MISS 目录 {{INPUT_DIR}}"; FAIL=1; fi ;;
esac
echo "--- 参考数据 ---"
chk_ref() {
  case "$1" in ''|*'{{'*) echo "SKIP $2（未指定，运行时由 AI 协助补齐）"; return 0 ;; esac
  if [ -e "$1" ] || [ -e "$1.1.bt2" ] || [ -e "$1.sa" ] || [ -e "$1.grp" ]; then echo "OK   $2"; else echo "MISS $2: $1（含常见索引后缀均未找到）"; if [ "$4" = "required" ]; then FAIL=1; fi; fi
}
chk_ref "{{BOWTIE2_INDEX}}" "Bowtie2 索引" '' optional
chk_ref "{{REF_FA}}" "参考基因组 FASTA" '' optional
chk_ref "{{CHROM_SIZES}}" "染色体长度表" '' optional
echo "--- 已加载模块 ---"
module -t list 2>&1 | tail -30 || true
exit $FAIL
```

#### 步骤 2/6：HiC-Pro 比对与有效互作对筛选

> 写成 hicpro.lsf 后 bsub 提交；产出 allValidPairs（已去自连/dangling end/去重）与各阶段 *.stat 统计

```bash
#BSUB -J hicpro -n {{THREADS}} -q {{QUEUE}}
module load HiC-Pro/3.1.0
# 先用 HiC-Pro 自带 digest_genome.py 由 {{RESTRICTION_SITE}} 生成基因组酶切 BED，再写配置
DIGEST=$(ls *digest*.bed *digestion*.bed 2>/dev/null | head -1 || true)
if [ -z "$DIGEST" ]; then
  echo "SKIP: 缺少酶切位点 BED（由 HiC-Pro 的 digest_genome.py 生成）"
else
cat > hicpro_config.txt <<EOF
BOWTIE2_IDX_PATH = {{BOWTIE2_INDEX}}
REFERENCE_GENOME = {{REF_FA}}
GENOME_FRAGMENT = $DIGEST
LIGATION_SITE = ${LIGATION_SITE:-{{RESTRICTION_SITE}}{{RESTRICTION_SITE}}}
CHROM_SIZE = {{CHROM_SIZES}}
BIN_SIZE = {{BIN_SIZES}}
N_CPU = {{THREADS}}
EOF
HiC-Pro -i {{INPUT_DIR}} -o hicpro_out -c hicpro_config.txt
fi
```

#### 步骤 3/6：分辨率矩阵构建（.cool/.hic）

> 备选：juicer_tools pre 生成 .hic 供 Juicebox 查看；zoomify 默认按 2 的幂生成多分辨率，覆盖 {{BIN_SIZES}} 档位即可

```bash
#BSUB -J hic_matrix -n {{THREADS}} -q {{QUEUE}}
module load cooler
cd hicpro_out/hic_results/data
for d in */; do
  v=$(ls "$d"*.allValidPairs | head -1)
  cooler cload pairs -c1 2 -p1 3 -c2 4 -p2 5 {{CHROM_SIZES}}:1000 "$v" "${d%/}.1000.cool"
  cooler zoomify --balance -p {{THREADS}} -o "${d%/}.mcool" "${d%/}.1000.cool"
done
```

#### 步骤 4/6：QC：有效互作统计评估

> 达标：valid pairs 率 ≥40%、顺式互作占比 >40%、重复率 <30%、顺/反比 >1；同时检查互作距离分布无 dangling/自连残留峰

```bash
#BSUB -J hic_valid_qc -n 1 -q {{QUEUE}}
cd hicpro_out/hic_results && mkdir -p qc
python3 - <<'PY'
import glob, json, os
qc = {}
for stat in glob.glob("**/*stat", recursive=True):
    s = os.path.basename(stat)
    rec = {}
    with open(stat, errors="ignore") as fh:
        for line in fh:
            parts = line.replace(":", " ").split()
            if len(parts) >= 2 and not parts[0].startswith("#"):
                rec[parts[0]] = " ".join(parts[1:])
    if rec:
        qc[s] = rec
with open("qc/qc.json", "w") as out:
    json.dump(qc, out, indent=2, ensure_ascii=False)
PY
ls qc/qc.json
```

#### 步骤 5/6：互作图谱与 TAD/loop 调用（可选）（可选）

> 可选步骤；loop 调用用 juicer HiCCUPS（需 .hic）；TAD 边界重复间 Jaccard 指数可作一致性指标

```bash
#BSUB -J hic_tad -n {{THREADS}} -q {{QUEUE}}
module load HiCExplorer
cd hicpro_out/hic_results/data && mkdir -p tad
if ! ls *.mcool >/dev/null 2>&1; then
  echo "SKIP: 缺少 .mcool 矩阵文件，跳过 TAD/loop 调用"
else
  for mc in *.mcool; do
    sm=${mc%.mcool}
    hicConvertFormat -m "$mc::/resolutions/40000" --inputFormat cool --outputFormat h5 -o "${sm}".40kb.h5
    hicFindTADs -m "${sm}".40kb.h5 --outPrefix tad/"${sm}" --correctForMultipleTesting fdr
    hicPlotMatrix -m "${sm}".40kb.h5 -o tad/"${sm}".matrix.png --log1p --dpi 200
  done
fi
```

#### 步骤 6/6：生成分析报告

```bash
按 analysis-report 技能模板，基于本流程实际产出生成图文并茂的分析报告（reports/ 下 HTML+MD），回复给出报告与关键图绝对路径
```


---

## ENCODE ChIA-PET 分析与质控流程

- 流程 id：`encode-chiapet`
- 用途：ENCODE ChIA-PET 统一流程：linker 鉴定与接头处理 → BWA 比对 → PET 分类与去重 → 环（PET cluster）调用 → 有效连接率与可信度评估。
- 运行参数：`INPUT_DIR`、`BWA_INDEX`〔可选〕、`REF_FA`〔可选〕、`LINKER`〔可选〕、`QUEUE`（默认 q2680v2）、`THREADS`（默认 8）
- 软件清单（版本钉死）：FastQC=`FastQC/0.11.9`、BWA=`BWA/0.7.17`、SAMtools=`SAMtools/1.17`、Mango〔命令探测〕、ChIA-PET2（备选）〔命令探测〕〔可选〕
- 参考数据：BWA 索引（index，可留空）、参考基因组 FASTA（genome，可留空）
- QC 关卡：
  - 第 2 步后 · FastQC 碱基质量与接头含量：达标 Q30 >80%，接头含量 <5%；警告 Q30 70-80% 或接头 5-15%
  - 第 5 步后 · 有效连接率与环可信度：达标 互连 PET 占比 >10%，重复率 <30%；警告 连接率 5-10% 或重复率 30-50%

### 步骤与脚本全文

#### 步骤 1/6：环境检查（软件、输入与参考）

> 只读检查：必需软件缺失或输入目录不存在时以非 0 退出；先补齐环境（流程面板支持一键部署）再继续。可选参考留空时由 AI 在后续步骤协助补齐。

```bash
# 环境检查（只读）：确认软件可加载、输入与参考数据就绪。
# 必需项缺失时本步骤以非 0 退出；请先补齐环境（流程面板支持一键部署）再继续。
#BSUB -J chiapet_env -n 1 -q {{QUEUE}}
if ! type module >/dev/null 2>&1; then
  for f in /etc/profile.d/modules.sh /etc/profile.d/lmod.sh /usr/share/Modules/init/bash /usr/share/lmod/lmod/init/bash; do
    [ -r "$f" ] && . "$f" >/dev/null 2>&1 && type module >/dev/null 2>&1 && break || true
  done
fi
FAIL=0
check_mod() {
  if module load "$2" >/dev/null 2>&1; then echo "OK   $1 ($2)"; else
    echo "MISS $1 ($2) —— 集群可用版本："; module -t avail "${2%%/*}" 2>&1 | grep -i "${2%%/*}" | head -5 || true
    if [ "$3" = "required" ]; then FAIL=1; fi
  fi
}
check_cmd() {
  if ( eval "$2" ) >/dev/null 2>&1; then echo "OK   $1"; else echo "MISS $1（检查命令：$2）"; if [ "$3" = "required" ]; then FAIL=1; fi; fi
}
check_mod "FastQC" "FastQC/0.11.9" required
check_mod "BWA" "BWA/0.7.17" required
check_mod "SAMtools" "SAMtools/1.17" required
check_cmd "Mango" "command -v mango || ls Mango*.jar 2>/dev/null" required
check_cmd "ChIA-PET2（备选）" "command -v ChIA-PET2" optional
echo "--- 输入目录 ---"
case "{{INPUT_DIR}}" in ''|*'{{'*) echo "MISS 未指定输入目录"; FAIL=1 ;;
  *) if [ -d "{{INPUT_DIR}}" ]; then echo "OK   INPUT_DIR={{INPUT_DIR}}"; ls "{{INPUT_DIR}}" | head -5 || true; else echo "MISS 目录 {{INPUT_DIR}}"; FAIL=1; fi ;;
esac
echo "--- 参考数据 ---"
chk_ref() {
  case "$1" in ''|*'{{'*) echo "SKIP $2（未指定，运行时由 AI 协助补齐）"; return 0 ;; esac
  if [ -e "$1" ] || [ -e "$1.1.bt2" ] || [ -e "$1.sa" ] || [ -e "$1.grp" ]; then echo "OK   $2"; else echo "MISS $2: $1（含常见索引后缀均未找到）"; if [ "$4" = "required" ]; then FAIL=1; fi; fi
}
chk_ref "{{BWA_INDEX}}" "BWA 索引" '' optional
chk_ref "{{REF_FA}}" "参考基因组 FASTA" '' optional
echo "--- 已加载模块 ---"
module -t list 2>&1 | tail -30 || true
exit $FAIL
```

#### 步骤 2/6：FastQC 原始数据质控

> 写成 chiapet_qc.lsf 后 bsub 提交；先看报告再决定后续

```bash
#BSUB -J chiapet_qc -n 1 -q {{QUEUE}}
module load FastQC/0.11.9
cd {{INPUT_DIR}} && mkdir -p fastqc_results
fastqc *.fq.gz -o ./fastqc_results -t {{THREADS}}
```

#### 步骤 3/6：linker 鉴定与 BWA 比对

> linker 鉴定结果（半 linker 组成）同时是文库质量指标；比对用 linker 处理后的 clean reads

```bash
#BSUB -J chiapet_map -n {{THREADS}} -q {{QUEUE}}
module load BWA/0.7.17 SAMtools/1.17
cd {{INPUT_DIR}}
# 先按 {{LINKER}} 序列鉴定并去除 linker（ChIA-PET Tool 或自写脚本）；linker 未确认前不要直接比对
for i in *_R1.fq.gz; do
  s=${i%_R1.fq.gz}
  bwa mem -t {{THREADS}} {{BWA_INDEX}} "$i" "${s}_R2.fq.gz" | samtools sort -@ {{THREADS}} -o "${s}.sorted.bam" -
done
```

#### 步骤 4/6：PET 分类、去重与环调用

> 自连 PET（同片段短距离）剔除，互连 PET 聚类成环；FDR 默认 0.05；备选 ChIA-PET2 全流程；Mango/ChIA-PET2 缺失时先问用户安装方式

```bash
#BSUB -J chiapet_loop -n {{THREADS}} -q {{QUEUE}}
cd {{INPUT_DIR}} && mkdir -p loops
# Mango 流程：PET 分类（自连/互连）→ 去 PCR 重复 → 峰调用 → PET cluster 显著性检验（stage 1-5 按 Mango 手册串行执行）
MANGO_JAR=${MANGO_JAR:-${EBROOTMANGO:+$EBROOTMANGO/Mango.jar}}
for b in *.sorted.bam; do
  s=${b%.sorted.bam}
  java -jar "${MANGO_JAR:?需要设置 MANGO_JAR 环境变量指向 Mango.jar（module load Mango 后通常在 $EBROOTMANGO 下）}" "$b" {{REF_FA}} loops/"${s}"
done
ls loops/
```

#### 步骤 5/6：QC：有效连接率与 PET cluster 可信度

> 达标：有效连接率（互连 PET 占比）>10%、重复率 <30%、高可信 cluster（≥3 PET 支持）重复间可重复；警告：连接率 5-10%、重复率 30-50%

```bash
#BSUB -J chiapet_link_qc -n 1 -q {{QUEUE}}
cd {{INPUT_DIR}} && mkdir -p qc
python3 - <<'PY'
import glob, json, os
qc = {}
for log in glob.glob("loops/*.log") + glob.glob("loops/*.stat*"):
    with open(log, errors="ignore") as fh:
        qc[os.path.basename(log)] = fh.read()[:4000]
for bedpe in glob.glob("loops/*interactions*.bedpe"):
    n_fdr = total = 0
    with open(bedpe) as fh:
        for line in fh:
            if line.startswith("#") or not line.strip():
                continue
            total += 1
            cols = line.rstrip("\n").split("\t")
            try:
                if float(cols[-1]) <= 0.05:
                    n_fdr += 1
            except ValueError:
                continue
    qc[os.path.basename(bedpe)] = {"total_clusters": total, "fdr_le_0.05": n_fdr}
with open("qc/qc.json", "w") as out:
    json.dump(qc, out, indent=2, ensure_ascii=False)
PY
```

#### 步骤 6/6：生成分析报告

```bash
按 analysis-report 技能模板，基于本流程实际产出生成图文并茂的分析报告（reports/ 下 HTML+MD），回复给出报告与关键图绝对路径
```


---

## ENCODE miRNA-seq 分析与质控流程

- 流程 id：`encode-mirnaseq`
- 用途：ENCODE miRNA-seq 统一流程：FastQC → cutadapt 去接头与长度筛选（15-35nt）→ miRDeep2/miRBase 定量（counts per miRNA）→ 长度分布与映射率评估。
- 运行参数：`INPUT_DIR`、`ADAPTER`（默认 TGGAATTCTCGGGTGCCAAGG）、`MIRBASE`〔可选〕、`REF_FA`〔可选〕、`QUEUE`（默认 q2680v2）、`THREADS`（默认 8）、`SPECIES`（默认 hsa）〔可选〕
- 软件清单（版本钉死）：FastQC=`FastQC/0.11.9`、cutadapt=`cutadapt/4.4`、miRDeep2〔命令探测〕、Bowtie2（备选定量/污染评估）=`Bowtie2/2.4.5`〔可选〕
- 参考数据：miRBase（hairpin.fa / mature.fa）（database，可留空）、参考基因组 FASTA（genome，可留空）
- QC 关卡：
  - 第 2 步后 · FastQC 碱基质量与接头含量：达标 Q30 >80%；警告 Q30 70-80%
  - 第 3 步后 · 接头去除率与长度分布：达标 接头去除率 >95%，15-35nt 占比 >70%；警告 15-35nt 占比 50-70%
  - 第 5 步后 · miRNA 映射率与污染：达标 映射率 >50%，rRNA/tRNA 污染 <10%；警告 映射率 30-50%

### 步骤与脚本全文

#### 步骤 1/6：环境检查（软件、输入与参考）

> 只读检查：必需软件缺失或输入目录不存在时以非 0 退出；先补齐环境（流程面板支持一键部署）再继续。可选参考留空时由 AI 在后续步骤协助补齐。

```bash
# 环境检查（只读）：确认软件可加载、输入与参考数据就绪。
# 必需项缺失时本步骤以非 0 退出；请先补齐环境（流程面板支持一键部署）再继续。
#BSUB -J mirnaseq_env -n 1 -q {{QUEUE}}
if ! type module >/dev/null 2>&1; then
  for f in /etc/profile.d/modules.sh /etc/profile.d/lmod.sh /usr/share/Modules/init/bash /usr/share/lmod/lmod/init/bash; do
    [ -r "$f" ] && . "$f" >/dev/null 2>&1 && type module >/dev/null 2>&1 && break || true
  done
fi
FAIL=0
check_mod() {
  if module load "$2" >/dev/null 2>&1; then echo "OK   $1 ($2)"; else
    echo "MISS $1 ($2) —— 集群可用版本："; module -t avail "${2%%/*}" 2>&1 | grep -i "${2%%/*}" | head -5 || true
    if [ "$3" = "required" ]; then FAIL=1; fi
  fi
}
check_cmd() {
  if ( eval "$2" ) >/dev/null 2>&1; then echo "OK   $1"; else echo "MISS $1（检查命令：$2）"; if [ "$3" = "required" ]; then FAIL=1; fi; fi
}
check_mod "FastQC" "FastQC/0.11.9" required
check_mod "cutadapt" "cutadapt/4.4" required
check_cmd "miRDeep2" "command -v quantifier.pl" required
check_mod "Bowtie2（备选定量/污染评估）" "Bowtie2/2.4.5" optional
echo "--- 输入目录 ---"
case "{{INPUT_DIR}}" in ''|*'{{'*) echo "MISS 未指定输入目录"; FAIL=1 ;;
  *) if [ -d "{{INPUT_DIR}}" ]; then echo "OK   INPUT_DIR={{INPUT_DIR}}"; ls "{{INPUT_DIR}}" | head -5 || true; else echo "MISS 目录 {{INPUT_DIR}}"; FAIL=1; fi ;;
esac
echo "--- 参考数据 ---"
chk_ref() {
  case "$1" in ''|*'{{'*) echo "SKIP $2（未指定，运行时由 AI 协助补齐）"; return 0 ;; esac
  if [ -e "$1" ] || [ -e "$1.1.bt2" ] || [ -e "$1.sa" ] || [ -e "$1.grp" ]; then echo "OK   $2"; else echo "MISS $2: $1（含常见索引后缀均未找到）"; if [ "$4" = "required" ]; then FAIL=1; fi; fi
}
chk_ref "{{MIRBASE}}" "miRBase（hairpin.fa / mature.fa）" '' optional
chk_ref "{{REF_FA}}" "参考基因组 FASTA" '' optional
echo "--- 已加载模块 ---"
module -t list 2>&1 | tail -30 || true
exit $FAIL
```

#### 步骤 2/6：FastQC 原始数据质控

> 写成 mirna_qc.lsf 后 bsub 提交；重点看过量序列（接头）与长度分布

```bash
#BSUB -J mirna_qc -n 1 -q {{QUEUE}}
module load FastQC/0.11.9
cd {{INPUT_DIR}} && mkdir -p fastqc_results
fastqc *.fq.gz -o ./fastqc_results -t {{THREADS}}
```

#### 步骤 3/6：cutadapt 去接头与长度筛选

> 保留 15-35nt；cutadapt.log 含接头去除率，纳入 QC

```bash
#BSUB -J mirna_trim -n {{THREADS}} -q {{QUEUE}}
module load cutadapt/4.4
cd {{INPUT_DIR}} && mkdir -p trimmed
for i in *.fq.gz; do
  s=${i%.fq.gz}
  cutadapt -j {{THREADS}} -a {{ADAPTER}} -m 15 -M 35 -o trimmed/"${s}".trimmed.fq.gz "$i" > trimmed/"${s}".cutadapt.log
done
```

#### 步骤 4/6：miRNA 定量（miRDeep2/miRBase）

> 产出 counts per miRNA（miRNAs_expressed_all_samples_*.csv）；备选：bowtie2 比对 mature.fa 后按 miRNA 计数

```bash
#BSUB -J mirna_quant -n {{THREADS}} -q {{QUEUE}}
module load miRDeep2 Bowtie2/2.4.5
cd {{INPUT_DIR}} && mkdir -p mirdeep2
for i in trimmed/*.trimmed.fq.gz; do
  s=$(basename "$i" .trimmed.fq.gz)
  zcat "$i" > mirdeep2/"${s}".fq
  mapper.pl mirdeep2/"${s}".fq -e -h -m -s mirdeep2/"${s}"_collapsed.fa
  quantifier.pl -p {{MIRBASE}}/hairpin.fa -m {{MIRBASE}}/mature.fa -r mirdeep2/"${s}"_collapsed.fa -t {{SPECIES}} -y "${s}"
done
ls mirdeep2/
```

#### 步骤 5/6：QC：长度分布、映射率与污染评估

> 达标：15-35nt 占比 >70%、miRNA 映射率 >50%、rRNA/tRNA 污染 <10%、接头去除率 >95%；污染率用 bowtie2 对 rRNA/tRNA 库比对评估

```bash
#BSUB -J mirna_len_qc -n 1 -q {{QUEUE}}
cd {{INPUT_DIR}} && mkdir -p qc
python3 - <<'PY'
import glob, gzip, json, os
qc = {}
for fq in glob.glob("trimmed/*.trimmed.fq.gz"):
    s = os.path.basename(fq).replace(".trimmed.fq.gz", "")
    total = inrange = 0
    with gzip.open(fq, "rt") as fh:
        for i, line in enumerate(fh):
            if i % 4 == 1:
                total += 1
                if 15 <= len(line.rstrip("\n")) <= 35:
                    inrange += 1
    adapter = None
    log = os.path.join("trimmed", s + ".cutadapt.log")
    if os.path.exists(log):
        with open(log) as fh:
            for line in fh:
                if line.startswith("Reads with adapters"):
                    adapter = line.strip()
    qc[s] = {"total_reads": total, "len_15_35": inrange, "len_15_35_rate": round(inrange / total, 4) if total else None, "cutadapt_adapters": adapter}
with open("qc/qc.json", "w") as out:
    json.dump(qc, out, indent=2, ensure_ascii=False)
PY
```

#### 步骤 6/6：生成分析报告

```bash
按 analysis-report 技能模板，基于本流程实际产出生成图文并茂的分析报告（reports/ 下 HTML+MD），回复给出报告与关键图绝对路径
```


---

## ENCODE eCLIP 分析与质控流程

- 流程 id：`encode-eclip`
- 用途：ENCODE eCLIP 统一流程：cutadapt 去接头 → STAR 比对 → UMI 去 PCR 重复 → CLIPper 峰调用（input 对照归一化）→ 重复间可重复峰评估。
- 运行参数：`INPUT_DIR`、`CONTROL_DIR`〔可选〕、`STAR_INDEX`〔可选〕、`GTF`〔可选〕、`ADAPTER`（默认 AGATCGGAAGAGC）、`QUEUE`（默认 q2680v2）、`THREADS`（默认 8）、`SPECIES`（默认 hg38）〔可选〕
- 软件清单（版本钉死）：cutadapt=`cutadapt/4.4`、STAR=`STAR/2.7.10b`、SAMtools=`SAMtools/1.17`、umi_tools〔命令探测〕、CLIPper〔命令探测〕、BEDTools=`BEDTools/2.30.0`
- 参考数据：STAR 基因组索引（index，可留空）、基因注释 GTF（annotation，可留空）
- QC 关卡：
  - 第 3 步后 · 比对率：达标 >60%；警告 40-60%
  - 第 4 步后 · PCR 重复率：达标 <60%；警告 60-80%
  - 第 6 步后 · 重复间可重复峰：达标 可重复峰占比 ≥50%；警告 30-50%

### 步骤与脚本全文

#### 步骤 1/7：环境检查（软件、输入与参考）

> 只读检查：必需软件缺失或输入目录不存在时以非 0 退出；先补齐环境（流程面板支持一键部署）再继续。可选参考留空时由 AI 在后续步骤协助补齐。

```bash
# 环境检查（只读）：确认软件可加载、输入与参考数据就绪。
# 必需项缺失时本步骤以非 0 退出；请先补齐环境（流程面板支持一键部署）再继续。
#BSUB -J eclip_env -n 1 -q {{QUEUE}}
if ! type module >/dev/null 2>&1; then
  for f in /etc/profile.d/modules.sh /etc/profile.d/lmod.sh /usr/share/Modules/init/bash /usr/share/lmod/lmod/init/bash; do
    [ -r "$f" ] && . "$f" >/dev/null 2>&1 && type module >/dev/null 2>&1 && break || true
  done
fi
FAIL=0
check_mod() {
  if module load "$2" >/dev/null 2>&1; then echo "OK   $1 ($2)"; else
    echo "MISS $1 ($2) —— 集群可用版本："; module -t avail "${2%%/*}" 2>&1 | grep -i "${2%%/*}" | head -5 || true
    if [ "$3" = "required" ]; then FAIL=1; fi
  fi
}
check_cmd() {
  if ( eval "$2" ) >/dev/null 2>&1; then echo "OK   $1"; else echo "MISS $1（检查命令：$2）"; if [ "$3" = "required" ]; then FAIL=1; fi; fi
}
check_mod "cutadapt" "cutadapt/4.4" required
check_mod "STAR" "STAR/2.7.10b" required
check_mod "SAMtools" "SAMtools/1.17" required
check_cmd "umi_tools" "command -v umi_tools" required
check_cmd "CLIPper" "command -v clipper" required
check_mod "BEDTools" "BEDTools/2.30.0" required
echo "--- 输入目录 ---"
case "{{INPUT_DIR}}" in ''|*'{{'*) echo "MISS 未指定输入目录"; FAIL=1 ;;
  *) if [ -d "{{INPUT_DIR}}" ]; then echo "OK   INPUT_DIR={{INPUT_DIR}}"; ls "{{INPUT_DIR}}" | head -5 || true; else echo "MISS 目录 {{INPUT_DIR}}"; FAIL=1; fi ;;
esac
case "{{CONTROL_DIR}}" in ''|*'{{'*) echo "SKIP CONTROL_DIR（未指定，可选）" ;;
  *) if [ -d "{{CONTROL_DIR}}" ]; then echo "OK   CONTROL_DIR={{CONTROL_DIR}}"; ls "{{CONTROL_DIR}}" | head -5 || true; else echo "MISS 目录 {{CONTROL_DIR}}"; FAIL=1; fi ;;
esac
echo "--- 参考数据 ---"
chk_ref() {
  case "$1" in ''|*'{{'*) echo "SKIP $2（未指定，运行时由 AI 协助补齐）"; return 0 ;; esac
  if [ -e "$1" ] || [ -e "$1.1.bt2" ] || [ -e "$1.sa" ] || [ -e "$1.grp" ]; then echo "OK   $2"; else echo "MISS $2: $1（含常见索引后缀均未找到）"; if [ "$4" = "required" ]; then FAIL=1; fi; fi
}
chk_ref "{{STAR_INDEX}}" "STAR 基因组索引" '' optional
chk_ref "{{GTF}}" "基因注释 GTF" '' optional
echo "--- 已加载模块 ---"
module -t list 2>&1 | tail -30 || true
exit $FAIL
```

#### 步骤 2/7：cutadapt 去接头（双轮）

> 双轮去接头降低接头二聚体；UMI 在 reads 5' 端，比对后由 umi_tools 处理

```bash
#BSUB -J eclip_trim -n {{THREADS}} -q {{QUEUE}}
module load cutadapt/4.4
cd {{INPUT_DIR}} && mkdir -p trimmed
for i in *.fq.gz; do
  s=${i%.fq.gz}
  cutadapt -j {{THREADS}} -a {{ADAPTER}} -m 18 --times 2 -o trimmed/"${s}".trimmed.fq.gz "$i" > trimmed/"${s}".cutadapt.log
done
```

#### 步骤 3/7：STAR 比对

> --outFilterMultimapNmax 1 保留唯一比对；重复元件相关 RBP 可放宽并按家族统计

```bash
#BSUB -J eclip_align -n {{THREADS}} -q {{QUEUE}}
module load STAR/2.7.10b
cd {{INPUT_DIR}}
for i in trimmed/*.trimmed.fq.gz; do
  s=$(basename "$i" .trimmed.fq.gz)
  STAR --runThreadN {{THREADS}} --genomeDir {{STAR_INDEX}} --readFilesIn "$i" --readFilesCommand zcat --outSAMtype BAM SortedByCoordinate --outFilterMultimapNmax 1 --outFilterMismatchNmax 2 --outFileNamePrefix "${s}."
done
```

#### 步骤 4/7：UMI 去 PCR 重复

> 若 UMI 未在 read name 中，先 umi_tools extract --bc-pattern=NNNNNNNNNN；dedup log 给出 PCR 重复率

```bash
#BSUB -J eclip_dedup -n 1 -q {{QUEUE}}
module load SAMtools/1.17 umi_tools
cd {{INPUT_DIR}} && mkdir -p qc
for b in *.Aligned.sortedByCoord.out.bam; do
  s=${b%.Aligned.sortedByCoord.out.bam}
  samtools index "$b"
  umi_tools dedup --stdin="$b" --stdout="${s}.dedup.bam" --log=qc/"${s}".umi_dedup.log
  samtools index "${s}.dedup.bam"
done
```

#### 步骤 5/7：CLIPper 峰调用与 input 归一化

> 归一化过滤阈值：log2 fold enrichment ≥3 且 -log10(p) ≥3；无 SMInput 对照时只给 IP 峰并显式标注

```bash
#BSUB -J eclip_peak -n {{THREADS}} -q {{QUEUE}}
cd {{INPUT_DIR}} && mkdir -p peaks
CTRL=$(ls {{CONTROL_DIR}}/*.dedup.bam 2>/dev/null | head -1 || true)
for b in *.dedup.bam; do
  s=${b%.dedup.bam}
  clipper --bam "$b" --species {{SPECIES}} --outfile peaks/"${s}".peak_clusters.bed
  if [ -n "$CTRL" ] && command -v overlap_peakfi_with_bam.pl >/dev/null 2>&1; then
    overlap_peakfi_with_bam.pl "$b" "$CTRL" peaks/"${s}".peak_clusters.bed peaks/"${s}".normalized_peaks.bed
  else
    echo "SKIP: 未找到 ENCODE eCLIP 归一化脚本 overlap_peakfi_with_bam.pl 或无 SMInput 对照，以未归一化峰代替（${s}）"
    cp peaks/"${s}".peak_clusters.bed peaks/"${s}".normalized_peaks.bed
  fi
done
```

#### 步骤 6/7：QC：PCR 重复率、富集倍数与重复可重复峰

> 达标：PCR 重复率 <60%、归一化富集峰数充足、重复间可重复峰占比 ≥50%；警告：重复率 60-80%、可重复 30-50%

```bash
#BSUB -J eclip_rep_qc -n 1 -q {{QUEUE}}
module load BEDTools/2.30.0
cd {{INPUT_DIR}} && mkdir -p qc
mapfile -t NP < <(ls peaks/*.normalized_peaks.bed 2>/dev/null || ls *.normalized_peaks.bed 2>/dev/null)
if [ "${#NP[@]}" -lt 2 ]; then
  echo "SKIP: 需要至少 2 个重复的 normalized_peaks 才能做一致性统计"
else
  bedtools intersect -a "${NP[0]}" -b "${NP[1]}" -f 0.5 -r -u | wc -l > qc/rep_overlap.txt
fi
python3 - <<'PY'
import glob, json, os
qc = {}
for log in glob.glob("qc/*.umi_dedup.log"):
    s = os.path.basename(log).replace(".umi_dedup.log", "")
    with open(log) as fh:
        lines = fh.read().strip().splitlines()
    qc[s] = {"umi_dedup_last_line": lines[-1] if lines else None}
for bed in glob.glob("peaks/*.normalized_peaks.bed"):
    with open(bed) as fh:
        qc.setdefault("_peaks", {})[os.path.basename(bed)] = sum(1 for line in fh if line.strip())
with open("qc/qc.json", "w") as out:
    json.dump(qc, out, indent=2, ensure_ascii=False)
PY
```

#### 步骤 7/7：生成分析报告

```bash
按 analysis-report 技能模板，基于本流程实际产出生成图文并茂的分析报告（reports/ 下 HTML+MD），回复给出报告与关键图绝对路径
```


---

## ENCODE 长读长 RNA-seq 分析与质控流程

- 流程 id：`encode-longread-rnaseq`
- 用途：ENCODE 长读长 RNA-seq 统一流程：minimap2 比对（PacBio/ONT）→ TALON/FLAIR 转录本组装 → 定量与 novel isoform 注释 → 比对率、全长比例与饱和度评估。
- 运行参数：`INPUT_DIR`、`PLATFORM`（默认 pacbio）、`REF_FA`〔可选〕、`GTF`〔可选〕、`QUEUE`（默认 q2680v2）、`THREADS`（默认 8）、`GENOME_BUILD`（默认 hg38）〔可选〕、`ANNOTATION_NAME`（默认 gencode）〔可选〕
- 软件清单（版本钉死）：minimap2=`minimap2/2.26`、SAMtools=`SAMtools/1.17`、TALON〔命令探测〕、FLAIR（备选）〔命令探测〕〔可选〕
- 参考数据：参考基因组 FASTA（genome，可留空）、基因注释 GTF（annotation，可留空）
- QC 关卡：
  - 第 2 步后 · 比对率：达标 >80%；警告 60-80%
  - 第 4 步后 · 全长比例与 novel isoform：达标 全长 >50%，novel <40%；警告 全长 30-50%

### 步骤与脚本全文

#### 步骤 1/5：环境检查（软件、输入与参考）

> 只读检查：必需软件缺失或输入目录不存在时以非 0 退出；先补齐环境（流程面板支持一键部署）再继续。可选参考留空时由 AI 在后续步骤协助补齐。

```bash
# 环境检查（只读）：确认软件可加载、输入与参考数据就绪。
# 必需项缺失时本步骤以非 0 退出；请先补齐环境（流程面板支持一键部署）再继续。
#BSUB -J longread_rnaseq_env -n 1 -q {{QUEUE}}
if ! type module >/dev/null 2>&1; then
  for f in /etc/profile.d/modules.sh /etc/profile.d/lmod.sh /usr/share/Modules/init/bash /usr/share/lmod/lmod/init/bash; do
    [ -r "$f" ] && . "$f" >/dev/null 2>&1 && type module >/dev/null 2>&1 && break || true
  done
fi
FAIL=0
check_mod() {
  if module load "$2" >/dev/null 2>&1; then echo "OK   $1 ($2)"; else
    echo "MISS $1 ($2) —— 集群可用版本："; module -t avail "${2%%/*}" 2>&1 | grep -i "${2%%/*}" | head -5 || true
    if [ "$3" = "required" ]; then FAIL=1; fi
  fi
}
check_cmd() {
  if ( eval "$2" ) >/dev/null 2>&1; then echo "OK   $1"; else echo "MISS $1（检查命令：$2）"; if [ "$3" = "required" ]; then FAIL=1; fi; fi
}
check_mod "minimap2" "minimap2/2.26" required
check_mod "SAMtools" "SAMtools/1.17" required
check_cmd "TALON" "command -v talon_initialize_database" required
check_cmd "FLAIR（备选）" "command -v flair" optional
echo "--- 输入目录 ---"
case "{{INPUT_DIR}}" in ''|*'{{'*) echo "MISS 未指定输入目录"; FAIL=1 ;;
  *) if [ -d "{{INPUT_DIR}}" ]; then echo "OK   INPUT_DIR={{INPUT_DIR}}"; ls "{{INPUT_DIR}}" | head -5 || true; else echo "MISS 目录 {{INPUT_DIR}}"; FAIL=1; fi ;;
esac
echo "--- 参考数据 ---"
chk_ref() {
  case "$1" in ''|*'{{'*) echo "SKIP $2（未指定，运行时由 AI 协助补齐）"; return 0 ;; esac
  if [ -e "$1" ] || [ -e "$1.1.bt2" ] || [ -e "$1.sa" ] || [ -e "$1.grp" ]; then echo "OK   $2"; else echo "MISS $2: $1（含常见索引后缀均未找到）"; if [ "$4" = "required" ]; then FAIL=1; fi; fi
}
chk_ref "{{REF_FA}}" "参考基因组 FASTA" '' optional
chk_ref "{{GTF}}" "基因注释 GTF" '' optional
echo "--- 已加载模块 ---"
module -t list 2>&1 | tail -30 || true
exit $FAIL
```

#### 步骤 2/5：minimap2 比对与排序

> {{PLATFORM}}=pacbio 且为 HiFi/CCS 时用 -ax splice:hq；ONT 用 -ax splice；输入为 BAM 时先 samtools fastq 转换

```bash
#BSUB -J lrrna_align -n {{THREADS}} -q {{QUEUE}}
module load minimap2/2.26 SAMtools/1.17
cd {{INPUT_DIR}}
for i in *.fq.gz; do
  s=${i%.fq.gz}
  minimap2 -t {{THREADS}} -ax splice -uf --secondary=no {{REF_FA}} "$i" | samtools sort -@ {{THREADS}} -o "${s}.sorted.bam" -
  samtools index "${s}.sorted.bam"
done
```

#### 步骤 3/5：TALON/FLAIR 转录本组装与定量

> novel isoform 由 TALON 自动注释（Known/ISM/NIC/NNC）；备选：flair collapse；build/注释名与 {{REF_FA}}/{{GTF}} 版本一致

```bash
#BSUB -J lrrna_talon -n {{THREADS}} -q {{QUEUE}}
module load SAMtools/1.17
cd {{INPUT_DIR}} && mkdir -p talon
talon_initialize_database --f {{GTF}} --g {{GENOME_BUILD}} --a {{ANNOTATION_NAME}} --o talon/talon_db
rm -f talon/config.csv
for b in *.sorted.bam; do
  s=${b%.sorted.bam}
  samtools view -h -o talon/"${s}".sam "$b"
  case "{{PLATFORM}}" in [Oo][Nn][Tt]) PLAT=ONT ;; *) PLAT=PacBio ;; esac
  printf '%s,%s,%s,%s\n' "${s}" "${s}" "$PLAT" talon/"${s}".sam >> talon/config.csv
done
talon --f talon/config.csv --db talon/talon_db.db --build {{GENOME_BUILD}} --threads {{THREADS}} --o talon/run
talon_create_abundance_file --db talon/talon_db.db -a {{ANNOTATION_NAME}} --build {{GENOME_BUILD}} --o talon/abundance
ls talon/
```

#### 步骤 4/5：QC：比对率、全长比例与 novel isoform 评估

> 达标：比对率 >80%、全长转录本比例 >50%、novel isoform 比例合理（一般 <40%）；饱和度曲线用抽稀 reads 重跑 TALON 评估

```bash
#BSUB -J lrrna_full_qc -n 1 -q {{QUEUE}}
module load SAMtools/1.17
cd {{INPUT_DIR}} && mkdir -p qc
for b in *.sorted.bam; do
  s=${b%.sorted.bam}
  samtools flagstat "$b" > qc/"${s}".flagstat.txt
done
python3 - <<'PY'
import glob, json, os
qc = {}
for f in glob.glob("qc/*.flagstat.txt"):
    s = os.path.basename(f).replace(".flagstat.txt", "")
    total = mapped = 0
    with open(f) as fh:
        for line in fh:
            if "in total" in line:
                total = int(line.split()[0])
            elif "mapped (" in line and "primary" not in line:
                mapped = int(line.split()[0])
    qc[s] = {"total_reads": total, "mapped": mapped, "mapping_rate": round(mapped / total, 4) if total else None}
annot = glob.glob("talon/*_talon_read_annot.tsv")
if annot:
    known = novel = 0
    with open(annot[0]) as fh:
        header = fh.readline().rstrip("\n").split("\t")
        idx = header.index("transcript_novelty") if "transcript_novelty" in header else -1
        for line in fh:
            if idx < 0:
                break
            if line.rstrip("\n").split("\t")[idx] == "Known":
                known += 1
            else:
                novel += 1
    qc["_isoform"] = {"known": known, "novel": novel, "novel_rate": round(novel / (known + novel), 4) if known + novel else None}
with open("qc/qc.json", "w") as out:
    json.dump(qc, out, indent=2, ensure_ascii=False)
PY
```

#### 步骤 5/5：生成分析报告

```bash
按 analysis-report 技能模板，基于本流程实际产出生成图文并茂的分析报告（reports/ 下 HTML+MD），回复给出报告与关键图绝对路径
```


---

## ENCODE RAMPAGE 分析与质控流程

- 流程 id：`encode-rampage`
- 用途：ENCODE RAMPAGE 统一流程：FastQC → STAR 比对 → TSS 峰识别与启动子定量 → 5' 端特异性、TSS 峰信噪比与重复一致性评估。
- 运行参数：`INPUT_DIR`、`STAR_INDEX`〔可选〕、`GTF`〔可选〕、`REF_FA`〔可选〕、`QUEUE`（默认 q2680v2）、`THREADS`（默认 8）
- 软件清单（版本钉死）：FastQC=`FastQC/0.11.9`、STAR=`STAR/2.7.10b`、SAMtools=`SAMtools/1.17`、BEDTools=`BEDTools/2.30.0`、HOMER（TSS 峰聚类备选）〔命令探测〕〔可选〕、Paraclu（TSS 峰聚类备选）〔命令探测〕〔可选〕
- 参考数据：STAR 基因组索引（index，可留空）、基因注释 GTF（annotation，可留空）、参考基因组 FASTA（genome，可留空）
- QC 关卡：
  - 第 2 步后 · FastQC 碱基质量与接头含量：达标 Q30 >80%，接头含量 <5%；警告 Q30 70-80% 或接头 5-15%
  - 第 3 步后 · 比对率：达标 >70%；警告 50-70%
  - 第 5 步后 · TSS 峰信噪比与重复一致性：达标 信噪比 >10，Spearman >0.9；警告 信噪比 5-10 或 Spearman 0.8-0.9

### 步骤与脚本全文

#### 步骤 1/6：环境检查（软件、输入与参考）

> 只读检查：必需软件缺失或输入目录不存在时以非 0 退出；先补齐环境（流程面板支持一键部署）再继续。可选参考留空时由 AI 在后续步骤协助补齐。

```bash
# 环境检查（只读）：确认软件可加载、输入与参考数据就绪。
# 必需项缺失时本步骤以非 0 退出；请先补齐环境（流程面板支持一键部署）再继续。
#BSUB -J rampage_env -n 1 -q {{QUEUE}}
if ! type module >/dev/null 2>&1; then
  for f in /etc/profile.d/modules.sh /etc/profile.d/lmod.sh /usr/share/Modules/init/bash /usr/share/lmod/lmod/init/bash; do
    [ -r "$f" ] && . "$f" >/dev/null 2>&1 && type module >/dev/null 2>&1 && break || true
  done
fi
FAIL=0
check_mod() {
  if module load "$2" >/dev/null 2>&1; then echo "OK   $1 ($2)"; else
    echo "MISS $1 ($2) —— 集群可用版本："; module -t avail "${2%%/*}" 2>&1 | grep -i "${2%%/*}" | head -5 || true
    if [ "$3" = "required" ]; then FAIL=1; fi
  fi
}
check_cmd() {
  if ( eval "$2" ) >/dev/null 2>&1; then echo "OK   $1"; else echo "MISS $1（检查命令：$2）"; if [ "$3" = "required" ]; then FAIL=1; fi; fi
}
check_mod "FastQC" "FastQC/0.11.9" required
check_mod "STAR" "STAR/2.7.10b" required
check_mod "SAMtools" "SAMtools/1.17" required
check_mod "BEDTools" "BEDTools/2.30.0" required
check_cmd "HOMER（TSS 峰聚类备选）" "command -v findPeaks" optional
check_cmd "Paraclu（TSS 峰聚类备选）" "command -v paraclu" optional
echo "--- 输入目录 ---"
case "{{INPUT_DIR}}" in ''|*'{{'*) echo "MISS 未指定输入目录"; FAIL=1 ;;
  *) if [ -d "{{INPUT_DIR}}" ]; then echo "OK   INPUT_DIR={{INPUT_DIR}}"; ls "{{INPUT_DIR}}" | head -5 || true; else echo "MISS 目录 {{INPUT_DIR}}"; FAIL=1; fi ;;
esac
echo "--- 参考数据 ---"
chk_ref() {
  case "$1" in ''|*'{{'*) echo "SKIP $2（未指定，运行时由 AI 协助补齐）"; return 0 ;; esac
  if [ -e "$1" ] || [ -e "$1.1.bt2" ] || [ -e "$1.sa" ] || [ -e "$1.grp" ]; then echo "OK   $2"; else echo "MISS $2: $1（含常见索引后缀均未找到）"; if [ "$4" = "required" ]; then FAIL=1; fi; fi
}
chk_ref "{{STAR_INDEX}}" "STAR 基因组索引" '' optional
chk_ref "{{GTF}}" "基因注释 GTF" '' optional
chk_ref "{{REF_FA}}" "参考基因组 FASTA" '' optional
echo "--- 已加载模块 ---"
module -t list 2>&1 | tail -30 || true
exit $FAIL
```

#### 步骤 2/6：FastQC 原始数据质控

> 写成 rampage_qc.lsf 后 bsub 提交；先看报告再决定后续

```bash
#BSUB -J rampage_qc -n 1 -q {{QUEUE}}
module load FastQC/0.11.9
cd {{INPUT_DIR}} && mkdir -p fastqc_results
fastqc *.fq.gz -o ./fastqc_results -t {{THREADS}}
```

#### 步骤 3/6：STAR 比对

> 写成 rampage_star.lsf 后 bsub 提交；RAMPAGE 为 5' 端双端测序；单端数据只传 R1

```bash
#BSUB -J rampage_star -n {{THREADS}} -q {{QUEUE}}
module load STAR/2.7.10b
cd {{INPUT_DIR}}
for i in *_R1.fq.gz; do
  s=${i%_R1.fq.gz}
  STAR --runThreadN {{THREADS}} --genomeDir {{STAR_INDEX}} --readFilesIn "$i" "${s}_R2.fq.gz" --readFilesCommand zcat --outSAMtype BAM SortedByCoordinate --outFilterMultimapNmax 20 --outFilterMismatchNoverLmax 0.04 --alignIntronMin 20 --alignIntronMax 1000000 --outFileNamePrefix "${s}."
done
```

#### 步骤 4/6：TSS 峰识别与启动子定量

> -5 只统计 reads 5' 端；聚类最小簇高/密度参数按默认或写入步骤参数；启动子定量用于重复一致性评估

```bash
#BSUB -J rampage_tss -n {{THREADS}} -q {{QUEUE}}
module load BEDTools/2.30.0
cd {{INPUT_DIR}} && mkdir -p tss
PROM=$(ls *promoter*.bed *tss*.bed 2>/dev/null | head -1 || true)
for b in *.Aligned.sortedByCoord.out.bam; do
  s=${b%.Aligned.sortedByCoord.out.bam}
  bedtools genomecov -ibam "$b" -5 -bg > tss/"${s}".5end.bedGraph
  if command -v findPeaks >/dev/null 2>&1 && command -v makeTagDirectory >/dev/null 2>&1; then
    if makeTagDirectory tss/"${s}".tags "$b" > tss/"${s}".maketag.log 2>&1 && findPeaks tss/"${s}".tags -style tss -o tss/"${s}".tss_peaks.txt >> tss/"${s}".maketag.log 2>&1; then
      grep -v '^#' tss/"${s}".tss_peaks.txt > tss/"${s}".tss_peaks.bed || true
    else
      echo "SKIP: HOMER TSS 峰聚类失败（${s}），详见 tss/${s}.maketag.log"
    fi
  else
    echo "SKIP: 未找到 HOMER findPeaks/makeTagDirectory，跳过 TSS 峰聚类（${s}）；备选 Paraclu 需 4 列密度文件手动运行"
  fi
  if [ -z "$PROM" ]; then
    echo "SKIP: 缺少启动子区 BED（TSS±2kb，可由 {{GTF}} 生成），跳过启动子定量（${s}）"
  else
    bedtools intersect -a tss/"${s}".5end.bedGraph -b "$PROM" -wo > tss/"${s}".promoter_counts.tsv
  fi
done
```

#### 步骤 5/6：QC：5' 端特异性、TSS 峰信噪比与重复一致性

> 达标：5' 端 TSS±50bp 富集明显、TSS 峰信噪比 >10、重复间 Spearman >0.9；警告：信噪比 5-10 或 Spearman 0.8-0.9

```bash
#BSUB -J rampage_tss_qc -n 1 -q {{QUEUE}}
cd {{INPUT_DIR}} && mkdir -p qc
python3 - <<'PY'
import glob, json, os
qc = {}
for bed in glob.glob("tss/*.tss_peaks.bed"):
    with open(bed) as fh:
        qc.setdefault("_tss_peaks", {})[os.path.basename(bed)] = sum(1 for line in fh if line.strip())
qc["_files"] = sorted(glob.glob("tss/*.promoter_counts.tsv"))
qc["_rule"] = "5' 端在注释 TSS±50bp 应富集成尖峰（信噪比 >10）；重复间启动子定量 Spearman 按对齐计数计算（同 encode-rnaseq-bulk 的 spearman 逻辑）"
with open("qc/qc.json", "w") as out:
    json.dump(qc, out, indent=2, ensure_ascii=False)
PY
```

#### 步骤 6/6：生成分析报告

```bash
按 analysis-report 技能模板，基于本流程实际产出生成图文并茂的分析报告（reports/ 下 HTML+MD），回复给出报告与关键图绝对路径
```
