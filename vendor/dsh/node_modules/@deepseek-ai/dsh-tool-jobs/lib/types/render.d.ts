/**
 * Model-facing rendering of registry reads: the consuming delta as the
 * shell tools have always shown it (stdout, then one marked stderr section),
 * the `[status: …]` line, and the public job projection the tool schemas
 * expose.
 * @module @deepseek-ai/dsh-tool-jobs/render
 */
import type { JobChunk, JobView } from '@deepseek-ai/dsh-jobs/view';
/** Job state safe for model-authored programs; ownership and offsets are omitted. */
export interface PublicJobSnapshot {
    id: string;
    kind: string;
    label: string;
    status: JobView['status'];
    /** The live progress line while running, the terminal reason once settled. */
    detail?: string;
    startedAt: number;
    finishedAt?: number;
}
/**
 * The one-line qualifier the model reads beside a status: live progress while
 * the job runs, the terminal reason once it settled.
 * @param job - the job projection.
 * @returns the qualifier, or undefined when the job carries neither.
 */
export declare function jobDetail(job: Pick<JobView, 'progress' | 'detail'>): string | undefined;
/**
 * Remove ownership, offsets, and limits from a registry projection.
 * @param job - the registry projection.
 * @returns the model-safe projection.
 */
export declare function publicJob(job: JobView): PublicJobSnapshot;
/**
 * Render generic status with optional detail.
 * @param snapshot - job state to render.
 * @returns a bracketed status line.
 */
export declare function statusLine(snapshot: Pick<PublicJobSnapshot, 'status' | 'detail'>): string;
/**
 * Render one consuming read for the model: stdout and unlabeled chunks in
 * order, then every stderr chunk in one `[stderr]` section, exactly as the
 * shell tools render a foreground result. `log` chunks are producer
 * narration for observers and never reach the model. Lost bytes — the cursor
 * fell behind the ring's retention, or a model-visible chunk carries a
 * producer-side gap — end the read with the shell tools' dropped-output
 * notice, naming the spill files the job's sources keep.
 * @param chunks - the chunks since the model cursor, in offset order.
 * @param lossy - whether bytes before `chunks` were evicted unread.
 * @param spillPaths - the complete-stream files the job currently advertises (`JobView.output.spillPaths`).
 * @returns the delta text, possibly empty.
 */
export declare function renderModelDelta(chunks: readonly JobChunk[], lossy: boolean, spillPaths: readonly string[]): string;
//# sourceMappingURL=render.d.ts.map