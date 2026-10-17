/**
 * Browser catalogs for retained Host tasks and the selected Session's active
 * reminders, plus the right-Sidebar page that shows one task's detail.
 *
 * The page type reaches the Sidebar through its public path only: the
 * definition into `ctx.sidebarRightTabs`, the body into the keyed
 * `sidebar.right.pane.tab` seat, and the chip title into
 * `sidebar.right.pane.tab.title`, both under the definition's `id`. Because the
 * Sidebar persists a tab's layout record and not the parameters its opener
 * passed, the page also owns a binding from each tab page to the task it last
 * showed, which its body and chip read back after a reload. The Session
 * header entry and the task tab share one Host catalog source, so opening or
 * deleting from either view reads and refreshes the same records.
 *
 * The created task of a `schedule_create` call renders at Turn level: a Turn
 * Definition publishes the settled result against its Turn, and ui-chat's
 * `conversation.chat.turnTail` list seat renders the card beneath
 * the closing prose, outside the collapsible Tool group, opening the same
 * right-Sidebar detail the header entry opens. The call's Tool-group cell
 * stays with ui-tool's generic keyed tool view, so this package registers no
 * `tool.call.toolview` entry for the wire name.
 *
 * Two ambient surfaces read the ONE Host catalog the page owns: ui-workspace's
 * `sidebar.session.row.leading` seat marks an idle row whose Session has an
 * active task, and its `sidebar.session.row.hover` seat lists those tasks
 * inside the row's hover card. Both project the same source, so N visible rows
 * issue one query rather than one per row. The header entry keeps its own
 * per-Session source.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { type ScheduleCatalogKey } from './locales.ts';
import { type TaskManagerKey } from './task-manager-locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Active Schedule catalog copy. */
        'schedule.catalog': ScheduleCatalogKey;
        /** Host task management page and task tab copy. */
        'schedule.manager': TaskManagerKey;
    }
}
/** Required services for catalogs, ambient Session marks, the right Sidebar, Remote queries, and original-Session navigation. */
export declare const inject: string[];
/**
 * Register the Host task page, the Session-header reminder catalog, the
 * right-Sidebar page that shows one task's detail, and the transcript card of
 * one created task.
 * @param ctx - browser services used by these contributions.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map