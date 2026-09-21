import { EventEmitter } from 'node:events';
import { describe, expect, it, vi } from 'vitest';
import {
  ClusterSession,
  HostFingerprintMismatchError,
  HostFingerprintRequiredError,
  type ClusterCredentials,
} from './clusterSession';

class FakeChannel extends EventEmitter {
  stderr = new EventEmitter();
  write = vi.fn();
  setWindow = vi.fn();
  end = vi.fn();
  close = vi.fn();
}

class FakeSftp extends EventEmitter {
  readdir = vi.fn();
  end = vi.fn();
}

class FakeClient extends EventEmitter {
  connectOptions?: Record<string, unknown>;
  fingerprint = 'SHA256:hpc-test';
  shellOptions?: Record<string, unknown>;
  shellStream = new FakeChannel();
  sftpWrapper = new FakeSftp();
  shellError?: Error;
  sftpError?: Error;
  execError?: Error;
  execStream = new FakeChannel();
  deferShell = false;
  deferSftp = false;
  deferExec = false;
  shellCallback?: (error: Error | undefined, stream: FakeChannel) => void;
  sftpCallback?: (error: Error | undefined, sftp: FakeSftp) => void;
  execCallback?: (error: Error | undefined, stream: FakeChannel) => void;
  connect = vi.fn((options: Record<string, unknown>) => {
    this.connectOptions = options;
    return this;
  });
  shell = vi.fn((options: Record<string, unknown>, callback: (error: Error | undefined, stream: FakeChannel) => void) => {
    this.shellOptions = options;
    if (this.deferShell) this.shellCallback = callback;
    else callback(this.shellError, this.shellStream);
    return this;
  });
  sftp = vi.fn((callback: (error: Error | undefined, sftp: FakeSftp) => void) => {
    if (this.deferSftp) this.sftpCallback = callback;
    else callback(this.sftpError, this.sftpWrapper);
    return this;
  });
  exec = vi.fn((_command: string, callback: (error: Error | undefined, stream: FakeChannel) => void) => {
    if (this.deferExec) this.execCallback = callback;
    else callback(this.execError, this.execStream);
    return this;
  });
  end = vi.fn();

  completeHandshake(): boolean {
    const verifier = this.connectOptions?.hostVerifier as (
      fingerprint: string,
      callback?: (accepted: boolean) => void,
    ) => boolean;
    let accepted: boolean | undefined;
    const returned = verifier(this.fingerprint, decision => { accepted = decision; });
    accepted ??= returned;
    if (accepted) this.emit('ready');
    else this.emit('error', new Error('Host key verification failed'));
    return accepted;
  }

  resolveShell(): void {
    this.shellCallback?.(this.shellError, this.shellStream);
  }

  resolveSftp(): void {
    this.sftpCallback?.(this.sftpError, this.sftpWrapper);
  }

  resolveExec(): void {
    this.execCallback?.(this.execError, this.execStream);
  }
}

const trustedCredentials: ClusterCredentials = {
  host: 'hpc.test',
  port: 22,
  username: 'lin',
  password: 'secret',
  verificationCode: '123456',
  expectedFingerprint: 'SHA256:hpc-test',
};

async function connectTrusted(client = new FakeClient()): Promise<{
  client: FakeClient;
  session: ClusterSession;
}> {
  const session = new ClusterSession(() => client as never);
  const connecting = session.connect(trustedCredentials);
  expect(client.completeHandshake()).toBe(true);
  await connecting;
  return { client, session };
}

describe('ClusterSession', () => {
  it('uses keyboard-interactive directly and answers English and Chinese MFA prompts when a code is present', async () => {
    const client = new FakeClient();
    const session = new ClusterSession(() => client as never);
    const connecting = session.connect(trustedCredentials);
    const finish = vi.fn();

    client.emit('keyboard-interactive', '', '', '', [
      { prompt: 'Password:' },
      { prompt: '请输入验证码：' },
      { prompt: 'OTP code:' },
      { prompt: '密码：' },
    ], finish);

    expect(finish).toHaveBeenCalledWith(['secret', '123456', '123456', 'secret']);
    expect(finish).toHaveBeenCalledOnce();
    expect(client.connectOptions).toMatchObject({
      host: 'hpc.test',
      port: 22,
      username: 'lin',
      tryKeyboard: true,
      readyTimeout: 60_000,
      keepaliveInterval: 15_000,
      keepaliveCountMax: 3,
      hostHash: 'sha256',
    });
    expect(client.connectOptions).not.toHaveProperty('password');

    client.completeHandshake();
    await connecting;
    expect(client.listenerCount('keyboard-interactive')).toBe(0);
  });

  it('uses password authentication when no verification code is provided', async () => {
    const client = new FakeClient();
    const session = new ClusterSession(() => client as never);
    const connecting = session.connect({
      ...trustedCredentials,
      verificationCode: '',
    });

    expect(client.connectOptions).toMatchObject({
      host: 'hpc.test',
      port: 22,
      username: 'lin',
      password: 'secret',
      tryKeyboard: true,
    });

    client.completeHandshake();
    await connecting;
  });

  it('rejects an unknown host with a typed required-fingerprint error', async () => {
    const client = new FakeClient();
    const session = new ClusterSession(() => client as never);
    const connecting = session.connect({
      ...trustedCredentials,
      expectedFingerprint: undefined,
    });

    expect(client.completeHandshake()).toBe(false);
    await expect(connecting).rejects.toEqual(
      expect.objectContaining<Partial<HostFingerprintRequiredError>>({
        name: 'HostFingerprintRequiredError',
        fingerprint: 'SHA256:hpc-test',
      }),
    );
    expect(client.end).toHaveBeenCalledOnce();
    expect(session.state).toBe('failed');
  });

  it('rejects a changed host key with expected and actual fingerprints', async () => {
    const client = new FakeClient();
    const session = new ClusterSession(() => client as never);
    const connecting = session.connect({
      ...trustedCredentials,
      expectedFingerprint: 'SHA256:stored-key',
    });

    expect(client.completeHandshake()).toBe(false);
    await expect(connecting).rejects.toEqual(
      expect.objectContaining<Partial<HostFingerprintMismatchError>>({
        name: 'HostFingerprintMismatchError',
        expected: 'SHA256:stored-key',
        actual: 'SHA256:hpc-test',
      }),
    );
    expect(client.end).toHaveBeenCalledOnce();
  });

  it('accepts only an exact fingerprint match', async () => {
    const { client, session } = await connectTrusted();

    expect(session.state).toBe('connected');
    expect(client.end).not.toHaveBeenCalled();
  });

  it('uses the asynchronous ssh2 host verifier callback without also returning a decision', async () => {
    const client = new FakeClient();
    const session = new ClusterSession(() => client as never);
    const connecting = session.connect(trustedCredentials);
    const verifier = client.connectOptions?.hostVerifier as (
      fingerprint: string,
      callback: (accepted: boolean) => void,
    ) => boolean | undefined;
    const verified = vi.fn();

    const returned = verifier(client.fingerprint, verified);

    expect(returned).toBeUndefined();
    expect(verified).toHaveBeenCalledOnce();
    expect(verified).toHaveBeenCalledWith(true);
    client.emit('ready');
    await connecting;
  });

  it('accepts an untrusted host only after the injected trust callback approves its SHA256 fingerprint', async () => {
    const client = new FakeClient();
    const session = new ClusterSession(() => client as never);
    const trustFingerprint = vi.fn(async (fingerprint: string) => fingerprint === client.fingerprint);
    const connecting = session.connect({
      ...trustedCredentials,
      expectedFingerprint: undefined,
    }, trustFingerprint);
    const verifier = client.connectOptions?.hostVerifier as (
      fingerprint: string,
      callback: (accepted: boolean) => void,
    ) => boolean | undefined;

    const returned = verifier(client.fingerprint, accepted => {
      if (accepted) client.emit('ready');
    });

    expect(returned).toBeUndefined();
    await expect(connecting).resolves.toBeUndefined();
    expect(trustFingerprint).toHaveBeenCalledWith('SHA256:hpc-test');
    expect(session.state).toBe('connected');
  });

  it('ignores a trust decision that arrives after the session closes', async () => {
    const client = new FakeClient();
    let approve!: (trusted: boolean) => void;
    const session = new ClusterSession(() => client as never);
    const connecting = session.connect({
      ...trustedCredentials,
      expectedFingerprint: undefined,
    }, () => new Promise(resolve => { approve = resolve; }));
    const verifier = client.connectOptions?.hostVerifier as (
      fingerprint: string,
      callback: (accepted: boolean) => void,
    ) => boolean | undefined;
    const verified = vi.fn();

    verifier(client.fingerprint, verified);
    session.close();
    approve(true);
    await Promise.resolve();
    await Promise.resolve();

    await expect(connecting).rejects.toThrow('SSH session closed');
    expect(verified).not.toHaveBeenCalled();
    expect(session.state).toBe('disconnected');
  });

  it('opens shell before SFTP and resolves after both are ready when SFTP is available', async () => {
    const client = new FakeClient();
    client.deferShell = true;
    client.deferSftp = true;
    const factory = vi.fn(() => client as never);
    const session = new ClusterSession(factory);
    let resolved = false;
    const connecting = session.connect(trustedCredentials).then(() => { resolved = true; });

    client.completeHandshake();
    await Promise.resolve();
    expect(factory).toHaveBeenCalledOnce();
    expect(client.shell).toHaveBeenCalledOnce();
    expect(client.sftp).not.toHaveBeenCalled();
    expect(client.shellOptions).toEqual({ term: 'xterm-256color', cols: 120, rows: 36 });
    expect(resolved).toBe(false);
    expect(session.state).not.toBe('connected');

    client.resolveShell();
    await Promise.resolve();
    await Promise.resolve();
    expect(client.sftp).toHaveBeenCalledOnce();
    expect(resolved).toBe(false);

    client.resolveSftp();
    await connecting;
    expect(session.shell).toBe(client.shellStream);
    expect(session.getSftp()).toBe(client.sftpWrapper);
    expect(session.state).toBe('connected');
  });

  it('keeps the shell login connected when SFTP is unavailable', async () => {
    const client = new FakeClient();
    client.sftpError = new Error('SFTP unavailable');
    const session = new ClusterSession(() => client as never);
    const connecting = session.connect(trustedCredentials);

    client.completeHandshake();
    await expect(connecting).resolves.toBeUndefined();
    expect(session.shell).toBe(client.shellStream);
    expect(() => session.getSftp()).toThrow('SFTP is not ready');
    expect(client.shellStream.end).not.toHaveBeenCalled();
    expect(client.end).not.toHaveBeenCalled();
    expect(session.state).toBe('connected');
  });

  it('rejects and cleans up when the client errors during channel initialization', async () => {
    const client = new FakeClient();
    client.deferShell = true;
    client.deferSftp = true;
    const session = new ClusterSession(() => client as never);
    const connecting = session.connect(trustedCredentials);
    client.completeHandshake();
    await Promise.resolve();

    client.emit('error', new Error('transport lost'));

    try {
      await expect(connecting).rejects.toThrow('transport lost');
      expect(client.end).toHaveBeenCalledOnce();
      expect(session.state).toBe('failed');
    } finally {
      session.close();
    }
  });

  it('rejects a pending connect and ends the client once when explicitly closed', async () => {
    const client = new FakeClient();
    client.deferShell = true;
    client.deferSftp = true;
    const session = new ClusterSession(() => client as never);
    const connecting = session.connect(trustedCredentials);
    client.completeHandshake();
    await Promise.resolve();

    session.close();
    session.close();

    await expect(connecting).rejects.toThrow('SSH session closed');
    expect(client.end).toHaveBeenCalledOnce();
    expect(session.state).toBe('disconnected');
  });

  it('writes to and resizes the interactive shell', async () => {
    const { client, session } = await connectTrusted();
    const data = Buffer.from('ls\n');

    session.write(data);
    session.resize(132, 42);

    expect(client.shellStream.write).toHaveBeenCalledWith(data);
    expect(client.shellStream.setWindow).toHaveBeenCalledWith(42, 132, 0, 0);
  });

  it('executes a command on the shared client and resolves stdout for code zero', async () => {
    const { client, session } = await connectTrusted();
    const executing = session.exec('hostname');

    client.execStream.emit('data', Buffer.from('compute'));
    client.execStream.emit('data', '-01\n');
    client.execStream.emit('close', 0);

    await expect(executing).resolves.toBe('compute-01\n');
    expect(client.exec).toHaveBeenCalledWith('hostname', expect.any(Function));
  });

  it('obtains and caches the authenticated remote home without interpolating credentials', async () => {
    const { client, session } = await connectTrusted();
    const resolving = session.getHomeDirectory();

    client.execStream.emit('data', Buffer.from('/cluster/home/lin\n'));
    client.execStream.emit('close', 0);

    await expect(resolving).resolves.toBe('/cluster/home/lin');
    await expect(session.getHomeDirectory()).resolves.toBe('/cluster/home/lin');
    expect(client.exec).toHaveBeenCalledTimes(1);
    expect(client.exec).toHaveBeenCalledWith("printf '%s\\n' \"$HOME\"", expect.any(Function));
  });

  it('rejects a non-zero command with collected stderr', async () => {
    const { client, session } = await connectTrusted();
    const executing = session.exec('false');

    client.execStream.stderr.emit('data', 'permission denied\n');
    client.execStream.emit('close', 13);

    await expect(executing).rejects.toThrow('permission denied');
  });

  it('times out an exec command and closes its channel', async () => {
    vi.useFakeTimers();
    try {
      const { client, session } = await connectTrusted();
      const executing = session.exec('sleep 60', 25);
      const rejected = expect(executing).rejects.toThrow('Command timed out after 25 ms');

      await vi.advanceTimersByTimeAsync(25);

      await rejected;
      expect(client.execStream.close).toHaveBeenCalledOnce();
    } finally {
      vi.useRealTimers();
    }
  });

  it('times out while waiting for the command channel to open', async () => {
    vi.useFakeTimers();
    try {
      const { client, session } = await connectTrusted();
      client.deferExec = true;
      const rejected = vi.fn();
      void session.exec('sleep 60', 25).catch(rejected);

      await vi.advanceTimersByTimeAsync(25);

      expect(rejected).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Command timed out after 25 ms',
      }));
    } finally {
      vi.useRealTimers();
    }
  });

  it('aborts a pending command channel when the session closes', async () => {
    const { client, session } = await connectTrusted();
    client.deferExec = true;
    const rejected = vi.fn();
    void session.exec('sleep 60').catch(rejected);

    session.close();
    await Promise.resolve();
    client.resolveExec();

    expect(rejected).toHaveBeenCalledWith(expect.objectContaining({
      message: 'SSH session closed',
    }));
    expect(client.execStream.close).toHaveBeenCalledOnce();
  });

  it('marks an unexpected client close as disconnected and emits once', async () => {
    const { client, session } = await connectTrusted();
    const disconnected = vi.fn();
    session.on('disconnected', disconnected);

    client.emit('close');
    client.emit('close');

    expect(session.state).toBe('disconnected');
    expect(disconnected).toHaveBeenCalledOnce();
  });

  it('rebuilds the remote shell after only the PTY channel dies', async () => {
    const { client, session } = await connectTrusted();
    const shellDead = vi.fn();
    session.onShellDead = shellDead;
    const firstShell = client.shellStream;

    firstShell.emit('close');
    expect(shellDead).toHaveBeenCalledOnce();
    expect(session.shell).toBeUndefined();
    expect(session.state).toBe('connected');

    const replacement = new FakeChannel();
    client.shellStream = replacement;
    await session.respawnShell();

    expect(client.shell).toHaveBeenCalledTimes(2);
    expect(session.shell).toBe(replacement);
    replacement.emit('close');
    expect(shellDead).toHaveBeenCalledTimes(2);
  });

  it('does not mistake the local writable finish event for a dead remote shell', async () => {
    const { client, session } = await connectTrusted();
    const shellDead = vi.fn();
    session.onShellDead = shellDead;

    client.shellStream.emit('finish');

    expect(shellDead).not.toHaveBeenCalled();
    expect(session.shell).toBe(client.shellStream);
    expect(session.state).toBe('connected');
  });

  it('cleans up after a connected client error and reconnects with a fresh client', async () => {
    const firstClient = new FakeClient();
    const secondClient = new FakeClient();
    const factory = vi.fn()
      .mockReturnValueOnce(firstClient as never)
      .mockReturnValueOnce(secondClient as never);
    const session = new ClusterSession(factory);
    const disconnected = vi.fn();
    session.on('disconnected', disconnected);

    const firstConnection = session.connect(trustedCredentials);
    firstClient.completeHandshake();
    await firstConnection;
    const execution = session.exec('sleep 60');

    firstClient.emit('error', new Error('transport lost'));
    await expect(execution).rejects.toThrow('SSH session closed');

    expect(session.state).toBe('disconnected');
    expect(firstClient.shellStream.end).toHaveBeenCalledOnce();
    expect(firstClient.sftpWrapper.end).toHaveBeenCalledOnce();
    expect(firstClient.execStream.close).toHaveBeenCalledOnce();
    expect(firstClient.listenerCount('error')).toBe(0);
    expect(firstClient.listenerCount('close')).toBe(0);
    expect(disconnected).toHaveBeenCalledOnce();

    firstClient.emit('close');
    expect(disconnected).toHaveBeenCalledOnce();

    const secondConnection = session.connect(trustedCredentials);
    secondClient.completeHandshake();
    await secondConnection;

    expect(factory).toHaveBeenCalledTimes(2);
    expect(session.state).toBe('connected');
  });

  it('closes shell, SFTP, and client idempotently', async () => {
    const { client, session } = await connectTrusted();

    session.close();
    session.close();

    expect(client.shellStream.end).toHaveBeenCalledOnce();
    expect(client.sftpWrapper.end).toHaveBeenCalledOnce();
    expect(client.end).toHaveBeenCalledOnce();
    expect(session.state).toBe('disconnected');
  });

  it('removes client lifecycle listeners when explicitly closed', async () => {
    const { client, session } = await connectTrusted();

    session.close();

    expect(client.listenerCount('ready')).toBe(0);
    expect(client.listenerCount('keyboard-interactive')).toBe(0);
    expect(client.listenerCount('error')).toBe(0);
    expect(client.listenerCount('close')).toBe(0);
  });

  it('removes authentication listeners when fingerprint validation fails', async () => {
    const client = new FakeClient();
    const session = new ClusterSession(() => client as never);
    const connecting = session.connect({
      ...trustedCredentials,
      expectedFingerprint: undefined,
    });

    client.completeHandshake();
    await expect(connecting).rejects.toBeInstanceOf(HostFingerprintRequiredError);

    expect(client.listenerCount('ready')).toBe(0);
    expect(client.listenerCount('keyboard-interactive')).toBe(0);
    expect(client.listenerCount('error')).toBe(0);
    expect(client.listenerCount('close')).toBe(0);
  });

  it('rejects with a clear timeout when the login node never opens the shell channel', async () => {
    // 复现"重连中"挂死:握手完成后节点迟迟不放行通道——必须在 60s 后以明确错误失败
    vi.useFakeTimers();
    try {
      const client = new FakeClient();
      client.deferShell = true; // 回调永远不来
      const session = new ClusterSession(() => client as never);
      const connecting = session.connect(trustedCredentials);
      const assertion = expect(connecting).rejects.toThrow(/终端通道建立超时/);
      client.completeHandshake();
      await vi.advanceTimersByTimeAsync(61_000);
      await assertion;
    } finally {
      vi.useRealTimers();
    }
  });

  it('rejects shell rebuild with a timeout when the channel never opens', async () => {
    const { client, session } = await connectTrusted();
    // 杀掉现有 shell 触发重建路径,并让重建回调永远不来
    (session as any).shell = undefined;
    const client2 = client;
    client2.deferShell = true;
    vi.useFakeTimers();
    try {
      const rebuilding = session.respawnShell();
      const assertion = expect(rebuilding).rejects.toThrow(/终端通道重建超时/);
      await vi.advanceTimersByTimeAsync(61_000);
      await assertion;
    } finally {
      vi.useRealTimers();
    }
  });
});
