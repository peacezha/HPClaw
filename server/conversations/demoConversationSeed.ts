// 示例对话种子：首次启动写入一条"富文本结果展示"示例对话（表格/图片/网页链接），
// 让用户开箱即可看到对话的富文本渲染能力。幂等：标记文件存在即跳过；
// 用户删除示例对话后标记仍在，不会复活（与 workflow 种子的删除语义一致）。
import fs, { promises as fsp } from 'node:fs';
import path from 'node:path';
import { appPath, dataPath } from '../paths';
import { LocalConversationStore } from './localConversations';
import type { ConversationRecordLike } from './clusterConversations';

export const DEMO_CONVERSATION_ID = 'hpclaw-demo-rich-content';
export const DEMO_CONVERSATION_TITLE = '示例：富文本结果展示';
/** 种子版本：示例内容变化时递增标记文件名，触发老库重新播种 */
const SEED_MARKER_FILE = '.demo-seed-v1';

const TABLE_ANSWER = `以下是本次碱基编辑实验的统计结果（3 个重复孔的平均值）：

| 样本 | 孔位 | Modified (%) | WT (%) | 备注 |
| --- | --- | ---: | ---: | --- |
| R16-D | A01 | 87.4 | 12.6 | 编辑效率最高 |
| R16-C | A02 | 84.1 | 15.9 | 重复间稳定 |
| R33-D | B01 | 79.8 | 20.2 | 伴少量 indel |
| R33-C | B02 | 76.5 | 23.5 | — |
| Mock | C01 | 2.3 | 97.7 | 阴性对照 |

整体看 R16 系列的编辑效率优于 R33；Mock 对照背景很低，结果可信。`;

const FIGURES_ANSWER = `两张汇总图已经生成，直接嵌在对话里：

![Editing class distribution](./demo-assets/editing-summary-demo.svg)

图 1：各样本 editing class 分布（堆叠柱状图）。蓝色为 Modified reads 占比，灰色为 WT；R16-D 的 Modified 比例最高（87.4%），Mock 对照几乎全为 WT。

![QC 质量曲线](./demo-assets/qc-curve-demo.svg)

图 2：测序 QC 质量曲线。两条曲线分别是 Read 1 / Read 2 的 per-cycle Q-score，全程维持在 Q26 以上，可进入下游分析。

原始数据与方法学参考：[NCBI](https://www.ncbi.nlm.nih.gov) 与 [示例文档站点](https://example.com)——链接右侧的按钮可以在侧边栏打开网页。`;

function buildDemoRecord(timestamp: number): ConversationRecordLike {
  return {
    id: DEMO_CONVERSATION_ID,
    contextKey: `saved-${DEMO_CONVERSATION_ID}`,
    title: DEMO_CONVERSATION_TITLE,
    messages: [
      { role: 'user', content: '看一下结果表格' },
      { role: 'assistant', content: TABLE_ANSWER },
      { role: 'user', content: '把统计图给我看看' },
      { role: 'assistant', content: FIGURES_ANSWER },
    ],
    summary: '',
    memory: '',
    skillHints: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

/**
 * 随包分发的演示图目录（demo-assets/）。dev 下在源码根；打包后经 asarUnpack
 * 落在 app.asar.unpacked/demo-assets（asar 内 fs.cp 会 ENOENT，与 vendor 同处理）。
 */
function resolveDemoAssetsSource(): string {
  const bundled = appPath('demo-assets');
  const unpacked = bundled.replace(
    `${path.sep}app.asar${path.sep}`,
    `${path.sep}app.asar.unpacked${path.sep}`,
  );
  try {
    if (unpacked !== bundled && fs.existsSync(unpacked)) return unpacked;
  } catch { /* ignore */ }
  return bundled;
}

export interface DemoConversationSeedOptions {
  /** 默认 DATA_ROOT/conversations（标记文件与示例对话都落在这里） */
  conversationsDir?: string;
  /** 默认应用资源目录 demo-assets（asarUnpack 映射后） */
  assetsSourceDir?: string;
  /** 默认 DATA_ROOT/demo-assets（对话里 ./demo-assets/* 的解析根之一） */
  assetsTargetDir?: string;
  /** 可注入拷贝实现（测试断言用）；默认 fs.cp 递归拷贝 */
  copyDir?: (source: string, target: string) => Promise<void>;
  now?: () => number;
}

/**
 * 首次启动播种示例对话；已播种（标记存在）则跳过。
 * 返回是否执行了播种。拷贝/写库失败时不写标记，下次启动重试。
 */
export async function ensureDemoConversationSeed(options: DemoConversationSeedOptions = {}): Promise<boolean> {
  const conversationsDir = options.conversationsDir ?? dataPath('conversations');
  const markerPath = path.join(conversationsDir, SEED_MARKER_FILE);
  try {
    await fsp.access(markerPath);
    return false;
  } catch { /* 未播种 */ }

  const assetsSource = options.assetsSourceDir ?? resolveDemoAssetsSource();
  const assetsTarget = options.assetsTargetDir ?? dataPath('demo-assets');
  // dev 模式 DATA_ROOT == APP_ROOT，源即目标，无需拷贝（仓库内已自带 demo-assets/）
  if (path.resolve(assetsSource) !== path.resolve(assetsTarget)) {
    const copyDir = options.copyDir ?? ((source: string, target: string) => fsp.cp(source, target, { recursive: true }));
    await copyDir(assetsSource, assetsTarget);
  }

  const store = new LocalConversationStore(conversationsDir);
  const timestamp = (options.now ?? Date.now)();
  await store.save(buildDemoRecord(timestamp));

  await fsp.mkdir(conversationsDir, { recursive: true });
  await fsp.writeFile(markerPath, '1', 'utf8');
  return true;
}
