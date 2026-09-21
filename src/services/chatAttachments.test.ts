import { describe, it, expect } from 'vitest';
import {
  appendAttachmentRefs,
  baseName,
  joinLocalPath,
  type ChatAttachment,
} from './chatAttachments';

describe('chatAttachments', () => {
  it('joins local paths with the separator matching the workspace style', () => {
    expect(joinLocalPath('E:\\work', 'attachments')).toBe('E:\\work\\attachments');
    expect(joinLocalPath('E:\\work\\', 'attachments')).toBe('E:\\work\\attachments');
    expect(joinLocalPath('/home/u/ws', 'attachments')).toBe('/home/u/ws/attachments');
    expect(joinLocalPath('/home/u/ws/', 'attachments')).toBe('/home/u/ws/attachments');
  });

  it('takes the last path segment as the file name for both separators', () => {
    expect(baseName('E:\\work\\attachments\\data.csv')).toBe('data.csv');
    expect(baseName('/home/u/ws/report.html')).toBe('report.html');
    expect(baseName('data.csv')).toBe('data.csv');
  });

  it('appends attachment path refs to the message text', () => {
    const attachments: ChatAttachment[] = [
      { id: '1', name: 'data.csv', refPath: 'attachments/data.csv' },
      { id: '2', name: 'reads.fastq', refPath: '~/hpclaw_uploads/reads.fastq' },
    ];
    const text = appendAttachmentRefs('分析这两个文件', attachments, false);
    expect(text).toBe('分析这两个文件\n\n附件:\n- attachments/data.csv\n- ~/hpclaw_uploads/reads.fastq');
  });

  it('uses the English header in English locale and supports attachments-only messages', () => {
    const attachments: ChatAttachment[] = [{ id: '1', name: 'a.txt', refPath: 'attachments/a.txt' }];
    expect(appendAttachmentRefs('', attachments, true)).toBe('Attachments:\n- attachments/a.txt');
  });

  it('returns the original text when there are no attachments', () => {
    expect(appendAttachmentRefs('hello', [], false)).toBe('hello');
  });
});
