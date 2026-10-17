/**
 * The registry-owned pull pump: copies a job's {@link JobOutputSource}s into
 * its ring at a bounded cadence and drains them once more after the
 * producer settles, so the ring holds every byte before settlement trims and
 * closes it. A lossy source read lands as a gap chunk; the spill file a source
 * keeps is reported to the sink on every read, because that reference
 * outlives any chunk. Pure utility — no cordis, no timers retained past
 * settlement.
 * @module @deepseek-ai/dsh-jobs-local/pump
 */
import type { JobAppendOptions, JobOutputSource } from '@deepseek-ai/dsh-jobs';
/** One pump run; `done` resolves after the final post-settlement drain. */
export interface PumpHandle {
    done: Promise<void>;
}
/** Where a pump delivers what it reads. */
export interface PumpSink {
    /**
     * Append copied text to the ring.
     * @param text - the chunk text, exactly as read.
     * @param options - stream label and gap marker.
     */
    append(text: string, options?: JobAppendOptions): void;
    /**
     * Record the spill file source `index` advertised on its latest read; called
     * on every read, with `undefined` when the source keeps none or withdrew it.
     * @param index - the source's position in the pump's source array.
     * @param path - the host path the source reported, if any.
     */
    spill(index: number, path: string | undefined): void;
}
/**
 * Drain every source in array order, sleep `pollMs` or until `until`
 * settles, repeat, then drain one final time. A lossy source read appends
 * its surviving tail with `gapBefore`, so the discontinuity stays visible to
 * observers. Sources drain in array order each round, so bytes two sources
 * produced inside one poll window land in that order, not in the order they
 * were written: the ring is a best-effort live view whose cross-source
 * reordering is bounded by `pollMs`.
 *
 * The wait holds constant resources however long the job runs: one
 * subscription on `until` for the whole run and one pending timer at a time.
 * @param sources - producer streams, each pumped at its own offset.
 * @param sink - receives each copied chunk and each source's current spill file.
 * @param pollMs - poll interval in milliseconds; a positive finite number.
 * @param until - settles (or rejects, which counts as settlement) when the producer finished; only its `then` is used.
 * @returns the handle whose `done` resolves after the final drain.
 */
export declare function startPump(sources: readonly JobOutputSource[], sink: PumpSink, pollMs: number, until: PromiseLike<unknown>): PumpHandle;
//# sourceMappingURL=pump.d.ts.map