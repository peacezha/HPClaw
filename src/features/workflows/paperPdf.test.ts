import { describe, expect, it } from 'vitest';
import { paperPageText, selectPaperPages } from './paperPdf';

describe('paper PDF input', () => {
  it('reads the entire 16-page DAP paper in chronological order', () => {
    expect(selectPaperPages(16)).toEqual(Array.from({ length: 16 }, (_, index) => index + 1));
  });
  it('limits long papers to 50 pages including the last 10 in reading order', () => {
    const pages = selectPaperPages(120);
    expect(pages).toHaveLength(50);
    expect(pages.slice(-10)).toEqual([111,112,113,114,115,116,117,118,119,120]);
    expect(pages).toEqual([...pages].sort((a,b) => a-b));
  });
  it('preserves section line endings without emitting undefined for PDF marked-content records', () => {
    expect(paperPageText([{ str: 'Method', hasEOL: true }, { type: 'beginMarkedContent' }, { str: 'Reads were mapped.' }]))
      .toBe('Method\nReads were mapped. ');
  });
  it('joins touching ligature fragments but retains real inter-word spaces', () => {
    const fragment = (str: string, x: number, width: number) => ({ str, width, height: 10, transform: [10,0,0,10,x,100] });
    expect(paperPageText([fragment('Ortho',0,25), fragment('fi',25,5), fragment('nder',30,20),
      fragment('software',54,30)])).toBe('Orthofinder software ');
  });
});
