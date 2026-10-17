import z from "@deepseek-ai/schemastery";
import { assertNever } from "@deepseek-ai/dsh-util-values";
import { SessionTitleProviderId, normalizeSessionTitle } from "@deepseek-ai/dsh-session-title";
import { SessionTitleLlmConfigFields, executeSessionTitleLlm, resolveSessionTitleLlmConfig } from "@deepseek-ai/dsh-session-title-llm";
//#region lib/types/index.js
/** All-human-messages model provider for `ctx.sessionTitle`. */
const name = "session-title-all-prompts-llm";
const inject = [
	"sessionTitle",
	"llm",
	"sessions"
];
/** Loader schema for this provider's required execution controls and title-length targets. */
const Config = z.object({
	targetWords: z.number().step(1).min(1).required(),
	targetCjkCharacters: z.number().step(1).min(1).required(),
	maxInputBytes: SessionTitleLlmConfigFields.maxInputBytes,
	maxOutputTokens: SessionTitleLlmConfigFields.maxOutputTokens,
	timeoutMs: SessionTitleLlmConfigFields.timeoutMs,
	provider: SessionTitleLlmConfigFields.provider,
	model: SessionTitleLlmConfigFields.model
});
/** Validate one positive title-length target. */
function assertTarget(name, value) {
	if (!Number.isInteger(value) || value <= 0) throw new Error(`session-title-all-prompts-llm: ${name} must be a positive integer`);
	return value;
}
/**
* Validate the shared execution controls and this provider's title-length targets.
* @param config - untrusted plugin configuration.
* @returns immutable provider policy.
*/
function resolveConfig(config) {
	const { targetWords, targetCjkCharacters, ...execution } = config;
	return {
		...resolveSessionTitleLlmConfig(execution),
		targetWords: assertTarget("targetWords", targetWords),
		targetCjkCharacters: assertTarget("targetCjkCharacters", targetCjkCharacters)
	};
}
/** Select the route's least supported reasoning effort for a title call. */
const selectReasoningEffort = (model) => model.reasoning?.efforts[0]?.id;
/** Language-aware system instruction, with stability rules when a provider title is anchored. */
function systemPrompt(config, hasCurrentTitle) {
	return [
		"Create a concise title for an AI coding-assistant session from the supplied human messages.",
		"Return only the title on one line, **in plain text of natural language**, with no quotes, prefix, explanation, Markdown, XML, or terminal control codes. No code is allowed.",
		"Use the language of the messages.",
		`Aim for about ${config.targetWords} words in non-CJK languages or ${config.targetCjkCharacters} CJK characters.`,
		"If the messages give little to name, still return a short best-effort title, such as Greeting, instead of explaining.",
		...hasCurrentTitle ? [
			"An existing title is supplied as currentTitle. If it still accurately describes the main topic or task, return it exactly unchanged.",
			"Follow-up questions, additional details within the same topic, acknowledgements such as \"thanks\", and requests to continue do not by themselves justify a title change.",
			"Do not reword, polish, shorten, or replace synonyms in an adequate title. Keeping its exact wording takes priority over the target length.",
			"Change the title only when the messages materially change or expand the main topic or task so that the existing title is no longer accurate."
		] : []
	].join("\n");
}
/** Frame messages as JSON so user text cannot break structural delimiters. */
function frameMessages(messages, currentTitle) {
	if (currentTitle !== void 0) return `Update the session title from this JSON object:\n${JSON.stringify({
		currentTitle,
		messages
	})}`;
	return `Generate the session title from this JSON array of human messages:\n${JSON.stringify(messages)}`;
}
/** Asterisk emphasis wrapping a whole line, such as `**Title**`. */
const EMPHASIS_WRAPPER = /^(?<marker>\*{1,3})(?<inner>\S(?:.*\S)?)\k<marker>$/u;
/**
* Take the title from model output: the first non-empty line, without
* asterisk emphasis that wraps that whole line. Models that disregard the
* one-line instruction put the title first and commentary after it. A line
* that is entirely `*` emphasis loses the marker pair even when the model
* meant it literally; the inner-marker check keeps emphasis inside a longer
* line, and the system instruction forbids Markdown.
*/
function titleFromOutput(text) {
	const line = text.split(/\r?\n/u).map((item) => item.trim()).find((item) => item.length > 0) ?? "";
	const groups = EMPHASIS_WRAPPER.exec(line)?.groups;
	const marker = groups?.["marker"];
	const inner = groups?.["inner"];
	return marker === void 0 || inner === void 0 || inner.includes(marker) ? line : inner;
}
/** Reject terminal tool-call or max-token outcomes and derive one non-empty title from the text blocks. */
function titleFromResponse(response) {
	switch (response.finish.kind) {
		case "stop": break;
		case "tool-calls": throw new Error("session-title-llm: title output must contain text only");
		case "max-tokens": throw new Error("session-title-llm: title output reached maxOutputTokens");
		/* v8 ignore next -- closed SessionTitleLlmFinish union exhaustiveness guard */
		default: return assertNever(response.finish, "SessionTitleLlmFinish");
	}
	if (response.blocks.some((block) => block.type === "tool-call")) throw new Error("session-title-llm: title output must contain text only");
	const title = normalizeSessionTitle(titleFromOutput(response.blocks.filter((block) => block.type === "text").map((block) => block.text).join(" ")), Number.MAX_SAFE_INTEGER);
	if (title.length === 0) throw new Error("session-title-llm: title model produced no text");
	return title;
}
/**
* Register the all-prompts model provider.
* @param ctx - context exposing session-title, LLM, and session services.
* @param config - required route, target, byte, token, and timeout policy.
*/
function apply(ctx, config) {
	const resolved = resolveConfig(config);
	const titleProvider = SessionTitleProviderId(name);
	ctx.sessionTitle.register({
		id: titleProvider,
		automatic: "all-prompts",
		async generate(request) {
			const messageSeqs = request.messages.map((message) => message.seq);
			const anchor = request.currentTitle?.source.kind === "provider" ? request.currentTitle.title : void 0;
			const response = await executeSessionTitleLlm(ctx, resolved, request, titleProvider, {
				system: systemPrompt(resolved, anchor !== void 0),
				input: frameMessages(request.messages, anchor),
				messageSeqs,
				selectReasoningEffort
			});
			return {
				title: titleFromResponse(response),
				messageSeqs,
				model: response.model
			};
		}
	});
}
//#endregion
export { Config, apply, inject, name };
