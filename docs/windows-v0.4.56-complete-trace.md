# TRACE v0.4.56 — complete first-party branding

235 first-party source and current guide files received a coordinated mechanical rename (1,237 occurrences), followed by explicit compatibility repairs and upgrade tests.

New desktop identity, window/title, installation defaults, shortcuts, IPC channels, browser globals, environment variables, settings namespaces, protocol markers, plugin names, workflow/upload/reference directories and generated report/adapter names use TRACE. The repository remains `peacezha/TRACE`.

Windows upgrade identity is preserved with the original NSIS GUID, independently of the new `com.trace.desktop` app ID. Full and competition editions retain separate upgrade identities.

Legacy desktop data is copied to TRACE before switching, with ciphertext/key material unchanged and the original profile retained. Existing TRACE data is never overwritten or merged automatically. Verified old shortcuts are retired only after keeping byte-for-byte backups. Old cluster conversation archives, web settings, binary attachments and workflow run markers/directories remain readable. Existing running-job paths and raw scientific evidence are not rewritten.

Old branding identifiers remain only in reviewed backward-compatibility readers and genuine historical records. They are not used for new product output. `node scripts/audit-trace-branding.mjs` checks first-party source for unreviewed leaks.

No existing installed application is forcibly restarted during this work, and no production cluster job or original dataset is modified. The new installer must be installed before the currently running v0.4.50 application can display the changes.

## Verification

- Source-brand audit: 1,863 files scanned; no unreviewed first-party branding leaks. Remaining legacy strings are explicitly reviewed compatibility readers.
- TypeScript check passed. Vitest: 232 test files passed; 1,765 tests passed and 2 skipped.
- Production frontend and Electron backend builds passed.
- Final installer embedded-archive CRC and update-manifest SHA-512/size checks passed.
- Isolated packaged smoke passed: real backend/UI files, native Edit menu and IPC, plugin identity, catalogue operations, lossless profile copy, question endpoint and real AI stream with a local mock provider. No production profile, paid model or cluster job was used. The live literature-metadata network probe was explicitly skipped.
- Packaged backend, main process, migration helper and plugin match the current built source byte-for-byte.

Artifact: `release-trace-v0.4.56-verified/TRACE-Setup-0.4.56-x64.exe`

Size: 239,685,407 bytes.

SHA-256: `7425a9c2fe261878e02eef4f9c0c691347acf4146a61760adaf884cfc98a546e`

This build has not been uploaded to GitHub.
