import { Service } from "@deepseek-ai/cordis";
import z from "@deepseek-ai/schemastery";
import { validateHeaderValue } from "node:http";
import { CompressionAlgorithm } from "@opentelemetry/otlp-exporter-base";
//#region lib/types/index.js
/** Product analytics policy adapter for the shared Cordis OTel service. */
const positiveInteger = () => z.number().step(1).min(1).max(2147483647);
/** Loader validation and defaults for application compositions. */
const Config = z.object({
	endpoint: z.string().default("https://dsh-otel-collector.deepseeksvc.com/v1/logs"),
	channel: z.string().min(1).default("dsh_otel_report"),
	serviceName: z.string().required(),
	serviceVersion: z.string().required(),
	compression: z.union(["none", "gzip"]),
	maxExportBatchSize: positiveInteger().default(512),
	maxQueueSize: positiveInteger().default(2048),
	scheduledDelayMillis: positiveInteger().default(3e4),
	timeoutMillis: positiveInteger().default(15e3),
	exportTimeoutMillis: positiveInteger().default(2e4),
	shutdownTimeoutMillis: positiveInteger().default(21e3)
});
/** Host analytics sender. Mounting alone sends nothing; the owning fiber drains it on unload. */
var ProductTelemetry = class extends Service {
	static inject = ["otel"];
	static Config = Config;
	reporter;
	constructor(ctx, config) {
		let endpoint;
		try {
			endpoint = new URL(config.endpoint);
		} catch (cause) {
			throw new Error("product-telemetry-otel: endpoint must be a valid HTTP(S) URL", { cause });
		}
		try {
			validateHeaderValue("x-channel", config.channel);
		} catch (cause) {
			throw new Error("product-telemetry-otel: channel must be a valid HTTP header value", { cause });
		}
		if (!["http:", "https:"].includes(endpoint.protocol)) throw new Error("product-telemetry-otel: endpoint must use HTTP or HTTPS");
		if (config.maxExportBatchSize > config.maxQueueSize) throw new Error("product-telemetry-otel: maxExportBatchSize must not exceed maxQueueSize");
		super(ctx, "productTelemetry");
		const reporter = ctx.otel.createEventReporter({
			exporter: {
				url: config.endpoint,
				headers: { "x-channel": config.channel },
				timeoutMillis: config.timeoutMillis,
				...config.compression === void 0 ? {} : { compression: config.compression === "gzip" ? CompressionAlgorithm.GZIP : CompressionAlgorithm.NONE }
			},
			resourceAttributes: {
				"service.name": config.serviceName,
				"service.version": config.serviceVersion
			},
			scope: { name: "@deepseek-ai/dsh-host-product-telemetry-otel" },
			processor: {
				maxExportBatchSize: config.maxExportBatchSize,
				maxQueueSize: config.maxQueueSize,
				scheduledDelayMillis: config.scheduledDelayMillis,
				exportTimeoutMillis: config.exportTimeoutMillis
			},
			onFailure: (message, error) => {
				ctx.logger.warn(message, error);
			}
		});
		this.reporter = reporter;
		ctx.effect(() => async () => {
			const cancellation = new AbortController();
			const timer = setTimeout(() => {
				ctx.logger.warn("Product telemetry shutdown deadline exceeded; pending events may be lost");
				cancellation.abort(/* @__PURE__ */ new Error("Product telemetry shutdown deadline exceeded"));
			}, config.shutdownTimeoutMillis);
			try {
				await reporter.shutdown(cancellation.signal);
			} finally {
				clearTimeout(timer);
			}
		});
	}
	/**
	* Enqueue one selected product event without waiting for network delivery.
	* Queue admission and shutdown completion are not collector or warehouse acknowledgements.
	* @param record - caller-owned event containing only approved analytics fields.
	*/
	emit(record) {
		this.reporter.emit(record);
	}
};
//#endregion
export { Config, ProductTelemetry as default };
