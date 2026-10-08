/** Keep PDF pages in reading order; prioritize tail pages without appending middle pages after References. */
export function selectPaperPages(total: number, limit = 50): number[] {
  if (!Number.isInteger(total) || total < 1 || !Number.isInteger(limit) || limit < 1) return [];
  if (total <= limit) return Array.from({ length: total }, (_, index) => index + 1);
  const tail = Math.min(10, Math.floor(limit / 3));
  return [...Array.from({ length: limit - tail }, (_, index) => index + 1),
    ...Array.from({ length: tail }, (_, index) => total - tail + index + 1)];
}

export function paperPageText(items: readonly unknown[]): string {
  const fragments = items.filter((item): item is {
    str: string; hasEOL?: boolean; transform?: number[]; width?: number; height?: number;
  } => Boolean(item && typeof item === 'object' && 'str' in item && typeof item.str === 'string'));
  return fragments.map((item, index) => {
    let separator = item.hasEOL ? '\n' : ' ';
    const next = fragments[index + 1];
    if (!item.hasEOL && next) {
      if (/\s$/.test(item.str) || /^\s/.test(next.str)) separator = '';
      else if (item.transform && next.transform && Number.isFinite(item.width)) {
        const height = Math.abs(item.height || item.transform[3] || 1);
        const gap = next.transform[4] - item.transform[4] - item.width!;
        const baseline = Math.abs(next.transform[5] - item.transform[5]);
        // Adjacent glyph fragments (especially fi/fl ligatures) are parts of the
        // same word. Do not turn OrthoFinder into "Ortho fi nder".
        if (baseline < height * 0.2 && Math.abs(gap) < height * 0.15) separator = '';
      }
    }
    return item.str + separator;
  }).join('');
}
