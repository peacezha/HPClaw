// @vitest-environment node
import { expect, it } from 'vitest';
import { installPublicFetch } from './egress';
it('blocks HTTP, metadata, private API addresses and URL credentials before outbound requests', async () => {
  const original = globalThis.fetch; const dispatcher = installPublicFetch();
  try {
    for (const url of ['http://example.org', 'https://127.0.0.1', 'https://169.254.169.254', 'https://10.0.0.2', 'https://user:password@example.org', 'https://[::1]']) {
      await expect(fetch(url)).rejects.toThrow();
    }
  } finally { globalThis.fetch = original; await dispatcher.close(); }
});
