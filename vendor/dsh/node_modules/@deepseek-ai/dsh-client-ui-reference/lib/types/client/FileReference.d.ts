import type { UserTextNodeProps } from '@deepseek-ai/dsh-client-ui-conversation/client';
import type { InjectFace, PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { NS } from './locales.ts';
/** Session-authorized synchronous navigation; document reading belongs to the preview host. */
export interface FileReferenceInjected {
    /**
     * Open or reveal a file in the current Sidebar using the originating Session's authority.
     * @param path - decoded path from the reference.
     * @throws if navigation fails; the reference keeps a local retry/close dialog.
     */
    readonly openFile: (path: string) => void;
}
type FileReferenceProps = UserTextNodeProps<'file'> & InjectFace<FileReferenceInjected> & PropsLocale<typeof NS>;
/**
 * Render a file chip and contain synchronous navigation failures without hiding the reference.
 * @param props - JSON node, interaction policy, Session-authorized navigation, and locale seat.
 * @returns an inline chip and, after a navigation failure, its body-portaled dialog.
 */
export declare function FileReference({ node, raw, interactive, openFile, t }: FileReferenceProps): import("react").JSX.Element;
/**
 * Render a directory as a label, even when the containing text permits file navigation.
 * @param props - resolved directory data and the original reference spelling.
 * @returns an inline non-interactive chip.
 */
export declare function FolderReference({ node, raw }: UserTextNodeProps<'folder'>): import("react").JSX.Element;
export {};
//# sourceMappingURL=FileReference.d.ts.map