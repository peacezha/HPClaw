import { describe, expect, it } from 'vitest';
import {
  findLatestWorkflowExecutionContext,
  formatWorkflowConfigureDirective,
  formatWorkflowExecutionContext,
  normalizeWorkflowConfigureDirective,
  normalizeWorkflowExecutionContext,
  parseWorkflowConfigureDirective,
  parseWorkflowExecutionContext,
  stripWorkflowConfigureDirectives,
} from './workflowExecution';

describe('workflow execution marker', () => {
  it('round trips a formal isolated run context', () => {
    const line = formatWorkflowExecutionContext({ workflowId: 'wf-1', runId: 'run-1', runDir: '/home/u/hpclaw_flows/wf/runs/run-1' });
    expect(parseWorkflowExecutionContext(`before\n${line}\nafter`)).toEqual({
      workflowId: 'wf-1', runId: 'run-1', runDir: '/home/u/hpclaw_flows/wf/runs/run-1', policy: 'isolated-run-v1',
    });
  });

  it('rejects traversal and malformed markers', () => {
    expect(parseWorkflowExecutionContext('[HPCLAW_WORKFLOW_RUN] nope')).toBeNull();
    expect(parseWorkflowExecutionContext('[HPCLAW_WORKFLOW_RUN] {"workflowId":"w","runId":"r","runDir":"/x/../etc","policy":"isolated-run-v1"}')).toBeNull();
  });

  it('restores the formal run from full history even when the transport window would omit it', () => {
    const marker = formatWorkflowExecutionContext({ workflowId: 'wf-1', runId: 'run-1', runDir: '/home/u/hpclaw_flows/wf/runs/run-1' });
    const messages = [
      { content: marker },
      ...Array.from({ length: 30 }, (_, index) => ({ content: `later message ${index}` })),
    ];
    expect(findLatestWorkflowExecutionContext(messages)?.runId).toBe('run-1');
  });

  it('validates a separately transported workflow context', () => {
    expect(normalizeWorkflowExecutionContext({
      workflowId: 'wf-2', runId: 'r2', runDir: '/home/u/hpclaw_flows/w/03_workspace/runs/r2/', policy: 'isolated-run-v1',
    })?.runDir).toBe('/home/u/hpclaw_flows/w/03_workspace/runs/r2');
    expect(normalizeWorkflowExecutionContext({
      workflowId: 'wf-2', runId: 'r2', runDir: '/home/u/hpclaw_flows/../etc', policy: 'isolated-run-v1',
    })).toBeNull();
  });
});

describe('workflow configure marker', () => {
  it('round trips a configure directive embedded in assistant text', () => {
    const line = formatWorkflowConfigureDirective({ workflowId: 'wf-rnaseq' });
    expect(parseWorkflowConfigureDirective(`我推荐用转录组流程，但还缺输入目录。\n${line}\n请在下方卡片里点选。`)).toEqual({
      workflowId: 'wf-rnaseq',
    });
  });

  it('rejects malformed and hostile directives', () => {
    expect(parseWorkflowConfigureDirective('[HPCLAW_WORKFLOW_CONFIGURE] nope')).toBeNull();
    expect(parseWorkflowConfigureDirective('[HPCLAW_WORKFLOW_CONFIGURE] {}')).toBeNull();
    expect(normalizeWorkflowConfigureDirective({ workflowId: `a\nb` })).toBeNull();
    expect(normalizeWorkflowConfigureDirective('wf-1')).toBeNull();
  });

  it('strips marker lines and keeps the readable remainder', () => {
    const line = formatWorkflowConfigureDirective({ workflowId: 'wf-1' });
    expect(stripWorkflowConfigureDirectives(`先确认参数。\n${line}\n选好后点确认运行。`)).toBe('先确认参数。\n选好后点确认运行。');
    expect(stripWorkflowConfigureDirectives(line)).toBe('');
  });

  it('does not confuse the run marker with the configure marker', () => {
    const runLine = formatWorkflowExecutionContext({ workflowId: 'wf-1', runId: 'r1', runDir: '/home/u/runs/r1' });
    expect(parseWorkflowConfigureDirective(runLine)).toBeNull();
    expect(parseWorkflowExecutionContext(formatWorkflowConfigureDirective({ workflowId: 'wf-1' }))).toBeNull();
  });
});
