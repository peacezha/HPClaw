export function resolveRequestSessionId(
  values: { cookie: unknown; header: unknown; auth: unknown },
  hasSession: (id: string) => boolean,
): string | undefined {
  // 显式标识（请求头 / socket auth）优先于 cookie：多集群标签页下 cookie
  // 只记录最近一次登录的会话，若让 cookie 优先会把请求劫持到错误的集群。
  for (const value of [values.header, values.auth, values.cookie]) {
    if (typeof value === 'string' && hasSession(value)) return value;
  }
  return undefined;
}
