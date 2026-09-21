import { describe, expect, it } from 'vitest';

import configFactory from '../vite.config';

describe('vite development server config', () => {
  it('disables HMR for remote Linux deployment to avoid browser reload aborting AI streams', () => {
    const config = typeof configFactory === 'function' ? configFactory({} as any) : configFactory;

    expect(config.server?.hmr).toBe(false);
  });
});
