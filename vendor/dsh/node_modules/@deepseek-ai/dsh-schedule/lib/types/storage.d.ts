/** Durable Host-wide Schedule tasks, independently of Session activation. */
import { z } from 'zod';
import { SessionId } from '@deepseek-ai/dsh-session';
import { MessageId } from '@deepseek-ai/dsh-llm/brand';
import type { ScheduleId } from './types.ts';
/** Stored task binds one schedule to its original Session; absent status decodes as active. */
export declare const scheduleTaskSchema: z.ZodObject<{
    sessionId: z.ZodPipe<z.ZodString, z.ZodTransform<SessionId, string>>;
    record: z.ZodPipe<z.ZodUnknown, z.ZodTransform<import("./types.ts").AfterScheduleRecord | import("./types.ts").AtScheduleRecord | import("./types.ts").EveryScheduleRecord | import("./types.ts").DailyScheduleRecord | import("./types.ts").WeeklyScheduleRecord | import("./types.ts").CronScheduleRecord, unknown>>;
    status: z.ZodDefault<z.ZodEnum<{
        active: "active";
        inactive: "inactive";
    }>>;
    lastDelivery: z.ZodOptional<z.ZodObject<{
        scheduledAt: z.ZodISODateTime;
        deliveredAt: z.ZodISODateTime;
        messageId: z.ZodPipe<z.ZodString, z.ZodTransform<MessageId, string>>;
    }, z.core.$strict>>;
    deliveryHistory: z.ZodOptional<z.ZodObject<{
        records: z.ZodArray<z.ZodObject<{
            scheduledAt: z.ZodISODateTime;
            deliveredAt: z.ZodISODateTime;
            messageId: z.ZodPipe<z.ZodString, z.ZodTransform<MessageId, string>>;
            prompt: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        earlierRecordsUnavailable: z.ZodBoolean;
        earlierRecordsPruned: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
}, z.core.$strict>;
/** Persistent task value; absent history retains only its legacy last receipt without a read-time rewrite. */
export type ScheduleTask = z.infer<typeof scheduleTaskSchema>;
/** Authoritative Schedule storage; malformed tasks reject opening the domain. */
export declare const scheduleDomain: {
    name: string;
    version: number;
    tables: {
        tasks: import("@deepseek-ai/dsh-storage-domain").DomainTableSpec<ScheduleId, {
            sessionId: SessionId;
            record: import("./types.ts").AfterScheduleRecord | import("./types.ts").AtScheduleRecord | import("./types.ts").EveryScheduleRecord | import("./types.ts").DailyScheduleRecord | import("./types.ts").WeeklyScheduleRecord | import("./types.ts").CronScheduleRecord;
            status: "active" | "inactive";
            lastDelivery?: {
                scheduledAt: string;
                deliveredAt: string;
                messageId: MessageId;
            } | undefined;
            deliveryHistory?: {
                records: {
                    scheduledAt: string;
                    deliveredAt: string;
                    messageId: MessageId;
                    prompt?: string | undefined;
                }[];
                earlierRecordsUnavailable: boolean;
                earlierRecordsPruned?: boolean | undefined;
            } | undefined;
        }>;
    };
};
//# sourceMappingURL=storage.d.ts.map