import { n as projectJsonRun, t as boundJsonLine } from "./json-stream-BA-F3lfb.js";
import { randomUUID } from "node:crypto";
import z from "@deepseek-ai/schemastery";
import { brandString } from "@deepseek-ai/dsh-brand";
import { installModelSelection } from "@deepseek-ai/dsh-agent";
import { createUserMessage } from "@deepseek-ai/dsh-llm";
import { assertNever } from "@deepseek-ai/dsh-util-values";
import { SessionSeq } from "@deepseek-ai/dsh-session";
import { SessionQueryError } from "@deepseek-ai/dsh-session-query";
//#region lib/types/runner-internals.js
/**
* Process streams the runner reads and writes, kept out of the package entry so
* substituting them in tests adds no public package API. The shape matches the
* runner's own IO carrier structurally.
* @module @deepseek-ai/dsh-headless/runner-internals
*/
/** The process streams the runner reads and writes; tests substitute captures. */
const internals = {
	stdout: process.stdout,
	stderr: process.stderr,
	readStdin: async () => {
		const chunks = [];
		for await (const chunk of process.stdin) chunks.push(chunk);
		return Buffer.concat(chunks).toString("utf8");
	}
};
//#endregion
//#region lib/types/index.js
/**
* @deepseek-ai/dsh-headless — one-shot direct Agent driver. The bundle patch
* rides over dsh-base without Host, HTTP, or browser plugins; this runner
* creates one Agent through the core registry (or adopts the exact Session a
* `--session-id` names), drives the task to quiescence, streams provider
* reasoning to stderr, flushes its Session, prints the final assistant text to
* stdout, and exits. With `--json` it projects the run as newline-delimited
* events instead of the final text.
*
* @module @deepseek-ai/dsh-headless
*/
var __addDisposableResource = function(env, value, async) {
	if (value !== null && value !== void 0) {
		if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
		var dispose, inner;
		if (async) {
			if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
			dispose = value[Symbol.asyncDispose];
		}
		if (dispose === void 0) {
			if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
			dispose = value[Symbol.dispose];
			if (async) inner = dispose;
		}
		if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
		if (inner) dispose = function() {
			try {
				inner.call(this);
			} catch (e) {
				return Promise.reject(e);
			}
		};
		env.stack.push({
			value,
			dispose,
			async
		});
	} else if (async) env.stack.push({ async: true });
	return value;
};
var __disposeResources = (function(SuppressedError) {
	return function(env) {
		function fail(e) {
			env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
			env.hasError = true;
		}
		var r, s = 0;
		function next() {
			while (r = env.stack.pop()) try {
				if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
				if (r.dispose) {
					var result = r.dispose.call(r.value);
					if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
						fail(e);
						return next();
					});
				} else s |= 1;
			} catch (e) {
				fail(e);
			}
			if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
			if (env.hasError) throw env.error;
		}
		return next();
	};
})(typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
	var e = new Error(message);
	return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
/** Stable Cordis plugin name. */
const name = "headless-runner";
/** Core services required before the one-shot turn can start. */
const inject = [
	"agentDefaultModel",
	"agents",
	"sessions"
];
const Config = z.object({
	task: z.string(),
	sessionId: z.string(),
	json: z.boolean()
});
/** Aggregate the last assistant text and turn outcome in one owned interval. */
function summarize(session, firstSeq) {
	let started = false;
	let text = "";
	let reason;
	const length = session.seq;
	for (let seq = firstSeq; seq < length; seq++) {
		const event = session.eventAt(SessionSeq(seq));
		if (event === void 0) throw new Error(`headless summary cannot read seq ${String(seq)} below captured length ${String(length)}`);
		if (event.type === "turn/start") {
			started = true;
			continue;
		}
		if (!started) continue;
		if (event.type === "assistant/message") {
			const joined = event.data.message.content.filter((block) => block.type === "text").map((block) => block.text).join("");
			if (joined !== "") text = joined;
		}
		if (event.type === "turn/end") reason = event.data.reason;
	}
	return {
		text,
		reason
	};
}
/**
* Project provider-reported reasoning from one owned run to stderr as it is
* streamed, while keeping final outcome derivation on the durable log.
* @param ctx - plugin context carrying the live Assistant frame feed.
* @param agent - the exact Agent whose reasoning belongs to this invocation.
* @param stderr - progress output sink.
* @returns a disposer that also terminates an unterminated reasoning line.
*/
function streamReasoning(ctx, agent, stderr) {
	let open = false;
	let endsWithNewline = true;
	const close = () => {
		if (!open) return;
		if (!endsWithNewline) stderr.write("\n");
		open = false;
		endsWithNewline = true;
	};
	const dispose = ctx.on("agent/assistant-stream", ({ agent: subject, frame }) => {
		if (subject !== agent) return;
		if (frame.type === "start") {
			close();
			return;
		}
		if (frame.type === "end") {
			close();
			return;
		}
		const chunk = frame.chunk;
		switch (chunk.type) {
			case "reasoning-delta":
				if (chunk.text === "") return;
				if (!open) {
					stderr.write("dsh: reasoning:\n");
					open = true;
				}
				stderr.write(chunk.text);
				endsWithNewline = chunk.text.endsWith("\n");
				return;
			case "block-start":
				if (chunk.blockType !== "reasoning") close();
				return;
			case "block-end":
				if (chunk.block.type !== "reasoning") close();
				return;
			case "usage": return;
			case "text-delta":
			case "tool-call-delta":
			case "finish":
				close();
				return;
			/* v8 ignore next -- closed-union exhaustiveness guard */
			default: return assertNever(chunk, "headless reasoning stream");
		}
	});
	return () => {
		dispose();
		close();
	};
}
/** Iterate a live Session's durable events in order. */
function* liveEvents(session) {
	const length = session.seq;
	for (let seq = 0; seq < length; seq++) {
		const event = session.eventAt(SessionSeq(seq));
		if (event === void 0) throw new Error(`headless adoption cannot read seq ${String(seq)} below captured length ${String(length)}`);
		yield event;
	}
}
/**
* The preset a Session currently runs under: its creation header advanced by
* the last `agent-preset/selected` event. The header is only a creation fact;
* the presets plugin reconstructs a session's composition from the projection.
*/
function currentPreset(header, events, sessionId) {
	let preset = header.agentPreset;
	for (const event of events) {
		const candidate = event;
		if (candidate.type !== "agent-preset/selected") continue;
		const selected = candidate.data?.agentPreset;
		if (typeof selected !== "string" || selected === "") throw new Error(`session "${sessionId}" records a malformed agent-preset/selected event and cannot be adopted`);
		preset = selected;
	}
	return preset;
}
/** Reject a Session the one-shot runner must not adopt. */
function assertAdoptable(header, events, sessionId, cwd) {
	const preset = currentPreset(header, events, sessionId);
	if (preset !== void 0) throw new Error(`session "${sessionId}" runs under agent preset "${preset}", which the one-shot runner does not compose`);
	if (header.origin === "subagent" || header.parentSession !== void 0) throw new Error(`session "${sessionId}" is a subagent or forked session and cannot be driven directly`);
	if (header.cwd === void 0) throw new Error(`session "${sessionId}" recorded no working directory, so it cannot be adopted`);
	if (header.cwd !== cwd) throw new Error(`session "${sessionId}" was recorded in "${header.cwd}", not "${cwd}"`);
}
/**
* Resolve the Agent for one run: adopt the persisted Session with the requested
* id. The identity must already exist, and no Agent may be live under it; a
* first round omits the option instead, so a typo cannot pass as a brand-new
* conversation.
* @param ctx - plugin context carrying the Session query service.
* @param agents - the core Agent registry.
* @param sessionId - exact Session identity to adopt.
* @param agentOptions - provider/model pair for this run.
* @param setup - per-Agent scope setup installing the model selection.
* @param cwd - working directory resolved in the mounted filesystem.
* @returns the resumed Agent.
*/
async function resolveAgent(ctx, agents, sessionId, agentOptions, setup, cwd) {
	if (ctx.get("sessionPersistence") === void 0) throw new Error("headless --session-id requires the sessionPersistence service; the Session would not survive this process");
	const query = ctx.get("sessionQuery");
	if (query === void 0) throw new Error("headless --session-id requires the sessionQuery service; dsh-base provides it");
	const live = agents.get(sessionId);
	if (live !== void 0) {
		assertAdoptable(live.session.header, liveEvents(live.session), sessionId, cwd);
		throw new Error(`session "${sessionId}" is live in this process, so the one-shot runner cannot own an exclusive run interval`);
	}
	try {
		const env_1 = {
			stack: [],
			error: void 0,
			hasError: false
		};
		try {
			const observation = __addDisposableResource(env_1, await query.observeSession(sessionId), false);
			assertAdoptable(observation.header, observation.events, sessionId, cwd);
			const { agent } = await agents.resume({
				resumeSessionId: sessionId,
				agentOptions,
				setup
			});
			assertAdoptable(agent.session.header, liveEvents(agent.session), sessionId, cwd);
			return agent;
		} catch (e_1) {
			env_1.error = e_1;
			env_1.hasError = true;
		} finally {
			__disposeResources(env_1);
		}
	} catch (error) {
		if (!(error instanceof SessionQueryError) || error.code !== "SESSION_QUERY_SESSION_NOT_FOUND") throw error;
		throw new Error(`session "${sessionId}" does not exist; omit --session-id to start a new Session`);
	}
}
/** Report an unexpected direct-driver failure and request a failing exit. */
function fail(io, error, json) {
	const message = error instanceof Error ? error.message : String(error);
	if (json) io.stdout.write(`${boundJsonLine({
		type: "error",
		message
	})}\n`);
	io.stderr.write(`dsh: ${message}\n`);
	io.exit(1);
}
/**
* Run one task through one Agent and request process exit.
* Live Agent failures require a later durable terminal before a recovered run can succeed.
* @param ctx - plugin context carrying the Agent, default model, Session, and launcher IO services.
* @param config - task, optional exact Session identity, and output mode.
* @param io - process-facing effects.
*/
async function run(ctx, config, io) {
	await ctx.get("loader")?.await();
	const agents = ctx.get("agents");
	const defaultModel = ctx.get("agentDefaultModel");
	const sessions = ctx.get("sessions");
	if (agents === void 0 || defaultModel === void 0 || sessions === void 0) return;
	if (config.sessionId !== void 0 && config.sessionId.trim() === "") throw new Error("headless-runner: sessionId must not be blank");
	const task = config.task === void 0 || config.task === "-" ? await internals.readStdin() : config.task;
	if (task.trim() === "") throw new Error("a task is required, for example: dsh --profile headless \"run the tests\"");
	const selection = defaultModel.currentSelection();
	const agentOptions = {
		provider: selection.provider,
		model: selection.model
	};
	const setup = (agentCtx) => {
		installModelSelection(agentCtx, {
			current: selection,
			assembled: void 0
		});
	};
	const sessionId = brandString(config.sessionId ?? `session-${randomUUID()}`);
	const fs = ctx.get("fs");
	const cwd = fs === void 0 ? process.cwd() : fs.processPath(await fs.resolve("."));
	const agent = config.sessionId === void 0 ? (await agents.create({
		sessionId,
		meta: { cwd },
		agentOptions,
		setup
	})).agent : await resolveAgent(ctx, agents, sessionId, agentOptions, setup, cwd);
	await agent.whenIdle();
	if (config.sessionId !== void 0) assertAdoptable(agent.session.header, liveEvents(agent.session), sessionId, cwd);
	const firstSeq = agent.session.seq;
	const projection = config.json === true ? projectJsonRun(ctx, agent, io.stdout, { cwd }) : void 0;
	const stopReasoning = projection === void 0 ? streamReasoning(ctx, agent, io.stderr) : void 0;
	let failure;
	const stopErrors = ctx.on("agent/error", ({ agent: subject, error }) => {
		if (subject === agent) failure = {
			error,
			atOffset: agent.session.seq
		};
	});
	const stopTerminals = ctx.on("session/event", (session, event) => {
		if (session === agent.session && event.type === "turn/end" && failure !== void 0 && event.seq >= failure.atOffset) failure = void 0;
	});
	try {
		try {
			agent.followup(createUserMessage({
				content: [{
					type: "text",
					text: task
				}],
				source: { kind: "user" }
			}));
			const subagents = ctx.get("subagents");
			while (true) {
				await agent.whenIdle();
				const idleSeq = agent.session.seq;
				if (!await subagents?.waitForChildren(agent) && agent.status === "idle" && agent.session.seq === idleSeq) break;
			}
		} finally {
			stopReasoning?.();
		}
		await sessions.flush(agent.session);
		if (failure !== void 0) throw failure.error;
		const outcome = summarize(agent.session, firstSeq);
		if (projection === void 0) io.stdout.write(outcome.text + "\n");
		else projection.finish(outcome.text);
		if (outcome.reason?.kind === "error") io.stderr.write(`dsh: ${outcome.reason.error.code}: ${outcome.reason.error.message}\n`);
		io.exit(outcome.reason?.kind === "completed" ? 0 : 1);
	} finally {
		stopErrors();
		stopTerminals();
		projection?.dispose();
	}
}
/**
* Mount the one-shot direct driver.
* @param ctx - plugin context carrying core services and the launcher-provided exit request.
* @param config - validated task and run options.
*/
function apply(ctx, config) {
	const exit = ctx.get("appExit");
	if (exit === void 0) throw new Error("headless-runner: the launcher must provide ctx.appExit before the tree mounts");
	const io = {
		stdout: internals.stdout,
		stderr: internals.stderr,
		exit
	};
	run(ctx, config, io).catch((error) => {
		fail(io, error, config.json === true);
	});
}
//#endregion
export { Config, apply, inject, name };
