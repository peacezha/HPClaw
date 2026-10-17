/** Accept old deployment settings without exposing or writing the old namespace. */
export function migrateLegacyEnvironment(env: NodeJS.ProcessEnv = process.env): void {
  for (const [key, value] of Object.entries(env)) {
    if (key.startsWith('HPCLAW_')) {
      const current = 'TRACE_' + key.slice(7);
      if (env[current] === undefined) env[current] = value;
    }
  }
}
migrateLegacyEnvironment();
