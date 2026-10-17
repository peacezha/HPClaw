import type { ReadableLogRecord } from '@opentelemetry/sdk-logs';
import type { IExporterMetricsHelper } from '../i-exporter-metrics-helper';
export type { IExportLogsServiceResponse, IExportLogsPartialSuccess, } from './export-response';
/**
 * @experimental this helper may receive breaking changes in minor versions, pin this package's version when using this constant
 */
export declare const LogsExporterMetricsHelper: IExporterMetricsHelper<ReadableLogRecord[]>;
//# sourceMappingURL=index.d.ts.map