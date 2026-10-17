import type { ReactNode } from 'react';
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { WorkspaceDiffHunk } from '@deepseek-ai/dsh-workspace-changes/types';
import type { ChangesDiffState } from './changes-diff.ts';
import type { NS } from './locales.ts';
/** Maximum rendered lines per comparison. */
export declare const MAX_RENDERED_LINES = 5000;
/** One drawn line of a hunk with its line numbers on each side. */
export interface DiffRow {
    kind: 'add' | 'del' | 'context';
    old: number | undefined;
    new: number | undefined;
    text: string;
}
/** One side-by-side row: the old side, the new side, or both. */
export interface SplitRow {
    left?: {
        no: number;
        text: string;
        kind: 'del' | 'context';
    };
    right?: {
        no: number;
        text: string;
        kind: 'add' | 'context';
    };
}
/**
 * Number a hunk's lines: context lines count on both sides, deletions on the
 * old side, additions on the new side.
 * @param hunk - a served hunk.
 * @returns the rows in order.
 */
export declare function hunkRows(hunk: WorkspaceDiffHunk): DiffRow[];
/**
 * Pair a hunk's lines for the side-by-side view: each run of deletions is
 * aligned with the run of additions that follows it, row by row, and context
 * lines sit on both sides.
 * @param hunk - a served hunk.
 * @returns the rows in order.
 */
export declare function splitRows(hunk: WorkspaceDiffHunk): SplitRow[];
/**
 * The hunks to draw, cut at {@link MAX_RENDERED_LINES} lines in total.
 * @param hunks - served hunks.
 * @returns the hunks with the last one shortened as needed, and whether anything was cut.
 */
export declare function renderedHunks(hunks: readonly WorkspaceDiffHunk[]): {
    hunks: WorkspaceDiffHunk[];
    truncated: boolean;
};
/**
 * Render a file comparison with the same states and highlighting in previews and review tabs.
 * Addition-only and deletion-only comparisons use one column without changing the requested layout.
 * @param props - comparison state, layout choices, retry action, and localized copy.
 * @returns the comparison or its loading, unavailable, or error state.
 */
export declare function FileDiff({ state, split, wrap, retry, t }: {
    state: ChangesDiffState | undefined;
    split: boolean;
    wrap: boolean;
    retry: () => void;
} & PropsLocale<typeof NS>): ReactNode;
//# sourceMappingURL=FileDiff.d.ts.map