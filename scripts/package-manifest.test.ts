import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

describe('reproducible clean platform installs', () => {
  it('includes vendored runtime distributions without unignoring user conversations', () => {
    const files = [
      'vendor/dsh/node_modules/sharp/dist/index.cjs',
      'vendor/dsh/node_modules/@deepseek-ai/dsh-web-frontend/dist/index.html',
      'vendor/dsh/node_modules/@aws-crypto/sha256-js/build/main/index.js',
      'vendor/dsh/node_modules/openai/resources/conversations/index.js',
    ];
    for (const file of files) expect(fs.existsSync(file), file).toBe(true);
    const checked = spawnSync('git', ['check-ignore', '--no-index', ...files], { encoding: 'utf8' });
    expect(checked.status, checked.stdout + checked.stderr).toBe(1);
    expect(spawnSync('git', ['check-ignore', '--no-index', 'conversations/private.json']).status).toBe(0);
  });

  it('keeps package.json dependency ranges and version synchronized with the lockfile', () => {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));
    expect(lock.version).toBe(pkg.version);
    expect(lock.packages[''].version).toBe(pkg.version);
    expect(lock.packages[''].dependencies).toEqual(pkg.dependencies);
    expect(lock.packages[''].devDependencies).toEqual(pkg.devDependencies);
    for (const name of Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })) {
      expect(lock.packages['node_modules/' + name], name).toBeDefined();
    }
  });
});
