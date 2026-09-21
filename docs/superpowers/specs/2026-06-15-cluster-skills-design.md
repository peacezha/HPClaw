# Cluster Skills Directory Design

## Goal

HPClaw should read the current SSH user's cluster skill directory at `~/hpclaw_skills`, merge supported text files into the existing skill catalog, and show them in the front-end skill panel and skill search.

## Scope

- Read from the cluster path `~/hpclaw_skills` for the active SSH session.
- Recursively include text-like files, not only Markdown.
- Keep local skills, imported skills, and LSF skills working as they do today.
- Make cluster skills available through `/api/skills`, `/api/skills/search`, and the AI skill index.
- Do not sync cluster files into the local `skills/` directory.
- Do not allow front-end deletion of cluster skills in this change.

## Supported Files

The cluster scanner should include common text skill formats:

`.md`, `.markdown`, `.txt`, `.rst`, `.adoc`, `.org`, `.yml`, `.yaml`, `.json`, `.toml`, `.ini`, `.conf`, `.cfg`, `.sh`, `.bash`, `.zsh`, `.py`, `.R`, `.r`, `.pl`, `.rb`, `.jl`, `.lsf`, `.sbatch`, `.csv`, `.tsv`, `.log`, `.out`, `.err`.

Files with unsupported extensions are skipped. Very large text files should be bounded by a server-side maximum read size so the skill panel and AI context cannot be overloaded by accidental logs.

## Architecture

Add a small server-side cluster skill reader around the existing SSH command runner. The reader returns `SkillMetadata[]` and passes those entries into `loadOrRefreshSkillIndex({ clusterSkills })`, which already supports merging cluster metadata.

Cluster skills should be represented with:

- `source: "cluster"`
- `category: "hpc"`
- `isSystem: false`
- `sourcePath` starting with `cluster:~/hpclaw_skills/`
- filenames prefixed with `cluster/`, for example `cluster/1` or `cluster/foo/SKILL`

The `cluster/` prefix prevents name collisions with local or LSF skills and makes the source obvious in UI and search results.

## Components

### `server/ai/skillIndex.ts`

- Expand text extension detection so `skillFromContent` and file indexing can parse non-Markdown text formats.
- Keep Markdown frontmatter parsing for files that have it.
- Fall back to basename plus excerpt description for plain text files.
- Ensure cluster filenames are normalized to POSIX-style paths and prefixed with `cluster/`.

### `server.ts`

- Replace the current cluster scanner, which only reads `.md`, with a safer recursive text-file scanner.
- Read `~/hpclaw_skills` using the existing serialized SSH command mechanism.
- Return an empty cluster skill list if no SSH session exists, the directory is empty, or the directory cannot be read.
- Cache cluster skill results per SSH session for a short TTL, around 30-60 seconds, to avoid repeated slow scans when the panel reloads or search runs.

### `src/services/skillCatalog.ts`

- Preserve the `source`, `category`, metadata, and any status fields returned by the API.
- Keep the existing `fetchSkills` and `searchSkills` API shape unless a small status object is needed for user-facing empty/error states.

### `src/components/SkillsPanel.tsx`

- Show cluster skills under the existing HPC category or a dedicated "Cluster Skills" label.
- Display `source: cluster` clearly enough that users can distinguish cluster skills from local skills.
- Keep create/import actions for local skills only.
- Do not expose delete/edit actions for cluster skills in this change.

### `src/components/BioSkillPanel.tsx`

- Treat `source: cluster` and `category: hpc` as a first-class category instead of inferring only from filenames.
- Include cluster skills in search/filter results.

## Data Flow

1. User logs into the HPC cluster through the existing SSH workflow.
2. Front end opens the skill panel and calls `GET /api/skills`.
3. Server checks the active Express session for `sshSessionId`.
4. If an SSH session exists, the server reads `~/hpclaw_skills` through the existing SSH command queue.
5. The cluster reader emits newline-delimited JSON entries with relative path, content, size, and mtime.
6. Server converts each entry with `skillFromContent`.
7. Server merges cluster skills into the normal skill index.
8. Front end renders all skills using the returned metadata.

## Error Handling

- No SSH session: return local skills only.
- Missing `~/hpclaw_skills`: create it or treat it as empty, then return local skills.
- Empty directory: return local skills and an empty cluster set.
- Unsupported file: skip it.
- Read error for one file: skip that file and continue.
- Scanner timeout or SSH failure: log the failure and return local skills only.
- Malformed JSON line from scanner: skip that line and continue.

## Performance

- Use a per-session cache with a short TTL.
- Bound the maximum bytes read per file.
- Bound the maximum number of cluster skill files returned per scan.
- Avoid writing cluster skills into `.skill-index.json`; cluster skills should remain session-scoped and current.

## Testing

Add focused tests before implementation:

- `skillFromContent` parses a plain text cluster skill without frontmatter.
- Cluster skill filenames are prefixed with `cluster/`.
- Text extension detection includes `.txt`, `.py`, `.sh`, `.lsf`, `.yaml`, `.json`, `.csv`, and `.tsv`.
- Search can match a cluster skill by filename, description, tag, or content.
- Existing local and LSF skill indexing behavior remains unchanged.

For the SSH scanner, isolate the command-building and parsing logic into testable helpers where possible, so behavior can be tested without a live cluster connection.
