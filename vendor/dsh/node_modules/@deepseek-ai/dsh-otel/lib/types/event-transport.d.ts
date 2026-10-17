import type { LogRecordExporter } from '@opentelemetry/sdk-logs';
import { type LogExporterOptions } from './transport.ts';
/**
 * Create a channel-owned exporter whose cancellation releases requests and retry timers.
 * @param options - explicit collector and SDK HTTP settings.
 * @param signal - channel cancellation, shared by current and future batch exports.
 * @returns the SDK exporter; shutdown also destroys its owned HTTP agent.
 */
export declare function createEventLogExporter(options: LogExporterOptions, signal: AbortSignal): LogRecordExporter;
//# sourceMappingURL=event-transport.d.ts.map