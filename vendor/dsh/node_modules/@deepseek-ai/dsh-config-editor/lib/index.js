import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { isDeepStrictEqual } from "node:util";
import { Service, resolveConfig } from "@deepseek-ai/cordis";
import { entryListSchema } from "@deepseek-ai/cordis-plugin-include";
import yaml from "js-yaml";
import { composeEntries, loadProfileDirectory, readProfilePatches, reconcileProfilePatches } from "@deepseek-ai/dsh-app-boot";
import { withFileLock, writeFileAtomic } from "@deepseek-ai/dsh-atomic-write";
import { Scalar, isMap, isSeq, parseDocument, visit } from "yaml";
//#region lib/types/index.js
/** Profile-owned configuration edits, serialized with Loader hot reload. */
function flatten(rows) {
	return rows.flatMap((row) => [row, ...row.group && Array.isArray(row.config) ? flatten(row.config) : []]);
}
/** Persist complete raw configs and apply them through the normal Loader path. */
var ConfigEditor = class extends Service {
	ownerContext;
	static inject = ["loader", "profileContext"];
	constructor(ownerContext) {
		super(ownerContext, "configEditor");
		this.ownerContext = ownerContext;
	}
	/** The profile patch edited by this service. */
	get documentPath() {
		return this.ownerContext.profileContext.patchPath;
	}
	/** Addressable profile rows; nested Includes have independent configuration ownership.
	* @returns Active entries with unique profile patch ids.
	*/
	entries() {
		const candidates = [...this.ownerContext.loader.entries()].filter((entry) => entry.parent.tree.ctx.fiber.entry?.id === "include");
		const counts = /* @__PURE__ */ new Map();
		for (const entry of candidates) counts.set(entry.options.id, (counts.get(entry.options.id) ?? 0) + 1);
		return candidates.filter((entry) => counts.get(entry.options.id) === 1);
	}
	/** Read inherited and explicit profile values for the active entries.
	* @returns Detached layer values alongside their Loader entries.
	*/
	configuration() {
		const profile = this.ownerContext.profileContext;
		const loaded = loadProfileDirectory("dsh", profile.dir, profile.installAnchor);
		const entries = this.entries();
		const overridden = new Set(loaded.patches.filter((patch) => patch.insert === void 0 && Object.hasOwn(patch, "config")).map((patch) => patch.id));
		const composed = /* @__PURE__ */ new Map();
		if (entries.some((entry) => !overridden.has(entry.options.id))) {
			for (const row of flatten(composeEntries([...loaded.layers.map((layer) => layer.patches), loaded.patches]))) if (!composed.has(row.id)) composed.set(row.id, row);
		}
		return entries.map((entry) => ({
			entry,
			inherited: overridden.has(entry.options.id) ? this.inherited(entry, loaded) : structuredClone(composed.get(entry.options.id)?.config ?? {}),
			override: structuredClone(loaded.patches.findLast((row) => row.id === entry.options.id && row.config !== void 0)?.config ?? {})
		}));
	}
	inherited(entry, loaded) {
		const patches = loaded.patches.map((patch) => {
			if (patch.id !== entry.options.id || patch.insert !== void 0) return patch;
			const rest = { ...patch };
			Reflect.deleteProperty(rest, "config");
			return rest;
		});
		const row = flatten(composeEntries([...loaded.layers.map((layer) => layer.patches), patches])).find((row) => row.id === entry.options.id);
		return structuredClone(row?.config ?? {});
	}
	/** Validate, persist, and reconcile a plugin's next config; ordinary fields keep normal lifecycle rules.
	* @param entry Current Loader entry, also used to detect replacement during the write.
	* @param change Derive a raw config from the current entry and its inherited layer.
	* @returns Fulfillment after Loader reconciliation completes.
	*/
	async edit(entry, change) {
		const run = async () => {
			const path = this.documentPath;
			await withFileLock(join(this.ownerContext.profileContext.dir, "package.json"), async () => {
				if (!this.entries().includes(entry) || entry.fiber === void 0) throw new Error("Configuration entry is no longer available");
				const beforePatches = readProfilePatches("dsh", this.ownerContext.profileContext);
				await reconcileProfilePatches(this.ownerContext.root, beforePatches, "dsh");
				if (!this.entries().includes(entry)) throw new Error("Configuration entry changed during reload");
				const current = structuredClone(entry.options.config ?? {});
				const inherited = this.inherited(entry, loadProfileDirectory("dsh", this.ownerContext.profileContext.dir, this.ownerContext.profileContext.installAnchor));
				const next = change(current, inherited);
				const fiber = entry.fiber;
				if (fiber.state !== 2) throw new Error("Configuration plugin is no longer active");
				const resolved = fiber.ctx.waterfall(fiber, "internal/config", next, () => next);
				resolveConfig(fiber.runtime, resolved);
				let before;
				try {
					before = await readFile(path, "utf8");
				} catch (error) {
					if (error.code !== "ENOENT") throw error;
					before = "[]\n";
				}
				const document = parseDocument(before, { customTags: [{
					tag: "tag:yaml.org,2002:js",
					resolve: (value) => value
				}] });
				if (document.errors[0] !== void 0) throw document.errors[0];
				if (!isSeq(document.contents)) throw new Error("Profile patch must be a YAML sequence");
				document.contents.flow = false;
				const index = document.contents.items.findLastIndex((item, index) => isMap(item) && document.getIn([index, "id"]) === entry.options.id && !item.has("insert") && (!item.has("name") || document.getIn([index, "name"]) === entry.options.name));
				if (isDeepStrictEqual(next, inherited)) for (let index = document.contents.items.length - 1; index >= 0; index--) {
					const row = document.contents.items[index];
					if (!isMap(row) || document.getIn([index, "id"]) !== entry.options.id || row.has("insert")) continue;
					row.delete("config");
					if (row.items.length === Number(row.has("id")) + Number(row.has("name"))) document.delete(index);
				}
				else if (index < 0) document.add(document.createNode({
					id: entry.options.id,
					name: entry.options.name,
					config: next
				}));
				else document.setIn([index, "config"], document.createNode(next));
				visit(document, { Map(_key, node) {
					if (node.items.length !== 1 || typeof node.get("__jsExpr") !== "string") return;
					const expression = new Scalar(node.get("__jsExpr"));
					expression.tag = "tag:yaml.org,2002:js";
					return expression;
				} });
				const profile = this.ownerContext.profileContext;
				const patches = readProfilePatches("dsh", profile, {
					...loadProfileDirectory("dsh", profile.dir, profile.installAnchor),
					patches: yaml.load(String(document), { schema: entryListSchema })
				});
				if (!isDeepStrictEqual(flatten(composeEntries([patches])).find((row) => row.id === entry.options.id)?.config ?? {}, next)) throw new Error(`Configuration for "${entry.options.id}" is overridden by a home patch or command-line overlay`);
				await writeFileAtomic(path, String(document), { mode: 384 });
				try {
					await reconcileProfilePatches(this.ownerContext.root, patches, "dsh", [entry.options.id]);
				} catch (error) {
					await writeFileAtomic(path, before, { mode: 384 });
					await reconcileProfilePatches(this.ownerContext.root, beforePatches, "dsh");
					throw error;
				}
			});
		};
		const hmr = this.ownerContext.get("hmr");
		await (hmr === void 0 ? run() : hmr.runExclusive(run));
	}
};
//#endregion
export { ConfigEditor, ConfigEditor as default };
