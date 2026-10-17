import type { HostObservable, InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { TranscriptionRequest } from '@deepseek-ai/dsh-experimental-api-speech-to-text/types';
import type { SpeechPreparationOptions, SpeechProviderId, SpeechSelectionPatch, Transcript } from '@deepseek-ai/dsh-experimental-speech-to-text/types';
import type { RemoteResult } from '@deepseek-ai/dsh-typert-protocol';
import { type Recording } from './audio.ts';
import type { MicrophoneDevice } from './microphone-device.ts';
import type { SpeechReadiness } from './readiness.ts';
import { NS } from './locales.ts';
/** Host calls injected without exposing a Cordis Context to React. */
export interface VoiceInputActions {
    /** Open the voice bundle details without starting preparation. */
    openSettings: () => void;
    /** @returns one microphone operation owned by the plugin lifecycle. */
    createRecording: () => Recording;
    /** Remember the browser microphone used by previews and subsequent recordings. */
    selectMicrophone: (device: MicrophoneDevice) => void;
    transcribe: (request: TranscriptionRequest, signal: AbortSignal) => Promise<RemoteResult<Transcript>>;
    prepare: (providerId: SpeechProviderId, options?: SpeechPreparationOptions) => Promise<void>;
    cancelPreparation: (providerId: SpeechProviderId) => Promise<void>;
    configure: (patch: SpeechSelectionPatch) => Promise<void>;
}
/** Entry-injected Host readiness and microphone operations. */
export interface VoiceInputInjected extends VoiceInputActions {
    hooks: {
        speechReadiness: HostObservable<SpeechReadiness>;
        microphoneDevice: HostObservable<MicrophoneDevice>;
    };
}
/** Composer-owned expansion and draft actions; preferences stay in plugin settings. */
export type VoiceInputProps = Pick<PropsRuntime<'conversation.input.activity'>, 'sessionId' | 'inputActions' | 'locked' | 'onActiveChange'> & PropsLocale<typeof NS> & InjectFace<VoiceInputInjected>;
/** Render a compact microphone or an expanded capture, transcription, or retry row. */
export declare function VoiceInput({ sessionId, inputActions, locked, onActiveChange, createRecording, transcribe, openSettings, useSpeechReadiness, t }: VoiceInputProps): import("react").JSX.Element;
//# sourceMappingURL=VoiceInput.d.ts.map