import { expect, it } from 'vitest';
import { extractRunDirFromText, parseWorkflowExecutionContext, parseWorkflowRunDetached, parseWorkflowConfigureDirective,
  stripWorkflowExecutionMarkers, formatWorkflowExecutionContext } from './workflowExecution';
import { findLatestAgentPlanCheckpoint, serializeAgentPlanCheckpoint } from './chatPlan';
it('reads legacy chat protocol and real run paths without rewriting evidence; emits only TRACE markers', () => {
  const runDir = '/home/u/hpclaw_flows/rna/03_workspace/runs/r1';
  const legacy = '[HPCLAW_WORKFLOW_RUN] ' + JSON.stringify({ workflowId: 'wf', runId: 'r1', runDir, policy: 'isolated-run-v1' });
  expect(parseWorkflowExecutionContext(legacy)?.runDir).toBe(runDir);
  expect(extractRunDirFromText('状态 ' + runDir)).toBe(runDir);
  expect(stripWorkflowExecutionMarkers(legacy + '\n继续原任务')).toBe('继续原任务');
  expect(formatWorkflowExecutionContext({ workflowId: 'wf', runId: 'r2', runDir: '/home/u/trace_flows/rna/03_workspace/runs/r2' })).toMatch(/^\[TRACE_/);
  expect(parseWorkflowRunDetached('[HPCLAW_WORKFLOW_RUN_DETACHED] ' + JSON.stringify({ runDir }))).toBe(runDir);
  expect(parseWorkflowConfigureDirective('[HPCLAW_WORKFLOW_CONFIGURE] {"workflowId":"wf"}')?.workflowId).toBe('wf');
  const plan = { goal: 'Keep real outputs', steps: [] };
  expect(findLatestAgentPlanCheckpoint([{ content: '[HPCLAW_AGENT_PLAN] ' + JSON.stringify(plan) }])).toEqual(plan);
  expect(serializeAgentPlanCheckpoint(plan)).toMatch(/^\[TRACE_AGENT_PLAN\]/);
});
