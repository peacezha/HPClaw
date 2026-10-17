/** Weak identity index for materialized Nodes, Groups, Turn/Step locations, and their Data readers. */
import type { ConversationBinding } from '@deepseek-ai/dsh-client-ui-conversation/client';
import type { InspectorObjectReference } from '../objects.ts';
type Reference = Omit<InspectorObjectReference, 'rowKey'>;
/** Indexes each immutable publication once, without retaining its objects or node arrays. */
export declare class ChatObjectIndex {
    private readonly binding;
    private readonly identities;
    private readonly indexed;
    /** @param binding - Existing Session-owned Conversation reader. */
    constructor(binding: ConversationBinding);
    /**
     * Resolve an original object without retaining replaced publications.
     * @param value - Original object identity.
     * @returns Its named reference, including older identities, or undefined when unregistered.
     */
    reference(value: object): Reference | undefined;
    private chat;
    private register;
    private location;
    private refresh;
}
export {};
//# sourceMappingURL=objects.d.ts.map