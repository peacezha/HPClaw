import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
type PlanPreviewProps = PropsRuntime<'sidebar.right.pane.tab'> & PropsLocale<'plan'>;
/**
 * Render the submitted plan with its complete Markdown.
 * @param props - Framework-bound tab identity, resource, and copy.
 * @returns the plan document or a localized loading/failure state.
 */
export declare function PlanPreview({ useTabInfo, useResource, t }: PlanPreviewProps): import("react").JSX.Element;
/**
 * Display a plain file icon and the heading in its tab after resource recovery.
 * @param props - Framework-bound tab identity and resource reader.
 * @returns a decorative file icon followed by the recovered title or initial localized label.
 */
export declare function PlanTitle({ useTabInfo, useResource }: PropsRuntime<'sidebar.right.pane.tab.title'>): import("react").JSX.Element;
export {};
//# sourceMappingURL=PlanPreview.d.ts.map