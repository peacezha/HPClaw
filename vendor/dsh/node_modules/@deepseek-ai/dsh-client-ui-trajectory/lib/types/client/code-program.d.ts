/** Read replayable PTC source and language hints from recorded tool arguments and schemas. */
import type { TrajectoryCellProps } from './trajectory-record.ts';
/** Recorded name of the programmatic tool-calling entry point. */
export declare const PTC_TOOL_NAME = "run_code";
/** Validated source and original arguments for one recorded run_code call. */
export interface CodeProgram {
    rawInput: string;
    source: string;
    description: string;
    arguments: Record<string, unknown>;
    language: 'typescript' | 'python' | undefined;
}
/**
 * Resolve a PTC program without guessing its language from source or current runtime settings.
 * @param cell - Recorded tool arguments and the schema visible at call time.
 * @returns The program, or undefined for another tool or unsupported arguments.
 */
export declare function codeProgram(cell: TrajectoryCellProps): CodeProgram | undefined;
//# sourceMappingURL=code-program.d.ts.map