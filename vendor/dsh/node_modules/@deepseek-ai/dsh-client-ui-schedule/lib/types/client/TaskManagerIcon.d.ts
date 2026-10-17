import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
/**
 * Render the clock glyph at the size the sidebar asks for; the sidebar owns
 * its accessible navigation label. The glyph is the row's direct icon child,
 * as on every other panel row: an inline wrapper makes it the baseline of a
 * line box inside the row's glyph slot, which lifts it above the label.
 * @param props - the sidebar's icon share: the requested edge and whether the panel is selected.
 * @returns decorative clock icon.
 */
export declare function TaskManagerIcon({ size }: PropsRuntime<'sidebar.panellist'>): import("react").JSX.Element;
//# sourceMappingURL=TaskManagerIcon.d.ts.map