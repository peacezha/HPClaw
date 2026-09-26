export type WorkflowTurnMode = 'execute' | 'inspect';

const EXPLICIT_EXECUTION_PATTERNS = [
  /^(?:请|请你|麻烦|帮我|替我)?(?:直接|马上|立即|现在|先)?(?:继续|执行|运行|开始|恢复|推进|提交|重提|重新提交|重跑|重新运行|重做|重算|重建|清理|清除|删除|删掉|移除|覆盖|取消|终止|杀掉|切换|换到|修改|调整)/i,
  /^(?:please\s+)?(?:continue|run|execute|start|resume|proceed|submit|resubmit|rerun|retry|clean|cleanup|delete|remove|overwrite|cancel|stop|kill|move|switch|change|modify)\b/i,
  /(?:现在|立即|直接|马上|然后|接着|随后|并|再)(?:帮我)?(?:继续|执行|运行|提交|重提|重新提交|重跑|重新运行|重做|重算|重建|清理|清除|删除|删掉|移除|覆盖|取消|终止|杀掉|kill|切换|修改|调整)/i,
  /(?:把|将).{0,120}(?:清理|清除|删除|删掉|移除|覆盖|重跑|重新运行|重做|重算|重建|取消|终止|杀掉)/i,
  /(?:please\s+)?(?:continue|run|execute|resume|submit|resubmit|rerun|clean|cleanup|delete|remove|overwrite|cancel|kill)\s+(?:it|the|this|old|job|workflow|step|output|outputs|result|results)/i,
];

// 只有纯粹的状态/进度/ETA/日志查询才进只读 inspect；工作类指令一律交给执行器。
// 旧版把“分析/检查/能否/建议”都判成只读，导致“帮我鉴定差异表达基因并分析 GO/KEGG”
// 这类明确的工作指令被锁死在只读模式——这是用户反复抱怨的束缚来源。
const PURE_STATUS_PATTERNS = [
  /^(?:请问|请问一下|帮我看|看看|看下|麻烦看|查一下|查询)?(?:目前|现在|当前)?(?:作业|流程|任务|步骤|运行|job)?\s*\d*\s*(?:的)?(?:状态|进度|排队情况|排到|还要多久|预计|什么时候能|什么时候会|到哪一步)/i,
  /(?:作业|流程|任务|job)\s*[\d#]*\s*(?:现在|目前|当前)?(?:的)?(?:状态|进度|情况|怎么样|如何|排到)/i,
  /(?:为什么|为啥|怎么).{0,15}(?:失败|报错|挂|卡住|排队|不动)/i,
  /(?:排队|等待|卡住).{0,8}(?:多久|多长时间|何时|什么时候)/i,
  /(?:查看|看一下|看看|显示|展示|读出)(?:一下)?(?:作业|流程|任务|job)?\s*[\d#]*\s*(?:的)?(?:日志|输出|报错|结果文件)/i,
  /^(?:status|progress|eta|how long|when will|why did|why is|what happened|show\s+(?:me\s+)?[\w\s]{0,24}?(?:log|status|output|progress))\b/i,
];

/**
 * A workflow conversation can contain both execution commands and ordinary
 * questions.  Only pure status/ETA/log questions stay read-only; everything
 * else — including ambiguous or analysis-flavored requests — goes to the
 * executor (危险命令仍由运行时确认与路径守卫兜底).
 */
export function classifyWorkflowTurn(text: string): WorkflowTurnMode {
  const normalized = String(text || '').trim();
  if (!normalized) return 'execute';
  if (EXPLICIT_EXECUTION_PATTERNS.some(pattern => pattern.test(normalized))) return 'execute';
  if (PURE_STATUS_PATTERNS.some(pattern => pattern.test(normalized))) return 'inspect';
  // 模糊表达默认是工作指令：用户放开权限后，executor 负责执行；
  // 纯查询由上面收窄后的规则进入只读 inspect。
  return 'execute';
}
