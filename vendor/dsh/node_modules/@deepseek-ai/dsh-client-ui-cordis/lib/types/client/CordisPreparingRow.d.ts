/** Argument-free Cordis tool prefix shared by its three card families. */
import type { ReactNode } from 'react';
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { ToolCallViewProps } from '@deepseek-ai/dsh-client-ui-tool/client';
type CordisPreparingRowProps = Pick<ToolCallViewProps, 'toolName'> & PropsLocale<'cordis'> & {
    readonly icon: ReactNode;
    readonly title: string;
    readonly className?: string | undefined;
    readonly rowClassName?: string | undefined;
    readonly titleClassName?: string | undefined;
};
/**
 * Render a Cordis-owned prefix without disclosure.
 * @param props - Cordis prefix, styling, and locale.
 * @returns the preparation row.
 */
export declare function CordisPreparingRow({ toolName, t, icon, title, className, rowClassName, titleClassName, }: CordisPreparingRowProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=CordisPreparingRow.d.ts.map