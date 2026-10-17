/**
 * node:http ↔ WHATWG fetch bridge for the /api transport (host side of the
 * web carrier; the fetch-shaped handler itself is transport-agnostic).
 */
import type { IncomingMessage } from 'node:http';
import type { PeerScope } from '@deepseek-ai/dsh-typert-protocol';
import type { ConnectionFetchHandler } from './rpc.ts';
/** Default carrier cap for all HTTP RPC bodies: sized for the default
 * aggregate image limit (200 MiB) after base64 expansion plus envelope
 * headroom (~267.7 MiB required), rounded up for slack. The bridge buffers
 * each body in memory, so this cap is also the per-request resident bound. */
export declare const DEFAULT_MAX_REQUEST_BODY_BYTES: number;
interface BridgeServerResponse {
    readonly destroyed: boolean;
    readonly writableEnded: boolean;
    on(event: 'close', listener: () => void): this;
    off(event: 'close' | 'drain', listener: () => void): this;
    once(event: 'close' | 'drain', listener: () => void): this;
    writeHead(statusCode: number, headers?: Record<string, string>): unknown;
    write(chunk: Uint8Array): boolean;
    end(): unknown;
}
/**
 * Bridge one node:http request to the fetch-shaped handler (client close
 * aborts; response writes respect backpressure and stop on disconnect).
 * @param req - incoming node:http request.
 * @param res - node:http response the bridge writes and owns to completion.
 * @param apiHandler - fetch-shaped API carrier the request is dispatched to.
 * @param peer - Peer the carrier admitted the request as.
 * @param maxRequestBodyBytes - maximum bytes buffered for a buffered route.
 */
export declare function bridge(req: IncomingMessage, res: BridgeServerResponse, apiHandler: ConnectionFetchHandler, peer: PeerScope, maxRequestBodyBytes?: number): Promise<void>;
export {};
//# sourceMappingURL=http-bridge.d.ts.map