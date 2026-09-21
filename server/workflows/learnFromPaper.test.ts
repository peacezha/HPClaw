import { describe, expect, it } from 'vitest';
import {
  biocondaCandidates, extractJsonObject, findRepoUrls, normalizeDoi, pickWorkflowFiles,
  parseWorkflowJson, preparePaperContext, stripHtmlToText,
} from './learnFromPaper';

describe('normalizeDoi', () => {
  it('识别各种 DOI 写法', () => {
    expect(normalizeDoi('10.1093/bioinformatics/btz385')).toBe('10.1093/bioinformatics/btz385');
    expect(normalizeDoi('https://doi.org/10.1093/bioinformatics/btz385')).toBe('10.1093/bioinformatics/btz385');
    expect(normalizeDoi('doi:10.1038/s41587-020-0439-x.')).toBe('10.1038/s41587-020-0439-x');
    expect(normalizeDoi('  10.48550/arXiv.2603.08195  ')).toBe('10.48550/arXiv.2603.08195');
  });

  it('非 DOI 返回 null', () => {
    expect(normalizeDoi('随便一段文字')).toBeNull();
    expect(normalizeDoi('')).toBeNull();
    expect(normalizeDoi('10.x/short')).toBeNull();
  });
});

describe('stripHtmlToText', () => {  it('去标签、去脚本、解码实体、压缩空白', () => {
    const html = `<html><head><style>.a{color:red}</style><script>var x=1;</script></head>
      <body><h1>Methods</h1><p>We used fastp &amp; STAR&nbsp;for QC.</p>
      <div>Reads were aligned with&nbsp;&lt;BWA&gt; &#39;mem&#39;.</div></body></html>`;
    const text = stripHtmlToText(html);
    expect(text).not.toContain('<script');
    expect(text).not.toContain('<p>');
    expect(text).not.toContain('var x');
    expect(text).not.toContain('color:red');
    expect(text).toContain('Methods');
    expect(text).toContain('fastp & STAR');
    expect(text).toContain('<BWA>'); // &lt; 解码后是正常文本
    expect(text).toContain("'mem'");
    expect(text).not.toMatch(/[ \t]{2,}/);
  });

  it('超长截断到上限', () => {
    const html = `<p>${'x'.repeat(300000)}</p>`;
    expect(stripHtmlToText(html).length).toBeLessThanOrEqual(240000);
  });
});

describe('preparePaperContext 方法章节优先', () => {
  it('保留题名摘要、Methods 与代码链接，排除大段 Results', () => {
    const text = `A workflow paper\nAbstract\nWe analyze RNA sequencing.\nIntroduction\n${'背景 '.repeat(200)}\nMethods\nRNA-seq processing\nWe used fastp 0.23 and STAR 2.7.\nResults\n${'结果 '.repeat(2000)}\nCode Availability\nhttps://github.com/org/pipeline`;
    const prepared = preparePaperContext(text);
    expect(prepared.selectionMode).toBe('methods');
    expect(prepared.methodSections).toContain('Methods');
    expect(prepared.text).toContain('fastp 0.23');
    expect(prepared.text).toContain('github.com/org/pipeline');
    expect(prepared.text.length).toBeLessThan(text.length);
  });

  it('找不到章节标题时明确使用全文兜底', () => {
    const prepared = preparePaperContext('A short unstructured description '.repeat(100));
    expect(prepared.selectionMode).toBe('fulltext-fallback');
    expect(prepared.methodSections).toEqual([]);
  });
});

describe('extractJsonObject', () => {
  it('解析代码围栏和前后说明，字符串花括号不干扰', () => {
    expect(extractJsonObject('```json\n{"a":"{x}","b":1}\n```')).toEqual({ a: '{x}', b: 1 });
    expect(extractJsonObject('说明文字 {"workflow":{"name":"demo"}} 后续')).toEqual({ workflow: { name: 'demo' } });
  });

  it('无完整对象返回 null', () => {
    expect(extractJsonObject('not json {"a": 1')).toBeNull();
  });

  it('修复思考标签、中文引号、尾逗号和字符串内原始换行', () => {
    const raw = '<think>先分析</think>```json\n{“workflow”:{“name”:“demo”,“description”:“第一行\n第二行”,“steps”:[],},}\n```';
    expect(extractJsonObject(raw)).toEqual({
      workflow: { name: 'demo', description: '第一行\n第二行', steps: [] },
    });
  });
});

describe('parseWorkflowJson 截断恢复', () => {
  it('闭合被 token 上限截断的流程 JSON 并标记 partial-repair', async () => {
    const result = await parseWorkflowJson('{"workflow":{"name":"demo","steps":[{"title":"QC","command":"fastqc reads.fq"}');
    expect(result.mode).toBe('partial-repair');
    expect(result.truncated).toBe(true);
    expect((result.value as any).workflow.steps[0].title).toBe('QC');
  });

  it('非 JSON 文本保持失败，不伪造流程', async () => {
    const result = await parseWorkflowJson('模型没有给出结构化内容');
    expect(result).toEqual({ value: null, mode: 'failed', truncated: false });
  });
});


describe('biocondaCandidates 包名规范化', () => {
  it('生成原名与前缀候选', () => {
    expect(biocondaCandidates('fastp')).toContain('fastp');
    expect(biocondaCandidates('DESeq2')).toEqual(['deseq2', 'bioconductor-deseq2', 'r-deseq2', 'perl-deseq2', 'py-deseq2']);
    expect(biocondaCandidates('bioconductor-deseq2')).toEqual(['bioconductor-deseq2', 'r-bioconductor-deseq2', 'perl-bioconductor-deseq2', 'py-bioconductor-deseq2']);
  });

  it('清理非法字符，空名返回空', () => {
    expect(biocondaCandidates('BWA (v0.7)')).toEqual(['bwa', 'bioconductor-bwa', 'r-bwa', 'perl-bwa', 'py-bwa']);
    expect(biocondaCandidates('')).toEqual([]);
  });
});

describe('findRepoUrls 论文中的 GitHub 仓库提取', () => {
  it('识别仓库链接并去重、排除深层链接', () => {
    const text = 'Code available at https://github.com/nf-core/rnaseq and https://github.com/nf-core/rnaseq/. ' +
      'See issues https://github.com/nf-core/rnaseq/issues/12 and docs https://github.com/org/repo/wiki/page ' +
      '另一个仓库 github.com/user/proj.git';
    const urls = findRepoUrls(text);
    expect(urls).toContain('https://github.com/nf-core/rnaseq');
    expect(urls).toContain('https://github.com/user/proj');
    expect(urls.filter(u => u.includes('nf-core')).length).toBe(1);
  });

  it('无仓库返回空数组', () => {
    expect(findRepoUrls('没有链接的文本 https://doi.org/10.1000/xyz')).toEqual([]);
  });
});

describe('pickWorkflowFiles 流程代码文件挑选', () => {
  it('优先 main.nf/Snakefile/workflows，限制数量', () => {
    const paths = [
      'README.md', 'main.nf', 'nextflow.config', 'workflows/rnaseq.nf',
      'modules/local/fastp.nf', 'modules/local/star.nf', 'docs/usage.md',
      'subworkflows/a.nf', 'bin/run.sh', 'assets/x.csv',
    ];
    const picked = pickWorkflowFiles(paths);
    expect(picked[0]).toBe('main.nf');
    expect(picked).toContain('workflows/rnaseq.nf');
    expect(picked).toContain('modules/local/fastp.nf');
    expect(picked).not.toContain('README.md');
    expect(picked.length).toBeLessThanOrEqual(8);
  });

  it('Snakemake 仓库识别 Snakefile 与 .smk', () => {
    const picked = pickWorkflowFiles(['Snakefile', 'rules/qc.smk', 'rules/align.smk', 'notes.txt']);
    expect(picked[0]).toBe('Snakefile');
    expect(picked).toContain('rules/qc.smk');
  });

  it('无流程文件返回空', () => {
    expect(pickWorkflowFiles(['README.md', 'docs/a.md'])).toEqual([]);
  });
});
