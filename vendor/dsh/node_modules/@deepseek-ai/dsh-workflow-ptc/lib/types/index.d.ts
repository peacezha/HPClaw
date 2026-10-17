/**
 * Workflow orchestration through the shared sandboxed Node PTC executor.
 * The VM supplies script helpers; the process applies the calling Session's file policy.
 * @module @deepseek-ai/dsh-workflow-ptc
 */
import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import WorkflowEngine from '@deepseek-ai/dsh-workflow';
import type { WorkflowRun, WorkflowStartRequest } from '@deepseek-ai/dsh-workflow';
export { validateMeta } from './meta.ts';
export { materializeFromRealm, MaterializeError } from './realm.ts';
export type { ChildHandle, ChildPort, ChildResult, ChildStartRequest, WorkerInit, WorkerLimits, } from './types.ts';
/** Plugin config (all optional — `static Config` supplies the defaults). */
export interface Config {
    /** The `ctx.subagents` provider children run on (default `spawn`). */
    provider?: string;
    /** Concurrent `agent()` ceiling; `0` (the default) auto-resolves to `min(16, max(1, cores - 2))`. */
    maxConcurrentAgents?: number;
    /** Total `agent()` calls one run may start — the runaway-loop backstop (default 1000). */
    maxTotalAgents?: number;
    /** Items accepted by a single `parallel()`/`pipeline()` call (default 4096). */
    maxItemsPerCall?: number;
    /** VM timeout for the script's initial synchronous slice (default 5000 ms). */
    syncTimeoutMs?: number;
}
/**
 * The PTC-backed workflow engine. `start()` validates the script up front
 * (meta + a host-side body parse) and returns a {@link WorkflowRun} whose
 * `result` never rejects; the `workflow/*` events fire around the run per
 * the seam contract.
 */
declare class PtcWorkflowEngine extends WorkflowEngine {
    static inject: string[];
    static Config: z<Config>;
    private readonly config;
    constructor(ctx: Context, config: Config);
    /**
     * Validate and execute a workflow script in a sandboxed Node process. Throws
     * {@link WorkflowError} synchronously (`META_INVALID` for a malformed meta
     * block, `SCRIPT_PARSE` for a body that does not compile) for a request
     * that cannot begin; once a run is returned, every failure resolves through
     * `result.stopReason` instead.
     * @param request - the script body, its meta data and `args`, the parent
     *   agent, and an optional cancel signal.
     * @returns the live run (its `result` resolves when the script settles).
     */
    start(request: WorkflowStartRequest): WorkflowRun;
}
export default PtcWorkflowEngine;
//# sourceMappingURL=index.d.ts.map