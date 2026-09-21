import { describe, expect, it } from 'vitest';
import {
  assertSafeLocalPath,
  assertRemotePathWithinRoot,
  assertSafeRemoteMutation,
  assertSafeRemotePath,
} from './pathSafety';

describe('path safety', () => {
  it('normalizes a normal Windows local path', () => {
    expect(assertSafeLocalPath('D:\\BioProject\\raw\\..\\reads.fastq.gz'))
      .toBe('D:\\BioProject\\reads.fastq.gz');
  });

  it('normalizes a fully qualified Windows UNC path', () => {
    expect(assertSafeLocalPath('\\\\server\\share\\raw\\..\\reads.fastq.gz'))
      .toBe('\\\\server\\share\\reads.fastq.gz');
  });

  it.each([
    '..\\outside.txt',
    'C:relative.txt',
    '\\rooted.txt',
  ])('rejects non-fully-qualified local path %j', (input) => {
    expect(() => assertSafeLocalPath(input))
      .toThrow('local path must be fully qualified');
  });

  it.each([
    '\\\\.\\PhysicalDrive0',
    '\\\\?\\C:\\file',
  ])('rejects Windows device or extended path %j', (input) => {
    expect(() => assertSafeLocalPath(input))
      .toThrow('local device paths are not allowed');
  });

  it('normalizes a normal POSIX mutation below the remote home', () => {
    expect(assertSafeRemoteMutation('/home/lin/project/../file.txt', '/home/lin'))
      .toBe('/home/lin/file.txt');
  });

  it('rejects blank paths', () => {
    expect(() => assertSafeLocalPath('')).toThrow('path is required');
    expect(() => assertSafeRemotePath('   ')).toThrow('path is required');
  });

  it('rejects paths containing a null byte', () => {
    expect(() => assertSafeLocalPath('D:\\BioProject\\bad\0name'))
      .toThrow('path contains a null byte');
    expect(() => assertSafeRemotePath('/home/lin/bad\0name'))
      .toThrow('path contains a null byte');
  });

  it('rejects a non-absolute remote path', () => {
    expect(() => assertSafeRemotePath('home/lin/file.txt'))
      .toThrow('remote path must be absolute');
  });

  it.each([
    ['/', '/home/lin'],
    ['/home', '/home/lin'],
    ['/home/lin', '/home/lin/'],
  ])('rejects protected remote mutation root %s', (input, home) => {
    expect(() => assertSafeRemoteMutation(input, home))
      .toThrow('protected remote path');
  });

  it('将 dsh 远程访问限定在授权 home 内', () => {
    expect(assertRemotePathWithinRoot('/home/lin/project/../file.txt', '/home/lin', { allowRoot: true }))
      .toBe('/home/lin/file.txt');
    expect(() => assertRemotePathWithinRoot('/etc/passwd', '/home/lin', { allowRoot: true }))
      .toThrow('outside the authorized root');
    expect(() => assertRemotePathWithinRoot('/home/lin', '/home/lin'))
      .toThrow('protected remote root');
  });
});
