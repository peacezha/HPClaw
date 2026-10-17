import path from 'node:path';
import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
const { resolveDesktopIdentity } = createRequire(import.meta.url)('./app-identity.cjs');

describe('TRACE branding and legacy profile compatibility', () => {
  it('uses TRACE for fresh installations', () => {
    expect(resolveDesktopIdentity({ appData: '/profiles', platform: 'win32', exists: () => false }))
      .toEqual({ displayName: 'TRACE', runtimeName: 'TRACE', userData: path.join('/profiles', 'TRACE'), legacy: false });
  });
  it('selects the TRACE destination for an existing profile migration', () => {
    const old = path.join('/profiles', 'HPClaw');
    expect(resolveDesktopIdentity({ appData: '/profiles', platform: 'win32', exists: (p: string) => p === old }))
      .toEqual({ displayName: 'TRACE', runtimeName: 'TRACE', userData: path.join('/profiles', 'TRACE'), legacy: true });
  });
  it.each(['darwin', 'linux'])('preserves the existing encryption identity on %s', platform => {
    const identity = resolveDesktopIdentity({ appData: '/profiles', platform, exists: () => true });
    expect(identity.displayName).toBe('TRACE');
    expect(identity.runtimeName).toBe('HPClaw');
  });
  it('keeps competition credentials isolated from the full edition', () => {
    const oldFull = path.join('/profiles', 'HPClaw');
    const identity = resolveDesktopIdentity({ appData: '/profiles', competition: true, platform: 'win32', exists: (p: string) => p === oldFull });
    expect(identity.userData).toBe(path.join('/profiles', 'TRACE Competition'));
    expect(identity.runtimeName).toBe('TRACE Competition');
  });
});
