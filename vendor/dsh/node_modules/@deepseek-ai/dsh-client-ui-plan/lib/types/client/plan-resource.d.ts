/** Read immutable plan arguments from a Session snapshot and earlier history pages. */
import type { Context } from '@deepseek-ai/cordis';
import type { ResourceProvider } from '@deepseek-ai/dsh-client-resources/client';
import { type SubmittedPlan } from './plan.ts';
declare module '@deepseek-ai/dsh-typert-protocol' {
    interface RemoteErrorDetailsMap {
        /** The resource URL does not identify a plan invocation. */
        'plan/invalid-address': Record<string, never>;
        /** Session history ended before an opening snapshot. */
        'plan/unavailable': Record<string, never>;
        /** The Session has no readable plan for this invocation. */
        'plan/not-found': Record<string, never>;
        /** The Session history read failed. */
        'plan/read-failed': Record<string, never>;
    }
}
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface ResourceProtocolMap {
        /** Immutable Markdown from a logged exit_plan_mode invocation. */
        plan: SubmittedPlan;
    }
}
/**
 * Bind plan reads to the generated Session Remote face.
 * Opening a follow reads projections and may activate a prepared Session on the Host.
 * Generated Remote streams can throw carrier failures; the provider reports failed
 * reads as resource failure frames and preserves Remote error codes.
 * @param remote - Existing Session history API.
 * @returns a provider whose reads stop after finding the exact invocation.
 */
export declare function planResourceProvider(remote: Pick<Context['remote']['session'], 'follow' | 'page'>): ResourceProvider<'plan'>;
//# sourceMappingURL=plan-resource.d.ts.map