import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resolveRunLogDir } from './registerPreflightRoutes';
import { sanitizeManifest } from './flowManifest';
import {
  registerWorkflowRoutes, sanitizeAssets, sanitizeCategory, sanitizePaperImport, sanitizeParams, sanitizeSteps,
} from './registerWorkflowRoutes';

// 路由级测试不碰磁盘：store 全部打桩；迁移/持久化行为见 workflowStore.test.ts
const { storeMocks } = vi.hoisted(() => ({
  storeMocks: {
    loadWorkflows: vi.fn(),
    upsertWorkflow: vi.fn(),
    deleteWorkflow: vi.fn(),
  },
}));
vi.mock('./workflowStore', () => storeMocks);

const servers: http.Server[] = [];

beforeEach(() => {
  storeMocks.loadWorkflows.mockReset().mockResolvedValue([]);
  storeMocks.deleteWorkflow.mockReset().mockResolvedValue(true);
  storeMocks.upsertWorkflow.mockReset().mockImplementation(async (input: any) => ({
    id: input.id || 'new-id',
    name: input.name,
    description: input.description || '',
    keywords: input.keywords || [],
    params: input.params || [],
    steps: input.steps || [],
    ...(input.category ? { category: input.category } : {}),
    source: input.source || 'user',
    createdAt: 1,
    updatedAt: 1,
  }));
});

afterEach(async () => {
  await Promise.all(servers.splice(0).map(server => new Promise<void>(resolve => server.close(() => resolve()))));
});

async function startWorkflowRoutes(): Promise<string> {
  const app = express();
  app.use(express.json());
  registerWorkflowRoutes(app);
  const server = http.createServer(app);
  servers.push(server);
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Test server did not bind');
  return `http://127.0.0.1:${address.port}`;
}

const VALID_BODY = {
  name: '测试流程',
  description: 'desc',
  steps: [{ title: '步骤一', command: 'echo hi' }],
};

const HOME = '/public/home/tester';

describe('resolveRunLogDir 路径校验', () => {
  it('允许 home 下 hpclaw_flows / hpclaw_runs 内路径（含 ~ 写法）', () => {
    expect(resolveRunLogDir(HOME, '~/hpclaw_flows/wf/03_workspace/runs/r1')).toBe('~/hpclaw_flows/wf/03_workspace/runs/r1');
    expect(resolveRunLogDir(HOME, `${HOME}/hpclaw_flows/wf/03_workspace/runs/r1`)).toBe(`${HOME}/hpclaw_flows/wf/03_workspace/runs/r1`);
    expect(resolveRunLogDir(HOME, `${HOME}/hpclaw_runs/old-run`)).toBe(`${HOME}/hpclaw_runs/old-run`);
  });

  it('拒绝工作区外与穿越路径', () => {
    expect(resolveRunLogDir(HOME, '/etc')).toBeNull();
    expect(resolveRunLogDir(HOME, `${HOME}/other/dir`)).toBeNull();
    expect(resolveRunLogDir(HOME, '~/hpclaw_flows/../../etc')).toBeNull();
    expect(resolveRunLogDir(HOME, '')).toBeNull();
    expect(resolveRunLogDir(HOME, '  ')).toBeNull();
  });

  it('home 末尾斜杠不影响判断', () => {
    expect(resolveRunLogDir(`${HOME}/`, '~/hpclaw_flows/wf/runs/r1')).toBe('~/hpclaw_flows/wf/runs/r1');
  });
});

describe('sanitizeParams 参数类型', () => {
  it('透传合法 type/options/placeholder', () => {
    const params = sanitizeParams([
      { name: 'QUEUE', label: '队列', defaultValue: 'normal', type: 'select', options: ['normal', 'smp'] },
      { name: 'THREADS', label: '线程', type: 'number' },
      { name: 'DRY', label: '试运行', type: 'boolean' },
      { name: 'OUT', label: '输出', type: 'path', placeholder: '/path/to/out' },
      { name: 'Q', label: '质量', type: 'number', min: 0, max: 40, step: 1, help: 'Phred 分数' },
    ]);
    expect(params[0].type).toBe('select');
    expect(params[0].options).toEqual(['normal', 'smp']);
    expect(params[1].type).toBe('number');
    expect(params[2].type).toBe('boolean');
    expect(params[3].placeholder).toBe('/path/to/out');
    expect(params[4]).toMatchObject({ min: 0, max: 40, step: 1, help: 'Phred 分数' });
  });

  it('非法 type 丢弃（回退 text），options 超限截断', () => {
    const params = sanitizeParams([
      { name: 'A', label: 'a', type: 'evil' },
      { name: 'B', label: 'b', type: 'select', options: Array.from({ length: 30 }, (_, i) => `o${i}`) },
    ]);
    expect(params[0].type).toBeUndefined();
    expect(params[1].options).toHaveLength(20);
  });

  it('缺省字段保持旧行为（无 type）', () => {
    const params = sanitizeParams([{ name: '{{SAMPLE}}', label: '样本' }]);
    expect(params[0].name).toBe('SAMPLE');
    expect(params[0].type).toBeUndefined();
  });
});

describe('sanitizeAssets 管线文件', () => {
  it('保留合法项并剥离路径穿越', () => {
    const assets = sanitizeAssets([
      { source: 'hidog/hidogV11.py', remotePath: 'hidog/hidogV11.py', label: '主入口' },
      { source: '../evil.py', remotePath: '/abs/path.py' },
      { source: '', remotePath: 'x' },
    ]);
    expect(assets).toHaveLength(2);
    expect(assets![0].label).toBe('主入口');
    expect(assets![1].source).toBe('evil.py');
    expect(assets![1].remotePath).toBe('abs/path.py');
  });

  it('空输入返回 undefined', () => {
    expect(sanitizeAssets(undefined)).toBeUndefined();
    expect(sanitizeAssets([])).toBeUndefined();
    expect(sanitizeAssets([{ source: '', remotePath: '' }])).toBeUndefined();
  });
});

describe('sanitizeSteps Agent 来源合同', () => {
  it('编辑 BioSkills 流程时保留安全的来源章节与关联技能', () => {
    const steps = sanitizeSteps([{
      title: '质控', command: 'run',
      agent: {
        kind: 'qc', sourcePath: 'bioSkills/workflows/demo/SKILL.md', sourceSection: 'Step 1: QC',
        skillRefs: ['read-qc/fastp-workflow'], template: true, contractVersion: '2',
      },
    }]);
    expect(steps[0].agent).toEqual({
      kind: 'qc', sourcePath: 'bioSkills/workflows/demo/SKILL.md', sourceSection: 'Step 1: QC',
      skillRefs: ['read-qc/fastp-workflow'], template: true, contractVersion: '2',
    });
  });

  it('保留文献步骤证据、可信度、输入输出与确认门禁', () => {
    const steps = sanitizeSteps([{
      title: '比对', command: 'STAR {{FASTQ}}',
      agent: {
        kind: 'compute', sourceType: 'repository', sourcePath: 'modules/star.nf', sourceSection: 'process STAR_ALIGN',
        evidence: '仓库 STAR_ALIGN 进程调用 STAR', confidence: 'medium', inputs: ['FASTQ'], outputs: ['BAM'],
        requiresReview: true, template: true, contractVersion: 'paper-agent-v2',
      },
    }]);
    expect(steps[0].agent).toMatchObject({
      sourceType: 'repository', confidence: 'medium', inputs: ['FASTQ'], outputs: ['BAM'], requiresReview: true,
    });
  });
});

describe('sanitizePaperImport 文献审计持久化', () => {
  it('清洗质量评分、待确认问题和跨来源工具链接', () => {
    const result = sanitizePaperImport({
      importerVersion: 'paper-agent-v2', sourceLabel: 'PMC 全文', methodSections: ['Methods'],
      excludedBranches: ['替代比对器'],
      unresolvedQuestions: [{ question: '参考版本？', blocking: true, affectsSteps: [2] }],
      toolLinks: [{ canonicalName: 'STAR', paperMention: 'STAR', codeMention: 'STAR_ALIGN', status: 'matched', knowledgeBase: 'Bioconda:star' }],
      quality: {
        score: 110, readiness: 'needs_input', dimensions: { evidence: 90, executability: 80, parameters: 70, resources: 60, qc: 50 },
        blockers: ['需要确认'], warnings: [], supportedSteps: 2, totalSteps: 3,
      },
      reviewedAt: 123,
    });
    expect(result?.quality.score).toBe(100);
    expect(result?.toolLinks[0]).toMatchObject({ canonicalName: 'STAR', status: 'matched', knowledgeBase: 'Bioconda:star' });
    expect(result?.reviewedAt).toBe(123);
  });
});

describe('sanitizeCategory 流程分类', () => {
  it('保留合法分类、去空白并限长 50', () => {
    expect(sanitizeCategory('基因组与变异分析')).toBe('基因组与变异分析');
    expect(sanitizeCategory('  自定义分类  ')).toBe('自定义分类');
    expect(sanitizeCategory('x'.repeat(80))).toHaveLength(50);
  });

  it('空串表示“清除分类”，非字符串丢弃（编辑时保持原值）', () => {
    expect(sanitizeCategory('')).toBe('');
    expect(sanitizeCategory('   ')).toBe('');
    expect(sanitizeCategory(undefined)).toBeUndefined();
    expect(sanitizeCategory(null)).toBeUndefined();
    expect(sanitizeCategory(123)).toBeUndefined();
  });
});

describe('POST /api/workflows 来源标签', () => {
  it('前端传 source=ai 时保留（AI 生成草稿不再被标成“自定义”）', async () => {
    const baseUrl = await startWorkflowRoutes();
    const response = await fetch(`${baseUrl}/api/workflows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...VALID_BODY, source: 'ai' }),
    });
    expect(response.status).toBe(201);
    expect(storeMocks.upsertWorkflow).toHaveBeenCalledWith(expect.objectContaining({ source: 'ai' }));
    const body = await response.json();
    expect(body.workflow.source).toBe('ai');
  });

  it('前端传 source=user 时保留', async () => {
    const baseUrl = await startWorkflowRoutes();
    await fetch(`${baseUrl}/api/workflows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...VALID_BODY, source: 'user' }),
    });
    expect(storeMocks.upsertWorkflow).toHaveBeenCalledWith(expect.objectContaining({ source: 'user' }));
  });

  it('缺省按历史逻辑推断：带 paperImport → ai，否则 → user；非法 source 不白名单', async () => {
    const baseUrl = await startWorkflowRoutes();
    await fetch(`${baseUrl}/api/workflows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...VALID_BODY, paperImport: { sourceLabel: '文献导入', quality: {} } }),
    });
    expect(storeMocks.upsertWorkflow).toHaveBeenCalledWith(expect.objectContaining({ source: 'ai' }));

    await fetch(`${baseUrl}/api/workflows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...VALID_BODY, source: 'builtin' }),
    });
    // 'builtin' 不在创建白名单内，回退到缺省推断（无 paperImport → user）
    expect(storeMocks.upsertWorkflow).toHaveBeenCalledWith(expect.objectContaining({ source: 'user' }));
  });

  it('category 经 sanitize 透传入库', async () => {
    const baseUrl = await startWorkflowRoutes();
    const response = await fetch(`${baseUrl}/api/workflows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...VALID_BODY, source: 'ai', category: '  基因组与变异分析  ' }),
    });
    expect(response.status).toBe(201);
    expect(storeMocks.upsertWorkflow).toHaveBeenCalledWith(expect.objectContaining({ category: '基因组与变异分析' }));
  });
});

describe('PUT /api/workflows/:id', () => {
  it('category 经 sanitize 透传；空串表示清除分类', async () => {
    const baseUrl = await startWorkflowRoutes();
    const response = await fetch(`${baseUrl}/api/workflows/wf-1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...VALID_BODY, source: 'builtin', category: '微生物与病原分析' }),
    });
    expect(response.status).toBe(200);
    expect(storeMocks.upsertWorkflow).toHaveBeenCalledWith(expect.objectContaining({
      id: 'wf-1', source: 'builtin', category: '微生物与病原分析',
    }));

    await fetch(`${baseUrl}/api/workflows/wf-1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...VALID_BODY, source: 'builtin', category: '' }),
    });
    expect(storeMocks.upsertWorkflow).toHaveBeenCalledWith(expect.objectContaining({ id: 'wf-1', category: '' }));
  });

  it('未携带 category 字段时传 undefined（store 侧保持原值）', async () => {
    const baseUrl = await startWorkflowRoutes();
    await fetch(`${baseUrl}/api/workflows/wf-1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...VALID_BODY, source: 'user' }),
    });
    expect(storeMocks.upsertWorkflow).toHaveBeenCalledWith(expect.objectContaining({ id: 'wf-1', category: undefined }));
  });
});

describe('DELETE /api/workflows/:id', () => {
  it('调用 store 删除（内置流程的 deleted 清单由 store 侧写入）', async () => {
    const baseUrl = await startWorkflowRoutes();
    const response = await fetch(`${baseUrl}/api/workflows/builtin-blast`, { method: 'DELETE' });
    expect(response.status).toBe(200);
    expect(storeMocks.deleteWorkflow).toHaveBeenCalledWith('builtin-blast');
  });

  it('删除不存在的流程返回 404', async () => {
    storeMocks.deleteWorkflow.mockResolvedValue(false);
    const baseUrl = await startWorkflowRoutes();
    const response = await fetch(`${baseUrl}/api/workflows/nope`, { method: 'DELETE' });
    expect(response.status).toBe(404);
  });
});

describe('ENCODE 内置流程经 sanitize 字段不丢（抽查 encode-chipseq-tf）', () => {
  it('params/manifest/steps 清洗后与 dev 库定义一致', () => {
    const exported = JSON.parse(
      fs.readFileSync(path.resolve('workflows/workflows.json'), 'utf8'),
    ) as Array<{
      id: string;
      params: unknown;
      manifest: unknown;
      steps: Array<{ title: string; command: string; notes?: string; params?: unknown[] }>;
    }>;
    const workflow = exported.find(item => item.id === 'encode-chipseq-tf');
    expect(workflow).toBeDefined();
    // sanitizeParams 全字段透传（type/options/placeholder/required/min/max/step/pattern/help）
    expect(sanitizeParams(workflow!.params)).toEqual(workflow!.params);
    // sanitizeManifest 全字段透传（software/references/qcGates/inputHint）
    expect(sanitizeManifest(workflow!.manifest)).toEqual(workflow!.manifest);
    // sanitizeSteps：title/command/notes/params 透传；optional 缺省归一化为 false
    const steps = sanitizeSteps(workflow!.steps);
    expect(steps).toHaveLength(workflow!.steps.length);
    steps.forEach((step, index) => {
      const original = workflow!.steps[index];
      expect(step.title).toBe(original.title);
      expect(step.command).toBe(original.command);
      expect(step.notes).toBe(original.notes);
      if (original.params) expect(step.params).toEqual(original.params);
    });
  });

  it('DAG 的稳定 id、显式空依赖、分支依赖和 phase 经清洗后保留', () => {
    expect(sanitizeSteps([
      { id: 'prepare', title: '准备', command: 'echo prepare', dependsOn: [], phase: '准备' },
      { id: 'star', title: 'STAR', command: 'echo star', dependsOn: ['prepare'], phase: '比对' },
      { id: 'report', title: '报告', command: 'echo report', dependsOn: ['star', 'bad id', 'star'], phase: '报告' },
    ])).toEqual([
      expect.objectContaining({ id: 'prepare', dependsOn: [], phase: '准备' }),
      expect.objectContaining({ id: 'star', dependsOn: ['prepare'], phase: '比对' }),
      expect.objectContaining({ id: 'report', dependsOn: ['star'], phase: '报告' }),
    ]);
  });
});
