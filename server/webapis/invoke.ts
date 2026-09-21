// 通用调用层：从注册表解析服务与端点 → 校验 → 模板替换 path 参数 →
// 组装 query/body → fetch 调用。SSRF 防护：host 只能来自注册表 baseUrl，
// 用户参数只能填 path/query/body 的值，最终 URL 会再校验 host 一致性。

import {
  getWebApiEndpoint,
  getWebApiService,
  WEB_API_CATEGORY_LABELS,
  WEB_API_SERVICES,
  type WebApiCategory,
  type WebApiEndpoint,
  type WebApiService,
} from './registry';

export const WEB_API_TIMEOUT_MS = 20_000;
export const WEB_API_MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
export const WEB_API_MAX_TEXT_CHARS = 200_000;

const USER_AGENT = 'HPClaw/0.3 (public bioinformatics APIs)';

/**
 * 请求头 Accept 保持极简的 application/json：部分上游（UniProt 实测）对带
 * 多类型/q 值的复杂 Accept 会直接 500/400，纯 application/json 与星号通配最安全；
 * 返回 TSV 的上游（KEGG 等）对该头也不设限。
 */
const DEFAULT_ACCEPT = 'application/json';

export type WebApiErrorCode =
  | 'unknown_service'
  | 'unknown_endpoint'
  | 'missing_param'
  | 'unknown_param'
  | 'invalid_url'
  | 'http_client_error'
  | 'http_server_error'
  | 'timeout'
  | 'network_error'
  | 'internal_error';

export interface WebApiInvokeSuccess {
  ok: true;
  service: string;
  endpoint: string;
  url: string;
  status: number;
  durationMs: number;
  contentType: string;
  data?: unknown;
  text?: string;
  truncated: boolean;
}

export interface WebApiInvokeFailure {
  ok: false;
  service?: string;
  endpoint?: string;
  url?: string;
  status?: number;
  durationMs?: number;
  error: { code: WebApiErrorCode; message: string };
}

export type WebApiInvokeResult = WebApiInvokeSuccess | WebApiInvokeFailure;

interface ResolvedParam {
  name: string;
  required: boolean;
  location: 'path' | 'query' | 'body';
}

function resolveParams(service: WebApiService, endpoint: WebApiEndpoint): ResolvedParam[] {
  const declared = endpoint.params || [];
  const seen = new Set<string>();
  const resolved: ResolvedParam[] = [];
  for (const param of declared) {
    const inPath = endpoint.path.includes(`{${param.name}}`);
    const location: ResolvedParam['location'] =
      param.in || (inPath ? 'path' : endpoint.method === 'GET' ? 'query' : 'body');
    if (seen.has(`${param.name}:${location}`)) continue;
    seen.add(`${param.name}:${location}`);
    resolved.push({ name: param.name, required: Boolean(param.required), location });
  }
  // path 模板里出现但未声明的占位符也视为必填 path 参数，避免漏声明导致坏 URL。
  for (const match of endpoint.path.matchAll(/\{([^}]+)\}/g)) {
    const name = match[1];
    if (!resolved.some(param => param.name === name)) {
      resolved.push({ name, required: true, location: 'path' });
    }
  }
  return resolved;
}

function fail(
  code: WebApiErrorCode,
  message: string,
  extra: Partial<WebApiInvokeFailure> = {},
): WebApiInvokeFailure {
  return { ok: false, error: { code, message }, ...extra };
}

/** 组装最终请求 URL 与 fetch init；纯函数，便于测试与 SSRF 校验。 */
export function buildWebApiRequest(
  service: WebApiService,
  endpoint: WebApiEndpoint,
  params: Record<string, unknown>,
): { url: string; init: RequestInit } | WebApiInvokeFailure {
  let base: URL;
  try {
    base = new URL(service.baseUrl);
  } catch {
    return fail('invalid_url', `注册表 baseUrl 无法解析: ${service.baseUrl}`, {
      service: service.id,
      endpoint: endpoint.id,
    });
  }
  if (base.protocol !== 'http:' && base.protocol !== 'https:') {
    return fail('invalid_url', `注册表 baseUrl 仅允许 http(s): ${service.baseUrl}`, {
      service: service.id,
      endpoint: endpoint.id,
    });
  }

  const resolved = resolveParams(service, endpoint);
  const unknown = Object.keys(params).filter(name => !resolved.some(param => param.name === name));
  if (unknown.length > 0) {
    return fail(
      'unknown_param',
      `端点 ${service.id}/${endpoint.id} 不支持参数 ${unknown.join(', ')}；可用参数：${resolved.map(param => param.name).join(', ') || '(无)'}`,
      { service: service.id, endpoint: endpoint.id },
    );
  }

  let path = endpoint.path;
  const query = new URLSearchParams();
  const body: Record<string, unknown> = {};
  for (const param of resolved) {
    const raw = params[param.name];
    if (raw === undefined || raw === null || raw === '') {
      if (param.required) {
        return fail('missing_param', `缺少必填参数 ${param.name}（${service.id}/${endpoint.id}）`, {
          service: service.id,
          endpoint: endpoint.id,
        });
      }
      continue;
    }
    if (param.location === 'path') {
      path = path.split(`{${param.name}}`).join(encodeURIComponent(String(raw)));
    } else if (param.location === 'query') {
      query.set(param.name, String(raw));
    } else {
      body[param.name] = raw;
    }
  }
  if (/\{[^}]+\}/.test(path)) {
    return fail('missing_param', `path 模板参数未填齐: ${path}`, {
      service: service.id,
      endpoint: endpoint.id,
    });
  }

  const url = new URL(base.pathname.replace(/\/+$/, '') + path, base);
  const queryString = query.toString();
  if (queryString) url.search = url.search ? `${url.search}&${queryString}` : queryString;

  // SSRF 防护：最终 URL 的 host 必须与注册表 baseUrl 完全一致（用户无法注入 host）。
  if (url.host !== base.host) {
    return fail('invalid_url', `最终请求 host (${url.host}) 与注册表 (${base.host}) 不一致，已阻止`, {
      service: service.id,
      endpoint: endpoint.id,
    });
  }

  const init: RequestInit = {
    method: endpoint.method,
    headers: {
      Accept: DEFAULT_ACCEPT,
      'User-Agent': USER_AGENT,
    },
  };
  if (endpoint.method === 'POST') {
    (init.headers as Record<string, string>)['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body);
  }
  return { url: url.toString(), init };
}

async function readLimitedBody(response: Response): Promise<{ text: string; truncated: boolean }> {
  if (!response.body) {
    const text = await response.text();
    return { text: text.slice(0, WEB_API_MAX_TEXT_CHARS), truncated: text.length > WEB_API_MAX_TEXT_CHARS };
  }
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  let truncated = false;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > WEB_API_MAX_RESPONSE_BYTES) {
        truncated = true;
        const overflow = total - WEB_API_MAX_RESPONSE_BYTES;
        chunks.push(value.slice(0, value.byteLength - overflow));
        await reader.cancel().catch(() => undefined);
        break;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock?.();
  }
  const merged = new Uint8Array(chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0));
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  let text = new TextDecoder().decode(merged);
  if (text.length > WEB_API_MAX_TEXT_CHARS) {
    truncated = true;
    text = text.slice(0, WEB_API_MAX_TEXT_CHARS);
  }
  return { text, truncated };
}

function classifyFetchError(err: unknown): { code: WebApiErrorCode; message: string } {
  const anyErr = err as { name?: string; message?: string; cause?: { code?: string; message?: string } };
  const causeCode = anyErr?.cause?.code || '';
  const rawMessage = `${anyErr?.message || String(err)}${causeCode ? ` (${causeCode})` : ''}`;
  if (
    anyErr?.name === 'TimeoutError'
    || anyErr?.name === 'AbortError'
    || /timed? ?out|aborted due to timeout/i.test(rawMessage)
  ) {
    return { code: 'timeout', message: `请求超时（${WEB_API_TIMEOUT_MS / 1000}s 未响应）: ${rawMessage}` };
  }
  if (/ENOTFOUND|EAI_AGAIN|getaddrinfo/i.test(rawMessage)) {
    return { code: 'network_error', message: `域名解析失败（DNS）: ${rawMessage}` };
  }
  return { code: 'network_error', message: `网络请求失败: ${rawMessage}` };
}

export async function invokeWebApi(
  serviceId: string,
  endpointId: string,
  params: Record<string, unknown> = {},
): Promise<WebApiInvokeResult> {
  const service = getWebApiService(serviceId);
  if (!service) {
    return fail('unknown_service', `未注册的数据服务: ${serviceId}（先用目录或 search 确认服务 id）`);
  }
  const endpoint = getWebApiEndpoint(service, endpointId);
  if (!endpoint) {
    return fail(
      'unknown_endpoint',
      `服务 ${serviceId} 没有端点 ${endpointId}；可用端点：${service.endpoints.map(item => item.id).join(', ')}`,
      { service: service.id },
    );
  }

  const built = buildWebApiRequest(service, endpoint, params || {});
  if ('error' in built) return built;
  const { url, init } = built;

  const started = Date.now();
  let response: Response;
  try {
    response = await fetch(url, { ...init, signal: AbortSignal.timeout(WEB_API_TIMEOUT_MS) });
  } catch (err) {
    const classified = classifyFetchError(err);
    return fail(classified.code, classified.message, {
      service: service.id,
      endpoint: endpoint.id,
      url,
      durationMs: Date.now() - started,
    });
  }
  const durationMs = Date.now() - started;
  const contentType = (response.headers.get('content-type') || '').toLowerCase();

  if (response.status >= 400 && response.status < 500) {
    return fail('http_client_error', `上游返回 4xx：HTTP ${response.status}（多为参数/ID 无效）`, {
      service: service.id,
      endpoint: endpoint.id,
      url,
      status: response.status,
      durationMs,
    });
  }
  if (response.status >= 500) {
    return fail('http_server_error', `上游返回 5xx：HTTP ${response.status}（服务端故障，稍后重试）`, {
      service: service.id,
      endpoint: endpoint.id,
      url,
      status: response.status,
      durationMs,
    });
  }

  let body: { text: string; truncated: boolean };
  try {
    body = await readLimitedBody(response);
  } catch (err) {
    const classified = classifyFetchError(err);
    return fail(classified.code, `读取响应体失败: ${classified.message}`, {
      service: service.id,
      endpoint: endpoint.id,
      url,
      status: response.status,
      durationMs: Date.now() - started,
    });
  }

  const base: Omit<WebApiInvokeSuccess, 'ok'> = {
    service: service.id,
    endpoint: endpoint.id,
    url,
    status: response.status,
    durationMs,
    contentType,
    truncated: body.truncated,
  };
  if (contentType.includes('json') || contentType.includes('+json')) {
    try {
      return { ok: true, ...base, data: JSON.parse(body.text) };
    } catch {
      // 声明 JSON 但解析失败（可能是截断或上游异常输出），按文本返回。
    }
  }
  return { ok: true, ...base, text: body.text };
}

/* ---------------- 服务发现（给 AI 用） ---------------- */

export interface WebApiEndpointSummary {
  id: string;
  name: string;
  method: 'GET' | 'POST';
  path: string;
  description: string;
  /** 参数清单（模型按此传参，不要猜参数名） */
  params?: WebApiEndpoint['params'];
}

export interface WebApiServiceSummary {
  id: string;
  name: string;
  category: WebApiCategory;
  categoryLabel: { zh: string; en: string };
  description: string;
  homepage: string;
  docsUrl: string;
  authNote?: string;
  endpoints: WebApiEndpointSummary[];
}

export function summarizeWebApiService(service: WebApiService): WebApiServiceSummary {
  return {
    id: service.id,
    name: service.name,
    category: service.category,
    categoryLabel: WEB_API_CATEGORY_LABELS[service.category],
    description: service.description,
    homepage: service.homepage,
    docsUrl: service.docsUrl,
    ...(service.authNote ? { authNote: service.authNote } : {}),
    endpoints: service.endpoints.map(endpoint => ({
      id: endpoint.id,
      name: endpoint.name,
      method: endpoint.method,
      path: endpoint.path,
      description: endpoint.description,
      params: endpoint.params,
    })),
  };
}

export interface WebApiSearchResult {
  query: string;
  total: number;
  services: WebApiServiceSummary[];
}

/** 按名称/描述/类别/端点关键词过滤服务；空 query 返回全部（截断到 maxResults）。 */
export function searchWebApis(query: string, maxResults = 10): WebApiSearchResult {
  const limit = Math.max(1, Math.min(20, Math.floor(maxResults) || 10));
  const tokens = String(query || '')
    .toLowerCase()
    .split(/[\s,，、/]+/)
    .map(token => token.trim())
    .filter(Boolean)
    .slice(0, 8);

  const scored = WEB_API_SERVICES.map(service => {
    if (tokens.length === 0) return { service, score: 1 };
    const categoryLabel = WEB_API_CATEGORY_LABELS[service.category];
    const nameText = `${service.id} ${service.name}`.toLowerCase();
    const categoryText = `${service.category} ${categoryLabel.zh} ${categoryLabel.en}`.toLowerCase();
    const descriptionText = `${service.description} ${service.authNote || ''}`.toLowerCase();
    const endpointText = service.endpoints
      .map(endpoint => `${endpoint.id} ${endpoint.name} ${endpoint.description}`)
      .join(' ')
      .toLowerCase();
    let score = 0;
    for (const token of tokens) {
      if (nameText.includes(token)) score += 3;
      if (categoryText.includes(token)) score += 2;
      if (endpointText.includes(token)) score += 2;
      if (descriptionText.includes(token)) score += 1;
    }
    return { service, score };
  });

  const matched = scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.service.id.localeCompare(b.service.id))
    .slice(0, limit)
    .map(item => summarizeWebApiService(item.service));

  return { query: String(query || ''), total: matched.length, services: matched };
}
