import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { ScheduleCatalogEntry, ScheduleId } from '@deepseek-ai/dsh-schedule/client';
import type { CatalogInjected } from './catalog-source.ts';
/** Task navigation the turn row receives from its list registration. */
export interface ScheduleTurnCardInjected extends Pick<CatalogInjected<ScheduleCatalogEntry>, 'hooks' | 'onRetry'> {
    /**
     * Show one created task's detail in the right Sidebar.
     * @param id - Task created by this Turn.
     */
    readonly openTaskDetail: (id: ScheduleId) => void;
}
/** Props of the created-task row of one Turn tail. */
export type ScheduleTurnCardProps = PropsRuntime<'conversation.chat.turnTail'> & InjectFace<ScheduleTurnCardInjected> & PropsLocale<'schedule.manager'>;
/**
 * Render the tasks one Turn created as standalone cards beneath its closing
 * prose.
 *
 * The Turn tail is a list seat independent of the Turn's process disclosure,
 * so the cards stay visible while the Tool group is collapsed. Every list entry
 * renders for every Turn, so this one narrows its own Turn here.
 * @param props - closing Turn owner currency, turn-tail navigation, and copy.
 * @returns one created-task card per settled `schedule_create` result, or null when the Turn created none.
 */
export declare function ScheduleTurnCard(props: ScheduleTurnCardProps): import("react").JSX.Element | null;
//# sourceMappingURL=ScheduleTurnCard.d.ts.map