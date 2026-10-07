let activeCluster: string | undefined;
const preferences = new Map<string, Record<string, string>>();
export function isPublicWeb(): boolean { return (window as any).hpclawPublicWeb === true; }
export function setPublicCluster(sessionId?: string | null) { activeCluster = sessionId || undefined; }
export function getPublicCluster() { return activeCluster; }
export function hydratePublicPreferences(sessionId: string, value: Record<string, string>) { preferences.set(sessionId, value || {}); }
export function readPublicPreference(key: string) { return activeCluster ? preferences.get(activeCluster)?.[key] || null : null; }
export function savePublicPreference(key: string, value: string) {
  if (!activeCluster) return Promise.resolve(false);
  const existing = preferences.get(activeCluster) || {}; existing[key] = value; preferences.set(activeCluster, existing);
  return fetch('/api/public/preferences', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-SSH-Session-Id': activeCluster },
    body: JSON.stringify({ key, value }) }).then(async response => {
    if (!response.ok) throw new Error((await response.json()).error || '集群偏好设置保存失败');
    return true;
  }).catch(error => { window.dispatchEvent(new CustomEvent('hpclaw-persistence-error', { detail: error.message })); return false; });
}

export async function initializePublicWeb() {
  if (window.hpclawDesktop) return;
  const originalFetch = window.fetch.bind(window);
  if (!isPublicWeb()) try {
    const result = await originalFetch('/api/app-info', { signal: AbortSignal.timeout(3000) });
    const info = await result.json();
    if (info.deployment !== 'public-web') return;
  } catch { return; }
  (window as any).hpclawPublicWeb = true;
  window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url, window.location.href);
    if (url.origin !== window.location.origin || !url.pathname.startsWith('/api/')
      || ['/api/login', '/api/app-info'].includes(url.pathname) || !activeCluster) return originalFetch(input, init);
    const headers = new Headers(init?.headers || (input instanceof Request ? input.headers : undefined));
    if (!headers.has('X-SSH-Session-Id')) headers.set('X-SSH-Session-Id', activeCluster);
    return originalFetch(input, { ...init, headers });
  }) as typeof fetch;
}
