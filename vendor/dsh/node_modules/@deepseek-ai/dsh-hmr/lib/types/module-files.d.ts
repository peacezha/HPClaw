/**
 * Records the inode, size and modification time of loaded `file:` modules. A module is stale when its file
 * disappeared or its identity differs from the recorded one. Change time is not recorded: creating a hard link to a
 * file, as pnpm does when it imports from its store, changes it without changing content. A module first loaded after
 * the last observation has no record; it is stale when its file was modified at or after that observation, less the
 * timestamp resolution, so a reinstall between loading and the next comparison is detected at the cost of reloading a
 * module that was first loaded after such a write.
 */
export declare class ModuleFiles {
    /** Identity per recorded module; `undefined` marks a stale module, such as a pending one first loaded after the last observation. */
    private records;
    private observedAt;
    /**
     * The current time of the clock the operating system stamps local file writes with, read from a new marker file that is
     * removed again. The system clock and file timestamps can differ by a clock tick in either direction, so module files
     * are compared with this time; when no marker can be created, the system clock is used.
     * @returns Epoch milliseconds.
     */
    now(): number;
    /**
     * Compare loaded file modules with disk.
     * @param urls `file:` URLs of the loaded modules to compare.
     * @returns URLs of stale modules, and the identity read for each compared URL (`undefined` for a missing file).
     */
    compare(urls: Iterable<string>): {
        stale: Set<string>;
        seen: Map<string, string | undefined>;
    };
    /**
     * Replace every record with the identities of the given loaded modules.
     * @param urls `file:` URLs of the loaded modules to record.
     * @param options `seen` supplies identities read earlier for modules whose cache entry has not changed since, so a
     * later write stays detectable; other modules are read now, and stay stale when their file was modified after `at`.
     * `retained` modules keep their record, or are marked stale when they have none. `at` is the observation time from
     * {@link now} used for unrecorded modules.
     */
    observe(urls: Iterable<string>, options?: {
        seen?: ReadonlyMap<string, string | undefined>;
        retained?: ReadonlySet<string>;
        at?: number;
    }): void;
    /**
     * Record the current identity of modules just evaluated again, leaving every other record unchanged.
     * @param urls `file:` URLs of the re-evaluated modules.
     */
    refresh(urls: Iterable<string>): void;
}
//# sourceMappingURL=module-files.d.ts.map