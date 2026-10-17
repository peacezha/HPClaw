/**
 * OpenTelemetry Service Provider for the DeepSeek Harness telemetry capability.
 *
 * Authorizes feedback-bounded capture and hands complete event strings to the
 * Session-log reporter. This plugin owns resource identity and an outer
 * shutdown deadline; the reporter owns byte-bounded SDK delivery.
 *
 * @module @deepseek-ai/dsh-session-telemetry-otel
 */
import z from '@deepseek-ai/schemastery';
import type { Context } from '@deepseek-ai/cordis';
import { SessionTelemetryBackend, type SessionTelemetryRecord, type SessionTelemetrySharingStatus } from '@deepseek-ai/dsh-session-telemetry';
import type { LogExporterOptions, SessionLogProcessorOptions } from '@deepseek-ai/dsh-otel';
/** Session-sharing policy selected by {@link Config.mode}. */
export declare enum SessionTelemetryMode {
    FEEDBACK_ONLY = "FEEDBACK_ONLY",
    DISABLED = "DISABLED"
}
/** Default session-sharing policy for schema and direct construction. */
export declare const DEFAULT_TELEMETRY_MODE = SessionTelemetryMode.FEEDBACK_ONLY;
/**
 * Plugin configuration: sharing policy, SDK transport options, byte/count queue
 * settings, and an overall shutdown bound. Uploading modes validate their endpoint
 * and shutdown deadline at plugin load; `DISABLED` reads neither.
 */
export interface Config {
    /** Defaults to `FEEDBACK_ONLY`: capture session history only when feedback is explicitly submitted. */
    mode?: SessionTelemetryMode;
    /**
     * Explicit SDK HTTP transport settings, including optional routing headers.
     * Ambient credentials are not inherited. URL is required while uploading.
     * Exporter self-observability metering is not supported.
     */
    exporter?: Omit<LogExporterOptions, 'url'> & {
        /** Full logs endpoint (e.g. `https://collector.example.com/v1/logs`). Required outside `DISABLED`; validated at load. */
        url?: string;
    };
    /**
     * Count, queue, cadence, and per-request watchdog settings for the byte-bounded
     * processor. A watchdog warning never releases an unsettled transport slot.
     * SDK processor self-observability metering is not supported.
     */
    processor?: SessionLogProcessorOptions;
    /** Maximum time spent awaiting the SDK provider's complete shutdown path. */
    shutdownTimeoutMillis?: number;
    /** Uncompressed OTLP request byte limit, at most 4,000,000. */
    maxRequestBytes?: number;
}
/**
 * Schemastery validator for {@link Config}; cordis runs it before the plugin
 * starts. The constructor validates endpoint and shutdown requirements; the
 * reporter validates Session byte and queue limits. SDK transport and
 * processor settings use the reporter's accepted option types, which exclude
 * self-observability metering.
 */
export declare const Config: z<Config>;
/** Default outer allowance for the SDK's complete shutdown sequence. */
export declare const DEFAULT_SHUTDOWN_TIMEOUT_MILLIS = 3000;
/**
 * The backend plugin — the only entry a deployment loads. It always registers
 * the `sessionTelemetry` service (duplicate load throws). `FEEDBACK_ONLY` wires the SDK
 * pipeline and on-demand {@link SessionTelemetryCoordinator}; `DISABLED` constructs no
 * SDK state and listens only to warn when recorded feedback stays local.
 */
export declare class OpenTelemetrySessionBackend extends SessionTelemetryBackend {
    static inject: string[];
    static Config: z<Config>;
    private readonly provider;
    private readonly shutdownTimeoutMillis;
    readonly sharing: SessionTelemetrySharingStatus;
    constructor(ctx: Context, config: Config);
    /**
     * Drop direct records. Only a new canonical feedback submission can authorize
     * capture through the private coordinator sink, for every provider.
     * @param _record - the direct record, never uploaded.
     */
    emit(_record: SessionTelemetryRecord): void;
    /**
     * Drain queued HTTP requests until the deployment deadline. The watchdog
     * never releases an unsettled transport slot. At the outer deadline,
     * queued records are abandoned and no further requests may start.
     * @returns completion after transport shutdown, or rejection at the configured deadline.
     */
    shutdown(): Promise<void>;
}
export default OpenTelemetrySessionBackend;
//# sourceMappingURL=index.d.ts.map