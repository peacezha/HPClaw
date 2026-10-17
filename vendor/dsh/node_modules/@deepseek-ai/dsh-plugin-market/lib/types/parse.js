/** Decoding, JSON parsing, and format validation of a fetched index body; the parse Worker runs it. */
import { MarketIndexError, parseMarketIndex } from '@deepseek-ai/dsh-plugin-market-index';
/**
 * Decode a body as strict UTF-8, parse it as JSON, and validate it as format 1.
 * @param body - the complete response body.
 * @param url - the index URL relative icon references resolve against.
 * @returns the validated index, or the first violation.
 */
export function parseIndexBody(body, url) {
    let text;
    try {
        text = new TextDecoder('utf-8', { fatal: true }).decode(body);
    }
    catch {
        // A fatal TextDecoder throws only for malformed UTF-8.
        return { ok: false, path: '$', reason: 'must be UTF-8', message: 'must be UTF-8' };
    }
    let value;
    try {
        value = JSON.parse(text);
    }
    catch (error) {
        const reason = `must be JSON: ${error.message}`;
        return { ok: false, path: '$', reason, message: reason };
    }
    try {
        return { ok: true, index: parseMarketIndex(value, url) };
    }
    catch (error) {
        /* v8 ignore next -- parseMarketIndex throws nothing but its own validation failure */
        if (!(error instanceof MarketIndexError))
            throw error;
        return { ok: false, path: error.path, reason: error.reason, message: error.message };
    }
}
//# sourceMappingURL=parse.js.map