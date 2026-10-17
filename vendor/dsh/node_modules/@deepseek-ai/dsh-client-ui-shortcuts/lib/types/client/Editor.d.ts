import type { ShortcutCatalogEntry } from '@deepseek-ai/dsh-client-shortcuts/client';
import type { InjectFace, PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { ReferenceInjected } from './Reference.tsx';
type EditorInjected = ReferenceInjected;
type EditorProps = InjectFace<EditorInjected> & PropsLocale<'shortcuts'> & {
    target: ShortcutCatalogEntry;
    onClose(this: void): void;
    onSaved(this: void): void;
    onError(this: void, message: string): void;
};
/**
 * Save a released physical combination against the configuration the user reviewed.
 * @param props - command, accepted snapshots, and storage/feedback callbacks.
 * @returns inline command controls; failures retain the draft and allow another recording.
 */
export declare function ShortcutEditor({ target, onClose, onSaved, onError, useCatalog, useConfig, useFixedCatalog, edit, recording, describeBinding, runtime, platform, t }: EditorProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=Editor.d.ts.map