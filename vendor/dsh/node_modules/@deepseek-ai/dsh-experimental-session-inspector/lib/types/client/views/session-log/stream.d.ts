/** Block-indexed hierarchy for one live or durable Assistant stream. */
import type { StreamChunk } from '@deepseek-ai/dsh-llm';
import type { InspectorRow } from '../table-model.ts';
/** Keeps original delta rows under their blocks and a bounded reasoning prefix for folded headers. */
export declare class AssistantLogStream {
    private readonly parent;
    private readonly blocks;
    private count;
    /** @param parent - Stable Assistant event or live-attempt row identity. */
    constructor(parent: string);
    /**
     * Count all received chunks, including children of folded blocks.
     * @returns Number of original chunks received by this stream.
     */
    get length(): number;
    /**
     * Add one original chunk and update the matching block's disclosure state.
     * Chunks without a loaded block-start remain direct Assistant children.
     * @param chunk - Original chunk, correlated by block index.
     * @returns One row insertion, an optional replaced block header, and its folded preview.
     */
    append(chunk: StreamChunk): {
        readonly key: string;
        readonly index: number;
        readonly position: number;
        readonly row: InspectorRow;
        readonly header?: {
            readonly position: number;
            readonly row: InspectorRow;
        };
        readonly collapsed?: {
            readonly key: string;
            readonly summary: string;
        };
    };
}
//# sourceMappingURL=stream.d.ts.map