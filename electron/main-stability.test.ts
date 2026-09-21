import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const mainSource = fs.readFileSync(path.join(process.cwd(), 'electron', 'main.cjs'), 'utf8');

describe('desktop renderer stability guards', () => {
  it('uses the Windows software-rendering fallback before app readiness', () => {
    expect(mainSource).toContain("if (process.platform === 'win32') app.disableHardwareAcceleration()");
    expect(mainSource.indexOf('app.disableHardwareAcceleration()'))
      .toBeLessThan(mainSource.indexOf('app.whenReady().then(boot)'));
  });

  it('recovers a crashed renderer and detects crash loops', () => {
    expect(mainSource).toContain("win.webContents.on('render-process-gone'");
    expect(mainSource).toContain('reloadIgnoringCache()');
    expect(mainSource).toContain('MAX_RENDERER_RECOVERIES');
  });
});
