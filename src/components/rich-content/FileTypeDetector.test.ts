import { describe, expect, it } from 'vitest';
import { detectFileType, getFileCategory } from './FileTypeDetector';

describe('detectFileType', () => {
  it('does not parse compressed bioinformatics files inline', () => {
    const compressed = [
      '/data/sample.fastq.gz',
      '/data/sample.fq.gz',
      '/data/ref.fasta.gz',
      '/data/ref.fa.gz',
      '/data/variants.vcf.gz',
      '/data/sample.g.vcf.gz',
    ];

    for (const path of compressed) {
      expect(detectFileType(path)).toBe('generic');
    }
  });

  it('still detects uncompressed bioinformatics files', () => {
    expect(detectFileType('/data/sample.fastq')).toBe('fasta');
    expect(detectFileType('/data/ref.fasta')).toBe('fasta');
    expect(detectFileType('/data/variants.vcf')).toBe('vcf');
  });
});

describe('getFileCategory', () => {
  it('treats compressed bioinformatics files as files, not parsed sequence previews', () => {
    expect(getFileCategory('/data/sample.fastq.gz')).toBe('file');
    expect(getFileCategory('/data/ref.fasta.gz')).toBe('file');
    expect(getFileCategory('/data/sample.g.vcf.gz')).toBe('file');
  });
});
