import { describe, expect, it } from 'vitest';
import { parsePreflightOutput, runPreflight, readCachedPreflight, workflowPreflightFingerprint } from './preflight';
import type { Workflow } from './workflowTypes';

function makeWorkflow(overrides: Partial<Workflow> = {}): Workflow {
  return {
    id: 'wf-1',
    name: 'RNA-seq 质控与定量流程',
    description: '',
    keywords: [],
    params: [],
    steps: [],
    source: 'builtin',
    createdAt: 0,
    updatedAt: 0,
    manifest: {
      software: [
        { name: 'FastQC', module: 'FastQC/0.11.9', prerequisiteModules: ['Java/1.8'], required: true },
        { name: 'mytool', required: false },
      ],
      references: [
        { name: 'GTF', path: '/share/database/gtf', type: 'annotation', required: true },
        { name: '索引', path: '{{KALLISTO_INDEX}}', type: 'index', required: true },
      ],
      qcGates: [],
    },
    ...overrides,
  };
}

describe('runPreflight', () => {
  it('生成四板块目录并解析组合命令输出', async () => {
    const commands: string[] = [];
    const exec = async (cmd: string) => {
      commands.push(cmd);
      if (cmd.includes('ITEM|')) {
        return [
          'SCHED|lsf',
          'ITEM|sw|0|1|module: FastQC/0.11.9',
          'ITEM|sw|1|0|未找到命令: mytool',
          'ITEM|ref|0|1|存在（/share/database/gtf，12G）',
          'ITEM|ref|1|0|待用户指定路径（运行时参数）',
        ].join('\n');
      }
      return '';
    };
    const result = await runPreflight(exec, makeWorkflow());
    // 第一条命令应包含四板块目录创建（slug 已 ASCII 化：中文折叠 + 哈希后缀）
    expect(commands[0]).toContain('01_software');
    expect(commands[0]).toContain('02_reference');
    expect(commands[0]).toContain('03_workspace');
    expect(commands[0]).toContain('04_results');
    // 非交互 SSH 必须先初始化 Environment Modules/Lmod，并在隔离子 shell 验证 module load。
    expect(commands[0]).toContain('/etc/profile.d/modules.sh');
    expect(commands[0]).toContain('/etc/profile.d/lmod.sh');
    expect(commands[0]).toContain('module load "$loaded_module"');
    expect(commands[0]).not.toContain('$(module load');
    expect(commands[0]).toContain("for prerequisite_module in 'Java/1.8'");
    expect(commands[0]).toContain('module -t avail');
    expect(commands[0]).toContain('module spider');
    expect(commands[0]).toMatch(/hpclaw_flows\/RNA-seq-[0-9a-f]{6}/);
    // 写文件的目标路径必须把 ~ 展开为 $HOME（单引号内 ~ 不展开会导致缓存静默丢失）
    expect(commands[0]).toContain('"$HOME/hpclaw_flows/');
    expect(commands[0]).not.toContain("> '~/");
    // 结果解析
    expect(result.scheduler).toBe('lsf');
    expect(result.software[0].ok).toBe(true);
    expect(result.software[1].ok).toBe(false);
    // 可选软件缺失不影响 ready；占位路径的必需参考数据未就绪 → 整体未就绪
    expect(result.ready).toBe(false);
    // 第二次调用是结果回写
    expect(commands.length).toBe(2);
    expect(commands[1]).toContain('env-check.json');
  });

  it('全部必需项就绪时 ready=true', async () => {
    const exec = async (cmd: string) => cmd.includes('ITEM|')
      ? 'SCHED|none\nITEM|sw|0|1|ok\nITEM|sw|1|1|ok\nITEM|ref|0|1|ok\nITEM|ref|1|1|ok'
      : '';
    const result = await runPreflight(exec, makeWorkflow());
    expect(result.ready).toBe(true);
    expect(result.scheduler).toBe('none');
  });

  it('无 manifest 的流程直接 ready', async () => {
    const exec = async () => 'SCHED|lsf';
    const result = await runPreflight(exec, makeWorkflow({ manifest: undefined }));
    expect(result.ready).toBe(true);
    expect(result.software).toHaveLength(0);
  });
});

describe('runPreflight 单项校验（filter 合并）', () => {
  it('只检查指定项并与缓存合并', async () => {
    const wf = makeWorkflow();
    const cached = {
      workflowId: 'wf-1',
      workflowVersion: wf.updatedAt,
      manifestHash: workflowPreflightFingerprint(wf),
      checkedAt: 111,
      scheduler: 'lsf' as const,
      software: [
        { name: 'FastQC', ok: false, required: true, detail: 'module 不可用' },
        { name: 'mytool', ok: false, required: false, detail: '未检查' },
      ],
      references: [
        { name: 'GTF', ok: true, required: true, detail: '存在' },
        { name: '索引', ok: false, required: true, detail: '待用户指定路径（运行时参数）' },
      ],
      ready: false,
    };
    const commands: string[] = [];
    const exec = async (cmd: string) => {
      commands.push(cmd);
      if (cmd.includes('env-check.json') && cmd.startsWith('cat')) return JSON.stringify(cached);
      if (cmd.includes('ITEM|')) return 'SCHED|lsf\nITEM|sw|0|1|module: FastQC/0.11.9';
      return '';
    };
    const result = await runPreflight(exec, wf, { software: ['FastQC'] });
    // 只跑了 FastQC 一项检查（不应包含 mytool 或 ref 的检查标签）
    const checkCmd = commands.find(c => c.includes('ITEM|'))!;
    expect(checkCmd).toContain('ITEM|sw|0');
    expect(checkCmd).not.toContain('ITEM|sw|1');
    expect(checkCmd).not.toContain('ITEM|ref|');
    // 单项校验也必须先建目录+同步清单（否则结果缓存写不进集群，下次校验合并丢失）
    expect(checkCmd).toContain('mkdir -p');
    expect(checkCmd).toContain('01_software');
    // 合并结果：FastQC 更新为 ok，其余保持缓存值
    expect(result.software[0].ok).toBe(true);
    expect(result.software[1].detail).toBe('未检查');
    expect(result.references[0].ok).toBe(true);
    expect(result.references[1].ok).toBe(false);
    // 占位路径的必需参考仍未就绪 → 整体未就绪
    expect(result.ready).toBe(false);
  });

  it('无缓存时以 manifest 为基底合并', async () => {
    const wf = makeWorkflow();
    const exec = async (cmd: string) => {
      if (cmd.startsWith('cat')) return '';
      if (cmd.includes('ITEM|')) return 'SCHED|lsf\nITEM|ref|0|1|存在（/share/database/gtf，12G）';
      return '';
    };
    const result = await runPreflight(exec, wf, { references: ['GTF'] });
    expect(result.references[0].ok).toBe(true);
    expect(result.software[0].detail).toBe('未检查');
  });
});

describe('runPreflight {{FLOW_HOME}} 与 ~ 路径', () => {
  it('替换 {{FLOW_HOME}} 且 ~ 路径展开为 $HOME（单引号内 ~ 不展开）', async () => {
    const wf = makeWorkflow({
      manifest: {
        software: [],
        references: [
          { name: '管线代码', path: '{{FLOW_HOME}}/01_software/hidog/hidogV11.py', type: 'other', required: true },
          { name: '家目录参考', path: '~/refs/genome.fa', type: 'genome', required: false },
        ],
        qcGates: [],
      },
    });
    const commands: string[] = [];
    const exec = async (cmd: string) => {
      commands.push(cmd);
      if (cmd.includes('ITEM|')) return 'SCHED|lsf\nITEM|ref|0|1|ok\nITEM|ref|1|1|ok';
      return '';
    };
    await runPreflight(exec, wf);
    const checkCmd = commands.find(c => c.includes('ITEM|'))!;
    // FLOW_HOME 已替换为流程家目录
    expect(checkCmd).toContain('hpclaw_flows/');
    expect(checkCmd).toContain('01_software/hidog/hidogV11.py');
    expect(checkCmd).not.toContain('{{FLOW_HOME}}');
    // ~ 路径用 "$HOME/..." 双引号形式，不会被单引号锁死
    expect(checkCmd).toContain('"$HOME/refs/genome.fa"');
    expect(checkCmd).not.toContain("'~/");
  });
});

describe('parsePreflightOutput', () => {
  it('忽略噪声行，detail 中的竖线被保留', () => {
    const wf = makeWorkflow();
    const raw = 'some noise\nMODULESYS|ready|Lmod 已初始化\nITEM|sw|0|1|path: /a|b|c\nITEM|ref|9|1|越界忽略\nSCHED|slurm';
    const result = parsePreflightOutput(raw, wf, wf.manifest!);
    expect(result.software[0].detail).toBe('path: /a|b|c');
    expect(result.scheduler).toBe('slurm');
    expect(result.moduleSystem).toBe('ready');
    expect(result.moduleSystemDetail).toBe('Lmod 已初始化');
  });

  it('区分 module 系统未初始化与软件确实缺失', () => {
    const wf = makeWorkflow();
    const raw = 'MODULESYS|unavailable|非交互 SSH 未找到 module 命令\nITEM|sw|0|0|module 系统不可用：请检查非交互 shell 初始化';
    const result = parsePreflightOutput(raw, wf, wf.manifest!);
    expect(result.moduleSystem).toBe('unavailable');
    expect(result.software[0].ok).toBe(false);
    expect(result.software[0].detail).toContain('module 系统不可用');
  });
});

describe('readCachedPreflight', () => {
  it('读到合法 JSON 返回结果，否则返回 null', async () => {
    const workflow = makeWorkflow();
    const good = await readCachedPreflight(async () => JSON.stringify({
      workflowId: workflow.id,
      workflowVersion: workflow.updatedAt,
      manifestHash: workflowPreflightFingerprint(workflow),
      checkedAt: 123,
      software: [],
      references: [],
      ready: true,
    }), workflow);
    expect(good?.checkedAt).toBe(123);
    const empty = await readCachedPreflight(async () => '', workflow);
    expect(empty).toBeNull();
    const broken = await readCachedPreflight(async () => '{oops', workflow);
    expect(broken).toBeNull();
  });

  it('流程版本或清单变化后拒绝复用旧缓存', async () => {
    const workflow = makeWorkflow();
    const stale = {
      workflowId: workflow.id,
      workflowVersion: workflow.updatedAt - 1,
      manifestHash: workflowPreflightFingerprint(workflow),
      checkedAt: 123,
      software: [],
      references: [],
      ready: true,
    };
    expect(await readCachedPreflight(async () => JSON.stringify(stale), workflow)).toBeNull();
  });
});
