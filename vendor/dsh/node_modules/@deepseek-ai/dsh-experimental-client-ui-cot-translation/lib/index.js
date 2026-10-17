import { addAbortListener } from "node:events";
import z from "@deepseek-ai/schemastery";
import { Remote, RemoteError, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { TranslationError } from "@deepseek-ai/dsh-experimental-translator";
//#region lib/types/preferences.js
/** Language preference accepted by both Host configuration and browser drafts. */
const LANGUAGE_PREFERENCE_PATTERN = /^(?:auto|[a-zA-Z]{2,8}(?:-[a-zA-Z0-9]{1,8})*)$/;
/** Explicit provider choices accepted by Host configuration and browser drafts. */
const PROVIDER_PREFERENCES = [
	"bing",
	"google",
	"deepseek-account",
	"deepseek-official"
];
//#endregion
//#region lib/types/index.js
/** Host access to machine translation of displayed reasoning. */
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
var __addDisposableResource = function(env, value, async) {
	if (value !== null && value !== void 0) {
		if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
		var dispose, inner;
		if (async) {
			if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
			dispose = value[Symbol.asyncDispose];
		}
		if (dispose === void 0) {
			if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
			dispose = value[Symbol.dispose];
			if (async) inner = dispose;
		}
		if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
		if (inner) dispose = function() {
			try {
				inner.call(this);
			} catch (e) {
				return Promise.reject(e);
			}
		};
		env.stack.push({
			value,
			dispose,
			async
		});
	} else if (async) env.stack.push({ async: true });
	return value;
};
var __disposeResources = (function(SuppressedError) {
	return function(env) {
		function fail(e) {
			env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
			env.hasError = true;
		}
		var r, s = 0;
		function next() {
			while (r = env.stack.pop()) try {
				if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
				if (r.dispose) {
					var result = r.dispose.call(r.value);
					if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
						fail(e);
						return next();
					});
				} else s |= 1;
			} catch (e) {
				fail(e);
			}
			if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
			if (env.hasError) throw env.error;
		}
		return next();
	};
})(typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
	var e = new Error(message);
	return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
let CotTranslationController = (() => {
	let _classSuper = TypertRemoteService;
	let _instanceExtraInitializers = [];
	let _limits_decorators;
	let _translate_decorators;
	return class CotTranslationController extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_limits_decorators = [Remote];
			_translate_decorators = [Remote];
			__esDecorate(this, null, _limits_decorators, {
				kind: "method",
				name: "limits",
				static: false,
				private: false,
				access: {
					has: (obj) => "limits" in obj,
					get: (obj) => obj.limits
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _translate_decorators, {
				kind: "method",
				name: "translate",
				static: false,
				private: false,
				access: {
					has: (obj) => "translate" in obj,
					get: (obj) => obj.translate
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
		static inject = [
			"translator",
			"typert",
			"sessionController"
		];
		static Config = z.object({
			provider: z.union(PROVIDER_PREFERENCES).default("bing").volatile(),
			targetLanguage: z.string().pattern(LANGUAGE_PREFERENCE_PATTERN).default("auto").volatile()
		});
		constructor(ctx, config) {
			super(ctx, "cotTranslation", { namespace: "cotTranslation" });
			this.config = config;
			ctx.inject(["settings"], (child) => {
				child.effect(() => child.settings.configure({ auto: false }, ctx.fiber));
			});
		}
		/**
		* Read accepted translation preferences and the current request limit without sending text.
		* @param signal - browser query cancellation or Remote contribution withdrawal.
		* @returns authoritative preferences, eligible routes, and maximum UTF-16 text length per request.
		*/
		async limits(signal) {
			signal.throwIfAborted();
			const availableProviders = await this.ctx.translator.availableProviders(signal);
			signal.throwIfAborted();
			return {
				maxTextChars: this.ctx.translator.maxTextChars,
				preferences: {
					provider: this.config.provider.get(),
					targetLanguage: this.config.targetLanguage.get()
				},
				availableProviders
			};
		}
		/**
		* Translate one displayed fragment through the reader's selected provider.
		* @param request - original text and Session identity supplied by the Client; provider and explicit
		* target language match accepted preferences, while auto uses the browser locale.
		* @param signal - browser cancellation or Remote contribution withdrawal.
		* @returns translated text; an uncached inactive Session joins ordinary GUI activation before retry.
		* Failures omit the source and provider response. Cancellation stops this caller's wait, not shared activation.
		*/
		async translate(request, signal) {
			signal.throwIfAborted();
			try {
				const env_1 = {
					stack: [],
					error: void 0,
					hasError: false
				};
				try {
					const spec = this.resolveSelected(request);
					try {
						return await this.ctx.translator.translate(spec, signal);
					} catch (error) {
						if (!(error instanceof TranslationError) || error.code !== "TRANSLATION_SESSION_INACTIVE" || spec.sessionId === void 0) throw error;
					}
					signal.throwIfAborted();
					const activation = this.ctx.sessionController.resolveAgent(spec.sessionId).then((result) => {
						if ("error" in result) throw result.error;
					}).catch((error) => {
						if (signal.aborted) this.ctx.logger.warn("Reasoning translation Session activation failed after cancellation");
						throw error;
					});
					const cancelled = Promise.withResolvers();
					__addDisposableResource(env_1, addAbortListener(signal, () => {
						cancelled.reject(signal.reason);
					}), false);
					await Promise.race([activation, cancelled.promise]);
					signal.throwIfAborted();
					return await this.ctx.translator.translate(this.resolveSelected(spec), signal);
				} catch (e_1) {
					env_1.error = e_1;
					env_1.hasError = true;
				} finally {
					__disposeResources(env_1);
				}
			} catch (_error) {
				signal.throwIfAborted();
				throw new RemoteError("cotTranslation/failed", "Translation failed", {});
			}
		}
		resolveSelected(request) {
			const accepted = this.config.provider.get();
			const provider = request.provider ?? accepted;
			if (provider !== accepted) throw new Error("Translation provider is not selected");
			const targetLanguage = this.config.targetLanguage.get();
			if (targetLanguage !== "auto" && request.targetLanguage !== targetLanguage) throw new Error("Translation language is not selected");
			return this.ctx.translator.resolve({
				...request,
				provider
			});
		}
	};
})();
//#endregion
export { CotTranslationController as default };
