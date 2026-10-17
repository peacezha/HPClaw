/** Browser-safe durable image selection declaration and pure replay definition. */
import type { SessionSeq } from '@deepseek-ai/dsh-session/types';
import type { SessionMessageProjection } from '@deepseek-ai/dsh-session/surface';
/** Exact input-image occurrences selected by one durable offload decision. */
export interface ImageOffloadTarget {
    /** Current message-producing event containing these occurrences. */
    seq: SessionSeq;
    /** Zero-based depth-first image indexes within the immutable message. */
    imageIndexes: number[];
}
declare module '@deepseek-ai/dsh-session/types' {
    interface SessionEventMap {
        /**
         * Permanently omit selected input-image occurrences from subsequent model requests.
         * Targets name unique current user/message or tool/result nodes. Nonempty, strictly
         * increasing indexes count all images in depth-first order, including nested tool
         * results and already omitted images. Message nodes and identities remain unchanged.
         * @messageProjection
         */
        'image/offload': {
            targets: ImageOffloadTarget[];
        };
    }
}
/** Atomic validation and reconstruction shared by live sessions and detached replay. */
export declare const imageOffloadProjection: SessionMessageProjection<'image/offload'>;
//# sourceMappingURL=projection.d.ts.map