/**
 * The `turn` family of the Workspace registry's archive admission: whether a
 * Session's own Agent is inside a turn, and its cancel when the Session is
 * archived with its work. Installed by the registry's constructor, so it
 * answers for every Agent the registry publishes.
 *
 * @module @deepseek-ai/dsh-agent
 */
/**
 * Answer `workspace/session-activity` with the `turn` family while the
 * Session's Agent is running (a turn waiting for an approval or an answer
 * included), and `workspace/session-stop` by cancelling that turn the way
 * the user's own stop does — `agent.cancel({ kind: 'user' })`, but without
 * the stop button's `keepInbox`, so queued input is discarded with a logged
 * inbox splice instead of waking the archived Session later. Nothing is
 * awaited to settlement. Both listeners live as long as `ctx`'s fiber.
 * @param ctx - the registry's registration context.
 * @param lookup - the registry's live-Agent lookup by Session id.
 */
export function installTurnArchiveAdmission(ctx, lookup) {
    ctx.on('workspace/session-activity', async ({ sessionId }, next) => {
        const running = lookup(sessionId)?.status === 'running';
        const rest = await next();
        if (!running)
            return rest;
        const own = { kind: 'turn' };
        return [own, ...rest];
    });
    ctx.on('workspace/session-stop', ({ sessionId }) => {
        const agent = lookup(sessionId);
        if (agent?.status === 'running')
            agent.cancel({ kind: 'user' });
    });
}
//# sourceMappingURL=archive-admission.js.map