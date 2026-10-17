import type { ObservableSnapshot } from '@deepseek-ai/dsh-client-store';
import type { ConfigFormSnapshot } from '@deepseek-ai/dsh-client-ui-settings/client';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { UploadMutation, UploadSettings } from './upload-preference.ts';
/** Accepted settings and mutation callbacks supplied by the plugin. */
export interface UploadInjected {
    hooks: {
        upload: ObservableSnapshot<ConfigFormSnapshot<UploadSettings>>;
        mutation: ObservableSnapshot<UploadMutation>;
    };
    setEnabled(enabled: boolean): Promise<void>;
    dismiss(): void;
}
type Face = InjectFace<UploadInjected> & PropsLocale<'settings.sessionLog'>;
/**
 * Render the accepted API upload state.
 * @param props - settings hooks, writer and localized copy.
 * @returns the bottom preference row.
 */
export declare function UploadRow({ useUpload, useMutation, setEnabled, t }: PropsRuntime<'settings.general.item'> & Face): import("react").JSX.Element;
/**
 * Keep the save outcome visible after settings closes.
 * @param props - mutation hook, dismissal and localized copy.
 * @returns the current toast, or nothing.
 */
export declare function UploadToast({ useMutation, dismiss, t }: PropsRuntime<'shell.overlay'> & Face): import("react").JSX.Element | null;
export {};
//# sourceMappingURL=UploadRow.d.ts.map