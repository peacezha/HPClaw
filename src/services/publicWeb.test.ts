// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { initializePublicWeb, setPublicCluster, hydratePublicPreferences } from './publicWeb';
import { hydrateAIProfile, loadAIProfile, saveAIProfile } from './aiProfile';
import { getSavedPassword, getStoredSecret, savePassword, storeSecret, hydrateTotpStorage } from './totpStorage';
import { recordCommand, getRecentCommands } from './commandHistory';
import { saveLoginProfile, listLoginProfiles } from './loginProfiles';

const originalFetch = window.fetch;
beforeEach(() => { (window as any).hpclawPublicWeb = true; localStorage.clear(); setPublicCluster('a'); vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 200 }))); });
afterEach(() => { delete (window as any).hpclawPublicWeb; setPublicCluster(undefined); vi.unstubAllGlobals(); window.fetch = originalFetch; localStorage.clear(); });
it('keeps different cluster API keys in memory, not browser persistent storage', async () => {
  localStorage.setItem('ai_api_key', 'old-plaintext'); await hydrateAIProfile();
  saveAIProfile({ apiKey: 'a-private' }, 'a'); saveAIProfile({ apiKey: 'b-private' }, 'b');
  expect(loadAIProfile('a').apiKey).toBe('a-private'); expect(loadAIProfile('b').apiKey).toBe('b-private');
  expect(loadAIProfile('new').apiKey).toBe(''); expect(localStorage.length).toBe(0);
});
it('never persists or restores SSH passwords and TOTP seeds in the public browser', async () => {
  localStorage.setItem('hpclaw_totp_secret', 'OLDSEED'); await hydrateTotpStorage();
  storeSecret('NEWSEED'); savePassword('secret-password');
  await saveLoginProfile({ host: 'cluster.test', port: '22', username: 'alice', password: 'secret-password', totpSecret: 'NEWSEED', rememberPassword: true, rememberTotp: true });
  expect(getSavedPassword()).toBe(''); expect(getStoredSecret()).toBe(''); expect(await listLoginProfiles()).toEqual([]);
  expect(localStorage.length).toBe(0);
});
it('routes requests explicitly without overwriting a target belonging to another open tab', async () => {
  const underlying = window.fetch as ReturnType<typeof vi.fn>;
  await initializePublicWeb();
  await window.fetch('/api/public/profile');
  expect(new Headers(underlying.mock.calls.at(-1)![1].headers).get('X-SSH-Session-Id')).toBe('a');
  await window.fetch('/api/public/profile', { headers: { 'X-SSH-Session-Id': 'b' } });
  expect(new Headers(underlying.mock.calls.at(-1)![1].headers).get('X-SSH-Session-Id')).toBe('b');
  await window.fetch('https://other.test/api/public/profile');
  expect(underlying.mock.calls.at(-1)![1]).toBeUndefined();
});
it('stores terminal history in the active cluster preferences, never across clusters or in localStorage', () => {
  hydratePublicPreferences('a', {}); hydratePublicPreferences('b', {});
  recordCommand('samtools view private.bam'); expect(getRecentCommands()).toEqual(['samtools view private.bam']);
  setPublicCluster('b'); expect(getRecentCommands()).toEqual([]); expect(localStorage.length).toBe(0);
});
