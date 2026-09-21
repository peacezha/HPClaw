import { useLayoutEffect, useState } from 'react';
import type { CSSProperties, RefObject } from 'react';

/** 菜单与视口边界之间保留的间距（px） */
export const CONTEXT_MENU_VIEWPORT_MARGIN = 8;

export interface MenuSize {
  width: number;
  height: number;
}

/**
 * 视口收拢：右键菜单按 fixed 定位直接放在鼠标点，会在窗口右/下沿被裁。
 * - 右侧溢出 → 左移，贴右边界（留 margin）；
 * - 底部溢出 → 优先向上展开（菜单底边贴鼠标点），上方空间不够再贴底边界；
 * - 最终坐标不小于 margin（菜单比视口还大时靠左上角，由 CSS max-height 滚动兜底）。
 */
export function clampMenuToViewport(
  point: { x: number; y: number },
  menu: MenuSize,
  viewport: MenuSize,
  margin = CONTEXT_MENU_VIEWPORT_MARGIN,
): { x: number; y: number } {
  let { x, y } = point;

  if (x + menu.width > viewport.width - margin) {
    x = viewport.width - menu.width - margin;
  }
  // 最终夹取：光标本身越出视口等极端情形下也不越界（菜单比视口大时收拢到 margin）
  x = Math.max(margin, Math.min(x, viewport.width - menu.width - margin));

  if (y + menu.height > viewport.height - margin) {
    const flipped = y - menu.height;
    y = flipped >= margin ? flipped : viewport.height - menu.height - margin;
  }
  y = Math.max(margin, Math.min(y, viewport.height - menu.height - margin));

  return { x, y };
}

/**
 * 右键菜单定位 hook：菜单先按鼠标点渲染，useLayoutEffect 里实测菜单宽高后
 * 收拢进视口（layout effect 在浏览器绘制前同步执行，不会闪现未修正位置）。
 * 传 null 表示菜单关闭，返回 undefined。
 */
export function useContextMenuPosition<T extends HTMLElement>(
  menuRef: RefObject<T | null>,
  x: number | null,
  y: number | null,
): CSSProperties | undefined {
  const [style, setStyle] = useState<CSSProperties | undefined>(undefined);

  useLayoutEffect(() => {
    if (x === null || y === null) {
      setStyle(undefined);
      return;
    }
    const rect = menuRef.current?.getBoundingClientRect();
    const clamped = clampMenuToViewport(
      { x, y },
      { width: rect?.width ?? 0, height: rect?.height ?? 0 },
      { width: window.innerWidth, height: window.innerHeight },
    );
    setStyle({ left: `${clamped.x}px`, top: `${clamped.y}px` });
  }, [menuRef, x, y]);

  return style;
}
