/**
 * Client access mount: follows the calling Peer's access snapshot, provides
 * the `remoteAccess` Client service, and publishes the global-resource `useRemoteAccess` Hook.
 * The entry module supplies the generated `remoteAccess` contribution, so
 * specs mount a fake one.
 * @module @deepseek-ai/dsh-api-remote-access/src/client/mount
 */
import { type Context } from '@deepseek-ai/cordis';
import type { HostObservable } from '@deepseek-ai/dsh-client-ui-slots';
import type { TypertRemoteContribution, TypertRemoteMap, TypertResourceKind } from '@deepseek-ai/dsh-typert-protocol';
import { type Baseline } from './state.ts';
/** Every endpoint the Client Remote namespaces declare. */
export type RemoteEndpoint = Extract<keyof TypertRemoteMap, string>;
/** Client access answers over the calling Peer's snapshot; it never issues a request. */
export interface ClientRemoteAccess {
    /**
     * Whether the current Peer may call `action` on one resource.
     * True for the owner; false without a baseline and after a non-owner
     * stream fails; otherwise whether the resource's grant lists the action.
     * @param kind - resource kind declared in `TypertResourceMap`.
     * @param id - resource identity.
     * @param action - endpoint action the caller would invoke.
     * @returns identity-stable boolean source for this `(kind, id, action)`.
     */
    source(kind: TypertResourceKind, id: string, action: string): HostObservable<boolean>;
}
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** Client access answers for the calling Peer. */
        remoteAccess: ClientRemoteAccess;
    }
}
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface GlobalStandardProps {
        /** Whether the current Peer may call `action` on the global resource. */
        useRemoteAccess: (action: RemoteEndpoint) => boolean;
    }
}
/**
 * Mount the `remoteAccess` namespace, follow the access snapshot, provide the
 * `remoteAccess` Client service, and publish the global-resource `useRemoteAccess` Hook.
 * Answers start from the page's injected baseline, or false without one,
 * and follow the stream's frames from then on.
 * @param ctx - Client root Context injecting `remote` and `slots`.
 * @param contribution - generated `remoteAccess` Remote contribution.
 * @param initial - the page's injected opening baseline, read before the stream connects.
 * @returns disposer that withdraws the namespace after the stream stops.
 */
export declare function mountAccess(ctx: Context, contribution: TypertRemoteContribution, initial?: Baseline): Promise<() => Promise<void>>;
//# sourceMappingURL=mount.d.ts.map