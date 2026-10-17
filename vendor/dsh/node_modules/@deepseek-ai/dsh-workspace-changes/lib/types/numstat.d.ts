/** Parsing of `git diff-tree --numstat -z` output. */
/** One `--numstat` record; paths are slash-separated and relative to the repository root. */
export interface NumstatEntry {
    path: string;
    /** The path before a detected rename; absent for a file that kept its path. */
    oldPath?: string;
    added: number;
    deleted: number;
    binary: boolean;
}
/**
 * Parse NUL-terminated numstat records. A rename record carries an empty path
 * followed by the old and new paths.
 * @param output - complete stdout of `git diff-tree -r -M -z --numstat`.
 * @returns records in git's output order.
 * @throws when a record is malformed, which indicates truncated output.
 */
export declare function parseNumstat(output: string): NumstatEntry[];
//# sourceMappingURL=numstat.d.ts.map