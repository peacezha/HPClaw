/** Shell launch menu owned by the terminal provider's guide entry. */
import { type ReactNode } from 'react';
import type { ShortcutCatalogEntry } from '@deepseek-ai/dsh-client-shortcuts/client';
import type { HostObservable } from '@deepseek-ai/dsh-client-ui-slots';
import type { TerminalLaunchShells } from '@deepseek-ai/dsh-api-terminal-controller/client';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
/** Provider-owned discovery and browser preference writes. */
export interface TerminalGuideInjected {
    readonly hooks: {
        readonly shortcuts: HostObservable<readonly ShortcutCatalogEntry[]>;
    };
    /** @param signal - open menu lifetime. @returns current Host choices and browser preference. */
    readonly loadShells: (signal: AbortSignal) => Promise<TerminalLaunchShells>;
    /** @param path - Host-discovered shell selected for the next terminal. */
    readonly selectShell: (path: string) => void;
}
/** Session guide owner props, framework hooks and terminal actions. */
export type TerminalGuideProps = PropsRuntime<'sidebar.right.tab.guide.entry'> & PropsLocale<'sidebarTerminal'> & InjectFace<TerminalGuideInjected>;
/**
 * Open the remembered shell from the card or choose another shell from its menu.
 * The card displays its effective shortcut; the shell menu sits beside the title.
 * @param props - guide copy, enclosing tab actions and cancellable discovery.
 * @returns separate launch and menu buttons within one guide card.
 */
export declare function TerminalGuide({ title, description, kind, useTabInfo, loadShells, selectShell, t, useShortcuts, }: TerminalGuideProps): ReactNode;
//# sourceMappingURL=TerminalGuide.d.ts.map