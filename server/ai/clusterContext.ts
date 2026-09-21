import type { ClusterSnapshot, FileEntry, JobEntry, QuotaInfo, SnapshotDepth } from './types';
import { fileRecognizer } from './fileRecognizer';

export function parseLsOutput(raw: string): FileEntry[] {
  const lines = raw.split('\n').filter(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('total ')) return false;
    return /^[-dl]/.test(trimmed);
  });

  const entries: FileEntry[] = [];
  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    // 兼容两种 ls 输出格式：
    //   标准 ls -l：  perms links owner group size month day time/year name → 9 列
    //   long-iso：    perms links owner group size yyyy-mm-dd hh:mm name    → 8 列
    const isLongIso = /^\d{4}-\d{2}-\d{2}$/.test(parts[5] ?? '');
    const minParts = isLongIso ? 8 : 9;
    if (parts.length < minParts) continue;

    const perms = parts[0];
    const sizeStr = parts[4];
    const dateStr = isLongIso
      ? `${parts[5]} ${parts[6]}`
      : `${parts[5]} ${parts[6]} ${parts[7]}`;
    const name = parts.slice(isLongIso ? 7 : 8).join(' ');

    const size = parseSize(sizeStr);
    const modified = Date.parse(dateStr) || Date.now();

    if (perms.startsWith('d')) {
      entries.push({ name, size: 0, modified, type: 'directory', recognizedSkillHints: [] });
    } else {
      const entry = fileRecognizer.analyze(name, size, modified);
      entries.push(entry);
    }
  }

  return entries;
}

function parseSize(raw: string): number {
  const num = parseFloat(raw);
  if (!raw) return 0;
  const upper = raw.slice(-1).toUpperCase();
  if (upper === 'T') return num * 1024 * 1024 * 1024 * 1024;
  if (upper === 'G') return num * 1024 * 1024 * 1024;
  if (upper === 'M') return num * 1024 * 1024;
  if (upper === 'K') return num * 1024;
  return num || 0;
}

export function parseBjobsOutput(raw: string): JobEntry[] {
  const lines = raw.split('\n');
  if (lines.length < 2) return [];
  const header = lines[0];
  const dataLines = lines.slice(1).filter(l => l.trim());

  // bjobs 输出是定宽对齐的表格（列宽 = 该列最宽单元格），因此用表头记录
  // 各列起始位置做切片解析。直接按空白切分会在以下场景整体错位：
  //   - 并行作业的 EXEC_HOST 含空格（如 "8*hostA 2*hostB"）
  //   - JOB_NAME 含空格
  //   - 某列为空（\s+ 切分后后续字段全部左移）
  const pos = {
    jobId: header.indexOf('JOBID'),
    user: header.indexOf('USER'),
    stat: header.indexOf('STAT'),
    queue: header.indexOf('QUEUE'),
    fromHost: header.indexOf('FROM_HOST'),
    jobName: header.indexOf('JOB_NAME'),
    submitTime: header.indexOf('SUBMIT_TIME'),
  };
  const headerOk =
    pos.jobId >= 0 && pos.user > pos.jobId && pos.stat > pos.user &&
    pos.queue > pos.stat && pos.jobName > pos.queue && pos.submitTime > pos.jobName;

  return dataLines.map(line => {
    // 逐行校验是否真与表头定宽对齐（长度需达到 SUBMIT_TIME 列，且首列切片等于首 token），
    // 否则按空白切分回退——兼容非补齐格式的 bjobs 输出
    const firstToken = line.trim().split(/\s+/)[0] ?? '';
    const aligned = headerOk && line.length > pos.submitTime && line.slice(pos.jobId, pos.user).trim() === firstToken;
    if (aligned) {
      const slice = (from: number, to?: number) => line.slice(from, to).trim();
      const jobId = slice(pos.jobId, pos.user);
      const name = slice(pos.jobName, pos.submitTime);
      return {
        jobId,
        name: name || jobId,
        status: normalizeJobStatus(slice(pos.stat, pos.queue) || 'UNKNOWN'),
        cores: 0, // not in default bjobs -w output
        queue: slice(pos.queue, pos.fromHost > pos.queue ? pos.fromHost : pos.jobName),
        runtime: '',
      };
    }
    // 表头不符合预期或该行未按列补齐时回退到空白切分
    const parts = line.trim().split(/\s+/);
    return {
      jobId: parts[0] ?? '',
      name: parts[6] ?? parts[0] ?? '',
      status: normalizeJobStatus(parts[2] ?? 'UNKNOWN'),
      cores: 0,
      queue: parts[3] ?? '',
      runtime: '',
    };
  });
}

function normalizeJobStatus(raw: string): JobEntry['status'] {
  const upper = raw.toUpperCase();
  if (upper === 'RUN') return 'RUN';
  if (upper === 'PEND') return 'PEND';
  if (upper === 'DONE') return 'DONE';
  if (upper === 'EXIT') return 'EXIT';
  return 'UNKNOWN';
}

/** 解析 `squeue -o "%i|%j|%T|%P|%M" --noheader` 的管道分隔输出 */
export function parseSqueueOutput(raw: string): JobEntry[] {
  return raw
    .split('\n')
    .filter(l => l.trim())
    .map(line => {
      const parts = line.trim().split('|');
      return {
        jobId: parts[0] ?? '',
        name: parts[1] ?? parts[0] ?? '',
        status: normalizeSlurmStatus(parts[2] ?? 'UNKNOWN'),
        cores: 0,
        queue: parts[3] ?? '',
        runtime: parts[4] ?? '',
      };
    })
    .filter(j => j.jobId);
}

function normalizeSlurmStatus(raw: string): JobEntry['status'] {
  const upper = raw.toUpperCase();
  if (upper === 'RUNNING') return 'RUN';
  if (upper === 'PENDING' || upper === 'CONFIGURING' || upper === 'SUSPENDED') return 'PEND';
  if (upper === 'COMPLETED') return 'DONE';
  if (
    upper === 'FAILED' || upper === 'CANCELLED' || upper === 'TIMEOUT' ||
    upper === 'NODE_FAIL' || upper === 'PREEMPTED' || upper === 'BOOT_FAIL' ||
    upper === 'DEADLINE' || upper === 'OUT_OF_MEMORY'
  ) return 'EXIT';
  return 'UNKNOWN';
}

export function parseQuotaOutput(raw: string): QuotaInfo | null {
  const match = raw.match(/(\S+)\s+([\d.]+[TGMK]?)\s+([\d.]+[TGMK]?)\s+(\d+)%/);
  if (!match) return null;
  return {
    filesystem: match[1],
    used: match[2],
    total: match[3],
    percent: match[4] + '%',
  };
}

const SNAPSHOT_COMMANDS: Record<SnapshotDepth, string> = {
  // 默认快照不读取文件列表。需要文件时由用户明确选择目录，Agent 再定点读取。
  standard: 'echo "===PWD==="; pwd; echo "===JOBS==="; bjobs -w 2>/dev/null | head -20; echo "===QUOTA==="; quota -s 2>/dev/null | head -5; true',
  full: 'echo "===PWD==="; pwd; echo "===FILES==="; ls -lhR --time-style=long-iso 2>/dev/null | head -500; echo "===JOBS==="; bjobs -w 2>/dev/null | head -30; echo "===QUEUES==="; bqueues 2>/dev/null | head -20; echo "===MODULES==="; module list 2>/dev/null; echo "===QUOTA==="; quota -s 2>/dev/null | head -10; true',
};

function parseSnapshotOutput(raw: string): ClusterSnapshot {
  const sections: Record<string, string> = {};
  let currentSection = '__preamble__';

  for (const line of raw.split('\n')) {
    const sectionMatch = line.match(/^===(\w+)===$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1].toLowerCase();
      sections[currentSection] = '';
    } else {
      sections[currentSection] = (sections[currentSection] ?? '') + line + '\n';
    }
  }

  const files = parseLsOutput(sections['files'] ?? '');
  const jobs = parseBjobsOutput(sections['jobs'] ?? '');
  const quota = parseQuotaOutput(sections['quota'] ?? '');
  const modulesStr = sections['modules'] ?? '';
  const modules = modulesStr
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('Currently') && !l.startsWith('No modules'));

  return {
    workingDir: (sections['pwd'] ?? '').trim(),
    files,
    jobs,
    quota,
    modules,
    queueStatus: [],
    timestamp: Date.now(),
  };
}

export class ClusterContextProvider {
  private cache: Map<string, { snapshot: ClusterSnapshot; timestamp: number }> = new Map();
  private cacheTTL = 120000;

  buildSnapshotCommand(depth: SnapshotDepth): string {
    return SNAPSHOT_COMMANDS[depth];
  }

  parse(rawOutput: string): ClusterSnapshot {
    return parseSnapshotOutput(rawOutput);
  }

  getCached(key: string): ClusterSnapshot | null {
    const entry = this.cache.get(key);
    if (entry && Date.now() - entry.timestamp < this.cacheTTL) {
      return entry.snapshot;
    }
    return null;
  }

  setCache(key: string, snapshot: ClusterSnapshot): void {
    this.cache.set(key, { snapshot, timestamp: Date.now() });
  }

  summarizeForAI(snapshot: ClusterSnapshot, fileHints?: { phase: string; skills: string[] }): string {
    const lines: string[] = [];
    lines.push('## 集群实时状态');
    lines.push(`### 当前位置\n${snapshot.workingDir || '(未知)'}`);

    if (snapshot.files.length > 0) {
      lines.push(`### 目录内容 (${snapshot.files.length} 个条目)`);
      for (const f of snapshot.files.slice(0, 30)) {
        const skillTag = f.recognizedSkillHints.length > 0
          ? ` → 关联技能: ${f.recognizedSkillHints.join(', ')}`
          : '';
        lines.push(`  ${f.name} (${formatSize(f.size)})${skillTag}`);
      }
      if (snapshot.files.length > 30) {
        lines.push(`  ... 还有 ${snapshot.files.length - 30} 个文件`);
      }
    }

    if (fileHints) {
      lines.push(`### 分析阶段推断\n${fileHints.phase}\n关联技能: ${fileHints.skills.join(', ')}`);
    }

    if (snapshot.jobs.length > 0) {
      lines.push('### 集群作业');
      for (const j of snapshot.jobs) {
        lines.push(`  Job ${j.jobId} | ${j.name} | ${j.status} | ${j.queue}`);
      }
    }

    if (snapshot.quota) {
      lines.push(`### 磁盘配额\n${snapshot.quota.filesystem}: ${snapshot.quota.used}/${snapshot.quota.total} (${snapshot.quota.percent})`);
    }

    if (snapshot.modules.length > 0) {
      lines.push(`### 已加载模块\n${snapshot.modules.slice(0, 10).join(', ')}`);
    }

    return lines.join('\n');
  }
}

function formatSize(bytes: number): string {
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + 'G';
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + 'M';
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + 'K';
  return bytes + 'B';
}

export const clusterContext = new ClusterContextProvider();
