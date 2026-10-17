import z from "@deepseek-ai/schemastery";
import { MAX_TIMER_DELAY_MS } from "@deepseek-ai/dsh-timeout";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
//#region lib/types/index.js
/** Host registry-response probing for the plugin installation dialog. */
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
let PluginRegistryProbe = (() => {
	let _classSuper = TypertRemoteService;
	let _instanceExtraInitializers = [];
	let _fastest_decorators;
	return class PluginRegistryProbe extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_fastest_decorators = [Remote];
			__esDecorate(this, null, _fastest_decorators, {
				kind: "method",
				name: "fastest",
				static: false,
				private: false,
				access: {
					has: (obj) => "fastest" in obj,
					get: (obj) => obj.fastest
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
		config = __runInitializers(this, _instanceExtraInitializers);
		static Config = z.object({
			registryProbeEnabled: z.boolean().default(true),
			registryProbeTimeoutMs: z.natural().min(1).max(MAX_TIMER_DELAY_MS).default(1500),
			registryProbeCacheTtlMs: z.natural().default(3e5)
		});
		lifetime = new AbortController();
		pending;
		cached;
		constructor(ctx, config) {
			super(ctx, "pluginRegistryProbe");
			this.config = config;
			ctx.effect(() => async () => {
				this.lifetime.abort();
				await this.pending;
			});
		}
		/**
		* Race npm and npmmirror HTTPS ping responses through the Host's fetch proxy.
		* Concurrent readers share a probe; a winner cancels and awaits the other request.
		* @returns the first registry with a successful response, or null when disabled or neither responds successfully; results are cached.
		* @throws rejects when the service has been unloaded.
		*/
		async fastest() {
			this.lifetime.signal.throwIfAborted();
			if (!this.config.registryProbeEnabled) return null;
			if (this.cached !== void 0 && this.cached.expiresAt > Date.now()) return this.cached.registry;
			this.pending ??= this.probe().finally(() => {
				this.pending = void 0;
			});
			return this.pending;
		}
		async probe() {
			const finished = new AbortController();
			const signal = AbortSignal.any([
				this.lifetime.signal,
				finished.signal,
				AbortSignal.timeout(this.config.registryProbeTimeoutMs)
			]);
			const requests = ["https://registry.npmjs.org/-/ping", "https://registry.npmmirror.com/-/ping"].map(async (endpoint) => ({
				registry: new URL("/", endpoint).href,
				response: await fetch(endpoint, {
					signal,
					redirect: "error"
				})
			}));
			const successful = requests.map(async (request) => {
				const { registry, response } = await request;
				if (!response.ok) throw new Error(`Registry ping returned HTTP ${response.status}`);
				return registry;
			});
			let registry;
			try {
				registry = await Promise.any(successful);
			} catch (_unavailableRegistries) {
				registry = null;
			} finally {
				finished.abort();
				const responses = await Promise.allSettled(requests);
				await Promise.allSettled(responses.map(async (result) => {
					if (result.status === "fulfilled") await result.value.response.body?.cancel();
				}));
			}
			if (!this.lifetime.signal.aborted) this.cached = {
				registry,
				expiresAt: Date.now() + this.config.registryProbeCacheTtlMs
			};
			return registry;
		}
	};
})();
//#endregion
export { PluginRegistryProbe as default };
