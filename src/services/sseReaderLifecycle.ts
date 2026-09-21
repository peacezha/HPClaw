export type SseReaderCloseReason = 'completed' | 'stale-run' | 'timeout' | 'error';

type MinimalReadableStreamReader = {
  cancel: () => Promise<unknown> | unknown;
  releaseLock: () => void;
};

export function shouldCancelSseReader(reason: SseReaderCloseReason): boolean {
  return reason !== 'completed';
}

export async function closeSseReader(
  reader: MinimalReadableStreamReader | null | undefined,
  reason: SseReaderCloseReason,
): Promise<void> {
  if (!reader) return;
  if (shouldCancelSseReader(reason)) {
    try { await reader.cancel(); } catch {}
  }
  try { reader.releaseLock(); } catch {}
}
