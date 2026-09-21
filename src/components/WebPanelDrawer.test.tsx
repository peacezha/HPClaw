// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import WebPanelDrawer, { type WebPanelRequest } from './WebPanelDrawer';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function renderDrawer(panels: WebPanelRequest[], activeIndex = 0) {
  const props = {
    onSelectTab: vi.fn(),
    onCloseTab: vi.fn(),
    onClose: vi.fn(),
  };
  const utils = render(
    <WebPanelDrawer panels={panels} activeIndex={activeIndex} {...props} />,
  );
  return { ...utils, props };
}

describe('WebPanelDrawer', () => {
  it('renders nothing when there are no tabs', () => {
    const { container } = renderDrawer([]);
    expect(container.firstChild).toBeNull();
  });

  it('embeds an http(s) URL in a webview with an external-open link', () => {
    renderDrawer([{ url: 'https://example.com/doc', title: '示例文档' }]);

    const webview = document.querySelector('webview');
    expect(webview).not.toBeNull();
    expect(webview!.getAttribute('src')).toBe('https://example.com/doc');
    expect(webview!.getAttribute('partition')).toBe('hpclaw-webpanel');

    const external = screen.getByRole('link', { name: '在浏览器中打开' });
    expect(external).toHaveAttribute('href', 'https://example.com/doc');
    expect(external).toHaveAttribute('target', '_blank');
  });

  it('closes the whole panel via the header button', () => {
    const { props } = renderDrawer([{ url: 'https://example.com' }]);
    fireEvent.click(screen.getByRole('button', { name: '关闭' }));
    expect(props.onClose).toHaveBeenCalled();
  });

  it('fetches a remote HTML path and renders it in a sandboxed iframe', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ filePath: '/home/u/run/report.html', content: '<html><head></head><body><h1>报告</h1><script>alert(1)</script></body></html>', metadata: { size: 60, mime: 'text/html' } }),
    } as Response);

    renderDrawer([{ remotePath: '/home/u/run/report.html', sessionId: 'sess-1', title: 'report.html' }]);

    await waitFor(() => expect(document.querySelector('iframe')).not.toBeNull());
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect((init as RequestInit).headers).toMatchObject({ 'X-SSH-Session-Id': 'sess-1' });

    const iframe = document.querySelector('iframe')!;
    const srcDoc = iframe.getAttribute('srcdoc') || '';
    expect(srcDoc).toContain('<h1>报告</h1>');
    // buildSafeHtmlPreviewDocument 注入了 CSP；用户自己的结果网页默认允许脚本（交互图表需要 JS）
    expect(srcDoc).toContain('Content-Security-Policy');
    expect(iframe.getAttribute('sandbox')).toBe('allow-scripts');
  });

  it('lets the user disable scripts for the remote HTML preview', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ filePath: '/home/u/run/report.html', content: '<html><body><h1>报告</h1></body></html>', metadata: { size: 40, mime: 'text/html' } }),
    } as Response);

    renderDrawer([{ remotePath: '/home/u/run/report.html', sessionId: 'sess-1' }]);

    await waitFor(() => expect(document.querySelector('iframe')).not.toBeNull());
    expect(document.querySelector('iframe')!.getAttribute('sandbox')).toBe('allow-scripts');

    fireEvent.click(screen.getByRole('button', { name: '关闭网页脚本' }));
    expect(document.querySelector('iframe')!.getAttribute('sandbox')).toBe('');
  });

  it('shows an error state with retry for failed remote fetches', async () => {
    (fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({ ok: false, status: 404, json: async () => ({ error: { code: 'REMOTE_FILE_NOT_FOUND', message: 'no such file' } }) } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ filePath: '/home/u/run/report.html', content: '<p>ok</p>', metadata: { size: 7, mime: 'text/html' } }),
      } as Response);

    renderDrawer([{ remotePath: '/home/u/run/report.html', sessionId: 'sess-1' }]);

    await screen.findByText('网页加载失败');
    fireEvent.click(screen.getByRole('button', { name: /重试/ }));

    await waitFor(() => expect(document.querySelector('iframe')).not.toBeNull());
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('renders one entry per tab in the tab strip', () => {
    renderDrawer([
      { url: 'https://example.com/a', title: '页面 A' },
      { url: 'https://example.com/b', title: '页面 B' },
    ], 0);
    const strip = screen.getByTestId('web-panel-tabs');
    expect(strip.textContent).toContain('页面 A');
    expect(strip.textContent).toContain('页面 B');
  });

  it('switches tabs via onSelectTab', () => {
    const { props } = renderDrawer([
      { url: 'https://example.com/a', title: '页面 A' },
      { url: 'https://example.com/b', title: '页面 B' },
    ], 0);
    fireEvent.click(screen.getByRole('button', { name: '页面 B' }));
    expect(props.onSelectTab).toHaveBeenCalledWith(1);
  });

  it('closes a single tab via its × button without closing the panel', () => {
    const { props } = renderDrawer([
      { url: 'https://example.com/a', title: '页面 A' },
      { url: 'https://example.com/b', title: '页面 B' },
    ], 0);
    fireEvent.click(screen.getByRole('button', { name: '关闭标签：页面 B' }));
    expect(props.onCloseTab).toHaveBeenCalledWith(1);
    expect(props.onClose).not.toHaveBeenCalled();
  });

  it('keeps inactive tab content mounted but hidden', () => {
    const { container } = renderDrawer([
      { url: 'https://example.com/a', title: '页面 A' },
      { url: 'https://example.com/b', title: '页面 B' },
    ], 1);
    const webviews = container.querySelectorAll('webview');
    expect(webviews).toHaveLength(2);
    // 只显示激活标签的内容，另一个保持隐藏（切换回来不重载）
    const visibleWrapper = webviews[1].closest('div.hidden');
    expect(visibleWrapper).toBeNull();
    expect(webviews[0].closest('div.hidden')).not.toBeNull();
  });

  it('shows the active tab title in the header', () => {
    renderDrawer([
      { url: 'https://example.com/a', title: '页面 A' },
      { url: 'https://example.com/b', title: '页面 B' },
    ], 1);
    const external = screen.getByRole('link', { name: '在浏览器中打开' });
    expect(external).toHaveAttribute('href', 'https://example.com/b');
  });
});
