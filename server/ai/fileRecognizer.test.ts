import { describe, expect, it } from 'vitest';
import { FileRecognizer } from './fileRecognizer';

describe('FileRecognizer', () => {
  const recognizer = new FileRecognizer();

  it('recognizes FASTQ files and links to qc skill', () => {
    const result = recognizer.analyze('sample_01_R1.fastq.gz', 5000000, Date.now());
    expect(result.type).toBe('fastq');
    expect(result.recognizedSkillHints).toContain('qc');
  });

  it('recognizes BAM files and links to alignment skill', () => {
    const result = recognizer.analyze('sample_01.bam', 2000000000, Date.now());
    expect(result.type).toBe('bam');
    expect(result.recognizedSkillHints).toContain('alignment');
  });

  it('recognizes LSF script files', () => {
    const result = recognizer.analyze('myjob.lsf', 1024, Date.now());
    expect(result.type).toBe('lsf');
    expect(result.recognizedSkillHints).toContain('lsf-ncpgr');
  });

  it('infers analysis phase from file collection', () => {
    const files = [
      { name: 'sample_01.fastq.gz', size: 5000000, modified: Date.now(), type: 'fastq' as const, recognizedSkillHints: ['qc'] },
      { name: 'sample_01.bam', size: 2000000000, modified: Date.now(), type: 'bam' as const, recognizedSkillHints: ['alignment'] },
    ];
    const phase = recognizer.inferPhase(files);
    expect(phase.phase).toContain('比对');
    expect(phase.skills).toContain('alignment');
  });

  it('recognizes GTF files and links to alignment', () => {
    const result = recognizer.analyze('genes.gtf', 50000000, Date.now());
    expect(result.type).toBe('gtf');
    expect(result.recognizedSkillHints).toContain('alignment');
  });
});
