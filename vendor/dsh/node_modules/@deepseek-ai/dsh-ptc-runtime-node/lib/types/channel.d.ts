import type { Duplex } from 'node:stream';
/** One co-shipped process channel; the consumer owns frame validation and terminal outcomes. */
export declare class JsonChannel {
    private readonly stream;
    private readonly maxBytes;
    private readonly receive;
    private readonly failure;
    private readonly header;
    private headerBytes;
    private payload;
    private payloadBytes;
    private queuedBytes;
    private closed;
    private readonly writes;
    constructor(stream: Duplex, maxBytes: number, receive: (message: unknown, bytes: number) => void, failure: (error: Error, kind: 'io' | 'protocol') => void);
    private readonly onError;
    private readonly onClose;
    private readonly onEnd;
    private readonly onData;
    /**
     * Submit a bounded frame immediately and await the stream's write receipt.
     * @param message - JSON-only co-shipped protocol value.
     * @returns Resolves when this frame has been written, or rejects after transport failure.
     */
    send(message: unknown): Promise<void>;
    private finishWrites;
    /** Stop reads and close the owned endpoint; pending writes reject on closure. */
    close(): void;
    /** Wait for accepted writes to finish or fail. */
    drain(): Promise<void>;
}
//# sourceMappingURL=channel.d.ts.map