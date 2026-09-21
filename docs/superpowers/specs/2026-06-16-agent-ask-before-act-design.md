# Agent Ask-Before-Act Design

## Goal

Make the HPClaw Agent stop and ask the user before acting when the next step depends on uncertain, conflicting, or high-impact assumptions.

## Scope

This change adds a first-class `<ask>...</ask>` action to the Agent protocol. It does not implement full task-plan approval, workflow wizards, or multi-step plan editing.

## Behavior

The Agent may keep using read-only exploration commands for fact gathering. It must ask the user instead of executing when:

- sample names, paths, input directories, or file lists conflict or cannot be determined;
- reference genome, index, GTF/GFF, species, sequencing layout, strandedness, or key analysis parameters are missing;
- it is about to create or overwrite scripts, modify existing files, or submit long-running jobs while multiple reasonable choices remain;
- observed cluster state contradicts the user's request;
- two consecutive exploration attempts still do not resolve the needed fact.

When the model returns `<ask>question</ask>`, the frontend renders the question as an assistant message, executes no command, and ends the current Agent loop. The user's next reply resumes the Agent with the prior context.

## Files

- `src/services/agentProtocol.ts`: parse Agent action tags and expose the ask-before-act prompt rules.
- `src/components/AIChat.tsx`: use the shared parser/rules and stop the loop on `<ask>`.
- `server/ai/contextBuilder.ts`: include the same ask-before-act rules in server-side Agent context.
- `src/components/rich-content/FileTypeDetector.ts`: avoid treating compressed bioinformatics files as parsed sequence text.

## Verification

- Unit tests cover `<ask>` parsing and compressed file type detection.
- TypeScript check must pass.
- Targeted Vitest tests must pass.
