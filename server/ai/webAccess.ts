import dns from 'node:dns/promises';
import net from 'node:net';

const USER_AGENT = 'TRACE/0.3 (safe web research)';
const MAX_RESPONSE_BYTES = 1_000_000;
const MAX_REDIRECTS = 4;

/** 调用方可用的模型供应商信息:DeepSeek 官方端点优先走 /v1/tools/search|fetch 结构化接口。 */
export interface WebAccessAuth {
  provider?: string;
  apiKey?: string;
  baseUrl?: string;
}

/**
 * 仅当 provider 为 deepseek 且 baseUrl 指向官方端点(或未自定义)时返回可用的
 * tools API base。自定义兼容网关通常没有 /v1/tools/*,回退到本地抓取路径。
 */
function deepseekToolsBase(auth?: WebAccessAuth): string | null {
  if (!auth?.apiKey || auth.provider !== 'deepseek') return null;
  const base = (auth.baseUrl || 'https://api.deepseek.com').replace(/\/+$/, '');
  return /^https:\/\/([^/]*\.)?deepseek\.com$/i.test(base) ? base : null;
}

/** OpenAI 兼容错误格式:尽力提取 message。 */
function extractApiError(status: number, body: string): string {
  try {
    const parsed = JSON.parse(body);
    const message = parsed?.error?.message;
    if (typeof message === 'string' && message) return `HTTP ${status}: ${message}`;
  } catch { /* 非 JSON */ }
  return `HTTP ${status}`;
}

/** DeepSeek Search:结构化结果(标题/链接/长短摘要/日期/权威度)。 */
export async function searchWebDeepSeek(input: { query: string; maxResults?: number }, base: string, apiKey: string): Promise<string> {
  const query = String(input.query || '').replace(/\s+/g, ' ').trim().slice(0, 128);
  if (!query) throw new Error('搜索关键词不能为空');
  const count = Math.max(1, Math.min(50, Number(input.maxResults) || 5));
  const response = await fetch(`${base}/v1/tools/search`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, count, need_content: false }),
    signal: AbortSignal.timeout(25_000),
  });
  if (!response.ok) throw new Error(`DeepSeek 搜索失败：${extractApiError(response.status, (await response.text()).slice(0, 300))}`);
  const data = await response.json() as { results?: Array<Record<string, unknown>> };
  const results = Array.isArray(data.results) ? data.results : [];
  if (results.length === 0) return `[UNTRUSTED WEB SEARCH RESULTS]\n搜索：${query}\n未找到匹配的网页结果。`;
  const lines = results.map((item, index) => {
    const title = String(item.title || '').trim() || '(无标题)';
    const url = String(item.url || '').trim();
    const date = typeof item.date === 'string' && item.date ? item.date.slice(0, 10) : '';
    const authority = typeof item.authority === 'number' && item.authority >= 3 ? ' ★权威来源' : '';
    const summary = String(item.summary || item.snippet || '').trim().slice(0, 800);
    return `${index + 1}. ${title} — ${url}${date ? `（${date}）` : ''}${authority}\n   ${summary}`;
  });
  return `[UNTRUSTED WEB SEARCH RESULTS]\n搜索：${query}\n${lines.join('\n')}`;
}

/** DeepSeek Fetch:抓取单页并返回 Markdown 正文。 */
export async function fetchWebPageDeepSeek(input: { url: string; maxChars?: number }, base: string, apiKey: string): Promise<string> {
  // 先做本地 SSRF 预检:内网/带凭据的地址不应发给第三方抓取服务。
  await assertPublicHttpUrl(input.url);
  const response = await fetch(`${base}/v1/tools/fetch`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: input.url }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`DeepSeek 抓取失败：${extractApiError(response.status, (await response.text()).slice(0, 300))}`);
  const data = await response.json() as { title?: string; content?: string };
  const content = String(data.content || '').trim();
  if (!content) throw new Error('DeepSeek 抓取成功但页面没有可提取的正文');
  const limit = Math.max(1_000, Math.min(30_000, Number(input.maxChars) || 12_000));
  const title = String(data.title || '').trim();
  return `[UNTRUSTED WEB CONTENT]\n来源：${input.url}${title ? `\n标题：${title}` : ''}\n\n${content.slice(0, limit)}`;
}

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)));
}

export function isPrivateNetworkAddress(address: string): boolean {
  if (net.isIPv4(address)) {
    const [a, b] = address.split('.').map(Number);
    return a === 0 || a === 10 || a === 127
      || (a === 100 && b >= 64 && b <= 127)
      || (a === 169 && b === 254)
      || (a === 172 && b >= 16 && b <= 31)
      || (a === 192 && b === 168)
      || a >= 224;
  }
  if (net.isIPv6(address)) {
    const normalized = address.toLowerCase();
    return normalized === '::' || normalized === '::1'
      || normalized.startsWith('fc') || normalized.startsWith('fd')
      || normalized.startsWith('fe8') || normalized.startsWith('fe9')
      || normalized.startsWith('fea') || normalized.startsWith('feb')
      || normalized.startsWith('::ffff:127.')
      || normalized.startsWith('::ffff:10.')
      || normalized.startsWith('::ffff:192.168.');
  }
  return true;
}

export async function assertPublicHttpUrl(input: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new Error('网页地址格式无效');
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error('只允许读取 HTTP/HTTPS 网页');
  if (url.username || url.password) throw new Error('网页地址不能包含登录凭据');
  const hostname = url.hostname.toLowerCase().replace(/\.$/, '');
  if (!hostname || hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.local')) {
    throw new Error('禁止访问本机或局域网地址');
  }
  if (net.isIP(hostname)) {
    if (isPrivateNetworkAddress(hostname)) throw new Error('禁止访问本机或局域网地址');
    return url;
  }
  const addresses = await dns.lookup(hostname, { all: true, verbatim: true });
  if (addresses.length === 0 || addresses.some(item => isPrivateNetworkAddress(item.address))) {
    throw new Error('网页域名解析到非公网地址，已阻止访问');
  }
  return url;
}

async function readLimited(response: Response): Promise<string> {
  const declared = Number(response.headers.get('content-length') || 0);
  if (declared > MAX_RESPONSE_BYTES) throw new Error('网页内容过大，拒绝读取');
  if (!response.body) return '';
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_RESPONSE_BYTES) {
      await reader.cancel();
      throw new Error('网页内容超过 1 MB，已停止读取');
    }
    chunks.push(value);
  }
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(merged);
}

async function fetchPublicPage(input: string): Promise<{ url: URL; response: Response; body: string }> {
  let url = await assertPublicHttpUrl(input);
  for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect += 1) {
    const response = await fetch(url, {
      redirect: 'manual',
      headers: { Accept: 'text/html,text/plain,application/json;q=0.8', 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(20_000),
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) throw new Error(`网页重定向缺少目标地址（HTTP ${response.status}）`);
      if (redirect === MAX_REDIRECTS) throw new Error('网页重定向次数过多');
      url = await assertPublicHttpUrl(new URL(location, url).toString());
      continue;
    }
    if (!response.ok) throw new Error(`网页读取失败：HTTP ${response.status}`);
    const contentType = response.headers.get('content-type')?.toLowerCase() || '';
    if (!/(text\/|application\/(json|xml|xhtml\+xml))/.test(contentType)) {
      throw new Error(`不支持读取该内容类型：${contentType || 'unknown'}`);
    }
    return { url, response, body: await readLimited(response) };
  }
  throw new Error('网页重定向失败');
}

export function htmlToReadableText(html: string): string {
  return decodeHtml(html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<\/(p|div|section|article|main|header|footer|li|tr|h[1-6])>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' '))
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();
}

export async function readWebPage(input: { url: string; maxChars?: number }, auth?: WebAccessAuth): Promise<string> {
  // DeepSeek 官方 Fetch 接口优先(返回干净的 Markdown 正文,不怕 JS 渲染页);
  // 失败(401/402/429/404 等)自动回退本地抓取,保证可用性。
  const dsBase = deepseekToolsBase(auth);
  if (dsBase) {
    try {
      return await fetchWebPageDeepSeek(input, dsBase, auth!.apiKey!);
    } catch {
      // 回退本地抓取
    }
  }
  const { url, response, body } = await fetchPublicPage(input.url);
  const contentType = response.headers.get('content-type')?.toLowerCase() || '';
  const text = contentType.includes('html') ? htmlToReadableText(body) : body.trim();
  const limit = Math.max(1_000, Math.min(30_000, Number(input.maxChars) || 12_000));
  return `[UNTRUSTED WEB CONTENT]\n来源：${url.toString()}\n\n${text.slice(0, limit) || '(网页没有可读正文)'}`;
}

function resultUrl(raw: string): string | null {
  try {
    const decoded = decodeHtml(raw);
    const candidate = new URL(decoded, 'https://html.duckduckgo.com/');
    const target = candidate.hostname.endsWith('duckduckgo.com') && candidate.searchParams.get('uddg')
      ? new URL(candidate.searchParams.get('uddg') as string)
      : candidate;
    return target.protocol === 'http:' || target.protocol === 'https:' ? target.toString() : null;
  } catch {
    return null;
  }
}

export function parseWebSearchResults(html: string, maxResults = 5): Array<{ title: string; url: string }> {
  const results: Array<{ title: string; url: string }> = [];
  const pattern = /<a\b[^>]*class=["'][^"']*result__a[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  for (const match of html.matchAll(pattern)) {
    const url = resultUrl(match[1]);
    const title = htmlToReadableText(match[2]).slice(0, 300);
    if (url && title && !results.some(item => item.url === url)) results.push({ title, url });
    if (results.length >= maxResults) break;
  }
  return results;
}

export function parseBingSearchResults(html: string, maxResults = 5): Array<{ title: string; url: string }> {
  const results: Array<{ title: string; url: string }> = [];
  const pattern = /<h2\b[^>]*>\s*<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>\s*<\/h2>/gi;
  for (const match of html.matchAll(pattern)) {
    const url = resultUrl(match[1]);
    const title = htmlToReadableText(match[2]).slice(0, 300);
    if (url && title && !results.some(item => item.url === url)) results.push({ title, url });
    if (results.length >= maxResults) break;
  }
  return results;
}

export async function searchWeb(input: { query: string; maxResults?: number }, auth?: WebAccessAuth): Promise<string> {
  const query = String(input.query || '').replace(/\s+/g, ' ').trim().slice(0, 500);
  if (!query) throw new Error('搜索关键词不能为空');
  const maxResults = Math.max(1, Math.min(10, Number(input.maxResults) || 5));
  // DeepSeek 官方 Search 接口优先(结构化摘要/日期/权威度);失败回退本地爬虫。
  const dsBase = deepseekToolsBase(auth);
  if (dsBase) {
    try {
      return await searchWebDeepSeek({ query, maxResults }, dsBase, auth!.apiKey!);
    } catch {
      // 回退本地爬虫
    }
  }
  const providers = [
    {
      name: 'Bing',
      url: 'https://www.bing.com/search',
      parse: parseBingSearchResults,
    },
    {
      name: 'DuckDuckGo',
      url: 'https://html.duckduckgo.com/html/',
      parse: parseWebSearchResults,
    },
  ];
  let results: Array<{ title: string; url: string }> = [];
  const failures: string[] = [];
  for (const provider of providers) {
    try {
      const searchUrl = new URL(provider.url);
      searchUrl.searchParams.set('q', query);
      const { body } = await fetchPublicPage(searchUrl.toString());
      results = provider.parse(body, maxResults);
      if (results.length > 0) break;
      failures.push(`${provider.name}: 未解析到结果`);
    } catch (error) {
      failures.push(`${provider.name}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  if (results.length === 0 && failures.length === providers.length) {
    throw new Error(`联网搜索暂不可用（${failures.join('；')}）`);
  }
  return `[UNTRUSTED WEB SEARCH RESULTS]\n搜索：${query}\n${results.map((item, index) => `${index + 1}. ${item.title} — ${item.url}`).join('\n') || '未找到可解析的网页结果。'}`;
}
