import { Transform, type Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { StringDecoder } from 'node:string_decoder';
import type { Response } from 'express';
import { htmlReportCsp, htmlReportHead, injectHtmlReportHead, type HtmlReportOptions } from '../../shared/htmlReport';

/** Buffer just the head, then forward bytes with backpressure. No document-size cap. */
export async function streamHtmlReport(source: Readable, res: Response, allowScripts: boolean, options: HtmlReportOptions): Promise<void> {
  let prefix = '';
  let injected = false;
  const decoder = new StringDecoder('utf8');
  const inject = () => { injected = true; return injectHtmlReportHead(prefix, htmlReportHead(allowScripts, options)); };
  const transform = new Transform({
    transform(chunk, _encoding, callback) {
      if (injected) { callback(null, decoder.write(chunk)); return; }
      prefix += decoder.write(chunk);
      if (/<head(?:\s[^>]*)?>/i.test(prefix) || prefix.length >= 32 * 1024) {
        callback(null, inject());
      } else callback();
    },
    flush(callback) {
      if (!injected) { prefix += decoder.end(); this.push(inject()); }
      else this.push(decoder.end());
      callback();
    },
  });
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Content-Security-Policy', `${htmlReportCsp(allowScripts, options)}; sandbox${allowScripts ? ' allow-scripts' : ''}`);
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  // pipeline destroys the SSH read stream if the user closes the preview.
  await pipeline(source, transform, res);
}

export function contentTypeForReportAsset(filePath: string): string {
  const extension = filePath.toLowerCase().split('.').pop() || '';
  const types: Record<string, string> = {
    css: 'text/css', js: 'text/javascript', mjs: 'text/javascript', json: 'application/json',
    html: 'text/html', htm: 'text/html', xhtml: 'text/html', svg: 'image/svg+xml',
    png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp',
    woff: 'font/woff', woff2: 'font/woff2', ttf: 'font/ttf', otf: 'font/otf',
    csv: 'text/csv', tsv: 'text/tab-separated-values', txt: 'text/plain', pdf: 'application/pdf',
    mp4: 'video/mp4', webm: 'video/webm', mp3: 'audio/mpeg', wav: 'audio/wav',
  };
  return types[extension] || 'application/octet-stream';
}
