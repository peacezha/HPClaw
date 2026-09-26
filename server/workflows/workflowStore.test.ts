// 流程存储迁移与种子生命周期测试：临时数据目录 + 真实 skills 源。
// 每个用例用全新的临时 HPCLAW_DATA_ROOT（经 vi.mock('../paths') 注入）并 resetModules，
// 模拟独立进程启动，避免模块级缓存（storeCache / bioskillsSeedsReady）串扰。
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { WORKFLOW_CATEGORIES } from '../../shared/workflow';
import type { Workflow } from './workflowTypes';
import { resolveWorkflowStepGraph } from './workflowRunService';

const { state } = vi.hoisted(() => ({ state: { tmpRoot: '' } }));

vi.mock('../paths', () => ({
  appPath: (...segments: string[]) => path.join(process.cwd(), ...segments),
  dataPath: (...segments: string[]) => path.join(state.tmpRoot, ...segments),
}));

/** 新临时数据目录 + 全新模块实例（等价于一次全新的应用启动） */
async function freshStore(): Promise<typeof import('./workflowStore')> {
  state.tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'hpclaw-workflow-store-'));
  vi.resetModules();
  return import('./workflowStore');
}

/** 同一数据目录“重启”：重置模块状态但保留磁盘内容 */
async function restartStore(): Promise<typeof import('./workflowStore')> {
  vi.resetModules();
  return import('./workflowStore');
}

const storeFile = () => path.join(state.tmpRoot, 'workflows', 'workflows.json');
const deletedFile = () => path.join(state.tmpRoot, 'workflows', 'deleted-builtin-seeds.json');

describe('内置流程分类映射', () => {
  it('55 个内置流程全部有映射，且分类名都在 WORKFLOW_CATEGORIES 内', async () => {
    const store = await freshStore();
    const keys = Object.keys(store.BUILTIN_CATEGORIES);
    expect(keys).toHaveLength(55);
    for (const category of Object.values(store.BUILTIN_CATEGORIES)) {
      expect(WORKFLOW_CATEGORIES).toContain(category);
    }
    // 18 个硬编码种子 id 全部覆盖
    for (const seed of store.builtinWorkflows()) {
      expect(store.BUILTIN_CATEGORIES[seed.id]).toBeTruthy();
    }
    // 35 个 BioSkills 种子 id 全部覆盖（6 条与 ENCODE 金标准重复的已退役）
    const { generateBioskillsWorkflows } = await import('./bioskillsSeed');
    const generated = await generateBioskillsWorkflows(path.join(process.cwd(), 'skills'));
    expect(generated.length).toBe(35);
    for (const workflow of generated) {
      expect(store.BUILTIN_CATEGORIES[workflow.id]).toBeTruthy();
    }
  });

  it('12 个 ENCODE 内置流程全部映射到转录组与表观调控', async () => {
    const store = await freshStore();
    const encodeIds = [
      'encode-chipseq-tf', 'encode-chipseq-histone', 'encode-rnaseq-bulk', 'encode-atacseq',
      'encode-dnaseseq', 'encode-wgbs', 'encode-hic', 'encode-chiapet', 'encode-mirnaseq',
      'encode-eclip', 'encode-longread-rnaseq', 'encode-rampage',
    ];
    const seedIds = store.builtinWorkflows().map(w => w.id);
    for (const id of encodeIds) {
      expect(seedIds).toContain(id);
      expect(store.BUILTIN_CATEGORIES[id]).toBe('转录组与表观调控');
    }
  });

  it('抽查：代表性 id 映射到正确分类', async () => {
    const store = await freshStore();
    expect(store.BUILTIN_CATEGORIES['bioskills-gwas-pipeline']).toBe('基因组与变异分析');
    expect(store.BUILTIN_CATEGORIES['bioskills-tcr-pipeline']).toBe('单细胞与免疫分析');
    expect(store.BUILTIN_CATEGORIES['builtin-hidog-vector-trace']).toBe('基因编辑与 CRISPR');
    expect(store.BUILTIN_CATEGORIES['builtin-blast']).toBe('任务管理与通用工具');
    expect(store.BUILTIN_CATEGORIES['encode-chipseq-tf']).toBe('转录组与表观调控');
    expect(store.BUILTIN_CATEGORIES['encode-rampage']).toBe('转录组与表观调控');
  });

  it('BioSkills 生成器接受映射并注入 category', async () => {
    const { generateBioskillsWorkflows } = await import('./bioskillsSeed');
    const generated = await generateBioskillsWorkflows(
      path.join(process.cwd(), 'skills'),
      { 'bioskills-metagenomics-pipeline': '微生物与病原分析', 'bioskills-splicing-pipeline': '转录组与表观调控' },
    );
    expect(generated.find(w => w.id === 'bioskills-metagenomics-pipeline')?.category).toBe('微生物与病原分析');
    expect(generated.find(w => w.id === 'bioskills-splicing-pipeline')?.category).toBe('转录组与表观调控');
    expect(generated.find(w => w.id === 'bioskills-gwas-pipeline')?.category).toBeUndefined();
  });
});

describe('新装（无存储）种子注入', () => {
  it('55 个内置流程照常入库且全部带分类', async () => {
    const store = await freshStore();
    const list = await store.loadWorkflows();
    const builtins = list.filter(w => w.source === 'builtin');
    expect(builtins).toHaveLength(55);
    expect(builtins.every(w => Boolean(w.category))).toBe(true);
    expect(builtins.find(w => w.id === 'builtin-rnaseq-qc-align')?.category).toBe('转录组与表观调控');
    expect(builtins.find(w => w.id === 'bioskills-metagenomics-pipeline')?.category).toBe('微生物与病原分析');
    // 13 个 ENCODE 内置流程一并入库
    const encodeBuiltins = builtins.filter(w => w.id.startsWith('encode-'));
    expect(encodeBuiltins).toHaveLength(13);
    expect(encodeBuiltins.every(w => w.category === '转录组与表观调控')).toBe(true);
    const chipseq = builtins.find(w => w.id === 'encode-chipseq-tf');
    // chip/atac/rnaseq 四条已恢复为 HPClaw 原生参数式流程（串行 9 步，无 caper/genome TSV）
    expect(chipseq?.steps.length).toBe(9);
    expect(chipseq?.steps[0]?.title).toContain('Read-only preflight');
    expect(chipseq?.steps[0]?.command).toContain('module av');
    expect(chipseq?.steps[0]?.command).not.toContain('caper');
    expect(chipseq?.manifest?.qcGates.length).toBeGreaterThan(0);
  });

  it('13 条 ENCODE 定义都有固定来源、可解析 DAG 与真实上游入口', async () => {
    const store = await freshStore();
    const encode = store.builtinWorkflows().filter(workflow => workflow.id.startsWith('encode-'));
    expect(encode).toHaveLength(13);
    for (const workflow of encode) {
      expect(workflow.provenance?.sourceUrl).toMatch(/^https:\/\//);
      expect(workflow.provenance?.sourceRef).toBeTruthy();
      expect(workflow.provenance?.upstreamWorkflow).toBeTruthy();
      expect(['encode-dcc', 'encode-partner', 'hpclaw-native']).toContain(workflow.provenance?.provider);
      expect(['official-wrapper', 'reference-extension']).toContain(workflow.provenance?.implementation);
      const graph = resolveWorkflowStepGraph(workflow);
      expect(graph).toHaveLength(workflow.steps.length);
      expect(new Set(graph.map(step => step.stepId)).size).toBe(graph.length);
    }

    // 原生参数式四条：直接指定参考文件路径，不走 genome TSV / caper
    const tf = encode.find(workflow => workflow.id === 'encode-chipseq-tf')!;
    expect(tf.provenance?.provider).toBe('hpclaw-native');
    expect(tf.steps.map(step => step.title).join(' ')).toContain('MACS2 narrow-peak calling');
    expect(tf.steps.map(step => step.title).join(' ')).toContain('IDR');
    expect(tf.params.map(param => param.name)).toEqual(expect.arrayContaining(['INPUT_DIR', 'CONTROL_DIR', 'BWA_INDEX', 'REF_FA', 'BLACKLIST', 'GENOME_SIZE']));

    const histone = encode.find(workflow => workflow.id === 'encode-chipseq-histone')!;
    expect(histone.steps.map(step => step.title).join(' ')).toContain('SPP broad-peak calling');

    const rna = encode.find(workflow => workflow.id === 'encode-rnaseq-bulk')!;
    expect(rna.steps.map(step => step.title).join(' ')).toContain('STAR alignment');
    expect(rna.steps.map(step => step.title).join(' ')).toContain('RSEM gene and isoform quantification');
    expect(rna.params.map(param => param.name)).toEqual(expect.arrayContaining([
      'INPUT_DIR', 'STAR_INDEX', 'RSEM_INDEX', 'GTF', 'LAYOUT', 'STRANDEDNESS',
    ]));

    const wgbs = encode.find(workflow => workflow.id === 'encode-wgbs')!;
    expect(wgbs.provenance?.sourceRef).toContain('48afda6300b06a9f1b7c2156482f8caa6f49ee51');
    expect(wgbs.steps.map(step => step.id)).toEqual(expect.arrayContaining(['prepare-map', 'bscaller', 'coverage', 'extract', 'signals', 'qc']));
    expect(wgbs.steps.map(step => step.id)).not.toContain('pool');

    expect(encode.find(workflow => workflow.id === 'encode-chiapet')?.provenance?.provider).toBe('encode-partner');
    expect(encode.find(workflow => workflow.id === 'encode-eclip')?.provenance?.provider).toBe('encode-partner');
    expect(encode.find(workflow => workflow.id === 'encode-rampage')?.provenance?.upstreamWorkflow).toContain('ENCPL122WIM');
  });
});

describe('内置流程编辑保护（provenance.customized）', () => {
  it('编辑硬编码内置流程后 reload 字段不回滚，并补 customized 标记', async () => {
    const store = await freshStore();
    const list = await store.loadWorkflows();
    const seed = list.find(w => w.id === 'builtin-blast')!;
    expect(seed.provenance?.customized).toBeUndefined();

    const edited = await store.upsertWorkflow({ ...seed, name: '我的 BLAST 定制版' });
    expect(edited.provenance?.customized).toBe(true);

    const reloaded = await store.loadWorkflows();
    const blast = reloaded.find(w => w.id === 'builtin-blast')!;
    expect(blast.name).toBe('我的 BLAST 定制版');
    expect(blast.provenance?.customized).toBe(true);
    expect(blast.category).toBe('任务管理与通用工具');
  });

  it('编辑 BioSkills 流程后 reload 不回滚', async () => {
    const store = await freshStore();
    const list = await store.loadWorkflows();
    const seed = list.find(w => w.id === 'bioskills-gwas-pipeline')!;
    await store.upsertWorkflow({ ...seed, name: '我的 GWAS 笔记版' });

    const reloaded = await store.loadWorkflows();
    const gwas = reloaded.find(w => w.id === 'bioskills-gwas-pipeline')!;
    expect(gwas.name).toBe('我的 GWAS 笔记版');
    expect(gwas.provenance?.provider).toBe('bioskills');
    expect(gwas.provenance?.customized).toBe(true);
  });

  it('未自定义的内置流程仍随种子迁移刷新（含分类纠正）', async () => {
    const store = await freshStore();
    await store.loadWorkflows();
    // 模拟外部篡改库存：名称与分类都被改写
    const raw = JSON.parse(await fs.readFile(storeFile(), 'utf-8')) as Workflow[];
    const blast = raw.find(w => w.id === 'builtin-blast')!;
    blast.name = '被外部篡改';
    blast.category = '错误分类';
    await fs.writeFile(storeFile(), JSON.stringify(raw, null, 2), 'utf-8');

    const reloaded = await store.loadWorkflows();
    const migrated = reloaded.find(w => w.id === 'builtin-blast')!;
    expect(migrated.name).toBe('BLAST 同源比对流程');
    expect(migrated.category).toBe('任务管理与通用工具');
  });
});

describe('内置流程删除持久化', () => {
  it('删除硬编码内置流程后 reload 不复活，且写入 deleted 清单', async () => {
    const store = await freshStore();
    await store.loadWorkflows();
    expect(await store.deleteWorkflow('builtin-blast')).toBe(true);

    const deletedIds = JSON.parse(await fs.readFile(deletedFile(), 'utf-8')) as string[];
    expect(deletedIds).toContain('builtin-blast');

    const reloaded = await store.loadWorkflows();
    expect(reloaded.some(w => w.id === 'builtin-blast')).toBe(false);
    // 缓存命中路径（第二次 load 走 storeCache）同样不复活
    const cached = await store.loadWorkflows();
    expect(cached.some(w => w.id === 'builtin-blast')).toBe(false);
    // 其余内置流程不受影响
    expect(reloaded.filter(w => w.source === 'builtin')).toHaveLength(54);
  });

  it('删除 BioSkills 流程后“重启”也不复活', async () => {
    let store = await freshStore();
    await store.loadWorkflows();
    expect(await store.deleteWorkflow('bioskills-gwas-pipeline')).toBe(true);

    store = await restartStore();
    const reloaded = await store.loadWorkflows();
    expect(reloaded.some(w => w.id === 'bioskills-gwas-pipeline')).toBe(false);
    expect(reloaded.some(w => w.id === 'bioskills-cnv-pipeline')).toBe(true);
    expect(reloaded.filter(w => w.source === 'builtin')).toHaveLength(54);
  });

  it('删除用户自建流程不登记 deleted 清单', async () => {
    const store = await freshStore();
    await store.loadWorkflows();
    const created = await store.upsertWorkflow({ name: '用户流程', steps: [{ title: 't', command: 'c' }] });
    expect(await store.deleteWorkflow(created.id)).toBe(true);
    await expect(fs.readFile(deletedFile(), 'utf-8')).rejects.toMatchObject({ code: 'ENOENT' });
    const reloaded = await store.loadWorkflows();
    expect(reloaded.some(w => w.id === created.id)).toBe(false);
    expect(reloaded.filter(w => w.source === 'builtin')).toHaveLength(55);
  });

  it('mergeGeneratedBioskills 不复活 deleted 清单中的种子（残留项直接移除）', async () => {
    const store = await freshStore();
    const generated = (id: string): Workflow => ({
      id,
      name: id,
      description: '',
      keywords: [],
      params: [],
      steps: [{ title: 's', command: 'c' }],
      provenance: {
        provider: 'bioskills', sourcePath: 'bioSkills/workflows/x/SKILL.md', sourceName: 'x',
        sourceDigest: 'd', importerVersion: '2',
      },
      source: 'builtin',
      createdAt: 1,
      updatedAt: 1,
    });
    const list = [generated('bioskills-deleted')]; // 已删除但因外部改写残留
    const result = store.mergeGeneratedBioskills(
      list,
      [generated('bioskills-deleted'), generated('bioskills-new')],
      new Set(['bioskills-deleted']),
    );
    expect(result.added).toBe(1); // 只有 bioskills-new
    expect(list.some(w => w.id === 'bioskills-new')).toBe(true);
    expect(list.some(w => w.id === 'bioskills-deleted')).toBe(false);
  });
});

describe('upsertWorkflow 分类合并语义', () => {
  it('未携带 category 保持原值，空串清除，值正常更新', async () => {
    const store = await freshStore();
    const created = await store.upsertWorkflow({
      name: '带分类流程', category: '基因组与变异分析', steps: [{ title: 't', command: 'c' }],
    });
    expect(created.category).toBe('基因组与变异分析');

    // 未携带 category → 保持
    const kept = await store.upsertWorkflow({ id: created.id, name: '带分类流程', steps: [{ title: 't', command: 'c' }] });
    expect(kept.category).toBe('基因组与变异分析');

    // 空串 → 清除
    const cleared = await store.upsertWorkflow({ id: created.id, name: '带分类流程', category: '', steps: [{ title: 't', command: 'c' }] });
    expect(cleared.category).toBeUndefined();

    // 自定义分类 → 更新
    const custom = await store.upsertWorkflow({ id: created.id, name: '带分类流程', category: '我的实验流程', steps: [{ title: 't', command: 'c' }] });
    expect(custom.category).toBe('我的实验流程');
  });
});
