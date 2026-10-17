/**
 * Parent-owned durable subagent catalog events and their chunked projection.
 *
 * @module @deepseek-ai/dsh-subagent/catalog
 */
import { z } from 'zod';
import { appendChunkedList, chunkedListSchema, iterateChunkedList } from '@deepseek-ai/dsh-chunked-list';
/** Catalog payload version emitted by local child creation. */
export const SUBAGENT_CATALOG_VERSION = 0;
const sessionIdSchema = z.string();
const oneShotCatalogSchema = z.object({
    version: z.union([z.literal(0), z.literal(1)]),
    childId: sessionIdSchema,
    childCreatedAt: z.number().int().nonnegative(),
    mode: z.literal('one-shot'),
    label: z.string().optional(),
}).strict();
const continuableCatalogSchema = z.object({
    version: z.union([z.literal(0), z.literal(1)]),
    childId: sessionIdSchema,
    childCreatedAt: z.number().int().nonnegative(),
    mode: z.literal('continuable'),
    label: z.string(),
}).strict();
const externalCatalogSchema = oneShotCatalogSchema.extend({ version: z.literal(2), mode: z.literal('external') });
const unknownCatalogSchema = oneShotCatalogSchema.extend({ version: z.literal(1), mode: z.literal('unknown') });
const eventDataSchema = z.union([
    oneShotCatalogSchema,
    externalCatalogSchema,
    continuableCatalogSchema,
    unknownCatalogSchema,
]);
const viewSchema = z.array(z.union([
    oneShotCatalogSchema.omit({ version: true, childId: true, childCreatedAt: true }).extend({
        id: sessionIdSchema,
        createdAt: oneShotCatalogSchema.shape.childCreatedAt,
    }),
    externalCatalogSchema.omit({ version: true, childId: true, childCreatedAt: true }).extend({
        id: sessionIdSchema,
        createdAt: externalCatalogSchema.shape.childCreatedAt,
    }),
    continuableCatalogSchema.omit({ version: true, childId: true, childCreatedAt: true }).extend({
        id: sessionIdSchema,
        createdAt: continuableCatalogSchema.shape.childCreatedAt,
    }),
    unknownCatalogSchema.omit({ version: true, childId: true, childCreatedAt: true }).extend({
        id: sessionIdSchema,
        createdAt: unknownCatalogSchema.shape.childCreatedAt,
    }),
]));
const stateSchema = z.object({
    inheritedEventCount: z.number().int().nonnegative(),
    head: chunkedListSchema(eventDataSchema).optional(),
}).strict();
/**
 * Materialize complete and unknown-mode child identities from parent catalog events.
 * @param state - parent catalog fold state.
 * @returns current direct-child rows in parent catalog event order.
 */
function subagentCatalogEntries(state) {
    const entries = [];
    for (const data of iterateChunkedList(state.head)) {
        const { version: _version, childId, childCreatedAt, ...descriptor } = data;
        entries.push({ id: childId, createdAt: childCreatedAt, ...descriptor });
    }
    return entries;
}
/** Parent-owned direct-child catalog projection; invalid own facts reject restoration. */
export const subagentCatalogProjectionDefinition = {
    key: 'subagentCatalog',
    stateSchema,
    init: (_header, inheritedEventCount) => ({ inheritedEventCount }),
    apply: (state, event) => {
        if (event.type !== 'subagent/catalog' || event.seq < state.inheritedEventCount)
            return state;
        return { ...state, head: appendChunkedList(state.head, eventDataSchema.parse(event.data)) };
    },
    stateVersion: 6,
    wire: { viewSchema, view: subagentCatalogEntries },
};
/**
 * Append a complete direct-child discovery fact to its parent Session.
 * @param parent - durable direct parent receiving the discovery fact.
 * @param child - established child's immutable Session metadata.
 * @param descriptor - mode-discriminated creation label frozen with the child.
 */
export function establishCatalogChild(parent, child, descriptor) {
    parent.append('subagent/catalog', {
        version: SUBAGENT_CATALOG_VERSION,
        childId: child.id,
        childCreatedAt: child.createdAt,
        mode: descriptor.mode,
        label: descriptor.label,
    });
}
/** Catalog payload version emitted by external execution creation. */
const EXTERNAL_SUBAGENT_CATALOG_VERSION = 2;
/**
 * Record an external execution without a local child Session.
 * @param parent - durable direct parent receiving the discovery fact.
 * @param childId - identity returned by the external provider.
 * @param label - display label assigned by the caller.
 */
export function establishExternalCatalogChild(parent, childId, label) {
    parent.append('subagent/catalog', {
        version: EXTERNAL_SUBAGENT_CATALOG_VERSION,
        childId,
        childCreatedAt: Date.now(),
        mode: 'external',
        label,
    });
}
//# sourceMappingURL=catalog.js.map