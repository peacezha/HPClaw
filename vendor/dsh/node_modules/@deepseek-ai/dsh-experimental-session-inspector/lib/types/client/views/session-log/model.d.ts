/** Incremental raw Session rows with lossless Assistant stream children. */
import type { SessionEventSource } from '@deepseek-ai/dsh-api-session-controller/client';
import { type ObservableSnapshot } from '@deepseek-ai/dsh-client-store';
import type { InspectorRecord, InspectorRow } from '../table-model.ts';
import type { InspectorPickTarget } from '../chat-node/pick-match.ts';
import type { SessionLogAnchor } from './chat-target.ts';
/** Session-owned log projection; subscriptions exist only while the table is observed. */
export declare class SessionLogModel implements ObservableSnapshot<readonly InspectorRow[]> {
    private readonly source;
    private readonly rows;
    private readonly records;
    private readonly roots;
    private readonly attempts;
    private groups;
    /** Preserve live-to-durable row identities only while their rows remain in the loaded window. */
    private readonly settledRoots;
    private readonly streams;
    private revision;
    private subscribers;
    private disconnect;
    /**
     * @param source - The existing Session window, shared with Chat and Trajectory.
     */
    constructor(source: SessionEventSource);
    /** @returns Stable table order; row contents have independent sources. */
    getSnapshot: () => readonly InspectorRow[];
    /**
     * Recover an event's placement without interpreting formatted table cells.
     * @param key - Selected root or delta row.
     * @returns The owning event and chunk, or undefined if the row is unavailable.
     */
    chatAnchor(key: string): SessionLogAnchor | undefined;
    /**
     * Resolve a picked Chat object in the loaded log, without creating synthetic records.
     * @param target - DOM identity enriched with the owning Chat Node's sequence and Turn/Step.
     * @returns Tool call, exact anchor, Assistant, Step, or Turn row; reasoning parts prefer a block-start child.
     */
    pick(target: InspectorPickTarget): string | undefined;
    /** @param listener - Structural invalidation callback. @returns Subscription disposer. */
    subscribe: (listener: () => void) => (() => void);
    /**
     * Obtain a cached row source, initially empty when its record is unavailable.
     * @param key - Stable table row identity.
     * @returns Its independently observable raw data.
     */
    row: (key: string) => ObservableSnapshot<InspectorRecord | undefined>;
    private put;
    private accept;
    private prune;
    private root;
    private add;
    private addChunk;
}
//# sourceMappingURL=model.d.ts.map