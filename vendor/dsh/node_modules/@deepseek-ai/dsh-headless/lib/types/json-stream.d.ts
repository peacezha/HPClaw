/**
 * `--json` run projection: a bounded, ordered event stream derived from one
 * Agent's durable Session events. Every projected event is a commit point:
 * text and reasoning come from committed `assistant/message` content, never
 * from a live attempt that may still be retried or discarded, so the stream
 * never carries content the durable log does not contain.
 * @module @deepseek-ai/dsh-headless/json-stream
 */
import type { Context } from '@deepseek-ai/cordis';
import type { Agent } from '@deepseek-ai/dsh-agent';
/** Default per-string and per-key cap applied to every bounded projected payload. */
export declare const MAX_STRING_BYTES: number;
/** Default cap on one projected event's serialized bytes, newline included; the terminal `final` is exempt. */
export declare const MAX_EVENT_BYTES: number;
/** The stdout sink a projection writes newline-delimited events to. */
export interface JsonSink {
    /** Write one chunk of the event stream. */
    write(chunk: string): unknown;
}
/** Tunables for {@link projectJsonRun}; every field defaults. */
export interface JsonProjectionOptions {
    /** Working directory reported by the opening `session` event. */
    cwd?: string;
    /** Per-string and per-key byte cap; longer values are truncated and flagged. */
    maxStringBytes?: number;
}
/** The live handle of one `--json` projection. */
export interface JsonProjection {
    /** Write the terminal `final` event carrying the run's answer text. */
    finish(text: string): void;
    /** Stop observing the Session. */
    dispose(): void;
}
/**
 * Serialize one projected payload under both limits: every string and key is
 * capped at `maxStringBytes`, and the serialized line at `maxEventBytes`. The
 * line cap reserves the newline the writer appends, so the complete record
 * stays within it. When the line is still too long, scalar fields survive and
 * structured fields are dropped; when even those are too long, only `type` and
 * `truncated` remain.
 * @param event - the event payload to serialize.
 * @param maxStringBytes - per-string and per-key byte cap.
 * @param maxEventBytes - cap on the serialized line plus its trailing newline.
 * @returns the bounded JSON line, without a trailing newline.
 */
export declare function boundJsonLine(event: Record<string, unknown>, maxStringBytes?: number, maxEventBytes?: number): string;
/**
 * Project one Agent's run as newline-delimited JSON on `sink`.
 *
 * The opening `session` event is written before the subscription starts, so a
 * caller must invoke this before submitting the task. Text and reasoning are
 * emitted only when the step's `assistant/message` commits them, and the
 * terminal `final` event carries the same lossless answer the default mode
 * prints (it is deliberately not bounded).
 * @param ctx - plugin context carrying the live Session feed.
 * @param agent - the exact Agent whose events belong to this invocation.
 * @param sink - stdout sink receiving one JSON object per line.
 * @param options - projection tunables.
 * @returns the projection handle that finishes or disposes the stream.
 */
export declare function projectJsonRun(ctx: Context, agent: Agent, sink: JsonSink, options?: JsonProjectionOptions): JsonProjection;
//# sourceMappingURL=json-stream.d.ts.map