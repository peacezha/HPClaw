import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { ObservableSnapshot, PropsStore } from '@deepseek-ai/dsh-client-store';
import type { ShortcutCatalogEntry, ShortcutPlatform, Shortcuts } from '@deepseek-ai/dsh-client-shortcuts/client';
import type { createShortcutsStore } from './store.ts';
/** Catalog and device labels delivered through renderer-bound hooks. */
export interface ReferenceInjected {
    platform: ShortcutPlatform;
    runtime: Shortcuts['runtime'];
    edit: Shortcuts['edit'];
    recording: Shortcuts['recording'];
    describeBinding: Shortcuts['describeBinding'];
    hooks: {
        catalog: ObservableSnapshot<readonly ShortcutCatalogEntry[]>;
        config: Shortcuts['config'];
        fixedCatalog: Shortcuts['fixedCatalog'];
    };
}
type Store = PropsStore<ReturnType<typeof createShortcutsStore>>;
type Locale = PropsLocale<'shortcuts'>;
/**
 * Render the General Settings action that opens the shortcut reference.
 * @param props - shared dialog action and localized labels.
 * @returns the settings row.
 */
export declare function ShortcutsRow({ actions, t, useCatalog }: PropsRuntime<'settings.general.item'> & Store & Locale & InjectFace<ReferenceInjected>): import("react").JSX.Element;
/**
 * Render core actions in product order, then other commands by ID within each group. Search relevance takes precedence.
 * @param props - root store, effective catalog, and localized copy.
 * @returns the single reference dialog when open.
 */
export declare function ShortcutReference({ useStore, actions, useCatalog, useConfig, useFixedCatalog, platform, runtime, edit, recording, describeBinding, t, }: PropsRuntime<'shell.overlay'> & Store & Locale & InjectFace<ReferenceInjected>): import("react").JSX.Element;
export {};
//# sourceMappingURL=Reference.d.ts.map