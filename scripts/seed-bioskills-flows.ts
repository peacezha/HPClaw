// bioSkills 流水线手动灌入脚本（薄封装）。
// 逻辑本体在 server/workflows/bioskillsSeed.ts；应用启动时 loadWorkflows 会自动补齐，
// 本脚本只用于手动刷新/调试。
//
// 用法（在 源码/ 目录下）：
//   HPCLAW_DATA_ROOT=<用户数据目录> npx tsx scripts/seed-bioskills-flows.ts
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadWorkflows, mergeGeneratedBioskills, saveWorkflows } from '../server/workflows/workflowStore';
import { generateBioskillsWorkflows } from '../server/workflows/bioskillsSeed';
import { appPath } from '../server/paths';

export {
  extractQcCheckpoints,
  extractStepsFromBody,
  extractTunables,
  parseSkillFrontmatter,
  workflowFromSkill,
} from '../server/workflows/bioskillsSeed';

async function main(): Promise<void> {
  const generated = await generateBioskillsWorkflows(appPath('skills'));
  const store = await loadWorkflows();
  const result = mergeGeneratedBioskills(store, generated);
  await saveWorkflows(store);
  console.log(`完成：新增 ${result.added}，更新 ${result.updated}，移除旧项 ${result.removed}，保留用户修改 ${result.preserved}（共生成 ${generated.length} 个流水线）`);
}

const isDirectRun = !!process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
