/** Live terminal names in docked and floating tab chrome. */
import { type ReactNode } from 'react';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { TerminalInjected } from './face.ts';
/**
 * Render the terminal name, editable in place on double-click.
 * @param props - sidebar occurrence, terminal model and localized copy.
 * @returns the terminal icon and current name or its editor.
 */
export declare function TerminalTitle({ useTabInfo, useTerminal, view, t }: PropsRuntime<'sidebar.right.pane.tab.title'> & PropsLocale<'sidebarTerminal'> & InjectFace<TerminalInjected>): ReactNode;
//# sourceMappingURL=TerminalTitle.d.ts.map