import { lookup } from 'node:dns/promises';
import net from 'node:net';

export function classifyAddress(address: string): 'public' | 'private' | 'blocked' {
  const value = address.toLowerCase().replace(/^::ffff:/, '');
  if (net.isIP(value) === 4) {
    const [a, b] = value.split('.').map(Number);
    if (a === 0 || a === 127 || a === 169 && b === 254 || a >= 224) return 'blocked';
    if (a === 10 || a === 172 && b >= 16 && b <= 31 || a === 192 && b === 168
      || a === 100 && b >= 64 && b <= 127) return 'private';
    return 'public';
  }
  if (net.isIP(value) === 6) {
    // IPv4-mapped hex, translation and tunnelling addresses are not accepted.
    if (!value.startsWith('2') && !value.startsWith('3')) {
      if (/^f[cd]/.test(value)) return 'private';
      return 'blocked';
    }
    if (/^(2001:0:|2001:db8:|2002:)/.test(value)) return 'blocked';
    return 'public';
  }
  return 'blocked';
}

export async function resolveClusterAddress(host: unknown, allowPrivate = false,
  resolver: typeof lookup = lookup): Promise<string> {
  if (typeof host !== 'string' || !host.trim() || host.length > 253
    || /[\s/@?#\\\[\]\x00-\x1f]/.test(host)) throw new Error('集群地址必须是主机名或 IP，不是 URL');
  const normalized = host.trim().toLowerCase();
  const addresses = net.isIP(normalized) ? [{ address: normalized }] : await resolver(normalized, { all: true });
  if (!addresses.length || addresses.some(({ address }) => {
    const kind = classifyAddress(address);
    return kind === 'blocked' || kind === 'private' && !allowPrivate;
  })) throw new Error('禁止连接本机、链路本地或未启用的内网地址；内网集群需管理员配置');
  return addresses[0].address; // Pin SSH to the validated IP, retaining the original host fingerprint.
}
