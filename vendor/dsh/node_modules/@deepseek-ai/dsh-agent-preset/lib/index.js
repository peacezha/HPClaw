import { Service } from "@deepseek-ai/cordis";
import { EntryGroup } from "@deepseek-ai/cordis-plugin-loader";
import z from "@deepseek-ai/schemastery";
//#region lib/types/index.js
/** A declarative preset row in an ordinary Cordis composition. */
/** Registers child plugin configuration without owning Agents using older revisions. */
var AgentPreset = class {
	ctx;
	config;
	static inject = ["agentPresets"];
	/** Preserve child expressions until their own plugins activate. */
	static [EntryGroup.key] = true;
	static Config = z.object({
		id: z.string().required(),
		name: z.string(),
		description: z.string(),
		order: z.number(),
		plugins: z.array(z.any()).required()
	});
	constructor(ctx, config) {
		this.ctx = ctx;
		this.config = config;
	}
	async *[Service.init]() {
		yield await this.ctx.agentPresets.register(this.config);
	}
};
//#endregion
export { AgentPreset as default };
