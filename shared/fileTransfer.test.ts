import { readFileSync } from 'node:fs';
import { builtinModules } from 'node:module';
import { describe, expect, it } from 'vitest';
import { canTransitionTransfer, makeTemporaryTransferName } from './fileTransfer';
import type { TransferState } from './fileTransfer';

const transferStates: TransferState[] = [
  'queued',
  'running',
  'paused',
  'retrying',
  'completed',
  'failed',
  'cancelled',
];

const allowedTransitions: Record<TransferState, readonly TransferState[]> = {
  queued: ['running', 'paused', 'cancelled'],
  running: ['paused', 'retrying', 'completed', 'failed', 'cancelled'],
  paused: ['queued', 'cancelled'],
  retrying: ['running', 'paused', 'failed', 'cancelled'],
  completed: [],
  failed: ['queued', 'cancelled'],
  cancelled: [],
};

describe('transfer contracts', () => {
  it('keeps the shared runtime free of Node builtin imports', () => {
    const source = readFileSync(new URL('./fileTransfer.ts', import.meta.url), 'utf8');
    const imports = [...source.matchAll(/(?:from|import\()\s*['"]([^'"]+)/g)]
      .map((match) => match[1]);
    const builtinRoots = new Set(builtinModules.map((name) => name.split('/')[0]));
    expect(imports.filter((name) => builtinRoots.has(name.replace(/^node:/, '').split('/')[0])))
      .toEqual([]);
  });

  it.each(
    transferStates.flatMap((from) => transferStates.map((to) => [from, to] as const)),
  )('checks the complete transition matrix for %s -> %s', (from, to) => {
    expect(canTransitionTransfer(from, to)).toBe(allowedTransitions[from].includes(to));
  });

  it('uses a hidden task-specific temporary name for a POSIX path', () => {
    expect(makeTemporaryTransferName('/data/a.fastq.gz', 'task-7', 'remote'))
      .toBe('/data/.a.fastq.gz.hpclaw-task-7.part');
  });

  it('uses Windows separators in a local temporary path', () => {
    expect(makeTemporaryTransferName('D:\\BioProject\\reads.fastq.gz', 'task-8', 'local'))
      .toBe('D:\\BioProject\\.reads.fastq.gz.hpclaw-task-8.part');
  });

  it('preserves mixed separators in an explicit local path', () => {
    expect(makeTemporaryTransferName('D:\\Bio/read.fastq', 'task-9', 'local'))
      .toBe('D:\\Bio/.read.fastq.hpclaw-task-9.part');
  });

  it('keeps a literal backslash in an explicit remote filename', () => {
    expect(makeTemporaryTransferName('/data/read\\part.fastq', 'task-10', 'remote'))
      .toBe('/data/.read\\part.fastq.hpclaw-task-10.part');
  });

  it('creates a sibling temporary name for a Windows UNC path', () => {
    expect(makeTemporaryTransferName('\\\\server\\share\\reads.fastq', 'task-11', 'local'))
      .toBe('\\\\server\\share\\.reads.fastq.hpclaw-task-11.part');
  });

  it('preserves a forward-slash UNC prefix for an explicit local path', () => {
    expect(makeTemporaryTransferName('//server/share/reads.fastq', 'task-12', 'local'))
      .toBe('//server/share/.reads.fastq.hpclaw-task-12.part');
  });

  it('requires callers to specify the file side', () => {
    const callWithoutSide = makeTemporaryTransferName as unknown as (
      targetPath: string,
      taskId: string,
    ) => string;
    expect(() => callWithoutSide('/data/a.fastq.gz', 'task-7'))
      .toThrow('file side is required');
  });

  it.each([
    '',
    '../../../escape',
    'bad/id',
    'bad\\id',
    '.',
    'task.7',
    'task 7',
    'task@7',
  ])('rejects unsafe task ID %j', (taskId) => {
    expect(() => makeTemporaryTransferName('/data/a.fastq.gz', taskId, 'remote'))
      .toThrow('task ID is invalid');
  });
});
