import type { InjectFace, PropsLocale, SessionStandardProps } from '@deepseek-ai/dsh-client-ui-slots';
import { type ChangesSummary } from '../changes.ts';
import type { DeliverablesInjected } from './Deliverables.tsx';
import type { NS } from './locales.ts';
type PreviewProps = Pick<InjectFace<DeliverablesInjected>, 'useChangesDiff' | 'loadChangesDiff'> & Pick<SessionStandardProps, 'sessionId'>;
/**
 * Render one turn's changed files. The header opens the turn's review in the
 * right Sidebar on its first file. A single file uses only the header; it and
 * multi-file rows preview their comparison after a 500ms hover.
 * @param props - the recorded summary, the review opener, and localized copy.
 * @returns the card.
 */
export declare function ChangedFiles({ changes, cwd, openReview, t, sessionId, useChangesDiff, loadChangesDiff }: {
    /** The served summary with the sequence of the event that announced it. */
    changes: Pick<ChangesSummary, 'files' | 'total' | 'added' | 'deleted'> & {
        seq: number;
    };
    cwd: string | undefined;
    /** Open the turn's review on the file at an original summary index. */
    openReview: (index: number) => void;
} & PropsLocale<typeof NS> & PreviewProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=ChangedFiles.d.ts.map