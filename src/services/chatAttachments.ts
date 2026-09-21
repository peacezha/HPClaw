/**
 * 对话附件：只记录路径引用，不在内存/IndexedDB 里保存文件内容。
 * - 本地模式：文件由桌面端 IPC 复制进工作区 attachments/ 子目录，引用为工作区相对路径
 * - 集群模式：文件经传输队列上传到 ~/hpclaw_uploads/，引用为 ~ 开头的远程路径
 */

export interface ChatAttachment {
  id: string;
  /** 展示用文件名（本地复制后可能与原文件不同——重名自动加序号） */
  name: string;
  /** 随消息发给 AI 的路径引用 */
  refPath: string;
}

/** 集群模式下对话附件的固定上传目录（SFTP 相对路径，解析到用户家目录） */
export const CLUSTER_ATTACHMENT_DIR = 'hpclaw_uploads';

/** 本地路径拼接：工作区可能是 Windows（E:\work）或 POSIX（/home/u）风格 */
export function joinLocalPath(dir: string, name: string): string {
  const trimmed = dir.replace(/[\\/]+$/, '');
  const separator = /[\\]/.test(dir) || /^[A-Za-z]:/.test(dir) ? '\\' : '/';
  return `${trimmed}${separator}${name}`;
}

/** 取路径的最后一段作为文件名（兼容两种分隔符） */
export function baseName(path: string): string {
  return path.split(/[\\/]/).filter(Boolean).pop() || path;
}

/**
 * 发送时把附件路径追加进消息文本：
 * "看看这个数据\n\n附件：\n- attachments/data.csv"
 */
export function appendAttachmentRefs(
  text: string,
  attachments: ChatAttachment[],
  isEnglish: boolean,
): string {
  if (attachments.length === 0) return text;
  const header = isEnglish ? 'Attachments' : '附件';
  const lines = attachments.map(item => `- ${item.refPath}`).join('\n');
  return text ? `${text}\n\n${header}:\n${lines}` : `${header}:\n${lines}`;
}
