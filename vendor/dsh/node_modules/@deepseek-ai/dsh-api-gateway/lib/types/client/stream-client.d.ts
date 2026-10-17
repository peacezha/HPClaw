import type { ConnectionWebSocket } from '@deepseek-ai/dsh-client-connection/client';
/** Physical Remote stream socket failure that may be retried by a domain transport. */
export declare class RemoteStreamCarrierError extends Error {
    /**
     * @param message - physical carrier failure description.
     * @param options - optional causal error.
     */
    constructor(message: string, options?: ErrorOptions);
}
/**
 * Keep one physical WebSocket and share it among independently cancellable
 * Remote streams. A carrier that supplies an in-process stream opener never
 * starts one.
 */
export declare class RemoteStreamMuxClient {
    private readonly openSocket;
    private readonly waitForReconnect;
    private socket;
    private cancelCandidate;
    private keepAlive;
    private revision;
    private readonly streams;
    private readonly waiters;
    private readonly socketClosures;
    private running;
    private disposed;
    private failure;
    /**
     * @param openSocket - selected authenticated carrier; omission uses the browser socket.
     * @param waitForReconnect - answering Clients wait for Connection to replace a lost socket; passive Clients fail later opens immediately.
     */
    constructor(openSocket?: (path: string) => ConnectionWebSocket, waitForReconnect?: boolean);
    /** Ensure a physical attempt exists, following the current attempt once if needed. */
    start(): void;
    /** Cancel the current socket or retry wait and start a fresh attempt immediately. */
    reconnect(): void;
    /**
     * Open one logical stream on the persistent physical connection.
     * After an established socket is lost, answering Clients wait for Connection
     * to reconnect or for their signal to abort; passive Clients reject immediately.
     * An initial socket failure rejects both modes.
     * @param endpoint - Typert Remote stream endpoint.
     * @param payload - endpoint request encoded on the wire.
     * @param signal - cancellation for this logical stream.
     * @param uplink - the Client's items: each is sent as an `item` frame, its end as `end`; its `return()`
     * runs when the stream finishes, and its failure cancels the stream and fails the downlink.
     * @returns Host items until completion, cancellation, or failure.
     */
    open(endpoint: string, payload: unknown, signal: AbortSignal, uplink?: AsyncIterable<unknown>): AsyncGenerator;
    /**
     * Send the caller's uplink items on this generation's socket. `stop()`
     * interrupts a pump blocked on `uplink.next()` and releases the iterator: a
     * handle's queue closes at once, so `send()` throws from then on, and any
     * other iterator's `return()` is invoked without being awaited because a
     * generator blocked in `next()` only completes it once it yields.
     */
    private pumpUplink;
    /**
     * Permanently stop the carrier, close the physical socket, and fail every
     * active logical stream.
     * @returns once the connection attempt and every physical socket have closed.
     */
    close(): Promise<void>;
    private connect;
    private waitForSocket;
    private receive;
    private lost;
    private maintain;
    private failAll;
    private send;
}
/**
 * Uplink items a stream handle queues for its carrier: the mux pump or the
 * in-process Host decoder iterates it as the stream's uplink. `end()` is the
 * Client half-close; `close()` marks the stream terminated, after which
 * `push()` throws. One consumer reads it, one read at a time.
 */
export declare class ClientUplinkQueue implements AsyncIterable<unknown>, AsyncIterator<unknown> {
    private readonly endpoint;
    private readonly items;
    private ended;
    private closed;
    private wake;
    /** @param endpoint - canonical Remote endpoint named by failures. */
    constructor(endpoint: string);
    /**
     * Queue one item for the carrier.
     * @param item - item the Host validates against the method's uplink codec.
     * @throws {Error} after `end()` or once the stream has terminated.
     */
    push(item: unknown): void;
    /** Half-close: the carrier reads the queued items, then `end`. Idempotent; ignored after termination. */
    end(): void;
    /** The carrier stopped reading: the logical stream terminated or was disposed. Idempotent. */
    close(): void;
    [Symbol.asyncIterator](): AsyncIterator<unknown>;
    /**
     * Take the next queued item, waiting for one; ends after `end()` or `close()`.
     * @returns the next item, or the end of the uplink.
     * @throws {Error} when a read is already pending.
     */
    next(): Promise<IteratorResult<unknown>>;
    /**
     * The carrier is done with the uplink: close it.
     * @returns the end of the uplink.
     */
    return(): Promise<IteratorResult<unknown>>;
    private signal;
}
//# sourceMappingURL=stream-client.d.ts.map