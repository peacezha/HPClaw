import { describe, it, expect } from 'vitest';
import { buildSyncPlan, type SyncOptions } from './syncPlanUtils';
import type { FileEntry } from '@/shared/fileTransfer';

function entry(overrides: Partial<FileEntry> & { name: string }): FileEntry {
  return {
    path: `/${overrides.name}`,
    kind: 'file' as const,
    size: 10,
    modifiedAt: 100,
    ...overrides,
  };
}

describe('buildSyncPlan', () => {
  const defaultOptions: SyncOptions = { deleteExtraneous: false };

  it('never includes target deletion unless deleteExtraneous is enabled', () => {
    const source: FileEntry[] = [
      entry({ name: 'a.txt', path: '/src/a.txt', size: 10, modifiedAt: 100 }),
    ];
    const target: FileEntry[] = [
      entry({ name: 'a.txt', path: '/dst/a.txt', size: 10, modifiedAt: 100 }),
      entry({ name: 'extra.txt', path: '/dst/extra.txt', size: 20, modifiedAt: 100 }),
    ];
    expect(buildSyncPlan(source, target, { deleteExtraneous: false }).summary.delete).toBe(0);
    expect(buildSyncPlan(source, target, { deleteExtraneous: true }).summary.delete).toBe(1);
  });

  it('skips identical files (same name, kind, size, modifiedAt)', () => {
    const source: FileEntry[] = [
      entry({ name: 'a.txt', path: '/src/a.txt', size: 100, modifiedAt: 1000 }),
    ];
    const target: FileEntry[] = [
      entry({ name: 'a.txt', path: '/dst/a.txt', size: 100, modifiedAt: 1000 }),
    ];
    const plan = buildSyncPlan(source, target, defaultOptions);
    expect(plan.summary.skip).toBe(1);
    expect(plan.summary.upload).toBe(0);
    expect(plan.summary.download).toBe(0);
    expect(plan.summary.conflict).toBe(0);
    expect(plan.actions.every((a) => a.kind === 'skip')).toBe(true);
  });

  it('produces conflict for files with same name but different size', () => {
    const source: FileEntry[] = [
      entry({ name: 'a.txt', path: '/src/a.txt', size: 200, modifiedAt: 1000 }),
    ];
    const target: FileEntry[] = [
      entry({ name: 'a.txt', path: '/dst/a.txt', size: 100, modifiedAt: 1000 }),
    ];
    const plan = buildSyncPlan(source, target, defaultOptions);
    expect(plan.summary.conflict).toBe(1);
    expect(plan.actions.every((a) => a.kind === 'conflict')).toBe(true);
  });

  it('produces conflict for files with same name but different modifiedAt', () => {
    const source: FileEntry[] = [
      entry({ name: 'a.txt', path: '/src/a.txt', size: 100, modifiedAt: 2000 }),
    ];
    const target: FileEntry[] = [
      entry({ name: 'a.txt', path: '/dst/a.txt', size: 100, modifiedAt: 1000 }),
    ];
    const plan = buildSyncPlan(source, target, defaultOptions);
    expect(plan.summary.conflict).toBe(1);
  });

  it('produces upload for source-only files when target is remote', () => {
    const source: FileEntry[] = [
      entry({ name: 'a.txt', path: '/local/a.txt', size: 100, modifiedAt: 1000 }),
    ];
    const target: FileEntry[] = [];
    const plan = buildSyncPlan(source, target, defaultOptions);
    expect(plan.summary.upload).toBe(1);
    expect(plan.actions[0].kind).toBe('upload');
  });

  it('target-only files are skipped when deleteExtraneous is false', () => {
    const source: FileEntry[] = [];
    const target: FileEntry[] = [
      entry({ name: 'remote_only.txt', path: '/remote/remote_only.txt', size: 50, modifiedAt: 500 }),
    ];
    const plan = buildSyncPlan(source, target, defaultOptions);
    expect(plan.summary.skip).toBe(1);
  });

  it('deletes extraneous target files when deleteExtraneous is true', () => {
    const source: FileEntry[] = [
      entry({ name: 'common.txt', path: '/src/common.txt', size: 100, modifiedAt: 1000 }),
    ];
    const target: FileEntry[] = [
      entry({ name: 'common.txt', path: '/dst/common.txt', size: 100, modifiedAt: 1000 }),
      entry({ name: 'to_delete.txt', path: '/dst/to_delete.txt', size: 50, modifiedAt: 500 }),
      entry({ name: 'also_delete.bin', path: '/dst/also_delete.bin', size: 200, modifiedAt: 800 }),
    ];
    const plan = buildSyncPlan(source, target, { deleteExtraneous: true });
    expect(plan.summary.skip).toBe(1); // common.txt
    expect(plan.summary.delete).toBe(2); // to_delete.txt, also_delete.bin
  });

  it('computes summary counts correctly for mixed scenario', () => {
    const source: FileEntry[] = [
      entry({ name: 'upload_me.txt', path: '/src/upload_me.txt', size: 100, modifiedAt: 1000 }),
      entry({ name: 'conflict.txt', path: '/src/conflict.txt', size: 200, modifiedAt: 2000 }),
      entry({ name: 'skip_me.txt', path: '/src/skip_me.txt', size: 300, modifiedAt: 3000 }),
    ];
    const target: FileEntry[] = [
      entry({ name: 'conflict.txt', path: '/dst/conflict.txt', size: 150, modifiedAt: 2000 }),
      entry({ name: 'skip_me.txt', path: '/dst/skip_me.txt', size: 300, modifiedAt: 3000 }),
      entry({ name: 'extra.txt', path: '/dst/extra.txt', size: 400, modifiedAt: 4000 }),
    ];
    const plan = buildSyncPlan(source, target, { deleteExtraneous: true });
    expect(plan.summary.upload).toBe(1);
    expect(plan.summary.conflict).toBe(1);
    expect(plan.summary.skip).toBe(1);
    expect(plan.summary.delete).toBe(1);
    expect(plan.actions.length).toBe(4);
  });

  it('handles empty source and target', () => {
    const plan = buildSyncPlan([], [], defaultOptions);
    expect(plan.actions).toEqual([]);
    expect(plan.summary).toEqual({ upload: 0, download: 0, delete: 0, conflict: 0, skip: 0 });
  });
});
