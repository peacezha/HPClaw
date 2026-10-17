/** A Session header lifetime restores retained Host terminals without saving sidebar layout. */
import { type ReactNode } from 'react';
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
/** The plugin coordinates once-per-page recovery; the component only owns an error notice. */
export interface TerminalRecoveryInjected {
    /** @returns after retained terminals have been opened as sidebar tabs. */
    readonly restore: () => Promise<void>;
}
/**
 * Restore terminals when a Session is displayed, with a retry action on lookup failure.
 * @param props - Session header lifetime, restoration callback and localized copy.
 * @returns nothing on success, or an unobtrusive retry control.
 */
export declare function TerminalRecovery({ restore, t }: PropsRuntime<'conversation.session.header.actions'> & PropsLocale<'sidebarTerminal'> & TerminalRecoveryInjected): ReactNode;
//# sourceMappingURL=TerminalRecovery.d.ts.map