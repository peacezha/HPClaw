/** Host Cordis plugin for the cross-realm Inspector Worker and full fetch capture. */
import type { Context } from '@deepseek-ai/cordis';
import { type InspectorOptions } from './bridge/controller.ts';
export { resolveInspectorOptions, startInspector } from './bridge/controller.ts';
export type { InspectorEndpoint, InspectorHandle, InspectorOptions, InspectorSpec } from './bridge/controller.ts';
export type { CordisRuntimeTreeReader } from '../shared/cordis/reader.ts';
export type { CordisRuntimeConnection, CordisRuntimeContext, CordisRuntimeFiber, CordisRuntimeNode, CordisRuntimeRealm, CordisRuntimeSource, CordisRuntimeTree, } from '../shared/cordis/model.ts';
export type { InspectorClientBootstrap } from '../shared/bridge/messages/control.ts';
export type { InspectorRecordInput, InspectorSourceDescriptor, InspectorSourceKind } from '../shared/bridge/messages/observation.ts';
export type { InspectorJsonObject, InspectorJsonPrimitive, InspectorJsonValue } from '../shared/json.ts';
export type { CordisContextTreeNode, CordisFiberTreeNode, CordisTreeNode, CordisTreeSnapshot, } from '../shared/cordis/snapshot.ts';
/** Configuration consumed by the Host implementation after package-entry validation. */
export interface HostPluginConfig extends Omit<InspectorOptions, 'clientOrigins'> {
    /** Browser origins allowed to open the Client ingest WebSocket. */
    clientOrigins?: string[];
}
/**
 * Start the Worker, expose `ctx.inspector`, and inject the matching Client bootstrap.
 * The bootstrap route exists before the Worker is ready, so a Client published during startup waits instead of failing.
 * When the platform cannot run the Worker (`ERR_FEATURE_UNAVAILABLE_ON_PLATFORM`), the plugin warns once and stays active
 * with only that route, which answers 503; every other startup failure rolls back and rejects the fiber.
 */
export declare function apply(ctx: Context, config: HostPluginConfig): Promise<void>;
//# sourceMappingURL=plugin.d.ts.map