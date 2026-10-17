export const APP_NAME = 'TRACE';
export const GITHUB_REPOSITORY = 'peacezha/TRACE';
export const GITHUB_URL = 'https://github.com/' + GITHUB_REPOSITORY;

export function currentProvider(value: string | undefined): string | undefined {
  return value === 'hpclaw' ? 'trace' : value === 'hpclaw-native' ? 'trace-native' : value;
}

/** Display metadata only. Do not rewrite historical evidence or executable paths. */
export function currentProductText(value: string): string {
  // Older customized workflow provenance may omit display fields entirely.
  if (typeof value !== 'string') return value;
  return value.replace(/https?:\/\/github\.com\/peacezha\/HPClaw(?=[/.?#]|$)/gi, GITHUB_URL)
    .replace(/(?<![\w./\\-])HPClaw(?![\w./\\-])/gi, APP_NAME)
    .replace(/\ban TRACE\b/g, 'a TRACE');
}
