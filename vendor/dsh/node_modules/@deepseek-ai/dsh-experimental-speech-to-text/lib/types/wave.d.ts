/** Validate browser PCM WAV headers before retaining or forwarding audio. */
/**
 * Read a canonical 16 kHz mono PCM16 WAV recording, rejecting inconsistent lengths.
 * @param audio - decoded wire bytes.
 * @param maxDurationSeconds - maximum admitted recording duration.
 * @returns complete recording duration in seconds.
 */
export declare function validateWave(audio: Uint8Array, maxDurationSeconds: number): number;
//# sourceMappingURL=wave.d.ts.map