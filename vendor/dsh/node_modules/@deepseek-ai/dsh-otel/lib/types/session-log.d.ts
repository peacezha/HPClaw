/** Session-log records in an independent byte-bounded OTLP queue. */
import type { SessionEvent, SessionId } from '@deepseek-ai/dsh-session';
import type { Attributes } from '@opentelemetry/api';
import { SeverityNumber } from '@opentelemetry/api-logs';
import { type BatchLogRecordProcessorOptions } from '@opentelemetry/sdk-logs';
import { type LogExporterOptions } from './transport.ts';
/** Collector request ceiling in uncompressed UTF-8 bytes, including the OTLP envelope. */
export declare const SESSION_LOG_MAX_REQUEST_BYTES = 4000000;
/** One canonical event with its separately owned Session identity and redacted payload. */
export interface SessionLogRecord {
    sessionId: SessionId;
    /** Complete event envelope; data is the capture policy's exported copy. */
    event: Omit<SessionEvent, 'data'> & {
        data: unknown;
    };
    /** Additional capture metadata; sessionId and content are always assigned by the reporter. */
    attributes?: Attributes;
    /** Omitted values use INFO. */
    severityNumber?: SeverityNumber;
}
/**
 * Byte and count batching fields implemented by {@link SessionLogProcessor}.
 *
 * `exporter` belongs to the owning channel, and `selfObsMeterProvider` is
 * excluded because this processor implements no self-observability metering.
 */
export type SessionLogProcessorOptions = Omit<BatchLogRecordProcessorOptions, 'exporter' | 'selfObsMeterProvider'>;
/** Session-log transport and byte/count queue settings. */
export interface SessionLogOptions {
    /** Explicit destination and SDK transport settings; exporter self-observability metering is not supported. */
    exporter: LogExporterOptions;
    /** Session-only queue settings, independent of product-event aggregation. */
    processor?: SessionLogProcessorOptions;
    /** May lower, but never exceed, the collector's 4,000,000-byte limit. */
    maxRequestBytes?: number;
    /** Instrumentation scope supplied by the business owner. */
    scope: {
        name: string;
        version?: string;
    };
    /** Application and anonymous identity carried on the OTLP resource. */
    resourceAttributes: Attributes;
    /** Report rejected single records and network failures without recording their content. */
    onFailure: (message: string, error?: Error) => void;
}
/**
 * Validate byte and queue settings before constructing an SDK pipeline.
 * @param options - Session-specific limits supplied by the owning composition.
 * @returns the resolved collector request limit.
 */
export declare function resolveSessionLogLimits(options: Pick<SessionLogOptions, 'maxRequestBytes' | 'processor'>): number;
/** Owns feedback-authorized Session logs; no product-event provider or queue is mounted. */
export declare class SessionLogReporter {
    private readonly provider;
    private readonly processor;
    private readonly logger;
    /** @param options - explicit transport, resource identity, queue limits, and diagnostics. */
    constructor(options: SessionLogOptions);
    /**
     * Enqueue one complete event without acknowledging network delivery.
     * @param record - event with redacted data and its original Session id.
     */
    reportSessionLog(record: SessionLogRecord): void;
    /** Stop queued requests after the owning backend's shutdown deadline; an active transport may still settle. */
    stopPending(): void;
    /**
     * Drain queued requests and release the SDK transport.
     * @returns completion after queued requests settle and the SDK transport shuts down.
     */
    shutdown(): Promise<void>;
}
//# sourceMappingURL=session-log.d.ts.map