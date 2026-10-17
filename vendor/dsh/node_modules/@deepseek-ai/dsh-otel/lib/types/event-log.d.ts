/** Ordinary event SDK batching over a cancellable HTTP transport. */
import type { Attributes } from '@opentelemetry/api';
import { SeverityNumber } from '@opentelemetry/api-logs';
import type { BatchLogRecordProcessorOptions } from '@opentelemetry/sdk-logs';
import type { SessionLogOptions } from './session-log.ts';
import type { LogExporterOptions } from './transport.ts';
/** Scalar values accepted by the collector's Arrow attributes map. */
export type OTelEventScalar = string | number | boolean;
/** Explicitly selected analytics fields; object values may contain scalars only. */
export interface OTelEventRecord {
    /** Product/DA-owned event name. */
    eventName: string;
    /** Human-readable summary; never a prompt, response, credential, or file contents. */
    body: string;
    /** Event occurrence time in Unix milliseconds. Observation time is assigned on enqueue. */
    timestamp: number;
    /** OTel severity; omitted values use INFO. */
    severityNumber?: SeverityNumber;
    /** Business fields selected by the caller; no automatic device or account identity. */
    attributes?: Record<string, OTelEventScalar | Record<string, OTelEventScalar>>;
}
/** Ordinary-event transport, resource, scope, and count-batching options. */
export interface EventLogOptions {
    exporter: LogExporterOptions;
    resourceAttributes: Attributes;
    scope: {
        name: string;
        version?: string;
    };
    processor: Omit<BatchLogRecordProcessorOptions, 'exporter'>;
    onFailure: SessionLogOptions['onFailure'];
}
/** One caller-owned ordinary-event queue, independent of every Session-log queue. */
export declare class EventLogReporter {
    private readonly exporter;
    private readonly provider;
    private readonly logger;
    private readonly cancellation;
    /** @param options - explicit transport, resource, scope, queue, and diagnostic settings. */
    constructor(options: EventLogOptions);
    /**
     * Enqueue caller-selected analytics fields without acknowledging delivery.
     * @param record - the ordinary event to report.
     */
    emit(record: OTelEventRecord): void;
    /**
     * Drain the queue and release its transport, cancelling remaining exports when the caller aborts.
     * @param signal - optional shutdown deadline; abort discards pending exports and cancels retry waits.
     * @returns completion of SDK shutdown and transport cleanup.
     */
    shutdown(signal?: AbortSignal): Promise<void>;
}
//# sourceMappingURL=event-log.d.ts.map