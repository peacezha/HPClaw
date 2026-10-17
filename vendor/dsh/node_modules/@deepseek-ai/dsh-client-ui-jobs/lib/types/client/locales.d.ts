/** `job` namespace dictionaries. */
/** Dictionary namespace owned by this plugin. */
export declare const NS = "job";
/** Simplified Chinese dictionary (the key-set source of truth). */
export declare const zh: {
    readonly 'count.live.one': "{count} 个后台任务运行中";
    readonly 'count.live.other': "{count} 个后台任务运行中";
    readonly 'count.idle.one': "{count} 个后台任务";
    readonly 'count.idle.other': "{count} 个后台任务";
    readonly 'list.aria': "后台任务";
    readonly 'section.live': "进行中";
    readonly 'section.settledCount': "已结束 {count}";
    readonly 'section.clear': "清空";
    readonly 'row.expandAria': "展开 {label} 的实时输出";
    readonly 'row.collapseAria': "收起 {label} 的实时输出";
    readonly 'kill.stop': "停止任务 {label}";
    readonly 'kill.confirm': "再次点击确认停止";
    readonly 'kill.confirmAction': "确认停止";
    readonly 'kill.failed': "停止失败";
    readonly 'status.running': "运行中";
    readonly 'status.stopping': "正在停止";
    readonly 'status.completed': "已完成";
    readonly 'status.killed': "已取消";
    readonly 'status.failed': "已失败";
    readonly 'duration.seconds': "{seconds}秒";
    readonly 'duration.minutes': "{minutes}分{seconds}秒";
    readonly 'duration.hours': "{hours}小时{minutes}分";
    readonly 'duration.title.live': "已运行 {duration}";
    readonly 'duration.title.done': "耗时 {duration}";
    readonly 'output.gap': "……较早的输出已丢弃……";
    readonly 'output.error': "实时输出流中断：{error}";
    readonly 'terminal.signal': "信号 {signal}";
    readonly 'terminal.exitCode': "退出码 {code}";
    readonly 'terminal.noExitCode': "未正常退出";
    readonly 'terminal.commandLine': "命令第 {n} 行";
    readonly 'terminal.running': "运行中";
    readonly 'terminal.failed': "已失败";
    readonly 'terminal.done': "已完成";
    readonly 'terminal.copy': "复制";
    readonly 'terminal.copied': "已复制";
    readonly 'terminal.noOutput': "（无输出）";
    readonly 'terminal.collapse': "收起";
    readonly 'terminal.collapseAria': "收起输出";
    readonly 'terminal.expand': "展开其余 {n} 行";
    readonly 'terminal.expandAria': "展开被折叠的 {n} 行输出";
};
/** English dictionary, key-identical to the Chinese source of truth. */
export declare const en: Record<JobKey, string>;
/** Key domain of the `job` namespace (zh is the source of truth). */
export type JobKey = keyof typeof zh;
//# sourceMappingURL=locales.d.ts.map