// 自动补全的上下文增强：路径建议 + 给模型的上下文块。
import type { ClusterSnapshot } from './types';

export interface AutocompleteSuggestion {
  completion: string;
  explanation: string;
}

/** 取输入行最后一个 token */
function lastTokenOf(input: string): string {
  const trimmed = input.replace(/\s+$/, '');
  const idx = trimmed.lastIndexOf(' ');
  return idx >= 0 ? trimmed.slice(idx + 1) : trimmed;
}

/** 最后一个 token 是否像路径（含 / 或以 . 开头） */
export function looksLikePath(token: string): boolean {
  return token.includes('/') || token.startsWith('.');
}

/**
 * 基于集群快照（当前目录文件）的路径补全。
 * 目录补全带尾部 /，便于继续向下走。
 */
export function buildPathSuggestions(
  input: string,
  snapshot: ClusterSnapshot | null,
  limit = 6,
): AutocompleteSuggestion[] {
  if (!snapshot || !input.trim()) return [];
  const token = lastTokenOf(input);
  if (token.length < 1 || token.startsWith('-')) return [];

  const isDir = (name: string) =>
    snapshot.files.some(f => f.name === name && f.type === 'directory');

  const results: AutocompleteSuggestion[] = [];
  if (token.includes('/')) {
    // 含 / 的路径：快照只有当前目录一级文件，尽力匹配 cwd 下的前缀
    const slashIdx = token.lastIndexOf('/');
    const dirPart = token.slice(0, slashIdx + 1);
    const basePart = token.slice(slashIdx + 1);
    // 只支持当前目录（dirPart 为 ./ 或空）的场景
    if (dirPart === './' || dirPart === '') {
      for (const f of snapshot.files) {
        if (!f.name.startsWith(basePart)) continue;
        const completion = dirPart + f.name + (f.type === 'directory' ? '/' : '');
        results.push({ completion, explanation: f.type === 'directory' ? '目录' : '当前目录文件' });
        if (results.length >= limit) break;
      }
    }
    return results;
  }

  // 无前缀路径：当前目录文件前缀匹配（文件+目录）
  for (const f of snapshot.files) {
    if (!f.name.startsWith(token)) continue;
    const completion = f.name + (f.type === 'directory' ? '/' : '');
    results.push({ completion, explanation: f.type === 'directory' ? '目录' : '当前目录文件' });
    if (results.length >= limit) break;
  }
  void isDir;
  return results;
}

/**
 * 给 AI 补全模型的上下文块：当前目录、文件样例、最近命令。
 * 让模型建议出"认识当前环境"的命令（真实文件名、符合用户习惯）。
 */
export function buildContextBlock(
  snapshot: ClusterSnapshot | null,
  history: string[],
): string {
  const parts: string[] = [];
  if (snapshot) {
    if (snapshot.workingDir) parts.push(`当前目录: ${snapshot.workingDir}`);
    if (snapshot.files.length > 0) {
      const names = snapshot.files.slice(0, 30).map(f => f.name + (f.type === 'directory' ? '/' : ''));
      parts.push(`当前目录文件: ${names.join(', ')}`);
    }
    if (snapshot.jobs.length > 0) {
      parts.push(`在跑作业: ${snapshot.jobs.slice(0, 5).map(j => `${j.jobId}(${j.status})`).join(', ')}`);
    }
  }
  if (history.length > 0) {
    parts.push(`用户最近执行过的命令（可延续其习惯）:\n${history.slice(0, 8).map(h => `  ${h}`).join('\n')}`);
  }
  return parts.length > 0 ? `\n\n【环境上下文】\n${parts.join('\n')}` : '';
}
