// 作业终态事件派发：jobWatcher.emitEvent 的统一入口（server.ts 装配）。
// 顺序：流程对账 → job:finished socket 推送 → dsh/legacy 两条唤醒链路（各自凭绑定自过滤）。
import type { JobEvent } from './jobWatcher';

export interface JobEventHandlerDeps {
  /** 正式流程对账与续跑（server.ts 的 reconcileFinishedWorkflowJob）。 */
  reconcileWorkflow?: (sessionId: string, jobId: string, status: 'DONE' | 'EXIT') => void;
  /** socket 房间推送；无房间的会话由 socket.io 静默忽略，不报错。 */
  emitToRoom?: (sessionId: string, eventName: string, payload: unknown) => void;
  /** dsh 引擎绑定唤醒（dshJobResumer.maybeResumeAgent；legacy 绑定在内部被跳过）。 */
  resumeDshAgent?: (evt: { sessionId: string; jobId: string; status: string }) => void;
  /** legacy(内置)引擎绑定唤醒（legacyJobResumer.maybeResumeLegacyAgent；非 legacy 绑定内部跳过）。 */
  resumeLegacyAgent?: (evt: { sessionId: string; jobId: string; status: string }) => void;
}

/** 返回 jobWatcher.configure({ emitEvent }) 所需的回调。 */
export function createJobEventHandler(deps: JobEventHandlerDeps): (event: JobEvent, sessionId: string) => void {
  return (event, sessionId) => {
    deps.reconcileWorkflow?.(sessionId, event.jobId, event.status);
    // 实时推送 JobEvent 本体，前端对话窗口可据此提示"作业已结束"。
    deps.emitToRoom?.(sessionId, 'job:finished', event);
    const evt = { sessionId, jobId: event.jobId, status: event.status };
    deps.resumeDshAgent?.(evt);
    deps.resumeLegacyAgent?.(evt);
  };
}
