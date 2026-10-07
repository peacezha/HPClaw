// This fixture may run only on an ephemeral GitHub-hosted Linux runner.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
if (process.env.GITHUB_ACTIONS !== 'true' || process.platform !== 'linux') throw new Error('CI-only SSH fixture');
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'hpclaw-sshd-fixture-'));
const run = (command, args, input) => {
  const result = spawnSync(command, args, { input, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`Fixture command failed: ${command} (${result.status})`);
};
const values = {};
for (const letter of ['A', 'B']) {
  const username = `hpclawci${letter.toLowerCase()}${process.env.GITHUB_RUN_ID}`;
  const password = crypto.randomBytes(24).toString('hex');
  console.log('::add-mask::' + password);
  run('sudo', ['useradd', '-m', '-s', '/bin/bash', username]);
  run('sudo', ['chpasswd'], username + ':' + password + '\n');
  values[`HPCLAW_SMOKE_USER_${letter}`] = username;
  values[`HPCLAW_SMOKE_PASSWORD_${letter}`] = password;
}
run('ssh-keygen', ['-q', '-t', 'ed25519', '-N', '', '-f', path.join(directory, 'host_key')]);
fs.writeFileSync(path.join(directory, 'sshd_config'), `Port 22222\nListenAddress 127.0.0.1\nHostKey ${directory}/host_key\nPidFile ${directory}/sshd.pid\nPasswordAuthentication yes\nKbdInteractiveAuthentication no\nUsePAM no\nPermitRootLogin no\nSubsystem sftp internal-sftp\n`);
run('sudo', ['mkdir', '-p', '/run/sshd']);
run('sudo', ['/usr/sbin/sshd', '-f', path.join(directory, 'sshd_config'), '-E', path.join(directory, 'sshd.log')]);
fs.appendFileSync(process.env.GITHUB_ENV, Object.entries(values).map(([key, value]) => `${key}=${value}`).join('\n') + '\n');
console.log('Isolated SSH fixture ready on loopback:22222');
