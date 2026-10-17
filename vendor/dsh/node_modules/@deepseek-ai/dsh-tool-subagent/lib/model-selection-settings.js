import { Service } from "@deepseek-ai/cordis";
import z from "@deepseek-ai/schemastery";
import "@deepseek-ai/dsh-llm";
//#region lib/types/model-selection.js
/** Schema shared by the Host setting and its deployment base. */
const AllowedModelRouteSchema = z.object({
	provider: z.string().min(1).required(),
	model: z.string().min(1).required()
});
/**
* Stable identity for one provider/model pair.
* @param route - Exact provider/model route.
* @returns Opaque key for equality checks.
*/
function modelRouteKey(route) {
	return `${route.provider}\0${route.model}`;
}
/**
* Reject malformed or duplicate route policy entries at a durable or configuration boundary.
* @param routes - Candidate exact routes to validate.
* @returns an assertion that the candidate is a validated exact-route array.
*/
function assertAllowedModelRoutes(routes) {
	if (!Array.isArray(routes)) throw new Error("subagent model selection requires an array of routes");
	const seen = /* @__PURE__ */ new Set();
	const candidates = routes;
	for (const candidate of candidates) {
		if (typeof candidate !== "object" || candidate === null || Array.isArray(candidate) || !("provider" in candidate) || typeof candidate.provider !== "string" || !("model" in candidate) || typeof candidate.model !== "string" || candidate.provider.length === 0 || candidate.model.length === 0) throw new Error("subagent model selection requires non-empty provider and model ids");
		const route = {
			provider: candidate.provider,
			model: candidate.model
		};
		const key = modelRouteKey(route);
		if (seen.has(key)) throw new Error(`subagent model selection repeats route "${route.provider}/${route.model}"`);
		seen.add(key);
	}
}
//#endregion
//#region lib/types/model-selection-settings.js
/** Singleton settings owner read when delegation tools are composed for a Session. */
var SubagentModelSelectionConfig = class extends Service {
	config;
	static Config = z.object({
		enabled: z.boolean().default(false).volatile(),
		allowedModels: z.array(AllowedModelRouteSchema).default([]).volatile()
	});
	constructor(ctx, config) {
		super(ctx, "subagentModelSelection");
		this.config = config;
	}
	/**
	* Read a detached selection preference for the next eligible Session composition.
	* @returns the enabled state and exact allowed routes.
	*/
	current() {
		const enabled = this.config.enabled.get();
		const allowedModels = this.config.allowedModels.get();
		assertAllowedModelRoutes(allowedModels);
		if (enabled && allowedModels.length === 0) throw new Error("enabled subagent model selection requires at least one allowed model");
		return {
			enabled,
			allowedModels: allowedModels.map((route) => ({ ...route }))
		};
	}
};
const name = "subagent-model-selection-settings";
//#endregion
export { SubagentModelSelectionConfig, SubagentModelSelectionConfig as default, name };
