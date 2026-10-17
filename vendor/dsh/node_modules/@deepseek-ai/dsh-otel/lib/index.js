import { Service } from "@deepseek-ai/cordis";
import { addAbortListener } from "node:events";
import { SeverityNumber } from "@opentelemetry/api-logs";
import { ExportResultCode } from "@opentelemetry/core";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";
import { gzipSync } from "node:zlib";
import got from "got";
import { OTLPExporterBase, createOtlpNetworkExportDelegate, getSharedConfigurationDefaults, mergeOtlpSharedConfigurationWithDefaults } from "@opentelemetry/otlp-exporter-base";
import { JsonLogsSerializer, LogsExporterMetricsHelper } from "@opentelemetry/otlp-transformer";
import { createOtlpHttpExportDelegate, createOtlpHttpExporterMetrics, getSharedConfigurationFromEnvironment, httpAgentFactoryFromOptions } from "@opentelemetry/otlp-exporter-base/node-http";
//#region lib/types/transport.js
/** Explicit OTLP JSON transport for feedback-authorized Session logs. */
/** `otel.component.type` reported by OTLP HTTP log exporter self-observability metrics. */
const OTLP_HTTP_LOG_EXPORTER_COMPONENT_TYPE = "otlp_http_log_exporter";
/**
* Create an SDK JSON exporter without inheriting another collector's headers or TLS identity.
* @param options - explicit endpoint, headers, agent, and SDK transport settings.
* @returns the exporter owned by one independent log pipeline.
*/
function createLogExporter(options) {
	return new OTLPExporterBase(createOtlpHttpExportDelegate(logTransportOptions(options), JsonLogsSerializer, OTLP_HTTP_LOG_EXPORTER_COMPONENT_TYPE, LogsExporterMetricsHelper, void 0));
}
/**
* Create one log exporter's self-observability metrics; without a meter provider they record nothing.
* @param url - collector endpoint recorded as the metrics server address and port.
* @returns the metrics recorder required by an OTLP HTTP log export delegate.
*/
function createLogExporterMetrics(url) {
	return createOtlpHttpExporterMetrics(OTLP_HTTP_LOG_EXPORTER_COMPONENT_TYPE, LogsExporterMetricsHelper, url, void 0);
}
/**
* Resolve collector-local headers and agents with shared SDK timeout and compression defaults.
* @param options - explicit endpoint and SDK HTTP settings.
* @returns resolved transport settings without ambient credentials.
*/
function logTransportOptions(options) {
	return {
		...mergeOtlpSharedConfigurationWithDefaults(options, getSharedConfigurationFromEnvironment("LOGS"), getSharedConfigurationDefaults()),
		url: options.url,
		headers: async () => ({
			"Content-Type": "application/json",
			...typeof options.headers === "function" ? await options.headers() : options.headers
		}),
		agentFactory: typeof options.httpAgentOptions === "function" ? options.httpAgentOptions : httpAgentFactoryFromOptions({
			keepAlive: options.keepAlive ?? true,
			...options.httpAgentOptions
		}),
		...options.userAgent === void 0 ? {} : { userAgent: options.userAgent }
	};
}
//#endregion
//#region lib/types/event-transport.js
/**
* Create a channel-owned exporter whose cancellation releases requests and retry timers.
* @param options - explicit collector and SDK HTTP settings.
* @param signal - channel cancellation, shared by current and future batch exports.
* @returns the SDK exporter; shutdown also destroys its owned HTTP agent.
*/
function createEventLogExporter(options, signal) {
	const config = logTransportOptions(options);
	let agent;
	const exporter = new OTLPExporterBase(createOtlpNetworkExportDelegate(config, JsonLogsSerializer, createLogExporterMetrics(config.url), {
		async send(data, timeoutMillis) {
			signal.throwIfAborted();
			agent ??= config.agentFactory(new URL(config.url).protocol);
			const selectedAgent = await agent;
			const headers = await config.headers();
			signal.throwIfAborted();
			const compressed = config.compression === "gzip";
			const request = got.post(config.url, {
				body: compressed ? gzipSync(data) : Buffer.from(data),
				headers: {
					...headers,
					...compressed ? { "content-encoding": "gzip" } : {},
					...config.userAgent === void 0 ? {} : { "user-agent": config.userAgent }
				},
				agent: new URL(config.url).protocol === "https:" ? { https: selectedAgent } : { http: selectedAgent },
				signal: AbortSignal.any([signal, AbortSignal.timeout(timeoutMillis)]),
				followRedirect: false,
				retry: {
					limit: 5,
					methods: ["POST"],
					statusCodes: [
						429,
						502,
						503,
						504
					],
					errorCodes: [],
					backoffLimit: 5e3
				},
				responseType: "buffer"
			});
			request.on("downloadProgress", ({ transferred }) => {
				if (transferred > 4 * 1024 * 1024) request.cancel();
			});
			const response = await request;
			if (response.statusCode >= 300) throw new Error(`OTLP collector returned HTTP ${response.statusCode}`);
			return {
				status: "success",
				data: response.body
			};
		},
		shutdown() {}
	}));
	let shutdown;
	return {
		export: (records, callback) => {
			exporter.export(records, callback);
		},
		forceFlush: () => exporter.forceFlush(),
		shutdown() {
			shutdown ??= (async () => {
				try {
					await exporter.shutdown();
				} finally {
					(await agent)?.destroy();
				}
			})();
			return shutdown;
		}
	};
}
//#endregion
//#region lib/types/event-log.js
/** One caller-owned ordinary-event queue, independent of every Session-log queue. */
var EventLogReporter = class {
	exporter;
	provider;
	logger;
	cancellation = new AbortController();
	/** @param options - explicit transport, resource, scope, queue, and diagnostic settings. */
	constructor(options) {
		const exporter = createEventLogExporter(options.exporter, this.cancellation.signal);
		this.exporter = exporter;
		this.provider = new LoggerProvider({
			resource: resourceFromAttributes(options.resourceAttributes),
			processors: [new BatchLogRecordProcessor({
				...options.processor,
				exporter: {
					export: (records, callback) => {
						exporter.export(records, (result) => {
							if (result.code !== ExportResultCode.SUCCESS) options.onFailure("Product telemetry export failed", result.error);
							callback(result);
						});
					},
					forceFlush: () => exporter.forceFlush(),
					shutdown: () => exporter.shutdown()
				}
			})]
		});
		this.logger = this.provider.getLogger(options.scope.name, options.scope.version);
	}
	/**
	* Enqueue caller-selected analytics fields without acknowledging delivery.
	* @param record - the ordinary event to report.
	*/
	emit(record) {
		const severityNumber = record.severityNumber ?? SeverityNumber.INFO;
		this.logger.emit({
			...record,
			observedTimestamp: Date.now(),
			severityNumber,
			severityText: SeverityNumber[severityNumber]
		});
	}
	/**
	* Drain the queue and release its transport, cancelling remaining exports when the caller aborts.
	* @param signal - optional shutdown deadline; abort discards pending exports and cancels retry waits.
	* @returns completion of SDK shutdown and transport cleanup.
	*/
	async shutdown(signal) {
		const abort = () => {
			this.cancellation.abort(signal?.reason);
		};
		const listener = signal === void 0 ? void 0 : addAbortListener(signal, abort);
		if (signal?.aborted) abort();
		try {
			await this.provider.shutdown();
		} finally {
			try {
				await this.exporter.shutdown();
			} finally {
				listener?.[Symbol.dispose]();
			}
		}
	}
};
//#endregion
//#region lib/types/session-log.js
/** Collector request ceiling in uncompressed UTF-8 bytes, including the OTLP envelope. */
const SESSION_LOG_MAX_REQUEST_BYTES = 4e6;
/**
* Validate byte and queue settings before constructing an SDK pipeline.
* @param options - Session-specific limits supplied by the owning composition.
* @returns the resolved collector request limit.
*/
function resolveSessionLogLimits(options) {
	const limit = options.maxRequestBytes ?? 4e6;
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 4e6) throw new Error(`session log maxRequestBytes must be an integer between 1 and ${SESSION_LOG_MAX_REQUEST_BYTES}`);
	for (const key of [
		"maxQueueSize",
		"maxExportBatchSize",
		"scheduledDelayMillis",
		"exportTimeoutMillis"
	]) {
		const value = options.processor?.[key];
		if (value !== void 0 && (!Number.isSafeInteger(value) || value < 1 || value > 2147483647)) throw new Error(`session log processor.${key} must be a positive integer no greater than 2147483647`);
	}
	const queue = options.processor?.maxQueueSize ?? 2048;
	if ((options.processor?.maxExportBatchSize ?? 512) > queue) throw new Error("session log maxExportBatchSize must not exceed maxQueueSize");
	return limit;
}
/** Byte/count batching with one transport request in flight, including after a watchdog warning. */
var SessionLogProcessor = class {
	exporter;
	limit;
	config;
	warn;
	queue = [];
	bytes = 0;
	timer;
	active;
	shutdownPromise;
	stopped = false;
	constructor(exporter, limit, config, warn) {
		this.exporter = exporter;
		this.limit = limit;
		this.config = config;
		this.warn = warn;
	}
	onEmit(record) {
		if (this.stopped) return;
		if (this.queue.length >= this.config.maxQueueSize) {
			this.warn("Session log queue is full; record rejected");
			return;
		}
		let bytes;
		try {
			const serialized = JsonLogsSerializer.serializeRequest([record]);
			if (serialized === void 0) throw new Error("Session log serialization produced no request");
			bytes = serialized.byteLength;
		} catch (error) {
			this.warn("Session log serialization failed; record rejected", error instanceof Error ? error : new Error(String(error)));
			return;
		}
		if (bytes > this.limit) {
			this.warn("Session log record rejected; content was not truncated", /* @__PURE__ */ new Error(`Session log record exceeds maxRequestBytes: ${bytes} > ${this.limit}`));
			return;
		}
		this.queue.push({
			record,
			bytes
		});
		this.bytes += bytes;
		if (this.active !== void 0) return;
		if (this.queue.length >= this.config.maxExportBatchSize || this.bytes >= this.limit) this.forceFlush();
		else if (this.timer === void 0) {
			this.timer = setTimeout(() => {
				this.forceFlush();
			}, this.config.scheduledDelayMillis);
			this.timer.unref();
		}
	}
	forceFlush() {
		clearTimeout(this.timer);
		this.timer = void 0;
		if (this.active !== void 0) return this.active;
		if (this.queue.length === 0) return Promise.resolve();
		this.active = this.drain();
		return this.active;
	}
	async drain() {
		try {
			while (!this.stopped && this.queue.length > 0) {
				let bytes = 0;
				let count = 0;
				for (const entry of this.queue) {
					if (count === this.config.maxExportBatchSize || bytes + entry.bytes > this.limit) break;
					bytes += entry.bytes;
					count++;
				}
				const records = this.queue.splice(0, count).map((entry) => entry.record);
				this.bytes -= bytes;
				await this.send(records);
				await this.exporter.forceFlush();
			}
		} finally {
			this.active = void 0;
		}
	}
	send(records) {
		return new Promise((resolve) => {
			const timer = setTimeout(() => {
				this.warn("Session log request exceeded exportTimeoutMillis; waiting for transport settlement");
			}, this.config.exportTimeoutMillis);
			timer.unref();
			const finish = (error) => {
				clearTimeout(timer);
				if (error !== void 0) this.warn("Session log export failed", error);
				resolve();
			};
			try {
				this.exporter.export(records, (result) => {
					finish(result.code === ExportResultCode.SUCCESS ? void 0 : result.error ?? /* @__PURE__ */ new Error("Session log HTTP export failed"));
				});
			} catch (error) {
				finish(error instanceof Error ? error : new Error(String(error)));
			}
		});
	}
	stopPending() {
		this.stopped = true;
		this.queue.length = 0;
		this.bytes = 0;
		clearTimeout(this.timer);
		this.timer = void 0;
	}
	shutdown() {
		this.shutdownPromise ??= this.forceFlush().then(() => this.exporter.shutdown());
		return this.shutdownPromise;
	}
};
/** Owns feedback-authorized Session logs; no product-event provider or queue is mounted. */
var SessionLogReporter = class {
	provider;
	processor;
	logger;
	/** @param options - explicit transport, resource identity, queue limits, and diagnostics. */
	constructor(options) {
		const limit = resolveSessionLogLimits(options);
		this.processor = new SessionLogProcessor(createLogExporter(options.exporter), limit, {
			maxQueueSize: options.processor?.maxQueueSize ?? 2048,
			maxExportBatchSize: options.processor?.maxExportBatchSize ?? 512,
			scheduledDelayMillis: options.processor?.scheduledDelayMillis ?? 1e3,
			exportTimeoutMillis: options.processor?.exportTimeoutMillis ?? 3e4
		}, options.onFailure);
		this.provider = new LoggerProvider({
			logRecordLimits: {
				attributeValueLengthLimit: Infinity,
				attributeCountLimit: Infinity
			},
			resource: resourceFromAttributes(options.resourceAttributes),
			processors: [this.processor]
		});
		this.logger = this.provider.getLogger(options.scope.name, options.scope.version);
	}
	/**
	* Enqueue one complete event without acknowledging network delivery.
	* @param record - event with redacted data and its original Session id.
	*/
	reportSessionLog(record) {
		const severityNumber = record.severityNumber ?? SeverityNumber.INFO;
		this.logger.emit({
			eventName: "session-log",
			body: "session-log",
			timestamp: record.event.time,
			observedTimestamp: record.event.time,
			severityNumber,
			severityText: SeverityNumber[severityNumber],
			attributes: {
				...record.attributes,
				sessionId: record.sessionId,
				content: JSON.stringify(record.event)
			}
		});
	}
	/** Stop queued requests after the owning backend's shutdown deadline; an active transport may still settle. */
	stopPending() {
		this.processor.stopPending();
	}
	/**
	* Drain queued requests and release the SDK transport.
	* @returns completion after queued requests settle and the SDK transport shuts down.
	*/
	shutdown() {
		return this.provider.shutdown();
	}
};
//#endregion
//#region lib/types/index.js
/** Cordis entry for independent ordinary-event and Session-log OTLP channels. */
/** Shared transport provider. Mounting creates no queue, identity, or network connection. */
var OTel = class extends Service {
	constructor(ctx) {
		super(ctx, "otel");
	}
	/**
	* Create an independent ordinary-event channel with count-based batching.
	* The injected consumer must drain it during its fiber disposal.
	* @param options - transport, scope, resource, queue, and diagnostic settings selected by the consumer.
	* @returns the caller-owned channel; no state is shared with other channels.
	*/
	createEventReporter(options) {
		return new EventLogReporter(options);
	}
	/**
	* Create an independent byte-bounded Session-log channel.
	* Authorization and redaction precede reporting; the consumer owns shutdown and its outer deadline.
	* @param options - transport, scope, resource, queue, and diagnostic settings selected by the consumer.
	* @returns the caller-owned channel, preserving complete accepted events within the request byte ceiling.
	*/
	createSessionLogReporter(options) {
		return new SessionLogReporter(options);
	}
};
//#endregion
export { OTel as default };
