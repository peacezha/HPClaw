/** Explicit OTLP JSON transport for feedback-authorized Session logs. */
import { createOtlpHttpExportDelegate } from '@opentelemetry/otlp-exporter-base/node-http';
import { type ExporterMetrics, type OTLPExporterNodeConfigBase } from '@opentelemetry/otlp-exporter-base';
import type { LogRecordExporter, ReadableLogRecord } from '@opentelemetry/sdk-logs';
/**
 * Collector and SDK HTTP settings accepted by this package's log exporters.
 *
 * `OTLPExporterConfigBase.selfObsMeterProvider` is excluded: every channel here
 * passes no meter provider to the exporter metrics recorder, which stays noop.
 */
export type LogExporterOptions = Omit<OTLPExporterNodeConfigBase, 'selfObsMeterProvider'> & {
    /** Full HTTP(S) logs destination. */
    url: string;
};
/**
 * Create an SDK JSON exporter without inheriting another collector's headers or TLS identity.
 * @param options - explicit endpoint, headers, agent, and SDK transport settings.
 * @returns the exporter owned by one independent log pipeline.
 */
export declare function createLogExporter(options: LogExporterOptions): LogRecordExporter;
/**
 * Create one log exporter's self-observability metrics; without a meter provider they record nothing.
 * @param url - collector endpoint recorded as the metrics server address and port.
 * @returns the metrics recorder required by an OTLP HTTP log export delegate.
 */
export declare function createLogExporterMetrics(url: string): ExporterMetrics<ReadableLogRecord[]>;
/**
 * Resolve collector-local headers and agents with shared SDK timeout and compression defaults.
 * @param options - explicit endpoint and SDK HTTP settings.
 * @returns resolved transport settings without ambient credentials.
 */
export declare function logTransportOptions(options: LogExporterOptions): Parameters<typeof createOtlpHttpExportDelegate>[0];
//# sourceMappingURL=transport.d.ts.map