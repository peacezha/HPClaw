/**
 * Sidebar Session-row clock mark: one Session's active scheduled-task
 * indicator, seated in the row's leading 16px cell before the title.
 *
 * The row offers that cell to this seat only while its own primary state is
 * idle, so an approval request, a new message, or live activity keeps the
 * row's state dot in the same cell and never mounts the mark. The mark
 * projects the one shared Host task catalog onto this Session; it activates,
 * retains, and unarchives nothing, and it never reads a Session log.
 */
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import { type SessionScheduleCatalogObservable } from './session-schedule-state.ts';
import { NS } from './locales.ts';
/** Injected share of the Session-row clock mark: the shared Host task catalog. */
export interface SessionScheduleMarkInjected {
    /** One catalog shared by every row; the renderer binds it to the `useCatalog` selector hook. */
    readonly hooks: {
        readonly catalog: SessionScheduleCatalogObservable;
    };
}
/** Full props of the Session-row clock mark. */
export type SessionScheduleMarkProps = PropsRuntime<'sidebar.session.row.leading'> & PropsLocale<typeof NS> & InjectFace<SessionScheduleMarkInjected>;
/**
 * Render the clock mark while this Session's active tasks are non-empty.
 * @param props.sessionId - Session this row shows.
 * @param props.useCatalog - selector hook over the shared Host task catalog.
 * @param props.t - Schedule catalog locale seat.
 * @returns the mark, or nothing while the read is unresolved, failed, ended, or empty.
 */
export declare function SessionScheduleMark({ sessionId, useCatalog, t, }: SessionScheduleMarkProps): import("react").JSX.Element | null;
//# sourceMappingURL=SessionScheduleMark.d.ts.map