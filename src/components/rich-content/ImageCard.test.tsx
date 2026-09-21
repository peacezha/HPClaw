// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import ImageCard from './ImageCard';
import type { CardContent } from './RendererRegistry';

afterEach(cleanup);

function makeImage(size: number): CardContent {
  return {
    type: 'image',
    filePath: '/home/u/out/plot.png',
    fileName: 'plot.png',
    content: 'aGk=',
    metadata: { size, mime: 'image/png' },
    sessionId: 'sess-1',
  };
}

describe('ImageCard inline threshold (3MB)', () => {
  it('renders a 1MB image inline without the click-to-load button', () => {
    render(<ImageCard content={makeImage(1024 * 1024)} />);
    expect(screen.queryByText(/点击加载图片/)).toBeNull();
    const img = document.querySelector('img');
    expect(img).not.toBeNull();
    expect(img!.getAttribute('src')).toBe(
      `/api/files/view?path=${encodeURIComponent('/home/u/out/plot.png')}&sessionId=sess-1`,
    );
  });

  it('keeps images above 3MB behind the click-to-load button', () => {
    render(<ImageCard content={makeImage(4 * 1024 * 1024)} />);
    expect(document.querySelector('img')).toBeNull();
    fireEvent.click(screen.getByText(/点击加载图片/));
    expect(document.querySelector('img')).not.toBeNull();
  });
});
