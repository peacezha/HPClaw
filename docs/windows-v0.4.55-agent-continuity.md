# TRACE v0.4.55 — Windows Agent continuity fixes

## Question handling

- Interpret requests such as “有哪些修复方案？” as requests for explanation, not option selection or execution permission.
- Keep live replies on the original Agent stream. Clear any selected option when asking for clarification; add a bilingual “Explain options first” action.
- Reject vague repair questions and repeated questions without intervening task progress. Recover real replies from recent chat and feed corrective context back to the engine.
- Preserve independent command approvals and biological input requirements. Explanation-only requests cannot submit/cancel jobs or write/transfer files through the cluster bridge.

## Execution deadlines

- Keep a 15-minute active-execution budget, excluding confirmed waits for user questions and command approvals. Apply a separate 45-minute total safety ceiling.
- Report the last execution stage, tool, stage duration and time since the last event when a request times out. A timeout alone does not prove that a cluster is stuck or that outputs passed QC.
- Return job-submission receipts immediately rather than holding an AI call in a job-wait loop for up to 30 minutes. Register continuation context before starting watcher polling.
- Clear client stream-idle timers after each read. Preserve SSH sessions and submitted cluster jobs when an Agent turn is stopped.

## Scope

Windows installer only. No production cluster jobs are submitted, cancelled or modified by build verification. Existing conversations and run directories are not removed. This local build is not automatically published to GitHub.

## Verification

- TypeScript: `npm run lint` passed.
- Full Vitest suite: 227 test files passed; 1,756 tests passed and 2 were skipped. Follow-up plugin-contract tests passed after removing the obsolete short-job wait instruction.
- Production frontend and Electron backend builds passed.
- Final Windows installer passed embedded 7-Zip CRC verification.
- Isolated packaged backend/frontend/DSH smoke passed. The real packaged AI stream handled the screenshot explanation request with one local mock-model request and no repeated question, command or approval. No external AI call was made. Live literature metadata network verification was explicitly skipped.
- Update manifest SHA-512 and file size match; packaged DSH plugin is byte-identical to source.

Artifact: `release-trace-v0.4.55-final/TRACE-Setup-0.4.55-x64.exe`

Size: 243,462,545 bytes.

SHA-256: `3606252b3b2326295d7e0e74003c0a5ca2311fe3e46431db6e4eb87ae441bea2`
