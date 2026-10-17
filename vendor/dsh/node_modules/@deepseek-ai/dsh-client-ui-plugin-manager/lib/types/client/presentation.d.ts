/** Display labels and toast sentences for global plugin management. */
import type { IncompatiblePlugin, ManagementError, Registry, RestartReason } from '@deepseek-ai/dsh-api-remotes/client';
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { ManagerNotice, PackageRow, PackageView, PluginManagerFace } from './manager-store.ts';
/** The translate seat of the manager's dictionary. */
export type Translate = PropsLocale<'pluginManager'>['t'];
/**
 * What a registry reads as: npm's own by its name, a known mirror by its name, any other registry by its host;
 * and the host each names, for where the name alone would leave it unsaid. The registry pnpm's own configuration
 * names reads by the registry it names, so the label never claims npm's own for another one.
 * @param registry - the registry, null for the one pnpm's own configuration names.
 * @param t - the manager's translate seat.
 * @param resolved - the URL pnpm's own configuration names, null while the Host could not read it.
 * @returns the name and the host.
 */
export declare function registryText(registry: Registry, t: Translate, resolved: string | null): {
    name: string;
    host: string;
};
/**
 * What a management error reads as: the code's sentence; for an incompatibility, one sentence per
 * package it names, then the remedy for an install or for an installed plugin; or, for an operation error, the Host's diagnostic as it is.
 * @param error - the Host's code, its diagnostic, and the packages an incompatibility names.
 * @param t - the manager's translate seat.
 * @returns the sentence.
 */
export declare function managementText(error: {
    readonly code: ManagementError['code'];
    readonly diagnostic?: string;
    readonly incompatible?: readonly IncompatiblePlugin[];
    /** Set when the refused package is being installed rather than already installed; selects the incompatibility remedy. */
    readonly installing?: true;
}, t: Translate): string;
/**
 * Compact a package name to what a person calls it.
 * @param name - the package name.
 * @returns the unscoped name without the harness prefixes.
 */
export declare function shortName(name: string): string;
/**
 * Resolve installed package metadata without changing its technical identity.
 * @param pkg - package identity and local metadata.
 * @param resolveText - current-locale package text resolver.
 * @returns localized copy with a technical-name fallback and the independent beta status.
 */
export declare function packageText(pkg: Pick<PackageView, 'name' | 'meta'>, resolveText: PluginManagerFace['resolveText']): {
    title: string;
    description: string | undefined;
    beta: boolean;
};
/**
 * Resolve a bundle row's plugin metadata, using its full module specifier as the final title fallback.
 * @param row - row identity and local metadata.
 * @param resolveText - current-locale package text resolver.
 * @returns the row's display title and optional description.
 */
export declare function rowText(row: Pick<PackageRow, 'moduleName' | 'meta'>, resolveText: PluginManagerFace['resolveText']): {
    title: string;
    description: string | undefined;
};
/**
 * A restart prompt with its reason.
 * @param key - the prompt's sentence, which takes the reason as `{reason}`.
 * @param reason - why the change waits for a restart.
 * @param t - the manager's translate seat.
 * @returns the prompt.
 */
export declare function restartText(key: 'restartNotice' | 'installDoneRestart', reason: RestartReason | undefined, t: Translate): string;
/**
 * The sentence one notice shows.
 * @param notice - the last action's outcome.
 * @param t - the manager's translate seat.
 * @returns the sentence.
 */
export declare function noticeText(notice: ManagerNotice, t: Translate): string;
//# sourceMappingURL=presentation.d.ts.map