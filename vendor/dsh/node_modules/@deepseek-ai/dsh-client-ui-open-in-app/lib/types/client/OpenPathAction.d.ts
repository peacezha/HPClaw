import type { ReactNode } from 'react';
import type { SessionWorkspacePathApplication } from '@deepseek-ai/dsh-api-session-controller/types';
import type { ObservableSnapshot } from '@deepseek-ai/dsh-client-store';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { OpenInAppPathAction, OpenInAppPathFailure } from './open-path.ts';
import type { NS } from './locales.ts';
/** Desktop availability and the gesture carrier injected into both path controls. */
export interface OpenPathInjected {
    hooks: {
        openInAppDesktop: ObservableSnapshot<boolean | null>;
    };
    loadDesktop: () => Promise<void>;
    openPath: (path: string, action: OpenInAppPathAction, application?: string) => Promise<OpenInAppPathFailure | null>;
    applications: (path: string, signal: AbortSignal) => Promise<readonly SessionWorkspacePathApplication[] | null>;
}
/** Full props of the document-header contribution. */
export type OpenPathActionProps = PropsRuntime<'sidebar.right.tab.document.actions'> & PropsLocale<typeof NS> & InjectFace<OpenPathInjected>;
/** File inputs shared by the document header and its unpreviewable state. */
type FileOpenTargetProps = Pick<OpenPathActionProps, 'absolutePath' | 'useOpenInAppDesktop' | 'loadDesktop' | 'openPath' | 'applications' | 't'> & {
    empty?: boolean;
};
/**
 * Resolve file associations and adapt operations without embedding platform behavior in the control.
 * @param props - verified file path, desktop query, native operations, and display variant.
 * @returns the shared opening control, or null without a desktop.
 */
export declare function FileOpenTarget(props: FileOpenTargetProps): ReactNode;
/**
 * Render the file adapter in the document header.
 * @param props - document owner inputs and injected opening capabilities.
 * @returns the shared split button.
 */
export declare function OpenPathAction(props: OpenPathActionProps): ReactNode;
export {};
//# sourceMappingURL=OpenPathAction.d.ts.map