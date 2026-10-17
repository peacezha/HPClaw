/** The shell executor's settings page: the limits every command the agent runs is bound by. */
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { ShellCardFace } from './shell-card-controller.ts';
/** Props the renderer binds for the shell page. */
export type ShellCardProps = PropsRuntime<'plugins.item'> & PropsLocale<'settings.shell'> & InjectFace<ShellCardFace>;
/**
 * Render the shell executor's one-liner or its settings form, as the Plugins page asks.
 * @param props - the view asked for, locale copy, the form snapshot, and its actions.
 * @returns the one-liner, or the form.
 */
export declare function ShellCard(props: ShellCardProps): string | import("react").JSX.Element;
//# sourceMappingURL=ShellCard.d.ts.map