// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import DshUiSpecCard from './DshUiSpecCard';
import type { DshUiSpec } from './DshUiSpec';

afterEach(cleanup);

describe('DshUiSpecCard', () => {
  it('renders the title and a real table from a table item', () => {
    const spec: DshUiSpec = {
      title: '校验结果',
      gap: 12,
      items: [
        { type: 'table', columns: ['名称', '状态'], rows: [['按钮', '通过'], ['输入框', '缺失']] },
      ],
    };
    render(<DshUiSpecCard spec={spec} local />);

    expect(screen.getByText('校验结果')).toBeTruthy();
    expect(screen.getByText('名称')).toBeTruthy();
    expect(screen.getByText('按钮')).toBeTruthy();
    expect(screen.getByText('缺失')).toBeTruthy();
  });

  it('renders object rows keyed by columns when rows are objects', () => {
    const spec: DshUiSpec = {
      items: [{ type: 'table', columns: ['name', 'status'], rows: [{ name: '按钮', status: '通过' }] }],
    };
    render(<DshUiSpecCard spec={spec} local />);

    expect(screen.getByText('name')).toBeTruthy();
    expect(screen.getByText('按钮')).toBeTruthy();
    expect(screen.getByText('通过')).toBeTruthy();
  });

  it('renders text items as paragraphs and links as anchors', () => {
    const spec: DshUiSpec = {
      items: [
        { type: 'text', text: '整体布局合理' },
        { type: 'link', href: 'https://example.com/report', text: '查看完整报告' },
      ],
    };
    render(<DshUiSpecCard spec={spec} local />);

    expect(screen.getByText('整体布局合理')).toBeTruthy();
    const anchor = screen.getByText('查看完整报告').closest('a');
    expect(anchor).not.toBeNull();
    expect(anchor!.getAttribute('href')).toBe('https://example.com/report');
    expect(anchor!.getAttribute('target')).toBe('_blank');
  });

  it('points local image items at /api/local/files/view with the workspace query', () => {
    const spec: DshUiSpec = {
      items: [{ type: 'image', path: '.dsh-vision-toolkit/artifacts/R16_D_view.png', text: '视图' }],
    };
    render(<DshUiSpecCard spec={spec} local workspace={'C:\\work'} />);

    const img = document.querySelector('img');
    expect(img).not.toBeNull();
    expect(img!.getAttribute('src')).toBe(
      `/api/local/files/view?path=${encodeURIComponent('.dsh-vision-toolkit/artifacts/R16_D_view.png')}&workspace=${encodeURIComponent('C:\\work')}`,
    );
  });

  it('points remote image items at /api/files/view with the session query', () => {
    const spec: DshUiSpec = { items: [{ type: 'image', path: '/home/u/out/plot.png' }] };
    render(<DshUiSpecCard spec={spec} sessionId="cluster-1" />);

    const img = document.querySelector('img');
    expect(img!.getAttribute('src')).toBe(
      `/api/files/view?path=${encodeURIComponent('/home/u/out/plot.png')}&sessionId=cluster-1`,
    );
  });

  it('uses http(s) image sources directly', () => {
    const spec: DshUiSpec = { items: [{ type: 'image', src: 'https://example.com/x.png' }] };
    render(<DshUiSpecCard spec={spec} local />);

    expect(document.querySelector('img')!.getAttribute('src')).toBe('https://example.com/x.png');
  });

  it('opens a lightbox with the same src when an image item is clicked', () => {
    const spec: DshUiSpec = {
      items: [{ type: 'image', path: '.dsh-vision-toolkit/artifacts/R16_D_view.png', text: '视图' }],
    };
    render(<DshUiSpecCard spec={spec} local workspace={'C:\\work'} />);

    const src = `/api/local/files/view?path=${encodeURIComponent('.dsh-vision-toolkit/artifacts/R16_D_view.png')}&workspace=${encodeURIComponent('C:\\work')}`;
    fireEvent.click(document.querySelector('img')!);

    const lightbox = screen.getByTestId('image-lightbox');
    expect(lightbox.querySelector('img')!.getAttribute('src')).toBe(src);
    expect(screen.getAllByText('视图').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: '关闭图片预览' }));
    expect(screen.queryByTestId('image-lightbox')).toBeNull();
  });

  it('falls back to a paragraph for untyped items that carry text', () => {
    const spec: DshUiSpec = { items: [{ text: '没有类型标注的结论' }] };
    render(<DshUiSpecCard spec={spec} local />);

    expect(screen.getByText('没有类型标注的结论')).toBeTruthy();
  });
});
