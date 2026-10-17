/** Account Service Definition shared by platform, API, and model consumers. */
import { Service } from '@deepseek-ai/cordis';
export { isRunningAccountTask, installAccountTaskCancellation } from "./account-tasks.js";
/** Account operations; only Host consumers can obtain a request credential. */
export class DeepSeekAccount extends Service {
    /** @param ctx - context owning this account implementation. */
    constructor(ctx) { super(ctx, 'deepseekAccount'); }
}
export default DeepSeekAccount;
/** Merge Cookie header pairs by case-sensitive name, retaining unrelated cookies.
 * @param base - existing request cookies.
 * @param override - deployment cookies whose values take precedence.
 * @returns one Cookie header with at most one pair per name.
 */
export function mergePlatformCookies(base, override) {
    const cookies = new Map();
    for (const header of [base, override]) {
        for (const pair of header.split(';')) {
            const separator = pair.indexOf('=');
            if (separator < 1)
                continue;
            cookies.set(pair.slice(0, separator).trim(), pair.slice(separator + 1).trim());
        }
    }
    return [...cookies].map(([name, value]) => `${name}=${value}`).join('; ');
}
/**
 * Identify native desktop API requests; null leaves non-desktop requests unchanged.
 * @param platform - Operating system supplied by the desktop composition.
 * @returns Platform request headers shared by account and update-policy clients.
 */
export function desktopClientHeaders(platform) {
    if (platform === null)
        return {};
    return { 'x-client-platform': platform === 'win32' ? 'desktop-win' : 'desktop-mac' };
}
/**
 * Build the Platform client identity headers for one call.
 * @param platform - Operating system supplied by the desktop composition; null identifies the client as web.
 * @param client - identity of the requesting UI for this call.
 * @returns the five client headers; the bundle ID is intentionally empty.
 */
export function platformClientHeaders(platform, client) {
    return {
        'x-client-bundle-id': '',
        'x-client-platform': 'web',
        ...desktopClientHeaders(platform),
        'x-client-version': client.version,
        'x-client-locale': platformWireLocale(client.locale),
        'x-client-timezone-offset': String(client.timezoneOffsetSeconds),
    };
}
/**
 * Reduce a caller's UI language to the region-tagged Platform locale.
 * Shares one normalization with the header and with request body locale fields.
 * @param locale - active UI language such as `zh-CN`, `zh_TW`, or `en-US`.
 * @returns the region-tagged Platform locale for that language, `zh_CN` or `en_US`.
 */
export function platformWireLocale(locale) {
    return locale.toLowerCase().split(/[-_]/)[0] === 'zh' ? 'zh_CN' : 'en_US';
}
//# sourceMappingURL=index.js.map