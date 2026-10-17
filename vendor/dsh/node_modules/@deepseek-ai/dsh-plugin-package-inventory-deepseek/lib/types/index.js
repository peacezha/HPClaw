/**
 * Active Loader-backed plugin package inventory for official DeepSeek requests.
 * Host entries and the requesting agent's standing preset are resolved at request time;
 * installed dependencies and plugin fibers without Loader-backed package identity are excluded.
 * @module @deepseek-ai/dsh-plugin-package-inventory-deepseek
 */
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, isAbsolute, join, parse } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import z from '@deepseek-ai/schemastery';
import { brandString } from '@deepseek-ai/dsh-brand';
/** Cordis plugin name. */
export const name = 'plugin-package-inventory-deepseek';
/** Services required to locate host/requesting-agent entries and contribute the field. */
export const inject = ['agents', 'deepseekLlmApiExtensions', 'loader'];
/** Validated plugin-package request contribution configuration. */
export const Config = z.object({
    enabled: z.boolean().default(true),
});
/** Parse a bare package or package-subpath specifier into its package name. */
function barePackageName(specifier) {
    if (specifier.startsWith('.') || specifier.includes(':') || isAbsolute(specifier))
        return undefined;
    const [first = '', second = ''] = specifier.split('/');
    // An active Loader entry already passed module resolution, so a scoped bare name has its package segment.
    return first.startsWith('@') ? `${first}/${second}` : first;
}
/** Read a named identity, including its version only when it is a non-blank string. */
function identityFromManifest(path) {
    const manifest = JSON.parse(readFileSync(path, 'utf8'));
    if (typeof manifest.name !== 'string' || manifest.name.trim().length === 0)
        return undefined;
    return typeof manifest.version === 'string' && manifest.version.trim().length > 0
        ? { name: manifest.name, version: manifest.version }
        : { name: manifest.name };
}
/** Resolve a bare package without requiring it to export `./package.json`. */
function barePackageManifest(packageName, anchors, packages) {
    for (const anchor of anchors) {
        const pkg = packages?.packageOf(packageName, anchor);
        if (pkg !== undefined)
            return pkg.manifestPath;
        if (packages !== undefined)
            continue;
        for (const searchPath of createRequire(anchor).resolve.paths(packageName)) {
            const manifest = join(searchPath, packageName, 'package.json');
            if (existsSync(manifest))
                return manifest;
        }
    }
    return undefined;
}
/** Find the nearest owning manifest for a relative or absolute plugin module. */
function nearestManifest(modulePath) {
    let current = dirname(modulePath);
    const root = parse(current).root;
    while (true) {
        const manifest = join(current, 'package.json');
        if (existsSync(manifest))
            return manifest;
        if (current === root)
            return undefined;
        current = dirname(current);
    }
}
/** Exact package identity resolver with immutable per-process manifest caching. */
class PackageIdentityResolver {
    hostBaseUrl;
    packages;
    // TODO: Invalidate manifest identities if in-process package-version replacement becomes a supported upgrade path.
    cache = new Map();
    constructor(hostBaseUrl, packages) {
        this.hostBaseUrl = hostBaseUrl;
        this.packages = packages;
    }
    /** Resolve one Loader entry's owning package, or absence for a non-package loose module. */
    resolve({ moduleName, baseUrl, bareBaseUrl }) {
        /* v8 ignore next -- Loader entry trees inherit a base URL; the fallback supports direct embedders. */
        const treeBase = baseUrl ?? this.hostBaseUrl;
        const anchors = [...new Set([bareBaseUrl ?? treeBase, treeBase, this.hostBaseUrl, import.meta.url])];
        const key = `${anchors.join('\u0000')}\u0000${moduleName}`;
        if (this.cache.has(key))
            return this.cache.get(key);
        const packageName = barePackageName(moduleName);
        let manifest;
        if (packageName !== undefined) {
            manifest = barePackageManifest(packageName, anchors, this.packages);
            if (manifest === undefined) {
                throw new Error(`plugin-package-inventory-deepseek: cannot resolve active package ${JSON.stringify(packageName)}`);
            }
        }
        else if (!moduleName.startsWith('cordis:')) {
            const moduleUrl = isAbsolute(moduleName)
                ? pathToFileURL(moduleName)
                : new URL(moduleName, treeBase);
            if (moduleUrl.protocol === 'file:')
                manifest = nearestManifest(fileURLToPath(moduleUrl));
        }
        const identity = manifest === undefined ? undefined : identityFromManifest(manifest);
        this.cache.set(key, identity);
        return identity;
    }
}
/** Yield active, non-structural entries from one Loader tree. */
function activeEntries(tree) {
    return [...tree.entries()]
        .filter(entry => !entry.options.group
        && !entry.disabled
        && entry.fiber?.state === 2 /* FiberState.ACTIVE */)
        .map(entry => ({
        moduleName: entry.options.name,
        ...entry.parent.tree.ctx.baseUrl === undefined ? {} : { baseUrl: entry.parent.tree.ctx.baseUrl },
    }));
}
/** Deterministic text order independent of the host's ICU data and locale. */
function compareWireText(left, right) {
    return left < right ? -1 : left > right ? 1 : 0;
}
/** Collect available identities from active packages for one request. */
function collectActivePluginPackages(ctx, resolver, hostBaseUrl, unreadable, sessionId) {
    const entries = activeEntries(ctx.loader);
    const presets = ctx.get('agentPresets');
    if (sessionId !== undefined && presets !== undefined) {
        const agent = ctx.agents.get(brandString(sessionId));
        if (agent !== undefined) {
            for (const composition of presets.inspectCompositions(agent.ctx)) {
                entries.push(...composition.modules.map(({ useHostBase, ...entry }) => ({
                    ...entry,
                    ...useHostBase ? { bareBaseUrl: hostBaseUrl } : {},
                })));
            }
        }
    }
    const unique = new Map();
    for (const activeEntry of entries) {
        let identity;
        try {
            identity = resolver.resolve(activeEntry);
        }
        catch (error) {
            if (!unreadable.has(activeEntry.moduleName)) {
                unreadable.add(activeEntry.moduleName);
                ctx.logger.warn('plugin-package-inventory-deepseek: omitting unreadable package identity for %s: %o', activeEntry.moduleName, error);
            }
            continue;
        }
        if (identity === undefined)
            continue;
        unique.set(`${identity.name}\u0000${identity.version ?? ''}`, identity);
    }
    return [...unique.values()].sort((left, right) => (compareWireText(left.name, right.name) || compareWireText(left.version ?? '', right.version ?? '')));
}
/**
 * Register the complete `dsh_plugin_packages` request contribution when enabled.
 * @param ctx - plugin context carrying Loader entry metadata and the DeepSeek request-extension registry.
 * @param config - validated default-on configuration.
 */
export function apply(ctx, config) {
    if (config.enabled === false)
        return;
    const hostBaseUrl = ctx.baseUrl ?? import.meta.url;
    const resolver = new PackageIdentityResolver(hostBaseUrl, ctx.get('pluginPackages'));
    // Unreadable identities are re-resolved on every request; log each module once.
    const unreadable = new Set();
    ctx.deepseekLlmApiExtensions.register('dsh_plugin_packages', {
        prepare: (request) => {
            const value = {
                version: 1,
                packages: collectActivePluginPackages(ctx, resolver, hostBaseUrl, unreadable, request.sessionId),
            };
            return { value };
        },
    });
}
//# sourceMappingURL=index.js.map