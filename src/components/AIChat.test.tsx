// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { act, render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { LocaleProvider } from '../i18n';
import AIChat, { buildConversationTimeline, extractOutputFiles } from './AIChat';
import { saveAIProfile } from '../services/aiProfile';
import { saveAgentWorkspace, clearAgentWorkspace } from '../services/agentWorkspace';
import { useState } from 'react';
import { formatWorkflowExecutionContext } from '../../shared/workflowExecution';

vi.mock('./WorkflowRunCard', () => ({
  default: ({ context }: any) => <div data-testid="workflow-run-card">{context.runId}</div>,
}));

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
  (window as any).traceDesktop = {
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
  delete (window as any).traceDesktop;
});

describe('AIChat 对话附件', () => {
  it.each(['composer', 'explain-button'])('treats %s clarification as an explanation on the original stream, never a selected repair', async (mode) => {
    let stream!: ReadableStreamDefaultController<Uint8Array>;
    const send = (event: any) => stream.enqueue(new TextEncoder().encode('data: ' + JSON.stringify(event) + '\n\n'));
    const fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes('/api/ai/stream')) return new Response(new ReadableStream({ start(controller) {
        stream = controller;
        send({ type: 'ask', id: 'q-repair', question: 'Choose a repair method', options: ['CSI', 'Realign'] });
      } }));
      if (url === '/api/ai/question') {
        const payload = JSON.parse(String(init?.body));
        expect(payload.id).toBe('q-repair');
        expect(payload.answer).toMatchObject({ selected: [], intent: 'clarification' });
        expect(payload.answer.custom).toMatch(/方案/);
        send({ type: 'ask_resolved', id: 'q-repair', reason: 'answered', answered: true, answer: payload.answer });
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
    fireEvent.change(screen.getByPlaceholderText('输入任务描述...'), { target: { value: '修复并继续原任务' } });
    fireEvent.click(screen.getByRole('button', { name: '发送' }));
    await screen.findByTestId('ai-question-dialog');
    fireEvent.click(screen.getByRole('button', { name: 'CSI' }));
    if (mode === 'composer') {
      fireEvent.click(screen.getByRole('button', { name: '稍后回答' }));
      fireEvent.change(screen.getByPlaceholderText('输入任务描述...'), { target: { value: '有哪些修复方案？' } });
      fireEvent.click(screen.getByRole('button', { name: '发送' }));
    } else fireEvent.click(screen.getByRole('button', { name: '先解释方案' }));
    await waitFor(() => expect(screen.queryByTestId('ai-question-dialog')).toBeNull());
    expect(fetch.mock.calls.filter(call => String(call[0]) === '/api/ai/question')).toHaveLength(1);
    expect(fetch.mock.calls.filter(call => String(call[0]) === '/api/ai/stream')).toHaveLength(1);
    expect(fetch.mock.calls.some(call => String(call[0]) === '/api/ai/abort')).toBe(false);
    await act(async () => { send({ type: 'done', content: '方案解释完成；尚未选择或执行修复。' }); stream.close(); });
    expect(await screen.findByText('方案解释完成；尚未选择或执行修复。')).toBeVisible();
  });

  it('renders the full conversation beyond 500 records and expands long details in the chat pane', async () => {
    const messages = Array.from({ length: 602 }, (_, index) => ({
      role: 'user' as const, content: 'history-row-' + index,
    }));
    const all: any[] = [...messages,
      { role: 'system', content: '[命令输出]\n' + 'x'.repeat(1000) + 'OUTPUT_END' },
      { role: 'assistant', content: '结果尚未核验。', thoughtSteps: [{ step: 1, content: 'x'.repeat(1000) + 'DETAIL_END' }] },
    ];
    render(<LocaleProvider><AIChat isOpen executeCommand={vi.fn()} socket={null} sessionId="qa-only"
      messages={all} onMessagesChange={vi.fn()} onSkillsChange={() => {}} /></LocaleProvider>);
    expect(screen.getByText('history-row-0')).toBeVisible();
    expect(screen.getByText('history-row-300')).toBeVisible();
    expect(screen.getByText('history-row-601')).toBeVisible();
    expect(screen.queryByText(/可在对话存档中完整查看/)).toBeNull();
    expect(screen.queryByText(/OUTPUT_END/)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '展开执行记录' }));
    expect(screen.getByText(/OUTPUT_END/)).toBeVisible();
    await waitFor(() => expect(screen.getByText(/DETAIL_END/)).toBeVisible());
  });

  it('keeps one card per RUN on repeated breakpoint resumes without hiding the user instructions', () => {
    const marker = (runId: string, slash = '') => formatWorkflowExecutionContext({
      workflowId: 'wf', runId, runDir: '/home/qa/trace_flows/wf/03_workspace/runs/' + runId + slash,
    });
    const messages = [
      { role: 'user' as const, content: marker('r1') + '\n开始流程。' },
      { role: 'assistant' as const, content: '作业已提交，等待输出验收。' },
      { role: 'user' as const, content: marker('r1', '/') + '\n从步骤 2 继续。' },
      { role: 'user' as const, content: marker('r2') + '\n单独启动另一个 RUN。' },
    ];
    render(<LocaleProvider><AIChat isOpen executeCommand={vi.fn()} socket={null} sessionId="qa-only"
      messages={messages} onMessagesChange={vi.fn()} onSkillsChange={() => {}} /></LocaleProvider>);
    expect(screen.getAllByTestId('workflow-run-card').map(card => card.textContent)).toEqual(['r1', 'r2']);
    expect(screen.getByText('开始流程。')).toBeVisible();
    expect(screen.getByText('从步骤 2 继续。')).toBeVisible();
    expect(screen.queryByText(/TRACE_WORKFLOW_RUN/)).toBeNull();
  });

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

  it('keeps a failed composer answer in the deferred dialog without starting another task', async () => {
    let stream!: ReadableStreamDefaultController<Uint8Array>;
    const fetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/api/ai/stream')) return new Response(new ReadableStream({ start(controller) {
        stream = controller;
        controller.enqueue(new TextEncoder().encode('data: ' + JSON.stringify({
          type: 'ask', id: 'q-composer', question: '请填写 FASTQ 文件路径。', options: [],
        }) + '\n\n'));
      } }));
      if (url === '/api/ai/question') throw new Error('Simulated offline delivery');
      return Response.json({ success: true, skills: [], workflows: [], runs: [] });
    });
    vi.stubGlobal('fetch', fetch);
    function Controlled() {
      const [messages, setMessages] = useState<any[]>([]);
      return <LocaleProvider><AIChat isOpen executeCommand={vi.fn()} socket={null} sessionId="qa-only" activeConversationId="qa-only"
        messages={messages} onMessagesChange={setMessages} onSkillsChange={() => {}} /></LocaleProvider>;
    }
    render(<Controlled />);
    fireEvent.change(screen.getByPlaceholderText('输入任务描述...'), { target: { value: '分析数据' } });
    fireEvent.click(screen.getByRole('button', { name: '发送' }));
    await screen.findByTestId('ai-question-dialog');
    fireEvent.click(screen.getByRole('button', { name: '稍后回答' }));
    fireEvent.change(screen.getByPlaceholderText('输入任务描述...'), { target: { value: '/data/retained_R1.fastq.gz' } });
    fireEvent.click(screen.getByRole('button', { name: '发送' }));
    await waitFor(() => expect(fetch.mock.calls.filter(call => String(call[0]) === '/api/ai/question')).toHaveLength(1));
    fireEvent.click(screen.getByRole('button', { name: '回答问题' }));
    expect(screen.getByLabelText('你的回答 / 补充说明')).toHaveValue('/data/retained_R1.fastq.gz');
    expect(await screen.findByRole('alert')).toHaveTextContent('尚未核验');
    expect(fetch.mock.calls.filter(call => String(call[0]) === '/api/ai/stream')).toHaveLength(1);
    await act(async () => stream.close());
  });

  it('keeps the deferred composer enabled while delivering an answer and shows its failure without reopening', async () => {
    let stream!: ReadableStreamDefaultController<Uint8Array>, reject!: (error: Error) => void;
    const fetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/api/ai/stream')) return new Response(new ReadableStream({ start(controller) {
        stream = controller;
        controller.enqueue(new TextEncoder().encode('data: ' + JSON.stringify({
          type: 'ask', id: 'q-busy-composer', question: '请填写 FASTQ 文件路径。', options: [],
        }) + '\n\n'));
      } }));
      if (url === '/api/ai/question') return new Promise<Response>((_resolve, fail) => { reject = fail; });
      return Response.json({ success: true, skills: [], workflows: [], runs: [] });
    });
    vi.stubGlobal('fetch', fetch);
    function Controlled() {
      const [messages, setMessages] = useState<any[]>([]);
      return <LocaleProvider><AIChat isOpen executeCommand={vi.fn()} socket={null} sessionId="qa-only" activeConversationId="qa-only"
        messages={messages} onMessagesChange={setMessages} onSkillsChange={() => {}} /></LocaleProvider>;
    }
    render(<Controlled />);
    fireEvent.change(screen.getByPlaceholderText('输入任务描述...'), { target: { value: '分析数据' } });
    fireEvent.click(screen.getByRole('button', { name: '发送' }));
    await screen.findByTestId('ai-question-dialog');
    fireEvent.click(screen.getByRole('button', { name: '稍后回答' }));
    fireEvent.change(screen.getByPlaceholderText('输入任务描述...'), { target: { value: '/data/retained_R1.fastq.gz' } });
    fireEvent.click(screen.getByRole('button', { name: '发送' }));
    // 答案送达期间输入框保持可用（送达有 10s 超时兜底），仅问答卡/对话框显示 loading
    await waitFor(() => expect(fetch.mock.calls.filter(call => String(call[0]) === '/api/ai/question')).toHaveLength(1));
    fireEvent.change(screen.getByPlaceholderText('输入任务描述...'), { target: { value: '补充说明' } });
    expect(screen.getByPlaceholderText('输入任务描述...')).toBeEnabled();
    expect(screen.getByRole('button', { name: '发送' })).toBeEnabled();
    await act(async () => reject(new Error('Simulated offline delivery')));
    expect(screen.queryByTestId('ai-question-dialog')).toBeNull();
    expect(await screen.findByRole('alert')).toHaveTextContent('尚未核验');
    expect(screen.getByPlaceholderText('输入任务描述...')).toBeEnabled();
    fireEvent.click(screen.getByRole('button', { name: '回答问题' }));
    expect(screen.getByLabelText('你的回答 / 补充说明')).toHaveValue('/data/retained_R1.fastq.gz');
    expect(fetch.mock.calls.filter(call => String(call[0]) === '/api/ai/stream')).toHaveLength(1);
    await act(async () => stream.close());
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

    const desktop = (window as any).traceDesktop;
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
    delete (window as any).traceDesktop;
    saveAgentWorkspace('E:\\work');
    renderChat('local-workbench');

    fireEvent.click(screen.getByRole('button', { name: '添加附件' }));

    expect(await screen.findByTestId('chat-attachment-error')).toHaveTextContent('附件功能需要桌面端支持');
  });

  it('集群模式：经传输队列上传到 ~/trace_uploads/ 并随消息发出远程路径', async () => {
    const onMessagesChange = vi.fn();
    renderChat('sess-1', onMessagesChange);

    fireEvent.click(screen.getByRole('button', { name: '添加附件' }));
    attachFiles([makeFile('reads.fastq', 'E:\\data\\reads.fastq')]);

    await waitFor(() => expect(enqueueTransfer).toHaveBeenCalled());
    expect(mkdirRemote).toHaveBeenCalledWith('sess-1', 'trace_uploads');
    expect(enqueueTransfer).toHaveBeenCalledWith('sess-1', expect.objectContaining({
      direction: 'upload',
      localPath: 'E:\\data\\reads.fastq',
      remotePath: 'trace_uploads/reads.fastq',
    }));

    const chips = await screen.findByTestId('chat-attachments');
    expect(chips.textContent).toContain('reads.fastq');

    fireEvent.click(screen.getByRole('button', { name: '发送' }));
    await waitFor(() => {
      const sent = onMessagesChange.mock.calls.map(call => call[0]).flat().filter((m: any) => m?.role === 'user');
      expect(sent.some((m: any) => m.content.includes('附件:\n- ~/trace_uploads/reads.fastq'))).toBe(true);
    });
  });
});

describe('AIChat 上下文压缩提示', () => {
  function renderControlledChat() {
    function Controlled() {
      const [messages, setMessages] = useState<any[]>([]);
      return <LocaleProvider><AIChat isOpen executeCommand={vi.fn()} socket={null} sessionId="qa-only" activeConversationId="qa-only"
        messages={messages} onMessagesChange={setMessages} onSkillsChange={() => {}} /></LocaleProvider>;
    }
    render(<Controlled />);
  }

  it('收到 compacted 事件时插入一条轻量系统提示', async () => {
    let stream!: ReadableStreamDefaultController<Uint8Array>;
    const send = (event: any) => stream.enqueue(new TextEncoder().encode('data: ' + JSON.stringify(event) + '\n\n'));
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/api/ai/stream')) return new Response(new ReadableStream({ start(controller) {
        stream = controller;
        send({ type: 'compacted', count: 7, summaryChars: 860, requestId: 'req-compact' });
        send({ type: 'done', content: '好的，继续。', requestId: 'req-compact' });
        stream.close();
      } }));
      return Response.json({ success: true, skills: [], workflows: [], runs: [] });
    }));
    renderControlledChat();

    fireEvent.change(screen.getByPlaceholderText('输入任务描述...'), { target: { value: '继续分析' } });
    fireEvent.click(screen.getByRole('button', { name: '发送' }));

    const notice = await screen.findByText(/早期 7 条消息已压缩为摘要/);
    expect(notice).toBeVisible();
    expect(await screen.findByText('好的，继续。')).toBeVisible();
  });

  it('compacted 事件按英文界面渲染英文提示，count 非法时不插入', async () => {
    localStorage.setItem('trace_language', 'en-US');
    let stream!: ReadableStreamDefaultController<Uint8Array>;
    const send = (event: any) => stream.enqueue(new TextEncoder().encode('data: ' + JSON.stringify(event) + '\n\n'));
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/api/ai/stream')) return new Response(new ReadableStream({ start(controller) {
        stream = controller;
        send({ type: 'compacted', count: 'not-a-number', summaryChars: 0, requestId: 'req-noop' });
        send({ type: 'compacted', count: 12, summaryChars: 1500, requestId: 'req-compact-en' });
        send({ type: 'done', content: 'Done.', requestId: 'req-compact-en' });
        stream.close();
      } }));
      return Response.json({ success: true, skills: [], workflows: [], runs: [] });
    }));
    renderControlledChat();

    fireEvent.change(await screen.findByPlaceholderText('Describe a task…'), { target: { value: 'continue' } });
    fireEvent.click(await screen.findByRole('button', { name: 'Send' }));

    expect(await screen.findByText(/12 earlier messages were compressed into a summary/)).toBeVisible();
    expect(screen.queryByText(/not-a-number/)).toBeNull();
  });
});

describe('AIChat 计划审批 / 插话 / 任务清单', () => {
  const planEvent = {
    goal: '质控并比对',
    steps: [
      { id: '1', title: '运行 FastQC', verification: '生成 fastqc.html', status: 'pending' },
      { id: '2', title: '提交 bwa 作业', verification: '返回 Job ID', status: 'pending' },
    ],
    createdAt: 1, updatedAt: 1, status: 'active',
  };

  function Controlled() {
    const [messages, setMessages] = useState<any[]>([]);
    return <LocaleProvider><AIChat isOpen executeCommand={vi.fn()} socket={null} sessionId="qa-only" activeConversationId="qa-only"
      messages={messages} onMessagesChange={setMessages} onSkillsChange={() => {}} /></LocaleProvider>;
  }

  it('renders the plan review card on plan_review and approves it; task list panel follows the plan', async () => {
    let stream!: ReadableStreamDefaultController<Uint8Array>;
    const send = (event: any) => stream.enqueue(new TextEncoder().encode('data: ' + JSON.stringify(event) + '\n\n'));
    const fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes('/api/ai/stream')) return new Response(new ReadableStream({ start(controller) {
        stream = controller;
        send({ type: 'status', phase: 'preparing', message: '准备中', requestId: 'req-plan' });
        send({ type: 'plan', plan: planEvent });
        send({ type: 'plan_review', id: 'pr-1', goal: planEvent.goal, steps: planEvent.steps, expiresAt: Date.now() + 600_000, requestId: 'req-plan' });
      } }));
      if (url === '/api/ai/plan-review') {
        const payload = JSON.parse(String(init?.body));
        expect(payload).toEqual({ id: 'pr-1', action: 'approve' });
        send({ type: 'plan_review_resolved', id: 'pr-1', reason: 'approved', action: 'approve', requestId: 'req-plan' });
        return Response.json({ success: true, reason: 'approved' });
      }
      return Response.json({ success: true, skills: [], workflows: [], runs: [] });
    });
    vi.stubGlobal('fetch', fetch);
    render(<Controlled />);

    fireEvent.change(screen.getByPlaceholderText('输入任务描述...'), { target: { value: '跑质控和比对' } });
    fireEvent.click(screen.getByRole('button', { name: '发送' }));

    // 审批卡出现，步骤逐条可见；任务清单条同步出现
    const card = await screen.findByTestId('plan-review-card');
    expect(card).toHaveTextContent('目标：质控并比对');
    expect(screen.getByLabelText('步骤 2 标题')).toHaveProperty('value', '提交 bwa 作业');
    const panel = screen.getByTestId('agent-plan-panel');
    expect(panel.textContent).toContain('步骤 0/2');

    fireEvent.click(screen.getByRole('button', { name: '批准计划' }));
    await waitFor(() => expect(fetch.mock.calls.filter(call => String(call[0]) === '/api/ai/plan-review')).toHaveLength(1));
    await waitFor(() => expect(screen.queryByTestId('plan-review-card')).toBeNull());
    // 没有新开任务，也没有中止原任务
    expect(fetch.mock.calls.filter(call => String(call[0]) === '/api/ai/stream')).toHaveLength(1);
    expect(fetch.mock.calls.some(call => String(call[0]) === '/api/ai/abort')).toBe(false);
    // 批准后续跑：计划推进后任务清单更新，done 收尾后面板随完成计划隐藏
    await act(async () => {
      send({ type: 'plan_update', plan: { ...planEvent, steps: [{ ...planEvent.steps[0], status: 'done', summary: 'ok' }, planEvent.steps[1]] }, stepId: '1' });
    });
    expect(screen.getByTestId('agent-plan-panel').textContent).toContain('步骤 1/2');
    await act(async () => {
      send({ type: 'plan_update', plan: { ...planEvent, steps: [{ ...planEvent.steps[0], status: 'done', summary: 'ok' }, { ...planEvent.steps[1], status: 'done', summary: 'ok' }] }, stepId: '2' });
      send({ type: 'done', content: '全部完成。', requestId: 'req-plan' });
      stream.close();
    });
    expect(await screen.findByText('全部完成。')).toBeVisible();
    await waitFor(() => expect(screen.queryByTestId('agent-plan-panel')).toBeNull());
  });

  it('cancels a reviewed plan and shows the cancelled marker before the turn ends', async () => {
    let stream!: ReadableStreamDefaultController<Uint8Array>;
    const send = (event: any) => stream.enqueue(new TextEncoder().encode('data: ' + JSON.stringify(event) + '\n\n'));
    const fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes('/api/ai/stream')) return new Response(new ReadableStream({ start(controller) {
        stream = controller;
        send({ type: 'status', phase: 'preparing', message: '准备中', requestId: 'req-cancel' });
        send({ type: 'plan', plan: planEvent });
        send({ type: 'plan_review', id: 'pr-2', goal: planEvent.goal, steps: planEvent.steps, expiresAt: Date.now() + 600_000, requestId: 'req-cancel' });
      } }));
      if (url === '/api/ai/plan-review') {
        const payload = JSON.parse(String(init?.body));
        expect(payload).toEqual({ id: 'pr-2', action: 'cancel' });
        send({ type: 'plan', plan: { ...planEvent, status: 'cancelled' } });
        send({ type: 'plan_review_resolved', id: 'pr-2', reason: 'cancelled', action: 'cancel', requestId: 'req-cancel' });
        send({ type: 'done', content: '计划已被用户取消，本轮已结束，未执行计划中的任何操作。', requestId: 'req-cancel' });
        stream.close();
        return Response.json({ success: true, reason: 'cancelled' });
      }
      return Response.json({ success: true, skills: [], workflows: [], runs: [] });
    });
    vi.stubGlobal('fetch', fetch);
    render(<Controlled />);

    fireEvent.change(screen.getByPlaceholderText('输入任务描述...'), { target: { value: '跑质控和比对' } });
    fireEvent.click(screen.getByRole('button', { name: '发送' }));
    await screen.findByTestId('plan-review-card');
    fireEvent.click(screen.getByRole('button', { name: '取消计划' }));
    await waitFor(() => expect(fetch.mock.calls.filter(call => String(call[0]) === '/api/ai/plan-review')).toHaveLength(1));
    expect(await screen.findByText(/计划已被用户取消/)).toBeVisible();
    // 取消的计划随 done 清理，任务清单不再悬挂
    await waitFor(() => expect(screen.queryByTestId('agent-plan-panel')).toBeNull());
  });

  it('steers the running agent instead of tearing down the stream, and clears the hint on steer_applied', async () => {
    let stream!: ReadableStreamDefaultController<Uint8Array>;
    const send = (event: any) => stream.enqueue(new TextEncoder().encode('data: ' + JSON.stringify(event) + '\n\n'));
    const fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes('/api/ai/stream')) return new Response(new ReadableStream({ start(controller) {
        stream = controller;
        send({ type: 'status', phase: 'preparing', message: '准备中', requestId: 'req-steer' });
        send({ type: 'tool_call', name: 'run_command', args: { command: 'fastqc a.fq' } });
      } }));
      if (url === '/api/ai/steer') {
        const payload = JSON.parse(String(init?.body));
        expect(payload).toEqual({ requestId: 'req-steer', text: '先别提交，改成只看日志' });
        return Response.json({ success: true, delivered: 'queued', position: 1 });
      }
      return Response.json({ success: true, skills: [], workflows: [], runs: [] });
    });
    vi.stubGlobal('fetch', fetch);
    render(<Controlled />);

    fireEvent.change(screen.getByPlaceholderText('输入任务描述...'), { target: { value: '分析 a.fq' } });
    fireEvent.click(screen.getByRole('button', { name: '发送' }));
    // 等首个工具事件处理完（requestId 已就位、运行进行中）；命令明细在折叠的执行记录里，不断言它
    await waitFor(() => expect(screen.getAllByText(/AI 正在执行计算资源命令/).length).toBeGreaterThan(0));

    // 运行中直接再发一条 → 走 steer，不中止、不新开流
    fireEvent.change(screen.getByPlaceholderText('输入任务描述...'), { target: { value: '先别提交，改成只看日志' } });
    fireEvent.click(screen.getByRole('button', { name: '发送' }));
    await waitFor(() => expect(fetch.mock.calls.filter(call => String(call[0]) === '/api/ai/steer')).toHaveLength(1));
    expect(await screen.findByText('已插话，AI 将在当前步骤后响应。')).toBeVisible();
    expect(fetch.mock.calls.filter(call => String(call[0]) === '/api/ai/stream')).toHaveLength(1);
    expect(fetch.mock.calls.some(call => String(call[0]) === '/api/ai/abort')).toBe(false);
    // 插话作为用户消息留在对话里
    expect(screen.getByText('先别提交，改成只看日志')).toBeVisible();

    await act(async () => send({ type: 'steer_applied', texts: ['先别提交，改成只看日志'], requestId: 'req-steer' }));
    expect(await screen.findByText(/插话已注入/)).toBeVisible();
    await act(async () => { send({ type: 'done', content: '已改为只读检查。', requestId: 'req-steer' }); stream.close(); });
    expect(await screen.findByText('已改为只读检查。')).toBeVisible();
    await waitFor(() => expect(screen.queryByText(/插话已注入/)).toBeNull());
  });
});
