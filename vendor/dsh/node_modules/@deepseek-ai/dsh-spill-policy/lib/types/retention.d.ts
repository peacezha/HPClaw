/** Ordered head/tail retention of text and indivisible images. @module @deepseek-ai/dsh-spill-policy/retention */
import type { ContentBlock } from '@deepseek-ai/dsh-llm';
/** Content whose text can be split and whose images must remain whole. */
export type RetainableBlock = Extract<ContentBlock, {
    type: 'text' | 'image';
}>;
/** Retained ends and exact quantities excluded from their original sequence. */
export interface RetainedContent {
    head: RetainableBlock[];
    tail: RetainableBlock[];
    omittedBytes: number;
    omittedImages: number;
}
/**
 * Retain contiguous ends without moving or partially retaining an image.
 * Each end receives half the content budget; unused space at an indivisible
 * image stays unused. Text pricing must be monotonic in retained length.
 * @param content - ordered text and image blocks whose total price exceeds budget.
 * @param budget - non-negative integer token budget after reserving notices.
 * @param price - model-route cost of one retained block, including its framing.
 * @returns retained ends and omitted UTF-8 text bytes and whole images.
 */
export declare function retainContent(content: readonly RetainableBlock[], budget: number, price: (block: RetainableBlock) => number): RetainedContent;
//# sourceMappingURL=retention.d.ts.map