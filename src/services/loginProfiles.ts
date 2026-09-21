// 登录账号档案：记住多个集群账号（主机/端口/用户名/密码/TOTP 秘钥），
// 登录界面下拉切换。桌面端走 safeStorage 加密的 profile-store（secrets 加密落盘），
// 浏览器开发模式退化为 localStorage（明文，仅开发用）。

export interface LoginProfile {
  id: string; // `${host}:${port}:${username}`
  name: string; // 显示名，如 user@login.example.edu
  host: string;
  port: string;
  username: string;
  hasSavedPassword: boolean;
  hasSavedTotp: boolean;
  lastUsedAt?: number;
}

export interface ProfileSecrets {
  password: string;
  totpSecret: string;
}

const LS_KEY = 'hpclaw_login_profiles_v1';

interface LocalProfileRecord {
  id: string;
  name: string;
  host: string;
  port: string;
  username: string;
  password?: string;
  totpSecret?: string;
  lastUsedAt?: number;
}

export function loginProfileId(host: string, port: string, username: string): string {
  const normalizedPort = Number(String(port).trim());
  return `${host.trim().toLowerCase()}:${Number.isInteger(normalizedPort) && normalizedPort > 0 ? normalizedPort : String(port).trim()}:${username.trim()}`;
}

export function findMatchingLoginProfile(
  profiles: LoginProfile[],
  identity: { host: string; port: string; username: string },
): LoginProfile | undefined {
  const expected = loginProfileId(identity.host, identity.port, identity.username);
  return profiles.find(profile => loginProfileId(profile.host, profile.port, profile.username) === expected);
}

function desktopProfiles(): any | null {
  return (window as any).hpclawDesktop?.profiles ?? null;
}

function readLocal(): LocalProfileRecord[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal(records: LocalProfileRecord[]): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(records));
  } catch { /* localStorage unavailable */ }
}

function toLoginProfile(p: LocalProfileRecord): LoginProfile {
  return {
    id: p.id,
    name: p.name,
    host: p.host,
    port: String(p.port),
    username: p.username,
    hasSavedPassword: !!p.password,
    hasSavedTotp: !!p.totpSecret,
    lastUsedAt: p.lastUsedAt,
  };
}

export async function listLoginProfiles(): Promise<LoginProfile[]> {
  const desktop = desktopProfiles();
  let list: LoginProfile[] = [];
  if (desktop) {
    try {
      const raw = await desktop.list();
      list = (Array.isArray(raw) ? raw : []).map((p: any): LoginProfile => ({
        id: p.id,
        name: p.name || `${p.username}@${p.host}`,
        host: p.host,
        port: String(p.port),
        username: p.username,
        hasSavedPassword: !!p.hasSavedPassword,
        hasSavedTotp: !!p.hasSavedTotp,
        lastUsedAt: p.lastUsedAt,
      }));
    } catch { /* 桌面通道失败则退回 localStorage */ }
  } else {
    list = readLocal().map(toLoginProfile);
  }
  // 去重兜底：同一 host:port:username 只显示最近使用的一条
  const byKey = new Map<string, LoginProfile>();
  for (const p of list) {
    const key = loginProfileId(p.host, p.port, p.username);
    const existing = byKey.get(key);
    if (!existing || (p.lastUsedAt || 0) >= (existing.lastUsedAt || 0)) byKey.set(key, p);
  }
  return [...byKey.values()].sort((a, b) => (b.lastUsedAt || 0) - (a.lastUsedAt || 0));
}

export async function getProfileSecrets(id: string): Promise<ProfileSecrets | null> {
  const desktop = desktopProfiles();
  if (desktop) {
    try {
      const creds = await desktop.getCredentials(id);
      return { password: creds?.password || '', totpSecret: creds?.totpSecret || '' };
    } catch {
      return null;
    }
  }
  const record = readLocal().find(p => p.id === id);
  if (!record) return null;
  return { password: record.password || '', totpSecret: record.totpSecret || '' };
}

export async function saveLoginProfile(input: {
  host: string;
  port: string;
  username: string;
  password?: string;
  totpSecret?: string;
}): Promise<LoginProfile> {
  const keyId = loginProfileId(input.host, input.port, input.username);
  const name = `${input.username.trim()}@${input.host.trim()}`;
  const desktop = desktopProfiles();
  if (desktop) {
    // 若同一账号已存在（即使是历史随机 UUID id），复用其 id 更新而不是新建，
    // 避免同一账号以多种 id 并存造成冗余
    let id = keyId;
    try {
      const existing = await desktop.list();
      const found = (Array.isArray(existing) ? existing : []).find((p: any) =>
        loginProfileId(p.host, String(p.port), p.username) === keyId);
      if (found) id = found.id;
    } catch { /* 列表失败则按规范 id 保存 */ }
    await desktop.save({
      id,
      name,
      host: input.host.trim(),
      port: Number(input.port) || 22,
      username: input.username.trim(),
      password: input.password,
      totpSecret: input.totpSecret,
      lastUsedAt: Date.now(),
    });
    const creds = { hasSavedPassword: !!input.password, hasSavedTotp: !!input.totpSecret };
    return { id, name, host: input.host.trim(), port: String(input.port), username: input.username.trim(), ...creds, lastUsedAt: Date.now() };
  }
  const records = readLocal();
  const index = records.findIndex(p => loginProfileId(p.host, p.port, p.username) === keyId);
  const record: LocalProfileRecord = {
    id: keyId,
    name,
    host: input.host.trim(),
    port: String(input.port).trim(),
    username: input.username.trim(),
    password: input.password ?? (index >= 0 ? records[index].password : undefined),
    totpSecret: input.totpSecret ?? (index >= 0 ? records[index].totpSecret : undefined),
    lastUsedAt: Date.now(),
  };
  if (index >= 0) records[index] = record;
  else records.push(record);
  writeLocal(records);
  return toLoginProfile(record);
}

export async function removeLoginProfile(id: string): Promise<void> {
  const desktop = desktopProfiles();
  if (desktop) {
    await desktop.remove(id);
    return;
  }
  writeLocal(readLocal().filter(p => p.id !== id));
}
