/** Host WebSocket owner for multiplexed Typert Remote streams. */
import { Deque } from '@deepseek-ai/dsh-deque';
import { RemoteError, remoteErrorOf } from '@deepseek-ai/dsh-typert-protocol';
import WebSocket, { WebSocketServer } from 'ws';
import { parseRemoteStreamClientMessage, } from "./stream-protocol.js";
const MAX_MISSED_HEARTBEATS = 2;
/** Own the no-server WebSocket acceptor and every active logical stream. */
export class RemoteStreamMuxServer {
    open;
    failure;
    heartbeatIntervalMs;
    streamInboxBytes;
    server = new WebSocketServer({ noServer: true });
    connections = new Set();
    missedHeartbeats = new WeakMap();
    heartbeatTimer;
    /**
     * @param open - Gateway stream dispatcher.
     * @param failure - Gateway error-to-wire mapper.
     * @param heartbeatIntervalMs - interval between WebSocket Ping control frames.
     * @param streamInboxBytes - buffered uplink frame bytes one logical stream may hold before it fails.
     */
    constructor(open, failure, heartbeatIntervalMs, streamInboxBytes) {
        this.open = open;
        this.failure = failure;
        this.heartbeatIntervalMs = heartbeatIntervalMs;
        this.streamInboxBytes = streamInboxBytes;
    }
    /**
     * Upgrade one admitted request and begin serving its logical streams. Every
     * stream the socket opens speaks for the Peer admitted at upgrade, and the
     * socket closes when that Peer's scope is disposed.
     * @param req - authenticated HTTP upgrade request.
     * @param socket - carrier socket transferred to the WebSocket server.
     * @param head - bytes already read after the HTTP upgrade headers.
     * @param peer - Peer the upgrade was admitted as.
     */
    handleUpgrade(req, socket, head, peer) {
        this.server.handleUpgrade(req, socket, head, (websocket) => {
            const release = bindPeer(websocket, peer);
            if (release === undefined)
                return;
            const alive = () => { this.missedHeartbeats.set(websocket, 0); };
            alive();
            this.startHeartbeat();
            const bound = (endpoint, payload, uplink, control, window) => this.open(endpoint, payload, uplink, peer, control, window);
            const connection = new RemoteStreamMuxConnection(websocket, bound, this.failure, this.streamInboxBytes, alive);
            const done = connection.run().catch((error) => {
                console.error('[api-gateway] Remote stream connection failed:', error);
            }).then(async () => { await release(); }).catch((error) => {
                console.error('[api-gateway] Remote stream scope cleanup failed:', error);
            });
            this.connections.add(done);
            void done.then(() => { this.connections.delete(done); });
        });
    }
    /** Terminate all sockets and wait until every iterator has returned. */
    async close() {
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = undefined;
        for (const socket of this.server.clients)
            socket.terminate();
        const closed = Promise.withResolvers();
        this.server.close((error) => {
            if (error === undefined)
                closed.resolve();
            else
                closed.reject(error);
        });
        await closed.promise;
        await Promise.all(this.connections);
    }
    /** Start one `unref()` timer after the first upgrade; it spans empty-client periods until close(). */
    startHeartbeat() {
        if (this.heartbeatTimer !== undefined)
            return;
        this.heartbeatTimer = setInterval(() => {
            for (const socket of this.server.clients) {
                if (socket.readyState !== WebSocket.OPEN)
                    continue;
                const missed = this.missedHeartbeats.get(socket);
                if (missed >= MAX_MISSED_HEARTBEATS) {
                    setImmediate(() => {
                        if (this.missedHeartbeats.get(socket) >= MAX_MISSED_HEARTBEATS) {
                            socket.terminate();
                        }
                    });
                    continue;
                }
                this.missedHeartbeats.set(socket, missed + 1);
                socket.ping();
            }
        }, this.heartbeatIntervalMs);
        this.heartbeatTimer.unref();
    }
}
class RemoteStreamMuxConnection {
    socket;
    open;
    failure;
    streamInboxBytes;
    alive;
    streams = new Map();
    writes = Promise.resolve();
    constructor(socket, open, failure, streamInboxBytes, alive) {
        this.socket = socket;
        this.open = open;
        this.failure = failure;
        this.streamInboxBytes = streamInboxBytes;
        this.alive = alive;
    }
    /**
     * Serve frames until the socket closes. A Pong, any received frame, and a
     * downlink write that waited in the local send buffer and then completed
     * count as peer activity, so a congested link that delays the Pong behind
     * data keeps its socket. A write that completes at once proves nothing
     * about the peer and does not count.
     */
    async run() {
        const closed = new Promise((resolve) => {
            this.socket.once('close', resolve);
            this.socket.once('error', () => { this.socket.terminate(); });
            this.socket.on('pong', this.alive);
            this.socket.on('message', (data, isBinary) => {
                this.alive();
                if (isBinary) {
                    this.socket.close(1003, 'text messages required');
                    return;
                }
                try {
                    this.receive(rawText(data));
                }
                catch {
                    this.socket.close(1008, 'invalid Remote stream request');
                }
            });
        });
        await closed;
        const active = [...this.streams.values()];
        for (const stream of active)
            stream.stop(new Error('Remote stream socket closed'));
        await Promise.all(active.map(stream => stream.done));
    }
    /**
     * Dispatch one frame. `item`, `end`, and `cancel` for a stream this connection
     * no longer owns are dropped: a finished stream leaves the table while the
     * Client's in-flight frames are still arriving. A duplicate `open` is the one
     * protocol violation that closes the socket.
     */
    receive(text) {
        const message = parseRemoteStreamClientMessage(text);
        switch (message.type) {
            case 'open': {
                this.openStream(message);
                return;
            }
            case 'item': {
                this.streams.get(message.streamId)?.inbox.push(message.value, Buffer.byteLength(text, 'utf8'));
                return;
            }
            case 'end': {
                this.streams.get(message.streamId)?.inbox.end();
                return;
            }
            case 'cancel': {
                this.streams.get(message.streamId)?.stop(new Error('Remote stream cancelled'));
                return;
            }
            /* v8 ignore next 4 -- parseRemoteStreamClientMessage admits only the four frame types above. */
            default: {
                const unknown = message;
                throw new Error(`api gateway: unknown Remote stream client message ${JSON.stringify(unknown)}`);
            }
        }
    }
    openStream(message) {
        if (this.streams.has(message.streamId)) {
            throw new Error(`api gateway: duplicate Remote stream id ${JSON.stringify(message.streamId)}`);
        }
        const abort = new AbortController();
        // Created before the opener resolves so items the Client sends right
        // after `open` wait in the inbox instead of being lost.
        const inbox = new UplinkInbox(this.streamInboxBytes, message.endpoint, (error) => { abort.abort(error); });
        const active = {
            abort,
            inbox,
            stop: (reason) => {
                abort.abort(reason);
                inbox.fail(reason);
            },
            done: Promise.resolve(),
        };
        this.streams.set(message.streamId, active);
        const done = this.pump(message.streamId, message.endpoint, message.payload, active);
        active.done = done;
        const remove = () => { this.streams.delete(message.streamId); };
        void done.then(remove, remove);
    }
    async pump(streamId, endpoint, payload, active) {
        let outcome;
        try {
            const source = await this.open(endpoint, payload, active.inbox, active.abort, {
                maxBytes: this.streamInboxBytes,
                frameOverheadBytes: Buffer.byteLength(JSON.stringify({ type: 'item', streamId, value: null }), 'utf8') - 'null'.length,
            });
            for await (const value of source) {
                await this.send({ type: 'item', streamId, value });
            }
            outcome = { failed: false };
        }
        catch (error) {
            outcome = { failed: true, error };
        }
        // The downlink has settled; later uplink frames cannot change the outcome.
        active.inbox.fail(new Error('Remote stream ended'));
        if (active.abort.signal.aborted) {
            // A Remote failure as the abort reason is the Gateway or this mux failing
            // the stream (a rejected or overflowing uplink item, or an item after
            // end); the Client is still waiting for that terminal frame. Any other
            // abort is a cancellation.
            const reason = active.abort.signal.reason;
            if (remoteErrorOf(reason) !== undefined)
                await this.sendFailure(streamId, reason);
            return;
        }
        if (outcome.failed) {
            await this.sendFailure(streamId, outcome.error);
            return;
        }
        try {
            await this.send({ type: 'end', streamId });
        }
        catch (error) {
            await this.sendFailure(streamId, error);
        }
    }
    async sendFailure(streamId, error) {
        if (this.socket.readyState !== WebSocket.OPEN)
            return;
        try {
            await this.send({ type: 'error', streamId, error: this.failure(error) });
        }
        catch {
            // A terminal frame that cannot be encoded or written leaves the
            // logical stream ambiguous, so fail the physical generation.
            this.socket.close(1011, 'Remote stream failure could not be delivered');
        }
    }
    send(message) {
        let text;
        try {
            text = JSON.stringify(message);
        }
        catch (cause) {
            return Promise.reject(new Error('api gateway: Remote stream item is not JSON serializable', { cause }));
        }
        const delivery = this.writes.then(() => new Promise((resolve, reject) => {
            if (this.socket.readyState !== WebSocket.OPEN) {
                reject(new Error('api gateway: Remote stream socket is closed'));
                return;
            }
            let queued = false;
            this.socket.send(text, (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (queued)
                    this.alive();
                resolve();
            });
            // Read after send(): bytes still buffered mean the local send buffer was
            // full, so their completion requires the peer to acknowledge data.
            queued = this.socket.bufferedAmount > 0;
        }));
        this.writes = delivery.catch(() => undefined);
        return delivery;
    }
}
const UPLINK_DONE = { value: undefined, done: true };
/**
 * Bounded single-consumer uplink queue of one logical stream, the source the
 * Host method reads through `invocation.uplink()`. Buffered frame bytes are
 * capped: overflow, and an item after the Client's `end`, fail the queue and
 * report a Remote failure that the connection uses to fail the logical stream.
 */
class UplinkInbox {
    maxBytes;
    endpoint;
    onViolation;
    queue = new Deque();
    bytes = 0;
    ended = false;
    closed = false;
    taken = false;
    failure;
    wake;
    constructor(maxBytes, endpoint, onViolation) {
        this.maxBytes = maxBytes;
        this.endpoint = endpoint;
        this.onViolation = onViolation;
    }
    push(value, frameBytes) {
        if (this.failure !== undefined || this.closed)
            return;
        if (this.ended) {
            this.violate(new RemoteError('gateway/protocol', 'api gateway: Remote stream uplink item after end', { endpoint: this.endpoint }));
            return;
        }
        if (this.bytes + frameBytes > this.maxBytes) {
            this.violate(new RemoteError('gateway/uplink-overflow', `api gateway: Remote stream uplink exceeded ${String(this.maxBytes)} buffered bytes`, { endpoint: this.endpoint }));
            return;
        }
        this.queue.pushBack({ value, bytes: frameBytes });
        this.bytes += frameBytes;
        this.signal();
    }
    /** Client half-close; idempotent. */
    end() {
        if (this.ended)
            return;
        this.ended = true;
        this.signal();
    }
    /** End the consumer's next read with `error`; idempotent, drops buffered items. */
    fail(error) {
        if (this.failure !== undefined)
            return;
        this.failure = error;
        this.queue.clear();
        this.bytes = 0;
        this.signal();
    }
    [Symbol.asyncIterator]() {
        if (this.taken)
            throw new Error('api gateway: Remote stream uplink inbox already has a consumer');
        this.taken = true;
        return this;
    }
    async next() {
        while (true) {
            if (this.closed)
                return UPLINK_DONE;
            const entry = this.queue.popFront();
            if (entry !== undefined) {
                this.bytes -= entry.bytes;
                return { value: entry.value, done: false };
            }
            if (this.failure !== undefined)
                throw this.failure;
            if (this.ended)
                return UPLINK_DONE;
            if (this.wake !== undefined)
                throw new Error('api gateway: Remote stream uplink inbox has one pending read');
            await new Promise((resolve) => { this.wake = resolve; });
        }
    }
    /** Consumer stopped reading: later items are dropped, a pending read ends. */
    return() {
        this.closed = true;
        this.queue.clear();
        this.bytes = 0;
        this.signal();
        return Promise.resolve(UPLINK_DONE);
    }
    violate(error) {
        this.fail(error);
        this.onViolation(error);
    }
    signal() {
        const wake = this.wake;
        this.wake = undefined;
        wake?.();
    }
}
/**
 * Close the socket when the Peer's scope is disposed. A scope that is already
 * disposed leaves no Peer for the socket to speak for, so the socket closes now.
 * @returns the registration's disposer, or `undefined` when the socket was closed.
 */
function bindPeer(websocket, peer) {
    try {
        return peer.ctx.effect(() => () => { websocket.close(1001, 'peer left'); }, 'api-gateway: Remote stream socket bound to its Peer');
    }
    catch {
        websocket.close(1001, 'peer left');
        return undefined;
    }
}
function rawText(data) {
    if (Array.isArray(data))
        return Buffer.concat(data).toString('utf8');
    if (data instanceof ArrayBuffer)
        return Buffer.from(data).toString('utf8');
    return Buffer.from(data).toString('utf8');
}
/**
 * Reject an upgrade without transferring socket ownership to ws.
 * @param socket - carrier socket that receives the HTTP rejection.
 * @param status - authentication or browser-trust rejection status.
 */
export function rejectRemoteStreamUpgrade(socket, status) {
    const reason = status === 401 ? 'Unauthorized' : status === 403 ? 'Forbidden' : 'Conflict';
    const body = reason.toLowerCase();
    socket.end([
        `HTTP/1.1 ${String(status)} ${reason}`,
        'Connection: close',
        'Content-Type: text/plain; charset=utf-8',
        `Content-Length: ${String(Buffer.byteLength(body))}`,
        '',
        body,
    ].join('\r\n'));
}
//# sourceMappingURL=stream-server.js.map