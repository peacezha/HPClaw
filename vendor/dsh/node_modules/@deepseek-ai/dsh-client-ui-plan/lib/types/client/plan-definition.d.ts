import type { ConversationNodeDefinition } from '@deepseek-ai/dsh-client-ui-conversation/client';
import { type SubmittedPlan } from './plan.ts';
declare module '@deepseek-ai/dsh-client-ui-chat/client' {
    interface ChatNodeDataMap {
        /** Complete plan submitted through exit_plan_mode, including rejected or dismissed reviews. */
        'submitted-plan': SubmittedPlan;
    }
}
/** One card per invocation; a later PTC settlement retains the original card position. */
export declare const planDefinition: ConversationNodeDefinition<SubmittedPlan>;
//# sourceMappingURL=plan-definition.d.ts.map