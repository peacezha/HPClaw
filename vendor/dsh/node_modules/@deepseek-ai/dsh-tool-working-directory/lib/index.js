import { defineTool } from "@deepseek-ai/dsh-tools";
//#region lib/types/index.js
/**
* Read or change the calling Session's working directory.
* @module @deepseek-ai/dsh-tool-working-directory
*/
/** Cordis plugin name. */
const name = "tool-working-directory";
/** Services used by the tool. */
const inject = ["tools", "workingDirectory"];
/**
* Register the working-directory tool for this composition.
* @param ctx - context providing the tool registry and directory owner.
*/
function apply(ctx) {
	ctx.tools.register(defineTool({
		name: "working_directory",
		description: "Read the current working directory, or change it with cd. Relative paths use the current directory. Existing shells and running processes keep their own directories.",
		parameters: { cd: {
			type: "string",
			description: "Existing directory to enter. Omit to read the current directory."
		} },
		output: {
			schema: {
				type: "object",
				additionalProperties: false,
				properties: { cwd: {
					type: "string",
					required: true,
					description: "Current absolute working directory."
				} }
			},
			render: (_args, value) => [{
				type: "text",
				text: value.cwd
			}]
		},
		async execute(args, exec) {
			if (exec.agent === void 0) throw new Error("working_directory requires an agent Session");
			return { cwd: args.cd === void 0 ? await ctx.workingDirectory.ensure(exec.agent, exec.signal) : await ctx.workingDirectory.set(exec.agent, args.cd, exec.signal) };
		}
	}));
}
//#endregion
export { apply, inject, name };
