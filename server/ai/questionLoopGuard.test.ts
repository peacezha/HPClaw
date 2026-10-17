import { afterEach, describe, expect, it } from 'vitest';
import { clearQuestionLoopGuards, getQuestionLoopGuard, QuestionLoopGuard } from './questionLoopGuard';
afterEach(clearQuestionLoopGuards);
describe('question progress guard', () => {
  it('does not treat a later unrelated user message as the answer to a closed question', () => {
    const guard = new QuestionLoopGuard();
    guard.observeHistory([{ role: 'assistant', content: '❓ Which reference assembly?' },
      { role: 'assistant', content: 'No reference selected; task paused.' }, { role: 'user', content: '分析另一个项目' }]);
    expect(guard.decide('Which reference assembly?', ['v1', 'v2']).allowed).toBe(true);
  });
  it('recognizes harmless rephrasing and changed approximate file sizes without merging different targets', () => {
    const guard = new QuestionLoopGuard();
    const question = 'step-03 因小麦 chr1A 超出 .bai 索引坐标上限而失败（SRR8126621.sorted.bam 已生成 20GB，但无索引）。请选择修复方式以便继续？';
    guard.decide(question, ['CSI', 'Realign']); guard.answer(question, { selected: [], custom: '有哪些修复方案？' });
    expect(guard.decide(question.replace('20GB', '19 GiB').replace('以便继续？', '以便继续。'), ['CSI', 'Realign']).allowed).toBe(false);
  });

  it('does not let an old clarification override a later explicit instruction', () => {
    const guard = new QuestionLoopGuard();
    guard.decide('Which repair method?', ['CSI', 'Realign']); guard.answer('Which repair method?', { selected: [], custom: '请先解释方案' });
    guard.beginTurn('按 CSI 方案继续');
    const decision = guard.decide('Which repair method?', ['CSI', 'Realign']);
    expect(decision.feedback).toContain('按 CSI 方案继续');
    expect(decision.feedback).not.toContain('TRACE_CLARIFICATION_ONLY');
  });
  it('uses the human answer instead of repeating a question across requests', () => {
    const guard = getQuestionLoopGuard('cluster:user:conversation');
    expect(guard.decide('Which reference assembly?', ['v1', 'v2']).allowed).toBe(true);
    guard.answer('Which reference assembly?', { selected: ['v1'] });
    const decision = getQuestionLoopGuard('cluster:user:conversation').decide('Which reference assembly?', ['v1', 'v2']);
    expect(decision.allowed).toBe(false); expect(decision.feedback).toContain('v1');
    expect(decision.feedback).toContain('NOT permission');
    expect(getQuestionLoopGuard('other-conversation').decide('Which reference assembly?', ['v1', 'v2']).allowed).toBe(true);
  });
  it('blocks a vague repair choice without fabricating clickable options', () => {
    const guard = new QuestionLoopGuard();
    expect(guard.decide('step-03 因 BAI 上限失败，如何修复并继续？', []).feedback).toContain('TRACE_VAGUE_CHOICE_BLOCKED');
    expect(guard.decide('请提供 FASTQ 文件绝对路径', []).allowed).toBe(true);
  });
  it('cannot create a choice dialog in an explanation-only turn', () => {
    const decision = new QuestionLoopGuard().decide('Choose your repair', ['A', 'B'], true);
    expect(decision.allowed).toBe(false); expect(decision.feedback).toContain('NOT selecting an option');
  });
  it('requires actual progress, not just a changed heartbeat or revision', () => {
    const guard = new QuestionLoopGuard();
    guard.observeRun({ currentStep: 3, steps: [{ n: 3, status: 'running', jobIds: ['1234'] }] });
    guard.decide('Choose a method', ['A', 'B']); guard.answer('Choose a method', { selected: ['A'] });
    guard.observeRun({ currentStep: 3, heartbeatAt: 99, revision: 20, steps: [{ n: 3, status: 'running', jobIds: ['1234'] }] });
    expect(guard.decide('Choose a method', ['A', 'B']).allowed).toBe(false);
    guard.observeRun({ currentStep: 4, steps: [{ n: 3, status: 'done', jobIds: ['1234'], outputs: ['/run/a.bam'] }] });
    expect(guard.decide('Choose a method', ['A', 'B']).allowed).toBe(true);
  });
  it('recovers a question and explanation request from saved chat', () => {
    const guard = new QuestionLoopGuard();
    guard.observeHistory([{ role: 'assistant', content: '❓ 如何修复并继续？' }, { role: 'user', content: '有哪些修复方案？' }]);
    expect(guard.decide('如何修复并继续？', ['A', 'B']).feedback).toContain('TRACE_CLARIFICATION_ONLY');
  });
  it('never applies one job decision to another job', () => {
    const guard = new QuestionLoopGuard();
    guard.decide('是否终止作业 75741556？', ['是', '否']); guard.answer('是否终止作业 75741556？', { selected: ['是'] });
    expect(guard.decide('是否终止作业 75741557？', ['是', '否']).allowed).toBe(true);
  });
});
