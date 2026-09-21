// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import WorkflowConfigCard from './WorkflowConfigCard';
import type { Workflow } from '@/shared/workflow';
import { createWorkflowRun, listWorkflows } from '../features/workflows/api';

vi.mock('../features/workflows/api', async () => {
  const actual = await vi.importActual<typeof import('../features/workflows/api')>('../features/workflows/api');
  return {
    ...actual,
    listWorkflows: vi.fn(async () => []),
    createWorkflowRun: vi.fn(async (_id: string, _config: unknown) => ({
      runId: 'run-card-001',
      workflowId: 'wf-test',
      workflowName: '测试流程',
      runDir: '/home/u/hpclaw_flows/test/03_workspace/runs/run-card-001',
      status: 'running',
      currentStep: 0,
      totalSteps: 1,
      steps: [{ n: 1, title: 's1', status: 'pending' }],
    })),
  };
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function makeWorkflow(overrides: Partial<Workflow> = {}): Workflow {
  return {
    id: 'wf-test',
    name: '测试流程',
    description: '用于测试的流程',
    keywords: [],
    params: [
      { name: 'INPUT_DIR', label: '输入目录', type: 'path' },
      { name: 'QUEUE', label: '队列', type: 'select', options: ['normal', 'smp'], defaultValue: 'normal' },
      { name: 'THREADS', label: '线程数', type: 'number', defaultValue: '8' },
    ],
    steps: [{ title: 's1', command: 'echo hi' }],
    manifest: {
      software: [{ name: 'FastQC', module: 'FastQC/0.11.9', required: true }],
      references: [],
      inputHint: 'FASTQ 目录',
      qcGates: [],
    },
    source: 'user',
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  };
}

describe('WorkflowConfigCard', () => {
  it('按 workflowId 拉取定义并渲染参数表单', async () => {
    vi.mocked(listWorkflows).mockResolvedValueOnce([makeWorkflow()]);
    render(<WorkflowConfigCard workflowId="wf-test" sessionId="s1" onSendMessage={() => {}} />);
    expect(await screen.findByText(/测试流程/)).toBeInTheDocument();
    expect(screen.getByText(/流程配置/)).toBeInTheDocument();
    expect(screen.getByText('数据选择')).toBeInTheDocument();
    expect(screen.getByDisplayValue('normal')).toBeInTheDocument();
    expect(screen.getByDisplayValue('8')).toBeInTheDocument();
    expect(screen.getByText('确认运行')).toBeInTheDocument();
  });

  it('流程不存在时给出提示而不是空白', async () => {
    render(<WorkflowConfigCard workflowId="wf-gone" sessionId="s1" onSendMessage={() => {}} />);
    expect(await screen.findByText(/可能已被删除/)).toBeInTheDocument();
    expect(screen.queryByText('确认运行')).not.toBeInTheDocument();
  });

  it('确认运行：先校验必填，再创建正式运行并提交执行协议', async () => {
    vi.mocked(listWorkflows).mockResolvedValueOnce([makeWorkflow()]);
    const onSendMessage = vi.fn();
    render(<WorkflowConfigCard workflowId="wf-test" sessionId="s1" onSendMessage={onSendMessage} />);
    const confirm = await screen.findByText('确认运行');

    // 数据目录未选 → 阻断
    fireEvent.click(confirm);
    expect(onSendMessage).not.toHaveBeenCalled();
    expect(screen.getByText(/请先选择要处理的数据/)).toBeInTheDocument();

    // 手动输入数据目录；必填 path 参数仍空 → 阻断
    const pathInput = screen.getByPlaceholderText('或手动输入计算资源路径后回车');
    fireEvent.change(pathInput, { target: { value: '/data/fastq' } });
    fireEvent.keyDown(pathInput, { key: 'Enter' });
    fireEvent.click(screen.getByText('确认运行'));
    expect(screen.getByText(/参数未填写.*输入目录/)).toBeInTheDocument();

    // 填上必填参数 → 创建运行并提交协议
    fireEvent.change(screen.getByPlaceholderText('INPUT_DIR'), { target: { value: '/data/fastq' } });
    fireEvent.click(screen.getByText('确认运行'));
    await waitFor(() => expect(onSendMessage).toHaveBeenCalledTimes(1));
    expect(createWorkflowRun).toHaveBeenCalledWith('wf-test', expect.objectContaining({
      inputs: ['/data/fastq'],
      params: expect.objectContaining({ INPUT_DIR: '/data/fastq', QUEUE: 'normal', THREADS: '8' }),
    }), 's1');
    const message = onSendMessage.mock.calls[0][0] as string;
    expect(message).toContain('[HPCLAW_WORKFLOW_RUN]');
    expect(message).toContain('run-card-001');
    // 确认运行 → 告知 App 开该次运行专属的对话
    expect(onSendMessage.mock.calls[0][1]).toEqual({ dedicatedConversation: true });
    expect(await screen.findByText('已发起运行')).toBeInTheDocument();
  });

  it('无集群会话时禁用运行并提示', async () => {
    vi.mocked(listWorkflows).mockResolvedValueOnce([makeWorkflow()]);
    render(<WorkflowConfigCard workflowId="wf-test" sessionId={null} onSendMessage={() => {}} />);
    expect(await screen.findByText(/当前未连接计算资源/)).toBeInTheDocument();
    expect(screen.getByText('确认运行').closest('button')).toBeDisabled();
  });

  it('数据选择为"选择文件或目录"，path 参数提供选文件/选目录两个入口并按 kind 回调', async () => {
    vi.mocked(listWorkflows).mockResolvedValueOnce([makeWorkflow()]);
    const onPickRemoteFolder = vi.fn(async (_kind?: string) => '/data/picked.gtf');
    render(<WorkflowConfigCard workflowId="wf-test" sessionId="s1" onSendMessage={() => {}} onPickRemoteFolder={onPickRemoteFolder} />);

    // 数据选择按钮（any 模式）
    const dataButton = await screen.findByText('选择文件或目录');
    fireEvent.click(dataButton);
    await waitFor(() => expect(onPickRemoteFolder).toHaveBeenCalledWith('any'));
    expect(await screen.findByTitle('/data/picked.gtf')).toBeInTheDocument();

    // path 参数（INPUT_DIR）：选文件 / 选目录分别回调 file / folder
    fireEvent.click(screen.getByTitle('选择文件'));
    await waitFor(() => expect(onPickRemoteFolder).toHaveBeenCalledWith('file'));
    await waitFor(() => expect(screen.getByDisplayValue('/data/picked.gtf')).toBeInTheDocument());
    fireEvent.click(screen.getByTitle('选择目录'));
    await waitFor(() => expect(onPickRemoteFolder).toHaveBeenCalledWith('folder'));
  });
});
