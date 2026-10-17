import type { Session, SessionEvent } from '@deepseek-ai/dsh-session';
import { type GitRunner } from './git.ts';
import type { WorkspaceChangesSummary, WorkspaceFileDiff } from './types.ts';
/** Facts shared by every recorder of one plugin instance. */
export interface RecorderEnvironment {
    /** Resolves to the runner, or null when git is unavailable and no snapshot is taken. */
    git: Promise<GitRunner | null>;
    /** Directory that receives each Session's temporary directory. */
    tempRoot: string;
    /** Maximum files carried by one summary. */
    maxFiles: number;
    /** Inclusive byte cap on a captured copy and on a snapshot blob read for a comparison. */
    maxFileBytes: number;
    /** Milliseconds a line comparison may run before it degrades to whole-file replacement. */
    diffTimeoutMs: number;
    /** Failure reporter; a failed turn records nothing and the next turn retries. */
    warn: (message: string) => void;
}
/**
 * Serializes one Session's recording work: the turn-start snapshot, the
 * whole-file capture before each file-tool mutation, the turn-end snapshot
 * with its diff, and the appended `workspace/changes` event whose summary and
 * comparisons this recorder keeps. Snapshot objects and captured copies live in
 * a temporary directory owned by the recorder; disposal removes it together
 * with the summaries. Tool execution waits for pending work so a snapshot or
 * capture never races a mutation. A working directory outside any repository,
 * or a Host without git, gets no snapshot; its summary lists the files the file
 * tools changed.
 */
export declare class TurnRecorder {
    private readonly session;
    private readonly cwd;
    private readonly env;
    private chain;
    /** The open turn; before the first `turn/start` it is an empty placeholder no event can match. */
    private state;
    /** Canonical paths, resolved by the first turn. */
    private paths;
    /** The located repository, reused across turns once found; null keeps retrying each turn. */
    private repository;
    /** Temporary directory holding this Session's snapshot objects, scratch indexes, and captured copies. */
    private scratch;
    /** Records by the sequence of the event that announced them. */
    private readonly records;
    private readonly lifetime;
    constructor(session: Session, cwd: string, env: RecorderEnvironment);
    /**
     * Open a turn with fresh per-turn state and queue its baseline snapshot.
     * @param turn - the turn number from `turn/start`.
     */
    start(turn: number): void;
    /**
     * Queue the capture of the path a file tool is about to mutate, before the
     * tool runs; only the turn's first mutation of a path captures it. Await
     * {@link settled} afterwards so the tool cannot overtake the capture.
     * @param path - absolute process path of the filesystem provider's resolved mutation target.
     */
    capture(path: string): void;
    /**
     * Remember a settled tool result, so a record after `turn/end` covers it.
     * @param event - the appended `tool/result` event.
     */
    observe(event: SessionEvent<'tool/result'>): void;
    /**
     * Record the turn's changes inside the turn, before `turn/end` commits.
     * @param turn - the stopping turn.
     * @returns after the event is appended or the attempt failed.
     */
    stopping(turn: number): Promise<void>;
    /**
     * Record after `turn/end` unless a record was already attempted after the turn's last tool result.
     * @param turn - the turn number from `turn/end`.
     */
    end(turn: number): void;
    /** Resolves once every queued snapshot, capture, and record has settled. */
    settled(): Promise<void>;
    /**
     * The summary announced by one `workspace/changes` event of this Session.
     * @param seq - the event's sequence number.
     * @returns the summary, or undefined for a sequence this recorder did not announce.
     */
    summary(seq: number): WorkspaceChangesSummary | undefined;
    /**
     * Compare one listed file's contents at turn start and turn end.
     * @param seq - the announcing event's sequence number.
     * @param index - the file's index in the summary's `files`.
     * @param signal - cancels the reads.
     * @returns the comparison, or undefined for an unknown sequence or index, or once disposed.
     * @throws when a read fails while the recorder lives.
     */
    diff(seq: number, index: number, signal: AbortSignal): Promise<WorkspaceFileDiff | undefined>;
    /**
     * Abort queued work, forget every record, and remove the temporary directory.
     * @returns once the temporary directory is gone.
     */
    dispose(): Promise<void>;
    private enqueue;
    /** A failure after disposal is expected cancellation and stays silent. */
    private warnUnlessDisposed;
    /** This Session's temporary directory, created on first use. */
    private scratchDir;
    /** The repository enclosing the working directory, located once; null keeps retrying each turn. */
    private locate;
    /** One side's text, null for an absent file, or {@link OVERSIZED} for a snapshot side beyond the byte cap. */
    private readSide;
    private record;
    /**
     * The listing of a captured pair: an oversized side lists the file without
     * counts and refuses its comparison, a binary side likewise, and two text
     * sides carry the counts of their line comparison.
     */
    private compared;
}
//# sourceMappingURL=recorder.d.ts.map