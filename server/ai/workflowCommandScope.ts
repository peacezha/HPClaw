import path from 'node:path';
import { classifyCommandRisk } from './commandSafety';

export interface WorkflowCommandScope {
  runDir: string;
  home?: string;
  inputs?: string[];
  references?: string[];
  /** 用户在本轮或最近对话中明确给出的、允许变更的其他绝对路径。 */
  userAuthorizedPaths?: string[];
  /** 完全授权模式：允许切换和操作 SSH 账号本身有权限访问的任意路径。 */
  unrestricted?: boolean;
}

export interface WorkflowCommandDecision {
  ok: boolean;
  command?: string;
  reason?: string;
}

function shq(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

function normalizeRemotePath(value: string, home?: string): string | null {
  let raw = String(value || '').trim().replace(/^['"]|['"]$/g, '');
  if (!raw || /[\r\n\0]/.test(raw) || raw.split('/').includes('..')) return null;
  if (raw === '~' && home) raw = home;
  else if (raw.startsWith('~/') && home) raw = `${home.replace(/\/+$/, '')}/${raw.slice(2)}`;
  if (!raw.startsWith('/')) return null;
  return path.posix.normalize(raw).replace(/\/+$/, '') || '/';
}

function isInside(candidate: string, root: string): boolean {
  return candidate === root || candidate.startsWith(`${root}/`);
}

/**
 * 提取命令中"像真实绝对路径"的 token。要求至少两段（/a/b），
 * 避免把模块名（R/3.6.0）、变量（/$v）等单段文本误判为路径。
 */
function absolutePathTokens(command: string, home?: string): string[] {
  const tokens = command.match(/(?:~(?:\/[^\s'";&|<>()]*)?|\$HOME(?:\/[^\s'";&|<>()]*)?|\/(?:[^\s'";&|<>()])*)/g) || [];
  return tokens
    .map(token => token.startsWith('$HOME') && home ? `${home}${token.slice(5)}` : token)
    .map(token => normalizeRemotePath(token, home))
    .filter((token): token is string => Boolean(token) && token !== '/dev/null')
    .filter(token => token === '/' || token.split('/').filter(Boolean).length >= 2);
}

function authorizedRoots(scope: WorkflowCommandScope, runDir: string): string[] {
  return [runDir, ...(scope.inputs || []), ...(scope.references || [])]
    .map(item => normalizeRemotePath(item, scope.home))
    .filter((item): item is string => Boolean(item));
}

function writableRoots(scope: WorkflowCommandScope, runDir: string): string[] {
  // 参考数据永远只读；用户明确选择的输入目录可能同时承载旧版流程产物，
  // 因此允许在确认后精确清理其中的旧输出。
  return [runDir, ...(scope.inputs || []), ...(scope.userAuthorizedPaths || [])]
    .map(item => normalizeRemotePath(item, scope.home))
    .filter((item): item is string => Boolean(item));
}

/**
 * Workflow commands are executed inside the formal run directory.
 * 守卫职责：防越权写入与无界发现；只读的环境探查（ls/cat/module/conda 等）
 * 不限制路径——环境探测（软件、R 库、conda env）是流程环境准备的合法一环。
 */
export function scopeWorkflowCommand(command: string, scope: WorkflowCommandScope): WorkflowCommandDecision {
  const trimmed = String(command || '').trim();
  const runDir = normalizeRemotePath(scope.runDir, scope.home);
  if (!trimmed || !runDir) return { ok: false, reason: '流程运行目录无效。' };
  if (scope.unrestricted) {
    // 保持没有显式 cd 的相对命令仍从 RUN 启动；包含 cd 时尊重用户开启的完全路径权限。
    const hasCd = /[\r\n]\s*cd\s|(^|[;&|])\s*cd\s|^cd\s/i.test(trimmed);
    return { ok: true, command: hasCd ? trimmed : `cd ${shq(runDir)} && ${trimmed}` };
  }
  if (/[\r\n]\s*cd\s|(^|[;&|])\s*cd\s|^cd\s/i.test(trimmed)) {
    return { ok: false, reason: '流程命令不能自行切换目录；系统会自动固定在本次 RUN 工作目录。' };
  }
  if (/(^|[\s/])\.\.($|[\s/])/.test(trimmed)) {
    return { ok: false, reason: '流程命令不能访问上级目录。' };
  }

  const roots = authorizedRoots(scope, runDir);
  const mutationRoots = writableRoots(scope, runDir);
  const protectedRoots = [runDir, ...(scope.inputs || [])]
    .map(item => normalizeRemotePath(item, scope.home))
    .filter((item): item is string => Boolean(item));

  // locate/tree 本质就是全库/递归发现工具，一律拦截。
  if (/\blocate\b|\btree\b/i.test(trimmed)) {
    return { ok: false, reason: '流程中禁止递归目录发现；请使用用户已选择的明确路径。' };
  }

  // ls -R 递归发现：只读但容易大面积漫游，仅允许在授权根（RUN/输入/参考）内使用。
  if (/\bls\b[^\n;&|]*(?:-R|--recursive)/i.test(trimmed)) {
    const tokens = absolutePathTokens(trimmed, scope.home);
    const allAuthorized = tokens.every(candidate => roots.some(root => isInside(candidate, root)));
    if (!allAuthorized) {
      return { ok: false, reason: '递归目录发现仅限本次 RUN 与已选择的输入/参考目录；请用明确路径查看。' };
    }
  }

  // 路径授权检查只对可能改变状态的命令生效；只读命令（含环境探测）不限制路径。
  const risk = classifyCommandRisk(trimmed);
  if (risk === 'destructive') {
    const targets = absolutePathTokens(trimmed, scope.home);
    for (const candidate of targets) {
      if (!mutationRoots.some(root => isInside(candidate, root))) {
        return {
          ok: false,
          reason: `破坏性操作仅限本次 RUN 或用户已选择的输入目录，不能修改：${candidate}。`,
        };
      }
      if (protectedRoots.includes(candidate)) {
        return { ok: false, reason: `不能删除整个授权根目录：${candidate}。请明确指定要清理的旧产物。` };
      }
    }
  }
  const traversal = /\b(?:find|du|ls)\b/i.test(trimmed);
  if (traversal && risk !== 'read') {
    for (const candidate of absolutePathTokens(trimmed, scope.home)) {
      if (!roots.some(root => isInside(candidate, root))) {
        return {
          ok: false,
          reason: `流程禁止扫描未授权路径：${candidate}。请在运行面板中明确选择该输入或参考数据。`,
        };
      }
    }
    if (/\b(?:find|du|ls)\s+(?:~|\$HOME)(?:\s|$)/i.test(trimmed)) {
      return { ok: false, reason: '流程禁止扫描用户主目录。' };
    }
  }

  return { ok: true, command: `cd ${shq(runDir)} && ${trimmed}` };
}
