/** Product analytics policy adapter for the shared Cordis OTel service. */
import { Context, Service } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import type { OTelEventRecord, OTelEventScalar } from '@deepseek-ai/dsh-otel';
declare module '@deepseek-ai/cordis' {
    interface Context {
        productTelemetry: ProductTelemetry;
    }
}
/** Caller-selected ordinary analytics record. */
export type ProductTelemetryRecord = OTelEventRecord;
/** Scalar values accepted in product attributes. */
export type ProductTelemetryScalar = OTelEventScalar;
/** Collector routing, application identity, and bounded in-memory batch settings. */
export interface Config {
    /** Full HTTP(S) logs URL. */
    endpoint: string;
    /** Collector routing header. */
    channel: string;
    /** Resource service.name supplied by the application composition. */
    serviceName: string;
    /** Resource service.version supplied by the application composition. */
    serviceVersion: string;
    /** Omit to honor OTEL_EXPORTER_OTLP_LOGS_COMPRESSION / OTEL_EXPORTER_OTLP_COMPRESSION. */
    compression?: 'none' | 'gzip';
    /** Maximum records per export; must not exceed maxQueueSize. */
    maxExportBatchSize: number;
    /** Maximum queued records; the SDK drops new records when full. */
    maxQueueSize: number;
    /** Delay before exporting a partial batch. */
    scheduledDelayMillis: number;
    /** Exporter HTTP deadline, including SDK transient-error retries. */
    timeoutMillis: number;
    /** Processor deadline for one batch export. */
    exportTimeoutMillis: number;
    /** Drain deadline; expiry cancels pending exports before disposal completes. */
    shutdownTimeoutMillis: number;
}
/** Loader validation and defaults for application compositions. */
export declare const Config: z<Partial<Config>, Config>;
/** Host analytics sender. Mounting alone sends nothing; the owning fiber drains it on unload. */
export default class ProductTelemetry extends Service {
    static inject: string[];
    static Config: z<Partial<Config>, Config>;
    private readonly reporter;
    constructor(ctx: Context, config: Config);
    /**
     * Enqueue one selected product event without waiting for network delivery.
     * Queue admission and shutdown completion are not collector or warehouse acknowledgements.
     * @param record - caller-owned event containing only approved analytics fields.
     */
    emit(record: ProductTelemetryRecord): void;
}
//# sourceMappingURL=index.d.ts.map