import type { SidebarRightNavigationParams } from '@deepseek-ai/dsh-client-ui-sidebar-right/client';
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import type { TaskTabBindings, TaskTabPage, TaskTabTarget } from './task-tab-bindings.ts';
/** The layout and navigation fields one task tab carries. */
export interface TaskTabSource extends TaskTabPage {
    /** Navigation the tab's last open carried; a restored record carries no parameters. */
    readonly navigation: {
        readonly params: SidebarRightNavigationParams;
        readonly revision: number;
    };
}
/** The task one task tab resolves, and where it came from. */
export interface TaskTabTargetResolution {
    /** Whether the current layout still carries the opener's navigation parameters. */
    readonly navigated: boolean;
    /** Task the navigation named, or undefined when it carried another type's parameters. */
    readonly navigation: TaskTabTarget | undefined;
    /** Binding this page kind wrote for this layout id, read only for a restored record. */
    readonly recovered: TaskTabTarget | undefined;
    /** Task to show: the navigation's, or the restored binding's. */
    readonly params: TaskTabTarget | undefined;
}
/**
 * Resolve the task one task tab shows from its navigation or its stored binding.
 * @param sessionId - the Session holding the tab.
 * @param tab - the tab's layout fields and its last navigation.
 * @param taskBindings - provider-owned binding store for restored task tabs.
 * @returns the navigation, the recovered binding, and the task to show.
 */
export declare function useTaskTabTarget(sessionId: SessionId, tab: TaskTabSource, taskBindings: TaskTabBindings): TaskTabTargetResolution;
//# sourceMappingURL=task-tab-target.d.ts.map