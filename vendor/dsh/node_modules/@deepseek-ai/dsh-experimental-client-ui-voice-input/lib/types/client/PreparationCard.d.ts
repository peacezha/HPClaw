import type { InjectFace, PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { SpeechProviderView } from '@deepseek-ai/dsh-experimental-speech-to-text/types';
import type { VoiceInputInjected } from './VoiceInput.tsx';
import { NS } from './locales.ts';
/** One recognizer's resource readiness and explicit preparation controls. */
export type PreparationCardProps = Pick<InjectFace<VoiceInputInjected>, 'prepare' | 'cancelPreparation'> & PropsLocale<typeof NS> & {
    readonly provider: SpeechProviderView;
    readonly connected: boolean;
};
/** Render a collapsed current-step summary or all Host-owned preparation steps. */
export declare function PreparationCard({ provider, connected, prepare, cancelPreparation, t }: PreparationCardProps): import("react").JSX.Element;
/** Recognition preferences and preparation cards shared by plugin details and Settings. */
export declare function VoicePreparation({ useSpeechReadiness, ...props }: Pick<InjectFace<VoiceInputInjected>, 'useSpeechReadiness' | 'configure' | 'prepare' | 'cancelPreparation' | 'createRecording' | 'useMicrophoneDevice' | 'selectMicrophone'> & PropsLocale<typeof NS>): import("react").JSX.Element;
//# sourceMappingURL=PreparationCard.d.ts.map