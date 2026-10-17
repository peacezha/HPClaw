import { Service } from "@deepseek-ai/cordis";
import { LlmError } from "@deepseek-ai/dsh-llm";
//#region lib/types/account-tasks.js
/**
* Identify running work whose latest bound request used the account route.
* @param agent - live Agent with its durable request context.
* @returns whether account sign-out should interrupt this task.
*/
function isRunningAccountTask(agent) {
	return agent.status === "running" && agent.session.requestContext()?.provider === "deepseek-account";
}
/**
* Cancel signed-out account tasks and publish sign-in guidance for rejected requests.
* @param ctx - account provider lifetime; Agents may attach later.
*/
function installAccountTaskCancellation(ctx) {
	ctx.inject(["agents"], (scope) => {
		scope.on("agent/error", ({ error }) => {
			if (error instanceof LlmError && error.code === "ACCOUNT_SIGN_IN_REQUIRED") scope.emit("deepseek-account/model-sign-in-required");
		});
		scope.on("deepseek-account/signed-out", () => {
			for (const agent of scope.agents.list()) if (isRunningAccountTask(agent)) agent.cancel({
				kind: "hook",
				reason: "deepseek-account/signed-out"
			}, { keepInbox: true });
		});
	});
}
//#endregion
//#region lib/types/index.js
/** Account Service Definition shared by platform, API, and model consumers. */
/** Account operations; only Host consumers can obtain a request credential. */
var DeepSeekAccount = class extends Service {
	/** @param ctx - context owning this account implementation. */
	constructor(ctx) {
		super(ctx, "deepseekAccount");
	}
};
/** Merge Cookie header pairs by case-sensitive name, retaining unrelated cookies.
* @param base - existing request cookies.
* @param override - deployment cookies whose values take precedence.
* @returns one Cookie header with at most one pair per name.
*/
function mergePlatformCookies(base, override) {
	const cookies = /* @__PURE__ */ new Map();
	for (const header of [base, override]) for (const pair of header.split(";")) {
		const separator = pair.indexOf("=");
		if (separator < 1) continue;
		cookies.set(pair.slice(0, separator).trim(), pair.slice(separator + 1).trim());
	}
	return [...cookies].map(([name, value]) => `${name}=${value}`).join("; ");
}
/**
* Identify native desktop API requests; null leaves non-desktop requests unchanged.
* @param platform - Operating system supplied by the desktop composition.
* @returns Platform request headers shared by account and update-policy clients.
*/
function desktopClientHeaders(platform) {
	if (platform === null) return {};
	return { "x-client-platform": platform === "win32" ? "desktop-win" : "desktop-mac" };
}
/**
* Build the Platform client identity headers for one call.
* @param platform - Operating system supplied by the desktop composition; null identifies the client as web.
* @param client - identity of the requesting UI for this call.
* @returns the five client headers; the bundle ID is intentionally empty.
*/
function platformClientHeaders(platform, client) {
	return {
		"x-client-bundle-id": "",
		"x-client-platform": "web",
		...desktopClientHeaders(platform),
		"x-client-version": client.version,
		"x-client-locale": platformWireLocale(client.locale),
		"x-client-timezone-offset": String(client.timezoneOffsetSeconds)
	};
}
/**
* Reduce a caller's UI language to the region-tagged Platform locale.
* Shares one normalization with the header and with request body locale fields.
* @param locale - active UI language such as `zh-CN`, `zh_TW`, or `en-US`.
* @returns the region-tagged Platform locale for that language, `zh_CN` or `en_US`.
*/
function platformWireLocale(locale) {
	return locale.toLowerCase().split(/[-_]/)[0] === "zh" ? "zh_CN" : "en_US";
}
//#endregion
export { DeepSeekAccount, DeepSeekAccount as default, desktopClientHeaders, installAccountTaskCancellation, isRunningAccountTask, mergePlatformCookies, platformClientHeaders, platformWireLocale };
