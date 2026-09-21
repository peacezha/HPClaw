// 消息气泡底部的"检测到的文件"横条：图片路径不再只显示文本——直接内联出图
// （buildChatFileViewUrls 候选依次重试，全失败回退路径文本，点击全屏放大）；
// csv/pdf/html 等保持路径 + 下载。assistant 消息的图片条目由 RichContentMessage
// 的 ImageCard 覆盖，这里跳过，避免同一张图出现两次。
import { useMemo, useState } from 'react';
import { Download, FileSearch } from 'lucide-react';
import { buildChatFileViewUrls, buildFileViewUrl, isWindowsAbsolutePath } from './rich-content/ContentFetcher';
import ImageLightbox from './ImageLightbox';

const IMAGE_EXT_RE = /\.(png|jpe?g|gif|svg|bmp|webp)$/i;

function hasClusterSession(sessionId?: string | null): boolean {
  return !!sessionId && sessionId !== 'local-workbench';
}

function fileName(filePath: string): string {
  return filePath.split(/[\\/]/).pop() || filePath;
}

/** 下载：集群会话走 /api/files/download；本地（无会话或 Windows 绝对路径）用 view 字节流另存 */
function downloadFile(filePath: string, sessionId?: string | null, workspace?: string): void {
  const a = document.createElement('a');
  if (hasClusterSession(sessionId) && !isWindowsAbsolutePath(filePath)) {
    a.href = `/api/files/download?path=${encodeURIComponent(filePath)}&sessionId=${encodeURIComponent(sessionId!)}`;
  } else {
    a.href = buildFileViewUrl(filePath, { local: true, workspace });
  }
  a.download = fileName(filePath);
  a.click();
}

/** 单条图片条目：候选 view URL 依次尝试（集群/本地自动路由），全部失败回退路径文本 */
function StripImage({ path, sessionId, workspace }: { path: string; sessionId?: string | null; workspace?: string }) {
  const candidates = useMemo(
    () => buildChatFileViewUrls(path, { sessionId, workspace }),
    [path, sessionId, workspace],
  );
  const [attempt, setAttempt] = useState(0);
  const [expanded, setExpanded] = useState(false);

  if (attempt >= candidates.length) {
    // 全部候选失败：下方路径行已展示 code 文本，这里不再重复
    return null;
  }
  const src = candidates[attempt];
  return (
    <>
      <img
        src={src}
        alt={fileName(path)}
        loading="lazy"
        onError={() => setAttempt(value => value + 1)}
        onClick={() => setExpanded(true)}
        className="max-w-full max-h-56 object-contain rounded-lg border border-scholar-700/60 bg-scholar-950/40 cursor-pointer hover:border-accent/50"
        title="点击放大"
      />
      {expanded && (
        <ImageLightbox src={src} title={fileName(path)} onClose={() => setExpanded(false)} />
      )}
    </>
  );
}

interface DetectedFilesStripProps {
  files: string[];
  role: 'system' | 'user' | 'assistant';
  /** 集群会话：决定图片/下载走集群还是本地文件端点 */
  sessionId?: string | null;
  /** 本地模式下的工作区（/api/local/files/* 的解析根之一） */
  workspace?: string;
}

export default function DetectedFilesStrip({ files, role, sessionId, workspace }: DetectedFilesStripProps) {
  // assistant 的图片条目交给 RichContentMessage 的 ImageCard，避免同图两次
  const entries = files.filter(f => !(role === 'assistant' && IMAGE_EXT_RE.test(f)));
  if (entries.length === 0) return null;

  return (
    <div className="mt-2 pt-2 border-t border-scholar-600/50" data-testid="detected-files-strip">
      <div className="text-xs text-accent mb-1 flex items-center gap-1">
        <FileSearch className="w-3 h-3" /> 检测到的文件
      </div>
      {entries.map((f, i) => (
        <div key={i} className="flex flex-col items-start gap-1 text-[10px] mt-1">
          {IMAGE_EXT_RE.test(f) && <StripImage path={f} sessionId={sessionId} workspace={workspace} />}
          <div className="flex items-center gap-1">
            {IMAGE_EXT_RE.test(f) ? (
              <code className="text-scholar-500 break-all">{f}</code>
            ) : (
              <code className="text-scholar-300 bg-scholar-900 px-1 py-0.5 rounded break-all">{f}</code>
            )}
            <button
              type="button"
              onClick={() => downloadFile(f, sessionId, workspace)}
              className="text-accent hover:text-accent-light p-0.5"
              aria-label="下载文件"
              title="下载文件"
            >
              <Download className="w-3 h-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
