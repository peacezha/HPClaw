import z from "@deepseek-ai/schemastery";
import semver from "semver";
import { evaluatePluginCompatibility, getDshRuntimeVersion } from "@deepseek-ai/dsh-app-boot";
import { marketInstallTarget } from "@deepseek-ai/dsh-plugin-market-index";
import { MAX_TIMER_DELAY_MS } from "@deepseek-ai/dsh-timeout";
import { Remote, RemoteError, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { Worker } from "node:worker_threads";
import MiniSearch from "minisearch";
import { assertNever } from "@deepseek-ai/dsh-util-values";
//#region lib/types/index-url.js
/** Index source URL validation shared by `setIndexes` and the per-use check of configured sources. */
/**
* Validate and normalize one index source URL.
* @param text - URL as configured or entered.
* @returns the URL's serialization.
* @throws {RemoteError} `plugin-market/invalid-index-url` for anything but an http(s) URL without credentials or
* fragment.
*/
function normalizeIndexUrl(text) {
	let url;
	try {
		url = new URL(text.trim());
	} catch {
		throw new RemoteError("plugin-market/invalid-index-url", `Not an absolute URL: ${text}`, {
			url: text,
			reason: "not-absolute"
		});
	}
	if (url.protocol !== "https:" && url.protocol !== "http:") throw new RemoteError("plugin-market/invalid-index-url", `Index URLs use http or https: ${text}`, {
		url: text,
		reason: "scheme"
	});
	if (url.username !== "" || url.password !== "" || url.href.includes("#")) throw new RemoteError("plugin-market/invalid-index-url", `Index URLs carry no credentials or fragment: ${text}`, {
		url: text,
		reason: "credentials-or-fragment"
	});
	return url.href;
}
//#endregion
//#region lib/types/parse-thread.js
/** Runs index parsing in a fresh Worker Thread, so a large index does not block the Host event loop. */
function workerSpawn() {
	/* v8 ignore next -- built-artifact runs own the bundled path. */
	if (!import.meta.url.endsWith(".ts")) return {
		entry: new URL("./worker.cjs", import.meta.url),
		options: { execArgv: [] }
	};
	const bootstrap = [
		`import { register as registerEsm } from ${JSON.stringify(import.meta.resolve("tsx/esm/api"))}`,
		`import { register as registerCjs } from ${JSON.stringify(import.meta.resolve("tsx/cjs/api"))}`,
		"registerCjs()",
		"registerEsm()",
		`await import(${JSON.stringify(new URL("./worker.ts", import.meta.url).href)})`
	].join("\n");
	return {
		entry: new URL(`data:text/javascript,${encodeURIComponent(bootstrap)}`),
		options: { execArgv: [] }
	};
}
/** Whether a Worker message is a parse result: an index object, or a violation's path, reason, and message. */
function isResult(value) {
	if (typeof value !== "object" || value === null) return false;
	const result = value;
	return result.ok === true ? typeof result.index === "object" && result.index !== null : result.ok === false && [
		result.path,
		result.reason,
		result.message
	].every((field) => typeof field === "string");
}
/**
* Run `parseIndexBody` in a fresh Worker Thread. The body's buffer is transferred to the Worker and is unusable
* afterwards; the result is copied back by structured clone.
* @param body - the complete response body; it must own its whole buffer.
* @param url - the index URL.
* @param signal - terminates the Worker and rejects with the signal's reason.
* @returns the Worker's result.
* @throws the abort reason, or an Error when the Worker fails, exits without a result, or reports an unexpected value.
*/
async function parseIndexInWorker(body, url, signal) {
	signal.throwIfAborted();
	const { entry, options } = workerSpawn();
	const request = {
		body,
		url
	};
	const worker = new Worker(entry, {
		...options,
		workerData: request,
		transferList: [body.buffer]
	});
	return await new Promise((resolve, reject) => {
		let settled = false;
		const settle = (finish) => {
			if (settled) return;
			settled = true;
			signal.removeEventListener("abort", abort);
			worker.terminate().then(finish, finish);
		};
		const abort = () => {
			settle(() => {
				reject(signal.reason);
			});
		};
		signal.addEventListener("abort", abort, { once: true });
		worker.once("message", (value) => {
			settle(() => {
				if (isResult(value)) resolve(value);
				else reject(/* @__PURE__ */ new Error("index parser reported an unexpected value"));
			});
		});
		worker.once("error", (error) => {
			settle(() => {
				reject(error);
			});
		});
		worker.once("exit", (code) => {
			settle(() => {
				reject(/* @__PURE__ */ new Error(`index parser exited before reporting a result (code ${String(code)})`));
			});
		});
	});
}
//#endregion
//#region lib/types/search.js
/** Filtering, fuzzy text matching, and ordering of one validated index's plugins. */
/**
* Letters, marks, and digits used by CJK scripts, which write words without spaces between them; script extensions
* include shared characters such as the prolonged sound mark ー and the iteration mark 々.
*/
const CJK = String.raw`[[\p{scx=Han}\p{scx=Hira}\p{scx=Kana}\p{scx=Hang}]&&[\p{L}\p{M}\p{N}]]`;
/** A run of CJK characters, or a run of other letters, marks, and digits. */
const RUN = new RegExp(String.raw`${CJK}+|[[\p{L}\p{M}\p{N}]--${CJK}]+`, "gv");
const CJK_START = new RegExp(String.raw`^${CJK}`, "v");
/**
* Split NFKC-normalized text into search terms, so composed and decomposed forms, half-width kana, and compatibility
* characters yield the same terms. A CJK run yields its overlapping character pairs and its last character, so a query
* matches without word segmentation and every character of the run starts some term.
* @param text - indexed or queried text.
* @returns the terms in text order, not yet lowercased.
*/
function searchTerms(text) {
	return [...text.normalize("NFKC").matchAll(RUN)].flatMap(([run]) => {
		if (!CJK_START.test(run)) return [run];
		const chars = Array.from(run);
		return [...chars.slice(1).map((char, position) => `${chars[position]}${char}`), chars.at(-1)];
	});
}
/** Every language variant of a localized text. */
function variants(text) {
	if (text === void 0) return [];
	return typeof text === "string" ? [text] : Object.values(text);
}
/** Plugins indexed per event-loop turn while the text index is built. */
const BUILD_CHUNK = 500;
/** Matches queries against one index; the text index is built on the first query with text, yielding between chunks. */
var MarketSearch = class {
	index;
	engine;
	/** @param index - the validated index to search. */
	constructor(index) {
		this.index = index;
	}
	/**
	* Select and order the plugins matching a query.
	* @param selection - text, filters, and order.
	* @returns every matching plugin in result order.
	*/
	async select(selection) {
		const plugins = this.index.plugins;
		const text = selection.text ?? "";
		const scores = /* @__PURE__ */ new Map();
		let positions;
		if (searchTerms(text).length === 0) positions = plugins.map((_plugin, position) => position);
		else {
			for (const result of await this.search(text)) scores.set(result.id, result.score);
			positions = [...scores.keys()].sort((a, b) => a - b);
		}
		const labels = selection.labels ?? [];
		const matching = positions.filter((position) => {
			const { metadata } = plugins[position];
			return (selection.category === void 0 || metadata.category === selection.category) && labels.every((label) => metadata.labels.includes(label));
		});
		return this.order(matching, selection.sort, scores).map((position) => plugins[position]);
	}
	async search(text) {
		this.engine ??= this.build();
		return (await this.engine).search(text);
	}
	async build() {
		const { categories, labels } = this.index.metadata;
		const engine = new MiniSearch({
			fields: [
				"name",
				"title",
				"keywords",
				"description",
				"author",
				"taxonomy"
			],
			storeFields: [],
			tokenize: searchTerms,
			processTerm: (term) => term.toLowerCase(),
			searchOptions: {
				boost: {
					name: 3,
					title: 3,
					keywords: 2
				},
				prefix: true,
				fuzzy: (term) => term.length >= 4 ? .2 : false,
				maxFuzzy: 2,
				combineWith: "AND"
			}
		});
		await engine.addAllAsync(this.index.plugins.map((plugin, id) => {
			const { category, keywords } = plugin.metadata;
			const title = (declarations, id) => variants(declarations[id].title);
			const taxonomy = [...category === void 0 ? [] : title(categories, category), ...plugin.metadata.labels.flatMap((label) => title(labels, label))];
			return {
				id,
				name: plugin.name,
				title: variants(plugin.title).join("\n"),
				keywords: keywords.join("\n"),
				description: variants(plugin.description).join("\n"),
				author: plugin.author ?? "",
				taxonomy: taxonomy.join("\n")
			};
		}), { chunkSize: BUILD_CHUNK });
		return engine;
	}
	order(positions, sort, scores) {
		switch (sort.kind) {
			case "index": return positions;
			case "relevance": return positions.sort((a, b) => (scores.get(b) ?? 0) - (scores.get(a) ?? 0) || a - b);
			case "published":
			case "key": {
				const value = (position) => {
					const plugin = this.index.plugins[position];
					if (sort.kind === "published") return Math.max(...plugin.versions.map((version) => version.publishTimestamp));
					return Object.hasOwn(plugin.metadata.sortKeys, sort.id) ? plugin.metadata.sortKeys[sort.id] : void 0;
				};
				const sign = sort.direction === "asc" ? 1 : -1;
				return positions.map((position) => ({
					position,
					value: value(position)
				})).sort((a, b) => {
					if (a.value === void 0 || b.value === void 0) return a.value === b.value ? a.position - b.position : a.value === void 0 ? 1 : -1;
					return (a.value - b.value) * sign || a.position - b.position;
				}).map((item) => item.position);
			}
			/* v8 ignore next -- the Gateway validates `sort` against the closed union */
			default: return assertNever(sort);
		}
	}
};
//#endregion
//#region lib/types/index.js
/** Host reader of configured plugin market indexes for the Discover page and the `plugin_market` tool. */
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
/** The exact diagnostic of a failure, including a non-Error rejection. */
function messageOf(error) {
	return error instanceof Error ? error.message : String(error);
}
/** Causes followed below a rejection; a deeper or cyclic chain is cut there. */
const MAX_CAUSES = 4;
/** A rejection with its cause chain: a Node `fetch` failure is a bare `fetch failed` whose reason is its cause. */
function causeChainOf(error, depth = 0) {
	return error instanceof Error && error.cause !== void 0 && depth < MAX_CAUSES ? `${error.message}: ${causeChainOf(error.cause, depth + 1)}` : messageOf(error);
}
/** Largest page `search` returns. */
const MAX_LIMIT = 100;
let PluginMarket = (() => {
	let _classSuper = TypertRemoteService;
	let _instanceExtraInitializers = [];
	let _listIndexes_decorators;
	let _setIndexes_decorators;
	let _search_decorators;
	return class PluginMarket extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_listIndexes_decorators = [Remote];
			_setIndexes_decorators = [Remote];
			_search_decorators = [Remote];
			__esDecorate(this, null, _listIndexes_decorators, {
				kind: "method",
				name: "listIndexes",
				static: false,
				private: false,
				access: {
					has: (obj) => "listIndexes" in obj,
					get: (obj) => obj.listIndexes
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _setIndexes_decorators, {
				kind: "method",
				name: "setIndexes",
				static: false,
				private: false,
				access: {
					has: (obj) => "setIndexes" in obj,
					get: (obj) => obj.setIndexes
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _search_decorators, {
				kind: "method",
				name: "search",
				static: false,
				private: false,
				access: {
					has: (obj) => "search" in obj,
					get: (obj) => obj.search
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
		static inject = ["pluginManager"];
		static Config = z.object({
			indexes: z.array(z.string().pattern(/^https?:\/\/\S+$/u)).default([]).volatile(),
			fetchTimeoutMs: z.natural().min(1).max(MAX_TIMER_DELAY_MS).default(15e3),
			maxBytes: z.natural().min(1).default(128 * 1024 * 1024),
			cacheTtlMs: z.natural().default(6e5)
		});
		lifetime = new AbortController();
		cache = /* @__PURE__ */ new Map();
		pending = /* @__PURE__ */ new Map();
		errors = /* @__PURE__ */ new Map();
		entryId;
		constructor(ctx, config) {
			super(ctx, "pluginMarket");
			this.config = config;
			this.entryId = ctx.fiber.entry?.options.id;
			ctx.on("loader/volatile-update", () => {
				const configured = new Set(this.sources().flatMap((source) => source.error === void 0 ? [source.url] : []));
				for (const url of [...this.cache.keys(), ...this.errors.keys()]) if (!configured.has(url)) {
					this.cache.delete(url);
					this.errors.delete(url);
				}
				ctx.emit("plugin-market/changed");
			});
			ctx.effect(() => async () => {
				this.lifetime.abort(/* @__PURE__ */ new Error("Plugin market disposed"));
				await Promise.allSettled(this.pending.values());
			});
		}
		/**
		* List the configured index sources without fetching them.
		* @returns every source in order, with the title of its last successful read and, when the last read failed, its error.
		*/
		listIndexes() {
			return this.sources().map(({ url, error: invalid }) => {
				const index = this.cache.get(url)?.document.index;
				const error = invalid ?? this.errors.get(url);
				return {
					url,
					...index === void 0 ? {} : {
						title: index.title,
						...index.description === void 0 ? {} : { description: index.description }
					},
					...error === void 0 ? {} : { error }
				};
			});
		}
		/**
		* Replace the configured index sources through Settings, without remounting this service.
		* `plugin-market/changed` announces the committed list. A URL already configured is kept as written, so a client can
		* add or remove sources beside one that `listIndexes` reports as unusable.
		* @param urls - index URLs in display order.
		* @throws {RemoteError} `plugin-market/invalid-index-url` for an invalid new URL or a repeated URL;
		* `plugin-market/settings-unavailable` without Settings or a profile entry.
		*/
		async setIndexes(urls) {
			const configured = new Set(this.config.indexes.get());
			const normalized = urls.map((url) => configured.has(url) ? url : normalizeIndexUrl(url));
			const keys = normalized.map((url) => URL.canParse(url) ? new URL(url).href : url);
			const repeated = normalized.find((_url, position) => keys.indexOf(keys[position]) !== position);
			if (repeated !== void 0) throw new RemoteError("plugin-market/invalid-index-url", `Index source listed twice: ${repeated}`, {
				url: repeated,
				reason: "duplicate"
			});
			const settings = this.ctx.get("settings");
			if (settings === void 0 || this.entryId === void 0) throw new RemoteError("plugin-market/settings-unavailable", "Index sources require the settings service and a profile entry", {});
			await settings.update(this.entryId, { indexes: normalized });
		}
		/**
		* Return one page of the plugins of a configured index that match a query. Concurrent reads of a URL share one
		* fetch; a successful document is reused for `cacheTtlMs` unless `refresh` is set. Matching and ordering read only
		* the document; installation status and compatibility are computed for the returned page on every call.
		* @param url - a configured index URL.
		* @param query - text, filters, order, page, and whether to bypass the cached document.
		* @returns the index header, the page's plugins with each plugin's default version and installation status and each
		*   version's compatibility and install arguments, the number of matches, and the next page's offset.
		* @throws {RemoteError} `plugin-market/invalid-query`, `plugin-market/unknown-index`, `plugin-market/invalid-index-url`,
		*   `plugin-market/fetch-failed`, or `plugin-market/invalid-index`.
		*/
		async search(url, query) {
			if (!Number.isSafeInteger(query.offset) || query.offset < 0) throw new RemoteError("plugin-market/invalid-query", "offset must be a non-negative integer", {
				field: "offset",
				reason: "range"
			});
			if (!Number.isInteger(query.limit) || query.limit < 1 || query.limit > MAX_LIMIT) throw new RemoteError("plugin-market/invalid-query", `limit must be an integer from 1 to ${String(MAX_LIMIT)}`, {
				field: "limit",
				reason: "range"
			});
			const document = await this.document(url, query.refresh === true, query.fetchedAt);
			const matching = await document.search.select(query);
			const page = matching.slice(query.offset, query.offset + query.limit);
			const listing = await this.annotator();
			const next = query.offset + page.length;
			const { index } = document;
			return {
				url,
				title: index.title,
				...index.description === void 0 ? {} : { description: index.description },
				metadata: index.metadata,
				fetchedAt: document.fetchedAt,
				entries: page.map(listing),
				total: matching.length,
				nextOffset: next < matching.length ? next : null
			};
		}
		/**
		* Read one plugin of a configured index, using the cached document as `search` does.
		* @param url - a configured index URL.
		* @param name - the plugin's package name.
		* @returns the plugin with its default version, installation status, and annotated versions; undefined when the
		*   index does not list it.
		* @throws {RemoteError} `plugin-market/unknown-index`, `plugin-market/invalid-index-url`, `plugin-market/fetch-failed`,
		*   or `plugin-market/invalid-index`.
		*/
		async entry(url, name) {
			const plugin = (await this.document(url, false)).index.plugins.find((candidate) => candidate.name === name);
			return plugin === void 0 ? void 0 : (await this.annotator())(plugin);
		}
		async document(url, refresh, fetchedAt) {
			const source = this.sources().find((candidate) => candidate.url === url);
			if (source === void 0) throw new RemoteError("plugin-market/unknown-index", `Not a configured index source: ${url}`, { url });
			if (source.error !== void 0) throw new RemoteError("plugin-market/invalid-index-url", source.error, {
				url,
				reason: "configured"
			});
			const cached = this.cache.get(url);
			const usable = cached !== void 0 && (cached.expiresAt > Date.now() || cached.document.fetchedAt === fetchedAt);
			return !refresh && usable ? cached.document : await this.fetchShared(url);
		}
		/** Annotate plugins with the profile's bundles and exemptions as they are now. */
		async annotator() {
			const [bundles, { exemptions }] = [await this.ctx.pluginManager.listBundles(), this.ctx.pluginManager.listVersionExemptions()];
			const runtimeVersion = getDshRuntimeVersion();
			return (plugin) => listingOf(plugin, bundles, exemptions, runtimeVersion);
		}
		/**
		* The configured sources as written, each with the refusal that makes it unusable. Settings and profile files can
		* write any http(s) string, so every use validates instead of the schema; an unusable source is listed with its error
		* and never fetched, and a repeated URL counts once.
		*/
		sources() {
			const seen = /* @__PURE__ */ new Set();
			return this.config.indexes.get().flatMap((url) => {
				if (seen.has(url)) return [];
				seen.add(url);
				try {
					return normalizeIndexUrl(url) === url ? [{ url }] : [{
						url,
						error: `Index URL is not in canonical form; use ${normalizeIndexUrl(url)}`
					}];
				} catch (error) {
					return [{
						url,
						error: messageOf(error)
					}];
				}
			});
		}
		configured(url) {
			return this.sources().some((source) => source.url === url && source.error === void 0);
		}
		fetchShared(url) {
			let pending = this.pending.get(url);
			if (pending === void 0) {
				pending = this.fetchIndex(url).then((index) => {
					const document = {
						index,
						fetchedAt: Math.max(Date.now(), (this.cache.get(url)?.document.fetchedAt ?? 0) + 1),
						search: new MarketSearch(index)
					};
					if (this.configured(url)) {
						this.cache.set(url, {
							document,
							expiresAt: Date.now() + this.config.cacheTtlMs
						});
						this.errors.delete(url);
					}
					return document;
				}, (error) => {
					if (this.configured(url)) this.errors.set(url, messageOf(error));
					throw error;
				}).finally(() => {
					this.pending.delete(url);
				});
				this.pending.set(url, pending);
			}
			return pending;
		}
		async fetchIndex(url) {
			const signal = AbortSignal.any([this.lifetime.signal, AbortSignal.timeout(this.config.fetchTimeoutMs)]);
			const failed = (reason, cause) => new RemoteError("plugin-market/fetch-failed", `Could not fetch ${url}: ${reason}`, {
				url,
				reason
			}, { cause });
			let response;
			try {
				response = await fetch(url, {
					signal,
					redirect: "error",
					headers: { accept: "application/json" }
				});
			} catch (error) {
				throw failed(causeChainOf(error), error);
			}
			if (!response.ok) {
				await response.body?.cancel();
				throw failed(`HTTP ${String(response.status)}`);
			}
			const result = await parseIndexInWorker(await this.readBody(response, failed), url, this.lifetime.signal).catch((error) => {
				throw failed(messageOf(error), error);
			});
			if (result.ok) return result.index;
			throw new RemoteError("plugin-market/invalid-index", `${url}: ${result.message}`, {
				url,
				path: result.path,
				reason: result.reason
			});
		}
		/** Read the whole body, refusing it as soon as it exceeds `maxBytes`. */
		async readBody(response, failed) {
			const limit = this.config.maxBytes;
			const tooLarge = `body exceeds ${String(limit)} bytes`;
			if (Number(response.headers.get("content-length") ?? 0) > limit) {
				await response.body?.cancel();
				throw failed(tooLarge);
			}
			const chunks = [];
			let size = 0;
			try {
				for await (const chunk of response.body ?? []) {
					size += chunk.byteLength;
					if (size > limit) throw failed(tooLarge);
					chunks.push(chunk);
				}
			} catch (error) {
				if (error instanceof RemoteError) throw error;
				throw failed(messageOf(error), error);
			}
			const body = new Uint8Array(size);
			let offset = 0;
			for (const chunk of chunks) {
				body.set(chunk, offset);
				offset += chunk.byteLength;
			}
			return body;
		}
	};
})();
function listingOf(plugin, bundles, exemptions, runtimeVersion) {
	const versions = plugin.versions.map((version) => ({
		...version,
		install: marketInstallTarget(plugin.name, version),
		compatibility: compatibilityOf(plugin.name, version, exemptions, runtimeVersion)
	}));
	const compatible = versions.filter((version) => version.compatibility.compatible);
	const stable = plugin.versions.some((version) => semver.prerelease(version.version) === null);
	const defaultVersion = compatible.find((version) => !stable || semver.prerelease(version.version) === null)?.version;
	/* v8 ignore next -- parseMarketIndex guarantees a non-empty version list */
	const measured = defaultVersion ?? versions[0]?.version ?? "";
	return {
		...plugin,
		versions,
		...defaultVersion === void 0 ? {} : { defaultVersion },
		installation: installationOf(plugin.name, measured, bundles)
	};
}
function installationOf(name, version, bundles) {
	const bundle = bundles.find((candidate) => candidate.name === name);
	if (bundle === void 0 || !bundle.installed && bundle.availability !== "installation") return { status: "not-installed" };
	if (!bundle.installed) return {
		status: "provided",
		...bundle.version === void 0 ? {} : { installedVersion: bundle.version }
	};
	if (bundle.version === void 0) return { status: "different-version" };
	const installedVersion = bundle.version;
	if (installedVersion === version) return {
		status: "installed",
		installedVersion
	};
	return {
		status: semver.valid(installedVersion) !== null && semver.gt(version, installedVersion) ? "update-available" : "different-version",
		installedVersion
	};
}
function compatibilityOf(name, version, exemptions, runtimeVersion) {
	const issue = evaluatePluginCompatibility({
		name,
		version: version.version,
		...version.engines.dsh === void 0 ? {} : { engines: { dsh: version.engines.dsh } }
	}, exemptions, runtimeVersion);
	if (issue === void 0) return { compatible: true };
	return {
		compatible: false,
		runtimeVersion: issue.runtimeVersion,
		requirements: issue.requirements,
		exempted: issue.exempted
	};
}
//#endregion
export { PluginMarket as default };
