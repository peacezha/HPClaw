/** Durable provider-independent translations through an existing Session writer. */
import type { Context } from '@deepseek-ai/cordis';
import { SessionSeq, type SessionId } from '@deepseek-ai/dsh-session';
import type { TranslationIdentity, TranslationRequestRecord } from './types.ts';
/** One live Session's translation writes; failures preserve safe diagnostics or the caller's abort reason. */
export interface TranslationLog {
    /**
     * Retain one immutable request before dispatch.
     * @param data - common input and optional exact provider-owned request details.
     * @returns the request sequence used by its eventual result, after durability is verified.
     */
    request(data: TranslationRequestRecord): Promise<SessionSeq>;
    /**
     * Retain a successful result before returning it to the caller.
     * @param requestSeq - this operation's durable request sequence.
     * @param text - complete validated translated text.
     */
    result(requestSeq: SessionSeq, text: string): Promise<void>;
}
/** Saved results need no live Session; uncached translations use its existing writer. */
export declare class TranslationStorage {
    private readonly ctx;
    private readonly translations;
    /** @param ctx - translator context with optional live Sessions and durable persistence. */
    constructor(ctx: Context);
    /**
     * Reuse a saved result, or retain a new translation through the live Session writer.
     * @param id - existing Session; a cache miss without a live Session rejects with
     * `TRANSLATION_SESSION_INACTIVE` before invoking `operation`.
     * @param identity - provider, exact source, languages, and recipe; identical concurrent attempts share cache admission.
     * @param signal - operation cancellation, also observed after every storage await.
     * @param operation - uncached translation using the pinned live Session.
     * @returns saved or newly translated text, durably retained. Operation rejection returns without
     * waiting for accepted writes; identical retries and storage disposal wait for those writes to settle.
     */
    run(id: SessionId, identity: TranslationIdentity, signal: AbortSignal, operation: (log: TranslationLog) => Promise<string>): Promise<string>;
    private read;
    private lookup;
}
//# sourceMappingURL=storage.d.ts.map