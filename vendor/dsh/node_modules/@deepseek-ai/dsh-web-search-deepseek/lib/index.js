import z from "@deepseek-ai/schemastery";
import { credentialRef } from "@deepseek-ai/dsh-credentials";
import { launchEnvironmentOf } from "@deepseek-ai/dsh-launch-environment";
import { WebError } from "@deepseek-ai/dsh-web";
//#region lib/types/provider.js
/**
* DeepSeek search through an Anthropic-compatible Messages model call with the native
* `web_search_20250305` server tool. Each search costs a model turn, but returns structured
* result blocks; absence of those blocks is an error rather than a prose-scraping fallback.
* The wire format and native `fetch` client are provider-private and do not use `ctx.llm`.
* @module @deepseek-ai/dsh-web-search-deepseek/provider
*/
/** Stable id this provider registers under. */
const DEEPSEEK_PROVIDER_ID = "deepseek-official";
/**
* Default auxiliary-search endpoint, including `/v1`; `/messages` is appended.
* `$DEEPSEEK_SEARCH_BASE_URL` overrides it independently of the conversation
* adapter's endpoint. Both providers share the API key.
*/
const DEEPSEEK_DEFAULT_BASE_URL = "https://api.deepseek.com/anthropic/v1";
/** Default Anthropic-format model name (aligned with the repo's DeepSeek model vocabulary). */
const DEEPSEEK_DEFAULT_MODEL = "deepseek-v4-flash";
/** Default `anthropic-version` header value. */
const DEEPSEEK_DEFAULT_API_VERSION = "2023-06-01";
/** Default upper bound on generated tokens for the Messages request. */
const DEEPSEEK_DEFAULT_MAX_TOKENS = 4096;
/** Default maximum `web_search` server-tool uses per request. */
const DEEPSEEK_DEFAULT_MAX_USES = 5;
/** Attribution header sent on every request. Bump with the package version. */
const USER_AGENT = "deepseek-harness/0.0.1";
/**
* Build a `url → cited_text` map from every `text` block's `citations[]`. This
* is the snippet source: Anthropic `web_search_result` items carry
* `url`/`title`/`page_age` but typically NO inline snippet — the excerpt lives
* in a separate `text` block's citation, keyed by `url` (first occurrence wins).
*
* @param blocks - the response's content blocks; non-`text` blocks are skipped.
* @returns the `url → cited_text` map (empty when no citations are present).
*/
function citationSnippets(blocks) {
	const map = /* @__PURE__ */ new Map();
	for (const block of blocks) {
		if (block.type !== "text") continue;
		for (const cite of block.citations ?? []) if (cite.url != null && cite.url.length > 0 && cite.cited_text != null && cite.cited_text.length > 0 && !map.has(cite.url)) map.set(cite.url, cite.cited_text);
	}
	return map;
}
/**
* Map a DeepSeek Anthropic Messages response to a normalized search result. Walks
* `web_search_tool_result` blocks for citeable `web_search_result` items, joins each to its
* citation excerpt as `snippet`, and dedupes by `url` (a `max_uses > 1` request can surface
* the same URL across searches). The web service owns the final `maxResults` truncation, so
* `truncated` is always `false` here.
*
* @param response - the parsed Messages response body.
* @returns the normalized result with deduped, snippet-joined sources.
* @throws {@link WebError} when native search produced no result block.
*/
function mapAnthropicResponse(response) {
	const blocks = response.content ?? [];
	const resultBlocks = blocks.filter((block) => block.type === "web_search_tool_result");
	if (resultBlocks.length === 0) throw new WebError("DeepSeek returned no web_search_tool_result blocks; the request may not have triggered native web search", "WEB_PROVIDER_ERROR");
	const snippets = citationSnippets(blocks);
	const seen = /* @__PURE__ */ new Set();
	const sources = [];
	for (const block of resultBlocks) for (const item of block.content ?? []) {
		if (item.type !== "web_search_result" || item.url.length === 0 || seen.has(item.url)) continue;
		seen.add(item.url);
		const snippet = snippets.get(item.url);
		sources.push({
			url: item.url,
			...item.title != null && item.title.length > 0 ? { title: item.title } : {},
			...snippet != null && snippet.length > 0 ? { snippet } : {},
			...item.page_age != null && item.page_age.length > 0 ? { publishedAt: item.page_age } : {}
		});
	}
	return {
		sources,
		truncated: false
	};
}
/**
* The DeepSeek-backed search provider. HTTP redirects fail as `WEB_PROVIDER_ERROR`;
* failures after dispatch name the endpoint and tell the model how the user can configure it.
*/
var DeepSeekSearchProvider = class {
	resolveOptions;
	id = DEEPSEEK_PROVIDER_ID;
	/**
	* @param resolveOptions - the options for the NEXT operation, snapshotted
	* once at each operation's entry so one search never mixes two sections. A
	* thunk rather than a value because the plugin's settings section can change
	* between searches, and re-registering the provider to carry a new endpoint
	* would make the seam's selection observable to the user as a flicker.
	*/
	constructor(resolveOptions) {
		this.resolveOptions = resolveOptions;
	}
	available() {
		const options = this.resolveOptions();
		return ((options.apiKey?.length ?? 0) > 0 || options.resolveApiKey !== void 0 || options.resolveAccountToken !== void 0) && URL.canParse(options.baseURL) && isPositiveInteger(options.maxTokens) && isPositiveInteger(options.maxUses);
	}
	async search(request, signal) {
		const options = this.resolveOptions();
		const endpoint = `${options.baseURL}/messages`;
		const auth = await this.authHeaders(options, endpoint, signal);
		throwIfSearchAborted(signal);
		const body = {
			model: options.model,
			max_tokens: options.maxTokens,
			messages: [{
				role: "user",
				content: [{
					type: "text",
					text: `Perform a web search for the query: ${request.query}`
				}]
			}],
			tools: [{
				type: "web_search_20250305",
				name: "web_search",
				max_uses: options.maxUses
			}]
		};
		options.recordRequest?.({
			endpoint,
			apiVersion: options.apiVersion,
			body
		});
		throwIfSearchAborted(signal);
		let response;
		try {
			response = await fetch(endpoint, {
				method: "POST",
				redirect: "error",
				headers: {
					...auth.headers,
					"anthropic-version": options.apiVersion,
					"content-type": "application/json",
					"accept": "application/json",
					"user-agent": USER_AGENT
				},
				body: JSON.stringify(body),
				...signal !== void 0 ? { signal } : {}
			});
		} catch (error) {
			if (signal?.aborted === true || isAbortError(error)) throw searchAborted(signal, error);
			throw searchEndpointError(endpoint, `DeepSeek search request failed: ${String(error)}`, error);
		}
		if (!response.ok) {
			const status = response.status;
			let message = `DeepSeek API error (HTTP ${status})`;
			try {
				const parsed = await response.json();
				const detail = typeof parsed.error === "string" ? parsed.error : parsed.error?.message ?? parsed.message;
				if (detail !== void 0 && detail.length > 0) message += `: ${detail}`;
			} catch (error) {
				if (signal?.aborted === true || isAbortError(error)) throw searchAborted(signal, error);
			}
			if (status === 401 && auth.kind === "account") throw accountRejectedError(message);
			throw searchEndpointError(endpoint, message);
		}
		try {
			return mapAnthropicResponse(await response.json());
		} catch (error) {
			if (signal?.aborted === true || isAbortError(error)) throw searchAborted(signal, error);
			throw searchEndpointError(endpoint, error instanceof WebError ? error.message : `DeepSeek returned an unprocessable response body: ${String(error)}`, error);
		}
	}
	/**
	* Resolve one operation's authentication headers without retaining a credential on the provider.
	* @param options - the caller's snapshot, so the credential and the endpoint it is sent to come from one section.
	* @param endpoint - the Messages endpoint this operation dispatches to.
	* @param signal - abort signal for the surrounding search.
	* @returns the account-token header when one resolves, otherwise the API-key headers, tagged by credential kind.
	*/
	async authHeaders(options, endpoint, signal) {
		const { resolveAccountToken } = options;
		const token = resolveAccountToken === void 0 ? void 0 : await resolveCredential(() => resolveAccountToken(endpoint), signal);
		if (token !== void 0 && token.length > 0) return {
			kind: "account",
			headers: { "x-dsh-auth-token": token }
		};
		const apiKey = await this.apiKey(options, signal);
		return {
			kind: "api-key",
			headers: {
				"x-api-key": apiKey,
				"authorization": `Bearer ${apiKey}`
			}
		};
	}
	/**
	* Resolve one operation's API key without retaining it on the provider.
	* @param options - the caller's snapshot, so the key and the endpoint it is sent to come from one section.
	* @param signal - abort signal for the surrounding search.
	* @returns the resolved key.
	*/
	async apiKey(options, signal) {
		throwIfSearchAborted(signal);
		if (options.apiKey !== void 0 && options.apiKey.length > 0) return options.apiKey;
		const { resolveApiKey } = options;
		const resolved = resolveApiKey === void 0 ? void 0 : await resolveCredential(resolveApiKey, signal);
		if (resolved !== void 0 && resolved.length > 0) return resolved;
		throw new WebError(`DeepSeek search has no API key for "${options.apiKeyEnv ?? "DEEPSEEK_API_KEY"}"; store it through the credentials service (the web Models page writes it), export it in the launching environment, or set a literal "apiKey" in the web-search-deepseek config; a conversation using a DeepSeek Account model searches with the account sign-in instead`, "WEB_PROVIDER_CREDENTIAL_MISSING");
	}
};
/**
* Run one credential resolver under the search's cancellation signal. An
* already-cancelled search never starts the resolver.
* @param resolve - the resolver; a synchronous throw is mapped like a rejection.
* @param signal - abort signal for the surrounding search.
* @returns the resolved credential, or undefined when the resolver supplied none.
* @throws {@link WebError} `WEB_ABORTED` on cancellation, `WEB_PROVIDER_ERROR` when the resolver fails.
*/
async function resolveCredential(resolve, signal) {
	throwIfSearchAborted(signal);
	try {
		return await abortable(resolve(), signal);
	} catch (error) {
		if (signal?.aborted === true || isAbortError(error)) throw searchAborted(signal, error);
		throw new WebError(`DeepSeek search credential resolution failed: ${String(error)}`, "WEB_PROVIDER_ERROR", { cause: error });
	}
}
/** Replace endpoint guidance with sign-in guidance when DeepSeek rejects the account token. */
function accountRejectedError(message) {
	return new WebError(`${message}\n\nDeepSeek rejected the account sign-in used for this web search. Guide the user to sign in to DeepSeek again; the search endpoint does not need changing.`, "WEB_PROVIDER_ERROR");
}
/** Add endpoint recovery instructions to failures that occur after request dispatch begins. */
function searchEndpointError(endpoint, message, cause) {
	return new WebError(`${message}\n\nThe web search request used endpoint ${JSON.stringify(endpoint)}. Search endpoint configuration is separate from chat. If that endpoint is not intended, guide the user to Settings > Plugins > Plugin configuration > Web search, where they can change and save Endpoint. If that settings page is unavailable, the user can set DEEPSEEK_SEARCH_BASE_URL or configure web-search-deepseek.baseURL to a trusted Anthropic-compatible Messages API base. Only the user should choose or change the endpoint.`, "WEB_PROVIDER_ERROR", cause === void 0 ? void 0 : { cause });
}
/**
* Race a same-process asynchronous preflight against caller cancellation. The
* attached settlement handlers keep observing an uncooperative operation after
* abort so a later rejection cannot become unhandled.
*/
function abortable(operation, signal) {
	if (signal === void 0) return operation;
	if (signal.aborted) return Promise.reject(searchAborted(signal));
	return new Promise((resolve, reject) => {
		const onAbort = () => {
			reject(searchAborted(signal));
		};
		signal.addEventListener("abort", onAbort, { once: true });
		operation.then((value) => {
			signal.removeEventListener("abort", onAbort);
			resolve(value);
		}, (error) => {
			signal.removeEventListener("abort", onAbort);
			reject(new Error(String(error).replace(/^Error: /u, ""), { cause: error }));
		});
	});
}
/** Throw the provider's stable cancellation error when the caller already aborted. */
function throwIfSearchAborted(signal) {
	if (signal?.aborted === true) throw searchAborted(signal);
}
/** Build the provider's stable cancellation error while retaining the caller's reason. */
function searchAborted(signal, fallback) {
	return new WebError("DeepSeek search aborted", "WEB_ABORTED", { cause: signal?.aborted === true ? signal.reason : fallback });
}
/** True for a fetch/`AbortSignal` abort, surfaced as `WEB_ABORTED`. */
function isAbortError(error) {
	return error instanceof DOMException && error.name === "AbortError";
}
/** True for DeepSeek request limits that can be sent to the Messages API. */
function isPositiveInteger(value) {
	return Number.isInteger(value) && value > 0;
}
//#endregion
//#region lib/types/index.js
/** Cordis plugin name used by loader diagnostics. */
const name = "web-search-deepseek";
/** The web seam this provider registers into. */
const inject = ["web"];
const Config = z.object({
	apiKey: z.string().role("secret").volatile(),
	apiKeyEnv: z.string().role("credential-ref").default("DEEPSEEK_API_KEY").volatile(),
	baseURL: z.string().volatile(),
	model: z.string().default(DEEPSEEK_DEFAULT_MODEL).volatile(),
	apiVersion: z.string().default(DEEPSEEK_DEFAULT_API_VERSION).volatile(),
	maxTokens: z.number().step(1).min(1).default(DEEPSEEK_DEFAULT_MAX_TOKENS).volatile(),
	maxUses: z.number().step(1).min(1).default(5).volatile()
});
/**
* Auxiliary-search endpoint, independent of the conversation adapter's
* `$DEEPSEEK_BASE_URL` and selected protocol.
*/
const SEARCH_BASE_URL_ENV = "DEEPSEEK_SEARCH_BASE_URL";
/** Provider route id `dsh-llm-deepseek-account` registers; `request/context` events record it per Session. */
const ACCOUNT_PROVIDER = "deepseek-account";
/** Settings namespace carrying this provider's endpoint, model, and key reference. */
const WEB_SEARCH_DEEPSEEK_SETTINGS_NAMESPACE = "web-search-deepseek";
/**
* Project one resolved section into the options the provider serves its next
* search with. Environment fallbacks stay here rather than in the provider:
* every value it reads is already fully defaulted.
* @param ctx - plugin context supplying the credential and environment planes.
* @param config - the currently authoritative section.
* @returns options for one search.
*/
function resolveOptions(ctx, config) {
	const apiKeyEnv = credentialRef(config.apiKeyEnv);
	const literalApiKey = config.apiKey !== void 0 && config.apiKey.length > 0 ? config.apiKey : void 0;
	return {
		...literalApiKey === void 0 ? {} : { apiKey: literalApiKey },
		resolveAccountToken: async (endpoint) => {
			if (ctx.get("agents")?.currentInitiator()?.session.requestContext()?.provider !== ACCOUNT_PROVIDER) return void 0;
			return await ctx.get("deepseekAccount")?.resolveToken(endpoint);
		},
		resolveApiKey: async () => {
			const credentials = ctx.get("credentials");
			if (credentials !== void 0) return (await credentials.resolve(apiKeyEnv))?.value;
			const ambient = launchEnvironmentOf(ctx).get(apiKeyEnv);
			return ambient !== void 0 && ambient.value.length > 0 ? ambient.value : void 0;
		},
		apiKeyEnv,
		baseURL: config.baseURL ?? launchEnvironmentOf(ctx).get(SEARCH_BASE_URL_ENV)?.value ?? "https://api.deepseek.com/anthropic/v1",
		model: config.model,
		apiVersion: config.apiVersion,
		maxTokens: config.maxTokens,
		maxUses: config.maxUses,
		recordRequest: (request) => {
			ctx.get("agents")?.currentInitiator()?.session.append("web/deepseek-search-llm-request", request);
		}
	};
}
/** Register the DeepSeek search provider with `ctx.web`. */
function apply(ctx, config) {
	ctx.web.registerSearchProvider(new DeepSeekSearchProvider(() => resolveOptions(ctx, {
		apiKey: config.apiKey.get(),
		apiKeyEnv: config.apiKeyEnv.get(),
		baseURL: config.baseURL.get(),
		model: config.model.get(),
		apiVersion: config.apiVersion.get(),
		maxTokens: config.maxTokens.get(),
		maxUses: config.maxUses.get()
	})));
}
//#endregion
export { Config, DEEPSEEK_DEFAULT_API_VERSION, DEEPSEEK_DEFAULT_BASE_URL, DEEPSEEK_DEFAULT_MAX_TOKENS, DEEPSEEK_DEFAULT_MAX_USES, DEEPSEEK_DEFAULT_MODEL, DEEPSEEK_PROVIDER_ID, DeepSeekSearchProvider, WEB_SEARCH_DEEPSEEK_SETTINGS_NAMESPACE, apply, inject, name };
