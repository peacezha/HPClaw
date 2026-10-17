/**
 * 中途插话（steering）队列：按 SSE 请求 requestId 暂存用户在 AI 运行中发来的
 * 新指令。Agent 模型循环在每个模型步开始前（prepareStep）取走并注入；挂起期
 * （ask_user 反问）的插话由 steer 路由直接转成该挂起的回答，不进队列；轮末
 * 仍未消费的插话由服务端追加进对话存档，保证不丢。
 */
const MAX_STEER_TEXT_CHARS = 2_000;
const MAX_QUEUED_PER_REQUEST = 20;
const MAX_TRACKED_REQUESTS = 200;

export class SteerQueue {
  private queues = new Map<string, string[]>();

  /** 返回排队后的条数；请求已终结或超限时返回 0（调用方据此回退为新一轮对话）。 */
  enqueue(requestId: string, text: string): number {
    const trimmed = String(text || '').trim().slice(0, MAX_STEER_TEXT_CHARS);
    if (!requestId || !trimmed) return 0;
    const queue = this.queues.get(requestId) ?? [];
    if (queue.length >= MAX_QUEUED_PER_REQUEST) return 0;
    queue.push(trimmed);
    if (!this.queues.has(requestId)) {
      this.queues.set(requestId, queue);
      // 最简单的容量兜底：超量时丢弃最旧的请求队列（终态清理由 drain/clear 负责）。
      if (this.queues.size > MAX_TRACKED_REQUESTS) {
        this.queues.delete(this.queues.keys().next().value!);
      }
    }
    return queue.length;
  }

  /** 取走并清空该请求当前排队的全部插话（模型步开始前调用）。 */
  take(requestId: string): string[] {
    const queue = this.queues.get(requestId);
    if (!queue?.length) return [];
    this.queues.delete(requestId);
    return queue;
  }

  /** 轮末兜底：与 take 同义，语义上标记运行已收尾。 */
  drain(requestId: string): string[] {
    return this.take(requestId);
  }

  has(requestId: string): boolean {
    return (this.queues.get(requestId)?.length ?? 0) > 0;
  }

  clear(requestId: string): void {
    this.queues.delete(requestId);
  }
}
