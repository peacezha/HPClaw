interface LoginFailureDetails {
  code?: number | null;
  signal?: NodeJS.Signals | string | null;
  output?: string;
}

function tail(value: string, maxChars = 700): string {
  const clean = value.replace(/\r/g, '').trim();
  if (!clean) return '';
  return clean.length > maxChars ? clean.slice(-maxChars) : clean;
}

export function formatLoginFailure(details: LoginFailureDetails): string {
  const status = [
    details.code !== undefined && details.code !== null ? `code ${details.code}` : '',
    details.signal ? `signal ${details.signal}` : '',
  ].filter(Boolean).join(', ');
  const output = tail(details.output || '');
  const authFailed = /authentication methods? failed|authentication failed|permission denied/i.test(output);
  return [
    authFailed
      ? 'SSH 认证失败：密码错误或动态验证码无效。注意：同一个动态验证码 30 秒内不可重复使用——如果你刚用它登录了其他集群，请等下一个验证码再试。'
      : `SSH 连接已断开${status ? `（${status}）` : ''}，请检查主机、端口、密码或验证码。`,
    output ? `SSH 最后输出：\n${output}` : '',
  ].filter(Boolean).join('\n');
}
