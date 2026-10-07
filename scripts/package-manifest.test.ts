import fs from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('reproducible clean platform installs', () => {
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
