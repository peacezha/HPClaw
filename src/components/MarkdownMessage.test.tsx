// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import MarkdownMessage from './MarkdownMessage';

afterEach(cleanup);

describe('MarkdownMessage', () => {
  it('renders GFM pipe tables as real table elements', () => {
    const { container } = render(
      <MarkdownMessage content={'| 样本 | 数量 |\n| --- | --- |\n| S1 | 42 |'} />,
    );

    const table = container.querySelector('table');
    expect(table).not.toBeNull();
    const headers = Array.from(table!.querySelectorAll('th')).map(cell => cell.textContent);
    expect(headers).toEqual(['样本', '数量']);
    const bodyCells = Array.from(table!.querySelectorAll('td')).map(cell => cell.textContent);
    expect(bodyCells).toEqual(['S1', '42']);
  });

  it('offers a side-panel button next to http(s) links', () => {
    const onOpenWebPanel = vi.fn();
    render(<MarkdownMessage content={'详见 [示例文档](https://example.com/doc) 页面'} onOpenWebPanel={onOpenWebPanel} />);

    const link = screen.getByRole('link', { name: '示例文档' });
    expect(link).toHaveAttribute('target', '_blank');

    fireEvent.click(screen.getByRole('button', { name: '在侧边打开' }));
    expect(onOpenWebPanel).toHaveBeenCalledWith({ url: 'https://example.com/doc', title: '示例文档' });
  });

  it('hides the side-panel button when no handler is provided or link is not http(s)', () => {
    const { rerender } = render(<MarkdownMessage content={'[示例](https://example.com)'} />);
    expect(screen.queryByRole('button', { name: '在侧边打开' })).toBeNull();

    rerender(<MarkdownMessage content={'邮件 <a@b.com>'} onOpenWebPanel={vi.fn()} />);
    expect(screen.queryByRole('button', { name: '在侧边打开' })).toBeNull();
  });

  it('keeps normal links pointing at the system browser even with a handler', () => {
    render(<MarkdownMessage content={'[官网](https://example.com)'} onOpenWebPanel={vi.fn()} />);
    const link = screen.getByRole('link', { name: '官网' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });
});

describe('MarkdownMessage chat images', () => {
  it('leaves http(s) image sources untouched', () => {
    render(<MarkdownMessage content={'![示意图](https://example.com/a.png)'} />);
    expect(screen.getByRole('img', { name: '示意图' })).toHaveAttribute('src', 'https://example.com/a.png');
  });

  it('leaves data: image sources untouched', () => {
    render(<MarkdownMessage content={'![图](data:image/png;base64,AAA)'} />);
    expect(screen.getByRole('img')).toHaveAttribute('src', 'data:image/png;base64,AAA');
  });

  it('rewrites Windows absolute paths to the local file view endpoint', () => {
    render(<MarkdownMessage content={'![结果](C:\\data\\x.png)'} />);
    expect(screen.getByRole('img', { name: '结果' }))
      .toHaveAttribute('src', `/api/local/files/view?path=${encodeURIComponent('C:\\data\\x.png')}`);
  });

  it('rewrites relative paths to the local endpoint with the workspace parameter', () => {
    render(<MarkdownMessage content={'![plot](.dsh-vision-toolkit/artifacts/x.png)'} workspace="D:\ws" />);
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      `/api/local/files/view?path=${encodeURIComponent('.dsh-vision-toolkit/artifacts/x.png')}&workspace=${encodeURIComponent('D:\\ws')}`,
    );
  });

  it('treats the local-workbench session as local mode', () => {
    render(<MarkdownMessage content={'![plot](/home/u/x.png)'} sessionId="local-workbench" />);
    expect(screen.getByRole('img'))
      .toHaveAttribute('src', `/api/local/files/view?path=${encodeURIComponent('/home/u/x.png')}`);
  });

  it('rewrites Unix absolute paths to the cluster endpoint with the session id', () => {
    render(<MarkdownMessage content={'![plot](/home/u/x.png)'} sessionId="ssh-1" />);
    expect(screen.getByRole('img'))
      .toHaveAttribute('src', `/api/files/view?path=${encodeURIComponent('/home/u/x.png')}&sessionId=ssh-1`);
  });

  it('strips the file:// scheme before rewriting (Windows and Unix forms)', () => {
    const { rerender } = render(<MarkdownMessage content={'![图](file:///C:/data/x.png)'} />);
    expect(screen.getByRole('img'))
      .toHaveAttribute('src', `/api/local/files/view?path=${encodeURIComponent('C:/data/x.png')}`);

    rerender(<MarkdownMessage content={'![图](file:///home/u/x.png)'} sessionId="ssh-1" />);
    expect(screen.getByRole('img'))
      .toHaveAttribute('src', `/api/files/view?path=${encodeURIComponent('/home/u/x.png')}&sessionId=ssh-1`);
  });

  it('falls back to the plain path text when the image fails to load', () => {
    const { container } = render(<MarkdownMessage content={'![缺失](C:\\data\\missing.png)'} />);
    fireEvent.error(screen.getByRole('img', { name: '缺失' }));
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText('C:\\data\\missing.png')).toBeTruthy();
  });

  it('opens http(s) images in the side panel on click', () => {
    const onOpenWebPanel = vi.fn();
    render(<MarkdownMessage content={'![示意图](https://example.com/a.png)'} onOpenWebPanel={onOpenWebPanel} />);
    fireEvent.click(screen.getByRole('img', { name: '示意图' }));
    expect(onOpenWebPanel).toHaveBeenCalledWith({ url: 'https://example.com/a.png', title: '示意图' });
  });

  it('routes Windows absolute paths to the local endpoint even in a cluster session', () => {
    // 回归：dsh 引擎始终在本地产出文件，会话绑定集群时 Windows 路径也不能发到集群端
    render(<MarkdownMessage content={'![结果](C:\\data\\x.png)'} sessionId="ssh-1" />);
    expect(screen.getByRole('img', { name: '结果' }))
      .toHaveAttribute('src', `/api/local/files/view?path=${encodeURIComponent('C:\\data\\x.png')}`);
  });

  it('preserves backslash-punctuation sequences in Windows image destinations', () => {
    // 回归：CommonMark 会把目的地里的 `\.` 吃成 `.`（`\_`→`_` 同理），路径被改后 404
    render(<MarkdownMessage content={'![视图](C:\\data\\.hidden\\x.png)'} />);
    expect(screen.getByRole('img', { name: '视图' }))
      .toHaveAttribute('src', `/api/local/files/view?path=${encodeURIComponent('C:\\data\\.hidden\\x.png')}`);
  });

  it('prefers the local endpoint for dot-relative paths in a cluster session', () => {
    render(<MarkdownMessage content={'![图](.dsh-vision-toolkit/artifacts/x.png)'} sessionId="ssh-1" />);
    expect(screen.getByRole('img'))
      .toHaveAttribute('src', `/api/local/files/view?path=${encodeURIComponent('.dsh-vision-toolkit/artifacts/x.png')}`);
  });

  it('retries the local endpoint when the cluster endpoint fails, then falls back to path text', () => {
    const { container } = render(<MarkdownMessage content={'![图](/home/u/x.png)'} sessionId="ssh-1" />);
    const first = screen.getByRole('img');
    expect(first).toHaveAttribute('src', `/api/files/view?path=${encodeURIComponent('/home/u/x.png')}&sessionId=ssh-1`);

    // 集群端 404 → 换本地端点重试
    fireEvent.error(first);
    expect(screen.getByRole('img'))
      .toHaveAttribute('src', `/api/local/files/view?path=${encodeURIComponent('/home/u/x.png')}`);

    // 本地也失败 → 降级为路径文本，不留破图
    fireEvent.error(screen.getByRole('img'));
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText('/home/u/x.png')).toBeTruthy();
  });

  it('opens a lightbox when a file-path image is clicked, and closes on background click', () => {
    render(<MarkdownMessage content={'![结果](C:\\data\\x.png)'} />);
    expect(screen.queryByTestId('image-lightbox')).toBeNull();

    fireEvent.click(screen.getByRole('img', { name: '结果' }));

    const lightbox = screen.getByTestId('image-lightbox');
    expect(lightbox.querySelector('img')!.getAttribute('src'))
      .toBe(`/api/local/files/view?path=${encodeURIComponent('C:\\data\\x.png')}`);
    expect(screen.getByText('结果')).toBeTruthy();

    fireEvent.click(lightbox);
    expect(screen.queryByTestId('image-lightbox')).toBeNull();
  });

  it('keeps http(s) images opening the side panel instead of the lightbox', () => {
    render(<MarkdownMessage content={'![示意图](https://example.com/a.png)'} onOpenWebPanel={vi.fn()} />);
    fireEvent.click(screen.getByRole('img', { name: '示意图' }));
    expect(screen.queryByTestId('image-lightbox')).toBeNull();
  });
});

describe('MarkdownMessage html fences', () => {
  const FULL_PAGE = '```html\n<!doctype html>\n<html><body><h1>模拟</h1><script>1</script></body></html>\n```';

  it('offers a render button under a full-page html fence and renders the card in place', () => {
    render(<MarkdownMessage content={`下面是报告\n\n${FULL_PAGE}`} />);

    // 代码块本身仍在（源码可对照），下方出现渲染入口
    const button = screen.getByRole('button', { name: /渲染为交互页面/ });
    expect(document.querySelector('pre code.language-html')).not.toBeNull();

    fireEvent.click(button);
    const card = screen.getByTestId('html-artifact-card');
    // 卡片默认收起，展开后 iframe srcDoc 带 CSP 且脚本启用
    fireEvent.click(within(card).getByRole('button', { name: '展开网页预览' }));
    const iframe = within(card).getByTestId('html-artifact-iframe');
    expect(iframe.getAttribute('srcdoc')).toContain('<h1>模拟</h1>');
    expect(iframe.getAttribute('srcdoc')).toContain('Content-Security-Policy');
    expect(iframe.getAttribute('sandbox')).toBe('allow-scripts');
  });

  it('ignores html fences that are not full pages', () => {
    render(<MarkdownMessage content={'```html\n<div class="x">片段</div>\n```'} />);
    expect(screen.queryByRole('button', { name: /渲染为交互页面/ })).toBeNull();
    expect(document.querySelector('pre code.language-html')).not.toBeNull();
  });

  it('leaves non-html code blocks untouched', () => {
    render(<MarkdownMessage content={'```bash\nsbatch run.sh\n```'} />);
    expect(screen.queryByRole('button', { name: /渲染为交互页面/ })).toBeNull();
    expect(document.querySelector('pre code.language-bash')).not.toBeNull();
  });
});
