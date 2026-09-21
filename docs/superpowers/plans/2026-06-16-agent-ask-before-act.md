# Agent Ask-Before-Act Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a first-class Agent ask action so HPClaw pauses for user clarification before making uncertain or high-impact assumptions.

**Architecture:** Move Agent action parsing and ask-before-act rules into a small shared frontend service, then consume it from `AIChat.tsx`. Add the same rules to server-side Agent context so both prompt paths agree. Keep the behavior focused: `<ask>` stops the current loop and does not execute commands.

**Tech Stack:** TypeScript, React, Vitest, Vite.

---

### Task 1: Agent Protocol Parser

**Files:**
- Create: `src/services/agentProtocol.ts`
- Create: `src/services/agentProtocol.test.ts`

- [ ] **Step 1: Write failing parser tests**

Test that `<ask>` is parsed and that one action is selected from a response.

- [ ] **Step 2: Run targeted test and verify failure**

Run `npx vitest run src/services/agentProtocol.test.ts`.
Expected: fail because the module does not exist.

- [ ] **Step 3: Implement parser and prompt rules**

Create `parseAgentActions(text)` returning `askMatch`, `executeMatch`, `doneMatch`, `monitorMatch`, `searchMatch`, and `saveSkillMatch`. Export `ASK_BEFORE_ACT_RULES_CN` and `ASK_BEFORE_ACT_RULES_EN`.

- [ ] **Step 4: Re-run parser tests**

Run `npx vitest run src/services/agentProtocol.test.ts`.
Expected: pass.

### Task 2: Frontend Agent Loop

**Files:**
- Modify: `src/components/AIChat.tsx`

- [ ] **Step 1: Replace local parser**

Import `parseAgentActions` and remove the local `parseActions()` implementation.

- [ ] **Step 2: Add ask rules to Agent prompt**

Append `ASK_BEFORE_ACT_RULES_CN` to the Agent system prompt and include `<ask>` in the response format.

- [ ] **Step 3: Stop on ask**

When `askMatch` exists, mark the current Agent loop done without executing anything.

### Task 3: Server Agent Context

**Files:**
- Modify: `server/ai/contextBuilder.ts`

- [ ] **Step 1: Add ask-before-act rules to agent persona**

Import `ASK_BEFORE_ACT_RULES_EN` and include it in the `agent` mode persona beside `NCPGR_RULES_EN`.

### Task 4: Compressed File Preview Safety

**Files:**
- Modify: `src/components/rich-content/FileTypeDetector.ts`
- Create or modify: `src/components/rich-content/FileTypeDetector.test.ts`

- [ ] **Step 1: Write failing detector tests**

Test `.fastq.gz`, `.fq.gz`, `.fasta.gz`, `.fa.gz`, `.vcf.gz`, and `.g.vcf.gz` return `generic`.

- [ ] **Step 2: Run targeted test and verify failure**

Run `npx vitest run src/components/rich-content/FileTypeDetector.test.ts`.
Expected: fail until detector is updated.

- [ ] **Step 3: Implement compressed-file guard**

Return `generic` for common compressed bioinformatics data so the UI does not parse gzipped bytes as sequence text.

- [ ] **Step 4: Re-run detector tests**

Run `npx vitest run src/components/rich-content/FileTypeDetector.test.ts`.
Expected: pass.

### Task 5: Final Verification

**Files:**
- All modified files

- [ ] **Step 1: Run targeted tests**

Run `npx vitest run src/services/agentProtocol.test.ts src/components/rich-content/FileTypeDetector.test.ts`.

- [ ] **Step 2: Run TypeScript check**

Run `npm run lint`.

- [ ] **Step 3: Review diff**

Run `git diff -- src/services/agentProtocol.ts src/components/AIChat.tsx server/ai/contextBuilder.ts src/components/rich-content/FileTypeDetector.ts`.
