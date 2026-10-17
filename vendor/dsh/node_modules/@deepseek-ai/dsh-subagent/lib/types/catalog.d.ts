/**
 * Parent-owned durable subagent catalog events and their chunked projection.
 *
 * @module @deepseek-ai/dsh-subagent/catalog
 */
import { z } from 'zod';
import type { ChunkedList } from '@deepseek-ai/dsh-chunked-list';
import type { Session, SessionEvent, SessionHeader, SessionId, SessionLogOffset } from '@deepseek-ai/dsh-session';
import type { SubagentCatalogEntry } from './projection-types.ts';
/** Catalog payload version emitted by local child creation. */
export declare const SUBAGENT_CATALOG_VERSION = 0;
type KnownCatalogMode = {
    readonly mode: 'one-shot';
    readonly label?: string;
} | {
    readonly mode: 'continuable';
    readonly label: string;
};
/** Parent catalog v0 records local modes, v1 adds unknown children, and v2 records external executions. */
export type SubagentCatalogEvent = {
    readonly childId: SessionId;
    readonly childCreatedAt: number;
} & (({
    readonly version: 0;
} & KnownCatalogMode) | ({
    readonly version: 1;
} & (KnownCatalogMode | {
    readonly mode: 'unknown';
    readonly label?: string;
})) | {
    readonly version: 2;
    readonly mode: 'external';
    readonly label?: string;
});
declare module '@deepseek-ai/dsh-session/types' {
    interface SessionEventMap {
        /**
         * A direct child's identity and available discovery fields.
         * @param data - versioned parent-owned catalog entry.
         */
        'subagent/catalog': SubagentCatalogEvent;
    }
}
/** Host fold state for one parent catalog. */
export interface SubagentCatalogState {
    readonly inheritedEventCount: SessionLogOffset;
    readonly head?: ChunkedList<SubagentCatalogEvent> | undefined;
}
declare module '@deepseek-ai/dsh-session-projection/types' {
    interface SessionProjectionStateMap {
        subagentCatalog: SubagentCatalogState;
    }
}
/**
 * Materialize complete and unknown-mode child identities from parent catalog events.
 * @param state - parent catalog fold state.
 * @returns current direct-child rows in parent catalog event order.
 */
declare function subagentCatalogEntries(state: SubagentCatalogState): SubagentCatalogEntry[];
/** Parent-owned direct-child catalog projection; invalid own facts reject restoration. */
export declare const subagentCatalogProjectionDefinition: {
    key: "subagentCatalog";
    stateSchema: z.ZodType<SubagentCatalogState, unknown, z.core.$ZodTypeInternals<SubagentCatalogState, unknown>>;
    init: (_header: SessionHeader, inheritedEventCount: SessionLogOffset) => {
        inheritedEventCount: SessionLogOffset;
    };
    apply: (state: NoInfer<SubagentCatalogState>, event: SessionEvent) => SubagentCatalogState;
    stateVersion: number;
    wire: {
        viewSchema: z.ZodType<SubagentCatalogEntry[], unknown, z.core.$ZodTypeInternals<SubagentCatalogEntry[], unknown>>;
        view: typeof subagentCatalogEntries;
    };
};
/**
 * Append a complete direct-child discovery fact to its parent Session.
 * @param parent - durable direct parent receiving the discovery fact.
 * @param child - established child's immutable Session metadata.
 * @param descriptor - mode-discriminated creation label frozen with the child.
 */
export declare function establishCatalogChild(parent: Session, child: SessionHeader, descriptor: {
    readonly mode: 'continuable';
    readonly label: string;
}): void;
/**
 * Record an external execution without a local child Session.
 * @param parent - durable direct parent receiving the discovery fact.
 * @param childId - identity returned by the external provider.
 * @param label - display label assigned by the caller.
 */
export declare function establishExternalCatalogChild(parent: Session, childId: SessionId, label: string): void;
export {};
//# sourceMappingURL=catalog.d.ts.map