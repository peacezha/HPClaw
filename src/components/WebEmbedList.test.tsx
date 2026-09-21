// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import WebEmbedList, { extractWebUrls } from './WebEmbedList';

afterEach(() => {
  cleanup();
  delete (window as any).hpclawDesktop;
});

describe('extractWebUrls', () => {
  it('extracts bare http(s) URLs from prose', () => {
    expect(extractWebUrls('详见 https://example.com/report 和 http://a.b/c。')).toEqual([
      'https://example.com/report',
      'http://a.b/c',
    ]);
  });

  it('extracts markdown link destinations', () => {
    expect(extractWebUrls('请看 [分析报告](https://example.com/r) 了解详情')).toEqual(['https://example.com/r']);
  });

  it('ignores URLs that are markdown image destinations', () => {
    expect(extractWebUrls('示意图 ![plot](https://example.com/plot.png) 如上')).toEqual([]);
  });

  it('excludes localhost and 127.0.0.1 (local file service endpoints)', () => {
    expect(
      extractWebUrls('文件在 http://localhost:8787/api/local/files/view?path=/x.png ，页面 https://example.com/doc'),
    ).toEqual(['https://example.com/doc']);
    expect(extractWebUrls('http://127.0.0.1:3000/index 和 https://127.0.0.1/x')).toEqual([]);
  });

  it('deduplicates and caps at 2 urls', () => {
    const text = [
      'https://a.com/1',
      '[link](https://a.com/1)',
      'https://b.com/2',
      'https://c.com/3',
    ].join(' ');
    expect(extractWebUrls(text)).toEqual(['https://a.com/1', 'https://b.com/2']);
  });

  it('strips trailing prose punctuation but keeps balanced parentheses', () => {
    expect(extractWebUrls('(见 https://example.com/a)')).toEqual(['https://example.com/a']);
    expect(extractWebUrls('https://en.wikipedia.org/wiki/Foo_(bar) 参考')).toEqual([
      'https://en.wikipedia.org/wiki/Foo_(bar)',
    ]);
  });
});

describe('WebEmbedList', () => {
  it('renders nothing without web urls', () => {
    const { container } = render(<WebEmbedList text="没有链接的消息" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders collapsed cards with domain and side-panel button; expanding shows the iframe fallback in jsdom', () => {
    const onOpenWebPanel = vi.fn();
    render(<WebEmbedList text="详见 https://example.com/report 与 [文档](https://docs.example.com)" onOpenWebPanel={onOpenWebPanel} />);

    const cards = screen.getAllByTestId('web-embed-card');
    expect(cards).toHaveLength(2);
    expect(screen.getByText('example.com')).toBeTruthy();
    // 默认收起：不加载任何内嵌内容
    expect(document.querySelector('webview')).toBeNull();
    expect(document.querySelector('iframe')).toBeNull();

    // 侧边打开按钮交给侧边网页栏
    fireEvent.click(screen.getAllByRole('button', { name: '在侧边打开' })[0]);
    expect(onOpenWebPanel).toHaveBeenCalledWith({ url: 'https://example.com/report', title: 'example.com' });

    // 展开：非 Electron（jsdom 无 hpclawDesktop）回退 sandbox iframe + 提示
    fireEvent.click(screen.getAllByRole('button', { name: '展开网页预览' })[0]);
    const iframe = document.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe!.getAttribute('src')).toBe('https://example.com/report');
    expect(iframe!.getAttribute('sandbox')).toBe('allow-scripts allow-same-origin');
    expect(screen.getByText(/部分网站禁止内嵌/)).toBeTruthy();

    // 再点收起，内嵌内容卸载
    fireEvent.click(screen.getByRole('button', { name: '收起网页预览' }));
    expect(document.querySelector('iframe')).toBeNull();
  });

  it('uses a webview in the Electron desktop environment', () => {
    (window as any).hpclawDesktop = { app: { edition: 'desktop' } };
    render(<WebEmbedList text="https://example.com/x" />);

    fireEvent.click(screen.getByRole('button', { name: '展开网页预览' }));
    const webview = document.querySelector('webview');
    expect(webview).not.toBeNull();
    expect(webview!.getAttribute('src')).toBe('https://example.com/x');
    expect(webview!.getAttribute('partition')).toBe('hpclaw-webpanel');
    expect(document.querySelector('iframe')).toBeNull();
  });
});
