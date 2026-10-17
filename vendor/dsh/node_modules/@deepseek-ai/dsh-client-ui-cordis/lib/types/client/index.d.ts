/** Cordis dynamic-plugin cards, inventory panel, business-view host. */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
export type { CordisCardFace, CordisPanelFace, CordisRunCardFace, CordisToolViewOwnerProps } from './slots.ts';
export type { CordisActionResult, CordisDynamicPort, CordisInventoryRow } from './dynamic-port.ts';
export type { CordisDefineRowProps } from './CordisDefineRow.tsx';
export type { CordisActionRowProps } from './CordisActionRow.tsx';
export type { CordisRunRowProps } from './CordisRunRow.tsx';
export type { CordisRunCardPointer, CordisRunCardStore, CordisToolViewKey, } from './run-card-index.ts';
export type { ApprovalRequestId, CordisDynamicPackageId, CordisDynamicPluginId, CordisDynamicPluginRunId, DynamicCordisInventoryRow, DynamicCordisPackage, DynamicCordisRetracted, } from './events.ts';
export type { CordisKey } from './locales.ts';
/** Required services for historical cards, the panel, and Remote lifecycle actions. */
export declare const inject: string[];
/** Mount every Cordis browser surface over the shared Host inventory. */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map