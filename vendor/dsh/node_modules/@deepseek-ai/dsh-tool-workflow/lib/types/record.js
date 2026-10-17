/**
 * Live-progress mirror for background workflow runs: streams the engine's
 * `workflow/phase`, `workflow/log`, and member lifecycle events into the
 * owning job's output ring as `log` chunks — observer-only narration the
 * model's `job_output` never renders — and keeps the job's live progress
 * line on the current phase. Appends against a settled job log and drop
 * inside the registry, so a straggling event after settlement is harmless.
 * @module @deepseek-ai/dsh-tool-workflow/record
 */
/**
 * Create the run-to-ring mirror and subscribe the engine's live progress
 * events for the runs it tracks.
 * @param ctx - plugin context whose event bus carries the `workflow/*` events.
 * @returns the mirror taps the tool wires around each background run.
 */
export function createWorkflowRecordMirror(ctx) {
    const active = new Map();
    ctx.on('workflow/phase', (info, title) => {
        const job = active.get(info.id);
        if (job === undefined)
            return;
        job.updateProgress(title);
        job.append(`▸ ${title}\n`, { channel: 'log' });
    });
    ctx.on('workflow/log', (info, message) => {
        active.get(info.id)?.append(`${message}\n`, { channel: 'log' });
    });
    ctx.on('workflow/agent-start', (info, agent) => {
        active.get(info.id)?.append(`agent #${agent.seq} ${agent.label} started\n`, { channel: 'log' });
    });
    ctx.on('workflow/agent-end', (info, agent) => {
        active.get(info.id)?.append(`agent #${agent.seq} ${agent.outcome}\n`, { channel: 'log' });
    });
    return {
        start(runId, job) {
            active.set(runId, job);
        },
        stop(runId) {
            active.delete(runId);
        },
    };
}
//# sourceMappingURL=record.js.map