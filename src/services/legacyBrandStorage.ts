/** Copy settings only, not conversation text, commands or scientific evidence.
 * Keep legacy keys as rollback backups; explicit TRACE values always win. */
export function migrateLegacyBrowserStorage(storage: Storage): void {
  const keys = Array.from({ length: storage.length }, (_, index) => storage.key(index)).filter((key): key is string => Boolean(key));
  for (const key of keys) {
    if (!/^hpclaw(?:_|:|-)/i.test(key)) continue;
    const current = key.replace(/^hpclaw/i, 'trace');
    if (storage.getItem(current) !== null) continue;
    const value = storage.getItem(key);
    if (value !== null) storage.setItem(current, value);
  }
}
export function migrateLegacyPreferenceRecord(value: Record<string, string>): Record<string, string> {
  const result = { ...value };
  for (const [key, data] of Object.entries(value)) {
    if (!/^hpclaw(?:_|:|-)/i.test(key)) continue;
    const current = key.replace(/^hpclaw/i, 'trace');
    if (!(current in result)) result[current] = data;
  }
  return result;
}
if (typeof window !== 'undefined') {
  try { migrateLegacyBrowserStorage(window.localStorage); }
  catch { console.warn('[TRACE] Could not migrate browser preferences; original settings are preserved.'); }
}
