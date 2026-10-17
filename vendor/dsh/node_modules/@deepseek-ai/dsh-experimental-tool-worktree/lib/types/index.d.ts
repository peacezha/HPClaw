/** Model tool for creating and entering a new Git worktree through the shared runtime. */
import type { Context } from '@deepseek-ai/cordis';
/** Cordis plugin name. */
export declare const name = "tool-worktree";
/** Services required to register and execute the worktree tool. */
export declare const inject: string[];
/**
 * Register create_worktree for model and PTC callers.
 * @param ctx - tool registry and worktree runtime.
 */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map