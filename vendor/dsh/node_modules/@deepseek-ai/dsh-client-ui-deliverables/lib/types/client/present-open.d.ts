import type { SessionId } from '@deepseek-ai/dsh-session/types';
import { type PresentedAction, type PresentedHost } from '../presented.ts';
/** Success feedback remains fully visible for five seconds before fading. */
export declare const PRESENTED_SUCCESS_HOLD_MS = 5000;
/** Fade interval shared by the card animation and status expiry. */
export declare const PRESENTED_SUCCESS_FADE_MS = 200;
/** Failure feedback for the shared native opening control. */
export type PresentedOpenFailure = 'openError' | 'revealError' | null;
/** State published on the owning file card. */
export type PresentedOpenPhase = 'opening' | 'opened' | 'revealing' | 'revealed' | 'error' | 'revealError' | 'nativeUnavailable';
/** One browser plugin's file-open requests, cancelled when that plugin is disposed. */
export declare class PresentedOpenController {
    /** File action URLs key the state across Sessions, turns, and both clickable surfaces. */
    readonly state: import("@deepseek-ai/dsh-client-store").SnapshotStore<Record<string, PresentedOpenPhase | undefined>>;
    /** Native destination metadata, or a retryable read failure. */
    readonly host: import("@deepseek-ai/dsh-client-store").SnapshotStore<PresentedHost | "error" | null>;
    private readonly expiry;
    private loading;
    private metadata;
    private readonly lifetime;
    private readonly pending;
    /**
     * Open a declared file once while a request for the same coordinates is pending.
     * Failures remain visible on the card and a later gesture retries them.
     * @param sessionId - viewed Session, including a fork's own identity.
     * @param seq - durable delivery event sequence.
     * @param index - original file index within that event.
     * @param action - default application open or file-manager reveal.
     * @param application - registered handler identifier for an explicit application choice.
     * @returns null after a successful handoff, or the failure to announce after publishing card status.
     */
    open(sessionId: SessionId, seq: number, index: number, action?: PresentedAction, application?: string): Promise<PresentedOpenFailure>;
    /**
     * Open one recorded changed file in the Host's default application.
     * @param sessionId - viewed Session.
     * @param seq - durable workspace/changes event sequence.
     * @param index - original file index within that event.
     * @param action - application open or file-manager reveal.
     * @param application - registered handler identifier for an explicit application choice.
     * @returns null after a successful handoff, or the failure to announce after publishing card status.
     */
    openChanged(sessionId: SessionId, seq: number, index: number, action?: PresentedAction, application?: string): Promise<PresentedOpenFailure>;
    private openUrl;
    /**
     * Read the serving desktop metadata, coalescing concurrent reads; a later call retries failure.
     * @returns after metadata or a retryable error is published.
     */
    loadHost(): Promise<void>;
    /** Invalidate desktop metadata on connection replacement; mounted cards request the new Host. */
    resetHost(): void;
    private readHost;
    /** Cancel outstanding requests and wait until no request can publish state. */
    dispose(): Promise<void>;
    private clearExpiry;
    private request;
}
//# sourceMappingURL=present-open.d.ts.map