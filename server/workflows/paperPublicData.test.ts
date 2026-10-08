import { afterEach, describe, expect, it, vi } from 'vitest';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { attachPublicDataDownload, parseEnaReport, resolvePaperPublicData, trustedFastqUrl } from './paperPublicData';
const hash = createHash('md5').update('fixture reads').digest('hex');
const header = 'run_accession\tstudy_accession\tsample_accession\texperiment_title\tlibrary_layout\tfastq_ftp\tfastq_md5';
const report = header + '\nSRR123456\tPRJNA123456\tSAMN123456\tGSM123456: sample-1\tPAIRED\t'
  + 'ftp.sra.ebi.ac.uk/vol1/fastq/SRR123/SRR123456/SRR123456_1.fastq.gz;ftp.sra.ebi.ac.uk/vol1/fastq/SRR123/SRR123456/SRR123456_2.fastq.gz\t' + hash + ';' + hash;
afterEach(() => vi.unstubAllGlobals());
describe('public data metadata and downloader', () => {
  it('retains one sample with multiple runs and exact FASTQ/MD5 pairs, without guessing groups', () => {
    const rows = parseEnaReport(report + '\n' + report.split('\n')[1].replaceAll('SRR123456', 'SRR123457'), 'GSE123456', 'https://www.ebi.ac.uk/ena/portal/api/search');
    expect(rows).toHaveLength(2);
    expect(rows.map(row => row.sampleAccession)).toEqual(['GSM123456','GSM123456']);
    expect(rows[0].urls[0]).toMatch(/^https:/);
    expect(rows[0].checksums).toEqual(['md5:' + hash, 'md5:' + hash]);
    expect(rows[0].condition).toBeUndefined();
    expect(rows[0].replicate).toBeUndefined();
  });
  it('rejects private hosts, credentials, traversal, arbitrary file types and incomplete checksums', () => {
    for (const url of ['https://127.0.0.1/reads.fastq.gz', 'https://ftp.sra.ebi.ac.uk@localhost/reads.fastq.gz',
      'https://ftp.sra.ebi.ac.uk/data.sh', 'https://ftp.sra.ebi.ac.uk/x/../reads.fastq.gz',
      'https://ftp.sra.ebi.ac.uk/reads.fastq.gz?token=x']) expect(trustedFastqUrl(url)).toBeNull();
    expect(parseEnaReport(report.replace(hash + ';' + hash, hash), 'GSE123456', 'source')).toEqual([]);
  });
  it('resolves GSE via GEO BioProject plus ENA, with no model or raw-file download', async () => {
    const upstream = vi.fn(async (url: any) => String(url).includes('ncbi')
      ? new Response('!Series_relation = BioProject: https://www.ncbi.nlm.nih.gov/bioproject/PRJNA123456')
      : new Response(report));
    vi.stubGlobal('fetch', upstream);
    const result = await resolvePaperPublicData('Raw data GSE123456.');
    expect(result.records).toHaveLength(1);
    expect(upstream).toHaveBeenCalledTimes(2);
    expect(decodeURIComponent(String(upstream.mock.calls[1][0]))).toContain('PRJNA123456');
  });
  it('reports metadata failure as a real gap instead of claiming complete data', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('fixture offline')));
    const result = await resolvePaperPublicData('Raw data GSE123456.');
    expect(result.records).toEqual([]);
    expect(result.warnings.some(warning => warning.includes('查询失败'))).toBe(true);
  });
  it('replaces comment-only acquisition, rewires dependencies and retains analysis nodes', () => {
    const workflow: any = { params: [], steps: [{ id: 'old', title: '下载数据', command: '# REVIEW_REQUIRED' },
      { id: 'map', title: '比对', command: 'bwa mem', dependsOn: ['old'] }] };
    attachPublicDataDownload(workflow, { records: parseEnaReport(report, 'GSE123456', 'source'), projects: ['GSE123456'], warnings: [] });
    expect(workflow.steps).toHaveLength(2);
    expect(workflow.steps[0].command).toContain('urllib.request.urlopen');
    expect(workflow.steps[1].dependsOn).toEqual(['public-data-download']);
    expect(workflow.params.find((item: any) => item.name === 'DOWNLOAD_RUNS').defaultValue).toBe('');
  });
  it('executes the generated manifest/download/checksum code using mocked bytes, never real sequencing files', () => {
    const binary = process.platform === 'win32' ? 'python' : 'python3';
    if (spawnSync(binary, ['--version']).status !== 0) return;
    const workflow: any = { steps: [], params: [] };
    attachPublicDataDownload(workflow, { records: parseEnaReport(report, 'GSE123456', 'source'), projects: ['GSE123456'], warnings: [] });
    const body = workflow.steps[0].command.split("<<'HPCLAW_RAW_DATA'\n")[1].split('\nHPCLAW_RAW_DATA')[0];
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'hpclaw-download-test-'));
    try {
      const script = "import io, urllib.request; urllib.request.urlopen=lambda *a,**k: io.BytesIO(b'fixture reads'); exec(" + JSON.stringify(body) + ')';
      const result = spawnSync(binary, ['-c', script, directory, 'GSE123456', 'SRR123456'], { encoding: 'utf8', timeout: 30000 });
      expect(result.status, result.stderr).toBe(0);
      expect(fs.readFileSync(path.join(directory, 'raw_data_manifest.tsv'), 'utf8')).toContain('md5:' + hash);
      expect(fs.readdirSync(path.join(directory, 'raw_data'))).toHaveLength(2);
      const bad = spawnSync(binary, ['-c', script, directory, 'GSE123456', 'SRR999999'], { encoding: 'utf8', timeout: 30000 });
      expect(bad.status).not.toBe(0);
      const blank = spawnSync(binary, ['-c', script, directory, 'GSE123456', ''], { encoding: 'utf8', timeout: 30000 });
      expect(blank.status).not.toBe(0);
      const all = spawnSync(binary, ['-c', script, directory, 'GSE123456', 'ALL'], { encoding: 'utf8', timeout: 30000 });
      expect(all.status, all.stderr).toBe(0);
      fs.writeFileSync(path.join(directory, 'raw_data', 'SRR123456_1.fastq.gz'), 'user-owned different data');
      const conflict = spawnSync(binary, ['-c', script, directory, 'GSE123456', 'ALL'], { encoding: 'utf8', timeout: 30000 });
      expect(conflict.status).not.toBe(0);
      expect(fs.readFileSync(path.join(directory, 'raw_data', 'SRR123456_1.fastq.gz'), 'utf8')).toBe('user-owned different data');
    } finally { fs.rmSync(directory, { recursive: true, force: true }); }
  });
});
