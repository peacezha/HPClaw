// 环境检查步骤脚本生成器：bioskills 种子与 ENCODE 金标准流程共用同一套约定，
// 保证每个流程的第一步都是“可直接执行、只读、缺失即明确失败”的真实脚本。
import type { SoftwareItem } from '../../shared/flowManifest';

/** 预检脚本里初始化 module 系统的标准前导（与 preflight.ts 的 MODULE_INIT 同约定） */
export const ENV_CHECK_MODULE_INIT = [
  'if ! type module >/dev/null 2>&1; then',
  '  for f in /etc/profile.d/modules.sh /etc/profile.d/lmod.sh /usr/share/Modules/init/bash /usr/share/lmod/lmod/init/bash; do',
  '    [ -r "$f" ] && . "$f" >/dev/null 2>&1 && type module >/dev/null 2>&1 && break || true',
  '  done',
  'fi',
].join('\n');

const CHECK_FUNCS = [
  'FAIL=0',
  'check_mod() {',
  '  if type module >/dev/null 2>&1; then',
  '    if module load "$2" >/dev/null 2>&1; then echo "OK   $1 ($2)"; else',
  '    echo "MISS $1 ($2) —— 集群可用版本："; module -t avail "${2%%/*}" 2>&1 | grep -i "${2%%/*}" | head -5 || true',
  '    if [ "$3" = "required" ]; then FAIL=1; fi',
  '  fi',
  '  else',
  '    # 无 module 系统：按直装处理，直接在 PATH 里按命令名探测',
  '    direct_cmd="${2%%/*}"',
  '    if command -v "$direct_cmd" >/dev/null 2>&1; then echo "OK   $1 ($direct_cmd 直装)"; else',
  '    echo "MISS $1（无 module 系统，需直接安装 $2）"; if [ "$3" = "required" ]; then FAIL=1; fi',
  '  fi',
  '  fi',
  '}',
  'check_cmd() {',
  '  if ( eval "$2" ) >/dev/null 2>&1; then echo "OK   $1"; else echo "MISS $1（检查命令：$2）"; if [ "$3" = "required" ]; then FAIL=1; fi; fi',
  '}',
].join('\n');

export interface EnvCheckReference {
  /** 运行参数名（{{PARAM}} 占位，未指定时渲染后仍含 {{ }}，脚本里识别为“跳过”） */
  param: string;
  /** 展示名，如 "Bowtie2 索引" */
  label: string;
  /** 缺省时是否判失败（默认 false：可选参考缺失只提示不阻断） */
  required?: boolean;
}

export interface EnvCheckSpec {
  /** bsub 作业名前缀，如 atac / rnaseq；最终作业名 <job>_env */
  job: string;
  /** 软件清单（通常直接传 manifest.software） */
  software: SoftwareItem[];
  /** 需要确认存在且非空的输入目录参数名，默认 ['INPUT_DIR']；可选目录未指定时自动跳过 */
  inputs?: string[];
  /** 参考数据检查项（可选参考缺失只提示，不阻断） */
  references?: EnvCheckReference[];
}

/**
 * 生成流程第一步的环境检查脚本。
 * 约定：只读；必需软件缺失或必填输入目录不存在时 exit 1；
 * 可选参考未指定（参数占位符未被替换）时输出 SKIP 而不判失败。
 */
export function buildEnvCheckCommand(spec: EnvCheckSpec): string {
  const lines: string[] = [
    '# 环境检查（只读）：确认软件可加载、输入与参考数据就绪。',
    '# 必需项缺失时本步骤以非 0 退出；请先补齐环境（流程面板支持一键部署）再继续。',
    `#BSUB -J ${spec.job}_env -n 1 -q {{QUEUE}}`,
    ENV_CHECK_MODULE_INIT,
    CHECK_FUNCS,
  ];
  for (const item of spec.software) {
    const tag = item.required ? 'required' : 'optional';
    if (item.module) lines.push(`check_mod ${JSON.stringify(item.name)} ${JSON.stringify(item.module)} ${tag}`);
    else if (item.checkCmd) lines.push(`check_cmd ${JSON.stringify(item.name)} ${JSON.stringify(item.checkCmd)} ${tag}`);
  }
  const inputs = spec.inputs && spec.inputs.length ? spec.inputs : ['INPUT_DIR'];
  lines.push(`echo "--- 输入目录 ---"`);
  for (const param of inputs) {
    const placeholder = `{{${param}}}`;
    lines.push(
      `case "${placeholder}" in ''|*'{{'*) ${param === 'INPUT_DIR' ? 'echo "MISS 未指定输入目录"; FAIL=1' : `echo "SKIP ${param}（未指定，可选）"`} ;;`,
      `  *) if [ -d "${placeholder}" ]; then echo "OK   ${param}=${placeholder}"; ls "${placeholder}" | head -5 || true; else echo "MISS 目录 ${placeholder}"; FAIL=1; fi ;;`,
      'esac',
    );
  }
  if (spec.references?.length) {
    lines.push(
      `echo "--- 参考数据 ---"`,
      // 索引类参考可能是“前缀”而非具体文件：依次探测常见索引后缀
      'chk_ref() {',
      '  case "$1" in \'\'|*\'{{\'*) echo "SKIP $2（未指定，运行时由 AI 协助补齐）"; return 0 ;; esac',
      '  if [ -e "$1" ] || [ -e "$1.1.bt2" ] || [ -e "$1.sa" ] || [ -e "$1.grp" ]; then echo "OK   $2"; else echo "MISS $2: $1（含常见索引后缀均未找到）"; if [ "$4" = "required" ]; then FAIL=1; fi; fi',
      '}',
    );
    for (const ref of spec.references) {
      lines.push(`chk_ref "{{${ref.param}}}" ${JSON.stringify(ref.label)} '' ${ref.required ? 'required' : 'optional'}`);
    }
  }
  lines.push(
    `echo "--- 已加载模块 ---"`,
    'if type module >/dev/null 2>&1; then module -t list 2>&1 | tail -30 || true; else echo "（本机无 module 系统，软件均为直装）"; fi',
    'exit $FAIL',
  );
  return lines.join('\n');
}
