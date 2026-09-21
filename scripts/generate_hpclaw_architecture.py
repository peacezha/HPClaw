from __future__ import annotations

import html
import os
import struct
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "docs" / "figures"
PNG_PATH = OUT_DIR / "hpclaw_architecture_flow.png"
PSD_PATH = OUT_DIR / "hpclaw_architecture_flow.psd"
SVG_PATH = OUT_DIR / "hpclaw_architecture_flow.svg"

W, H = 3200, 1900


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        r"C:\Windows\Fonts\msyhbd.ttc" if bold else r"C:\Windows\Fonts\msyh.ttc",
        r"C:\Windows\Fonts\simhei.ttf",
        r"C:\Windows\Fonts\simsun.ttc",
        r"C:\Windows\Fonts\arial.ttf",
    ]
    for p in candidates:
        if p and os.path.exists(p):
            return ImageFont.truetype(p, size=size)
    return ImageFont.load_default()


FONT_TITLE = font(74, True)
FONT_SUBTITLE = font(32)
FONT_H1 = font(38, True)
FONT_H2 = font(30, True)
FONT_BODY = font(25)
FONT_SMALL = font(21)
FONT_TINY = font(18)
FONT_ICON = font(42, True)


COLORS = {
    "bg": "#F6F8FB",
    "ink": "#172033",
    "muted": "#566174",
    "line": "#B9C3D3",
    "browser": "#E8F4FF",
    "backend": "#ECF8F1",
    "ai": "#FFF3D9",
    "hpc": "#F3EDFF",
    "support": "#F1F4F8",
    "accent_blue": "#2D7DD2",
    "accent_green": "#2EAD65",
    "accent_gold": "#D89116",
    "accent_purple": "#7856D6",
    "accent_red": "#D24B4B",
    "deep": "#111827",
    "cyan": "#18A8C9",
    "teal": "#19A885",
    "lavender": "#EDE9FE",
    "paper": "#FAFCFF",
    "white": "#FFFFFF",
}


@dataclass
class Box:
    key: str
    x: int
    y: int
    w: int
    h: int
    title: str
    lines: list[str]
    fill: str
    stroke: str

    @property
    def cx(self) -> int:
        return self.x + self.w // 2

    @property
    def cy(self) -> int:
        return self.y + self.h // 2

    @property
    def right(self) -> int:
        return self.x + self.w

    @property
    def bottom(self) -> int:
        return self.y + self.h


def rounded_rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], radius: int, fill: str, outline: str, width: int = 4) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def draw_wrapped(
    draw: ImageDraw.ImageDraw,
    text: str,
    xy: tuple[int, int],
    max_width: int,
    fnt: ImageFont.FreeTypeFont,
    fill: str,
    line_gap: int = 8,
) -> int:
    x, y = xy
    lines: list[str] = []
    current = ""
    for ch in text:
        test = current + ch
        width = draw.textbbox((0, 0), test, font=fnt)[2]
        if width > max_width and current:
            lines.append(current)
            current = ch
        else:
            current = test
    if current:
        lines.append(current)
    for line in lines:
        draw.text((x, y), line, font=fnt, fill=fill)
        y += fnt.size + line_gap
    return y


def draw_box(draw: ImageDraw.ImageDraw, b: Box) -> None:
    rounded_rect(draw, (b.x, b.y, b.right, b.bottom), 28, b.fill, b.stroke, 5)
    draw.text((b.x + 34, b.y + 26), b.title, font=FONT_H2, fill=COLORS["ink"])
    y = b.y + 82
    for line in b.lines:
        y = draw_wrapped(draw, "• " + line, (b.x + 36, y), b.w - 72, FONT_BODY, COLORS["muted"], 7)
        y += 2


def arrow(
    draw: ImageDraw.ImageDraw,
    start: tuple[int, int],
    end: tuple[int, int],
    color: str = COLORS["accent_blue"],
    width: int = 7,
    label: str | None = None,
    label_offset: tuple[int, int] = (0, -36),
) -> None:
    x1, y1 = start
    x2, y2 = end
    draw.line((x1, y1, x2, y2), fill=color, width=width)
    # Arrow head
    import math

    angle = math.atan2(y2 - y1, x2 - x1)
    head_len = 28
    spread = 0.45
    p1 = (x2 - head_len * math.cos(angle - spread), y2 - head_len * math.sin(angle - spread))
    p2 = (x2 - head_len * math.cos(angle + spread), y2 - head_len * math.sin(angle + spread))
    draw.polygon([(x2, y2), p1, p2], fill=color)
    if label:
        bx = (x1 + x2) // 2 + label_offset[0]
        by = (y1 + y2) // 2 + label_offset[1]
        pad_x, pad_y = 15, 8
        bbox = draw.textbbox((0, 0), label, font=FONT_SMALL)
        tw, th = bbox[2], bbox[3]
        rounded_rect(draw, (bx - pad_x, by - pad_y, bx + tw + pad_x, by + th + pad_y), 12, COLORS["white"], "#D9E0EA", 2)
        draw.text((bx, by), label, font=FONT_SMALL, fill=color)


def poly_arrow(
    draw: ImageDraw.ImageDraw,
    points: list[tuple[int, int]],
    color: str = COLORS["accent_blue"],
    width: int = 7,
    label: str | None = None,
    label_pos: tuple[int, int] | None = None,
) -> None:
    for a, b in zip(points, points[1:]):
        draw.line((*a, *b), fill=color, width=width)
    arrow(draw, points[-2], points[-1], color=color, width=width, label=None)
    if label and label_pos:
        x, y = label_pos
        pad_x, pad_y = 15, 8
        bbox = draw.textbbox((0, 0), label, font=FONT_SMALL)
        tw, th = bbox[2], bbox[3]
        rounded_rect(draw, (x - pad_x, y - pad_y, x + tw + pad_x, y + th + pad_y), 12, COLORS["white"], "#D9E0EA", 2)
        draw.text((x, y), label, font=FONT_SMALL, fill=color)


def draw_section_label(draw: ImageDraw.ImageDraw, x: int, y: int, text: str, color: str) -> None:
    bbox = draw.textbbox((0, 0), text, font=FONT_H1)
    rounded_rect(draw, (x, y, x + bbox[2] + 42, y + 58), 18, color, color, 2)
    draw.text((x + 22, y + 10), text, font=FONT_H1, fill=COLORS["white"])


def center_text(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], text: str, fnt: ImageFont.FreeTypeFont, fill: str) -> None:
    x1, y1, x2, y2 = box
    bbox = draw.textbbox((0, 0), text, font=fnt)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text((x1 + (x2 - x1 - tw) / 2, y1 + (y2 - y1 - th) / 2 - 2), text, font=fnt, fill=fill)


def draw_browser_illustration(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int) -> None:
    rounded_rect(draw, (x, y, x + w, y + h), 34, "#FFFFFF", "#C5D7F2", 4)
    draw.rounded_rectangle((x, y, x + w, y + 78), radius=34, fill="#EAF3FF", outline="#C5D7F2", width=0)
    draw.rectangle((x, y + 42, x + w, y + 78), fill="#EAF3FF")
    for i, c in enumerate(["#FF6B6B", "#F7B731", "#20C997"]):
        draw.ellipse((x + 34 + i * 36, y + 27, x + 54 + i * 36, y + 47), fill=c)
    rounded_rect(draw, (x + 158, y + 22, x + w - 34, y + 56), 14, "#FFFFFF", "#D7E4F7", 2)
    draw.text((x + 178, y + 27), "https://hpclaw.local", font=FONT_TINY, fill="#718096")

    # Terminal panel
    rounded_rect(draw, (x + 34, y + 105, x + w - 230, y + h - 36), 22, COLORS["deep"], "#20304A", 3)
    tx, ty = x + 62, y + 136
    term_lines = [
        "$ pwd",
        "/home/user/rnaseq",
        "$ bjobs -w",
        "JOBID  STAT  QUEUE",
        "$ module av fastqc",
    ]
    for i, line in enumerate(term_lines):
        color = "#A7F3D0" if line.startswith("$") else "#D8E2F1"
        draw.text((tx, ty + i * 34), line, font=FONT_TINY, fill=color)

    # AI side panel
    rounded_rect(draw, (x + w - 205, y + 105, x + w - 34, y + h - 36), 22, "#F8FAFF", "#C9D6EA", 3)
    draw.text((x + w - 180, y + 132), "AI", font=FONT_H2, fill=COLORS["accent_blue"])
    for i, ww in enumerate([110, 132, 90, 122]):
        draw.rounded_rectangle((x + w - 178, y + 184 + i * 36, x + w - 178 + ww, y + 202 + i * 36), radius=9, fill="#DCEBFF")
    draw.rounded_rectangle((x + w - 178, y + h - 98, x + w - 62, y + h - 64), radius=14, fill=COLORS["accent_blue"])
    center_text(draw, (x + w - 178, y + h - 98, x + w - 62, y + h - 64), "执行", FONT_TINY, "#FFFFFF")


def draw_server_stack(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int, color: str) -> None:
    for i in range(4):
        yy = y + i * (h // 4 + 8)
        rounded_rect(draw, (x, yy, x + w, yy + h // 4), 18, "#FFFFFF", color, 4)
        draw.ellipse((x + 24, yy + 22, x + 44, yy + 42), fill=color)
        draw.rounded_rectangle((x + 70, yy + 22, x + w - 30, yy + 38), radius=8, fill="#DDE8F5")


def draw_ai_chip(draw: ImageDraw.ImageDraw, x: int, y: int, size: int) -> None:
    # Pins
    for i in range(7):
        off = 26 + i * (size - 52) / 6
        draw.line((x + off, y - 20, x + off, y), fill=COLORS["accent_gold"], width=5)
        draw.line((x + off, y + size, x + off, y + size + 20), fill=COLORS["accent_gold"], width=5)
        draw.line((x - 20, y + off, x, y + off), fill=COLORS["accent_gold"], width=5)
        draw.line((x + size, y + off, x + size + 20, y + off), fill=COLORS["accent_gold"], width=5)
    rounded_rect(draw, (x, y, x + size, y + size), 34, "#FFF4D8", COLORS["accent_gold"], 5)
    draw.ellipse((x + 56, y + 55, x + size - 56, y + size - 55), fill="#FFFFFF", outline=COLORS["accent_gold"], width=5)
    draw.arc((x + 78, y + 75, x + size - 78, y + size - 75), 200, 340, fill=COLORS["accent_gold"], width=5)
    draw.line((x + size // 2, y + 76, x + size // 2, y + size - 74), fill=COLORS["accent_gold"], width=5)
    draw.text((x + 82, y + size // 2 - 28), "AI", font=FONT_TITLE, fill=COLORS["accent_gold"])


def draw_hpc_rack(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int) -> None:
    rounded_rect(draw, (x, y, x + w, y + h), 28, "#F7F2FF", COLORS["accent_purple"], 5)
    for i in range(5):
        yy = y + 38 + i * 78
        rounded_rect(draw, (x + 34, yy, x + w - 34, yy + 54), 13, "#FFFFFF", "#CDBBFF", 3)
        draw.ellipse((x + 58, yy + 18, x + 76, yy + 36), fill="#7C5CE0")
        for j in range(5):
            draw.rounded_rectangle((x + 110 + j * 46, yy + 19, x + 142 + j * 46, yy + 35), radius=7, fill="#D7CCFF")
    draw.text((x + 55, y + h - 62), "HPC Cluster", font=FONT_H2, fill=COLORS["accent_purple"])


def draw_queue_board(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int) -> None:
    rounded_rect(draw, (x, y, x + w, y + h), 28, "#FFFFFF", COLORS["accent_purple"], 4)
    draw.text((x + 32, y + 28), "LSF Job Queue", font=FONT_H2, fill=COLORS["accent_purple"])
    statuses = [("RUN", "#19A885"), ("PEND", "#D89116"), ("DONE", "#2D7DD2"), ("EXIT", "#D24B4B")]
    yy = y + 90
    for i, (s, c) in enumerate(statuses):
        draw.rounded_rectangle((x + 34, yy + i * 52, x + 116, yy + 34 + i * 52), radius=12, fill=c)
        center_text(draw, (x + 34, yy + i * 52, x + 116, yy + 34 + i * 52), s, FONT_TINY, "#FFFFFF")
        draw.rounded_rectangle((x + 138, yy + 7 + i * 52, x + w - 36, yy + 24 + i * 52), radius=8, fill="#E8EAF1")


def draw_book_stack(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int) -> None:
    colors = [COLORS["accent_blue"], COLORS["accent_green"], COLORS["accent_gold"], COLORS["accent_purple"]]
    for i, c in enumerate(colors):
        yy = y + i * 42
        rounded_rect(draw, (x + i * 10, yy, x + w - i * 8, yy + 58), 12, c, c, 2)
        draw.rectangle((x + 30 + i * 10, yy + 9, x + 44 + i * 10, yy + 49), fill="#FFFFFF")
    draw.text((x, y + h - 48), "Skills", font=FONT_H2, fill="#334155")


def draw_mini_books(draw: ImageDraw.ImageDraw, x: int, y: int) -> None:
    colors = [COLORS["accent_blue"], COLORS["accent_green"], COLORS["accent_gold"], COLORS["accent_purple"]]
    for i, c in enumerate(colors):
        yy = y + i * 28
        rounded_rect(draw, (x + i * 8, yy, x + 150 - i * 5, yy + 40), 9, c, c, 2)
        draw.rectangle((x + 20 + i * 8, yy + 7, x + 30 + i * 8, yy + 33), fill="#FFFFFF")


def draw_mini_database(draw: ImageDraw.ImageDraw, x: int, y: int) -> None:
    w, h = 130, 120
    draw.ellipse((x, y, x + w, y + 34), fill="#FFFFFF", outline="#64748B", width=4)
    draw.rectangle((x, y + 17, x + w, y + h - 17), fill="#FFFFFF", outline="#64748B", width=4)
    draw.ellipse((x, y + h - 34, x + w, y + h), fill="#FFFFFF", outline="#64748B", width=4)
    draw.arc((x, y + 42, x + w, y + 76), 0, 180, fill="#CBD5E1", width=3)


def draw_mini_files(draw: ImageDraw.ImageDraw, x: int, y: int) -> None:
    exts = [("FQ", "#2D7DD2"), ("BAM", "#19A885"), ("VCF", "#D89116"), ("PNG", "#7856D6")]
    for i, (ext, c) in enumerate(exts):
        xx = x + i * 48
        yy = y + (i % 2) * 14
        rounded_rect(draw, (xx, yy, xx + 38, yy + 62), 7, "#FFFFFF", c, 3)
        center_text(draw, (xx + 2, yy + 26, xx + 36, yy + 50), ext, FONT_TINY, c)


def draw_mini_pipeline(draw: ImageDraw.ImageDraw, x: int, y: int) -> None:
    items = [(COLORS["accent_blue"], "1"), (COLORS["accent_green"], "2"), (COLORS["accent_gold"], "3"), (COLORS["accent_purple"], "4"), (COLORS["accent_red"], "5")]
    xx = x
    for c, n in items:
        draw.ellipse((xx, y, xx + 30, y + 30), fill="#FFFFFF", outline=c, width=3)
        center_text(draw, (xx, y, xx + 30, y + 30), n, FONT_TINY, c)
        if n != "5":
            arrow(draw, (xx + 32, y + 15), (xx + 54, y + 15), c, 3)
        xx += 56


def draw_database(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int) -> None:
    draw.ellipse((x, y, x + w, y + 54), fill="#FFFFFF", outline="#64748B", width=4)
    draw.rectangle((x, y + 27, x + w, y + h - 27), fill="#FFFFFF", outline="#64748B", width=4)
    draw.ellipse((x, y + h - 54, x + w, y + h), fill="#FFFFFF", outline="#64748B", width=4)
    for yy in [y + 72, y + 126]:
        draw.arc((x, yy - 27, x + w, yy + 27), 0, 180, fill="#CBD5E1", width=3)
    draw.text((x - 12, y + h + 22), "Memory", font=FONT_H2, fill="#334155")


def draw_file_cards(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int) -> None:
    exts = [("FASTQ", "#2D7DD2"), ("BAM", "#19A885"), ("VCF", "#D89116"), ("PNG", "#7856D6")]
    for i, (ext, c) in enumerate(exts):
        xx = x + i * 92
        rounded_rect(draw, (xx, y + (i % 2) * 24, xx + 74, y + 112 + (i % 2) * 24), 10, "#FFFFFF", c, 3)
        draw.polygon([(xx + 50, y + (i % 2) * 24), (xx + 74, y + 24 + (i % 2) * 24), (xx + 50, y + 24 + (i % 2) * 24)], fill="#EEF2FF")
        center_text(draw, (xx + 4, y + 50 + (i % 2) * 24, xx + 70, y + 84 + (i % 2) * 24), ext, FONT_TINY, c)
    draw.text((x + 6, y + h - 38), "Artifacts", font=FONT_H2, fill="#334155")


def draw_pipeline_badges(draw: ImageDraw.ImageDraw, x: int, y: int, step_w: int = 148, gap: int = 50, fnt: ImageFont.FreeTypeFont = FONT_SMALL) -> None:
    items = [("探查", COLORS["accent_blue"]), ("检索技能", COLORS["accent_green"]), ("生成命令", COLORS["accent_gold"]), ("提交/监控", COLORS["accent_purple"]), ("解释结果", COLORS["accent_red"])]
    xx = x
    for label, c in items:
        rounded_rect(draw, (xx, y, xx + step_w, y + 48), 20, "#FFFFFF", c, 3)
        center_text(draw, (xx, y, xx + step_w, y + 48), label, fnt, c)
        if label != items[-1][0]:
            arrow(draw, (xx + step_w, y + 24), (xx + step_w + gap - 10, y + 24), c, 4)
        xx += step_w + gap


def create_diagram() -> Image.Image:
    img = Image.new("RGB", (W, H), COLORS["bg"])
    draw = ImageDraw.Draw(img)

    # Background bands
    draw.rounded_rectangle((90, 170, 3110, 1715), radius=36, fill="#FFFFFF", outline="#DDE4EE", width=3)
    draw.rectangle((90, 170, 3110, 300), fill="#FFFFFF")

    draw.text((120, 55), "HPClaw 项目架构流程图", font=FONT_TITLE, fill=COLORS["ink"])
    draw.text(
        (122, 136),
        "面向生物信息学 HPC 集群的 Web SSH 终端 + AI Agent + 技能知识库 + LSF 作业与文件管理一体化平台",
        font=FONT_SUBTITLE,
        fill=COLORS["muted"],
    )

    draw_section_label(draw, 120, 218, "前端工作台", COLORS["accent_blue"])
    draw_section_label(draw, 790, 218, "后端编排层", COLORS["accent_green"])
    draw_section_label(draw, 1510, 218, "AI Agent 与知识层", COLORS["accent_gold"])
    draw_section_label(draw, 2360, 218, "HPC 集群", COLORS["accent_purple"])

    boxes = {
        "browser": Box(
            "browser",
            120,
            330,
            540,
            330,
            "React Web 工作台",
            [
                "SSH + 2FA 登录",
                "xterm.js 终端实时交互",
                "AIChat 深度/快速思考",
                "文件、技能、历史面板",
            ],
            COLORS["browser"],
            COLORS["accent_blue"],
        ),
        "terminal_ai": Box(
            "terminal_ai",
            120,
            740,
            540,
            270,
            "终端增强交互",
            [
                "命令补全与候选提示",
                "选中文本发给 AI 分析",
                "富内容卡片展示结果",
            ],
            "#EDF7FF",
            COLORS["accent_blue"],
        ),
        "api": Box(
            "api",
            800,
            330,
            560,
            330,
            "Express + Socket.IO + SSE",
            [
                "登录、登出、会话认证",
                "AI 流式事件返回",
                "文件 / 技能 / 对话 API",
                "统一前后端状态同步",
            ],
            COLORS["backend"],
            COLORS["accent_green"],
        ),
        "ssh": Box(
            "ssh",
            800,
            740,
            560,
            270,
            "SSH 会话与命令队列",
            [
                "OpenSSH + SSH_ASKPASS",
                "Socket.IO 连接标准流",
                "runViaSSH 串行化命令",
            ],
            "#EAF9EF",
            COLORS["accent_green"],
        ),
        "agent": Box(
            "agent",
            1500,
            330,
            680,
            330,
            "AI Agent 执行循环",
            [
                "DeepSeek / OpenAI / Gemini / Grok / Moonshot",
                "run_command / search_skills / save_skill / ask_user",
                "关键参数缺失或高影响操作先追问",
            ],
            COLORS["ai"],
            COLORS["accent_gold"],
        ),
        "context": Box(
            "context",
            1500,
            740,
            680,
            270,
            "集群感知上下文",
            [
                "pwd / ls / bjobs / quota / module 快照",
                "FASTQ、BAM、VCF、FASTA、LSF 文件识别",
                "技能、记忆、观测、对话历史动态裁剪",
            ],
            "#FFF7E7",
            COLORS["accent_gold"],
        ),
        "hpc": Box(
            "hpc",
            2340,
            330,
            720,
            330,
            "远程 HPC 集群",
            [
                "登录节点：网络下载、环境探查、文件管理",
                "计算节点：比对、组装、定量等纯计算",
                "Module 软件环境与用户工作目录",
            ],
            COLORS["hpc"],
            COLORS["accent_purple"],
        ),
        "lsf": Box(
            "lsf",
            2340,
            740,
            720,
            270,
            "LSF 作业系统",
            [
                "bsub 提交 .lsf 脚本",
                "bjobs / bhist / bpeek 监控状态与日志",
                "NCPGR 队列、核心数和资源申请规范",
            ],
            "#F6F0FF",
            COLORS["accent_purple"],
        ),
        "skills": Box(
            "skills",
            120,
            1190,
            620,
            330,
            "技能知识库",
            [
                "本地 skills/、导入技能、LSF 模板",
                "远程 ~/hpclaw_skills 文本技能扫描",
                "SkillGraph：依赖、关联、组合、解决关系",
            ],
            COLORS["support"],
            "#607089",
        ),
        "memory": Box(
            "memory",
            860,
            1190,
            620,
            330,
            "会话记忆与观测",
            [
                "远程保存对话 JSON",
                "结构化记录任务、进度、事实、决策、错误",
                "观测命令、输出、作业、文件事件",
            ],
            COLORS["support"],
            "#607089",
        ),
        "files": Box(
            "files",
            1600,
            1190,
            620,
            330,
            "远程文件与结果",
            [
                "目录浏览、批量读取、上传、下载、预览",
                "序列、变异、表格、图像、日志卡片展示",
                "Base64 + 非 PTY SSH 传输",
            ],
            COLORS["support"],
            "#607089",
        ),
        "workflow": Box(
            "workflow",
            2340,
            1190,
            720,
            330,
            "典型分析流程",
            [
                "用户描述任务 → AI 探查目录/作业/配额",
                "检索技能与集群规范 → 生成命令或 LSF 脚本",
                "执行、监控、解释结果 → 更新记忆与技能",
            ],
            COLORS["support"],
            "#607089",
        ),
    }

    for b in boxes.values():
        draw_box(draw, b)

    # Main top flow
    arrow(draw, (boxes["browser"].right, boxes["browser"].cy - 30), (boxes["api"].x, boxes["api"].cy - 30), COLORS["accent_blue"], label="HTTP / WebSocket / SSE")
    arrow(draw, (boxes["api"].right, boxes["api"].cy - 30), (boxes["agent"].x, boxes["agent"].cy - 30), COLORS["accent_green"], label="AI 请求与流式事件")
    arrow(draw, (boxes["agent"].right, boxes["agent"].cy - 30), (boxes["hpc"].x, boxes["hpc"].cy - 30), COLORS["accent_gold"], label="工具调用")

    # SSH and job flow
    arrow(draw, (boxes["terminal_ai"].right, boxes["terminal_ai"].cy), (boxes["ssh"].x, boxes["ssh"].cy), COLORS["accent_blue"], label="终端输入/输出")
    arrow(draw, (boxes["ssh"].right, boxes["ssh"].cy), (boxes["context"].x, boxes["context"].cy), COLORS["accent_green"], label="真实命令输出")
    arrow(draw, (boxes["context"].right, boxes["context"].cy), (boxes["lsf"].x, boxes["lsf"].cy), COLORS["accent_gold"], label="作业/文件操作")
    arrow(draw, (boxes["hpc"].cx, boxes["hpc"].bottom), (boxes["lsf"].cx, boxes["lsf"].y), COLORS["accent_purple"], label="调度与资源")

    # Support bus with right-angle connectors
    bus_y = 1118
    draw.line((260, bus_y, 2920, bus_y), fill="#718096", width=6)
    for b in [boxes["skills"], boxes["memory"], boxes["files"], boxes["workflow"]]:
      draw.line((b.cx, b.y, b.cx, bus_y), fill="#718096", width=6)
    poly_arrow(draw, [(1770, bus_y), (1770, boxes["context"].bottom)], "#718096", 6, label="技能、记忆、文件、流程支撑", label_pos=(1420, bus_y - 40))

    # Footer notes
    footer = [
        "核心约束：AI 不凭空假设，先读取真实集群状态；长任务走 LSF；关键参数缺失时先问再做。",
        "适用场景：RNA-seq 质控/比对/定量、作业监控、远程文件预览、终端错误解释、集群知识沉淀。",
    ]
    y = 1645
    for text in footer:
        y = draw_wrapped(draw, text, (145, y), 2920, FONT_SMALL, COLORS["muted"], 5)

    draw.text((145, 1810), "Generated for HPClaw architecture documentation", font=FONT_TINY, fill="#8B96A8")
    return img


def create_illustrated_diagram() -> Image.Image:
    img = Image.new("RGB", (W, H), "#F3F6FB")
    draw = ImageDraw.Draw(img)

    # Soft backdrop
    draw.rounded_rectangle((70, 55, 3130, 1840), radius=42, fill="#FFFFFF", outline="#DCE4F0", width=3)
    draw.text((132, 110), "HPClaw 架构流程图", font=FONT_TITLE, fill=COLORS["ink"])
    draw.text((136, 192), "从浏览器自然语言请求，到 AI Agent 编排，再到真实 HPC/LSF 执行环境", font=FONT_SUBTITLE, fill=COLORS["muted"])

    # Main visual panels
    draw_browser_illustration(draw, 150, 315, 760, 470)
    draw_server_stack(draw, 1070, 350, 355, 340, COLORS["accent_green"])
    draw_ai_chip(draw, 1590, 345, 300)
    draw_hpc_rack(draw, 2225, 300, 370, 440)
    draw_queue_board(draw, 2655, 345, 360, 350)

    # Titles under/near illustrations
    center_text(draw, (150, 810, 910, 865), "浏览器工作台", FONT_H1, COLORS["accent_blue"])
    center_text(draw, (1000, 720, 1500, 775), "后端编排服务", FONT_H1, COLORS["accent_green"])
    center_text(draw, (1510, 720, 1970, 775), "AI Agent", FONT_H1, COLORS["accent_gold"])
    center_text(draw, (2180, 765, 2605, 820), "HPC 计算环境", FONT_H1, COLORS["accent_purple"])
    center_text(draw, (2635, 720, 3035, 775), "LSF 作业调度", FONT_H1, COLORS["accent_purple"])

    # Main arrows
    arrow(draw, (910, 545), (1065, 545), COLORS["accent_blue"], 9, "HTTP / WebSocket / SSE", (-62, -44))
    arrow(draw, (1435, 545), (1585, 545), COLORS["accent_green"], 9, "上下文构建", (-36, -44))
    arrow(draw, (1905, 545), (2220, 520), COLORS["accent_gold"], 9, "工具调用 run_command", (-72, -54))
    arrow(draw, (2595, 520), (2650, 520), COLORS["accent_purple"], 9, "bsub / bjobs", (-72, -44))

    # Orchestrator caption card
    rounded_rect(draw, (980, 815, 1985, 1035), 28, "#F8FBFF", "#D8E2F0", 3)
    draw.text((1028, 852), "核心执行循环", font=FONT_H1, fill=COLORS["ink"])
    draw_wrapped(
        draw,
        "用户描述任务后，HPClaw 采集 pwd、ls、bjobs、quota、module 等真实状态，检索技能与集群规范，再由 AI Agent 选择执行命令、搜索技能、保存经验或向用户追问。",
        (1028, 910),
        900,
        FONT_BODY,
        COLORS["muted"],
        8,
    )

    # Feature cards around the main pipeline
    feature_specs = [
        (150, 930, 360, 205, "SSH + 2FA", "SSH_ASKPASS 自动应答密码与验证码，Socket.IO 实时连接终端。", COLORS["accent_blue"]),
        (550, 930, 360, 205, "富内容结果", "代码、表格、图像、FASTA/FASTQ、VCF、日志以卡片展示。", COLORS["accent_blue"]),
        (2225, 860, 370, 205, "集群约束", "登录节点处理网络操作，长计算任务提交到计算节点。", COLORS["accent_purple"]),
        (2645, 860, 370, 205, "作业监控", "bsub 提交 .lsf，bjobs/bhist/bpeek 追踪状态和日志。", COLORS["accent_purple"]),
    ]
    for x, y, w, h, title, body, c in feature_specs:
        rounded_rect(draw, (x, y, x + w, y + h), 24, "#FFFFFF", c, 4)
        draw.text((x + 28, y + 28), title, font=FONT_H2, fill=c)
        draw_wrapped(draw, body, (x + 28, y + 82), w - 56, FONT_SMALL, COLORS["muted"], 6)

    # Support layer
    rounded_rect(draw, (150, 1210, 3015, 1585), 34, "#F8FAFE", "#D8E2F0", 3)
    draw.text((190, 1248), "支撑能力层", font=FONT_H1, fill=COLORS["ink"])
    support_cards = [
        (210, 1305, 640, 230, "技能知识库", COLORS["accent_blue"], "本地 skills、导入技能、LSF/NCPGR 模板、远程 ~/hpclaw_skills；SkillGraph 扩展依赖、关联与解决关系。"),
        (900, 1305, 640, 230, "记忆与观测", "#64748B", "远程保存对话 JSON；结构化记录任务、进度、关键事实、决策、错误和命令观测。"),
        (1590, 1305, 640, 230, "远程文件产物", COLORS["accent_purple"], "目录浏览、批量读取、上传下载、预览；序列、变异、表格、图像和日志卡片展示。"),
        (2280, 1305, 680, 230, "典型分析链路", COLORS["accent_green"], "自然语言任务经过探查、技能检索、命令生成、提交监控和结果解释，最后沉淀为记忆与技能。"),
    ]
    for x, y, w, h, title, c, body in support_cards:
        rounded_rect(draw, (x, y, x + w, y + h), 24, "#FFFFFF", "#D5DFED", 3)
        icon_x, icon_y = x + 36, y + 58
        if title == "技能知识库":
            draw_mini_books(draw, icon_x, icon_y)
        elif title == "记忆与观测":
            draw_mini_database(draw, icon_x + 15, icon_y + 6)
        elif title == "远程文件产物":
            draw_mini_files(draw, icon_x + 2, icon_y + 12)
        else:
            draw_mini_pipeline(draw, icon_x + 2, icon_y + 32)
        text_x = x + (285 if title == "典型分析链路" else 220)
        body_width = w - (315 if title == "典型分析链路" else 250)
        draw.text((text_x, y + 32), title, font=FONT_H2, fill=c)
        draw_wrapped(draw, body, (text_x, y + 86), body_width, FONT_SMALL, COLORS["muted"], 6)

    # Flow label band
    rounded_rect(draw, (300, 1650, 2870, 1738), 28, "#ECFDF5", COLORS["accent_green"], 3)
    flow = "自然语言任务 → 实时集群探查 → 技能/记忆注入 → 命令或 LSF 脚本生成 → 执行/监控 → 结果解释与知识沉淀"
    center_text(draw, (300, 1650, 2870, 1738), flow, FONT_H2, COLORS["accent_green"])

    draw.text((135, 1785), "核心原则：AI 不凭空假设；高风险或关键参数缺失时先问再做；长任务遵循 LSF 和 NCPGR 集群规范。", font=FONT_SMALL, fill=COLORS["muted"])
    return img


def write_flat_psd(path: Path, image: Image.Image) -> None:
    """Write a simple Photoshop-compatible flattened RGB PSD."""
    rgb = image.convert("RGB")
    w, h = rgb.size
    r, g, b = rgb.split()
    with path.open("wb") as f:
        f.write(b"8BPS")
        f.write(struct.pack(">H", 1))
        f.write(b"\x00" * 6)
        f.write(struct.pack(">HIIHH", 3, h, w, 8, 3))
        f.write(struct.pack(">I", 0))  # Color mode data
        f.write(struct.pack(">I", 0))  # Image resources
        f.write(struct.pack(">I", 0))  # Layer/mask info
        f.write(struct.pack(">H", 0))  # Raw image data
        f.write(r.tobytes())
        f.write(g.tobytes())
        f.write(b.tobytes())


def svg_rect(x: int, y: int, w: int, h: int, fill: str, stroke: str, rx: int = 24) -> str:
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="4"/>'


def svg_text(x: int, y: int, text: str, size: int = 26, weight: int = 400, fill: str = COLORS["ink"]) -> str:
    return f'<text x="{x}" y="{y}" font-family="Microsoft YaHei, SimHei, Arial" font-size="{size}" font-weight="{weight}" fill="{fill}">{html.escape(text)}</text>'


def write_svg(path: Path, png_path: Path) -> None:
    import base64

    encoded = base64.b64encode(png_path.read_bytes()).decode("ascii")
    content = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
  <image href="data:image/png;base64,{encoded}" x="0" y="0" width="{W}" height="{H}"/>
</svg>'''
    path.write_text(content, encoding="utf-8")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    img = create_illustrated_diagram()
    img.save(PNG_PATH, "PNG")
    write_flat_psd(PSD_PATH, img)
    write_svg(SVG_PATH, PNG_PATH)
    print(PNG_PATH)
    print(PSD_PATH)
    print(SVG_PATH)


if __name__ == "__main__":
    main()
