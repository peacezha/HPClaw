import { describe, expect, it } from 'vitest';
import { apply } from '../../vendor/dsh-plugin/index.js';

describe('HPClaw DSH plugin output contracts', () => {
  it('boots all tools with the output contract required by the bundled harness', () => {
    const registered: any[] = [];
    const ctx = { tools: { register: (tool: any) => {
      if (!tool.output?.schema || typeof tool.output.render !== 'function') throw new Error(`Missing output contract: ${tool.name}`);
      registered.push(tool);
    } }, systemPrompt: { section: () => {} }, get: () => undefined, on: () => {} };
    apply(ctx, {});
    expect(registered.length).toBeGreaterThan(7);
    const webApi = registered.find(tool => tool.name === 'call_web_api');
    expect(webApi.output.render({}, { ok: true, text: '真实返回的数据' })).toEqual([{ type: 'text', text: '真实返回的数据' }]);
    expect(webApi.output.render({}, { ok: false, error: 'offline' })[0].text).toContain('offline');
  });
});
