import type { IndexParseResult } from './parse.ts';
/**
 * Run `parseIndexBody` in a fresh Worker Thread. The body's buffer is transferred to the Worker and is unusable
 * afterwards; the result is copied back by structured clone.
 * @param body - the complete response body; it must own its whole buffer.
 * @param url - the index URL.
 * @param signal - terminates the Worker and rejects with the signal's reason.
 * @returns the Worker's result.
 * @throws the abort reason, or an Error when the Worker fails, exits without a result, or reports an unexpected value.
 */
export declare function parseIndexInWorker(body: Uint8Array, url: string, signal: AbortSignal): Promise<IndexParseResult>;
//# sourceMappingURL=parse-thread.d.ts.map