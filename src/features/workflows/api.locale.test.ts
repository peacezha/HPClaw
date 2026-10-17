// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createWorkflowRun } from './api';

afterEach(() => { vi.unstubAllGlobals(); window.localStorage.clear(); });

describe('workflow submission language', () => {
  it.each(['zh-CN', 'en-US'])('captures %s at submission without changing input data', async locale => {
    window.localStorage.setItem('trace_language', locale);
    const fetch = vi.fn(async () => ({ ok: true, json: async () => ({ run: { runId: 'fixture' } }) }));
    vi.stubGlobal('fetch', fetch);
    const config = { inputs: ['/data/样本'], params: { TARGET: '中文样本名' }, stepParams: {},
      referenceOverrides: {}, skippedSteps: [], stepCommandOverrides: {} };
    await createWorkflowRun('builtin-dapseq-tf', config, 'fixture-session');
    const body = JSON.parse(fetch.mock.calls[0][1]!.body);
    expect(body.reportLanguage).toBe(locale === 'en-US' ? 'en' : 'zh');
    expect(body.inputs).toEqual(config.inputs);
    expect(body.params).toEqual(config.params);
    expect(config).not.toHaveProperty('reportLanguage');
  });
});
