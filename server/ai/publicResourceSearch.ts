export type PublicResourceSource = 'ncbi' | 'crossref' | 'github' | 'wikipedia';

export interface PublicResourceSearchInput {
  source: PublicResourceSource;
  query: string;
  database?: 'pubmed' | 'gene' | 'nuccore' | 'assembly';
  maxResults?: number;
}

const USER_AGENT = 'HPClaw/0.2 (public resource lookup)';

async function getJson(url: URL): Promise<any> {
  const response = await fetch(url, {
    headers: { Accept: 'application/json', 'User-Agent': USER_AGENT },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`公共资源请求失败：HTTP ${response.status}`);
  return response.json();
}

function clean(value: unknown, limit = 500): string {
  return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, limit);
}

export async function searchPublicResource(input: PublicResourceSearchInput): Promise<string> {
  const query = clean(input.query, 500);
  if (!query) throw new Error('搜索关键词不能为空');
  const maxResults = Math.max(1, Math.min(10, Number(input.maxResults) || 5));

  if (input.source === 'ncbi') {
    const database = input.database || 'pubmed';
    const searchUrl = new URL('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi');
    searchUrl.search = new URLSearchParams({ db: database, term: query, retmode: 'json', retmax: String(maxResults) }).toString();
    const search = await getJson(searchUrl);
    const ids = (search?.esearchresult?.idlist || []).map(String).slice(0, maxResults);
    if (ids.length === 0) return `NCBI ${database} 未找到结果。`;
    const summaryUrl = new URL('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi');
    summaryUrl.search = new URLSearchParams({ db: database, id: ids.join(','), retmode: 'json' }).toString();
    const summary = await getJson(summaryUrl);
    const lines = ids.map((id: string) => {
      const item = summary?.result?.[id] || {};
      const title = clean(item.title || item.name || item.caption || id, 300);
      return `- ${title} — https://www.ncbi.nlm.nih.gov/${database}/${encodeURIComponent(id)}/`;
    });
    return `NCBI ${database} 搜索结果（关键词：${query}）：\n${lines.join('\n')}`;
  }

  if (input.source === 'crossref') {
    const url = new URL('https://api.crossref.org/works');
    url.search = new URLSearchParams({ query, rows: String(maxResults), select: 'DOI,title,author,published,URL' }).toString();
    const data = await getJson(url);
    const items = Array.isArray(data?.message?.items) ? data.message.items.slice(0, maxResults) : [];
    return `Crossref 文献结果（关键词：${query}）：\n${items.map((item: any) => {
      const title = clean(Array.isArray(item.title) ? item.title[0] : item.title, 300);
      const doi = clean(item.DOI, 200);
      return `- ${title || doi}${doi ? ` — https://doi.org/${doi}` : ''}`;
    }).join('\n') || '- 未找到结果'}`;
  }

  if (input.source === 'github') {
    const url = new URL('https://api.github.com/search/repositories');
    url.search = new URLSearchParams({ q: query, per_page: String(maxResults), sort: 'stars' }).toString();
    const data = await getJson(url);
    const items = Array.isArray(data?.items) ? data.items.slice(0, maxResults) : [];
    return `GitHub 仓库结果（关键词：${query}）：\n${items.map((item: any) =>
      `- ${clean(item.full_name, 200)}：${clean(item.description, 300)} — ${clean(item.html_url, 500)}`,
    ).join('\n') || '- 未找到结果'}`;
  }

  const url = new URL('https://en.wikipedia.org/w/api.php');
  url.search = new URLSearchParams({ action: 'opensearch', search: query, limit: String(maxResults), namespace: '0', format: 'json', origin: '*' }).toString();
  const data = await getJson(url);
  const titles = Array.isArray(data?.[1]) ? data[1] : [];
  const descriptions = Array.isArray(data?.[2]) ? data[2] : [];
  const links = Array.isArray(data?.[3]) ? data[3] : [];
  return `Wikipedia 结果（关键词：${query}）：\n${titles.map((title: string, index: number) =>
    `- ${clean(title, 200)}：${clean(descriptions[index], 300)} — ${clean(links[index], 500)}`,
  ).join('\n') || '- 未找到结果'}`;
}
