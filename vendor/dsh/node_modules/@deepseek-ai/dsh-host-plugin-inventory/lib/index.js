import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
//#region lib/types/index.js
/** Read-only projection of the current Cordis Loader plugin entries. */
var __runInitializers = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
var __esDecorate = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) if (kind === "field") initializers.unshift(_);
		else descriptor[key] = _;
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
/**
* Brand an existing Loader-tree entry id at the owning boundary.
* @param value - the entry id as the Loader tree spells it.
* @returns the same id as the inventory's branded entry id.
*/
function pluginEntryId(value) {
	return value;
}
/** Runtime mirror: FiberState is a cross-package const enum. */
const FIBER_STATE = {
	PENDING: 0,
	LOADING: 1,
	ACTIVE: 2,
	FAILED: 3,
	DISPOSED: 4,
	UNLOADING: 5
};
/** Complete public projection of Cordis Fiber states. */
const FIBER_PHASE = {
	[FIBER_STATE.PENDING]: "pending",
	[FIBER_STATE.LOADING]: "loading",
	[FIBER_STATE.ACTIVE]: "active",
	[FIBER_STATE.FAILED]: "failed",
	[FIBER_STATE.DISPOSED]: null,
	[FIBER_STATE.UNLOADING]: "unloading"
};
/** Remote-only service exposing the Loader's current non-group entry state. */
let PluginInventoryGateway = (() => {
	let _classSuper = TypertRemoteService;
	let _instanceExtraInitializers = [];
	let _list_decorators;
	return class PluginInventoryGateway extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_list_decorators = [Remote("list")];
			__esDecorate(this, null, _list_decorators, {
				kind: "method",
				name: "list",
				static: false,
				private: false,
				access: {
					has: (obj) => "list" in obj,
					get: (obj) => obj.list
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			if (_metadata) Object.defineProperty(this, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		static inject = ["loader"];
		constructor(ctx) {
			super(ctx, "pluginInventory");
			__runInitializers(this, _instanceExtraInitializers);
		}
		/**
		* Read the Loader directly on every call. Cordis's internal plugin/status
		* events already maintain Entry.fiber and Fiber.state, so a second cache
		* would only add another lifecycle truth to keep synchronized.
		*
		* When an agent-preset roster is composed, the snapshot also carries each
		* preset's composition rows, because those rows — not the Loader's own
		* entries — are where a deployment that mounts the roster runs its
		* model-facing plugins.
		* @returns Current non-group Loader entries in Loader order, with optional display metadata
		* and per-preset compositions when a roster is composed.
		*/
		async list() {
			return readPluginInventory(this.ctx);
		}
	};
})();
/** Read current Loader entries and optional preset compositions.
* @param ctx Context with the Loader service.
* @returns Current inventory with optional display metadata and no separate runtime cache.
*/
async function readPluginInventory(ctx) {
	const entries = [];
	const packages = ctx.get("pluginPackages");
	for (const entry of ctx.loader.entries()) {
		if (entry.options.group) continue;
		const base = entry.parent.tree.ctx.baseUrl;
		const meta = base === void 0 ? void 0 : packages?.metaOf(entry.options.name, base);
		entries.push({
			entryId: pluginEntryId(entry.id),
			moduleName: entry.options.name,
			enabled: !entry.disabled,
			fiberPhase: entry.fiber === void 0 ? null : FIBER_PHASE[entry.fiber.state],
			...meta === void 0 ? {} : { meta }
		});
	}
	const presets = ctx.get("agentPresets");
	const management = ctx.get("pluginManager") === void 0 ? {} : { managementAvailable: true };
	if (presets === void 0) return {
		entries,
		...management
	};
	return {
		entries,
		agentPresets: (await presets.compositionInventory()).map((composition) => ({
			...composition,
			rows: composition.rows.map(({ fiberState, ...row }) => {
				const meta = ctx.baseUrl === void 0 ? void 0 : packages?.metaOf(row.moduleName, ctx.baseUrl);
				return {
					...row,
					fiberPhase: fiberState === void 0 ? null : FIBER_PHASE[fiberState],
					...meta === void 0 ? {} : { meta }
				};
			})
		})),
		...management
	};
}
//#endregion
export { PluginInventoryGateway, PluginInventoryGateway as default, pluginEntryId, readPluginInventory };
