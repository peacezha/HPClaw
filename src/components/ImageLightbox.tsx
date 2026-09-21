// 全屏图片放大查看：深色遮罩 + 居中图片，默认适应视口，点击图片在
// "适应视口 / 原始尺寸"间切换（原始尺寸超出视口时滚动查看）。
// 点击背景、右上角关闭按钮或 Esc 退出。createPortal 挂到 body，
// z-index 2100：高于文件预览/传输浮层（.file-transfer-dialog-overlay = 2000）。
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ImageLightboxProps {
  /** 已解析的图片地址（view 端点 / http(s) / data: 等，调用方负责解析） */
  src: string;
  /** 标题（文件名或 alt），有则显示在顶栏 */
  title?: string;
  /** 原始像素尺寸，有则显示在顶栏 */
  dimensions?: { width: number; height: number };
  onClose: () => void;
}

export default function ImageLightbox({ src, title, dimensions, onClose }: ImageLightboxProps) {
  const [fitToViewport, setFitToViewport] = useState(true);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[2100] bg-black/85 overflow-auto"
      onClick={onClose}
      data-testid="image-lightbox"
      role="dialog"
      aria-label={title || '图片预览'}
    >
      <div className="fixed top-0 inset-x-0 z-10 flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <div className="min-w-0 text-xs text-zinc-300 truncate">
          {title && <span>{title}</span>}
          {dimensions && (
            <span className={title ? 'ml-2 text-zinc-500' : 'text-zinc-500'}>
              {dimensions.width}×{dimensions.height}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          aria-label="关闭图片预览"
          className="pointer-events-auto shrink-0 p-1.5 rounded-full bg-zinc-800/90 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {/* m-auto 而非容器 justify/align-center：图片超出视口时滚动区域仍覆盖整张图 */}
      <div className="min-h-full flex p-6 pt-14">
        <img
          src={src}
          alt={title || ''}
          onClick={(event) => {
            event.stopPropagation();
            setFitToViewport(v => !v);
          }}
          className={`m-auto ${fitToViewport ? 'max-w-[92vw] max-h-[82vh] object-contain cursor-zoom-in' : 'max-w-none cursor-zoom-out'}`}
          title={fitToViewport ? '点击查看原始尺寸' : '点击适应视口'}
        />
      </div>
    </div>,
    document.body,
  );
}
