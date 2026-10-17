/** Workflow child ownership and progress over the shared sandboxed PTC executor. */
import type { Context } from '@deepseek-ai/cordis';
import type { Agent } from '@deepseek-ai/dsh-agent';
import type { PtcRuntime } from '@deepseek-ai/dsh-ptc-runtime';
import type { SandboxExecutionPolicy } from '@deepseek-ai/dsh-sandbox';
import type SubagentRuntime from '@deepseek-ai/dsh-subagent';
import type { WorkflowMeta, WorkflowResult, WorkflowRun, WorkflowRunId } from '@deepseek-ai/dsh-workflow';
import type { ExecutionObserver } from './runtime.ts';
import type { WorkerInit } from './types.ts';
/**
 * Holder-owned workflow. Cancellation stops the program immediately; settlement waits for
 * its managed process and every admitted child startup/disposal. Engine unload does not
 * invalidate the captured runtime or subagent handles.
 */
export declare class PtcWorkflowRun implements WorkflowRun {
    private readonly ctx;
    private readonly subagents;
    private readonly runtime;
    readonly id: WorkflowRunId;
    readonly meta: WorkflowMeta;
    private readonly parent;
    private readonly init;
    private readonly provider;
    private readonly policy;
    private readonly observer;
    private readonly signal?;
    readonly result: Promise<WorkflowResult>;
    private readonly controller;
    private readonly children;
    private readonly pending;
    private readonly liveAgents;
    private started;
    private terminal;
    private cancelReason;
    private disposed;
    private readonly externalAbort;
    private readonly cwd;
    constructor(ctx: Context, subagents: SubagentRuntime, runtime: PtcRuntime, id: WorkflowRunId, meta: WorkflowMeta, parent: Agent, init: WorkerInit, provider: string, policy: SandboxExecutionPolicy, observer: ExecutionObserver, signal?: AbortSignal | undefined);
    /**
     * Stop the script and abort pending and published children.
     * @param reason - Human-readable cancellation cause; the first request wins.
     */
    cancel(reason?: string): void;
    /**
     * Cancel unfinished work and await the program and child cleanup.
     * @returns One shared completion promise for repeated disposal calls.
     */
    dispose(): Promise<void>;
    private requireActive;
    private track;
    private bindings;
    private child;
    private startChild;
    private childResult;
    private disposeChild;
    private onProgress;
    private endAgent;
    private cancelled;
    private drive;
}
//# sourceMappingURL=host.d.ts.map