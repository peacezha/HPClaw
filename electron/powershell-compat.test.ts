import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(import.meta.dirname, '..');

describe('Windows PowerShell compatibility', () => {
  it('uses the native NSIS process plugin instead of PowerShell during install', () => {
    const installerInclude = fs.readFileSync(path.join(projectRoot, 'build', 'installer.nsh'), 'utf8');
    expect(installerInclude).toContain('customCheckAppRunning');
    expect(installerInclude).toContain('customInit');
    expect(installerInclude).toContain('UAC_IsInnerInstance');
    expect(installerInclude).toContain('HKEY_LOCAL_MACHINE');
    expect(installerInclude).toContain('nsProcess::FindProcess');
    expect(installerInclude).toContain('nsProcess::CloseProcess');
    expect(installerInclude).toContain('nsProcess::KillProcess');
    expect(installerInclude).toContain('WMIC.exe');
    expect(installerInclude).toContain('app.asar.unpacked\\vendor\\%');
    expect(installerInclude).toContain('ExecutablePath like');
    expect(installerInclude).toContain('HKEY_CURRENT_USER');
    expect(installerInclude).toContain('InstallLocation');
    expect(installerInclude).toContain('hpclawDisableUpgradeUninstaller');
    expect(installerInclude).toContain('DeleteRegValue');
    expect(installerInclude).toContain('QuietUninstallString');
    expect(installerInclude).not.toContain('DisplayVersion');
    expect(installerInclude).not.toMatch(/powershell\.exe/i);
    expect(installerInclude).not.toContain('tasklist');
  });

  it('cleans stale NSIS archives and CRC-tests every generated installer', () => {
    const buildScript = fs.readFileSync(
      path.join(projectRoot, 'scripts', 'build-windows-installer.mjs'),
      'utf8',
    );
    expect(buildScript).toContain('intermediateArchive');
    expect(buildScript).toContain('fs.rmSync');
    expect(buildScript).toContain("ELECTRON_BUILDER_COMPRESSION_LEVEL: '1'");
    expect(buildScript).toContain('args.push("-mmt=1")');
    expect(buildScript).toContain('fs.writeFileSync(archiveModule, archiveSource)');
    expect(buildScript).toContain("spawnSync(sevenZip, ['t', installer]");
    expect(buildScript).toContain('installer CRC verification failed');
  });

  it('opens associated files without spawning PowerShell', () => {
    const desktopMain = fs.readFileSync(path.join(projectRoot, 'electron', 'main.cjs'), 'utf8');
    expect(desktopMain).toContain('shell.openPath(filePath)');
    expect(desktopMain).not.toContain("spawn('powershell.exe'");
  });

  it('stops the complete HPClaw backend tree so sidecars cannot lock an update', () => {
    const desktopMain = fs.readFileSync(path.join(projectRoot, 'electron', 'main.cjs'), 'utf8');
    expect(desktopMain).toContain('spawnSync');
    expect(desktopMain).toContain("'taskkill.exe'");
    expect(desktopMain).toContain("'/T'");
    expect(desktopMain).toContain('processToStop.pid');
    expect(desktopMain).not.toContain('processToStop.killed) return');
    expect(desktopMain).toContain("stopBackend('will-quit')");
  });
});
