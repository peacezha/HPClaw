import type { InjectFace, PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { VoiceInputInjected } from './VoiceInput.tsx';
import { NS } from './locales.ts';
/** Render the selected input and preview its measured level without recording audio. */
export declare function MicrophonePicker({ useMicrophoneDevice, selectMicrophone, createRecording, t }: Pick<InjectFace<VoiceInputInjected>, 'useMicrophoneDevice' | 'selectMicrophone' | 'createRecording'> & PropsLocale<typeof NS>): import("react").JSX.Element;
//# sourceMappingURL=MicrophonePicker.d.ts.map