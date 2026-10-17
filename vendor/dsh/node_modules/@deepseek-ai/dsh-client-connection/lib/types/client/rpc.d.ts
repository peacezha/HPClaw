/** Browser caller for generic Connection unary RPC channels. */
import type { ClientConnectionRpc } from '../rpc.ts';
/**
 * Transport this caller posts through; same signature as the global `fetch`.
 * Receives the document-relative route so a carrier resolves it against its own base.
 */
export type RpcFetch = (input: string | URL, init: RequestInit) => Promise<Response>;
/** Worker-local opener for decoded Gateway Remote streams; `uplink` carries the Client's items for the stream. */
export type RpcStreamOpen = (endpoint: string, payload: unknown, signal: AbortSignal, uplink?: AsyncIterable<unknown>) => AsyncIterable<unknown>;
/**
 * Create the browser-backed generic RPC caller.
 * @param doFetch - transport override; defaults to the page's global fetch.
 * @param openStream - optional worker-local Gateway stream carrier.
 * @returns caller that owns request correlation and response-envelope validation.
 */
export declare function createWebConnectionRpc(doFetch?: RpcFetch, openStream?: RpcStreamOpen): ClientConnectionRpc;
//# sourceMappingURL=rpc.d.ts.map