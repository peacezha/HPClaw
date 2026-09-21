// 危险命令检测：命中时需要用户确认后才允许在集群上执行。
// rm 在 agentRunner 中单独拦截（直接禁止），这里覆盖其余高风险操作。

const DANGEROUS_PATTERNS: RegExp[] = [
  /\bbkill\b/, // 杀集群作业
  /\bkill\s+-9\b/,
  /\bpkill\b/,
  /\bkillall\b/,
  /\bmkfs\./, // 格式化
  /\bfdisk\b/,
  /\bdd\s+[^|]*\bof=/, // dd 写盘
  /:\(\)\s*\{/, // fork 炸弹
  /\bchmod\s+(-[a-zA-Z]+\s+)*777\b/, // 777 放权
  /\b(shutdown|reboot|halt|poweroff)\b/,
  /\|\s*(sudo\s+)?(sh|bash|zsh)\b/, // curl/wget 管道进 shell
  /\bgit\s+clone\b[^|]*\|\s*(sh|bash)\b/,
];

export type CommandRisk = 'read' | 'write' | 'job' | 'network' | 'destructive' | 'unknown';

const READ_ONLY_COMMANDS = new Set([
  'ls', 'pwd', 'find', 'head', 'tail', 'cat', 'zcat', 'bzcat', 'xzcat', 'less',
  'wc', 'file', 'stat', 'namei', 'which', 'whereis', 'type', 'module', 'bjobs',
  'bhosts', 'bqueues', 'bacct', 'bhist', 'bpeek', 'quota', 'df', 'du', 'whoami',
  'hostname', 'date', 'env', 'printenv', 'uname', 'id', 'groups', 'grep', 'egrep',
  'fgrep', 'awk', 'cut', 'sort', 'uniq', 'tr', 'paste', 'column', 'realpath',
  'readlink', 'md5sum', 'sha1sum', 'sha256sum', 'diff', 'cmp', 'comm', 'test', '[',
]);

const WRITE_COMMANDS = new Set([
  'mkdir', 'touch', 'cp', 'mv', 'install', 'tee', 'chmod', 'chown', 'chgrp',
  'sed', 'perl', 'python', 'python3', 'rscript', 'tar', 'gzip', 'gunzip', 'bgzip',
]);

const JOB_COMMANDS = new Set(['bsub', 'bmod', 'bstop', 'bresume', 'brequeue']);
const NETWORK_COMMANDS = new Set(['curl', 'wget', 'scp', 'sftp', 'rsync', 'ssh', 'git']);

function commandWords(command: string): string[] {
  return command
    .split(/(?:&&|\|\||[;|\n])/)
    .map(part => part.trim().match(/^(?:command\s+|sudo\s+|env\s+[^\s=]+=[^\s]+\s+)*([^\s]+)/)?.[1] || '')
    .map(word => word.replace(/^.*\//, '').toLowerCase())
    .filter(Boolean);
}

export function isDangerousCommand(command: string): boolean {
  const normalized = command.trim();
  if (!normalized) return false;
  if (/\brm\b/.test(normalized)) return true;
  return DANGEROUS_PATTERNS.some(pattern => pattern.test(normalized));
}

/**
 * Classify the effect of a shell command. This is deliberately conservative:
 * unknown programs are not silently treated as read-only.
 */
export function classifyCommandRisk(command: string): CommandRisk {
  const normalized = command.trim();
  if (!normalized) return 'read';
  if (isDangerousCommand(normalized)) return 'destructive';

  const words = commandWords(normalized);
  if (words.some(word => JOB_COMMANDS.has(word))) return 'job';
  if (words.some(word => NETWORK_COMMANDS.has(word))) return 'network';

  // Shell redirection changes state, except the common stderr-to-/dev/null probe.
  const withoutDevNullProbe = normalized.replace(/\d*>\s*\/dev\/null/g, '');
  if (/(^|[^<])>{1,2}[^>]/.test(withoutDevNullProbe) || /<<-?\s*['"]?\w+/.test(normalized)) return 'write';
  if (/\b(sed|perl)\s+[^\n]*\s-i(?:\s|$)/i.test(normalized)) return 'write';
  if (words.some(word => WRITE_COMMANDS.has(word))) return 'write';
  if (words.length > 0 && words.every(word => READ_ONLY_COMMANDS.has(word))) return 'read';
  return 'unknown';
}
