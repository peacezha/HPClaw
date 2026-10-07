import { Agent, fetch as undiciFetch } from 'undici';
import { resolveClusterAddress } from './network';

/** Validate on every actual TCP lookup, not just at URL parsing time (DNS rebinding). */
export function installPublicFetch() {
  const dispatcher = new Agent({
    connections: 8,
    connect: {
      lookup: ((hostname: string, options: any, callback: any) => {
        resolveClusterAddress(hostname, false).then(address => {
          const family = address.includes(':') ? 6 : 4;
          options?.all ? callback(null, [{ address, family }]) : callback(null, address, family);
        }, error => callback(error));
      }) as any,
    },
  });
  globalThis.fetch = (async (input: any, init?: any) => {
    const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url);
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error('公共网页端仅允许 HTTPS 外部 API / 文献服务');
    // IP literals can bypass the lookup callback; validate them before dispatch too.
    await resolveClusterAddress(url.hostname.replace(/^\[|\]$/g, ''), false);
    return undiciFetch(input, { ...init, dispatcher, redirect: 'error' });
  }) as typeof fetch;
  return dispatcher;
}
