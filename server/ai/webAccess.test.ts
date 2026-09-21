import { describe, expect, it } from 'vitest';
import {
  assertPublicHttpUrl,
  htmlToReadableText,
  isPrivateNetworkAddress,
  parseBingSearchResults,
  parseWebSearchResults,
} from './webAccess';

describe('safe web access', () => {
  it('blocks local and private literal addresses', async () => {
    for (const value of ['127.0.0.1', '10.0.0.1', '172.16.1.2', '192.168.1.2', '::1', 'fd00::1']) {
      expect(isPrivateNetworkAddress(value)).toBe(true);
    }
    await expect(assertPublicHttpUrl('http://127.0.0.1/secret')).rejects.toThrow('禁止');
    await expect(assertPublicHttpUrl('file:///etc/passwd')).rejects.toThrow('HTTP');
  });

  it('removes active HTML and extracts readable text', () => {
    expect(htmlToReadableText('<h1>Title</h1><script>alert(1)</script><p>Hello &amp; world</p>')).toBe('Title\n Hello & world');
  });

  it('parses and unwraps search result links', () => {
    const html = '<a class="result__a" href="//duckduckgo.com/l/?uddg=https%3A%2F%2Fexample.com%2Fa">Example &amp; result</a>';
    expect(parseWebSearchResults(html)).toEqual([{ title: 'Example & result', url: 'https://example.com/a' }]);
    expect(parseBingSearchResults('<h2><a href="https://example.org/b">Bing <strong>result</strong></a></h2>'))
      .toEqual([{ title: 'Bing result', url: 'https://example.org/b' }]);
  });
});
