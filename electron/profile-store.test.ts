import { describe, expect, it } from 'vitest';
import { createProfileStore } from './profile-store.cjs';

function createMemoryFiles() {
  let value = '';
  return {
    read: async () => value,
    writeAtomic: async (_path: string, next: string) => { value = next; },
    text: () => value,
  };
}

function createSafeStorage(available = true) {
  return {
    isEncryptionAvailable: () => available,
    encryptString: (value: string) => Buffer.from(`enc:${value}`),
    decryptString: (value: Buffer) => value.toString().slice(4),
  };
}

describe('profile-store', () => {
  it('stores encrypted secrets and returns metadata without plaintext', async () => {
    const files = createMemoryFiles();
    const safeStorage = createSafeStorage();
    const store = createProfileStore({ safeStorage, files, filePath: 'profiles.json' });

    await store.save({
      id: 'p1',
      name: 'NCPGR',
      group: 'default',
      host: 'hpc.test',
      port: 22,
      username: 'lin',
      password: 'secret',
      totpSecret: 'JBSWY3DPEHPK3PXP',
    });

    expect(files.text()).not.toContain('secret');
    expect(files.text()).not.toContain('JBSWY3DPEHPK3PXP');

    const list = store.list();
    expect(list[0]).toMatchObject({
      id: 'p1',
      name: 'NCPGR',
      host: 'hpc.test',
      port: 22,
      username: 'lin',
      hasSavedPassword: true,
      hasSavedTotp: true,
    });
    // list should not contain password or totpSecret
    expect(JSON.stringify(list[0])).not.toContain('password');
    expect(JSON.stringify(list[0])).not.toContain('totpSecret');
  });

  it('rejects saving non-empty secrets when encryption is unavailable', async () => {
    const files = createMemoryFiles();
    const safeStorage = createSafeStorage(false);
    const store = createProfileStore({ safeStorage, files, filePath: 'profiles.json' });

    await expect(
      store.save({
        id: 'p1',
        name: 'Test',
        group: 'default',
        host: 'hpc.test',
        port: 22,
        username: 'lin',
        password: 'secret',
      })
    ).rejects.toThrow('Secure credential storage is unavailable');
  });

  it('allows saving empty secrets even when encryption is unavailable', async () => {
    const files = createMemoryFiles();
    const safeStorage = createSafeStorage(false);
    const store = createProfileStore({ safeStorage, files, filePath: 'profiles.json' });

    await expect(
      store.save({
        id: 'p1',
        name: 'Test',
        group: 'default',
        host: 'hpc.test',
        port: 22,
        username: 'lin',
      })
    ).resolves.toBeUndefined();
  });

  it('removes a profile by id', async () => {
    const files = createMemoryFiles();
    const safeStorage = createSafeStorage();
    const store = createProfileStore({ safeStorage, files, filePath: 'profiles.json' });

    await store.save({ id: 'p1', name: 'One', group: 'default', host: 'a', port: 22, username: 'u', password: 'p' });
    await store.save({ id: 'p2', name: 'Two', group: 'default', host: 'b', port: 22, username: 'u', password: 'p' });

    store.remove('p1');
    expect(store.list().map(p => p.id)).toEqual(['p2']);
  });

  it('returns decrypted credentials via getCredentials', async () => {
    const files = createMemoryFiles();
    const safeStorage = createSafeStorage();
    const store = createProfileStore({ safeStorage, files, filePath: 'profiles.json' });

    await store.save({
      id: 'p1',
      name: 'Test',
      group: 'default',
      host: 'hpc.test',
      port: 22,
      username: 'lin',
      password: 'secret123',
      totpSecret: 'JBSWY3DPEHPK3PXP',
    });

    const creds = store.getCredentials('p1');
    expect(creds).toEqual({ password: 'secret123', totpSecret: 'JBSWY3DPEHPK3PXP' });
  });

  it('trusts a fingerprint for a profile', async () => {
    const files = createMemoryFiles();
    const safeStorage = createSafeStorage();
    const store = createProfileStore({ safeStorage, files, filePath: 'profiles.json' });

    await store.save({ id: 'p1', name: 'Test', group: 'default', host: 'hpc.test', port: 22, username: 'lin' });

    store.trustFingerprint('p1', 'sha256:abc123');
    expect(store.list()[0].fingerprint).toBe('sha256:abc123');
  });

  it('is idempotent when saving the same profile twice', async () => {
    const files = createMemoryFiles();
    const safeStorage = createSafeStorage();
    const store = createProfileStore({ safeStorage, files, filePath: 'profiles.json' });

    await store.save({ id: 'p1', name: 'Test', group: 'default', host: 'hpc.test', port: 22, username: 'lin', password: 'p1' });
    await store.save({ id: 'p1', name: 'Test', group: 'default', host: 'hpc.test', port: 22, username: 'lin', password: 'p2' });

    expect(store.list().length).toBe(1);
    expect(store.getCredentials('p1').password).toBe('p2');
  });

  it('preserves saved secrets when updating profile metadata without secret fields', async () => {
    const files = createMemoryFiles();
    const safeStorage = createSafeStorage();
    const store = createProfileStore({ safeStorage, files, filePath: 'profiles.json' });

    await store.save({
      id: 'p1',
      name: 'Test',
      group: 'default',
      host: 'hpc.test',
      port: 22,
      username: 'lin',
      password: 'secret123',
      totpSecret: 'JBSWY3DPEHPK3PXP',
    });

    const [metadata] = store.list();
    await store.save({ ...metadata, lastUsedAt: 123456 });

    expect(store.list()[0]).toMatchObject({
      lastUsedAt: 123456,
      hasSavedPassword: true,
      hasSavedTotp: true,
    });
    expect(store.getCredentials('p1')).toEqual({
      password: 'secret123',
      totpSecret: 'JBSWY3DPEHPK3PXP',
    });
  });
});
