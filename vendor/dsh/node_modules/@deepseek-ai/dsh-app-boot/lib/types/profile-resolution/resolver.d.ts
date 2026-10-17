/** In-memory profile package routing for Node's default ESM and CommonJS loaders. */
import type { RuntimeResolution } from '../profile.ts';
/** A successor resolution the running process cannot adopt, such as a retained mapping in another directory; it waits for a restart. */
export declare class ResolutionRestartRequired extends Error {
    /** @param message Diagnostic naming the rejected changes. */
    constructor(message: string);
}
/** Active interception in one Node isolate. */
export interface RuntimeInterception {
    /**
     * Locate a bare package without requiring one of its exports.
     * A package subpath selects its package directory without resolving or validating the requested file.
     * @param specifier - bare package or package-subpath specifier.
     * @param parentURL - file URL whose lookup order applies.
     * @returns selected package directory, or undefined when it is absent.
     */
    packageDir(specifier: string, parentURL: string): string | undefined;
    /**
     * Atomically publish a complete successor and fresh caches. Profile-scoped mappings, local names, and linked
     * roots may be removed; removed roots stop intercepting uncovered directories. A retained profile mapping may
     * change its version and declarer when its normalized directory and scope stay unchanged, as when a package is
     * upgraded in place. Existing modules and Node caches remain intact: callers remove a package only after its
     * plugins stop, and replace the loaded modules of a package upgraded in place separately.
     * A previously published link name may point to another real directory; callers stop the plugins of its previous
     * target first, as removing and installing the package again does.
     * @param successor - fully constructed generation retaining the installation mappings.
     * @throws when the profile scope changes; and `ResolutionRestartRequired` when a retained profile mapping's real
     * directory or scope, or an installation version or declarer changes; an installation mapping is removed; or a new
     * local name overrides an existing mapping.
     */
    replace(successor: RuntimeResolution): void;
    /** Restore the native resolver methods. Interceptions dispose in reverse order. */
    dispose(): void;
}
/**
 * Split a bare request into its package name without allocating path segments.
 * @param request - module specifier to classify.
 * @returns the bare package name, or undefined for non-package requests.
 */
export declare function barePackageName(request: string): string | undefined;
/**
 * Install one runtime resolution as the interception on Node's default ESM and CommonJS resolvers.
 * @param resolution - complete package table and profile scope.
 * @returns an interception that publishes a successor or restores the native methods.
 */
export declare function installRuntimeInterception(resolution: RuntimeResolution): RuntimeInterception;
/**
 * Publish one runtime resolution for Harness-owned Workers.
 * @param resolution - complete package table and profile scope.
 * @returns a disposer restoring the previous thread environment data.
 */
export declare function registerWorkerResolution(resolution: RuntimeResolution): () => void;
//# sourceMappingURL=resolver.d.ts.map