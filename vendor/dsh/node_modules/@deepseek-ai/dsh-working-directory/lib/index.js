import { isAbsolute } from "node:path";
import { Service } from "@deepseek-ai/cordis";
import z from "@deepseek-ai/schemastery";
import { z as z$1 } from "zod";
import { createUserMessage } from "@deepseek-ai/dsh-llm";
//#region lib/types/index.js
/**
* Session working directories, durable changes, and model context.
* @module @deepseek-ai/dsh-working-directory
*/
/** One owner for each Session's effective directory and its model-visible changes. */
var WorkingDirectoryService = class extends Service {
	static inject = [
		"fs",
		"sessionProjections",
		"systemPrompt"
	];
	static Config = z.object({ defaultDirectory: z.string() });
	/** Absolute deployment fallback for Sessions with no recorded original directory. */
	defaultDirectory;
	pending = /* @__PURE__ */ new WeakMap();
	operations = /* @__PURE__ */ new Set();
	lifecycle = new AbortController();
	constructor(ctx, config) {
		super(ctx, "workingDirectory");
		const directory = config.defaultDirectory ?? process.cwd();
		if (!isAbsolute(directory)) throw new Error("working-directory: defaultDirectory must be absolute");
		this.defaultDirectory = directory;
		const directorySchema = z$1.string().min(1).refine(isAbsolute).nullable();
		ctx.sessionProjections.register({
			key: "workingDirectory",
			stateVersion: 1,
			stateSchema: directorySchema,
			init: (header) => header.cwd ?? null,
			apply: (state, event) => event.type === "working-directory/change" ? event.data.cwd : state,
			wire: {
				viewSchema: directorySchema,
				view: (state) => state
			}
		});
		ctx.systemPrompt.context({
			name: "working-directory:current",
			order: ctx.systemPrompt.getContextOrder("WORKING_DIRECTORY"),
			required: true,
			interpolate: false,
			text: (context) => context.agent === void 0 ? "" : this.contextText(context.agent.session)
		});
		ctx.on("system-prompt/assemble", async (_assembly, context, next) => {
			if (context.agent === void 0) return next();
			await this.ensure(context.agent, context.signal);
			const assembly = await next();
			this.lifecycle.signal.throwIfAborted();
			const text = this.contextText(context.agent.session);
			const contribution = assembly.contexts.find((entry) => entry.name === "working-directory:current");
			if (contribution === void 0) assembly.contexts.unshift({
				name: "working-directory:current",
				text,
				interpolate: false
			});
			else {
				contribution.text = text;
				contribution.interpolate = false;
			}
			return assembly;
		}, { prepend: true });
		ctx.effect(() => async () => {
			this.lifecycle.abort(/* @__PURE__ */ new Error("working-directory service disposed"));
			await Promise.allSettled(this.operations);
		});
	}
	/**
	* Read the committed directory without filesystem I/O.
	* @param session - Session whose directory is requested.
	* @returns its effective absolute directory.
	*/
	get(session) {
		return this.ctx.sessionProjections.stateOf(session, "workingDirectory") ?? this.defaultDirectory;
	}
	/**
	* Validate the current directory and restore the original project when it disappeared.
	* @param agent - live or unpublished Agent owning the Session.
	* @param signal - cancellation for filesystem inspection.
	* @returns the existing directory; recovery is committed before fulfillment.
	* A notice failure is warned without reverting the committed state.
	* @throws when the original project is also unavailable.
	*/
	ensure(agent, signal) {
		return this.serialize(agent, signal, async (control) => {
			const current = this.get(agent.session);
			const target = await this.ctx.fs.resolve(current, { signal: control });
			const info = await this.ctx.fs.stat(target, control);
			control.throwIfAborted();
			agent.ctx.fiber.assertActive();
			if (info?.type === "directory") {
				if (this.ctx.sessionProjections.stateOf(agent.session, "workingDirectory") === null) agent.session.append("working-directory/change", { cwd: current });
				return current;
			}
			const original = agent.session.header.cwd ?? this.defaultDirectory;
			const restored = await this.directory(original, original, control);
			this.commit(agent, restored, true, control);
			return restored;
		});
	}
	/**
	* Change one Session's directory without changing existing processes or permissions.
	* @param agent - live or unpublished Agent owning the Session.
	* @param path - absolute path or a path relative to its current directory.
	* @param signal - cancellation before the durable change.
	* @returns the canonical absolute directory, committed before fulfillment.
	* A notice failure is warned; the next request still receives the committed directory.
	* @throws when the requested path is not an existing directory.
	*/
	set(agent, path, signal) {
		return this.serialize(agent, signal, async (control) => {
			if (path.length === 0) throw new Error("working-directory: cd must not be empty");
			const directory = await this.directory(path, this.get(agent.session), control);
			this.commit(agent, directory, false, control);
			return directory;
		});
	}
	contextText(session) {
		return `Current working directory: ${JSON.stringify(this.get(session))}.`;
	}
	async directory(path, cwd, signal) {
		const target = await this.ctx.fs.resolve(path, {
			cwd,
			signal
		});
		const info = await this.ctx.fs.stat(target, signal);
		signal.throwIfAborted();
		if (info?.type !== "directory") throw new Error(`working-directory: directory does not exist: ${JSON.stringify(path)}`);
		return this.ctx.fs.processPath(target);
	}
	commit(agent, directory, recovered, signal) {
		signal.throwIfAborted();
		agent.ctx.fiber.assertActive();
		const previous = this.get(agent.session);
		if (previous === directory) return;
		agent.session.append("working-directory/change", { cwd: directory });
		const notice = createUserMessage({
			content: [{
				type: "text",
				text: recovered ? `The working directory ${JSON.stringify(previous)} is unavailable. The working directory is now ${JSON.stringify(directory)}.` : `The working directory changed from ${JSON.stringify(previous)} to ${JSON.stringify(directory)}.`
			}],
			source: { kind: "working-directory" }
		});
		try {
			agent.inject(notice);
		} catch (error) {
			this.ctx.logger.warn(`working-directory: committed ${JSON.stringify(directory)}, but could not queue its notice: ${String(error)}`);
		}
	}
	serialize(agent, signal, action) {
		const session = agent.session;
		const control = signal === void 0 ? this.lifecycle.signal : AbortSignal.any([this.lifecycle.signal, signal]);
		const settled = (this.pending.get(session) ?? Promise.resolve()).then(() => {
			control.throwIfAborted();
			agent.ctx.fiber.assertActive();
			return action(control);
		}).finally(() => this.operations.delete(settled));
		this.operations.add(settled);
		this.pending.set(session, settled.then(() => {}, () => {}));
		return settled;
	}
};
//#endregion
export { WorkingDirectoryService, WorkingDirectoryService as default };
