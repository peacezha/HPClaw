import { Readable, Writable } from 'node:stream';
import { describe, expect, it, vi } from 'vitest';
import { uploadFileWithSftp } from './sftpUploadAdapter';

describe('uploadFileWithSftp', () => {
  it('streams binary source bytes into the shared session SFTP write stream and waits for completion', async () => {
    const received: Buffer[] = [];
    const remote = new Writable({
      write(chunk, _encoding, callback) {
        received.push(Buffer.from(chunk));
        callback();
      },
    });
    const sftp = { createWriteStream: vi.fn(() => remote) };

    await uploadFileWithSftp({
      sftp,
      localPath: 'C:\\uploads\\sample.bin',
      remotePath: '/scratch/sample.bin',
      createReadStream: () => Readable.from([Buffer.from([0, 255]), Buffer.from([10, 13])]),
    });

    expect(sftp.createWriteStream).toHaveBeenCalledWith('/scratch/sample.bin');
    expect(Buffer.concat(received)).toEqual(Buffer.from([0, 255, 10, 13]));
    expect(remote.writableFinished).toBe(true);
  });

  it('rejects when the SFTP write stream fails', async () => {
    const sftp = {
      createWriteStream: vi.fn(() => new Writable({
        write(_chunk, _encoding, callback) {
          callback(new Error('remote disk full'));
        },
      })),
    };

    await expect(uploadFileWithSftp({
      sftp,
      localPath: 'C:\\uploads\\sample.bin',
      remotePath: '/scratch/sample.bin',
      createReadStream: () => Readable.from([Buffer.from([1])]),
    })).rejects.toThrow('remote disk full');
  });
});
