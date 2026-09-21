// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import FilePreview from './FilePreview';
import type { FileEntry } from '@/shared/fileTransfer';
import { LARGE_TEXT_BYTES } from '@/shared/filePreview';

const previewRemote = vi.fn();
const writeRemote = vi.fn();
vi.mock('./api', () => ({
  previewRemote: (...args: unknown[]) => previewRemote(...args),
  writeRemote: (...args: unknown[]) => writeRemote(...args),
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function file(name: string, size = 100): FileEntry {
  return {
    name,
    path: `C:\\data\\${name}`,
    kind: 'file',
    size,
    modifiedAt: 1,
  };
}

function desktopWithPreview(payload: Record<string, unknown>, writeFile = vi.fn().mockResolvedValue(undefined)) {
  const preview = vi.fn().mockResolvedValue(payload);
  vi.stubGlobal('hpclawDesktop', undefined);
  Object.defineProperty(window, 'hpclawDesktop', {
    configurable: true,
    value: { localFiles: { preview, writeFile }, remoteEdits: {} },
  });
  return { preview, writeFile };
}

describe('FilePreview', () => {
  it('renders Markdown instead of raw source text', async () => {
    desktopWithPreview({
      path: 'C:\\data\\README.md', encoding: 'utf8',
      content: '# Results\n\n**Complete**', bytesRead: 22,
      totalSize: 22, truncated: false,
    });

    render(<FilePreview file={file('README.md')} source="local" onClose={vi.fn()} />);

    expect(await screen.findByRole('heading', { name: 'Results' })).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
  });

  it('edits a local text file in place and saves', async () => {
    const { preview, writeFile } = desktopWithPreview({
      path: 'C:\\data\\notes.txt', encoding: 'utf8',
      content: 'original', bytesRead: 8,
      totalSize: 8, truncated: false,
    });

    render(<FilePreview file={file('notes.txt')} source="local" onClose={vi.fn()} />);

    await screen.findByText('original');
    fireEvent.click(screen.getByRole('button', { name: '编辑' }));

    const textarea = screen.getByTestId('preview-textarea') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'updated' } });

    fireEvent.click(screen.getByRole('button', { name: '保存' }));

    await screen.findByText('保存成功');
    expect(writeFile).toHaveBeenCalledWith('C:\\data\\notes.txt', 'updated');
    expect(preview).toHaveBeenCalledTimes(2);
  });

  it('does not offer edit for truncated text previews', async () => {
    desktopWithPreview({
      path: 'C:\\data\\reads.fa', encoding: 'utf8',
      content: Array.from({ length: 20 }, (_, index) => `line-${index + 1}`).join('\n'),
      bytesRead: 150, totalSize: LARGE_TEXT_BYTES, truncated: true, lineLimit: 20,
    });

    render(<FilePreview file={file('reads.fa', LARGE_TEXT_BYTES)} source="local" onClose={vi.fn()} />);

    await screen.findByText('仅预览 head -20');
    expect(screen.queryByRole('button', { name: '编辑' })).not.toBeInTheDocument();
  });

  it('shows save error when local write fails', async () => {
    const writeFile = vi.fn().mockRejectedValue(new Error('denied'));
    desktopWithPreview({
      path: 'C:\\data\\notes.txt', encoding: 'utf8',
      content: 'original', bytesRead: 8,
      totalSize: 8, truncated: false,
    }, writeFile);

    render(<FilePreview file={file('notes.txt')} source="local" onClose={vi.fn()} />);

    await screen.findByText('original');
    fireEvent.click(screen.getByRole('button', { name: '编辑' }));

    const textarea = screen.getByTestId('preview-textarea') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'updated' } });

    fireEvent.click(screen.getByRole('button', { name: '保存' }));

    await screen.findByText(/保存失败/);
    expect(screen.getByText(/denied/)).toBeInTheDocument();
  });

  it('requests and labels head -20 at the 100 MiB text boundary', async () => {
    const { preview } = desktopWithPreview({
      path: 'C:\\data\\reads.fa', encoding: 'utf8',
      content: Array.from({ length: 20 }, (_, index) => `line-${index + 1}`).join('\n'),
      bytesRead: 150, totalSize: LARGE_TEXT_BYTES, truncated: true, lineLimit: 20,
    });

    render(<FilePreview file={file('reads.fa', LARGE_TEXT_BYTES)} source="local" onClose={vi.fn()} />);

    expect(await screen.findByText('仅预览 head -20')).toBeInTheDocument();
    expect(preview).toHaveBeenCalledWith(
      'C:\\data\\reads.fa',
      expect.objectContaining({ mode: 'head', lineLimit: 20 }),
    );
    expect(screen.getByText('line-20')).toBeInTheDocument();
  });

  it('renders image bytes with the detected MIME type', async () => {
    desktopWithPreview({
      path: 'C:\\data\\plot.png', encoding: 'base64',
      content: 'iVBORw0KGgo=', bytesRead: 8, totalSize: 8, truncated: false,
    });

    render(<FilePreview file={file('plot.png')} source="local" onClose={vi.fn()} />);

    const image = await screen.findByRole('img', { name: 'plot.png' });
    expect(image.getAttribute('src')).toContain('data:image/png;base64,iVBORw0KGgo=');
  });

  it('renders CSV as a table', async () => {
    desktopWithPreview({
      path: 'C:\\data\\counts.csv', encoding: 'utf8',
      content: 'sample,count\nA,12\nB,8', bytesRead: 23,
      totalSize: 23, truncated: false,
    });

    render(<FilePreview file={file('counts.csv')} source="local" onClose={vi.fn()} />);

    expect(await screen.findByRole('cell', { name: 'sample' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '12' })).toBeInTheDocument();
  });

  it('offers system open for unsupported files', () => {
    const onOpen = vi.fn();
    render(
      <FilePreview
        file={file('paper.pdf', 60 * 1024 * 1024)}
        source="local"
        onClose={vi.fn()}
        onOpen={onOpen}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '用本机软件打开' }));
    expect(onOpen).toHaveBeenCalledOnce();
  });

  it('renders HTML in a sandbox with scripts and external resources disabled by default', async () => {
    desktopWithPreview({
      path: 'C:\\data\\report.html', encoding: 'utf8',
      content: '<html><head><title>Report</title></head><body><h1>Result</h1><script>window.bad = true</script></body></html>',
      bytesRead: 110, totalSize: 110, truncated: false,
    });

    render(<FilePreview file={file('report.html')} source="local" onClose={vi.fn()} />);

    const frame = await screen.findByTitle('HTML 预览 report.html') as HTMLIFrameElement;
    expect(frame.getAttribute('sandbox')).toBe('');
    expect(frame.srcdoc).toContain("default-src 'none'");
    expect(frame.srcdoc).toContain("script-src 'none'");
    expect(screen.getByRole('button', { name: '启用交互内容' })).toBeInTheDocument();
  });

  it('allows editing HTML source', async () => {
    desktopWithPreview({
      path: 'C:\\data\\report.html', encoding: 'utf8',
      content: '<h1>Result</h1>', bytesRead: 15, totalSize: 15, truncated: false,
    });

    render(<FilePreview file={file('report.html')} source="local" onClose={vi.fn()} />);

    await screen.findByTitle('HTML 预览 report.html');
    fireEvent.click(screen.getByRole('button', { name: '编辑' }));
    expect(screen.getByTestId('preview-textarea')).toHaveValue('<h1>Result</h1>');
  });

  it('renders supported audio in the built-in player', async () => {
    desktopWithPreview({
      path: 'C:\\data\\recording.mp3', encoding: 'base64',
      content: 'SUQz', bytesRead: 3, totalSize: 3, truncated: false,
    });

    render(<FilePreview file={file('recording.mp3')} source="local" onClose={vi.fn()} />);

    const audio = await screen.findByTestId('audio-preview');
    expect(audio.getAttribute('src')).toContain('data:audio/mpeg;base64,SUQz');
  });

  it('edits a remote text file in place and saves', async () => {
    previewRemote.mockResolvedValue({
      path: '/home/notes.txt', encoding: 'utf8',
      content: 'remote original', bytesRead: 15,
      totalSize: 15, truncated: false,
    });
    writeRemote.mockResolvedValue({ ok: true });

    render(<FilePreview file={{ ...file('notes.txt'), path: '/home/notes.txt' } as FileEntry} source="remote" sessionId="s1" onClose={vi.fn()} />);

    await screen.findByText('remote original');
    fireEvent.click(screen.getByRole('button', { name: '编辑' }));

    const textarea = screen.getByTestId('preview-textarea') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'remote updated' } });

    fireEvent.click(screen.getByRole('button', { name: '保存' }));

    await screen.findByText('保存成功');
    expect(writeRemote).toHaveBeenCalledWith('s1', '/home/notes.txt', 'remote updated');
  });
});
