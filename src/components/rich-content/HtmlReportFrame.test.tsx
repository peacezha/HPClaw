// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import HtmlReportFrame from './HtmlReportFrame';
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
const resolved = (filePath: string) => ({ ok: true, json: async () => ({ filePath, metadata: { size: 512 * 1024 ** 2 } }) });

describe('streaming report source selection', () => {
  it('routes local tool artifacts locally even when the conversation is bound to a cluster', async () => {
    const fetcher = vi.fn(async (_url: string, _init?: RequestInit) => resolved('C:\\work\\report.html'));
    vi.stubGlobal('fetch', fetcher);
    render(<HtmlReportFrame path=".dsh-vision-toolkit/report.html" sessionId="cluster-1" workspace="C:\\work" />);
    const iframe = await screen.findByTestId('html-report-iframe');
    expect(fetcher.mock.calls[0][0]).toBe('/api/local/files/html/resolve');
    expect(iframe.getAttribute('src')).toContain('/api/local/files/html/document?');
    expect(iframe.getAttribute('src')).not.toContain('sessionId=');
    expect(screen.getByText(/512.0 MiB/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '允许外部资源' }));
    expect(screen.getByTestId('html-report-iframe').getAttribute('src')).toContain('network=1');
  });

  it('never substitutes local data for a stale cluster session', async () => {
    const fetcher = vi.fn(async () => ({ ok: false, status: 401, json: async () => ({ error: { message: 'session expired' } }) }));
    vi.stubGlobal('fetch', fetcher);
    render(<HtmlReportFrame path="/run/report.html" sessionId="cluster-1" />);
    await screen.findByText('session expired');
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('html-report-iframe')).toBeNull();
  });

  it('switches missing remote files to local only after an explicit 404', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce({ ok: false, status: 404, json: async () => ({ error: { message: 'missing' } }) }).mockResolvedValueOnce(resolved('C:\\work\\report.html'));
    vi.stubGlobal('fetch', fetcher);
    render(<HtmlReportFrame path="/run/report.html" sessionId="cluster-1" workspace="C:\\work" />);
    await waitFor(() => expect(screen.getByTestId('html-report-iframe')).toBeTruthy());
    expect(fetcher.mock.calls.map(call => call[0])).toEqual(['/api/files/html/resolve', '/api/local/files/html/resolve']);
    expect(screen.getByTestId('html-report-iframe').getAttribute('src')).toContain('/api/local/files/html/document?');
  });
});
