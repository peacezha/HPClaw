// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { LocaleProvider } from '../i18n';
import AIChat from './AIChat';
import { saveAIProfile } from '../services/aiProfile';
import { saveAgentWorkspace, clearAgentWorkspace } from '../services/agentWorkspace';

vi.mock('../features/file-transfer/api', () => ({
  enqueueTransfer: vi.fn(async () => ({ id: 'task-1' })),
  mkdirRemote: vi.fn(async () => ({ ok: true })),
}));

import { enqueueTransfer, mkdirRemote } from '../features/file-transfer/api';

function makeFile(name: string, absolutePath: string): File {
  const file = new File(['content'], name);
  Object.defineProperty(file, 'testPath', { value: absolutePath });
  return file;
}

function installDesktop() {
  (window as any).hpclawDesktop = {
    getPathForFile: (file: File) => (file as any).testPath || '',
    localFiles: {
      stat: vi.fn(async () => ({ kind: 'directory' })),
      mkdir: vi.fn(async () => {}),
      copy: vi.fn(async (_paths: string[], targetDir: string) => ({
        paths: [`${targetDir}\\data.csv`],
      })),
    },
    dialog: { pickDirectory: vi.fn(async () => null) },
  };
}

function renderChat(sessionId: string | null, onMessagesChange = vi.fn()) {
  return render(
    <LocaleProvider>
      <AIChat
        isOpen
        executeCommand={vi.fn(async () => '')}
        socket={null}
        sessionId={sessionId}
        onSkillsChange={() => {}}
        messages={[]}
        onMessagesChange={onMessagesChange}
      />
    </LocaleProvider>,
  );
}

function attachFiles(files: File[]) {
  const input = screen.getByTestId('chat-attachment-input') as HTMLInputElement;
  fireEvent.change(input, { target: { files } });
}

beforeEach(() => {
  localStorage.clear();
  saveAIProfile({ provider: 'deepseek', model: 'deepseek-chat', apiKey: 'sk-test' });
  installDesktop();
  (window as any).HTMLElement.prototype.scrollIntoView = vi.fn();
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes('/api/ai/stream')) {
      return { ok: false, status: 500, json: async () => ({ error: 'test-stop' }) } as Response;
    }
    return { ok: true, json: async () => ({ success: true, skills: [] }) } as Response;
  }));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
  delete (window as any).hpclawDesktop;
});

describe('AIChat 对话附件', () => {
  it('本地模式：选中的文件复制进工作区 attachments/，出现可移除的 chip', async () => {
    saveAgentWorkspace('E:\\work');
    renderChat('local-workbench');

    fireEvent.click(screen.getByRole('button', { name: '添加附件' }));
    attachFiles([makeFile('data.csv', 'E:\\downloads\\data.csv')]);

    const desktop = (window as any).hpclawDesktop;
    await waitFor(() => expect(desktop.localFiles.copy).toHaveBeenCalled());
    expect(desktop.localFiles.mkdir).toHaveBeenCalledWith('E:\\work\\attachments');
    expect(desktop.localFiles.copy.mock.calls[0][1]).toBe('E:\\work\\attachments');

    const chips = await screen.findByTestId('chat-attachments');
    expect(chips.textContent).toContain('data.csv');

    // 移除 chip
    fireEvent.click(screen.getByRole('button', { name: '移除附件: data.csv' }));
    expect(screen.queryByTestId('chat-attachments')).toBeNull();
  });

  it('本地模式：发送时把附件工作区相对路径追加进消息并清空 chips', async () => {
    saveAgentWorkspace('E:\\work');
    const onMessagesChange = vi.fn();
    renderChat('local-workbench', onMessagesChange);

    fireEvent.click(screen.getByRole('button', { name: '添加附件' }));
    attachFiles([makeFile('data.csv', 'E:\\downloads\\data.csv')]);
    await screen.findByTestId('chat-attachments');

    fireEvent.change(screen.getByPlaceholderText('输入任务描述...'), { target: { value: '分析这个文件' } });
    fireEvent.click(screen.getByRole('button', { name: '发送' }));

    await waitFor(() => {
      const sent = onMessagesChange.mock.calls
        .map(call => call[0])
        .flat()
        .filter((m: any) => m?.role === 'user');
      expect(sent.some((m: any) => m.content.includes('分析这个文件') && m.content.includes('附件:\n- attachments/data.csv'))).toBe(true);
    });
    expect(screen.queryByTestId('chat-attachments')).toBeNull();
  });

  it('本地模式：未设置工作区时给出引导提示，不添加附件', async () => {
    clearAgentWorkspace();
    renderChat('local-workbench');

    fireEvent.click(screen.getByRole('button', { name: '添加附件' }));

    expect(await screen.findByTestId('chat-attachment-error')).toHaveTextContent('请先选择工作文件夹，再添加附件');
    expect(screen.queryByTestId('chat-attachments')).toBeNull();
  });

  it('浏览器模式（无桌面桥接）提示不可用', async () => {
    delete (window as any).hpclawDesktop;
    saveAgentWorkspace('E:\\work');
    renderChat('local-workbench');

    fireEvent.click(screen.getByRole('button', { name: '添加附件' }));

    expect(await screen.findByTestId('chat-attachment-error')).toHaveTextContent('附件功能需要桌面端支持');
  });

  it('集群模式：经传输队列上传到 ~/hpclaw_uploads/ 并随消息发出远程路径', async () => {
    const onMessagesChange = vi.fn();
    renderChat('sess-1', onMessagesChange);

    fireEvent.click(screen.getByRole('button', { name: '添加附件' }));
    attachFiles([makeFile('reads.fastq', 'E:\\data\\reads.fastq')]);

    await waitFor(() => expect(enqueueTransfer).toHaveBeenCalled());
    expect(mkdirRemote).toHaveBeenCalledWith('sess-1', 'hpclaw_uploads');
    expect(enqueueTransfer).toHaveBeenCalledWith('sess-1', expect.objectContaining({
      direction: 'upload',
      localPath: 'E:\\data\\reads.fastq',
      remotePath: 'hpclaw_uploads/reads.fastq',
    }));

    const chips = await screen.findByTestId('chat-attachments');
    expect(chips.textContent).toContain('reads.fastq');

    fireEvent.click(screen.getByRole('button', { name: '发送' }));
    await waitFor(() => {
      const sent = onMessagesChange.mock.calls.map(call => call[0]).flat().filter((m: any) => m?.role === 'user');
      expect(sent.some((m: any) => m.content.includes('附件:\n- ~/hpclaw_uploads/reads.fastq'))).toBe(true);
    });
  });
});
