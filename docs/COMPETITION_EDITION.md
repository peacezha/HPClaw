# HPClaw 竞赛版构建说明

## 产品边界

HPClaw 竞赛版是一个可与完整版并排安装的独立 Windows 客户端。它保留：

- 集群登录、多集群标签和终端；
- 作业监控、文件传输、文件预览和本地打开编辑；
- AI 对话、对话历史和 HPClaw 原生智能体；
- 技能库、流程库、流程创建/修改/删除、流程运行、续跑、监控和管线资产。

竞赛版只移除 DSH：不打包 `vendor/dsh`、`vendor/dsh-plugin` 和 DSH 专用的 `vendor/node-runtime`，不注册 DSH Bridge API，AI Agent 固定使用 HPClaw 原生引擎。

## 独立性

| 项目 | 完整版 | 竞赛版 |
|---|---|---|
| appId | `com.hpclaw.desktop` | `com.hpclaw.competition` |
| productName | `HPClaw` | `HPClaw Competition` |
| 主程序 | `HPClaw.exe` | `HPClaw Competition.exe` |
| 用户数据 | `HPClaw` | `HPClaw Competition` |
| 安装/卸载记录 | 完整版独立 GUID | 竞赛版独立 GUID |
| 发布目录 | `release` | `release-competition` |

两个版本的集群账号、AI 密钥、传输队列、对话上下文和更新设置不会互相污染。

## 构建

```powershell
npm run electron:competition
```

构建脚本会自动：

1. 以 `competition` 模式构建前端和服务端；
2. 使用独立 Electron Builder 配置生成 NSIS 安装包；
3. 确认打包结果不含 `vendor`/DSH 运行时；
4. 强制校验安装包小于 200,000,000 字节；
5. 执行安装包内嵌 7z 数据的 CRC 完整性检查。

主配置位于 `build/competition-builder.json`，构建入口位于 `scripts/build-competition-installer.mjs`。

## 发布前检查

- `npm run lint`；
- `npm test`；
- 安装包大小和 SHA-256；
- 包内 `pipelines` 、BioSkills workflow 资产和技能索引存在；
- 包内 `vendor`/DSH 运行时不存在；
- `/api/app-info` 显示 `workflowDevelopment: true` 和 `dsh: false`；
- `/api/workflows` 能正常返回流程，`/api/bridge/*` 返回 404；
- 与完整版并排安装后，启动、卸载竞赛版均不影响完整版。

