/** DOM lookups owned by the experimental Inspector, using existing Slot and Chat attributes. */
import type { InspectorChatTarget } from '../objects.ts';
/**
 * Check an existing element's mounted and ancestor visibility without revealing it.
 * @param element - Candidate element.
 * @returns Whether CSS and hidden ancestors allow it to be displayed.
 */
export declare function displayed(element: HTMLElement): boolean;
/**
 * Find the displayed main Chat's outer flow column without entering a Sidebar or nested View.
 * @returns The current Chat column, or undefined while another View is selected.
 */
export declare function mainChatRoot(): HTMLElement | undefined;
/**
 * Restrict a DOM match to the selected Chat column and its own Conversation View.
 * @param element - Candidate node, including SVG children.
 * @param root - Main Chat column.
 * @returns Whether the candidate belongs to that occurrence.
 */
export declare function inChat(element: Element, root: HTMLElement): boolean;
/**
 * Enumerate exact and approximate occurrences without changing their display state.
 * @param root - Current main Chat column.
 * @param targets - Exact identities followed by nearby loaded Node identities.
 * @returns Unique candidates, with the requested Turn's occurrences before other Turns.
 */
export declare function findChatTargets(root: HTMLElement, targets: readonly InspectorChatTarget[]): readonly HTMLElement[];
//# sourceMappingURL=dom.d.ts.map