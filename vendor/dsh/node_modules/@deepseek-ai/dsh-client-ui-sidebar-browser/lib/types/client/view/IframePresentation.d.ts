/** Iframe DOM and revision-tagged load observations. */
import type { BrowserTarget } from '../browser/url.ts';
import type { BrowserPresentation } from './BrowserPresentation.ts';
/** Fixed iframe policy; top navigation and downloads are not granted directly. */
export declare const WEB_BROWSER_SANDBOX = "allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox";
interface IframeDocument {
    readonly target: BrowserTarget;
    readonly revision: number;
    readonly sandboxed: boolean;
}
/** Reports only what an iframe can observe without inspecting cross-origin content. */
export interface IframePresentationEvents {
    readonly loaded: (revision: number) => void;
    readonly failed: (revision: number) => void;
    readonly remounted: () => void;
}
/** Owns the iframe element; navigation and history remain in IframeImpl. */
export declare class IframePresentation implements BrowserPresentation {
    private readonly events;
    private host;
    private element;
    private document;
    private rendered;
    /** @param events - provider-owned load and remount callbacks. */
    constructor(events: IframePresentationEvents);
    /** @param viewportId - mounted placeholder. @returns removes only the iframe presentation. */
    mount(viewportId: string): () => void;
    /**
     * Retain the prepared document and render it when a container is mounted.
     * @param value - prepared document and event generation.
     */
    show(value: IframeDocument): void;
    /** Remove the owned DOM and retained presentation data. */
    dispose(): void;
    private render;
}
export {};
//# sourceMappingURL=IframePresentation.d.ts.map