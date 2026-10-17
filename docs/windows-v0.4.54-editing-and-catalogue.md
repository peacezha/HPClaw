# TRACE Windows v0.4.54

- Restore the BioSkills ATAC-seq chromatin-accessibility and ChIP-seq analysis workflows to the active catalogue.
- Remove the BioSkills Hi-C, CLIP-seq, causal-genomics and CRISPR editing-design workflows, plus all definitions already pending disposal, once during upgrade. The independent ENCODE Hi-C/eCLIP workflows remain.
- Back up removed definitions under `workflows/deleted-definitions/` and persist built-in deletion tombstones. No cluster RUN directories, scripts or scientific results are deleted. New review drafts created after migration are not automatically deleted.
- Explicitly localize all data-preparation instructions, template labels, AI-assistance actions and JSON notes. TSV columns, sample values, paths and scientific commands are not translated.
- Restore native Edit-menu keyboard shortcuts for normal text inputs and selected chat text; suppress native menu accelerators only while terminal/file panes handle their own shortcuts. Scope file shortcuts to the focused pane. Keep terminal Ctrl+C interruption without a selection and prevent duplicate Ctrl+V paste.
- Use the desktop clipboard bridge for copy buttons, with a browser fallback that preserves focus and selection. Failed copying must not display a success receipt.

The Windows installer does not publish itself to GitHub or replace a running installation automatically.
