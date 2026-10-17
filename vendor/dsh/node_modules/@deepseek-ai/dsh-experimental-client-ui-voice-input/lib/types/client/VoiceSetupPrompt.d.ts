import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { VoiceInputInjected } from './VoiceInput.tsx';
import type { NS } from './locales.ts';
/** Registration shares for the bundle's activation guidance. */
export type VoiceSetupPromptProps = PropsRuntime<'plugins.bundle.activation'> & PropsLocale<typeof NS> & Pick<InjectFace<VoiceInputInjected>, 'useSpeechReadiness'>;
/**
 * Offer navigation to installation without starting a download.
 * @param props - activation navigation and the shared Host readiness observer.
 * @returns the shared modal only when the selected local provider needs preparation.
 */
export declare function VoiceSetupPrompt({ useSpeechReadiness, onDismiss, onOpenDetails, t }: VoiceSetupPromptProps): import("react").JSX.Element;
//# sourceMappingURL=VoiceSetupPrompt.d.ts.map