import { Service } from "@deepseek-ai/cordis";
import { NamedEntries, ScopedLayers, createScope, scopeOf } from "@deepseek-ai/dsh-scope";
import { defineTool } from "@deepseek-ai/dsh-tools";
//#region lib/types/render.js
/**
* Resource-result projection keeps binary payloads out of model history.
*
* @module @deepseek-ai/dsh-mcp-resources
*/
/**
* Render resource JSON while retaining raw binary data only for programmatic callers.
* @param server - configured server attribution.
* @param value - canonical resource result.
* @returns attributed text with binary payload descriptions.
*/
function renderResourceResult(server, value) {
	return [{
		type: "text",
		text: `MCP server: ${server}\n${JSON.stringify(value, (key, item) => {
			if (key === "blob" && typeof item === "string") return `[binary resource: ${item.length} base64 characters; available to programmatic callers]`;
			return item;
		})}`
	}];
}
//#endregion
//#region lib/types/tools.js
/**
* Three shared tools adapt model arguments to scoped resource operations.
*
* @module @deepseek-ai/dsh-mcp-resources
*/
const listParameters = {
	server: {
		type: "string",
		required: true,
		description: "Configured MCP server name."
	},
	cursor: {
		type: "string",
		description: "Continuation cursor returned by this server."
	}
};
const output = {
	schema: { type: "json" },
	render: (args, value) => renderResourceResult(args.server, value)
};
/**
* Register resource operations in the consumer's tool scope.
* @param ctx - context owning the tool registrations.
* @param request - caller-aware resource operation.
* @returns the effect disposer that removes all three tools synchronously.
*/
function registerResourceTools(ctx, request) {
	return ctx.effect(function* () {
		yield ctx.tools.register(defineTool({
			name: "list_mcp_resources",
			description: "List resources available from an MCP server.",
			parameters: listParameters,
			output,
			execute: (args, exec) => request(args.server, {
				method: "resources/list",
				...args.cursor === void 0 ? {} : { cursor: args.cursor }
			}, exec)
		}));
		yield ctx.tools.register(defineTool({
			name: "list_mcp_resource_templates",
			description: "List parameterized resource URI templates from an MCP server.",
			parameters: listParameters,
			output,
			execute: (args, exec) => request(args.server, {
				method: "resources/templates/list",
				...args.cursor === void 0 ? {} : { cursor: args.cursor }
			}, exec)
		}));
		yield ctx.tools.register(defineTool({
			name: "read_mcp_resource",
			description: "Read an MCP resource by URI from the named server. Use a listed URI or an expanded resource template.",
			parameters: {
				server: listParameters.server,
				uri: {
					type: "string",
					required: true,
					description: "Resource URI to read."
				}
			},
			output,
			execute: (args, exec) => request(args.server, {
				method: "resources/read",
				uri: args.uri
			}, exec)
		}));
	}, "mcpResources.resourceTools");
}
//#endregion
//#region lib/types/index.js
/**
* Scoped MCP resource providers and the shared model-facing resource tools.
*
* @module @deepseek-ai/dsh-mcp-resources
*/
var ResourceLayer = class {
	servers = new NamedEntries((name) => /* @__PURE__ */ new Error(`MCP resource server "${name}" is already registered in this scope`));
	disposeTools;
	isEmpty() {
		return this.servers.isEmpty();
	}
};
/** Scoped resource access plus three tools shared by configured MCP servers. */
var McpResourceRuntime = class extends Service {
	/** Tool registry required by the resource consumer. */
	static inject = ["tools"];
	layers = new ScopedLayers(() => new ResourceLayer(), () => void 0);
	/** Shared tool registrations outlive any one server's registering context. */
	selfCtx;
	constructor(ctx) {
		super(ctx, "mcpResources");
		this.selfCtx = ctx;
		ctx.inject(["systemPrompt"], (inner) => {
			inner.systemPrompt.section({
				name: "mcp-resource-servers",
				order: inner.systemPrompt.getSectionOrder("MCP_SERVERS"),
				interpolate: false,
				text: ({ scope }) => {
					const names = [...this.layers.merge(scope, (layer) => layer.servers).keys()].sort();
					return names.length === 0 ? "" : `## MCP resource servers

Use list_mcp_resources, list_mcp_resource_templates, or read_mcp_resource with one of these names as the server argument: ${JSON.stringify(names)}.`;
				}
			});
		});
	}
	/**
	* Register one server and expose resource tools while that scope has providers.
	* @param server - configured server name, unique in this scope.
	* @param provider - connection-owned resource operations.
	* @returns the effect disposer for this exact registration.
	*/
	register(server, provider) {
		const ctx = this.ctx;
		const scope = scopeOf(ctx);
		return ctx.effect(function* () {
			let disposal;
			yield () => disposal;
			yield this.layers.effect(ctx, (layer) => {
				const first = layer.servers.isEmpty();
				const remove = layer.servers.insert(server, provider);
				try {
					if (first) layer.disposeTools = this.registerTools(scope);
				} catch (error) {
					remove();
					throw error;
				}
				return () => {
					remove();
					if (layer.servers.isEmpty()) disposal = layer.disposeTools();
				};
			}, { label: `mcpResources.provider(${server})` });
		}.bind(this), `mcpResources.register(${server})`);
	}
	/** Own one scope's tools independently of its configured server plugins. */
	registerTools(scope) {
		const ctx = this.selfCtx;
		return ctx.effect(function* () {
			let toolCtx = ctx;
			if (scope !== void 0) {
				const owned = createScope(ctx, scope);
				yield owned.rawDispose;
				toolCtx = owned.ctx;
			}
			yield registerResourceTools(toolCtx, (server, request, exec) => this.request(server, request, exec));
		}.bind(this), "mcpResources.tools");
	}
	/** Resolve the caller-visible server before starting any network operation. */
	request(server, request, exec) {
		const provider = this.layers.merge(exec.agent, (layer) => layer.servers).get(server);
		if (!provider) throw new Error(`MCP resource server "${server}" is unavailable in this agent's scope`);
		return provider.request(request, exec);
	}
};
//#endregion
export { McpResourceRuntime, McpResourceRuntime as default };
