/** Independent content-to-terminal records keep concurrent browser writes disjoint. */
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import type { WebTerminalId } from '../types.ts';
/** Saved recovery targets keyed by Session and globally unique terminal content identity. */
export declare class TerminalBindings {
    private readonly memory;
    /**
     * Read a saved target, retaining this window's value when storage is unavailable.
     * @param sessionId - owning Session.
     * @param contentId - terminal content identity, shared only by deliberate copies.
     * @returns the existing Host identity, if one has been saved.
     */
    get(sessionId: SessionId, contentId: string): WebTerminalId | undefined;
    /**
     * Save an identity before its Host allocation begins.
     * @param sessionId - owning Session.
     * @param contentId - globally unique terminal content identity.
     * @param id - existing or newly allocated Host identity.
     */
    set(sessionId: SessionId, contentId: string, id: WebTerminalId): void;
    /**
     * Remove this content's target after its close intent has been saved.
     * @param sessionId - owning Session.
     * @param contentId - closing terminal content identity.
     */
    delete(sessionId: SessionId, contentId: string): void;
    /** Release cached values when the Client service is disposed. */
    clear(): void;
    private key;
}
//# sourceMappingURL=bindings.d.ts.map