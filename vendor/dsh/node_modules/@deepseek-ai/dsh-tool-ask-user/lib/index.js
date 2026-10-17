import { defineTool } from "@deepseek-ai/dsh-tools";
import z from "@deepseek-ai/schemastery";
import { TIMED_WAIT_PARAMETER } from "@deepseek-ai/dsh-user-questions";
//#region lib/types/timed.js
/**
* Opt-in timed `ask_user_question` tool definition.
*/
function validateTimeout(timeout) {
	if (timeout !== -1 && (!Number.isInteger(timeout) || timeout < 1 || timeout > 2147483)) throw new Error("timeout must be -1 or a positive integer up to 2147483 seconds");
	return timeout;
}
function validateQuestionIds(questions) {
	const ids = /* @__PURE__ */ new Set();
	for (const question of questions) {
		if (ids.has(question.id)) throw new Error(`question id ${JSON.stringify(question.id)} must be unique within this call`);
		ids.add(question.id);
	}
}
const description$1 = "Ask brief, direct, self-contained questions about missing information, preferences, or decisions. Use user-facing terms; assume no knowledge of background work or internal names. Use distinct stable question IDs. A submitted skipped question is an answer item with empty selected and no custom; pending instead means no answer batch arrived before the timeout and the user can still answer.";
/**
* Instruction the pending result carries in its `message` field. It is a field
* of the result value rather than prose beside it because the recorded result
* text is read back as one JSON object: the `userQuestions` projection decides
* from it that the call stays answerable, and the Client question row decides
* from it that the recorded result is the timeout, not an answer batch.
*/
const pendingNotice = "No answer batch arrived before the timeout. This is pending, not a skipped answer. Continue useful independent work. The user can still answer; their reply will be a user message identified as answer_to_pending_question with this callId and the original questions. Do not treat this as permission.";
/**
* Translate the model schema into the service request without changing ownership.
* @param questions - Model-supplied questions in tool-schema form.
* @param exec - Execution context that owns the agent and cancellation signal.
* @returns The corresponding user-question service request.
*/
function questionRequest(questions, exec) {
	return {
		questions: questions.map((question) => ({
			id: question.id,
			question: question.question,
			...question.header !== void 0 ? { header: question.header } : {},
			...question.options !== void 0 ? { options: question.options.map((option) => ({ ...option })) } : {},
			...question.multi_select !== void 0 ? { multiSelect: question.multi_select } : {}
		})),
		...exec.agent !== void 0 ? { agent: exec.agent } : {},
		signal: exec.signal
	};
}
/**
* Copy service-owned answer arrays into the model-facing result.
* @param result - Answer returned by the user-question service.
* @returns A detached model-facing answer payload.
*/
function answerResult(result) {
	return { answers: result.answers.map((answer) => ({
		id: answer.id,
		selected: [...answer.selected],
		...answer.custom !== void 0 ? { custom: answer.custom } : {}
	})) };
}
/**
* Register the opt-in timed tool definition.
* @param ctx - Agent-scoped context receiving the tool.
* @param timeout - Default foreground wait in seconds.
*/
function registerTimedAskUser(ctx, timeout = 120) {
	const defaultTimeout = validateTimeout(timeout);
	ctx.tools.register(defineTool({
		name: "ask_user_question",
		description: description$1,
		parameters: {
			questions: {
				type: "array",
				required: true,
				description: "Questions to ask the user.",
				items: {
					type: "object",
					additionalProperties: true,
					properties: {
						id: {
							type: "string",
							required: true,
							description: "Stable id for this question; echoed in the answer."
						},
						question: {
							type: "string",
							required: true,
							description: "The specific question to ask the user."
						},
						header: {
							type: "string",
							description: "Optional short heading for the question, such as \"Confirm\" or \"Choose Mode\"."
						},
						options: {
							type: "array",
							description: "Optional choices to show the user. If you recommend one, put it first and append \"(Recommended)\" to that label.",
							items: {
								type: "object",
								additionalProperties: true,
								properties: {
									label: {
										type: "string",
										required: true,
										description: "Short user-facing option label."
									},
									description: {
										type: "string",
										description: "One sentence explaining the tradeoff or impact."
									}
								}
							}
						},
						multi_select: {
							type: "boolean",
							description: "Whether the user may select more than one option. Defaults to false."
						}
					}
				}
			},
			[TIMED_WAIT_PARAMETER]: {
				type: "integer",
				description: `Wait seconds for the entire batch (default ${defaultTimeout}); omit unless the user specifies a duration. Use -1 only when an answer is required before proceeding.`
			}
		},
		output: {
			schema: { oneOf: [{
				type: "object",
				additionalProperties: false,
				properties: {
					pending: {
						type: "boolean",
						enum: [true],
						required: true,
						description: "True when the foreground wait expired before the user submitted an answer batch. The questions remain answerable; this is not a skipped answer."
					},
					callId: {
						type: "string",
						required: true,
						description: "Tool call whose unanswered questions remain pending."
					},
					message: {
						type: "string",
						required: true,
						description: "How to continue while the questions stay answerable."
					}
				}
			}, {
				type: "object",
				additionalProperties: false,
				properties: { answers: {
					type: "array",
					required: true,
					description: "Submitted answer batch with one item per question. A skipped question has empty selected and no custom; unlike pending, the user has completed the batch.",
					items: {
						type: "object",
						additionalProperties: false,
						properties: {
							id: {
								type: "string",
								required: true,
								description: "Stable question id echoed from the request."
							},
							selected: {
								type: "array",
								required: true,
								items: { type: "string" },
								description: "Selected option labels. Empty with no custom means the user explicitly skipped this question."
							},
							custom: {
								type: "string",
								description: "Optional free-form answer; omitted for a skipped question."
							}
						}
					}
				} }
			}] },
			render: (_args, value) => [{
				type: "text",
				text: JSON.stringify(value)
			}]
		},
		async execute(args, exec) {
			const timeout = validateTimeout(args.timeout ?? defaultTimeout);
			validateQuestionIds(args.questions);
			const request = questionRequest(args.questions, exec);
			if (timeout !== -1) {
				if (exec.agent === void 0) throw new Error("timed questions require a live agent");
				const result = await ctx.userQuestions.askTimed({
					...request,
					agent: exec.agent
				}, exec.callId, timeout * 1e3);
				return "pending" in result ? {
					...result,
					message: pendingNotice
				} : answerResult(result);
			}
			return answerResult(await ctx.userQuestions.ask({
				...request,
				wait: { callId: exec.callId }
			}));
		}
	}));
}
//#endregion
//#region lib/types/index.js
/**
* Model-facing Consumer of the `ctx.userQuestions` capability seam.
* The tool pauses until a UI provider returns a human answer, then feeds that
* answer back into the agent loop as an ordinary tool result.
*
* @module @deepseek-ai/dsh-tool-ask-user
*/
const Config = z.object({
	mode: z.union(["legacy", "timed"]).default("legacy"),
	timeout: z.union([-1, z.number().step(1).min(1).max(2147483)]).default(120)
});
const name = "tool-ask-user";
const inject = ["tools", "userQuestions"];
const description = "Ask the user a concise question when you need confirmation, a choice, or missing information before proceeding.";
function apply(ctx, config = {}) {
	if (config.mode === "timed") {
		registerTimedAskUser(ctx, config.timeout);
		return;
	}
	ctx.tools.register(defineTool({
		name: "ask_user_question",
		description,
		parameters: { questions: {
			type: "array",
			required: true,
			description: "Questions to ask the user before continuing.",
			items: {
				type: "object",
				additionalProperties: true,
				properties: {
					id: {
						type: "string",
						required: true,
						description: "Stable id for this question; echoed in the answer."
					},
					question: {
						type: "string",
						required: true,
						description: "The specific question to ask the user."
					},
					header: {
						type: "string",
						description: "Optional short heading for the question, such as \"Confirm\" or \"Choose Mode\"."
					},
					options: {
						type: "array",
						description: "Optional choices to show the user. If you recommend one, put it first and append \"(Recommended)\" to that label.",
						items: {
							type: "object",
							additionalProperties: true,
							properties: {
								label: {
									type: "string",
									required: true,
									description: "Short user-facing option label."
								},
								description: {
									type: "string",
									description: "One sentence explaining the tradeoff or impact."
								}
							}
						}
					},
					multi_select: {
						type: "boolean",
						description: "Whether the user may select more than one option. Defaults to false."
					}
				}
			}
		} },
		output: {
			schema: {
				type: "object",
				additionalProperties: false,
				properties: { answers: {
					type: "array",
					required: true,
					items: {
						type: "object",
						additionalProperties: false,
						properties: {
							id: {
								type: "string",
								required: true
							},
							selected: {
								type: "array",
								required: true,
								items: { type: "string" }
							},
							custom: { type: "string" }
						}
					}
				} }
			},
			render: (_args, value) => [{
				type: "text",
				text: JSON.stringify(value)
			}]
		},
		async execute(args, exec) {
			return { answers: (await ctx.userQuestions.ask({
				questions: args.questions.map((question) => ({
					id: question.id,
					question: question.question,
					...question.header !== void 0 ? { header: question.header } : {},
					...question.options !== void 0 ? { options: question.options } : {},
					...question.multi_select !== void 0 ? { multiSelect: question.multi_select } : {}
				})),
				...exec.agent !== void 0 ? { agent: exec.agent } : {},
				signal: exec.signal
			})).answers.map((answer) => ({
				id: answer.id,
				selected: [...answer.selected],
				...answer.custom !== void 0 ? { custom: answer.custom } : {}
			})) };
		}
	}));
}
//#endregion
export { Config, apply, inject, name };
