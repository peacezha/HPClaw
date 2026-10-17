/** Browser-local microphone preference shared by settings previews and dictation. */
import { type SnapshotStore } from '@deepseek-ai/dsh-client-store';
/** An empty id follows the system input; labels store browser names without localized placeholders. */
export interface MicrophoneDevice {
    readonly id: string;
    readonly label: string;
}
/**
 * Restore the browser preference independently of Host recognition settings.
 * @returns validated device selection, persisted through the shared Client store.
 */
export declare function createMicrophoneDeviceStore(): SnapshotStore<MicrophoneDevice>;
//# sourceMappingURL=microphone-device.d.ts.map