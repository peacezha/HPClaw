import { expect, it } from 'vitest';
import { migrateLegacyEnvironment } from './legacyBrandEnvironment';
it('accepts legacy deployment settings with TRACE taking precedence and no changed secret values', () => {
  const env = { HPCLAW_ENCRYPTION_KEY: 'a'.repeat(64), HPCLAW_HOST: '127.0.0.1', TRACE_HOST: '0.0.0.0' };
  migrateLegacyEnvironment(env);
  expect(env).toMatchObject({ TRACE_ENCRYPTION_KEY: 'a'.repeat(64), TRACE_HOST: '0.0.0.0' });
});
