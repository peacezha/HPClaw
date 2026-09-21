// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import PickConfirmBar from './PickConfirmBar';

afterEach(cleanup);

const dirEntry = { path: '/data/refs', kind: 'directory' as const };
const fileEntry = { path: '/data/refs/genes.gtf', kind: 'file' as const };

describe('PickConfirmBar', () => {
  it('kind=file：仅当单选条目是文件时主按钮可用，且不显示"选择此文件夹"', () => {
    const onPick = vi.fn();
    const { rerender } = render(
      <PickConfirmBar kind="file" currentPath="/data" selectedEntry={dirEntry} onPick={onPick} onCancel={() => {}} />,
    );

    // 选中文件夹 → 主按钮禁用并提示改选文件
    expect(screen.getByText('选择文件：')).toBeInTheDocument();
    expect(screen.getByText('选择选中的文件')).toBeDisabled();
    expect(screen.queryByText('选择此文件夹')).not.toBeInTheDocument();

    // 选中文件 → 可用并回传文件路径
    rerender(
      <PickConfirmBar kind="file" currentPath="/data" selectedEntry={fileEntry} onPick={onPick} onCancel={() => {}} />,
    );
    const confirm = screen.getByText('选择选中的文件');
    expect(confirm).toBeEnabled();
    fireEvent.click(confirm);
    expect(onPick).toHaveBeenCalledWith('/data/refs/genes.gtf');
  });

  it('kind=file：symlink 条目按文件处理', () => {
    const onPick = vi.fn();
    render(
      <PickConfirmBar
        kind="file"
        currentPath="/data"
        selectedEntry={{ path: '/data/link.idx', kind: 'symlink' }}
        onPick={onPick}
        onCancel={() => {}}
      />,
    );
    fireEvent.click(screen.getByText('选择选中的文件'));
    expect(onPick).toHaveBeenCalledWith('/data/link.idx');
  });

  it('kind=folder：选中文件时"选择选中项"禁用，选中文件夹时可用；"选择此文件夹"回传当前目录', () => {
    const onPick = vi.fn();
    const { rerender } = render(
      <PickConfirmBar kind="folder" currentPath="/data" selectedEntry={fileEntry} onPick={onPick} onCancel={() => {}} />,
    );

    // 选中文件 → 「选择选中项」收紧为禁用
    expect(screen.getByText('选择目录：')).toBeInTheDocument();
    expect(screen.getByText('选择选中项')).toBeDisabled();

    // 选中文件夹 → 可用并回传文件夹路径
    rerender(
      <PickConfirmBar kind="folder" currentPath="/data" selectedEntry={dirEntry} onPick={onPick} onCancel={() => {}} />,
    );
    fireEvent.click(screen.getByText('选择选中项'));
    expect(onPick).toHaveBeenCalledWith('/data/refs');

    // 「选择此文件夹」始终回传当前浏览目录
    fireEvent.click(screen.getByText('选择此文件夹'));
    expect(onPick).toHaveBeenCalledWith('/data');
  });

  it('kind=any：文件或文件夹均可作为选中项确认', () => {
    const onPick = vi.fn();
    render(
      <PickConfirmBar kind="any" currentPath="/data" selectedEntry={fileEntry} onPick={onPick} onCancel={() => {}} />,
    );

    expect(screen.getByText('选择文件或目录：')).toBeInTheDocument();
    fireEvent.click(screen.getByText('选择选中项'));
    expect(onPick).toHaveBeenCalledWith('/data/refs/genes.gtf');
    expect(screen.getByText('选择此文件夹')).toBeEnabled();
  });

  it('kind=any：无单选条目时"选择选中项"禁用，显示当前目录', () => {
    render(
      <PickConfirmBar kind="any" currentPath="/data" selectedEntry={null} onPick={() => {}} onCancel={() => {}} />,
    );
    expect(screen.getByText('选择选中项')).toBeDisabled();
    expect(screen.getByText('/data')).toBeInTheDocument();
  });

  it('取消按钮回调 onCancel', () => {
    const onCancel = vi.fn();
    render(
      <PickConfirmBar kind="any" currentPath="/data" selectedEntry={null} onPick={() => {}} onCancel={onCancel} />,
    );
    fireEvent.click(screen.getByText('取消'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
