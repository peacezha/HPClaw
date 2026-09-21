// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import HtmlArtifactCard from './HtmlArtifactCard';

const SESSION = 'cluster-session-1';

function mockReadResponse(path: string, content: string, mime = 'text/html') {
  return {
    ok: true,
    json: async () => ({ filePath: path, content, metadata: { size: content.length, mime } }),
  } as Response;
}

function mockReadFailure() {
  return {
    ok: false,
    status: 404,
    json: async () => ({ error: { code: 'REMOTE_FILE_NOT_FOUND', message: 'no such file' } }),
  } as Response;
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('HtmlArtifactCard', () => {
  it('stays collapsed by default and does not fetch the file', () => {
    render(<HtmlArtifactCard path="/home/u/run/report.html" sessionId={SESSION} />);

    expect(screen.getByTestId('html-artifact-card')).toBeTruthy();
    expect(screen.getByText('report.html')).toBeTruthy();
    expect(screen.queryByTestId('html-artifact-iframe')).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('fetches the path source on expand and renders it in a sandboxed iframe with scripts on', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockReadResponse('/home/u/run/report.html', '<html><body><h1>报告</h1></body></html>'),
    );

    render(<HtmlArtifactCard path="/home/u/run/report.html" sessionId={SESSION} />);
    fireEvent.click(screen.getByRole('button', { name: '展开网页预览' }));

    await waitFor(() => expect(screen.getByTestId('html-artifact-iframe')).toBeTruthy());
    const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe('/api/files/read');
    expect((init as RequestInit).headers).toMatchObject({ 'X-SSH-Session-Id': SESSION });
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({ path: '/home/u/run/report.html' });

    const iframe = screen.getByTestId('html-artifact-iframe');
    const srcDoc = iframe.getAttribute('srcdoc') || '';
    expect(srcDoc).toContain('<h1>报告</h1>');
    expect(srcDoc).toContain('Content-Security-Policy');
    expect(srcDoc).toContain("script-src 'unsafe-inline'");
    expect(iframe.getAttribute('sandbox')).toBe('allow-scripts');
  });

  it('renders an inline html source without any fetch', async () => {
    render(<HtmlArtifactCard title="模拟" html={'<!doctype html><html><body><canvas></canvas></body></html>'} />);

    fireEvent.click(screen.getByRole('button', { name: '展开网页预览' }));

    await waitFor(() => expect(screen.getByTestId('html-artifact-iframe')).toBeTruthy());
    expect(fetch).not.toHaveBeenCalled();
    expect(screen.getByTestId('html-artifact-iframe').getAttribute('srcdoc')).toContain('<canvas>');
  });

  it('toggles scripts off and back on from the toolbar', async () => {
    render(<HtmlArtifactCard html={'<html><body>x</body></html>'} />);
    fireEvent.click(screen.getByRole('button', { name: '展开网页预览' }));
    await waitFor(() => expect(screen.getByTestId('html-artifact-iframe')).toBeTruthy());

    fireEvent.click(screen.getByRole('button', { name: '关闭网页脚本' }));
    expect(screen.getByTestId('html-artifact-iframe').getAttribute('sandbox')).toBe('');
    expect(screen.getByTestId('html-artifact-iframe').getAttribute('srcdoc')).toContain("script-src 'none'");

    fireEvent.click(screen.getByRole('button', { name: '启用交互内容' }));
    expect(screen.getByTestId('html-artifact-iframe').getAttribute('sandbox')).toBe('allow-scripts');
  });

  it('shows an error state on failure and retries on demand', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockReadFailure());

    render(<HtmlArtifactCard path="/home/u/run/missing.html" sessionId={SESSION} />);
    fireEvent.click(screen.getByRole('button', { name: '展开网页预览' }));

    await waitFor(() => expect(screen.getByText('网页加载失败')).toBeTruthy());
    expect(screen.queryByTestId('html-artifact-iframe')).toBeNull();
    const failedCalls = (fetch as ReturnType<typeof vi.fn>).mock.calls.length;
    expect(failedCalls).toBeGreaterThan(0);

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockReadResponse('/home/u/run/missing.html', '<html><body>ok</body></html>'),
    );
    fireEvent.click(screen.getByRole('button', { name: '重试' }));

    await waitFor(() => expect(screen.getByTestId('html-artifact-iframe')).toBeTruthy());
    expect((fetch as ReturnType<typeof vi.fn>).mock.calls.length).toBeGreaterThan(failedCalls);
  });

  it('offers the side-panel entry for path sources when a handler is provided', () => {
    const onOpenWebPanel = vi.fn();
    render(<HtmlArtifactCard path="/home/u/run/report.html" sessionId={SESSION} onOpenWebPanel={onOpenWebPanel} />);

    fireEvent.click(screen.getByRole('button', { name: '在侧边预览' }));
    expect(onOpenWebPanel).toHaveBeenCalledWith({
      remotePath: '/home/u/run/report.html',
      sessionId: SESSION,
      title: 'report.html',
    });
  });
});
