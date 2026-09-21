import { spawnSync } from 'node:child_process';
import path from 'node:path';

export interface KillableChildProcess {
  pid?: number;
  exitCode?: number | null;
  kill(signal?: NodeJS.Signals | number): boolean;
}

export interface ProcessTreeTerminationDeps {
  platform?: NodeJS.Platform;
  windowsRoot?: string;
  spawnSync?: (
    command: string,
    args: string[],
    options: { windowsHide: boolean; stdio: 'ignore'; timeout: number },
  ) => { status: number | null; error?: unknown };
}

/**
 * Terminate a child and every process below it.
 *
 * On Windows, ChildProcess.kill() only terminates the immediate `cmd.exe`
 * created by shell:true. dsh's real node/OpenConsole descendants can then be
 * orphaned and keep the installation directory locked. taskkill /T follows
 * the complete process tree before forcing it down.
 */
export function terminateProcessTree(
  child: KillableChildProcess | undefined,
  deps: ProcessTreeTerminationDeps = {},
): boolean {
  if (!child) return true;
  if (!Number.isSafeInteger(child.pid) || Number(child.pid) <= 0) return true;
  if (child.exitCode != null) return true;

  const platform = deps.platform ?? process.platform;
  if (platform === 'win32') {
    const windowsRoot = deps.windowsRoot || process.env.SystemRoot || 'C:\\Windows';
    const taskkill = path.join(windowsRoot, 'System32', 'taskkill.exe');
    const run = deps.spawnSync ?? ((command, args, options) => spawnSync(command, args, options));
    const result = run(taskkill, ['/PID', String(child.pid), '/T', '/F'], {
      windowsHide: true,
      stdio: 'ignore',
      timeout: 8_000,
    });
    if (!result.error && result.status === 0) return true;
  }

  try { child.kill('SIGTERM'); } catch { /* process already exited */ }
  return false;
}
