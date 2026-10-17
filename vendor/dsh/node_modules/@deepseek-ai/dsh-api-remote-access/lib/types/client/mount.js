/**
 * Client access mount: follows the calling Peer's access snapshot, provides
 * the `remoteAccess` Client service, and publishes the global-resource `useRemoteAccess` Hook.
 * The entry module supplies the generated `remoteAccess` contribution, so
 * specs mount a fake one.
 * @module @deepseek-ai/dsh-api-remote-access/src/client/mount
 */
import { Service } from '@deepseek-ai/cordis';
import { RemoteSnapshotStream, RemoteStreamCarrierError, } from '@deepseek-ai/dsh-api-gateway/client';
import { ClientAccessState } from "./state.js";
/** The `remoteAccess` Client service over one snapshot owner. */
class ClientRemoteAccessService extends Service {
    state;
    /**
     * @param ctx - Client Context the service is provided on.
     * @param state - snapshot owner answering every source.
     */
    constructor(ctx, state) {
        super(ctx, 'remoteAccess');
        this.state = state;
    }
    source(kind, id, action) {
        return this.state.resource(kind, id, action);
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
export async function mountAccess(ctx, contribution, initial) {
    const state = new ClientAccessState(initial);
    new ClientRemoteAccessService(ctx, state);
    ctx.slots.provideRoot({
        keyedHooks: { remoteAccess: action => state.global(action) },
    });
    const unmount = await ctx.remote.$mount(contribution);
    const follow = ctx.inject(['remote.remoteAccess'], (remoteCtx) => {
        const control = createAccessStream(remoteCtx.remote, state, remoteCtx.logger);
        control.start();
        remoteCtx.effect(() => async () => { await control.dispose(); }, 'remote-access.client.follow');
    });
    return async () => {
        await follow.dispose();
        await unmount();
    };
}
/**
 * Create the reconnecting access snapshot stream. A carrier loss keeps the
 * last snapshot while the stream reconnects; a terminal failure keeps the
 * owner's answers and turns a non-owner's answers false.
 */
function createAccessStream(remote, state, logger) {
    const stream = remote.$stream({
        name: 'Remote access stream',
        open: signal => remote.remoteAccess.follow(signal),
        ended: accepted => accepted
            ? new RemoteStreamCarrierError('Remote access stream ended without a terminal result')
            : new Error('Remote access stream ended before its opening snapshot'),
    });
    return new RemoteSnapshotStream(stream, {
        name: 'Remote access stream',
        isSnapshot: (frame) => frame.type === 'baseline',
        replace: (frame) => { state.replace(frame); },
        update: (frame) => { state.update(frame); },
        failed: (error) => {
            // Only a non-owner's answers turn false after a terminal failure, so only its report names the recovery.
            if (state.owner)
                logger.error('access snapshot stream failed; owner access answers are unaffected', error);
            else
                logger.error('access snapshot stream failed; reload the page to reconnect', error);
            state.unavailable();
        },
    });
}
//# sourceMappingURL=mount.js.map