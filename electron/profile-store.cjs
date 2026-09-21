function createProfileStore({ safeStorage, files, filePath }) {
  let profiles = [];

  async function load() {
    try {
      const raw = await files.read(filePath);
      profiles = JSON.parse(raw || '[]');
    } catch {
      profiles = [];
    }
    // 去重：同一 host:port:username 只保留一条。历史版本以随机 UUID 重复
    // 保存同一账号导致列表冗余；合并时保留规范 id、密文与最近使用时间。
    const byKey = new Map();
    let changed = false;
    for (const p of profiles) {
      const key = `${p.host}:${p.port}:${p.username}`;
      const existing = byKey.get(key);
      if (!existing) {
        byKey.set(key, p);
        continue;
      }
      changed = true;
      const prefer = p.id === key ? p
        : existing.id === key ? existing
        : (p.lastUsedAt || 0) >= (existing.lastUsedAt || 0) ? p : existing;
      const other = prefer === p ? existing : p;
      byKey.set(key, {
        ...prefer,
        encryptedPassword: prefer.encryptedPassword || other.encryptedPassword || '',
        encryptedTotpSecret: prefer.encryptedTotpSecret || other.encryptedTotpSecret || '',
        fingerprint: prefer.fingerprint || other.fingerprint,
        lastUsedAt: Math.max(prefer.lastUsedAt || 0, other.lastUsedAt || 0),
      });
    }
    if (changed) {
      profiles = [...byKey.values()];
      persist().catch(() => {});
    }
  }

  async function persist() {
    const raw = JSON.stringify(profiles, null, 2);
    await files.writeAtomic(filePath, raw);
  }

  function encrypt(value) {
    if (!value) return '';
    return safeStorage.encryptString(value).toString('base64');
  }

  function decrypt(value) {
    if (!value) return '';
    return safeStorage.decryptString(Buffer.from(value, 'base64'));
  }

  function hasNonEmptySecrets(profile) {
    return !!(profile.password || profile.totpSecret);
  }

  function encryptedSecret(nextValue, existingValue) {
    if (typeof nextValue !== 'string') return existingValue || '';
    return safeStorage.isEncryptionAvailable() ? encrypt(nextValue) : '';
  }

  // Ensure loaded on creation
  const initPromise = load();

  return {
    list() {
      // Ensure loaded
      return profiles.map(p => ({
        id: p.id,
        name: p.name,
        group: p.group || 'default',
        host: p.host,
        port: p.port,
        username: p.username,
        favorite: p.favorite || false,
        defaultLocalPath: p.defaultLocalPath,
        defaultRemotePath: p.defaultRemotePath,
        fingerprint: p.fingerprint,
        hasSavedPassword: !!p.encryptedPassword,
        hasSavedTotp: !!p.encryptedTotpSecret,
        lastUsedAt: p.lastUsedAt,
      }));
    },

    getCredentials(id) {
      const profile = profiles.find(p => p.id === id);
      if (!profile) throw new Error(`Profile not found: ${id}`);
      return {
        password: decrypt(profile.encryptedPassword),
        totpSecret: decrypt(profile.encryptedTotpSecret),
      };
    },

    async save(profile) {
      await initPromise;
      if (!safeStorage.isEncryptionAvailable() && hasNonEmptySecrets(profile)) {
        throw new Error('Secure credential storage is unavailable');
      }

      const index = profiles.findIndex(p => p.id === profile.id);
      const existing = index >= 0 ? profiles[index] : undefined;
      const entry = {
        id: profile.id,
        name: profile.name,
        group: profile.group || 'default',
        host: profile.host,
        port: profile.port,
        username: profile.username,
        favorite: profile.favorite || false,
        defaultLocalPath: profile.defaultLocalPath,
        defaultRemotePath: profile.defaultRemotePath,
        fingerprint: profile.fingerprint,
        lastUsedAt: profile.lastUsedAt,
        encryptedPassword: encryptedSecret(profile.password, existing?.encryptedPassword),
        encryptedTotpSecret: encryptedSecret(profile.totpSecret, existing?.encryptedTotpSecret),
      };

      if (index >= 0) {
        profiles[index] = entry;
      } else {
        profiles.push(entry);
      }

      await persist();
    },

    remove(id) {
      profiles = profiles.filter(p => p.id !== id);
      // Persist synchronously or fire-and-forget
      persist().catch(() => {});
    },

    trustFingerprint(id, fingerprint) {
      const profile = profiles.find(p => p.id === id);
      if (!profile) throw new Error(`Profile not found: ${id}`);
      profile.fingerprint = fingerprint;
      persist().catch(() => {});
    },
  };
}

module.exports = { createProfileStore };
