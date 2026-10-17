/**
 * LLM-backed authorization gate for the current-session-only Auto permission
 * preset. Every native call and every started PTC inner call is reviewed once
 * before its body; the outer `run_code` transport is deliberately excluded.
 * Under the `ask` approval policy a reviewer denial asks the user; under
 * `never` it is final.
 *
 * @module @deepseek-ai/dsh-experimental-auto-review
 */
import type { Context } from '@deepseek-ai/cordis';
/** Cordis plugin name used by loader diagnostics. */
export declare const name = "experimental-auto-review";
/** Complete host services required before Auto may be advertised. */
export declare const inject: string[];
/** Install the Auto preset and its prepended per-call review gate. */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map