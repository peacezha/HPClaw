// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import ExecutionTrace, { type ExecutionTraceItem } from './ExecutionTrace';

const SESSION = 'cluster-sess-1';

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

function mockChatFileReads() {
  (fetch as ReturnType<typeof vi.fn>).mockImplementation(async (_url: string, init?: RequestInit) => {
    const { path } = JSON.parse((init?.body as string) || '{}');
    if (String(path).endsWith('.png')) return mockReadResponse(path, 'aGk=', 'image/png', 128);
    return mockReadResponse(path, 'gene,count\nTP53,42', 'text/csv');
  });
}

describe('ExecutionTrace', () => {
  it('keeps items unmounted while collapsed (default) and mounts them after expanding', async () => {
    mockChatFileReads();
    const items: ExecutionTraceItem[] = [
      { message: { content: '[工具] 已生成图片 /home/u/out/plot.png' }, absoluteIndex: 3 },
    ];
    render(<ExecutionTrace items={items} sessionId={SESSION} />);

    // 默认折叠：摘要在，条目不挂载，也不发文件读取
    expect(screen.getByText('执行过程')).toBeTruthy();
    expect(screen.queryByText('工具')).toBeNull();
    expect(fetch).not.toHaveBeenCalled();

    // 展开：条目挂载，工具结果里的 png 路径出图片卡
    fireEvent.click(screen.getByText('执行过程'));
    expect(screen.getByText('工具')).toBeTruthy();
    await waitFor(() => expect(screen.getByText('plot.png')).toBeTruthy());
    const img = document.querySelector('.rich-card img');
    expect(img).not.toBeNull();
    expect(img!.getAttribute('src')).toBe(
      `/api/files/view?path=${encodeURIComponent('/home/u/out/plot.png')}&sessionId=${encodeURIComponent(SESSION)}`,
    );
  });

  it('renders table cards for csv paths in tool results', async () => {
    mockChatFileReads();
    const items: ExecutionTraceItem[] = [
      { message: { content: '[命令执行结果] 写出 /home/u/out/result.csv 完成' }, absoluteIndex: 7 },
    ];
    render(<ExecutionTrace items={items} sessionId={SESSION} />);

    fireEvent.click(screen.getByText('执行过程'));
    await waitFor(() => expect(screen.getByText('TP53')).toBeTruthy());
    expect(screen.getByText('gene')).toBeTruthy();
  });

  it('does not fetch cards for messages without file paths', () => {
    const items: ExecutionTraceItem[] = [
      { message: { content: '[Agent step] 正在规划下一步' }, absoluteIndex: 0 },
    ];
    render(<ExecutionTrace items={items} sessionId={SESSION} />);

    // 默认折叠，未展开时不渲染条目也不发请求
    expect(screen.queryByText(/正在规划下一步/)).toBeNull();
    fireEvent.click(screen.getByText('执行过程'));
    expect(screen.getByText(/正在规划下一步/)).toBeTruthy();
    expect(fetch).not.toHaveBeenCalled();
  });
});
