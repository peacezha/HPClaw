/** Evaluate plugin dsh requirements (`engines.dsh`, else dsh peers) without importing plugin code. */
/** Unmet dsh requirements and the exact plugin/runtime exemption decision. */
export interface PluginCompatibility {
    name: string;
    version: string;
    runtimeVersion: string;
    /** Only requirements the running dsh version does not satisfy: `engines.dsh`, or dsh peer package names. */
    requirements: Record<string, string>;
    exempted: boolean;
}
/**
 * Read this app-boot package's version in both source and bundled installations.
 * @returns the validated runtime semantic version, preserving its exact spelling.
 * @throws if package.json cannot be read or its version is missing or invalid.
 */
export declare function getDshRuntimeVersion(): string;
/**
 * Check the plugin's dsh requirements against the runtime. An own `engines.dsh` range decides alone and
 * peerDependencies are ignored; otherwise every @deepseek-ai/dsh or @deepseek-ai/dsh-* peer must match.
 * Prereleases participate in ranges. For peers only, workspace:^, workspace:~, and workspace:* refer to
 * the current runtime; other empty or invalid ranges, including any workspace: `engines.dsh`, are unmet.
 * @param manifest - parsed plugin package.json; inherited fields are ignored.
 * @param exemptions - exact plugin name@version keys mapped to exact runtime versions.
 * @param runtimeVersion - running dsh version, defaulting to this app-boot package.
 * @returns unmet requirements and exemption status, or undefined when every requirement is met.
 * @throws for malformed manifest engines or peer fields, invalid runtime versions, or missing identity on a mismatch.
 */
export declare function evaluatePluginCompatibility(manifest: object, exemptions?: Readonly<Record<string, readonly string[]>>, runtimeVersion?: string): PluginCompatibility | undefined;
/**
 * Describe unmet requirements, their risk, and the exact-version remedy.
 * Surfaces with their own grant mechanism or locale render the structured result themselves.
 * @param issue - incompatible plugin/runtime result, including exempted mismatches.
 * @returns an English diagnostic for logs and stderr.
 */
export declare function pluginCompatibilityWarning(issue: PluginCompatibility): string;
//# sourceMappingURL=plugin-compatibility.d.ts.map