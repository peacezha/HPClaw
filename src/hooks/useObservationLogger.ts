import { useCallback } from 'react';

type ObservationType = 'command' | 'directory' | 'module' | 'jobscript';

export function useObservationLogger() {
  const log = useCallback(async (type: ObservationType, data: string) => {
    try {
      await fetch('/api/observations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data }),
      });
    } catch { /* silent */ }
  }, []);

  return { log };
}
