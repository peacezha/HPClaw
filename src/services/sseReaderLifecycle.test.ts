import { describe, expect, it, vi } from 'vitest';

import { closeSseReader, shouldCancelSseReader } from './sseReaderLifecycle';

describe('SSE reader lifecycle', () => {
  it('does not cancel a reader that reached the normal end of the stream', async () => {
    const reader = {
      cancel: vi.fn(),
      releaseLock: vi.fn(),
    };

    await closeSseReader(reader, 'completed');

    expect(shouldCancelSseReader('completed')).toBe(false);
    expect(reader.cancel).not.toHaveBeenCalled();
    expect(reader.releaseLock).toHaveBeenCalledOnce();
  });

  it('cancels a reader when the stream exits early', async () => {
    const reader = {
      cancel: vi.fn(),
      releaseLock: vi.fn(),
    };

    await closeSseReader(reader, 'timeout');

    expect(shouldCancelSseReader('timeout')).toBe(true);
    expect(reader.cancel).toHaveBeenCalledOnce();
    expect(reader.releaseLock).toHaveBeenCalledOnce();
  });
});
