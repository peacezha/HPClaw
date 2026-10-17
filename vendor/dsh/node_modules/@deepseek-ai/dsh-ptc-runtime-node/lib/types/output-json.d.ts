/** JSON string-prefix accounting for the outer-output ledger. @module @deepseek-ai/dsh-ptc-runtime-node/output-json */
import type { PtcJsonValue } from '@deepseek-ai/dsh-ptc-runtime';
/**
 * Measure one JSON string without materializing its complete escaped form.
 * @param text - the candidate string.
 * @param maxBytes - largest serialized size the caller can admit.
 * @returns Exact serialized bytes, or `undefined` as soon as the cap is crossed.
 */
export declare function jsonStringBytesUpTo(text: string, maxBytes: number): number | undefined;
/**
 * Measure one lossless JSON value without allocating its serialized form.
 * @param value - already validated lossless JSON.
 * @param maxBytes - largest serialized size the caller can admit.
 * @returns Exact serialized bytes, or `undefined` as soon as the cap is crossed.
 */
export declare function jsonValueBytesUpTo(value: PtcJsonValue, maxBytes: number): number | undefined;
/**
 * Return the longest code-point-aligned prefix whose JSON string encoding,
 * including its surrounding quotes, fits `maxBytes`.
 *
 * @param text - the candidate string.
 * @param maxBytes - serialized JSON-string bytes available.
 * @returns the fitting prefix, or an empty string when even useful content cannot fit.
 */
export declare function truncateJsonStringBytes(text: string, maxBytes: number): string;
//# sourceMappingURL=output-json.d.ts.map