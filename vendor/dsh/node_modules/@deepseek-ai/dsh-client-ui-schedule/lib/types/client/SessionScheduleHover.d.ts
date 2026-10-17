/**
 * Scheduled-task section of the Sidebar Session-row hover card.
 *
 * The row's own card already carries the Session title, its relative time, and
 * the trailing status line; this seat contributes the Session's active tasks
 * between them. It is mounted only while the card is open, and it projects the
 * one shared Host task catalog onto the hovered Session.
 */
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import { type SessionScheduleCatalogObservable } from './session-schedule-state.ts';
import { NS } from './locales.ts';
/** Most task rows one hover card shows before it reports the omitted remainder. */
export declare const SESSION_HOVER_TASK_LIMIT = 2;
/** Injected share of the Session-row hover-card task section: the shared Host task catalog. */
export interface SessionScheduleHoverInjected {
    /** One catalog shared by every row; the renderer binds it to the `useCatalog` selector hook. */
    readonly hooks: {
        readonly catalog: SessionScheduleCatalogObservable;
    };
}
/** Full props of the Session-row hover-card task section. */
export type SessionScheduleHoverProps = PropsRuntime<'sidebar.session.row.hover'> & PropsLocale<typeof NS> & InjectFace<SessionScheduleHoverInjected>;
/**
 * Render up to {@link SESSION_HOVER_TASK_LIMIT} overdue-first task rows.
 *
 * The reference clock is sampled once per mount: the card is a long-hover
 * preview, so its "next run" text must not drift while the pointer rests.
 * @param props.sessionId - Session this row shows.
 * @param props.useCatalog - selector hook over the shared Host task catalog.
 * @param props.t - Schedule catalog locale seat.
 * @returns the task rows plus an omission line, or nothing without an active task.
 */
export declare function SessionScheduleHover({ sessionId, useCatalog, t, }: SessionScheduleHoverProps): import("react").JSX.Element | null;
//# sourceMappingURL=SessionScheduleHover.d.ts.map