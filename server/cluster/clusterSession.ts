import { EventEmitter } from 'node:events';
import {
  Client,
  type ClientChannel,
  type ConnectConfig,
  type KeyboardInteractiveCallback,
  type Prompt,
  type SFTPWrapper,
  type VerifyCallback,
} from 'ssh2';
import type { ConnectionState } from '../../shared/fileTransfer';

export interface ClusterCredentials {
  host: string;
  port: number;
  username: string;
  password: string;
  verificationCode: string;
  expectedFingerprint?: string;
}

export type TrustFingerprint = (fingerprint: string) => Promise<boolean>;

/** shell/SFTP 通道建立上限：SSH 握手成功后，登录节点可能迟迟不放行通道
 * （节点过载、fork 受限或家目录存储卡顿）。没有超时的话重连会永远停在"重连中"。 */
const CHANNEL_SETUP_TIMEOUT_MS = 60_000;

function createChannelSetupTimeout(label: string): { promise: Promise<never>; cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const promise = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`${label}超时（${CHANNEL_SETUP_TIMEOUT_MS / 1000} 秒无响应）：集群登录节点可能过载或存储卡顿，请稍后重试`));
    }, CHANNEL_SETUP_TIMEOUT_MS);
    timer.unref?.();
  });
  return { promise, cancel: () => { if (timer) clearTimeout(timer); } };
}

export class HostFingerprintRequiredError extends Error {
  readonly code = 'HOST_FINGERPRINT_REQUIRED';

  constructor(readonly fingerprint: string) {
    super(`Host fingerprint confirmation is required: ${fingerprint}`);
    this.name = 'HostFingerprintRequiredError';
  }
}

export class HostFingerprintMismatchError extends Error {
  readonly code = 'HOST_FINGERPRINT_MISMATCH';

  constructor(
    readonly expected: string,
    readonly actual: string,
  ) {
    super(`Host fingerprint mismatch: expected ${expected}, received ${actual}`);
    this.name = 'HostFingerprintMismatchError';
  }
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

function answerPrompt(
  prompt: Prompt,
  credentials: ClusterCredentials,
): string {
  const text = prompt.prompt.toLowerCase();
  console.log('[SSH] answerPrompt: prompt=%s credentials.verificationCode=%s', text, credentials.verificationCode ? '***' : '(empty)');
  if (/verification|otp|code|token|mfa|验证码|驗證碼|验证|驗證|动态|動態|校验|校驗|一次性|二次/.test(text)) {
    console.log('[SSH] answerPrompt: matched verification, returning verificationCode');
    return credentials.verificationCode;
  }
  if (/password|passphrase|密码|密碼|口令/.test(text)) {
    console.log('[SSH] answerPrompt: matched password, returning password');
    return credentials.password;
  }
  console.log('[SSH] answerPrompt: no match, returning password (default)');
  return credentials.password;
}

export class ClusterSession extends EventEmitter {
  state: ConnectionState = 'disconnected';
  shell?: ClientChannel;
  sftp?: SFTPWrapper;
  /** 登录后探测并缓存的调度器画像（lsf/slurm/pbs/none），按账号持久化打标签。 */
  scheduler?: import('./schedulerProfile').SchedulerKind;
  /** 是否有 Environment Modules；false 时装软件走直装（conda/mamba/pip/二进制） */
  moduleAvailable?: boolean;
  /** 探测到的直装包管理器（mamba/conda/uv/pip3） */
  installers?: string[];
  /** shell 通道死亡（bash 退出/通道断开）时触发 */
  onShellDead?: (reason?: string) => void;

  private client?: Client;
  private closed = true;
  private disconnectedEmitted = false;
  private clientListenerCleanup?: () => void;
  private connectionAbort?: (reason: Error) => void;
  private readonly activeExecutionAborts = new Set<(reason: Error) => void>();
  private homeDirectory?: Promise<string>;
  private shellRespawn?: Promise<void>;

  constructor(private readonly createClient: () => Client = () => new Client()) {
    super();
  }

  async connect(
    credentials: ClusterCredentials,
    trustFingerprint?: TrustFingerprint,
  ): Promise<void> {
    if (!this.closed) {
      throw new Error('SSH session is already connecting or connected');
    }

    const client = this.createClient();
    this.client = client;
    this.closed = false;
    this.disconnectedEmitted = false;
    this.homeDirectory = undefined;
    this.state = 'connecting';

    let fingerprintError: HostFingerprintRequiredError | HostFingerprintMismatchError | undefined;
    let initializationError: Error | undefined;
    let handshakeComplete = false;
    let readyListener: (() => void) | undefined;
    let rejectHandshake: ((error: Error) => void) | undefined;
    let rejectInitialization: ((error: Error) => void) | undefined;

    const onKeyboardInteractive = (
      name: string,
      instructions: string,
      _language: string,
      prompts: Prompt[],
      finish: KeyboardInteractiveCallback,
    ): void => {
      const answers = prompts.map(prompt => answerPrompt(prompt, credentials));
      console.log('[SSH] keyboard-interactive prompts:', JSON.stringify(prompts.map(p => p.prompt)));
      console.log('[SSH] keyboard-interactive name:', name, 'instructions:', instructions);
      console.log('[SSH] keyboard-interactive answers:', JSON.stringify(answers.map(a => a ? '***' : '(empty)')));
      finish(answers);
    };

    const removeAuthenticationListeners = (): void => {
      if (readyListener) {
        client.off('ready', readyListener);
        readyListener = undefined;
      }
      client.off('keyboard-interactive', onKeyboardInteractive);
    };

    const removeClientListeners = (): void => {
      removeAuthenticationListeners();
      client.off('error', onClientError);
      client.off('close', onClientClose);
      if (this.clientListenerCleanup === removeClientListeners) {
        this.clientListenerCleanup = undefined;
      }
    };

    const onClientError = (error: Error): void => {
      console.error('[SSH] client error (handshakeComplete=%s): %s', handshakeComplete, error.message);
      if (!handshakeComplete) {
        rejectHandshake?.(fingerprintError ?? error);
        return;
      }
      if (this.client === client && this.state === 'connected') {
        this.close(`client-error: ${error.message}`);
        return;
      }
      if (this.client === client && this.state !== 'disconnected') {
        this.state = 'failed';
        initializationError = error;
        rejectInitialization?.(error);
      }
    };

    const onClientClose = (): void => {
      if (!handshakeComplete) {
        rejectHandshake?.(new Error('SSH connection closed before authentication completed'));
      } else {
        rejectInitialization?.(new Error('SSH connection closed during initialization'));
      }
      this.markDisconnected(client, removeClientListeners, 'remote-transport-close');
    };

    const onReady = (): void => {
      handshakeComplete = true;
      removeAuthenticationListeners();
      this.state = 'authenticating';
      if (rejectHandshake && this.connectionAbort === rejectHandshake) {
        this.connectionAbort = undefined;
      }
      rejectHandshake = undefined;
    };

    this.clientListenerCleanup = removeClientListeners;
    client.on('keyboard-interactive', onKeyboardInteractive);
    client.on('error', onClientError);
    client.on('close', onClientClose);

    try {
      await new Promise<void>((resolve, reject) => {
        let settled = false;
        const rejectCurrentHandshake = (error: Error): void => {
          if (settled) return;
          settled = true;
          removeAuthenticationListeners();
          if (this.connectionAbort === rejectCurrentHandshake) {
            this.connectionAbort = undefined;
          }
          reject(error);
        };
        rejectHandshake = rejectCurrentHandshake;
        this.connectionAbort = rejectCurrentHandshake;

        readyListener = () => {
          if (settled) return;
          settled = true;
          onReady();
          resolve();
        };
        client.once('ready', readyListener);

        const hostVerifier = ((
          fingerprint: string,
          callback?: VerifyCallback,
        ): boolean | undefined => {
          this.state = 'awaiting-fingerprint';
          let accepted = false;

          if (credentials.expectedFingerprint === fingerprint) {
            accepted = true;
            this.state = 'authenticating';
          } else if (credentials.expectedFingerprint) {
            fingerprintError = new HostFingerprintMismatchError(
              credentials.expectedFingerprint,
              fingerprint,
            );
          } else if (trustFingerprint && callback) {
            void trustFingerprint(fingerprint).then(
              trusted => {
                if (this.client !== client || this.closed) return;
                if (!trusted) {
                  fingerprintError = new HostFingerprintRequiredError(fingerprint);
                } else {
                  this.state = 'authenticating';
                }
                callback(trusted);
              },
              () => {
                if (this.client !== client || this.closed) return;
                fingerprintError = new HostFingerprintRequiredError(fingerprint);
                callback(false);
              },
            );
            return undefined;
          } else {
            fingerprintError = new HostFingerprintRequiredError(fingerprint);
          }

          if (callback) {
            callback(accepted);
            return undefined;
          }
          return accepted;
        }) as ConnectConfig['hostVerifier'];

        const hasVerificationCode = credentials.verificationCode.trim().length > 0;
        const config: ConnectConfig = {
          host: credentials.host,
          port: credentials.port,
          username: credentials.username,
          tryKeyboard: true,
          readyTimeout: 60_000,
          keepaliveInterval: 15_000,
          keepaliveCountMax: 3,
          hostHash: 'sha256',
          hostVerifier,
        };
        if (!hasVerificationCode) {
          config.password = credentials.password;
        }

        this.state = 'authenticating';
        try {
          client.connect(config);
        } catch (error) {
          rejectHandshake(toError(error));
        }
      });

      if (this.client !== client || this.closed) {
        throw new Error('SSH connection closed during initialization');
      }
      if (initializationError) throw initializationError;

      let initializing = true;
      let openedShell: ClientChannel | undefined;
      let openedSftp: SFTPWrapper | undefined;

      const closedDuringInitialization = new Promise<never>((_resolve, reject) => {
        const rejectCurrentInitialization = (error: Error): void => reject(error);
        rejectInitialization = rejectCurrentInitialization;
        this.connectionAbort = rejectCurrentInitialization;
      });

      const shellPromise = new Promise<ClientChannel>((resolve, reject) => {
        client.shell(
          { term: 'xterm-256color', cols: 120, rows: 36 },
          (error, stream) => {
            if (error) {
              console.error('[SSH] shell open failed:', error.message);
              reject(error);
              return;
            }
            if (!initializing) {
              stream.end();
              return;
            }
            openedShell = stream;
            resolve(stream);
          },
        );
      });

      const openSftp = (): Promise<SFTPWrapper | undefined> =>
        new Promise(resolve => {
          client.sftp((error, sftp) => {
            if (error) {
              console.error('[SSH] SFTP open failed:', error.message);
              resolve(undefined);
              return;
            }
            if (!initializing) {
              sftp.end();
              resolve(undefined);
              return;
            }
            openedSftp = sftp;
            resolve(sftp);
          });
        });

      try {
        // shell/SFTP 通道建立只竞速"连接中断"是不够的：登录节点收完认证却
        // 迟迟不放行通道时(节点过载/存储卡顿),没有超时重连会永远挂起。
        const shellSetupTimeout = createChannelSetupTimeout('终端通道建立');
        let shell: ClientChannel;
        try {
          shell = await Promise.race([shellPromise, closedDuringInitialization, shellSetupTimeout.promise]);
        } finally {
          shellSetupTimeout.cancel();
        }
        if (this.client !== client || this.closed) {
          shell.end();
          throw new Error('SSH connection closed during initialization');
        }

        this.shell = shell;

        const sftpSetupTimeout = createChannelSetupTimeout('文件通道建立');
        let sftp: SFTPWrapper | undefined;
        try {
          sftp = await Promise.race([openSftp(), closedDuringInitialization, sftpSetupTimeout.promise]);
        } finally {
          sftpSetupTimeout.cancel();
        }
        initializing = false;
        if (rejectInitialization && this.connectionAbort === rejectInitialization) {
          this.connectionAbort = undefined;
        }
        rejectInitialization = undefined;
        if (this.client !== client || this.closed) {
          shell.end();
          sftp?.end();
          throw new Error('SSH connection closed during initialization');
        }

        this.shell = shell;
        this.watchShellClose(shell);
        this.sftp = sftp;
        this.state = 'connected';
      } catch (error) {
        initializing = false;
        if (rejectInitialization && this.connectionAbort === rejectInitialization) {
          this.connectionAbort = undefined;
        }
        rejectInitialization = undefined;
        openedShell?.end();
        openedSftp?.end();
        throw error;
      }
    } catch (error) {
      removeClientListeners();
      if (this.client === client) {
        this.shell = undefined;
        this.sftp = undefined;
        this.client = undefined;
        this.closed = true;
        this.state = 'failed';
        client.end();
      }
      throw toError(error);
    }
  }

  write(data: string | Buffer): void {
    if (this.state !== 'connected' || !this.shell) {
      throw new Error('SSH shell is not ready');
    }
    this.shell.write(data);
  }

  private watchShellClose(shell: ClientChannel): void {
    const markDead = (reason: string) => {
      if (this.shell === shell) {
        console.warn('[SSH] interactive shell ended reason=%s; transport state=%s', reason, this.state);
        this.shell = undefined;
        this.onShellDead?.(reason);
      }
    };
    // close/end 足以表示远端 PTY 结束。finish 是本地 Writable 生命周期事件，
    // 把它当成远端死亡会产生误报并遮住仍可用的终端。
    shell.once('close', () => markDead('close'));
    shell.once('end', () => markDead('end'));
  }

  /** shell 通道死亡后重建（要求 SSH 连接仍存活） */
  async respawnShell(): Promise<void> {
    if (this.state !== 'connected' || !this.client) {
      throw new Error('SSH is not connected');
    }
    if (this.shell) return;
    if (this.shellRespawn) return this.shellRespawn;

    const client = this.client;
    const pending = (async () => {
      // 与 connect 同理：登录节点不放行通道时必须有超时，否则终端恢复永远挂起
      const setupTimeout = createChannelSetupTimeout('终端通道重建');
      let shell: ClientChannel;
      try {
        shell = await Promise.race([
          new Promise<ClientChannel>((resolve, reject) => {
            client.shell(
              { term: 'xterm-256color', cols: 120, rows: 36 },
              (error, stream) => {
                if (error) reject(error);
                else resolve(stream);
              },
            );
          }),
          setupTimeout.promise,
        ]);
      } finally {
        setupTimeout.cancel();
      }
      if (this.client !== client || this.state !== 'connected' || this.closed) {
        shell.end();
        throw new Error('SSH connection closed while rebuilding shell');
      }
      this.shell = shell;
      this.watchShellClose(shell);
    })();
    this.shellRespawn = pending;
    try {
      await pending;
    } finally {
      if (this.shellRespawn === pending) this.shellRespawn = undefined;
    }
  }

  resize(cols: number, rows: number): void {
    if (this.state !== 'connected' || !this.shell) {
      throw new Error('SSH shell is not ready');
    }
    this.shell.setWindow(rows, cols, 0, 0);
  }

  getSftp(): SFTPWrapper {
    if (this.state !== 'connected' || !this.sftp) {
      throw new Error('SFTP is not ready');
    }
    return this.sftp;
  }

  getHomeDirectory(): Promise<string> {
    if (!this.homeDirectory) {
      const resolvingHome = this.exec("printf '%s\\n' \"$HOME\"", 5_000)
        .then(output => {
          const home = output.trim();
          if (!home || !home.startsWith('/') || home.includes('\0') || /[\r\n]/.test(home)) {
            throw new Error('Remote home directory is invalid');
          }
          return home;
        });
      const cachedHome = resolvingHome.catch(error => {
        if (this.homeDirectory === cachedHome) this.homeDirectory = undefined;
        throw error;
      });
      this.homeDirectory = cachedHome;
    }
    return this.homeDirectory;
  }

  exec(command: string, timeoutMs = 30_000): Promise<string> {
    const client = this.client;
    if (this.state !== 'connected' || !client) {
      return Promise.reject(new Error('SSH is not connected'));
    }

    return new Promise((resolve, reject) => {
      const stdout: Buffer[] = [];
      const stderr: Buffer[] = [];
      let stream: ClientChannel | undefined;
      let settled = false;
      let timer: ReturnType<typeof setTimeout> | undefined;
      let abort: (reason: Error) => void;

      const onStdout = (chunk: string | Buffer): void => {
        stdout.push(Buffer.from(chunk));
      };
      const onStderr = (chunk: string | Buffer): void => {
        stderr.push(Buffer.from(chunk));
      };
      const onStreamError = (streamError: Error): void => {
        finish({ error: streamError });
      };
      const onCommandClose = (code?: number | null): void => {
        if (code === 0) {
          finish({ output: Buffer.concat(stdout).toString('utf8') });
          return;
        }
        const errorText = Buffer.concat(stderr).toString('utf8').trim();
        finish({
          error: new Error(errorText || (
            typeof code === 'number'
              ? `Remote command exited with code ${code}`
              : 'Remote command exited without a status code'
          )),
        });
      };
      const cleanup = (): void => {
        if (timer) clearTimeout(timer);
        stream?.off('data', onStdout);
        stream?.stderr.off('data', onStderr);
        stream?.off('error', onStreamError);
        stream?.off('close', onCommandClose);
        this.activeExecutionAborts.delete(abort);
      };
      const finish = (result: { output: string } | { error: Error }): void => {
        if (settled) return;
        settled = true;
        cleanup();
        if ('error' in result) reject(result.error);
        else resolve(result.output);
      };

      abort = (reason: Error): void => {
        if (settled) return;
        finish({ error: reason });
        stream?.close();
      };
      this.activeExecutionAborts.add(abort);
      timer = setTimeout(() => {
        abort(new Error(`Command timed out after ${timeoutMs} ms`));
      }, timeoutMs);

      try {
        client.exec(command, (error, channel) => {
          if (settled) {
            channel?.close();
            return;
          }
          if (error) {
            finish({ error });
            return;
          }
          stream = channel;
          stream.on('data', onStdout);
          stream.stderr.on('data', onStderr);
          stream.on('error', onStreamError);
          stream.on('close', onCommandClose);
        });
      } catch (error) {
        finish({ error: toError(error) });
      }
    });
  }

  close(reason = 'local-close'): void {
    if (this.closed) return;
    this.closed = true;

    const client = this.client;
    const cleanupListeners = this.clientListenerCleanup;
    const abortConnection = this.connectionAbort;
    this.connectionAbort = undefined;
    const shell = this.shell;
    const sftp = this.sftp;
    this.shell = undefined;
    this.sftp = undefined;
    this.homeDirectory = undefined;
    this.shellRespawn = undefined;

    for (const abort of [...this.activeExecutionAborts]) {
      abort(new Error('SSH session closed'));
    }
    abortConnection?.(new Error('SSH session closed'));

    if (client) {
      this.markDisconnected(client, cleanupListeners, reason);
    } else {
      this.state = 'disconnected';
    }

    try {
      shell?.end();
    } finally {
      try {
        sftp?.end();
      } finally {
        client?.end();
      }
    }
  }

  private markDisconnected(client: Client, cleanupListeners?: () => void, reason = 'unknown'): void {
    if (this.client !== client || this.disconnectedEmitted) return;
    this.disconnectedEmitted = true;
    this.closed = true;
    this.state = 'disconnected';
    this.client = undefined;
    this.shell = undefined;
    this.sftp = undefined;
    this.homeDirectory = undefined;
    this.shellRespawn = undefined;
    cleanupListeners?.();
    for (const abort of [...this.activeExecutionAborts]) {
      abort(new Error('SSH connection closed'));
    }
    console.error('[SSH] disconnected reason=%s', reason);
    this.emit('disconnected', { reason });
  }
}
