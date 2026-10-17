import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
export type { WorkspaceChangedFile, WorkspaceChanges, WorkspaceChangesSummary, WorkspaceDiffHunk, WorkspaceFileDiff, } from './types.ts';
/** Stable Loader identity. */
export declare const name = "workspace-changes";
/** Services used to run git, resolve mutation targets, and observe turns. */
export declare const inject: string[];
/** Snapshot, capture, and comparison bounds. Invalid values fail plugin load. */
export interface Config {
    /** Milliseconds one git command may run before the turn's record is abandoned. */
    timeoutMs: number;
    /** Bytes of git output retained per command; a larger diff listing abandons the record. */
    outputMaxBytes: number;
    /** Maximum files carried by one summary; `total` still reports the complete count. */
    maxFiles: number;
    /**
     * Bytes a file may hold to be captured around a file-tool edit or read from a snapshot for its comparison.
     * A larger file gets no comparison; one captured around a file-tool edit is also listed without counts.
     */
    maxFileBytes: number;
    /** Milliseconds a line comparison may run before it degrades to whole-file replacement. */
    diffTimeoutMs: number;
}
/** Schemastery validation for {@link Config}. */
export declare const Config: z<Config>;
/**
 * Observe top-level turns of every Session with a working directory, capture
 * file-tool edits, announce change summaries, and serve them with their
 * comparisons as `workspaceChanges`.
 * @param ctx - host context with `subprocess` and `fs`.
 * @param config - validated bounds.
 */
export declare function apply(ctx: Context, config: Config): void;
//# sourceMappingURL=index.d.ts.map