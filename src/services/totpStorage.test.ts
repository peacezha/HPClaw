// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

async function loadStorage() {
  vi.resetModules();
  return import('./totpStorage');
}

describe('totpStorage remember-me credentials', () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(window, 'hpclawDesktop', {
      configurable: true,
      value: {},
    });
  });

  afterEach(() => {
    localStorage.clear();
    delete (window as any).hpclawDesktop;
  });

  it('remembers credentials in the desktop renderer when the user opts in', async () => {
    const storage = await loadStorage();

    storage.setRememberMe(true);
    storage.savePassword('secret');

    expect(storage.getRememberMe()).toBe(true);
    expect(storage.getSavedPassword()).toBe('secret');
  });
});
