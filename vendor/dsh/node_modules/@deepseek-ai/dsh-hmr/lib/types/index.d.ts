import { Context, Service, type Fiber, type Plugin } from '@deepseek-ai/cordis';
import type { ModuleJob } from '@deepseek-ai/cordis-plugin-loader';
import { type ChokidarOptions } from 'chokidar';
import z from '@deepseek-ai/schemastery';
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** Serialized plugin-code and configuration reloads. */
        hmr: Hmr;
    }
    interface Events {
        /** A watched file has no module or configuration handler.
         * @mode emit
         * @param url Canonical file URL.
         */
        'hmr/change'(url: string): void;
        /** Module replacements have finished loading.
         * @mode emit
         * @param reloads Replaced plugins and their module locations.
         */
        'hmr/reload'(reloads: Map<Plugin, Reload>): void;
    }
}
/** Module roots and watcher timing, with Chokidar deployment options. */
export interface HmrConfig extends ChokidarOptions {
    /** Directory resolved against the owning context's base URL. */
    base?: string;
    /** Module watch roots; an empty list leaves only explicit configuration watches. */
    root: string[];
    /** Milliseconds for combining module changes. */
    debounce: number;
    /** Glob patterns excluded from module watching. */
    ignored: string[];
}
/** Module location and runtime retained during a replacement. */
export interface Reload {
    filename: string;
    /** Original namespaces and URLs of all entry modules participating in this runtime replacement. */
    modules: ReloadModules;
    runtime?: Plugin.Runtime | undefined;
}
type ReloadFiber = {
    fiber: Fiber;
    entry: Fiber['entry'];
    config: unknown;
    moduleNamespace: unknown;
};
type ReloadModule = {
    filename: string;
    moduleNamespace: unknown;
    plugin: Plugin;
};
/** Entry modules belonging to one runtime, keyed by their original namespaces across replacement. */
declare class ReloadModules {
    private readonly modules;
    static include(reloads: ReadonlyMap<Plugin, Reload>, plugin: Plugin, job: ModuleJob, runtime: Plugin.Runtime | undefined): boolean;
    add(job: ModuleJob, plugin: Plugin): this;
    importRemaining(loader: Context['loader'], getOuterStack: () => string[], primary: ReloadModule): Promise<ReloadModules>;
    getActiveImplementations(ctx: Context, plugin: Plugin, fibers: readonly ReloadFiber[]): Generator<[ReloadFiber, Plugin]>;
    updateEntries(loader: Context['loader']): void;
}
/** Hot reload service with Cordis-compatible module configuration and events. */
declare class Hmr extends Service {
    config: HmrConfig;
    /** Cordis-compatible watcher defaults. */
    static Config: z<HmrConfig>;
    /** Absolute base directory used to resolve module watch roots. */
    baseDir: string;
    private readonly ownerContext;
    private internal;
    private watcher;
    /**
     * Changes from externals will always trigger a full reload.
     * Externals are the dependency tree of the CLI worker entry point.
     */
    private externals;
    /**
     * Files that should be reloaded (accepted changes).
     * Includes all stashed files and their dependents.
     */
    private accepted;
    /**
     * Files that should NOT be reloaded.
     * Includes externals and files whose dependents are all declined.
     */
    private declined;
    /** Stashed file changes waiting to be processed */
    private stashed;
    private operations;
    private readonly executing;
    private applicationReady;
    private closing;
    private readonly configPaths;
    private readonly manifests;
    private readonly files;
    /** Every module statically reachable from the process entry point, including those under node_modules; collected on first use. */
    private hostModules;
    /** Serialize a caller-owned mutation with all automatic reload paths.
     * @param operation Work that must not overlap module or configuration replacement.
     * @returns The operation result after its asynchronous work completes.
     */
    runExclusive<T>(operation: () => Promise<T>): Promise<T>;
    private runReload;
    /** Watch a configuration path through the same queue as module replacement.
     * @param filename Absolute path, which may not exist yet.
     * @param refresh Rebuilds configuration from its current files and awaits Loader completion.
     * @returns Disposer closing this registration and waiting for its pending refresh.
     */
    watchConfig(filename: string, refresh: () => Promise<void>): Promise<() => Promise<void>>;
    constructor(ctx: Context, config: HmrConfig);
    /**
     * The cached ES module job for a URL. The packed worker loader exposes no Node module cache; native Node
     * retains this cache even when asynchronous module hooks run in a separate thread.
     */
    private esmJob;
    /** Whether this thread keeps a Node ES module cache; the packed worker loader keeps none. */
    private hasEsmCache;
    /** Whether the ES module cache holds a job for a URL; `false` when this thread keeps no ES module cache. */
    private esmHas;
    /** ES module cache keys, empty when this thread keeps no ES module cache. */
    private esmUrls;
    /** ES module cache keys and CommonJS cache filenames as URLs. */
    private loadedUrls;
    /** The module job of the process entry point, when the loader cached it under the entry's real path. */
    private mainJob;
    [Service.init](): AsyncGenerator<() => Promise<void>, void, unknown>;
    /** Omit internal HMR frames from module import diagnostics.
     * @returns The preserved outer stack frames.
     */
    getOuterStack: () => string[];
    /** Read direct module dependency URLs from the active Node loader.
     * @param url Module URL.
     * @returns Linked module URLs, or an empty list for an uncached module.
     */
    getLinked(url: string): Promise<string[]>;
    /**
     * Classify changed files into accepted (should reload) and declined (should not).
     *
     * A file is accepted if it's directly changed (stashed) or if any of its
     * dependents are accepted. A file is declined if all its dependents are
     * declined or if it's an external.
     */
    private analyzeChanges;
    private partialReload;
    /**
     * Remove modules from the ES module and CommonJS caches so the next import evaluates their files again.
     *
     * CommonJS modules loaded through `import()` appear in both caches. Node's `LoadCache` maps each URL to per-type
     * jobs, and its own `delete()` only clears one type slot, so whole entries are removed through `Map.prototype`.
     * @returns Restores the removed cache entries.
     */
    private evict;
    /** Loaded `file:` modules below the given profile roots. */
    private profileModules;
    /** Static import edges between loaded modules, across ES module links and CommonJS `require` children. */
    private moduleGraph;
    /**
     * Plan the replacement of changed modules without changing anything. A changed module whose importers reach the
     * process entry point's static graph, or a plugin that no affected Loader entry starts, stays loaded with its
     * importers and is pending. The other changed modules and every module importing them are evicted by
     * {@link stopPlanned}, which also expires the manifests from each changed file up to its root and stops the Loader
     * entries running affected plugins.
     * @param stale Changed module URLs.
     * @param roots Directories, with a trailing separator, that bound the expired manifests.
     * @returns The pending modules and the replacement of the others.
     */
    private planReplacement;
    /**
     * The plugins a loaded module exports, read from the ES module namespace and the CommonJS exports Node cached for it
     * without evaluating anything.
     * @param url Loaded module URL.
     * @returns The exported plugins.
     */
    private pluginsOf;
    /**
     * Carry out a planned replacement: expire its manifests, evict its modules without a backup, and stop its Loader
     * entries, so applying the generation imports the current files when it starts them.
     * @param plan The planned replacement.
     */
    private stopPlanned;
    /**
     * Evict the loaded modules below the directories of mappings a recomposition dropped and expire their package
     * configuration, so a disabled or removed package that is installed or enabled again is imported afresh. Modules of
     * DSH's own static graph, and those below a directory that is still mapped, stay loaded.
     * @param dropped Real directories, with a trailing separator, of the dropped mappings.
     * @param kept Real directories, with a trailing separator, of the mappings that stay.
     */
    private evictDropped;
    /** Report a failed replacement step and retain the caller’s fallback outcome. */
    private contained;
    /**
     * Recompose the profile from its manifest and patch files, replacing running plugins whose loaded files below the
     * profile directory or its linked package targets changed on disk, and publishing its runtime resolution. Changed
     * modules are evicted and the Loader entries running them stop; app-boot's {@link recomposeProfile} then publishes the
     * resolution, applies the generation, starts the stopped entries with the current files and configuration,
     * imports entries whose import failed again, and judges activation. Afterwards the modules below the mappings the
     * recomposition dropped are evicted, so a removed or deselected package is imported afresh when it returns. Callers run
     * inside {@link runExclusive}.
     * @param requiredIds Entry ids whose inactive state is reported as a failure even when it predates this call.
     * @returns Inactive-entry diagnostics, the changed modules that load after a restart, and a profile-wide restart reason.
     * @throws The patch read, publication, preparation, apply, or activation failure of the recomposition, including a
     * replacement plugin that fails to load or start, whose previous code no longer runs.
     */
    reconcileProfile(requiredIds?: readonly string[]): Promise<ProfileReconciliation>;
}
/** Outcome of {@link Hmr.reconcileProfile}. */
export interface ProfileReconciliation {
    /** Diagnostics for Loader entries left inactive. */
    warnings: string[];
    /** Loaded modules whose files changed on disk and whose previous code keeps running until a restart. */
    pending: PendingModule[];
    /**
     * Why every change waits for a restart: `module-comparison` when module caches cannot be inspected or their files
     * compared, even when no URLs are known; `package-moved` when the runtime resolution cannot publish a moved package.
     */
    restartReason?: 'module-comparison' | 'package-moved';
}
/** A changed module that loads only after a restart. */
export interface PendingModule {
    url: string;
    /**
     * `host-module`: the process entry point's static graph imports it. `unmanaged-plugin`: it is imported by a plugin
     * that runs outside a traversable Loader entry. `module-comparison`: loaded modules could not be compared with disk.
     */
    reason: 'host-module' | 'unmanaged-plugin' | 'module-comparison';
}
declare namespace Hmr {
    /** Cordis-compatible configuration type. */
    type Config = HmrConfig;
}
export default Hmr;
//# sourceMappingURL=index.d.ts.map