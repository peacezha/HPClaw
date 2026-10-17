/**
 * React-free Client access state: the latest `remoteAccess/follow` snapshot
 * and identity-stable boolean sources per resource and action.
 * @module @deepseek-ai/dsh-api-remote-access/src/client/state
 */
import type { HostObservable } from '@deepseek-ai/dsh-client-ui-slots';
import type { RemoteAccessFrame } from '../types.ts';
/** The opening frame of a snapshot generation. */
export type Baseline = Extract<RemoteAccessFrame, {
    type: 'baseline';
}>;
/**
 * Validate the opening baseline an index injection row assigned to the page.
 * @param value - the injected global; `undefined` when the page carries none.
 * @returns the baseline, or `undefined` when none was injected.
 * @throws TypeError when the injected value is not a baseline frame.
 */
export declare function parseInjectedBaseline(value: unknown): Baseline | undefined;
/**
 * Snapshot owner for one Client generation. Sources are cached per
 * `(kind, id, action)` so Hook bindings keep their identity; each source
 * computes its boolean from the current snapshot.
 */
export declare class ClientAccessState {
    private snapshot;
    /** @param initial - the page's injected opening baseline; without one every answer is false until a baseline arrives. */
    constructor(initial?: Baseline);
    private readonly listeners;
    private readonly sources;
    /**
     * Answer for one action on the global resource.
     * @param action - endpoint action the caller may invoke.
     * @returns identity-stable boolean source.
     */
    global(action: string): HostObservable<boolean>;
    /**
     * Answer for one action on one resource of a declared kind.
     * @param kind - declared resource kind.
     * @param id - resource identity.
     * @param action - endpoint action the caller may invoke.
     * @returns identity-stable boolean source.
     */
    resource(kind: string, id: string, action: string): HostObservable<boolean>;
    /**
     * Replace the snapshot from one generation's opening frame.
     * @param frame - owner or non-owner baseline.
     */
    replace(frame: Baseline): void;
    /**
     * Apply one increment of the current generation.
     * @param frame - `upsert` or `remove`.
     */
    update(frame: Exclude<RemoteAccessFrame, {
        type: 'baseline';
    }>): void;
    /** Whether the current snapshot is the owner's, whose answers never depend on the stream. */
    get owner(): boolean;
    /** The stream failed terminally: the owner keeps every answer; a non-owner's answers become false. */
    unavailable(): void;
    private cached;
    private publish;
}
//# sourceMappingURL=state.d.ts.map