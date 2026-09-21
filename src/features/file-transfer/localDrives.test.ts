import { describe, it, expect } from 'vitest';
import { LOCAL_DRIVES_ROOT, isLocalDrivesRoot, isWindowsDriveRoot } from './localDrives';

describe('isLocalDrivesRoot', () => {
  it('recognizes the sentinel and its English alias', () => {
    expect(isLocalDrivesRoot(LOCAL_DRIVES_ROOT)).toBe(true);
    expect(isLocalDrivesRoot('此电脑')).toBe(true);
    expect(isLocalDrivesRoot('This PC')).toBe(true);
    expect(isLocalDrivesRoot('this pc')).toBe(true);
  });

  it('rejects real paths and empty values', () => {
    expect(isLocalDrivesRoot('C:\\')).toBe(false);
    expect(isLocalDrivesRoot('/')).toBe(false);
    expect(isLocalDrivesRoot('')).toBe(false);
  });
});

describe('isWindowsDriveRoot', () => {
  it('matches drive roots with either separator', () => {
    expect(isWindowsDriveRoot('C:\\')).toBe(true);
    expect(isWindowsDriveRoot('C:/')).toBe(true);
    expect(isWindowsDriveRoot('e:')).toBe(true);
  });

  it('rejects nested paths and non-Windows roots', () => {
    expect(isWindowsDriveRoot('C:\\Users')).toBe(false);
    expect(isWindowsDriveRoot('/')).toBe(false);
    expect(isWindowsDriveRoot(LOCAL_DRIVES_ROOT)).toBe(false);
  });
});
