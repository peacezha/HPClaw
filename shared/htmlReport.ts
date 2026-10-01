export interface HtmlReportOptions {
  assetBaseUrl?: string;
  allowRemoteNetwork?: boolean;
}

export function htmlReportCsp(allowScripts: boolean, options: HtmlReportOptions = {}): string {
  // Restrict requests to this report's proxy subtree, not every localhost API.
  const asset = options.assetBaseUrl ? ` ${options.assetBaseUrl}` : '';
  const network = options.allowRemoteNetwork ? ' https: http:' : '';
  return [
    "default-src 'none'", `img-src data: blob:${asset}${network}`,
    `style-src 'unsafe-inline' data:${asset}${network}`, `font-src data:${asset}${network}`,
    `media-src data: blob:${asset}${network}`,
    asset || network ? `connect-src${asset}${network}` : "connect-src 'none'",
    "frame-src 'none'", "object-src 'none'", "form-action 'none'",
    asset ? `base-uri${asset}` : "base-uri 'none'",
    allowScripts ? `script-src 'unsafe-inline' blob:${asset}${network}` : "script-src 'none'",
  ].join('; ');
}

export function htmlReportHead(allowScripts: boolean, options: HtmlReportOptions = {}): string {
  const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  return `<meta http-equiv="Content-Security-Policy" content="${escape(htmlReportCsp(allowScripts, options))}"><meta name="referrer" content="no-referrer">`
    + (options.assetBaseUrl ? `<base href="${escape(options.assetBaseUrl)}">` : '')
    + '<style>a[href]{pointer-events:none;cursor:not-allowed}</style>';
}

export function injectHtmlReportHead(html: string, head: string): string {
  if (/<head(?:\s[^>]*)?>/i.test(html)) return html.replace(/<head(?:\s[^>]*)?>/i, match => `${match}${head}`);
  if (/<html(?:\s[^>]*)?>/i.test(html)) return html.replace(/<html(?:\s[^>]*)?>/i, match => `${match}<head>${head}</head>`);
  return `<!doctype html><html><head>${head}</head><body>${html}`;
}
