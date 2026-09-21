import { describe, expect, it } from 'vitest';
import { matchWorkflows, scoreWorkflow } from './workflowMatch';
import { formatWorkflowForAgent, renderWorkflowCommand, type Workflow } from './workflowTypes';

const workflows: Workflow[] = [
  {
    id: 'w1',
    name: 'RNA-seq 质控与比对流程',
    description: '转录组上游分析',
    keywords: ['转录组', 'rnaseq', '质控', 'hisat2'],
    params: [{ name: 'SAMPLE', label: '样本名' }],
    steps: [
      { title: '质控', command: 'fastqc {{SAMPLE}}.fq.gz' },
      { title: '比对', command: 'hisat2 -x idx -U {{SAMPLE}}.fq.gz' },
    ],
    source: 'builtin',
    createdAt: 0,
    updatedAt: 0,
  },
  {
    id: 'w2',
    name: '集群作业排查流程',
    description: '作业失败排查',
    keywords: ['作业', '排查', 'bjobs'],
    params: [],
    steps: [{ title: '看状态', command: 'bjobs -l {{JOBID}}' }],
    source: 'builtin',
    createdAt: 0,
    updatedAt: 0,
  },
];

describe('workflowMatch', () => {
  it('中文关键词命中对应流程', () => {
    const matches = matchWorkflows(workflows, '帮我做转录组数据分析', 3);
    expect(matches[0]?.id).toBe('w1');
  });

  it('英文关键词同样命中', () => {
    const matches = matchWorkflows(workflows, 'rnaseq pipeline', 3);
    expect(matches[0]?.id).toBe('w1');
  });

  it('无关查询不得分', () => {
    expect(scoreWorkflow(workflows[0], '今天天气怎么样')).toBe(0);
  });

  it('作业排查类查询命中排查流程', () => {
    const matches = matchWorkflows(workflows, '我的作业一直失败怎么排查', 3);
    expect(matches[0]?.id).toBe('w2');
  });
});

describe('workflowTypes', () => {
  it('renderWorkflowCommand 替换占位参数', () => {
    expect(renderWorkflowCommand('fastqc {{SAMPLE}} -t {{THREADS}}', { SAMPLE: 'a.fq', THREADS: '8' }))
      .toBe('fastqc a.fq -t 8');
  });

  it('未提供的参数保留占位符', () => {
    expect(renderWorkflowCommand('hisat2 -x {{GENOME}}', {})).toBe('hisat2 -x {{GENOME}}');
  });

  it('formatWorkflowForAgent 包含全部步骤与命令', () => {
    const text = formatWorkflowForAgent(workflows[0], { SAMPLE: 's1' });
    expect(text).toContain('RNA-seq 质控与比对流程');
    expect(text).toContain('fastqc s1.fq.gz');
    expect(text).toContain('hisat2');
  });
});
