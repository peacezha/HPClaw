import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { NS } from './locales.ts';
type VoiceSetupDialogProps = PropsLocale<typeof NS> & Pick<PropsRuntime<'plugins.bundle.activation'>, 'onDismiss' | 'onOpenDetails'> & {
    open: boolean;
    needsInstallation: boolean;
};
/**
 * Guide activation or microphone clicks to the existing plugin details.
 * @param props - visibility, installation need and navigation callbacks.
 * @returns a dismissible prompt that never starts preparation or recording.
 */
export declare function VoiceSetupDialog({ open, needsInstallation, onDismiss, onOpenDetails, t }: VoiceSetupDialogProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=VoiceSetupDialog.d.ts.map