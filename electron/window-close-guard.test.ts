import { describe, expect, it, vi } from 'vitest';
import { createWindowCloseGuard } from './window-close-guard.cjs';

describe('window close guard', () => {
  it('blocks the native close synchronously until the async confirmation allows it', async () => {
    let decide!: (value: boolean) => void;
    const confirmClose = vi.fn(() => new Promise<boolean>(resolve => { decide = resolve; }));
    const window = { close: vi.fn() };
    const guard = createWindowCloseGuard({ confirmClose, getWindow: () => window });
    const event = { preventDefault: vi.fn() };

    guard(event);

    expect(event.preventDefault).toHaveBeenCalledOnce();
    expect(window.close).not.toHaveBeenCalled();

    decide(true);
    await vi.waitFor(() => expect(window.close).toHaveBeenCalledOnce());

    const approvedCloseEvent = { preventDefault: vi.fn() };
    guard(approvedCloseEvent);
    expect(approvedCloseEvent.preventDefault).not.toHaveBeenCalled();
  });

  it('keeps the window open when the user cancels', async () => {
    const confirmClose = vi.fn().mockResolvedValue(false);
    const window = { close: vi.fn() };
    const guard = createWindowCloseGuard({ confirmClose, getWindow: () => window });
    const event = { preventDefault: vi.fn() };

    guard(event);

    expect(event.preventDefault).toHaveBeenCalledOnce();
    await vi.waitFor(() => expect(confirmClose).toHaveBeenCalledOnce());
    expect(window.close).not.toHaveBeenCalled();
  });
});
