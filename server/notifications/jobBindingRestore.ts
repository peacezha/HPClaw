// 登录/重连后的 job-agent 绑定恢复：把当前会话尚未唤醒（resumeCount===0）的绑定作业
// 重新交给 jobWatcher 跟踪。必须在 jobWatcher.start 首轮轮询落定前调用：重启期间结束的
// 绑定作业会在首轮对比中检出终态并正常走 emitEvent + 唤醒（见 jobWatcher 首轮绑定例外）。
import { jobWatcher } from './jobWatcher';
import { listBindings } from '../dsh/jobAgentBindings';

export interface RestoreJobBindingsDeps {
  /** 测试覆盖用；缺省读 job-agent-bindings.json 存储 */
  listBindings?: typeof listBindings;
  /** 测试覆盖用；缺省 jobWatcher.trackJobs */
  trackJobs?: (sessionId: string, jobIds: string[]) => void;
}

/** 恢复当前会话的未唤醒绑定，返回重新跟踪的作业数。任何失败仅 log（登录链路不能被打断）。 */
export function restoreJobAgentBindings(sessionId: string, deps: RestoreJobBindingsDeps = {}): number {
  try {
    const bindings = (deps.listBindings ?? listBindings)();
    const pending = bindings.filter(b => b.sshSessionId === sessionId && b.resumeCount === 0);
    if (pending.length === 0) return 0;
    const track = deps.trackJobs ?? ((sid: string, ids: string[]) => jobWatcher.trackJobs(sid, ids));
    track(sessionId, pending.map(b => b.jobId));
    console.log('[job-bind] restored %d pending bindings for session %s', pending.length, sessionId);
    return pending.length;
  } catch (err) {
    console.warn('[job-bind] 恢复作业绑定失败: %s', err instanceof Error ? err.message : String(err));
    return 0;
  }
}
