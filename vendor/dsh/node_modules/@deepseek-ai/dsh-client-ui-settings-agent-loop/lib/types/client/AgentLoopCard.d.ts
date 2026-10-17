/** The agent loop's settings page: how many tool calls one step may run at once. */
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { AgentLoopCardFace } from './agent-loop-card-controller.ts';
/** Props the renderer binds for the agent-loop page. */
export type AgentLoopCardProps = PropsRuntime<'plugins.item'> & PropsLocale<'settings.agentLoop'> & InjectFace<AgentLoopCardFace>;
/**
 * Render the agent loop's one-liner or its settings form, as the Plugins page asks.
 * @param props - the view asked for, locale copy, the form snapshot, and its actions.
 * @returns the one-liner, or the form.
 */
export declare function AgentLoopCard(props: AgentLoopCardProps): string | import("react").JSX.Element;
//# sourceMappingURL=AgentLoopCard.d.ts.map