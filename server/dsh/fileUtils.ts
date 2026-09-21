// dsh 模块共用的小文件工具：原子写（tmp + rename）+ 0600 权限（Windows 尽力而为）。

import fs from 'node:fs';
import path from 'node:path';
import { ensureDir } from '../paths';

export function writeFileAtomic0600(file: string, content: string): void {
  ensureDir(path.dirname(file));
  const tmp = `${file}.tmp-${process.pid}-${Date.now()}`;
  fs.writeFileSync(tmp, content, { mode: 0o600 });
  try {
    fs.renameSync(tmp, file);
  } catch (err) {
    try { fs.rmSync(tmp, { force: true }); } catch { /* 清理临时文件失败可忽略 */ }
    throw err;
  }
  // Windows 上 chmod 只部分生效（无真正的 POSIX 权限位），尽力而为即可。
  try { fs.chmodSync(file, 0o600); } catch { /* best effort */ }
}
