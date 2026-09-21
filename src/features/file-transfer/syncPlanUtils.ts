import type { FileEntry } from '@/shared/fileTransfer';

export type SyncActionKind = 'upload' | 'download' | 'delete' | 'conflict' | 'skip';

export interface SyncAction {
  kind: SyncActionKind;
  sourcePath: string;
  targetPath: string;
  name: string;
  size: number;
}

export interface SyncOptions {
  deleteExtraneous: boolean;
}

export interface SyncPlan {
  actions: SyncAction[];
  summary: { upload: number; download: number; delete: number; conflict: number; skip: number };
}

function filesAreIdentical(a: FileEntry, b: FileEntry): boolean {
  return a.kind === b.kind && a.size === b.size && a.modifiedAt === b.modifiedAt;
}

/**
 * Build a sync plan comparing source and target file entries.
 *
 * - Files in source but not in target → "upload" (source→target direction)
 * - Files in target but not in source → "skip" (or "delete" if deleteExtraneous is true)
 * - Files in both, identical → "skip"
 * - Files in both, different → "conflict"
 */
export function buildSyncPlan(
  source: FileEntry[],
  target: FileEntry[],
  options: SyncOptions,
): SyncPlan {
  const sourceByName = new Map<string, FileEntry>();
  for (const entry of source) {
    sourceByName.set(entry.name, entry);
  }

  const targetByName = new Map<string, FileEntry>();
  for (const entry of target) {
    targetByName.set(entry.name, entry);
  }

  const actions: SyncAction[] = [];
  const summary = { upload: 0, download: 0, delete: 0, conflict: 0, skip: 0 };

  // Check all source files
  for (const [name, srcEntry] of sourceByName) {
    const tgtEntry = targetByName.get(name);
    if (!tgtEntry) {
      // Source only → upload
      actions.push({
        kind: 'upload',
        sourcePath: srcEntry.path,
        targetPath: '',
        name: srcEntry.name,
        size: srcEntry.size,
      });
      summary.upload++;
    } else if (filesAreIdentical(srcEntry, tgtEntry)) {
      // Identical → skip
      actions.push({
        kind: 'skip',
        sourcePath: srcEntry.path,
        targetPath: tgtEntry.path,
        name: srcEntry.name,
        size: srcEntry.size,
      });
      summary.skip++;
    } else {
      // Different → conflict
      actions.push({
        kind: 'conflict',
        sourcePath: srcEntry.path,
        targetPath: tgtEntry.path,
        name: srcEntry.name,
        size: srcEntry.size,
      });
      summary.conflict++;
    }
  }

  // Check target files not in source
  for (const [name, tgtEntry] of targetByName) {
    if (!sourceByName.has(name)) {
      if (options.deleteExtraneous) {
        actions.push({
          kind: 'delete',
          sourcePath: '',
          targetPath: tgtEntry.path,
          name: tgtEntry.name,
          size: tgtEntry.size,
        });
        summary.delete++;
      } else {
        actions.push({
          kind: 'skip',
          sourcePath: '',
          targetPath: tgtEntry.path,
          name: tgtEntry.name,
          size: tgtEntry.size,
        });
        summary.skip++;
      }
    }
  }

  return { actions, summary };
}
