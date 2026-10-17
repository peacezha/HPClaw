/** Mechanical regeneration of the checked-in seed fixture; never userData. */
import fs from 'node:fs/promises';
import { builtinWorkflows, BUILTIN_CATEGORIES, REQUESTED_KEEP_IDS, REQUESTED_REMOVE_IDS } from '../server/workflows/workflowStore';
import { generateBioskillsWorkflows } from '../server/workflows/bioskillsSeed';
import { classifyWorkflowCatalog, isPendingDisposal } from '../shared/workflowCatalog';
import { execFileSync } from 'node:child_process';
const filename = 'workflows/workflows.json';
const original = JSON.parse(process.argv.includes('--baseline-head')
  ? execFileSync('git', ['show', 'HEAD:' + filename], { encoding: 'utf8', maxBuffer: 30_000_000 })
  : await fs.readFile(filename, 'utf8'));
if (original.some((w: any) => w.source !== 'builtin' || w.provenance?.customized)) throw new Error('Refusing to overwrite user/customized workflow definitions');
const seeds = [...builtinWorkflows(), ...await generateBioskillsWorkflows('skills', BUILTIN_CATEGORIES)];
// Preserve BioSkills DAG definitions, saved lifecycle/timestamps and stable
// property order. This script only synchronizes the hard-coded system seeds.
const generated = original.filter((row: any) => !['encode-chipseq-tf', 'encode-chipseq-tf-en'].includes(row.id)).map((row: any) => {
  const seed = seeds.find(next => next.id === row.id);
  return seed ? { ...row, ...seed, createdAt: row.createdAt, updatedAt: row.updatedAt,
    ...(row.lifecycle ? { lifecycle: row.lifecycle } : {}) } : row;
});
generated.push(...seeds.filter(seed => !generated.some((row: any) => row.id === seed.id)));
for (const row of generated) if (REQUESTED_KEEP_IDS.has(row.id)) row.lifecycle = { state: 'active', origin: 'user', updatedAt: row.updatedAt };
classifyWorkflowCatalog(generated);
const kept = generated.filter((row: any) => !REQUESTED_REMOVE_IDS.has(row.id) && !isPendingDisposal(row));
await fs.writeFile(filename, JSON.stringify(kept, null, 2) + '\n');
console.log('Synchronized ' + kept.length + ' system workflow definitions');
