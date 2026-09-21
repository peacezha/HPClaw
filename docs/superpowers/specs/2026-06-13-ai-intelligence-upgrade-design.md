# AI 智能升级设计

## 目标

让 HPClaw 的 AI 更加智能：读懂集群内容、技能之间互相配合、上下文精准压缩、层次化记忆。

## 核心设计理念

**AI 必须能主动读取集群状态，技能不能是孤岛，记忆不能是字符串截断。**

---

## 一、整体架构

```
用户输入
   │
   ▼
┌──────────────────────────────────────────┐
│  1. ClusterContextProvider 采集快照       │  AI 主动"看"集群
│     文件系统 + 作业状态 + 资源 + 模块      │
└──────────────┬───────────────────────────┘
               ▼
┌──────────────────────────────────────────┐
│  2. FileRecognizer 文件→技能自动关联      │  智能识别
│     FASTQ → qc, BAM → alignment...       │
└──────────────┬───────────────────────────┘
               ▼
┌──────────────────────────────────────────┐
│  3. Skill Orchestrator 技能组合检索       │  受集群内容驱动
│     语义搜索 + 图谱展开 + Bible分片       │
└──────────────┬───────────────────────────┘
               ▼
┌──────────────────────────────────────────┐
│  4. Memory Orchestrator 记忆注入          │  历史上下文
│     工作记忆 + 短期记忆 + 长期记忆         │
└──────────────┬───────────────────────────┘
               ▼
┌──────────────────────────────────────────┐
│  5. Token Budget Manager 组装最终Prompt   │  精确控制
│     动态分配 + 优先级裁剪                  │
└──────────────┬───────────────────────────┘
               ▼
┌──────────────────────────────────────────┐
│  6. Agent Planner 任务规划 (Agent模式)     │  层次化执行
│     目标→阶段→步骤, 每步独立上下文         │
└──────────────────────────────────────────┘
               │
               ▼
         AI Provider (DeepSeek V4 / Gemini / etc.)
```

### 新增文件

```
server/ai/
├── types.ts              # 扩展类型
├── tokenBudget.ts        # [新增] Token 预算管理器
├── clusterContext.ts     # [新增] 集群上下文采集
├── fileRecognizer.ts     # [新增] 文件类型→技能关联
├── skillGraph.ts         # [新增] 技能互作图谱
├── skillOrchestrator.ts  # [新增] 技能组合编排
├── skillIndex.ts         # [修改] 增加向量嵌入支持
├── memoryOrchestrator.ts # [新增] 三层记忆管理
├── memoryCompressor.ts   # [新增] AI 驱动记忆压缩
├── observationStore.ts   # [新增] 结构化观测存储
├── agentPlanner.ts       # [新增] 层次化任务规划
└── contextBuilder.ts     # [重写] 整合以上组件
```

### 修改文件

```
server/ai/
├── skillIndex.ts         # 增加 embedding 索引
├── conversationMemory.ts # 升级为结构化记忆
├── skillInstaller.ts     # 安装时自动建立技能关系
└── types.ts              # 扩展类型定义

server.ts                 # 路由使用新组件
src/components/AIChat.tsx # Agent 循环使用规划器
```

---

## 二、ClusterContextProvider —— AI 的眼睛

AI 必须主动读取集群内容，而非被动等待用户告知。

实现方式：通过已有的 SSH 会话执行快照命令（复用 `server/sshOperations.ts` 的 `runViaSSH`），在 AI 请求处理流程中异步采集，采集结果缓存 30 秒避免重复执行。

### 采集策略

| 触发时机 | 采集内容 | 预期耗时 |
|----------|---------|---------|
| 每次 AI 请求 | pwd + ls -lh | <0.5s |
| Agent 每轮循环 | pwd + ls + bjobs -w + quota -s | ~2s |
| 新会话/阶段切换 | 完整快照: module list, bqueues, 目录树 | ~5s |
| 作业状态变化 | bjobs 指定 jobId + 产出文件检测 | ~1s |

### 采集命令模板

```typescript
const SNAPSHOTS = {
  quick: "pwd && ls -lh --time-style=long-iso | head -80",
  standard: "echo '===PWD===' && pwd && echo '===FILES===' && ls -lh --time-style=long-iso | head -80 && echo '===JOBS===' && bjobs -w 2>/dev/null | head -20 && echo '===QUOTA===' && quota -s 2>/dev/null | head -5",
  full: "echo '===PWD===' && pwd && echo '===FILES===' && ls -lhR --time-style=long-iso | head -200 && echo '===JOBS===' && bjobs -w 2>/dev/null | head -30 && echo '===QUEUES===' && bqueues 2>/dev/null | head -20 && echo '===MODULES===' && module list 2>/dev/null && echo '===QUOTA===' && quota -s 2>/dev/null | head -10",
  jobCheck: (jobId: string) => `bjobs -l ${jobId} 2>/dev/null | head -20 && echo '===OUTPUT===' && ls -lt *${jobId}* 2>/dev/null | head -10`,
};
```

### 输出格式

集群快照解析后输出结构化数据：

```typescript
interface ClusterSnapshot {
  workingDir: string;
  files: FileEntry[];
  jobs: JobEntry[];
  quota: QuotaInfo;
  modules: string[];
  queueStatus: QueueInfo[];
  timestamp: number;
}

interface FileEntry {
  name: string;
  size: number;
  modified: number;
  type: 'fastq' | 'fasta' | 'bam' | 'vcf' | 'log' | 'script' | 'directory' | 'other';
  recognizedSkillHints: string[];  // 自动关联的技能
}

interface JobEntry {
  jobId: string;
  name: string;
  status: 'RUN' | 'PEND' | 'DONE' | 'EXIT' | 'UNKNOWN';
  cores: number;
  queue: string;
  runtime: string;
}
```

---

## 三、FileRecognizer —— 文件智能识别

将文件自动关联到技能，驱动 Skill Orchestrator。

### 识别规则

```typescript
const FILE_SKILL_MAP: Record<string, { skills: string[]; context: string }> = {
  '*.fastq.gz':   { skills: ['qc', 'fastp'],          context: 'FASTQ测序数据' },
  '*.fastq':      { skills: ['qc', 'fastp'],          context: 'FASTQ测序数据' },
  '*.bam':        { skills: ['alignment', 'formats'],  context: '比对结果BAM' },
  '*.sam':        { skills: ['alignment', 'formats'],  context: '比对结果SAM' },
  '*.vcf':        { skills: ['formats'],               context: '变异检测结果VCF' },
  '*.g.vcf':      { skills: ['formats'],               context: 'GVCF变异中间文件' },
  '*.bed':        { skills: ['formats'],               context: '基因组区间BED' },
  '*.gff':        { skills: ['formats'],               context: '注释文件GFF' },
  '*.gtf':        { skills: ['formats', 'alignment'],  context: '基因注释GTF' },
  '*.fa':         { skills: ['alignment'],             context: '参考基因组FASTA' },
  '*.fasta':      { skills: ['alignment'],             context: '参考基因组FASTA' },
  '*.lsf':        { skills: ['lsf-ncpgr'],             context: 'LSF作业脚本' },
  '*.sh':         { skills: ['lsf-ncpgr'],             context: 'Shell脚本' },
  '*.html':       { skills: [],                        context: 'HTML报告' },
  '*.csv':        { skills: [],                        context: '表格数据CSV' },
  '*.tsv':        { skills: [],                        context: '表格数据TSV' },
  '*.png':        { skills: [],                        context: '图片PNG' },
  '*.pdf':        { skills: [],                        context: 'PDF文档' },
  '*.R':          { skills: ['nature-figure'],         context: 'R脚本' },
  '*.py':         { skills: [],                        context: 'Python脚本' },
};
```

### 自动推断上下文

```
目录扫描结果 → 文件类型统计 → 推断当前分析阶段 → 触发对应技能

例:
  qc_results/ + multiqc_report.html → "质控阶段已完成"
  aligned/*.bam ×45/100 → "比对进行中 45%"
  *.g.vcf ×100 → "变异检测阶段, 所有样本已完成"
```

---

## 四、Skill Graph —— 技能互作图谱

### 核心问题

当前 125 个技能各自独立，AI 不知道它们之间的关系。技能互作是让 AI 聪明的关键。

### 关系类型

```typescript
type SkillRelation = 'depends_on' | 'related_to' | 'used_with' | 'triggers' | 'solves';

interface SkillEdge {
  from: string;      // 技能文件名
  to: string;        // 关联技能文件名
  relation: SkillRelation;
  weight: number;    // 1-10, 关联强度
  reason: string;    // 为什么关联
}
```

### 三层关系构建

**第一层：静态声明（SKILL.md frontmatter）**

```yaml
---
name: transcriptome
description: RNA-seq 转录组分析流程
depends_on: [alignment, qc]
related_to: [lsf-ncpgr, ncpgr-software, formats]
used_with: [nature-figure, nature-data]
triggers: ["RNA-seq", "转录组", "差异表达", "DEG"]
solves: ["差异表达分析", "转录本定量"]
---
```

**第二层：语义相似度（embedding 自动计算）**

启动时对所有技能建立向量索引，计算技能间余弦相似度，自动补充隐含关联。

实现方案：使用 `@xenova/transformers` 在 Node.js 端本地运行 `all-MiniLM-L6-v2` 模型（~80MB，首次下载后缓存）。该模型将文本转为 384 维向量，足够做技能间的语义相似度计算，无需外部 API 调用。若本地环境不支持，降级为 TF-IDF + BM25 关键词检索。

**第三层：运行时关联（观测驱动）**

当集群上下文检测到特定文件类型或命令时，自动建立临时关联。如 `samtools sort` 的执行记录关联到 `alignment` 技能。

### 图谱查询

```typescript
// 从入口技能展开 N 跳
expandFromSkill('transcriptome', {
  maxHops: 2,
  relations: ['depends_on', 'related_to', 'used_with'],
  minWeight: 5,
  maxSkills: 8,
});
// → [transcriptome, alignment, qc, lsf-ncpgr, ncpgr-software, formats, nature-figure]

// 从多个入口合并展开
expandFromHints(['RNA-seq', '比对', 'BAM'], {
  maxHops: 1,
  maxSkills: 10,
});
```

---

## 五、Skill Orchestrator —— 技能组合编排

### 输入→输出

```
输入: 用户问题 + 集群快照 + 记忆上下文 + Token预算
         │
         ▼
  1. 语义搜索找到入口技能
  2. 图谱展开获取关联技能
  3. Bible 分片检索相关章节
  4. 按 Token 预算裁剪
         │
         ▼
输出: SkillKnowledgePack (结构化的知识包)
```

### SkillKnowledgePack 结构

```typescript
interface SkillKnowledgePack {
  core: SkillSnippet;           // 核心技能的关键章节
  dependencies: SkillSnippet[]; // 依赖技能的摘要
  related: SkillSnippet[];      // 关联技能的摘要
  bible: BibleChunk[];          // Bible 相关分片
  totalTokens: number;          // 总 token 数
}

interface SkillSnippet {
  skillFile: string;
  chapter?: string;             // 具体章节（非全量）
  content: string;              // 裁剪后的内容
  tokenCount: number;
  relevanceScore: number;
}
```

### Bible 分片

35KB 的 SKILL.md 不再全量注入，而是按 `##` 标题分片，根据用户问题语义检索相关章节：

```
SKILL.md 分片:
  ## 总则 → 集群基础规则
  ## 查询软件/数据库是否可用 → mii 使用
  ## 多样本多步骤流程的提交策略 → 逐步 vs 依赖链
  ## 常见软件资源推荐 → 核数内存表
  ## 各软件具体优化 → 按软件名分片

"帮我做RNA-seq" → 检索到: "STAR核数推荐", "LSF提交规范", "模块加载方法"
"怎么查BLAST数据库" → 检索到: "查询软件/数据库", "mii使用说明", "BLAST章节"
```

---

## 六、Memory Orchestrator —— 三层记忆

### 架构

```
┌─────────────────────────────────────────────┐
│  工作记忆 (Working Memory)                    │
│  • 最近 N 条消息 (token 窗口内)                │
│  • 当前 Agent 子任务的上下文                   │
│  • 生命周期: 当前请求                          │
└───────────────────┬─────────────────────────┘
                    │ 压缩 → 
┌───────────────────▼─────────────────────────┐
│  短期记忆 (Short-term Memory)                 │
│  • AI 生成的会话摘要                           │
│  • 结构化关键事实:                              │
│    { key: "工作目录", value: "/home/userB/rnaseq/" }│
│    { key: "样本数", value: "100个双端FASTQ" }    │
│    { key: "参考基因组", value: "hg38" }          │
│    { key: "当前阶段", value: "比对 45/100" }     │
│  • 决策历史 (为什么选这个参数)                    │
│  • 生命周期: 当前会话                            │
└───────────────────┬─────────────────────────┘
                    │ 持久化 →
┌───────────────────▼─────────────────────────┐
│  长期记忆 (Long-term Memory)                  │
│  • 持久化到 conversations/*.json              │
│  • 跨会话可恢复                                │
│  • 用户偏好: "喜欢 STAR 而非 HISAT2"           │
│  • 集群环境快照 (上次的队列、模块版本)           │
│  • 生命周期: 永久                               │
└─────────────────────────────────────────────┘
```

### 记忆压缩

替换当前的字符串截断，升级为 AI 驱动的结构化压缩：

```typescript
interface StructuredMemory {
  task: string;              // "RNA-seq差异表达分析"
  progress: {                // 当前进度
    phase: number;           // 阶段 2/4
    description: string;     // "STAR比对中"
    completed: number;       // 45/100
  };
  keyFacts: Array<{
    category: string;        // "environment" | "data" | "method" | "result"
    fact: string;            // "参考基因组 hg38 索引在 /home/ref/star_hg38/"
    timestamp: number;
  }>;
  decisions: Array<{
    what: string;            // "选择STAR而不用HISAT2"
    why: string;             // "用户偏好 + 集群手册推荐"
  }>;
  skillsUsed: string[];     // ["transcriptome", "alignment", "qc"]
  errors: Array<{
    error: string;
    resolution: string;
  }>;
  generatedAt: number;
}
```

### 压缩触发条件

- 对话消息超过 15 条
- Token 预算中对话历史占比超过 40%
- 用户切换话题 (语义检测)
- Agent 阶段切换

### 压缩流程

```
1. 提取最近 15 轮非系统消息
2. 调用轻量模型做结构化总结 → StructuredMemory
   (使用 deepseek-chat，temperature=0，maxTokens=800)
3. 合并到已有短期记忆中 (增量更新 keyFacts)
4. 重要事实自动提升到长期记忆
5. 对话历史替换为: [记忆摘要] + 最近 5 轮交互
```

压缩使用 `deepseek-chat` 而非主力模型，节省推理成本。压缩请求独立于主对话，不影响主请求的 token 预算。

---

## 七、Token Budget Manager —— 精确控制

DeepSeek V4 有 128K 窗口，需要精确分配。

### 预算分配

```
128K Token 总预算
├── 固定开销 (~3%)
│   ├── System Persona: 200 tokens
│   ├── Mode Prompt: 100 tokens
│   └── 格式开销: ~500 tokens
│
├── 集群上下文 (8-12%)
│   ├── 文件系统快照: 取决于目录内容
│   ├── 作业状态: bjobs 解析结果
│   └── 资源状态: quota + queue
│
├── 技能知识包 (20-25%)
│   ├── 核心技能关键章节
│   ├── 图谱展开关联技能摘要
│   └── Bible 相关分片
│
├── 记忆层 (10-15%)
│   ├── 短期记忆 (结构化摘要)
│   └── 关键事实列表
│
├── Observations (5-8%)
│   └── 结构化终端状态 (重要性>=2)
│
├── 对话历史 (30-35%)
│   └── 最近 user/assistant 消息 (优先保留有实质内容的)
│
└── 响应预留 (15%)
    └── AI 生成回复的空间
```

### 动态调整规则

- 对话历史不足 5 条 → 释放给技能包
- 集群快照为空 → 释放给记忆层
- 技能检索结果少 → 释放给对话历史
- 预算紧张时 → 按 priority 裁剪: 对话历史(5) > 集群上下文(7) > Observations(8) > 记忆(9) > 技能(10)

### 跨模型适配

```typescript
const MODEL_WINDOWS: Record<string, number> = {
  'deepseek-v4-pro': 131072,
  'deepseek-chat': 65536,
  'deepseek-reasoner': 65536,
  'gemini-3.1-pro-preview': 1048576,
  'gpt-4o-mini': 131072,
  'grok-2-latest': 131072,
  'moonshot-v1-32k': 32768,
};
```

---

## 八、Agent Planner —— 层次化任务规划

### 当前问题

Agent 循环是盲飞 —— 每次问 AI "下一步做什么"，越往后越健忘。

### 设计方案

先规划、再执行、边执行边修正：

```typescript
interface TaskPlan {
  goal: string;                    // "100样本 RNA-seq 差异表达分析"
  phases: Phase[];
  currentPhase: number;
  createdAt: number;
}

interface Phase {
  id: number;
  name: string;                    // "质控" | "比对" | "定量" | "差异分析"
  status: 'pending' | 'active' | 'done' | 'failed';
  steps: Step[];
  linkedSkills: string[];          // 该阶段关联的技能
  entryConditions: string[];       // 开始条件
}

interface Step {
  id: string;                      // "1.1"
  description: string;             // "fastp 质控 100 样本"
  command?: string;
  status: 'pending' | 'running' | 'done' | 'failed';
  result?: string;                 // 执行结果摘要
  linkedSkills: string[];          // 该步骤关联的技能
  jobId?: string;                  // 若提交了作业
}
```

### 规划流程

```
1. 用户给出任务 → 调用 AI 做一次规划 (生成 TaskPlan)
2. 展示计划给用户确认
3. 按 Phase 顺序执行:
   a. 采集集群快照
   b. 检索当前 Phase 关联的技能知识包
   c. 注入阶段上下文 + 技能包 + 记忆
   d. AI 生成具体命令
   e. 执行命令，结构化记录结果
   f. 更新进度
4. Phase 完成 → 记忆压缩 → 进入下一 Phase
5. 出错 → 错误分析 + 技能扩展检索 → 修正方案
```

### 与技能图谱的互作

```
Planner 分解 Phase → 每 Phase 声明 linkedSkills
                       ↓
执行 Phase 时 → Skill Orchestrator 优先检索 linkedSkills + 图谱展开
                       ↓
Phase 切换时 → 释放旧技能 token → 加载新 Phase 技能包
                       ↓
出错时 → 自动扩展技能检索范围，找"这个错误怎么解决"
```

---

## 九、Structured Observations —— 结构化观测

替换全局字符串数组，升级为有类型的可推理结构：

```typescript
interface Observation {
  id: string;
  type: 'command' | 'output' | 'error' | 'warning' | 'state_change' | 'job_submit' | 'file_create';
  timestamp: number;
  command?: string;
  exitCode?: number;
  summary: string;               // AI 生成的一句话摘要
  importance: 1 | 2 | 3;        // 1=背景 2=有用 3=关键
  relatedSkills: string[];       // 自动关联的技能
  relatedFiles: string[];        // 产出的文件
  causalFrom?: string;           // 由哪个观测引起
}

// 存储
class ObservationStore {
  private observations: Observation[] = [];
  maxCount = 500;

  add(obs: Observation): void;
  
  recent(filters: {
    importance?: number[];       // [2, 3] = 只要有用+关键
    types?: string[];
    relatedToStep?: string;      // 当前 Agent 步骤相关
    maxTokens?: number;
  }): Observation[];
  
  summarize(): string;           // 生成结构化文本供 AI 使用
}
```

---

## 十、Context Builder —— 最终组装

```typescript
async function buildSmartContext(options: ContextBuildOptions): Promise<AIMessage[]> {
  // 1. 确定模型 → 建立 Token 预算
  const budget = new TokenBudgetManager(options.model);
  
  // 2. 采集集群快照 (根据模式决定采集深度)
  const snapshot = await clusterContext.collect({
    depth: options.mode === 'agent' ? 'standard' : 'quick',
    sshSessionId: options.sshSessionId,
  });
  
  // 3. 文件→技能自动关联
  const fileHints = fileRecognizer.analyze(snapshot.files);
  
  // 4. 记忆提取
  const memory = memoryStore.getCurrentSession();
  
  // 5. Agent 计划 (agent 模式)
  const plan = options.mode === 'agent' 
    ? agentPlanner.currentPlan() 
    : null;
  
  // 6. 技能组合检索 —— 核心互作
  const skillPack = await skillOrchestrator.buildPack({
    userQuery: latestUserMessage(options.messages),
    clusterHints: fileHints,           // 集群文件驱动的技能提示
    planHints: plan?.currentPhase?.linkedSkills,
    memoryHints: memory?.keyFacts?.map(f => f.fact),
    tokenBudget: budget.get('skills'),
  });
  
  // 7. 结构化观测
  const observations = observationStore.recent({
    importance: [2, 3],
    maxTokens: budget.get('observations'),
  });
  
  // 8. 对话历史 (token 滑动窗口)
  const conversation = trimConversationByTokens(
    options.messages,
    budget.get('conversation'),
  );
  
  // 9. 组装
  return assemblePrompt({
    persona: 'You are HPClaw...',
    clusterContext: formatClusterContext(snapshot, fileHints),
    skillPack,
    memory: formatMemory(memory),
    plan: formatPlan(plan),
    observations: formatObservations(observations),
    conversation,
  });
}
```

---

## 十一、技能关系声明规范

对现有 125 个技能的 frontmatter 逐步增加关系字段：

```yaml
---
name: <技能名>
description: <描述>
tags: [<标签>]
trigger: <触发条件>

# 新增关系字段
depends_on: [<前置技能>]      # 使用本技能需要了解的前置知识
related_to: [<相关技能>]       # 主题相关的技能
used_with: [<配合技能>]       # 实际使用时经常一起用的技能
solves: [<解决的问题>]         # 本技能解决的具体问题 (用于反向检索)
---
```

首批建立关系的核心技能：`transcriptome`, `alignment`, `qc`, `formats`, `lsf-ncpgr`, 以及 9 个 nature 系列技能。

---

## 十二、实施优先级

| 优先级 | 组件 | 原因 |
|--------|------|------|
| P0 | Token Budget Manager | 地基，所有组件依赖它 |
| P0 | ClusterContextProvider + FileRecognizer | AI 的"眼睛"，让 AI 能读集群 |
| P0 | Skill Graph | 技能互作的基础设施 |
| P1 | Skill Orchestrator (含 Bible 分片) | 依赖 Skill Graph |
| P1 | Memory Orchestrator (含压缩) | 依赖 Token Budget |
| P2 | Agent Planner | 依赖以上全部 |
| P2 | Observation Store | 增强观测 |
| P3 | Context Builder 重写 | 整合所有组件 |
