import http from 'node:http';
import express from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { placeholdersOf, runPreflightForConfig, validateRunParam } from './preflightRun';
import { registerWorkflowRunRoutes } from './registerWorkflowRunRoutes';
import type { Workflow } from './workflowTypes';

// 路由级测试不碰磁盘：store 打桩（与 workflowRoutes.test.ts 同一风格）
const { storeMocks } = vi.hoisted(() => ({
  storeMocks: { loadWorkflows: vi.fn() },
}));
vi.mock('./workflowStore', () => storeMocks);

function makeWorkflow(overrides: Partial<Workflow> = {}): Workflow {
  return {
    id: 'wf-1',
    name: 'RNA-seq 质控与定量流程',
    description: '',
    keywords: [],
    params: [
      { name: 'INPUT_DIR', label: '输入目录', type: 'path' },
      { name: 'THREADS', label: '线程数', type: 'number', defaultValue: '8' },
      { name: 'KALLISTO_INDEX', label: 'Kallisto 索引' },
    ],
    steps: [
      { title: '质控', command: 'fastqc {{INPUT_DIR}} -o {{RUN}}/qc' },
      { title: '定量', command: 'kallisto quant -i {{KALLISTO_INDEX}} {{INPUT_DIR}}', params: [{ name: 'BOOTSTRAP', label: 'bootstrap 次数' }] },
      { title: '报告', command: 'echo done', optional: true },
    ],
    manifest: {
      software: [{ name: 'FastQC', module: 'FastQC/0.11.9', required: true }],
      references: [
        { name: 'GTF', path: '/share/database/gtf', type: 'annotation', required: true },
        { name: '索引', path: '{{KALLISTO_INDEX}}', type: 'index', required: true },
        { name: '可选库', path: '{{OPTIONAL_DB}}', type: 'database', required: false },
      ],
      inputHint: 'FASTQ 目录',
      qcGates: [],
    },
    source: 'builtin',
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  };
}

/** 全绿 exec：软件/参考数据全部就绪，输入路径全部存在 */
function greenExec(commands?: string[]) {
  return async (cmd: string) => {
    commands?.push(cmd);
    if (cmd.includes('ITEM|')) return 'SCHED|lsf\nITEM|sw|0|1|ok\nITEM|ref|0|1|ok\nITEM|ref|1|1|ok';
    if (cmd.includes('INPUT|')) return cmd.match(/INPUT\|(\d+)\|/g) ? cmd.split('\n').map((_l, i) => `INPUT|${i}|1`).join('\n') : '';
    return '';
  };
}

const FULL_CONFIG = {
  inputs: ['/data/fastq'],
  params: { INPUT_DIR: '/data/fastq', THREADS: '8', KALLISTO_INDEX: '/refs/kallisto.idx' },
  stepParams: { 2: { BOOTSTRAP: '100' } },
  referenceOverrides: {},
  skippedSteps: [3],
  stepCommandOverrides: {},
};

describe('runPreflightForConfig 占位符解析', () => {
  it('参考数据路径用本次配置解析后再检查；解析不了的列为"待用户指定路径"问题项', async () => {
    const commands: string[] = [];
    const wf = makeWorkflow();
    const ok = await runPreflightForConfig(greenExec(commands), wf, FULL_CONFIG);
    // KALLISTO_INDEX 已由参数提供：检查命令里是解析后的实际路径，不再出现占位符
    const envCmd = commands.find(c => c.includes('ITEM|'))!;
    expect(envCmd).toContain('/refs/kallisto.idx');
    expect(envCmd).not.toContain('{{KALLISTO_INDEX}}');
    // 可选参考 OPTIONAL_DB 无值 → 占位符问题项（warn），且不进入环境核查
    const refIssue = ok.issues.find(i => i.kind === 'reference' && i.name === '可选库');
    expect(refIssue?.severity).toBe('warn');
    expect(refIssue?.message).toContain('待用户指定路径');
    expect(envCmd).not.toContain('OPTIONAL_DB');
    expect(ok.ok).toBe(true);
    expect(ok.preflight?.ready).toBe(true);
  });

  it('必需参考数据的占位符未提供时是 blocker；referenceOverrides 按参考数据名改指优先', async () => {
    const commands: string[] = [];
    const wf = makeWorkflow();
    const missing = await runPreflightForConfig(greenExec(commands), wf, {
      ...FULL_CONFIG,
      params: { INPUT_DIR: '/data/fastq', THREADS: '8' },
    });
    const blocker = missing.issues.find(i => i.kind === 'reference' && i.name === '索引');
    expect(blocker?.severity).toBe('blocker');
    expect(missing.ok).toBe(false);

    const overridden = await runPreflightForConfig(greenExec(commands), wf, {
      ...FULL_CONFIG,
      params: { INPUT_DIR: '/data/fastq', THREADS: '8' },
      referenceOverrides: { 索引: '/custom/ref.idx' },
    });
    expect(overridden.issues.find(i => i.kind === 'reference' && i.name === '索引')).toBeUndefined();
    expect(commands.some(c => c.includes('/custom/ref.idx'))).toBe(true);
  });

  it('步骤脚本未解析占位符汇总为 warn 问题项；已由参数覆盖的占位符不重复列出', async () => {
    const withUnknown = makeWorkflow({
      steps: [
        { title: '质控', command: 'fastqc {{INPUT_DIR}}' },
        { title: '定量', command: 'kallisto quant -i {{KALLISTO_INDEX}} --custom {{UNDECLARED_THING}}' },
      ],
    });
    const report = await runPreflightForConfig(greenExec(), withUnknown, FULL_CONFIG);
    const placeholder = report.issues.find(i => i.kind === 'placeholder');
    expect(placeholder?.step).toBe(2);
    expect(placeholder?.name).toBe('UNDECLARED_THING');
    expect(placeholder?.severity).toBe('warn');
    expect(placeholder?.message).not.toContain('KALLISTO_INDEX');
  });
});

describe('runPreflightForConfig 参数校验', () => {
  it('全局必填参数缺失/格式错误列为 blocker', async () => {
    const wf = makeWorkflow();
    const report = await runPreflightForConfig(greenExec(), wf, {
      ...FULL_CONFIG,
      params: { INPUT_DIR: '/data/fastq', THREADS: 'abc', KALLISTO_INDEX: '/refs/kallisto.idx' },
    });
    const typeError = report.issues.find(i => i.kind === 'param' && i.name === 'THREADS');
    expect(typeError?.severity).toBe('blocker');
    expect(typeError?.message).toContain('必须是数字');

    const missing = await runPreflightForConfig(greenExec(), wf, { ...FULL_CONFIG, params: { THREADS: '8' } });
    // 必填参数 INPUT_DIR 未在 params 提供（inputs 兜底只作用于占位符渲染，不免除必填校验）→ blocker
    expect(missing.issues.some(i => i.kind === 'param' && i.name === 'INPUT_DIR' && i.severity === 'blocker')).toBe(true);
    expect(missing.ok).toBe(false);
  });

  it('步骤参数必填校验按 skippedSteps 跳过', async () => {
    const wf = makeWorkflow();
    const config = { ...FULL_CONFIG, stepParams: {}, skippedSteps: [2, 3] };
    const report = await runPreflightForConfig(greenExec(), wf, config);
    expect(report.issues.find(i => i.kind === 'param' && i.name === 'BOOTSTRAP')).toBeUndefined();

    const notSkipped = await runPreflightForConfig(greenExec(), wf, { ...FULL_CONFIG, stepParams: {} });
    const stepIssue = notSkipped.issues.find(i => i.kind === 'param' && i.name === 'BOOTSTRAP');
    expect(stepIssue?.step).toBe(2);
    expect(stepIssue?.severity).toBe('blocker');
  });

  it('正则 pattern 校验与无效规则提示', () => {
    expect(validateRunParam({ name: 'Q', label: '质量', pattern: '^\\d+$' }, '12')).toBeNull();
    expect(validateRunParam({ name: 'Q', label: '质量', pattern: '^\\d+$' }, 'x')).toBe('质量格式不正确');
    expect(validateRunParam({ name: 'Q', label: '质量', pattern: '(' }, 'x')).toBe('质量的校验规则无效');
    expect(validateRunParam({ name: 'N', label: '数量', type: 'number', min: 1, max: 4 }, '8')).toBe('数量不能大于 4');
  });
});

describe('runPreflightForConfig 输入数据存在性', () => {
  it('一次组合只读命令检查全部输入；不存在的路径列为 blocker', async () => {
    const commands: string[] = [];
    const exec = async (cmd: string) => {
      commands.push(cmd);
      if (cmd.includes('ITEM|')) return 'SCHED|lsf\nITEM|sw|0|1|ok\nITEM|ref|0|1|ok\nITEM|ref|1|1|ok';
      if (cmd.includes('INPUT|')) return 'INPUT|0|1\nINPUT|1|0';
      return '';
    };
    const report = await runPreflightForConfig(exec, makeWorkflow(), {
      ...FULL_CONFIG,
      inputs: ['/data/fastq', '/data/missing'],
    });
    const inputCmd = commands.find(c => c.includes('INPUT|'))!;
    // 一条组合只读命令覆盖全部输入（每个路径一行 if [ -e ... ]）
    expect(inputCmd.match(/if \[ -e /g)).toHaveLength(2);
    const issue = report.issues.find(i => i.kind === 'input');
    expect(issue?.name).toBe('/data/missing');
    expect(issue?.severity).toBe('blocker');
    expect(report.ok).toBe(false);
  });

  it('含占位符的输入路径跳过存在性检查', async () => {
    const commands: string[] = [];
    const report = await runPreflightForConfig(greenExec(commands), makeWorkflow(), {
      ...FULL_CONFIG,
      inputs: ['{{TO_BE_DECIDED}}'],
    });
    expect(commands.some(c => c.includes('INPUT|'))).toBe(false);
    expect(report.issues.some(i => i.kind === 'input')).toBe(false);
  });
});

describe('runPreflightForConfig 降级与汇总格式', () => {
  it('环境核查执行失败降级为 warn，不影响参数/输入/占位符检查', async () => {
    const exec = async (cmd: string) => {
      if (cmd.includes('INPUT|')) return 'INPUT|0|1';
      if (cmd.includes('ITEM|') || cmd.includes('mkdir')) throw new Error('ssh timeout');
      return '';
    };
    const report = await runPreflightForConfig(exec, makeWorkflow(), FULL_CONFIG);
    expect(report.preflight).toBeNull();
    const envIssue = report.issues.find(i => i.name === 'preflight');
    expect(envIssue?.severity).toBe('warn');
    expect(envIssue?.message).toContain('ssh timeout');
    // 其余检查仍然完成
    expect(report.issues.some(i => i.kind === 'input')).toBe(false);
    expect(report.ok).toBe(true);
  });

  it('输入存在性检查失败降级为 warn', async () => {
    const exec = async (cmd: string) => {
      if (cmd.includes('ITEM|')) return 'SCHED|lsf\nITEM|sw|0|1|ok\nITEM|ref|0|1|ok\nITEM|ref|1|1|ok';
      if (cmd.includes('INPUT|')) throw new Error('connection reset');
      return '';
    };
    const report = await runPreflightForConfig(exec, makeWorkflow(), FULL_CONFIG);
    const issue = report.issues.find(i => i.kind === 'input');
    expect(issue?.severity).toBe('warn');
    expect(report.ok).toBe(true);
  });

  it('无 manifest 且无问题配置：issues 为空、ok=true、preflight=null', async () => {
    const report = await runPreflightForConfig(greenExec(), makeWorkflow({ manifest: undefined }), {
      inputs: ['/data/fastq'],
      params: { INPUT_DIR: '/data/fastq', THREADS: '8', KALLISTO_INDEX: '/refs/x' },
      stepParams: { 2: { BOOTSTRAP: '1' } },
      referenceOverrides: {},
      skippedSteps: [3],
      stepCommandOverrides: {},
    });
    expect(report.ok).toBe(true);
    expect(report.issues).toEqual([]);
    expect(report.preflight).toBeNull();
  });

  it('环境核查不写集群缓存（persist=false：无 env-check.json 回写）', async () => {
    const commands: string[] = [];
    await runPreflightForConfig(greenExec(commands), makeWorkflow(), FULL_CONFIG);
    expect(commands.some(c => c.includes('env-check.json'))).toBe(false);
    expect(commands.some(c => c.includes('manifest.json'))).toBe(false);
  });
});

describe('placeholdersOf', () => {
  it('提取去重后的占位符名', () => {
    expect(placeholdersOf('a {{X}} b {{ Y }} {{X}} {{A-B.1}}')).toEqual(['X', 'Y', 'A-B.1']);
    expect(placeholdersOf('no placeholder')).toEqual([]);
  });
});

// ── 路由级：POST /api/workflows/:id/preflight-run ─────────────────────────

const servers: http.Server[] = [];

beforeEach(() => {
  storeMocks.loadWorkflows.mockReset();
});

afterEach(async () => {
  await Promise.all(servers.splice(0).map(server => new Promise<void>(resolve => server.close(() => resolve()))));
});

async function startRunRoutes(exec: (cmd: string, timeout?: number) => Promise<string>): Promise<string> {
  const app = express();
  app.use(express.json());
  registerWorkflowRunRoutes(app, req => (
    req.get('X-SSH-Session-Id') === 's1'
      ? { sessionId: 's1', exec, home: '/home/u' }
      : undefined
  ));
  const server = http.createServer(app);
  servers.push(server);
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Test server did not bind');
  return `http://127.0.0.1:${address.port}`;
}

describe('POST /api/workflows/:id/preflight-run', () => {
  it('无会话 401；流程不存在 404', async () => {
    storeMocks.loadWorkflows.mockResolvedValue([makeWorkflow()]);
    const base = await startRunRoutes(greenExec());
    expect((await fetch(`${base}/api/workflows/wf-1/preflight-run`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })).status).toBe(401);
    expect((await fetch(`${base}/api/workflows/wf-x/preflight-run`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-SSH-Session-Id': 's1' }, body: '{}' })).status).toBe(404);
  });

  it('按本次配置返回集中问题清单（占位符 + 必填步骤参数 + 缺失输入）', async () => {
    storeMocks.loadWorkflows.mockResolvedValue([makeWorkflow()]);
    const exec = async (cmd: string) => {
      if (cmd.includes('ITEM|')) return 'SCHED|lsf\nITEM|sw|0|1|ok\nITEM|ref|0|1|ok';
      if (cmd.includes('INPUT|')) return 'INPUT|0|0';
      return '';
    };
    const base = await startRunRoutes(exec);
    const response = await fetch(`${base}/api/workflows/wf-1/preflight-run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-SSH-Session-Id': 's1' },
      body: JSON.stringify({
        inputs: ['/data/missing'],
        params: { INPUT_DIR: '/data/missing', THREADS: '8' },
        stepParams: {},
        referenceOverrides: {},
        skippedSteps: [],
        stepCommandOverrides: {},
      }),
    });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    const report = body.report;
    expect(report.ok).toBe(false);
    // 必需参考数据占位符未提供 → blocker
    expect(report.issues.some((i: any) => i.kind === 'reference' && i.name === '索引' && i.severity === 'blocker')).toBe(true);
    // 步骤 2 必填参数未填 → blocker
    expect(report.issues.some((i: any) => i.kind === 'param' && i.step === 2 && i.name === 'BOOTSTRAP')).toBe(true);
    // 输入路径不存在 → blocker
    expect(report.issues.some((i: any) => i.kind === 'input' && i.name === '/data/missing')).toBe(true);
    // 环境核查结果原样带回
    expect(report.preflight?.scheduler).toBe('lsf');
  });

  it('全部就绪时 issues 为空、ok=true', async () => {
    storeMocks.loadWorkflows.mockResolvedValue([makeWorkflow()]);
    const base = await startRunRoutes(greenExec());
    const response = await fetch(`${base}/api/workflows/wf-1/preflight-run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-SSH-Session-Id': 's1' },
      body: JSON.stringify(FULL_CONFIG),
    });
    expect(response.status).toBe(200);
    const body = await response.json();
    // 可选参考 OPTIONAL_DB 未提供 → warn；其余就绪
    expect(body.report.issues.every((i: any) => i.severity === 'warn')).toBe(true);
    expect(body.report.ok).toBe(true);
  });
});
