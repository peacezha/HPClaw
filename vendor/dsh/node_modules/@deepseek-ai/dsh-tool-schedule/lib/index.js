import { delegationDepthOf } from "@deepseek-ai/dsh-subagent";
import { defineTool } from "@deepseek-ai/dsh-tools";
import { MAX_TITLE_LENGTH, MIN_EVERY_INTERVAL_SECONDS, REQUIRED_TITLE_MESSAGE, ScheduleId, ScheduleInputError, scheduleView } from "@deepseek-ai/dsh-schedule";
//#region lib/types/index.js
/**
* Model-facing `schedule_create`, `schedule_list`, `schedule_update`, and
* `schedule_delete` tools over the Host `ctx.schedule` service. Mounting the
* plugin registers them in the mounting scope, so a preset decides which
* agents receive them; every call acts on the calling Agent's Session.
* @module @deepseek-ai/dsh-tool-schedule
*/
/** Plugin name registered with the Loader. */
const name = "tool-schedule";
/** Host services this plugin consumes. The Schedule service is resolved per
* scope, so a preset that declares this plugin stays inert while the shipped
* composition keeps that service off. */
const inject = ["tools"];
const SHARED_VIEW_PROPERTIES = {
	id: {
		type: "string",
		required: true
	},
	title: {
		type: "string",
		required: true
	},
	prompt: {
		type: "string",
		required: true
	},
	scheduledAt: {
		type: "string",
		required: true
	},
	state: {
		type: "string",
		required: true,
		enum: ["scheduled", "overdue"]
	},
	deliveryMode: {
		type: "string",
		required: true,
		const: "host"
	}
};
const VIEW_SCHEMA = { oneOf: [
	{
		type: "object",
		additionalProperties: false,
		properties: {
			...SHARED_VIEW_PROPERTIES,
			kind: {
				type: "string",
				required: true,
				const: "after"
			},
			afterSeconds: {
				type: "integer",
				required: true
			}
		}
	},
	{
		type: "object",
		additionalProperties: false,
		properties: {
			...SHARED_VIEW_PROPERTIES,
			kind: {
				type: "string",
				required: true,
				const: "at"
			}
		}
	},
	{
		type: "object",
		additionalProperties: false,
		properties: {
			...SHARED_VIEW_PROPERTIES,
			kind: {
				type: "string",
				required: true,
				const: "every"
			},
			everySeconds: {
				type: "integer",
				required: true
			}
		}
	},
	{
		type: "object",
		additionalProperties: false,
		properties: {
			...SHARED_VIEW_PROPERTIES,
			kind: {
				type: "string",
				required: true,
				const: "daily"
			},
			time: {
				type: "string",
				required: true
			},
			timeZone: {
				type: "string",
				required: true
			}
		}
	},
	{
		type: "object",
		additionalProperties: false,
		properties: {
			...SHARED_VIEW_PROPERTIES,
			kind: {
				type: "string",
				required: true,
				const: "weekly"
			},
			time: {
				type: "string",
				required: true
			},
			timeZone: {
				type: "string",
				required: true
			},
			weekdays: {
				type: "array",
				required: true,
				items: { type: "integer" }
			}
		}
	},
	{
		type: "object",
		additionalProperties: false,
		properties: {
			...SHARED_VIEW_PROPERTIES,
			kind: {
				type: "string",
				required: true,
				const: "cron"
			},
			expression: {
				type: "string",
				required: true
			},
			timeZone: {
				type: "string",
				required: true
			}
		}
	}
] };
/** Build one exact two-field error schema while preserving its literal code. */
function basicErrorSchema(code) {
	return {
		type: "object",
		additionalProperties: false,
		properties: {
			code: {
				type: "string",
				required: true,
				const: code
			},
			message: {
				type: "string",
				required: true
			}
		}
	};
}
const ERROR_SCHEMAS = [
	basicErrorSchema("invalid_prompt"),
	basicErrorSchema("invalid_selector"),
	basicErrorSchema("invalid_rule"),
	basicErrorSchema("invalid_time_zone"),
	basicErrorSchema("not_future"),
	basicErrorSchema("time_out_of_range"),
	basicErrorSchema("frequency_too_high"),
	basicErrorSchema("subagent_session"),
	basicErrorSchema("internal_error")
];
const CREATE_OUTPUT_SCHEMA = { oneOf: [VIEW_SCHEMA, ...ERROR_SCHEMAS] };
const LIST_OUTPUT_SCHEMA = { oneOf: [{
	type: "array",
	items: VIEW_SCHEMA
}, ...ERROR_SCHEMAS] };
const DELETE_OUTPUT_SCHEMA = { oneOf: [
	{
		type: "object",
		additionalProperties: false,
		properties: {
			id: {
				type: "string",
				required: true
			},
			deleted: {
				type: "boolean",
				required: true,
				const: true
			}
		}
	},
	{
		type: "object",
		additionalProperties: false,
		properties: {
			id: {
				type: "string",
				required: true
			},
			deleted: {
				type: "boolean",
				required: true,
				const: false
			},
			code: {
				type: "string",
				required: true,
				const: "schedule_not_found"
			}
		}
	},
	...ERROR_SCHEMAS
] };
const UPDATE_OUTPUT_SCHEMA = { oneOf: [
	VIEW_SCHEMA,
	{
		type: "object",
		additionalProperties: false,
		properties: {
			id: {
				type: "string",
				required: true
			},
			updated: {
				type: "boolean",
				required: true,
				const: false
			},
			code: {
				type: "string",
				required: true,
				enum: [
					"schedule_not_found",
					"schedule_ended",
					"schedule_conflict"
				]
			}
		}
	},
	...ERROR_SCHEMAS
] };
const CREATE_DESCRIPTION = "Create a reminder in the current session that delivers prompt when it becomes due. Supply exactly one timing parameter: after_seconds, at, every_seconds, daily, weekly, or cron. Local times that do not exist in the zone are skipped; repeated local times fire once, at the earlier instant. After downtime, a recurring reminder delivers only its latest missed occurrence. Delivery can repeat after a crash.";
const LIST_DESCRIPTION = "List the active reminders in the current session.";
const DELETE_DESCRIPTION = "Delete a reminder in the current session, active or inactive. Deletion does not retract a reminder message that is already queued.";
const UPDATE_DESCRIPTION = "Change a reminder in place, keeping its id. Supply a new title, prompt, or at most one timing parameter; omitted fields keep their stored values. To change a relative delay, create a new reminder.";
const CREATE_TITLE_DESCRIPTION = `Concise task name in the user's language, at most ${MAX_TITLE_LENGTH} characters. Name only the core action and subject; keep essential target identifiers such as PR numbers and branch names. Do not include execution frequency (e.g. daily, hourly), scheduled dates/times, time zones, task status, or configuration and execution details (e.g. read-only mode, profile-tag filters), even when embedded in the requested or existing title. Do not append parenthetical notes. Put scheduling information in the timing parameters and execution instructions in prompt.`;
/** Deterministic model content for every canonical Schedule value. */
function renderValue(_args, value) {
	return [{
		type: "text",
		text: JSON.stringify(value)
	}];
}
/** Pure generic pending card. */
function present(title, kind, rawInput) {
	return {
		card: "generic",
		title,
		kind,
		...rawInput === void 0 ? {} : { rawInput }
	};
}
/** Stable error for failures not safe to expose. */
function internalError() {
	return {
		code: "internal_error",
		message: "The schedule operation failed."
	};
}
/** Translate invalid input while withholding internal storage failures. */
function operationError(error) {
	return error instanceof ScheduleInputError ? {
		code: error.code,
		message: error.message
	} : internalError();
}
/**
* Refuse a caller that is a delegated child. A subagent cannot use reminders at
* all, so every tool rejects before dispatch instead of relying on the mounting
* preset's tool filter alone.
* @param agent - the calling agent, when the outer call has one.
* @returns the stable refusal, or undefined for a top-level caller.
*/
function subagentCallerRefusal(agent) {
	if (agent === void 0 || delegationDepthOf(agent) === 0) return void 0;
	return {
		code: "subagent_session",
		message: "A delegated subagent cannot use reminders."
	};
}
/** One supplied fixed-rate interval: a safe integer at or above the Host floor, or undefined. */
function invalidInterval(everySeconds) {
	if (everySeconds === void 0) return void 0;
	if (!Number.isSafeInteger(everySeconds)) return {
		code: "invalid_rule",
		message: "every_seconds must be a safe integer."
	};
	if (everySeconds < MIN_EVERY_INTERVAL_SECONDS) return {
		code: "frequency_too_high",
		message: `every_seconds must be at least ${MIN_EVERY_INTERVAL_SECONDS}.`
	};
}
/** Validate selector constraints that the open parameter root cannot express. */
function validateCreateArgs(args) {
	if (Object.keys(args).some((key) => key !== "prompt" && key !== "title" && key !== "after_seconds" && key !== "at" && key !== "every_seconds" && key !== "daily" && key !== "weekly" && key !== "cron") || Number(args.after_seconds !== void 0) + Number(args.at !== void 0) + Number(args.every_seconds !== void 0) + Number(args.daily !== void 0) + Number(args.weekly !== void 0) + Number(args.cron !== void 0) !== 1) return {
		code: "invalid_selector",
		message: "schedule_create accepts exactly one of after_seconds, at, every_seconds, daily, weekly, or cron."
	};
	if (args.prompt.trim().length === 0) return {
		code: "invalid_prompt",
		message: "prompt must be non-empty after trimming."
	};
	if (args.title.trim().length === 0) return {
		code: "invalid_prompt",
		message: REQUIRED_TITLE_MESSAGE
	};
	if (args.title.trim().length > MAX_TITLE_LENGTH) return {
		code: "invalid_prompt",
		message: `title must be at most ${MAX_TITLE_LENGTH} characters.`
	};
	if (args.after_seconds !== void 0 && (!Number.isSafeInteger(args.after_seconds) || args.after_seconds <= 0)) return {
		code: "invalid_rule",
		message: "after_seconds must be a positive safe integer."
	};
	return invalidInterval(args.every_seconds);
}
/** Validate the in-place update's selector count, id, and any supplied name, instruction, or interval. */
function validateUpdateArgs(args) {
	const selectors = [
		args.at !== void 0,
		args.every_seconds !== void 0,
		args.daily !== void 0,
		args.weekly !== void 0,
		args.cron !== void 0
	].filter(Boolean).length;
	if (Object.keys(args).some((key) => key !== "id" && key !== "title" && key !== "prompt" && key !== "at" && key !== "every_seconds" && key !== "daily" && key !== "weekly" && key !== "cron") || selectors > 1) return {
		code: "invalid_selector",
		message: "schedule_update accepts at most one of at, every_seconds, daily, weekly, or cron."
	};
	if (args.id.length === 0 || args.id.trim() !== args.id) return {
		code: "invalid_rule",
		message: "schedule_update id must be non-empty without surrounding whitespace."
	};
	if (selectors === 0 && args.title === void 0 && args.prompt === void 0) return {
		code: "invalid_selector",
		message: "schedule_update needs a new title, prompt, or one of at, every_seconds, daily, weekly, or cron."
	};
	if (args.title !== void 0 && args.title.trim().length === 0) return {
		code: "invalid_prompt",
		message: REQUIRED_TITLE_MESSAGE
	};
	if (args.title !== void 0 && args.title.trim().length > MAX_TITLE_LENGTH) return {
		code: "invalid_prompt",
		message: `title must be at most ${MAX_TITLE_LENGTH} characters.`
	};
	if (args.prompt !== void 0 && args.prompt.trim().length === 0) return {
		code: "invalid_prompt",
		message: "prompt must be non-empty after trimming."
	};
	return invalidInterval(args.every_seconds);
}
/** The one timing replacement the update carries, or undefined when the request keeps the committed target. */
function timingChangeFrom(args) {
	if (args.at !== void 0) return {
		kind: "at",
		at: args.at
	};
	if (args.every_seconds !== void 0) return {
		kind: "every",
		every_seconds: args.every_seconds
	};
	if (args.daily !== void 0) return {
		kind: "daily",
		daily: args.daily
	};
	if (args.weekly !== void 0) return {
		kind: "weekly",
		weekly: args.weekly
	};
	if (args.cron !== void 0) return {
		kind: "cron",
		cron: args.cron
	};
}
/**
* Selector parameters shared by `schedule_create` and `schedule_update`, in the order the
* generated tool catalog states them.
*/
const SELECTOR_PARAMETERS = {
	every_seconds: {
		type: "number",
		description: `Fixed-rate interval in whole seconds, at least ${MIN_EVERY_INTERVAL_SECONDS}, aligned to the creation time; changing it with schedule_update re-aligns it to the save time.`
	},
	daily: {
		type: "object",
		additionalProperties: false,
		description: "Every day at a local time.",
		properties: {
			time: {
				type: "string",
				required: true,
				description: "HH:mm:ss with optional 1-3 fractional digits, for example 23:00:00."
			},
			time_zone: {
				type: "string",
				required: true,
				description: "UTC or IANA Area/Location, for example Asia/Shanghai."
			}
		}
	},
	weekly: {
		type: "object",
		additionalProperties: false,
		description: "On the given weekdays at a local time.",
		properties: {
			time: {
				type: "string",
				required: true,
				description: "HH:mm:ss with optional 1-3 fractional digits, for example 09:00:00."
			},
			time_zone: {
				type: "string",
				required: true,
				description: "UTC or IANA Area/Location, for example Asia/Shanghai."
			},
			weekdays: {
				type: "array",
				required: true,
				description: "ISO weekdays, Monday 1 through Sunday 7, without repetitions.",
				items: { type: "integer" }
			}
		}
	},
	cron: {
		type: "object",
		additionalProperties: false,
		description: "Five-field Vixie cron expression in a time zone.",
		properties: {
			expression: {
				type: "string",
				required: true,
				description: "minute hour day-of-month month day-of-week, for example \"*/15 9-17 * * 1-5\". When both day fields are restricted, a date matches if either one matches."
			},
			time_zone: {
				type: "string",
				required: true,
				description: "UTC or IANA Area/Location, for example Asia/Shanghai."
			}
		}
	},
	at: {
		description: "Absolute target: an RFC 3339 date-time with offset, or a local date, time, and IANA time_zone.",
		oneOf: [{ type: "string" }, {
			type: "object",
			additionalProperties: false,
			properties: {
				date: {
					type: "string",
					required: true
				},
				time: {
					type: "string",
					required: true
				},
				time_zone: {
					type: "string",
					required: true
				}
			}
		}]
	}
};
/**
* Register the four Schedule tools in the mounting scope.
*
* Each call mutates the Session of the Agent that dispatched it, so a mount
* outside an agent scope still registers the tools but every call without a
* caller Agent is refused as an internal failure.
* @param ctx - Context owning the `tools` registry and the Host `schedule` service.
*/
function apply(ctx) {
	ctx.inject(["schedule"], (scheduleCtx) => {
		registerScheduleTools(scheduleCtx);
	});
}
/**
* Register the four reminder tools in the scope that resolved the Schedule
* service.
* @param ctx - Scope whose `schedule` service the tools act through.
*/
function registerScheduleTools(ctx) {
	ctx.tools.register(defineTool({
		name: "schedule_create",
		description: CREATE_DESCRIPTION,
		parameters: {
			prompt: {
				type: "string",
				required: true,
				description: "Reminder content to present when the target becomes due."
			},
			title: {
				type: "string",
				required: true,
				description: CREATE_TITLE_DESCRIPTION
			},
			after_seconds: {
				type: "number",
				description: "Delay in whole seconds."
			},
			...SELECTOR_PARAMETERS
		},
		output: {
			schema: CREATE_OUTPUT_SCHEMA,
			render: renderValue
		},
		async execute(args, exec) {
			const agent = exec.agent;
			if (agent === void 0) return internalError();
			const refusal = subagentCallerRefusal(agent);
			if (refusal !== void 0) return refusal;
			const invalid = validateCreateArgs(args);
			if (invalid !== void 0) return invalid;
			if (exec.signal.aborted) return internalError();
			try {
				return scheduleView(await ctx.schedule.create(agent.session.id, args, exec.signal), Date.now());
			} catch (error) {
				return operationError(error);
			}
		},
		presentCall: (args) => present("Create reminder", "other", args.prompt)
	}));
	ctx.tools.register(defineTool({
		name: "schedule_list",
		description: LIST_DESCRIPTION,
		parameters: {},
		output: {
			schema: LIST_OUTPUT_SCHEMA,
			render: renderValue
		},
		async execute(_args, exec) {
			const agent = exec.agent;
			if (agent === void 0) return internalError();
			const refusal = subagentCallerRefusal(agent);
			if (refusal !== void 0) return refusal;
			if (exec.signal.aborted) return internalError();
			try {
				return (await ctx.schedule.list({ sessionId: agent.session.id })).map((record) => scheduleView(record, Date.now()));
			} catch (error) {
				return operationError(error);
			}
		},
		presentCall: () => present("List reminders", "read")
	}));
	ctx.tools.register(defineTool({
		name: "schedule_delete",
		description: DELETE_DESCRIPTION,
		parameters: { id: {
			type: "string",
			required: true,
			description: "Exact schedule id."
		} },
		output: {
			schema: DELETE_OUTPUT_SCHEMA,
			render: renderValue
		},
		async execute(args, exec) {
			if (args.id.length === 0 || args.id.trim() !== args.id) return {
				code: "invalid_rule",
				message: "schedule_delete id must be non-empty without surrounding whitespace."
			};
			const id = ScheduleId(args.id);
			const agent = exec.agent;
			if (agent === void 0) return internalError();
			const refusal = subagentCallerRefusal(agent);
			if (refusal !== void 0) return refusal;
			if (exec.signal.aborted) return internalError();
			try {
				return await ctx.schedule.delete({
					sessionId: agent.session.id,
					id
				}, exec.signal);
			} catch (error) {
				return operationError(error);
			}
		},
		presentCall: (args) => present("Delete reminder", "other", args.id)
	}));
	ctx.tools.register(defineTool({
		name: "schedule_update",
		description: UPDATE_DESCRIPTION,
		parameters: {
			id: {
				type: "string",
				required: true,
				description: "Schedule id returned by schedule_list."
			},
			title: {
				type: "string",
				description: "New task name; follow the schedule_create title rules."
			},
			prompt: {
				type: "string",
				description: "New reminder content."
			},
			...SELECTOR_PARAMETERS
		},
		output: {
			schema: UPDATE_OUTPUT_SCHEMA,
			render: renderValue
		},
		async execute(args, exec) {
			const agent = exec.agent;
			if (agent === void 0) return internalError();
			const refusal = subagentCallerRefusal(agent);
			if (refusal !== void 0) return refusal;
			const invalid = validateUpdateArgs(args);
			if (invalid !== void 0) return invalid;
			if (exec.signal.aborted) return internalError();
			const id = ScheduleId(args.id);
			try {
				const sessionId = agent.session.id;
				const expected = (await ctx.schedule.list({ sessionId })).find((record) => record.id === id);
				if (expected === void 0) return {
					id,
					updated: false,
					code: (await ctx.schedule.catalog()).some((entry) => entry.sessionId === sessionId && entry.id === id) ? "schedule_ended" : "schedule_not_found"
				};
				const change = timingChangeFrom(args);
				const result = await ctx.schedule.update({
					sessionId,
					id,
					expected,
					...change === void 0 ? {} : { change },
					...args.title === void 0 ? {} : { title: args.title },
					...args.prompt === void 0 ? {} : { prompt: args.prompt }
				}, exec.signal);
				return "record" in result ? scheduleView(result.record, Date.now()) : result;
			} catch (error) {
				return operationError(error);
			}
		},
		presentCall: (args) => present("Update reminder", "other", args.id)
	}));
}
//#endregion
export { apply, inject, name };
