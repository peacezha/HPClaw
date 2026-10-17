/** Browser-safe metadata for native file associations. */
/**
 * Validate file association metadata received from a native process or authenticated Host.
 * @param value - decoded application list.
 * @returns validated application metadata.
 * @throws Error for malformed entries or unsupported icon URLs.
 */
export function parseNativeFileApplications(value) {
    if (!Array.isArray(value))
        throw new Error('Invalid native application list');
    const applications = [];
    const entries = value;
    for (const entry of entries) {
        if (typeof entry !== 'object' || entry === null
            || !('id' in entry) || !('name' in entry) || !('default' in entry) || !('icon' in entry)
            || typeof entry.id !== 'string' || entry.id.length === 0
            || typeof entry.name !== 'string' || typeof entry.default !== 'boolean'
            || !(entry.icon === null || (typeof entry.icon === 'string' && /^data:image\/(?:png|svg\+xml);base64,[A-Za-z0-9+/=]+$/.test(entry.icon)))) {
            throw new Error('Invalid native application entry');
        }
        applications.push({ id: entry.id, name: entry.name, default: entry.default, icon: entry.icon });
    }
    return applications;
}
//# sourceMappingURL=types.js.map