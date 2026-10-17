import { randomUUID } from "node:crypto";
import { existsSync, globSync, readFileSync, realpathSync, statSync } from "node:fs";
import { mkdir, mkdtemp, open, readFile, rm } from "node:fs/promises";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { withFileLock, writeFileAtomic } from "@deepseek-ai/dsh-atomic-write";
import z from "@deepseek-ai/schemastery";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { pluginEntryId, readPluginInventory } from "@deepseek-ai/dsh-host-plugin-inventory";
import { OFFICIAL_ON_DEMAND_CATALOG, OPTIONAL_BUNDLES, PROFILE_COMPATIBILITY_FILENAME, ResolutionRestartRequired, bundlePatchPaths, composeEntries, evaluatePluginCompatibility, getDshRuntimeVersion, loadOptionalPatches, loadOverlayPatches, pluginCompatibilityWarning, readBundlePatches, readPluginMeta, readProfileCompatibility, readProfileManifest, readProfilePatches, readProfileVersionExemptions, resolveBundleDir, resolveProfileDir, setProfileVersionExemption } from "@deepseek-ai/dsh-app-boot";
import { once } from "node:events";
import { execa } from "execa";
import { scrubbedParentEnv } from "@deepseek-ai/dsh-subprocess";
import { homedir } from "node:os";
import { isAlias, isMap, isNode, isScalar, isSeq, parseDocument, visit } from "yaml";
//#region lib/types/install-spec.js
/**
* Reading an install spec before pnpm sees it: which of pnpm's spec forms it
* takes, and for a registry name whether it is one the registry can accept.
* @module @deepseek-ai/dsh-plugin-manager/install-spec
*/
/** The forms pnpm resolves through a git host: a host shorthand, a git URL, or a hosted repository URL. */
const GIT_SHORTHAND = /^(?:github|gitlab|bitbucket|gist):/i;
const GIT_URL = /^git(?:\+[a-z]+)?:\/\/|^git@[^:]+:/i;
const HOSTED_REPOSITORY_URL = /^https?:\/\/[^/]+\/[^/]+\/[^/#]+(?:\.git)?(?:#.*)?$/i;
/** The hosts pnpm's shorthands stand for. */
const GIT_SHORTHAND_HOSTS = {
	github: "github.com",
	gitlab: "gitlab.com",
	bitbucket: "bitbucket.org",
	gist: "gist.github.com"
};
/** A tarball, on disk or over HTTP. */
const TARBALL_SPEC = /\.(?:tgz|tar\.gz)(?:#.*)?$/i;
/** An npm package name: lowercase URL-safe segments, an optional scope, no leading dot or underscore. */
const PACKAGE_NAME = /^(?:@[a-z0-9][a-z0-9._~-]*\/)?[a-z0-9][a-z0-9._~-]*$/;
const PACKAGE_NAME_MAX_LENGTH = 214;
/** A spec neither pnpm nor the registry would take; `reason` is what the person reads. */
var InvalidInstallSpecError = class extends Error {
	spec;
	reason;
	/**
	* @param spec - the spec as typed, trimmed.
	* @param reason - why it is refused, as one sentence.
	*/
	constructor(spec, reason) {
		super(`plugin-manager: ${reason}: ${spec}`);
		this.spec = spec;
		this.reason = reason;
		this.name = "InvalidInstallSpecError";
	}
};
function invalid(spec, reason) {
	return new InvalidInstallSpecError(spec, reason);
}
/** The host a git spec is cloned from: the shorthand's host, the scp-like user@host, or the URL's host with its port. */
function gitHost(spec) {
	const shorthand = /^([a-z]+):/i.exec(spec)?.[1]?.toLowerCase();
	if (shorthand !== void 0 && Object.hasOwn(GIT_SHORTHAND_HOSTS, shorthand)) return GIT_SHORTHAND_HOSTS[shorthand];
	const scp = /^git@([^:]+):/i.exec(spec)?.[1];
	if (scp !== void 0) return scp.toLowerCase();
	return new URL(spec.replace(/^git\+/i, "")).host;
}
/**
* Read a spec into its form. A path must be absolute: the Host's working
* directory means nothing to the person typing into a browser, and a
* relative path resolved against the profile would point inside it.
* @param raw - the spec as typed.
* @returns the parsed spec.
* @throws {InvalidInstallSpecError} for an empty spec, a relative path, a name the
* registry would refuse, or a URL that is neither a git host nor a tarball.
*/
function parseInstallSpec(raw) {
	const spec = raw.trim();
	if (spec === "") throw invalid(spec, "the package spec must not be empty");
	const path = spec.replace(/^(?:file|link):/, "");
	if (path !== spec || isAbsolute(path)) {
		if (!isAbsolute(path)) throw invalid(spec, "a local path must be absolute");
		return TARBALL_SPEC.test(path) ? {
			kind: "tarball",
			spec,
			path
		} : {
			kind: "path",
			spec,
			path
		};
	}
	if (/^\.{1,2}(?:[\\/]|$)/.test(spec)) throw invalid(spec, "a local path must be absolute");
	if ((GIT_SHORTHAND.test(spec) || GIT_URL.test(spec) || HOSTED_REPOSITORY_URL.test(spec)) && !TARBALL_SPEC.test(spec)) return {
		kind: "git",
		spec,
		host: gitHost(spec)
	};
	if (/^https?:\/\//i.test(spec)) {
		if (TARBALL_SPEC.test(spec)) return {
			kind: "tarball",
			spec,
			host: new URL(spec).host
		};
		throw invalid(spec, "a URL must point at a git repository or a tarball");
	}
	const at = spec.indexOf("@", 1);
	const name = at === -1 ? spec : spec.slice(0, at);
	const range = at === -1 ? void 0 : spec.slice(at + 1);
	if (name.length > PACKAGE_NAME_MAX_LENGTH || !PACKAGE_NAME.test(name)) throw invalid(spec, "not a package name the registry accepts");
	if (range === "") throw invalid(spec, "a version after @ must not be empty");
	return range === void 0 ? {
		kind: "registry",
		spec,
		name
	} : {
		kind: "registry",
		spec,
		name,
		range
	};
}
/** A recorded dependency value pnpm resolves outside a registry: a protocol other than a registry alias, or an scp-like git address. */
const NON_REGISTRY_VALUE = /^(?!(?:npm|jsr|workspace|catalog):)[a-z][a-z0-9+.-]*:|^[^@/:\s]+@[^:/\s]+:/i;
/** The user information of an http(s) URL, up to the last `@` before the path, which holds a password or access token when present. */
const HTTP_USER_INFO = /^((?:git\+)?https?:\/\/)[^/]*@/i;
/**
* The spec `pnpm add` accepts for a dependency the profile manifest records. A git address, URL, or other
* non-registry protocol is the recorded value without the user information of an http(s) URL, whose query string
* is kept; a `file:` or `link:` path, which pnpm records relative to the profile or with `~` for the home
* directory, becomes absolute. A registry range, tag, or alias follows the dependency name after `@`, as does a
* non-registry value installed under a name other than the package's own.
* @param name - the dependency name.
* @param recorded - the value the profile manifest records for it.
* @param profileDir - the profile directory a relative local path is resolved against.
* @param packageName - the name the installed package's manifest declares, when it could be read.
* @returns the installable spec.
*/
function dependencySpec(name, recorded, profileDir, packageName = name) {
	const local = /^(file|link):(.*)$/s.exec(recorded);
	let spec;
	if (local !== null) {
		const path = local[2].replace(/^~(?=$|[\\/])/, () => homedir());
		spec = `${local[1]}:${resolve(profileDir, path)}`;
	} else if (NON_REGISTRY_VALUE.test(recorded)) spec = recorded.replace(HTTP_USER_INFO, "$1");
	else return `${name}@${recorded}`;
	return packageName === name ? spec : `${name}@${spec}`;
}
//#endregion
//#region lib/types/run-tree.js
/** Waiting for one package run's process tree to disappear before its caller touches the profile. */
/** How long a terminated tree may take to disappear before the caller stops waiting. */
const TREE_WAIT_MS = 5e3;
/** Poll cadence while waiting for a terminated tree to disappear. */
const TREE_POLL_MS = 15;
/**
* Whether one run leads its own process group, which is the target a POSIX
* liveness probe addresses for the whole tree. A run that captures output is
* spawned as its own group leader, because its tree is terminated as a unit; a
* run that inherits the caller's descriptors keeps the caller's group, so an
* interrupt still reaches it.
* @param execution Whether the run captures output or inherits the caller's descriptors.
* @param platform Host platform deciding how a tree is addressed.
* @returns True when the run leads its own process group.
*/
function leadsOwnGroup(execution, platform = process.platform) {
	return execution === "service" && platform !== "win32";
}
/** The target a tree probe addresses: a POSIX group when the run leads one, else the process itself. */
function targetOf(pid, grouped, platform) {
	return platform !== "win32" && grouped ? -pid : pid;
}
/**
* Whether any member of a run's tree is still alive.
* @param tree The run's process id and whether it leads its own group.
* @param internals Injectable process operations.
* @returns True while the probe finds the process or a group member.
*/
function treeAlive(tree, internals = {}) {
	const pid = tree.pid;
	if (pid === void 0) return false;
	const platform = internals.platform ?? process.platform;
	const alive = internals.alive ?? ((target) => {
		process.kill(target, 0);
		return true;
	});
	try {
		return alive(targetOf(pid, tree.grouped, platform));
	} catch {
		return false;
	}
}
/**
* Wait until a terminated run's tree is gone, so the caller restores and
* unlocks the profile only after the scripts it started stopped writing.
* @param tree The run's process id and whether it leads its own group.
* @param internals Injectable process operations.
* @returns Fulfillment once no member remains, or the wait bound elapsed.
*/
async function awaitTreeGone(tree, internals = {}) {
	const deadline = Date.now() + (internals.waitMs ?? TREE_WAIT_MS);
	while (treeAlive(tree, internals)) {
		if (Date.now() >= deadline) return;
		await new Promise((resolve) => setTimeout(resolve, TREE_POLL_MS));
	}
}
//#endregion
//#region lib/types/failure.js
/** Expected management rejection; presentation belongs to the caller's locale. */
var ManagementFailure = class extends Error {
	/** Code rendered by the caller's locale dictionary. */
	code;
	/** The packages an `incompatible-version` rejection names. */
	incompatible;
	/**
	* @param code Localizable management rejection.
	* @param incompatible Packages the running DSH version rejects, for `incompatible-version`.
	*/
	constructor(code, incompatible) {
		super(code);
		this.code = code;
		this.incompatible = incompatible;
	}
};
/**
* Drop the exemption status from an unexempted compatibility result.
* @param issue Result whose exemption is not active.
* @returns The package, runtime, and unmet DSH requirements.
*/
function incompatiblePlugin(issue) {
	return {
		name: issue.name,
		version: issue.version,
		runtimeVersion: issue.runtimeVersion,
		requirements: issue.requirements
	};
}
//#endregion
//#region lib/types/operations.js
/** Shared profile package operations used by dsh plugin and the running manager. */
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
/** Resolve relative package specs against the caller's directory.
* @param argument One pnpm argument.
* @param cwd Invocation directory, never the profile directory.
* @returns Anchored argument.
*/
function anchorPathSpec(argument, cwd) {
	const match = /^(?<prefix>(?:file|link):)?(?<path>\.{1,2}(?:[/\\].*)?)$/.exec(argument);
	if (match?.groups?.path === void 0) return argument;
	return `${match.groups.prefix ?? ""}${resolve(cwd, match.groups.path)}`;
}
/** Read bundle metadata without loading its JavaScript.
* @param name Installed dependency or installation-owned package name.
* @param dir Profile directory.
* @param anchor Installation manifest.
* @returns Resolved metadata, or undefined for packages without bundle metadata.
*/
function bundleManifest(name, dir, anchor) {
	const manifest = readProfileManifest("dsh", resolveBundleDir("dsh", name, anchor, dir));
	return manifest.dsh?.bundle?.patch === void 0 ? void 0 : manifest;
}
/** Atomically save a profile manifest while retaining unrelated fields.
* @param dir Profile directory.
* @param manifest Updated document.
*/
async function saveManifest(dir, manifest) {
	await writeFileAtomic(join(dir, "package.json"), JSON.stringify(manifest, void 0, 2) + "\n", { mode: 384 });
}
/** Reconcile package removals and newly installed bundles without re-enabling retained dependencies. */
async function reconcile(before, dir, anchor, options) {
	const after = readProfileManifest("dsh", dir);
	const dependencies = Object.keys(after.dependencies ?? {});
	const beforeDeps = new Set(Object.keys(before.dependencies ?? {}));
	const previous = after.dsh?.profile?.bundles ?? [];
	const bundles = previous.filter((name) => {
		if (!beforeDeps.has(name) && !dependencies.includes(name)) return true;
		return dependencies.includes(name) && bundleManifest(name, dir, anchor) !== void 0;
	});
	for (const name of dependencies) {
		if (beforeDeps.has(name)) continue;
		const metadata = bundleManifest(name, dir, anchor);
		if (metadata?.dsh?.bundle === void 0) {
			options.onOutput?.(`dsh: warning: ${name} declares no dsh.bundle — installed as a plain dependency, not a profile layer\n`, "stderr");
			continue;
		}
		for (const file of bundlePatchPaths(resolveBundleDir("dsh", name, anchor, dir), metadata.dsh.bundle)) loadOverlayPatches("dsh", file);
		if (!bundles.includes(name)) bundles.push(name);
	}
	if (JSON.stringify(previous) === JSON.stringify(bundles)) return;
	after.dsh = {
		...after.dsh,
		profile: {
			...after.dsh?.profile,
			bundles
		}
	};
	await saveManifest(dir, after);
}
/**
* How long the pipes keep draining after their process exited, as a fixed part of
* finishing a run rather than a deployment knob: a descendant that inherited them
* holds them open, and the tail a failure classification reads is written by then.
*/
const DRAIN_AFTER_EXIT_MS = 2e3;
/** Whether every collector finished within `ms`.
* @param collectors The pipe readers racing the bound.
* @param ms The longest wait, in milliseconds.
* @returns True when all collectors settled in time.
*/
async function drainWithin(collectors, ms) {
	if (collectors.length === 0) return true;
	let timer;
	try {
		return await Promise.race([Promise.allSettled(collectors).then(() => true), new Promise((resolve) => {
			timer = setTimeout(() => {
				resolve(false);
			}, ms);
		})]);
	} finally {
		clearTimeout(timer);
	}
}
/** Install commands that take the packages to install as positionals. */
const INSTALL_COMMANDS = new Set([
	"add",
	"install",
	"i"
]);
/** Bound on a pre-install registry lookup when the caller names none. */
const LOOKUP_TIMEOUT_MS = 2e4;
/** Package specs an install command names explicitly, in order. */
function namedSpecs(args) {
	const index = args.findIndex((argument) => !argument.startsWith("-"));
	const command = index < 0 ? void 0 : args[index];
	if (command === void 0 || !INSTALL_COMMANDS.has(command)) return [];
	return args.slice(index + 1).filter((argument) => !argument.startsWith("-"));
}
/** The manifest a named spec would install, read without installing it.
* A path spec is read from disk. A registry spec asks pnpm's own configuration for the version the
* range selects and its dsh requirements (`engines` and peerDependencies). A git or tarball spec needs the fetch itself, so the
* check after installation is what judges it.
* @param dir Profile directory the lookup runs in.
* @param spec Anchored install spec.
* @param options Pnpm executable, prefix arguments, the caller's bound and signal.
* @param environment Environment of the caller's pnpm invocations.
* @param flags Flags of the run itself, so the lookup asks the registry that run will use.
* @returns The package manifest, or undefined when reading it would need the installation itself.
*/
async function namedSpecManifest(dir, spec, options, environment, flags) {
	const parsed = parseInstallSpec(spec);
	if (parsed.kind === "path") {
		const filename = join(parsed.path, "package.json");
		return existsSync(filename) ? JSON.parse(readFileSync(filename, "utf8")) : void 0;
	}
	if (parsed.kind !== "registry") return void 0;
	const viewed = await execa(options.command ?? "pnpm", [
		...options.args ?? [],
		"view",
		parsed.spec,
		"name",
		"version",
		"engines",
		"peerDependencies",
		"--json",
		...flags,
		"--config.fetch-retries=0"
	], {
		cwd: dir,
		env: environment,
		extendEnv: false,
		reject: false,
		stdin: "ignore",
		...options.signal === void 0 ? {} : { cancelSignal: options.signal },
		timeout: options.lookupTimeoutMs ?? LOOKUP_TIMEOUT_MS
	});
	if (viewed.exitCode !== 0) return void 0;
	const value = JSON.parse(viewed.stdout);
	return Array.isArray(value) ? value.at(-1) : value;
}
/** Missing installed packages are repairable; their absence is part of the before/after comparison. */
function optionalFile(path) {
	try {
		return readFileSync(path, "utf8");
	} catch (error) {
		if (error.code === "ENOENT") return void 0;
		throw error;
	}
}
/** Where an operation records the pnpm run it started, for a successor when the operation's own process ends first. */
function runRecordPath(dir) {
	return join(dir, ".plugin-manager", "run.json");
}
/** Record a started run; a successor that takes over the profile lock from an exited process waits for it. */
async function recordRun(dir, tree) {
	if (tree.pid === void 0) return;
	await writeFileAtomic(runRecordPath(dir), `${JSON.stringify(tree)}\n`, {
		mode: 384,
		dirMode: 448
	});
}
/**
* Why this operation must not run: a record left by an operation whose process
* ended mid-run names a run that is still writing the profile. The profile
* lock is taken over once its holder exits, but its pnpm tree can outlive it.
* A recorded run that stopped, within a bounded wait, has its record removed.
* @param dir Profile directory.
* @returns The diagnostic, or undefined when no recorded run is active.
*/
async function activeRecordedRun(dir) {
	const path = runRecordPath(dir);
	const text = optionalFile(path);
	if (text === void 0) return void 0;
	let tree;
	try {
		const value = JSON.parse(text);
		const { pid, grouped } = typeof value === "object" && value !== null ? value : {};
		if (Number.isSafeInteger(pid) && pid > 0 && typeof grouped === "boolean") tree = {
			pid,
			grouped
		};
	} catch (error) {}
	if (tree === void 0) return `dsh: ${path} does not name a package run; delete it once no earlier package operation is still running in this profile\n`;
	await awaitTreeGone(tree);
	if (treeAlive(tree)) return `dsh: process ${String(tree.pid)}, started by an earlier package operation whose own process ended, is still running in this profile; wait for it or stop it, then retry. If process ${String(tree.pid)} is not that package run, delete ${path}.\n`;
	await rm(path, { force: true });
}
/** pnpm can install plugins through any direct-dependency field. */
function directDependencies(manifest) {
	const extra = manifest;
	return {
		...extra.devDependencies,
		...manifest.dependencies,
		...extra.optionalDependencies
	};
}
/** Inspect only plugin rows contributed by the changed bundle, not its dependency closure. */
function bundleComponentManifests(manifest, dir, anchor) {
	const bundle = manifest.dsh?.bundle;
	if (bundle === void 0) return [];
	const patches = bundlePatchPaths(dir, bundle).flatMap((file) => loadOverlayPatches("dsh", file));
	const names = /* @__PURE__ */ new Set();
	const visit = (rows) => {
		for (const row of rows) {
			if (row.group && Array.isArray(row.config)) visit(row.config);
			if (typeof row.name !== "string" || row.name.startsWith(".") || row.name.startsWith("/") || row.name.includes(":")) continue;
			const parts = row.name.split("/");
			names.add(parts.slice(0, row.name.startsWith("@") ? 2 : 1).join("/"));
		}
	};
	visit(composeEntries([patches.filter((patch) => patch.insert !== void 0)]));
	return [...names].flatMap((name) => {
		let packageDir;
		try {
			packageDir = resolveBundleDir("dsh", name, anchor, dir);
		} catch (error) {
			return [];
		}
		return [readProfileManifest("dsh", packageDir)];
	});
}
/** Execute pnpm inside a profile whose caller already holds the profile write lock.
* Newly installed or updated direct dependencies are checked even when activation is disabled;
* an untouched dependency never blocks an unrelated operation and stays denied at startup.
* Compatibility denial restores the profile manifest and lockfile, but leaves downloaded modules on disk.
* @param context Launcher-owned profile and resolution locations.
* @param args Pnpm arguments, before relative path anchoring.
* @param options Output, activation and cancellation policy.
* @returns Exit status, whether the silence bound stopped the run, and the diagnostic path.
* A compatibility denial returns exit code 1. Service output is bounded; CLI output uses inherited descriptors.
* The diagnostic file is closed on return or rejection, including preparation and spawn failures.
*/
async function runProfilePnpm(context, args, options) {
	const env_1 = {
		stack: [],
		error: void 0,
		hasError: false
	};
	try {
		const dir = context.dir ?? resolveProfileDir(context.profile, context.home);
		const active = await activeRecordedRun(dir);
		const logRoot = join(dir, ".plugin-manager", "logs");
		await mkdir(logRoot, {
			recursive: true,
			mode: 448
		});
		const logPath = join(await mkdtemp(join(logRoot, "operation-")), "pnpm.log");
		const log = __addDisposableResource(env_1, await open(logPath, "wx", 384), true);
		if (active !== void 0) {
			await log.write(active);
			await log.close();
			options.onOutput?.(active, "stderr");
			const bytes = Buffer.from(active);
			return {
				exitCode: 1,
				output: bytes.subarray(Math.max(0, bytes.length - options.outputBytes)).toString("utf8"),
				truncated: bytes.length > options.outputBytes,
				logPath
			};
		}
		const before = readProfileManifest("dsh", dir);
		const savedFiles = ["package.json", "pnpm-lock.yaml"].map((name) => ({
			path: join(dir, name),
			text: optionalFile(join(dir, name))
		}));
		const beforeDependencies = directDependencies(before);
		const installedBefore = new Map(Object.keys(beforeDependencies).map((name) => [name, optionalFile(join(dir, "node_modules", name, "package.json"))]));
		let output = Buffer.alloc(0);
		let truncated = false;
		const append = (bytes) => {
			output = Buffer.concat([output, bytes]);
			if (output.length > options.outputBytes) {
				truncated = true;
				output = output.subarray(output.length - options.outputBytes);
			}
		};
		const environment = {
			...options.execution === "cli" ? process.env : scrubbedParentEnv(),
			...options.env
		};
		const restore = async () => {
			for (const file of savedFiles) if (file.text === void 0) await rm(file.path, { force: true });
			else await writeFileAtomic(file.path, file.text, { mode: 384 });
		};
		/** Packages a compatibility check refused; callers render them for their own surface. */
		const incompatible = [];
		const rejected = async (warnings, restoration) => {
			const diagnostic = `\ndsh: installation rejected: ${warnings.join("\n")}\ndsh: ${restoration}.\n`;
			await log.write(diagnostic);
			options.onOutput?.(diagnostic, "stderr");
			append(Buffer.from(diagnostic));
			await log.close();
			return {
				exitCode: 1,
				output: output.toString("utf8"),
				truncated,
				logPath,
				incompatible
			};
		};
		const preflight = [];
		const exemptions = readProfileVersionExemptions(dir);
		const registryFlags = args.filter((argument) => argument.startsWith("--registry="));
		for (const raw of namedSpecs(args)) try {
			const manifest = await namedSpecManifest(dir, anchorPathSpec(raw, context.cwd), options, environment, registryFlags);
			if (manifest === void 0) continue;
			const issue = evaluatePluginCompatibility(manifest, exemptions);
			if (issue !== void 0 && !issue.exempted) {
				preflight.push(pluginCompatibilityWarning(issue));
				incompatible.push(incompatiblePlugin(issue));
			}
		} catch (error) {
			continue;
		}
		if (preflight.length > 0) return await rejected(preflight, "nothing was installed");
		const cancellation = new AbortController();
		const grouped = leadsOwnGroup(options.execution);
		const child = execa(options.command ?? "pnpm", [...options.args ?? [], ...args.map((arg) => anchorPathSpec(arg, context.cwd))], {
			cwd: dir,
			env: environment,
			extendEnv: false,
			reject: false,
			stdout: options.execution === "cli" ? "inherit" : "pipe",
			stderr: options.execution === "cli" ? "inherit" : "pipe",
			killDescendants: options.execution === "service",
			buffer: false,
			stdin: options.execution === "cli" ? "inherit" : "ignore",
			cancelSignal: options.signal === void 0 ? cancellation.signal : AbortSignal.any([cancellation.signal, options.signal])
		});
		const exited = once(child.nodeChildProcess, "exit").catch(() => void 0);
		let writes = Promise.resolve();
		/** `settled` records that the process outcome is known; `stalled` that the silence bound stopped the run. */
		const control = {
			settled: false,
			stalled: false
		};
		/** Set once this call cuts the reading short itself, so the close it causes is not read as a run failure. */
		let cut = false;
		/** The first failure a reading hit before that cut, which the run still reports. */
		let failure;
		let idleTimer;
		/** The silence bound: a captured run that stops printing without exiting is terminated, never awaited. */
		const armIdle = () => {
			if (control.settled || options.idleTimeoutMs === void 0) return;
			clearTimeout(idleTimer);
			idleTimer = setTimeout(() => {
				control.stalled = true;
				child.kill();
			}, options.idleTimeoutMs);
		};
		const collect = async (stream, kind) => {
			try {
				for await (const chunk of stream) {
					armIdle();
					const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
					writes = writes.then(async () => {
						await log.write(bytes);
					});
					await writes;
					options.onOutput?.(bytes.toString("utf8"), kind);
					append(bytes);
				}
			} catch (error) {
				if (!cut) {
					failure ??= error instanceof Error ? error : new Error(String(error));
					cancellation.abort();
				}
				throw error;
			}
		};
		const collectors = [...child.stdout === null ? [] : [collect(child.stdout, "stdout")], ...child.stderr === null ? [] : [collect(child.stderr, "stderr")]];
		for (const collector of collectors) collector.catch(() => {});
		if (collectors.length > 0) armIdle();
		let exitCode;
		try {
			await recordRun(dir, {
				pid: child.pid,
				grouped
			});
			const settled = Promise.allSettled([child]);
			await Promise.race([exited, settled]);
			control.settled = true;
			clearTimeout(idleTimer);
			if (control.stalled) await awaitTreeGone({
				pid: child.pid,
				grouped
			});
			if (await drainWithin(collectors, DRAIN_AFTER_EXIT_MS)) {
				for (const stream of await Promise.allSettled(collectors)) if (stream.status === "rejected") throw stream.reason;
			} else {
				cut = true;
				child.stdout?.destroy();
				child.stderr?.destroy();
				const notice = "dsh: pnpm output was cut short after its process exited\n";
				await log.write(notice);
				if (failure !== void 0) throw failure;
				options.onOutput?.(notice, "stderr");
				append(Buffer.from(notice));
			}
			const [completion] = await settled;
			if (completion.status === "rejected") throw completion.reason;
			const result = completion.value;
			exitCode = result.exitCode ?? (result.code === "ENOENT" ? 127 : 1);
			if (control.stalled) {
				const notice = `dsh: pnpm printed nothing for ${String(options.idleTimeoutMs)}ms and was terminated\n`;
				await log.write(notice);
				options.onOutput?.(notice, "stderr");
				append(Buffer.from(notice));
			}
			if (result.failed && output.length === 0) {
				const diagnostic = result.shortMessage ?? "pnpm failed";
				await log.write(diagnostic);
				truncated = Buffer.byteLength(diagnostic) > options.outputBytes;
				output = Buffer.from(diagnostic).subarray(0, options.outputBytes);
			}
			if (exitCode === 0 && !control.stalled) {
				const after = readProfileManifest("dsh", dir);
				const warnings = [];
				for (const [name, spec] of Object.entries(directDependencies(after))) {
					const packageDir = join(dir, "node_modules", name);
					const installed = optionalFile(join(packageDir, "package.json"));
					if (installed === void 0) continue;
					const untouched = beforeDependencies[name] === spec && installedBefore.get(name) === installed;
					const found = [];
					const issues = [];
					try {
						const manifest = readProfileManifest("dsh", packageDir);
						for (const candidate of [manifest, ...bundleComponentManifests(manifest, packageDir, context.installAnchor)]) {
							const issue = evaluatePluginCompatibility(candidate, readProfileVersionExemptions(dir));
							if (issue !== void 0 && !issue.exempted) {
								found.push(pluginCompatibilityWarning(issue));
								issues.push(incompatiblePlugin(issue));
							}
						}
					} catch (error) {
						found.push(`Cannot validate installed package ${name}: ${String(error)}`);
					}
					if (found.length === 0) continue;
					if (!untouched) {
						warnings.push(...found);
						incompatible.push(...issues);
					} else {
						const notice = `\ndsh: warning: ${found.join("\n")}\ndsh: it stays installed but profile startup denies it until you grant an exemption for those exact versions.\n`;
						await log.write(notice);
						options.onOutput?.(notice, "stderr");
					}
				}
				if (warnings.length > 0) {
					await restore();
					const repair = ["install", savedFiles.some((file) => file.path.endsWith("pnpm-lock.yaml") && file.text !== void 0) ? "--frozen-lockfile" : "--config.lockfile=false"];
					const repairing = execa(options.command ?? "pnpm", [...options.args ?? [], ...repair], {
						cwd: dir,
						env: environment,
						extendEnv: false,
						reject: false,
						stdin: "ignore",
						...options.idleTimeoutMs === void 0 ? {} : { timeout: options.idleTimeoutMs }
					});
					await recordRun(dir, {
						pid: repairing.pid,
						grouped: false
					});
					const repaired = await repairing;
					exitCode = 1;
					const restoration = repaired.exitCode === 0 ? "restored package.json, pnpm-lock.yaml, and node_modules" : "restored package.json and pnpm-lock.yaml, but node_modules could not be reinstalled; run 'dsh plugin install'";
					const diagnostic = `\ndsh: installation rejected: ${warnings.join("\n")}\ndsh: ${restoration}.\n`;
					await log.write(diagnostic);
					options.onOutput?.(diagnostic, "stderr");
					append(Buffer.from(diagnostic));
				} else if (options.activateNewBundles !== false) await reconcile(before, dir, context.installAnchor, options);
			}
		} finally {
			control.settled = true;
			clearTimeout(idleTimer);
			await rm(runRecordPath(dir), { force: true });
			await log.close();
		}
		return {
			exitCode,
			output: output.toString("utf8"),
			truncated,
			logPath,
			...control.stalled ? { timedOut: true } : {},
			...incompatible.length > 0 ? { incompatible } : {}
		};
	} catch (e_1) {
		env_1.error = e_1;
		env_1.hasError = true;
	} finally {
		const result_1 = __disposeResources(env_1);
		if (result_1) await result_1;
	}
}
/**
* Read the registry pnpm's own configuration names in the profile: its `.npmrc` chain and workspace settings,
* as `pnpm config get registry` resolves them.
* @param dir Profile directory.
* @param options The pnpm executable and the time bound.
* @returns The registry URL as pnpm printed it, or null when pnpm did not answer with one.
*/
async function readProfileRegistry(dir, options) {
	const result = await execa(options.command ?? "pnpm", [
		...options.args ?? [],
		"config",
		"get",
		"registry"
	], {
		cwd: dir,
		env: {
			...scrubbedParentEnv(),
			...options.env
		},
		extendEnv: false,
		reject: false,
		stdin: "ignore",
		timeout: options.timeoutMs
	});
	const answer = result.exitCode === 0 ? result.stdout.trim().replace(/^[\s\S]*\n/, "").trim() : "";
	return /^https?:\/\/\S+$/.test(answer) ? answer : null;
}
/**
* The argument that sends one pnpm command to a registry.
* @param registry - the registry, or null for the one pnpm's own configuration names.
* @returns `--registry=<url>` for a URL; nothing for null.
*/
function registryArguments(registry) {
	return registry === null ? [] : [`--registry=${registry}`];
}
/**
* Ask the registry what a spec names through `pnpm view`, run in the profile
* directory so the registry, proxy, and authentication settings of an install
* apply. The lookup makes one request without pnpm's own retries: a registry
* that does not answer is reported within `timeoutMs`, and the registries
* configured after it are the retry.
* @param dir Profile directory.
* @param spec One registry spec: a package name with an optional range.
* @param options The registry, cancellation, and the time bound.
* @returns pnpm's exit, output, and how the lookup ended.
*/
async function viewProfilePackage(dir, spec, options) {
	const result = await execa(options.command ?? "pnpm", [
		...options.args ?? [],
		"view",
		spec,
		"name",
		"version",
		"description",
		"dsh",
		"--json",
		...registryArguments(options.registry ?? null),
		"--config.fetch-retries=0"
	], {
		cwd: dir,
		env: {
			...scrubbedParentEnv(),
			...options.env
		},
		extendEnv: false,
		reject: false,
		stdin: "ignore",
		timeout: options.timeoutMs,
		...options.signal === void 0 ? {} : { cancelSignal: options.signal }
	});
	const cause = result.exitCode === void 0 && !result.timedOut && !result.isCanceled ? Object.assign(new Error(result.shortMessage), { code: result.code }) : void 0;
	return {
		exitCode: result.exitCode ?? null,
		stdout: result.stdout,
		stderr: result.stderr,
		timedOut: result.timedOut,
		...cause === void 0 ? {} : { cause }
	};
}
//#endregion
//#region lib/types/install-failure.js
/**
* What a failed pnpm run was, read off how it ended and what it printed:
* pnpm names its failures with stable `ERR_PNPM_*` codes and Node's errno
* names, which the run's captured tail carries whatever the locale.
* @module @deepseek-ai/dsh-plugin-manager/install-failure
*/
/** Patterns in the order they decide: a specific code before the generic network family. */
const LOG_KINDS = [
	["build-blocked", /ERR_PNPM_IGNORED_BUILDS|Ignored build scripts/],
	["not-found", /ERR_PNPM_FETCH_404|\bE404\b|404 Not Found|Not Found - GET/],
	["no-matching-version", /ERR_PNPM_NO_MATCHING_VERSION|\bETARGET\b|No matching version/],
	["disk-full", /\bENOSPC\b|no space left on device/i],
	["permission", /\bEACCES\b|\bEPERM\b|permission denied/i],
	["integrity", /ERR_PNPM_TARBALL_INTEGRITY|ERR_PNPM_BAD_TARBALL_SIZE|\bEINTEGRITY\b/],
	["unknown", /The requested URL returned error: 40[134]\b/],
	["network", /\bENOTFOUND\b|\bECONNRESET\b|\bETIMEDOUT\b|\bECONNREFUSED\b|\bEAI_AGAIN\b|ERR_PNPM_META_FETCH_FAIL|ERR_PNPM_FETCH_5\d\d|ERR_PNPM_FETCH_TIMEOUT|\bFETCH_ERROR\b|socket hang up|Could not resolve host|unable to access/]
];
/**
* Classify a failed run.
* @param facts - how the run ended and what it printed.
* @returns the kind, `unknown` when nothing in the facts names one.
*/
function classifyInstallFailure(facts) {
	if (facts.timedOut === true) return "timeout";
	if (facts.cause?.code === "ENOENT") return "pnpm-missing";
	for (const [kind, pattern] of LOG_KINDS) if (pattern.test(facts.log)) return kind;
	return "unknown";
}
//#endregion
//#region lib/types/official-install-target.js
/** Select Official bundle packages from the running installation without importing provider code. */
function manifestAt(file) {
	return JSON.parse(readFileSync(file, "utf8"));
}
/**
* Offer a source checkout link or an exact published package version. Source installations are
* identified by the real CLI manifest and its unpacked workspace dependencies, including Desktop's
* development symlink. An incomplete checkout is an error, never a registry fallback.
* @param name - Official catalog package name.
* @param installAnchor - Running application's DSH package.json, possibly reached through a symlink.
* @param version - Running DSH version used by its release family.
* @returns An ordinary package-manager spec and its package version.
* @throws when a source installation lacks its workspace package, bundle patch, or built runtime.
*/
function officialBundleInstallTarget(name, installAnchor, version) {
	const anchor = realpathSync(installAnchor);
	const installation = manifestAt(anchor);
	if (!(installation.name === "@deepseek-ai/dsh" && Object.values(installation.dependencies ?? {}).some((value) => value.startsWith("workspace:")))) return {
		spec: `${name}@${version}`,
		version
	};
	const root = resolve(dirname(anchor), "../..");
	if (anchor !== join(root, "apps", "cli", "package.json") || !existsSync(join(root, "package.json")) || manifestAt(join(root, "package.json")).name !== "@deepseek-ai/dsh-root") throw new Error(`Official bundle ${name}: source DSH installation ${anchor} requires its complete workspace checkout`);
	const matches = globSync("packages/*/*/package.json", { cwd: root }).map((file) => ({
		file: join(root, file),
		manifest: manifestAt(join(root, file))
	})).filter((entry) => entry.manifest.name === name);
	const selected = matches[0];
	if (matches.length !== 1 || selected === void 0) throw new Error(`Official bundle ${name}: expected one workspace package in ${root}, found ${matches.length}; restore the checkout and run pnpm install`);
	const { file, manifest } = selected;
	const directory = realpathSync(dirname(file));
	if (manifest.version !== version || manifest.private === true || manifest.dsh?.bundle === void 0) throw new Error(`Official bundle ${name}: ${file} must declare a public bundle at DSH version ${version}`);
	const main = typeof manifest.main === "string" ? resolve(directory, manifest.main) : void 0;
	if (main === void 0 || !existsSync(main) || !statSync(main).isFile()) throw new Error(`Official bundle ${name}: built runtime is missing in ${directory}; run pnpm install and pnpm run build in ${root}`);
	for (const patch of bundlePatchPaths(directory, manifest.dsh.bundle)) if (!existsSync(patch) || !statSync(patch).isFile()) throw new Error(`Official bundle ${name}: bundle patch ${patch} is missing; restore the checkout`);
	return {
		spec: `link:${directory}`,
		version
	};
}
/** Public npmmirror URL shared by the fallback configuration and public-registry comparison. */
const NPMMIRROR_REGISTRY = "https://registry.npmmirror.com/";
/**
* Parse a registry URL into the form pnpm compares registries in: lower-case host, trailing slash.
* @param url - the registry as configured or requested.
* @returns the normalized URL.
* @throws {Error} for anything but an http(s) URL.
*/
function normalizeRegistry(url) {
	let parsed;
	try {
		parsed = new URL(url);
	} catch {}
	if (parsed === void 0 || parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error(`a registry must be an http(s) URL: ${url}`);
	if (!parsed.pathname.endsWith("/")) parsed.pathname += "/";
	return parsed.href;
}
/**
* The registries one operation asks, first to last.
*
* The configured set is the configured first registry and the fallbacks; a
* requested registry is asked first when it is one of them, alone otherwise,
* so a private registry never falls through to a public one. pnpm's own
* registry (`null`) belongs to the set only when what it names is known to
* be public: npm's own registry or one of the configured fallbacks. While it
* names anything else, or is unknown, it is asked alone, and a public
* registry asked instead never falls back into it. A registry pnpm's own
* configuration already names is asked once.
* @param requested - the caller's registry; undefined defers to the configured first one.
* @param configured - the configured first registry, the fallbacks after it, and what pnpm's own configuration names.
* @returns the registries to ask, in order; never empty.
*/
function registryPlan(requested, configured) {
	const own = configured.resolved === null ? null : normalizeRegistry(configured.resolved);
	const fallbacks = configured.fallbackRegistries.map(normalizeRegistry);
	const ownIsPublic = own !== null && (own === "https://registry.npmjs.org/" || fallbacks.includes(own));
	const keyOf = (registry) => registry === null ? own : normalizeRegistry(registry);
	const known = [];
	const keys = [];
	for (const registry of [configured.registry, ...configured.fallbackRegistries]) {
		if (registry === null && !ownIsPublic) continue;
		const key = keyOf(registry);
		if (keys.includes(key)) continue;
		known.push(registry === null ? null : normalizeRegistry(registry));
		keys.push(key);
	}
	const first = requested === void 0 ? configured.registry : requested;
	const firstKey = keyOf(first);
	const normalizedFirst = first === null ? null : normalizeRegistry(first);
	if ((first === null || firstKey === own) && !ownIsPublic) return [normalizedFirst];
	if (!keys.includes(firstKey)) return [normalizedFirst];
	return [normalizedFirst, ...known.filter((_registry, index) => keys[index] !== firstKey)];
}
/** The failures after which another registry can answer differently: this one was unreachable, or its copy may be stale. */
const NEXT_REGISTRY_KINDS = new Set([
	"network",
	"timeout",
	"not-found",
	"no-matching-version"
]);
/** A line of pnpm or git output that reports a failure, as opposed to a warning or progress line. */
const ERROR_LINE = /ERR_|ERROR|\berror\b|fatal:|Could not resolve|unable to access|ssh:|\bE[A-Z]{4,}\b/;
/**
* What a failed attempt could not reach or get an answer from.
* @param kind - how the attempt failed.
* @param log - what the attempt printed.
* @param spec - the spec the attempt installed.
* @returns `registry` for a failure another registry can change; `spec-host` when an error line names the host a git
* or tarball spec is fetched from, which no registry stands in for; `other` for a failure neither explains.
*/
function attributeFailure(kind, log, spec) {
	if (!NEXT_REGISTRY_KINDS.has(kind)) return "other";
	const host = spec.kind === "git" || spec.kind === "tarball" ? spec.host?.toLowerCase() : void 0;
	if (host === void 0) return "registry";
	return log.split("\n").some((line) => ERROR_LINE.test(line) && line.toLowerCase().includes(host)) ? "spec-host" : "registry";
}
//#endregion
//#region lib/types/patch.js
/** Comment-preserving profile plugin enablement edits and the entry flattening they compare against. */
/** Flatten only the groups addressable by the profile's patch composer.
* @param rows Composed top-level entries.
* @returns Entries in depth-first order.
*/
function flatten(rows) {
	return rows.flatMap((row) => [row, ...row.group && Array.isArray(row.config) ? flatten(row.config) : []]);
}
/** Replace the last matching override or append one after existing insertions. An override that holds only `id` and
* `disabled`, without anchors, is removed, or not appended, when the bundle layers and the remaining profile patches
* already give the entry the requested literal `disabled` value; home patches and launch overlays are not consulted.
* @param profile Profile whose patch file is edited and whose selected bundles supply the compared composition.
* @param id Unique composition entry id.
* @param name Module name used to match name-qualified overrides.
* @param enabled Desired entry enablement.
* @returns Whether the file changed.
*/
async function writePluginEnabled(profile, id, name, enabled) {
	const filename = profile.patchPath;
	let text;
	try {
		text = await readFile(filename, "utf8");
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
		text = "[]\n";
	}
	const document = parseDocument(text, { customTags: [{
		tag: "tag:yaml.org,2002:js",
		resolve: (value) => value
	}] });
	const error = document.errors[0];
	if (error !== void 0) throw error;
	if (!isSeq(document.contents)) throw new Error("Profile patch must be a YAML sequence");
	const patches = loadOptionalPatches("dsh", filename) ?? [];
	const bundlePatches = readBundlePatches("dsh", profile);
	const items = document.contents.items;
	const target = items.findLast((item, index) => {
		if (!isMap(item) || document.getIn([index, "id"]) !== id || item.has("insert")) return false;
		const expectedName = document.getIn([index, "name"]);
		return !expectedName || expectedName === name;
	});
	const implied = (index) => {
		const row = flatten(composeEntries([[...bundlePatches, ...patches.toSpliced(index, 1)]])).findLast((entry) => entry.id === id);
		return row !== void 0 && (row.disabled ?? false) === !enabled;
	};
	if (isMap(target)) {
		const index = items.indexOf(target);
		if (target.anchor === void 0 && target.items.every((pair) => isScalar(pair.key) && isScalar(pair.value) && pair.key.anchor === void 0 && pair.value.anchor === void 0 && (pair.key.value === "id" || pair.key.value === "disabled")) && implied(index)) {
			document.deleteIn([index]);
			const comment = target.commentBefore;
			const next = items[index];
			if (comment && isNode(next)) next.commentBefore = next.commentBefore ? `${comment}\n${next.commentBefore}` : comment;
			else if (comment && items.length === 0) document.contents.commentBefore = comment;
			else if (comment) document.comment = document.comment ? `${comment}\n${document.comment}` : comment;
		} else if (document.getIn([index, "disabled"]) === !enabled) return false;
		else document.setIn([index, "disabled"], !enabled);
	} else {
		if (implied(items.length)) return false;
		document.add({
			id,
			disabled: !enabled
		});
	}
	await writeFileAtomic(filename, String(document), { mode: 384 });
	return true;
}
//#endregion
//#region lib/types/build-approval.js
/** Approve pnpm's pending dependency scripts in the current profile's workspace settings. */
/** Value pnpm leaves for a build script that still needs a decision. */
const UNDECIDED_BUILD = "set this to true or false";
/** Where a non-interactive run names the build scripts it skipped. */
const IGNORED_BUILDS = /\bIgnored build scripts: (.+)/;
async function readPolicy(dir) {
	let text;
	try {
		text = await readFile(join(dir, "pnpm-workspace.yaml"), "utf8");
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
		text = "{}\n";
	}
	const document = parseDocument(text);
	if (document.errors[0] !== void 0) throw document.errors[0];
	if (!isMap(document.contents)) throw new Error("pnpm-workspace.yaml must be a YAML mapping");
	const builds = document.get("allowBuilds");
	if (builds !== void 0 && !isMap(builds)) throw new Error("allowBuilds must be a YAML mapping");
	visit(builds ?? null, (_key, node) => {
		if (isAlias(node) || isNode(node) && "anchor" in node && node.anchor) throw new Error("allowBuilds must not contain YAML anchors or aliases");
	});
	const keys = isMap(builds) ? builds.items.flatMap(({ key }) => isScalar(key) && typeof key.value === "string" ? [key.value] : []) : [];
	return {
		document,
		pending: isMap(builds) ? builds.items.flatMap(({ key, value }) => isScalar(key) && typeof key.value === "string" && !/[*?]/.test(key.value) && isScalar(value) && value.value === UNDECIDED_BUILD ? [key.value] : []) : [],
		keys
	};
}
/**
* Record the build scripts a failed run reported as ignored, then list every name awaiting a decision.
*
* pnpm writes those policy entries itself only when it can prompt, and the
* manager always runs it non-interactively, so the run's own report is the
* record that survives.
* @param dir Current profile directory.
* @param output Captured output of the failed run.
* @returns Exact package names awaiting a build decision; wildcard rules are excluded.
*/
async function recordPendingBuilds(dir, output) {
	const { document, pending, keys } = await readPolicy(dir);
	const known = new Set(keys);
	const added = ignoredBuildNames(output).filter((name) => !known.has(name));
	if (added.length === 0) return pending;
	for (const name of added) document.setIn(["allowBuilds", name], UNDECIDED_BUILD);
	await writeFileAtomic(join(dir, "pnpm-workspace.yaml"), String(document), { mode: 384 });
	return [...pending, ...added];
}
/**
* Read the package names a pnpm run reported as ignored build scripts.
* @param output Captured output of the run.
* @returns Exact names in report order; wildcard patterns are excluded.
*/
function ignoredBuildNames(output) {
	const reported = IGNORED_BUILDS.exec(output)?.[1];
	if (reported === void 0) return [];
	return reported.split(",").map((name) => name.trim()).filter((name) => name !== "" && !/[*?]/.test(name));
}
/** Persist approval without running scripts; the caller holds the profile manifest lock.
* @param dir Current profile directory.
* @param names Explicit package names from the pending build list.
* @throws If a name is no longer pending or allowBuilds contains YAML anchors or aliases; no approvals are written.
*/
async function approveBuilds(dir, names) {
	const { document, pending } = await readPolicy(dir);
	if (names.some((name) => !pending.includes(name))) throw new ManagementFailure("stale-approval");
	if (names.length === 0) return;
	for (const name of names) document.setIn(["allowBuilds", name], true);
	await writeFileAtomic(join(dir, "pnpm-workspace.yaml"), String(document), { mode: 384 });
}
//#endregion
//#region lib/types/github-connection.js
/** Bounded GitHub repository checks using the installer's Git configuration and environment. */
/**
* Check a GitHub repository before pnpm starts, without downloading or building its package.
* Git reads the profile's Git and proxy configuration without invoking credential helpers or prompting.
* Timeout and cancellation terminate its descendants too; pnpm owns authentication and transport fallback.
* @param spec The parsed installation address; npm packages, local paths and other hosts are not checked.
* @param dir The profile directory where installation runs.
* @param options The connection deadline, output bound and operation cancellation.
* @returns A failed check with bounded output and a complete log at logPath, or undefined for a reachable repository or an unhandled spec.
*/
async function checkGithubConnection(spec, dir, options) {
	if (spec.kind !== "git") return void 0;
	const host = spec.host.toLowerCase().replace(/:.*$/, "");
	if (host !== "github.com" && !host.endsWith(".github.com")) return void 0;
	const repository = spec.spec.replace(/#.*$/s, "").replace(/^github:/i, "https://github.com/").replace(/^gist:/i, "https://gist.github.com/").replace(/^git\+/i, "");
	const logRoot = join(dir, ".plugin-manager", "logs");
	await mkdir(logRoot, {
		recursive: true,
		mode: 448
	});
	const logPath = join(await mkdtemp(join(logRoot, "github-connection-")), "git.log");
	const log = await open(logPath, "ax+", 384);
	try {
		const result = await execa("git", [
			"-c",
			"credential.helper=",
			"ls-remote",
			"--",
			repository,
			"HEAD"
		], {
			cwd: dir,
			env: {
				...scrubbedParentEnv(),
				...options.env,
				LC_ALL: "C",
				GIT_TERMINAL_PROMPT: "0",
				GIT_ASKPASS: "",
				SSH_ASKPASS: "",
				SSH_ASKPASS_REQUIRE: "never"
			},
			extendEnv: false,
			stdin: "ignore",
			stdout: "ignore",
			stderr: {
				file: logPath,
				append: true
			},
			buffer: false,
			reject: false,
			timeout: options.timeoutMs,
			cancelSignal: options.signal,
			killDescendants: true,
			killSignal: "SIGKILL"
		});
		if (!result.failed) return void 0;
		if (result.timedOut) await log.write(`dsh: connection to ${spec.host} timed out after ${String(options.timeoutMs)}ms\n`);
		if ((await log.stat()).size === 0) await log.write(result.shortMessage ?? "GitHub connection check failed");
		const { size } = await log.stat();
		const bytes = Buffer.alloc(Math.min(size, options.outputBytes));
		await log.read(bytes, 0, bytes.length, size - bytes.length);
		const output = bytes.toString("utf8");
		return {
			exitCode: result.exitCode ?? (result.code === "ENOENT" ? 127 : 1),
			output,
			truncated: size > options.outputBytes,
			logPath,
			kind: classifyInstallFailure({
				log: output,
				timedOut: result.timedOut
			})
		};
	} finally {
		await log.close();
	}
}
//#endregion
//#region lib/types/index.js
/** Current-profile plugin and bundle management over shared dsh plugin operations. */
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
/** An http(s) URL, as pnpm's `--registry` takes it. */
const REGISTRY_URL = /^https?:\/\/\S+$/;
const protectedModules = new Set([
	"@deepseek-ai/dsh-plugin-manager",
	"@deepseek-ai/cordis-plugin-loader",
	"@deepseek-ai/cordis-plugin-include",
	"@deepseek-ai/dsh-api-gateway",
	"@deepseek-ai/dsh-host-webserver",
	"@deepseek-ai/dsh-client-modules",
	"@deepseek-ai/dsh-client-ui-settings-plugin-inventory",
	"@deepseek-ai/dsh-client-ui-plugin-manager",
	"@deepseek-ai/dsh-host-plugin-inventory",
	"@deepseek-ai/dsh-typert-registry",
	"@deepseek-ai/dsh-api-remotes",
	"@deepseek-ai/dsh-api-remote-access",
	"@deepseek-ai/cordis-plugin-timer",
	"@deepseek-ai/dsh-client-connection",
	"@deepseek-ai/dsh-host-frontend-static",
	"@deepseek-ai/dsh-tools",
	"@deepseek-ai/dsh-hmr"
]);
/** The profile files an installation writes and a failed or cancelled one restores. */
const RESTORED_FILES = ["package.json", "pnpm-lock.yaml"];
/** pnpm's colour escapes, which a JSON answer may be wrapped in. */
const ANSI_SEQUENCE = /\x1b\[[0-9;]*m/g;
/** Preserve the exact observed diagnostic, including non-Error failures. */
function messageOf(error) {
	return error instanceof Error ? error.message : String(error);
}
/** An expected refusal keeps its code; anything else becomes an operation error carrying its exact diagnostic. */
function managementError(error) {
	if (!(error instanceof ManagementFailure)) return {
		code: "operation-error",
		diagnostic: messageOf(error)
	};
	return {
		code: error.code,
		...error.incompatible === void 0 ? {} : { incompatible: error.incompatible }
	};
}
/** The caller stopped an installation; its files are restored before this is thrown. */
var InstallCancelledError = class extends Error {
	constructor() {
		super("Installation cancelled");
		this.name = "InstallCancelledError";
	}
};
/** A manifest field that is a string, when the manifest carries one. */
function stringField(manifest, field) {
	const value = manifest[field];
	return typeof value === "string" ? value : void 0;
}
/** What a package manifest says about the package: identity, one-liner, and whether it is a bundle. */
function inspectionOf(kind, manifest, registry) {
	const dsh = manifest.dsh;
	const declared = typeof dsh === "object" && dsh !== null ? dsh : void 0;
	const bundle = declared !== void 0 && typeof declared.bundle === "object" && declared.bundle !== null;
	const name = stringField(manifest, "name");
	const version = stringField(manifest, "version");
	const description = stringField(manifest, "description");
	return {
		status: "accepted",
		kind,
		bundle,
		registry,
		...name === void 0 ? {} : { name },
		...version === void 0 ? {} : { version },
		...description === void 0 || description === "" ? {} : { description }
	};
}
function refused(problem, reason) {
	return {
		status: "refused",
		problem,
		reason
	};
}
/** The refusal `pnpm view --json` prints on stdout, `{ error: { code, message } }`, as one log line; empty for anything else. */
function printedError(printed) {
	let parsed;
	try {
		parsed = JSON.parse(printed || "null");
	} catch {
		return "";
	}
	const error = typeof parsed === "object" && parsed !== null ? parsed.error : void 0;
	if (typeof error !== "object" || error === null) return "";
	const { code, message } = error;
	return [code, message].filter((part) => typeof part === "string").join("  ");
}
/** The bundles a profile manifest selects. */
function bundleSelection(manifest) {
	return manifest.dsh?.profile?.bundles ?? [];
}
/**
* The package an installation spec names before pnpm runs: a registry name, a local directory's manifest name, or the
* dependency saved with this git or tarball spec, compared as the plugin list shows saved specs.
* @param spec The installation spec.
* @param dependencies The profile's saved dependencies.
* @param profileDir The profile directory saved local paths are relative to.
* @returns The package name, or `undefined` when only the installation tells it.
*/
function specPackageName(spec, dependencies, profileDir) {
	const parsed = parsedForRegistry(spec);
	if (parsed.kind === "registry") return parsed.name;
	if (parsed.kind === "path") return packageName(parsed.path);
	const specs = parsed.kind === "tarball" && parsed.path !== void 0 ? [spec, `file:${parsed.path}`] : [spec];
	return Object.entries(dependencies).find(([dependency, saved]) => specs.includes(dependencySpec(dependency, saved, profileDir)))?.[0];
}
/** The package name a local directory declares, or `undefined` without a readable manifest. */
function packageName(dir) {
	try {
		return readProfileManifest("dsh", dir).name;
	} catch (_error) {
		return;
	}
}
/** The spec's form, for deciding whether a failed attempt was the registry's; a form the parser refuses has no host of its own. */
function parsedForRegistry(spec) {
	try {
		return parseInstallSpec(spec);
	} catch (error) {
		/* v8 ignore next -- parseInstallSpec throws nothing but its own refusal */
		if (!(error instanceof InvalidInstallSpecError)) throw error;
		return {
			kind: "registry",
			spec,
			name: spec
		};
	}
}
/** Manage profile files and apply their declared reload lifecycle. */
let PluginManager = (() => {
	let _classSuper = TypertRemoteService;
	let _instanceExtraInitializers = [];
	let _listVersionExemptions_decorators;
	let _setVersionExemption_decorators;
	let _listPlugins_decorators;
	let _listBundles_decorators;
	let _registries_decorators;
	let _inspect_decorators;
	let _setPluginEnabled_decorators;
	let _setBundleEnabled_decorators;
	let _installBundle_decorators;
	let _waitForInstall_decorators;
	let _cancelInstall_decorators;
	let _removeBundle_decorators;
	return class PluginManager extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_listVersionExemptions_decorators = [Remote];
			_setVersionExemption_decorators = [Remote];
			_listPlugins_decorators = [Remote];
			_listBundles_decorators = [Remote];
			_registries_decorators = [Remote];
			_inspect_decorators = [Remote];
			_setPluginEnabled_decorators = [Remote];
			_setBundleEnabled_decorators = [Remote];
			_installBundle_decorators = [Remote];
			_waitForInstall_decorators = [Remote];
			_cancelInstall_decorators = [Remote];
			_removeBundle_decorators = [Remote];
			__esDecorate(this, null, _listVersionExemptions_decorators, {
				kind: "method",
				name: "listVersionExemptions",
				static: false,
				private: false,
				access: {
					has: (obj) => "listVersionExemptions" in obj,
					get: (obj) => obj.listVersionExemptions
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _setVersionExemption_decorators, {
				kind: "method",
				name: "setVersionExemption",
				static: false,
				private: false,
				access: {
					has: (obj) => "setVersionExemption" in obj,
					get: (obj) => obj.setVersionExemption
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _listPlugins_decorators, {
				kind: "method",
				name: "listPlugins",
				static: false,
				private: false,
				access: {
					has: (obj) => "listPlugins" in obj,
					get: (obj) => obj.listPlugins
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _listBundles_decorators, {
				kind: "method",
				name: "listBundles",
				static: false,
				private: false,
				access: {
					has: (obj) => "listBundles" in obj,
					get: (obj) => obj.listBundles
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _registries_decorators, {
				kind: "method",
				name: "registries",
				static: false,
				private: false,
				access: {
					has: (obj) => "registries" in obj,
					get: (obj) => obj.registries
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _inspect_decorators, {
				kind: "method",
				name: "inspect",
				static: false,
				private: false,
				access: {
					has: (obj) => "inspect" in obj,
					get: (obj) => obj.inspect
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _setPluginEnabled_decorators, {
				kind: "method",
				name: "setPluginEnabled",
				static: false,
				private: false,
				access: {
					has: (obj) => "setPluginEnabled" in obj,
					get: (obj) => obj.setPluginEnabled
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _setBundleEnabled_decorators, {
				kind: "method",
				name: "setBundleEnabled",
				static: false,
				private: false,
				access: {
					has: (obj) => "setBundleEnabled" in obj,
					get: (obj) => obj.setBundleEnabled
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _installBundle_decorators, {
				kind: "method",
				name: "installBundle",
				static: false,
				private: false,
				access: {
					has: (obj) => "installBundle" in obj,
					get: (obj) => obj.installBundle
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _waitForInstall_decorators, {
				kind: "method",
				name: "waitForInstall",
				static: false,
				private: false,
				access: {
					has: (obj) => "waitForInstall" in obj,
					get: (obj) => obj.waitForInstall
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _cancelInstall_decorators, {
				kind: "method",
				name: "cancelInstall",
				static: false,
				private: false,
				access: {
					has: (obj) => "cancelInstall" in obj,
					get: (obj) => obj.cancelInstall
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _removeBundle_decorators, {
				kind: "method",
				name: "removeBundle",
				static: false,
				private: false,
				access: {
					has: (obj) => "removeBundle" in obj,
					get: (obj) => obj.removeBundle
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
		static inject = ["loader", "profileContext"];
		static Config = z.object({
			pnpmCommand: z.string().default("pnpm"),
			outputBytes: z.number().step(1).min(1).default(16384),
			lockWaitMs: z.number().step(1).min(0).default(12e4),
			inspectTimeoutMs: z.number().step(1).min(1e3).default(2e4),
			githubConnectionTimeoutMs: z.number().step(1).min(1e3).default(5e3),
			idleTimeoutMs: z.number().step(1).min(1e3).default(6e5),
			registry: z.string().pattern(REGISTRY_URL),
			fallbackRegistries: z.array(z.string().pattern(REGISTRY_URL)).default([NPMMIRROR_REGISTRY])
		});
		/** Management bundles remain protected if their files become unreadable. */
		managementBundles = (__runInitializers(this, _instanceExtraInitializers), /* @__PURE__ */ new Set());
		/**
		* The registry each package was last installed from by this manager in this process. pnpm verifies lockfile tarball
		* URLs against its default registry unless they belong to a named registry, so a later removal names it again.
		*/
		installedFrom = /* @__PURE__ */ new Map();
		ownerEntryId;
		packageOperations = /* @__PURE__ */ new Set();
		profile;
		outputBytes;
		lockWaitMs;
		inspectTimeoutMs;
		githubConnectionTimeoutMs;
		idleTimeoutMs;
		pnpmCommand;
		configuredRegistries;
		ownerContext;
		abort = new AbortController();
		/** Installations by request id, from their call until it settles. */
		installs = /* @__PURE__ */ new Map();
		constructor(ctx, config) {
			super(ctx, "pluginManager");
			this.ownerEntryId = ctx.fiber.entry?.id;
			this.ownerContext = ctx;
			this.profile = ctx.profileContext;
			for (const name of this.profile.startedBundles) this.protectsManager(name);
			this.outputBytes = config.outputBytes;
			this.lockWaitMs = config.lockWaitMs;
			this.inspectTimeoutMs = config.inspectTimeoutMs;
			this.githubConnectionTimeoutMs = config.githubConnectionTimeoutMs;
			this.idleTimeoutMs = config.idleTimeoutMs;
			this.pnpmCommand = config.pnpmCommand;
			this.configuredRegistries = {
				registry: config.registry === void 0 ? null : normalizeRegistry(config.registry),
				fallbackRegistries: config.fallbackRegistries.map(normalizeRegistry)
			};
			ctx.effect(() => async () => {
				this.abort.abort();
				await Promise.allSettled([...this.packageOperations]);
			}, "plugin-manager: package cancellation");
		}
		/** Read exact plugin-version exemptions saved in this profile.
		* @returns Accepted package-name@version keys with the runtime versions they may run on, and any
		* record or file problem the reader rejected, which the caller reports instead of failing.
		*/
		listVersionExemptions() {
			const { exemptions, warnings } = readProfileCompatibility(this.profile.dir);
			return {
				exemptions,
				warnings
			};
		}
		/** Grant or revoke one exact plugin/runtime exemption and reevaluate live plugins.
		* @param packageVersion Exact manifest package name followed by @ and its version; never an installation spec or alias.
		* @param runtimeVersion Exact current DSH version for grants; revocation may name a previous runtime.
		* @param enabled Whether to grant rather than revoke the exemption.
		* @param acceptRisk Required true for grants after the user accepts possible crashes and data loss.
		* @returns Saved and runtime outcomes. Startup-only profiles require restart.
		*/
		setVersionExemption(packageVersion, runtimeVersion, enabled, acceptRisk) {
			return this.change((result) => this.configure(async () => {
				await setProfileVersionExemption(this.profile.dir, packageVersion, runtimeVersion, enabled, acceptRisk === true);
				Object.assign(result, await this.reload());
			}), {
				stage: "enable",
				target: packageVersion,
				enabled
			}, "bundle");
		}
		/** Read current plugins, including why a row cannot be changed through the profile patch.
		* @returns Current runtime entries with persistent patch targets.
		*/
		async listPlugins() {
			const rows = flatten(composeEntries([readProfilePatches("dsh", this.profile)]));
			return (await readPluginInventory(this.ctx)).entries.map((entry) => {
				const actual = [...this.ctx.loader.entries()].find((row) => row.id === entry.entryId);
				const candidates = rows.filter((row) => row.id === actual?.options.id);
				const candidate = candidates[0];
				if (protectedModules.has(entry.moduleName) || entry.entryId === this.ownerEntryId) return {
					...entry,
					readOnlyReason: "management-required"
				};
				if (candidate === void 0 || candidates.length > 1 || candidate.name !== entry.moduleName || actual?.parent.tree.ctx.fiber.entry?.id !== "include") return {
					...entry,
					readOnlyReason: "unaddressable"
				};
				return {
					...entry,
					patchId: candidate.id
				};
			});
		}
		/** Read installed, installation-provided, and offline Official catalog bundles, plus selected non-bundle names.
		* A dependency without a bundle patch is listed, as a `not-bundle` problem, only while it is selected.
		* @returns Package versions, manifest descriptions, the installable spec of profile dependencies, rows, optional
		* display metadata, activation selections, whether the installation offers the bundle, and removal availability.
		*/
		listBundles() {
			const manifest = readProfileManifest("dsh", this.profile.dir);
			const exemptions = readProfileVersionExemptions(this.profile.dir);
			const selected = bundleSelection(manifest);
			const recorded = manifest.dependencies ?? {};
			const dependencies = Object.keys(recorded);
			const installation = JSON.parse(readFileSync(this.profile.installAnchor, "utf8"));
			const catalog = new Map(OFFICIAL_ON_DEMAND_CATALOG.map((entry) => [entry.packageName, entry]));
			const names = [...new Set([
				...selected,
				...dependencies,
				...Object.keys(installation.dependencies ?? {}),
				...catalog.keys()
			])];
			const bundles = [];
			const runtimeVersion = getDshRuntimeVersion();
			for (const name of names) {
				const installed = dependencies.includes(name);
				const optional = OPTIONAL_BUNDLES.includes(name);
				const enabled = selected.includes(name);
				const shipped = Object.hasOwn(installation.dependencies ?? {}, name);
				const offered = catalog.get(name);
				const official = optional || offered !== void 0;
				let target = {};
				let targetError;
				if (offered !== void 0) try {
					target = { installTarget: officialBundleInstallTarget(name, this.profile.installAnchor, runtimeVersion) };
				} catch (error) {
					targetError = managementError(error);
				}
				const catalogMeta = offered === void 0 ? {} : { meta: offered.meta };
				if (offered !== void 0 && !installed && !shipped) {
					bundles.push({
						name,
						official,
						availability: "missing",
						...catalogMeta,
						...target,
						enabled,
						installed,
						optional,
						removable: enabled,
						rows: [],
						overrides: [],
						...targetError !== void 0 ? { error: targetError } : enabled ? { error: { code: "not-bundle" } } : {}
					});
					continue;
				}
				const owned = installed && !shipped;
				const removable = owned || enabled && !installed && !shipped;
				const sourceOf = (packageName) => owned ? { source: dependencySpec(name, recorded[name], this.profile.dir, packageName) } : {};
				const readOnlyReason = this.protectsManager(name) ? "management-required" : void 0;
				let availability = "missing";
				let version;
				try {
					const info = bundleManifest(name, this.profile.dir, this.profile.installAnchor);
					availability = shipped ? "installation" : "profile";
					if (info === void 0) {
						if (enabled || offered !== void 0) bundles.push({
							name,
							official,
							availability,
							...catalogMeta,
							...target,
							...sourceOf(),
							enabled,
							installed,
							optional,
							removable: removable && readOnlyReason === void 0,
							...readOnlyReason === void 0 ? {} : { readOnlyReason },
							error: targetError ?? { code: "not-bundle" },
							rows: [],
							overrides: []
						});
						continue;
					}
					version = info.version;
					const compatibility = evaluatePluginCompatibility(info, exemptions);
					if (compatibility !== void 0 && !compatibility.exempted) throw new ManagementFailure("incompatible-version", [incompatiblePlugin(compatibility)]);
					const dir = resolveBundleDir("dsh", name, this.profile.installAnchor, this.profile.dir);
					const meta = offered?.meta ?? readPluginMeta(info.name ?? name, pathToFileURL(join(dir, "package.json")).href);
					bundles.push({
						name,
						official,
						availability,
						...target,
						...version === void 0 ? {} : { version },
						...info.description === void 0 || info.description === "" ? {} : { description: info.description },
						...meta === void 0 ? {} : { meta },
						...sourceOf(info.name),
						enabled,
						installed,
						optional,
						removable: removable && readOnlyReason === void 0,
						...readOnlyReason === void 0 ? {} : { readOnlyReason },
						...this.declaredRows(name, info),
						...targetError === void 0 ? {} : { error: targetError }
					});
				} catch (error) {
					if (enabled || installed || optional || offered !== void 0) bundles.push({
						name,
						official,
						availability,
						...catalogMeta,
						...target,
						...version === void 0 ? {} : { version },
						...sourceOf(),
						enabled,
						installed,
						optional,
						removable: removable && readOnlyReason === void 0,
						...readOnlyReason === void 0 ? {} : { readOnlyReason },
						error: targetError ?? managementError(error),
						rows: [],
						overrides: []
					});
				}
			}
			return Promise.resolve(bundles);
		}
		/** Read the registries this manager asks: the configured first one, its fallbacks in order, and what pnpm's own configuration names.
		* @returns The registries in pnpm's comparison form; null is the one pnpm's own configuration names, `resolved` as pnpm reads it now.
		*/
		async registries() {
			return {
				...this.configuredRegistries,
				fallbackRegistries: [...this.configuredRegistries.fallbackRegistries],
				resolved: await readProfileRegistry(this.profile.dir, {
					...this.profile.packageManager ?? { command: this.pnpmCommand },
					timeoutMs: this.inspectTimeoutMs
				})
			};
		}
		/** Read what a spec names before installing it.
		* @param spec One package spec: a registry name, an absolute path, a git address, or a tarball.
		* @param options The registry asked first.
		* @param signal Ends a registry lookup early.
		* @returns The package the spec names, or why it is refused.
		*/
		async inspect(spec, options, signal) {
			let parsed;
			try {
				parsed = parseInstallSpec(spec);
			} catch (error) {
				/* v8 ignore next 2 -- parseInstallSpec throws nothing but its own refusal */
				if (!(error instanceof InvalidInstallSpecError)) throw error;
				return refused("invalid-spec", error.reason);
			}
			const manifest = readProfileManifest("dsh", this.profile.dir);
			const installation = JSON.parse(readFileSync(this.profile.installAnchor, "utf8"));
			const known = new Set([
				...bundleSelection(manifest),
				...Object.keys(manifest.dependencies ?? {}),
				...Object.keys(installation.dependencies ?? {})
			]);
			const plan = registryPlan(options?.registry, await this.registries());
			const registry = plan[0];
			switch (parsed.kind) {
				case "git": return {
					status: "accepted",
					kind: "git",
					bundle: null,
					registry,
					host: parsed.host
				};
				case "tarball":
					if (parsed.path !== void 0 && !existsSync(parsed.path)) return refused("not-a-package", "the tarball does not exist");
					return {
						status: "accepted",
						kind: "tarball",
						bundle: null,
						registry,
						...parsed.host === void 0 ? {} : { host: parsed.host }
					};
				case "path": {
					if (!existsSync(parsed.path)) return refused("not-a-package", "the path does not exist");
					let read;
					try {
						read = JSON.parse(await readFile(join(parsed.path, "package.json"), "utf8"));
					} catch (error) {
						return refused("not-a-package", `no readable package.json at the path: ${messageOf(error)}`);
					}
					const inspection = inspectionOf("path", read, registry);
					if (inspection.name === void 0) return refused("not-a-package", "the package.json names no package");
					if (known.has(inspection.name)) return refused("already-installed", `${inspection.name} is already installed`);
					if (!inspection.bundle) return refused("not-a-bundle", `${inspection.name} declares no dsh.bundle`);
					return inspection;
				}
				case "registry": {
					if (known.has(parsed.name)) return refused("already-installed", `${parsed.name} is already installed`);
					const registries = [];
					const refusedBy = (problem, reason) => ({
						status: "refused",
						problem,
						reason,
						registries
					});
					for (const current of plan) {
						registries.push(current);
						const view = await viewProfilePackage(this.profile.dir, spec.trim(), {
							...this.profile.packageManager ?? { command: this.pnpmCommand },
							timeoutMs: this.inspectTimeoutMs,
							...signal === void 0 ? {} : { signal },
							registry: current
						});
						const printed = view.stdout.replace(ANSI_SEQUENCE, "").trim();
						if (view.exitCode !== 0 || view.cause !== void 0 || view.timedOut) {
							const log = [
								view.stderr.trim(),
								printedError(printed),
								view.cause === void 0 ? "" : messageOf(view.cause)
							].filter(Boolean).join("\n");
							const kind = classifyInstallFailure({
								log,
								timedOut: view.timedOut,
								...view.cause === void 0 ? {} : { cause: view.cause }
							});
							if (registries.length < plan.length && signal?.aborted !== true && attributeFailure(kind, log, parsed) === "registry") continue;
							const reason = view.timedOut ? `pnpm view timed out after ${String(this.inspectTimeoutMs)}ms` : log || printed || `pnpm view exited with ${String(view.exitCode)}`;
							if (kind === "not-found" || kind === "no-matching-version") return refusedBy("not-found", reason);
							if (kind === "network" || kind === "timeout") return refusedBy("network", reason);
							return refusedBy("unknown", reason);
						}
						let answer;
						try {
							answer = JSON.parse(printed || "null");
						} catch (error) {
							return refusedBy("unknown", `unreadable pnpm view output: ${messageOf(error)}`);
						}
						const latest = Array.isArray(answer) ? answer.at(-1) : answer;
						if (typeof latest !== "object" || latest === null) return refusedBy("unknown", "pnpm view answered no package");
						const inspection = inspectionOf("registry", latest, current);
						const named = inspection.name === void 0 ? {
							...inspection,
							name: parsed.name
						} : inspection;
						if (!named.bundle) return refusedBy("not-a-bundle", `${named.name} declares no dsh.bundle`);
						return named;
					}
					/* v8 ignore next -- the plan is never empty: every attempt returns or continues to the next */
					throw new Error("no registry was asked");
				}
			}
		}
		/** Persist a plugin entry's desired enablement and apply it on live profiles.
		* @param id Loader entry identity returned by listPlugins.
		* @param enabled Whether the plugin should run.
		* @returns Saved and runtime outcomes, including higher-priority overrides.
		*/
		setPluginEnabled(id, enabled) {
			return this.change((result) => this.configure(async () => {
				const row = (await this.listPlugins()).find((item) => item.entryId === id);
				if (row === void 0) throw new ManagementFailure("unknown-plugin");
				if (row.readOnlyReason !== void 0) throw new ManagementFailure(row.readOnlyReason);
				await writePluginEnabled(this.profile, row.patchId, row.moduleName, enabled);
				Object.assign(result, await this.reload(enabled ? [row.patchId] : []));
				return (await this.listPlugins()).find((item) => item.entryId === id)?.enabled !== enabled && this.ownerContext.get("hmr") !== void 0 ? "overridden" : void 0;
			}), {
				stage: "enable",
				target: id,
				enabled
			}, "plugin");
		}
		/** Select or remove a bundle layer while retaining installed dependencies.
		* @param name Bundle package name.
		* @param enabled Whether the bundle contributes its patch layer.
		* @returns Persisted and runtime outcomes.
		*/
		setBundleEnabled(name, enabled) {
			return this.change((result) => this.configure(async () => {
				await this.selectBundle(name, enabled);
				Object.assign(result, enabled ? await this.publishAndReload(this.bundleRows(name).map((row) => row.id)) : await this.reload());
			}), {
				stage: "enable",
				target: name,
				enabled
			}, "bundle");
		}
		/**
		* Install a package using the same pnpm implementation as dsh plugin. GitHub
		* repositories get a connection check bounded by githubConnectionTimeoutMs before pnpm starts;
		* only network failures or timeouts stop installation, while pnpm owns authentication and transport fallback. A run
		* that fails, is cancelled, or adds a package without a bundle patch restores
		* `package.json` and `pnpm-lock.yaml` as they were; downloaded files can stay.
		* @param spec One package spec, including local paths relative to the invocation directory.
		* @param options Whether to activate the installed bundle (defaults to true), the request id a cancellation names,
		* the pending build scripts to allow, whether to save an exact dependency, and the registry asked first.
		* @returns Package-manager diagnostics, the registries asked, and the observed activation outcome.
		*/
		installBundle(spec, options) {
			const requestId = options?.requestId;
			const control = {
				abort: new AbortController(),
				phase: "installing",
				result: Promise.resolve(null)
			};
			const stopped = () => control.abort.signal.aborted || this.abort.signal.aborted;
			if (requestId !== void 0) this.installs.set(requestId, control);
			const announce = (phase, attempt) => {
				if (requestId !== void 0) this.ownerContext.emit("plugin-manager/install-state", {
					requestId,
					phase,
					...attempt === void 0 ? {} : { attempt }
				});
			};
			const result = this.change(async (result) => {
				if (spec.trim() === "" || spec.startsWith("-")) throw new ManagementFailure("invalid-spec");
				if (stopped()) throw new InstallCancelledError();
				const before = readProfileManifest("dsh", this.profile.dir).dependencies ?? {};
				const known = specPackageName(spec, before, this.profile.dir);
				if (this.ownerContext.get("hmr") !== void 0 && known !== void 0 && Object.hasOwn(before, known)) throw new ManagementFailure("already-installed");
				if (options?.approvedBuilds !== void 0) {
					await approveBuilds(this.profile.dir, options.approvedBuilds);
					result.approvedBuilds = options.approvedBuilds;
				}
				const files = await this.readRestoredFiles();
				let name;
				let version;
				try {
					result.registries = [];
					const connection = checkGithubConnection(parsedForRegistry(spec), this.profile.dir, {
						timeoutMs: this.githubConnectionTimeoutMs,
						outputBytes: this.outputBytes,
						signal: AbortSignal.any([this.abort.signal, control.abort.signal]),
						...this.profile.packageManager?.env === void 0 ? {} : { env: this.profile.packageManager.env }
					});
					this.packageOperations.add(connection);
					let connectionFailure;
					try {
						connectionFailure = await connection;
					} finally {
						this.packageOperations.delete(connection);
					}
					if (stopped()) throw new InstallCancelledError();
					if (connectionFailure?.kind === "network" || connectionFailure?.kind === "timeout") {
						result.packageResult = connectionFailure;
						result.failedAt = "spec-host";
						throw new Error(connectionFailure.output);
					}
					const plan = registryPlan(options?.registry, await this.registries());
					let run;
					let used = null;
					for (const [index, registry] of plan.entries()) {
						if (index > 0) await this.restoreFiles(files);
						if (stopped()) throw new InstallCancelledError();
						result.registries.push(registry);
						used = registry;
						announce("installing", {
							registry,
							index: index + 1,
							total: plan.length
						});
						run = await this.runPnpm([
							"add",
							spec,
							...options?.saveExact === true ? ["--save-exact"] : [],
							...registryArguments(registry)
						], control.abort.signal, requestId);
						result.packageResult = run;
						if (stopped()) throw new InstallCancelledError();
						if (run.incompatible !== void 0) throw new ManagementFailure("incompatible-version", run.incompatible);
						if (run.exitCode === 0 && run.timedOut !== true) break;
						/* v8 ignore next 2 -- runPnpm classifies every run it does not report as succeeded */
						if (run.kind === void 0) break;
						delete result.failedAt;
						if (run.timedOut === true) break;
						const failedAt = attributeFailure(run.kind, run.output, parsedForRegistry(spec));
						if (failedAt !== "other") result.failedAt = failedAt;
						if (failedAt !== "registry" || index === plan.length - 1) break;
					}
					/* v8 ignore next -- the plan is never empty, so a run always settled */
					if (run === void 0) throw new Error("no registry was asked");
					const succeeded = run.exitCode === 0 && run.timedOut !== true;
					if (succeeded) delete result.failedAt;
					if (!succeeded) {
						try {
							result.pendingBuilds = await recordPendingBuilds(this.profile.dir, run.output);
						} catch (error) {
							this.ownerContext.logger.warn("Could not read pending build approvals after pnpm failed", error);
						}
						throw new Error(run.output);
					}
					const after = readProfileManifest("dsh", this.profile.dir).dependencies ?? {};
					const installed = Object.keys(after).filter((name) => before[name] !== after[name]);
					if (installed.length === 0) {
						const local = specPackageName(spec, after, this.profile.dir);
						if (local !== void 0 && Object.hasOwn(after, local)) installed.push(local);
					}
					const target = installed[0];
					if (installed.length !== 1 || target === void 0) throw new ManagementFailure("ambiguous-install");
					name = target;
					const dir = resolveBundleDir("dsh", name, this.profile.installAnchor, this.profile.dir);
					const manifest = bundleManifest(name, this.profile.dir, this.profile.installAnchor);
					if (manifest?.dsh?.bundle === void 0) throw new ManagementFailure("not-bundle");
					const compatibility = evaluatePluginCompatibility(manifest, readProfileVersionExemptions(this.profile.dir));
					if (compatibility !== void 0 && !compatibility.exempted) throw new ManagementFailure("incompatible-version", [incompatiblePlugin(compatibility)]);
					for (const file of bundlePatchPaths(dir, manifest.dsh.bundle)) loadOverlayPatches("dsh", file);
					version = manifest.version;
					this.installedFrom.set(name, used);
				} catch (error) {
					await this.restoreFiles(files);
					throw error;
				}
				control.phase = "applying";
				announce("applying");
				result.bundle = name;
				if (version !== void 0) result.version = version;
				result.target = name;
				result.stage = "enable";
				return this.configure(async () => {
					if (options?.enabled !== false) await this.selectBundle(name, true);
					if (Object.hasOwn(before, name) && this.ownerContext.get("hmr") === void 0) return;
					const selected = bundleSelection(readProfileManifest("dsh", this.profile.dir)).includes(name);
					Object.assign(result, await this.publishAndReload(selected ? this.bundleRows(name).map((row) => row.id) : []));
				});
			}, {
				stage: "install",
				target: spec,
				enabled: options?.enabled !== false
			}, "install");
			control.result = result;
			return result.finally(() => {
				if (requestId !== void 0) this.installs.delete(requestId);
			});
		}
		/** Recover the result of an active installation without cancelling it.
		* @param requestId The id supplied when installation started.
		* @returns The installation's outcome after it settles, or null if no active request has that id.
		* Completed results are not retained; null establishes neither success nor cancellation.
		*/
		async waitForInstall(requestId) {
			return this.installs.get(requestId)?.result ?? null;
		}
		/** Stop an installation this manager owns and wait until its files are back.
		* @param requestId The id the installation was started with.
		* @returns `cancelled` once the Git check or pnpm exited and the files are restored, `too-late` once the bundle is being
		* applied, `not-running` for any other id.
		*/
		async cancelInstall(requestId) {
			const control = this.installs.get(requestId);
			if (control === void 0) return { status: "not-running" };
			if (control.phase === "applying") return { status: "too-late" };
			this.ownerContext.emit("plugin-manager/install-state", {
				requestId,
				phase: "cancelling"
			});
			control.abort.abort();
			/* v8 ignore next -- change() folds every failure into its result; only a lock or disposal error rejects */
			await control.result.then(() => void 0, () => void 0);
			return { status: "cancelled" };
		}
		/** Unload and remove a profile-owned bundle dependency through dsh plugin's pnpm path; a selected name no
		* dependency holds is only deselected.
		* @param name Installed dependency or selected bundle name.
		* @returns Removal diagnostics and the remaining profile state.
		*/
		removeBundle(name) {
			return this.change(async (result) => {
				if (!await this.configure(async () => {
					const bundle = (await this.listBundles()).find((item) => item.name === name);
					if (bundle === void 0 || !bundle.removable) throw new ManagementFailure("not-removable");
					if (this.ownerContext.get("hmr") === void 0 && (this.profile.startedBundles.includes(name) || bundle.error === void 0 && this.bundleRows(name).some((row) => [...this.ctx.loader.entries()].some((entry) => entry.options.id === row.id && entry.fiber !== void 0)))) throw new ManagementFailure("stop-profile");
					const contributions = bundle.error === void 0 ? this.bundleRows(name) : [];
					if (bundle.enabled) {
						await this.selectBundle(name, false);
						Object.assign(result, await this.reload());
					}
					if ([...this.ctx.loader.entries()].some((entry) => entry.fiber?.uid != null && contributions.some((row) => row.id === entry.options.id && row.name === entry.options.name))) throw new ManagementFailure("bundle-in-use");
					return bundle.installed;
				})) return;
				const registry = this.installedFrom.has(name) ? this.installedFrom.get(name) : this.configuredRegistries.registry;
				result.packageResult = await this.runPnpm([
					"remove",
					name,
					...typeof registry === "string" ? [`--config.registry=${registry}`] : []
				]);
				if (result.packageResult.exitCode !== 0 || result.packageResult.timedOut === true) throw new Error(result.packageResult.output);
				this.installedFrom.delete(name);
				Object.assign(result, await this.configure(() => this.publishAndReload()));
			}, {
				stage: "remove",
				target: name
			}, "remove");
		}
		/** The rows a bundle's patch inserts and the existing rows it changes; an unreadable patch throws. */
		declaredRows(name, info) {
			const bundle = info.dsh?.bundle;
			/* v8 ignore next -- bundleManifest answers only manifests that declare a patch */
			if (bundle === void 0) return {
				rows: [],
				overrides: []
			};
			const dir = resolveBundleDir("dsh", name, this.profile.installAnchor, this.profile.dir);
			const patches = bundlePatchPaths(dir, bundle).flatMap((file) => loadOverlayPatches("dsh", file));
			const live = /* @__PURE__ */ new Map();
			for (const entry of this.ctx.loader.entries())
 /* v8 ignore next -- the Loader gives every entry an id before it is listed */
			if (typeof entry.options.id === "string") live.set(entry.options.id, {
				entryId: pluginEntryId(entry.id),
				baseUrl: entry.parent.tree.ctx.baseUrl
			});
			const rows = [];
			const packages = this.ctx.get("pluginPackages");
			for (const row of flatten(composeEntries([patches.filter((item) => item.insert !== void 0)]))) {
				if (typeof row.id !== "string" || typeof row.name !== "string" || row.group === true) continue;
				const active = live.get(row.id);
				const entryId = active?.entryId;
				const base = active?.baseUrl ?? pathToFileURL(join(dir, "package.json")).href;
				const meta = packages?.metaOf(row.name, base);
				rows.push({
					rowId: row.id,
					moduleName: row.name,
					...entryId === void 0 ? {} : { entryId },
					...meta === void 0 ? {} : { meta }
				});
			}
			const declared = new Set(rows.map((row) => row.rowId));
			return {
				rows,
				overrides: [...new Set(patches.flatMap((item) => item.insert === void 0 && typeof item.id === "string" && !declared.has(item.id) ? [item.id] : []))]
			};
		}
		/** Run one pnpm command in the profile, streaming its output as install-log chunks. */
		async runPnpm(args, signal, requestId) {
			const jobId = randomUUID();
			const argv = ["pnpm", ...args];
			const cwd = this.profile.dir;
			const identity = requestId === void 0 ? {} : { requestId };
			const task = runProfilePnpm({
				...this.profile,
				profile: this.profile.name
			}, args, {
				execution: "service",
				...this.profile.packageManager ?? { command: this.pnpmCommand },
				signal: signal === void 0 ? this.abort.signal : AbortSignal.any([this.abort.signal, signal]),
				outputBytes: this.outputBytes,
				activateNewBundles: false,
				idleTimeoutMs: this.idleTimeoutMs,
				lookupTimeoutMs: this.inspectTimeoutMs,
				onOutput: (text, stream) => {
					this.ownerContext.emit("plugin-manager/install-log", {
						...identity,
						jobId,
						argv,
						cwd,
						stream,
						text
					});
				}
			});
			this.packageOperations.add(task);
			try {
				const result = await task;
				this.ownerContext.emit("plugin-manager/install-log", {
					...identity,
					jobId,
					argv,
					cwd,
					stream: "stdout",
					text: "",
					exitCode: signal?.aborted === true ? null : result.exitCode
				});
				if (result.exitCode === 0 && result.timedOut !== true) return result;
				return {
					...result,
					kind: classifyInstallFailure({
						log: result.output,
						...result.timedOut === true ? { timedOut: true } : {}
					})
				};
			} catch (error) {
				this.ownerContext.emit("plugin-manager/install-log", {
					...identity,
					jobId,
					argv,
					cwd,
					stream: "stderr",
					text: messageOf(error),
					exitCode: null
				});
				throw error;
			} finally {
				this.packageOperations.delete(task);
			}
		}
		/** The profile files an installation may rewrite, as they are now; absent files read as undefined. */
		async readRestoredFiles() {
			const files = /* @__PURE__ */ new Map();
			for (const name of RESTORED_FILES) {
				const path = join(this.profile.dir, name);
				files.set(path, existsSync(path) ? await readFile(path, "utf8") : void 0);
			}
			return files;
		}
		/** Put the profile files back; pnpm has exited by the time this runs. */
		async restoreFiles(files) {
			for (const [path, content] of files) if (content === void 0) await rm(path, { force: true });
			else await writeFileAtomic(path, content, { mode: 384 });
		}
		async selectBundle(name, enabled) {
			const manifest = readProfileManifest("dsh", this.profile.dir);
			const previous = bundleSelection(manifest);
			if (enabled || !previous.includes(name)) {
				const metadata = bundleManifest(name, this.profile.dir, this.profile.installAnchor);
				if (metadata === void 0) throw new ManagementFailure("not-bundle");
				if (enabled) {
					const compatibility = evaluatePluginCompatibility(metadata, readProfileVersionExemptions(this.profile.dir));
					if (compatibility !== void 0 && !compatibility.exempted) throw new ManagementFailure("incompatible-version", [incompatiblePlugin(compatibility)]);
					this.bundleRows(name);
				}
			}
			if (!enabled && previous.includes(name)) {
				if (this.protectsManager(name)) throw new ManagementFailure("management-required");
			}
			const bundles = enabled ? [...previous, ...previous.includes(name) ? [] : [name]] : previous.filter((item) => item !== name);
			if (JSON.stringify(previous) === JSON.stringify(bundles)) return;
			manifest.dsh = {
				...manifest.dsh,
				profile: {
					...manifest.dsh?.profile,
					bundles
				}
			};
			await saveManifest(this.profile.dir, manifest);
			if (enabled) this.protectsManager(name);
		}
		bundleRows(name) {
			const info = bundleManifest(name, this.profile.dir, this.profile.installAnchor);
			if (info?.dsh?.bundle === void 0) return [];
			return flatten(composeEntries([bundlePatchPaths(resolveBundleDir("dsh", name, this.profile.installAnchor, this.profile.dir), info.dsh.bundle).flatMap((file) => loadOverlayPatches("dsh", file))]));
		}
		protectsManager(name) {
			if (this.managementBundles.has(name)) return true;
			let rows;
			try {
				rows = this.bundleRows(name);
			} catch (_error) {
				return false;
			}
			const protectedBundle = rows.some((row) => protectedModules.has(row.name) || `include:${row.id}` === this.ownerEntryId);
			if (protectedBundle) this.managementBundles.add(name);
			return protectedBundle;
		}
		configure(operation) {
			const hmr = this.ownerContext.get("hmr");
			const apply = () => {
				this.abort.signal.throwIfAborted();
				return operation();
			};
			return hmr === void 0 ? apply() : hmr.runExclusive(apply);
		}
		/**
		* Publish the profile's runtime resolution without HMR, unless a deselected startup bundle still runs and needs the
		* current table. A publication that needs a restart waits for the restart the result already reports.
		*/
		async refreshPackages() {
			const selected = bundleSelection(readProfileManifest("dsh", this.profile.dir));
			if (this.profile.startedBundles.some((name) => !selected.includes(name))) return;
			try {
				const packages = this.ownerContext.get("pluginPackages");
				if (packages?.resolution !== void 0) await packages.refresh();
			} catch (error) {
				if (!(error instanceof ResolutionRestartRequired)) throw error;
			}
		}
		/**
		* Apply a package change: without HMR, publish the runtime resolution when that is safe, then {@link reload}.
		* @param requiredIds Entry ids that must start.
		* @returns The reload's outcome.
		*/
		async publishAndReload(requiredIds = []) {
			if (this.ownerContext.get("hmr") === void 0) await this.refreshPackages();
			return this.reload(requiredIds);
		}
		/**
		* Apply the saved profile; with HMR it recomposes live, including the runtime resolution.
		* @param requiredIds Entry ids that must start.
		* @returns Warnings about entries that were already inactive, and why the change waits for a restart, if it does.
		*/
		async reload(requiredIds = []) {
			const hmr = this.ownerContext.get("hmr");
			if (hmr === void 0) {
				composeEntries([readProfilePatches("dsh", this.profile)]);
				return { warnings: [] };
			}
			const { warnings, pending, restartReason } = await hmr.reconcileProfile(requiredIds);
			const restart = restartReason ?? pending[0]?.reason;
			return restart === void 0 ? { warnings } : {
				warnings,
				restartReason: restart
			};
		}
		async change(operation, request, reason) {
			return withFileLock(join(this.profile.dir, "package.json"), async () => {
				this.abort.signal.throwIfAborted();
				const before = this.diskState();
				const result = {
					...request,
					changed: false,
					...this.ownerContext.get("hmr") !== void 0 ? { application: "applied" } : {
						application: "restart-required",
						restartReason: "no-hmr"
					}
				};
				try {
					const outcome = await operation(result);
					if (outcome !== void 0) result.application = outcome;
					else if (result.application === "applied" && result.restartReason !== void 0) result.application = "restart-required";
				} catch (error) {
					if (error instanceof InstallCancelledError) result.application = "cancelled";
					else {
						result.application = "failed";
						result.error = managementError(error);
					}
				}
				if (result.application !== "restart-required") delete result.restartReason;
				result.changed = before !== this.diskState();
				this.ownerContext.emit("plugin-manager/changed", { reason });
				return result;
			}, { waitMs: this.lockWaitMs });
		}
		diskState() {
			return [
				"package.json",
				"cordis.patch.yml",
				"pnpm-workspace.yaml",
				PROFILE_COMPATIBILITY_FILENAME
			].map((file) => {
				try {
					return readFileSync(join(this.profile.dir, file), "utf8");
				} catch (error) {
					if (error.code === "ENOENT") return "";
					throw error;
				}
			}).join("\0");
		}
	};
})();
//#endregion
export { InvalidInstallSpecError, PluginManager, PluginManager as default, classifyInstallFailure, parseInstallSpec };
