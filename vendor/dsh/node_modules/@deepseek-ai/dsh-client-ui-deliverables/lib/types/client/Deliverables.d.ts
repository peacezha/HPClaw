import type { TurnTailOwnerProps } from '@deepseek-ai/dsh-client-ui-chat/client';
import type { GlobalStandardProps, InjectFace, PropsLocale, PropsRenderSlots, PropsRuntime, SessionStandardProps } from '@deepseek-ai/dsh-client-ui-slots';
import type { ObservableSnapshot } from '@deepseek-ai/dsh-client-store';
import type { PresentedOpenController } from './present-open.ts';
import type { ChangesDiffStore } from './changes-diff.ts';
import type { ChangesSummaryStore } from './changes-summary.ts';
import { type ChangesTurnData, type PresentedPath } from './turn-deliverables.ts';
import type { NS } from './locales.ts';
import { type ChangesReviewCoordinates } from '../changes.ts';
interface DeliverablesMatch {
    changes: ChangesTurnData | null;
    presented: readonly PresentedPath[];
}
/** Summary reads, native-open callbacks, and shared gesture status supplied by the plugin. */
export interface DeliverablesInjected {
    hooks: {
        changesDiff: ObservableSnapshot<ReturnType<ChangesDiffStore['state']['getSnapshot']>>;
        showCodeDiff: ObservableSnapshot<boolean>;
        presentedOpen: ObservableSnapshot<ReturnType<PresentedOpenController['state']['getSnapshot']>>;
        presentedHost: ObservableSnapshot<ReturnType<PresentedOpenController['host']['getSnapshot']>>;
        changesSummary: ObservableSnapshot<ReturnType<ChangesSummaryStore['state']['getSnapshot']>>;
    };
    reloadPresentedHost: PresentedOpenController['loadHost'];
    loadChangesDiff: ChangesDiffStore['load'];
    loadChangesSummary: ChangesSummaryStore['load'];
    openPresented: PresentedOpenController['open'];
    openChanged: PresentedOpenController['openChanged'];
    /** Open one turn's review in the right Sidebar on the file at an index. */
    openChangesReview: (coordinates: ChangesReviewCoordinates, index: number) => void;
}
/**
 * Claim turns with a change announcement or declared files.
 * @param owner - closing turn.
 * @returns matched announcement and deliveries, or null for a turn with neither.
 */
export declare function selectDeliverables(owner: TurnTailOwnerProps): DeliverablesMatch | null;
/**
 * Contribute file deliveries alongside other completed-Turn artifacts.
 * @param props - closing Turn, file actions, and localized copy.
 * @returns file rows, or null when the Turn declares none.
 */
export declare function DeliverablesTail(props: PropsRuntime<'conversation.chat.turnTail'> & PropsLocale<typeof NS> & InjectFace<DeliverablesInjected> & PropsRenderSlots<'deliverables.file.actions'>): import("react").JSX.Element | null;
/**
 * Render the changed-files card, once the Host has served the announced
 * summary and it lists a file, and shared native opening controls for declared
 * files. A summary the Host no longer serves leaves no card.
 * @param props - matched announcement and files, workspace opener, and localized copy.
 * @returns the closing turn's file rows.
 */
export declare function Deliverables({ matched, openFile, t, sessionId, useSessions, openPresented, openChangesReview, usePresentedOpen, usePresentedHost, useChangesDiff, loadChangesDiff, useChangesSummary, reloadPresentedHost, loadChangesSummary, useShowCodeDiff, renderSlot, }: Pick<TurnTailOwnerProps, 'openFile'> & {
    matched: DeliverablesMatch;
} & PropsLocale<typeof NS> & Pick<SessionStandardProps, 'sessionId'> & Pick<GlobalStandardProps, 'useSessions'> & InjectFace<DeliverablesInjected> & PropsRenderSlots<'deliverables.file.actions'>): import("react").JSX.Element;
export {};
//# sourceMappingURL=Deliverables.d.ts.map