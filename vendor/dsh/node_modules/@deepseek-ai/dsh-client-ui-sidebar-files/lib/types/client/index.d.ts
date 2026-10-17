import type { Context as ClientContext } from '@deepseek-ai/cordis';
export type { SidebarFilesKey } from './locales.ts';
export type { DirLevel, FilesState, FilesTabState, LevelState } from './store.ts';
export type { FilesInjected, ListWorkspaceDirectory, WorkspaceFilesListRemote } from './face.ts';
export type { FilesBodyProps } from './FilesBody.tsx';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface SlotMap {
        /** Workspace directory actions after the file tree's reload control. */
        'sidebar.right.tab.files.actions': {
            kind: 'list';
            scope: 'session';
            owner: {
                /** Absolute directory path displayed by the file tree. */
                readonly absolutePath: string;
            };
        };
    }
}
/**
 * Required browser services: the tab registry, the keyed seat, the Remote
 * carrier and its namespace, and copy.
 */
export declare const inject: string[];
/**
 * Client plugin body: register the type, its dictionaries, its body, and its chip title.
 * @param ctx - client root context carrying the registry, the slots, and the Remote face.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map