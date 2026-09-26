import { describe, expect, it } from 'vitest';
import { classifyWorkflowTurn } from './workflowTurnIntent';

describe('classifyWorkflowTurn', () => {
  it.each([
    '大概需要排队等待多久',
    '作业 75512132 的状态怎么样',
    '作业目前的状态',
    '为什么我提交的作业一直排队不动',
    '看一下作业的日志',
    'why is job 75512132 pending?',
    'show me the current workflow progress',
  ])('keeps pure status/ETA/log questions read-only: %s', text => {
    expect(classifyWorkflowTurn(text)).toBe('inspect');
  });

  it.each([
    '继续执行当前流程',
    '现在重新提交 STAR 作业',
    '取消作业 75512132',
    '清理旧产物并重跑',
    '请你把步骤 3 的旧结果删掉，然后重新运行',
    '先清除失败输出，再从第三步重算',
    'clean the old outputs and rerun step 3',
    'resume the workflow',
    'please kill the job',
  ])('routes explicit actions to the executor: %s', text => {
    expect(classifyWorkflowTurn(text)).toBe('execute');
  });

  it.each([
    // 这些都是用户真实发出的工作指令，旧版曾被误判为只读
    '帮我鉴定差异表达基因，差异表达基因还要分析GO和KEGG',
    '能否画柱形图可视化，同时图片要好看，达到学术论文发表级别',
    '这个流程接下来怎么办',
    '我有点担心这个结果',
    '那这个呢',
    '回到这个文件夹：/public/home/chahe/RNA-seq',
  ])('work/analysis requests are no longer locked into read-only: %s', text => {
    expect(classifyWorkflowTurn(text)).toBe('execute');
  });
});
