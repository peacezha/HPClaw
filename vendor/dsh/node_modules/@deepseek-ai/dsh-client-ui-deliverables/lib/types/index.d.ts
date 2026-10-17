/**
 * Deliverables plugin, node half. Registers Web file-reference guidance and
 * serves authenticated native opens of declared files. The browser
 * half ships via exports["./client"], discovered through the package.json
 * dsh.client declaration.
 */
import type { Context } from '@deepseek-ai/cordis';
/** Services required for file-reference guidance, change summaries, and authenticated native opens. */
export declare const inject: string[];
/**
 * Register Web file-reference guidance and native opens for declared files.
 * @param ctx - host context carrying the system-prompt registry.
 */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map