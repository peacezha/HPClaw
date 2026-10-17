import type { SubprocessRuntime } from '@deepseek-ai/dsh-subprocess';
import { type NumstatEntry } from './numstat.ts';
/** Settled git command facts; a nonzero exit is a result, not an exception. */
export interface GitRunResult {
    exitCode: number | null;
    stdout: string;
    stderr: string;
    /** True when stdout exceeded the output cap and lost its head. */
    truncated: boolean;
}
/** Per-command spawn facts. */
export interface GitRunOptions {
    cwd: string;
    env?: Readonly<Record<string, string>> | undefined;
    stdin?: string | undefined;
    /** In-memory stdout cap for this command, replacing the runner's `outputMaxBytes`. */
    maxBytes?: number | undefined;
    signal: AbortSignal;
}
/** Bounds every git command runs under. */
export interface GitLimits {
    /** Milliseconds before a command is terminated. */
    timeoutMs: number;
    /** In-memory stdout cap in bytes. */
    outputMaxBytes: number;
}
/** Runs one resolved git executable with scrubbed environment, timeout, and bounded output. */
export declare class GitRunner {
    private readonly subprocess;
    private readonly executable;
    private readonly limits;
    constructor(subprocess: SubprocessRuntime, executable: string, limits: GitLimits);
    /**
     * Run `git <args>` to completion.
     * @param args - git arguments; never shell-interpreted.
     * @param options - working directory, extra environment, stdin data, and cancellation.
     * @returns exit facts and collected output.
     * @throws when the command times out, is aborted, or cannot spawn.
     */
    run(args: readonly string[], options: GitRunOptions): Promise<GitRunResult>;
}
/** The repository enclosing a Session working directory and the private directory its snapshots write to. */
export interface GitWorkspace {
    /** Repository top-level directory, the root every diff path is relative to. */
    root: string;
    /** Absolute git directory holding the repository's index. */
    gitDir: string;
    /** Private directory holding the snapshot object store and each snapshot's scratch index. */
    scratch: string;
    /** Environment that routes object writes to the private store and object reads through the repository's store. */
    env: Readonly<Record<string, string>>;
    /** Work-tree paths a snapshot must skip: the private directory when a temporary root lies inside the work tree. */
    excludes: readonly string[];
}
/**
 * Locate the repository enclosing a working directory and prepare the private
 * directory its snapshots write to. The repository's own object store is
 * attached read-only as an alternate, so snapshots read committed content from
 * it and write nothing into it. A private directory that lies inside the work
 * tree, as a temporary root under the workspace does, is excluded from every
 * snapshot. A directory outside any repository yields null; any other git
 * failure throws.
 * @param git - command runner.
 * @param cwd - absolute Session working directory.
 * @param scratch - yields the private directory for snapshot objects and scratch indexes; called only for a located repository.
 * @param signal - cancellation.
 * @returns the repository, or null when the directory is not inside one.
 */
export declare function locateGitWorkspace(git: GitRunner, cwd: string, scratch: () => Promise<string>, signal: AbortSignal): Promise<GitWorkspace | null>;
/**
 * Write the complete work tree, including untracked and modified files but
 * not ignored ones, as a tree object through a private index seeded from the
 * repository's index. New blobs and the tree land in the private object store;
 * the repository's index, object store, work tree, and refs stay unchanged,
 * and an in-progress merge keeps its unmerged entries.
 * @param git - command runner.
 * @param workspace - addressed repository.
 * @param signal - cancellation.
 * @returns the tree object id.
 */
export declare function snapshotTree(git: GitRunner, workspace: GitWorkspace, signal: AbortSignal): Promise<string>;
/** A blob one snapshot tree holds at a path. */
export interface TreeBlob {
    oid: string;
    /** Object size in bytes. */
    size: number;
}
/**
 * The blob a snapshot tree holds at one path.
 * @param git - command runner.
 * @param workspace - addressed repository.
 * @param tree - snapshot tree id.
 * @param path - slash-separated path relative to the repository root.
 * @param signal - cancellation.
 * @returns the blob, or null when the tree holds nothing at the path or holds a gitlink or tree there.
 */
export declare function treeBlob(git: GitRunner, workspace: GitWorkspace, tree: string, path: string, signal: AbortSignal): Promise<TreeBlob | null>;
/**
 * The text of one blob whose size {@link treeBlob} reported within the cap.
 * @param git - command runner.
 * @param workspace - addressed repository.
 * @param oid - blob id.
 * @param maxBytes - inclusive byte cap the caller checked the blob's size against.
 * @param signal - cancellation.
 * @returns the blob decoded as UTF-8.
 */
export declare function blobText(git: GitRunner, workspace: GitWorkspace, oid: string, maxBytes: number, signal: AbortSignal): Promise<string>;
/**
 * Per-file line counts between two snapshot trees, with renames detected.
 * @param git - command runner.
 * @param workspace - addressed repository.
 * @param before - turn-start tree id.
 * @param after - turn-end tree id.
 * @param signal - cancellation.
 * @returns changed files relative to the repository root.
 * @throws when git fails or the output exceeded the cap.
 */
export declare function diffTrees(git: GitRunner, workspace: GitWorkspace, before: string, after: string, signal: AbortSignal): Promise<NumstatEntry[]>;
/**
 * Work-tree directories the index records as gitlinks: nested repositories and
 * submodules, whose contents snapshots never descend into and `check-ignore`
 * refuses to classify.
 * @param git - command runner.
 * @param workspace - addressed repository.
 * @param signal - cancellation.
 * @returns slash-separated gitlink paths relative to the repository root.
 */
export declare function gitlinkPaths(git: GitRunner, workspace: GitWorkspace, signal: AbortSignal): Promise<Set<string>>;
/**
 * The subset of work-tree paths that the repository ignores. Tracked files
 * are never reported, so a tracked file matching an ignore pattern still
 * counts as covered by snapshots.
 * @param git - command runner.
 * @param workspace - addressed repository.
 * @param paths - slash-separated paths relative to the repository root.
 * @param signal - cancellation.
 * @returns the ignored members of `paths`.
 */
export declare function ignoredPaths(git: GitRunner, workspace: GitWorkspace, paths: readonly string[], signal: AbortSignal): Promise<Set<string>>;
//# sourceMappingURL=git.d.ts.map