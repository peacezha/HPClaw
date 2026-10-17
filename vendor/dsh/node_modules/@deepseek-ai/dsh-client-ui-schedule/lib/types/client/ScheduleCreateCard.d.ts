import type { InjectFace, PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { ToolCallViewProps } from '@deepseek-ai/dsh-client-ui-tool/client';
import type { ScheduleId, ScheduleRecord } from '@deepseek-ai/dsh-schedule/client';
/** Task navigation the card receives from its Turn-tail registration. */
export interface ScheduleCreateCardInjected {
    /**
     * Show one created task's detail in the right Sidebar.
     * @param id - Task created by this call.
     */
    readonly openTaskDetail: (id: ScheduleId) => void;
}
/** Props of the `schedule_create` transcript card. */
export type ScheduleCreateCardProps = ToolCallViewProps & PropsLocale<'schedule.manager'> & InjectFace<ScheduleCreateCardInjected> & {
    readonly currentTask?: ScheduleRecord | null;
};
/**
 * Fields one card reads.
 *
 * The keyed Tool seat also carries the owner's file opener, image loader, and
 * workspace facts; this card reads none of them, so the Turn tail that renders
 * it supplies these fields alone and a template that starts reading another
 * owner field fails to compile here.
 */
export type ScheduleCreateCardInput = Pick<ScheduleCreateCardProps, 'callId' | 'toolName' | 'block' | 'openTaskDetail' | 't' | 'currentTask'>;
/**
 * Render one `schedule_create` call as the created task's card.
 *
 * A settled result yields the task's title, its localized frequency, and the
 * button that opens that task's right-Sidebar detail. A running call, a failed
 * creation, or a replayed result with no complete task renders its title and
 * raw result text with no open action, so the card never presents an identity
 * it does not have.
 * @param props - the settled card payload, injected task navigation, and copy.
 * @returns the created task's transcript card.
 */
export declare function ScheduleCreateCard({ block, toolName, openTaskDetail, t, currentTask }: ScheduleCreateCardInput): import("react").JSX.Element;
//# sourceMappingURL=ScheduleCreateCard.d.ts.map