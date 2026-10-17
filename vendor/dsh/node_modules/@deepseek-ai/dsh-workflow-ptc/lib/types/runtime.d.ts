/**
 * Workflow VM hooks, child callbacks, ordinary concurrency limits and result serialization.
 * PTC owns process confinement and cancellation. Fatal hook and provider failures propagate
 * through combinators; ordinary child failures and stage errors become per-item nulls.
 * @module @deepseek-ai/dsh-workflow-ptc/runtime
 */
import type { WorkflowAgentEndInfo, WorkflowAgentInfo, WorkflowMeta, WorkflowResult } from '@deepseek-ai/dsh-workflow';
import type { ChildPort, WorkerLimits } from './types.ts';
/** The observers the execution reports progress through (the session posts them to the host). */
export interface ExecutionObserver {
    phase(title: string): void;
    log(message: string): void;
    agentStart(info: WorkflowAgentInfo): void;
    agentEnd(info: WorkflowAgentEndInfo): void;
}
/**
 * One script execution inside the confined Node process. The host owns
 * cancellation and cleanup of any dropped child work.
 */
export declare class WorkflowExecution {
    private readonly limits;
    private readonly observer;
    private readonly children;
    /** 1-based count of `agent()` calls started (the `agentsStarted` result field). */
    private started;
    private activeSlots;
    private readonly slotWaiters;
    private currentPhase;
    private readonly context;
    private readonly compiled;
    constructor(meta: WorkflowMeta, body: string, args: unknown, limits: WorkerLimits, observer: ExecutionObserver, children: ChildPort);
    /**
     * Run the script and materialize its JSON return value.
     * @returns A completed or error result; script failures never reject.
     */
    drive(): Promise<WorkflowResult>;
    /**
     * Attach a no-op rejection consumer WITHOUT changing what the caller
     * receives: if the script drops the promise, a host rejection cannot become
     * an unhandled rejection that kills the process; if
     * the script does await it, it still observes the rejection.
     */
    private contain;
    /** Materialize the script's return value; violations become RESULT_UNSERIALIZABLE. */
    private materializeResult;
    /** Acquire one concurrency slot in FIFO order. */
    private acquireSlot;
    private releaseSlot;
    /** The `agent(prompt, opts)` hook. */
    private agent;
    /** Materialize + validate the `agent()` options bag from the realm. */
    private readAgentOptions;
    /** The `parallel(thunks)` hook: each thunk caught → `null`; fatal errors propagate. */
    private parallel;
    /** The `pipeline(items, ...stages)` hook: per-item stage chains, NO cross-stage barrier. */
    private pipeline;
    private assertItemCap;
    /** The `phase(title)` hook: sets the current label for subsequent `agent()` calls and notifies observers. */
    private phase;
    /** The `log(message)` hook: narration to observers. */
    private log;
}
//# sourceMappingURL=runtime.d.ts.map