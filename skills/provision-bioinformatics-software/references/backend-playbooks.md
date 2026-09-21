# 安装后端手册

## 目录

1. 选择顺序
2. EasyBuild
3. Spack
4. micromamba/Bioconda
5. Apptainer
6. 官方二进制
7. 源码构建
8. Modulefile 与验证

## 1. 选择顺序

先识别站点已采用的工具和目录布局。默认决策：

1. **站点缓存/既有 recipe**：优先复用站点已批准的 EasyBuild easyconfig、Spack buildcache 或二进制缓存。
2. **EasyBuild**：站点已有 EasyBuild、easyconfig 和工具链命名规范。
3. **Spack**：站点已有 Spack 环境、镜像、编译器和 module 生成规范。
4. **micromamba/Bioconda**：工具适合 Conda，且站点允许共享前缀或每工具独立环境。
5. **Apptainer**：依赖冲突大、软件难以原生构建，或上游提供可信不可变镜像。
6. **官方二进制**：上游提供匹配架构/ABI 的可校验工件。
7. **源码构建**：其他方案不合适，且构建配方已审查。

不要因为某后端命令当前不可见就立刻跳到下一项；它可能本身由 module 提供。先检查站点文档和 modules。

## 2. EasyBuild

适用于已有 EasyBuild 管理体系的集群。

要求：

- 固定 easyconfig 文件及其仓库提交；
- 使用站点批准的 toolchain、robot path、source cache 和 install path；
- 先执行 dry run/dependency resolution；
- 在构建节点执行正式构建；
- 使用 EasyBuild 生成的 modulefile，不另造冲突 modulefile；
- 保存 EasyBuild 日志和 easyconfig 副本。

计划阶段常用检查：

```bash
eb --version
eb <easyconfig> --dry-run --robot
```

正式参数必须来自站点配置。不要擅自传入新的全局 `--installpath` 或修改管理员 EasyBuild 配置。

## 3. Spack

适用于已有 Spack 实例、环境或 buildcache 的集群。

要求：

- 记录 Spack 提交/版本、环境文件和 concretized lock；
- 固定 compiler、target、MPI/CUDA 等变体；
- 优先复用站点镜像/buildcache；
- 在独立 Spack environment 中 concretize；
- 先查看 spec，再安装；
- 按站点方式生成 Lmod/Tcl module，不刷新不属于本任务的全局 module tree。

计划阶段常用检查：

```bash
spack --version
spack spec '<exact-spec>'
```

正式安装前保存 `spack.yaml` 和 `spack.lock`。对多个工具使用一个明确命名的环境；不要向未知的活动环境直接 `spack add`。

## 4. micromamba/Bioconda

适用于命令行生信工具和隔离依赖。共享环境中每个发布前缀只服务一个工具或一组明确绑定的工具。

要求：

- channel 顺序固定为站点批准顺序，通常为 `conda-forge` 后 `bioconda`，并启用 strict priority；
- 固定包版本；生产发布优先使用显式 lock 文件；
- 在暂存前缀创建环境；
- 记录 repodata/lock、包清单和 micromamba 版本；
- modulefile 只暴露该环境，不自动激活或修改 shell 启动文件；
- 检查许可证和二进制兼容性。

示意命令：

```bash
micromamba create --yes --prefix <staging-prefix> \
  --strict-channel-priority \
  --channel conda-forge --channel bioconda \
  'samtools=1.20'
micromamba list --prefix <staging-prefix> --explicit
```

尖括号内容必须替换为已验证的精确绝对路径；不要原样执行。需要可复现生产部署时，用站点生成并审查的 lock 文件替代在线重新求解。

## 5. Apptainer

适用于复杂依赖或环境隔离，前提是集群已支持 Apptainer/Singularity。

要求：

- 使用 digest 固定的 OCI/ORAS 工件或校验过的 SIF；
- 记录构建定义文件、镜像 digest 和 Apptainer 版本；
- 不请求 setuid/root 构建，除非站点管理员负责；
- 明确只读/读写绑定、临时目录、GPU 选项和网络行为；
- modulefile 暴露经过审查的 wrapper，wrapper 使用 argv 透传，不能 `eval`；
- 在计算节点验证文件系统绑定、用户映射和调度器兼容性。

## 6. 官方二进制

仅使用上游或站点批准镜像提供的匹配架构工件。

要求：

- 固定 HTTPS URL 和 SHA-256；
- 下载后先校验再解压；
- 防止归档中的绝对路径和 `..` 路径穿越；
- 检查 ELF 架构、动态库、glibc 要求和可执行权限；
- 不运行归档内未知的安装脚本；
- 将许可证和上游发布信息存入审计记录。

## 7. 源码构建

最后选择。要求：

- 固定源码 URL、SHA-256、补丁和构建配方版本；
- 使用站点 module 提供的 compiler/CMake/MPI/CUDA；
- 设置显式 install prefix 和可复现编译参数；
- 在构建节点执行；
- 运行上游测试与软件特定烟雾测试；
- 检查 RPATH/RUNPATH 和动态库解析；
- 保存 config log、编译日志和已应用补丁。

禁止从未固定的默认分支构建生产版本。

## 8. Modulefile 与验证

若后端不负责 modulefile，准备 `install-record.json`，再运行：

```bash
python3 scripts/hpc_bio_modules.py render-module \
  --record install-record.json \
  --format lua \
  --output <module-root>/<name>/<version>.lua
```

Environment Modules 使用 `--format tcl`；Lua 仅用于 Lmod。尖括号内容必须替换为已验证的绝对路径。

modulefile 应：

- 设置 `help`、`whatis`、root 环境变量；
- 仅 prepend 安装前缀内的 PATH、MANPATH、库和数据路径；
- 声明真实的 prerequisite 与 conflict；
- 不执行下载、联网、激活 shell 或任意命令；
- 不包含凭据、用户私有路径或构建暂存路径。

发布后从新的登录子 shell 验证，重新运行 module 审计，并保存结果。
