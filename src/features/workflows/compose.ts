import type { Workflow } from '@/shared/workflow';
import type { PreflightResult } from '@/shared/flowManifest';
import { formatWorkflowExecutionContext } from '@/shared/workflowExecution';

function preflightLines(preflight: PreflightResult | null | undefined): string[] {
  if (!preflight) {
    return ['环境尚未检查；当前步骤遇到明确缺项时再暂停询问，不扫描其他目录。'];
  }
  if (preflight.ready) {
    return ['环境检查已通过，直接执行，不重复预检。'];
  }
  const missing = [...preflight.software, ...preflight.references]
    .filter(item => item.required && !item.ok)
    .map(item => `${item.name}${item.detail ? `（${item.detail}）` : ''}`);
  return [
    `环境阻断：${missing.join('、') || '必需环境未就绪'}。只询问“补齐 / 改路径 / 停止”，不要搜索替代目录。`,
  ];
}

function executionProtocol(workflow: Workflow, run: { runId: string; runDir: string } | undefined): string[] {
  if (!run) {
    return [
      `使用已保存流程「${workflow.name}」（${workflow.id}）。`,
      '先读取流程的结构化步骤；需要正式执行时使用流程面板创建运行记录，不要把流程重新改写成长计划。',
    ];
  }
  return [
    formatWorkflowExecutionContext({ workflowId: workflow.id, runId: run.runId, runDir: run.runDir }),
    `开始或继续成品流程「${workflow.name}」。`,
    '参数、步骤脚本和进度已经写入 RUN/run.json；按当前未完成步骤执行，不重新规划、不重复已完成步骤。',
  ];
}

export function composeUseMessage(
  workflow: Workflow,
  preflight?: PreflightResult | null,
  run?: { runId: string; runDir: string },
): string {
  return [...executionProtocol(workflow, run), '', ...preflightLines(preflight)].join('\n');
}

export function composeRunMessage(
  workflow: Workflow,
  opts: {
    preflight?: PreflightResult | null;
    inputs: string[];
    paramValues: Record<string, string>;
    stepValues?: Record<number, Record<string, string>>;
    referenceOverrides?: Record<string, string>;
    skippedSteps?: number[];
    stepCommandOverrides?: Record<number, string>;
    run?: { runId: string; runDir: string };
  },
): string {
  const lines = executionProtocol(workflow, opts.run);
  lines.push('');
  lines.push(...preflightLines(opts.preflight));
  return lines.join('\n');
}

export function composeResumeRunMessage(
  workflow: Workflow,
  run: { runId?: string; runDir: string; status: string; currentStep?: number; totalSteps?: number },
): string {
  return [
    formatWorkflowExecutionContext({
      workflowId: workflow.id,
      runId: run.runId || run.runDir.split('/').pop() || 'run',
      runDir: run.runDir,
    }),
    `继续成品流程「${workflow.name}」，当前状态 ${run.status}，进度 ${run.currentStep ?? 0}/${run.totalSteps ?? workflow.steps.length}。`,
    '先读取服务端运行记录和当前步骤证据；跳过已完成步骤，从第一个未完成或失败步骤继续。',
    '如果正在等待用户决策，只展示必要信息和 2–4 个明确选项；如果有后台作业，交给监控器，不重复提交。',
  ].join('\n');
}
