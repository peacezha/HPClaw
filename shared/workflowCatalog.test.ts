import { describe, expect, it } from 'vitest';
import type { Workflow } from './workflow';
import { classifyWorkflowCatalog, isPendingDisposal, workflowDisposalReason } from './workflowCatalog';
import { translateUiText } from '../src/i18n';

const wf = (id: string, rest: Partial<Workflow> = {}): Workflow => ({
  id, name: id, description: '', keywords: [], source: 'user', params: [],
  steps: [{ title: id, command: `echo ${id}` }], createdAt: 1, updatedAt: 1, ...rest,
});
describe('reversible workflow catalogue classification', () => {
  it('restores only the corrected automatically quarantined DAG, never a user decision', () => {
    const base = { source: 'builtin' as const, provenance: { importerVersion: 'chipseq-dag-v2' }, lifecycle: { state: 'pending_disposal' as const, origin: 'automatic' as const, reasonCode: 'unverified_dag' as const, updatedAt: 1 } };
    const fixed = wf('encode-chipseq-tf-dag', structuredClone(base));
    expect(classifyWorkflowCatalog([fixed], 50)).toBe(1);
    expect(fixed.lifecycle).toEqual({ state: 'active', origin: 'automatic', updatedAt: 50 });
    for (const rest of [
      { ...base, lifecycle: { ...base.lifecycle, origin: 'user' as const } },
      { ...base, provenance: { ...base.provenance, customized: true } },
      { ...base, provenance: { importerVersion: 'old' } },
    ]) {
      const row = wf('encode-chipseq-tf-dag', rest);
      expect(classifyWorkflowCatalog([row], 60)).toBe(0);
      expect(row.lifecycle?.state).toBe('pending_disposal');
    }
  });
  it('moves redundant language seeds, not a customized variant', () => {
    const rows = [wf('encode-atacseq'), wf('encode-atacseq-en', { source: 'builtin' }), wf('encode-chipseq-tf-en', { source: 'builtin', provenance: { customized: true } })];
    expect(classifyWorkflowCatalog(rows, 99)).toBe(1);
    expect(rows[1].lifecycle).toMatchObject({ reasonCode: 'language_duplicate', replacementId: 'encode-atacseq', updatedAt: 99 });
    expect(rows[2].lifecycle).toBeUndefined();
    expect(classifyWorkflowCatalog(rows, 100)).toBe(0);
  });
  it('does not archive a language version if its main workflow was deleted', () => {
    const row = wf('encode-atacseq-en', { source: 'builtin' });
    expect(classifyWorkflowCatalog([row])).toBe(0);
  });
  it('archives only exact execution duplicates, retaining different parameter values and methods', () => {
    const a = wf('a', { params: [{ name: 'Q', label: 'Quality', defaultValue: '20' }] });
    const duplicate = { ...structuredClone(a), id: 'b', name: 'other' };
    const different = { ...structuredClone(a), id: 'c', params: [{ name: 'Q', label: 'Quality', defaultValue: '30' }] };
    const otherMethod = { ...structuredClone(a), id: 'd', steps: [{ title: 'other', command: 'bowtie2 reads' }] };
    expect(classifyWorkflowCatalog([a, duplicate, different, otherMethod])).toBe(1);
    expect(duplicate.lifecycle?.replacementId).toBe('a');
    expect(different.lifecycle).toBeUndefined(); expect(otherMethod.lifecycle).toBeUndefined();
  });
  it('preserves user restorations and categories across repeated migrations', () => {
    const row = wf('encode-atacseq-en', { source: 'builtin', category: 'my category', lifecycle: { state: 'active', origin: 'user', updatedAt: 9 } });
    const before = structuredClone(row);
    classifyWorkflowCatalog([wf('encode-atacseq'), row]);
    expect(row).toEqual(before);
  });
  it('does not translate or modify scientific definitions', () => {
    const row = wf('paper', { steps: [{ title: '分析', command: '# REVIEW_REQUIRED: missing CLI', agent: { kind: 'compute', requiresReview: true } }] });
    const steps = structuredClone(row.steps);
    classifyWorkflowCatalog([row]);
    expect(row.lifecycle?.reasonCode).toBe('placeholder_steps'); expect(row.steps).toEqual(steps);
    expect(workflowDisposalReason(row)).toContain('仅注释');
    expect(translateUiText(workflowDisposalReason(row), 'en-US')).not.toMatch(/[\u3400-\u9fff]/);
  });
  it('does not call template-based or input-dependent steps poor quality without evidence', () => {
    const row = wf('template', { steps: [{ title: 'data', command: 'fastp -i {{READ1}}', agent: { kind: 'compute', template: true, requiresReview: true } }] });
    expect(classifyWorkflowCatalog([row])).toBe(0);
  });
  it('ignores comment-only optional steps', () => {
    const row = wf('optional', { steps: [{ title: 'optional', command: '# REVIEW_REQUIRED', optional: true }] });
    expect(classifyWorkflowCatalog([row])).toBe(0);
  });
  it('keeps manually supplied disposal reasons verbatim', () => {
    const row = wf('user', { lifecycle: { state: 'pending_disposal', origin: 'user', reason: 'JmJ21 /special/path', updatedAt: 1 } });
    expect(isPendingDisposal(row)).toBe(true); expect(workflowDisposalReason(row)).toBe('JmJ21 /special/path');
  });
});
