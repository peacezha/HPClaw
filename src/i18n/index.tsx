import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Languages } from 'lucide-react';

export type AppLocale = 'zh-CN' | 'en-US';

const LANGUAGE_STORAGE_KEY = 'hpclaw_language';

/**
 * HPClaw 的界面短语表。左侧是默认中文，右侧是英文。
 * 用户输入、文件名、代码、终端原始输出和 AI 历史消息不属于界面短语，
 * 不在这里自动改写，避免科研内容失真。
 */
const UI_PHRASES: ReadonlyArray<readonly [string, string]> = [
  ['生物信息智能计算助手', 'Bioinformatics Intelligent Computing Assistant'],
  ['已保存的账号', 'Saved accounts'],
  ['选择账号快速登录…', 'Select an account for quick login…'],
  ['选择账号', 'Select account'],
  ['删除该账号', 'Delete this account'],
  ['计算资源 IP', 'Compute Resource IP'],
  ['端口', 'Port'],
  ['用户名', 'Username'],
  ['密码', 'Password'],
  ['验证码', 'Verification Code'],
  ['自动', 'Auto'],
  ['显示密码', 'Show password'],
  ['隐藏密码', 'Hide password'],
  ['TOTP 密钥设置', 'TOTP Secret Settings'],
  ['Google 验证器密钥', 'Google Authenticator Secret'],
  ['输入 Base32 密钥', 'Enter Base32 secret'],
  ['确认', 'Confirm'],
  ['取消', 'Cancel'],
  ['密钥仅保存在本机。', 'Secret stored on this device only.'],
  ['记住登录信息', 'Remember credentials'],
  ['正在连接…', 'Connecting…'],
  ['正在连接...', 'Connecting...'],
  ['登录', 'Login'],
  ['登录失败', 'Login failed'],
  ['网络错误，请重试', 'Network error. Please try again.'],
  ['未确认主机指纹，登录已取消', 'Host fingerprint was not confirmed. Login cancelled.'],
  ['首次连接该主机。请确认主机指纹无误后再信任：', 'First connection to this host. Verify the host fingerprint before trusting it:'],
  ['确认后将使用此指纹重试登录。', 'After confirmation, login will retry with this fingerprint.'],

  ['AI 助手', 'AI Assistant'],
  ['打开 AI 助手', 'Open AI Assistant'],
  ['关闭 AI 助手', 'Close AI Assistant'],
  ['对话记录', 'Conversations'],
  ['作业监控', 'Job Monitor'],
  ['打开文件传输工作区', 'Open File Transfer Workspace'],
  ['文件传输工作区', 'File Transfer Workspace'],
  ['文件传输', 'File Transfer'],
  ['切换到白天模式', 'Switch to light mode'],
  ['切换到黑夜模式', 'Switch to dark mode'],
  ['QQ 机器人配置', 'QQ Bot Settings'],
  ['AI 控制', 'AI Control'],
  ['AI 计算资源控制', 'AI compute resource control'],
  ['允许 AI 在计算资源执行命令：已开启', 'Allow AI to run commands on the compute resource: on'],
  ['允许 AI 在计算资源执行命令：已关闭', 'Allow AI to run commands on the compute resource: off'],
  ['断开连接', 'Disconnect'],
  ['断开并关闭', 'Disconnect and close'],
  ['添加计算资源', 'Add compute resource'],
  ['连接计算资源', 'Connect compute resource'],
  ['尚未连接计算资源', 'No compute resource connected'],
  ['连接计算资源后即可使用终端与作业监控', 'Connect a compute resource to use the terminal and job monitor'],
  ['连接计算资源后即可使用终端与作业监控，没有计算资源也能用：本地 AI 可完成分析与对话', 'Connect a compute resource to use the terminal and job monitor. No compute resource needed: the local AI can handle analysis and conversation'],
  ['资源管理', 'Resources'],
  ['作业', 'Jobs'],
  ['调整 AI 面板宽度', 'Resize AI panel'],
  ['加载中…', 'Loading…'],
  ['加载中...', 'Loading…'],
  ['加载中...', 'Loading...'],
  ['本地', 'Local'],
  ['计算资源', 'Compute Resource'],
  ['远程', 'Remote'],
  ['未连接', 'Disconnected'],
  ['已连接', 'Connected'],

  ['AI 助理', 'AI Assistant'],
  ['HPClaw 智能助手', 'HPClaw Intelligent Assistant'],
  ['AI 服务商', 'AI provider'],
  ['模型', 'Model'],
  ['自定义 OpenAI 兼容接口', 'Custom OpenAI-compatible endpoint'],
  ['自定义 OpenAI 兼容接口', 'Custom OpenAI-compatible'],
  ['Agent 执行策略', 'Agent execution policy'],
  ['规划方式', 'Planning mode'],
  ['智能判断（推荐）', 'Plan when needed (recommended)'],
  ['所有任务先规划', 'Plan before every task'],
  ['执行前确认', 'Confirmation before execution'],
  ['集群路径权限', 'Cluster path access'],
  ['全部路径 / 多路径（推荐）', 'All paths / multiple paths (recommended)'],
  ['仅流程与明确指定路径', 'Workflow and explicitly named paths only'],
  ['全部路径模式允许 AI 在同一任务中切换、复制和处理 SSH 账号可访问的多个目录。', 'All-path access lets AI switch between, copy across, and process multiple directories available to the SSH account in one task.'],
  ['仅高风险操作（推荐）', 'High-risk actions only (recommended)'],
  ['完全自动（不弹确认）', 'Fully automatic (no confirmations)'],
  ['添加工作文件夹', 'Add workspace folder'],
  ['添加本地工作区路径；多个路径用分号分隔', 'Add local workspace paths; separate multiple paths with semicolons'],
  ['写入、联网、提交作业都确认', 'Confirm writes, network actions, and job submission'],
  ['每条命令都确认', 'Confirm every command'],
  ['单次最多命令数（5–40）', 'Maximum commands per run (5–40)'],
  ['设置', 'Settings'],
  ['AI 设置', 'AI Settings'],
  ['保存设置', 'Save settings'],
  ['首次使用，请先配置 AI 服务：', 'Configure an AI service before first use:'],
  ['新对话', 'New conversation'],
  ['保存对话到计算资源', 'Save conversation to compute resource'],
  ['重新发送上一条消息', 'Resend previous message'],
  ['重试', 'Retry'],
  ['关闭', 'Close'],
  ['加载对话中...', 'Loading conversation…'],
  ['我可以自主操作计算资源、运行生信工具、分析结果。试试这些：', 'I can operate compute resources, run bioinformatics tools, and analyze results. Try one of these:'],
  ['思考中...', 'Thinking…'],
  ['命令确认', 'Command confirmation'],
  ['命令可能访问工作目录以外的路径', 'This command may access paths outside the working directory'],
  ['拒绝', 'Reject'],
  ['信任', 'Trust'],
  ['执行', 'Run'],
  ['作业监控中', 'Monitoring job'],
  ['等待超时：10 分钟', 'Wait timeout: 10 minutes'],
  ['停止', 'Stop'],
  ['继续', 'Continue'],
  ['AI 需要你确认', 'AI needs your confirmation'],
  ['点击选项直接回答，或在下方输入框输入', 'Choose an option or type an answer below'],
  ['匹配流程:', 'Matching workflows:'],
  ['选择工作文件夹', 'Choose workspace folder'],
  ['工作区（dsh 引擎本地工具的落点目录）', 'Workspace (local output directory for dsh engine tools)'],
  ['所选路径不是有效文件夹', 'The selected path is not a valid folder'],
  ['未设置工作区（默认数据目录）', 'No workspace set (default data directory)'],
  ['本地工作区路径（本地分析必填）', 'Local workspace path (required for local analysis)'],
  ['本地文件分析需要指定工作区目录', 'Local file analysis requires a workspace directory'],
  ['添加附件', 'Attach files'],
  ['移除附件', 'Remove attachment'],
  ['附件添加失败', 'Failed to attach files'],
  ['附件功能需要桌面端支持，浏览器模式无法获取文件路径', 'Attachments require the desktop app; file paths are unavailable in browser mode'],
  ['请先选择工作文件夹，再添加附件', 'Choose a workspace folder before attaching files'],
  ['关闭标签', 'Close tab'],
  ['清除', 'Clear'],
  ['发送', 'Send'],
  ['可随时停止；AI 超时不会断开计算资源', 'You can stop at any time; an AI timeout will not disconnect the compute resource'],
  ['搜索技能...', 'Search skills…'],
  ['搜索技能...', 'Search skills...'],
  ['技能库', 'Skills'],
  ['流程', 'Workflows'],
  ['新建', 'New'],
  ['技能名称', 'Skill name'],
  ['内容（Markdown）', 'Content (Markdown)'],
  ['添加', 'Add'],
  ['未加载技能', 'No skills loaded'],
  ['输入任务描述...', 'Describe a task…'],
  ['AI 正在准备…', 'AI is preparing…'],
  ['AI 正在推理和规划…', 'AI is reasoning and planning…'],
  ['AI 正在执行计算资源命令…', 'AI is running a command on the compute resource…'],
  ['AI 正在组织结果…', 'AI is preparing the result…'],
  ['正在连接 HPClaw Agent…', 'Connecting to HPClaw Agent…'],
  ['正在整理对话、计算资源环境和相关技能…', 'Preparing conversation, compute resource context, and relevant skills…'],
  ['上下文已就绪，正在请求', 'Context ready; requesting'],
  ['正在请求', 'Requesting'],
  ['AI 已响应，正在规划和执行…', 'AI responded and is planning and executing…'],
  ['AI 本轮已达', 'This AI turn reached the'],
  ['分钟硬上限，已明确暂停。计算资源 SSH 连接不会因此断开，已提交的后台作业仍会继续监控。', 'minute hard limit and was paused. The compute resource SSH connection remains active, and submitted background jobs remain monitored.'],
  ['AI 已停止', 'AI stopped'],
  ['AI 已完成', 'AI completed'],
  ['AI 已等待你回答', 'AI is waiting for your answer'],
  ['AI 本轮已结束', 'AI turn ended'],
  ['AI 请求出错', 'AI request failed'],
  ['AI 请求超时或连接中断，可点击重试', 'AI request timed out or was interrupted. Click retry.'],
  ['SSH 主连接已断开', 'The main SSH connection is disconnected'],
  ['SSH 会话已断开，请重新连接（对话已保留）', 'The SSH session is disconnected. Reconnect to continue; the conversation was preserved.'],
  ['保存失败，点击重试', 'Save failed. Click to retry.'],
  ['已中断', 'Interrupted'],
  ['保存技能失败', 'Failed to save skill'],
  ['无匹配技能', 'No matching skills'],
  ['技能搜索失败', 'Skill search failed'],
  ['无输出', 'No output'],
  ['命令输出', 'Command output'],
  ['命令执行结果', 'Command result'],
  ['搜索技能', 'Search skills'],
  ['技能结果', 'Skill results'],
  ['监控作业', 'Monitor job'],
  ['已拦截', 'Blocked'],
  ['禁止执行 rm 命令', 'The rm command is not allowed'],
  ['已保存', 'Saved'],
  ['正在读取技能正文…', 'Loading skill content…'],
  ['查看队列和节点资源', 'Inspect queues and node resources'],
  ['查看计算资源作业状态并分析资源使用', 'Inspect compute resource jobs and analyze resource usage'],
  ['对当前目录的 FASTQ 文件做质控分析', 'Run quality control on FASTQ files in the current directory'],
  ['用 BLAST 搜索同源序列', 'Search for homologous sequences with BLAST'],
  ['GO/KEGG 通路富集分析', 'GO/KEGG pathway enrichment analysis'],

  ['刷新', 'Refresh'],
  ['搜索对话...', 'Search conversations…'],
  ['加载失败', 'Load failed'],
  ['删除', 'Delete'],
  ['条消息', 'messages'],
  ['发送选中内容给 AI', 'Send selected text to AI'],
  ['发送给 AI', 'Send to AI'],
  ['AI 分析报错', 'Ask AI to analyze error'],
  ['分析报错', 'Analyze error'],
  ['Tab 补全', 'Tab to complete'],
  ['浏览', 'navigate'],
  ['Esc 关闭', 'Esc to close'],

  // 终端右键菜单与划词 AI 辅助小窗（“复制”“粘贴”复用文件传输已有条目）
  ['全选', 'Select All'],
  ['清屏', 'Clear Screen'],
  ['AI 辅助', 'AI Assist'],
  ['开启后划选内容会弹出解释与快捷操作', 'When on, selecting text shows explanations and quick actions'],
  ['检测到路径', 'Detected path'],
  ['疑似作业号', 'Possible job ID'],
  ['检测到报错信息', 'Error output detected'],
  ['已选中', 'Selected'],
  ['个字符', 'characters'],
  ['进入该目录', 'Enter directory'],
  ['查看内容', 'View contents'],
  ['解压', 'Extract'],
  ['查看作业', 'Check job'],
  ['查看输出', 'View output'],
  ['终止作业', 'Kill job'],
  ['发给 AI 解读', 'Send to AI to explain'],
  ['发给 AI 深度分析', 'Send to AI for deep analysis'],
  ['输入操作，回车立即执行…', 'Type an action, press Enter to run…'],
  ['立即执行', 'Run now'],
  ['已转交 AI', 'Handed off to AI'],

  ['返回', 'Back'],
  ['搜索流程或关键词...', 'Search workflows or keywords…'],
  ['AI 辅助生成流程', 'Generate workflow with AI'],
  ['AI 生成', 'AI Generate'],
  ['从论文 PDF 或 DOI 学习分析流程', 'Learn an analysis workflow from a paper PDF or DOI'],
  ['文献学习', 'Paper Learning'],
  ['新建流程', 'New Workflow'],
  ['描述你想要的分析流程，AI 帮你起草：', 'Describe the analysis workflow you need and AI will draft it:'],
  ['生成中...', 'Generating…'],
  ['生成草稿', 'Generate draft'],
  ['需要先在 AI 设置里配置 API Key', 'Configure an API key in AI Settings first'],
  ['学习', 'Learn'],
  ['上传 PDF', 'Upload PDF'],
  ['流程名称 *', 'Workflow name *'],
  ['一句话描述用途', 'One-sentence description'],
  ['触发关键词，用逗号分隔（如：转录组, rnaseq, 质控）', 'Trigger keywords separated by commas (for example: transcriptome, RNA-seq, QC)'],
  ['参数', 'Parameters'],
  ['参数名', 'Parameter name'],
  ['说明', 'Description'],
  ['默认值', 'Default value'],
  ['文本', 'Text'],
  ['数字', 'Number'],
  ['选项', 'Options'],
  ['开关', 'Toggle'],
  ['路径', 'Path'],
  ['必填', 'Required'],
  ['删除参数', 'Delete parameter'],
  ['环境与 QC 配置', 'Environment and QC configuration'],
  ['AI 与运行器共同使用', 'Used by both AI and the runner'],
  ['必要软件', 'Required software'],
  ['软件名', 'Software name'],
  ['必需', 'Required'],
  ['删除软件', 'Delete software'],
  ['参考数据', 'Reference data'],
  ['名称', 'Name'],
  ['基因组', 'Genome'],
  ['索引', 'Index'],
  ['注释', 'Annotation'],
  ['数据库', 'Database'],
  ['其他', 'Other'],
  ['删除参考数据', 'Delete reference'],
  ['QC 关卡', 'QC gates'],
  ['在哪一步之后检查', 'Check after step'],
  ['指标', 'Metric'],
  ['通过标准，如 >80%', 'Pass threshold, for example >80%'],
  ['警告标准', 'Warning threshold'],
  ['删除QC', 'Delete QC gate'],
  ['步骤（按执行顺序）', 'Steps (execution order)'],
  ['步骤标题 *', 'Step title *'],
  ['可选', 'Optional'],
  ['删除步骤', 'Delete step'],
  ['备注（可选）', 'Notes (optional)'],
  ['本步骤可调参数', 'Configurable parameters for this step'],
  ['删除步骤参数', 'Delete step parameter'],
  ['决策', 'Decision'],
  ['计算', 'Compute'],
  ['报告', 'Report'],
  ['高可信', 'High confidence'],
  ['中可信', 'Medium confidence'],
  ['低可信', 'Low confidence'],
  ['来源证据的短句转述', 'Short paraphrase of source evidence'],
  ['预期输入，每行一个', 'Expected inputs, one per line'],
  ['预期输出，每行一个', 'Expected outputs, one per line'],
  ['保存流程', 'Save workflow'],
  ['取消', 'Cancel'],
  ['编辑', 'Edit'],
  ['检查环境', 'Check environment'],
  ['让 AI 引导补齐缺失项', 'Let AI guide dependency setup'],
  ['补齐', 'Resolve'],
  ['环境就绪', 'Environment ready'],
  ['环境未就绪', 'Environment not ready'],
  ['有缺失', 'Missing items'],
  ['就绪', 'Ready'],
  ['无依赖', 'No dependencies'],
  ['最近运行：', 'Latest run:'],
  ['质控与结果', 'QC and results'],
  ['下载最近报告', 'Download latest report'],
  ['暂无报告', 'No report yet'],
  ['预检时间', 'Preflight time'],
  ['调度器', 'Scheduler'],
  ['尚未预检，点击"检查环境"核查软件与参考数据', 'Not checked yet. Click “Check environment” to verify software and references.'],
  ['文献流程审计', 'Paper workflow audit'],
  ['来源：', 'Source:'],
  ['主路径：', 'Primary path:'],
  ['待确认问题', 'Questions to confirm'],
  ['保存/运行前必须检查', 'Review before saving or running'],
  ['未归属流程的运行', 'Unassigned runs'],
  ['任务记录', 'Run history'],
  ['查看资源和', 'View resources and'],
  ['个详细步骤', 'detailed steps'],

  // 流程分类（面板分组/筛选/编辑器）
  ['基因组与变异分析', 'Genomics & Variant Analysis'],
  ['转录组与表观调控', 'Transcriptomics & Epigenetics'],
  ['单细胞与免疫分析', 'Single-cell & Immune Analysis'],
  ['蛋白代谢与多组学', 'Proteomics, Metabolomics & Multi-omics'],
  ['微生物与病原分析', 'Microbiome & Pathogen Analysis'],
  ['基因编辑与 CRISPR', 'Gene Editing & CRISPR'],
  ['任务管理与通用工具', 'Job Management & Utilities'],
  ['全部分类', 'All categories'],
  ['未分类', 'Uncategorized'],
  ['自定义分类…', 'Custom category…'],
  ['自定义分类名', 'Custom category name'],
  ['按分类筛选', 'Filter by category'],
  ['流程分类', 'Workflow category'],

  ['专属工作目录', 'Dedicated workspace'],
  ['强制隔离', 'Strict isolation'],
  ['每次运行创建独立 RUN 文件夹，并预生成 code/step-NN.sh。用户可按步骤查看修改，AI 只能在当前 RUN 内工作。', 'Each run gets an isolated RUN folder with pre-generated code/step-NN.sh files. Users can review and edit each step, and AI is restricted to the current RUN.'],
  ['按需环境检查', 'On-demand environment checks'],
  ['SSH 只读核查全部软件与参考数据', 'Read-only SSH check of all software and reference data'],
  ['全部检查', 'Check all'],
  ['正在读取上次检查结果…', 'Loading previous check results…'],
  ['尚未检查过，点击"全部检查"或逐项校验', 'Not checked yet. Click “Check all” or verify individual items.'],
  ['管线文件', 'Pipeline files'],
  ['部署管线文件', 'Deploy pipeline files'],
  ['数据选择', 'Data selection'],
  ['移除', 'Remove'],
  ['选择文件夹', 'Choose folder'],
  ['或手动输入计算资源路径后回车', 'Or enter a compute resource path and press Enter'],
  ['全局参数', 'Global parameters'],
  ['步骤与高级设置', 'Steps and advanced settings'],
  ['运行前确认', 'Pre-run confirmation'],
  ['本次执行', 'This run'],
  ['来源：', 'Source:'],
  ['依据：', 'Evidence:'],
  ['输入：', 'Input:'],
  ['预期输出：', 'Expected output:'],
  ['高级：覆盖本次运行命令', 'Advanced: override command for this run'],
  ['保存配置', 'Save configuration'],
  ['载入配置', 'Load configuration'],
  ['恢复默认', 'Restore defaults'],
  ['任务监控', 'Run Monitor'],
  ['点击"运行流程"发起第一次任务', 'Click “Run workflow” to start the first run'],
  ['选择文件', 'Choose file'],
  ['安装部署', 'Install'],
  ['校验', 'Verify'],
  ['工作目录：', 'Working directory:'],
  ['运行代码：', 'Run code:'],
  ['查看/修改代码', 'View/edit code'],
  ['查看日志', 'View logs'],
  ['查看报告', 'View report'],
  ['在侧边打开', 'Open in side panel'],
  ['在侧边预览', 'Preview in side panel'],
  ['在浏览器中打开', 'Open in browser'],
  ['网页加载失败', 'Page failed to load'],
  ['网页预览', 'Page preview'],
  ['展开网页预览', 'Expand page preview'],
  ['收起网页预览', 'Collapse page preview'],
  ['交互页面', 'Interactive page'],
  ['渲染为交互页面', 'Render as interactive page'],
  ['部分网站禁止内嵌，可在侧边栏或浏览器打开', 'Some sites block embedding; open in the side panel or a browser instead'],
  ['检测到的文件', 'Detected files'],
  ['下载文件', 'Download file'],
  ['点击放大', 'Click to enlarge'],
  ['表格预览', 'Table preview'],
  ['读取失败，可打开目录查看原文件', 'Failed to read; open the folder to view the original file'],
  ['隔离预览', 'Isolated preview'],
  ['外部网络资源已禁用', 'external network resources are disabled'],
  ['启用交互内容', 'Enable interactive content'],
  ['关闭网页脚本', 'Disable page scripts'],
  ['本次运行代码（按步骤）', 'Run code by step'],
  ['关闭代码编辑器', 'Close code editor'],
  ['步骤', 'Step'],
  ['未保存', 'Unsaved'],
  ['保存脚本', 'Save script'],
  ['步骤运行脚本', 'Step run script'],
  ['自动刷新', 'Auto refresh'],
  ['日志来源：', 'Log source:'],
  ['下载', 'Download'],
  ['分析报告', 'Analysis report'],
  ['运行流程', 'Run workflow'],
  ['正在创建正式运行…', 'Creating formal run…'],
  ['正在读取脚本…', 'Loading script…'],
  ['后台监控', 'Background monitoring'],
  ['运行中', 'Running'],
  ['已完成', 'Completed'],
  ['已取消', 'Cancelled'],
  ['失败', 'Failed'],
  ['等待确认', 'Waiting for confirmation'],
  ['疑似中断', 'Possibly interrupted'],
  ['重连中', 'Reconnecting'],
  ['尚未运行', 'Not run yet'],
  ['未检查', 'Not checked'],
  ['部分未检查', 'Partially checked'],
  ['已就绪', 'Ready'],
  ['未知', 'Unknown'],
  ['软件', 'Software'],

  ['路径导航', 'Path navigation'],
  ['此电脑', 'This PC'],
  ['上级目录', 'Parent directory'],
  ['输入路径后按回车跳转...', 'Enter a path and press Enter…'],
  ['新建文件夹', 'New folder'],
  ['新建文件', 'New file'],
  ['文件夹名称', 'Folder name'],
  ['文件名称', 'File name'],
  ['名称', 'Name'],
  ['大小', 'Size'],
  ['修改日期', 'Modified'],
  ['权限', 'Permissions'],
  ['拖动调整列宽；双击恢复默认宽度', 'Drag to resize; double-click to restore the default width'],
  ['此目录为空', 'This folder is empty'],
  ['拖拽文件到另一侧面板即可传输', 'Drag files to the other pane to transfer them'],
  ['重命名', 'Rename'],
  ['复制', 'Copy'],
  ['剪切', 'Cut'],
  ['粘贴', 'Paste'],
  ['复制路径', 'Copy path'],
  ['打开', 'Open'],
  ['打开并编辑', 'Open and edit'],
  ['粘贴到此目录', 'Paste into this folder'],
  ['请先复制或剪切文件', 'Copy or cut files first'],
  ['预览', 'Preview'],
  ['上传到远程', 'Upload to remote'],
  ['下载到本地', 'Download to local'],
  ['确认删除', 'Confirm deletion'],
  ['确定要删除', 'Delete'],
  ['个项目吗？', 'item(s)?'],
  ['包括子目录', 'including subfolders'],
  ['文件冲突', 'File conflict'],
  ['源文件:', 'Source file:'],
  ['目标文件:', 'Target file:'],
  ['已有文件大小:', 'Existing file size:'],
  ['已有文件修改时间:', 'Existing file modified:'],
  ['覆盖', 'Overwrite'],
  ['跳过', 'Skip'],
  ['续传', 'Resume'],
  ['保存', 'Save'],
  ['关闭预览', 'Close preview'],
  ['保存成功', 'Saved successfully'],
  ['保存失败：', 'Save failed:'],
  ['搜索', 'Search'],
  ['同步', 'Sync'],
  ['远程编辑会话', 'Remote edit sessions'],
  ['重试上传', 'Retry upload'],
  ['重试打开', 'Retry opening'],
  ['打开本地副本', 'Open local copy'],
  ['数据目录：', 'Data directory:'],
  ['选择选中项', 'Use selected item'],
  ['使用当前浏览的文件夹', 'Use current folder'],
  ['选择此文件夹', 'Choose this folder'],
  ['选择文件或目录：', 'Choose file or folder:'],
  ['选择文件或目录', 'Choose file or folder'],
  ['选择文件：', 'Choose file:'],
  ['选择目录：', 'Choose folder:'],
  ['选择目录', 'Choose folder'],
  ['选择选中的文件', 'Use selected file'],
  ['选择此文件', 'Choose this file'],
  ['选择此目录', 'Choose this folder'],
  ['请选择一个文件', 'Choose a file'],
  ['请选择文件或目录', 'Choose a file or folder'],
  ['请选择一个目录', 'Choose a folder'],
  ['在列表中单击选中一个文件或文件夹', 'Click a file or folder in the list to select it'],
  ['在列表中单击选中一个文件', 'Click a file in the list to select it'],
  ['在列表中选中一个文件夹（Ctrl+单击）', 'Select a folder in the list (Ctrl+click)'],
  ['选中的是文件夹，请改选一个文件', 'A folder is selected; choose a file instead'],
  ['选中的是文件，请改选一个文件夹（Ctrl+单击）', 'A file is selected; Ctrl+click a folder instead'],
  ['选中项不在当前目录列表中，请重新选择', 'The selection is outside the current folder; select again'],
  ['使用选中的文件或文件夹', 'Use the selected file or folder'],
  ['打开计算资源文件树选择文件或目录', 'Open the compute resource file tree to choose a file or folder'],
  ['正在下载', 'Downloading'],
  ['正在同步', 'Syncing'],
  ['正在打开', 'Opening'],
  ['打开失败', 'Failed to open'],
  ['同步失败', 'Sync failed'],
  ['编辑中', 'Editing'],
  ['已同步', 'Synced'],
  ['有修改', 'Modified'],
  ['本地目录', 'Local folder'],
  ['远程目录', 'Remote folder'],
  ['搜索文件', 'Search files'],
  ['输入搜索关键词...', 'Enter search terms…'],
  ['搜索中...', 'Searching…'],
  ['未找到匹配文件', 'No matching files'],
  ['同步规划器', 'Sync Planner'],
  ['删除目标目录中多余的文件', 'Delete extra files in the destination'],
  ['比较中...', 'Comparing…'],
  ['上传', 'Upload'],
  ['冲突', 'Conflict'],
  ['操作列表：', 'Operations:'],
  ['应用同步', 'Apply sync'],
  ['确认同步', 'Confirm sync'],
  ['确认执行', 'Confirm operation'],
  ['暂停', 'Pause'],
  ['传输队列', 'Transfer queue'],
  ['个任务', 'tasks'],
  ['清除已完成', 'Clear completed'],
  ['无传输任务', 'No transfer tasks'],
  ['桌面应用模式下可用', 'Available in desktop app mode'],
  ['连接中...', 'Connecting…'],
  ['主机配置', 'Host profiles'],
  ['暂无已保存的主机配置', 'No saved host profiles'],
  ['缩小', 'Zoom out'],
  ['放大', 'Zoom in'],
  ['适应窗口', 'Fit to window'],
  ['工作簿为空', 'Workbook is empty'],
  ['工作表', 'Worksheet'],
  ['上一页', 'Previous page'],
  ['下一页', 'Next page'],

  ['调度器', 'Scheduler'],
  ['完成时提醒我', 'Notify me when complete'],
  ['提醒已关闭', 'Notifications off'],
  ['通知渠道', 'Notification channel'],
  ['测试发送', 'Send test'],
  ['没有在跑或排队的作业', 'No running or queued jobs'],
  ['我的进程', 'My processes'],
  ['没有正在运行的进程', 'No running processes'],
  ['完成事件', 'Completion events'],
  ['暂无完成的作业', 'No completed jobs'],
  ['已提醒', 'Notified'],
  ['提醒失败', 'Notification failed'],
  ['通知设置', 'Notification settings'],
  ['作业完成', 'Job finished'],
  ['作业异常结束', 'Job failed'],
  ['AI 已继续处理作业', 'AI resumed processing job'],
  ['等待作业完成后返回', 'Wait for the job to finish and return'],
  ['无输出摘要', 'No output excerpt'],
  ['可在通知设置里配置飞书/邮件推送作业完成消息', 'Configure Feishu/email push for job completion in notification settings'],
  ['收起', 'Collapse'],
  ['测试消息已发送，请查收', 'Test message sent'],
  ['网络错误', 'Network error'],
  ['邮箱账号', 'Email account'],
  ['授权码（非登录密码）', 'App password (not the login password)'],
  ['收件人', 'Recipient'],
  ['保存并重启机器人', 'Save and restart bot'],
  ['运行中', 'Running'],
  ['未启动', 'Stopped'],

  // 对话内流程卡片与流程管理入口
  ['流程配置', 'Workflow configuration'],
  ['在流程页打开', 'Open in workflow page'],
  ['确认运行', 'Confirm and run'],
  ['已发起运行', 'Run started'],
  ['已创建正式运行，执行进度见下方流程运行卡。', 'Formal run created. Track progress in the run card below.'],
  ['当前未连接计算资源，连接后即可从卡片直接运行。', 'No compute resource connected. Connect a compute resource to run directly from this card.'],
  ['本流程还有步骤级必填参数，建议在流程页完成完整配置后再运行。', 'This workflow still has required step-level parameters. Finish the full configuration on the workflow page before running.'],
  ['正在读取流程定义…', 'Loading workflow definition…'],
  ['正在读取运行状态…', 'Loading run status…'],
  ['可能已被删除', 'may have been deleted'],
  ['参数配置', 'Parameters'],
  ['个步骤', 'steps'],
  ['正式流程运行', 'Formal workflow run'],
  ['实时', 'Live'],
  ['未连接计算资源，无法读取该运行的实时状态。', 'No compute resource connected; live run status is unavailable.'],
  ['未找到该运行的最新状态（可能已被清理）。', 'No up-to-date status for this run (it may have been cleaned up).'],
  ['打开目录', 'Open folder'],
  ['执行环境', 'Runtime environment'],
  ['必要参考数据', 'Required reference data'],
  ['本流程无软件与参考数据依赖', 'This workflow has no software or reference data dependencies'],
  ['输出结果', 'Outputs'],
  ['个产物', 'artifacts'],
  ['在文件传输工作区打开所在目录', 'Open the containing folder in the file transfer workspace'],
  ['流程定义缺失，无法续跑', 'Workflow definition missing; cannot resume'],
  ['继续流程失败，请刷新状态后重试', 'Failed to resume the workflow. Refresh and try again.'],
  ['已部署', 'Deployed'],
  ['管理流程（新建/编辑/AI 生成/文献学习）', 'Manage workflows (create/edit/AI draft/paper learning)'],
  ['管理流程', 'Manage workflows'],
  ['流程管理', 'Workflow management'],
  ['新建、编辑、AI 生成与文献学习正式流程', 'Create, edit, AI-draft and paper-learn formal workflows'],
  ['返回对话', 'Back to chat'],
  ['浏览流程', 'Browse workflows'],
  ['打开运行文件夹', 'Open run folder'],
  ['从断点继续', 'Resume from breakpoint'],
  ['选择计算资源上要处理的数据目录', 'Choose the data folder on the compute resource'],
  ['请先选择要处理的数据目录', 'Choose the data folder to process first'],
  ['配置并运行', 'Configure and run'],
  // 计算资源导航与登录（“集群”改名“计算资源”后新增的界面短语）
  ['对话', 'Chat'],
  ['文件', 'Files'],
  ['计算目标', 'Compute targets'],
  ['本地 AI 工作台', 'Local AI workbench'],
  ['无需服务器，可本地分析', 'No server needed; local analysis available'],
  ['没有计算资源也能用：本地 AI 可完成分析与对话', 'No compute resource needed: the local AI can handle analysis and conversation'],
  ['本地 AI · 未使用计算资源', 'Local AI · no compute resource in use'],
  ['打开计算资源', 'Open compute resources'],
  // 顶部导航栏与侧栏标题（导航上移后新增的界面短语）
  ['新任务', 'New Task'],
  ['主题', 'Theme'],
  ['切换主题', 'Toggle Theme'],
  ['QQ 机器人', 'QQ Bot'],
  ['软件更新', 'Software Update'],
  ['AI 计算资源执行', 'AI compute resource execution'],
  ['对话始终保留在工作台；开启后，AI 才会把计算命令发送到当前计算资源。', 'The conversation always stays in the workbench; when enabled, AI sends compute commands to the current compute resource.'],
  ['断开计算资源', 'Disconnect compute resource'],
  ['同步到计算资源', 'Sync to compute resource'],
  ['从计算资源导入', 'Import from compute resource'],
  ['导入失败', 'Import failed'],
  ['示例：富文本结果展示', 'Demo: Rich Content Showcase'],
  ['关闭计算资源登录', 'Close compute resource login'],
  ['添加为 AI 的后台计算目标', 'Add as a compute target for AI'],
  ['计算资源文件', 'Compute resource files'],
  ['连接计算资源后，这里会显示远程文件树。', 'Connect a compute resource and the remote file tree will appear here.'],
  ['需要先连接计算资源', 'Connect a compute resource first'],
  ['需要先连接计算资源会话', 'Connect a compute resource session first'],
  ['把内置管线文件上传到计算资源流程家目录 01_software/', 'Upload built-in pipeline files to the compute resource workflow home 01_software/'],
  ['若提示会话问题：请确认计算资源连接未断开。', 'If you see session errors: make sure the compute resource connection is still active.'],
  ['SSH 主连接已断开，请重新登录计算资源', 'The main SSH connection is disconnected; please log in to the compute resource again'],
  ['已经提交到计算资源的作业不会因此停止。', 'Jobs already submitted to the compute resource will not stop.'],
  ['下载到本机后使用默认软件打开；保存后会同步回计算资源', 'Download to this device and open with the default app; changes sync back to the compute resource after saving'],
  ['计算资源提交命令', 'Compute resource submit command'],
  ['（选填）', '(optional)'],
  ['服务器无二次验证可留空', 'Leave empty if the server has no two-factor verification'],
  ['该账号未保存 TOTP 秘钥；若服务器要求动态验证码，请手动输入或点齿轮配置', 'No TOTP secret saved for this account; if the server requires a dynamic verification code, enter it manually or click the gear to configure one'],

  // 网络数据资源页（公共生信数据库 API 目录与连通性测试）
  ['数据资源', 'Data Resources'],
  ['网络数据资源', 'Web Data Resources'],
  ['这些公开生信数据库的 API 已被 Agent 集成，提问即可调用；这里可浏览接口并手动测试连通性', 'These public bioinformatics database APIs are integrated into the Agent—just ask to use them. Browse endpoints and test connectivity here.'],
  ['已集成公开生信数据库的 API，对话中提问即可调用；主区域可浏览接口、测试连通性', 'Public bioinformatics database APIs are integrated—call them by asking in chat. Browse endpoints and test connectivity in the main area.'],
  ['搜索数据资源...', 'Search data resources…'],
  ['按类别筛选', 'Filter by category'],
  ['全部', 'All'],
  ['全部测试', 'Test all'],
  ['测试中...', 'Testing…'],
  ['正在测试全部服务连通性（约 20–60 秒）…', 'Testing connectivity of all services (about 20–60s)…'],
  ['测试完成：', 'Test finished: '],
  ['个可用', 'available'],
  ['全量测试失败：', 'Full test failed: '],
  ['没有匹配的数据资源', 'No matching data resources'],
  ['目录加载失败：', 'Failed to load catalog: '],
  ['可用', 'Available'],
  ['不可用', 'Unavailable'],
  ['未测试', 'Not tested'],
  ['未测试或结果已过期', 'Not tested or result expired'],
  ['主页', 'Homepage'],
  ['文档', 'Docs'],
  ['端点', 'Endpoints'],
  ['正在加载端点参数…', 'Loading endpoint parameters…'],
  ['端点详情加载失败：', 'Failed to load endpoint details: '],
  ['试一下', 'Try it'],
  ['调用中...', 'Invoking…'],
  ['参数：', 'Parameters: '],
  ['后端已截断', 'Truncated by backend'],
  ['基因与基因组', 'Genes & Genomes'],
  ['蛋白与结构', 'Proteins & Structures'],
  ['通路与互作', 'Pathways & Interactions'],
  ['化合物与药物', 'Compounds & Drugs'],
  ['变异与临床', 'Variants & Clinical'],
  ['表达与单细胞', 'Expression & Single-cell'],
  ['文献与检索', 'Literature & Search'],
  ['物种与分类', 'Species & Taxonomy'],
  ['植物', 'Plants'],
  ['微生物与宏基因组', 'Microbes & Metagenomics'],
];

const ZH_TO_EN = new Map<string, string>();
const EN_TO_ZH = new Map<string, string>();
for (const [zh, en] of UI_PHRASES) {
  if (!ZH_TO_EN.has(zh)) ZH_TO_EN.set(zh, en);
  if (!EN_TO_ZH.has(en)) EN_TO_ZH.set(en, zh);
}

const SORTED_ZH = [...ZH_TO_EN.keys()].sort((a, b) => b.length - a.length);
const SORTED_EN = [...EN_TO_ZH.keys()].sort((a, b) => b.length - a.length);

export function getStoredLocale(): AppLocale {
  if (typeof window === 'undefined') return 'zh-CN';
  return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) === 'en-US' ? 'en-US' : 'zh-CN';
}

// 译文缓存：key 为 "locale 原文"，value 为译文，未命中短语表时缓存原文本身（负缓存）。
// ZH_TO_EN / EN_TO_ZH 是静态表，key 已带 locale，因此切换语言无需清空；
// 仅设容量上限，防止 AI 流式输出等高频新文本把缓存撑爆。
const TRANSLATE_CACHE = new Map<string, string>();
const TRANSLATE_CACHE_LIMIT = 10000;

export function translateUiText(value: string, locale: AppLocale): string {
  if (!value || !value.trim()) return value;
  const cacheKey = `${locale} ${value}`;
  const cached = TRANSLATE_CACHE.get(cacheKey);
  if (cached !== undefined) return cached;
  const result = translateUiTextUncached(value, locale);
  if (TRANSLATE_CACHE.size >= TRANSLATE_CACHE_LIMIT) TRANSLATE_CACHE.clear();
  TRANSLATE_CACHE.set(cacheKey, result);
  return result;
}

function translateUiTextUncached(value: string, locale: AppLocale): string {
  const leading = value.match(/^\s*/)?.[0] || '';
  const trailing = value.match(/\s*$/)?.[0] || '';
  const core = value.slice(leading.length, value.length - trailing.length || undefined);
  const exact = (locale === 'en-US' ? ZH_TO_EN : EN_TO_ZH).get(core);
  if (exact !== undefined) return `${leading}${exact}${trailing}`;

  let translated = core;
  const keys = locale === 'en-US' ? SORTED_ZH : SORTED_EN;
  const phrases = locale === 'en-US' ? ZH_TO_EN : EN_TO_ZH;
  for (const key of keys) {
    if (key.length < 2 || !translated.includes(key)) continue;
    translated = translated.split(key).join(phrases.get(key) || key);
  }
  return `${leading}${translated}${trailing}`;
}

interface LocaleContextValue {
  locale: AppLocale;
  isEnglish: boolean;
  setLocale: (locale: AppLocale) => void;
  toggleLocale: () => void;
  t: (value: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function shouldSkipNode(node: Node): boolean {
  const element = node instanceof Element ? node : node.parentElement;
  if (!element) return false;
  return Boolean(element.closest(
    'script, style, code, pre, textarea, .xterm, [data-i18n-skip="true"], [data-user-content="true"]',
  ));
}

function localizeElement(root: ParentNode, locale: AppLocale): void {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();
  while (current) {
    if (!shouldSkipNode(current) && current.nodeValue) {
      const next = translateUiText(current.nodeValue, locale);
      if (next !== current.nodeValue) current.nodeValue = next;
    }
    current = walker.nextNode();
  }

  const elements: Element[] = [];
  if (root instanceof Element) elements.push(root);
  elements.push(...Array.from(root.querySelectorAll('*')));
  for (const element of elements) {
    if (shouldSkipNode(element)) continue;
    for (const attribute of ['title', 'aria-label', 'placeholder']) {
      const value = element.getAttribute(attribute);
      if (!value) continue;
      const next = translateUiText(value, locale);
      if (next !== value) element.setAttribute(attribute, next);
    }
  }
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>(getStoredLocale);

  const setLocale = useCallback((next: AppLocale) => {
    setLocaleState(next === 'en-US' ? 'en-US' : 'zh-CN');
  }, []);
  const toggleLocale = useCallback(() => {
    setLocaleState(current => current === 'zh-CN' ? 'en-US' : 'zh-CN');
  }, []);
  const t = useCallback((value: string) => translateUiText(value, locale), [locale]);

  useLayoutEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dataset.language = locale;
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
    localizeElement(document.body, locale);

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === 'characterData') {
          const node = record.target;
          if (!shouldSkipNode(node) && node.nodeValue) {
            const next = translateUiText(node.nodeValue, locale);
            if (next !== node.nodeValue) node.nodeValue = next;
          }
          continue;
        }
        if (record.type === 'attributes') {
          // 属性（如动态更新的 placeholder）变化时即时翻译，避免切英文后回退成中文。
          // 写回 setAttribute 会再次触发本 observer，靠"翻译后无变化则不写"自然终止。
          const attribute = record.attributeName;
          const element = record.target;
          if (!(element instanceof Element) || !attribute || shouldSkipNode(element)) continue;
          const value = element.getAttribute(attribute);
          if (!value) continue;
          const next = translateUiText(value, locale);
          if (next !== value) element.setAttribute(attribute, next);
          continue;
        }
        for (const node of Array.from(record.addedNodes)) {
          if (node instanceof Element || node instanceof DocumentFragment) {
            // 自身或祖先命中跳过选择器（终端、代码块、用户内容等）时，整棵子树不再遍历翻译
            if (node instanceof Element && shouldSkipNode(node)) continue;
            localizeElement(node, locale);
          } else if (node.nodeType === Node.TEXT_NODE && !shouldSkipNode(node) && node.nodeValue) {
            node.nodeValue = translateUiText(node.nodeValue, locale);
          }
        }
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['title', 'aria-label', 'placeholder'],
    });
    return () => observer.disconnect();
  }, [locale]);

  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    isEnglish: locale === 'en-US',
    setLocale,
    toggleLocale,
    t,
  }), [locale, setLocale, toggleLocale, t]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useI18n must be used inside LocaleProvider');
  return context;
}

export function LanguageToggle({ floating = false }: { floating?: boolean }) {
  const { isEnglish, toggleLocale } = useI18n();
  const label = isEnglish ? '切换到中文' : 'Switch to English';
  return (
    <button
      type="button"
      className={`language-toggle ${floating ? 'language-toggle-floating' : ''}`}
      onClick={toggleLocale}
      title={label}
      aria-label={label}
      data-i18n-skip="true"
    >
      <Languages className="w-4 h-4" />
      <span>{isEnglish ? '中文' : 'EN'}</span>
    </button>
  );
}
