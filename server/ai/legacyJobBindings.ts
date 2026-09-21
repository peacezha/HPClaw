// legacy(内置)引擎的作业 ↔ AI 会话绑定登记：与 dshAgentRunner 在 dsh 路径做的事同款，
// 但 legacy 没有 dsh 会话（dshSessionId 固定空串、engine 标记 'legacy'），
// 作业终态后由 legacyJobResumer 直接跑一轮内置 runAgent 唤醒原对话。
import { addBindings, type JobBindingContext } from '../dsh/jobAgentBindings';

/** legacy 绑定上下文：sshSessionId/dshSessionId/engine 由登记处填充。 */
export type LegacyJobBindingMeta = Omit<JobBindingContext, 'sshSessionId' | 'dshSessionId' | 'engine'>;

/**
 * 登记一批 legacy 作业号到同一 AI 对话上下文。返回新增条数（按 jobId+sshSessionId 去重，
 * 语义见 jobAgentBindings.addBindings）。调用方负责 try/catch（绑定失败不应打断主链路）。
 */
export function registerLegacyJobBindings(sessionId: string, jobIds: string[], meta: LegacyJobBindingMeta): number {
  return addBindings(jobIds, {
    ...meta,
    sshSessionId: sessionId,
    dshSessionId: '',
    engine: 'legacy',
  });
}
