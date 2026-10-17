/** Package directory and resource canonicalization through the active runtime carrier's filesystem. */
/**
 * Resolve a directory through the active carrier's filesystem implementation.
 * @param path - directory path to canonicalize.
 * @returns the canonical directory path.
 */
export declare function realModuleDirectory(path: string): string;
/** Canonicalize a module resource, preserving physical file aliases.
 * SEA archive files are symlink-free and support stat and reads, while their containing directories support realpath.
 * @param path Existing module resource path.
 * @returns Canonical resource path under the active carrier's filesystem.
 * @throws When the resource or its directory cannot be inspected or resolved.
 */
export declare function realModuleFile(path: string): string;
//# sourceMappingURL=legacy-links.d.ts.map