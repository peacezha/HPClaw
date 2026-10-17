import z from "@deepseek-ai/schemastery";
import { defineTool } from "@deepseek-ai/dsh-tools";
//#region lib/types/record.js
/**
* Live-progress mirror for background workflow runs: streams the engine's
* `workflow/phase`, `workflow/log`, and member lifecycle events into the
* owning job's output ring as `log` chunks — observer-only narration the
* model's `job_output` never renders — and keeps the job's live progress
* line on the current phase. Appends against a settled job log and drop
* inside the registry, so a straggling event after settlement is harmless.
* @module @deepseek-ai/dsh-tool-workflow/record
*/
/**
* Create the run-to-ring mirror and subscribe the engine's live progress
* events for the runs it tracks.
* @param ctx - plugin context whose event bus carries the `workflow/*` events.
* @returns the mirror taps the tool wires around each background run.
*/
function createWorkflowRecordMirror(ctx) {
	const active = /* @__PURE__ */ new Map();
	ctx.on("workflow/phase", (info, title) => {
		const job = active.get(info.id);
		if (job === void 0) return;
		job.updateProgress(title);
		job.append(`▸ ${title}\n`, { channel: "log" });
	});
	ctx.on("workflow/log", (info, message) => {
		active.get(info.id)?.append(`${message}\n`, { channel: "log" });
	});
	ctx.on("workflow/agent-start", (info, agent) => {
		active.get(info.id)?.append(`agent #${agent.seq} ${agent.label} started\n`, { channel: "log" });
	});
	ctx.on("workflow/agent-end", (info, agent) => {
		active.get(info.id)?.append(`agent #${agent.seq} ${agent.outcome}\n`, { channel: "log" });
	});
	return {
		start(runId, job) {
			active.set(runId, job);
		},
		stop(runId) {
			active.delete(runId);
		}
	};
}
//#endregion
//#region lib/types/index.js
/**
* The model-facing `workflow` tool: run a JavaScript orchestration script that fans out
* subagents, and return the script's final value. It owns the model-facing schema and run lifecycle; script
* parsing, execution, caps, and cancellation live behind `ctx.workflowEngine`
* (`@deepseek-ai/dsh-workflow`), so a hardened engine swaps in without touching what the model
* sees. Foreground execution awaits `run.result` and always disposes the run; non-completed reasons
* become tool errors. `run_in_background: true` instead registers the run as an owned `ctx.jobs` job
* and returns its id immediately — the job's output ring streams live progress, and the run's value
* arrives with the job's completion notice. Presentation is an args-only generic card
* titled from `meta.name`. Explicit-ask usage guidance is registered as the tool's own prompt
* section rather than deployment persona prose.
* @module @deepseek-ai/dsh-tool-workflow
*/
const name = "tool-workflow";
const inject = [
	"tools",
	"workflowEngine",
	"systemPrompt"
];
const Config = z.object({
	toolName: z.string().default("workflow"),
	maxResultChars: z.natural().min(1).default(5e4),
	enableRunInBackground: z.boolean().default(true)
});
/** Render a contained recording failure without trusting the thrown value. */
function renderRecordingError(error) {
	try {
		return String(error);
	} catch {
		return "[unrenderable thrown value]";
	}
}
/**
* Project active top-level workflow runs into their parent Sessions without
* letting recording failure affect tool execution.
*/
function createWorkflowRecorder(ctx) {
	const active = /* @__PURE__ */ new Map();
	const append = (session, type, data) => {
		const appendRecord = session.append.bind(session);
		try {
			appendRecord(type, data);
			return true;
		} catch (error) {
			ctx.logger.warn(`tool-workflow: disabled durable record after ${type} append failed: ${renderRecordingError(error)}`);
			return false;
		}
	};
	ctx.on("workflow/agent-start", (info, agent) => {
		const session = active.get(info.id);
		if (session === void 0) return;
		if (!append(session, "tool-workflow/agent-start", {
			runId: info.id,
			seq: agent.seq,
			label: agent.label,
			...agent.phase === void 0 ? {} : { phase: agent.phase },
			childId: agent.childId
		})) active.delete(info.id);
	});
	ctx.on("workflow/agent-end", (info, agent) => {
		const session = active.get(info.id);
		if (session === void 0) return;
		if (!append(session, "tool-workflow/agent-end", {
			runId: info.id,
			seq: agent.seq,
			outcome: agent.outcome
		})) active.delete(info.id);
	});
	return {
		start(session, run) {
			if (append(session, "tool-workflow/run-start", {
				runId: run.id,
				name: run.meta.name
			})) active.set(run.id, session);
		},
		finish(runId, stopReason) {
			const session = active.get(runId);
			if (session !== void 0) append(session, "tool-workflow/run-end", {
				runId,
				stopReason
			});
			active.delete(runId);
		},
		abandon: (runId) => {
			active.delete(runId);
		}
	};
}
/**
* The script-authoring contract, embedded in the tool description: the hooks,
* their exact semantics, and the supported schema subset. Parameter-level
* rules live in the parameter descriptions.
*/
const DESCRIPTION = `Run a JavaScript workflow script that orchestrates subagents at scale. Use this for work that fans out across many independent pieces — an audit over many files, a migration, multi-angle research, adversarial verification of findings — where you write the orchestration as a script instead of delegating turn by turn.

Script-body hooks:
- \`agent(prompt, opts?): Promise<any>\` — run one subagent to completion. Without \`opts.schema\` it resolves to the child's final text; with \`opts.schema\` (an object-rooted JSON Schema using ONLY type/properties/required/additionalProperties/items/enum/const/oneOf) it resolves to the validated object. Resolves \`null\` when the child fails (filter with \`.filter(Boolean)\`). Other opts: \`label\` (display), \`phase\` (progress group), and independent \`provider\`/\`model\` LLM target overrides.
- \`pipeline(items, ...stages): Promise<any[]>\` — run each item through the stages independently with NO barrier between stages (prefer this for multi-stage work). Each stage receives \`(prev, item, index)\`. A stage throw drops that ITEM to \`null\` and skips its remaining stages.
- \`parallel(thunks): Promise<any[]>\` — run zero-argument functions concurrently and await ALL of them (a barrier; use only when a stage genuinely needs every prior result together). A throwing thunk resolves to \`null\`.
- \`phase(title)\` — start a progress phase; \`log(message)\` — narrate progress; \`args\` — the tool call's \`args\` input, verbatim.

Misused hooks (bad arguments, unknown options, unsupported schemas, tripped caps) end the whole script instead of producing \`null\`. The script has no filesystem, network, timer, or Node.js APIs; the agents do the work.`;
/** The pending-state card: a generic card titled by the workflow's meta name. */
function presentWorkflowCall(args) {
	return {
		card: "generic",
		title: `workflow: ${args.meta.name}`,
		rawInput: args.script
	};
}
/** The completed-state card: keep the pending title; render the result content as-is. */
function presentWorkflowResult(args, result) {
	return { card: "generic" };
}
/** A non-`completed` stop reason means the script did not finish cleanly. */
function stopReasonError(result) {
	switch (result.stopReason) {
		case "completed": return;
		case "cancelled": return `workflow run was cancelled${result.error !== void 0 ? ` (${result.error})` : ""}`;
		case "error": return `workflow run failed: ${result.error ?? "unknown error"}`;
		/* v8 ignore start -- defensive: WorkflowStopReason is a closed union, exhaustive by construction; a future variant fails here loudly */
		default: return `workflow run ended abnormally (${String(result.stopReason)})`;
	}
}
/**
* Map a settled background run onto the job outcome vocabulary. A completed
* run carries the rendered return value as the job's result; a
* cancelled run leaves the detail to the registry's kill-reason merge (the
* cancel reason it forwarded is the same string); an errored run fails with
* the script's failure message.
*/
function jobOutcomeOf(result, name, maxChars) {
	switch (result.stopReason) {
		case "completed": return {
			status: "completed",
			detail: `${result.agentsStarted} agent${result.agentsStarted === 1 ? "" : "s"}`,
			result: renderResult(name, result.agentsStarted, result.value, maxChars)
		};
		case "cancelled": return { status: "killed" };
		case "error": return {
			status: "failed",
			detail: result.error ?? "unknown error"
		};
		/* v8 ignore start -- defensive: WorkflowStopReason is a closed union, exhaustive by construction; a future variant fails here loudly */
		default: return {
			status: "failed",
			detail: `workflow run ended abnormally (${String(result.stopReason)})`
		};
	}
}
/** Render the run's outcome text: the meta name, agent count, and the JSON value (capped). */
function renderResult(name, agentsStarted, value, maxChars) {
	const rendered = JSON.stringify(value, null, 2);
	const clipped = rendered.length > maxChars ? `${rendered.slice(0, maxChars)}\n… [truncated: ${rendered.length - maxChars} more characters]` : rendered;
	return `workflow "${name}" completed (${agentsStarted} agent${agentsStarted === 1 ? "" : "s"}).\nReturn value:\n${clipped}`;
}
/**
* Register a background run as an owned job. The engine run is started
* inside the job starter with no tool-step signal — the run belongs to the
* job, so a registry kill or owner teardown is what cancels it — and its
* settlement is the job's settlement: dispose, stop the mirrors, then map the
* stop reason onto the job outcome (a completed run's rendered return value
* rides `result` to the model's first read after settlement).
* @param ctx - plugin context (engine, optional jobs registry, logger).
* @param args - the validated tool call.
* @param parent - the calling agent; owns the job.
* @param toolCall - creating invocation, including its root call.
* @param recordsRun - whether this top-level call records durable run events.
* @param deps - the tool's recorder/mirror taps and the render cap.
* @returns the background result for the tool's output schema.
*/
function startBackgroundRun(ctx, args, parent, toolCall, recordsRun, deps) {
	const jobs = ctx.get("jobs");
	if (jobs === void 0) throw new Error("background jobs unavailable: load @deepseek-ai/dsh-jobs and @deepseek-ai/dsh-tool-jobs");
	let run;
	return {
		kind: "background",
		jobId: jobs.start({
			kind: "workflow",
			label: args.meta.name,
			owner: parent.id,
			toolCall,
			run: (job) => {
				run = ctx.workflowEngine.start({
					script: args.script,
					meta: args.meta,
					...args.args !== void 0 ? { args: args.args } : {},
					parent
				});
				deps.mirror.start(run.id, job);
				if (recordsRun) deps.recorder.start(parent.session, run);
				return {
					cancel: (reason) => {
						run.cancel(reason ?? "background workflow job killed");
					},
					done: run.result.then(async (result) => {
						try {
							await run.dispose();
						} catch (error) {
							ctx.logger.warn(`background workflow run ${run.id} dispose failed: ${String(error)}`);
						}
						deps.mirror.stop(run.id);
						if (recordsRun) {
							deps.recorder.finish(run.id, result.stopReason);
							deps.recorder.abandon(run.id);
						}
						return jobOutcomeOf(result, args.meta.name, deps.maxResultChars);
					})
				};
			}
		}),
		runId: run.id
	};
}
function apply(ctx, config) {
	const { toolName, maxResultChars, enableRunInBackground } = config;
	const recorder = createWorkflowRecorder(ctx);
	const mirror = createWorkflowRecordMirror(ctx);
	ctx.systemPrompt.section({
		name: `tool:${toolName}`,
		order: ctx.systemPrompt.getSectionOrder("TOOL_WORKFLOW"),
		text: `Use the ${toolName} tool ONLY when the user explicitly asks for a workflow or for large multi-agent orchestration: you write a JavaScript script (the tool description documents the exact format) that fans work out across many subagents with phases and structured results. For one or two delegations, prefer plain subagent calls.`
	});
	ctx.tools.register(defineTool({
		name: toolName,
		description: DESCRIPTION,
		parameters: {
			script: {
				type: "string",
				required: true,
				description: "The plain JavaScript body, not TypeScript and without an `export const meta` statement; top-level await is allowed. End with `return <value>`; the JSON-serializable value is this tool's result."
			},
			meta: {
				type: "object",
				additionalProperties: true,
				required: true,
				description: "The workflow identity as plain JSON, not code.",
				properties: {
					name: {
						type: "string",
						required: true,
						description: "Short kebab-case workflow name."
					},
					description: {
						type: "string",
						required: true,
						description: "One-line description of what the workflow does."
					},
					whenToUse: {
						type: "string",
						description: "Optional guidance on when this workflow applies."
					},
					phases: {
						type: "array",
						description: "Optional phase declarations matched by phase() calls.",
						items: {
							type: "object",
							additionalProperties: true,
							properties: {
								title: {
									type: "string",
									required: true,
									description: "The phase title phase() calls match by exact string."
								},
								detail: {
									type: "string",
									description: "Optional one-line description of the phase."
								},
								provider: {
									type: "string",
									description: "Optional provider override this phase is expected to use."
								},
								model: {
									type: "string",
									description: "Optional model override this phase is expected to use."
								}
							}
						}
					}
				}
			},
			args: {
				type: "object",
				additionalProperties: true,
				description: "Optional JSON input exposed to the script as the `args` global (wrap a bare list as a field, e.g. {\"files\": [...]})."
			},
			...enableRunInBackground ? { run_in_background: {
				type: "boolean",
				description: "Run as a background job: return a job id immediately instead of waiting; the return value arrives with the completion notice."
			} } : {}
		},
		output: {
			schema: { oneOf: [{
				type: "object",
				additionalProperties: false,
				properties: {
					kind: {
						type: "string",
						required: true,
						const: "background"
					},
					jobId: {
						type: "string",
						required: true
					},
					runId: {
						type: "string",
						required: true
					}
				}
			}, {
				type: "object",
				additionalProperties: false,
				properties: {
					kind: {
						type: "string",
						required: true,
						const: "foreground"
					},
					runId: {
						type: "string",
						required: true
					},
					agentsStarted: {
						type: "integer",
						required: true
					},
					result: {
						type: "json",
						required: true
					}
				}
			}] },
			render: (args, value) => [{
				type: "text",
				text: value.kind === "background" ? `workflow "${args.meta.name}" started in the background as job ${value.jobId}. Its return value arrives with the completion notice; check on it with job_output, stop it with job_kill.` : renderResult(args.meta.name, value.agentsStarted, value.result, maxResultChars)
			}]
		},
		async execute(args, exec) {
			const parent = exec.agent;
			if (!parent) throw new Error("workflow tool requires a calling agent (exec.agent was undefined)");
			if (args.run_in_background === true) {
				if (!enableRunInBackground) throw new Error("run_in_background is disabled for this tool");
				return startBackgroundRun(ctx, args, parent, {
					callId: exec.callId,
					rootCallId: exec.rootCallId
				}, exec.parent === void 0, {
					recorder,
					mirror,
					maxResultChars
				});
			}
			const run = ctx.workflowEngine.start({
				script: args.script,
				meta: args.meta,
				...args.args !== void 0 ? { args: args.args } : {},
				parent,
				signal: exec.signal
			});
			const recordsRun = exec.parent === void 0;
			if (recordsRun) recorder.start(parent.session, run);
			const onAbort = () => {
				run.cancel("parent step aborted");
			};
			exec.signal.addEventListener("abort", onAbort, { once: true });
			let result;
			try {
				result = await run.result;
				const error = stopReasonError(result);
				if (error !== void 0) throw new Error(error);
				return {
					kind: "foreground",
					runId: run.id,
					agentsStarted: result.agentsStarted,
					result: result.value
				};
			} finally {
				exec.signal.removeEventListener("abort", onAbort);
				try {
					await run.dispose();
					if (recordsRun) {
						/* v8 ignore next -- WorkflowRun.result never rejects by contract, so result is assigned before finally. */
						if (result === void 0) throw new Error("workflow run settled without a result");
						recorder.finish(run.id, result.stopReason);
					}
				} finally {
					if (recordsRun) recorder.abandon(run.id);
				}
			}
		},
		presentCall: (args) => presentWorkflowCall(args),
		presentResult: (args, result) => presentWorkflowResult(args, result)
	}));
}
//#endregion
export { Config, apply, inject, name };
