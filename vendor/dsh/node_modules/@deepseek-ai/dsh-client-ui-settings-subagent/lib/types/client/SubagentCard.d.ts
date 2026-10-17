/** One settings card for Subagent delegation limits and model authorization. */
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import { type SubagentCardFace } from './subagent-card-controller.ts';
/** Framework-derived props for the shared Subagent settings card. */
export type SubagentCardProps = PropsRuntime<'plugins.item'> & PropsLocale<'settings.subagent'> & InjectFace<SubagentCardFace>;
/**
 * Render the available Subagent settings with one configuration page and save footer.
 * @param props - Locale, both form snapshots, and their shared actions.
 * @returns The summary or the available settings form.
 */
export declare function SubagentCard(props: SubagentCardProps): string | import("react").JSX.Element;
//# sourceMappingURL=SubagentCard.d.ts.map