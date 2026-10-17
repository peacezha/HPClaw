/** Read-only projection of the current Cordis Loader plugin entries. */
import type { Context } from '@deepseek-ai/cordis';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import type { PluginEntryId, PluginInventorySnapshot } from './types.ts';
export type * from './types.ts';
/**
 * Brand an existing Loader-tree entry id at the owning boundary.
 * @param value - the entry id as the Loader tree spells it.
 * @returns the same id as the inventory's branded entry id.
 */
export declare function pluginEntryId(value: string): PluginEntryId;
/** Remote-only service exposing the Loader's current non-group entry state. */
export declare class PluginInventoryGateway extends TypertRemoteService {
    static inject: string[];
    constructor(ctx: Context);
    /**
     * Read the Loader directly on every call. Cordis's internal plugin/status
     * events already maintain Entry.fiber and Fiber.state, so a second cache
     * would only add another lifecycle truth to keep synchronized.
     *
     * When an agent-preset roster is composed, the snapshot also carries each
     * preset's composition rows, because those rows — not the Loader's own
     * entries — are where a deployment that mounts the roster runs its
     * model-facing plugins.
     * @returns Current non-group Loader entries in Loader order, with optional display metadata
     * and per-preset compositions when a roster is composed.
     */
    list(): Promise<PluginInventorySnapshot>;
}
export default PluginInventoryGateway;
/** Read current Loader entries and optional preset compositions.
 * @param ctx Context with the Loader service.
 * @returns Current inventory with optional display metadata and no separate runtime cache.
 */
export declare function readPluginInventory(ctx: Context): Promise<PluginInventorySnapshot>;
//# sourceMappingURL=index.d.ts.map