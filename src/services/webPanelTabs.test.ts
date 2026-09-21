import { describe, it, expect } from 'vitest';
import {
  addWebPanelTab,
  removeWebPanelTab,
  webPanelTabKey,
  EMPTY_WEB_PANEL_TABS,
} from './webPanelTabs';

const tabA = { url: 'https://example.com/a', title: 'A' };
const tabB = { url: 'https://example.com/b', title: 'B' };
const tabC = { remotePath: '/home/u/run/report.html', sessionId: 'sess-1', title: 'C' };

describe('webPanelTabs', () => {
  it('appends new pages as tabs and activates the latest one', () => {
    let state = EMPTY_WEB_PANEL_TABS;
    state = addWebPanelTab(state, tabA);
    expect(state).toEqual({ tabs: [tabA], active: 0 });
    state = addWebPanelTab(state, tabB);
    expect(state).toEqual({ tabs: [tabA, tabB], active: 1 });
  });

  it('focuses the existing tab when the same target is opened again', () => {
    let state = { tabs: [tabA, tabB], active: 1 };
    state = addWebPanelTab(state, { url: 'https://example.com/a', title: '另一个标题' });
    expect(state.tabs).toHaveLength(2);
    expect(state.active).toBe(0);
  });

  it('treats the same remote path on different sessions as different tabs', () => {
    expect(webPanelTabKey(tabC)).not.toBe(
      webPanelTabKey({ ...tabC, sessionId: 'sess-2' }),
    );
  });

  it('keeps the active tab valid when closing a tab before it', () => {
    const state = removeWebPanelTab({ tabs: [tabA, tabB, tabC], active: 2 }, 0);
    expect(state.tabs).toEqual([tabB, tabC]);
    expect(state.active).toBe(1);
  });

  it('moves focus to the previous tab when the active tab is closed', () => {
    const state = removeWebPanelTab({ tabs: [tabA, tabB, tabC], active: 2 }, 2);
    expect(state.tabs).toEqual([tabA, tabB]);
    expect(state.active).toBe(1);
  });

  it('returns to the empty state when the last tab is closed', () => {
    expect(removeWebPanelTab({ tabs: [tabA], active: 0 }, 0)).toEqual(EMPTY_WEB_PANEL_TABS);
  });
});
