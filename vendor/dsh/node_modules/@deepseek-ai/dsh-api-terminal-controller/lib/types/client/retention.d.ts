/** One reconnecting window hold, shared by all occurrences of a terminal. */
import type { ClientRemote } from '@deepseek-ai/dsh-api-gateway/client';
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import type { WebTerminalId } from '../types.ts';
import type { TerminalRemote } from './model.ts';
/** A stream acknowledgement gates output attachment for each physical connection. */
export declare class TerminalWindowHold {
    private readonly stream;
    private readonly waiters;
    private generation;
    private failure;
    /**
     * @param gateway - reconnecting stream owner.
     * @param remote - typed terminal namespace.
     * @param sessionId - saved layout's Session, without Agent activation.
     * @param id - existing Host terminal.
     */
    constructor(gateway: Pick<ClientRemote, '$stream'>, remote: TerminalRemote, sessionId: SessionId, id: WebTerminalId);
    /** Whether a terminal-domain failure ended this hold, allowing an explicit retry. */
    get failed(): boolean;
    /**
     * Wait for an acknowledged current physical hold before following its screen.
     * @param signal - output request or view lifetime.
     * @returns after acknowledgement, or rejects on cancellation/unavailability.
     */
    ready(signal: AbortSignal): Promise<void>;
    /**
     * Release this window's stream and all acknowledgement waiters.
     * @returns after the stream consumer closes.
     */
    dispose(): Promise<void>;
    private consume;
    private reject;
}
//# sourceMappingURL=retention.d.ts.map