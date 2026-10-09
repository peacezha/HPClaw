import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { apply } from '../../vendor/dsh-plugin/index.js';
const temporary: string[] = [];
afterEach(() => { vi.unstubAllGlobals(); for (const dir of temporary.splice(0)) fs.rmSync(dir, { recursive: true, force: true }); });

function commandTool(approval: any) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hpclaw-approval-test-')); temporary.push(dir);
  const bridgeStateFile = path.join(dir, 'bridge.json');
  fs.writeFileSync(bridgeStateFile, JSON.stringify({ token: 'mock-only', baseUrl: 'http://127.0.0.1:3999' }));
  const tools: any[] = [];
  apply({ tools: { register: (tool: any) => tools.push(tool) }, systemPrompt: { section: () => {} }, get: () => approval, on: () => {} }, { bridgeStateFile });
  return tools.find(tool => tool.name === 'run_command');
}

describe('HPClaw DSH plugin output contracts', () => {
  it('repairs the DSH never=auto-reject mismatch without bypassing the one-shot user decision', async () => {
    let policy = 'never';
    const approval = { effectivePolicy: () => policy, setPolicy: vi.fn((_agent, value) => { policy = value; }),
      request: vi.fn(async () => { expect(policy).toBe('ask'); return 'allowed-once'; }) };
    const fetch = vi.fn(async (_url, init) => {
      const body = JSON.parse(init.body);
      return new Response(JSON.stringify(body.confirmed === true ? { ok: true, output: 'mock job terminated' } : { error: 'confirmation_required', risk: 'destructive' }),
        { status: body.confirmed === true ? 200 : 428 });
    }); vi.stubGlobal('fetch', fetch);
    const tool = commandTool(approval);
    const result = await tool.execute({ command: 'bkill 123' }, { agent: { id: 'mock-session', session: { events: [] } }, callId: 'mock-call' });
    expect(result.ok).toBe(true); expect(approval.setPolicy).toHaveBeenCalledOnce(); expect(approval.request).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(JSON.parse(fetch.mock.calls[1][1].body).confirmed).toBe(true);
  });
  it('does not fabricate user rejection when the approval service is unavailable', async () => {
    const fetch = vi.fn(async () => new Response(JSON.stringify({ error: 'confirmation_required', risk: 'destructive' }), { status: 428 }));
    vi.stubGlobal('fetch', fetch);
    const tool = commandTool({ effectivePolicy: () => 'never', request: vi.fn() });
    const result = await tool.execute({ command: 'bkill 123' }, { agent: { id: 'mock-session', session: { events: [] } } });
    expect(result.error).toBe('confirmation_unavailable'); expect(result.confirmation).toBe('unavailable');
    expect(fetch).toHaveBeenCalledOnce();
  });
  it('does not execute a destructive command after an explicit user rejection', async () => {
    const fetch = vi.fn(async () => new Response(JSON.stringify({ error: 'confirmation_required', risk: 'destructive' }), { status: 428 }));
    vi.stubGlobal('fetch', fetch);
    const request = vi.fn(async () => 'rejected');
    const result = await commandTool({ effectivePolicy: () => 'ask', request }).execute({ command: 'bkill 123' }, { agent: { id: 'mock-session', session: { events: [] } } });
    expect(result.error).toBe('confirmation_denied'); expect(result.confirmation).toBe('rejected');
    expect(request).toHaveBeenCalledOnce(); expect(fetch).toHaveBeenCalledOnce();
  });
  it('does not spuriously ask for permission on an ordinary network command authorized by the server', async () => {
    const approval = { request: vi.fn() };
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ ok: true, output: 'mock download metadata' }))));
    const result = await commandTool(approval).execute({ command: 'curl -I https://example.org' }, { agent: { id: 'mock-session' } });
    expect(result.ok).toBe(true); expect(approval.request).not.toHaveBeenCalled();
  });
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
