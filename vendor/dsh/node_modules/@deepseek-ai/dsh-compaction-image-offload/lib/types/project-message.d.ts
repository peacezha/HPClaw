/** Immutable application of the image occurrences recorded by image/offload. */
import type { Message } from '@deepseek-ai/dsh-llm';
/**
 * Project selected image occurrences to immutable offloaded blocks.
 * @param message - message projected before this decision.
 * @param indexes - nonempty, strictly increasing depth-first image indexes.
 * @returns an immutable message with the same identity and selected images marked.
 * @throws when a selected occurrence is missing or already offloaded.
 */
export declare function offloadMessageImages(message: Message, indexes: readonly number[]): Message;
//# sourceMappingURL=project-message.d.ts.map