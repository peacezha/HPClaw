import { describe, expect, it, vi, afterEach } from 'vitest';

// 沙箱里不做真实 DNS:example.com 一律视为公网地址,内网字面量仍走 isPrivateNetworkAddress。
vi.mock('node:dns/promises', () => ({
  default: { lookup: vi.fn(async () => [{ address: '93.184.216.34', family: 4 }]) },
}));
import {
  assertPublicHttpUrl,
  htmlToReadableText,
  isPrivateNetworkAddress,
  parseBingSearchResults,
  parseWebSearchResults,
  readWebPage,
  searchWeb,
} from './webAccess';

describe('safe web access', () => {
  it('blocks local and private literal addresses', async () => {
    for (const value of ['127.0.0.1', '10.0.0.1', '172.16.1.2', '192.168.1.2', '::1', 'fd00::1']) {
      expect(isPrivateNetworkAddress(value)).toBe(true);
    }
    await expect(assertPublicHttpUrl('http://127.0.0.1/secret')).rejects.toThrow('禁止');
    await expect(assertPublicHttpUrl('file:///etc/passwd')).rejects.toThrow('HTTP');
  });

  it('removes active HTML and extracts readable text', () => {
    expect(htmlToReadableText('<h1>Title</h1><script>alert(1)</script><p>Hello &amp; world</p>')).toBe('Title\n Hello & world');
  });

  it('parses and unwraps search result links', () => {
    const html = '<a class="result__a" href="//duckduckgo.com/l/?uddg=https%3A%2F%2Fexample.com%2Fa">Example &amp; result</a>';
    expect(parseWebSearchResults(html)).toEqual([{ title: 'Example & result', url: 'https://example.com/a' }]);
    expect(parseBingSearchResults('<h2><a href="https://example.org/b">Bing <strong>result</strong></a></h2>'))
      .toEqual([{ title: 'Bing result', url: 'https://example.org/b' }]);
  });
});

describe('DeepSeek tools API integration', () => {
  afterEach(() => vi.unstubAllGlobals());

  const auth = { provider: 'deepseek', apiKey: 'sk-test' };

  it('uses the DeepSeek search endpoint with structured results', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      results: [{
        title: 'DeepSeek V4 模型发布', url: 'https://example.com/v4', date: '2026-06-01T00:00:00+00:00',
        summary: '长摘要内容', authority: 3, rerank_score: 2.4,
      }],
    }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const out = await searchWeb({ query: 'DeepSeek V4' }, auth);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe('https://api.deepseek.com/v1/tools/search');
    expect(init.method).toBe('POST');
    expect(init.headers.Authorization).toBe('Bearer sk-test');
    expect(JSON.parse(init.body)).toMatchObject({ query: 'DeepSeek V4', count: 5, need_content: false });
    expect(out).toContain('[UNTRUSTED WEB SEARCH RESULTS]');
    expect(out).toContain('DeepSeek V4 模型发布 — https://example.com/v4（2026-06-01） ★权威来源');
    expect(out).toContain('长摘要内容');
  });

  it('falls back to the scraper path when the DeepSeek search fails', async () => {
    let calls = 0;
    const fetchMock = vi.fn().mockImplementation(() => {
      calls += 1;
      return Promise.resolve(calls === 1
        ? new Response(JSON.stringify({ error: { message: 'quota' } }), { status: 402 })
        : new Response('<h2><a href="https://example.org/b">Fallback result</a></h2>', { status: 200, headers: { 'content-type': 'text/html' } }));
    });
    vi.stubGlobal('fetch', fetchMock);
    const out = await searchWeb({ query: 'test query' }, auth);
    expect(out).toContain('Fallback result');
    expect(String(fetchMock.mock.calls[1][0])).toContain('bing.com');
  });

  it('does not use DeepSeek endpoints for other providers or custom gateways', async () => {
    const fetchMock = vi.fn().mockImplementation(() => Promise.resolve(new Response('<h2><a href="https://example.org/b">R</a></h2>', {
      status: 200, headers: { 'content-type': 'text/html' },
    })));
    vi.stubGlobal('fetch', fetchMock);
    await searchWeb({ query: 'x' }, { provider: 'openai', apiKey: 'sk-x' });
    expect(String(fetchMock.mock.calls[0][0])).toContain('bing.com');
    fetchMock.mockClear();
    await searchWeb({ query: 'x' }, { provider: 'deepseek', apiKey: 'sk-x', baseUrl: 'https://gateway.example.com/v1' });
    expect(String(fetchMock.mock.calls[0][0])).toContain('bing.com');
  });

  it('reads pages through the DeepSeek fetch endpoint as markdown', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      title: 'Example article', content: '# Hello\n\nMarkdown body.',
    }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const out = await readWebPage({ url: 'https://example.com/a' }, auth);
    expect(String(fetchMock.mock.calls[0][0])).toBe('https://api.deepseek.com/v1/tools/fetch');
    expect(out).toContain('[UNTRUSTED WEB CONTENT]');
    expect(out).toContain('标题：Example article');
    expect(out).toContain('# Hello');
  });

  it('blocks private-network URLs before calling the DeepSeek fetch endpoint', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await expect(readWebPage({ url: 'http://192.168.1.1/admin' }, auth)).rejects.toThrow();
    expect(String(fetchMock.mock.calls[0]?.[0] || '')).not.toContain('tools/fetch');
  });
});
