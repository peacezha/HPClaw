/** Restorable PDF viewing preferences; document objects and canvases remain component-local. */
import { type EngineStoreHandle } from '@deepseek-ai/dsh-client-store';
import type { TabId } from '@deepseek-ai/dsh-client-ui-dockkit';
import type { ZoomPreference } from '../zoom/types.ts';
/** One tab's last visible page and optional PDF zoom preference. */
export interface PdfView {
    readonly page: number;
    readonly zoom?: ZoomPreference;
}
/** Page state isolated by the owning tab record. */
export interface PdfState {
    byTab: Record<TabId, PdfView>;
}
type PdfActions = {
    page: (draft: PdfState, tabId: TabId, page: number) => void;
    zoom: (draft: PdfState, tabId: TabId, zoom: ZoomPreference) => void;
    forget: (draft: PdfState, tabId: TabId) => void;
};
/**
 * Declare the last visible page and zoom preference isolated by tab identity.
 * @returns a store declaration instantiated by the document slot for each Session.
 */
export declare function createPdfStore(): EngineStoreHandle<PdfState, PdfActions>;
/** Store declaration used by the PDF body registration. */
export type PdfStore = ReturnType<typeof createPdfStore>;
export {};
//# sourceMappingURL=store.d.ts.map