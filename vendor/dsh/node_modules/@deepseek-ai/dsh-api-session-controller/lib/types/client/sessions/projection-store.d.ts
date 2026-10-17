/**
 * Generic per-session projection value store (push model; see the
 * session-projection subsystem page, docs/subsystems/session-projection.md):
 * the host is the only computation site; the client holds finished whole
 * values per key in one of two row kinds. A `sequenced` row
 * (`{ value, seq }`) comes from the connected Host — a follow opening
 * baseline, a Session Controller `projection` frame, a list block the Host
 * computed for an attached Session — and merges under **higher seq wins**
 * against other sequenced rows. A `cached` row (`{ value }`) comes from
 * a Host view of the persisted checkpoint, carries no comparable
 * seq, and yields to every sequenced write. No client-side domain folding
 * exists: a domain ships projection support with zero client code. Per-key
 * bare observable faces feed `useProjection` (ui-renderer binds them).
 */
import type { SessionProjectionMap } from '@deepseek-ai/dsh-session-projection/types';
import type { SessionSeqCursor } from '@deepseek-ai/dsh-session/types';
import type { ObservableSnapshot } from '@deepseek-ai/dsh-client-store';
export type { SessionProjectionMap } from '@deepseek-ai/dsh-session-projection/types';
/**
 * The fifth framework hook seat (see the session-projection subsystem page,
 * docs/subsystems/session-projection.md): key-addressed
 * projection reader delivered through the standard kit. `undefined` uniformly
 * means capability absent — host unit unmounted, or no baseline/frame has
 * carried the key yet. The selector overload mirrors useSession (per-key uSES
 * binding; reference stability holds because a key's value reference changes
 * only when a frame or baseline lands).
 */
export type UseProjection = {
    <K extends Extract<keyof SessionProjectionMap, string>>(key: K): SessionProjectionMap[K] | undefined;
    <K extends Extract<keyof SessionProjectionMap, string>, S>(key: K, selector: (value: SessionProjectionMap[K] | undefined) => S, eq?: (a: S, b: S) => boolean): S;
};
/**
 * Follow-opening projection baseline, restated here so the
 * React-free store depends only on the type table, not the wire package's
 * response vocabulary.
 */
export interface ProjectionsBaseline {
    /** The consistent-cut seq (equals the window tail seq by construction). */
    asOfSeq: SessionSeqCursor;
    /** Whole current values by key; a registered key absent here means the capability is absent. */
    values: Readonly<Record<string, unknown>>;
}
/**
 * One session's projection values. Framework semantics, uniform across every
 * key. Sequenced writes (a baseline seeds rows at its cut, a push frame
 * updates one row) compare seqs among themselves: a lower-or-equal seq within
 * the Host generation loses, so a replayed frame cannot regress a value and a
 * stale baseline cannot overwrite a newer frame. Cached writes (the session
 * list's zero-I/O block) only fill keys no sequenced row holds, and a baseline
 * discards every cached row before it seeds, regardless of seq: the connected
 * Session is the truth and a cached value never outranks it. A key the store
 * has never seen reads `undefined` (capability absent). Faces are identity-stable
 * per key (create-on-demand, cached) so the React side binds each exactly
 * once; the store-level channel (`subscribeAny`) serves coarse consumers (the
 * manager's list projection reads the `title` key).
 */
export declare class ProjectionValueStore {
    private readonly rows;
    private readonly channels;
    private valuesCache;
    /** Coarse any-key channel (no snapshot cache to rebuild: reads hit rows directly). */
    private readonly anyNotifier;
    /**
     * Key-addressed bare observable face (the useProjection resolution path).
     * Always defined — absence is an `undefined` snapshot, never a missing
     * face, so a component may subscribe before the key ever carries a value.
     * @param key - projection key.
     * @returns the identity-stable face for this key.
     */
    faceOf(key: string): ObservableSnapshot<unknown>;
    /**
     * Current whole value for a key (erased framework read; typed reads go
     * through `useProjection`'s map lookup).
     * @param key - projection key.
     * @returns the value, or undefined while the key is absent.
     */
    get(key: string): unknown;
    /**
     * Read the accepted Host watermark without subscribing or copying a value.
     * @param key - projection key.
     * @returns the current sequence, or undefined for absent and cached values.
     */
    seqOf(key: string): SessionSeqCursor | undefined;
    /**
     * Read every current projection value as one reference-stable snapshot.
     * @returns The same frozen value map until a row changes.
     */
    values(): Readonly<Partial<SessionProjectionMap>>;
    /**
     * Subscribe to any-key changes (microtask-batched) — the manager's list
     * rebuild channel.
     * @param listener - change callback.
     * @returns the unsubscribe function.
     */
    subscribeAny(listener: () => void): () => void;
    /**
     * Apply one finished value from the Session control stream.
     * @param key - projection key.
     * @param value - whole value computed by the host unit.
     * @param seq - the unit's watermark at emission.
     */
    apply(key: string, value: unknown, seq: SessionSeqCursor): void;
    /**
     * Fill keys from a Host block labeled `cached`: a zero-I/O
     * view of the persisted checkpoint. A cached value lands only where no
     * sequenced row exists: a connected Session has already answered for such
     * a key, and the list's view of the persisted checkpoint cannot be newer
     * than it.
     * @param values - whole values by key viewed from the persisted checkpoint.
     */
    applyCached(values: Readonly<Record<string, unknown>>): void;
    /**
     * Seed from a history tail page's projections block. Every cached row is
     * discarded first, regardless of seq: the block comes from the connected
     * Session, and a value viewed from the persisted checkpoint never outranks
     * it. Then every carried key lands under the same seq rule as frames, and a
     * key the block omits is capability-absent as of the cut — its row clears
     * unless a newer frame already superseded the cut (a stale baseline can
     * neither overwrite nor clear newer sequenced values).
     * @param baseline - the response's projections block.
     */
    seed(baseline: ProjectionsBaseline): void;
    /** Discard one Host generation's values and watermarks while preserving subscribed faces. */
    clear(): void;
    private changed;
    private channel;
}
//# sourceMappingURL=projection-store.d.ts.map