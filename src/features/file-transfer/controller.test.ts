import { describe, expect, it } from 'vitest';
import { initialFileTransferState, reduceFileTransfer, type FileTransferAction } from './controller';

describe('file transfer reducer', () => {
  it('opens as an overlay, retains active transfers when closed, and exposes badge progress', () => {
    const task = {
      id: 't1',
      profileId: 'p1',
      direction: 'upload' as const,
      localPath: 'D:\\a',
      remotePath: '/a',
      temporaryPath: '/.a.part',
      totalBytes: 100,
      transferredBytes: 50,
      bytesPerSecond: 10,
      state: 'running' as const,
      conflictPolicy: 'ask' as const,
      verificationMode: 'size' as const,
      retryCount: 0,
      createdAt: 1,
      updatedAt: 1,
    };
    let state = reduceFileTransfer(initialFileTransferState, { type: 'drawer/open' });
    state = reduceFileTransfer(state, { type: 'transfer/upsert', task });
    state = reduceFileTransfer(state, { type: 'drawer/close' });
    expect(state.drawerOpen).toBe(false);
    expect(state.transfers.t1.state).toBe('running');
    expect(state.summary.progress).toBe(0.5);
  });

  it('profile/connected stores profileId and sessionId', () => {
    const state = reduceFileTransfer(initialFileTransferState, {
      type: 'profile/connected',
      profileId: 'prof-1',
      sessionId: 'sess-1',
    });
    expect(state.activeProfileId).toBe('prof-1');
    expect(state.sessionId).toBe('sess-1');
    expect(state.connectionState).toBe('connected');
  });

  it('profile/disconnected clears connection but retains transfers', () => {
    const withTransfer = reduceFileTransfer(initialFileTransferState, {
      type: 'transfer/upsert',
      task: {
        id: 't1',
        profileId: 'p1',
        direction: 'download',
        localPath: '/local/a',
        remotePath: '/remote/a',
        temporaryPath: '/.a.part',
        totalBytes: 200,
        transferredBytes: 100,
        bytesPerSecond: 20,
        state: 'running',
        conflictPolicy: 'ask',
        verificationMode: 'size',
        retryCount: 0,
        createdAt: 1,
        updatedAt: 1,
      },
    });
    const state = reduceFileTransfer(withTransfer, { type: 'profile/disconnected' });
    expect(state.activeProfileId).toBeNull();
    expect(state.sessionId).toBeNull();
    expect(state.connectionState).toBe('disconnected');
    expect(state.transfers.t1).toBeDefined();
    expect(state.transfers.t1.state).toBe('running');
  });

  it('pane/navigate updates path, entries, loading, error for the correct side', () => {
    const entries = [
      { name: 'a.txt', path: '/remote/a.txt', kind: 'file' as const, size: 100, modifiedAt: 10 },
    ];
    const state = reduceFileTransfer(initialFileTransferState, {
      type: 'pane/navigate',
      side: 'remote',
      path: '/remote',
      entries,
      loading: false,
      error: undefined,
    });
    expect(state.remote.path).toBe('/remote');
    expect(state.remote.entries).toEqual(entries);
    expect(state.remote.loading).toBe(false);
    expect(state.remote.error).toBeUndefined();
    // local pane unchanged
    expect(state.local.path).toBe('');
  });

  it('pane/navigate sets error on the correct side', () => {
    const state = reduceFileTransfer(initialFileTransferState, {
      type: 'pane/navigate',
      side: 'local',
      path: 'C:\\Users',
      entries: [],
      loading: false,
      error: 'Permission denied',
    });
    expect(state.local.path).toBe('C:\\Users');
    expect(state.local.error).toBe('Permission denied');
    expect(state.remote.error).toBeUndefined();
  });

  it('pane/select adds paths to selection on the correct pane', () => {
    let state = reduceFileTransfer(initialFileTransferState, {
      type: 'pane/select',
      side: 'local',
      paths: ['C:\\a.txt', 'C:\\b.txt'],
    });
    expect(state.local.selected.has('C:\\a.txt')).toBe(true);
    expect(state.local.selected.has('C:\\b.txt')).toBe(true);
    // adding again should still work (set semantics)
    state = reduceFileTransfer(state, {
      type: 'pane/select',
      side: 'local',
      paths: ['C:\\a.txt'],
    });
    expect(state.local.selected.size).toBe(2);
    // remote pane unaffected
    expect(state.remote.selected.size).toBe(0);
  });

  it('pane/deselectAll clears selection on the correct pane', () => {
    const withSelection = reduceFileTransfer(initialFileTransferState, {
      type: 'pane/select',
      side: 'remote',
      paths: ['/a.txt', '/b.txt'],
    });
    const state = reduceFileTransfer(withSelection, {
      type: 'pane/deselectAll',
      side: 'remote',
    });
    expect(state.remote.selected.size).toBe(0);
    // other side unaffected
    expect(state.local.selected.size).toBe(0);
  });

  it('conflict/open sets the conflict request', () => {
    const conflictRequest = {
      taskId: 't1',
      sourcePath: '/source/a',
      targetPath: '/target/a',
      existingSize: 500,
      existingModifiedAt: 1000,
    };
    const state = reduceFileTransfer(initialFileTransferState, {
      type: 'conflict/open',
      request: conflictRequest,
    });
    expect(state.conflict).toEqual(conflictRequest);
  });

  it('conflict/resolve updates the task policy and closes conflict', () => {
    const withConflict = reduceFileTransfer(initialFileTransferState, {
      type: 'conflict/open',
      request: {
        taskId: 't1',
        sourcePath: '/s',
        targetPath: '/t',
        existingSize: 100,
        existingModifiedAt: 50,
      },
    });
    const withTask = reduceFileTransfer(withConflict, {
      type: 'transfer/upsert',
      task: {
        id: 't1',
        profileId: 'p1',
        direction: 'download',
        localPath: '/l',
        remotePath: '/r',
        temporaryPath: '/.r.part',
        totalBytes: 100,
        transferredBytes: 0,
        bytesPerSecond: 0,
        state: 'running',
        conflictPolicy: 'ask',
        verificationMode: 'size',
        retryCount: 0,
        createdAt: 1,
        updatedAt: 1,
      },
    });
    const state = reduceFileTransfer(withTask, {
      type: 'conflict/resolve',
      taskId: 't1',
      policy: 'overwrite',
    });
    expect(state.transfers.t1.conflictPolicy).toBe('overwrite');
    expect(state.conflict).toBeNull();
  });

  it('conflict/close clears the conflict request', () => {
    const withConflict = reduceFileTransfer(initialFileTransferState, {
      type: 'conflict/open',
      request: {
        taskId: 't1',
        sourcePath: '/s',
        targetPath: '/t',
        existingSize: 100,
        existingModifiedAt: 50,
      },
    });
    const state = reduceFileTransfer(withConflict, { type: 'conflict/close' });
    expect(state.conflict).toBeNull();
  });

  it('transfer/restored merges multiple tasks and pauses incomplete ones', () => {
    const completed = {
      id: 't1',
      profileId: 'p1',
      direction: 'download' as const,
      localPath: '/l',
      remotePath: '/r',
      temporaryPath: '/.r.part',
      totalBytes: 100,
      transferredBytes: 100,
      bytesPerSecond: 50,
      state: 'completed' as const,
      conflictPolicy: 'ask' as const,
      verificationMode: 'size' as const,
      retryCount: 0,
      createdAt: 1,
      updatedAt: 2,
    };
    const incomplete = {
      id: 't2',
      profileId: 'p1',
      direction: 'upload' as const,
      localPath: 'C:\\x',
      remotePath: '/x',
      temporaryPath: '/.x.part',
      totalBytes: 200,
      transferredBytes: 50,
      bytesPerSecond: 10,
      state: 'running' as const,
      conflictPolicy: 'ask' as const,
      verificationMode: 'size' as const,
      retryCount: 0,
      createdAt: 1,
      updatedAt: 2,
    };
    const state = reduceFileTransfer(initialFileTransferState, {
      type: 'transfer/restored',
      tasks: [completed, incomplete],
    });
    expect(state.transfers.t1).toBeDefined();
    expect(state.transfers.t1.state).toBe('completed');
    expect(state.transfers.t2).toBeDefined();
    expect(state.transfers.t2.state).toBe('paused');
    expect(state.summary.active).toBe(0);
    // progress from completed: 100/100, incomplete: 50/200 => total 150/300 = 0.5
    expect(state.summary.progress).toBeCloseTo(150 / 300);
  });

  it('drawer/toggleMaximize toggles maximized state', () => {
    const first = reduceFileTransfer(initialFileTransferState, { type: 'drawer/toggleMaximize' });
    expect(first.maximized).toBe(true);
    const second = reduceFileTransfer(first, { type: 'drawer/toggleMaximize' });
    expect(second.maximized).toBe(false);
  });

  it('transfer/removed removes from record and updates summary', () => {
    const withTasks = [
      { type: 'transfer/upsert' as const, task: { id: 't1', profileId: 'p1', direction: 'download' as const, localPath: '/a', remotePath: '/b', temporaryPath: '/.b.part', totalBytes: 100, transferredBytes: 100, bytesPerSecond: 10, state: 'completed' as const, conflictPolicy: 'ask' as const, verificationMode: 'size' as const, retryCount: 0, createdAt: 1, updatedAt: 2 } },
      { type: 'transfer/upsert' as const, task: { id: 't2', profileId: 'p1', direction: 'upload' as const, localPath: '/c', remotePath: '/d', temporaryPath: '/.d.part', totalBytes: 200, transferredBytes: 50, bytesPerSecond: 5, state: 'running' as const, conflictPolicy: 'ask' as const, verificationMode: 'size' as const, retryCount: 0, createdAt: 1, updatedAt: 2 } },
    ] as FileTransferAction[];
    let state = initialFileTransferState;
    for (const action of withTasks) {
      state = reduceFileTransfer(state, action);
    }
    expect(state.summary.progress).toBeCloseTo(150 / 300);
    state = reduceFileTransfer(state, { type: 'transfer/removed', id: 't1' });
    expect(state.transfers.t1).toBeUndefined();
    expect(state.transfers.t2).toBeDefined();
    // only t2 remains: 50/200
    expect(state.summary.progress).toBeCloseTo(50 / 200);
    expect(state.summary.active).toBe(1);
  });

  it('transfer/upsert with completed task affects summary correctly', () => {
    const running = {
      id: 't1',
      profileId: 'p1',
      direction: 'upload' as const,
      localPath: '/a',
      remotePath: '/b',
      temporaryPath: '/.b.part',
      totalBytes: 100,
      transferredBytes: 30,
      bytesPerSecond: 5,
      state: 'running' as const,
      conflictPolicy: 'ask' as const,
      verificationMode: 'size' as const,
      retryCount: 0,
      createdAt: 1,
      updatedAt: 2,
    };
    let state = reduceFileTransfer(initialFileTransferState, { type: 'transfer/upsert', task: running });
    expect(state.summary.active).toBe(1);
    expect(state.summary.failed).toBe(0);

    // complete it
    state = reduceFileTransfer(state, {
      type: 'transfer/upsert',
      task: { ...running, transferredBytes: 100, state: 'completed' },
    });
    expect(state.summary.active).toBe(0);
    expect(state.summary.progress).toBe(1);
  });

  it('transfer/upsert merges into the tasks record and recomputes summary', () => {
    const running = {
      id: 't1',
      profileId: 'p1',
      direction: 'download' as const,
      localPath: '/a',
      remotePath: '/b',
      temporaryPath: '/.b.part',
      totalBytes: 200,
      transferredBytes: 100,
      bytesPerSecond: 10,
      state: 'running' as const,
      conflictPolicy: 'ask' as const,
      verificationMode: 'size' as const,
      retryCount: 0,
      createdAt: 1,
      updatedAt: 2,
    };
    let state = reduceFileTransfer(initialFileTransferState, { type: 'transfer/upsert', task: running });
    expect(state.transfers.t1).toEqual(running);
    expect(state.summary.active).toBe(1);
    expect(state.summary.progress).toBeCloseTo(100 / 200);

    // upsert with update
    state = reduceFileTransfer(state, {
      type: 'transfer/upsert',
      task: { ...running, transferredBytes: 150, bytesPerSecond: 20 },
    });
    expect(state.transfers.t1.transferredBytes).toBe(150);
    expect(state.transfers.t1.bytesPerSecond).toBe(20);
    expect(state.summary.progress).toBeCloseTo(150 / 200);
    expect(state.summary.active).toBe(1);

    // add failed task
    state = reduceFileTransfer(state, {
      type: 'transfer/upsert',
      task: {
        id: 't2',
        profileId: 'p1',
        direction: 'upload',
        localPath: '/c',
        remotePath: '/d',
        temporaryPath: '/.d.part',
        totalBytes: 100,
        transferredBytes: 20,
        bytesPerSecond: 2,
        state: 'failed',
        conflictPolicy: 'ask',
        verificationMode: 'size',
        retryCount: 1,
        createdAt: 1,
        updatedAt: 2,
      },
    });
    expect(state.summary.active).toBe(1); // only t1 is running
    expect(state.summary.failed).toBe(1);
    // progress: (150 + 20) / (200 + 100) = 170/300
    expect(state.summary.progress).toBeCloseTo(170 / 300);
  });

  it('pane/loading updates loading for the correct side', () => {
    const state = reduceFileTransfer(initialFileTransferState, {
      type: 'pane/loading',
      side: 'remote',
      loading: true,
    });
    expect(state.remote.loading).toBe(true);
    expect(state.local.loading).toBe(false);
  });

  it('pane/error sets error on the correct side', () => {
    const state = reduceFileTransfer(initialFileTransferState, {
      type: 'pane/error',
      side: 'local',
      error: 'Access denied',
    });
    expect(state.local.error).toBe('Access denied');
    expect(state.remote.error).toBeUndefined();
    expect(state.local.loading).toBe(false);
  });

  it('connection/state updates connection state', () => {
    const state = reduceFileTransfer(initialFileTransferState, {
      type: 'connection/state',
      connectionState: 'connecting',
    });
    expect(state.connectionState).toBe('connecting');
  });

  it('connection/state does not affect other fields', () => {
    const withSession = reduceFileTransfer(initialFileTransferState, {
      type: 'profile/connected',
      profileId: 'p1',
      sessionId: 's1',
    });
    const state = reduceFileTransfer(withSession, {
      type: 'connection/state',
      connectionState: 'reconnecting',
    });
    expect(state.connectionState).toBe('reconnecting');
    expect(state.activeProfileId).toBe('p1');
    expect(state.sessionId).toBe('s1');
  });
});
