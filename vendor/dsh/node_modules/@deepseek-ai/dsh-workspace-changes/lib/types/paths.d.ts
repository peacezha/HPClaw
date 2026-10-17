/**
 * Slash-separated form of a native relative path.
 * @param path - native path.
 * @returns the same path with `/` separators.
 */
export declare function toPosix(path: string): string;
/**
 * Whether `path` is `root` or lies under it.
 * @param root - absolute directory.
 * @param path - absolute path to test.
 * @returns true for the root itself and every descendant.
 */
export declare function isInside(root: string, path: string): boolean;
/**
 * Canonical spellings of the temporary directories a workspace-write sandbox
 * grants: the host `/tmp` and the platform temp area, each also in its
 * symlink-resolved form so `/tmp` and `/private/tmp` match alike.
 * @param candidates - directories to canonicalize.
 * @returns absolute directory paths.
 */
export declare function temporaryRoots(candidates?: readonly string[]): Promise<string[]>;
/**
 * Symlink-resolved path. A path that does not exist yet is resolved through
 * its nearest existing ancestor, so a file created through a directory
 * symlink has the same canonical spelling before and after it exists.
 * @param path - absolute path.
 * @returns the canonical spelling git reports for the path.
 */
export declare function canonicalPath(path: string): Promise<string>;
/**
 * Whether a file lives under a temporary root, where the model keeps scratch work.
 * @param path - absolute file path.
 * @param roots - {@link temporaryRoots}.
 * @returns true for scratch paths that never enter the change summary.
 */
export declare function isTemporaryPath(path: string, roots: readonly string[]): boolean;
/**
 * Sort key and label of a changed file; see `WorkspaceChangedFile.display`.
 * @param absolute - canonical absolute file path.
 * @param cwd - canonical Session working directory.
 * @param root - repository top-level directory.
 * @param home - canonical home directory, or empty to skip the `~` form.
 * @returns the slash-separated display path.
 */
export declare function displayPathOf(absolute: string, cwd: string, root: string, home: string): string;
/**
 * The durable `path` field: relative inside the working directory, absolute elsewhere.
 * @param absolute - canonical absolute file path.
 * @param cwd - canonical Session working directory.
 * @returns the path the Web client opens the file through.
 */
export declare function durablePathOf(absolute: string, cwd: string): string;
/**
 * Code-unit order of display paths, which places `../` and absolute paths
 * before letters and matches git's own listing order for relative paths.
 * @param a - first file.
 * @param b - second file.
 * @returns negative, zero, or positive as `Array.prototype.sort` expects.
 */
export declare function compareDisplay(a: {
    display: string;
}, b: {
    display: string;
}): number;
//# sourceMappingURL=paths.d.ts.map