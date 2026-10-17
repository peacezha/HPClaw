import { createRequire, isBuiltin } from "node:module";
import assert from "node:assert/strict";
import { AsyncLocalStorage } from "node:async_hooks";
import { basename, dirname, join, relative, resolve, sep, toNamespacedPath } from "node:path";
import { realpath, stat } from "node:fs/promises";
import { watch } from "chokidar";
import { Inject, Service } from "@deepseek-ai/cordis";
import { existsSync, lstatSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, statSync, writeFileSync } from "node:fs";
import { PROFILE_PATCH_FILENAME, readProfileManifest, readProfilePatches, recomposeProfile } from "@deepseek-ai/dsh-app-boot";
import { codeFrameColumns } from "@babel/code-frame";
import { isUtf8 } from "node:buffer";
import { fileURLToPath, pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import picomatch from "picomatch";
import z from "@deepseek-ai/schemastery";
//#region lib/types/watch-config.js
/** Exact-path watching for live profile patch files outside Cordis module roots. */
const registrations = /* @__PURE__ */ new WeakMap();
async function findWatchRoot(filename) {
	let root = dirname(filename);
	let depth = 0;
	while (true) try {
		if (!(await stat(root)).isDirectory()) throw new Error(`config watch parent is not a directory: ${root}`);
		const canonicalRoot = await realpath(root);
		return {
			filename: resolve(canonicalRoot, relative(root, filename)),
			root: canonicalRoot,
			depth
		};
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
		const parent = dirname(root);
		if (parent === root) throw error;
		root = parent;
		depth += 1;
	}
}
/**
* Watch one patch path and its parent chain without subscribing to sibling files or directories.
* Missing parents are observed as they appear; refresh callbacks run serially.
* @param ctx Context that owns watcher disposal and receives refresh failures.
* @param filename Absolute patch-file path.
* @param options Deployment watcher options; configuration watches enable write stabilization by default.
* @param refresh Callback for additions, changes, and removals.
* @param inTransaction Whether disposal is running inside the refresh being removed.
* @returns A disposer that closes the watcher and drains its current refresh.
* @throws When path resolution, watcher startup, or effect registration fails.
*/
async function watchConfig(ctx, filename, options, refresh, inTransaction = () => false) {
	const target = await findWatchRoot(filename);
	const paths = registrations.get(ctx) ?? /* @__PURE__ */ new Set();
	registrations.set(ctx, paths);
	if (paths.has(target.filename)) throw new Error(`config path already registered: ${filename}`);
	const { cwd: _cwd, ignored: _ignored, ...watchOptions } = options;
	const watcher = watch(target.root, {
		awaitWriteFinish: true,
		...watchOptions,
		depth: target.depth,
		ignoreInitial: false,
		ignored: (path) => {
			const remainder = relative(resolve(path), target.filename);
			return remainder === ".." || remainder.startsWith(`..${sep}`);
		}
	});
	paths.add(target.filename);
	const state = { dirty: false };
	let running;
	const onChange = (path) => {
		const observed = resolve(path);
		if (observed !== filename && observed !== target.filename) return;
		state.dirty = true;
		if (running) return;
		running = (async () => {
			while (state.dirty) {
				state.dirty = false;
				try {
					await refresh();
				} catch (reason) {
					const error = reason instanceof Error ? reason : new Error(String(reason), { cause: reason });
					ctx.logger.warn("config reload at %C failed", filename);
					ctx.logger.warn(error);
				}
			}
		})().finally(() => {
			running = void 0;
		});
	};
	watcher.on("add", onChange);
	watcher.on("change", onChange);
	watcher.on("unlink", onChange);
	const ready = Promise.withResolvers();
	let pending = true;
	let disposed = false;
	watcher.once("ready", () => {
		pending = false;
		ready.resolve();
	});
	const onError = (error) => {
		if (disposed) return;
		if (pending) {
			pending = false;
			ready.reject(error);
		} else ctx.logger.warn(error);
	};
	watcher.on("error", onError);
	const dispose = async () => {
		disposed = true;
		const closing = watcher.close();
		watcher.on("error", onError);
		await closing;
		paths.delete(target.filename);
		if (!inTransaction()) await running;
	};
	try {
		await ready.promise;
		return ctx.effect(() => dispose, "hmr.watchConfig()");
	} catch (error) {
		await dispose();
		throw error;
	}
}
//#endregion
//#region lib/types/error.js
function isBuildFailure(e) {
	return e !== null && typeof e === "object" && "errors" in e && Array.isArray(e.errors) && e.errors.every((error) => error !== null && typeof error === "object" && "text" in error && typeof error.text === "string");
}
/** Log HMR build failures with code frames when source locations are available.
* @param ctx Context owning reload diagnostics.
* @param e Failure from the module loader or compiler.
*/
function handleError(ctx, e) {
	if (!isBuildFailure(e)) {
		ctx.logger.warn(e);
		return;
	}
	for (const error of e.errors) {
		if (!error.location) {
			ctx.logger.warn(error.text);
			continue;
		}
		try {
			const { file, line, column } = error.location;
			const formatted = codeFrameColumns(readFileSync(file, "utf8"), { start: {
				line,
				column
			} }, {
				highlightCode: true,
				message: error.text
			});
			ctx.logger.warn(`File: ${file}:${line}:${column}\n` + formatted);
		} catch (e) {
			ctx.logger.warn(e);
		}
	}
}
//#endregion
//#region lib/types/package-manifest.js
/** Expire Node's cached package configuration for package directories whose manifest changed. */
/** Snapshot own methods; each disposer restores its method only while its replacement is still installed. */
function createReplaceHelper(target) {
	const rawImpl = { ...target };
	return {
		rawImpl,
		replaceMethod(key, replacement) {
			target[key] = replacement;
			return () => {
				if (target[key] === replacement) target[key] = rawImpl[key];
			};
		}
	};
}
/** Same lookup as the vendored Loader's `requireInternal`: `--expose-internals` first, then the builtin addon. */
function requireInternal(id) {
	const require = createRequire(import.meta.url);
	if (process.execArgv.includes("--expose-internals")) try {
		return require(id);
	} catch (_error) {}
	try {
		return require("node-addon-require-builtin").requireBuiltin(id);
	} catch (_error) {}
}
function loadNodeInternals() {
	const realm = requireInternal("internal/bootstrap/realm");
	const esm = requireInternal("internal/modules/esm/loader");
	return {
		binding: realm.internalBinding("modules"),
		reader: requireInternal("internal/modules/package_json_reader"),
		ResolveCache: requireInternal("internal/modules/esm/module_map").ResolveCache,
		cjs: requireInternal("internal/modules/cjs/loader").Module,
		esmLoader: esm.getOrInitializeCascadedLoader()
	};
}
/**
* Read the ESM loader's resolution cache by observing one lookup through its prototype.
* The prototype method is restored before this returns.
*/
function captureEsmResolveCache(native, parentURL) {
	const prototype = native.ResolveCache.prototype;
	const original = prototype.get;
	const seen = /* @__PURE__ */ new Set();
	prototype.get = function(key, parent) {
		seen.add(this);
		return Reflect.apply(original, this, [key, parent]);
	};
	try {
		const loader = native.esmLoader;
		/* v8 ignore else -- CI coverage runs the Node 24 loader; the Node 22 matrix exercises the v1 signature */
		if ("getOrCreateModuleJob" in loader) loader.resolveSync(parentURL, {
			specifier: "node:path",
			attributes: {}
		});
		else loader.resolveSync("node:path", parentURL, {});
	} finally {
		prototype.get = original;
	}
	return [...seen][0];
}
/** Package directories whose manifests are read from disk instead of Node's native cache. */
var PackageManifests = class {
	directories = /* @__PURE__ */ new Set();
	configurations = /* @__PURE__ */ new Map();
	/** Real directory of each directory a lookup reached; linked consumers name a package by its link path. */
	realDirectories = /* @__PURE__ */ new Map();
	native;
	rawBinding;
	rawReader;
	rawCommonJs;
	restorers = [];
	/**
	* Expire cached configuration for one package directory. Loaded modules stay evaluated; later resolutions and
	* format checks read the manifest on disk.
	* @param manifest - absolute path of the changed `package.json`.
	*/
	invalidate(manifest) {
		const native = this.installPackageHooks();
		const directory = dirname(manifest);
		this.directories.add(directory);
		this.configurations.clear();
		this.realDirectories.clear();
		for (const key of Object.keys(native.cjs._pathCache)) Reflect.deleteProperty(native.cjs._pathCache, key);
		const cache = captureEsmResolveCache(native, pathToFileURL(directory).href + "/");
		/* v8 ignore else -- asynchronous loader hooks own a separate cache; loader-thread invalidation is deferred */
		if (cache !== void 0) Map.prototype.clear.call(cache);
	}
	/** Restore every replaced Node method this instance installed. */
	dispose() {
		for (const restore of this.restorers.splice(0).reverse()) restore();
		this.native = void 0;
		this.realDirectories.clear();
	}
	isPathWithinDirectory(path, directory) {
		return path === directory || path.startsWith(join(directory, sep));
	}
	isPathInInvalidatedDirectory(path) {
		const parent = dirname(path);
		let real = this.realDirectories.get(parent);
		if (real === void 0) {
			try {
				real = realpathSync(parent);
			} catch (_error) {
				real = parent;
			}
			this.realDirectories.set(parent, real);
		}
		const target = join(real, basename(path));
		for (const directory of this.directories) if (this.isPathWithinDirectory(target, directory)) return true;
		return false;
	}
	isUrlInInvalidatedDirectory(url) {
		try {
			return this.isPathInInvalidatedDirectory(fileURLToPath(url));
		} catch (_error) {
			return false;
		}
	}
	installPackageHooks() {
		if (this.native !== void 0) return this.native;
		const native = loadNodeInternals();
		this.native = native;
		const binding = createReplaceHelper(native.binding);
		const reader = createReplaceHelper(native.reader);
		const commonJs = createReplaceHelper(native.cjs);
		this.rawBinding = binding.rawImpl;
		this.rawReader = reader.rawImpl;
		this.rawCommonJs = commonJs.rawImpl;
		this.restorers.push(binding.replaceMethod("readPackageJSON", this.hookBindingReadPackageJSON.bind(this)), binding.replaceMethod("getPackageScopeConfig", this.hookBindingGetPackageScopeConfig.bind(this)), binding.replaceMethod("getPackageType", this.hookBindingGetPackageType.bind(this)), reader.replaceMethod("getNearestParentPackageJSON", this.hookReaderGetNearestParentPackageJSON.bind(this)), commonJs.replaceMethod("_load", this.hookCommonJsLoad.bind(this)));
		return native;
	}
	hookCommonJsLoad(...[request, parent, isMain, ...options]) {
		const native = this.installPackageHooks();
		const filename = request.startsWith("node:") || isBuiltin(request) ? request : native.cjs._resolveFilename(request, parent, isMain);
		return this.rawCommonJs._load.call(native.cjs, filename, parent, isMain, ...options);
	}
	hookBindingReadPackageJSON(path, isEsm, base, specifier) {
		return this.isPathInInvalidatedDirectory(path) ? this.readCachedPackageConfig(path, isEsm && base !== void 0 ? {
			base,
			specifier
		} : void 0)?.serialized : this.rawBinding.readPackageJSON(path, isEsm, base, specifier);
	}
	hookBindingGetPackageScopeConfig(url) {
		if (!this.isUrlInInvalidatedDirectory(url)) return this.rawBinding.getPackageScopeConfig(url);
		const found = this.findNearestPackageConfig(fileURLToPath(url), true);
		if (typeof found === "string") return this.rawBinding.getPackageScopeConfig(pathToFileURL(found).href);
		return found.configuration?.serialized ?? found.path;
	}
	hookBindingGetPackageType(url) {
		if (!this.isUrlInInvalidatedDirectory(url)) return this.rawBinding.getPackageType(url);
		const found = this.findNearestPackageConfig(fileURLToPath(url), true);
		return typeof found === "string" ? this.rawBinding.getPackageType(pathToFileURL(found).href) : found.configuration?.data.type;
	}
	hookReaderGetNearestParentPackageJSON(path) {
		if (!this.isPathInInvalidatedDirectory(path)) return this.rawReader.getNearestParentPackageJSON(path);
		const found = this.findNearestPackageConfig(path, false);
		if (typeof found === "string") return this.rawReader.getNearestParentPackageJSON(found);
		if (found.configuration === void 0) return this.rawReader.getNearestParentPackageJSON(path);
		return {
			data: found.configuration.data,
			exists: true,
			path: found.path
		};
	}
	readCachedPackageConfig(path, context) {
		if (!this.configurations.has(path)) this.configurations.set(path, this.readPackageConfigFromDisk(path, context));
		return this.configurations.get(path);
	}
	/** A string names the first manifest outside the invalidated directories; Node answers for it. */
	findNearestPackageConfig(path, includeRoot) {
		let directory = dirname(path);
		while (true) {
			const manifest = join(directory, "package.json");
			const parent = dirname(directory);
			if (basename(directory) === "node_modules" || !includeRoot && parent === directory) return { path: manifest };
			if (!this.isPathInInvalidatedDirectory(manifest)) return manifest;
			const configuration = this.readCachedPackageConfig(manifest);
			if (configuration !== void 0) return {
				path: toNamespacedPath(manifest),
				configuration
			};
			/* v8 ignore next -- root-scope queries run in an isolated child to contain non-termination */
			if (parent === directory) return { path: manifest };
			directory = parent;
		}
	}
	/** @param context - optional ESM import details used only when reporting invalid package configuration. */
	readPackageConfigFromDisk(path, context) {
		let bytes;
		try {
			bytes = readFileSync(path);
		} catch (_error) {
			return;
		}
		const throwInvalidPackageConfig = () => {
			const base = context?.base;
			const importing = base === void 0 ? "" : ` while importing "${context?.specifier}" from ${base.startsWith("file:") ? fileURLToPath(base) : base}`;
			throw Object.assign(/* @__PURE__ */ new Error(`Invalid package config ${toNamespacedPath(path)}${importing}.`), { code: "ERR_INVALID_PACKAGE_CONFIG" });
		};
		if (!isUtf8(bytes)) return throwInvalidPackageConfig();
		const source = bytes.toString("utf8");
		let parsed;
		try {
			parsed = JSON.parse(source.charCodeAt(0) === 65279 ? source.slice(1) : source);
		} catch (_error) {
			return throwInvalidPackageConfig();
		}
		if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) return throwInvalidPackageConfig();
		const fields = parsed;
		if (fields.name !== void 0 && typeof fields.name !== "string") return throwInvalidPackageConfig();
		if (fields.type !== void 0 && typeof fields.type !== "string") return throwInvalidPackageConfig();
		for (const key of [
			"name",
			"type",
			"exports",
			"imports"
		]) {
			const value = fields[key];
			if (typeof value === "string" && !value.isWellFormed()) return throwInvalidPackageConfig();
		}
		const normalizePackageJsonField = (value) => value !== null && (typeof value === "string" || typeof value === "object") ? value : void 0;
		const data = {
			...typeof fields.name === "string" ? { name: fields.name } : {},
			...typeof fields.main === "string" && fields.main.isWellFormed() ? { main: fields.main } : {},
			type: fields.type === "module" || fields.type === "commonjs" ? fields.type : "none",
			exports: normalizePackageJsonField(fields.exports),
			imports: normalizePackageJsonField(fields.imports)
		};
		const serializePackageJsonField = (value) => value === void 0 ? void 0 : typeof value === "string" ? value : JSON.stringify(value);
		return {
			data,
			serialized: [
				data.name,
				data.main,
				data.type,
				serializePackageJsonField(data.imports),
				serializePackageJsonField(data.exports),
				toNamespacedPath(path)
			]
		};
	}
};
//#endregion
//#region lib/types/module-files.js
/** Disk identities of loaded module files, used to find modules whose files changed after loading. */
/**
* Coarsest file timestamp resolution among supported filesystems (FAT stores modification times in 2-second units).
* An unrecorded file modified within this interval before the last observation is treated as possibly changed.
*/
const TIMESTAMP_RESOLUTION_MS = 2e3;
function identityOf(url) {
	let stats;
	try {
		stats = statSync(fileURLToPath(url));
	} catch (_error) {
		return;
	}
	return {
		key: `${String(stats.ino)}:${String(stats.size)}:${String(stats.mtimeMs)}`,
		modifiedAt: stats.mtimeMs
	};
}
/**
* Records the inode, size and modification time of loaded `file:` modules. A module is stale when its file
* disappeared or its identity differs from the recorded one. Change time is not recorded: creating a hard link to a
* file, as pnpm does when it imports from its store, changes it without changing content. A module first loaded after
* the last observation has no record; it is stale when its file was modified at or after that observation, less the
* timestamp resolution, so a reinstall between loading and the next comparison is detected at the cost of reloading a
* module that was first loaded after such a write.
*/
var ModuleFiles = class {
	/** Identity per recorded module; `undefined` marks a stale module, such as a pending one first loaded after the last observation. */
	records = /* @__PURE__ */ new Map();
	observedAt = Date.now();
	/**
	* The current time of the clock the operating system stamps local file writes with, read from a new marker file that is
	* removed again. The system clock and file timestamps can differ by a clock tick in either direction, so module files
	* are compared with this time; when no marker can be created, the system clock is used.
	* @returns Epoch milliseconds.
	*/
	now() {
		let directory;
		try {
			directory = mkdtempSync(join(tmpdir(), "dsh-hmr-clock-"));
		} catch (_error) {
			return Date.now();
		}
		try {
			const marker = join(directory, "now");
			writeFileSync(marker, "");
			return statSync(marker).mtimeMs;
		} finally {
			rmSync(directory, {
				recursive: true,
				force: true
			});
		}
	}
	/**
	* Compare loaded file modules with disk.
	* @param urls `file:` URLs of the loaded modules to compare.
	* @returns URLs of stale modules, and the identity read for each compared URL (`undefined` for a missing file).
	*/
	compare(urls) {
		const stale = /* @__PURE__ */ new Set();
		const seen = /* @__PURE__ */ new Map();
		for (const url of urls) {
			const identity = identityOf(url);
			seen.set(url, identity?.key);
			if (identity === void 0) {
				stale.add(url);
				continue;
			}
			if (this.records.has(url) ? this.records.get(url) !== identity.key : identity.modifiedAt >= this.observedAt - TIMESTAMP_RESOLUTION_MS) stale.add(url);
		}
		return {
			stale,
			seen
		};
	}
	/**
	* Replace every record with the identities of the given loaded modules.
	* @param urls `file:` URLs of the loaded modules to record.
	* @param options `seen` supplies identities read earlier for modules whose cache entry has not changed since, so a
	* later write stays detectable; other modules are read now, and stay stale when their file was modified after `at`.
	* `retained` modules keep their record, or are marked stale when they have none. `at` is the observation time from
	* {@link now} used for unrecorded modules.
	*/
	observe(urls, options = {}) {
		const { seen = /* @__PURE__ */ new Map(), retained = /* @__PURE__ */ new Set(), at = this.now() } = options;
		const records = /* @__PURE__ */ new Map();
		for (const url of urls) if (retained.has(url)) records.set(url, this.records.get(url));
		else if (seen.has(url)) records.set(url, seen.get(url));
		else {
			const identity = identityOf(url);
			records.set(url, identity === void 0 || identity.modifiedAt > at ? void 0 : identity.key);
		}
		this.records = records;
		this.observedAt = at;
	}
	/**
	* Record the current identity of modules just evaluated again, leaving every other record unchanged.
	* @param urls `file:` URLs of the re-evaluated modules.
	*/
	refresh(urls) {
		for (const url of urls) this.records.set(url, identityOf(url)?.key);
	}
};
//#endregion
//#region lib/types/index.js
/** Serialized module and profile-configuration reloads. */
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
var __runInitializers = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
function canonicalPath(filename) {
	try {
		return realpathSync(filename);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
		const parent = dirname(filename);
		if (parent === filename) throw error;
		return resolve(canonicalPath(parent), basename(filename));
	}
}
/**
* Recursively collect all module dependencies from a ModuleJob.
* Skips node: builtins, and node_modules unless `includeNodeModules` is set, to focus on user code.
*/
async function loadDependencies(job, ignored = /* @__PURE__ */ new Set(), includeNodeModules = false) {
	const dependencies = /* @__PURE__ */ new Set();
	async function traverse(job) {
		if (ignored.has(job.url) || dependencies.has(job.url)) return;
		if (job.url.startsWith("node:") || !includeNodeModules && job.url.includes("/node_modules/")) return;
		dependencies.add(job.url);
		const children = await linkedJobs(job);
		await Promise.all(children.map(traverse));
	}
	await traverse(job);
	return dependencies;
}
/** Entry names with distinct namespaces; iteration falls back to undefined only for names without a loaded namespace. */
var EntryNamespaces = class {
	internal;
	moduleUrls;
	names = /* @__PURE__ */ new Map();
	constructor(internal, moduleUrls) {
		this.internal = internal;
		this.moduleUrls = moduleUrls;
	}
	static getModuleUrls(internal) {
		const moduleUrls = /* @__PURE__ */ new Map();
		for (const url of internal.loadCache.keys()) {
			const job = internal.loadCache.get(url);
			if (!job?.module) continue;
			try {
				moduleUrls.set(job.module.getNamespace(), url);
			} catch (_error) {}
		}
		return moduleUrls;
	}
	add(name, moduleNamespace) {
		const namespaces = this.names.get(name) ?? /* @__PURE__ */ new Set();
		namespaces.add(moduleNamespace);
		this.names.set(name, namespaces);
		return this;
	}
	*[Symbol.iterator]() {
		for (const [name, namespaces] of this.names) for (const moduleNamespace of namespaces) {
			if (moduleNamespace === void 0 && namespaces.size > 1) continue;
			yield [name, moduleNamespace];
		}
	}
	async resolve(name, baseUrl, moduleNamespace) {
		if (moduleNamespace === void 0 || name.startsWith("cordis:")) switch (this.internal.version) {
			case "v1": return await this.internal.resolve(name, baseUrl, {});
			case "v2": return this.internal.resolveSync(baseUrl, {
				specifier: name,
				attributes: {}
			});
		}
		const url = this.moduleUrls.get(moduleNamespace);
		if (url === void 0) throw new Error(`HMR cannot locate the loaded module for ${name} from ${baseUrl}`);
		return { url };
	}
};
/** Entry modules belonging to one runtime, keyed by their original namespaces across replacement. */
var ReloadModules = class ReloadModules {
	modules = /* @__PURE__ */ new Map();
	static include(reloads, plugin, job, runtime) {
		let info = reloads.get(plugin);
		if (info === void 0 && runtime) info = [...reloads.values()].find((info) => info.runtime === runtime);
		if (info === void 0) return false;
		info.modules.add(job, plugin);
		return true;
	}
	add(job, plugin) {
		assert(job.module, `HMR pending module is missing: ${job.url}`);
		const moduleNamespace = job.module.getNamespace();
		this.modules.set(moduleNamespace, {
			filename: job.url,
			moduleNamespace,
			plugin
		});
		return this;
	}
	async importRemaining(loader, getOuterStack, primary) {
		const replacements = new ReloadModules();
		for (const [originalNamespace, { filename }] of this.modules) {
			if (filename === primary.filename) {
				replacements.modules.set(originalNamespace, primary);
				continue;
			}
			const moduleNamespace = await loader.import(filename, getOuterStack);
			const plugin = loader.unwrapExports(moduleNamespace);
			replacements.modules.set(originalNamespace, {
				filename,
				moduleNamespace,
				plugin
			});
		}
		return replacements;
	}
	*getActiveImplementations(ctx, plugin, fibers) {
		const callbacks = new Set([...this.modules.values()].map((value) => ctx.registry.resolve(value.plugin)));
		const implementations = fibers.map((previousFiber) => {
			if (previousFiber.entry === void 0) return [previousFiber, plugin];
			const replacement = this.modules.get(previousFiber.moduleNamespace);
			const implementation = replacement ? replacement.plugin : ctx.loader.unwrapExports(previousFiber.moduleNamespace);
			callbacks.add(ctx.registry.resolve(implementation));
			return [previousFiber, implementation];
		});
		for (const [previousFiber, implementation] of implementations) {
			if (previousFiber.fiber.parent.fiber.uid === null) continue;
			if (previousFiber.entry === void 0 && callbacks.size > 1) throw new Error("HMR replacement is ambiguous for a plugin instance without a Loader entry");
			yield [previousFiber, implementation];
		}
	}
	updateEntries(loader) {
		for (const [originalNamespace, { moduleNamespace }] of this.modules) for (const entry of loader.entries()) if (entry.moduleNamespace === originalNamespace) entry.moduleNamespace = moduleNamespace;
	}
};
/** Hot reload service with Cordis-compatible module configuration and events. */
let Hmr = (() => {
	let _classDecorators = [Inject("loader"), Inject("timer")];
	let _classDescriptor;
	let _classExtraInitializers = [];
	let _classThis;
	let _classSuper = Service;
	var Hmr = class extends _classSuper {
		static {
			_classThis = this;
		}
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			__esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, {
				kind: "class",
				name: _classThis.name,
				metadata: _metadata
			}, null, _classExtraInitializers);
			Hmr = _classThis = _classDescriptor.value;
			if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		config;
		/** Cordis-compatible watcher defaults. */
		static Config = z.object({
			base: z.string(),
			root: z.array(String).role("table").default(["."]),
			ignored: z.array(String).role("table").default([
				"**/node_modules",
				"**/.*",
				"cache",
				"data"
			]),
			debounce: z.natural().role("ms").default(100)
		});
		/** Absolute base directory used to resolve module watch roots. */
		baseDir;
		ownerContext;
		internal;
		watcher;
		/**
		* Changes from externals will always trigger a full reload.
		* Externals are the dependency tree of the CLI worker entry point.
		*/
		externals;
		/**
		* Files that should be reloaded (accepted changes).
		* Includes all stashed files and their dependents.
		*/
		accepted;
		/**
		* Files that should NOT be reloaded.
		* Includes externals and files whose dependents are all declined.
		*/
		declined;
		/** Stashed file changes waiting to be processed */
		stashed = /* @__PURE__ */ new Set();
		operations = Promise.resolve();
		executing = new AsyncLocalStorage();
		applicationReady = Promise.resolve(true);
		closing = false;
		configPaths = /* @__PURE__ */ new Set();
		manifests = new PackageManifests();
		files = new ModuleFiles();
		/** Every module statically reachable from the process entry point, including those under node_modules; collected on first use. */
		hostModules;
		/** Serialize a caller-owned mutation with all automatic reload paths.
		* @param operation Work that must not overlap module or configuration replacement.
		* @returns The operation result after its asynchronous work completes.
		*/
		runExclusive(operation) {
			if (this.executing.getStore()) return Promise.reject(/* @__PURE__ */ new Error("HMR transactions cannot be nested"));
			const task = this.operations.then(async () => {
				if (this.closing) throw new Error("HMR is disposed");
				return this.executing.run(true, operation);
			});
			this.operations = task.catch(() => {});
			return task;
		}
		runReload(operation) {
			return this.runExclusive(async () => {
				if (await this.applicationReady) await operation();
			});
		}
		/** Watch a configuration path through the same queue as module replacement.
		* @param filename Absolute path, which may not exist yet.
		* @param refresh Rebuilds configuration from its current files and awaits Loader completion.
		* @returns Disposer closing this registration and waiting for its pending refresh.
		*/
		async watchConfig(filename, refresh) {
			const paths = [resolve(filename), canonicalPath(filename)];
			if (paths.some((path) => this.configPaths.has(path))) throw new Error(`config path already registered: ${filename}`);
			for (const path of paths) this.configPaths.add(path);
			try {
				const dispose = await this.executing.exit(() => watchConfig(this.ownerContext, filename, this.config, () => this.runReload(refresh), () => this.executing.getStore() === true));
				return async () => {
					await dispose();
					for (const path of paths) this.configPaths.delete(path);
				};
			} catch (error) {
				for (const path of paths) this.configPaths.delete(path);
				throw error;
			}
		}
		constructor(ctx, config) {
			super(ctx, "hmr");
			this.config = config;
			this.ownerContext = ctx;
			if (!this.ctx.loader.internal) throw new Error("--expose-internals is required for HMR service");
			this.internal = this.ctx.loader.internal;
			this.baseDir = fileURLToPath(new URL(config.base || ".", ctx.baseUrl));
		}
		/**
		* The cached ES module job for a URL. The packed worker loader exposes no Node module cache; native Node
		* retains this cache even when asynchronous module hooks run in a separate thread.
		*/
		esmJob(url) {
			return this.hasEsmCache() ? this.internal.loadCache.get(url) : void 0;
		}
		/** Whether this thread keeps a Node ES module cache; the packed worker loader keeps none. */
		hasEsmCache() {
			return Reflect.get(this.internal, "loadCache") !== void 0;
		}
		/** Whether the ES module cache holds a job for a URL; `false` when this thread keeps no ES module cache. */
		esmHas(url, type) {
			return this.hasEsmCache() && (type === void 0 ? this.internal.loadCache.has(url) : this.internal.loadCache.has(url, type));
		}
		/** ES module cache keys, empty when this thread keeps no ES module cache. */
		esmUrls() {
			return this.hasEsmCache() ? [...Map.prototype.keys.call(this.internal.loadCache)] : [];
		}
		/** ES module cache keys and CommonJS cache filenames as URLs. */
		*loadedUrls() {
			yield* this.esmUrls();
			for (const filename of Object.keys(commonJsCache())) yield pathToFileURL(filename).href;
		}
		/** The module job of the process entry point, when the loader cached it under the entry's real path. */
		mainJob() {
			const entry = process.argv[1];
			if (entry === void 0) return void 0;
			return this.esmJob(pathToFileURL(canonicalPath(resolve(entry))).href);
		}
		async *[Service.init]() {
			const mainJob = this.mainJob();
			let host;
			this.hostModules = () => host ??= mainJob === void 0 ? Promise.resolve(/* @__PURE__ */ new Set()) : loadDependencies(mainJob, /* @__PURE__ */ new Set(), true);
			yield async () => {
				this.closing = true;
				await this.watcher?.close();
				if (!this.executing.getStore()) await this.operations;
				this.manifests.dispose();
			};
			const profile = this.ownerContext.get("profileContext");
			if (profile !== void 0) {
				const ready = this.ownerContext.get("appReady");
				if (ready === void 0) throw new Error("Profile HMR requires application readiness");
				const started = Promise.withResolvers();
				this.applicationReady = started.promise;
				const unsubscribe = ready.onReady(() => {
					try {
						this.files.observe(this.profileModules(profileRoots(profile.dir)));
					} catch (error) {
						this.ctx.logger.warn(error);
					}
					started.resolve(true);
				});
				yield () => {
					unsubscribe();
					started.resolve(false);
					return Promise.resolve();
				};
				const manifestPath = join(profile.dir, "package.json");
				const patchFiles = [profile.patchPath, join(profile.home, PROFILE_PATCH_FILENAME)];
				let lastInputs;
				let lastBundles = JSON.stringify(profile.startedBundles);
				const refresh = async (manifestOnly) => {
					const bundles = JSON.stringify(readProfileManifest("dsh", profile.dir).dsh?.profile?.bundles ?? []);
					if (manifestOnly && bundles === lastBundles) return;
					const inputs = JSON.stringify([bundles, ...patchFiles.map((filename) => {
						try {
							return readFileSync(filename, "utf8");
						} catch (error) {
							if (error.code === "ENOENT") return null;
							throw error;
						}
					})]);
					if (inputs === lastInputs) return;
					const { warnings, pending, restartReason } = await this.reconcileProfile();
					if (restartReason !== void 0) this.ctx.logger.warn("restart required: %s", restartReason);
					if (pending.length > 0) this.ctx.logger.warn("changed modules keep running their previous code until a restart: %o", pending);
					lastInputs = inputs;
					lastBundles = bundles;
					for (const diagnostic of warnings) this.ctx.logger.warn(diagnostic);
				};
				for (const filename of patchFiles) await this.watchConfig(filename, () => refresh(false));
				await this.watchConfig(manifestPath, () => refresh(true));
			}
			const { loader } = this.ctx;
			const { root, ignored } = this.config;
			if (!this.config.base) this.ctx.logger.info("watching %o", root);
			else this.ctx.logger.info("watching %o in %s", root, this.baseDir);
			const match = picomatch(ignored);
			const watchBaseDir = realpathSync(this.baseDir);
			if (mainJob) this.externals = await loadDependencies(mainJob);
			else this.externals = /* @__PURE__ */ new Set();
			this.watcher = watch(root, {
				...this.config,
				cwd: watchBaseDir,
				ignored: (path) => match(relative(watchBaseDir, path)),
				ignoreInitial: true
			});
			const changed = /* @__PURE__ */ new Set();
			const dispatch = this.ctx.debounce(() => {
				this.runExclusive(async () => {
					if (!await this.applicationReady) return;
					const batch = [...changed];
					changed.clear();
					const includes = /* @__PURE__ */ new Set();
					let fullReload = false;
					for (const path of batch) {
						const filename = canonicalPath(resolve(watchBaseDir, path));
						const configuredFilename = resolve(this.baseDir, path);
						if (this.configPaths.has(filename) || this.configPaths.has(configuredFilename)) continue;
						const isManifest = basename(filename) === "package.json" && !filename.includes(`${sep}node_modules${sep}`);
						if (isManifest) this.manifests.invalidate(filename);
						const url = pathToFileURL(filename).href;
						if (this.externals.has(url)) {
							fullReload = true;
							continue;
						}
						if (this.esmHas(url) || this.esmHas(url, "json")) {
							this.stashed.add(url);
							continue;
						}
						if (isManifest) continue;
						const include = [...loader.entries()].map((entry) => entry.subtree).find((tree) => tree?.filename === filename || tree?.filename === configuredFilename);
						if (include !== void 0) includes.add(include);
						else this.ctx.emit("hmr/change", url);
					}
					if (!fullReload && includes.size === 0 && this.stashed.size === 0) return;
					if (fullReload) {
						loader.exit();
						return;
					}
					for (const include of includes) await include.refresh();
					if (this.stashed.size > 0) try {
						await this.partialReload();
					} finally {
						this.stashed.clear();
					}
					await loader.await();
				}).catch((error) => {
					this.ctx.logger.warn(error);
				});
			}, this.config.debounce);
			this.watcher.on("change", (path) => {
				changed.add(path);
				dispatch();
			});
			const ready = Promise.withResolvers();
			let readyState = root.length === 0 ? "resolved" : "pending";
			if (root.length === 0) ready.resolve();
			else this.watcher.once("ready", () => {
				readyState = "resolved";
				ready.resolve();
			});
			this.watcher.on("error", (error) => {
				if (readyState === "pending") {
					readyState = "rejected";
					ready.reject(error);
				} else this.ctx.logger.warn(error);
			});
			await ready.promise;
		}
		/** Omit internal HMR frames from module import diagnostics.
		* @returns The preserved outer stack frames.
		*/
		getOuterStack = () => [];
		/** Read direct module dependency URLs from the active Node loader.
		* @param url Module URL.
		* @returns Linked module URLs, or an empty list for an uncached module.
		*/
		async getLinked(url) {
			const job = this.esmJob(url);
			if (!job) return [];
			const linked = await job.linked;
			return Array.prototype.map.call(linked, (job) => job.url);
		}
		/**
		* Classify changed files into accepted (should reload) and declined (should not).
		*
		* A file is accepted if it's directly changed (stashed) or if any of its
		* dependents are accepted. A file is declined if all its dependents are
		* declined or if it's an external.
		*/
		async analyzeChanges() {
			const pending = [];
			this.accepted = new Set(this.stashed);
			this.declined = new Set(this.externals);
			const isExcluded = (url) => url.startsWith("node:") || url.includes("/node_modules/");
			await Promise.all([...this.stashed].map(async (url) => {
				const children = await this.getLinked(url);
				for (const child of children) {
					if (this.accepted.has(child) || this.declined.has(child) || isExcluded(child)) continue;
					pending.push(child);
				}
			}));
			while (pending.length) {
				let index = 0, hasUpdate = false;
				while (index < pending.length) {
					const url = pending[index];
					const children = await this.getLinked(url);
					let isDeclined = true, isAccepted = false;
					for (const child of children) {
						if (this.declined.has(child) || isExcluded(child)) continue;
						if (this.accepted.has(child)) {
							isAccepted = true;
							break;
						} else {
							isDeclined = false;
							if (!pending.includes(child)) {
								hasUpdate = true;
								pending.push(child);
							}
						}
					}
					if (isAccepted || isDeclined) {
						hasUpdate = true;
						pending.splice(index, 1);
						if (isAccepted) this.accepted.add(url);
						else this.declined.add(url);
					} else index++;
				}
				if (!hasUpdate) break;
			}
			for (const url of pending) this.declined.add(url);
		}
		async partialReload() {
			await this.analyzeChanges();
			const pending = /* @__PURE__ */ new Map();
			const reloads = /* @__PURE__ */ new Map();
			const moduleUrls = EntryNamespaces.getModuleUrls(this.internal);
			const nameMap = /* @__PURE__ */ new Map();
			for (const entry of this.ctx.loader.entries()) {
				const baseUrl = entry.parent.tree.ctx.baseUrl;
				if (baseUrl === void 0) throw new Error("HMR entry tree has no base URL");
				const names = nameMap.get(baseUrl) ?? new EntryNamespaces(this.internal, moduleUrls);
				names.add(entry.options.name, entry.moduleNamespace);
				nameMap.set(baseUrl, names);
			}
			for (const [baseUrl, names] of nameMap) for (const [name, moduleNamespace] of names) try {
				const { url } = await names.resolve(name, baseUrl, moduleNamespace);
				if (this.declined.has(url)) continue;
				const job = this.esmJob(url);
				const plugin = this.ctx.loader.unwrapExports(job?.module?.getNamespace());
				if (!job || !plugin) continue;
				pending.set(job, plugin);
				this.declined.add(url);
			} catch (err) {
				this.ctx.logger.warn(err);
			}
			for (const [job, plugin] of pending) {
				this.declined.delete(job.url);
				const dependencies = [...await loadDependencies(job, this.declined)];
				this.declined.add(job.url);
				if (dependencies.length === 0) {
					pending.delete(job);
					continue;
				}
				if (!dependencies.some((dep) => this.accepted.has(dep))) continue;
				dependencies.forEach((dep) => this.accepted.add(dep));
				const runtime = this.ctx.registry.get(plugin);
				if (ReloadModules.include(reloads, plugin, job, runtime)) continue;
				reloads.set(plugin, {
					filename: job.url,
					runtime,
					modules: new ReloadModules().add(job, plugin)
				});
			}
			for (const [job, plugin] of pending) if (ReloadModules.include(reloads, plugin, job, this.ctx.registry.get(plugin))) this.accepted.add(job.url);
			const rollback = this.evict(this.accepted);
			const generations = [...reloads].map(([previous, info]) => ({
				...info,
				previous,
				fibers: [...info.runtime?.fibers ?? []].map((fiber) => {
					const entry = fiber.entry?.fiber?.uid === fiber.uid ? fiber.entry : void 0;
					return {
						fiber,
						entry,
						config: entry === void 0 ? fiber._config : entry.options.config,
						moduleNamespace: entry?.moduleNamespace
					};
				})
			}));
			const attempts = [];
			try {
				for (const generation of generations) {
					const moduleNamespace = await this.ctx.loader.import(generation.filename, this.getOuterStack);
					const replacement = this.ctx.loader.unwrapExports(moduleNamespace);
					const replacements = await generation.modules.importRemaining(this.ctx.loader, this.getOuterStack, {
						filename: generation.filename,
						moduleNamespace,
						plugin: replacement
					});
					attempts.push({
						...generation,
						replacement,
						replacements,
						activated: []
					});
				}
			} catch (e) {
				handleError(this.ctx, e);
				rollback();
				throw e;
			}
			const reload = async (plugin, fibers, replacements = new ReloadModules(), activated = []) => {
				for (const [previousFiber, implementation] of replacements.getActiveImplementations(this.ctx, plugin, fibers)) {
					const fiber = previousFiber.fiber.parent.registry.plugin(implementation, previousFiber.config, this.getOuterStack).ctx.fiber;
					if (previousFiber.entry !== void 0) {
						fiber.entry = previousFiber.entry;
						previousFiber.entry.fiber = fiber;
					}
					activated.push(fiber);
				}
				await Promise.all(activated.map((fiber) => fiber.await()));
			};
			const removed = /* @__PURE__ */ new Set();
			try {
				for (const { previous: plugin, replacement, filename, runtime, fibers, replacements, activated } of attempts) {
					if (!runtime) continue;
					const path = relative(this.baseDir, fileURLToPath(filename));
					removed.add(plugin);
					try {
						this.ctx.registry.delete(plugin);
						await Promise.all(fibers.map(({ fiber }) => fiber.await()));
					} catch (err) {
						this.ctx.logger.warn("failed to dispose plugin at %C", path);
						this.ctx.logger.warn(err);
					}
					try {
						await reload(replacement, fibers, replacements, activated);
						this.ctx.logger.info("reload plugin at %C", path);
					} catch (err) {
						this.ctx.logger.warn("failed to reload plugin at %C", path);
						this.ctx.logger.warn(err);
						throw err;
					}
				}
			} catch (error) {
				rollback();
				for (const { previous: plugin, fibers, activated } of attempts) {
					if (!removed.has(plugin)) continue;
					try {
						for (const { runtime } of activated) if (runtime && this.ctx.registry.get(runtime.callback) === runtime) {
							const replacementFibers = [...runtime.fibers];
							this.ctx.registry.delete(runtime.callback);
							await Promise.allSettled(replacementFibers.map((fiber) => fiber.await()));
						}
						await reload(plugin, fibers);
					} catch (err) {
						this.ctx.logger.warn(err);
					}
				}
				throw error;
			}
			await this.ctx.loader.await();
			for (const { replacements } of attempts) replacements.updateEntries(this.ctx.loader);
			this.ctx.emit("hmr/reload", reloads);
			this.files.refresh(this.accepted);
			this.stashed = /* @__PURE__ */ new Set();
		}
		/**
		* Remove modules from the ES module and CommonJS caches so the next import evaluates their files again.
		*
		* CommonJS modules loaded through `import()` appear in both caches. Node's `LoadCache` maps each URL to per-type
		* jobs, and its own `delete()` only clears one type slot, so whole entries are removed through `Map.prototype`.
		* @returns Restores the removed cache entries.
		*/
		evict(urls) {
			const esmBackup = /* @__PURE__ */ new Map();
			const cjsBackup = /* @__PURE__ */ new Map();
			const cache = commonJsCache();
			const list = [...urls];
			const cached = new Set(this.esmUrls());
			for (const url of list) if (cached.has(url)) {
				esmBackup.set(url, Map.prototype.get.call(this.internal.loadCache, url));
				Map.prototype.delete.call(this.internal.loadCache, url);
			}
			for (const filepath of list.filter((url) => url.startsWith("file:")).map((url) => fileURLToPath(url))) {
				const module = cache[filepath];
				if (module !== void 0) {
					cjsBackup.set(filepath, module);
					Reflect.deleteProperty(cache, filepath);
				}
			}
			return () => {
				for (const [url, job] of esmBackup) Map.prototype.set.call(this.internal.loadCache, url, job);
				for (const [filepath, module] of cjsBackup) cache[filepath] = module;
			};
		}
		/** Loaded `file:` modules below the given profile roots. */
		profileModules(roots) {
			return [...this.loadedUrls()].filter((url) => {
				if (!url.startsWith("file:")) return false;
				const filename = fileURLToPath(url);
				return roots.some((root) => filename.startsWith(root));
			});
		}
		/** Static import edges between loaded modules, across ES module links and CommonJS `require` children. */
		async moduleGraph() {
			const importers = /* @__PURE__ */ new Map();
			const add = (parent, child) => {
				importers.set(child, (importers.get(child) ?? /* @__PURE__ */ new Set()).add(parent));
			};
			await Promise.all([...moduleJobs(this.internal)].map(async (job) => {
				for (const child of await linkedJobs(job)) add(job.url, child.url);
			}));
			for (const [filename, module] of Object.entries(commonJsCache())) {
				/* v8 ignore next -- Node stores no undefined values in require.cache; the index type admits them */
				const children = module === void 0 ? void 0 : Reflect.get(module, "children");
				if (!Array.isArray(children)) continue;
				for (const child of children) add(pathToFileURL(filename).href, pathToFileURL(child.filename).href);
			}
			return importers;
		}
		/**
		* Plan the replacement of changed modules without changing anything. A changed module whose importers reach the
		* process entry point's static graph, or a plugin that no affected Loader entry starts, stays loaded with its
		* importers and is pending. The other changed modules and every module importing them are evicted by
		* {@link stopPlanned}, which also expires the manifests from each changed file up to its root and stops the Loader
		* entries running affected plugins.
		* @param stale Changed module URLs.
		* @param roots Directories, with a trailing separator, that bound the expired manifests.
		* @returns The pending modules and the replacement of the others.
		*/
		async planReplacement(stale, roots) {
			const importers = await this.moduleGraph();
			const host = await this.hostModules();
			const managed = new Set(this.ctx.loader.entries());
			const plan = {
				pending: [],
				evicted: /* @__PURE__ */ new Set(),
				manifests: /* @__PURE__ */ new Set(),
				plugins: /* @__PURE__ */ new Set(),
				fibers: /* @__PURE__ */ new Set()
			};
			for (const url of stale) {
				const affected = new Set([url]);
				for (const module of affected) for (const importer of importers.get(module) ?? []) affected.add(importer);
				const running = [...new Set([...affected].flatMap((module) => this.pluginsOf(module)))].flatMap((plugin) => [...this.ctx.registry.get(plugin)?.fibers ?? []].map((fiber) => ({
					plugin,
					fiber
				})));
				const affectedFibers = new Set(running.map(({ fiber }) => fiber));
				/** The Loader entry whose own fiber runs an affected plugin and starts this fiber directly or through its ancestors. */
				const owner = (fiber) => {
					for (let current = fiber; current.uid !== 0; current = current.parent.fiber) {
						const entry = current.entry;
						if (entry?.fiber === current && managed.has(entry) && affectedFibers.has(current)) return entry;
					}
				};
				const entries = running.flatMap(({ fiber }) => owner(fiber) ?? []);
				const reason = [...affected].some((module) => host.has(module)) ? "host-module" : entries.length < running.length ? "unmanaged-plugin" : void 0;
				if (reason !== void 0) {
					plan.pending.push({
						url,
						reason
					});
					continue;
				}
				for (const manifest of packageManifests(url, roots)) plan.manifests.add(manifest);
				for (const module of affected) plan.evicted.add(module);
				for (const { plugin, fiber } of running) {
					plan.plugins.add(plugin);
					plan.fibers.add(fiber);
				}
			}
			return plan;
		}
		/**
		* The plugins a loaded module exports, read from the ES module namespace and the CommonJS exports Node cached for it
		* without evaluating anything.
		* @param url Loaded module URL.
		* @returns The exported plugins.
		*/
		pluginsOf(url) {
			const namespace = namespaceOf(this.esmJob(url));
			const required = url.startsWith("file:") ? commonJsCache()[fileURLToPath(url)] : void 0;
			return [namespace, required?.loaded === true ? required.exports : void 0].filter((value) => value !== void 0).map((value) => this.ctx.loader.unwrapExports(value));
		}
		/**
		* Carry out a planned replacement: expire its manifests, evict its modules without a backup, and stop its Loader
		* entries, so applying the generation imports the current files when it starts them.
		* @param plan The planned replacement.
		*/
		async stopPlanned(plan) {
			for (const manifest of plan.manifests) this.manifests.invalidate(manifest);
			this.evict(plan.evicted);
			for (const plugin of plan.plugins) this.ctx.registry.delete(plugin);
			await Promise.allSettled([...plan.fibers].map((fiber) => fiber.await()));
		}
		/**
		* Evict the loaded modules below the directories of mappings a recomposition dropped and expire their package
		* configuration, so a disabled or removed package that is installed or enabled again is imported afresh. Modules of
		* DSH's own static graph, and those below a directory that is still mapped, stay loaded.
		* @param dropped Real directories, with a trailing separator, of the dropped mappings.
		* @param kept Real directories, with a trailing separator, of the mappings that stay.
		*/
		async evictDropped(dropped, kept) {
			if (dropped.length === 0) return;
			const host = new Set(await this.hostModules());
			const urls = this.profileModules(dropped).filter((url) => {
				const filename = fileURLToPath(url);
				return !host.has(url) && ![...kept].some((dir) => filename.startsWith(dir));
			});
			for (const url of urls) for (const manifest of packageManifests(url, dropped)) this.manifests.invalidate(manifest);
			this.evict(urls);
		}
		/** Report a failed replacement step and retain the caller’s fallback outcome. */
		async contained(step, operation, fallback) {
			try {
				return await operation();
			} catch (error) {
				this.ctx.logger.warn("%s failed; module replacement was not completed", step);
				this.ctx.logger.warn(error);
				return fallback;
			}
		}
		/**
		* Recompose the profile from its manifest and patch files, replacing running plugins whose loaded files below the
		* profile directory or its linked package targets changed on disk, and publishing its runtime resolution. Changed
		* modules are evicted and the Loader entries running them stop; app-boot's {@link recomposeProfile} then publishes the
		* resolution, applies the generation, starts the stopped entries with the current files and configuration,
		* imports entries whose import failed again, and judges activation. Afterwards the modules below the mappings the
		* recomposition dropped are evicted, so a removed or deselected package is imported afresh when it returns. Callers run
		* inside {@link runExclusive}.
		* @param requiredIds Entry ids whose inactive state is reported as a failure even when it predates this call.
		* @returns Inactive-entry diagnostics, the changed modules that load after a restart, and a profile-wide restart reason.
		* @throws The patch read, publication, preparation, apply, or activation failure of the recomposition, including a
		* replacement plugin that fails to load or start, whose previous code no longer runs.
		*/
		async reconcileProfile(requiredIds = []) {
			if (this.executing.getStore() !== true) throw new Error("HMR profile reconciliation must run inside runExclusive");
			const profile = this.ownerContext.get("profileContext");
			if (profile === void 0) throw new Error("HMR profile reconciliation requires profileContext");
			const running = [...this.ctx.loader.entries()].filter((entry) => entry.fiber?.state === 2);
			const mapped = mappedDirectories(this.ownerContext.get("pluginPackages")?.resolution);
			let comparison;
			let comparedAt = 0;
			let pending = [];
			try {
				const patches = readProfilePatches("dsh", profile);
				comparedAt = this.files.now();
				comparison = await this.contained("comparing loaded modules with disk", () => {
					const roots = profileRoots(profile.dir);
					return Promise.resolve({
						roots,
						...this.files.compare(this.profileModules(roots))
					});
				}, void 0);
				pending = [...comparison?.stale ?? []].map((url) => ({
					url,
					reason: "module-comparison"
				}));
				const compared = comparison;
				const unavailable = !this.hasEsmCache();
				if (!unavailable && compared !== void 0 && pending.length > 0) pending = await this.contained("planning module replacement", async () => {
					const plan = await this.planReplacement(compared.stale, compared.roots);
					await this.stopPlanned(plan);
					return plan.pending;
				}, pending);
				await this.contained("expiring failed imports", () => {
					if (unavailable) return;
					const roots = compared?.roots ?? [realpathSync(profile.dir) + sep];
					for (const root of roots) this.manifests.invalidate(join(root, "package.json"));
					this.evict(this.profileModules(roots).filter((url) => {
						const job = this.esmJob(url);
						return job !== void 0 && namespaceOf(job) === void 0;
					}));
				}, void 0);
				const result = await recomposeProfile(this.ownerContext.root, patches, "dsh", {
					requiredIds,
					running
				});
				const restartReason = compared === void 0 || unavailable ? "module-comparison" : result.restartReason;
				return {
					warnings: result.warnings,
					pending,
					...restartReason === void 0 ? {} : { restartReason }
				};
			} finally {
				const recorded = comparison;
				await this.contained("evicting dropped packages", () => {
					const kept = mappedDirectories(this.ownerContext.get("pluginPackages")?.resolution);
					return this.evictDropped([...mapped].filter((dir) => !kept.has(dir)), kept);
				}, void 0);
				await this.contained("recording loaded module files", () => {
					if (recorded === void 0) return;
					const urls = this.profileModules(recorded.roots);
					this.files.observe(urls, {
						seen: recorded.seen,
						retained: new Set(pending.map(({ url }) => url)),
						at: comparedAt
					});
				}, void 0);
			}
		}
		static {
			__runInitializers(_classThis, _classExtraInitializers);
		}
	};
	return _classThis;
})();
/** Node's `kErrored` module status, the same in every supported Node version. */
const MODULE_ERRORED = 5;
/** The namespace of a cached module job, or `undefined` when it has none or its evaluation threw. */
function namespaceOf(job) {
	if (job?.module === void 0) return void 0;
	if (Reflect.apply(Reflect.get(job.module, "getStatus"), job.module, []) === MODULE_ERRORED) return void 0;
	try {
		return job.module.getNamespace();
	} catch (_error) {
		return;
	}
	/* v8 ignore stop */
}
/**
* The jobs a module job links to. Node 24+ may expose them as an array; Node 22 keeps the job of a failed import
* whose links reject, and such a job contributes no links.
*/
async function linkedJobs(job) {
	/* v8 ignore next -- CI coverage runs Node 24+, which drops failed jobs from the cache */
	const linked = await Promise.resolve(job.linked).catch((_error) => []);
	return Array.from(linked);
}
/** The Node-compatible CommonJS cache; the packed worker implements require without exposing this cache. */
function commonJsCache() {
	return Reflect.get(createRequire(import.meta.url), "cache") ?? {};
}
/** Every module job in the loader cache; Node's `LoadCache` maps each URL to per-type jobs. */
function* moduleJobs(internal) {
	for (const value of Map.prototype.values.call(internal.loadCache)) yield* Object.values(value).filter((job) => job !== void 0);
}
/**
* The directories of a runtime resolution's profile mappings and linked roots, in every real spelling of those that
* exist, each with a trailing separator.
* @param resolution The published resolution, if any.
* @returns The directories; none without a resolution.
*/
function mappedDirectories(resolution) {
	const directories = /* @__PURE__ */ new Set();
	if (resolution === void 0) return directories;
	const dirs = [...resolution.entries.filter((entry) => entry.scope === "profile").map((entry) => entry.packageDir), ...resolution.linkedRoots.map((root) => root.realPath)];
	for (const dir of dirs) for (const spelling of existsSync(dir) ? realSpellings(dir) : [dir]) directories.add(spelling + sep);
	return directories;
}
/**
* The JavaScript and native real paths of an existing path. A packed worker's file system has no native realpath.
* @param path Existing path.
* @returns The distinct spellings.
*/
function realSpellings(path) {
	const native = Reflect.get(realpathSync, "native");
	return [realpathSync(path), ...typeof native === "function" ? [String(Reflect.apply(native, realpathSync, [path]))] : []];
}
/**
* Real directories, with a trailing separator, of the profile and of the targets its linked packages point to. Each
* appears in both real-path spellings: Node's module caches use the JavaScript one, the runtime resolution the native
* one, and on Windows they differ for 8.3 short names.
*/
function profileRoots(dir) {
	const modules = join(realpathSync(dir), "node_modules");
	const linked = (existsSync(modules) ? readdirSync(modules) : []).flatMap((name) => name.startsWith("@") ? readdirSync(join(modules, name)).map((child) => join(modules, name, child)) : [join(modules, name)]).filter((path) => lstatSync(path).isSymbolicLink() && existsSync(path));
	return [...new Set([dir, ...linked].flatMap((path) => realSpellings(path)).map((root) => root + sep))];
}
/** Every `package.json` from a module file's directory up to the profile root or linked package target containing it. */
function packageManifests(url, roots) {
	const manifests = [];
	const contains = (directory) => roots.some((root) => (directory + sep).startsWith(root));
	for (let directory = dirname(fileURLToPath(url)); contains(directory); directory = dirname(directory)) {
		const candidate = join(directory, "package.json");
		if (existsSync(candidate)) manifests.push(candidate);
	}
	return manifests;
}
//#endregion
export { Hmr as default };
