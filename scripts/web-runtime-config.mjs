import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

/** Keep all generated deployment credentials outside the application/source tree. */
export function configureWebRuntime(appRoot, env = process.env) {
  if (env.TRACE_WEB_PASSWORD && env.TRACE_WEB_PASSWORD.length < 16) throw new Error('Web password must have at least 16 characters');
  if (env.SESSION_SECRET && env.SESSION_SECRET.length < 32) throw new Error('SESSION_SECRET must have at least 32 characters');
  if (env.TRACE_ENCRYPTION_KEY && !/^[a-f0-9]{64}$/i.test(env.TRACE_ENCRYPTION_KEY)) throw new Error('Invalid TRACE_ENCRYPTION_KEY');
  if (env.TRACE_WEB_USERNAME && !/^[A-Za-z0-9_.-]{1,64}$/.test(env.TRACE_WEB_USERNAME)) throw new Error('Invalid web username');
  const dataRoot = path.resolve(env.TRACE_DATA_ROOT || path.join(appRoot, 'data'));
  fs.mkdirSync(dataRoot, { recursive: true, mode: 0o700 });
  const credentialsFile = path.join(dataRoot, 'web-access.json');
  let saved;
  try { saved = JSON.parse(fs.readFileSync(credentialsFile, 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (!saved) {
    saved = {
      username: env.TRACE_WEB_USERNAME || 'trace',
      password: env.TRACE_WEB_PASSWORD || crypto.randomBytes(24).toString('base64url'),
      sessionSecret: crypto.randomBytes(48).toString('base64url'),
      encryptionKey: crypto.randomBytes(32).toString('hex'),
    };
    fs.writeFileSync(credentialsFile, JSON.stringify(saved, null, 2), { flag: 'wx', mode: 0o600 });
  }
  if (typeof saved.username !== 'string' || !/^[A-Za-z0-9_.-]{1,64}$/.test(saved.username)
    || typeof saved.password !== 'string' || saved.password.length < 16
    || typeof saved.sessionSecret !== 'string' || saved.sessionSecret.length < 32
    || !/^[a-f0-9]{64}$/.test(saved.encryptionKey)) throw new Error('Invalid persistent web-access.json; restore it from backup');
  Object.assign(env, {
    NODE_ENV: 'production',
    TRACE_WEB_MODE: '1',
    TRACE_APP_ROOT: appRoot,
    TRACE_STATIC_ROOT: appRoot,
    TRACE_DATA_ROOT: dataRoot,
    TRACE_WEB_USERNAME: env.TRACE_WEB_USERNAME || saved.username,
    TRACE_WEB_PASSWORD: env.TRACE_WEB_PASSWORD || saved.password,
    SESSION_SECRET: env.SESSION_SECRET || saved.sessionSecret,
    TRACE_ENCRYPTION_KEY: env.TRACE_ENCRYPTION_KEY || saved.encryptionKey,
    TRACE_HOST: env.TRACE_HOST || '127.0.0.1',
  });
  return { dataRoot, credentialsFile };
}
