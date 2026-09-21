import { describe, expect, it } from 'vitest';
import {
  getWebApiService,
  WEB_API_CATEGORY_LABELS,
  WEB_API_SERVICES,
  type WebApiCategory,
} from './registry';

const VALID_CATEGORIES = new Set(Object.keys(WEB_API_CATEGORY_LABELS));

describe('webapis registry', () => {
  it('contains at least 55 services with unique ids', () => {
    expect(WEB_API_SERVICES.length).toBeGreaterThanOrEqual(55);
    const ids = WEB_API_SERVICES.map(service => service.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('uses only declared categories and every category is covered', () => {
    const used = new Set<WebApiCategory>();
    for (const service of WEB_API_SERVICES) {
      expect(VALID_CATEGORIES.has(service.category)).toBe(true);
      used.add(service.category);
    }
    for (const category of VALID_CATEGORIES) {
      expect(used.has(category as WebApiCategory)).toBe(true);
    }
  });

  it('every service has https baseUrl/homepage/docsUrl and at least 2 endpoints', () => {
    for (const service of WEB_API_SERVICES) {
      expect(service.baseUrl, service.id).toMatch(/^https:\/\//);
      expect(service.homepage, service.id).toMatch(/^https?:\/\//);
      expect(service.docsUrl, service.id).toMatch(/^https?:\/\//);
      expect(service.endpoints.length, service.id).toBeGreaterThanOrEqual(2);
      expect(service.description.trim().length, service.id).toBeGreaterThan(0);
    }
  });

  it('endpoint ids are unique within a service and methods are GET/POST', () => {
    for (const service of WEB_API_SERVICES) {
      const ids = service.endpoints.map(endpoint => endpoint.id);
      expect(new Set(ids).size, service.id).toBe(ids.length);
      for (const endpoint of service.endpoints) {
        expect(['GET', 'POST'], `${service.id}/${endpoint.id}`).toContain(endpoint.method);
        expect(endpoint.path, `${service.id}/${endpoint.id}`).toMatch(/^\//);
        for (const param of endpoint.params || []) {
          if (param.in) expect(['path', 'query', 'body']).toContain(param.in);
        }
      }
    }
  });

  it('path template placeholders are declared as params (and vice versa)', () => {
    for (const service of WEB_API_SERVICES) {
      for (const endpoint of service.endpoints) {
        const placeholders = [...endpoint.path.matchAll(/\{([^}]+)\}/g)].map(match => match[1]);
        const declared = new Set((endpoint.params || []).map(param => param.name));
        for (const name of placeholders) {
          const param = (endpoint.params || []).find(item => item.name === name);
          expect(param, `${service.id}/${endpoint.id} 模板参数 ${name} 未声明`).toBeTruthy();
          if (param?.in) {
            expect(param.in, `${service.id}/${endpoint.id} 模板参数 ${name} 应为 path`).toBe('path');
          }
        }
        for (const param of endpoint.params || []) {
          if (param.in === 'path') {
            expect(placeholders, `${service.id}/${endpoint.id} path 参数 ${param.name} 不在模板中`).toContain(param.name);
          }
          expect(declared.has(param.name)).toBe(true);
        }
      }
    }
  });

  it('every probe points at a real endpoint of its service', () => {
    for (const service of WEB_API_SERVICES) {
      const endpoint = service.endpoints.find(item => item.id === service.probe.endpoint);
      expect(endpoint, `${service.id} 探针端点 ${service.probe.endpoint} 不存在`).toBeTruthy();
      // 探针必须把该端点的必填参数都带上（除了模板自带的 path 占位由 params 提供）。
      for (const param of endpoint!.params || []) {
        if (param.required) {
          expect(
            service.probe.params?.[param.name],
            `${service.id} 探针缺必填参数 ${param.name}`,
          ).toBeTruthy();
        }
      }
    }
  });

  it('getWebApiService resolves registered services only', () => {
    expect(getWebApiService('uniprot')?.name).toBe('UniProtKB REST');
    expect(getWebApiService('does-not-exist')).toBeUndefined();
  });
});
