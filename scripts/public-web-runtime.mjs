export const minimumNodeVersion = '20.19.5';

export function assertPublicWebRuntime(version = process.versions.node) {
  if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error('公共网页需要正式版 Node.js ' + minimumNodeVersion + ' 或更新版本');
  const current = version.split('.').map(Number);
  const minimum = minimumNodeVersion.split('.').map(Number);
  for (let index = 0; index < minimum.length; index++) {
    if (current[index] > minimum[index]) return;
    if (current[index] < minimum[index]) throw new Error('公共网页需要 Node.js ' + minimumNodeVersion + ' 或更新版本；当前版本为 ' + version);
  }
}
