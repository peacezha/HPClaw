/** Failed background cleanup remains actionable after the originating tab disappears. */
import type { ReactNode } from 'react';
import type { TerminalCloseFailure } from '@deepseek-ai/dsh-api-terminal-controller/client';
import type { WebTerminalId } from '@deepseek-ai/dsh-api-terminal-controller/types';
import type { HostObservable, InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
/** The model owns cleanup; this seat only shows failures and requests retries. */
export interface TerminalCleanupInjected {
    readonly hooks: {
        readonly closeFailures: HostObservable<readonly TerminalCloseFailure[]>;
    };
    /** @param id - failed cleanup identity. */
    readonly retryClose: (id: WebTerminalId) => void;
}
/**
 * Render failed cleanup tasks without recreating or blocking any sidebar tab.
 * @param props - root overlay hooks, retry command and localized copy.
 * @returns a compact alert stack, empty when no close has failed.
 */
export declare function TerminalCleanup({ useCloseFailures, retryClose, t }: PropsRuntime<'shell.overlay'> & PropsLocale<'sidebarTerminal'> & InjectFace<TerminalCleanupInjected>): ReactNode;
//# sourceMappingURL=TerminalCleanup.d.ts.map