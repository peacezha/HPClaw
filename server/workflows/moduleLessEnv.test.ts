import { describe, expect, it } from 'vitest';
import { buildEnvCheckCommand } from './envCheckScript';

describe('无 module 系统的直装回退', () => {
  it('环境检查脚本在 module 不可用时按命令名直查 PATH', () => {
    const script = buildEnvCheckCommand({
      job: 'test',
      software: [
        { name: 'Samtools', module: 'SAMtools/1.17', required: true },
        { name: 'Git', checkCmd: 'command -v git', required: true },
      ],
      inputs: [],
    });
    // module 缺失时不再报"module 系统不可用"判失败，而是直装回退
    expect(script).toContain('无 module 系统，需直接安装');
    expect(script).toContain('直装');
    expect(script).toContain('if type module >/dev/null 2>&1; then');
    expect(script).toContain('command -v "$direct_cmd"');
    // 尾部模块清单有 module 存在性护栏
    expect(script).toContain('本机无 module 系统，软件均为直装');
  });

  it('module 可用时维持原 module load 检查路径', () => {
    const script = buildEnvCheckCommand({
      job: 'test',
      software: [{ name: 'Samtools', module: 'SAMtools/1.17', required: true }],
      inputs: [],
    });
    expect(script).toContain('module load "$2"');
    expect(script).toContain('module -t avail');
  });
});
