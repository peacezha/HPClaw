import { describe, expect, it, vi } from 'vitest';
import { terminateProcessTree, type KillableChildProcess } from './processTree';

function runningChild(pid = 4321): KillableChildProcess {
  return { pid, exitCode: null, kill: vi.fn(() => true) };
}

describe('terminateProcessTree', () => {
  it('uses taskkill /T /F for a running Windows child tree', () => {
    const child = runningChild();
    const run = vi.fn(() => ({ status: 0 }));

    expect(terminateProcessTree(child, {
      platform: 'win32',
      windowsRoot: 'C:\\Windows',
      spawnSync: run,
    })).toBe(true);

    expect(run).toHaveBeenCalledWith(
      expect.stringContaining('taskkill.exe'),
      ['/PID', '4321', '/T', '/F'],
      expect.objectContaining({ windowsHide: true, timeout: 8_000 }),
    );
    expect(child.kill).not.toHaveBeenCalled();
  });

  it('falls back to SIGTERM when Windows tree termination fails', () => {
    const child = runningChild();

    expect(terminateProcessTree(child, {
      platform: 'win32',
      spawnSync: () => ({ status: 1 }),
    })).toBe(false);

    expect(child.kill).toHaveBeenCalledWith('SIGTERM');
  });

  it('does nothing for an already exited child', () => {
    const child = { ...runningChild(), exitCode: 0 };
    const run = vi.fn(() => ({ status: 0 }));

    expect(terminateProcessTree(child, { platform: 'win32', spawnSync: run })).toBe(true);
    expect(run).not.toHaveBeenCalled();
    expect(child.kill).not.toHaveBeenCalled();
  });
});
