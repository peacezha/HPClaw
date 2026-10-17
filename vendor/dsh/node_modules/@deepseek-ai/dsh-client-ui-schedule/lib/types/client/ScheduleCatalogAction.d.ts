import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { ScheduleId } from '@deepseek-ai/dsh-schedule/client';
import type { CatalogInjected } from './catalog-source.ts';
import { NS } from './locales.ts';
/** Full props for the Session-header Schedule catalog action. */
export type ScheduleCatalogActionProps = PropsRuntime<'conversation.session.header.utilities'> & PropsLocale<typeof NS> & InjectFace<CatalogInjected & {
    /**
     * Show one task's detail in the right Sidebar for this entry's Session.
     * @param id - Task chosen by the Session entry.
     */
    readonly openTaskDetail: (id: ScheduleId) => void;
}>;
/** Current-Session reminder catalog with durable deletion. */
export declare function ScheduleCatalogAction({ useSession, useCatalog, onDelete, onRetry, openTaskDetail, t, }: ScheduleCatalogActionProps): import("react").JSX.Element | null;
//# sourceMappingURL=ScheduleCatalogAction.d.ts.map