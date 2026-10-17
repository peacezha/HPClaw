/** Model-facing query for a bundled Python, Node.js, and pnpm payload, in place or installed under the Harness home. */
import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
/** Cordis plugin identity. */
export declare const name = "tool-workspace-dependencies";
/** Registry the tool registers into. */
export declare const inject: string[];
/** Payload location and optional installation directory. */
export interface Config {
    /** Payload directory carrying `runtime.json` and `dependencies/`. */
    readonly source: string;
    /**
     * Installation directory under the Harness home. When set, the payload is copied there on the
     * first call (the Desktop behavior); when omitted, the payload is used in place without copying,
     * which suits read-only carriers such as container image layers.
     */
    readonly root?: string;
}
/** Require a named payload source before the Loader activates the tool. */
export declare const Config: z<Config>;
/** Canonical build metadata, independent of user-installed packages; legacy files are normalized on read. */
export interface PrimaryRuntimeManifest {
    readonly desktopVersion: string;
    readonly platform: string;
    readonly arch: string;
    /** Locked payload identity; absent only in installations made before payload hashing. */
    readonly payloadDigest?: string;
    /** Bundled Python interpreter version. */
    readonly python: string;
    /** Absent when the payload ships no Node.js. */
    readonly node?: string;
    /** Bundled pnpm version; requires a bundled Node.js executable. */
    readonly pnpm?: string;
    /** All recorded Python distribution versions; empty for legacy files without a distribution map. */
    readonly pythonPackages: Readonly<Record<string, string>>;
}
/** Absolute entry points and bundled versions; pnpm runs through the returned Node executable. */
export interface WorkspaceDependencies {
    readonly python: string;
    readonly node?: string;
    readonly pnpm?: string;
    readonly pythonPackages: string;
    readonly nodePackages?: string;
    /** Locked distribution versions; excludes packages users add to the installed environment. */
    readonly pythonDistributions: Readonly<Record<string, string>>;
}
/**
 * Validate payload JSON and normalize legacy component fields to top-level versions.
 * @param value - Untrusted decoded runtime.json contents.
 * @returns Canonical metadata with one Python distribution map and no components field.
 * @throws For malformed or mixed formats, duplicate distribution names, or inconsistent legacy metadata.
 */
export declare function parsePrimaryRuntime(value: unknown): PrimaryRuntimeManifest;
/**
 * Read and normalize build metadata without rewriting the source file.
 * @param root - Installed or bundled primary runtime directory.
 * @returns Validated top-level versions and target identifiers, including for legacy components manifests.
 */
export declare function readPrimaryRuntime(root: string): Promise<PrimaryRuntimeManifest>;
/**
 * Identify POSIX interpreter aliases that can survive payload relocation.
 * @param root - Payload directory.
 * @param manifest - Validated payload metadata.
 * @returns Relative alias paths mapped to their sibling interpreter filename; regular command files are omitted.
 * @throws When an interpreter alias does not point directly to the versioned regular file.
 */
export declare function primaryRuntimePythonAliases(root: string, manifest: PrimaryRuntimeManifest): Promise<ReadonlyMap<string, string>>;
/**
 * Copy a payload, retaining only validated Python interpreter aliases as relative links.
 * @param source - Payload directory; all other links are materialized.
 * @param destination - Empty destination owned by the caller.
 * @param manifest - Validated source metadata.
 * @returns Resolves after every copied file and interpreter alias is available independently of the source.
 */
export declare function copyPrimaryRuntime(source: string, destination: string, manifest: PrimaryRuntimeManifest): Promise<void>;
/**
 * Resolve platform-specific interpreter and library locations without changing the environment.
 * @param root - Absolute payload or installation directory.
 * @param manifest - Validated runtime metadata.
 * @returns Absolute paths for explicit script execution and recorded bundled Python versions.
 */
export declare function workspaceDependencyPaths(root: string, manifest: PrimaryRuntimeManifest): WorkspaceDependencies;
/**
 * Use a payload where it lies: validate its metadata and entries, copying nothing.
 * @param source - Payload directory, typically a read-only carrier.
 * @returns Paths into the payload itself.
 */
export declare function resolvePrimaryRuntime(source: string): Promise<WorkspaceDependencies>;
/**
 * Install the application-owned payload locally, retaining a complete previous tree on copy failure.
 * @param source - Payload carried by the current installation.
 * @param root - Fixed primary runtime directory under the Harness home.
 * @returns Paths into the installed payload; no PATH or package-manager configuration is changed.
 */
export declare function installPrimaryRuntime(source: string, root: string): Promise<WorkspaceDependencies>;
/**
 * Register the read-only path query; the first invocation prepares (or merely validates) the payload.
 * @param ctx - Tool registry owner.
 * @param config - Payload location and optional installation directory.
 */
export declare function apply(ctx: Context, config: Config): void;
//# sourceMappingURL=index.d.ts.map