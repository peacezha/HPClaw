const fs = require('node:fs');
const path = require('node:path');

// Legacy names below are read-only compatibility identifiers, never new branding.
function resolveDesktopIdentity({ appData, competition = false, platform = process.platform, exists = fs.existsSync }) {
  const name = competition ? 'TRACE Competition' : 'TRACE';
  const legacyName = competition ? 'HPClaw Competition' : 'HPClaw';
  const legacyPath = path.join(appData, legacyName);
  const legacy = exists(legacyPath);
  return {
    displayName: name,
    userData: path.join(appData, name),
    // Electron uses app.getName() as the macOS/Linux safeStorage key namespace.
    // Keep it for legacy profiles. Window, package and report branding still use TRACE.
    runtimeName: legacy && platform !== 'win32' ? legacyName : name,
    legacy,
  };
}

module.exports = { resolveDesktopIdentity };

/** Copy before switching profiles. Preserve ciphertext/key files and the source
 * backup, never merge into or overwrite an existing TRACE profile. */
function migrateDesktopProfile({ appData, competition = false, platform = process.platform }) {
  const identity = resolveDesktopIdentity({ appData, competition, platform });
  const legacyPath = path.join(appData, competition ? 'HPClaw Competition' : 'HPClaw');
  if (!identity.legacy || fs.existsSync(identity.userData)) return { ...identity, migrated: false };
  const staging = fs.mkdtempSync(path.join(appData, '.trace-profile-migration-'));
  const target = path.join(staging, 'profile');
  fs.cpSync(legacyPath, target, { recursive: true, force: false, errorOnExist: true,
    filter: filename => !['SingletonLock', 'SingletonCookie', 'SingletonSocket', 'lockfile'].includes(path.basename(filename)) });
  fs.writeFileSync(path.join(target, 'trace-profile-migration.json'), JSON.stringify({ version: 1, completed: true,
    migratedAt: new Date().toISOString(), legacyEncryptionIdentity: platform === 'win32' ? null : path.basename(legacyPath) }));
  // A concurrent launch may have completed first; never overwrite its profile.
  if (!fs.existsSync(identity.userData)) fs.renameSync(target, identity.userData);
  if (fs.readdirSync(staging).length === 0) fs.rmdirSync(staging);
  return { ...identity, migrated: true };
}
module.exports.migrateDesktopProfile = migrateDesktopProfile;
