/**
 * The bounded output ring behind one job: chunks at absolute byte offsets,
 * head eviction that never moves an assigned offset, and non-consuming reads
 * from any offset.
 * @module @deepseek-ai/dsh-jobs-local/ring
 */
import type { JobAppendOptions, JobOutputRead } from '@deepseek-ai/dsh-jobs';
/** Offsets stay absolute across eviction: `earliest` only ever advances. */
export declare class OutputRing {
    /** Retained chunks in offset order. */
    private readonly chunks;
    /** Sum of the retained chunks' byte lengths. */
    retainedBytes: number;
    /** Total UTF-8 bytes ever appended — the offset the next chunk starts at. */
    total: number;
    /** Offset of the oldest retained byte (equals {@link total} when nothing is retained). */
    earliest: number;
    /**
     * Append one chunk and trim the head to `cap`.
     * @param text - the chunk text, exactly as produced.
     * @param options - stream label and gap marker.
     * @param cap - retention cap in UTF-8 bytes after this append.
     * @returns false when the chunk was empty and nothing changed.
     */
    append(text: string, options: JobAppendOptions | undefined, cap: number): boolean;
    /**
     * Drop retained head chunks until the ring fits `cap`; a single oversized
     * chunk keeps only its UTF-8-safe tail with a `gapBefore` marker.
     * @param cap - retention cap in UTF-8 bytes.
     */
    trim(cap: number): void;
    /**
     * Retained chunks overlapping `[from, total)` as fresh wire chunks.
     * @param from - absolute byte offset to read from.
     * @returns the chunks, the resume offset, and whether bytes before them were evicted.
     */
    readFrom(from: number): JobOutputRead;
}
//# sourceMappingURL=ring.d.ts.map