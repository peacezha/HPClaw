/**
 * Lossless-JSON snapshots for the dependency-free source bootstrap closure.
 * @module @deepseek-ai/dsh-ptc-runtime-node/json-wire
 */
import type { PtcJsonValue } from '@deepseek-ai/dsh-ptc-runtime';
/**
 * Validate and detach one process-boundary value without loading another
 * workspace package at runtime. This mirrors the session-owned canonical
 * JSON boundary while remaining safe to import from the unbuilt bootstrap.
 * Its iterative traversal adds no JavaScript call-stack depth limit.
 *
 * @param value - the candidate completion value.
 * @returns a detached lossless-JSON snapshot, or `undefined` when invalid.
 */
export declare function snapshotPtcJsonValue(value: unknown): PtcJsonValue | undefined;
interface ArrayWireToken {
    kind: 'array';
    length: number;
}
interface ObjectWireToken {
    kind: 'object';
    keys: string[];
}
type PtcJsonToken = null | boolean | number | string | ArrayWireToken | ObjectWireToken;
/**
 * A pre-order, bounded-depth transport for one lossless JSON value. Container
 * markers and scalar leaves share one flat token array, so JSON serialization
 * does not recurse through the value's application nesting.
 */
export type PtcJsonWire = PtcJsonToken[];
/**
 * Flatten one validated JSON value for the process control channel.
 * @param value - the lossless JSON value to transport.
 * @returns a pre-order token stream whose own nesting is bounded.
 */
export declare function encodePtcJsonWire(value: PtcJsonValue): PtcJsonWire;
/**
 * Rebuild one lossless JSON value from the flat process wire format.
 * Malformed or incomplete traffic returns `undefined`; traversal is iterative
 * and therefore independent of the transported value's application depth.
 * @param input - untrusted message-port payload.
 * @returns the detached JSON value, or `undefined` when the wire is invalid.
 */
export declare function decodePtcJsonWire(input: unknown): PtcJsonValue | undefined;
export {};
//# sourceMappingURL=json-wire.d.ts.map