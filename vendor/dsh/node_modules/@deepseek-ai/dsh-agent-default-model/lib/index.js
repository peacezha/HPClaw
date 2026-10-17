import { Service } from "@deepseek-ai/cordis";
import z from "@deepseek-ai/schemastery";
import { ReasoningEffortId } from "@deepseek-ai/dsh-llm";
//#region lib/types/index.js
/** Project stored settings onto the Agent-facing selection type. */
function selection(settings) {
	return {
		provider: settings.provider,
		model: settings.model,
		...settings.reasoningEffort === void 0 ? {} : { reasoningEffort: ReasoningEffortId(settings.reasoningEffort) }
	};
}
/**
* Owns the default model selection independently of any Host or transport.
* Each operation reads the owning Config references.
*/
var AgentDefaultModelConfig = class extends Service {
	ownerContext;
	config;
	saves = Promise.resolve();
	static Config = z.object({
		provider: z.string().required().volatile(),
		model: z.string().required().volatile(),
		reasoningEffort: z.string().volatile()
	});
	constructor(ownerContext, config) {
		super(ownerContext, "agentDefaultModel");
		this.ownerContext = ownerContext;
		this.config = config;
		ownerContext.inject(["settings"], (child) => {
			child.effect(() => child.settings.configure({ auto: false }, ownerContext.fiber));
		});
	}
	/**
	* Read the current default model selection.
	* @returns a detached provider, model, and optional reasoning selection.
	*/
	currentSelection() {
		const reasoningEffort = this.config.reasoningEffort.get();
		return selection({
			provider: this.config.provider.get(),
			model: this.config.model.get(),
			...reasoningEffort === void 0 ? {} : { reasoningEffort }
		});
	}
	/**
	* Save the complete default model selection. A deployment without a configuration
	* editor keeps its composition entry. Saves commit in submission order; a failed
	* save rejects its caller without blocking later saves.
	* @param next - resolved selection accepted by an entry point.
	* @returns fulfillment after the optional profile write settles.
	*/
	async saveSelection(next) {
		const entry = this.ownerContext.fiber.entry;
		if (entry === void 0) return;
		const editor = this.ctx.get("configEditor");
		if (editor === void 0) return;
		const config = {
			provider: next.provider,
			model: next.model,
			...next.reasoningEffort === void 0 ? {} : { reasoningEffort: String(next.reasoningEffort) }
		};
		const saved = this.saves.then(() => editor.edit(entry, () => config));
		this.saves = saved.catch(() => {});
		await saved;
	}
};
//#endregion
export { AgentDefaultModelConfig, AgentDefaultModelConfig as default };
