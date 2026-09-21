import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const { mockStreamText, mockInvokeWebApi, mockSearchWebApis } = vi.hoisted(() => ({
  mockStreamText: vi.fn(),
  mockInvokeWebApi: vi.fn(),
  mockSearchWebApis: vi.fn(),
}));

vi.mock('@ai-sdk/openai', () => ({
  createOpenAI: () => () => 'openai-model',
}));

vi.mock('@ai-sdk/openai-compatible', () => ({
  createOpenAICompatible: () => ({
    chatModel: () => 'compatible-model',
  }),
}));

vi.mock('@ai-sdk/google', () => ({
  createGoogleGenerativeAI: () => () => 'google-model',
}));

vi.mock('ai', () => ({
  streamText: mockStreamText,
  tool: (definition: any) => definition,
  stepCountIs: () => () => false,
  zodSchema: (schema: any) => schema,
}));

vi.mock('../webapis/invoke', () => ({
  invokeWebApi: mockInvokeWebApi,
  searchWebApis: mockSearchWebApis,
}));

import {
  buildAgentSystemPrompt,
  buildLocalWorkspacePromptSection,
  buildWorkflowExecutorPrompt,
  normalizeAgentRuntimeConfig,
  runAgent,
  workflowRuntimeConfig,
  workflowExecutionProfile,
} from './agentRunner';
import { LOCAL_WORKSPACE_NOT_SET_MESSAGE } from '../local/localWorkspace';

beforeEach(() => {
  mockStreamText.mockReset();
});

describe('agent runtime limits', () => {
  it('uses the longer default and accepts the configurable upper limits', () => {
    expect(normalizeAgentRuntimeConfig({})).toMatchObject({ maxCommands: 40, maxSteps: 200 });
    expect(normalizeAgentRuntimeConfig({ maxCommands: 200, maxSteps: 500 }))
      .toMatchObject({ maxCommands: 200, maxSteps: 500 });
  });

  it('clamps values outside the supported range', () => {
    expect(normalizeAgentRuntimeConfig({ maxCommands: 999, maxSteps: 999 }))
      .toMatchObject({ maxCommands: 200, maxSteps: 500 });
    expect(normalizeAgentRuntimeConfig({ maxCommands: 1, maxSteps: 1 }))
      .toMatchObject({ maxCommands: 5, maxSteps: 10 });
  });
});

describe('agent response language', () => {
  const config = {
    planningPolicy: 'auto' as const,
    confirmationPolicy: 'dangerous' as const,
    maxCommands: 40,
    maxSteps: 50,
  };

  it('defaults to Chinese user-facing responses', () => {
    const prompt = buildAgentSystemPrompt(config, false);
    expect(prompt).toContain('全程用中文');
    expect(prompt).toContain('用中文回答');
  });

  it('requires English user-facing responses when the UI is English', () => {
    const prompt = buildAgentSystemPrompt(config, false, 'en-US');
    expect(prompt).toContain('Use English for all user-facing');
    expect(prompt).toContain('Reply in English');
    expect(prompt).toContain('Keep commands, paths, filenames');
  });

  it('tells the agent to embed file paths with Markdown image syntax instead of temp HTTP servers', () => {
    const prompt = buildAgentSystemPrompt(config, false);
    expect(prompt).toContain('![描述](路径)');
    expect(prompt).toContain('临时 HTTP 服务');
    expect(prompt).toContain('base64');
  });
});

describe('lightweight workflow execution mode', () => {
  const config = normalizeAgentRuntimeConfig({});
  const workflowRun = {
    workflowId: 'wf-1', runId: 'run-1',
    runDir: '/home/u/hpclaw_flows/w/03_workspace/runs/run-1',
    policy: 'isolated-run-v1' as const,
  };

  it('uses DeepSeek chat instead of a reasoning model for saved workflow steps', () => {
    expect(workflowExecutionProfile({
      provider: 'deepseek', model: 'deepseek-reasoner', apiKey: 'x',
    }).model).toBe('deepseek-chat');
    expect(workflowExecutionProfile({
      provider: 'openai', model: 'gpt-4o', apiKey: 'x',
    }).model).toBe('gpt-4o');
  });

  it('drops the numeric command cap for workflows but keeps the model-step guard', () => {
    // 正式流程不再压缩命令数上限（数值上限曾让模型自行宣布"额度用完"中途暂停）；
    // 死循环防护交给同命令重复/连续失败/无进展停滞判定，模型步数上限仅作兜底。
    expect(workflowRuntimeConfig(normalizeAgentRuntimeConfig({ maxCommands: 200, maxSteps: 500 })))
      .toMatchObject({ maxCommands: 200, maxSteps: 200 });
    expect(workflowRuntimeConfig(normalizeAgentRuntimeConfig({ maxCommands: 6, maxSteps: 20 })))
      .toMatchObject({ maxCommands: 6, maxSteps: 20 });
  });

  it('builds a compact current-step executor prompt instead of a second plan', () => {
    const prompt = buildWorkflowExecutorPrompt(config, workflowRun, {
      ...workflowRun, status: 'running', currentStep: 2, totalSteps: 5,
      steps: [{ n: 2, title: '比对', status: 'running', scriptPath: `${workflowRun.runDir}/code/step-02.sh` }],
    });
    expect(prompt).toContain('deterministic workflow executor');
    expect(prompt).toContain('step-02.sh');
    expect(prompt).toContain('never recreate the plan');
    expect(prompt.length).toBeLessThan(5_000);
  });
});

describe('runAgent ask_user handling', () => {
  it('finishes the turn as an ask when ask_user is called without provider aborting the stream', async () => {
    mockStreamText.mockImplementation((options: any) => ({
      fullStream: (async function* () {
        await options.tools.ask_user.execute({ question: '是否重新提交这个作业？' });
      })(),
    }));

    const asks: string[] = [];
    const askOptions: string[][] = [];
    const dones: string[] = [];

    await runAgent(
      {
        sid: 'session-1',
        run: vi.fn(),
        profile: {
          provider: 'deepseek',
          model: 'deepseek-chat',
          apiKey: 'test-key',
        },
      },
      {
        onText: vi.fn(),
        onReason: vi.fn(),
        onToolCall: vi.fn(),
        onToolResult: vi.fn(),
        onStep: vi.fn(),
        onAsk: (question, options) => {
          asks.push(question);
          askOptions.push(options || []);
        },
        onDone: (text) => dones.push(text),
        onErr: vi.fn(),
        sig: () => undefined,
      },
      [{ role: 'user', content: '帮我检查任务状态' }],
    );

    expect(asks).toEqual(['是否重新提交这个作业？']);
    expect(askOptions).toEqual([['是，继续', '否，先不做', '先暂停任务']]);
    expect(dones).toEqual(['__ASK__']);
  });

  it('stops after repeated command timeouts instead of continuing the agent loop', async () => {
    mockStreamText.mockImplementation((options: any) => ({
      fullStream: (async function* () {
        for (let i = 0; i < 5; i++) {
          await options.tools.run_command.execute({ command: `zcat huge_${i}.fq.gz | wc -l` });
          if (options.abortSignal.aborted) return;
        }
        yield { type: 'text-delta', text: 'kept going after repeated failures' };
      })(),
    }));

    const dones: string[] = [];
    const errors: string[] = [];
    const toolResults: string[] = [];

    await runAgent(
      {
        sid: 'session-1',
        run: vi.fn().mockRejectedValue(new Error('Command execution timed out')),
        profile: {
          provider: 'deepseek',
          model: 'deepseek-chat',
          apiKey: 'test-key',
        },
      },
      {
        onText: vi.fn(),
        onReason: vi.fn(),
        onToolCall: vi.fn(),
        onToolResult: (_name, result) => toolResults.push(result),
        onStep: vi.fn(),
        onAsk: vi.fn(),
        onDone: (text) => dones.push(text),
        onErr: (err) => errors.push(err),
        sig: () => undefined,
      },
      [{ role: 'user', content: '统计一批 ATAC fastq 的 reads 数' }],
    );

    expect(errors).toEqual([]);
    expect(toolResults.at(-1)).toContain('连续 5 次命令失败，已暂停以防空转');
    expect(dones).toEqual([expect.stringContaining('连续 5 次命令失败，已暂停以防空转')]);
  });

  it('stops before running the same command for a third time', async () => {
    mockStreamText.mockImplementation((options: any) => ({
      fullStream: (async function* () {
        for (let i = 0; i < 3; i++) {
          await options.tools.run_command.execute({ command: 'date; hostname' });
          if (options.abortSignal.aborted) return;
        }
      })(),
    }));

    const run = vi.fn().mockResolvedValue('ok');
    const dones: string[] = [];

    await runAgent(
      {
        sid: 'session-1',
        run,
        profile: {
          provider: 'deepseek',
          model: 'deepseek-chat',
          apiKey: 'test-key',
        },
      },
      {
        onText: vi.fn(),
        onReason: vi.fn(),
        onToolCall: vi.fn(),
        onToolResult: vi.fn(),
        onStep: vi.fn(),
        onAsk: vi.fn(),
        onDone: (text) => dones.push(text),
        onErr: vi.fn(),
        sig: () => undefined,
      },
      [{ role: 'user', content: '检查集群状态' }],
    );

    expect(run).toHaveBeenCalledTimes(2);
    expect(dones).toEqual([expect.stringContaining('Agent stopped after repeating the same command')]);
  });

  it('requires a verified plan before changing cluster state', async () => {
    const toolResults: string[] = [];
    mockStreamText.mockImplementation((options: any) => ({
      fullStream: (async function* () {
        await options.tools.run_command.execute({ command: 'echo report > report.txt' });
        await options.tools.set_plan.execute({
          goal: '生成报告',
          steps: [{ title: '写入报告', verification: '检查 report.txt 内容' }],
        });
        await options.tools.update_plan_step.execute({ id: '1', status: 'running' });
        await options.tools.run_command.execute({ command: 'echo report > report.txt' });
      })(),
    }));
    const run = vi.fn().mockResolvedValue('ok');

    await runAgent(
      {
        sid: 'session-1',
        run,
        profile: { provider: 'deepseek', model: 'deepseek-chat', apiKey: 'test-key' },
      },
      {
        onText: vi.fn(), onReason: vi.fn(), onToolCall: vi.fn(), onStep: vi.fn(), onAsk: vi.fn(), onDone: vi.fn(), onErr: vi.fn(),
        onToolResult: (_name, result) => toolResults.push(result),
        sig: () => undefined,
      },
      [{ role: 'user', content: '生成报告' }],
    );

    expect(toolResults[0]).toContain('requires set_plan');
    expect(run).toHaveBeenCalledTimes(1);
  });

  it('binds a formal workflow to its RUN directory and blocks state-changing unauthorized scans without a duplicate plan', async () => {
    const runDir = '/public/home/u/hpclaw_flows/rna/03_workspace/runs/run-1';
    let authoritativeRun: any = {
      runId: 'run-1', workflowId: 'wf-rna', workflowName: 'RNA', workflowVersion: 1,
      runDir, workspacePolicy: 'isolated-run-v1', status: 'running', startedAt: 1,
      updatedAt: 1, heartbeatAt: 1, currentStep: 1, totalSteps: 1,
      config: {
        inputs: ['/public/home/u/data/fastq'], params: {}, stepParams: {},
        referenceOverrides: {}, skippedSteps: [], stepCommandOverrides: {},
      },
      steps: [{ n: 1, stepId: 'step-01', title: 'QC', status: 'running' }],
    };
    mockStreamText.mockImplementation((options: any) => ({
      fullStream: (async function* () {
        await options.tools.get_workflow_run.execute({ runDir });
        // 只读的环境探查：新语义下允许（不拦截）
        await options.tools.run_command.execute({ command: 'ls /public/home/u/.local/share/mamba/envs | head' });
        // 改变状态的未授权遍历：仍应被拦截
        await options.tools.run_command.execute({ command: 'ls /public/home/u > results/homescan.txt' });
        await options.tools.run_command.execute({ command: 'echo ok > results/status.txt' });
        await options.tools.update_workflow_run.execute({ runDir, status: 'waiting_user', error: '测试已暂停' });
      })(),
    }));
    const clusterRun = vi.fn(async (_sid: string, command: string) => {
      if (command.startsWith(`cat '${runDir}/run.json'`)) return JSON.stringify(authoritativeRun);
      const encoded = command.match(/printf %s '([^']+)' \| base64 -d/)?.[1];
      if (encoded) {
        authoritativeRun = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));
        return '';
      }
      return 'ok';
    });
    const results: string[] = [];

    await runAgent(
      {
        sid: 'session-1', home: '/public/home/u', run: clusterRun,
        workflowRun: { workflowId: 'wf-rna', runId: 'run-1', runDir, policy: 'isolated-run-v1' },
        profile: { provider: 'deepseek', model: 'deepseek-chat', apiKey: 'test-key' },
      },
      {
        onText: vi.fn(), onReason: vi.fn(), onToolCall: vi.fn(), onStep: vi.fn(), onAsk: vi.fn(), onDone: vi.fn(), onErr: vi.fn(),
        onToolResult: (_name, result) => results.push(result),
        sig: () => undefined,
      },
      [{ role: 'user', content: '运行正式流程' }],
    );

    // 只读探查实际执行了（固定在 RUN 目录包装后发出）
    expect(clusterRun.mock.calls.map(call => call[1]))
      .toContain(`cd '${runDir}' && ls /public/home/u/.local/share/mamba/envs | head`);
    // 写向重定向的未授权扫描被拦截
    expect(results).toContainEqual(expect.stringContaining('Workflow command blocked'));
    expect(clusterRun.mock.calls.map(call => call[1]))
      .toContain(`cd '${runDir}' && echo ok > results/status.txt`);
    expect(clusterRun.mock.calls.map(call => call[1]).join('\n')).not.toContain(`ls /public/home/u > results/homescan.txt`);
    expect(mockStreamText.mock.calls[0][0].system).toContain('not a workflow planner');
    expect(Object.keys(mockStreamText.mock.calls[0][0].tools)).not.toContain('set_plan');
  });

  it('keeps a formal workflow in the same request when the model tries to finish early', async () => {
    const runDir = '/public/home/u/hpclaw_flows/troubleshoot/03_workspace/runs/run-early';
    let authoritativeRun: any = {
      runId: 'run-early', workflowId: 'wf-troubleshoot', workflowName: '排查', workflowVersion: 1,
      runDir, workspacePolicy: 'isolated-run-v1', status: 'running', startedAt: 1,
      updatedAt: 1, heartbeatAt: 1, currentStep: 1, totalSteps: 1,
      config: { inputs: [], params: {}, stepParams: {}, referenceOverrides: {}, skippedSteps: [], stepCommandOverrides: {} },
      steps: [{ n: 1, stepId: 'step-01', title: '检查状态', status: 'running' }],
    };
    let round = 0;
    mockStreamText.mockImplementation((options: any) => {
      const currentRound = round++;
      return {
        fullStream: (async function* () {
          await options.tools.get_workflow_run.execute({ runDir });
          if (currentRound === 0) {
            await options.tools.run_command.execute({ command: 'printf status-ok > results/status.txt' });
            yield { type: 'text-delta', text: '我先汇报到这里，下一步再继续。' };
            return;
          }
          await options.tools.update_workflow_run.execute({
            runDir,
            status: 'done',
            step: { n: 1, status: 'done', summary: 'status-ok 已写入并验证' },
          });
          yield { type: 'text-delta', text: '流程已经完成。' };
        })(),
      };
    });

    const clusterRun = vi.fn(async (_sid: string, command: string) => {
      if (command.startsWith(`cat '${runDir}/run.json'`)) return JSON.stringify(authoritativeRun);
      const encoded = command.match(/printf %s '([^']+)' \| base64 -d/)?.[1];
      if (encoded) {
        authoritativeRun = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));
        return '';
      }
      return 'status-ok';
    });
    const visibleText: string[] = [];
    const dones: string[] = [];

    await runAgent(
      {
        sid: 'session-1', home: '/public/home/u', run: clusterRun,
        workflowRun: { workflowId: 'wf-troubleshoot', runId: 'run-early', runDir, policy: 'isolated-run-v1' },
        profile: { provider: 'deepseek', model: 'deepseek-chat', apiKey: 'test-key' },
      },
      {
        onText: text => visibleText.push(text), onReason: vi.fn(), onToolCall: vi.fn(), onToolResult: vi.fn(),
        onStep: vi.fn(), onAsk: vi.fn(), onDone: text => dones.push(text), onErr: vi.fn(), sig: () => undefined,
      },
      [{ role: 'user', content: '运行正式排查流程' }],
    );

    expect(mockStreamText).toHaveBeenCalledTimes(2);
    expect(mockStreamText.mock.calls[1][0].messages.at(-1).content).toContain('服务端自动续跑校验');
    expect(visibleText.join('')).toBe('流程已经完成。');
    expect(visibleText.join('')).not.toContain('下一步再继续');
    expect(dones).toEqual(['流程已经完成。']);
    expect(authoritativeRun.status).toBe('done');
  });

  it('reports a real external cancellation instead of an ask sentinel', async () => {
    const controller = new AbortController();
    mockStreamText.mockImplementation((options: any) => ({
      fullStream: (async function* () {
        await new Promise<void>(resolve => options.abortSignal.addEventListener('abort', () => resolve(), { once: true }));
        throw new Error('aborted');
        yield { type: 'text-delta', text: 'unreachable' };
      })(),
    }));
    const dones: string[] = [];
    const promise = runAgent(
      {
        sid: 'session-1',
        run: vi.fn(),
        profile: { provider: 'deepseek', model: 'deepseek-chat', apiKey: 'test-key' },
      },
      {
        onText: vi.fn(), onReason: vi.fn(), onToolCall: vi.fn(), onToolResult: vi.fn(), onStep: vi.fn(), onAsk: vi.fn(), onErr: vi.fn(),
        onDone: text => dones.push(text),
        sig: () => controller.signal,
      },
      [{ role: 'user', content: '检查集群' }],
    );
    controller.abort();
    await promise;
    expect(dones).toEqual(['__CANCELLED__']);
  });

  it('hands a submitted batch job to the watcher and ends the Agent turn immediately', async () => {
    mockStreamText.mockImplementation((options: any) => ({
      fullStream: (async function* () {
        await options.tools.set_plan.execute({
          goal: '提交比对作业',
          steps: [{ title: '运行比对', verification: '检查调度器状态和 BAM' }],
        });
        await options.tools.update_plan_step.execute({ id: '1', status: 'running' });
        await options.tools.run_command.execute({ command: 'bsub -q normal "hisat2 -x ref -U reads.fq"' });
        // 模拟真实供应商忽略 AbortSignal、iterator.next() 永不收尾。
        // runAgent 仍必须在作业交接后立即返回。
        await new Promise<void>(() => {});
        yield { type: 'text-delta', text: '不应继续循环查询' };
      })(),
    }));
    const dones: string[] = [];
    const planStatuses: string[] = [];
    const run = vi.fn().mockResolvedValue('Job <12345> is submitted to queue <normal>.');

    await runAgent(
      {
        sid: 'session-1',
        run,
        profile: { provider: 'deepseek', model: 'deepseek-chat', apiKey: 'test-key' },
      },
      {
        onText: vi.fn(), onReason: vi.fn(), onToolCall: vi.fn(), onToolResult: vi.fn(), onStep: vi.fn(), onAsk: vi.fn(), onErr: vi.fn(),
        onPlanUpdate: (plan) => planStatuses.push(plan.steps[0].status),
        onDone: text => dones.push(text),
        sig: () => undefined,
      },
      [{ role: 'user', content: '提交比对流程' }],
    );

    expect(run).toHaveBeenCalledTimes(1);
    expect(planStatuses).toContain('waiting');
    expect(dones).toEqual([expect.stringContaining('已交给后台监控')]);
    expect(dones[0]).not.toContain('不应继续循环查询');
  });

  it('does not treat an LSF not-found query as a newly submitted job', async () => {
    mockStreamText.mockImplementation((options: any) => ({
      fullStream: (async function* () {
        await options.tools.set_plan.execute({
          goal: '查询作业',
          steps: [{ title: '查询', verification: '读取 bjobs 输出' }],
        });
        await options.tools.update_plan_step.execute({ id: '1', status: 'running' });
        await options.tools.run_command.execute({ command: 'bjobs -l 12345' });
        yield { type: 'text-delta', text: '该作业不存在。' };
      })(),
    }));
    const toolResults: string[] = [];
    const dones: string[] = [];

    await runAgent(
      {
        sid: 'session-1',
        run: vi.fn().mockResolvedValue('Job <12345> is not found'),
        profile: { provider: 'deepseek', model: 'deepseek-chat', apiKey: 'test-key' },
      },
      {
        onText: vi.fn(), onReason: vi.fn(), onToolCall: vi.fn(), onStep: vi.fn(), onAsk: vi.fn(), onErr: vi.fn(),
        onToolResult: (_name, result) => toolResults.push(result),
        onDone: text => dones.push(text), sig: () => undefined,
      },
      [{ role: 'user', content: '查询 12345' }],
    );

    expect(toolResults.join('\n')).not.toContain('[JOB_SUBMITTED]');
    expect(dones).toEqual([expect.stringContaining('该作业不存在')]);
  });
});

describe('formal workflow command budget', () => {
  const runDir = '/public/home/u/hpclaw_flows/rna/03_workspace/runs/run-budget';

  function setup(rounds: (round: number, options: any) => AsyncGenerator<unknown, void, unknown>) {
    let authoritativeRun: any = {
      runId: 'run-budget', workflowId: 'wf-rna', workflowName: 'RNA', workflowVersion: 1,
      runDir, workspacePolicy: 'isolated-run-v1', status: 'running', startedAt: 1,
      updatedAt: 1, heartbeatAt: 1, currentStep: 1, totalSteps: 1,
      config: { inputs: [], params: {}, stepParams: {}, referenceOverrides: {}, skippedSteps: [], stepCommandOverrides: {} },
      steps: [{ n: 1, stepId: 'step-01', title: '执行', status: 'running' }],
    };
    let round = 0;
    mockStreamText.mockImplementation((options: any) => {
      const currentRound = round++;
      return { fullStream: (async function* () { yield* rounds(currentRound, options); })() };
    });
    const clusterRun = vi.fn(async (_sid: string, command: string) => {
      if (command.startsWith(`cat '${runDir}/run.json'`)) return JSON.stringify(authoritativeRun);
      const encoded = command.match(/printf %s '([^']+)' \| base64 -d/)?.[1];
      if (encoded) {
        authoritativeRun = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));
        return '';
      }
      return 'ok';
    });
    const toolResults: string[] = [];
    const dones: string[] = [];
    const errors: string[] = [];
    const start = () => runAgent(
      {
        sid: 'session-1', home: '/public/home/u', run: clusterRun,
        workflowRun: { workflowId: 'wf-rna', runId: 'run-budget', runDir, policy: 'isolated-run-v1' },
        profile: { provider: 'deepseek', model: 'deepseek-chat', apiKey: 'test-key' },
      },
      {
        onText: vi.fn(), onReason: vi.fn(), onToolCall: vi.fn(),
        onToolResult: (_name, result) => toolResults.push(result),
        onStep: vi.fn(), onAsk: vi.fn(),
        onDone: text => dones.push(text),
        onErr: err => errors.push(err),
        sig: () => undefined,
      },
      [{ role: 'user', content: '运行正式流程' }],
    );
    const workflowCommands = () => clusterRun.mock.calls.map(call => call[1])
      .filter((command: string) => command.startsWith(`cd '${runDir}'`));
    return { clusterRun, toolResults, dones, errors, start, workflowCommands, getRun: () => authoritativeRun };
  }

  it('resets the per-round command budget across auto-continuations', async () => {
    const env = setup(async function* (round, options) {
      if (round === 0) {
        // 第一轮打满 12 条命令预算但不停（第 13 条才会触发）。
        for (let i = 0; i < 12; i++) {
          await options.tools.run_command.execute({ command: `printf ok > results/f${i}.txt` });
        }
        yield { type: 'text-delta', text: '第一轮先汇报到这里。' };
        return;
      }
      // 续跑第二轮预算重置，仍能继续执行命令。
      for (let i = 12; i < 15; i++) {
        await options.tools.run_command.execute({ command: `printf ok > results/f${i}.txt` });
      }
      await options.tools.update_workflow_run.execute({
        runDir, status: 'done',
        step: { n: 1, status: 'done', summary: '全部产物已写入并验证' },
      });
      yield { type: 'text-delta', text: '流程已经完成。' };
    });

    await env.start();

    expect(mockStreamText).toHaveBeenCalledTimes(2);
    expect(mockStreamText.mock.calls[1][0].messages.at(-1).content).toContain('服务端自动续跑校验');
    expect(env.workflowCommands()).toHaveLength(15);
    expect(env.toolResults.join('\n')).not.toContain('safety budget');
    expect(env.errors).toEqual([]);
    expect(env.dones).toEqual(['流程已经完成。']);
    expect(env.getRun().status).toBe('done');
  });

  it('pauses with the existing semantics after the eighth continuation while allowing over 12 commands in total', async () => {
    const env = setup(async function* (round, options) {
      for (let i = 0; i < 4; i++) {
        await options.tools.run_command.execute({ command: `cat results/part-${round}-${i}.txt` });
      }
      yield { type: 'text-delta', text: `第 ${round + 1} 轮先到这里。` };
    });

    await env.start();

    // 初始轮 + 8 次续跑；累计 36 条命令证明没有数值命令上限（只读命令也照常执行）。
    expect(mockStreamText).toHaveBeenCalledTimes(9);
    expect(env.workflowCommands()).toHaveLength(36);
    expect(env.toolResults.join('\n')).not.toContain('safety budget');
    expect(env.errors).toEqual([]);
    expect(env.getRun().status).toBe('waiting_user');
    expect(env.dones).toHaveLength(1);
    expect(env.dones[0]).toContain('本轮安全上限');
    expect(env.dones[0]).toContain('续跑 8 次');
  });

  it('pauses via the stagnation detector when two rounds produce no commands and no run progress', async () => {
    // 模型每轮只说"继续中"但不执行任何命令、run.json 也不推进 → 死循环判定暂停
    const env = setup(async function* (_round, _options) {
      yield { type: 'text-delta', text: '还在继续处理中。' };
    });

    await env.start();

    expect(env.errors).toEqual([]);
    expect(env.getRun().status).toBe('waiting_user');
    expect(env.dones).toHaveLength(1);
    expect(env.dones[0]).toContain('没有新进展');
    expect(env.dones[0]).toContain('死循环保护');
    // 初始轮 + 2 轮停滞即暂停,不会跑到 8 次续跑上限
    expect(mockStreamText.mock.calls.length).toBeLessThanOrEqual(4);
  });

  it('keeps the cross-round anti-loop guards global while the budget resets', async () => {
    const env = setup(async function* (round, options) {
      if (round === 0) {
        await options.tools.run_command.execute({ command: 'printf stamp > results/stamp.txt' });
        await options.tools.run_command.execute({ command: 'cat results/stamp.txt' });
        await options.tools.run_command.execute({ command: 'cat results/stamp.txt' });
        yield { type: 'text-delta', text: '第一轮先到这里。' };
        return;
      }
      // 跨轮仍命中“已成功变更不重复执行”。
      await options.tools.run_command.execute({ command: 'printf stamp > results/stamp.txt' });
      // 跨轮仍命中“同命令重复”全局防护。
      await options.tools.run_command.execute({ command: 'cat results/stamp.txt' });
      if (options.abortSignal.aborted) return;
      yield { type: 'text-delta', text: '不应到达。' };
    });

    await env.start();

    expect(mockStreamText).toHaveBeenCalledTimes(2);
    expect(env.toolResults.join('\n')).toContain('already succeeded during the current Agent turn');
    expect(env.dones).toEqual([expect.stringContaining('Agent stopped after repeating the same command')]);
    expect(env.dones[0]).not.toContain('safety budget');
    const stampWrites = env.clusterRun.mock.calls.map(call => call[1])
      .filter((command: string) => command.includes('printf stamp'));
    expect(stampWrites).toHaveLength(1);
  });
});

describe('web API tools (search_web_apis / call_web_api)', () => {
  const ctx = {
    sid: 'session-1',
    run: vi.fn(),
    profile: { provider: 'deepseek', model: 'deepseek-chat', apiKey: 'test-key' },
  } as const;
  const cbs = (toolResults: string[]) => ({
    onText: vi.fn(),
    onReason: vi.fn(),
    onToolCall: vi.fn(),
    onToolResult: (_name: string, result: string) => toolResults.push(result),
    onStep: vi.fn(),
    onAsk: vi.fn(),
    onDone: vi.fn(),
    onErr: vi.fn(),
    sig: () => undefined,
  });

  beforeEach(() => {
    mockInvokeWebApi.mockReset();
    mockSearchWebApis.mockReset();
  });

  it('documents the public data APIs in the system prompt', () => {
    const prompt = buildAgentSystemPrompt(normalizeAgentRuntimeConfig({}), false);
    expect(prompt).toContain('search_web_apis');
    expect(prompt).toContain('call_web_api');
    expect(prompt).toContain('PUBLIC DATA APIS');
    expect(prompt).toContain('标注来源');
  });

  it('documents task sizing so simple lookups skip plan and verification ceremony', () => {
    const prompt = buildAgentSystemPrompt(normalizeAgentRuntimeConfig({}), false);
    expect(prompt).toContain('TASK SIZING');
    expect(prompt).toContain('禁止 set_plan');
    expect(prompt).toContain('禁止写校验脚本');
    const localZh = buildLocalWorkspacePromptSection('D:\\ws', 'zh-CN');
    expect(localZh).toContain('任务分级');
    expect(localZh).toContain('不要写校验脚本');
    const localEn = buildLocalWorkspacePromptSection('D:\\ws', 'en-US');
    expect(localEn).toContain('Task sizing');
  });

  it('documents agent discipline: observe-adapt, error recovery, pre-answer self-check', () => {
    const prompt = buildAgentSystemPrompt(normalizeAgentRuntimeConfig({}), false);
    expect(prompt).toContain('AGENT DISCIPLINE');
    expect(prompt).toContain('观察-调整');
    expect(prompt).toContain('失败恢复');
    expect(prompt).toContain('完成前自检');
    expect(prompt).toContain('上下文复用');
  });

  it('registers both tools for the general agent alongside the existing ones', async () => {
    let capturedTools: any;
    mockStreamText.mockImplementation((options: any) => {
      capturedTools = options.tools;
      return { fullStream: (async function* () { /* no stream parts */ })() };
    });
    await runAgent(ctx as any, cbs([]) as any, [{ role: 'user', content: '查一下 BRCA1 的 UniProt 条目' }]);
    expect(capturedTools.search_web_apis).toBeTruthy();
    expect(capturedTools.call_web_api).toBeTruthy();
    expect(capturedTools.run_command).toBeTruthy();
    expect(capturedTools.search_web).toBeTruthy();
  });

  it('search_web_apis returns formatted service summaries', async () => {
    mockSearchWebApis.mockReturnValue({
      query: 'uniprot',
      total: 1,
      services: [{
        id: 'uniprot',
        name: 'UniProtKB REST',
        category: 'proteins',
        categoryLabel: { zh: '蛋白与结构', en: 'Proteins' },
        description: 'UniProt 蛋白知识库',
        homepage: 'https://www.uniprot.org/',
        docsUrl: 'https://www.uniprot.org/help/programmatic_access',
        endpoints: [{ id: 'entry', name: '按登录号取条目', method: 'GET', path: '/uniprotkb/{accession}', description: '按 UniProt 登录号取完整蛋白条目' }],
      }],
    });
    let payload = '';
    mockStreamText.mockImplementation((options: any) => ({
      fullStream: (async function* () {
        payload = await options.tools.search_web_apis.execute({ query: 'uniprot' });
      })(),
    }));
    await runAgent(ctx as any, cbs([]) as any, [{ role: 'user', content: 'x' }]);
    expect(mockSearchWebApis).toHaveBeenCalledWith('uniprot', undefined);
    expect(payload).toContain('uniprot');
    expect(payload).toContain('entry[GET /uniprotkb/{accession}]');
  });

  it('call_web_api chains into invokeWebApi and clips large payloads', async () => {
    mockInvokeWebApi.mockResolvedValue({
      ok: true,
      service: 'uniprot',
      endpoint: 'entry',
      url: 'https://rest.uniprot.org/uniprotkb/P69905',
      status: 200,
      durationMs: 12,
      contentType: 'application/json',
      truncated: false,
      data: { accession: 'P69905' },
    });
    let payload = '';
    mockStreamText.mockImplementation((options: any) => ({
      fullStream: (async function* () {
        payload = await options.tools.call_web_api.execute({
          service: 'uniprot', endpoint: 'entry', params: { accession: 'P69905' },
        });
      })(),
    }));
    await runAgent(ctx as any, cbs([]) as any, [{ role: 'user', content: 'x' }]);
    expect(mockInvokeWebApi).toHaveBeenCalledWith('uniprot', 'entry', { accession: 'P69905' });
    expect(payload).toContain('P69905');
    expect(payload).toContain('"status":200');
  });

  it('call_web_api surfaces invoke errors as plain messages', async () => {
    mockInvokeWebApi.mockResolvedValue({
      ok: false,
      error: { code: 'http_client_error', message: '上游返回 4xx：HTTP 400' },
    });
    const toolResults: string[] = [];
    mockStreamText.mockImplementation((options: any) => ({
      fullStream: (async function* () {
        await options.tools.call_web_api.execute({ service: 'uniprot', endpoint: 'entry', params: {} });
      })(),
    }));
    await runAgent(ctx as any, cbs(toolResults) as any, [{ role: 'user', content: 'x' }]);
    expect(toolResults.at(-1)).toContain('数据服务调用失败（http_client_error）');
  });

  it('search_web_apis output includes per-endpoint param names so the model does not guess', async () => {
    mockSearchWebApis.mockReturnValue({
      query: 'uniprot',
      total: 1,
      services: [{
        id: 'uniprot',
        name: 'UniProtKB REST',
        category: 'proteins',
        categoryLabel: { zh: '蛋白与结构', en: 'Proteins' },
        description: 'UniProt 蛋白知识库',
        homepage: 'https://www.uniprot.org/',
        docsUrl: 'https://www.uniprot.org/help/programmatic_access',
        endpoints: [{
          id: 'search', name: '蛋白检索', method: 'GET', path: '/uniprotkb/search', description: '按查询语法检索',
          params: [{ name: 'query', required: true, description: '查询式' }, { name: 'size', description: '条数' }],
        }],
      }],
    });
    let payload = '';
    mockStreamText.mockImplementation((options: any) => ({
      fullStream: (async function* () {
        payload = await options.tools.search_web_apis.execute({ query: 'uniprot' });
      })(),
    }));
    await runAgent(ctx as any, cbs([]) as any, [{ role: 'user', content: 'x' }]);
    expect(payload).toContain('参数: query（必填）、size');
    expect(payload).toContain('不要猜参数名');
  });

  it('identical call_web_api invocations in one turn hit the cache instead of re-calling', async () => {
    mockInvokeWebApi.mockResolvedValue({
      ok: true, service: 'uniprot', endpoint: 'entry', url: 'https://rest.uniprot.org/uniprotkb/P69905',
      status: 200, durationMs: 12, contentType: 'application/json', truncated: false, data: { accession: 'P69905' },
    });
    let first = '';
    let second = '';
    mockStreamText.mockImplementation((options: any) => ({
      fullStream: (async function* () {
        first = await options.tools.call_web_api.execute({ service: 'uniprot', endpoint: 'entry', params: { accession: 'P69905' } });
        second = await options.tools.call_web_api.execute({ service: 'uniprot', endpoint: 'entry', params: { accession: 'P69905' } });
      })(),
    }));
    await runAgent(ctx as any, cbs([]) as any, [{ role: 'user', content: 'x' }]);
    expect(mockInvokeWebApi).toHaveBeenCalledTimes(1);
    expect(second).toContain('缓存复用');
    expect(second).toContain('P69905');
  });

  it('search_web_apis identical queries in one turn hit the cache', async () => {
    mockSearchWebApis.mockReturnValue({ query: 'uniprot', total: 0, services: [] });
    mockStreamText.mockImplementation((options: any) => ({
      fullStream: (async function* () {
        await options.tools.search_web_apis.execute({ query: 'uniprot' });
        await options.tools.search_web_apis.execute({ query: 'uniprot' });
      })(),
    }));
    await runAgent(ctx as any, cbs([]) as any, [{ role: 'user', content: 'x' }]);
    expect(mockSearchWebApis).toHaveBeenCalledTimes(1);
  });
});

describe('local mode (no cluster session)', () => {
  let tmpWorkspace = '';

  beforeEach(() => {
    tmpWorkspace = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'hpclaw-agent-local-')));
  });

  afterEach(() => {
    if (tmpWorkspace) fs.rmSync(tmpWorkspace, { recursive: true, force: true });
    tmpWorkspace = '';
  });

  const localCtx = (workspace?: string, confirmCommand?: ReturnType<typeof vi.fn>) => ({
    sid: 'local-workspace',
    run: vi.fn(),
    profile: { provider: 'deepseek', model: 'deepseek-chat', apiKey: 'test-key' },
    localOnly: true,
    workspace,
    confirmCommand,
  });

  const localCbs = (toolResults: string[]) => ({
    onText: vi.fn(),
    onReason: vi.fn(),
    onToolCall: vi.fn(),
    onToolResult: (_name: string, result: string) => toolResults.push(result),
    onStep: vi.fn(),
    onAsk: vi.fn(),
    onDone: vi.fn(),
    onErr: vi.fn(),
    sig: () => undefined,
  });

  it('exposes the local workspace toolset instead of cluster tools and documents the constraints', async () => {
    let capturedTools: any;
    let capturedSystem = '';
    mockStreamText.mockImplementation((options: any) => {
      capturedTools = options.tools;
      capturedSystem = options.system;
      return { fullStream: (async function* () { /* no stream parts */ })() };
    });

    await runAgent(localCtx(tmpWorkspace) as any, localCbs([]) as any, [{ role: 'user', content: '分析我的本地文件' }]);

    expect(Object.keys(capturedTools).sort()).toEqual([
      'ask_user',
      'call_web_api',
      'list_local_files',
      'read_local_file',
      'reset_plan',
      'run_local_command',
      'search_skills',
      'search_web_apis',
      'set_plan',
      'update_plan_step',
      'write_local_file',
    ]);
    // 集群工具一律不可用
    expect(capturedTools.run_command).toBeUndefined();
    expect(capturedTools.get_workflow_run).toBeUndefined();
    expect(capturedTools.save_skill).toBeUndefined();
    // 系统提示含本地工作区约束段与真实工作区路径
    expect(capturedSystem).toContain('LOCAL MODE');
    expect(capturedSystem).toContain(tmpWorkspace);
    expect(capturedSystem).toContain('只能新建文件');
    expect(capturedSystem).toContain('write_local_file');
  });

  it('write_local_file creates a new file, then refuses to overwrite it', async () => {
    const toolResults: string[] = [];
    mockStreamText.mockImplementation((options: any) => ({
      fullStream: (async function* () {
        const first = await options.tools.write_local_file.execute({ path: 'result.txt', content: 'alpha' });
        expect(first).toContain('已新建本地文件');
        const second = await options.tools.write_local_file.execute({ path: 'result.txt', content: 'beta' });
        expect(second).toContain('文件已存在，不允许覆盖');
      })(),
    }));

    await runAgent(localCtx(tmpWorkspace) as any, localCbs(toolResults) as any, [{ role: 'user', content: '写入分析结果' }]);

    expect(fs.readFileSync(path.join(tmpWorkspace, 'result.txt'), 'utf8')).toBe('alpha');
    expect(toolResults.some(result => result.includes('文件已存在，不允许覆盖'))).toBe(true);
  });

  it('write_local_file rejects escape paths outside the workspace', async () => {
    mockStreamText.mockImplementation((options: any) => ({
      fullStream: (async function* () {
        const escaped = await options.tools.write_local_file.execute({ path: '../evil.txt', content: 'x' });
        expect(escaped).toContain('路径不允许包含 ..');
      })(),
    }));

    await runAgent(localCtx(tmpWorkspace) as any, localCbs([]) as any, [{ role: 'user', content: 'x' }]);

    expect(fs.existsSync(path.join(tmpWorkspace, '..', 'evil.txt'))).toBe(false);
  });

  it('every local tool returns the workspace-required guidance when no workspace is set', async () => {
    mockStreamText.mockImplementation((options: any) => ({
      fullStream: (async function* () {
        expect(await options.tools.list_local_files.execute({})).toBe(LOCAL_WORKSPACE_NOT_SET_MESSAGE);
        expect(await options.tools.read_local_file.execute({ path: 'a.txt' })).toBe(LOCAL_WORKSPACE_NOT_SET_MESSAGE);
        expect(await options.tools.write_local_file.execute({ path: 'a.txt', content: 'x' })).toBe(LOCAL_WORKSPACE_NOT_SET_MESSAGE);
        expect(await options.tools.run_local_command.execute({ command: 'dir' })).toBe(LOCAL_WORKSPACE_NOT_SET_MESSAGE);
      })(),
    }));

    await runAgent(localCtx(undefined) as any, localCbs([]) as any, [{ role: 'user', content: '看看本地文件' }]);
  });

  it('run_local_command executes inside the workspace and reports output', async () => {
    mockStreamText.mockImplementation((options: any) => ({
      fullStream: (async function* () {
        const result = await options.tools.run_local_command.execute({ command: 'node -e "console.log(40+2)"' });
        expect(result).toContain('命令执行成功');
        expect(result).toContain('42');
      })(),
    }));

    await runAgent(localCtx(tmpWorkspace) as any, localCbs([]) as any, [{ role: 'user', content: '算个数' }]);
  });

  it('run_local_command hard-rejects blacklisted commands without asking for confirmation', async () => {
    const confirmCommand = vi.fn();
    mockStreamText.mockImplementation((options: any) => ({
      fullStream: (async function* () {
        const result = await options.tools.run_local_command.execute({ command: 'rm -rf data' });
        expect(result).toContain('黑名单');
      })(),
    }));

    await runAgent(localCtx(tmpWorkspace, confirmCommand) as any, localCbs([]) as any, [{ role: 'user', content: '删掉数据' }]);

    // 黑名单是硬拒绝：不该走到用户确认环节
    expect(confirmCommand).not.toHaveBeenCalled();
  });

  it('buildLocalWorkspacePromptSection renders both locales', () => {
    const zh = buildLocalWorkspacePromptSection('D:\data', 'zh-CN');
    expect(zh).toContain('D:\data');
    expect(zh).toContain('不能覆盖');
    const en = buildLocalWorkspacePromptSection(undefined, 'en-US');
    expect(en).toContain('(not set)');
    expect(en).toContain('only CREATE new files');
  });
});
