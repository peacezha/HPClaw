# requirements.json 清单格式

## 目录

1. 顶层结构
2. cluster
3. policy
4. tools
5. 版本约束
6. 安全限制
7. 完整示例
8. install-record.json

## 1. 顶层结构

使用 UTF-8 JSON。顶层字段：

| 字段 | 必需 | 说明 |
|---|---:|---|
| `schema_version` | 是 | 当前为 `1` |
| `cluster` | 否 | 集群和路径信息；审计阶段可省略写入路径 |
| `policy` | 否 | 部署策略 |
| `tools` | 是 | 至少一个软件需求 |

## 2. cluster

```json
{
  "host": "login.example.org",
  "scheduler": "slurm",
  "build_partition": "build",
  "software_root": "/shared/apps/bio",
  "module_root": "/shared/modules/bio",
  "build_root": "/shared/build/bio",
  "audit_root": "/shared/audit/bio"
}
```

所有写入根目录必须为目标集群上的绝对路径。未确认时省略，不要猜测。清单不得保存 SSH 密码、密钥或令牌。

## 3. policy

```json
{
  "backend_order": ["easybuild", "spack", "micromamba", "apptainer", "binary", "source"],
  "allow_login_build": false,
  "allow_overwrite": false,
  "allow_default_change": false,
  "require_sha256": true
}
```

`backend_order` 是候选优先级，不代表失败后可以静默降级。每次降级都要记录原因，并在影响 ABI、性能、许可或可维护性时请求决定。

## 4. tools

每个对象包含：

| 字段 | 必需 | 说明 |
|---|---:|---|
| `name` | 是 | 上游规范软件名 |
| `version` | 是 | 精确版本或约束 |
| `executables` | 是 | 必须出现的可执行文件名数组 |
| `module_candidates` | 是 | 从目标站点实际发现、按优先级尝试的精确 module 名称 |
| `prerequisite_modules` | 否 | 层级 module 所需的编译器/MPI 等 |
| `version_probe` | 否 | 受限版本 argv 和字面 marker |
| `install` | 否 | 各后端固定包规格或工件元数据 |
| `variants` | 否 | 架构、MPI、CUDA、编译器等约束 |
| `license` | 否 | SPDX 标识或许可说明 |

`version_probe`：

```json
{
  "argv": ["samtools", "--version"],
  "marker": "samtools"
}
```

- `argv` 必须是字符串数组，不能是 shell 命令字符串。
- `argv` 必须恰好包含两个元素：清单中声明的可执行文件，以及 `--version`、`--version-only`、`-version`、`-V` 之一。无参数、`-v`、`version`、帮助标志、解释器代码参数、文件路径和任意子命令均不允许。
- 加载 module 后，探针命令必须解析为绝对且可执行的文件；shell builtin、alias 或 function 不会被执行。
- `marker` 是输出行中应出现的大小写不敏感字面文本，不是正则。审计器只在匹配行中用内置的线性版本提取器读取版本。
- 未提供时，审计器使用第一个可执行文件、`--version` 和软件规范名 marker。

`install` 示例：

```json
{
  "easybuild": {"easyconfig": "SAMtools-1.20-GCC-13.2.0.eb"},
  "spack": {"spec": "samtools@1.20 %gcc@13.2.0"},
  "micromamba": {
    "packages": ["samtools=1.20"],
    "channels": ["conda-forge", "bioconda"],
    "lockfile": "locks/samtools-linux-64.lock"
  },
  "apptainer": {
    "image": "oras://registry.example.org/bio/samtools@sha256:...",
    "digest": "sha256:..."
  },
  "binary": {
    "url": "https://example.org/samtools-1.20-linux-x86_64.tar.bz2",
    "sha256": "<64 lowercase hex characters>"
  },
  "source": {
    "url": "https://example.org/samtools-1.20.tar.bz2",
    "sha256": "<64 lowercase hex characters>",
    "recipe": "site-reviewed recipe identifier"
  }
}
```

`install` 只用于表达经过复核的候选方案。审计脚本不会执行这些字段；执行前必须把包规格、URL、摘要和 recipe 与站点可信 registry 或上游发布记录核对。

## 5. 版本约束

审计器支持：

- 精确版本：`1.20`
- 比较：`==1.20`、`>=1.18`、`<2`
- 逗号合取：`>=1.18,<2`

版本比较按数字和文本片段自然排序，适合常见生信软件版本，但不是完整 PEP 440/SemVer 实现。预发布、日期版或特殊供应商版本应使用精确版本并提供清晰探针。

## 6. 安全限制

- `module_candidates` 和 `prerequisite_modules` 作为 module 名称处理，不作为任意 shell 命令。
- `version_probe.argv` 必须为受限 argv 数组，禁止解释器代码参数、管道、重定向、命令替换和 shell 连接符。
- `requirements.json` 不接受 `smoke_test` 命令。将烟雾测试放入经过 recipe/站点复核的部署计划，并在发布前单独执行。
- URL 必须来自上游或站点批准镜像。
- 二进制、源码和容器必须固定 SHA-256 或不可变 digest。
- 许可接受、私有 registry 和受限下载在清单中只记录标识，不记录凭据。
- 不把用户提供的 `install`、URL 或 recipe 字段直接转换成 shell 命令。

## 7. 完整示例

```json
{
  "schema_version": 1,
  "cluster": {
    "host": "login.example.org",
    "scheduler": "slurm",
    "build_partition": "build",
    "software_root": "/shared/apps/bio",
    "module_root": "/shared/modules/bio",
    "build_root": "/shared/build/bio",
    "audit_root": "/shared/audit/bio"
  },
  "policy": {
    "backend_order": ["easybuild", "spack", "micromamba", "apptainer", "source"],
    "allow_login_build": false,
    "allow_overwrite": false,
    "allow_default_change": false,
    "require_sha256": true
  },
  "tools": [
    {
      "name": "samtools",
      "version": "==1.20",
      "executables": ["samtools"],
      "module_candidates": ["samtools/1.20", "SAMtools/1.20", "samtools"],
      "version_probe": {
        "argv": ["samtools", "--version"],
        "marker": "samtools"
      },
      "install": {
        "easybuild": {"easyconfig": "SAMtools-1.20-GCC-13.2.0.eb"},
        "spack": {"spec": "samtools@1.20"},
        "micromamba": {
          "packages": ["samtools=1.20"],
          "channels": ["conda-forge", "bioconda"]
        }
      },
      "license": "MIT"
    },
    {
      "name": "bcftools",
      "version": ">=1.20,<2",
      "executables": ["bcftools"],
      "module_candidates": ["bcftools/1.20", "BCFtools/1.20", "bcftools"],
      "version_probe": {
        "argv": ["bcftools", "--version"],
        "marker": "bcftools"
      },
      "install": {
        "spack": {"spec": "bcftools@1.20"},
        "micromamba": {
          "packages": ["bcftools=1.20"],
          "channels": ["conda-forge", "bioconda"]
        }
      }
    }
  ]
}
```

## 8. install-record.json

用于渲染 modulefile；它描述已经安装并验证的不可变前缀，不是安装指令。

```json
{
  "name": "samtools",
  "version": "1.20",
  "prefix": "/shared/apps/bio/samtools/1.20/gcc-13.2",
  "description": "SAMtools utilities for SAM/BAM/CRAM files.",
  "homepage": "https://www.htslib.org/",
  "license": "MIT",
  "root_variable": "SAMTOOLS_ROOT",
  "dependencies": ["GCC/13.2.0"],
  "conflicts": ["samtools"],
  "paths": {
    "PATH": ["bin"],
    "MANPATH": ["share/man"]
  },
  "environment": {},
  "metadata": {
    "backend": "easybuild",
    "build_id": "20260729T120000Z-ab12cd34",
    "source": "https://example.org/samtools-1.20.tar.bz2",
    "sha256": "<64 lowercase hex characters>"
  }
}
```

`prefix` 必须是非根 POSIX 绝对路径。`paths` 中的条目必须是该前缀下的相对路径；不得包含 `..`。`environment` 仅放无密钥的确定性值。Lua 使用 `depends_on`，Tcl 使用 `prereq` 表达依赖。
