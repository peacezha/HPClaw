import { promises as fs } from 'node:fs';
import path from 'node:path';
import { dataPath } from '../paths';
import type { TransferTask } from '../../shared/fileTransfer';

const STORE_PATH = dataPath('transfers.json');

/**
 * Normalize tasks loaded from disk on restart.
 * - Drop completed/cancelled tasks entirely (history noise — keeps the
 *   queue from filling up with stale entries across restarts).
 * - Strip sessionId (transient, must be re-supplied by user).
 * - Reset incomplete work (anything still in flight) to 'paused';
 *   keep 'failed' so the user can retry.
 * - Zero out bytesPerSecond (stale after restart).
 */
export function normalizeRestoredTasks(tasks: TransferTask[]): TransferTask[] {
  return tasks
    .filter(task => task.state !== 'completed' && task.state !== 'cancelled')
    // remote-copy 依赖两端会话，重启后源会话未知，无法恢复，直接丢弃
    .filter(task => task.direction !== 'remote-copy')
    .map(task => ({
      ...task,
      sessionId: undefined,
      state: task.state === 'failed' ? 'failed' : 'paused',
      bytesPerSecond: 0,
    }));
}

/**
 * Persisted subset of TransferTask -- all fields from the shared contract
 * except transient `sessionId` and `bytesPerSecond`.
 */
interface PersistedTask {
  id: string;
  profileId: string;
  direction: TransferTask['direction'];
  localPath: string;
  remotePath: string;
  temporaryPath: string;
  totalBytes: number;
  transferredBytes: number;
  state: TransferTask['state'];
  conflictPolicy: TransferTask['conflictPolicy'];
  verificationMode: TransferTask['verificationMode'];
  retryCount: number;
  error?: string;
  createdAt: number;
  updatedAt: number;
}

function toPersisted(task: TransferTask): PersistedTask {
  return {
    id: task.id,
    profileId: task.profileId,
    direction: task.direction,
    localPath: task.localPath,
    remotePath: task.remotePath,
    temporaryPath: task.temporaryPath,
    totalBytes: task.totalBytes,
    transferredBytes: task.transferredBytes,
    state: task.state,
    conflictPolicy: task.conflictPolicy,
    verificationMode: task.verificationMode,
    retryCount: task.retryCount,
    error: task.error,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

/** Load persisted tasks from disk. Returns empty array on any failure. */
export async function loadTasks(): Promise<TransferTask[]> {
  try {
    const raw = await fs.readFile(STORE_PATH, 'utf-8');
    const tasks: unknown = JSON.parse(raw);
    if (!Array.isArray(tasks)) return [];
    return normalizeRestoredTasks(tasks as TransferTask[]);
  } catch {
    return [];
  }
}

/**
 * Atomically persist tasks to disk.
 * Writes to a sibling `.tmp` file first, then renames atomically.
 */
export async function saveTasks(tasks: TransferTask[]): Promise<void> {
  const dir = path.dirname(STORE_PATH);
  await fs.mkdir(dir, { recursive: true });
  const tmpPath = STORE_PATH + '.tmp';
  const data = JSON.stringify(tasks.map(toPersisted), null, 2);
  await fs.writeFile(tmpPath, data, 'utf-8');
  await fs.rename(tmpPath, STORE_PATH);
}
