// Web 数据资源路由：目录 / 单服务详情 / 调用 / 健康检测。
// 与主服务一致仅面向本机（server 只监听 127.0.0.1），这里再显式校验
// loopback 来源，防止意外绑定到非回环地址时把公共 API 调用能力暴露出去。

import type { Express, NextFunction, Request, Response } from 'express';
import { getWebApiService, WEB_API_CATEGORY_LABELS, WEB_API_SERVICES, type WebApiCategory } from './registry';
import { invokeWebApi, summarizeWebApiService } from './invoke';
import { getCachedProbeAll, probeAllWebApis, probeWebApi, type WebApiProbeResult } from './health';

function isLoopbackRequest(req: Request): boolean {
  const address = req.socket.remoteAddress || '';
  return address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1';
}

function loopbackOnly(req: Request, res: Response, next: NextFunction): void {
  if (!isLoopbackRequest(req)) {
    res.status(403).json({ error: 'forbidden', message: '仅允许本机（loopback）访问' });
    return;
  }
  next();
}

function readString(body: Record<string, unknown>, key: string): string {
  const value = body[key];
  return typeof value === 'string' ? value : '';
}

export function registerWebApiRoutes(app: Express): void {
  // 目录：全部服务摘要 + 类别统计 + 缓存的探针结果（不触发真实探测）。
  app.get('/api/webapis', loopbackOnly, (_req, res) => {
    const categories = {} as Record<WebApiCategory, { count: number; label: { zh: string; en: string } }>;
    for (const category of Object.keys(WEB_API_CATEGORY_LABELS) as WebApiCategory[]) {
      categories[category] = { count: 0, label: WEB_API_CATEGORY_LABELS[category] };
    }
    for (const service of WEB_API_SERVICES) {
      categories[service.category].count += 1;
    }
    const cachedProbe = getCachedProbeAll();
    const probeByService = new Map<string, WebApiProbeResult>(
      (cachedProbe?.results || []).map(result => [result.serviceId, result]),
    );
    res.json({
      total: WEB_API_SERVICES.length,
      categories,
      probeCache: cachedProbe ? { at: cachedProbe.at, ttlMs: 600_000 } : null,
      services: WEB_API_SERVICES.map(service => ({
        id: service.id,
        name: service.name,
        category: service.category,
        categoryLabel: WEB_API_CATEGORY_LABELS[service.category],
        description: service.description,
        homepage: service.homepage,
        docsUrl: service.docsUrl,
        ...(service.authNote ? { authNote: service.authNote } : {}),
        endpointCount: service.endpoints.length,
        endpoints: service.endpoints.map(endpoint => ({
          id: endpoint.id,
          name: endpoint.name,
          method: endpoint.method,
          path: endpoint.path,
        })),
        probe: probeByService.get(service.id) || null,
      })),
    });
  });

  // 单服务详情：含端点参数说明与探针定义。
  app.get('/api/webapis/:id', loopbackOnly, (req, res) => {
    const service = getWebApiService(req.params.id);
    if (!service) {
      res.status(404).json({ ok: false, error: { code: 'unknown_service', message: `未注册的数据服务: ${req.params.id}` } });
      return;
    }
    const cachedProbe = getCachedProbeAll();
    res.json({
      ...summarizeWebApiService(service),
      baseUrl: service.baseUrl,
      endpoints: service.endpoints,
      probe: service.probe,
      lastProbe: cachedProbe?.results.find(result => result.serviceId === service.id) || null,
    });
  });

  // 调用：body { service, endpoint, params }。
  app.post('/api/webapis/invoke', loopbackOnly, async (req, res) => {
    const body = req.body && typeof req.body === 'object' ? req.body as Record<string, unknown> : {};
    const service = readString(body, 'service');
    const endpoint = readString(body, 'endpoint');
    if (!service.trim() || !endpoint.trim()) {
      res.status(400).json({ ok: false, error: { code: 'invalid_request', message: 'body 需要 { service, endpoint, params? }' } });
      return;
    }
    const params = body.params && typeof body.params === 'object' && !Array.isArray(body.params)
      ? body.params as Record<string, unknown>
      : {};
    const result = await invokeWebApi(service.trim(), endpoint.trim(), params);
    res.json(result);
  });

  // 健康检测：body { service?, force? }；带 service 单测，否则全量（并发 6，10 分钟缓存）。
  app.post('/api/webapis/probe', loopbackOnly, async (req, res) => {
    const body = req.body && typeof req.body === 'object' ? req.body as Record<string, unknown> : {};
    const service = readString(body, 'service').trim();
    const force = body.force === true;
    if (service) {
      const result = await probeWebApi(service);
      res.json({ ok: result.ok, results: [result] });
      return;
    }
    const all = await probeAllWebApis(6, { force });
    res.json({
      ok: all.results.every(result => result.ok),
      at: all.at,
      cached: all.cached,
      total: all.results.length,
      okCount: all.results.filter(result => result.ok).length,
      results: all.results,
    });
  });
}
