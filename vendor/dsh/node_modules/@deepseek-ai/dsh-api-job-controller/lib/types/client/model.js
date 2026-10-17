/**
 * React-free client job state: the roster each watched session can see, fed
 * by `job.list` frames, and per-job accumulated output views fed by
 * `job.follow` frames. Pure data plus subscriptions — transport wiring stays
 * in the client service, UI stays in slot components.
 * @module @deepseek-ai/dsh-api-job-controller/client/model
 */
import { notifySubscribers } from '@deepseek-ai/dsh-client-store';
/** Bounded per-job render tail, in UTF-16 code units. */
const RENDER_TAIL_LIMIT = 128 * 1024;
/** Owns the per-session rosters and per-job observation state. */
export class ClientJobsModel {
    rowsBySession = new Map();
    observedStates = new Map();
    listeners = new Set();
    snapshotCache = { rows: {}, observed: {} };
    snapshotDirty = false;
    getSnapshot() {
        if (this.snapshotDirty) {
            const rows = {};
            for (const [id, jobs] of this.rowsBySession)
                rows[id] = jobs;
            const observed = {};
            for (const [id, state] of this.observedStates)
                observed[id] = state.view;
            this.snapshotCache = { rows, observed };
            this.snapshotDirty = false;
        }
        return this.snapshotCache;
    }
    subscribe(listener) {
        this.listeners.add(listener);
        return () => { this.listeners.delete(listener); };
    }
    /**
     * Replace one session's roster with a `rows` frame's whole set. An empty
     * set is stored as an absent key.
     * @param sessionId - the watched session.
     * @param jobs - the complete visible set.
     */
    rowsReplaced(sessionId, jobs) {
        const key = String(sessionId);
        if (jobs.length === 0) {
            if (!this.rowsBySession.delete(key))
                return;
        }
        else {
            this.rowsBySession.set(key, jobs);
        }
        this.changed();
    }
    /**
     * Drop one session's roster after its last watcher stops or its stream fails.
     * @param sessionId - the no-longer-watched session.
     */
    rowsDropped(sessionId) {
        if (!this.rowsBySession.delete(String(sessionId)))
            return;
        this.changed();
    }
    /**
     * The resume offset for one job's next observation generation.
     * @param id - observed job.
     * @returns the last accepted `next`, or undefined for a fresh observation.
     */
    cursorOf(id) {
        return this.observedStates.get(String(id))?.cursor;
    }
    /**
     * Install or reset observation state when a generation's anchor arrives.
     * @param id - observed job.
     * @param frame - the generation's `opened` anchor.
     */
    observeOpened(id, frame) {
        const existing = this.observedStates.get(String(id));
        // A fresh view anchored past offset zero starts after an evicted head
        // (fresh observations anchor at the registry's earliest retained byte), so
        // it owes the same gap mark a live observer earned from lossy reads. A
        // resume that already accumulated text keeps its recorded gap state.
        const freshPastHead = (existing === undefined || existing.view.text === '') && frame.from > 0;
        const view = {
            jobId: id,
            text: existing?.view.text ?? '',
            gapBefore: (existing?.view.gapBefore ?? false) || frame.from < frame.job.output.earliest || freshPastHead,
            streaming: true,
        };
        this.observedStates.set(String(id), { view, cursor: frame.from });
        this.changed();
    }
    /**
     * Append one output frame's chunks to the bounded render tail.
     * @param id - observed job.
     * @param frame - a coalesced `output` frame.
     */
    observeOutput(id, frame) {
        const state = this.observedStates.get(String(id));
        /* v8 ignore next -- frames arrive only between opened and stop for a tracked id. */
        if (state === undefined)
            return;
        let text = state.view.text + frame.chunks.map(chunk => chunk.text).join('');
        let gapBefore = state.view.gapBefore || frame.lossy === true
            || frame.chunks.some(chunk => chunk.gapBefore === true);
        if (text.length > RENDER_TAIL_LIMIT) {
            let cut = text.length - RENDER_TAIL_LIMIT;
            // Never split a surrogate pair at the render bound.
            const unit = text.charCodeAt(cut);
            if (unit >= 0xDC00 && unit <= 0xDFFF)
                cut += 1;
            text = text.slice(cut);
            gapBefore = true;
        }
        state.view = { ...state.view, text, gapBefore };
        state.cursor = frame.next;
        this.changed();
    }
    /**
     * Close the live view once the terminal `status` frame arrived: the ring is
     * drained and the roster row carries the settled projection.
     * @param id - observed job.
     */
    observeSettled(id) {
        const state = this.observedStates.get(String(id));
        /* v8 ignore next -- frames arrive only between opened and stop for a tracked id. */
        if (state === undefined)
            return;
        state.view = { ...state.view, streaming: false };
        this.changed();
    }
    /**
     * Record a terminal observation failure.
     * @param id - observed job.
     * @param error - the stream's terminal failure.
     */
    observeFailed(id, error) {
        const state = this.observedStates.get(String(id));
        if (state === undefined) {
            // A failure before the anchor — a rejected request, a job gone between
            // the click and the open — still owes the panel its notice; a later
            // successful anchor replaces this view and resumes from no cursor.
            this.observedStates.set(String(id), {
                view: { jobId: id, text: '', gapBefore: false, streaming: false, error: String(error) },
                cursor: undefined,
            });
            this.changed();
            return;
        }
        state.view = { ...state.view, streaming: false, error: String(error) };
        this.changed();
    }
    /**
     * Drop observation state after the last observer stops.
     * @param id - the no-longer-observed job.
     */
    observeStopped(id) {
        if (!this.observedStates.delete(String(id)))
            return;
        this.changed();
    }
    changed() {
        this.snapshotDirty = true;
        notifySubscribers(this.listeners, 'jobs');
    }
}
//# sourceMappingURL=model.js.map