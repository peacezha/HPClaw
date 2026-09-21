import { describe, expect, it } from 'vitest';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  BIOSKILLS_IMPORTER_VERSION,
  BIOSKILLS_RETIRED,
  extractQcCheckpoints,
  extractStepsFromBody,
  generateBioskillsWorkflows,
  parseSkillFrontmatter,
} from './bioskillsSeed';
import { mergeGeneratedBioskills } from './workflowStore';
import type { Workflow } from './workflowTypes';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'skills', 'bioSkills', 'workflows');

async function skill(slug: string): Promise<string> {
  return fs.readFile(path.join(ROOT, slug, 'SKILL.md'), 'utf-8');
}

describe('BioSkills importer v2 markdown coverage', () => {
  it('parses inline YAML arrays instead of silently dropping dependencies and QC names', async () => {
    const parsed = parseSkillFrontmatter(await skill('clip-pipeline'));
    expect(parsed?.dependsOn).toHaveLength(8);
    expect(parsed?.dependsOn).toContain('clip-seq/clip-qc');
    expect(parsed?.qcCheckpoints).toHaveLength(5);
    expect(parsed?.versionTools).toContain('STAR');
  });

  it('recognizes numbered headings, Stage headings, and numbered markers inside a monolithic script', async () => {
    expect(extractStepsFromBody(await skill('cytometry-pipeline')).map(step => step.title)).toEqual(expect.arrayContaining([
      'Panel, Metadata, and Load',
      'Differential Abundance and State',
    ]));
    expect(extractStepsFromBody(await skill('metabolomics-pipeline')).map(step => step.title)).toEqual(expect.arrayContaining([
      'Feature Extraction (modern xcms 4.x)',
      'Pathway Mapping (the background is the null)',
    ]));
    const microbiome = extractStepsFromBody(await skill('microbiome-pipeline'));
    expect(microbiome).toHaveLength(10);
    expect(microbiome[0].title).toBe('READ FILES');
    expect(microbiome[9].title).toBe('OUTPUT');
  });

  it('turns QC markdown tables into structured gates', async () => {
    const microbiome = extractQcCheckpoints(await skill('microbiome-pipeline'));
    expect(microbiome).toHaveLength(6);
    expect(microbiome[0]).toEqual({ key: 'Filter — >70% reads pass', value: '>70%' });
    const metabolomics = extractQcCheckpoints(await skill('metabolomics-pipeline'));
    expect(metabolomics.length).toBeGreaterThanOrEqual(8);
    expect(metabolomics.some(item => item.key.includes('Drift correction'))).toBe(true);
  });
});

describe('BioSkills importer v2 generated contracts', () => {
  it('generates every source workflow atomically with traceable Agent steps', async () => {
    // v3 起与 ENCODE 金标准重复的 6 条（atacseq/chipseq/rnaseq-to-de/hic/clip/smrna）退役，不再生成
    const sourceDirs = (await fs.readdir(ROOT, { withFileTypes: true }))
      .filter(entry => entry.isDirectory() && !BIOSKILLS_RETIRED.has(entry.name));
    const workflows = await generateBioskillsWorkflows(path.join(ROOT, '..', '..'));
    expect(workflows).toHaveLength(sourceDirs.length);
    expect(new Set(workflows.map(workflow => workflow.id)).size).toBe(workflows.length);

    for (const workflow of workflows) {
      expect(workflow.provenance?.provider).toBe('bioskills');
      expect(workflow.provenance?.importerVersion).toBe(BIOSKILLS_IMPORTER_VERSION);
      expect(workflow.steps.at(-1)?.agent?.kind).toBe('report');
      expect(workflow.steps.some(step => step.command.includes('search_skills 读取该技能'))).toBe(false);
      for (const step of workflow.steps) {
        expect(step.command.length).toBeLessThanOrEqual(8_000);
        expect(step.agent?.sourcePath).toContain('bioSkills/workflows/');
      }
      for (const gate of workflow.manifest?.qcGates ?? []) {
        expect(gate.afterStep).toBeGreaterThanOrEqual(1);
        expect(gate.afterStep).toBeLessThanOrEqual(workflow.steps.length);
      }
    }
  });

  it('uses assay-correct input/reference profiles instead of one generic REFERENCE', async () => {
    const workflows = await generateBioskillsWorkflows(path.join(ROOT, '..', '..'));
    const refs = (slug: string) => workflows.find(item => item.id === `bioskills-${slug}`)?.manifest?.references.map(item => item.path);
    expect(refs('clinical-trial-pipeline')).toEqual([]);
    expect(refs('causal-genomics-pipeline')).toContain('{{LD_REFERENCE}}');
    expect(refs('gwas-pipeline')).toContain('{{VARIANT_ANNOTATION}}');
    expect(refs('edna-pipeline')).toContain('{{TAXONOMY_DB}}');
    expect(refs('cytometry-pipeline')).toContain('{{PANEL_FILE}}');
    expect(refs('longread-sv-pipeline')).toContain('{{GENOME_FASTA}}');
  });

  it('models decisions and optional alternatives rather than executing mutually exclusive paths in sequence', async () => {
    const workflows = await generateBioskillsWorkflows(path.join(ROOT, '..', '..'));
    const liquid = workflows.find(item => item.id === 'bioskills-liquid-biopsy-pipeline')!;
    // v3：第 1 步固定为环境检查（qc），决策步骤紧随其后
    expect(liquid.steps[0].agent?.kind).toBe('qc');
    expect(liquid.steps[0].command).toContain('check_mod');
    expect(liquid.steps[1].agent?.kind).toBe('decision');
    expect(liquid.steps.filter(step => /Tumor Fraction|Mutation Detection/.test(step.title)).every(step => step.optional)).toBe(true);
    const multiOmics = workflows.find(item => item.id === 'bioskills-multi-omics-pipeline')!;
    expect(multiOmics.steps.some(step => step.optional && step.title.includes('DIABLO'))).toBe(true);
    expect(multiOmics.steps.some(step => step.optional && step.title.includes('Similarity Network Fusion'))).toBe(true);
  });
});

describe('BioSkills managed seed upgrades', () => {
  const generated = (id: string, name: string): Workflow => ({
    id,
    name,
    description: 'new',
    keywords: ['new'],
    params: [],
    steps: [{ title: 'new step', command: 'new command' }],
    manifest: { software: [], references: [], qcGates: [] },
    provenance: {
      provider: 'bioskills', sourcePath: 'bioSkills/workflows/x/SKILL.md', sourceName: 'x',
      sourceDigest: 'newdigest', importerVersion: BIOSKILLS_IMPORTER_VERSION,
    },
    source: 'builtin',
    createdAt: 1,
    updatedAt: 1,
  });

  it('refreshes legacy generated rows, removes obsolete system rows, and preserves customized rows', () => {
    const legacy: Workflow = { ...generated('bioskills-a', 'old'), description: 'old', provenance: undefined };
    const customized: Workflow = {
      ...generated('bioskills-b', 'my custom name'),
      provenance: { ...generated('x', 'x').provenance!, customized: true },
    };
    const obsolete = generated('bioskills-obsolete', 'obsolete');
    const userCopy: Workflow = { ...generated('bioskills-user-copy', 'user copy'), source: 'user' };
    const store = [legacy, customized, obsolete, userCopy];
    const result = mergeGeneratedBioskills(store, [generated('bioskills-a', 'new a'), generated('bioskills-b', 'new b')]);
    expect(result).toMatchObject({ updated: 1, removed: 1, preserved: 1, changed: true });
    expect(store.find(item => item.id === 'bioskills-a')?.name).toBe('new a');
    expect(store.find(item => item.id === 'bioskills-b')?.name).toBe('my custom name');
    expect(store.some(item => item.id === 'bioskills-obsolete')).toBe(false);
    expect(store.some(item => item.id === 'bioskills-user-copy')).toBe(true);
  });
});
