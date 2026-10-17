import { describe, expect, it } from 'vitest';
import { composeRunMessage, composeUseMessage } from './compose';
import type { Workflow } from '@/shared/workflow';
import type { PreflightResult } from '@/shared/flowManifest';
import { parseWorkflowExecutionContext } from '@/shared/workflowExecution';

function makeWorkflow(overrides: Partial<Workflow> = {}): Workflow {
  return {
    id: 'wf-x',
    name: '测试流程',
    description: 'desc',
    keywords: [],
    params: [{ name: 'INPUT_DIR', label: '输入目录' }],
    steps: [{ title: 's1', command: 'echo hi' }],
    manifest: {
      software: [{ name: 'FastQC', module: 'FastQC/0.11.9', required: true }],
      references: [],
      inputHint: 'FASTQ 目录',
      qcGates: [{ afterStep: 1, metric: 'Q30', pass: '>80%' }],
    },
    source: 'user',
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  };
}

describe('composeUseMessage 隔离工作目录协议', () => {
  it('只发送流程标识，不把整份执行协议塞进聊天框', () => {
    const wf = makeWorkflow();
    const msg = composeUseMessage(wf);
    expect(msg).toContain(`「${wf.name}」（${wf.id}）`);
    expect(msg).toContain('结构化步骤');
    expect(msg.length).toBeLessThan(300);
  });

  it('仅列出已确认的预检缺项，不要求重新扫描', () => {
    const preflight: PreflightResult = {
      workflowId: 'wf-x', checkedAt: 1, scheduler: 'lsf', ready: false,
      software: [{ name: 'FastQC', ok: false, required: true, detail: 'module 不可用' }],
      references: [],
    };
    const msg = composeUseMessage(makeWorkflow(), preflight);
    expect(msg).toContain('环境阻断');
    expect(msg).toContain('FastQC（module 不可用）');
    expect(msg).toContain('不要搜索替代目录');
  });

  it('缓存环境就绪时明确禁止重复预检', () => {
    const preflight: PreflightResult = {
      workflowId: 'wf-x', checkedAt: 1, scheduler: 'lsf', ready: true,
      software: [{ name: 'FastQC', ok: true, required: true }], references: [],
    };
    expect(composeUseMessage(makeWorkflow(), preflight)).toContain('不重复预检');
  });
});

describe('composeRunMessage 正式运行协议', () => {
  it('只携带运行标记，参数和步骤从结构化 run.json 读取', () => {
    const run = { runId: 'run-001', runDir: '/home/u/trace_flows/wf/03_workspace/runs/run-001' };
    const msg = composeRunMessage(makeWorkflow(), {
      inputs: ['/data/projectA/fastq'],
      paramValues: { INPUT_DIR: '/data/projectA/fastq', THREADS: '8', EMPTY: '' },
      run,
    });
    expect(parseWorkflowExecutionContext(msg)).toEqual({
      workflowId: 'wf-x', runId: 'run-001', runDir: run.runDir, policy: 'isolated-run-v1',
    });
    expect(msg).toContain('参数、步骤脚本和进度已经写入 RUN/run.json');
    expect(msg).toContain('不重新规划');
    expect(msg).not.toContain('/data/projectA/fastq');
    expect(msg).not.toContain('THREADS = 8');
    expect(msg.length).toBeLessThan(500);
  });

  it('没有正式 run 时明确要求先创建结构化运行记录', () => {
    const msg = composeRunMessage(makeWorkflow(), { inputs: [], paramValues: {} });
    expect(msg).toContain('使用流程面板创建运行记录');
    expect(msg).toContain('环境尚未检查');
  });
});

describe('composeRunMessage 启动前整体检查话术', () => {
  const run = { runId: 'run-001', runDir: '/home/u/trace_flows/wf/03_workspace/runs/run-001' };

  it('整体检查通过：写明扫描范围已覆盖，只有新问题才暂停询问', () => {
    const msg = composeRunMessage(makeWorkflow(), {
      inputs: [], paramValues: {}, run,
      preRunCheck: { passed: true },
    });
    expect(msg).toContain('已完成启动前整体检查');
    expect(msg).toContain('本次扫描未覆盖的新问题');
    // 不再使用"遇到缺项才询问、不扫描其他目录"的旧话术
    expect(msg).not.toContain('不扫描其他目录');
    expect(msg).not.toContain('环境尚未检查');
  });

  it('用户强制运行：列出已接受的警告并要求不重复询问', () => {
    const msg = composeRunMessage(makeWorkflow(), {
      inputs: [], paramValues: {}, run,
      preRunCheck: { passed: false, acceptedWarnings: ['可选库：待用户指定路径（OPTIONAL_DB 未提供）'] },
    });
    expect(msg).toContain('未全部通过');
    expect(msg).toContain('可选库：待用户指定路径（OPTIONAL_DB 未提供）');
    expect(msg).toContain('不要重复询问');
  });
});
