/** PDF page presentation; binary content and tab information come from the document owner. */
import { type ComponentType, type ReactNode } from 'react';
import type { PropsLocale, PropsStore } from '@deepseek-ai/dsh-client-ui-slots';
import type { TabId } from '@deepseek-ai/dsh-client-ui-dockkit';
import type { DocumentPreviewProps } from '../document/contract.ts';
import type { PdfStore } from './store.ts';
import type { ZoomViewportProps } from '../zoom/ZoomViewport.tsx';
/** A record's viewing preferences survive body unmounts and leave with the tab. */
export interface PdfBodyInjected {
    /**
     * Retain viewing preferences until the tab record ends.
     * @param tabId - owning tab.
     * @param signal - tab-record lifetime, not body visibility.
     */
    readonly retainTab: (tabId: TabId, signal: AbortSignal) => void;
    /** Main-bundle viewport reused by the lazy PDF body. */
    readonly ZoomViewport: ComponentType<ZoomViewportProps>;
    /** Main-bundle class implementing fit-width and fixed-size surfaces. */
    readonly zoomSurfaceClass: string;
}
/** Standard document props plus the PDF entry's locale, viewing store, and lifetime callback. */
export type PdfBodyProps = DocumentPreviewProps & PropsLocale<'sidebarPdf'> & PropsStore<PdfStore> & PdfBodyInjected;
/**
 * Present a PDF with tab-local viewing preferences and component-owned rendering resources.
 * @param props - complete bytes, framework-owned tab/store/locale seats, and main-bundle loading content.
 * @returns the PDF reader.
 */
export declare function PdfBody(props: PdfBodyProps & {
    readonly loading: ReactNode;
}): ReactNode;
//# sourceMappingURL=pdf.d.ts.map