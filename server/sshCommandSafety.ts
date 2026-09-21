type SshDataListener = (data: Buffer) => void;

interface InterruptibleSshProcess {
  stdin?: {
    write: (data: string) => unknown;
  };
  stdout?: {
    removeListener: (event: string, listener: SshDataListener) => unknown;
  };
}

export function interruptTimedOutSshCommand(
  sshProcess: InterruptibleSshProcess,
  onData: SshDataListener,
): void {
  try { sshProcess.stdout?.removeListener('data', onData); } catch {}
  try { sshProcess.stdin?.write('\x03'); } catch {}
  try { sshProcess.stdin?.write('stty echo 2>/dev/null\n'); } catch {}
}
