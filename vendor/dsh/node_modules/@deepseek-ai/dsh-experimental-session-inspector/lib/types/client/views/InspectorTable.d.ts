/** Virtualized raw-data table shared by Session log and Chat structure views. */
import { type ReactNode } from 'react';
import type { ConvViewProps } from '@deepseek-ai/dsh-client-ui-conversation/client';
import type { ObservableSnapshot } from '@deepseek-ai/dsh-client-store';
import type { InjectFace, PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import { type InspectorRecord, type InspectorRow } from './table-model.ts';
import type { InspectorChatTarget, InspectorObjects } from './objects.ts';
/** Framework-bound row sources and Session pagination command. */
export interface InspectorInjected {
    readonly hooks: {
        readonly rows: ObservableSnapshot<readonly InspectorRow[]>;
    };
    readonly keyedHooks: {
        readonly record: (key: string) => ObservableSnapshot<InspectorRecord | undefined> | undefined;
    };
    /** Load the preceding page through the existing Session reference. */
    readonly loadOlder: () => Promise<void>;
    /** @param key - Loaded row identity. @returns Current type without mounting a row subscription. */
    readonly typeOf: (key: string) => string | undefined;
}
/** Inputs of either Inspector conversation view. */
export type InspectorTableProps = Pick<ConvViewProps, 'useSession'> & InjectFace<InspectorInjected> & PropsLocale<'session-inspector'> & {
    readonly title: string;
    readonly flash: boolean;
    readonly showTime: boolean;
    readonly modeSelector?: ReactNode;
    readonly objects?: InspectorObjects;
    readonly navigation?: {
        readonly reveal: (target: InspectorChatTarget) => void;
        readonly target: (key: string) => InspectorChatTarget | undefined;
    };
    readonly pickedRow?: {
        readonly key: string;
    } | undefined;
    readonly notice?: string | undefined;
};
/**
 * Render a paged hierarchy with stable virtual row keys and live JSON details.
 * @param props - Framework hooks, pagination, locale, and the view's highlight policy.
 * @returns Virtual table and selected raw data.
 */
export declare function InspectorTable({ title, flash, showTime, modeSelector, objects, navigation, pickedRow, notice, useRows, useRecord, useSession, loadOlder, typeOf, t }: InspectorTableProps): import("react").JSX.Element;
//# sourceMappingURL=InspectorTable.d.ts.map