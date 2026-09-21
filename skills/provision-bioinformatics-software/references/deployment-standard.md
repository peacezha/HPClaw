# 生信软件集群部署规范

## 目录

1. 权限与范围
2. 目录和命名
3. 可复现性
4. 暂存与发布
5. 验证标准
6. 审计记录
7. 并发和幂等
8. 回滚与保留
9. 调度器与资源
10. 安全检查表

## 1. 权限与范围

- 把只读探测和写入部署分为两个阶段。
- 将明确的“安装/部署”请求视为对已确认、用户自有或站点批准前缀的授权，不将其扩展为系统管理授权。
- 不使用 root 或 sudo，不修改操作系统包、全局 MODULEPATH、用户 shell 启动文件或其他用户的软件。
- 要求软件根、module 根、构建根和审计根均解析为绝对路径。解析符号链接后确认目标仍位于站点批准根内，并且不是 `/`、`/usr`、`/opt`、`/etc`、家目录根或工作区根。
- modulefile 不得设置 `BASH_ENV`、`LD_PRELOAD`、`MODULEPATH`、`HOME` 等启动、注入或 module 控制变量；路径变量只能通过受控的 prepend 操作添加安装前缀内路径。
- 对共享目录、默认版本、许可证、商业软件、GPU 驱动和 MPI 栈的变更要求额外确认。
- 不输出或记录 SSH 私钥、访问令牌、许可证密钥、代理密码和完整环境变量。

## 2. 目录和命名

优先采用站点已有布局。没有站点标准时，使用：

```text
<software_root>/<name>/<version>/<toolchain>/
<module_root>/<name>/<version>.lua
<build_root>/<name>/<version>/<build_id>/
<audit_root>/<name>/<version>/<build_id>/
```

要求：

- `name` 使用上游规范名的小写形式；module 别名仅用于兼容。
- `version` 是不可变的精确版本，包含必要的上游补丁号。
- `toolchain` 至少区分 CPU 架构，以及会影响 ABI 的 compiler、MPI、CUDA。
- 不把日期、`latest` 或 `current` 当作唯一版本标识。
- 不覆盖同名版本。需要重建时使用新的构建 ID 或站点定义的 revision。

## 3. 可复现性

每次部署都固定并保存：

- 上游版本和来源 URL；
- 源码、二进制或容器工件的 SHA-256；
- 包管理器版本、仓库提交或 channel 配置；
- 完整依赖解析、锁文件或 concretized spec；
- policy、recipe、lockfile 和最终 modulefile 的内容哈希；
- 编译器、编译参数、CPU/GPU/MPI 变体；
- 操作系统、架构和容器运行时信息；
- 构建和验证命令及退出状态。

禁止：

- 无版本的 `latest`；
- `curl ... | sh` 或 `wget ... | bash`；
- 未固定 channel 的 Conda 求解；
- 未校验的预编译工件；
- 在安装完成后手工编辑文件却不记录差异。

## 4. 暂存与发布

1. 在与最终前缀相同的文件系统内建立唯一暂存目录。
2. 使用独占锁或原子目录创建防止并发部署同一版本。
3. 下载到缓存，先校验 SHA-256，再解包或构建。
4. 将全部软件安装到暂存前缀。
5. 在暂存前缀执行验证，不创建对外可见 modulefile。
6. 将暂存前缀原子改名为最终不可变前缀。
7. 在 module 根生成临时 modulefile，验证后原子改名。
8. 最后写入审计记录；失败时不得发布部分结果。

若后端无法重定位，使用最终前缀进行隔离构建时必须先持有锁，并确保 modulefile 在验证完成前不可见。

## 5. 验证标准

最低标准：

- `module load` 退出 0；
- 所有 `executables` 都能由 `command -v` 找到；
- 版本探针退出 0，捕获版本满足约束；
- 最小烟雾测试退出 0；
- 新 shell 中加载和卸载不污染无关变量；
- modulefile 只添加该前缀内的路径；
- 运行时依赖和架构正确。

按软件类别补充：

- HTS/NGS 工具：用小型公开或自建无敏感测试数据执行读写/索引。
- Python/R 工具：验证入口点和关键 import/library。
- MPI 工具：在计算节点做最小多进程测试，确认 MPI ABI。
- CUDA 工具：在 GPU 节点确认驱动兼容和最小设备调用。
- GUI/有许可证软件：验证许可证发现方式，不记录密钥。
- Apptainer：验证镜像 digest、绑定目录和非特权运行。

不要把 `--help` 单独视为充分烟雾测试；它只能作为基础检查。

## 6. 审计记录

每个构建 ID 保存一个结构化记录，至少包含：

```text
schema_version
name
version
build_id
requested_by
started_at / completed_at (UTC)
cluster / hostname class
backend and backend version
source URLs and SHA-256
resolved dependencies or lock
toolchain / architecture / variants
install prefix
modulefile path
build log path
validation commands and results
policy / recipe / lockfile / modulefile hashes
status
```

时间使用 UTC ISO 8601。用户身份可以保存账号名，但不要保存个人令牌或私钥。
依赖复杂或需合规交付时，同时生成 SPDX 或 CycloneDX SBOM。

## 7. 并发和幂等

- 对 `<name>/<version>/<toolchain>` 使用同文件系统锁。
- 获取锁后再次运行 module 审计和目标前缀检查。
- 若已有部署通过验证，返回“已满足”，不重复安装。
- 若已有前缀但无有效审计记录或验证失败，标记冲突并停止，不覆盖。
- 锁必须记录构建 ID、主机和开始时间；清理陈旧锁前要求人工复核进程状态。

## 8. 回滚与保留

- 发布失败：保留日志和暂存目录，modulefile 不可见。
- modulefile 问题：撤下新 modulefile，恢复上一个经过验证的默认指向。
- 软件问题：保留不可变前缀和审计记录，发布修订版本。
- 默认不自动删除失败暂存、旧版本、缓存或日志。
- 删除时先解析绝对目标，确认目标位于指定构建/软件根内且仅指向一个构建 ID。

## 9. 调度器与资源

优先服从站点文档。若使用 Slurm/PBS：

- 在登录节点只做探测、轻量下载和提交任务；
- 根据源码规模申请 CPU、内存、时限和临时空间；
- 将网络受限节点所需工件提前放入校验过的缓存；
- 把 job ID 写入审计记录；
- 构建完成后检查调度器退出状态和构建日志，再进入发布阶段。

不要在未知政策下自动提交到默认分区；先发现或确认构建分区和资源上限。

## 10. 安全检查表

写入前逐项确认：

- [ ] 目标集群、账号和架构正确。
- [ ] 软件、module、构建、审计根目录均为明确绝对路径。
- [ ] 用户已授权当前变更范围。
- [ ] 不需要 sudo、系统包变更或受保护目录写入。
- [ ] 版本、来源、许可证和 SHA-256 已固定。
- [ ] 后端符合站点标准。
- [ ] 大型构建已安排到允许的计算/构建节点。
- [ ] 暂存、锁、验证、原子发布和回滚路径明确。
- [ ] 不会覆盖现有前缀、modulefile 或默认版本。
- [ ] 日志不会泄露凭据或许可证密钥。
