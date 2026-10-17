/**
 * The `ctx.jobs` client service: reference-counted streams over the `job`
 * namespace — one `job.list` roster stream per watched session and one
 * `job.follow` stream per observed job — so overlapping viewers share a
 * stream, rosters resume whole after a reconnect, and observations resume
 * from the model's cursor, plus the human kill passthrough over `job.kill`.
 * @module @deepseek-ai/dsh-api-job-controller/client/service
 */
import { Service } from '@deepseek-ai/cordis';
import { RemoteStreamCarrierError } from '@deepseek-ai/dsh-api-gateway/client';
/** Owns the bare jobs snapshot and the per-session and per-job streams. */
export class ClientJobs extends Service {
    remote;
    model;
    state;
    rowsEntries = new Map();
    observations = new Map();
    /**
     * @param ctx - client root Context.
     * @param remote - the Gateway stream factory plus the generated `job` namespace, both resolved by the caller.
     * @param model - shared client jobs model.
     */
    constructor(ctx, remote, model) {
        super(ctx, 'jobs');
        this.remote = remote;
        this.model = model;
        this.state = model;
        ctx.effect(() => async () => {
            const open = [...this.rowsEntries.values(), ...this.observations.values()];
            this.rowsEntries.clear();
            this.observations.clear();
            for (const entry of open)
                entry.stopped = true;
            // Cordis awaits an async disposer, so the fiber stays unloading until
            // every carrier iterator has closed and a successor plugin instance
            // cannot overlap one. A carrier whose teardown fails is stopped all the
            // same; its failure has no consumer here.
            await Promise.allSettled(open.map(entry => entry.dispose()));
        }, 'job-controller.client.streams');
    }
    kill(sessionId, id) {
        return this.remote.job.kill({ sessionId, jobId: id });
    }
    watchRows(sessionId) {
        return this.acquire(this.rowsEntries, String(sessionId), () => this.startRows(sessionId), () => { this.model.rowsDropped(sessionId); });
    }
    observe(sessionId, id) {
        return this.acquire(this.observations, String(id), () => this.startObservation(sessionId, id), () => { this.model.observeStopped(id); });
    }
    /** Share the live entry under `key` or start one, and hand back its release. */
    acquire(entries, key, start, cleared) {
        const existing = entries.get(key);
        if (existing !== undefined && !existing.stopped) {
            existing.refs += 1;
            return this.releaser(entries, key, existing, cleared);
        }
        const entry = start();
        entries.set(key, entry);
        return this.releaser(entries, key, entry, cleared);
    }
    /**
     * Release closures bind the exact entry they were minted for, never the
     * map's current occupant: a later acquire on the same key may have replaced
     * a stopped entry, and decrementing or disposing through the key alone
     * would tear down that newer stream's references.
     */
    releaser(entries, key, entry, cleared) {
        let released = false;
        return () => {
            if (released)
                return;
            released = true;
            entry.refs -= 1;
            if (entry.refs > 0)
                return;
            if (entries.get(key) === entry)
                entries.delete(key);
            entry.stopped = true;
            void entry.dispose().then(() => {
                // Clear the state only while no successor holds the key: a re-acquire
                // inside the dispose round-trip already refilled the model, and a
                // stale clear would blank it for good.
                if (entries.has(key))
                    return;
                cleared();
            });
        };
    }
    startRows(sessionId) {
        const name = `job rows ${String(sessionId)}`;
        const stream = this.remote.$stream({
            name,
            open: signal => this.remote.job.list({ sessionId }, signal),
            // The roster has no natural end while it is watched: an end after the
            // first frame is a carrier interruption (a Host reload closes the
            // generation) and the next generation's whole set loses nothing. An end
            // before the first frame is terminal.
            ended: accepted => accepted
                ? new RemoteStreamCarrierError(`${name} ended before release`)
                : new Error(`${name} ended before its first frame`),
        });
        const entry = {
            refs: 1,
            stopped: false,
            dispose: () => stream.dispose(),
        };
        void (async () => {
            try {
                for await (const item of stream) {
                    this.model.rowsReplaced(sessionId, item.value.jobs);
                    item.accept();
                }
            }
            catch {
                // A terminal stream failure leaves nothing current to show; the model
                // drops the roster rather than keeping a stale set on screen.
                if (!entry.stopped)
                    this.model.rowsDropped(sessionId);
            }
            finally {
                entry.stopped = true;
                void entry.dispose();
            }
        })();
        return entry;
    }
    startObservation(sessionId, id) {
        const name = `job observation ${String(id)}`;
        const stream = this.remote.$stream({
            name,
            open: (signal) => {
                const from = this.model.cursorOf(id);
                return this.remote.job.follow({
                    jobId: id,
                    ...sessionId !== undefined ? { sessionId } : {},
                    ...from !== undefined ? { from } : {},
                }, signal);
            },
            // A premature end after the anchor is retryable (a Host reload closes the
            // generation); resuming from the cursor loses nothing. An end before the
            // anchor is terminal.
            ended: accepted => accepted
                ? new RemoteStreamCarrierError(`${name} ended before settlement`)
                : new Error(`${name} ended before its anchor`),
        });
        const entry = {
            refs: 1,
            stopped: false,
            dispose: () => stream.dispose(),
        };
        void (async () => {
            try {
                for await (const item of stream) {
                    const frame = item.value;
                    if (frame.type === 'opened') {
                        this.model.observeOpened(id, frame);
                        item.accept();
                        continue;
                    }
                    if (frame.type === 'output') {
                        this.model.observeOutput(id, frame);
                        continue;
                    }
                    // Terminal status: leave the loop before the generation end is
                    // classified, then close the stream for good.
                    this.model.observeSettled(id);
                    break;
                }
            }
            catch (error) {
                if (!entry.stopped)
                    this.model.observeFailed(id, error);
            }
            finally {
                entry.stopped = true;
                void entry.dispose();
            }
        })();
        return entry;
    }
}
//# sourceMappingURL=service.js.map