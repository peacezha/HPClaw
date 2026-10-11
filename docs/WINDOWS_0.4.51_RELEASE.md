# HPClaw v0.4.51 — Windows、macOS 与公共 Linux 网页端

三个平台使用同一版本的共享对话与流程执行逻辑，保留经典界面；Windows 另附在线更新元数据。

## 本次修复

- 聊天正文不再只显示最后 500 条。已保存历史可直接在对话框阅读，执行/思考记录支持一键展开，显示层不再截断工具结果。模型上下文预算与聊天存档分离；旧版本未保存的被截断内容无法自动重建。
- 同一对话的不同作业完成通知排队处理，不丢弃后到事件；后续作业继续登记并监控。原生后台续跑恢复原对话和计划，正式流程修复 waiting_jobs 被覆盖的问题，产物核验后继续已授权的下一步。
- 作业查询失败或消失不再直接视为 DONE。调度器 DONE 不等于 QC/产物有效，后台必须核验实际输出；缺少关键输入、QC 失败、审批要求或用户停止仍会暂停。
- 断点恢复在同一对话内按 RUN 去重，只保留一个实时流程框，并保留各次恢复指令。
- 包含此前本地 v0.4.49/v0.4.50 的待弃置流程管理、全部定义删除与备份，以及依赖编辑、分支 DAG 和正交流程图布局修复。不会覆盖用户主动删除、手动弃置或已自定义的流程。

## 下载与更新

- Windows x64：`HPClaw-Setup-0.4.51-x64.exe`；保存当前任务、关闭软件后安装。未做代码签名，可能显示未知发布者。发布后 Windows 可读取此版本的 `latest.yml`。
- Apple 芯片 Mac：`HPClaw-0.4.51-mac-arm64.dmg`；Intel Mac：`HPClaw-0.4.51-mac-x64.dmg`。拖入 Applications 使用，内置运行时，无需另装 Node.js。无 Apple Developer ID 签名/公证，当前手动更新。
- 公共 Linux 网页端：`HPClaw-0.4.51-public-web-linux-x64-node20.tar.gz`。Linux x64，兼容 Node.js 20.19.5 及 22.17.1；用户自带集群账号和 API Key，无统一网站口令，不提供部署服务器本地工作台。

```bash
tar -xzf HPClaw-0.4.51-public-web-linux-x64-node20.tar.gz
cd HPClaw-0.4.51-public-web-linux-x64-node20
npm ci --omit=dev --ignore-scripts
npm start -- --url https://你的实际域名
```

默认监听 127.0.0.1:3003，需要现有 HTTPS 反向代理。更换端口可加 `--port 3013`；不用覆盖其他网站配置。用户数据在各自集群，升级解压到新目录、停旧 HPClaw 服务后启动新包，不迁移或删除集群数据。网页会话释放/服务重启后需重新登录才能恢复 AI 监控；已提交集群作业不因网页退出而取消。

完整说明：[公共网页部署](https://github.com/peacezha/HPClaw/blob/main/docs/PUBLIC_WEB_DEPLOYMENT.md)、[Mac 安装](https://github.com/peacezha/HPClaw/blob/main/docs/MAC_WEB_DEPLOYMENT.md)。

## 验证

Windows 本地：215 个测试文件、1673 项测试通过（2 项跳过），616 条模拟聊天实际浏览器检查、安装载荷 CRC 与打包后启动检查通过。跨平台构建需在 GitHub 原生 Mac/Linux/Windows runner 上分别通过后才能交付；构建记录附准确源码提交与 SHA-256。没有操作用户生产集群或调用真实付费 AI Key。外部 ENA/GEO 实时元数据网络测试不计为本次 Windows 打包验收。

连续执行要求后台运行、集群连接与有效 AI 配置；不承诺第三方网络、模型或生信软件永不出错。官方 ENCODE WDL 与 HPClaw 原生扩展的来源标注仍保留。
