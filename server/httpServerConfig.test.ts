import http from 'node:http';
import { describe, expect, it } from 'vitest';

import { configureHttpServerForSse } from './httpServerConfig';

describe('configureHttpServerForSse', () => {
  it('keeps Linux SSE and follow-up POST requests stable across idle gaps', () => {
    const server = http.createServer();

    configureHttpServerForSse(server);

    expect(server.timeout).toBe(0);
    expect(server.requestTimeout).toBe(0);
    expect(server.keepAliveTimeout).toBe(0);
    expect(server.headersTimeout).toBe(30_000);
  });
});
