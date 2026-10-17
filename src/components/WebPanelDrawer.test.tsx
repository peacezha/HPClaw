// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import WebPanelDrawer, { type WebPanelRequest } from './WebPanelDrawer';

beforeEach(() => {
  window.localStorage.clear();
  // This suite retains desktop coverage; browser mode is tested explicitly below.
  vi.stubGlobal('traceDesktop', {});
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
  it('uses a sandboxed iframe with an external fallback in an ordinary browser', () => {
    vi.stubGlobal('traceDesktop', undefined);
    renderDrawer([{ url: 'https://example.com/report' }]);
    expect(document.querySelector('webview')).toBeNull();
    const iframe = screen.getByTestId('webpanel-browser-iframe');
    expect(iframe).toHaveAttribute('src', 'https://example.com/report');
    expect(iframe.getAttribute('sandbox')).not.toContain('allow-same-origin');
    expect(screen.getByRole('link', { name: '新标签页打开' })).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('uses the classic 600px opaque panel even if the redesigned width was saved', () => {
    window.localStorage.setItem('trace_web_panel_width', '760');
    renderDrawer([{ url: 'https://example.com' }]);
    const drawer = screen.getByTestId('web-panel-drawer');
    expect(drawer.style.width).toBe('600px');
    expect(drawer.style.maxWidth).toBe('92vw');
    expect(drawer).toHaveClass('bg-scholar-900');
    expect(drawer).not.toHaveClass('backdrop-blur-xl');
    fireEvent.click(screen.getByRole('button', { name: '全屏预览' }));
    expect(drawer.style.width).toBe('100vw');
    expect(drawer.style.maxWidth).toBe('100vw');
    fireEvent.click(screen.getByRole('button', { name: '退出全屏预览' }));
    expect(drawer.style.width).toBe('600px');
  });

  it('renders nothing when there are no tabs', () => {
    const { container } = renderDrawer([]);
    expect(container.firstChild).toBeNull();
  });

  it('embeds an http(s) URL in a webview with an external-open link', () => {
    renderDrawer([{ url: 'https://example.com/doc', title: '示例文档' }]);

    const webview = document.querySelector('webview');
    expect(webview).not.toBeNull();
    expect(webview!.getAttribute('src')).toBe('https://example.com/doc');
    expect(webview!.getAttribute('partition')).toBe('trace-webpanel');

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
    const url = new URL(iframe.getAttribute('src')!, 'http://localhost');
    expect(url.pathname).toBe('/api/files/html/document');
    expect(url.searchParams.get('path')).toBe('/home/u/run/report.html');
    expect(url.searchParams.get('sessionId')).toBe('sess-1');
    expect(iframe.hasAttribute('srcdoc')).toBe(false);
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
      .mockResolvedValueOnce({ ok: false, status: 403, json: async () => ({ error: { code: 'REMOTE_FILE_FORBIDDEN', message: 'permission denied' } }) } as Response)
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

describe('WebPanelDrawer 拖拽调宽的文本选中恢复', () => {
  afterEach(() => {
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  });

  function dragHandle() {
    renderDrawer([{ url: 'https://example.com' }]);
    return screen.getByRole('button', { name: '调整网页面板宽度' });
  }

  it('pointerdown 请求指针捕获并置 body userSelect，pointerup 后写回拖拽前的原值', () => {
    document.body.style.userSelect = 'text';
    const handle = dragHandle();
    const capture = vi.fn();
    (handle as any).setPointerCapture = capture;

    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 500 });
    expect(capture).toHaveBeenCalledWith(1);
    expect(document.body.style.userSelect).toBe('none');

    fireEvent.pointerUp(document);
    expect(document.body.style.userSelect).toBe('text');
  });

  it('pointercancel 同样恢复 body userSelect', () => {
    const handle = dragHandle();
    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 500 });
    expect(document.body.style.userSelect).toBe('none');
    fireEvent.pointerCancel(document);
    expect(document.body.style.userSelect).toBe('');
  });

  it('拖拽进行中 window 上的 pointerup 兜底不清除选中禁用（防误清），document 收到后才恢复', () => {
    const handle = dragHandle();
    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 500 });
    // 直接派发到 window：不经过 document（模拟未冒泡到 document 的路径），拖拽仍在进行，兜底不得提前还原
    fireEvent.pointerUp(window);
    expect(document.body.style.userSelect).toBe('none');
    fireEvent.pointerUp(document);
    expect(document.body.style.userSelect).toBe('');
  });

  it('拖拽中组件卸载时通过 cleanup 恢复 body userSelect', () => {
    renderDrawer([{ url: 'https://example.com' }]);
    const handle = screen.getByRole('button', { name: '调整网页面板宽度' });
    fireEvent.pointerDown(handle, { pointerId: 1, clientX: 500 });
    expect(document.body.style.userSelect).toBe('none');
    cleanup();
    expect(document.body.style.userSelect).toBe('');
  });
});
