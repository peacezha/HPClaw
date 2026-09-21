import { describe, expect, it } from 'vitest';
import { assertSafeArchivePath, classifySkillSource } from './skillInstaller';

describe('skill installer safety helpers', () => {
  it('rejects archive path traversal entries', () => {
    expect(() => assertSafeArchivePath('../escape.md')).toThrow(/unsafe archive path/i);
    expect(() => assertSafeArchivePath('skills/../../escape.md')).toThrow(/unsafe archive path/i);
  });

  it('classifies git, url archive, and local sources', () => {
    expect(classifySkillSource({ type: 'git', url: 'https://github.com/a/b.git' })).toBe('git');
    expect(classifySkillSource({ type: 'url', url: 'https://example.com/skill.zip' })).toBe('url');
    expect(classifySkillSource({ type: 'local', path: 'C:/tmp/skill.md' })).toBe('local');
  });
});
