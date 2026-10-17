import { brandString } from "@deepseek-ai/dsh-brand";
import { defineTool } from "@deepseek-ai/dsh-tools";
import { markAdjacentAgentSendMessageTool } from "@deepseek-ai/dsh-subagent/internal";
//#region lib/types/index.js
/**
* The globally named `send_message` and `interrupt_agent` tools: thin
* model-facing adapters over `ctx.subagents.sendMessage()` and
* `ctx.subagents.interrupt()`. They perform no lifecycle routing of their own —
* residency, cold resume, and interrupt authorization belong to the subagent
* service — and they live apart from the provider-bound
* `@deepseek-ai/dsh-tool-subagent` instances so multiple delegation tools share
* one control API.
* @module @deepseek-ai/dsh-tool-subagent-control
*/
const name = "tool-subagent-control";
const inject = ["tools", "subagents"];
/**
* Register the `send_message` and `interrupt_agent` tools.
* @param ctx - context carrying the tool registry and subagent service.
*/
function apply(ctx) {
	ctx.tools.register(markAdjacentAgentSendMessageTool(defineTool({
		name: "send_message",
		description: "Send a message to an agent. A working agent receives it at its next step; an idle agent starts a new turn with it. Returns delivery confirmation, not the agent's answer.",
		parameters: {
			agent_id: {
				type: "string",
				required: true,
				description: "The agent id of your direct continuable child, or your direct parent when you are a resident continuable child."
			},
			message: {
				type: "string",
				required: true,
				description: "The message to deliver to the agent."
			}
		},
		output: {
			schema: {
				type: "object",
				additionalProperties: false,
				properties: { messageId: {
					type: "string",
					required: true
				} }
			},
			render: (args, _value) => [{
				type: "text",
				text: `message delivered to agent ${args.agent_id}`
			}]
		},
		async execute(args, exec) {
			const sender = exec.agent;
			if (!sender) throw new Error("send_message requires a calling agent (exec.agent was undefined)");
			const message = [{
				type: "text",
				text: args.message
			}];
			return { messageId: await ctx.subagents.sendMessage(sender, brandString(args.agent_id), message, { signal: exec.signal }) };
		}
	})));
	ctx.tools.register(defineTool({
		name: "interrupt_agent",
		description: "Ask a subagent to stop its current work. This call returns without waiting for it to stop. You can continue a local direct child's conversation later with send_message. External executions stop permanently and cannot receive follow-ups. Subagents it started will keep running.",
		parameters: { agent_id: {
			type: "string",
			required: true,
			description: "The id of an agent created under you: your direct child or a deeper descendant."
		} },
		output: {
			schema: {
				type: "object",
				additionalProperties: false,
				properties: { accepted: {
					type: "boolean",
					required: true
				} }
			},
			render: (args, _value) => [{
				type: "text",
				text: `interrupt requested for agent ${args.agent_id}`
			}]
		},
		execute(args, exec) {
			const caller = exec.agent;
			if (!caller) throw new Error("interrupt_agent requires a calling agent (exec.agent was undefined)");
			ctx.subagents.interrupt(brandString(args.agent_id), {
				kind: "ancestor",
				agent: caller
			});
			return Promise.resolve({ accepted: true });
		}
	}));
}
//#endregion
export { apply, inject, name };
