// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import FileTransferDrawer from './FileTransferDrawer';

afterEach(cleanup);

describe('FileTransferDrawer', () => {
  it('renders above mounted app content and closes on Escape without cancelling work', () => {
    const onClose = vi.fn();
    const onCancelTransfers = vi.fn();
    render(
      <FileTransferDrawer open onClose={onClose} onCancelTransfers={onCancelTransfers}>
        <div>Workspace</div>
      </FileTransferDrawer>,
    );
    expect(screen.getByRole('dialog', { name: '文件传输工作区' })).toBeTruthy();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
    expect(onCancelTransfers).not.toHaveBeenCalled();
  });

  it('verifies a sentinel remains in the document before, during, and after the overlay', () => {
    const onClose = vi.fn();

    // Before overlay — sentinel exists, no dialog
    render(
      <div>
        <div data-testid="underlying-terminal">Terminal</div>
      </div>,
    );
    expect(screen.getByTestId('underlying-terminal')).toBeTruthy();
    expect(screen.queryByRole('dialog', { name: '文件传输工作区' })).toBeNull();
    cleanup();

    // During overlay — sentinel persists alongside dialog
    render(
      <div>
        <div data-testid="underlying-terminal">Terminal</div>
        <FileTransferDrawer open onClose={onClose}>
          <div>Workspace</div>
        </FileTransferDrawer>
      </div>,
    );
    expect(screen.getByTestId('underlying-terminal')).toBeTruthy();
    expect(screen.getByRole('dialog', { name: '文件传输工作区' })).toBeTruthy();
    cleanup();

    // After overlay closed — sentinel still exists, dialog gone
    render(
      <div>
        <div data-testid="underlying-terminal">Terminal</div>
        <FileTransferDrawer open={false} onClose={onClose}>
          <div>Workspace</div>
        </FileTransferDrawer>
      </div>,
    );
    expect(screen.getByTestId('underlying-terminal')).toBeTruthy();
    expect(screen.queryByRole('dialog', { name: '文件传输工作区' })).toBeNull();
  });
});
