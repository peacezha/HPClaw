import { describe, expect, it } from 'vitest';
import { createSecretStore } from './secret-store.cjs';

function createMemoryFiles(initial = '') {
  let value = initial;
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

describe('secret-store', () => {
  it('密文落盘，读取还原', async () => {
    const files = createMemoryFiles();
    const store = createSecretStore({ safeStorage: createSafeStorage(), files, filePath: 'secrets.json' });

    await store.set('aiProfile', '{"apiKey":"sk-1"}');

    expect(files.text()).not.toContain('sk-1');
    expect(await store.get('aiProfile')).toBe('{"apiKey":"sk-1"}');
  });

  it('未写入的 key 返回空串', async () => {
    const store = createSecretStore({ safeStorage: createSafeStorage(), files: createMemoryFiles(), filePath: 'secrets.json' });
    expect(await store.get('totpSecret')).toBe('');
  });

  it('白名单外的 key 拒绝读写', async () => {
    const store = createSecretStore({ safeStorage: createSafeStorage(), files: createMemoryFiles(), filePath: 'secrets.json' });

    await expect(store.get('sshPrivateKey')).rejects.toThrow('Unknown secret key');
    await expect(store.set('sshPrivateKey', 'x')).rejects.toThrow('Unknown secret key');
    await expect(store.delete('sshPrivateKey')).rejects.toThrow('Unknown secret key');
  });

  it('加密不可用时拒绝写入', async () => {
    const store = createSecretStore({ safeStorage: createSafeStorage(false), files: createMemoryFiles(), filePath: 'secrets.json' });

    await expect(store.set('clusterPassword', 'pw')).rejects.toThrow('Secure credential storage is unavailable');
  });

  it('delete 删除后读取为空，重复删除无副作用', async () => {
    const files = createMemoryFiles();
    const store = createSecretStore({ safeStorage: createSafeStorage(), files, filePath: 'secrets.json' });

    await store.set('clusterPassword', 'pw');
    await store.delete('clusterPassword');
    expect(await store.get('clusterPassword')).toBe('');
    await store.delete('clusterPassword');
    expect(await store.get('clusterPassword')).toBe('');
  });

  it('重新加载（模拟重启）后仍能读出已存密钥', async () => {
    const files = createMemoryFiles();
    const safeStorage = createSafeStorage();
    const first = createSecretStore({ safeStorage, files, filePath: 'secrets.json' });
    await first.set('totpSecret', 'JBSWY3DPEHPK3PXP');

    const second = createSecretStore({ safeStorage, files, filePath: 'secrets.json' });
    expect(await second.get('totpSecret')).toBe('JBSWY3DPEHPK3PXP');
  });

  it('损坏密文读取返回空串，不阻断启动', async () => {
    const safeStorage = {
      isEncryptionAvailable: () => true,
      encryptString: (value: string) => Buffer.from(`enc:${value}`),
      decryptString: () => { throw new Error('decrypt failed'); },
    };
    const files = createMemoryFiles(JSON.stringify({ totpSecret: 'AAAA' }));
    const store = createSecretStore({ safeStorage, files, filePath: 'secrets.json' });

    expect(await store.get('totpSecret')).toBe('');
  });
});
