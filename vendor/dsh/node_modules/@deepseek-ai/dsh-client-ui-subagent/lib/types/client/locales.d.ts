/** `subagent` namespace dictionaries. */
/** Dictionary namespace owned by this plugin. */
export declare const NS = "subagent";
/** Simplified Chinese dictionary (the key-set source of truth). */
export declare const zh: {
    readonly 'duration.seconds': "{seconds}秒";
    readonly 'duration.minutes': "{minutes}分{seconds}秒";
    readonly 'duration.hours': "{hours}小时{minutes}分{seconds}秒";
    readonly 'duration.days': "{days}天";
    readonly 'duration.daysHours': "{days}天{hours}小时";
    readonly 'duration.months': "约{months}个月";
    readonly 'duration.monthsDays': "约{months}个月{days}天";
    readonly 'duration.years': "约{years}年";
    readonly 'duration.yearsMonths': "约{years}年{months}个月";
    readonly 'duration.exactDays': "{days}天{hours}小时{minutes}分{seconds}秒";
    readonly 'duration.exactTitle': "总活跃耗时：{duration}";
    readonly 'tokens.thousand': "{value}K";
    readonly 'tokens.million': "{value}M";
    readonly 'tokens.total': "{value} tok";
    readonly 'loading.label': "正在加载子智能体…";
    readonly 'load.error': "无法加载子智能体";
    readonly 'catalog.migrationRequired': "需要迁移";
    readonly retry: "重试";
    readonly 'mode.external': "外部任务";
    readonly 'mode.oneShot': "一次性";
    readonly 'mode.continuable': "可继续";
    readonly 'mode.unknown': "模式未知";
    readonly 'readonly.unknown.body': "读取子会话后才能确定是否可继续。";
    readonly 'activity.running': "正在运行";
    readonly 'activity.completed': "已完成";
    readonly 'activity.inactive': "当前未运行";
    readonly 'branch.collapse': "收起 {label} 的下级子智能体";
    readonly 'branch.expand': "展开 {label} 的下级子智能体";
    readonly 'count.total.one': "{count} 个子智能体";
    readonly 'count.total.other': "{count} 个子智能体";
    readonly 'count.running.one': "{count} 个子智能体，正在运行";
    readonly 'count.running.other': "{count} 个子智能体，正在运行";
    readonly 'switcher.aria': "切换子智能体：{title}";
    readonly 'tree.aria': "子智能体会话";
    readonly 'open.sidebar': "在侧边栏打开";
    readonly 'open.sidebar.aria': "在侧边栏打开 {label}";
    readonly 'sidebar.chat': "聊天";
    readonly 'readonly.oneShot.title': "一次性子智能体记录";
    readonly 'readonly.title': "此子智能体暂时只读";
    readonly 'readonly.oneShot.body': "一次性任务不支持后续消息，可在这里查看完整执行记录。";
    readonly 'readonly.body': "父会话当前不在线，重新打开父会话后即可继续发送消息。";
};
/** English dictionary, key-identical to the Chinese source of truth. */
export declare const en: Record<SubagentKey, string>;
/** Key domain of the `subagent` namespace (zh is the source of truth). */
export type SubagentKey = keyof typeof zh;
//# sourceMappingURL=locales.d.ts.map