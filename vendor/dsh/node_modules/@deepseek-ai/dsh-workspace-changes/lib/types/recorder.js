/** Per-Session turn recorder: snapshots, captures around file-tool edits, the turn-end diff, and the records kept until disposal. */
import { mkdtemp, readFile, realpath, rm } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, relative, resolve } from 'node:path';
import { captureFile, sameCapture } from "./capture.js";
import { compareText } from "./compare.js";
import { blobText, diffTrees, gitlinkPaths, ignoredPaths, locateGitWorkspace, snapshotTree, treeBlob, } from "./git.js";
import { canonicalPath, compareDisplay, displayPathOf, durablePathOf, isInside, isTemporaryPath, temporaryRoots, toPosix } from "./paths.js";
function freshState(turn) {
    return { turn, baseline: null, captures: new Map(), lastToolResultSeq: -1, attemptedAfterSeq: -1, recordedAfterSeq: -1 };
}
/** A snapshot side larger than the byte cap. */
const OVERSIZED = Symbol('oversized');
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
export class TurnRecorder {
    session;
    cwd;
    env;
    chain = Promise.resolve();
    /** The open turn; before the first `turn/start` it is an empty placeholder no event can match. */
    state = freshState(0);
    /** Canonical paths, resolved by the first turn. */
    paths;
    /** The located repository, reused across turns once found; null keeps retrying each turn. */
    repository = null;
    /** Temporary directory holding this Session's snapshot objects, scratch indexes, and captured copies. */
    scratch;
    /** Records by the sequence of the event that announced them. */
    records = new Map();
    lifetime = new AbortController();
    constructor(session, cwd, env) {
        this.session = session;
        this.cwd = cwd;
        this.env = env;
    }
    /**
     * Open a turn with fresh per-turn state and queue its baseline snapshot.
     * @param turn - the turn number from `turn/start`.
     */
    start(turn) {
        const state = freshState(turn);
        this.state = state;
        void this.enqueue(async (signal) => {
            try {
                this.paths ??= { cwd: await realpath(this.cwd), home: await canonicalPath(homedir()), temporaryRoots: await temporaryRoots() };
                const repository = await this.locate(this.paths.cwd, signal);
                if (repository === null)
                    return;
                const tree = await snapshotTree(repository.git, repository.workspace, signal);
                state.baseline = { ...repository, tree };
            }
            catch (error) {
                // A repository whose snapshot failed must not be summarized as if it had none.
                state.baseline = 'failed';
                throw error;
            }
        });
    }
    /**
     * Queue the capture of the path a file tool is about to mutate, before the
     * tool runs; only the turn's first mutation of a path captures it. Await
     * {@link settled} afterwards so the tool cannot overtake the capture.
     * @param path - absolute process path of the filesystem provider's resolved mutation target.
     */
    capture(path) {
        const state = this.state;
        void this.enqueue(async () => {
            const paths = this.paths;
            if (paths === undefined)
                return;
            const absolute = await canonicalPath(path);
            if (state.captures.has(absolute))
                return;
            const capture = await captureFile(absolute, join(await this.scratchDir(), 'captures'), this.env.maxFileBytes);
            if (capture !== undefined)
                state.captures.set(absolute, capture);
        });
    }
    /**
     * Remember a settled tool result, so a record after `turn/end` covers it.
     * @param event - the appended `tool/result` event.
     */
    observe(event) {
        const state = this.state;
        if (event.data.turn === state.turn)
            state.lastToolResultSeq = event.seq;
    }
    /**
     * Record the turn's changes inside the turn, before `turn/end` commits.
     * @param turn - the stopping turn.
     * @returns after the event is appended or the attempt failed.
     */
    stopping(turn) {
        const state = this.state;
        if (turn !== state.turn)
            return Promise.resolve();
        return this.enqueue(signal => this.record(state, signal));
    }
    /**
     * Record after `turn/end` unless a record was already attempted after the turn's last tool result.
     * @param turn - the turn number from `turn/end`.
     */
    end(turn) {
        const state = this.state;
        if (turn !== state.turn || state.attemptedAfterSeq >= state.lastToolResultSeq)
            return;
        void this.enqueue(signal => this.record(state, signal));
    }
    /** Resolves once every queued snapshot, capture, and record has settled. */
    settled() {
        return this.chain;
    }
    /**
     * The summary announced by one `workspace/changes` event of this Session.
     * @param seq - the event's sequence number.
     * @returns the summary, or undefined for a sequence this recorder did not announce.
     */
    summary(seq) {
        return this.records.get(seq)?.summary;
    }
    /**
     * Compare one listed file's contents at turn start and turn end.
     * @param seq - the announcing event's sequence number.
     * @param index - the file's index in the summary's `files`.
     * @param signal - cancels the reads.
     * @returns the comparison, or undefined for an unknown sequence or index, or once disposed.
     * @throws when a read fails while the recorder lives.
     */
    async diff(seq, index, signal) {
        const record = this.records.get(seq);
        const file = record?.summary.files[index];
        const sources = record?.sources[index];
        if (file === undefined || sources === undefined)
            return undefined;
        const { path, display } = file;
        if (sources.refusal !== undefined)
            return { kind: sources.refusal, path, display };
        const combined = AbortSignal.any([signal, this.lifetime.signal]);
        try {
            const [before, after] = await Promise.all([this.readSide(sources.before, combined), this.readSide(sources.after, combined)]);
            if (before === OVERSIZED || after === OVERSIZED)
                return { kind: 'oversized', path, display };
            const { hunks, coarse } = compareText(before, after, this.env.diffTimeoutMs);
            return { kind: 'text', path, display, before: before !== null, after: after !== null, hunks, coarse };
        }
        catch (error) {
            // Disposal removes the temporary directory under a running read; the Session is gone either way.
            if (this.lifetime.signal.aborted)
                return undefined;
            throw error;
        }
    }
    /**
     * Abort queued work, forget every record, and remove the temporary directory.
     * @returns once the temporary directory is gone.
     */
    async dispose() {
        this.lifetime.abort();
        this.records.clear();
        await this.chain;
        if (this.scratch !== undefined)
            await rm(await this.scratch, { recursive: true, force: true });
    }
    enqueue(task) {
        const run = this.chain.then(async () => {
            if (this.lifetime.signal.aborted)
                return;
            try {
                await task(this.lifetime.signal);
            }
            catch (error) {
                this.warnUnlessDisposed(error);
            }
        });
        this.chain = run;
        return run;
    }
    /** A failure after disposal is expected cancellation and stays silent. */
    warnUnlessDisposed(error) {
        if (!this.lifetime.signal.aborted)
            this.env.warn(`workspace-changes: ${String(error)}`);
    }
    /** This Session's temporary directory, created on first use. */
    scratchDir() {
        this.scratch ??= mkdtemp(join(this.env.tempRoot, 'dsh-workspace-changes-'));
        return this.scratch;
    }
    /** The repository enclosing the working directory, located once; null keeps retrying each turn. */
    async locate(cwd, signal) {
        if (this.repository !== null)
            return this.repository;
        const git = await this.env.git;
        if (git === null)
            return null;
        const workspace = await locateGitWorkspace(git, cwd, () => this.scratchDir(), signal);
        if (workspace === null)
            return null;
        this.repository = { git, workspace };
        return this.repository;
    }
    /** One side's text, null for an absent file, or {@link OVERSIZED} for a snapshot side beyond the byte cap. */
    async readSide(source, signal) {
        switch (source.kind) {
            case 'absent': return null;
            case 'file': return readFile(source.file, { encoding: 'utf8', signal });
            case 'snapshot': {
                const { git, workspace } = source.repository;
                const blob = await treeBlob(git, workspace, source.tree, source.path, signal);
                if (blob === null)
                    return null;
                if (blob.size > this.env.maxFileBytes)
                    return OVERSIZED;
                return blobText(git, workspace, blob.oid, this.env.maxFileBytes, signal);
            }
        }
    }
    async record(state, signal) {
        const paths = this.paths;
        const { baseline } = state;
        if (paths === undefined || baseline === 'failed' || state.lastToolResultSeq < 0)
            return;
        state.attemptedAfterSeq = state.lastToolResultSeq;
        // Without a snapshot the working directory itself bounds the workspace.
        const root = baseline?.workspace.root ?? paths.cwd;
        const listed = new Map();
        let snapshot;
        if (baseline !== null) {
            const after = await snapshotTree(baseline.git, baseline.workspace, signal);
            snapshot = { before: baseline.tree, after };
            const repository = { git: baseline.git, workspace: baseline.workspace };
            for (const entry of await diffTrees(baseline.git, baseline.workspace, baseline.tree, after, signal)) {
                const absolute = resolve(root, entry.path);
                listed.set(absolute, {
                    file: changedFile(paths, root, absolute, entry),
                    sources: entry.binary ? { refusal: 'binary' } : {
                        before: { kind: 'snapshot', repository, tree: baseline.tree, path: entry.oldPath ?? entry.path },
                        after: { kind: 'snapshot', repository, tree: after, path: entry.path },
                    },
                });
            }
        }
        // Captured paths the snapshots do not cover are compared from their copies.
        const captured = [...state.captures.keys()].filter(absolute => !listed.has(absolute));
        const workTreePath = (absolute) => toPosix(relative(root, absolute));
        let inWorkspace = captured.filter(absolute => isInside(root, absolute));
        if (baseline !== null && inWorkspace.length > 0) {
            // Nested repositories and submodules are gitlinks: their contents never enter the summary.
            const gitlinks = await gitlinkPaths(baseline.git, baseline.workspace, signal);
            inWorkspace = inWorkspace.filter(absolute => ![...gitlinks].some(link => isInside(resolve(root, link), absolute)));
        }
        // A snapshot covers every workspace file except the ignored ones; without one, every file-tool edit counts.
        const uncoveredInWorkspace = baseline === null
            ? new Set(inWorkspace.map(workTreePath))
            : await ignoredPaths(baseline.git, baseline.workspace, inWorkspace.map(workTreePath), signal);
        for (const absolute of captured) {
            // Outside the workspace, scratch files under a temporary root stay out.
            const uncovered = isInside(root, absolute)
                ? uncoveredInWorkspace.has(workTreePath(absolute))
                : !isTemporaryPath(absolute, paths.temporaryRoots);
            if (!uncovered)
                continue;
            const before = state.captures.get(absolute);
            const after = await captureFile(absolute, join(await this.scratchDir(), 'captures'), this.env.maxFileBytes);
            if (after === undefined || sameCapture(before, after))
                continue;
            listed.set(absolute, await this.compared(paths, root, absolute, before, after));
        }
        const sorted = [...listed.values()].sort((a, b) => compareDisplay(a.file, b.file));
        // An empty list after an earlier in-turn record supersedes that record.
        if (sorted.length === 0 && state.recordedAfterSeq < 0)
            return;
        const event = this.session.append('workspace/changes', { turn: state.turn });
        const kept = sorted.slice(0, this.env.maxFiles);
        this.records.set(event.seq, {
            summary: {
                turn: state.turn,
                cwd: this.cwd,
                files: kept.map(entry => entry.file),
                total: sorted.length,
                added: sorted.reduce((sum, entry) => sum + entry.file.added, 0),
                deleted: sorted.reduce((sum, entry) => sum + entry.file.deleted, 0),
                ...snapshot === undefined ? {} : { snapshot },
            },
            sources: kept.map(entry => entry.sources),
        });
        state.recordedAfterSeq = event.seq;
    }
    /**
     * The listing of a captured pair: an oversized side lists the file without
     * counts and refuses its comparison, a binary side likewise, and two text
     * sides carry the counts of their line comparison.
     */
    async compared(paths, root, absolute, before, after) {
        const list = (counts, sources) => ({ file: changedFile(paths, root, absolute, counts), sources });
        if (before.kind === 'oversized' || after.kind === 'oversized') {
            return list({ added: 0, deleted: 0, binary: false, oversized: true }, { refusal: 'oversized' });
        }
        if (isBinary(before) || isBinary(after))
            return list({ added: 0, deleted: 0, binary: true }, { refusal: 'binary' });
        const text = async (side) => side.kind === 'file' ? readFile(side.file, 'utf8') : null;
        const { added, deleted } = compareText(await text(before), await text(after), this.env.diffTimeoutMs);
        return list({ added, deleted, binary: false }, { before, after });
    }
}
/** Whether a captured side holds binary content. */
function isBinary(capture) {
    return capture.kind === 'file' && capture.binary;
}
function changedFile({ cwd, home }, root, absolute, counts) {
    return {
        path: durablePathOf(absolute, cwd),
        display: displayPathOf(absolute, cwd, root, home),
        added: counts.added,
        deleted: counts.deleted,
        ...counts.binary ? { binary: true } : {},
        ...counts.oversized === true ? { oversized: true } : {},
    };
}
//# sourceMappingURL=recorder.js.map