import type { HostObservable, InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { ScheduleCatalogEntry } from '@deepseek-ai/dsh-schedule/client';
import type { CatalogSnapshot } from './catalog-source.ts';
import { type TaskDetailInjected } from './TaskDetail.tsx';
/** Injected catalog and task actions for the management page. */
export interface TaskManagerInjected extends TaskDetailInjected {
    /** Host task catalog with its query and deletion state. */
    readonly hooks: {
        readonly catalog: HostObservable<CatalogSnapshot<ScheduleCatalogEntry>>;
    };
    /**
     * Start a new Session, where a reminder is created by asking the model to
     * schedule it. The page deliberately has no creation form of its own.
     */
    readonly onNewTask: () => void;
}
/** Root-scoped task catalog props derived from the framework and injected actions. */
export type TaskManagerPageProps = PropsRuntime<'main'> & InjectFace<TaskManagerInjected> & PropsLocale<'schedule.manager'>;
/**
 * Render retained tasks with authoritative deletion and timing-only edits.
 * @param props - framework catalog snapshot, localized copy, and action callbacks.
 * @returns the searchable task list beside the selected task's detail.
 */
export declare function TaskManagerPage(props: TaskManagerPageProps): import("react").JSX.Element;
//# sourceMappingURL=TaskManagerPage.d.ts.map