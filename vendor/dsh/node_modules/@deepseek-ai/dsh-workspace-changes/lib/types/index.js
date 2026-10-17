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
import { homedir, tmpdir } from 'node:os';
import z from '@deepseek-ai/schemastery';
import { GitRunner } from "./git.js";
import { TurnRecorder } from "./recorder.js";
/** Stable Loader identity. */
export const name = 'workspace-changes';
/** Services used to run git, resolve mutation targets, and observe turns. */
export const inject = ['subprocess', 'fs'];
/** Schemastery validation for {@link Config}. */
export const Config = z.object({
    timeoutMs: z.number().default(30_000),
    outputMaxBytes: z.number().default(8 * 1024 * 1024),
    maxFiles: z.number().default(500),
    maxFileBytes: z.number().default(2 * 1024 * 1024),
    diffTimeoutMs: z.number().default(100),
});
function eligible(session) {
    const { cwd, origin, delegationDepth } = session.header;
    return origin === 'subagent' || (delegationDepth ?? 0) > 0 ? undefined : cwd;
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
        executable = await ctx.subprocess.resolveExecutable('git', undefined, signal);
    }
    catch {
        return null;
    }
    if (process.platform !== 'darwin' || executable !== '/usr/bin/git')
        return executable;
    const probe = ctx.subprocess.spawn({
        argv: ['/usr/bin/xcode-select', '-p'], cwd: homedir(),
        stdio: { stdin: 'ignore', stdout: { maxBytes: 4096 }, stderr: { maxBytes: 4096 } }, graceMs: 1_000, signal,
    });
    const outcome = await probe.done.catch(() => ({ exitCode: null }));
    return outcome.exitCode === 0 ? executable : null;
}
/**
 * Observe top-level turns of every Session with a working directory, capture
 * file-tool edits, announce change summaries, and serve them with their
 * comparisons as `workspaceChanges`.
 * @param ctx - host context with `subprocess` and `fs`.
 * @param config - validated bounds.
 */
export function apply(ctx, config) {
    for (const [field, value] of [
        ['timeoutMs', config.timeoutMs], ['outputMaxBytes', config.outputMaxBytes], ['maxFiles', config.maxFiles],
        ['maxFileBytes', config.maxFileBytes], ['diffTimeoutMs', config.diffTimeoutMs],
    ]) {
        if (!Number.isSafeInteger(value) || value < 1)
            throw new Error(`workspace-changes requires a positive integer ${field}`);
    }
    const lifetime = new AbortController();
    const recorders = new Map();
    const mutations = new WeakMap();
    const byId = new Map();
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
    const service = {
        summary: (sessionId, seq) => byId.get(sessionId)?.summary(seq),
        diff: (sessionId, seq, index, signal) => byId.get(sessionId)?.diff(seq, index, signal) ?? Promise.resolve(undefined),
    };
    ctx.provide('workspaceChanges', service);
    let runner;
    const gitRunner = () => {
        runner ??= resolveGit(ctx, lifetime.signal).then((executable) => {
            if (executable === null) {
                ctx.logger.info('workspace-changes: git is unavailable; only file-tool edits are summarized');
                return null;
            }
            return new GitRunner(ctx.subprocess, executable, { timeoutMs: config.timeoutMs, outputMaxBytes: config.outputMaxBytes });
        });
        return runner;
    };
    const recorderFor = (session, cwd) => {
        let recorder = recorders.get(session);
        if (recorder === undefined) {
            recorder = new TurnRecorder(session, cwd, {
                git: gitRunner(), tempRoot: tmpdir(), maxFiles: config.maxFiles,
                maxFileBytes: config.maxFileBytes, diffTimeoutMs: config.diffTimeoutMs,
                warn: (message) => { ctx.logger.warn(message); },
            });
            recorders.set(session, recorder);
            byId.set(session.id, recorder);
        }
        return recorder;
    };
    ctx.on('session/event', (session, event) => {
        if (event.type === 'turn/start') {
            const cwd = eligible(session);
            if (cwd !== undefined)
                recorderFor(session, cwd).start(event.data.turn);
            return;
        }
        if (event.type === 'tool/result')
            recorders.get(session)?.observe(event);
        else if (event.type === 'turn/end')
            recorders.get(session)?.end(event.data.turn);
    });
    ctx.on('session/disposed', (session) => { void forget(session); });
    ctx.on('agent/turn-stopping', async ({ agent, turn }) => {
        await recorders.get(agent.session)?.stopping(turn);
    });
    const capture = async (target, actor) => {
        const recorder = actor === undefined ? undefined : mutations.get(actor);
        if (recorder === undefined)
            return;
        recorder.capture(ctx.fs.processPath(target));
        await recorder.settled();
    };
    ctx.on('fs/write-intent', async (target, actor, next) => {
        const intent = await next();
        await capture(target, actor);
        return intent;
    }, { prepend: true });
    ctx.on('fs/edit-intent', async (target, actor, next) => {
        const intent = await next();
        await capture(target, actor);
        return intent;
    }, { prepend: true });
    ctx.on('tools/pre-execute', async (exec, next) => {
        const session = exec.agent?.session;
        const recorder = session === undefined ? undefined : recorders.get(session);
        if (recorder !== undefined) {
            mutations.set(exec, recorder);
            await recorder.settled();
        }
        return next();
    });
}
//# sourceMappingURL=index.js.map