/** Session Inspector tab, table controls, and object navigation labels. */
/** Namespace owned by the Session Inspector plugin. */
export declare const NS = "session-inspector";
/** Simplified Chinese labels and dictionary keys. */
export declare const zh: {
    readonly 'tab.title': "会话数据诊断";
    readonly 'tab.description': "在侧边栏分析当前会话原始日志和聊天分组数据";
    readonly 'view.presentation': "展示形式";
    readonly 'view.sessionLog': "原始数据";
    readonly 'view.chatNode': "对话分组";
    readonly 'picker.pick': "在对话面板中选取元素";
    readonly 'picker.cancel': "取消选取 (Esc)";
    readonly 'picker.instructions': "在左侧 Chat 中悬停预览，点击选取；Esc 取消。";
    readonly 'picker.noMatch': "当前表格没有匹配记录，请选择其他元素或按 Esc 取消。";
    readonly 'picker.noChat': "请先在主区域打开当前 Session 的 Chat。";
    readonly 'table.id': "序号";
    readonly 'table.type': "类型";
    readonly 'filter.title': "筛选类型";
    readonly 'filter.input': "类型关键词";
    readonly 'filter.placeholder': "输入类型片段，如 delta";
    readonly 'filter.help': "默认包含匹配（*关键词*）；Enter 确认，Esc 取消。";
    readonly 'filter.candidates': "类型候选";
    readonly 'filter.loading': "正在查找候选…";
    readonly 'filter.failed': "无法获取类型候选。";
    readonly 'filter.noCandidates': "没有匹配候选，仍可确认当前关键词。";
    readonly 'filter.clear': "清空";
    readonly 'filter.cancel': "取消";
    readonly 'filter.apply': "确认筛选";
    readonly 'filter.context': "匹配记录的父级上下文";
    readonly 'table.location': "T/S";
    readonly 'table.time': "时间 (UTC)";
    readonly 'table.data': "数据";
    readonly 'table.older': "加载更早";
    readonly 'table.loading': "加载中…";
    readonly 'table.latest': "跟踪最新";
    readonly 'table.empty': "暂无记录";
    readonly 'table.raw': "原始数据";
    readonly 'table.rawError': "无法序列化这条记录，可以选择其他记录继续查看。";
    readonly 'table.resizeDetails': "调整原始数据面板高度";
    readonly 'table.close': "关闭";
    readonly 'table.expand': "展开子行";
    readonly 'table.collapse': "收起子行";
    readonly 'table.removed': "该记录已移除或结算，请选择当前记录。";
    readonly 'object.node': "Node";
    readonly 'object.nodeData': "Node Data";
    readonly 'object.group': "Group";
    readonly 'object.groupData': "Group Data";
    readonly 'object.turn': "Turn";
    readonly 'object.turnData': "Turn Data";
    readonly 'object.step': "Step";
    readonly 'object.stepData': "Step Data";
    readonly 'object.accessor': "[Getter / Setter，未执行]";
    readonly 'object.empty': "空";
    readonly 'object.absent': "[空槽]";
    readonly 'object.properties': "其他属性";
    readonly 'object.more': "显示更多";
    readonly 'object.navigation': "原始数据导航";
};
/** Dictionary keys accepted by this plugin's translator. */
export type SessionInspectorKey = keyof typeof zh;
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Session Inspector tab and table labels. */
        'session-inspector': SessionInspectorKey;
    }
}
/** English labels, checked against the Chinese key set. */
export declare const en: Record<SessionInspectorKey, string>;
//# sourceMappingURL=locales.d.ts.map