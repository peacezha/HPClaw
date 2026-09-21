# AI 面板抽屉模式 + 输入框自动增高 — 设计文档

日期：2026-07-15
状态：已与用户确认

## 背景

当前 AI 助理面板（`src/components/AIChat.tsx`）以并排侧边栏形式嵌在 `App.tsx` 主布局左侧（`motion.div`，固定 420px 宽），打开时会挤压终端区域。右侧的文件传输工作区已实现覆盖式抽屉（`src/features/file-transfer/FileTransferDrawer.tsx`：portal + 遮罩 + fixed 定位 + CSS 滑入动画）。

用户需求：
1. AI 面板支持与文件传输一致的覆盖式抽屉模式，不挤压终端。
2. 用户可在设置中切换"抽屉模式 / 侧边栏模式"，选择被持久化。
3. AI 对话输入框从单行 `<input>` 改为随内容自动增高的多行输入。

交付物为修改 `E:\0612hpclaw\0714` 源码树并重新打包 Electron 应用（`npm run electron:dist`），替换 `HPClaw-x64` 目录内容。

## 已确认的决策

| 决策点 | 结论 |
|---|---|
| 抽屉滑出方向 | 从左侧滑出（与 AI 面板现有位置习惯一致） |
| 抽屉宽度 | `min(90vw, 1680px)`，与文件传输抽屉一致，带最大化/还原按钮 |
| 设置入口 | AI 设置面板（配置 API Key 处）新增"AI 面板显示方式"选项 |
| 默认模式 | 抽屉模式 |
| 持久化 | localStorage，新建 `src/services/uiPrefs.ts`，key 为 `hpclaw_ui_prefs` |
| 输入框 | `<textarea>` 自动增高，1 行起步、最多约 8 行后内部滚动；Enter 发送、Shift+Enter 换行；发送后复位 |

## 架构

### 1. AIDrawer 组件（新增）

`src/components/AIDrawer.tsx`，仿照 `FileTransferDrawer.tsx`：

- `createPortal` 到 `document.body`
- 结构：`.ai-drawer-overlay`（fixed inset-0, z-30）> `.ai-drawer-scrim`（点击关闭）+ `.ai-drawer`（左侧定位，`transform: translateX` 滑入动画）
- 顶部标题栏："AI 助理" + 最大化/还原按钮 + 关闭按钮
- `Esc` 键关闭（监听 keydown，仅 open 时挂载）
- Props：`open`、`maximized`、`onClose`、`onToggleMaximize`、`children`
- 样式：新建 `src/components/aiDrawer.css`（参照 `fileTransfer.css` 的 overlay 部分，方向镜像为左侧：`left: 0`、关闭态 `translateX(-100%)`、阴影方向反转、`border-radius` 右侧圆角）
- 响应式与无障碍：`<1100px` 时全宽；`prefers-reduced-motion` 时禁用动画；`role="dialog"`

### 2. App.tsx 集成

- 从 `uiPrefs.ts` 读取显示模式，state `aiPanelMode: 'drawer' | 'sidebar'`，监听自定义事件 `hpclaw-ui-prefs-change` 实时更新
- 复用现有 `isSidebarOpen` state 作为两种模式共同的"AI 面板打开"状态：
  - `sidebar` 模式：现有 `AnimatePresence + motion.div` 渲染路径不变
  - `drawer` 模式：渲染 `<AIDrawer>` 包裹 `<AIChat>`，新增 `aiDrawerMaximized` state
- 左边缘 ChevronRight 唤起按钮：两种模式共用（drawer 模式下面板打开时按钮隐藏，与现逻辑一致）
- 终端"分析错误 / 发送到 AI"回调已调用 `setIsSidebarOpen(true)`，两种模式下均自动弹出，无需改动
- 已知取舍：切换模式会使 `AIChat` 重新挂载，对话历史在 App 层不受影响；未发送的输入草稿会清空（可接受）

### 3. uiPrefs 服务（新增）

`src/services/uiPrefs.ts`，仿照 `aiProfile.ts` 模式：

```ts
export type AIPanelMode = 'drawer' | 'sidebar';
export interface UIPrefs { aiPanelMode: AIPanelMode }
export function loadUIPrefs(): UIPrefs   // 缺省/解析失败 → { aiPanelMode: 'drawer' }
export function saveUIPrefs(prefs: UIPrefs): void  // 写入后 dispatchEvent('hpclaw-ui-prefs-change')
```

### 4. AI 设置面板

在 `AIChat.tsx` 的设置面板（API Key 配置区域）新增"AI 面板显示方式"单选/分段控件：`抽屉（覆盖终端）` / `侧边栏（并排）`。选择后立即 `saveUIPrefs` 并生效。

### 5. 输入框自动增高

`AIChat.tsx:1252` 的 `<input type="text">` 改为 `<textarea rows={1}>`：

- 自动增高：`onChange` 时重置 `height = 'auto'` 再设为 `scrollHeight`，CSS `max-height` 约 8 行（`resize: none`，超出 `overflow-y: auto`）
- 按键：Enter（无 Shift）→ 阻止默认并提交表单；Shift+Enter → 默认换行行为
- 按键判定逻辑抽为纯函数（如 `shouldSubmitOnKey(e)`）便于测试
- 发送成功后高度复位
- 消息内容含换行，检查消息渲染处是否保留换行（`whitespace-pre-wrap`）

## 错误处理

- `localStorage` 读取解析失败 → 静默回退默认值（drawer）
- 抽屉与文件传输抽屉同时打开：各自监听 Esc、各自关闭自身，z-index 同层按 DOM 顺序覆盖，可接受

## 测试策略（vitest）

1. `src/services/uiPrefs.test.ts`：默认值、读写往返、损坏数据回退、事件派发
2. `src/components/AIDrawer.test.tsx`：仿 `FileTransferDrawer.test.tsx` —— open/close 渲染、Esc 关闭、遮罩点击关闭、最大化切换
3. 输入框按键纯函数测试：Enter 提交 / Shift+Enter 不提交 / IME 组合输入（`isComposing`）不提交

## 验证与交付

1. `npm run lint`（tsc --noEmit）+ `npm test` 全绿
2. `npm run electron:dist` 打包，产物替换 `HPClaw-x64/` 内容（保留用户既有 backup 目录不动）
3. 手工验证：抽屉开关/最大化/Esc/遮罩、设置切换即时生效并在重启后保持、输入框增高与 Enter/Shift+Enter、终端"发送到 AI"弹出抽屉
