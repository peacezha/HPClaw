import { unresolvedQcFailures, type QcStepLike } from './workflowQc';

export const SCHEDULER_REVIEW_PENDING = '调度器作业已完成，正在等待 Agent 验收输出和 QC；尚未将任务标记为完成。';

export function needsAutomaticOutputReview(run: { status?: string; error?: string; steps?: QcStepLike[] }): boolean {
  return run.status === 'waiting_user' && run.error === SCHEDULER_REVIEW_PENDING && !unresolvedQcFailures(run).length;
}
