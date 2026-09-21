import { describe, expect, it, vi } from 'vitest';
import { interruptTimedOutSshCommand } from './sshCommandSafety';

describe('SSH command safety', () => {
  it('interrupts the remote PTY command and restores echo after a timeout', () => {
    const onData = vi.fn();
    const stdout = { removeListener: vi.fn() };
    const stdin = { write: vi.fn() };

    interruptTimedOutSshCommand({ stdout, stdin }, onData);

    expect(stdout.removeListener).toHaveBeenCalledWith('data', onData);
    expect(stdin.write).toHaveBeenCalledWith('\x03');
    expect(stdin.write).toHaveBeenCalledWith('stty echo 2>/dev/null\n');
  });
});
