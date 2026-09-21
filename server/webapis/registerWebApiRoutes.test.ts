import express, { type Express } from 'express';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { registerWebApiRoutes } from './registerWebApiRoutes';
import { clearProbeAllCache } from './health';
import { WEB_API_CATEGORY_LABELS, WEB_API_SERVICES } from './registry';

const servers: Server[] = [];

async function startApp(): Promise<string> {
  const app: Express = express();
  app.use(express.json());
  registerWebApiRoutes(app);
  const server = await new Promise<Server>(resolve => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });
  servers.push(server);
  const { port } = server.address() as AddressInfo;
  return `http://127.0.0.1:${port}`;
}

afterEach(async () => {
  while (servers.length > 0) {
    const server = servers.pop()!;
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});

describe('webapis routes', () => {
  // 路由处理器与测试客户端都走全局 fetch：按 URL 分流，本地请求走真实 fetch，
  // 上游公共 API 请求由 upstreamMock 接管。
  let upstreamMock: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    clearProbeAllCache();
    upstreamMock = vi.fn(async () => new Response('{}', {
      status: 200,
      headers: { 'content-type': 'application/json' },
    }));
    const realFetch = globalThis.fetch;
    vi.stubGlobal('fetch', vi.fn(async (input: any, init?: any) => {
      const url = String(input?.url || input);
      if (url.startsWith('http://127.0.0.1') || url.startsWith('http://[::1]')) {
        return realFetch(input, init);
      }
      return upstreamMock(input, init);
    }));
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    clearProbeAllCache();
  });

  it('GET /api/webapis returns the catalog with per-category stats', async () => {
    const base = await startApp();
    const res = await fetch(`${base}/api/webapis`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.total).toBe(WEB_API_SERVICES.length);
    expect(Object.keys(body.categories).sort()).toEqual(Object.keys(WEB_API_CATEGORY_LABELS).sort());
    const categorySum = Object.values(body.categories as Record<string, { count: number }>)
      .reduce((sum, entry) => sum + entry.count, 0);
    expect(categorySum).toBe(body.total);
    expect(body.services.length).toBe(body.total);
    expect(body.services[0]).toMatchObject({ id: expect.any(String), endpoints: expect.any(Array) });
    expect(body.probeCache).toBeNull();
  });

  it('GET /api/webapis/:id returns service detail or 404', async () => {
    const base = await startApp();
    const res = await fetch(`${base}/api/webapis/uniprot`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ id: 'uniprot', baseUrl: 'https://rest.uniprot.org' });
    expect(body.endpoints.length).toBeGreaterThanOrEqual(2);
    expect(body.probe.endpoint).toBe('search');

    const missing = await fetch(`${base}/api/webapis/nope`);
    expect(missing.status).toBe(404);
    expect(await missing.json()).toMatchObject({ ok: false, error: { code: 'unknown_service' } });
  });

  it('POST /api/webapis/invoke validates the body and proxies the invoke result', async () => {
    const base = await startApp();
    const bad = await fetch(`${base}/api/webapis/invoke`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(bad.status).toBe(400);

    upstreamMock.mockResolvedValue(new Response(JSON.stringify({ accession: 'P69905' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    }));
    const res = await fetch(`${base}/api/webapis/invoke`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ service: 'uniprot', endpoint: 'entry', params: { accession: 'P69905' } }),
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({
      ok: true,
      service: 'uniprot',
      endpoint: 'entry',
      data: { accession: 'P69905' },
    });
  });

  it('POST /api/webapis/probe probes one service or all with cache metadata', async () => {
    const base = await startApp();
    upstreamMock.mockResolvedValue(new Response(JSON.stringify({ esearchresult: {} }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    }));
    const single = await fetch(`${base}/api/webapis/probe`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ service: 'ncbi-eutils' }),
    });
    expect(single.status).toBe(200);
    expect(await single.json()).toMatchObject({ ok: true, results: [{ serviceId: 'ncbi-eutils', ok: true }] });

    const all = await fetch(`${base}/api/webapis/probe`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(all.status).toBe(200);
    const allBody = await all.json();
    expect(allBody.total).toBe(WEB_API_SERVICES.length);
    expect(allBody.results.length).toBe(WEB_API_SERVICES.length);
  });
});
