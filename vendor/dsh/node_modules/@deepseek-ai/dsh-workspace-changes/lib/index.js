import { homedir, tmpdir } from "node:os";
import z from "@deepseek-ai/schemastery";
import { copyFile, mkdir, mkdtemp, open, readFile, realpath, rm, writeFile } from "node:fs/promises";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { createHash } from "node:crypto";
import { structuredPatch } from "diff";
//#region lib/types/numstat.js
/** Parsing of `git diff-tree --numstat -z` output. */
/**
* Parse NUL-terminated numstat records. A rename record carries an empty path
* followed by the old and new paths.
* @param output - complete stdout of `git diff-tree -r -M -z --numstat`.
* @returns records in git's output order.
* @throws when a record is malformed, which indicates truncated output.
*/
function parseNumstat(output) {
	const queue = output.split("\0");
	if (queue.at(-1) !== "") throw new Error("numstat output is not NUL-terminated");
	queue.pop();
	const entries = [];
	while (queue.length > 0) {
		const record = queue.shift();
		const first = record.indexOf("	");
		const second = first < 0 ? -1 : record.indexOf("	", first + 1);
		if (second < 0) throw new Error(`malformed numstat record: ${record}`);
		const added = record.slice(0, first);
		const deleted = record.slice(first + 1, second);
		let target = record.slice(second + 1);
		let oldPath;
		if (target === "") {
			oldPath = queue.shift();
			const renamed = queue.shift();
			if (oldPath === void 0 || renamed === void 0) throw new Error("malformed numstat rename record");
			target = renamed;
		}
		const binary = added === "-";
		entries.push({
			path: target,
			...oldPath === void 0 ? {} : { oldPath },
			added: binary ? 0 : Number(added),
			deleted: binary ? 0 : Number(deleted),
			binary
		});
	}
	return entries;
}
//#endregion
//#region lib/types/paths.js
/** Path classification and display forms for changed files. */
/**
* Slash-separated form of a native relative path.
* @param path - native path.
* @returns the same path with `/` separators.
*/
function toPosix(path) {
	return path.split(sep).join("/");
}
/**
* Whether `path` is `root` or lies under it.
* @param root - absolute directory.
* @param path - absolute path to test.
* @returns true for the root itself and every descendant.
*/
function isInside(root, path) {
	const rel = relative(root, path);
	return rel === "" || !rel.startsWith("..") && !isAbsolute(rel);
}
/**
* Canonical spellings of the temporary directories a workspace-write sandbox
* grants: the host `/tmp` and the platform temp area, each also in its
* symlink-resolved form so `/tmp` and `/private/tmp` match alike.
* @param candidates - directories to canonicalize.
* @returns absolute directory paths.
*/
async function temporaryRoots(candidates = ["/tmp", tmpdir()]) {
	const roots = /* @__PURE__ */ new Set();
	for (const root of candidates) {
		roots.add(root);
		roots.add(await canonicalPath(root));
	}
	return [...roots];
}
/**
* Symlink-resolved path. A path that does not exist yet is resolved through
* its nearest existing ancestor, so a file created through a directory
* symlink has the same canonical spelling before and after it exists.
* @param path - absolute path.
* @returns the canonical spelling git reports for the path.
*/
async function canonicalPath(path) {
	const missing = [];
	let head = path;
	while (true) try {
		return join(await realpath(head), ...missing);
	} catch {
		const parent = dirname(head);
		if (parent === head || dirname(parent) === parent) return path;
		missing.unshift(basename(head));
		head = parent;
	}
}
/**
* Whether a file lives under a temporary root, where the model keeps scratch work.
* @param path - absolute file path.
* @param roots - {@link temporaryRoots}.
* @returns true for scratch paths that never enter the change summary.
*/
function isTemporaryPath(path, roots) {
	return roots.some((root) => isInside(root, path));
}
/**
* Sort key and label of a changed file; see `WorkspaceChangedFile.display`.
* @param absolute - canonical absolute file path.
* @param cwd - canonical Session working directory.
* @param root - repository top-level directory.
* @param home - canonical home directory, or empty to skip the `~` form.
* @returns the slash-separated display path.
*/
function displayPathOf(absolute, cwd, root, home) {
	if (isInside(cwd, absolute) || isInside(root, absolute)) return toPosix(relative(cwd, absolute));
	if (home !== "" && isInside(home, absolute)) return `~/${toPosix(relative(home, absolute))}`;
	return toPosix(absolute);
}
/**
* The durable `path` field: relative inside the working directory, absolute elsewhere.
* @param absolute - canonical absolute file path.
* @param cwd - canonical Session working directory.
* @returns the path the Web client opens the file through.
*/
function durablePathOf(absolute, cwd) {
	return isInside(cwd, absolute) ? toPosix(relative(cwd, absolute)) : absolute;
}
/**
* Code-unit order of display paths, which places `../` and absolute paths
* before letters and matches git's own listing order for relative paths.
* @param a - first file.
* @param b - second file.
* @returns negative, zero, or positive as `Array.prototype.sort` expects.
*/
function compareDisplay(a, b) {
	return a.display < b.display ? -1 : a.display > b.display ? 1 : 0;
}
//#endregion
//#region lib/types/git.js
/** Git working-tree snapshots, tree diffs, and ignore checks through the subprocess capability. */
/** Milliseconds a git child gets to exit after termination starts; a fixed lifecycle constant. */
const TERMINATE_GRACE_MS = 2e3;
/** Retained stderr tail for diagnostics. */
const STDERR_TAIL_BYTES = 16 * 1024;
/** Runs one resolved git executable with scrubbed environment, timeout, and bounded output. */
var GitRunner = class {
	subprocess;
	executable;
	limits;
	constructor(subprocess, executable, limits) {
		this.subprocess = subprocess;
		this.executable = executable;
		this.limits = limits;
	}
	/**
	* Run `git <args>` to completion.
	* @param args - git arguments; never shell-interpreted.
	* @param options - working directory, extra environment, stdin data, and cancellation.
	* @returns exit facts and collected output.
	* @throws when the command times out, is aborted, or cannot spawn.
	*/
	async run(args, options) {
		const timeout = AbortSignal.timeout(this.limits.timeoutMs);
		const signal = AbortSignal.any([options.signal, timeout]);
		const handle = this.subprocess.spawn({
			argv: [this.executable, ...args],
			cwd: options.cwd,
			stdio: {
				stdin: options.stdin === void 0 ? "ignore" : { data: options.stdin },
				stdout: { maxBytes: options.maxBytes ?? this.limits.outputMaxBytes },
				stderr: { maxBytes: STDERR_TAIL_BYTES }
			},
			graceMs: TERMINATE_GRACE_MS,
			signal,
			env: {
				GIT_CONFIG_COUNT: "0",
				GIT_TERMINAL_PROMPT: "0",
				GIT_OPTIONAL_LOCKS: "0",
				LC_ALL: "C",
				...options.env
			}
		});
		const outcome = await handle.done;
		if (signal.aborted) throw new Error(`git ${args.join(" ")} ${timeout.aborted ? `timed out after ${this.limits.timeoutMs}ms` : "was aborted"}`);
		/* v8 ignore start -- collect-mode stdio always yields both readers. */
		const stdout = handle.collected.stdout?.readFrom(0) ?? {
			text: "",
			lossy: false
		};
		const stderr = handle.collected.stderr?.readFrom(0).text ?? "";
		/* v8 ignore stop */
		return {
			exitCode: outcome.exitCode,
			stdout: stdout.text,
			stderr,
			truncated: stdout.lossy
		};
	}
};
/**
* Reject a failed command with its stderr.
* @param result - settled command facts.
* @param what - command description for the error message.
* @returns the same result when it exited zero.
*/
function ok(result, what) {
	if (result.exitCode !== 0) throw new Error(`${what} failed: ${result.stderr.trim()}`);
	return result;
}
/** Whether a filesystem error names a missing path. */
function isMissing$1(error) {
	return typeof error === "object" && error !== null && error.code === "ENOENT";
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
async function locateGitWorkspace(git, cwd, scratch, signal) {
	const found = await git.run([
		"rev-parse",
		"--show-toplevel",
		"--absolute-git-dir",
		"--git-path",
		"objects"
	], {
		cwd,
		signal
	});
	if (found.exitCode === 128 && /not a git repository/i.test(found.stderr)) return null;
	const [root, gitDir, repositoryObjects] = ok(found, "git rev-parse").stdout.split("\n").map((line) => resolve(cwd, line));
	const directory = await canonicalPath(await scratch());
	const objects = join(directory, "objects");
	await mkdir(objects, { recursive: true });
	const excludes = isInside(root, directory) ? [toPosix(relative(root, directory))] : [];
	return {
		root,
		gitDir,
		scratch: directory,
		env: {
			GIT_OBJECT_DIRECTORY: objects,
			GIT_ALTERNATE_OBJECT_DIRECTORIES: repositoryObjects
		},
		excludes
	};
}
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
async function snapshotTree(git, workspace, signal) {
	const scratch = await mkdtemp(join(workspace.scratch, "index-"));
	try {
		const index = join(scratch, "index");
		await copyFile(join(workspace.gitDir, "index"), index).catch((error) => {
			if (!isMissing$1(error)) throw error;
		});
		const env = {
			...workspace.env,
			GIT_INDEX_FILE: index
		};
		const pathspec = workspace.excludes.length === 0 ? [] : [
			"--",
			".",
			...workspace.excludes.map((path) => `:(exclude)${path}`)
		];
		const added = await git.run([
			"add",
			"--all",
			"--ignore-errors",
			...pathspec
		], {
			cwd: workspace.root,
			env,
			signal
		});
		/* v8 ignore next -- git reports a skipped unreadable file only on hosts whose permissions the tests can revoke. */
		if (added.exitCode !== 1) ok(added, `git add in ${workspace.root}`);
		return ok(await git.run(["write-tree"], {
			cwd: workspace.root,
			env,
			signal
		}), "git write-tree").stdout.trim();
	} finally {
		await rm(scratch, {
			recursive: true,
			force: true
		});
	}
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
async function treeBlob(git, workspace, tree, path, signal) {
	const entry = ok(await git.run([
		"ls-tree",
		"-z",
		"-l",
		tree,
		"--",
		path
	], {
		cwd: workspace.root,
		env: {
			...workspace.env,
			GIT_LITERAL_PATHSPECS: "1"
		},
		signal
	}), "git ls-tree").stdout.split("\0")[0];
	const match = /^\d+ (\S+) ([0-9a-f]+) +(\d+)\t/.exec(entry);
	if (match === null || match[1] !== "blob") return null;
	return {
		oid: match[2],
		size: Number(match[3])
	};
}
/**
* The text of one blob whose size {@link treeBlob} reported within the cap.
* @param git - command runner.
* @param workspace - addressed repository.
* @param oid - blob id.
* @param maxBytes - inclusive byte cap the caller checked the blob's size against.
* @param signal - cancellation.
* @returns the blob decoded as UTF-8.
*/
async function blobText(git, workspace, oid, maxBytes, signal) {
	const result = ok(await git.run([
		"cat-file",
		"blob",
		oid
	], {
		cwd: workspace.root,
		env: workspace.env,
		maxBytes,
		signal
	}), "git cat-file");
	/* v8 ignore next -- callers size the blob with treeBlob first; a blob is immutable, so the cap cannot be exceeded here. */
	if (result.truncated) throw new Error(`blob ${oid} exceeds ${maxBytes} bytes`);
	return result.stdout;
}
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
async function diffTrees(git, workspace, before, after, signal) {
	if (before === after) return [];
	const result = ok(await git.run([
		"diff-tree",
		"-r",
		"-M",
		"-z",
		"--numstat",
		before,
		after
	], {
		cwd: workspace.root,
		env: workspace.env,
		signal
	}), "git diff-tree");
	if (result.truncated) throw new Error("git diff-tree output exceeded the configured cap");
	return parseNumstat(result.stdout);
}
/**
* Work-tree directories the index records as gitlinks: nested repositories and
* submodules, whose contents snapshots never descend into and `check-ignore`
* refuses to classify.
* @param git - command runner.
* @param workspace - addressed repository.
* @param signal - cancellation.
* @returns slash-separated gitlink paths relative to the repository root.
*/
async function gitlinkPaths(git, workspace, signal) {
	const result = ok(await git.run([
		"ls-files",
		"-z",
		"--stage"
	], {
		cwd: workspace.root,
		env: workspace.env,
		signal
	}), "git ls-files");
	const links = /* @__PURE__ */ new Set();
	for (const entry of result.stdout.split("\0")) if (entry.startsWith("160000 ")) links.add(entry.slice(entry.indexOf("	") + 1));
	return links;
}
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
async function ignoredPaths(git, workspace, paths, signal) {
	if (paths.length === 0) return /* @__PURE__ */ new Set();
	const result = await git.run([
		"check-ignore",
		"-z",
		"--stdin"
	], {
		cwd: workspace.root,
		env: workspace.env,
		stdin: `${paths.join("\0")}\0`,
		signal
	});
	if (result.exitCode === 1) return /* @__PURE__ */ new Set();
	return new Set(ok(result, "git check-ignore").stdout.split("\0").filter((path) => path !== ""));
}
//#endregion
//#region lib/types/capture.js
/**
* Whole-file captures around file-tool edits: the content of a path before
* the turn's first mutation of it and at turn end, stored content-addressed
* under the Session's temporary directory so both sides of a comparison
* survive later edits without depending on git.
*/
/** Bytes git inspects for a NUL byte before treating content as binary. */
const BINARY_PROBE_BYTES = 8e3;
/** Whether a filesystem error names a missing path. */
function isMissing(error) {
	return typeof error === "object" && error !== null && error.code === "ENOENT";
}
/**
* Store the current content of one path. At most `maxBytes + 1` bytes are
* read, so a file that grows past the cap while it is read costs no more
* memory than the cap.
* @param absolute - canonical absolute path of the file.
* @param directory - directory holding content-addressed copies; created when missing.
* @param maxBytes - inclusive byte cap on a stored copy.
* @returns the capture, or undefined for a path that is neither absent nor a regular file.
* @throws when the path cannot be opened or read for a reason other than absence, or the copy cannot be written.
*/
async function captureFile(absolute, directory, maxBytes) {
	let handle;
	try {
		handle = await open(absolute, "r");
	} catch (error) {
		/* v8 ignore next -- an unopenable present file needs permissions the tests cannot revoke on every host. */
		if (!isMissing(error)) throw error;
		return { kind: "absent" };
	}
	let bytes;
	try {
		if (!(await handle.stat()).isFile()) return void 0;
		const probe = Buffer.allocUnsafe(maxBytes + 1);
		let length = 0;
		while (length < probe.length) {
			const { bytesRead } = await handle.read(probe, length, probe.length - length, length);
			if (bytesRead === 0) break;
			length += bytesRead;
		}
		if (length > maxBytes) return { kind: "oversized" };
		bytes = probe.subarray(0, length);
	} finally {
		await handle.close();
	}
	const file = join(directory, createHash("sha1").update(bytes).digest("hex"));
	await mkdir(directory, { recursive: true });
	await writeFile(file, bytes, { flag: "wx" }).catch((error) => {
		/* v8 ignore next -- a copy that cannot be written needs a directory the tests cannot make unwritable on every host. */
		if (error.code !== "EEXIST") throw error;
	});
	return {
		kind: "file",
		file,
		binary: bytes.subarray(0, BINARY_PROBE_BYTES).includes(0)
	};
}
/**
* Whether two captures are known to hold the same content. Two absent sides
* are the same; two stored copies are the same when their bytes hash alike;
* an oversized side is never known to match anything, since its content was
* not read.
* @param a - one side.
* @param b - the other side.
* @returns true only when both sides are known to match.
*/
function sameCapture(a, b) {
	if (a.kind === "absent" || b.kind === "absent") return a.kind === b.kind;
	return a.kind === "file" && b.kind === "file" && a.file === b.file;
}
//#endregion
//#region lib/types/compare.js
/** Line comparison of two whole-file texts, bounded by a timeout that degrades to whole-file replacement. */
/** Context lines around each change, the unified-diff default. */
const CONTEXT_LINES = 3;
/**
* A side's text with every line terminated, so the last line compares by
* content alone and empty text reads as no lines rather than one empty line.
*/
function terminated(text) {
	return text === "" || text.endsWith("\n") ? text : `${text}\n`;
}
/** Content lines of a terminated text; empty text is zero lines. */
function lines(text) {
	return text === "" ? [] : text.slice(0, -1).split("\n");
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
function compareText(before, after, timeoutMs) {
	const oldText = terminated(before ?? "");
	const newText = terminated(after ?? "");
	const patch = structuredPatch("", "", oldText, newText, void 0, void 0, {
		context: CONTEXT_LINES,
		timeout: timeoutMs
	});
	let hunks;
	let coarse = false;
	if (patch === void 0) {
		coarse = true;
		const oldLines = lines(oldText);
		const newLines = lines(newText);
		hunks = [{
			oldStart: 1,
			oldLines: oldLines.length,
			newStart: 1,
			newLines: newLines.length,
			lines: [...oldLines.map((line) => `-${line}`), ...newLines.map((line) => `+${line}`)]
		}];
	} else hunks = patch.hunks.map(({ oldStart, oldLines, newStart, newLines, lines: body }) => ({
		oldStart,
		oldLines,
		newStart,
		newLines,
		lines: body
	}));
	let added = 0;
	let deleted = 0;
	for (const hunk of hunks) for (const line of hunk.lines) if (line.startsWith("+")) added += 1;
	else if (line.startsWith("-")) deleted += 1;
	return {
		hunks,
		coarse,
		added,
		deleted
	};
}
//#endregion
//#region lib/types/recorder.js
/** Per-Session turn recorder: snapshots, captures around file-tool edits, the turn-end diff, and the records kept until disposal. */
function freshState(turn) {
	return {
		turn,
		baseline: null,
		captures: /* @__PURE__ */ new Map(),
		lastToolResultSeq: -1,
		attemptedAfterSeq: -1,
		recordedAfterSeq: -1
	};
}
/** A snapshot side larger than the byte cap. */
const OVERSIZED = Symbol("oversized");
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
var TurnRecorder = class {
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
	records = /* @__PURE__ */ new Map();
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
		this.enqueue(async (signal) => {
			try {
				this.paths ??= {
					cwd: await realpath(this.cwd),
					home: await canonicalPath(homedir()),
					temporaryRoots: await temporaryRoots()
				};
				const repository = await this.locate(this.paths.cwd, signal);
				if (repository === null) return;
				const tree = await snapshotTree(repository.git, repository.workspace, signal);
				state.baseline = {
					...repository,
					tree
				};
			} catch (error) {
				state.baseline = "failed";
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
		this.enqueue(async () => {
			if (this.paths === void 0) return;
			const absolute = await canonicalPath(path);
			if (state.captures.has(absolute)) return;
			const capture = await captureFile(absolute, join(await this.scratchDir(), "captures"), this.env.maxFileBytes);
			if (capture !== void 0) state.captures.set(absolute, capture);
		});
	}
	/**
	* Remember a settled tool result, so a record after `turn/end` covers it.
	* @param event - the appended `tool/result` event.
	*/
	observe(event) {
		const state = this.state;
		if (event.data.turn === state.turn) state.lastToolResultSeq = event.seq;
	}
	/**
	* Record the turn's changes inside the turn, before `turn/end` commits.
	* @param turn - the stopping turn.
	* @returns after the event is appended or the attempt failed.
	*/
	stopping(turn) {
		const state = this.state;
		if (turn !== state.turn) return Promise.resolve();
		return this.enqueue((signal) => this.record(state, signal));
	}
	/**
	* Record after `turn/end` unless a record was already attempted after the turn's last tool result.
	* @param turn - the turn number from `turn/end`.
	*/
	end(turn) {
		const state = this.state;
		if (turn !== state.turn || state.attemptedAfterSeq >= state.lastToolResultSeq) return;
		this.enqueue((signal) => this.record(state, signal));
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
		if (file === void 0 || sources === void 0) return void 0;
		const { path, display } = file;
		if (sources.refusal !== void 0) return {
			kind: sources.refusal,
			path,
			display
		};
		const combined = AbortSignal.any([signal, this.lifetime.signal]);
		try {
			const [before, after] = await Promise.all([this.readSide(sources.before, combined), this.readSide(sources.after, combined)]);
			if (before === OVERSIZED || after === OVERSIZED) return {
				kind: "oversized",
				path,
				display
			};
			const { hunks, coarse } = compareText(before, after, this.env.diffTimeoutMs);
			return {
				kind: "text",
				path,
				display,
				before: before !== null,
				after: after !== null,
				hunks,
				coarse
			};
		} catch (error) {
			if (this.lifetime.signal.aborted) return void 0;
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
		if (this.scratch !== void 0) await rm(await this.scratch, {
			recursive: true,
			force: true
		});
	}
	enqueue(task) {
		const run = this.chain.then(async () => {
			if (this.lifetime.signal.aborted) return;
			try {
				await task(this.lifetime.signal);
			} catch (error) {
				this.warnUnlessDisposed(error);
			}
		});
		this.chain = run;
		return run;
	}
	/** A failure after disposal is expected cancellation and stays silent. */
	warnUnlessDisposed(error) {
		if (!this.lifetime.signal.aborted) this.env.warn(`workspace-changes: ${String(error)}`);
	}
	/** This Session's temporary directory, created on first use. */
	scratchDir() {
		this.scratch ??= mkdtemp(join(this.env.tempRoot, "dsh-workspace-changes-"));
		return this.scratch;
	}
	/** The repository enclosing the working directory, located once; null keeps retrying each turn. */
	async locate(cwd, signal) {
		if (this.repository !== null) return this.repository;
		const git = await this.env.git;
		if (git === null) return null;
		const workspace = await locateGitWorkspace(git, cwd, () => this.scratchDir(), signal);
		if (workspace === null) return null;
		this.repository = {
			git,
			workspace
		};
		return this.repository;
	}
	/** One side's text, null for an absent file, or {@link OVERSIZED} for a snapshot side beyond the byte cap. */
	async readSide(source, signal) {
		switch (source.kind) {
			case "absent": return null;
			case "file": return readFile(source.file, {
				encoding: "utf8",
				signal
			});
			case "snapshot": {
				const { git, workspace } = source.repository;
				const blob = await treeBlob(git, workspace, source.tree, source.path, signal);
				if (blob === null) return null;
				if (blob.size > this.env.maxFileBytes) return OVERSIZED;
				return blobText(git, workspace, blob.oid, this.env.maxFileBytes, signal);
			}
		}
	}
	async record(state, signal) {
		const paths = this.paths;
		const { baseline } = state;
		if (paths === void 0 || baseline === "failed" || state.lastToolResultSeq < 0) return;
		state.attemptedAfterSeq = state.lastToolResultSeq;
		const root = baseline?.workspace.root ?? paths.cwd;
		const listed = /* @__PURE__ */ new Map();
		let snapshot;
		if (baseline !== null) {
			const after = await snapshotTree(baseline.git, baseline.workspace, signal);
			snapshot = {
				before: baseline.tree,
				after
			};
			const repository = {
				git: baseline.git,
				workspace: baseline.workspace
			};
			for (const entry of await diffTrees(baseline.git, baseline.workspace, baseline.tree, after, signal)) {
				const absolute = resolve(root, entry.path);
				listed.set(absolute, {
					file: changedFile(paths, root, absolute, entry),
					sources: entry.binary ? { refusal: "binary" } : {
						before: {
							kind: "snapshot",
							repository,
							tree: baseline.tree,
							path: entry.oldPath ?? entry.path
						},
						after: {
							kind: "snapshot",
							repository,
							tree: after,
							path: entry.path
						}
					}
				});
			}
		}
		const captured = [...state.captures.keys()].filter((absolute) => !listed.has(absolute));
		const workTreePath = (absolute) => toPosix(relative(root, absolute));
		let inWorkspace = captured.filter((absolute) => isInside(root, absolute));
		if (baseline !== null && inWorkspace.length > 0) {
			const gitlinks = await gitlinkPaths(baseline.git, baseline.workspace, signal);
			inWorkspace = inWorkspace.filter((absolute) => ![...gitlinks].some((link) => isInside(resolve(root, link), absolute)));
		}
		const uncoveredInWorkspace = baseline === null ? new Set(inWorkspace.map(workTreePath)) : await ignoredPaths(baseline.git, baseline.workspace, inWorkspace.map(workTreePath), signal);
		for (const absolute of captured) {
			if (!(isInside(root, absolute) ? uncoveredInWorkspace.has(workTreePath(absolute)) : !isTemporaryPath(absolute, paths.temporaryRoots))) continue;
			const before = state.captures.get(absolute);
			const after = await captureFile(absolute, join(await this.scratchDir(), "captures"), this.env.maxFileBytes);
			if (after === void 0 || sameCapture(before, after)) continue;
			listed.set(absolute, await this.compared(paths, root, absolute, before, after));
		}
		const sorted = [...listed.values()].sort((a, b) => compareDisplay(a.file, b.file));
		if (sorted.length === 0 && state.recordedAfterSeq < 0) return;
		const event = this.session.append("workspace/changes", { turn: state.turn });
		const kept = sorted.slice(0, this.env.maxFiles);
		this.records.set(event.seq, {
			summary: {
				turn: state.turn,
				cwd: this.cwd,
				files: kept.map((entry) => entry.file),
				total: sorted.length,
				added: sorted.reduce((sum, entry) => sum + entry.file.added, 0),
				deleted: sorted.reduce((sum, entry) => sum + entry.file.deleted, 0),
				...snapshot === void 0 ? {} : { snapshot }
			},
			sources: kept.map((entry) => entry.sources)
		});
		state.recordedAfterSeq = event.seq;
	}
	/**
	* The listing of a captured pair: an oversized side lists the file without
	* counts and refuses its comparison, a binary side likewise, and two text
	* sides carry the counts of their line comparison.
	*/
	async compared(paths, root, absolute, before, after) {
		const list = (counts, sources) => ({
			file: changedFile(paths, root, absolute, counts),
			sources
		});
		if (before.kind === "oversized" || after.kind === "oversized") return list({
			added: 0,
			deleted: 0,
			binary: false,
			oversized: true
		}, { refusal: "oversized" });
		if (isBinary(before) || isBinary(after)) return list({
			added: 0,
			deleted: 0,
			binary: true
		}, { refusal: "binary" });
		const text = async (side) => side.kind === "file" ? readFile(side.file, "utf8") : null;
		const { added, deleted } = compareText(await text(before), await text(after), this.env.diffTimeoutMs);
		return list({
			added,
			deleted,
			binary: false
		}, {
			before,
			after
		});
	}
};
/** Whether a captured side holds binary content. */
function isBinary(capture) {
	return capture.kind === "file" && capture.binary;
}
function changedFile({ cwd, home }, root, absolute, counts) {
	return {
		path: durablePathOf(absolute, cwd),
		display: displayPathOf(absolute, cwd, root, home),
		added: counts.added,
		deleted: counts.deleted,
		...counts.binary ? { binary: true } : {},
		...counts.oversized === true ? { oversized: true } : {}
	};
}
//#endregion
//#region lib/types/index.js
/**
* Summarizes the files each top-level turn changed from git working-tree
* snapshots taken at turn start and turn end, plus whole-file captures taken
* around each file-tool edit for paths git does not cover, and serves each
* listed file's before-and-after comparison on demand. Each summary is
* announced by a `workspace/changes` Session event that carries only the turn
* number; summaries and comparisons are served through the `workspaceChanges`
* service until the Session is disposed. Outside a git repository, or without
* git, the summary lists file-tool edits only.
*/
/** Stable Loader identity. */
const name = "workspace-changes";
/** Services used to run git, resolve mutation targets, and observe turns. */
const inject = ["subprocess", "fs"];
/** Schemastery validation for {@link Config}. */
const Config = z.object({
	timeoutMs: z.number().default(3e4),
	outputMaxBytes: z.number().default(8 * 1024 * 1024),
	maxFiles: z.number().default(500),
	maxFileBytes: z.number().default(2 * 1024 * 1024),
	diffTimeoutMs: z.number().default(100)
});
function eligible(session) {
	const { cwd, origin, delegationDepth } = session.header;
	return origin === "subagent" || (delegationDepth ?? 0) > 0 ? void 0 : cwd;
}
/**
* Resolve the git executable once. On macOS the Xcode stub at `/usr/bin/git`
* opens an installer dialog instead of running, so it counts as absent until
* developer tools are selected.
* @param ctx - subprocess capability.
* @param signal - plugin lifetime.
* @returns the executable path, or null when git is unavailable.
*/
async function resolveGit(ctx, signal) {
	let executable;
	try {
		executable = await ctx.subprocess.resolveExecutable("git", void 0, signal);
	} catch {
		return null;
	}
	if (process.platform !== "darwin" || executable !== "/usr/bin/git") return executable;
	return (await ctx.subprocess.spawn({
		argv: ["/usr/bin/xcode-select", "-p"],
		cwd: homedir(),
		stdio: {
			stdin: "ignore",
			stdout: { maxBytes: 4096 },
			stderr: { maxBytes: 4096 }
		},
		graceMs: 1e3,
		signal
	}).done.catch(() => ({ exitCode: null }))).exitCode === 0 ? executable : null;
}
/**
* Observe top-level turns of every Session with a working directory, capture
* file-tool edits, announce change summaries, and serve them with their
* comparisons as `workspaceChanges`.
* @param ctx - host context with `subprocess` and `fs`.
* @param config - validated bounds.
*/
function apply(ctx, config) {
	for (const [field, value] of [
		["timeoutMs", config.timeoutMs],
		["outputMaxBytes", config.outputMaxBytes],
		["maxFiles", config.maxFiles],
		["maxFileBytes", config.maxFileBytes],
		["diffTimeoutMs", config.diffTimeoutMs]
	]) if (!Number.isSafeInteger(value) || value < 1) throw new Error(`workspace-changes requires a positive integer ${field}`);
	const lifetime = new AbortController();
	const recorders = /* @__PURE__ */ new Map();
	const mutations = /* @__PURE__ */ new WeakMap();
	const byId = /* @__PURE__ */ new Map();
	const forget = (session) => {
		const recorder = recorders.get(session);
		recorders.delete(session);
		byId.delete(session.id);
		return recorder?.dispose() ?? Promise.resolve();
	};
	ctx.effect(() => async () => {
		lifetime.abort();
		await Promise.all([...recorders.keys()].map(forget));
	});
	ctx.provide("workspaceChanges", {
		summary: (sessionId, seq) => byId.get(sessionId)?.summary(seq),
		diff: (sessionId, seq, index, signal) => byId.get(sessionId)?.diff(seq, index, signal) ?? Promise.resolve(void 0)
	});
	let runner;
	const gitRunner = () => {
		runner ??= resolveGit(ctx, lifetime.signal).then((executable) => {
			if (executable === null) {
				ctx.logger.info("workspace-changes: git is unavailable; only file-tool edits are summarized");
				return null;
			}
			return new GitRunner(ctx.subprocess, executable, {
				timeoutMs: config.timeoutMs,
				outputMaxBytes: config.outputMaxBytes
			});
		});
		return runner;
	};
	const recorderFor = (session, cwd) => {
		let recorder = recorders.get(session);
		if (recorder === void 0) {
			recorder = new TurnRecorder(session, cwd, {
				git: gitRunner(),
				tempRoot: tmpdir(),
				maxFiles: config.maxFiles,
				maxFileBytes: config.maxFileBytes,
				diffTimeoutMs: config.diffTimeoutMs,
				warn: (message) => {
					ctx.logger.warn(message);
				}
			});
			recorders.set(session, recorder);
			byId.set(session.id, recorder);
		}
		return recorder;
	};
	ctx.on("session/event", (session, event) => {
		if (event.type === "turn/start") {
			const cwd = eligible(session);
			if (cwd !== void 0) recorderFor(session, cwd).start(event.data.turn);
			return;
		}
		if (event.type === "tool/result") recorders.get(session)?.observe(event);
		else if (event.type === "turn/end") recorders.get(session)?.end(event.data.turn);
	});
	ctx.on("session/disposed", (session) => {
		forget(session);
	});
	ctx.on("agent/turn-stopping", async ({ agent, turn }) => {
		await recorders.get(agent.session)?.stopping(turn);
	});
	const capture = async (target, actor) => {
		const recorder = actor === void 0 ? void 0 : mutations.get(actor);
		if (recorder === void 0) return;
		recorder.capture(ctx.fs.processPath(target));
		await recorder.settled();
	};
	ctx.on("fs/write-intent", async (target, actor, next) => {
		const intent = await next();
		await capture(target, actor);
		return intent;
	}, { prepend: true });
	ctx.on("fs/edit-intent", async (target, actor, next) => {
		const intent = await next();
		await capture(target, actor);
		return intent;
	}, { prepend: true });
	ctx.on("tools/pre-execute", async (exec, next) => {
		const session = exec.agent?.session;
		const recorder = session === void 0 ? void 0 : recorders.get(session);
		if (recorder !== void 0) {
			mutations.set(exec, recorder);
			await recorder.settled();
		}
		return next();
	});
}
//#endregion
export { Config, apply, inject, name };
