export function resolveRequestSessionId(
  values: { cookie: unknown; header: unknown; auth: unknown },
  hasSession: (id: string) => boolean,
): string | undefined {
  // 显式标识（请求头 / socket auth）优先于 cookie：多集群标签页下 cookie
  // 只记录最近一次登录的会话，若让 cookie 优先会把请求劫持到错误的集群。
  // 'local-workbench' 等本地哨兵是最终的本地意图：即使 cookie 里还有
  // 活着的集群会话，也绝不回退劫持——本地工作台与集群彻底脱钩。
  const LOCAL_SENTINELS = new Set(['local-workbench', 'local', 'none']);
  for (const value of [values.header, values.auth, values.cookie]) {
    if (typeof value !== 'string' || !value) continue;
    if (LOCAL_SENTINELS.has(value)) return undefined;
    if (hasSession(value)) return value;
  }
  return undefined;
}
