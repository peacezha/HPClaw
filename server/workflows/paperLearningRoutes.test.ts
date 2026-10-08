import http from 'node:http';
import fs from 'node:fs';
import express from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { registerWorkflowRoutes } from './registerWorkflowRoutes';

const mocks = vi.hoisted(() => ({
  evidence: vi.fn(), learn: vi.fn(), repair: vi.fn(), save: vi.fn(),
}));
vi.mock('./learnFromPaper', async importOriginal => {
  const actual = await importOriginal<typeof import('./learnFromPaper')>();
  return { ...actual, extractEvidenceInventory: mocks.evidence, learnWorkflowFromText: mocks.learn,
    repairWorkflowJsonWithModel: mocks.repair, fetchRepoCodeExcerpt: vi.fn().mockResolvedValue(null),
    checkToolsInBioconda: vi.fn().mockResolvedValue([]) };
});
vi.mock('./learnDraftStore', () => ({
  saveLearnDraft: mocks.save, deleteLearnDraft: vi.fn(), getLearnDraft: vi.fn(), listLearnDrafts: vi.fn(), updateLearnDraft: vi.fn(),
}));

let server: http.Server | undefined;
const paper = 'Title\nMethod\nPlant materials\n' + 'Seeds were germinated in water. '.repeat(10)
  + 'To capture the background, a Halo tag control was used.\nProcessing of DAP-seq data\n'
  + 'Sequencing reads were cleaned using fastp (version 0.20.0). '
  + 'The clean reads were mapped using the Burrows-Wheeler Aligner (version 0.7.17-r1188). '
  + 'The MACS program (version 2.2.6) was used to identify read-enriched regions.'
  + '\nData availability\nRaw data are deposited under GSE192815.\nReferences\nNat. Methods 17, 54 (2021).';
const callLearn = async (paperText: string) => {
  const app = express();
  app.use(express.json({ limit: '2mb' }));
  registerWorkflowRoutes(app);
  server = http.createServer(app);
  await new Promise<void>(resolve => server!.listen(0, '127.0.0.1', resolve));
  const address = server.address() as any;
  const response = await fetch('http://127.0.0.1:' + address.port + '/api/workflows/learn', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paperText, profile: { provider: 'custom-openai', model: 'fixture', apiKey: 'fixture-only' } }),
  });
  return { response, body: await response.json() };
};
beforeEach(() => {
  vi.clearAllMocks();
  mocks.evidence.mockResolvedValue({ inventory: null, raw: '{}' });
  mocks.learn.mockResolvedValue('{"workflow":{"name":"Paper","steps":[]},"extraction":{}}');
  mocks.repair.mockResolvedValue('not valid JSON');
  mocks.save.mockReturnValue({ id: 'review-draft' });
});
afterEach(async () => {
  if (server) await new Promise<void>(resolve => server!.close(() => resolve()));
  server = undefined;
});

describe('literature learning recovery route', () => {
  it('keeps real Methods and saves a blocked evidence draft instead of a wet-lab error', async () => {
    const { response, body } = await callLearn(paper);
    expect(response.status).toBe(200);
    expect(body.draftId).toBe('review-draft');
    expect(body.draft.steps.length).toBeGreaterThan(1);
    expect(body.draft.steps.every((step: any) => step.agent.requiresReview)).toBe(true);
    expect(body.paperImport.quality.readiness).not.toBe('ready_for_review');
    expect(body.paperImport.rawData.some((row: any) => row.projectAccession === 'GSE192815')).toBe(true);
    expect(mocks.learn).toHaveBeenCalledTimes(2);
    expect(mocks.repair).not.toHaveBeenCalled(); // empty steps is a content problem, not malformed JSON
    expect(mocks.learn.mock.calls[0][0]).toContain('0.7.17-r1188');
    expect(mocks.learn.mock.calls[0][0]).toContain('2.2.6');
    expect(mocks.save).toHaveBeenCalledOnce();
    expect(mocks.learn.mock.calls[0][7]).toBeInstanceOf(AbortSignal);
  });
  it('still retains source-supported steps if syntax repair or the targeted retry fails', async () => {
    mocks.learn.mockResolvedValueOnce('malformed JSON').mockRejectedValueOnce(new Error('fixture provider busy'));
    mocks.repair.mockRejectedValueOnce(new Error('fixture repair busy'));
    const { response, body } = await callLearn(paper);
    expect(response.status).toBe(200);
    expect(body.draft.steps[0].command).toContain('exit 2');
    expect(body.paperImport.quality.blockers.length).toBeGreaterThan(0);
  });
  it('returns a specific 422 for genuinely bench-only input without inventing steps', async () => {
    const wet = 'Method\n' + 'Genomic DNA was extracted from leaves. Seeds were germinated in water. The DNA library was amplified by PCR. '.repeat(6);
    const { response, body } = await callLearn(wet);
    expect(response.status).toBe(422);
    expect(body.error).toContain('没有可核验');
    expect(mocks.save).not.toHaveBeenCalled();
    expect(mocks.learn).toHaveBeenCalledTimes(1);
  });
  it.skipIf(!process.env.HPCLAW_DAP_PDF)('regresses the supplied real dap.pdf through PDF.js, context selection and route recovery', async () => {
    const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const { paperPageText, selectPaperPages } = await import('../../src/features/workflows/paperPdf');
    const task = getDocument({ data: new Uint8Array(fs.readFileSync(process.env.HPCLAW_DAP_PDF!)), useSystemFonts: true });
    try {
      const doc = await task.promise;
      const parts = [];
      for (const number of selectPaperPages(doc.numPages)) {
        const page = await doc.getPage(number);
        parts.push('[Page ' + number + ']\n' + paperPageText((await page.getTextContent()).items));
      }
      const { response, body } = await callLearn(parts.join('\n'));
      expect(response.status).toBe(200);
      const context = mocks.learn.mock.calls[0][0];
      expect(context).toContain('0.7.17-r1188');
      expect(context).toContain('2.2.6');
      expect(body.paperImport.rawData.some((row: any) => row.projectAccession === 'GSE192815')).toBe(true);
      expect(body.draft.steps.some((step: any) => step.agent.evidence.includes('2.2.6'))).toBe(true);
      expect(body.draft.steps.every((step: any) => step.agent.requiresReview)).toBe(true);
    } finally { await task.destroy(); }
  });
});
