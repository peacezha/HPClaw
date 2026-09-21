import { describe, expect, it } from 'vitest';
import {
  HEAD_LINE_LIMIT,
  LARGE_TEXT_BYTES,
  classifyPreview,
} from './filePreview';

describe('classifyPreview', () => {
  it.each([
    ['plot.PNG', 'image', 'binary'],
    ['paper.pdf', 'pdf', 'binary'],
    ['paper.docx', 'docx', 'binary'],
    ['matrix.xlsx', 'sheet', 'binary'],
    ['matrix.ods', 'sheet', 'binary'],
    ['table.csv', 'sheet', 'text'],
    ['report.html', 'html', 'text'],
    ['recording.mp3', 'audio', 'binary'],
    ['demo.mp4', 'video', 'binary'],
    ['README.md', 'markdown', 'text'],
    ['run.log', 'text', 'text'],
    ['sample.fa', 'text', 'text'],
    ['workflow.SMK', 'text', 'text'],
  ] as const)('maps %s to %s/%s', (name, kind, mode) => {
    expect(classifyPreview(name, 12)).toMatchObject({ kind, mode });
  });

  it('uses head mode at the exact 100 MiB boundary for line text', () => {
    expect(classifyPreview('reads.fasta', LARGE_TEXT_BYTES)).toMatchObject({
      kind: 'text',
      mode: 'head',
      lineLimit: HEAD_LINE_LIMIT,
    });
  });

  it('uses head mode for large CSV without trying to parse the complete sheet', () => {
    expect(classifyPreview('counts.csv', LARGE_TEXT_BYTES)).toMatchObject({
      kind: 'text',
      mode: 'head',
      lineLimit: 20,
    });
  });

  it('does not apply head mode to large binary documents', () => {
    expect(classifyPreview('paper.pdf', LARGE_TEXT_BYTES)).toMatchObject({
      kind: 'unsupported',
      mode: 'unsupported',
    });
  });

  it('hands known binary formats to the operating system', () => {
    expect(classifyPreview('archive.tar.gz', 100)).toMatchObject({
      kind: 'unsupported',
      mode: 'unsupported',
    });
    expect(classifyPreview('slides.pptx', 100)).toMatchObject({ kind: 'unsupported' });
    expect(classifyPreview('scan.tiff', 100)).toMatchObject({ kind: 'unsupported' });
  });

  it('still falls back to text preview for genuinely unknown extensions', () => {
    expect(classifyPreview('custom.analysis', 100)).toMatchObject({ kind: 'text', mode: 'text' });
  });

  it('detects MIME types for additional browser-native images and media', () => {
    expect(classifyPreview('photo.jfif', 100)).toMatchObject({ kind: 'image', mime: 'image/jpeg' });
    expect(classifyPreview('figure.avif', 100)).toMatchObject({ kind: 'image', mime: 'image/avif' });
    expect(classifyPreview('movie.mov', 100)).toMatchObject({ kind: 'video', mime: 'video/quicktime' });
  });

  it('does not attempt to render oversized HTML, even above the large-text boundary', () => {
    expect(classifyPreview('huge-report.html', LARGE_TEXT_BYTES)).toMatchObject({
      kind: 'unsupported',
      mode: 'unsupported',
    });
  });
});
