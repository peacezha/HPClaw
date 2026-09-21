// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import DetectedFilesStrip from './DetectedFilesStrip';

afterEach(cleanup);

const SESSION = 'cluster-sess-1';

describe('DetectedFilesStrip', () => {
  it('skips image entries for assistant messages (covered by RichContentMessage ImageCard)', () => {
    const { container } = render(
      <DetectedFilesStrip files={['/home/u/out/plot.png']} role="assistant" sessionId={SESSION} />,
    );
    expect(container.firstChild).toBeNull();
    expect(document.querySelector('img')).toBeNull();
  });

  it('keeps non-image entries for assistant messages as code text with a download button', () => {
    render(<DetectedFilesStrip files={['/home/u/out/result.csv']} role="assistant" sessionId={SESSION} />);
    expect(screen.getByText('/home/u/out/result.csv')).toBeTruthy();
    expect(document.querySelector('img')).toBeNull();
    expect(screen.getByRole('button', { name: '下载文件' })).toBeTruthy();
  });

  it('renders images of system messages inline via the cluster view URL', () => {
    render(<DetectedFilesStrip files={['/home/u/out/plot.png']} role="system" sessionId={SESSION} />);
    const img = document.querySelector('img');
    expect(img).not.toBeNull();
    expect(img!.getAttribute('src')).toBe(
      `/api/files/view?path=${encodeURIComponent('/home/u/out/plot.png')}&sessionId=${encodeURIComponent(SESSION)}`,
    );
    // 路径文本与下载按钮保留
    expect(screen.getByText('/home/u/out/plot.png')).toBeTruthy();
    expect(screen.getByRole('button', { name: '下载文件' })).toBeTruthy();
  });

  it('points local-mode images at /api/local/files/view with the workspace query', () => {
    render(
      <DetectedFilesStrip files={['C:\\work\\out\\plot.png']} role="user" sessionId="local-workbench" workspace={'C:\\work'} />,
    );
    const img = document.querySelector('img');
    expect(img).not.toBeNull();
    expect(img!.getAttribute('src')).toBe(
      `/api/local/files/view?path=${encodeURIComponent('C:\\work\\out\\plot.png')}&workspace=${encodeURIComponent('C:\\work')}`,
    );
  });

  it('falls back to the next candidate and finally to plain path text when all fail', () => {
    render(<DetectedFilesStrip files={['/home/u/out/plot.png']} role="system" sessionId={SESSION} />);
    const img = document.querySelector('img')!;
    // 集群端点失败 → 换本地候选
    fireEvent.error(img);
    const retry = document.querySelector('img')!;
    expect(retry.getAttribute('src')).toBe(
      `/api/local/files/view?path=${encodeURIComponent('/home/u/out/plot.png')}`,
    );
    // 本地也失败 → 图片消失，只剩路径文本
    fireEvent.error(retry);
    expect(document.querySelector('img')).toBeNull();
    expect(screen.getByText('/home/u/out/plot.png')).toBeTruthy();
  });

  it('opens a lightbox when the inline image is clicked', () => {
    render(<DetectedFilesStrip files={['/home/u/out/plot.png']} role="system" sessionId={SESSION} />);
    fireEvent.click(document.querySelector('img')!);
    const lightbox = screen.getByTestId('image-lightbox');
    expect(lightbox.querySelector('img')!.getAttribute('src')).toBe(
      `/api/files/view?path=${encodeURIComponent('/home/u/out/plot.png')}&sessionId=${encodeURIComponent(SESSION)}`,
    );
  });

  it('renders nothing when the file list is empty', () => {
    const { container } = render(<DetectedFilesStrip files={[]} role="user" />);
    expect(container.firstChild).toBeNull();
  });
});
