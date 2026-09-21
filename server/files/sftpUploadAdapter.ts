import { createReadStream as createFileReadStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import type { Readable, Writable } from 'node:stream';

export interface SftpWriteStreamProvider {
  createWriteStream(remotePath: string): Writable;
}

export interface SftpUploadOptions {
  sftp: SftpWriteStreamProvider;
  localPath: string;
  remotePath: string;
  createReadStream?: (localPath: string) => Readable;
}

export async function uploadFileWithSftp({
  sftp,
  localPath,
  remotePath,
  createReadStream = createFileReadStream,
}: SftpUploadOptions): Promise<void> {
  await pipeline(createReadStream(localPath), sftp.createWriteStream(remotePath));
}
