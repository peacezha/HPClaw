const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

// Retire only verified shortcuts to the old application; keep exact rollback
// copies. Never remove an installation directory or an unrelated shortcut.
function migrateLegacyShortcuts({ desktop, programs, userData, readShortcutLink, competition = false }) {
  const legacy = competition ? 'HPClaw Competition' : 'HPClaw';
  const candidates = [path.join(desktop, legacy + '.lnk'), path.join(programs, legacy + '.lnk'),
    path.join(programs, legacy, legacy + '.lnk'), path.join(programs, legacy, 'Uninstall ' + legacy + '.lnk')];
  let retired = 0;
  for (const filename of candidates) {
    if (!fs.existsSync(filename)) continue;
    const target = readShortcutLink(filename)?.target;
    if (!target || path.basename(path.dirname(target)).toLowerCase() !== legacy.toLowerCase()
      || ![legacy.toLowerCase() + '.exe', 'uninstall ' + legacy.toLowerCase() + '.exe'].includes(path.basename(target).toLowerCase())) continue;
    const bytes = fs.readFileSync(filename), backupDir = path.join(userData, 'legacy-shortcut-backups');
    fs.mkdirSync(backupDir, { recursive: true });
    const backup = path.join(backupDir, crypto.createHash('sha256').update(bytes).digest('hex') + '.lnk');
    if (!fs.existsSync(backup)) fs.writeFileSync(backup, bytes, { flag: 'wx' });
    fs.unlinkSync(filename); retired++;
  }
  const folder = path.join(programs, legacy);
  if (fs.existsSync(folder) && fs.lstatSync(folder).isDirectory() && !fs.lstatSync(folder).isSymbolicLink() && fs.readdirSync(folder).length === 0) fs.rmdirSync(folder);
  return retired;
}
module.exports = { migrateLegacyShortcuts };
