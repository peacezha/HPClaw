import { describe, expect, it } from 'vitest';
import { QC_FAILURE_MESSAGE, qcPauseReason, unresolvedQcFailures } from './workflowQc';

describe('scientific QC verdicts', () => {
  it('does not infer failure from missing QC, warnings or process status', () => {
    expect(unresolvedQcFailures({ steps: [{ qc: { status: 'pass' } }, { qc: { status: 'warn' } }, {}] })).toEqual([]);
    expect(unresolvedQcFailures({})).toEqual([]);
  });
  it('requires a persisted, valid risk acknowledgement and leaves the failure intact', () => {
    const failed = { n: 1, title: 'QC', qc: { status: 'fail', metrics: { FRiP: '0.005' } } };
    expect(unresolvedQcFailures({ steps: [failed] })).toEqual([failed]);
    for (const approvedAt of [0, -1, NaN, Infinity]) {
      expect(unresolvedQcFailures({ steps: [{ ...failed, qcOverride: { approvedAt, revision: 4 } }] })).toHaveLength(1);
    }
    const acknowledged = { ...failed, qcOverride: { approvedAt: 1000, revision: 4 } };
    expect(unresolvedQcFailures({ steps: [acknowledged] })).toEqual([]);
    expect(acknowledged.qc.status).toBe('fail');
    expect(qcPauseReason({ steps: [failed] })).toBe(`${QC_FAILURE_MESSAGE} QC fail: 1. QC`);
  });
});
