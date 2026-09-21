import type { ConnectionState, FileEntry, TransferTask, ConflictPolicy } from '@/shared/fileTransfer';

export interface PaneState {
  path: string;
  entries: FileEntry[];
  selected: Set<string>;
  loading: boolean;
  error?: string;
}

export interface TransferSummary {
  active: number;
  failed: number;
  progress: number;
}

export interface ConflictRequest {
  taskId: string;
  sourcePath: string;
  targetPath: string;
  existingSize: number;
  existingModifiedAt: number;
}

export interface FileTransferState {
  drawerOpen: boolean;
  maximized: boolean;
  activeProfileId: string | null;
  sessionId: string | null;
  connectionState: ConnectionState;
  local: PaneState;
  remote: PaneState;
  transfers: Record<string, TransferTask>;
  summary: TransferSummary;
  conflict: ConflictRequest | null;
}

export type FileTransferAction =
  | { type: 'drawer/open' }
  | { type: 'drawer/close' }
  | { type: 'drawer/toggleMaximize' }
  | { type: 'profile/connected'; profileId: string; sessionId: string }
  | { type: 'profile/disconnected' }
  | { type: 'connection/state'; connectionState: ConnectionState }
  | { type: 'pane/navigate'; side: 'local' | 'remote'; path: string; entries: FileEntry[]; loading?: boolean; error?: string }
  | { type: 'pane/loading'; side: 'local' | 'remote'; loading: boolean }
  | { type: 'pane/error'; side: 'local' | 'remote'; error: string }
  | { type: 'pane/select'; side: 'local' | 'remote'; paths: string[] }
  | { type: 'pane/deselectAll'; side: 'local' | 'remote' }
  | { type: 'transfer/upsert'; task: TransferTask }
  | { type: 'transfer/removed'; id: string }
  | { type: 'transfer/restored'; tasks: TransferTask[] }
  | { type: 'conflict/open'; request: ConflictRequest }
  | { type: 'conflict/resolve'; taskId: string; policy: ConflictPolicy }
  | { type: 'conflict/close' };

function createPaneState(): PaneState {
  return {
    path: '',
    entries: [],
    selected: new Set<string>(),
    loading: false,
    error: undefined,
  };
}

export const initialFileTransferState: FileTransferState = {
  drawerOpen: false,
  maximized: false,
  activeProfileId: null,
  sessionId: null,
  connectionState: 'disconnected',
  local: createPaneState(),
  remote: createPaneState(),
  transfers: {},
  summary: { active: 0, failed: 0, progress: 0 },
  conflict: null,
};

function computeSummary(transfers: Record<string, TransferTask>): TransferSummary {
  let active = 0;
  let failed = 0;
  let totalTransferred = 0;
  let totalBytes = 0;

  for (const task of Object.values(transfers)) {
    if (task.state === 'queued' || task.state === 'running') {
      active++;
    } else if (task.state === 'failed') {
      failed++;
    }
    totalTransferred += task.transferredBytes;
    totalBytes += task.totalBytes;
  }

  const progress = totalBytes > 0 ? totalTransferred / totalBytes : 0;

  return { active, failed, progress };
}

export function reduceFileTransfer(
  state: FileTransferState,
  action: FileTransferAction,
): FileTransferState {
  switch (action.type) {
    case 'drawer/open':
      return { ...state, drawerOpen: true };

    case 'drawer/close':
      return { ...state, drawerOpen: false };

    case 'drawer/toggleMaximize':
      return { ...state, maximized: !state.maximized };

    case 'profile/connected':
      return {
        ...state,
        activeProfileId: action.profileId,
        sessionId: action.sessionId,
        connectionState: 'connected',
      };

    case 'profile/disconnected':
      return {
        ...state,
        activeProfileId: null,
        sessionId: null,
        connectionState: 'disconnected',
      };

    case 'connection/state':
      return { ...state, connectionState: action.connectionState };

    case 'pane/navigate': {
      const pane = action.side === 'local' ? state.local : state.remote;
      const updatedPane: PaneState = {
        ...pane,
        path: action.path,
        entries: action.entries,
        loading: action.loading ?? false,
        error: action.error,
      };
      return {
        ...state,
        [action.side === 'local' ? 'local' : 'remote']: updatedPane,
      };
    }

    case 'pane/loading': {
      const pane = action.side === 'local' ? state.local : state.remote;
      const updatedPane: PaneState = { ...pane, loading: action.loading };
      return {
        ...state,
        [action.side === 'local' ? 'local' : 'remote']: updatedPane,
      };
    }

    case 'pane/error': {
      const pane = action.side === 'local' ? state.local : state.remote;
      const updatedPane: PaneState = {
        ...pane,
        error: action.error,
        loading: false,
      };
      return {
        ...state,
        [action.side === 'local' ? 'local' : 'remote']: updatedPane,
      };
    }

    case 'pane/select': {
      const pane = action.side === 'local' ? state.local : state.remote;
      const nextSelected = new Set(pane.selected);
      for (const p of action.paths) {
        nextSelected.add(p);
      }
      const updatedPane: PaneState = { ...pane, selected: nextSelected };
      return {
        ...state,
        [action.side === 'local' ? 'local' : 'remote']: updatedPane,
      };
    }

    case 'pane/deselectAll': {
      const pane = action.side === 'local' ? state.local : state.remote;
      const updatedPane: PaneState = { ...pane, selected: new Set<string>() };
      return {
        ...state,
        [action.side === 'local' ? 'local' : 'remote']: updatedPane,
      };
    }

    case 'transfer/upsert': {
      const nextTransfers = {
        ...state.transfers,
        [action.task.id]: action.task,
      };
      return {
        ...state,
        transfers: nextTransfers,
        summary: computeSummary(nextTransfers),
      };
    }

    case 'transfer/removed': {
      const nextTransfers = { ...state.transfers };
      delete nextTransfers[action.id];
      return {
        ...state,
        transfers: nextTransfers,
        summary: computeSummary(nextTransfers),
      };
    }

    case 'transfer/restored': {
      const nextTransfers = { ...state.transfers };
      for (const task of action.tasks) {
        // Pause incomplete tasks on restore
        const taskToStore =
          task.state === 'running'
            ? { ...task, state: 'paused' as const }
            : task;
        nextTransfers[task.id] = taskToStore;
      }
      return {
        ...state,
        transfers: nextTransfers,
        summary: computeSummary(nextTransfers),
      };
    }

    case 'conflict/open':
      return { ...state, conflict: action.request };

    case 'conflict/resolve': {
      const task = state.transfers[action.taskId];
      if (!task) return state;
      const updatedTask: TransferTask = {
        ...task,
        conflictPolicy: action.policy,
      };
      const nextTransfers = {
        ...state.transfers,
        [action.taskId]: updatedTask,
      };
      return {
        ...state,
        transfers: nextTransfers,
        conflict: null,
      };
    }

    case 'conflict/close':
      return { ...state, conflict: null };

    default:
      return state;
  }
}
