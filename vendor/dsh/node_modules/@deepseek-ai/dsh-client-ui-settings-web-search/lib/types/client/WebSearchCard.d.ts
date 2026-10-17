/**
 * The web-search provider's settings page: its endpoint, its per-request
 * search budget, and the key — which is written through the credentials
 * domain, never into the settings section, so the literal never rides a response.
 */
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { WebSearchCardFace } from './web-search-card-controller.ts';
/** Props the renderer binds for the web-search page. */
export type WebSearchCardProps = PropsRuntime<'plugins.item'> & PropsLocale<'settings.webSearch'> & InjectFace<WebSearchCardFace>;
/**
 * Render the web-search provider's one-liner or its settings form, as the Plugins page asks.
 * @param props - the view asked for, locale copy, the form snapshot, and its actions.
 * @returns the one-liner, or the form.
 */
export declare function WebSearchCard(props: WebSearchCardProps): string | import("react").JSX.Element;
//# sourceMappingURL=WebSearchCard.d.ts.map