import z from "@deepseek-ai/schemastery";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { cpus, platform, release, totalmem } from "node:os";
import { join } from "node:path";
import { z as z$1 } from "zod";
import { execFile } from "node:child_process";
//#region lib/types/environment-query.js
/** Bounded, cancellable queries of fixed operating-system metadata commands. */
/**
* Execute fixed argv without a shell; failures omit only dependent metadata.
* @param command - operating-system executable, never event-supplied text.
* @param args - fixed metadata query arguments.
* @param options - output/time limits and owner lifetime.
* @returns stdout or a fixed failure reason, after the child closes.
*/
async function queryEnvironment(command, args, options) {
	const result = Promise.withResolvers();
	let child;
	try {
		child = execFile(command, [...args], {
			encoding: "utf8",
			windowsHide: true,
			signal: options.signal,
			killSignal: "SIGKILL",
			timeout: options.timeoutMillis,
			maxBuffer: options.maxOutputBytes
		}, (error, stdout) => {
			if (error === null) {
				result.resolve({
					kind: "value",
					stdout
				});
				return;
			}
			const reason = error.code === "ERR_CHILD_PROCESS_STDIO_MAXBUFFER" ? "output-limit" : error.killed && !options.signal.aborted ? "timeout" : "query-failed";
			result.resolve({
				kind: "missing",
				reason
			});
		});
	} catch (_error) {
		return {
			kind: "missing",
			reason: "query-failed"
		};
	}
	const closed = new Promise((resolve) => {
		child.once("close", () => {
			resolve();
		});
	});
	const [output] = await Promise.all([result.promise, closed]);
	return output;
}
//#endregion
//#region lib/types/environment.js
/** Static Desktop environment fields, independent of account and credential availability. */
const windowsVersion = z$1.object({
	major: z$1.number().int().nonnegative().nullable(),
	minor: z$1.number().int().nonnegative().nullable(),
	build: z$1.string().regex(/^\d+$/).nullable(),
	revision: z$1.number().int().nonnegative().nullable()
});
const windowsCpu = z$1.array(z$1.object({
	cores: z$1.number().int().positive().nullable(),
	architecture: z$1.number().int().nullable()
})).min(1);
const VERSION_QUERY = `
$ErrorActionPreference = 'Stop'
$r = Get-Item -LiteralPath 'HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion'
@{ major = $r.GetValue('CurrentMajorVersionNumber'); minor = $r.GetValue('CurrentMinorVersionNumber'); build = $r.GetValue('CurrentBuildNumber'); revision = $r.GetValue('UBR') } | ConvertTo-Json -Compress
`;
const CPU_QUERY = `
$ErrorActionPreference = 'Stop'
ConvertTo-Json -Compress -InputObject @(Get-CimInstance -ClassName Win32_Processor -Property NumberOfCores,Architecture | ForEach-Object { @{ cores = $_.NumberOfCores; architecture = $_.Architecture } })
`;
/**
* Collect only approved metadata; a failed source leaves its dependent fields missing.
* @param options - per-command bounds and analytics disposal signal.
* @returns a snapshot for reuse throughout this analytics instance, including failed fields.
*/
async function collectEnvironment(options) {
	const hostPlatform = platform();
	const fields = {
		os_name: hostPlatform === "darwin" ? "macos" : hostPlatform === "win32" ? "windows" : hostPlatform,
		app_arch: process.arch,
		missing_fields: {}
	};
	const missing = (keys, reason) => {
		for (const key of keys) fields.missing_fields[key] = reason;
	};
	const read = (key, source) => {
		let value;
		try {
			value = source();
		} catch (_error) {
			missing([key], "unavailable");
			return;
		}
		if (value === void 0 || value === "" || typeof value === "number" && (!Number.isSafeInteger(value) || value <= 0)) {
			missing([key], "unavailable");
			return;
		}
		Object.assign(fields, { [key]: value });
	};
	read("os_version", () => `${hostPlatform} ${release()}`);
	read("memory_total_bytes", totalmem);
	let processors = [];
	try {
		processors = cpus();
	} catch (_error) {}
	read("cpu_model", () => processors[0]?.model.trim());
	read("cpu_logical_count", () => processors.length);
	if (hostPlatform === "win32") {
		const root = process.env.SystemRoot;
		if (root === void 0 || root === "") {
			missing([
				"os_version_full",
				"os_build",
				"os_arch",
				"cpu_physical_core_count"
			], "unavailable");
			return fields;
		}
		const command = join(root, "System32", "WindowsPowerShell", "v1.0", "powershell.exe");
		const query = (script) => queryEnvironment(command, [
			"-NoProfile",
			"-NonInteractive",
			"-EncodedCommand",
			Buffer.from(script, "utf16le").toString("base64")
		], options);
		const [version, cpu] = await Promise.all([query(VERSION_QUERY), query(CPU_QUERY)]);
		if (version.kind === "missing") missing(["os_version_full", "os_build"], version.reason);
		else {
			const parsed = decode(version.stdout, windowsVersion);
			if (parsed === void 0) missing(["os_version_full", "os_build"], "invalid-value");
			else {
				if (parsed.build === null) missing(["os_build"], "unavailable");
				else fields.os_build = parsed.build;
				if (parsed.major === null || parsed.minor === null || parsed.build === null || parsed.revision === null) missing(["os_version_full"], "unavailable");
				else fields.os_version_full = `${parsed.major}.${parsed.minor}.${parsed.build}.${parsed.revision}`;
			}
		}
		if (cpu.kind === "missing") missing(["os_arch", "cpu_physical_core_count"], cpu.reason);
		else {
			const parsed = decode(cpu.stdout, windowsCpu);
			if (parsed === void 0) missing(["os_arch", "cpu_physical_core_count"], "invalid-value");
			else {
				const counts = parsed.map((value) => value.cores);
				if (counts.every((count) => count !== null)) read("cpu_physical_core_count", () => counts.reduce((sum, count) => sum + count, 0));
				else missing(["cpu_physical_core_count"], "unavailable");
				const architectures = {
					0: "ia32",
					5: "arm",
					9: "x64",
					12: "arm64"
				};
				const arch = parsed[0]?.architecture;
				if (arch == null || !parsed.every((value) => value.architecture === arch) || architectures[arch] === void 0) missing(["os_arch"], "unavailable");
				else fields.os_arch = architectures[arch];
			}
		}
	} else if (hostPlatform === "darwin") {
		const [version, cpu] = await Promise.all([queryEnvironment("/usr/bin/sw_vers", [], options), queryEnvironment("/usr/sbin/sysctl", [
			"-i",
			"hw.physicalcpu",
			"hw.optional.arm64"
		], options)]);
		if (version.kind === "missing") missing(["os_version_full", "os_build"], version.reason);
		else {
			const values = lines(version.stdout);
			const product = values.get("ProductVersion");
			const extra = values.get("ProductVersionExtra") || void 0;
			const match = product?.match(/^(\d+(?:\.\d+){1,2})(?: (\([a-z]\)))?$/);
			if (product !== void 0 && match !== void 0 && match !== null && (extra === void 0 || /^\([a-z]\)$/.test(extra)) && (match[2] === void 0 || extra === void 0 || match[2] === extra)) {
				const suffix = match[2] ?? extra;
				fields.os_version_full = suffix === void 0 ? product : `${match[1]} ${suffix}`;
			} else missing(["os_version_full"], "invalid-value");
			const build = values.get("BuildVersion");
			if (build !== void 0 && /^\d+[A-Za-z]\d+[a-z]?$/.test(build)) fields.os_build = build;
			else missing(["os_build"], "invalid-value");
		}
		if (cpu.kind === "missing") missing(["os_arch", "cpu_physical_core_count"], cpu.reason);
		else {
			const values = lines(cpu.stdout);
			const cores = values.get("hw.physicalcpu");
			if (cores !== void 0 && /^\d+$/.test(cores) && Number.isSafeInteger(Number(cores)) && Number(cores) > 0) fields.cpu_physical_core_count = Number(cores);
			else missing(["cpu_physical_core_count"], "invalid-value");
			const arm = values.get("hw.optional.arm64");
			if (arm === "1") fields.os_arch = "arm64";
			else if (arm === void 0 || arm === "0") fields.os_arch = "x64";
			else missing(["os_arch"], "invalid-value");
		}
	} else missing([
		"os_version_full",
		"os_build",
		"os_arch",
		"cpu_physical_core_count"
	], "unsupported");
	return fields;
}
function lines(stdout) {
	return new Map(stdout.trim().split(/\r?\n/).map((line) => {
		const colon = line.indexOf(":");
		return [line.slice(0, colon).trim(), line.slice(colon + 1).trim()];
	}));
}
function decode(stdout, schema) {
	let value;
	try {
		value = JSON.parse(stdout);
	} catch (_error) {
		return;
	}
	const result = schema.safeParse(value);
	return result.success ? result.data : void 0;
}
//#endregion
//#region lib/types/index.js
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
let ProductAnalytics = (() => {
	let _classSuper = TypertRemoteService;
	let _instanceExtraInitializers = [];
	let _enabled_decorators;
	let _watchPolicy_decorators;
	let _report_decorators;
	return class ProductAnalytics extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_enabled_decorators = [Remote];
			_watchPolicy_decorators = [Remote({ mode: "stream" })];
			_report_decorators = [Remote];
			__esDecorate(this, null, _enabled_decorators, {
				kind: "method",
				name: "enabled",
				static: false,
				private: false,
				access: {
					has: (obj) => "enabled" in obj,
					get: (obj) => obj.enabled
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _watchPolicy_decorators, {
				kind: "method",
				name: "watchPolicy",
				static: false,
				private: false,
				access: {
					has: (obj) => "watchPolicy" in obj,
					get: (obj) => obj.watchPolicy
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _report_decorators, {
				kind: "method",
				name: "report",
				static: false,
				private: false,
				access: {
					has: (obj) => "report" in obj,
					get: (obj) => obj.report
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
		static inject = ["deepseekAccount", "productTelemetry"];
		static Config = z.object({
			enabled: z.boolean().default(true).volatile(),
			appVersion: z.string(),
			environmentQueryTimeoutMillis: z.number().step(1).min(1).max(2147483647).default(5e3),
			environmentQueryMaxOutputBytes: z.number().step(1).min(1).max(2147483647).default(16384)
		});
		active = true;
		environmentLifetime = new AbortController();
		environment;
		listeners = /* @__PURE__ */ new Set();
		constructor(ctx, config) {
			super(ctx, "productAnalytics");
			this.config = config;
			ctx.effect(() => async () => {
				this.active = false;
				for (const listener of this.listeners) listener();
				this.environmentLifetime.abort();
				await this.environment;
			});
			ctx.on("loader/volatile-update", () => {
				for (const listener of this.listeners) listener();
			});
			ctx.inject(["settings"], (child) => {
				child.effect(() => child.settings.configure({ auto: false }, ctx.fiber));
			});
			ctx.on("session/event", (session, event) => {
				if (event.type !== "compaction/start") return;
				this.report({
					eventName: "context_compression",
					timestamp: Date.now(),
					attributes: {
						session_id: session.id,
						trigger_type: event.data.turn === null ? "manual" : "auto"
					}
				});
			});
		}
		/**
		* Read the collection policy.
		* @returns whether this Host currently accepts Desktop analytics.
		*/
		enabled() {
			return this.active && this.config.enabled.get();
		}
		/**
		* Stream the effective policy initially and after live configuration edits.
		* @param signal - subscriber lifetime.
		* @returns current policy values until cancellation or service disposal.
		*/
		async *watchPolicy(signal) {
			let update = Promise.withResolvers();
			const changed = () => {
				update.resolve();
			};
			this.listeners.add(changed);
			signal.addEventListener("abort", changed, { once: true });
			try {
				while (this.active && !signal.aborted) {
					yield this.enabled();
					await update.promise;
					update = Promise.withResolvers();
				}
			} finally {
				this.listeners.delete(changed);
				signal.removeEventListener("abort", changed);
			}
		}
		/**
		* Submit selected Desktop fields with cached static environment and fresh identity.
		* The first intake waits for bounded environment queries; concurrent intakes share them.
		* Missing identity is omitted; failed environment fields carry fixed reasons.
		* @param event - typed product event without message contents or credentials.
		* @returns after local submission; no delivery or warehouse acknowledgement.
		*/
		async report(event) {
			if (!this.enabled()) return;
			try {
				this.environment ??= collectEnvironment({
					timeoutMillis: this.config.environmentQueryTimeoutMillis,
					maxOutputBytes: this.config.environmentQueryMaxOutputBytes,
					signal: this.environmentLifetime.signal
				});
				const [environment, identity] = await Promise.all([this.environment, this.ctx.deepseekAccount.getDeviceIdentity().catch(() => void 0)]);
				if (!this.enabled()) return;
				const { missing_fields: missingFields, ...metadata } = environment;
				const missing = Object.entries(missingFields).sort(([a], [b]) => a.localeCompare(b)).map(([field, reason]) => `${field}=${reason}`).join(",");
				this.ctx.productTelemetry.emit({
					...event,
					body: event.eventName,
					attributes: {
						...event.attributes,
						...metadata,
						...missing === "" ? {} : { missing_fields: missing },
						...identity?.deviceId === void 0 ? {} : { device_id: identity.deviceId },
						...identity?.userId === void 0 ? {} : { user_id: identity.userId },
						...this.config.appVersion === void 0 ? {} : { app_version: this.config.appVersion }
					}
				});
			} catch (error) {
				this.ctx.logger.warn("Product analytics submission failed", error);
			}
		}
	};
})();
//#endregion
export { ProductAnalytics as default };
