/**
 * Materializes script VM values as plain JSON and renders thrown values.
 * Getters and proxy traps may execute inside the confined Node process;
 * process isolation and cancellation belong to PTC, not the VM.
 * @module @deepseek-ai/dsh-workflow-ptc/realm
 */
/** Thrown by {@link materializeFromRealm}; the caller wraps it into the right `WorkflowError` code. */
export declare class MaterializeError extends Error {
    readonly path: string;
    readonly reason: string;
    constructor(path: string, reason: string);
}
/**
 * Render a thrown value to failure text without ever throwing: prefer the
 * `stack` (host or realm — a realm error's `stack` is a plain string read),
 * fall back to `message`, then `String()`. Reading those properties MAY run
 * script code; if that code itself throws, a fixed label is returned instead.
 * @param error - any value thrown in the host or guest realm.
 * @returns human-readable text for the failure report; prefers the stack.
 */
export declare function renderThrown(error: unknown): string;
/**
 * Copy `value` (typically from the vm realm) into plain host JSON data. Root `undefined` is
 * returned unchanged; nested `undefined` and values JSON cannot represent losslessly fail
 * with the offending path. Property accessors run normally, and a throwing read is wrapped
 * with its rendered failure.
 *
 * @param value - the realm value to materialize.
 * @param root - the path label for the root value (error messages).
 * @returns the host-realm copy (plain objects/arrays/scalars only).
 * @throws {@link MaterializeError} for unsupported values, cycles, sparse arrays, exotic
 *   prototypes, or property reads that throw.
 */
export declare function materializeFromRealm(value: unknown, root?: string): unknown;
//# sourceMappingURL=realm.d.ts.map