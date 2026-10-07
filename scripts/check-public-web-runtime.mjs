import assert from 'node:assert/strict';
import { test } from 'node:test';
import { assertPublicWebRuntime, minimumNodeVersion } from './public-web-runtime.mjs';

test('public web accepts the deployment minimum and newer stable versions', () => {
  assert.equal(minimumNodeVersion, '20.19.5');
  for (const version of ['20.19.5', '20.19.6', '20.20.0', '21.0.0', '22.17.1', '24.0.0']) {
    assert.doesNotThrow(() => assertPublicWebRuntime(version));
  }
});
test('public web rejects older or prerelease runtimes with an actionable message', () => {
  for (const version of ['18.20.8', '20.18.1', '20.19.4', '20.19.5-rc.1', 'not-a-version']) {
    assert.throws(() => assertPublicWebRuntime(version), /20\.19\.5/);
  }
});
