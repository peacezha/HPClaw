/** Read plugin display text and icons through exported resources without evaluating plugin code. */
import type { PluginLocalizedMeta } from '@deepseek-ai/dsh-package-manifest';
/**
 * Resolve a plugin resource through the active Node ESM resolver without evaluating it.
 * @param specifier - plugin module or exported resource specifier.
 * @param parentURL - owning module-resolution base.
 * @returns the local filesystem path selected by Node and the active profile.
 * @throws when the resolver is unavailable or the resource cannot resolve to a local file.
 */
export declare function resolvePluginResource(specifier: string, parentURL: string): string;
/**
 * Read plugin locale JSON display text and icon without evaluating JavaScript entries.
 * Only a package-root specifier reads its exported package.json: `name`/`description` fill missing
 * locale fields, and a declared `icon` takes priority over the `<specifier>/icon` resource.
 * A subpath specifier never reads package.json; its icon comes only from `<specifier>/icon`.
 * Manifest icons remain inside their declaring directory; exported icons remain inside their
 * owning package after realpath resolution. Both accept SVG, PNG, JPEG, or WebP up to 256 KiB.
 * Icon failures retain display text without falling back.
 * Non-package specifiers are skipped without invoking the resource resolver.
 * Language files share the directory containing the resolved English resource;
 * each file is resolved through the complete plugin specifier before reading.
 * Translation maps retain an English fallback, ultimately the full module specifier
 * for titles and empty for descriptions.
 * @param specifier - configured plugin module name, including any package subpath.
 * @param parentURL - owning Loader tree's module-resolution base.
 * @returns display fields and any resource diagnostic, or undefined for non-package specifiers or absent metadata.
 */
export declare function readPluginMeta(specifier: string, parentURL: string): PluginLocalizedMeta | undefined;
//# sourceMappingURL=package-meta.d.ts.map