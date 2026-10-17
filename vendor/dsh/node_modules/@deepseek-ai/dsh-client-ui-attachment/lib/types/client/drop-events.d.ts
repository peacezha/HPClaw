/** Document drag-and-drop listeners owned by one mounted attachment view. */
import type { ComposerAttachmentsProps } from '@deepseek-ai/dsh-client-ui-conversation/client';
/**
 * Install one attachment view's file-drop listeners.
 * @param canAcceptDrop - whether this view accepts the dropped files.
 * @param onAddFiles - attachment intake callback.
 * @param dragDepth - the view's retained nested-drag counter.
 * @param setDragActive - publish whether a file drag is active.
 * @returns cleanup for exactly these listeners.
 */
export declare function installDocumentDropEvents(canAcceptDrop: ComposerAttachmentsProps['canAcceptDrop'], onAddFiles: ComposerAttachmentsProps['onAddFiles'], dragDepth: {
    current: number;
}, setDragActive: (active: boolean) => void): () => void;
//# sourceMappingURL=drop-events.d.ts.map