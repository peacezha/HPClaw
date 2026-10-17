import type { ReactNode } from 'react';
import type { HostObservable, InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { ScheduleCatalogEntry } from '@deepseek-ai/dsh-schedule/client';
import type { CatalogSnapshot } from './catalog-source.ts';
import { type TaskDetailInjected } from './TaskDetail.tsx';
import type { TaskTabBindings } from './task-tab-bindings.ts';
/** The Host task catalog the body, its chip, and the Tasks page all read. */
export interface ScheduleTaskCatalogInjected {
    /** Shared Host task catalog with its query and deletion state. */
    readonly hooks: {
        readonly catalog: HostObservable<CatalogSnapshot<ScheduleCatalogEntry>>;
    };
}
/** The provider-owned recovery a restored tab page resolves its task through. */
export interface ScheduleTaskBindingInjected {
    /** Durable binding from one task tab page to the task it last showed. */
    readonly taskBindings: TaskTabBindings;
}
/** Everything the task tab's body needs injected. */
export interface ScheduleTaskTabInjected extends TaskDetailInjected, ScheduleTaskCatalogInjected, ScheduleTaskBindingInjected {
}
/** Props of the task tab's body: the tab it draws, localized copy, and its catalog face. */
export type ScheduleTaskTabProps = PropsRuntime<'sidebar.right.pane.tab'> & PropsLocale<'schedule.manager'> & InjectFace<ScheduleTaskTabInjected>;
/**
 * Render the single task named by this tab's navigation parameters or by the
 * binding those parameters last wrote.
 *
 * When neither names a task, the body reports the catalog feedback until a read
 * requested after the baseline for the current navigation succeeds without the
 * task; the missing-task state then covers both an unbound restored tab and a
 * navigated tab whose task is gone.
 * @param props - tab information, the Host task catalog, localized copy, and action callbacks.
 * @returns the task's detail, or its centered loading, query-failure, or missing-task state.
 */
export declare function ScheduleTaskTab(props: ScheduleTaskTabProps): ReactNode;
//# sourceMappingURL=ScheduleTaskTab.d.ts.map