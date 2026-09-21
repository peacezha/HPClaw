# HPClaw 2.0 — 生信智能集群助手升级设计

**Date**: 2026-05-15
**Status**: Approved
**Approach**: A+B Hybrid (Progressive Enhancement + IDE Panels)

## Overview

HPClaw 从一个通用 HPC 终端工具升级为面向生物信息学的智能集群助手。核心变化：

1. AI 聊天支持混合富媒体内容展示（图片、表格、PDF、代码、生信格式）
2. BioSkill 引擎：预置生信工具知识 + nature-skills 学术技能 + 用户 SOP + 被动学习
3. 面板系统从固定三栏升级为可拖拽 IDE 风格
4. 后端新增 File Content API、Observation Logger、Skill Indexer

## Architecture

### Knowledge Hierarchy
```
skills/
├── bio/                    ← Preloaded bioinformatics tools (Phase 1 NEW)
│   ├── alignment.md        ← BLAST, bwa, bowtie2, minimap2, STAR, HISAT2
│   ├── variants.md         ← GATK, samtools, bcftools, freebayes
│   ├── transcriptome.md    ← DESeq2, edgeR, Salmon, kallisto
│   ├── qc.md               ← FastQC, MultiQC, fastp, Trimmomatic
│   ├── assembly.md         ← SPAdes, Canu, Flye, hifiasm
│   ├── annotation.md       ← Prokka, eggNOG, InterProScan
│   ├── formats.md          ← FASTA/Q, SAM/BAM, VCF, GFF/GTF, BED, PDB
│   └── phylogeny.md        ← MAFFT, IQ-TREE, RAxML, MrBayes
├── nature/                 ← nature-skills integration (Phase 1 NEW)
│   ├── reader/             ← Paper reading & translation
│   ├── writing/            ← Academic writing
│   ├── polishing/          ← Paper polishing
│   ├── academic-search/    ← Literature search
│   ├── citation/           ← Citation management
│   ├── data/               ← Data handling
│   ├── figure/             ← Figure creation
│   ├── paper2ppt/          ← Paper to PPT
│   └── response/           ← Reviewer response
├── system/                 ← Existing (expanded)
│   ├── hpc-best-practices.md  ← Expanded: LSF/Slurm usage, resource mgmt, module system
│   └── lsf-ncpgr.md        ← Existing LSF scheduler reference
└── user/                   ← User-uploaded SOPs
```

### Phase 1 Implementation Scope

**Module 1: RichContent Rendering System**
- `RendererRegistry`: Pluggable renderer registration pattern
- Renderers: Image, Table (CSV/TSV virtualized), Code (highlight.js), PDF (iframe), FASTA, VCF, Log
- File Type Detector: Extension-based with server-side magic number fallback
- Auto-detection pipeline: AI response → extract paths → resolve type → fetch content → render
- Inline vs Panel routing: <500KB inline card, >=500KB "Click to load" or route to panel

**Module 2: BioSkill Engine**
- Preloaded bioinformatics tool database (7+ categories, 30+ tools)
- nature-skills integration as sub-category
- Hybrid retrieval: keyword match → semantic embedding search fallback
- Context window budgeting: max 30% of AI context, priority-ordered injection
- Skill browser UI with search, expand/collapse, category filter

**Module 3: File Content API (Backend)**
- `POST /api/files/read` — SCP single file to memory, detect type, return typed content
- `POST /api/files/read/batch` — Read multiple files at once
- Response format: `{ type, content (base64 for binary, string for text), metadata: { size, mime, dimensions? } }`
- Large file handling: Stream chunks, set size limits (50MB max)

**Module 4: Observation Logger (Backend)**
- Log: commands executed, directories visited, modules loaded, job scripts submitted
- Generate daily user profile summary
- Feed learned patterns back into BioContext for AI prompts

**Module 5: Panel System (Phase 1 enhancements)**
- Right panel: Tabbed interface (Files | Results | BioSkills)
- Collapsible panels with smooth animations
- HPC Best Practices as pinned reference card

### Phase 2 (Future)

- `allotment.js` based draggable/resizable split panels
- Multi-tab workspace (Terminal tabs, AI session tabs)
- Activity bar for panel switching
- Split-view: Terminal + AI side-by-side or stacked
- Drag-and-drop file upload

## Data Flow

### File Content Display Flow
```
1. AI responds with file path in text
2. Frontend FilePathExtractor regex-matches paths
3. FileTypeResolver maps extension → renderer type
4. Frontend calls POST /api/files/read { path }
5. Backend SCPs file from cluster to memory buffer
6. Backend detects MIME, returns { type, content, metadata }
7. Frontend selects renderer from registry
8. Renders inline card (<500KB) or lazy-load card
```

### BioSkill Injection Flow
```
1. User sends message to AI
2. Frontend extracts keywords from message
3. POST /api/ai/stream { messages, context: { bioSkills: [...] } }
4. Backend queries skill index with keywords
5. Ranked results injected into system prompt
6. AI responds with domain-aware answer
```

## Key Design Decisions

1. **Markdown files for knowledge storage** — Simple, searchable, existing skill system compatible
2. **Renderer plugin pattern** — Each file type = one component, registered in central map
3. **Hybrid search** — Fast keyword first, semantic embedding as fallback
4. **Lazy content loading** — Don't block chat on large file transfers
5. **Context budget** — Never exceed 30% of AI context window with skill injection
6. **Phase 1 then Phase 2** — Ship rich content + BioSkill first, IDE panels later

## Anti-Patterns to Avoid

- Don't render large binary files as base64 in chat (use thumbnails + download links)
- Don't block the chat input while files are loading
- Don't inject ALL skills into every prompt (budgeting)
- Don't silently fail on unsupported file types (show "Unsupported format" card with download option)

## Files to Modify/Create

### New Files
- `src/components/rich-content/RendererRegistry.ts`
- `src/components/rich-content/ImageCard.tsx`
- `src/components/rich-content/TableCard.tsx`
- `src/components/rich-content/CodeCard.tsx`
- `src/components/rich-content/FastaCard.tsx`
- `src/components/rich-content/VcfCard.tsx`  
- `src/components/rich-content/PdfCard.tsx`
- `src/components/rich-content/FileTypeDetector.ts`
- `src/components/rich-content/index.ts`
- `src/components/BioSkillPanel.tsx`
- `src/components/BioSkillBrowser.tsx`

### Modified Files
- `src/App.tsx` — Integrate RichContent in chat, right panel tabs
- `src/components/AIChat.tsx` — Render RichContent cards in message stream
- `src/components/Header.tsx` — Add BioSkill toggle
- `src/index.css` — Add card styles, highlight.js theme
- `server.ts` — Add /api/files/read, skill indexer, observation logger
- `skills/bio/*.md` — Preloaded bioinformatics knowledge (7-8 files)
- `skills/system/hpc-best-practices.md` — Expand from 4 lines to comprehensive guide

## Dependencies

- **nature-skills**: Clone from `https://github.com/Yuan1z0825/nature-skills` into `skills/nature/`. Academic research skill pack providing paper reading, writing, polishing, figure creation, citation management, and more. Licensed under MIT.
