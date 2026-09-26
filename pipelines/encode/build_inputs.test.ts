import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, it } from 'vitest';

const temporaryDirectories: string[] = [];

function findPython(): string {
  const candidates = [process.env.PYTHON, 'python3', 'python'].filter(Boolean) as string[];
  for (const candidate of candidates) {
    const result = spawnSync(candidate, ['--version'], { encoding: 'utf8' });
    if (result.status === 0) return candidate;
  }
  throw new Error('测试 ENCODE input builder 需要 Python 3');
}

async function temporaryDirectory(): Promise<string> {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'hpclaw-encode-input-'));
  temporaryDirectories.push(directory);
  return directory;
}

function runBuilder(script: string, args: string[]): void {
  const result = spawnSync(findPython(), [path.join(process.cwd(), 'pipelines', 'encode', script), ...args], {
    encoding: 'utf8',
  });
  if (result.status !== 0) throw new Error(`${script} failed:\n${result.stdout}\n${result.stderr}`);
}

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map(directory => rm(directory, { recursive: true, force: true })));
});

describe('ENCODE official input builders', () => {
  it('按生物学重复嵌套 RNA technical lanes，并写全官方 WDL 必需资源字段', async () => {
    const directory = await temporaryDirectory();
    const sheet = path.join(directory, 'rna.tsv');
    const output = path.join(directory, 'rna.json');
    const fq = (name: string) => path.join(directory, name);
    await writeFile(sheet, [
      'replicate\tread1\tread2',
      `1\t${fq('r1-l1-R1.fq.gz')}\t${fq('r1-l1-R2.fq.gz')}`,
      `1\t${fq('r1-l2-R1.fq.gz')}\t${fq('r1-l2-R2.fq.gz')}`,
      `2\t${fq('r2-R1.fq.gz')}\t${fq('r2-R2.fq.gz')}`,
    ].join('\n'), 'utf8');
    runBuilder('build_rna_input.py', [
      '--sample-sheet', sheet,
      '--star-index', fq('star.tgz'), '--rsem-index', fq('rsem.tgz'),
      '--kallisto-index', fq('kallisto.idx'), '--chrom-sizes', fq('chrom.sizes'),
      '--gene-type-map', fq('gene-types.tsv'), '--strand-direction', 'reverse',
      '--bam-root', 'ENCODE_PE', '--threads', '12', '--align-ram-gb', '70',
      '--rsem-ram-gb', '65', '--kallisto-ram-gb', '35', '--signals-ram-gb', '32',
      '--task-disk', 'local-disk 300 HDD', '--output', output,
    ]);
    const payload = JSON.parse(await readFile(output, 'utf8')) as Record<string, unknown>;
    expect(payload['rna.fastqs_R1']).toEqual([
      [fq('r1-l1-R1.fq.gz'), fq('r1-l2-R1.fq.gz')],
      [fq('r2-R1.fq.gz')],
    ]);
    expect(payload['rna.fastqs_R2']).toEqual([
      [fq('r1-l1-R2.fq.gz'), fq('r1-l2-R2.fq.gz')],
      [fq('r2-R2.fq.gz')],
    ]);
    expect(payload).toMatchObject({
      'rna.endedness': 'paired',
      'rna.strandedness': 'stranded',
      'rna.strandedness_direction': 'reverse',
      'rna.align_ncpus': 12,
      'rna.align_ramGB': 70,
      'rna.rsem_ncpus': 12,
      'rna.rsem_ramGB': 65,
      'rna.kallisto_number_of_threads': 12,
      'rna.kallisto_ramGB': 35,
      'rna.bam_to_signals_ncpus': 12,
      'rna.bam_to_signals_ramGB': 32,
      'rna.mad_qc_disk': 'local-disk 300 HDD',
    });
  });

  it('把 ChIP technical lanes 写入官方 rep 数组并保持 control 配对', async () => {
    const directory = await temporaryDirectory();
    const sheet = path.join(directory, 'chip.tsv');
    const output = path.join(directory, 'chip.json');
    const fq = (name: string) => path.join(directory, name);
    await writeFile(sheet, [
      'type\treplicate\tread1\tread2',
      `chip\t1\t${fq('ip-l1-R1.fq.gz')}\t${fq('ip-l1-R2.fq.gz')}`,
      `chip\t1\t${fq('ip-l2-R1.fq.gz')}\t${fq('ip-l2-R2.fq.gz')}`,
      `control\t1\t${fq('ctl-R1.fq.gz')}\t${fq('ctl-R2.fq.gz')}`,
    ].join('\n'), 'utf8');
    runBuilder('build_chip_input.py', [
      '--sample-sheet', sheet, '--genome-tsv', fq('hg38.tsv'), '--genome-name', 'hg38',
      '--title', 'TF ChIP', '--output', output,
    ]);
    const payload = JSON.parse(await readFile(output, 'utf8')) as Record<string, unknown>;
    expect(payload).toMatchObject({
      'chip.pipeline_type': 'tf',
      'chip.peak_caller': 'spp',
      'chip.paired_end': true,
      'chip.true_rep_only': false,
      'chip.idr_thresh': 0.05,
    });
    expect(payload['chip.fastqs_rep1_R1']).toEqual([fq('ip-l1-R1.fq.gz'), fq('ip-l2-R1.fq.gz')]);
    expect(payload['chip.fastqs_rep1_R2']).toEqual([fq('ip-l1-R2.fq.gz'), fq('ip-l2-R2.fq.gz')]);
    expect(payload['chip.ctl_fastqs_rep1_R1']).toEqual([fq('ctl-R1.fq.gz')]);
    expect(payload['chip.ctl_fastqs_rep1_R2']).toEqual([fq('ctl-R2.fq.gz')]);
  });
});
