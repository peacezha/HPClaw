// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, within, waitFor } from '@testing-library/react';
import WebApisPanel from './WebApisPanel';

function makeCatalog() {
  return {
    total: 2,
    categories: {
      'genes-genomes': { count: 1, label: { zh: '基因与基因组', en: 'Genes & Genomes' } },
      proteins: { count: 1, label: { zh: '蛋白与结构', en: 'Proteins & Structures' } },
    },
    probeCache: { at: Date.now(), ttlMs: 600_000 },
    services: [
      {
        id: 'ncbi-eutils',
        name: 'NCBI E-utilities',
        category: 'genes-genomes',
        categoryLabel: { zh: '基因与基因组', en: 'Genes & Genomes' },
        description: 'NCBI 全系数据库检索与获取接口',
        homepage: 'https://www.ncbi.nlm.nih.gov/',
        docsUrl: 'https://www.ncbi.nlm.nih.gov/books/NBK25501/',
        endpointCount: 1,
        endpoints: [{ id: 'esearch', name: 'ESearch 检索', method: 'GET', path: '/esearch.fcgi' }],
        probe: { ok: true, status: 200, durationMs: 120 },
      },
      {
        id: 'uniprot',
        name: 'UniProt REST',
        category: 'proteins',
        categoryLabel: { zh: '蛋白与结构', en: 'Proteins & Structures' },
        description: '蛋白序列与注释检索',
        homepage: 'https://www.uniprot.org/',
        docsUrl: 'https://www.uniprot.org/help/api',
        authNote: '高频调用建议带邮箱标识',
        endpointCount: 1,
        endpoints: [{ id: 'search', name: '条目检索', method: 'GET', path: '/uniprotkb/search' }],
        probe: { ok: false, status: 500, error: 'http_server_error: 上游返回 5xx' },
      },
    ],
  };
}

const NCBI_DETAIL = {
  id: 'ncbi-eutils',
  baseUrl: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils',
  endpoints: [
    {
      id: 'esearch',
      name: 'ESearch 检索',
      method: 'GET',
      path: '/esearch.fcgi',
      description: '按关键词检索某个 NCBI 数据库，返回 UID 列表',
      params: [
        { name: 'db', required: true, description: '数据库名' },
        { name: 'term', required: true, description: '检索式' },
      ],
    },
  ],
  probe: { endpoint: 'esearch', params: { db: 'pubmed', term: 'cancer', retmode: 'json' } },
};

function mockFetch() {
  const impl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const respond = (body: unknown, status = 200) =>
      ({ ok: status < 400, status, json: async () => body }) as Response;
    if (url === '/api/webapis') return respond(makeCatalog());
    if (url === '/api/webapis/ncbi-eutils') return respond(NCBI_DETAIL);
    if (url === '/api/webapis/uniprot') {
      return respond({
        id: 'uniprot',
        baseUrl: 'https://rest.uniprot.org',
        endpoints: [
          { id: 'search', name: '条目检索', method: 'GET', path: '/uniprotkb/search', description: '按关键词检索蛋白条目', params: [{ name: 'query', required: true, description: '检索式' }] },
        ],
        probe: { endpoint: 'search', params: { query: 'insulin', size: '1' } },
      });
    }
    if (url === '/api/webapis/invoke') {
      return respond({
        ok: true,
        service: 'ncbi-eutils',
        endpoint: 'esearch',
        url: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed',
        status: 200,
        durationMs: 87,
        contentType: 'application/json',
        data: { esearchresult: { count: '1' } },
        truncated: false,
      });
    }
    if (url === '/api/webapis/probe' && init?.method === 'POST') {
      return respond({
        ok: true,
        at: Date.now(),
        cached: false,
        total: 2,
        okCount: 2,
        results: [
          { serviceId: 'ncbi-eutils', ok: true, status: 200, durationMs: 100 },
          { serviceId: 'uniprot', ok: true, status: 200, durationMs: 90 },
        ],
      });
    }
    return respond({}, 404);
  });
  vi.stubGlobal('fetch', impl);
  return impl;
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('WebApisPanel 目录渲染', () => {
  it('加载 /api/webapis 后渲染服务卡片、类别 chips（带计数）与缓存探针状态灯', async () => {
    mockFetch();
    render(<WebApisPanel />);

    // 服务卡片与类别标签
    expect(await screen.findByTestId('webapi-card-ncbi-eutils')).toBeInTheDocument();
    expect(screen.getByTestId('webapi-card-uniprot')).toBeInTheDocument();
    expect(screen.getByText('NCBI E-utilities')).toBeInTheDocument();

    // 类别 chips：全部 + 各类别计数
    expect(screen.getByRole('button', { name: '全部（2）' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '基因与基因组（1）' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '蛋白与结构（1）' })).toBeInTheDocument();

    // 目录携带的缓存探针结果 → 状态灯：ncbi 绿 / uniprot 红（带耗时）
    expect(screen.getByTestId('webapi-status-ncbi-eutils')).toHaveAttribute('data-state', 'ok');
    expect(screen.getByTestId('webapi-status-uniprot')).toHaveAttribute('data-state', 'fail');
    expect(within(screen.getByTestId('webapi-card-ncbi-eutils')).getByText('120ms')).toBeInTheDocument();
    // authNote 小字提示
    expect(screen.getByText('高频调用建议带邮箱标识')).toBeInTheDocument();
  });

  it('搜索框按名称/描述过滤卡片', async () => {
    mockFetch();
    render(<WebApisPanel />);
    await screen.findByTestId('webapi-card-ncbi-eutils');

    fireEvent.change(screen.getByPlaceholderText('搜索数据资源...'), { target: { value: 'uniprot' } });
    expect(screen.queryByTestId('webapi-card-ncbi-eutils')).not.toBeInTheDocument();
    expect(screen.getByTestId('webapi-card-uniprot')).toBeInTheDocument();
  });

  it('类别 chip 筛选只显示该类服务', async () => {
    mockFetch();
    render(<WebApisPanel />);
    await screen.findByTestId('webapi-card-ncbi-eutils');

    fireEvent.click(screen.getByRole('button', { name: '蛋白与结构（1）' }));
    expect(screen.queryByTestId('webapi-card-ncbi-eutils')).not.toBeInTheDocument();
    expect(screen.getByTestId('webapi-card-uniprot')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '全部（2）' }));
    expect(screen.getByTestId('webapi-card-ncbi-eutils')).toBeInTheDocument();
  });
});

describe('WebApisPanel 端点折叠与试一下', () => {
  it('端点列表默认折叠，展开时拉取详情并显示 method/path/描述/参数', async () => {
    const impl = mockFetch();
    render(<WebApisPanel />);
    const card = await screen.findByTestId('webapi-card-ncbi-eutils');

    const toggle = within(card).getByRole('button', { name: /端点（1）/ });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(within(card).queryByText('/esearch.fcgi')).not.toBeInTheDocument();

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    // 展开触发详情请求，参数说明来自 /api/webapis/:id
    expect(await within(card).findByText('/esearch.fcgi')).toBeInTheDocument();
    expect(impl.mock.calls.some(call => String(call[0]) === '/api/webapis/ncbi-eutils')).toBe(true);
    expect(within(card).getByText(/按关键词检索某个 NCBI 数据库/)).toBeInTheDocument();
    expect(within(card).getByText(/db（必填）/)).toBeInTheDocument();

    // 再次点击收起
    fireEvent.click(toggle);
    expect(within(card).queryByText('/esearch.fcgi')).not.toBeInTheDocument();
  });

  it('「试一下」用探针默认参数调 invoke，结果（状态码/耗时/JSON）显示在卡片内', async () => {
    const impl = mockFetch();
    render(<WebApisPanel />);
    const card = await screen.findByTestId('webapi-card-ncbi-eutils');

    fireEvent.click(within(card).getByRole('button', { name: /端点（1）/ }));
    const tryButton = await within(card).findByRole('button', { name: '试一下' });
    fireEvent.click(tryButton);

    // invoke 调用带探针默认参数
    await waitFor(() => {
      const invokeCall = impl.mock.calls.find(call => String(call[0]) === '/api/webapis/invoke');
      expect(invokeCall).toBeTruthy();
      const body = JSON.parse(String(invokeCall![1]?.body));
      expect(body).toEqual({ service: 'ncbi-eutils', endpoint: 'esearch', params: { db: 'pubmed', term: 'cancer', retmode: 'json' } });
    });

    // 结果区：状态码 / 耗时 / JSON 美化
    const result = await within(card).findByTestId('webapi-try-result-ncbi-eutils-esearch');
    expect(result.textContent).toContain('200');
    expect(result.textContent).toContain('87ms');
    expect(result.textContent).toContain('esearchresult');
  });
});

describe('WebApisPanel 全部测试', () => {
  it('触发全量探针（force），显示 okCount/total 并更新状态灯', async () => {
    const impl = mockFetch();
    render(<WebApisPanel />);
    await screen.findByTestId('webapi-card-ncbi-eutils');
    // uniprot 初始为失败（红）
    expect(screen.getByTestId('webapi-status-uniprot')).toHaveAttribute('data-state', 'fail');

    fireEvent.click(screen.getByRole('button', { name: '全部测试' }));

    // 完成后显示进度汇总
    const status = await screen.findByTestId('webapis-probe-all-status');
    await waitFor(() => expect(status.textContent).toContain('测试完成'));
    expect(status.textContent).toContain('2/2');

    // probe 请求为全量 + force
    const probeCall = impl.mock.calls.find(call => String(call[0]) === '/api/webapis/probe');
    expect(probeCall).toBeTruthy();
    expect(JSON.parse(String(probeCall![1]?.body))).toEqual({ force: true });

    // 最新结果合并进状态灯：uniprot 由红转绿
    expect(screen.getByTestId('webapi-status-uniprot')).toHaveAttribute('data-state', 'ok');
    expect(screen.getByTestId('webapi-status-ncbi-eutils')).toHaveAttribute('data-state', 'ok');
  });
});
