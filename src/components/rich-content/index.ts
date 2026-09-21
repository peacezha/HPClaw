export { RendererRegistry } from './RendererRegistry';
export type { RendererType, CardContent, CardProps, RendererEntry } from './RendererRegistry';
export { detectFileType, getFileCategory } from './FileTypeDetector';
export { extractFilePaths, extractCodeBlocks, extractInlineCharts } from './FilePathExtractor';
export { fetchFileContent, fetchFileContentBatch, fetchLocalFileContent, buildFileViewUrl, INLINE_SIZE_THRESHOLD } from './ContentFetcher';
export { parseDshUiSpec, parseDshUiSpecText, extractDshUiSpecs } from './DshUiSpec';
export type { DshUiSpec } from './DshUiSpec';
export { default as DshUiSpecCard } from './DshUiSpecCard';
export { RichContentMessage } from './RichContentMessage';

// ── Register all renderers ───────────────────────────────────────
import { RendererRegistry } from './RendererRegistry';
import ImageCard from './ImageCard';
import TableCard from './TableCard';
import CodeCard from './CodeCard';
import FastaCard from './FastaCard';
import GenericCard from './GenericCard';

// Register in priority order (higher = preferred match)
RendererRegistry.register({ type: 'image',  component: ImageCard,   label: 'Image',     extensions: ['.png','.jpg','.jpeg','.gif','.svg','.bmp','.webp','.tiff','.tif'], priority: 100 });
RendererRegistry.register({ type: 'table',  component: TableCard,   label: 'Table',     extensions: ['.csv','.tsv','.tab'], priority: 90 });
RendererRegistry.register({ type: 'code',   component: CodeCard,    label: 'Code',      extensions: ['.py','.R','.r','.sh','.bash','.js','.ts','.jsx','.tsx','.pl','.rb','.jl','.c','.cpp'], priority: 85 });
RendererRegistry.register({ type: 'fasta',  component: FastaCard,   label: 'Sequence',  extensions: ['.fasta','.fa','.fna','.ffn','.fastq','.fq'], priority: 80 });
RendererRegistry.register({ type: 'vcf',    component: GenericCard, label: 'Variant',   extensions: ['.vcf','.gvcf'], priority: 80 });
RendererRegistry.register({ type: 'pdf',    component: GenericCard, label: 'PDF',       extensions: ['.pdf'], priority: 75 });
RendererRegistry.register({ type: 'log',    component: CodeCard,    label: 'Report',    extensions: ['.log','.out','.err','.html','.htm','.txt','.md'], priority: 70 });
RendererRegistry.register({ type: 'generic',component: GenericCard, label: 'File',      extensions: [], priority: 50 });
