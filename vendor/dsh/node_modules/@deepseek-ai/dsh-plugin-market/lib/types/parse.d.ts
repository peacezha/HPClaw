/** Decoding, JSON parsing, and format validation of a fetched index body; the parse Worker runs it. */
import { type MarketIndex } from '@deepseek-ai/dsh-plugin-market-index';
/** A validated index, or the JSON path, rule, and diagnostic of the first violation; `$` covers UTF-8 and JSON errors. */
export type IndexParseResult = {
    readonly ok: true;
    readonly index: MarketIndex;
} | {
    readonly ok: false;
    readonly path: string;
    readonly reason: string;
    readonly message: string;
};
/** The request a parse Worker receives as `workerData`. */
export interface IndexParseRequest {
    readonly body: Uint8Array;
    readonly url: string;
}
/**
 * Decode a body as strict UTF-8, parse it as JSON, and validate it as format 1.
 * @param body - the complete response body.
 * @param url - the index URL relative icon references resolve against.
 * @returns the validated index, or the first violation.
 */
export declare function parseIndexBody(body: Uint8Array, url: string): IndexParseResult;
//# sourceMappingURL=parse.d.ts.map