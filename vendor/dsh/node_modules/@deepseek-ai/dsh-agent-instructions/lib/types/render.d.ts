/**
 * Model-facing workspace instruction rendering within an explicit byte budget.
 *
 * @module @deepseek-ai/dsh-agent-instructions/render
 */
import type { InstructionFile, LoadedInstructionFile } from './files.ts';
/** Byte-accounting record for one truncated instruction file. */
export interface TruncatedInstruction {
    displayPath: string;
    originalBytes: number;
    includedBytes: number;
}
/** Model-facing text plus omitted and truncated source records. */
export interface RenderedAgentInstructions {
    text: string;
    omitted: InstructionFile[];
    truncated: TruncatedInstruction[];
}
/** Structured dynamic state persisted outside model-visible prompt prose. */
export interface AgentInstructionChange {
    action: 'set' | 'replace' | 'remove';
    scope: string;
    path: string;
    digest?: string;
}
/** One state transition paired with the content used to render it. */
export interface ChangeRenderItem {
    change: AgentInstructionChange;
    file: LoadedInstructionFile;
}
/** Directory component that identifies the harness-home user-global instruction scope. */
export declare const USER_GLOBAL_DIRECTORY = "user-global";
/**
 * Directory component that identifies the shared agents-root user-global scope.
 *
 * It is a distinct scope so the harness-home file keeps the scope key that
 * earlier sessions recorded, while {@link instructionCandidateGroup} still
 * deduplicates the two roots as one candidate group.
 */
export declare const AGENTS_GLOBAL_DIRECTORY = "agents-global";
/**
 * Ordered user-global scope directories.
 *
 * Discovery, baseline reconciliation, and deduplication all iterate this order,
 * so the harness home stays the candidate that decides content duplicates
 * against the shared agents root.
 */
export declare const USER_GLOBAL_DIRECTORIES: readonly ["user-global", "agents-global"];
/**
 * File name of the user-global instruction file under each user-global root.
 * Discovery (`<root>/<name>`) and reconciliation (the user-global scope key's
 * candidate component) both key on this name, so it lives in one place: were the
 * two to disagree, the user-global instruction would load but never reconcile.
 */
export declare const USER_GLOBAL_FILE = "AGENTS.md";
/**
 * Derive the logical instruction scope from a model-facing path.
 * @param displayPath - project-relative or user-global instruction path.
 * @returns `user-global`, `agents-global`, `.`, or the containing project-relative directory.
 */
export declare function scopeForDisplayPath(displayPath: string): string;
/**
 * Whether a decoded scope directory is one of the two user-global roots.
 * @param directory - `user-global`, `agents-global`, `.`, or a project-relative directory.
 * @returns true for the harness-home and shared agents-root scopes.
 */
export declare function isUserGlobalDirectory(directory: string): boolean;
/**
 * Candidate group of one decoded scope directory.
 *
 * The harness home and the shared agents root are the ordered candidates of one
 * user-global candidate group: identical trimmed content renders once, and an
 * unobservable candidate preserves the last-good state of its group. Every
 * project directory forms its own group.
 * @param directory - `user-global`, `agents-global`, `.`, or a project-relative directory.
 * @returns the shared group key of both user-global roots, or the directory itself.
 */
export declare function instructionCandidateGroup(directory: string): string;
/**
 * Keep a project-relative path out of the user-global scope namespace.
 *
 * A project directory whose name equals a user-global scope directory would
 * otherwise resolve to the global root for probing and joins the global
 * candidate group for deduplication. Escaping the collision with a leading `.`
 * keeps the file in its own project scope.
 * @param relativePath - project-root-relative path using the platform separator.
 * @returns the path, with a leading `.` component when its first component collides.
 */
export declare function escapeProjectDisplayPath(relativePath: string): string;
/**
 * Compose the reconciliation key for one instruction candidate file.
 * Each loaded candidate is tracked independently, so the key pairs the logical
 * directory with the exact candidate file name behind a NUL separator that no
 * directory path or file name can contain. Distinct candidates in one directory
 * (`AGENTS.md` vs `CLAUDE.md`, a base file vs its `.local` overlay) therefore
 * never collide in the scope-keyed state maps.
 * @param directory - `user-global`, `agents-global`, `.`, or a project-relative directory.
 * @param candidateName - instruction file name within that directory.
 * @returns the per-candidate logical scope key.
 */
export declare function candidateScopeKey(directory: string, candidateName: string): string;
/**
 * Derive the per-candidate scope key for a loaded instruction file.
 * @param displayPath - project-relative or user-global instruction path.
 * @returns the scope key pairing the file's directory with its name.
 */
export declare function instructionScopeKey(displayPath: string): string;
/**
 * Recover the directory and candidate name that {@link candidateScopeKey} encoded.
 * @param scope - a per-candidate scope key.
 * @returns the directory scope and the candidate file name within it.
 */
export declare function decodeScopeKey(scope: string): {
    directory: string;
    candidateName: string;
};
/**
 * Render one reconciliation batch and retain only transitions that fit.
 * @param items - ordered state transitions and current file contents.
 * @param maxBytes - maximum UTF-8 bytes allowed in the rendered batch.
 * @returns bounded prompt text and the transitions actually represented by it.
 */
export declare function renderInstructionChanges(items: ChangeRenderItem[], maxBytes: number): {
    text: string;
    changes: AgentInstructionChange[];
};
/**
 * Render a baseline together with the exact source files semantically represented in it.
 * @param files - loaded files ordered from broadest to most specific.
 * @param options - rendering byte budget and whether this baseline supersedes a visible predecessor.
 * @returns bounded public rendering plus files with surviving content, including genuinely empty files.
 * @internal
 */
export declare function renderAgentInstructionSet(files: LoadedInstructionFile[], options: {
    maxBytes: number;
    replacePreviousBaseline?: boolean;
}): {
    rendered: RenderedAgentInstructions;
    included: LoadedInstructionFile[];
};
/**
 * Render the baseline instruction chain with deterministic precedence budgeting.
 * @param files - loaded files ordered from broadest to most specific.
 * @param options - rendering byte budget and whether this baseline supersedes a visible predecessor.
 * @returns bounded baseline prompt text and budget diagnostics.
 */
export declare function renderAgentInstructions(files: LoadedInstructionFile[], options: {
    maxBytes: number;
    replacePreviousBaseline?: boolean;
}): RenderedAgentInstructions;
//# sourceMappingURL=render.d.ts.map