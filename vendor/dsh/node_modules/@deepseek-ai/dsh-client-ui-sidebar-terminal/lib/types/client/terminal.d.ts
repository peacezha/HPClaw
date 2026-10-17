/** Sidebar terminal screen and connection recovery. */
import { type ReactNode } from 'react';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { TerminalBodyInjected } from './face.ts';
import '@xterm/xterm/css/xterm.css';
/** Standard sidebar owner share plus terminal model and localized copy. */
export type TerminalBodyProps = PropsRuntime<'sidebar.right.pane.tab'> & PropsLocale<'sidebarTerminal'> & InjectFace<TerminalBodyInjected>;
/**
 * Render the retained terminal with the application theme.
 * @param props - sidebar occurrence, model lookup and translated copy.
 * @returns the terminal screen and any pending or exceptional state.
 */
export declare function TerminalBody({ useTabInfo, useTerminal, useTheme, view, t }: TerminalBodyProps): ReactNode;
//# sourceMappingURL=terminal.d.ts.map