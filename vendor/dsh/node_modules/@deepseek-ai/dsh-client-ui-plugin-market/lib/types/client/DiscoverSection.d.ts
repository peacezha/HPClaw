/** Discover: search one plugin market index, read an entry's page, and install a version. */
import { type ReactNode } from 'react';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { DiscoverFace } from './market-store.ts';
/** Props of the Discover tab. */
export type DiscoverSectionProps = PropsRuntime<'plugins.tab'> & PropsLocale<'pluginMarket'> & InjectFace<DiscoverFace>;
/** Render the Discover tab of the Plugins page. */
export declare function DiscoverSection(props: DiscoverSectionProps): ReactNode;
//# sourceMappingURL=DiscoverSection.d.ts.map