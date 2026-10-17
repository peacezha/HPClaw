/** Complete image bytes rendered in a shared zoom viewport. */
import { type ReactNode } from 'react';
import type { PropsLocale, PropsStore } from '@deepseek-ai/dsh-client-ui-slots';
import type { DocumentPreviewProps } from '../document/contract.ts';
import { type ZoomInjected, type ZoomStore } from '../zoom/store.ts';
declare const IMAGE_MEDIA_TYPES: {
    readonly png: "image/png";
    readonly jpg: "image/jpeg";
    readonly jpeg: "image/jpeg";
    readonly gif: "image/gif";
    readonly webp: "image/webp";
    readonly bmp: "image/bmp";
    readonly ico: "image/x-icon";
    readonly svg: "image/svg+xml";
};
type ImageMediaType = typeof IMAGE_MEDIA_TYPES[keyof typeof IMAGE_MEDIA_TYPES];
/** Standard document props plus the image renderer's dictionary. */
export type ImageBodyProps = DocumentPreviewProps & PropsLocale<'sidebarImage'> & PropsStore<ZoomStore> & ZoomInjected;
/**
 * Resolve a supported filename to the media type assigned to its Blob.
 * @param path - decoded workspace file path.
 * @returns the image media type, or undefined for an unregistered suffix.
 */
export declare function imageMediaType(path: string): ImageMediaType | undefined;
/**
 * Present complete image bytes with fit-width and fixed-scale viewing.
 * @param props - document bytes, resource identity, and locale.
 * @returns a rounded image fitted or scaled at its intrinsic aspect ratio.
 */
export declare function ImageBody(props: ImageBodyProps): ReactNode;
export {};
//# sourceMappingURL=ImageBody.d.ts.map