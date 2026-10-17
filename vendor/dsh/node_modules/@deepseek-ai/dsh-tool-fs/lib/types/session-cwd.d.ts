/**
 * Resolution options for filesystem calls in the Session's current directory.
 * Non-agent calls leave directory defaults to the filesystem provider.
 * @module @deepseek-ai/dsh-tool-fs/session-cwd
 */
import type { Context } from '@deepseek-ai/cordis';
import type { ToolExecution } from '@deepseek-ai/dsh-tools';
/**
 * Resolve the current directory and cancellation for a filesystem call.
 * @param ctx - context containing the working-directory service.
 * @param exec - tool execution supplying the agent and cancellation.
 * @returns filesystem resolution options for this call.
 */
export declare function sessionResolveOptions(ctx: Context, exec: ToolExecution): Promise<{
    cwd?: string;
    signal?: AbortSignal;
}>;
//# sourceMappingURL=session-cwd.d.ts.map