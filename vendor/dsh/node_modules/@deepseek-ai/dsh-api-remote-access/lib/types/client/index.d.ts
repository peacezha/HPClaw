/**
 * Client face: starts from the access snapshot the index injected, follows
 * the calling Peer's snapshot stream, provides the `remoteAccess` Client
 * service whose `source(kind, id, action)` answers for any declared-kind
 * resource, and publishes `useRemoteAccess(action)` on the global resource.
 * Domain UI adapters publish their own resource Hooks over `source()`. Every
 * answer is a boolean: true for the owner, false without a snapshot or after
 * a non-owner stream fails; the Host enforces every call regardless.
 * @module @deepseek-ai/dsh-api-remote-access/client
 */
import type { Context } from '@deepseek-ai/cordis';
export type { RemoteAccessAction, RemoteAccessEndpoint, RemoteAccessFrame, RemoteAccessGrant, RemoteAccessResource, TypertResourceKind, } from '../types.ts';
export type { ClientRemoteAccess, RemoteEndpoint } from './mount.ts';
/** Required Client services: the Remote mount face and the Slot registry. */
export declare const inject: string[];
/**
 * Mount the generated `remoteAccess` namespace and publish the access Hooks.
 * @param ctx - Client root Context.
 * @returns disposer that withdraws the namespace after the stream stops.
 */
export declare function apply(ctx: Context): Promise<() => Promise<void>>;
//# sourceMappingURL=index.d.ts.map