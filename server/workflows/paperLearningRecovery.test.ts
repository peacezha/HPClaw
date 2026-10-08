import { describe, expect, it } from 'vitest';
import { groundEvidenceInventory, hasUsablePaperSteps, paperQuoteExists, recoverPaperWorkflow, scanPaperAnalysis } from './paperLearningRecovery';
import { preparePaperContext } from './learnFromPaper';

const analysis = 'Sequencing reads were cleaned using fastp (version 0.20.0). The clean reads were mapped using the Burrows-Wheeler Aligner (version 0.7.17-r1188). The MACS program (version 2.2.6) was used to identify read-enriched regions.';
const paper = 'Title\nMethod\nPlant materials and growth conditions\nSeeds were germinated in water. To capture the background, Halo tag alone was used as a control.\nProcessing of DAP-seq data\n' + analysis
  + '\nData availability\nThe raw data are deposited under GSE192815.\nReferences\nAn unrelated tool was used to analyze genes.';

describe('source-grounded paper recovery', () => {
  it('does not split ordinary background or Nat. Methods into major headings', () => {
    const context = preparePaperContext(paper + '\nNature Methods 17, 54 (2021).');
    expect(context.methodSections).toEqual(['Method']);
    expect(context.text).toContain('0.7.17-r1188');
    expect(context.text).toContain('2.2.6');
    expect(context.text).not.toContain('Nature Methods 17');
  });
  it('finds late Methods after a long introduction instead of truncating before selection', () => {
    const context = preparePaperContext('Title\nIntroduction\n' + 'intro '.repeat(45_000) + '\nMethods\n' + analysis);
    expect(context.text).toContain('2.2.6');
    expect(context.selectionMode).toBe('methods');
    expect(context.text.length).toBeLessThanOrEqual(70_000);
  });
  it('keeps evidence even if the model omitted the tools field; rejects fabricated quotes', () => {
    const evidence = groundEvidenceInventory({ stepsMentioned: [
      { id: 'S1', what: 'Mapping', sentence: 'The clean reads were mapped using the Burrows-Wheeler Aligner (version 0.7.17-r1188).' },
      { id: 'S2', what: 'Fabricated', sentence: 'Reads were mapped with a fictional tool and parameters.' },
    ] }, paper);
    expect(evidence?.stepsMentioned).toHaveLength(1);
    expect(evidence?.tools).toEqual([]);
    expect(paperQuoteExists('unknown quote here', paper)).toBe(false);
  });
  it('recovers missing commands into a review-only draft, not an executable pipeline', () => {
    const result = recoverPaperWorkflow({ workflow: { steps: [] } }, null, preparePaperContext(paper).text);
    expect(result.recovered).toBeGreaterThan(1);
    expect(hasUsablePaperSteps(result.value)).toBe(true);
    for (const step of result.value.workflow.steps) {
      expect(step.agent.requiresReview).toBe(true);
      expect(step.command).toContain('HPCLAW_REVIEW_REQUIRED');
      expect(step.command).toContain('exit 2');
      expect(paperQuoteExists(step.agent.evidence, paper)).toBe(true);
    }
    expect(result.value.extraction.unresolvedQuestions[0].blocking).toBe(true);
  });
  it('preserves evidence-supported title-only steps rather than discarding them in sanitization', () => {
    const value = { workflow: { steps: [{ title: 'Read mapping', agent: { evidence: 'The clean reads were mapped using the Burrows-Wheeler Aligner (version 0.7.17-r1188).' } }] } };
    const result = recoverPaperWorkflow(value, null, paper, true);
    expect(result.value.workflow.steps[0].title).toBe('Read mapping');
    expect(result.value.workflow.steps[0].command).toContain('REVIEW_REQUIRED');
  });
  it('does not create computational steps from bench-only methods or bibliography', () => {
    const wet = 'Methods\nGenomic DNA was extracted from leaves. The DNA library was amplified by PCR.\nReferences\nReads were mapped using BWA.';
    expect(scanPaperAnalysis(wet).stepsMentioned).toEqual([]);
    expect(recoverPaperWorkflow({ workflow: { steps: [] } }, null, wet).recovered).toBe(0);
  });
  it('retains stable locators without inventing sample mapping or raw files', () => {
    const evidence = scanPaperAnalysis('Data availability\nGSE192815 and SRR123456\nMethods\n' + analysis);
    expect(evidence.datasets[0].projectAccession).toBe('GSE192815');
    expect(evidence.datasets[1].runAccessions).toEqual(['SRR123456']);
    expect(evidence.datasets.every(item => !item.sampleName && !item.files)).toBe(true);
  });
  it('does not mutate a complete model workflow', () => {
    const value = { workflow: { steps: [{ title: 'QC', command: 'fastp' }] } };
    expect(recoverPaperWorkflow(value, null, paper)).toEqual({ value, recovered: 0 });
  });
});
