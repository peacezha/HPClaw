import type { ReactNode } from 'react';
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { ScheduleCatalogEntry, ScheduleId } from '@deepseek-ai/dsh-schedule/client';
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import { type DeliveryHistoryInjected } from './DeliveryHistory.tsx';
import type { CatalogDeleteOutcome, CatalogSnapshot } from './catalog-source.ts';
import type { TaskTimingInjected, TimingDraft } from './task-timing.ts';
/** The two views of one task's detail: its rule, or its saved delivery records. */
export type TaskDetailTab = 'rule' | 'records';
/** One recurrence choice a retained task can be switched to. */
type RuleKind = 'daily' | 'weekdays' | 'weekly' | 'every' | 'once' | 'cron';
/** ISO weekdays of the weekly choice in display order, Monday through Sunday. */
declare const WEEKDAYS: readonly [1, 2, 3, 4, 5, 6, 7];
/** One ISO weekday of the weekly choice. */
type Weekday = (typeof WEEKDAYS)[number];
/**
 * Deletion, name/instruction/timing updates, saved-history, and original-Session
 * actions one task's detail calls.
 */
export interface TaskDetailInjected extends DeliveryHistoryInjected, TaskTimingInjected {
    /**
     * Delete one retained task through its original Session binding.
     * @param id - Task shown in this detail.
     * @returns The deletion's outcome after the Remote acknowledgement and
     * authoritative refresh; the wiring reports it as the app-wide toast.
     */
    readonly onDelete: (id: ScheduleId) => Promise<CatalogDeleteOutcome>;
    /**
     * Reload the catalog after a query failure or an acknowledged timing update,
     * and from a surface that needs a read newer than its own record.
     * @param since - request ordinal the caller last observed, 0 to share any read in flight.
     * @returns Resolution after publishing the read result; failures remain in catalog state.
     */
    readonly onRetry: (since?: number) => Promise<void>;
    /**
     * Open an available, unarchived original conversation after rechecking current metadata.
     * @param id - Session bound to the shown task.
     */
    readonly onOpenSession: (id: SessionId) => void;
}
/** One task's detail, as the Tasks page and the task tab both compose it. */
export type TaskDetailProps = TaskDetailInjected & PropsLocale<'schedule.manager'> & Pick<PropsRuntime<'main'>, 'useSessions' | 'useWorkspaces'> & {
    /** Task shown; an authoritative catalog row refreshes on its own, without an edit draft. */
    readonly task: ScheduleCatalogEntry;
    /** Whether an authoritative catalog row backs the shown task; a draft alone disables deletion. */
    readonly authoritative: boolean;
    /** Element id shared by the detail panels and any control that points at them. */
    readonly id: string;
    /** Catalog query state; loading keeps every action visible and disabled. */
    readonly status: 'loading' | 'ready' | 'error';
    /** Tasks with a deletion in flight. */
    readonly deleting: readonly ScheduleId[];
    /**
     * Report the shown task so its owner retains it while an update is pending
     * or failed, or while a confirmed deletion awaits the refreshed catalog.
     */
    readonly onEditState: (task: ScheduleCatalogEntry | null) => void;
    /** Active detail view; the owner resets it to Rules when it selects another task. */
    readonly tab: TaskDetailTab;
    /** Select the active detail view. */
    readonly onTabChange: (tab: TaskDetailTab) => void;
    /** Task whose deletion confirmation the owner asked for, or null when none is open. */
    readonly confirmId: ScheduleId | null;
    /** Ask for one task's deletion confirmation, or dismiss it with null. */
    readonly onConfirm: (id: ScheduleId | null) => void;
    /**
     * Leave the shown task once the refreshed catalog confirms its deletion:
     * the Tasks page clears its selection and the session task tab closes.
     */
    readonly onDeleted: () => void;
    /** Close this detail; a view with no list to return to omits the control. */
    readonly onClose?: () => void;
    /** Session whose Sidebar hosts this detail; a task linked to it omits the redundant original-Session entry. */
    readonly withinSession?: SessionId;
};
/** One task detail's editing state, as its Tasks page or task tab owns it. */
export interface TaskDetailController {
    /** Catalog row the shown id resolves to, or undefined when the read has no such row. */
    readonly record: ScheduleCatalogEntry | undefined;
    /** Task to show: the catalog row, or the draft a pending or failed mutation retained. */
    readonly task: ScheduleCatalogEntry | undefined;
    /** Element id shared by the detail panels and any control that points at them. */
    readonly id: string;
    /** Task whose deletion confirmation is open, or null when none is. */
    readonly confirmId: ScheduleId | null;
    /** Ask for one task's deletion confirmation, or dismiss it with null. */
    readonly setConfirmId: (id: ScheduleId | null) => void;
    /** Select the active detail view. */
    readonly setTab: (tab: TaskDetailTab) => void;
    /** Props the shared detail element takes, without the task it shows. */
    readonly props: Omit<TaskDetailProps, 'task' | 'authoritative' | 'onClose' | 'onDeleted'>;
}
/**
 * Own the editing state one task detail shares across both of its owners.
 *
 * The shown task is the catalog row for `taskId`, or the draft a mutation
 * pending against that row retained after the row left the catalog. The view,
 * the confirmation, and the draft all reset when `taskId` changes, so one
 * task's draft never carries into another.
 * @param injected - detail actions, localized copy, and framework readers.
 * @param catalog - the owner's authoritative task catalog snapshot.
 * @param taskId - task the owner selected, or undefined when it selected none.
 * @returns the shown task and catalog row, its element id, its confirmation, and the detail props.
 */
export declare function useTaskDetail(injected: TaskDetailInjected & PropsLocale<'schedule.manager'> & Pick<PropsRuntime<'main'>, 'useSessions' | 'useWorkspaces'>, catalog: CatalogSnapshot<ScheduleCatalogEntry>, taskId: ScheduleId | undefined): TaskDetailController;
/**
 * Render one task's rule or saved deliveries with confirm-first deletion and its original Session.
 *
 * A deletion this detail confirmed settles with the refreshed catalog: once
 * that refresh reports the row gone, the detail calls `onDeleted` and its owner
 * leaves the task. The app-wide toast, not this detail, announces the outcome.
 * @param props - task, catalog state, detail view, confirmation, localized copy, and action callbacks.
 * @returns the detail region, its deletion confirmation dialog, and the linked Session entry.
 */
export declare function TaskDetail({ task, authoritative, id, status, deleting, onDelete, onRetry, onUpdateTiming, loadHistory, onOpenSession, onEditState, tab, onTabChange, confirmId, onConfirm, onDeleted, onClose, withinSession, useSessions, useWorkspaces, t, }: TaskDetailProps): ReactNode;
/** Values one task's detail stages, seeded from one stored record. */
interface RuleShown {
    /** Task name the heading control edits. */
    readonly title: string;
    /** Reminder instruction the instruction control edits. */
    readonly prompt: string;
    /** Recurrence choice the rows edit. */
    readonly kind: RuleKind;
    /** Native time inputs the choice edits. */
    readonly draft: TimingDraft;
    /** ISO weekday set the weekly choice edits; other choices never read it. */
    readonly weekdays: readonly Weekday[];
}
/**
 * Merge one refreshed authoritative record into a staged draft.
 *
 * Three cases, because a rule kind and the fields that describe it are one
 * value. The Monday-to-Friday choice and the weekly choice state the same Host
 * weekly rule, so the comparisons below fold them together and only the day set
 * tells them apart.
 *
 * The draft stages another kind than the stored record. Its fields describe a
 * rule the refreshed record does not state, so the draft keeps them whole.
 *
 * The draft stages the stored kind, and the refreshed record changed that kind.
 * The two rules cannot be mixed, so the draft is kept whole when the user edited
 * it and the refreshed rule is adopted whole when the user did not.
 *
 * All three kinds agree. Only here can one field differ legitimately on each
 * side, so the fields merge on their own: a field the user changed keeps the
 * draft value and every other field takes the refreshed record, which is what
 * carries a concurrent remote timing edit into an unrelated local edit.
 *
 * The name and the instruction merge field by field in every case: another
 * client's rename reaches this detail even while a rule change is staged.
 * @param authoritative - values of the refreshed record.
 * @param draft - values the detail currently shows.
 * @param stored - authoritative values the draft was compared against.
 * @returns the merged values.
 */
export declare function mergeRuleDraft(authoritative: RuleShown, draft: RuleShown, stored: RuleShown): RuleShown;
export {};
//# sourceMappingURL=TaskDetail.d.ts.map