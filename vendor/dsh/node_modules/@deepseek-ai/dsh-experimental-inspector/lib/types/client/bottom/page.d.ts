/** Window-local Inspector frontend in the layout's bottom slot. */
import type { Context } from '@deepseek-ai/cordis';
import type { InspectorSourceId } from '../../shared/bridge/ids.ts';
/**
 * Register bottom content and its window-local toggle command for one Client source.
 * @param ctx - Inspector context owning the registrations.
 * @param sourceId - Claimed identity of the embedding page's Client source.
 */
export declare function registerInspectorPage(ctx: Context, sourceId: InspectorSourceId): void;
//# sourceMappingURL=page.d.ts.map