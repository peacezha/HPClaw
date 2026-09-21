// 通用密钥存储：AI 配置（含 API Key）、TOTP 种子、集群记住密码等前端密钥的
// 加密落盘。与 profile-store 同一套 safeStorage 方案：密文（base64）存 userData
// 下的 secrets.json；key 名走白名单，加密不可用时拒绝写入（宁可报错也不落明文）。
const ALLOWED_KEYS = new Set(['aiProfile', 'totpSecret', 'clusterPassword']);

function createSecretStore({ safeStorage, files, filePath }) {
  let secrets = {};

  async function load() {
    try {
      const raw = await files.read(filePath);
      const parsed = JSON.parse(raw || '{}');
      secrets = parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      secrets = {};
    }
  }

  async function persist() {
    await files.writeAtomic(filePath, JSON.stringify(secrets, null, 2));
  }

  function assertKey(key) {
    if (!ALLOWED_KEYS.has(key)) throw new Error(`Unknown secret key: ${key}`);
  }

  // Ensure loaded on creation
  const initPromise = load();

  return {
    async get(key) {
      assertKey(key);
      await initPromise;
      const encrypted = secrets[key];
      if (!encrypted) return '';
      try {
        return safeStorage.decryptString(Buffer.from(encrypted, 'base64'));
      } catch {
        // 密文损坏或系统账户变更导致 DPAPI 解不开：按无值处理，不阻断启动
        return '';
      }
    },

    async set(key, value) {
      assertKey(key);
      await initPromise;
      if (!safeStorage.isEncryptionAvailable()) {
        throw new Error('Secure credential storage is unavailable');
      }
      secrets[key] = safeStorage.encryptString(String(value ?? '')).toString('base64');
      await persist();
    },

    async delete(key) {
      assertKey(key);
      await initPromise;
      if (key in secrets) {
        delete secrets[key];
        await persist();
      }
    },
  };
}

module.exports = { createSecretStore };
