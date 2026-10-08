import type { PaperRawDataRecord } from './workflowTypes';

export interface PublicDataResolution { records: PaperRawDataRecord[]; warnings: string[]; projects: string[] }
const accessionPattern = /\b(?:GSE\d+|PRJNA\d+|PRJEB\d+|SRP\d+|ERP\d+|DRP\d+)\b/g;
const hosts = new Set(['ftp.sra.ebi.ac.uk', 'ftp.ncbi.nlm.nih.gov']);
export function trustedFastqUrl(value: string): string | null {
  // URL normalizes dot segments before pathname validation; reject the raw form first.
  if (/(?:^|\/)\.\.(?:\/|$)|\\|%2e|%2f|%5c/i.test(value)) return null;
  try {
    const url = new URL(value.startsWith('ftp.') ? 'https://' + value : value);
    if (!hosts.has(url.hostname) || !['https:', 'ftp:'].includes(url.protocol)
      || url.username || url.password || url.port || url.search || url.hash
      || !/^\/[\w./-]+\.(?:fastq|fq)\.gz$/.test(url.pathname) || url.pathname.includes('..')) return null;
    url.protocol = 'https:';
    return url.href;
  } catch { return null; }
}

export function parseEnaReport(text: string, project: string, sourceUrl: string): PaperRawDataRecord[] {
  const lines = text.trim().split(/\r?\n/);
  const columns = lines.shift()?.split('\t') || [];
  const records: PaperRawDataRecord[] = [];
  for (const line of lines) {
    const row = Object.fromEntries(line.split('\t').map((value, index) => [columns[index], value]));
    if (!/^(?:SRR|ERR|DRR)\d+$/.test(row.run_accession || '')) continue;
    const rawUrls = (row.fastq_ftp || '').split(';');
    const urls = rawUrls.map(trustedFastqUrl);
    const checksums = (row.fastq_md5 || '').split(';');
    if (!urls.length || urls.some(url => !url) || checksums.length !== urls.length
      || checksums.some(hash => !/^[a-fA-F0-9]{32}$/.test(hash))) continue;
    const sampleAccession = row.experiment_title?.match(/\bGSM\d+\b/)?.[0] || row.sample_accession;
    records.push({ id: 'ENA:' + row.run_accession, repository: 'ENA', projectAccession: project,
      sampleAccession, sampleName: row.experiment_title || row.sample_title || sampleAccession || '',
      runAccessions: [row.run_accession], layout: row.library_layout === 'PAIRED' ? 'PE'
        : row.library_layout === 'SINGLE' ? 'SE' : undefined,
      files: urls.map(url => new URL(url!).pathname.split('/').pop()!), urls: urls as string[],
      checksums: checksums.map(hash => 'md5:' + hash.toLowerCase()),
      evidence: 'ENA metadata (not a paper quote): ' + sourceUrl + '\n' + line.slice(0, 800) });
  }
  return records;
}

async function metadataText(url: string, signal: AbortSignal): Promise<string> {
  const response = await fetch(url, { signal, redirect: 'error', headers: { 'User-Agent': 'HPClaw-PaperData/1.0' } });
  if (!response.ok) throw new Error('HTTP ' + response.status);
  if (Number(response.headers.get('content-length')) > 4_000_000) throw new Error('Metadata too large');
  const reader = response.body?.getReader();
  if (!reader) throw new Error('Empty metadata');
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const next = await reader.read();
      if (next.done) break;
      size += next.value.length;
      if (size > 4_000_000) throw new Error('Metadata too large');
      chunks.push(next.value);
    }
  } finally { await reader.cancel(); }
  return Buffer.concat(chunks).toString('utf8');
}

/** Query public metadata only, never fetch sequencing files during literature learning. */
export async function resolvePaperPublicData(text: string, signal?: AbortSignal): Promise<PublicDataResolution> {
  const allProjects = [...new Set(text.match(accessionPattern) || [])];
  const projects = allProjects.slice(0, 12);
  const warnings: string[] = [];
  if (allProjects.length > projects.length) warnings.push('以下项目尚未查询，数据清单不完整：' + allProjects.slice(12).join(', '));
  const records: PaperRawDataRecord[] = [];
  const deadline = AbortSignal.any([signal || AbortSignal.timeout(45000), AbortSignal.timeout(45000)]);
  // Three simultaneous public requests at most; no API key or arbitrary URL input.
  for (let offset = 0; offset < projects.length; offset += 3) {
    const results = await Promise.all(projects.slice(offset, offset + 3).map(async project => {
      try {
        let query = 'study_accession="' + project + '" OR secondary_study_accession="' + project + '"';
        if (project.startsWith('GSE')) {
          query = 'study_alias="' + project + '"';
          // GEO links remain useful when aliases are absent from ENA.
          try {
            const geo = await metadataText('https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?'
              + new URLSearchParams({ acc: project, targ: 'self', form: 'text', view: 'full' }),
            AbortSignal.any([deadline, AbortSignal.timeout(10000)]));
            const bioProject = geo.match(/!Series_relation[^\n]*\b(PRJNA\d+|PRJEB\d+)\b/)?.[1];
            if (bioProject) query += ' OR study_accession="' + bioProject + '"';
          } catch { /* ENA study alias is an independent fallback. */ }
        }
        const url = 'https://www.ebi.ac.uk/ena/portal/api/search?' + new URLSearchParams({
          result: 'read_run', query, fields: 'run_accession,study_accession,sample_accession,experiment_title,library_layout,fastq_ftp,fastq_md5',
          format: 'tsv', limit: '5001',
        });
        const report = await metadataText(url, AbortSignal.any([deadline, AbortSignal.timeout(15000)]));
        const rows = parseEnaReport(report, project, url);
        const availableRows = Math.max(0, report.trim().split('\n').length - 1);
        if (rows.length < availableRows) warnings.push(project + ' 的部分 run 缺少有效 FASTQ/MD5，需继续核对 SRA 元数据，未声明清单完整。');
        if (report.trim().split('\n').length > 5001) warnings.push(project + ' 超过本次元数据查询范围，需按子项目继续查询，未声明数据清单完整。');
        if (!rows.length) warnings.push(project + ' 未取得可校验 FASTQ 地址；仍需查询 SRA 或补充数据。');
        return rows;
      } catch (error) {
        warnings.push(project + ' 元数据查询失败：' + (error instanceof Error ? error.message : 'unknown'));
        return [];
      }
    }));
    const incoming = results.flat();
    if (records.length + incoming.length > 5000) warnings.push('已核验 run 超过本次 5000 条安全范围，未列入的 run 需要按子项目继续查询，清单不完整。');
    records.push(...incoming.slice(0, Math.max(0, 5000 - records.length)));
    if (deadline.aborted) {
      if (offset + 3 < projects.length) warnings.push('元数据查询超时，以下项目尚未查询：' + projects.slice(offset + 3).join(', '));
      break;
    }
  }
  const unique = records.filter((row, index, all) => all.findIndex(other =>
    other.projectAccession === row.projectAccession && other.id === row.id) === index);
  return { records: unique, warnings, projects };
}

/** A real downloader assembled from verified metadata, independently of model-generated prose. */
export function attachPublicDataDownload(workflow: any, resolution: PublicDataResolution, english = false): void {
  if (!resolution.records.length) return;
  const payload = Buffer.from(JSON.stringify(resolution.records.map(row => ({
    project: row.projectAccession, sample: row.sampleAccession || '', sample_name: row.sampleName || '',
    run: row.runAccessions[0], layout: row.layout || '', urls: row.urls, checksums: row.checksums,
  })))).toString('base64');
  const command = `set -euo pipefail
python3 - '{{OUTPUT_DIR}}' '{{DATA_PROJECT}}' '{{DOWNLOAD_RUNS}}' <<'HPCLAW_RAW_DATA'
import base64, csv, hashlib, json, pathlib, sys, time, urllib.request
records = json.loads(base64.b64decode("${payload}"))
root = pathlib.Path(sys.argv[1]).expanduser().resolve()
projects = set(sys.argv[2].replace(",", " ").split())
requested = set(sys.argv[3].replace(",", " ").split())
if not projects or not projects.issubset({r["project"] for r in records}):
    raise SystemExit("Select DATA_PROJECT from the verified project list before downloading.")
if not requested:
    raise SystemExit("Set DOWNLOAD_RUNS to explicit SRR/ERR/DRR IDs. No bulk download is started implicitly.")
all_requested = requested == {"ALL"}
rows = [r for r in records if r["project"] in projects and (all_requested or r["run"] in requested)]
if not rows or (not all_requested and requested != {r["run"] for r in rows}):
    raise SystemExit("Some requested runs are absent from this project's verified metadata.")
root.mkdir(parents=True, exist_ok=True)
data = root / "raw_data"
data.mkdir(exist_ok=True)
manifest = root / "raw_data_manifest.tsv"
with manifest.open("w", newline="") as out:
    writer = csv.writer(out, delimiter="\t")
    writer.writerow(["project","sample","sample_name","run","layout","file","url","checksum","condition","replicate"])
    for r in rows:
        for url, checksum in zip(r["urls"], r["checksums"]):
            filename = url.rsplit("/", 1)[1]
            writer.writerow([r["project"],r["sample"],r["sample_name"],r["run"],r["layout"],str(data/filename),url,checksum,"",""])
for r in rows:
    for url, checksum in zip(r["urls"], r["checksums"]):
        target = data / url.rsplit("/", 1)[1]
        def md5(file):
            digest = hashlib.md5()
            with file.open("rb") as stream:
                for chunk in iter(lambda: stream.read(1024*1024), b""):
                    digest.update(chunk)
            return digest.hexdigest()
        expected = checksum.split(":",1)[1]
        if target.exists():
            if md5(target) != expected:
                raise SystemExit("Existing file checksum mismatch; refusing overwrite: " + str(target))
            continue
        part = target.with_name(target.name + ".hpclaw.part")
        for attempt in range(3):
            try:
                with urllib.request.urlopen(url, timeout=120) as response, part.open("wb") as out:
                    for chunk in iter(lambda: response.read(1024*1024), b""):
                        out.write(chunk)
                if md5(part) != expected:
                    raise ValueError("Downloaded checksum mismatch: " + str(part))
                break
            except (OSError, ValueError) as error:
                if attempt == 2:
                    raise SystemExit("Download failed after 3 attempts: " + str(error))
                time.sleep(2 ** attempt)
        part.replace(target)
print("Verified downloads and manifest:", manifest)
HPCLAW_RAW_DATA`;
  const projects = [...new Set(resolution.records.map(row => row.projectAccession!))];
  const params = [
    { name: 'OUTPUT_DIR', label: english ? 'Output directory' : '输出目录', type: 'path', required: true, defaultValue: '' },
    { name: 'DATA_PROJECT', label: english ? 'Data projects' : '原始数据项目（可填多个）', type: 'text',
      required: true, defaultValue: projects.length === 1 ? projects[0] : '', help: projects.join(', ') },
    { name: 'DOWNLOAD_RUNS', label: english ? 'Run IDs or ALL' : '需要下载的 run 编号或 ALL', type: 'text', required: true,
      defaultValue: '', help: (english ? 'Enter ALL to explicitly download every verified run in selected projects, or specify run IDs. Verified counts: '
        : '填 ALL 明确下载所选项目的全部已核验 run，或填需要的 run 编号；留空不下载。已核验数量：')
        + projects.map(project => project + '=' + resolution.records.filter(row => row.projectAccession === project).length).join(', ') },
  ];
  workflow.params ||= [];
  for (const param of params) {
    const index = workflow.params.findIndex((item: any) => item.name === param.name);
    if (index < 0) workflow.params.push(param);
    else workflow.params[index] = { ...workflow.params[index], ...param };
  }
  const step = { id: 'public-data-download', title: english ? 'Download verified FASTQ files and generate raw_data_manifest.tsv'
    : '按已核验 run 下载 FASTQ、校验 MD5 并生成 raw_data_manifest.tsv', command,
    notes: english ? 'Sample names are preserved from database metadata. Conditions and replicates are not guessed.'
      : '样本名来自数据库原始元数据；不猜测条件和重复。先明确项目与下载范围，再执行。',
    agent: { kind: 'compute', sourceType: 'repository', sourcePath: 'https://www.ebi.ac.uk/ena/portal/api/search',
      sourceSection: 'ENA public read_run metadata', evidence: 'Verified FASTQ URLs and MD5 from ENA public metadata.',
      confidence: 'high', inputs: ['DATA_PROJECT', 'DOWNLOAD_RUNS'], outputs: ['raw_data_manifest.tsv', 'raw_data/*.fastq.gz'],
      contractVersion: 'paper-agent-v5' } };
  const oldSteps = Array.isArray(workflow.steps) ? workflow.steps : [];
  // Replace acquisition placeholders, not unrelated analysis operations.
  const acquisitionOnly = (item: any) => /下载|download|acquisition|获取原始数据/i.test(item.title || '')
    && !(/质控|比对|峰识别|trim|mapping|align|peak calling/i.test(item.title || '')
      || /\b(?:fastp|bwa|bowtie2|hisat2|STAR|macs2|bedtools)\b/.test(item.command || ''));
  const removedIds = oldSteps.filter(acquisitionOnly)
    .map((item: any) => item.id).filter(Boolean);
  workflow.steps = [step, ...oldSteps.filter((item: any) => !removedIds.includes(item.id)
    && !(acquisitionOnly(item) && /REVIEW_REQUIRED/.test(item.command || '')))
    .map((item: any) => ({ ...item, ...(Array.isArray(item.dependsOn) ? {
      dependsOn: [...new Set(item.dependsOn.map((id: string) => removedIds.includes(id) ? step.id : id))],
    } : {}) }))];
  if (Array.isArray(workflow.manifest?.qcGates)) {
    for (const gate of workflow.manifest.qcGates) {
      const oldId = oldSteps[Number(gate.afterStep) - 1]?.id;
      const newIndex = workflow.steps.findIndex((item: any) => item.id === oldId);
      if (newIndex >= 0) gate.afterStep = newIndex + 1;
    }
  }
  workflow.manifest ||= { software: [], references: [], qcGates: [] };
  workflow.manifest.software ||= [];
  if (!workflow.manifest.software.some((item: any) => item.name === 'python3')) workflow.manifest.software.push({ name: 'python3', required: true });
}
