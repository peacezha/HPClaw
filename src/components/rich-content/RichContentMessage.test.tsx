// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor, within } from '@testing-library/react';
// 经由 index 引入：完成渲染器注册（image/table/code/...）
import { RichContentMessage } from './index';

const SESSION = 'cluster-session-1';

function mockReadResponse(path: string, content: string, mime: string, size = content.length) {
  return {
    ok: true,
    json: async () => ({ filePath: path, content, metadata: { size, mime } }),
  } as Response;
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('RichContentMessage', () => {
  it('shows a table card for a CSV path in the AI reply', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockReadResponse('/home/u/out/result.csv', 'gene,count\nTP53,42', 'text/csv'),
    );

    render(<RichContentMessage sessionId={SESSION}>{'结果已写入 /home/u/out/result.csv 请查收'}</RichContentMessage>);

    await waitFor(() => expect(screen.getByText('result.csv')).toBeTruthy());
    // TableCard 渲染首行表头与数据行
    expect(screen.getByText('gene')).toBeTruthy();
    expect(screen.getByText('TP53')).toBeTruthy();
    // 读取请求带上了集群会话路由头
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect((init as RequestInit).headers).toMatchObject({ 'X-SSH-Session-Id': SESSION });
  });

  it('shows an image card whose <img> points at /api/files/view with the session query', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockReadResponse('/home/u/out/plot.png', 'aGk=', 'image/png', 128),
    );

    render(<RichContentMessage sessionId={SESSION}>{'图片在 /home/u/out/plot.png 里'}</RichContentMessage>);

    await waitFor(() => expect(screen.getByText('plot.png')).toBeTruthy());
    const img = document.querySelector('img');
    expect(img).not.toBeNull();
    expect(img!.getAttribute('src')).toBe(
      `/api/files/view?path=${encodeURIComponent('/home/u/out/plot.png')}&sessionId=${encodeURIComponent(SESSION)}`,
    );
  });

  it('fetches through the local file routes in local workbench mode', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockReadResponse('.dsh-vision-toolkit/out/result.csv', 'gene,count\nTP53,42', 'text/csv'),
    );

    render(
      <RichContentMessage sessionId="local-workbench" workspace={'C:\\work'}>
        {'结果在 .dsh-vision-toolkit/out/result.csv'}
      </RichContentMessage>,
    );

    await waitFor(() => expect(screen.getByText('result.csv')).toBeTruthy());
    expect(screen.getByText('TP53')).toBeTruthy();
    const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe('/api/local/files/read');
    // 本地请求不需要集群会话路由头，path 与 workspace 放在 body 里
    expect((init as RequestInit).headers).not.toMatchObject({ 'X-SSH-Session-Id': expect.anything() });
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({
      path: '.dsh-vision-toolkit/out/result.csv',
      workspace: 'C:\\work',
    });
  });

  it('fetches through the local file routes without a session', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockReadResponse('/out/result.csv', 'a,b\n1,2', 'text/csv'),
    );

    render(<RichContentMessage>{'结果在 /out/result.csv'}</RichContentMessage>);

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe('/api/local/files/read');
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({ path: '/out/result.csv' });
  });

  it('points local image cards at /api/local/files/view with the workspace query', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockReadResponse('.dsh-vision-toolkit/artifacts/plot.png', 'aGk=', 'image/png', 128),
    );

    render(
      <RichContentMessage sessionId="local-workbench" workspace={'C:\\work'}>
        {'图片在 .dsh-vision-toolkit/artifacts/plot.png 里'}
      </RichContentMessage>,
    );

    await waitFor(() => expect(screen.getByText('plot.png')).toBeTruthy());
    const img = document.querySelector('img');
    expect(img).not.toBeNull();
    expect(img!.getAttribute('src')).toBe(
      `/api/local/files/view?path=${encodeURIComponent('.dsh-vision-toolkit/artifacts/plot.png')}&workspace=${encodeURIComponent('C:\\work')}`,
    );
  });

  it('silently skips local files the server rejects', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ error: { code: 'LOCAL_FILE_NOT_FOUND', message: 'local file not found' } }),
    } as Response);

    const { container } = render(
      <RichContentMessage sessionId="local-workbench">{'结果在 .dsh-vision-toolkit/out/result.csv'}</RichContentMessage>,
    );

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    await waitFor(() => expect(container.querySelector('.rich-card')).toBeNull());
  });

  it('renders an interactive card for remote .html paths instead of a bare side-preview button', async () => {
    // 升级回归：.html 路径出 HtmlArtifactCard（默认收起、不拉取），卡片内保留侧边入口
    const onOpenWebPanel = vi.fn();

    render(
      <RichContentMessage sessionId={SESSION} onOpenWebPanel={onOpenWebPanel}>
        {'分析报告 /home/u/run/report.html 已生成'}
      </RichContentMessage>,
    );

    const card = await screen.findByTestId('html-artifact-card');
    expect(within(card).getByText('report.html')).toBeTruthy();
    // 默认收起：不自动拉文件，也没有 iframe
    expect(fetch).not.toHaveBeenCalled();
    expect(within(card).queryByTestId('html-artifact-iframe')).toBeNull();

    fireEvent.click(within(card).getByRole('button', { name: '在侧边预览' }));
    expect(onOpenWebPanel).toHaveBeenCalledWith({
      remotePath: '/home/u/run/report.html',
      sessionId: SESSION,
      title: 'report.html',
    });
  });

  it('renders an interactive card for local .html paths and fetches on expand', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockReadResponse('C:\\work\\report.html', '<html><body>r</body></html>', 'text/html'),
    );
    const onOpenWebPanel = vi.fn();

    render(
      <RichContentMessage sessionId="local-workbench" workspace={'C:\\work'} onOpenWebPanel={onOpenWebPanel}>
        {'报告在 C:\\work\\report.html'}
      </RichContentMessage>,
    );

    const card = await screen.findByTestId('html-artifact-card');
    // 本地路径不给侧边入口（侧边网页栏只支持集群读取）
    expect(within(card).queryByRole('button', { name: '在侧边预览' })).toBeNull();

    fireEvent.click(within(card).getByRole('button', { name: '展开网页预览' }));
    await waitFor(() => expect(within(card).getByTestId('html-artifact-iframe')).toBeTruthy());
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe('/api/local/files/read');
  });

  it('silently skips files the server rejects', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ error: { code: 'REMOTE_FILE_NOT_FOUND', message: 'no such file' } }),
    } as Response);

    const { container } = render(
      <RichContentMessage sessionId={SESSION}>{'结果在 /home/u/out/result.csv'}</RichContentMessage>,
    );

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    await waitFor(() => expect(container.querySelector('.rich-card')).toBeNull());
  });

  it('reads Windows absolute paths through the local route even with a cluster session', async () => {
    // 回归：会话绑集群时，dsh 本地产出的 Windows 路径不能发到集群 SFTP
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockReadResponse('C:\\runtime\\plot.png', 'aGk=', 'image/png', 128),
    );

    render(<RichContentMessage sessionId={SESSION}>{'图在 C:\\runtime\\plot.png 里'}</RichContentMessage>);

    await waitFor(() => expect(screen.getByText('plot.png')).toBeTruthy());
    const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe('/api/local/files/read');
    expect((init as RequestInit).headers).not.toMatchObject({ 'X-SSH-Session-Id': SESSION });
    const img = document.querySelector('img');
    expect(img!.getAttribute('src')).toBe(`/api/local/files/view?path=${encodeURIComponent('C:\\runtime\\plot.png')}`);
  });

  it('retries the local route when the cluster read fails', async () => {
    // 集群端读不到（404）→ 自动换本地端点重试并出卡
    (fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: { code: 'REMOTE_FILE_NOT_FOUND', message: 'no such file' } }),
      } as Response)
      .mockResolvedValueOnce(
        mockReadResponse('/home/u/out/plot.png', 'aGk=', 'image/png', 128),
      );

    render(<RichContentMessage sessionId={SESSION}>{'图片在 /home/u/out/plot.png 里'}</RichContentMessage>);

    await waitFor(() => expect(screen.getByText('plot.png')).toBeTruthy());
    const urls = (fetch as ReturnType<typeof vi.fn>).mock.calls.map(c => c[0]);
    expect(urls).toEqual(['/api/files/read', '/api/local/files/read']);
  });

  it('opens a lightbox from the image card expand button or image click, and closes on Escape', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockReadResponse('/home/u/out/plot.png', 'aGk=', 'image/png', 128),
    );

    render(<RichContentMessage sessionId={SESSION}>{'图片在 /home/u/out/plot.png 里'}</RichContentMessage>);

    await waitFor(() => expect(screen.getByText('plot.png')).toBeTruthy());
    expect(screen.queryByTestId('image-lightbox')).toBeNull();

    // 卡片头部放大按钮 → 全屏 lightbox，src 与卡片 img 同源
    fireEvent.click(screen.getByRole('button', { name: '放大图片' }));
    const lightbox = screen.getByTestId('image-lightbox');
    expect(lightbox.querySelector('img')!.getAttribute('src')).toBe(
      `/api/files/view?path=${encodeURIComponent('/home/u/out/plot.png')}&sessionId=${encodeURIComponent(SESSION)}`,
    );
    expect(within(lightbox).getByText('plot.png')).toBeTruthy();

    // Esc 关闭；再点卡片图片本身也能打开
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByTestId('image-lightbox')).toBeNull();

    fireEvent.click(document.querySelector('.rich-card img')!);
    expect(screen.getByTestId('image-lightbox')).toBeTruthy();
  });
});
