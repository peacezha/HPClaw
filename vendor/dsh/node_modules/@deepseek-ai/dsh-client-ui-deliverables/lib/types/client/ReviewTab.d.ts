import type { ReactNode } from 'react';
import type { InjectFace, PropsLocale, PropsRenderSlots, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots';
import type { ObservableSnapshot } from '@deepseek-ai/dsh-client-store';
import type { ChangesDiffStore } from './changes-diff.ts';
import type { ChangesSummaryStore } from './changes-summary.ts';
import type { PresentedOpenController } from './present-open.ts';
import type { createReviewStore } from './review-store.ts';
import type { NS } from './locales.ts';
/** Summary and comparison reads, desktop metadata, and the native open supplied by the plugin. */
export interface ReviewInjected {
    hooks: {
        changesSummary: ObservableSnapshot<ReturnType<ChangesSummaryStore['state']['getSnapshot']>>;
        changesDiff: ObservableSnapshot<ReturnType<ChangesDiffStore['state']['getSnapshot']>>;
        presentedOpen: ObservableSnapshot<ReturnType<PresentedOpenController['state']['getSnapshot']>>;
        presentedHost: ObservableSnapshot<ReturnType<PresentedOpenController['host']['getSnapshot']>>;
    };
    loadChangesSummary: ChangesSummaryStore['load'];
    loadChangesDiff: ChangesDiffStore['load'];
    reloadPresentedHost: PresentedOpenController['loadHost'];
    openChanged: PresentedOpenController['openChanged'];
}
/** The body's composed props: the tab it draws, its store, its injected face, and its copy. */
export type ReviewTabProps = PropsRuntime<'sidebar.right.pane.tab'> & PropsStore<ReturnType<typeof createReviewStore>> & InjectFace<ReviewInjected> & PropsLocale<typeof NS> & PropsRenderSlots<'deliverables.review.file.actions'>;
/**
 * The review type's body, registered under `sidebar.right.pane.tab` as `changes-review`.
 * @param props - composed slot props.
 * @returns the selected file's comparison behind the file selector, or the state that stands in for it.
 */
export declare function ReviewTab({ useTabInfo, sessionId, useSessions, useStore, actions, useChangesSummary, useChangesDiff, usePresentedOpen, usePresentedHost, loadChangesSummary, loadChangesDiff, reloadPresentedHost, openChanged, t, renderSlot, }: ReviewTabProps): ReactNode;
//# sourceMappingURL=ReviewTab.d.ts.map