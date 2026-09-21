import { describe, expect, it } from 'vitest';
import { ObservationStore } from './observationStore';
import type { ObservationEntry } from './types';

describe('ObservationStore', () => {
  it('adds and retrieves observations with importance filter', () => {
    const store = new ObservationStore(100);

    store.add({
      type: 'command',
      data: 'bsub -q normal myjob.sh',
      importance: 3,
      relatedSkills: ['lsf-ncpgr'],
      summary: '提交作业到normal队列',
    });

    store.add({
      type: 'output',
      data: 'Job <12345> submitted',
      importance: 3,
      relatedSkills: ['lsf-ncpgr'],
      summary: '作业已提交',
    });

    store.add({
      type: 'state_change',
      data: 'cd /tmp',
      importance: 1,
      summary: '切换目录',
    });

    const recent = store.recent({ importance: [2, 3] });
    expect(recent.length).toBe(2);
  });

  it('limits to max count', () => {
    const store = new ObservationStore(3);
    for (let i = 0; i < 10; i++) {
      store.add({ type: 'command', data: `cmd${i}`, importance: 2, summary: `cmd${i}` });
    }
    expect(store.count()).toBe(3);
  });

  it('generates structured summary for AI', () => {
    const store = new ObservationStore(10);
    store.add({ type: 'job_submit', data: 'Job <12345>', importance: 3, relatedSkills: ['lsf-ncpgr'], summary: '提交STAR比对作业' });
    store.add({ type: 'error', data: 'OOM killed', importance: 3, relatedSkills: ['ncpgr-software'], summary: '作业因内存不足被杀' });

    const summary = store.summarize(500);
    expect(summary).toContain('STAR比对');
    expect(summary).toContain('OOM');
  });
});
