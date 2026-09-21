import type { WebPanelRequest } from '../components/WebPanelDrawer';

export interface WebPanelTabsState {
  tabs: WebPanelRequest[];
  active: number;
}

export const EMPTY_WEB_PANEL_TABS: WebPanelTabsState = { tabs: [], active: 0 };

/** 同一 URL/远程路径（且同会话）视为同一标签，重复打开时聚焦既有标签 */
export function webPanelTabKey(tab: WebPanelRequest): string {
  return `${tab.url ?? ''}|${tab.remotePath ?? ''}|${tab.sessionId ?? ''}`;
}

/** 追加标签；已存在同目标标签时只切换焦点，不重复打开 */
export function addWebPanelTab(state: WebPanelTabsState, request: WebPanelRequest): WebPanelTabsState {
  const key = webPanelTabKey(request);
  const existing = state.tabs.findIndex(tab => webPanelTabKey(tab) === key);
  if (existing >= 0) return { tabs: state.tabs, active: existing };
  return { tabs: [...state.tabs, request], active: state.tabs.length };
}

/** 关闭单个标签并保持 active 指向合法位置；全部关闭后回到空态（面板隐藏） */
export function removeWebPanelTab(state: WebPanelTabsState, index: number): WebPanelTabsState {
  if (index < 0 || index >= state.tabs.length) return state;
  const tabs = state.tabs.filter((_, i) => i !== index);
  if (tabs.length === 0) return EMPTY_WEB_PANEL_TABS;
  let active = state.active;
  if (index < active) active -= 1;
  if (active >= tabs.length) active = tabs.length - 1;
  return { tabs, active };
}
