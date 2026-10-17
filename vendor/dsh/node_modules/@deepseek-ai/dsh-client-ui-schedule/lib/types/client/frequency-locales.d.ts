/**
 * Stored-rule and elapsed-duration copy shared by the `schedule.catalog` and
 * `schedule.manager` namespaces.
 *
 * Both namespaces label the same stored rule kinds, describe cron rules with
 * the same `cronPreview` sentence, and word the same relative durations, so
 * their wording for those keys is one source here. The keys either namespace
 * words differently — its one-shot label, its list states, and its own delete
 * and timing copy — stay in that namespace's dictionary.
 * @module
 */
/** Simplified Chinese rule and duration copy, key-set source of truth. */
export declare const frequencyZh: {
    readonly 'time.locale': "zh-CN";
    readonly 'time.utcPrefix': "UTC";
    readonly 'frequency.daily': "每天 {time}（{timeZone}）";
    readonly 'frequency.dailyLocal': "每天 {time}";
    readonly 'frequency.weekly': "每周{weekdays} {time}（{timeZone}）";
    readonly 'frequency.weeklyLocal': "每周{weekdays} {time}";
    readonly 'frequency.cron': "Cron {expression}（{timeZone}）";
    readonly 'frequency.cronLocal': "Cron {expression}";
    readonly 'frequency.cronRule': "{rule}（{timeZone}）";
    readonly 'cron.list.join': "、";
    readonly 'cron.part.join': " ";
    readonly 'cron.weekday.name': "周{weekday}";
    readonly 'cron.weekday.range': "{from}至{to}";
    readonly 'cron.months': "（{months}）";
    readonly 'cron.day.every': "每天{months}";
    readonly 'cron.day.weekdays': "{weekdays}{months}";
    readonly 'cron.day.monthDays': "每月 {days} 日{months}";
    readonly 'cron.day.both': "每月 {days} 日或{weekdays}{months}";
    readonly 'cron.day.bothStarred': "每月 {days} 日且{weekdays}{months}";
    readonly 'cron.hours.range': "{from} 至 {to}";
    readonly 'cron.hours.list': "{hours}";
    readonly 'cron.time.everyMinute': "每分钟";
    readonly 'cron.time.everyMinutes': "每 {step} 分钟";
    readonly 'cron.time.joinedEveryMinute': "每分钟";
    readonly 'cron.time.joinedEveryMinutes': "每 {step} 分钟";
    readonly 'cron.time.everyHour': "每小时";
    readonly 'cron.time.joinedEveryHour': "每小时";
    readonly 'cron.time.everyNHours': "每 {count} 小时";
    readonly 'cron.time.joinedEveryNHours': "每 {count} 小时";
    readonly 'cron.time.hourlyAt': "每小时的第 {minutes} 分钟";
    readonly 'cron.time.joinedHourlyAt': "每小时的第 {minutes} 分钟";
    readonly 'cron.time.hoursEveryMinute': "{hours} 点的每分钟";
    readonly 'cron.time.hoursEveryMinutes': "{hours} 点内每 {step} 分钟";
    readonly 'cron.time.at': "{times}";
    readonly 'cron.time.hoursAt': "{hours} 点的第 {minutes} 分钟";
    readonly 'frequency.weekday.join': "、";
    readonly 'frequency.weekday.1': "一";
    readonly 'frequency.weekday.2': "二";
    readonly 'frequency.weekday.3': "三";
    readonly 'frequency.weekday.4': "四";
    readonly 'frequency.weekday.5': "五";
    readonly 'frequency.weekday.6': "六";
    readonly 'frequency.weekday.7': "日";
    readonly 'unit.day.one': "天";
    readonly 'unit.day.other': "天";
    readonly 'unit.hour.one': "小时";
    readonly 'unit.hour.other': "小时";
    readonly 'unit.minute.one': "分钟";
    readonly 'unit.minute.other': "分钟";
    readonly 'unit.second.one': "秒";
    readonly 'unit.second.other': "秒";
    readonly 'relative.now': "现在到期";
    readonly 'relative.future': "{value}{unit}后";
    readonly 'relative.overdue': "已逾期 {value}{unit}";
};
/** English rule and duration copy, key-identical to the Chinese source. */
export declare const frequencyEn: Record<keyof typeof frequencyZh, string>;
//# sourceMappingURL=frequency-locales.d.ts.map