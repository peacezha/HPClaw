/**
 * Image offload executor for the compaction seam. When an image-capable route
 * fails a request with `IMAGE_OFFLOAD_REQUIRED`, the plugin records one
 * `image/offload` decision selecting the oldest retained input occurrences
 * and retries through the agent or compaction summary error waterfall. Every route
 * sends placeholder text for those occurrences in subsequent requests.
 *
 * @module @deepseek-ai/dsh-compaction-image-offload
 */
import { IMAGE_OFFLOAD_REQUIRED_CODE, LlmError } from '@deepseek-ai/dsh-llm';
import { offloadOldestImages } from "./image-offload.js";
import { imageOffloadProjection } from "./projection.js";
export const name = 'compaction-image-offload';
export const inject = ['agents', 'sessions'];
/**
 * Mount agent and summary recovery listeners without configuration.
 * @param ctx - the plugin context.
 */
export function apply(ctx) {
    ctx.sessions.registerMessageProjection(imageOffloadProjection);
    ctx.on('agent/request-error', ({ agent, failure, signal }, next) => {
        if (failure.code !== IMAGE_OFFLOAD_REQUIRED_CODE || failure.offloadImages === undefined || signal.aborted)
            return next();
        // A durable surface repair, not a provider retry: it spends no retry budget and logs no retry event.
        if (!offloadOldestImages(agent.session, agent.session.surface.nodes, failure.offloadImages))
            return next();
        return Promise.resolve({ kind: 'retry' });
    });
    ctx.on('compaction/summary-error', ({ session, sourceEventSeqs, error, signal }, next) => {
        if (!(error instanceof LlmError)
            || error.code !== IMAGE_OFFLOAD_REQUIRED_CODE
            || error.failure.offloadImages === undefined)
            return next();
        signal?.throwIfAborted();
        if (!offloadOldestImages(session, sourceEventSeqs, error.failure.offloadImages))
            return next();
        return true;
    });
}
//# sourceMappingURL=index.js.map