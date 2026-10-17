// One-way input compatibility. New child processes and docs use TRACE_*.
for (const [key, value] of Object.entries(process.env)) {
  if (key.startsWith('HPCLAW_')) {
    const current = 'TRACE_' + key.slice(7);
    if (process.env[current] === undefined) process.env[current] = value;
  }
}
