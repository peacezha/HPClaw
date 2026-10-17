/**
 * Incremental session-log contribution for official DeepSeek LLM API requests.
 * Accepted sequence watermarks live in the canonical log, so restart recovery
 * can conservatively resend uncertain tails without maintaining another store.
 * @module @deepseek-ai/dsh-session-log-deepseek
 */
import type { Context, Volatile } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import type { Session, SessionSeqCursor } from '@deepseek-ai/dsh-session';
export type * from './types.ts';
/** Cordis plugin name. */
export declare const name = "session-log-deepseek";
/** Services required to resolve sessions and contribute the provider request field. */
export declare const inject: string[];
/** Session-log request contribution configuration. */
export interface Config {
    /** Contribute `dsh_session_log` to official DeepSeek requests. Defaults to `true`. */
    enabled: Volatile<boolean>;
    /**
     * Largest serialized `dsh_session_log` field, in UTF-8 bytes, that one request carries.
     * A request uploads the longest pending event prefix that fits; later requests continue
     * after its acceptance. Defaults to 8 MiB.
     */
    maxBytes: number;
}
/** Validated Session-log request contribution configuration. */
export declare const Config: z<Schemastery.ObjectS<NoInfer<{
    enabled: z<boolean, boolean, "volatile-defined">;
    maxBytes: z<number, number, "defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    enabled: z<boolean, boolean, "volatile-defined">;
    maxBytes: z<number, number, "defined">;
}>>, "plain">;
/**
 * Highest confirmed sequence for this exact Session format generation.
 * @param session - canonical log whose matching acceptance events are folded.
 * @returns greatest accepted sequence, or `-1` before any accepted request.
 */
export declare function acceptedThrough(session: Session): SessionSeqCursor;
/**
 * Register the incremental request contribution; enablement is read for each request.
 * @param ctx - plugin context carrying Sessions and the DeepSeek request-extension registry.
 * @param config - validated configuration.
 */
export declare function apply(ctx: Context, config: Config): void;
//# sourceMappingURL=index.d.ts.map