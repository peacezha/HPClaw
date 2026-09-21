// 直连互传的凭据暂存（仅内存，不落盘）：目标账号的密码与 TOTP 种子，
// 用于在源集群上自动应答 ssh 的 Password:/Verification code: 提示。
// 前端登录成功后同步；进程重启即失效（下次登录会重新同步）。
import crypto from 'node:crypto';

export interface TransferCredentials {
  password: string;
  totpSecret: string;
  updatedAt: number;
}

const store = new Map<string, TransferCredentials>();

function key(host: string, port: number | string, username: string): string {
  return `${host}:${port}:${username}`;
}

export function setTransferCredentials(
  host: string,
  port: number | string,
  username: string,
  password: string,
  totpSecret: string,
): void {
  store.set(key(host, port, username), { password, totpSecret, updatedAt: Date.now() });
}

export function getTransferCredentials(
  host: string,
  port: number | string,
  username: string,
): TransferCredentials | undefined {
  return store.get(key(host, port, username));
}

/** 新增凭据后调用：直连失败缓存需重试 */
export function hasTransferCredentials(host: string, port: number | string, username: string): boolean {
  const c = store.get(key(host, port, username));
  return !!(c && (c.password || c.totpSecret));
}

/** 仅测试用：生成当前 TOTP（server 侧校验脚本用） */
export function totpNow(secret: string): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const cleaned = secret.toUpperCase().replace(/=+$/, '').replace(/\s/g, '');
  const bits: number[] = [];
  for (const ch of cleaned) {
    const val = alphabet.indexOf(ch);
    if (val < 0) continue;
    for (let b = 4; b >= 0; b--) bits.push((val >> b) & 1);
  }
  const keyBytes = Buffer.alloc(Math.floor(bits.length / 8));
  for (let i = 0; i < keyBytes.length; i++) {
    let byte = 0;
    for (let b = 0; b < 8; b++) byte = (byte << 1) | (bits[i * 8 + b] ?? 0);
    keyBytes[i] = byte;
  }
  const counter = Math.floor(Date.now() / 1000 / 30);
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(BigInt(counter));
  const digest = crypto.createHmac('sha1', keyBytes).update(msg).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const code = (digest.readUInt32BE(offset) & 0x7fffffff) % 1_000_000;
  return code.toString().padStart(6, '0');
}
