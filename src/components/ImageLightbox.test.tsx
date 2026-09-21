// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import ImageLightbox from './ImageLightbox';

afterEach(cleanup);

describe('ImageLightbox', () => {
  it('renders the image in a portal with title and dimensions', () => {
    render(
      <ImageLightbox
        src="/api/files/view?path=%2Fhome%2Fu%2Fplot.png"
        title="plot.png"
        dimensions={{ width: 800, height: 600 }}
        onClose={() => {}}
      />,
    );

    const overlay = screen.getByTestId('image-lightbox');
    expect(overlay.parentElement).toBe(document.body);
    const img = overlay.querySelector('img');
    expect(img).not.toBeNull();
    expect(img!.getAttribute('src')).toBe('/api/files/view?path=%2Fhome%2Fu%2Fplot.png');
    expect(screen.getByText('plot.png')).toBeTruthy();
    expect(screen.getByText('800×600')).toBeTruthy();
  });

  it('closes via the close button, background click and Escape', () => {
    const onClose = vi.fn();
    render(<ImageLightbox src="/x.png" title="x.png" onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: '关闭图片预览' }));
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId('image-lightbox'));
    expect(onClose).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it('toggles between fit-to-viewport and original size on image click without closing', () => {
    const onClose = vi.fn();
    render(<ImageLightbox src="/x.png" onClose={onClose} />);

    const img = screen.getByTestId('image-lightbox').querySelector('img')!;
    expect(img.className).toContain('cursor-zoom-in');

    fireEvent.click(img);
    expect(img.className).toContain('cursor-zoom-out');
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(img);
    expect(img.className).toContain('cursor-zoom-in');
    expect(onClose).not.toHaveBeenCalled();
  });
});
