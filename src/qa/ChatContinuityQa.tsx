/** Development-only visual regression fixture. Never connects to a cluster or a model. */
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import AIChat from '../components/AIChat';
import { LocaleProvider, LanguageToggle } from '../i18n';
import { formatWorkflowExecutionContext } from '../../shared/workflowExecution';
import { SCHEDULER_REVIEW_PENDING } from '../../shared/workflowContinuation';
import '../index.css';

if (!(import.meta as ImportMeta & { env: { DEV: boolean } }).env.DEV) throw new Error('QA is not available in production');
const runDir = '/home/qa/trace_flows/fixture/03_workspace/runs/fixture-run-1';
const marker = formatWorkflowExecutionContext({ workflowId: 'qa-only', runId: 'fixture-run-1', runDir });
const workflow = { id: 'qa-only', name: '隔离验证流程 / Isolated QA workflow', description: 'Artificial fixture; no real cluster.', params: [], keywords: [], source: 'user', steps: [{ title: 'Output validation', command: 'echo QA' }], createdAt: 1, updatedAt: 1 };
const run = {
  runId: 'fixture-run-1', workflowId: 'qa-only', workflowName: workflow.name, workflowVersion: 1, revision: 2,
  runDir, status: 'waiting_user', error: SCHEDULER_REVIEW_PENDING, startedAt: Date.now(), updatedAt: Date.now(), heartbeatAt: Date.now(),
  currentStep: 1, totalSteps: 2, config: { inputs: [], params: {}, stepParams: {}, referenceOverrides: {}, skippedSteps: [], stepCommandOverrides: {} },
  steps: [{ n: 1, stepId: 's1', title: 'Output validation', status: 'running', jobIds: ['111'], summary: 'Synthetic completed job; output review is pending.' }, { n: 2, stepId: 's2', title: 'Report', status: 'pending' }],
};
window.fetch = async (input) => {
  const url = String(input);
  if (url.includes('/api/workflow-runs/item')) return Response.json({ success: true, run });
  if (url.includes('/api/workflow-runs')) return Response.json({ success: true, runs: [run] });
  if (url.includes('/api/workflows')) return Response.json({ success: true, workflows: [workflow], runs: [run] });
  if (url.includes('/api/ai/active')) return Response.json({ success: true, running: false });
  if (url.includes('/api/ai/stream')) return Response.json({ error: 'QA_ONLY: no execution is permitted' }, { status: 405 });
  return Response.json({ success: true, skills: [], runs: [], conversations: [] });
};

function Qa() {
  const [scenario, setScenario] = useState('resume');
  const [messages, setMessages] = useState<any[]>([]);
  const resume = [
    { role: 'user', content: marker + '\n开始流程，按已确认参数连续执行。' },
    { role: 'assistant', content: '作业已提交。后台会在结束后核验输出并继续；提交回执不代表分析完成。' },
    { role: 'system', content: '[命令输出]\nSynthetic output: QC metric = 12.\n' + 'FULL-DETAIL-'.repeat(90) + '\nOUTPUT_END' },
    { role: 'user', content: marker + '\n从断点继续，跳过已完成步骤；不要重复提交存活作业。' },
    { role: 'assistant', content: '同一个 RUN 仅显示一个流程框。缺少关键输入、QC 失败或需要审批时仍会暂停。', thoughtSteps: [{ step: 1, content: 'Only synthetic fixture evidence. '.repeat(30) + 'DETAIL_END' }] },
  ];
  const history = [
    { role: 'user', content: 'FIRST_HISTORY_MESSAGE：最早一条聊天记录，仍可直接在对话中阅读。' },
    ...Array.from({ length: 610 }, (_, i) => ({ role: i % 2 ? 'assistant' : 'user', content: `历史消息 ${i + 1} / History message ${i + 1}: artificial QA only.` })),
    ...resume,
  ];
  const displayed = messages.length ? messages : scenario === 'history' ? history : resume;
  const select = (value: string) => { setMessages([]); setScenario(value); };
  const scroll = (bottom: boolean) => {
    const pane = document.querySelector<HTMLElement>('[data-chat-messages]');
    if (pane) pane.scrollTop = bottom ? pane.scrollHeight : 0;
  };
  return <div className="h-screen flex flex-col bg-scholar-950 text-scholar-100">
    <header className="flex flex-wrap items-center gap-3 px-4 py-2 border-b border-scholar-700">
      <strong>TRACE · Isolated QA</strong><span className="text-amber-400 text-xs">模拟数据，未连接集群 / No cluster connected</span>
      <button className="btn-ghost" onClick={() => select('resume')}>Resume fixture</button>
      <button className="btn-ghost" onClick={() => select('history')}>616-record history</button>
      <button className="btn-ghost" onClick={() => scroll(false)}>First message</button>
      <button className="btn-ghost" onClick={() => scroll(true)}>Most recent</button>
      <LanguageToggle />
    </header>
    <div className="flex-1 min-h-0"><AIChat isOpen workspaceLayout socket={null} sessionId="qa-only"
      executeCommand={async () => { throw new Error('QA_ONLY'); }} messages={displayed} onMessagesChange={setMessages}
      onSkillsChange={() => {}} conversationContextId={'qa-' + scenario} /></div>
  </div>;
}
createRoot(document.getElementById('root')!).render(<LocaleProvider><Qa /></LocaleProvider>);
