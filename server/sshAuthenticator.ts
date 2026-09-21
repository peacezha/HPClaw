import { Client } from 'ssh2';

interface AuthResult {
  success: true;
  host: string;
  port: number;
  username: string;
}

interface AuthError {
  success: false;
  error: string;
}

export function verifySSHCredentials(
  host: string,
  port: number,
  username: string,
  password: string,
  verificationCode: string,
  timeout = 15000,
): Promise<AuthResult | AuthError> {
  return new Promise((resolve) => {
    const conn = new Client();
    const timer = setTimeout(() => {
      conn.end();
      resolve({ success: false, error: 'SSH 认证超时（15秒），请检查主机和端口' });
    }, timeout);

    conn.on('ready', () => {
      clearTimeout(timer);
      // Auth succeeded — grab host info then disconnect
      const result: AuthResult = { success: true, host, port, username };
      conn.end();
      resolve(result);
    });

    conn.on('error', (err: Error & { level?: string }) => {
      clearTimeout(timer);
      let msg = err.message || String(err);
      // Map common ssh2 errors to Chinese messages
      if (msg.includes('Authentication failure') || msg.includes('All configured authentication methods failed')) {
        msg = '认证失败，请检查密码和验证码';
      } else if (msg.includes('connect ETIMEDOUT') || msg.includes('Connection timed out')) {
        msg = '连接超时，请检查主机地址和端口是否正确';
      } else if (msg.includes('connect ECONNREFUSED')) {
        msg = '连接被拒绝，请检查端口是否正确';
      } else if (msg.includes('getaddrinfo') || msg.includes('ENOTFOUND')) {
        msg = '无法解析主机名，请检查主机地址';
      } else if (msg.includes('Timed out while waiting for handshake')) {
        msg = 'SSH 握手超时，请检查主机和端口';
      }
      resolve({ success: false, error: msg });
    });

    // Try password first, then keyboard-interactive with both password + code
    const handlers: any[] = [];

    conn.on('keyboard-interactive', (_name, _instructions, _lang, prompts, finish) => {
      const answers: string[] = [];
      for (const prompt of prompts) {
        const lower = prompt.prompt.toLowerCase();
        if (/verification|code|token|mfa|otp|验证|驗證|动态|校验|一次性|二次/.test(lower)) {
          answers.push(verificationCode);
        } else if (/password|passphrase|密码|密碼/.test(lower)) {
          answers.push(password);
        } else {
          answers.push(verificationCode || password);
        }
      }
      finish(answers);
    });

    conn.connect({
      host,
      port,
      username,
      password,
      tryKeyboard: true,
      readyTimeout: 15000,
      timeout: 15000,
      keepaliveInterval: 0,
      algorithms: {
        kex: ['diffie-hellman-group14-sha256', 'diffie-hellman-group14-sha1', 'ecdh-sha2-nistp256', 'ecdh-sha2-nistp384', 'ecdh-sha2-nistp521'],
        cipher: ['aes128-ctr', 'aes192-ctr', 'aes256-ctr', 'aes128-gcm@openssh.com', 'aes256-gcm@openssh.com'],
      },
    });
  });
}
