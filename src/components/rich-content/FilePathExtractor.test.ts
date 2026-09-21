import { describe, expect, it } from 'vitest';
import { extractFilePaths } from './FilePathExtractor';

describe('extractFilePaths', () => {
  it('keeps compressed bioinformatics file suffixes intact', () => {
    const paths = extractFilePaths([
      '/public/home/hpzhang/F-FN-1_R1.fq.gz',
      '/public/home/hpzhang/RNA-seq_test/F-FN-2_R1.fastq.gz',
      '/public/home/hpzhang/results/sample.g.vcf.gz',
    ].join('\n'));

    expect(paths).toContain('/public/home/hpzhang/F-FN-1_R1.fq.gz');
    expect(paths).toContain('/public/home/hpzhang/RNA-seq_test/F-FN-2_R1.fastq.gz');
    expect(paths).toContain('/public/home/hpzhang/results/sample.g.vcf.gz');
    // .gz 整名命中后，不应再捞出被截断的 .fq/.vcf 前缀
    expect(paths).not.toContain('/public/home/hpzhang/F-FN-1_R1.fq');
  });

  it('extracts Windows absolute paths (both separator variants)', () => {
    const paths = extractFilePaths(
      '图片已保存到 C:\\Users\\Administrator\\AppData\\Roaming\\HPClaw\\runtime\\R16_D.editing_summary.png 和 C:/work/out/plot.png 里',
    );

    expect(paths).toContain('C:\\Users\\Administrator\\AppData\\Roaming\\HPClaw\\runtime\\R16_D.editing_summary.png');
    expect(paths).toContain('C:/work/out/plot.png');
  });

  it('extracts dot-relative dsh artifact paths without the unix-pattern substring misfire', () => {
    const paths = extractFilePaths('可以查看 .dsh-vision-toolkit/artifacts/R16_D_view.png 这张图');

    expect(paths).toContain('.dsh-vision-toolkit/artifacts/R16_D_view.png');
    // 回归：Unix 绝对模式曾把 /artifacts/R16_D_view.png 当子串误捞出来
    expect(paths).not.toContain('/artifacts/R16_D_view.png');
  });

  it('still extracts standalone unix-ized relative paths', () => {
    const paths = extractFilePaths('图在 /artifacts/R16_D_view.png 这里');

    expect(paths).toContain('/artifacts/R16_D_view.png');
  });

  it('dedupes a shorter match that is a substring of a longer one', () => {
    const paths = extractFilePaths('产物 .dsh-vision-toolkit/artifacts/R16_D_view.png 与 /artifacts/R16_D_view.png 是同一张图');

    expect(paths).toEqual(['.dsh-vision-toolkit/artifacts/R16_D_view.png']);
  });

  it('extracts windows paths mentioned alongside unix cluster paths', () => {
    const paths = extractFilePaths('本地 C:\\tmp\\out\\result.csv 已同步到集群 /home/u/out/result.csv');

    expect(paths).toContain('C:\\tmp\\out\\result.csv');
    expect(paths).toContain('/home/u/out/result.csv');
  });

  it('skips paths already rendered inline as markdown image destinations', () => {
    // 图片目的地由 MarkdownMessage 内联渲染，重复出卡会同一张图显示两次
    const paths = extractFilePaths('看图 ![视图](C:\\data\\x.png) 与产物 /home/u/out/plot.png');

    expect(paths).not.toContain('C:\\data\\x.png');
    expect(paths).toContain('/home/u/out/plot.png');
  });

  it('skips ./-relative paths used as markdown image destinations instead of matching their substring', () => {
    // ./demo-assets/x.svg 里的 /demo-assets/x.svg 子串不应被 Unix 模式误捞重复出卡
    const paths = extractFilePaths('图 ![分布](./demo-assets/x.svg) 完成');

    expect(paths).toEqual([]);
  });

  it('extracts ./-relative paths in prose as full form', () => {
    const paths = extractFilePaths('结果写到 ./out/plot.png 了');

    expect(paths).toEqual(['./out/plot.png']);
  });

  it('extracts bare relative paths (workflow outputs shape)', () => {
    const paths = extractFilePaths('产物在 results/R16_D.png 和 code/step-01.sh,日志已归档');

    expect(paths).toContain('results/R16_D.png');
    expect(paths).toContain('code/step-01.sh');
  });
});
