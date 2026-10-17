import type { ReactNode } from 'react';
import type { InjectFace, PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { ObservableSnapshot } from '@deepseek-ai/dsh-client-store';
import type { DocumentPreviewProps } from '../document/contract.ts';
import type { ReadHtmlRelated } from './read-relative.ts';
/** Standard document inputs plus this renderer's dictionary. */
export type HtmlBodyProps = DocumentPreviewProps & PropsLocale<'documentHtml'> & InjectFace<HtmlBodyInjected>;
/** Related-file reader and accepted preview mode supplied by the plugin. */
export interface HtmlBodyInjected {
    hooks: {
        interactivePreview: ObservableSnapshot<boolean>;
    };
    /** Ordinary Remote callback bound by this renderer's Slot inject. */
    readonly readRelated: ReadHtmlRelated;
}
/**
 * Render complete HTML with the standard file and tab hooks.
 * @param props - document bytes, hooks, related-file reader and locale.
 * @returns an isolated HTML document, or nothing for text delivery.
 */
export declare function HtmlBody({ content, resourceAddress, readRelated, useTabInfo, useInteractivePreview, addResource, setResources, t, }: HtmlBodyProps): ReactNode;
//# sourceMappingURL=HtmlBody.d.ts.map