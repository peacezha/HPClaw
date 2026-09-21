import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildWebApiRequest,
  invokeWebApi,
  searchWebApis,
  WEB_API_MAX_TEXT_CHARS,
} from './invoke';
import { getWebApiEndpoint, getWebApiService } from './registry';

function jsonResponse(data: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(data), {
    status: init.status ?? 200,
    headers: { 'content-type': 'application/json', ...(init.headers as Record<string, string> || {}) },
  });
}

describe('buildWebApiRequest', () => {
  const uniprot = getWebApiService('uniprot')!;

  it('replaces path templates with encoded values and appends query params', () => {
    const endpoint = getWebApiEndpoint(uniprot, 'entry')!;
    const built = buildWebApiRequest(uniprot, endpoint, { accession: 'P69905' });
    expect('url' in built && built.url).toBe('https://rest.uniprot.org/uniprotkb/P69905');

    const search = getWebApiEndpoint(uniprot, 'search')!;
    const builtSearch = buildWebApiRequest(uniprot, search, { query: 'gene:BRCA1 AND organism_id:9606', size: 5 });
    expect('url' in builtSearch && builtSearch.url).toContain('https://rest.uniprot.org/uniprotkb/search?');
    expect('url' in builtSearch && builtSearch.url).toContain('query=gene%3ABRCA1+AND+organism_id%3A9606');
    expect('url' in builtSearch && builtSearch.url).toContain('size=5');
  });

  it('keeps the registry host no matter what the params contain (SSRF guard)', () => {
    const endpoint = getWebApiEndpoint(uniprot, 'entry')!;
    for (const evil of ['https://evil.example.com/x', '//evil.example.com', 'evil.example.com']) {
      const built = buildWebApiRequest(uniprot, endpoint, { accession: evil });
      expect('url' in built).toBe(true);
      if ('url' in built) {
        expect(new URL(built.url).host).toBe('rest.uniprot.org');
      }
    }
  });

  it('rejects missing required params and unknown params', () => {
    const search = getWebApiEndpoint(uniprot, 'search')!;
    const missing = buildWebApiRequest(uniprot, search, {});
    expect(missing).toMatchObject({ ok: false, error: { code: 'missing_param' } });

    const unknown = buildWebApiRequest(uniprot, search, { query: 'x', host: 'evil.com' });
    expect(unknown).toMatchObject({ ok: false, error: { code: 'unknown_param' } });
  });

  it('assembles POST bodies from body params and keeps query params in the URL', () => {
    const pharos = getWebApiService('pharos')!;
    const graphql = getWebApiEndpoint(pharos, 'graphql')!;
    const built = buildWebApiRequest(pharos, graphql, { query: '{__typename}' });
    expect('init' in built && built.init.method).toBe('POST');
    expect('init' in built && JSON.parse(String(built.init.body))).toEqual({ query: '{__typename}' });
    expect('url' in built && built.url).toBe('https://pharos-api.ncats.io/graphql');

    // idmapping-run 是 POST；from/to/ids 都在 body 里
    const run = getWebApiEndpoint(uniprot, 'idmapping-run')!;
    const builtRun = buildWebApiRequest(uniprot, run, { from: 'UniProtKB_AC-ID', to: 'Ensembl', ids: 'P69905,P68871' });
    expect('init' in builtRun && JSON.parse(String(builtRun.init.body))).toEqual({
      from: 'UniProtKB_AC-ID',
      to: 'Ensembl',
      ids: 'P69905,P68871',
    });
  });
});

describe('invokeWebApi', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('rejects unknown services and endpoints without network', async () => {
    const badService = await invokeWebApi('nope', 'x');
    expect(badService).toMatchObject({ ok: false, error: { code: 'unknown_service' } });
    const badEndpoint = await invokeWebApi('uniprot', 'nope');
    expect(badEndpoint).toMatchObject({ ok: false, error: { code: 'unknown_endpoint' } });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('parses JSON responses into data', async () => {
    (fetch as any).mockResolvedValue(jsonResponse({ accession: 'P69905' }));
    const result = await invokeWebApi('uniprot', 'entry', { accession: 'P69905' });
    expect(result).toMatchObject({
      ok: true,
      service: 'uniprot',
      endpoint: 'entry',
      status: 200,
      truncated: false,
      data: { accession: 'P69905' },
    });
    expect((fetch as any).mock.calls[0][0]).toBe('https://rest.uniprot.org/uniprotkb/P69905');
  });

  it('returns text responses as text and truncates at 200KB', async () => {
    const big = 'A'.repeat(WEB_API_MAX_TEXT_CHARS + 50_000);
    (fetch as any).mockResolvedValue(new Response(big, {
      status: 200,
      headers: { 'content-type': 'text/plain' },
    }));
    const result = await invokeWebApi('kegg', 'get', { entry: 'hsa:10458' });
    expect(result).toMatchObject({ ok: true, status: 200, truncated: true });
    if (result.ok) {
      expect(result.data).toBeUndefined();
      expect(result.text?.length).toBe(WEB_API_MAX_TEXT_CHARS);
    }
  });

  it('marks responses larger than 2MB as truncated', async () => {
    const big = 'B'.repeat(2 * 1024 * 1024 + 1024);
    (fetch as any).mockResolvedValue(new Response(big, {
      status: 200,
      headers: { 'content-type': 'text/plain' },
    }));
    const result = await invokeWebApi('kegg', 'get', { entry: 'map00010' });
    expect(result).toMatchObject({ ok: true, truncated: true });
    if (result.ok) expect(result.text!.length).toBeLessThanOrEqual(WEB_API_MAX_TEXT_CHARS);
  });

  it('distinguishes 4xx and 5xx error shapes', async () => {
    (fetch as any).mockResolvedValue(new Response('bad request', { status: 400 }));
    const client = await invokeWebApi('uniprot', 'entry', { accession: 'BAD' });
    expect(client).toMatchObject({ ok: false, status: 400, error: { code: 'http_client_error' } });

    (fetch as any).mockResolvedValue(new Response('boom', { status: 503 }));
    const server = await invokeWebApi('uniprot', 'entry', { accession: 'P69905' });
    expect(server).toMatchObject({ ok: false, status: 503, error: { code: 'http_server_error' } });
  });

  it('maps aborts to timeout and DNS failures to network_error', async () => {
    (fetch as any).mockRejectedValue(Object.assign(new Error('The operation was aborted due to timeout'), { name: 'TimeoutError' }));
    const timeout = await invokeWebApi('uniprot', 'entry', { accession: 'P69905' });
    expect(timeout).toMatchObject({ ok: false, error: { code: 'timeout' } });

    (fetch as any).mockRejectedValue(Object.assign(new TypeError('fetch failed'), { cause: { code: 'ENOTFOUND' } }));
    const dns = await invokeWebApi('uniprot', 'entry', { accession: 'P69905' });
    expect(dns).toMatchObject({ ok: false, error: { code: 'network_error' } });
    if (!dns.ok) expect(dns.error.message).toContain('ENOTFOUND');
  });
});

describe('searchWebApis', () => {
  it('finds services by name/id keyword', () => {
    const result = searchWebApis('uniprot');
    expect(result.services[0]?.id).toBe('uniprot');
    expect(result.services[0]?.endpoints.length).toBeGreaterThanOrEqual(2);
  });

  it('filters by bilingual category labels', () => {
    const plants = searchWebApis('植物', 20);
    expect(plants.services.length).toBeGreaterThan(0);
    expect(plants.services.every(service => service.category === 'plants')).toBe(true);

    const literature = searchWebApis('literature', 20);
    expect(literature.services.some(service => service.id === 'europepmc')).toBe(true);
  });

  it('matches endpoint descriptions and returns endpoint summaries', () => {
    const result = searchWebApis('ICD-10');
    expect(result.services.some(service => service.id === 'clinicaltables')).toBe(true);
    const first = result.services.find(service => service.id === 'clinicaltables')!;
    expect(first.endpoints[0]).toMatchObject({ id: expect.any(String), method: expect.stringMatching(/GET|POST/) });
  });

  it('returns an empty list for unmatched queries and caps empty queries', () => {
    expect(searchWebApis('zzzz-no-such-thing').services).toEqual([]);
    expect(searchWebApis('', 10).services.length).toBe(10);
  });
});
