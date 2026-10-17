/**
 * Model-visible messages owned by continuable-subagent orchestration.
 *
 * @module @deepseek-ai/dsh-subagent/continuation-messages
 */
import type { Agent } from '@deepseek-ai/dsh-agent';
import { createUserMessage } from '@deepseek-ai/dsh-llm';
import type { ContentBlock } from '@deepseek-ai/dsh-llm';
import type { SessionId } from '@deepseek-ai/dsh-session';
import type { SubagentResult } from './types.ts';
/** Durable attribution for one model-authored message between Agents. */
export interface AgentMessageSource {
    readonly kind: 'agent-message';
    /** A message another agent addressed to this one (`relay` context form). */
    readonly form: 'relay';
    /** Session id of the Agent whose tool call produced the message. */
    readonly senderSessionId: SessionId;
}
/**
 * Durable attribution for the runtime's own account of a continuable child
 * settling. Deliberately a different kind from
 * {@link AgentMessageSource}: an Agent message is content the sender chose,
 * while this message is the manager stating what became of the child, and a
 * transcript that merged them would credit the child with words it never wrote.
 */
export interface SubagentSettledMessageSource {
    readonly kind: 'subagent-settled';
    /** A runtime account shown without expanding the row (`notice` context form). */
    readonly form: 'notice';
    /** One-line account of how the child ended. */
    readonly summary: string;
    /** Session id of the child that settled. */
    readonly senderSessionId: SessionId;
}
declare module '@deepseek-ai/dsh-llm' {
    interface MessageSourceMap {
        'agent-message': AgentMessageSource;
        'subagent-settled': SubagentSettledMessageSource;
    }
}
/**
 * Build the model-visible and durable representation of one adjacent-Agent message.
 * @param sender - exact live Agent that authored the message.
 * @param content - model-visible message blocks supplied by the sender.
 * @returns the durable user-message representation delivered to the recipient.
 */
export declare function createAgentMessage(sender: Agent, content: ContentBlock[]): ReturnType<typeof createUserMessage>;
/**
 * Append adjacent-Agent return guidance to a continuable child's initial task.
 * @param parentId - durable parent session id named in the guidance.
 * @param prompt - initial model-visible task blocks.
 * @returns task blocks followed by the continuable return guidance.
 */
export declare function withContinuableReturnGuidance(parentId: SessionId, prompt: ContentBlock[]): ContentBlock[];
/**
 * Build the runtime-owned settlement notice from the child's nonempty closing text.
 * @param childId - durable child session id named in the notice.
 * @param terminal - recorded terminal state for the settled Activation.
 * @param continuable - whether the child can accept another task.
 * @returns the durable user-message representation delivered to the parent.
 */
export declare function createSettlementMessage(childId: SessionId, terminal: SubagentResult, continuable?: boolean): ReturnType<typeof createUserMessage>;
//# sourceMappingURL=continuation-messages.d.ts.map