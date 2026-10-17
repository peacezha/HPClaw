import { createRequire } from "node:module";
import z from "@deepseek-ai/schemastery";
import { Session } from "@deepseek-ai/dsh-session";
import { SessionTelemetryBackend, SessionTelemetryCoordinator } from "@deepseek-ai/dsh-session-telemetry";
import { APP_IDENTITY } from "@deepseek-ai/dsh-llm";
import { getOrCreateAnonymousUserId } from "@deepseek-ai/dsh-anonymous-user-id";
import { SeverityNumber } from "@opentelemetry/api-logs";
//#region lib/types/index.js
/**
* OpenTelemetry Service Provider for the DeepSeek Harness telemetry capability.
*
* Authorizes feedback-bounded capture and hands complete event strings to the
* Session-log reporter. This plugin owns resource identity and an outer
* shutdown deadline; the reporter owns byte-bounded SDK delivery.
*
* @module @deepseek-ai/dsh-session-telemetry-otel
*/
/** Session-sharing policy selected by {@link Config.mode}. */
var SessionTelemetryMode;
(function(SessionTelemetryMode) {
	SessionTelemetryMode["FEEDBACK_ONLY"] = "FEEDBACK_ONLY";
	SessionTelemetryMode["DISABLED"] = "DISABLED";
})(SessionTelemetryMode || (SessionTelemetryMode = {}));
/** Default session-sharing policy for schema and direct construction. */
const DEFAULT_TELEMETRY_MODE = SessionTelemetryMode.FEEDBACK_ONLY;
const DISABLED_FEEDBACK_WARNING = "OpenTelemetry session upload is DISABLED; this feedback is not uploaded through OpenTelemetry";
const NON_CANONICAL_EVENT_WARNING = "session telemetry ignored an event absent from the canonical session log";
/** Only this Session's explicit feedback authorizes replay; fork seeds do not. */
function isFeedback(session, event) {
	if (event.seq < session.inheritedEventCount) return false;
	switch (event.type) {
		case "feedback/record": return true;
		case "feedback/message-put":
		case "feedback/message-delete": return event.data.sessionId === session.id;
		default: return false;
	}
}
/** Resolve the default and reject unknown runtime values before transport setup. */
function resolveMode(mode) {
	const resolved = mode ?? DEFAULT_TELEMETRY_MODE;
	switch (resolved) {
		case SessionTelemetryMode.FEEDBACK_ONLY:
		case SessionTelemetryMode.DISABLED: return resolved;
		default: return assertNever(resolved);
	}
}
/** Fail closed when direct construction bypasses the runtime config schema. */
function assertNever(value) {
	throw new Error(`session-telemetry-otel: unsupported mode ${JSON.stringify(value)}`);
}
/** Map the serialized mode onto the seam's backend-independent sharing vocabulary. */
function sharingStatusFor(mode) {
	switch (mode) {
		case SessionTelemetryMode.FEEDBACK_ONLY: return "feedback-only";
		case SessionTelemetryMode.DISABLED: return "disabled";
		/* v8 ignore next 2 -- resolveMode already rejected unknown values before this switch; the closed enum cannot reach the default. */
		default: return assertNever(mode);
	}
}
/**
* Schemastery validator for {@link Config}; cordis runs it before the plugin
* starts. The constructor validates endpoint and shutdown requirements; the
* reporter validates Session byte and queue limits. SDK transport and
* processor settings use the reporter's accepted option types, which exclude
* self-observability metering.
*/
const Config = z.object({
	mode: z.union(Object.values(SessionTelemetryMode)).default(DEFAULT_TELEMETRY_MODE),
	exporter: z.any(),
	processor: z.any(),
	shutdownTimeoutMillis: z.number(),
	maxRequestBytes: z.number().step(1).min(1).max(4e6)
});
/** Default outer allowance for the SDK's complete shutdown sequence. */
const DEFAULT_SHUTDOWN_TIMEOUT_MILLIS = 3e3;
const MAX_TIMER_DELAY_MILLIS = 2147483647;
/** Severity mapping from the Service Definition's three-level vocabulary to OTel severity numbers. */
const SEVERITY = {
	info: SeverityNumber.INFO,
	warn: SeverityNumber.WARN,
	error: SeverityNumber.ERROR
};
/**
* The backend plugin — the only entry a deployment loads. It always registers
* the `sessionTelemetry` service (duplicate load throws). `FEEDBACK_ONLY` wires the SDK
* pipeline and on-demand {@link SessionTelemetryCoordinator}; `DISABLED` constructs no
* SDK state and listens only to warn when recorded feedback stays local.
*/
var OpenTelemetrySessionBackend = class extends SessionTelemetryBackend {
	static inject = ["sessions", "otel"];
	static Config = Config;
	provider;
	shutdownTimeoutMillis;
	sharing;
	constructor(ctx, config) {
		const mode = resolveMode(config.mode);
		super(ctx);
		this.sharing = sharingStatusFor(mode);
		if (mode === SessionTelemetryMode.DISABLED) {
			this.provider = void 0;
			this.shutdownTimeoutMillis = DEFAULT_SHUTDOWN_TIMEOUT_MILLIS;
			ctx.on("session/event", (session, event) => {
				if (isFeedback(session, event)) ctx.logger.warn(DISABLED_FEEDBACK_WARNING);
			});
			return;
		}
		const url = config.exporter?.url;
		if (url === void 0 || url.length === 0) throw new Error("session-telemetry-otel: exporter.url is required (the full OTLP logs endpoint)");
		let parsed;
		try {
			parsed = new URL(url);
		} catch {
			throw new Error(`session-telemetry-otel: exporter.url is not a valid URL: ${JSON.stringify(url)}`);
		}
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error(`session-telemetry-otel: exporter.url must be http(s), got ${parsed.protocol}`);
		const batchSize = config.processor?.maxExportBatchSize;
		if (batchSize !== void 0 && (!Number.isInteger(batchSize) || batchSize < 1)) throw new Error(`session-telemetry-otel: processor.maxExportBatchSize must be a positive integer, got ${String(batchSize)}`);
		const shutdownTimeoutMillis = config.shutdownTimeoutMillis ?? 3e3;
		if (!Number.isFinite(shutdownTimeoutMillis) || shutdownTimeoutMillis <= 0 || shutdownTimeoutMillis > MAX_TIMER_DELAY_MILLIS) throw new Error(`session-telemetry-otel: shutdownTimeoutMillis must be a positive finite number no greater than ${MAX_TIMER_DELAY_MILLIS}, got ${String(shutdownTimeoutMillis)}`);
		this.shutdownTimeoutMillis = shutdownTimeoutMillis;
		const { version } = createRequire(import.meta.url)("../package.json");
		const reporter = ctx.otel.createSessionLogReporter({
			scope: {
				name: "@deepseek-ai/dsh-session-telemetry-otel",
				version
			},
			exporter: {
				...config.exporter,
				url
			},
			...config.processor === void 0 ? {} : { processor: config.processor },
			...config.maxRequestBytes === void 0 ? {} : { maxRequestBytes: config.maxRequestBytes },
			resourceAttributes: {
				"service.name": APP_IDENTITY.product,
				"service.version": APP_IDENTITY.version,
				"user.id": getOrCreateAnonymousUserId()
			},
			onFailure: (message, error) => {
				ctx.logger.warn(message, error);
			}
		});
		this.provider = reporter;
		const enqueue = (record) => {
			if (record.sourceEvent === void 0) {
				ctx.logger.warn("Session log record withheld: redaction removed sourceEvent");
				return;
			}
			reporter.reportSessionLog({
				sessionId: record.sourceEvent.sessionId,
				event: {
					...record.sourceEvent.envelope,
					data: record.body
				},
				severityNumber: SEVERITY[record.severity],
				attributes: record.attributes
			});
		};
		const coordinator = new SessionTelemetryCoordinator(ctx, {
			emit: enqueue,
			shutdown: () => this.shutdown()
		}, {
			capture: "on-demand",
			includeHistory: true
		});
		ctx.on("session/event", (session, event) => {
			if (!isFeedback(session, event)) return;
			if (session.eventAt(event.seq) !== event) {
				ctx.logger.warn(NON_CANONICAL_EVENT_WARNING);
				return;
			}
			coordinator.captureSession(session, event.seq);
		});
		ctx.on("feedback/committed", (inspection) => {
			const snapshot = structuredClone(inspection);
			const committed = snapshot.events.at(-1);
			if (committed === void 0) return;
			const session = Session.fromRestore(snapshot.meta.id, snapshot.events, snapshot.meta, snapshot.inheritedEventCount, "detached", ctx.sessions.messageProjections);
			if (isFeedback(session, committed)) coordinator.captureSession(session, committed.seq);
		});
	}
	/**
	* Drop direct records. Only a new canonical feedback submission can authorize
	* capture through the private coordinator sink, for every provider.
	* @param _record - the direct record, never uploaded.
	*/
	emit(_record) {}
	/**
	* Drain queued HTTP requests until the deployment deadline. The watchdog
	* never releases an unsettled transport slot. At the outer deadline,
	* queued records are abandoned and no further requests may start.
	* @returns completion after transport shutdown, or rejection at the configured deadline.
	*/
	async shutdown() {
		if (this.provider === void 0) return;
		const providerShutdown = this.provider.shutdown();
		let timer;
		const deadline = new Promise((_resolve, reject) => {
			timer = setTimeout(() => {
				this.provider?.stopPending();
				reject(/* @__PURE__ */ new Error(`session-telemetry-otel: provider shutdown exceeded ${this.shutdownTimeoutMillis}ms`));
			}, this.shutdownTimeoutMillis);
		});
		try {
			await Promise.race([providerShutdown, deadline]);
		} finally {
			/* v8 ignore else -- the Promise executor assigns timer synchronously before this race starts. */
			if (timer !== void 0) clearTimeout(timer);
		}
	}
};
//#endregion
export { Config, DEFAULT_SHUTDOWN_TIMEOUT_MILLIS, DEFAULT_TELEMETRY_MODE, OpenTelemetrySessionBackend, OpenTelemetrySessionBackend as default, SessionTelemetryMode };
