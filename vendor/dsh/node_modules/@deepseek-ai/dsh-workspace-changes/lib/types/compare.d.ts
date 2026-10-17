import type { WorkspaceDiffHunk } from './types.ts';
/** Hunks, whether the timeout degraded them, and the changed-line totals they carry. */
export interface Comparison {
    hunks: WorkspaceDiffHunk[];
    coarse: boolean;
    added: number;
    deleted: number;
}
/**
 * Compare two texts line by line. A side that is null means the file did not
 * exist. A comparison exceeding `timeoutMs` yields one hunk that deletes every
 * old line and adds every new line.
 * @param before - turn-start text, or null.
 * @param after - turn-end text, or null.
 * @param timeoutMs - milliseconds the line comparison may run.
 * @returns hunks and totals; no hunks when both sides hold the same lines.
 */
export declare function compareText(before: string | null, after: string | null, timeoutMs: number): Comparison;
//# sourceMappingURL=compare.d.ts.map