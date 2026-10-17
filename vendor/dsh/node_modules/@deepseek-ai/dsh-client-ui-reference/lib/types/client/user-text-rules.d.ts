/** Forward file and folder recognition in original text, without Facts or discovery. */
import type { UserTextRule } from '@deepseek-ai/dsh-client-ui-conversation/client';
interface PathReferenceData {
    readonly path: string;
    readonly label: string;
}
declare module '@deepseek-ai/dsh-client-ui-conversation/client' {
    interface UserTextDataMap {
        file: PathReferenceData;
        folder: PathReferenceData;
    }
}
/** Return the nearest complete file reference using original whitespace boundaries. */
export declare const fileReferenceRule: UserTextRule<'file'>;
/** Return the nearest trailing-slash directory using the file-reference grammar. */
export declare const folderReferenceRule: UserTextRule<'folder'>;
export {};
//# sourceMappingURL=user-text-rules.d.ts.map