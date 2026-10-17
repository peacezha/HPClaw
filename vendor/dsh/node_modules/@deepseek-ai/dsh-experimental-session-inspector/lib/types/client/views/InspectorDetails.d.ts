/** Locally resizable raw-data panel; pointer capture owns the drag lifetime. */
import { type ReactNode } from 'react';
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
/** Raw text and owner callbacks for one Inspector's detail panel. */
export type InspectorDetailsProps = PropsLocale<'session-inspector'> & {
    readonly text: string;
    readonly failed?: boolean;
    readonly children?: ReactNode;
    readonly close: () => void;
};
/**
 * Resize the raw-data area from its upper edge while keeping the table visible.
 * @param props - Complete raw text, localized labels, and close callback.
 * @returns Detail text with a pointer- and keyboard-operated horizontal separator.
 */
export declare function InspectorDetails({ text, failed, children, close, t }: InspectorDetailsProps): import("react").JSX.Element;
//# sourceMappingURL=InspectorDetails.d.ts.map