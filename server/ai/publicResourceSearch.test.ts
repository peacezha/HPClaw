import { afterEach, describe, expect, it, vi } from 'vitest';
import { searchPublicResource } from './publicResourceSearch';

afterEach(() => vi.unstubAllGlobals());

describe('public resource search', () => {
  it('returns concise GitHub results with source links', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ items: [{ full_name: 'org/tool', description: 'analysis tool', html_url: 'https://github.com/org/tool' }] }),
    }));
    const result = await searchPublicResource({ source: 'github', query: 'bioinformatics' });
    expect(result).toContain('org/tool');
    expect(result).toContain('https://github.com/org/tool');
  });

  it('resolves NCBI ids to summaries and stable links', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ esearchresult: { idlist: ['123'] } }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ result: { 123: { title: 'Reference paper' } } }) });
    vi.stubGlobal('fetch', fetchMock);
    const result = await searchPublicResource({ source: 'ncbi', database: 'pubmed', query: 'wheat' });
    expect(result).toContain('Reference paper');
    expect(result).toContain('https://www.ncbi.nlm.nih.gov/pubmed/123/');
  });
});
