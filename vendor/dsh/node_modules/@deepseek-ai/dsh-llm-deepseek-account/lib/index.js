import { ACCOUNT_QUOTA_EXCEEDED_CODE, APP_IDENTITY, LlmError, QUOTA_EXCEEDED_CODE, attributionHeaders } from "@deepseek-ai/dsh-llm";
import { launchEnvironmentOf } from "@deepseek-ai/dsh-launch-environment";
import { assertNever } from "@deepseek-ai/dsh-util-values";
import { catalogModelFields, catalogModelInfo, deepSeekConfigFields, registerDeepSeekProvider, resolveAdapterOptions } from "@deepseek-ai/dsh-llm-deepseek";
import { createHash } from "node:crypto";
import { MAX_TIMER_DELAY_MS, deadline, timeoutOf } from "@deepseek-ai/dsh-timeout";
import z from "@deepseek-ai/schemastery";
import { isVolatile } from "@deepseek-ai/cosmokit";
import semver from "semver";
//#region lib/types/listing.js
/** DeepSeek `GET /models` listing: one authenticated request and per-entry decoding. */
const LISTED_MODALITIES = ["text", "image"];
/** Code of a listing deadline's timeout reason; {@link requestModelListing} reports it as `TIMEOUT`. */
const LISTING_TIMEOUT = "MODEL_LISTING_TIMEOUT";
function fieldsOf(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value) ? value : void 0;
}
/** Listed modalities this build sends, in listing order without repeats; `undefined` when the value is not an array. */
function knownModalities(value) {
	if (!Array.isArray(value)) return void 0;
	const listed = value;
	return LISTED_MODALITIES.filter((modality) => listed.includes(modality)).toSorted((left, right) => listed.indexOf(left) - listed.indexOf(right));
}
/** A declared capacity: `undefined` when absent, `false` when not a positive safe integer. */
function capacity(value) {
	if (value === void 0) return void 0;
	return typeof value === "number" && Number.isSafeInteger(value) && value > 0 ? value : false;
}
function requirementOf(entry) {
	if (entry.client_requirements === void 0) return { kind: "none" };
	const requirements = fieldsOf(entry.client_requirements);
	if (requirements === void 0) return { kind: "invalid" };
	const declared = requirements[APP_IDENTITY.product];
	if (declared === void 0) return { kind: "none" };
	const own = fieldsOf(declared);
	if (own === void 0) return { kind: "invalid" };
	if (own.min_version === void 0) return { kind: "none" };
	return typeof own.min_version === "string" && own.min_version.length > 0 ? {
		kind: "min-version",
		version: own.min_version
	} : { kind: "invalid" };
}
function capabilitiesOf(entry) {
	const messages = fieldsOf(fieldsOf(entry.api_capabilities)?.anthropic_messages);
	if (messages === void 0) return {
		usable: false,
		reason: "declares no api_capabilities.anthropic_messages"
	};
	if ((entry.output_modalities === void 0 ? ["text"] : knownModalities(entry.output_modalities))?.includes("text") !== true) return {
		usable: false,
		reason: "declares no text output"
	};
	const inputs = entry.input_modalities === void 0 ? ["text"] : knownModalities(entry.input_modalities);
	if (inputs === void 0 || inputs.length === 0) return {
		usable: false,
		reason: "declares no input modality DeepSeek Harness supports"
	};
	const contextWindow = capacity(entry.context_window);
	const maxOutputTokens = capacity(entry.max_output_tokens);
	if (contextWindow === false || maxOutputTokens === false) return {
		usable: false,
		reason: "declares an invalid context_window or max_output_tokens"
	};
	const update = messages.system_prompt_update;
	return {
		usable: true,
		facts: {
			inputModalities: inputs,
			...contextWindow === void 0 ? {} : { contextWindow },
			...maxOutputTokens === void 0 ? {} : { maxOutputTokens },
			...update === void 0 ? {} : { systemPromptUpdate: update === "in-history" ? "in-history" : "leading-only" }
		}
	};
}
/**
* Decode one `/models` body entry by entry.
* @param body - parsed JSON response.
* @returns the entries with a usable id, in listing order.
* @throws LlmError `INVALID_RESPONSE` when the body has no `data` array or no usable entry.
*/
function parseModelListing(body) {
	const data = fieldsOf(body)?.data;
	if (!Array.isArray(data)) throw new LlmError("DeepSeek model listing has no \"data\" array", "INVALID_RESPONSE");
	const rows = data;
	const entries = [];
	const seen = /* @__PURE__ */ new Set();
	for (const row of rows) {
		const entry = fieldsOf(row);
		const id = entry?.id;
		if (entry === void 0 || typeof id !== "string" || id.length === 0 || seen.has(id)) continue;
		seen.add(id);
		entries.push({
			id,
			...typeof entry.name === "string" && entry.name.length > 0 ? { name: entry.name } : {},
			requirement: requirementOf(entry),
			capabilities: capabilitiesOf(entry)
		});
	}
	if (entries.length === 0) throw new LlmError("DeepSeek model listing contains no model entry", "INVALID_RESPONSE");
	return {
		entries,
		skipped: rows.length - entries.length
	};
}
/**
* Request and decode one model listing. Redirects fail, so credentials stay on the requested origin.
* @param url - listing endpoint.
* @param headers - authentication headers for this endpoint.
* @param signal - cancellation and deadline of the whole exchange.
* @returns the decoded listing.
* @throws LlmError `TIMEOUT` when a {@link LISTING_TIMEOUT} deadline elapses before a complete body, `ABORTED` for
*   another abort, `TRANSPORT` for a network failure, `HTTP_<status>` for a non-2xx answer,
*   and `INVALID_RESPONSE` for a body that is not a JSON listing.
*/
async function requestModelListing(url, headers, signal) {
	let response;
	let text;
	try {
		response = await fetch(url, {
			method: "GET",
			redirect: "error",
			signal,
			headers: {
				...attributionHeaders(),
				accept: "application/json",
				...headers
			}
		});
		text = await response.text();
	} catch (error) {
		const expired = timeoutOf(signal, LISTING_TIMEOUT);
		if (expired !== void 0) throw new LlmError(`DeepSeek model listing request to ${url} timed out after ${expired.timeoutMs} ms`, "TIMEOUT", { cause: error });
		throw signal.aborted ? new LlmError(`DeepSeek model listing request to ${url} was aborted`, "ABORTED", { cause: error }) : new LlmError(`could not reach ${url}`, "TRANSPORT", { cause: error });
	}
	if (!response.ok) throw new LlmError(`${url} answered HTTP ${response.status}`, `HTTP_${response.status}`, { status: response.status });
	let body;
	try {
		body = JSON.parse(text);
	} catch (error) {
		throw new LlmError(`${url} did not answer with JSON`, "INVALID_RESPONSE", { cause: error });
	}
	return parseModelListing(body);
}
//#endregion
//#region lib/types/catalog.js
/** Credential-scoped `/models` cache with single-flight loads, background refresh, and last-known-good retention. */
/** Wait for `task` unless `signal` aborts first; the task keeps running. */
async function abandonable(task, signal) {
	if (signal === void 0) return task;
	const abandoned = Promise.withResolvers();
	const abandon = () => {
		abandoned.reject(signal.reason);
	};
	signal.addEventListener("abort", abandon, { once: true });
	try {
		await Promise.race([task, abandoned.promise]);
	} finally {
		signal.removeEventListener("abort", abandon);
	}
}
/** One account route's listing cache; each endpoint and credential pair has its own scope. */
var AccountModelCatalog = class {
	dependencies;
	scope;
	listing;
	/** Settle time of the latest load in this scope; `undefined` before the first one settles. */
	settledAt;
	inflight;
	request;
	generation = 0;
	failing = false;
	closed = false;
	/** @param dependencies - settings, credential, transport, clock, and diagnostic callbacks. */
	constructor(dependencies) {
		this.dependencies = dependencies;
	}
	/**
	* The last published view, without I/O.
	* @returns the signed-in state and listing of the current scope.
	*/
	current() {
		return {
			signedIn: this.scope !== void 0,
			listing: this.listing
		};
	}
	/**
	* Resolve the view for the current credential. The first access of a scope
	* waits for its load, which the request deadline bounds; later accesses
	* return at once and refresh a stale listing in the background.
	* @param signal - abandons this wait only; the shared load continues.
	* @returns the view after any first load of the scope settles.
	*/
	async view(signal) {
		const settings = this.dependencies.settings();
		const token = await this.dependencies.token(settings.url);
		signal?.throwIfAborted();
		if (this.closed) return this.current();
		const scope = token === void 0 ? void 0 : `${settings.url}\n${createHash("sha256").update(token).digest("hex")}`;
		if (scope !== this.scope) this.rescope(scope);
		if (token !== void 0) {
			if (this.settledAt === void 0) await abandonable(this.start(settings, token), signal);
			else if (this.dependencies.now() - this.settledAt >= settings.maxAgeMs) this.start(settings, token);
		}
		return this.current();
	}
	/** Abort in-flight loads; later results and accesses change nothing. */
	dispose() {
		this.closed = true;
		this.generation += 1;
		this.request?.abort();
	}
	rescope(scope) {
		this.request?.abort();
		this.scope = scope;
		this.listing = void 0;
		this.settledAt = void 0;
		this.inflight = void 0;
		this.failing = false;
		this.generation += 1;
	}
	start(settings, token) {
		if (this.inflight !== void 0) return this.inflight;
		this.generation += 1;
		const generation = this.generation;
		const request = new AbortController();
		this.request = request;
		const limit = deadline(request.signal, settings.timeoutMs, LISTING_TIMEOUT);
		const run = this.dependencies.load(settings.url, token, limit.signal).then((listing) => {
			if (generation !== this.generation) return;
			this.listing = listing;
			this.settledAt = this.dependencies.now();
			this.failing = false;
			this.dependencies.info(`model listing from ${settings.url} loaded ${listing.entries.length} model(s), skipped ${listing.skipped} row(s)`);
		}, (error) => {
			if (generation !== this.generation) return;
			if (!this.failing) {
				const fallback = this.listing === void 0 ? "using the bundled catalog" : "keeping the previous catalog";
				this.dependencies.warn(`model listing from ${settings.url} failed (${String(error)}); ${fallback}`);
			}
			this.settledAt = this.dependencies.now();
			this.failing = true;
		}).finally(() => {
			limit[Symbol.dispose]();
			if (this.inflight === run) this.inflight = void 0;
		});
		this.inflight = run;
		return run;
	}
};
//#endregion
//#region lib/types/config.js
/** Default deadline of one model-listing request and of a first-use wait. */
const DEFAULT_MODELS_TIMEOUT_MS = 5e3;
/** Default listing age after which the next access refreshes it in the background. */
const DEFAULT_MODELS_MAX_AGE_MS = 6e5;
const { models: _protocolCatalog, ...protocolFields } = deepSeekConfigFields;
const modelOverride = z.object({
	...catalogModelFields,
	inputModalities: z.array(z.union(["text", "image"]))
});
const Config = z.object({
	...protocolFields,
	modelsTimeoutMs: z.number().min(Number.MIN_VALUE).max(MAX_TIMER_DELAY_MS).default(DEFAULT_MODELS_TIMEOUT_MS).volatile(),
	modelsMaxAgeMs: z.number().step(1).min(0).max(Number.MAX_SAFE_INTEGER).default(DEFAULT_MODELS_MAX_AGE_MS).volatile(),
	modelOverrides: z.dict(modelOverride).default({}).volatile()
});
/**
* Read the current value behind every reference of a validated Config.
* @param config - parsed plugin Config.
* @returns plain options for {@link resolveAccountOptions}.
*/
function plainAccountOptions(config) {
	return Object.fromEntries(Object.entries(config).map(([key, value]) => [key, isVolatile(value) ? value.get() : value]));
}
/** The listing endpoint: `/models` at the Messages origin, the only origin that receives the account token. */
function listingEndpoint(baseURL) {
	return new URL("/models", new URL(baseURL).origin).href;
}
/** Keep an override's declared fields: parsed configuration carries unset fields as `undefined` and unset arrays as `[]`. */
function resolveOverride(id, override) {
	if (id.length === 0) throw new Error("llm-deepseek-account: modelOverrides keys must be non-empty model ids");
	if (Object.hasOwn(override, "id")) throw new Error(`llm-deepseek-account: modelOverrides.${id} sets "id", which is its key`);
	const declared = {};
	for (const [key, value] of Object.entries(override)) {
		if (value === void 0 || Array.isArray(value) && value.length === 0) continue;
		Reflect.set(declared, key, value);
	}
	try {
		resolveAdapterOptions({ models: [{
			inputModalities: ["text", "image"],
			...declared,
			id
		}] });
	} catch (error) {
		throw new Error(`llm-deepseek-account: modelOverrides.${id} is invalid: ${String(error)}`, { cause: error });
	}
	return declared;
}
/**
* The one explicit resolve step from raw account settings to validated facts.
* Settings updates can reach it without schema validation, so every bound is judged here.
* @param options - plain account options.
* @param environment - this run's environment layers, or `undefined` outside the product CLI.
* @returns Messages settings, listing settings, and validated overrides.
*/
function resolveAccountOptions(options, environment) {
	if (Object.hasOwn(options, "models")) throw new Error("llm-deepseek-account: models is no longer configurable; the account /models listing supplies the catalog. Remove models from this entry and adjust single models with modelOverrides.<model id>");
	const { modelsTimeoutMs = DEFAULT_MODELS_TIMEOUT_MS, modelsMaxAgeMs = DEFAULT_MODELS_MAX_AGE_MS, modelOverrides = {}, ...protocolOptions } = options;
	if (!Number.isFinite(modelsTimeoutMs) || modelsTimeoutMs <= 0 || modelsTimeoutMs > MAX_TIMER_DELAY_MS) throw new Error(`llm-deepseek-account: modelsTimeoutMs must be a positive finite number no greater than ${MAX_TIMER_DELAY_MS}`);
	if (!Number.isSafeInteger(modelsMaxAgeMs) || modelsMaxAgeMs < 0) throw new Error("llm-deepseek-account: modelsMaxAgeMs must be a non-negative safe integer");
	const protocol = resolveAdapterOptions(protocolOptions, environment);
	return {
		protocol,
		catalog: {
			url: listingEndpoint(protocol.baseURL),
			timeoutMs: modelsTimeoutMs,
			maxAgeMs: modelsMaxAgeMs
		},
		modelOverrides: Object.fromEntries(Object.entries(modelOverrides).map(([id, override]) => [id, resolveOverride(id, override)]))
	};
}
//#endregion
//#region lib/types/resolve-catalog.js
/** The account catalog: version gating, this build's model knowledge, and deployment overrides. */
/** Replace fields of an entry; a text-only result drops the image limits it inherited. */
function layered(model, layer) {
	const merged = {
		...model,
		...layer
	};
	if (merged.inputModalities?.includes("image") !== true) {
		if (layer.imagePixelBudget === void 0) delete merged.imagePixelBudget;
		if (layer.imageMaxBytes === void 0) delete merged.imageMaxBytes;
	}
	return merged;
}
/** Layer one usable listing entry over this build's entry for the same id. */
function listed(base, entry, facts, routeMaxTokens) {
	const { systemPromptUpdate: _replaced, ...leadingOnly } = base;
	return layered(facts.systemPromptUpdate === "leading-only" ? leadingOnly : base, {
		...entry.name === void 0 ? {} : { name: entry.name },
		...facts.contextWindow === void 0 ? {} : { contextWindow: facts.contextWindow },
		...facts.maxOutputTokens === void 0 ? {} : { maxTokens: Math.min(routeMaxTokens, facts.maxOutputTokens) },
		...facts.systemPromptUpdate === "in-history" ? { systemPromptUpdate: "in-history" } : {},
		inputModalities: [...facts.inputModalities]
	});
}
function gateOf(entry, known, clientVersion, problems) {
	const requirement = entry.requirement;
	switch (requirement.kind) {
		case "none": return known ? void 0 : { kind: "unsupported" };
		case "min-version":
			if (semver.valid(requirement.version) === null) break;
			return semver.gte(clientVersion, requirement.version) ? void 0 : {
				kind: "upgrade-required",
				requiredVersion: requirement.version
			};
		case "invalid": break;
		/* v8 ignore next 2 -- listing decoding produces only the closed requirement union */
		default: return assertNever(requirement, "model listing client requirement");
	}
	problems.push(`model "${entry.id}" declares an unreadable client requirement`);
	return { kind: "unsupported" };
}
/**
* Resolve the account catalog. A declared minimum client version decides a
* listed model's availability; without one, only models this build supports
* are offered and the other listed models stay hidden.
* @param input - listing, supported models, overrides, route cap, and this build's version.
* @returns offered models, request-resolution entries, refusals, and diagnostics.
*/
function resolveAccountCatalog(input) {
	const supported = new Map(input.supported.map((model) => [model.id, model]));
	const problems = [];
	const overrideErrors = [];
	const withOverride = (model) => {
		const override = input.overrides[model.id];
		if (override === void 0) return model;
		const candidate = layered(model, override);
		try {
			resolveAdapterOptions({ models: [candidate] });
		} catch (error) {
			overrideErrors.push(`modelOverrides.${model.id} does not apply (${String(error)})`);
			return model;
		}
		return candidate;
	};
	if (input.listing === void 0) {
		const resolution = resolveAdapterOptions({ models: input.supported.map(withOverride) }).models;
		return {
			offered: resolution,
			resolution,
			refusals: /* @__PURE__ */ new Map(),
			problems,
			overrideErrors
		};
	}
	const offered = [];
	const refusals = /* @__PURE__ */ new Map();
	for (const entry of input.listing) {
		const refusal = gateOf(entry, supported.has(entry.id), input.clientVersion, problems);
		if (refusal !== void 0) {
			refusals.set(entry.id, refusal);
			continue;
		}
		if (!entry.capabilities.usable) {
			problems.push(`model "${entry.id}" ${entry.capabilities.reason}`);
			refusals.set(entry.id, { kind: "unsupported" });
			continue;
		}
		offered.push(withOverride(listed(supported.get(entry.id) ?? { id: entry.id }, entry, entry.capabilities.facts, input.routeMaxTokens)));
	}
	const offeredIds = new Set(offered.map((model) => model.id));
	const listedIds = new Set(input.listing.map((entry) => entry.id));
	for (const id of Object.keys(input.overrides)) if (!listedIds.has(id) && !supported.has(id)) overrideErrors.push(`modelOverrides names "${id}", which neither the account listing nor the built-in catalog describes`);
	const resolution = resolveAdapterOptions({ models: [...offered, ...input.supported.filter((model) => !offeredIds.has(model.id)).map(withOverride)] }).models;
	return {
		offered: resolution.slice(0, offered.length),
		resolution,
		refusals,
		problems,
		overrideErrors
	};
}
//#endregion
//#region lib/types/index.js
const name = "llm-deepseek-account";
const inject = ["llm"];
const PROVIDER = "deepseek-account";
/** Header carrying the account token on Messages, Files, and model-listing requests. */
const TOKEN_HEADER = "x-dsh-auth-token";
/** Console tag of listing diagnostics; product profiles mount no console exporter for `ctx.logger`. */
const LOG_TAG = "[llm-deepseek-account]";
function refuse(model, refusal) {
	if (refusal === void 0) return;
	switch (refusal.kind) {
		case "upgrade-required": throw new LlmError(`DeepSeek model "${model}" requires DeepSeek Harness ${refusal.requiredVersion} or later; current version is ${APP_IDENTITY.version}`, "CLIENT_UPGRADE_REQUIRED");
		case "unsupported": throw new LlmError(`DeepSeek model "${model}" is not supported by DeepSeek Harness; current version is ${APP_IDENTITY.version}`, "MODEL_UNSUPPORTED");
		/* v8 ignore next 2 -- catalog resolution produces only the closed refusal union */
		default: assertNever(refusal, "account catalog refusal");
	}
}
function apply(ctx, config) {
	const environment = launchEnvironmentOf(ctx);
	const settings = () => resolveAccountOptions(plainAccountOptions(config), environment);
	settings();
	const supported = resolveAdapterOptions({}).models;
	const account = () => ctx.get("deepseekAccount");
	const resolveAuth = async (connection) => {
		const token = await account()?.resolveToken(connection.baseURL);
		if (token === void 0) throw new LlmError("Sign in to DeepSeek to use the account provider. The request destination must allow account authentication.", "ACCOUNT_SIGN_IN_REQUIRED");
		return {
			headers: { [TOKEN_HEADER]: token },
			onRequestError: async (error) => {
				if (!(error instanceof LlmError)) return error;
				if (error.code === QUOTA_EXCEEDED_CODE) return new LlmError(error.message, ACCOUNT_QUOTA_EXCEEDED_CODE, {
					...error.failure,
					cause: error
				});
				if (error.failure.status !== 401) return error;
				const rejected = new LlmError(error.message, "ACCOUNT_TOKEN_INVALID", {
					...error.failure,
					cause: error
				});
				try {
					await account()?.rejectToken(token);
				} catch (_credentialRemovalFailed) {}
				return rejected;
			}
		};
	};
	const catalog = new AccountModelCatalog({
		settings: () => settings().catalog,
		token: async (url) => account()?.resolveToken(url),
		load: (url, token, signal) => requestModelListing(url, { [TOKEN_HEADER]: token }, signal),
		now: () => Date.now(),
		info: (message) => {
			console.info(LOG_TAG, message);
		},
		warn: (message) => {
			console.warn(LOG_TAG, message);
		}
	});
	let loggedListing;
	/** Resolve the catalog for one view, logging the listing's hidden entries once per listing. */
	const connectionOf = (view) => {
		const resolved = settings();
		const result = resolveAccountCatalog({
			listing: view.listing?.entries,
			supported,
			overrides: resolved.modelOverrides,
			routeMaxTokens: resolved.protocol.maxTokens,
			clientVersion: APP_IDENTITY.version
		});
		if (view.listing !== loggedListing) {
			loggedListing = view.listing;
			for (const problem of result.problems) console.warn(LOG_TAG, problem);
		}
		return {
			...resolved.protocol,
			models: result.resolution,
			catalog: result
		};
	};
	const entry = {
		provider: PROVIDER,
		displayName: "DeepSeek Account",
		settingsNs: ctx.fiber.entry?.options.id ?? "llm-deepseek-account",
		settingsPath: []
	};
	const directory = ctx.llm.registerConfigurableProviders([entry]);
	let reportedError;
	/** Publish override diagnostics on the provider directory. */
	const discovered = (view) => {
		const connection = connectionOf(view);
		const error = connection.catalog.overrideErrors.length === 0 ? void 0 : connection.catalog.overrideErrors.join("; ");
		if (error !== reportedError) {
			reportedError = error;
			directory.replace([error === void 0 ? entry : {
				...entry,
				error
			}]);
		}
		return connection;
	};
	registerDeepSeekProvider(ctx, PROVIDER, {
		providerName: "DeepSeek Account",
		options: () => connectionOf(catalog.current()),
		connect: async (signal) => connectionOf(await catalog.view(signal)),
		resolveAuth,
		admit: (connection, model) => {
			refuse(model, connection.catalog.refusals.get(model));
		},
		discoverModels: async (provider) => {
			const view = await catalog.view();
			return view.signedIn ? discovered(view).catalog.offered.map((model) => catalogModelInfo(provider, model)) : [];
		}
	});
	ctx.effect(() => () => {
		catalog.dispose();
	}, "llm-deepseek-account: model catalog");
}
//#endregion
export { Config, apply, inject, name };
