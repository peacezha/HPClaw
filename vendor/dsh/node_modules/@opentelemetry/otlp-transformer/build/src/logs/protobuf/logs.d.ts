import type { ReadableLogRecord } from '@opentelemetry/sdk-logs';
import type { IExportLogsServiceResponse } from '../export-response';
import type { ISerializer } from '../../i-serializer';
/**
 * @experimental this serializer may receive breaking changes in minor versions, pin this package's version when using this constant
 */
export declare const ProtobufLogsSerializer: ISerializer<ReadableLogRecord[], IExportLogsServiceResponse>;
//# sourceMappingURL=logs.d.ts.map