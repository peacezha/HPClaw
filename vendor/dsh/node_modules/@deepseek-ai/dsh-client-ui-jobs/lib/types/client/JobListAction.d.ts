import type { JobsSnapshot, JobView } from '@deepseek-ai/dsh-api-job-controller/client';
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import { NS } from './locales.ts';
/** Registration-side business face for the job list. */
export interface JobListInjected {
    hooks: {
        /** Client jobs snapshot (rosters and observations) bound by the renderer as useJobs. */
        jobs: {
            getSnapshot(): JobsSnapshot;
            subscribe(listener: () => void): () => void;
        };
    };
    /**
     * Keep one session's roster current while the list is mounted; returns the
     * stop function. Reference-counted by the client service.
     */
    watchRows: (sessionId: SessionId) => () => void;
    /**
     * Start observing one job's live output; returns the stop function.
     * Reference-counted by the client service, so panels can overlap safely.
     */
    observe: (sessionId: SessionId | undefined, id: JobView['id']) => () => void;
    /**
     * Kill one background job on the human's behalf. Resolves `true` when the
     * registry admitted the request (`requested` or `already-finished`); row
     * state itself converges through the jobs control frames.
     */
    killJob: (sessionId: SessionId, jobId: string) => Promise<boolean>;
}
/** Full props for the session-header job-list action. */
export type JobListActionProps = PropsRuntime<'conversation.session.header.actions'> & PropsLocale<typeof NS> & InjectFace<JobListInjected>;
/**
 * Session-header entry point for this session's background jobs. Mounting it
 * keeps the session's roster stream open; it renders nothing at all until the
 * session can see at least one job. Expanding an observable row (a live job,
 * or a settled one with retained output) starts its observation stream, and
 * collapsing (or closing the popover) stops it — output only flows while
 * someone is watching. A running row carries a two-press stop button that
 * requests a human kill through the job controller.
 * @param props - runtime slot currency, the jobs snapshot hook, the roster,
 *   observation, and kill controls, and the namespace translator.
 * @returns the trigger and its popover list, or null when there is nothing to show.
 */
export declare function JobListAction({ sessionId, useJobs, watchRows, observe, killJob, t }: JobListActionProps): import("react").JSX.Element | null;
//# sourceMappingURL=JobListAction.d.ts.map