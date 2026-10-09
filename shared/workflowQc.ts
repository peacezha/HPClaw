/** QC is a scientific verdict, independent of whether a command exited successfully. */
export interface QcStepLike {
  n?: number;
  title?: string;
  qc?: { status: string; metrics?: Record<string, string> };
  qcOverride?: { approvedAt: number; revision: number };
}

export const QC_FAILURE_MESSAGE = '质量不佳，不建议继续下游分析。请先检查未达标指标和原始数据；自动推进已暂停。';
export const QC_WARNING_MESSAGE = '质控存在警告，继续分析前请检查相关指标，谨慎解释下游结果。';

export function unresolvedQcFailures<T extends QcStepLike>(run: { steps?: T[] }): T[] {
  return (run.steps || []).filter(step => step.qc?.status === 'fail' && !(Number.isFinite(step.qcOverride?.approvedAt) && Number(step.qcOverride?.approvedAt) > 0));
}

export function qcPauseReason(run: { steps?: QcStepLike[] }): string {
  const failures = unresolvedQcFailures(run);
  return `${QC_FAILURE_MESSAGE} QC fail: ${failures.map(step => `${step.n ?? '?'}. ${step.title || 'QC'}`).join('; ')}`;
}
