// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { act, render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { LocaleProvider } from '../i18n';
import AIChat, { buildConversationTimeline, extractOutputFiles } from './AIChat';
import { saveAIProfile } from '../services/aiProfile';
import { saveAgentWorkspace, clearAgentWorkspace } from '../services/agentWorkspace';
import { useState } from 'react';

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

it('does not turn a relative report or HTTP URL into a false absolute download path', () => {
  expect(extractOutputFiles('07_report/report.html https://host/report.html ./results/r.tsv ~/run/a.pdf /project/07_report/report.html')).toEqual(['/project/07_report/report.html', '~/run/a.pdf']);
});

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
  it('keeps a live ask dialog visible through message updates, preserves drafts after deferral, and answers the original stream', async () => {
    let stream!: ReadableStreamDefaultController<Uint8Array>;
    const send = (event: any) => stream.enqueue(new TextEncoder().encode('data: ' + JSON.stringify(event) + '\n\n'));
    const fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes('/api/ai/stream')) return new Response(new ReadableStream({ start(controller) {
        stream = controller;
        send({ type: 'tool_call', name: 'ask_user_question' });
        send({ type: 'ask', id: 'q-live', question: '确认要处理哪些样本？', options: ['样本 A', '样本 B'], multiSelect: true });
      } }));
      if (url === '/api/ai/question') {
        expect(JSON.parse(String(init?.body))).toEqual({ id: 'q-live', answer: { selected: ['样本 A', '样本 B'], custom: '保留对照' } });
        send({ type: 'ask_resolved', id: 'q-live', reason: 'answered', answered: true });
        return Response.json({ success: true, reason: 'answered' });
      }
      return Response.json({ success: true, skills: [], workflows: [], runs: [] });
    });
    vi.stubGlobal('fetch', fetch);
    function Controlled() {
      const [messages, setMessages] = useState<any[]>([]);
      return <LocaleProvider><AIChat isOpen executeCommand={vi.fn()} socket={null} sessionId="qa-only" activeConversationId="qa-only"
        messages={messages} onMessagesChange={setMessages} onSkillsChange={() => {}} /></LocaleProvider>;
    }
    render(<Controlled />);
    fireEvent.change(screen.getByPlaceholderText('输入任务描述...'), { target: { value: '继续处理样本' } });
    fireEvent.click(screen.getByRole('button', { name: '发送' }));
    const dialog = await screen.findByRole('dialog', { name: 'Agent 需要你回答' });
    expect(dialog).toBeVisible();
    await act(async () => send({ type: 'tool_result', name: 'run_command', result: 'QA ONLY' }));
    expect(dialog).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: '样本 A' })); fireEvent.click(screen.getByRole('button', { name: '样本 B' }));
    fireEvent.change(screen.getByLabelText('你的回答 / 补充说明'), { target: { value: '保留对照' } });
    fireEvent.click(screen.getByRole('button', { name: '稍后回答' }));
    expect(screen.queryByTestId('ai-question-dialog')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '回答问题' }));
    expect(screen.getByLabelText('你的回答 / 补充说明')).toHaveValue('保留对照');
    fireEvent.click(screen.getByRole('button', { name: '提交回答' }));
    await waitFor(() => expect(screen.queryByTestId('ai-question-dialog')).toBeNull());
    expect(fetch.mock.calls.filter(call => String(call[0]) === '/api/ai/stream')).toHaveLength(1);
    expect(fetch.mock.calls.some(call => String(call[0]) === '/api/ai/abort')).toBe(false);
    await act(async () => { send({ type: 'done', content: '仅模拟问答完成，未操作集群。' }); stream.close(); });
    expect(await screen.findByText('仅模拟问答完成，未操作集群。')).toBeVisible();
  });

  it('restores an unanswered question on reattach and only clears it on a real conversation switch', async () => {
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/api/ai/active')) return Response.json({ success: true, running: url.includes('conversationId=old'), requestId: 'q-old' });
      if (url.includes('/api/ai/stream/attach')) return new Response(new ReadableStream({ start(controller) {
        controller.enqueue(new TextEncoder().encode('data: ' + JSON.stringify({ type: 'ask', id: 'q-old', question: '旧任务缺少哪个参数？', options: [] }) + '\n\n'));
      } }));
      return Response.json({ success: true, skills: [], workflows: [], runs: [] });
    }));
    const chat = (id: string, messages: any[]) => <LocaleProvider><AIChat isOpen executeCommand={vi.fn()} socket={null} sessionId="qa-only"
      activeConversationId={id} messages={messages} onMessagesChange={vi.fn()} onSkillsChange={() => {}} /></LocaleProvider>;
    const view = render(chat('old', []));
    await screen.findByTestId('ai-question-dialog');
    view.rerender(chat('old', [{ role: 'assistant', content: '后台新增记录' }]));
    expect(screen.getByTestId('ai-question-dialog')).toHaveTextContent('旧任务缺少哪个参数？');
    view.rerender(chat('new', []));
    await waitFor(() => expect(screen.queryByTestId('ai-question-dialog')).toBeNull());
  });

  it('discards a delayed completion reload after switching conversations', async () => {
    let resolve!: (value: Response) => void;
    let requested = false;
    const onMessagesChange = vi.fn();
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/api/ai/active')) return Response.json({ success: true, running: url.includes('conversationId=old'), requestId: 'old-request' });
      if (url.includes('/api/ai/stream/attach')) return new Response(new ReadableStream({ start(controller) {
        controller.enqueue(new TextEncoder().encode('data: ' + JSON.stringify({ type: 'done', content: 'old result' }) + '\n\n'));
        controller.close();
      } }));
      if (url.includes('/api/conversations/old')) { requested = true; return new Promise<Response>(r => { resolve = r; }); }
      return Response.json({ success: true, skills: [], workflows: [], runs: [] });
    }));
    const chat = (id: string) => <LocaleProvider><AIChat isOpen executeCommand={vi.fn()} socket={null} sessionId="qa-only"
      activeConversationId={id} messages={[]} onMessagesChange={onMessagesChange} onSkillsChange={() => {}} /></LocaleProvider>;
    const view = render(chat('old'));
    await waitFor(() => expect(requested).toBe(true));
    view.rerender(chat('new'));
    await act(async () => resolve(Response.json({ success: true, conversation: { messages: [{ role: 'assistant', content: 'late-old' }] } })));
    expect(onMessagesChange).not.toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ content: 'late-old' })]));
  });
  it('restores command approval after attaching to a running conversation and renders without crashing', async () => {
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/api/ai/active')) return Response.json({ success: true, running: true, requestId: 'qa-only' });
      if (url.includes('/api/ai/stream/attach')) return new Response(new ReadableStream({
        start(controller) { controller.enqueue(new TextEncoder().encode('data: ' + JSON.stringify({
          type: 'confirm', id: 'qa-only', command: 'bkill 123456', risk: 'destructive', expiresAt: Date.now() + 60000,
        }) + '\n\n')); },
      }));
      return Response.json({ success: true, skills: [], workflows: [], runs: [] });
    }));
    render(<LocaleProvider><AIChat isOpen executeCommand={vi.fn()} socket={null} sessionId="qa-only"
      activeConversationId="qa-only" messages={[]} onMessagesChange={vi.fn()} onSkillsChange={() => {}} /></LocaleProvider>);
    const dialog = await screen.findByTestId('command-approval');
    expect(dialog.textContent).toContain('bkill 123456');
    expect(screen.getByRole('button', { name: '允许本次' })).toBeEnabled();
    expect(screen.queryByRole('button', { name: '信任常规命令' })).toBeNull();
  });
  it('collapses existing DSH technical logs but keeps the answer and error visible', () => {
    const messages = [
      { role: 'user' as const, content: '继续' },
      { role: 'system' as const, content: '[🔧 cluster_fs] {"action":"push","path":"/data/step-03.sh"}' },
      { role: 'system' as const, content: '[📋 cluster_fs] copied' },
      { role: 'assistant' as const, content: '作业已提交，产物尚未核验。' },
      { role: 'system' as const, content: '[❌ Error] 通信中断；请核对现有作业。' },
    ];
    const result = buildConversationTimeline(messages, 0);
    expect(result.map(item => item.type)).toEqual(['message', 'execution', 'message', 'message']);
    expect(result[1]).toMatchObject({ items: [{ absoluteIndex: 1 }, { absoluteIndex: 2 }] });
    expect(messages[1].content).toContain('cluster_fs');
  });
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
