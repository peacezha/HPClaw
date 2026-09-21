# github-mirror

一个 Claude Code 技能，自动在当前网络环境中寻找最快的 GitHub（及 Docker Hub）代理镜像，并使用它进行下载。

基于 [mirror-scout](https://github.com/ryys1122/mirror-scout)。

## 功能特性

- **自动发现**：从多个网页来源和 API 抓取候选镜像
- **真实测速**：通过每个镜像下载实际文件并测量吞吐量
- **并发测试**：多线程测试，快速出结果
- **双模式**：支持 Docker Hub 镜像测试和 GitHub 代理镜像测试
- **自动缓存**：结果保存至 `mirrors-docker.txt` / `mirrors-github.txt`，下次直接复用

## 快速开始

```bash
# 安装依赖
pip install requests

# 寻找最快的 GitHub 代理
python3 .claude/skills/scripts/mirror-scout.py --github --top 5

# 寻找最快的 Docker Hub 镜像
python3 .claude/skills/scripts/mirror-scout.py --top 5
```

## 技能用法

当 Claude 需要从 GitHub 下载时，该技能会：

1. 运行 `mirror-scout.py --github` 对可用代理进行测速
2. 从排名中选出最快的一个
3. 将其作为前置镜像拼接实际下载 URL：
   ```bash
   # 原本：git clone https://github.com/user/repo.git
   # 改为：git clone https://BEST_MIRROR/https://github.com/user/repo.git
   ```

## 项目结构

```
github-mirror/
├── SKILL.md                          # Skill 定义（唯一来源）
├── scripts/
│   └── mirror-scout.py               # 核心测速工具
├── CLAUDE.md
└── README.md
```
