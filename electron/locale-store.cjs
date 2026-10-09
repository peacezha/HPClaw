const fs = require('node:fs');
const path = require('node:path');

const isLocale = value => value === 'zh-CN' || value === 'en-US';

function createLocaleStore({ userData, installDir }) {
  const preferenceFile = path.join(userData, 'language.json');
  const installFile = path.join(installDir, 'hpclaw-install-locale.json');
  function read(file) {
    try {
      const value = JSON.parse(fs.readFileSync(file, 'utf8')).locale;
      return isLocale(value) ? value : undefined;
    } catch { return undefined; }
  }
  return {
    // Explicit in-app choices survive upgrades. A fresh installation uses the wizard choice.
    get: () => read(preferenceFile) || read(installFile) || 'zh-CN',
    set(locale) {
      if (!isLocale(locale)) throw new Error('Unsupported interface language');
      fs.mkdirSync(userData, { recursive: true });
      const temporary = `${preferenceFile}.tmp`;
      fs.writeFileSync(temporary, JSON.stringify({ locale }), { encoding: 'utf8', mode: 0o600 });
      fs.renameSync(temporary, preferenceFile);
      return locale;
    },
  };
}

module.exports = { createLocaleStore };
