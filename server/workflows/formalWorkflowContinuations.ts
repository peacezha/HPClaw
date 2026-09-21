import fs from 'node:fs';
import path from 'node:path';
import { DATA_ROOT } from '../paths';
import { writeFileAtomic0600 } from '../dsh/fileUtils';

export interface WorkflowConnectionIdentity {
  host: string;
  port: number;
  username: string;
}

export interface FormalWorkflowContinuation {
  id: string;
  jobId: string;
  runDir: string;
  workflowId: string;
  runId: string;
  connectionKey: string;
  sessionId?: string;
  state: 'waiting_jobs' | 'job_finished' | 'resuming' | 'waiting_user';
  terminalStatus?: 'DONE' | 'EXIT';
  resumeCount: number;
  submittedAt: number;
  updatedAt: number;
}

export interface FormalWorkflowContinuationContext {
  runDir: string;
  workflowId: string;
  runId: string;
  connection: WorkflowConnectionIdentity;
  sessionId?: string;
}

const MAX_RECORDS = 500;
let rootOverride: string | undefined;
let cache: FormalWorkflowContinuation[] | undefined;

export function initFormalWorkflowContinuations(root: string): void {
  rootOverride = root;
  cache = undefined;
}

function filePath(): string {
  return path.join(rootOverride ?? DATA_ROOT, 'formal-workflow-continuations.json');
}

export function workflowConnectionKey(identity: WorkflowConnectionIdentity): string {
  return `${identity.username.trim().toLowerCase()}@${identity.host.trim().toLowerCase()}:${Number(identity.port) || 22}`;
}

function isRecord(value: unknown): value is FormalWorkflowContinuation {
  const record = value as FormalWorkflowContinuation;
  return Boolean(record
    && typeof record.id === 'string'
    && typeof record.jobId === 'string'
    && typeof record.runDir === 'string'
    && typeof record.connectionKey === 'string'
    && typeof record.updatedAt === 'number');
}

function load(): FormalWorkflowContinuation[] {
  if (cache) return cache;
  cache = [];
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath(), 'utf8'));
    if (Array.isArray(parsed)) cache = parsed.filter(isRecord);
  } catch { /* 首次运行或损坏时从空记录开始 */ }
  return cache;
}

function persist(): void {
  const records = (cache ?? []).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, MAX_RECORDS);
  cache = records;
  writeFileAtomic0600(filePath(), JSON.stringify(records, null, 2));
}

function recordId(connectionKey: string, jobId: string, runDir: string): string {
  return Buffer.from(`${connectionKey}\0${jobId}\0${runDir}`).toString('base64url');
}

export function addFormalWorkflowContinuations(
  jobIds: string[],
  context: FormalWorkflowContinuationContext,
): FormalWorkflowContinuation[] {
  const records = load();
  const connectionKey = workflowConnectionKey(context.connection);
  const now = Date.now();
  const added: FormalWorkflowContinuation[] = [];
  for (const jobId of jobIds) {
    if (!/^[\d._]+$/.test(jobId)) continue;
    const id = recordId(connectionKey, jobId, context.runDir);
    let record = records.find(item => item.id === id);
    if (!record) {
      record = {
        id,
        jobId,
        runDir: context.runDir,
        workflowId: context.workflowId,
        runId: context.runId,
        connectionKey,
        sessionId: context.sessionId,
        state: 'waiting_jobs',
        resumeCount: 0,
        submittedAt: now,
        updatedAt: now,
      };
      records.push(record);
    } else {
      record.sessionId = context.sessionId;
      record.state = 'waiting_jobs';
      record.terminalStatus = undefined;
      record.updatedAt = now;
    }
    added.push({ ...record });
  }
  if (added.length) persist();
  return added;
}

export function listPendingFormalWorkflowContinuations(identity: WorkflowConnectionIdentity): FormalWorkflowContinuation[] {
  const key = workflowConnectionKey(identity);
  return load().filter(record => record.connectionKey === key && record.state !== 'waiting_user').map(record => ({ ...record }));
}

export function markFormalWorkflowJobFinished(
  identity: WorkflowConnectionIdentity,
  jobId: string,
  terminalStatus: 'DONE' | 'EXIT',
  sessionId: string,
): FormalWorkflowContinuation[] {
  const key = workflowConnectionKey(identity);
  const matched = load().filter(record => record.connectionKey === key && record.jobId === jobId);
  const now = Date.now();
  for (const record of matched) {
    record.state = 'job_finished';
    record.terminalStatus = terminalStatus;
    record.sessionId = sessionId;
    record.updatedAt = now;
  }
  if (matched.length) persist();
  return matched.map(record => ({ ...record }));
}

export function markFormalWorkflowResuming(id: string): void {
  const record = load().find(item => item.id === id);
  if (!record) return;
  record.state = 'resuming';
  record.resumeCount += 1;
  record.updatedAt = Date.now();
  persist();
}

export function markFormalWorkflowWaitingUser(id: string): void {
  const record = load().find(item => item.id === id);
  if (!record) return;
  record.state = 'waiting_user';
  record.updatedAt = Date.now();
  persist();
}

export function removeFormalWorkflowContinuation(id: string): boolean {
  const records = load();
  const index = records.findIndex(record => record.id === id);
  if (index < 0) return false;
  records.splice(index, 1);
  persist();
  return true;
}

export function listAllFormalWorkflowContinuations(): FormalWorkflowContinuation[] {
  return load().map(record => ({ ...record }));
}
