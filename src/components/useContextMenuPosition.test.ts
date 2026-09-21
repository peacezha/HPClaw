import { describe, it, expect } from 'vitest';
import { clampMenuToViewport } from './useContextMenuPosition';

// 视口 1024×768，菜单 200×300，边距 8
const VIEWPORT = { width: 1024, height: 768 };
const MENU = { width: 200, height: 300 };

describe('clampMenuToViewport', () => {
  it('左上象限：无溢出时保持鼠标点原位', () => {
    expect(clampMenuToViewport({ x: 100, y: 100 }, MENU, VIEWPORT)).toEqual({ x: 100, y: 100 });
  });

  it('右上象限：右侧溢出时左移贴右边界（留 8px）', () => {
    // 900 + 200 > 1024 - 8 → x = 1024 - 200 - 8
    expect(clampMenuToViewport({ x: 900, y: 100 }, MENU, VIEWPORT)).toEqual({ x: 816, y: 100 });
  });

  it('左下象限：底部溢出且上方空间够时向上展开', () => {
    // 700 + 300 > 768 - 8 → y = 700 - 300
    expect(clampMenuToViewport({ x: 100, y: 700 }, MENU, VIEWPORT)).toEqual({ x: 100, y: 400 });
  });

  it('右下象限：两个方向同时收拢', () => {
    expect(clampMenuToViewport({ x: 900, y: 700 }, MENU, VIEWPORT)).toEqual({ x: 816, y: 400 });
  });

  it('底部溢出且上方空间不够时贴底边界', () => {
    // 菜单高 700：y=400 → 400+700 > 760，翻转后 400-700 < 8 → y = 768-700-8
    expect(clampMenuToViewport({ x: 100, y: 400 }, { width: 200, height: 700 }, VIEWPORT))
      .toEqual({ x: 100, y: 60 });
  });

  it('菜单比视口还宽/高时收拢到边距处，不越左/上界', () => {
    const huge = { width: 2000, height: 2000 };
    const result = clampMenuToViewport({ x: 500, y: 500 }, huge, VIEWPORT);
    expect(result.x).toBe(8);
    expect(result.y).toBe(8);
  });

  it('修正后菜单右下角总在视口内（随机点扫掠）', () => {
    for (const x of [0, 200, 500, 800, 1020, 2000]) {
      for (const y of [0, 200, 500, 760, 1200]) {
        const p = clampMenuToViewport({ x, y }, MENU, VIEWPORT);
        expect(p.x).toBeGreaterThanOrEqual(8);
        expect(p.y).toBeGreaterThanOrEqual(8);
        expect(p.x + MENU.width).toBeLessThanOrEqual(VIEWPORT.width - 8);
        expect(p.y + MENU.height).toBeLessThanOrEqual(VIEWPORT.height - 8);
      }
    }
  });
});
