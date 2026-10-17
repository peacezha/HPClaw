/** Plan text and resource identities derived from logged native or PTC calls. */
import type { ToolCallId } from '@deepseek-ai/dsh-llm/brand';
import type { SessionAddress } from '@deepseek-ai/dsh-api-session-controller/types';
/** Complete Markdown and the heading displayed by a plan preview. */
export interface PlanDocument {
    readonly markdown: string;
    readonly title: string;
}
/** One submitted plan, identified by its originating tool invocation. */
export interface SubmittedPlan extends PlanDocument {
    readonly callId: ToolCallId;
}
/** A saved sidebar resource names one invocation in one Session. */
export interface PlanAddress {
    readonly session: SessionAddress;
    readonly callId: ToolCallId;
}
/**
 * Read a complete plan from untrusted logged arguments.
 * @param event - Native call or PTC dispatch event from Session history.
 * @returns the submitted plan, or undefined for unrelated or malformed data.
 */
export declare function submittedPlan(event: {
    readonly type: string;
    readonly data: unknown;
}): SubmittedPlan | undefined;
/**
 * Encode the durable identity of a plan without retaining its text in layout storage.
 * @param target - Session and tool-call identity.
 * @returns the plan resource address.
 */
export declare function planAddress(target: PlanAddress): string;
/**
 * Validate a saved or caller-supplied plan resource address.
 * @param address - Address submitted to the sidebar or resource provider.
 * @returns the decoded identity, or undefined for an unsupported address.
 */
export declare function parsePlanAddress(address: string): PlanAddress | undefined;
//# sourceMappingURL=plan.d.ts.map