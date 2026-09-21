import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearProbeAllCache, probeAllWebApis, probeWebApi } from './health';
import { WEB_API_SERVICES } from './registry';

function jsonOk(payload: unknown): Response {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}

describe('probeWebApi', () => {
  beforeEach(() => {
    clearProbeAllCache();
    vi.stubGlobal('fetch', vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reports ok with status and duration when the probe expectation matches', async () => {
    (fetch as any).mockResolvedValue(jsonOk({ esearchresult: { count: '1' } }));
    const result = await probeWebApi('ncbi-eutils');
    expect(result).toMatchObject({ serviceId: 'ncbi-eutils', ok: true, status: 200 });
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('fails when the expected content is missing or the status mismatches', async () => {
    (fetch as any).mockResolvedValue(jsonOk({ something: 'else' }));
    const missing = await probeWebApi('ncbi-eutils');
    expect(missing.ok).toBe(false);
    expect(missing.error).toContain('响应未包含期望内容');
  });

  it('surfaces upstream HTTP errors as probe failures', async () => {
    (fetch as any).mockResolvedValue(new Response('gone', { status: 404 }));
    const result = await probeWebApi('uniprot');
    expect(result).toMatchObject({ serviceId: 'uniprot', ok: false, status: 404 });
    expect(result.error).toContain('http_client_error');
  });

  it('rejects unknown services without touching the network', async () => {
    const result = await probeWebApi('no-such-service');
    expect(result.ok).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe('probeAllWebApis', () => {
  beforeEach(() => {
    clearProbeAllCache();
  });
  afterEach(() => {
    clearProbeAllCache();
    vi.unstubAllGlobals();
  });

  it('runs every service probe with a concurrency cap', async () => {
    let inFlight = 0;
    let maxInFlight = 0;
    vi.stubGlobal('fetch', vi.fn(async () => {
      inFlight += 1;
      maxInFlight = Math.max(maxInFlight, inFlight);
      await new Promise(resolve => setTimeout(resolve, 5));
      inFlight -= 1;
      return jsonOk({ ok: true });
    }));

    const all = await probeAllWebApis(6, { force: true });
    expect(all.results.length).toBe(WEB_API_SERVICES.length);
    expect(all.cached).toBe(false);
    expect(maxInFlight).toBeLessThanOrEqual(6);
    expect(maxInFlight).toBeGreaterThan(1);
    expect(fetch).toHaveBeenCalledTimes(WEB_API_SERVICES.length);
  });

  it('serves repeat calls from the 10-minute cache', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonOk({ ok: true })));
    const first = await probeAllWebApis(6, { force: true });
    const second = await probeAllWebApis(6);
    expect(second.cached).toBe(true);
    expect(second.at).toBe(first.at);
    expect(fetch).toHaveBeenCalledTimes(WEB_API_SERVICES.length);

    const third = await probeAllWebApis(6, { force: true });
    expect(third.cached).toBe(false);
    expect(fetch).toHaveBeenCalledTimes(WEB_API_SERVICES.length * 2);
  });
});
