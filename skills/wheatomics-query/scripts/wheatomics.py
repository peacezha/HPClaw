#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# ============================================================================
# wheatomics.py — WheatOmics 数据查询命令行工具
#
# 【零依赖】仅使用 Python 标准库（argparse / urllib / json / sys / os / time /
# socket），Python 3.8+ 直接运行，无需 pip install 任何第三方包。
#
# 【用法示例】
#   1) 查询基因详情（GeneHub）：
#      python wheatomics.py gene TraesCS5A02G391700
#   2) 查询表达谱并把完整 JSON 保存到文件：
#      python wheatomics.py expr-query --genes TraesCS5A02G391700 -o results/expr.json
#   3) GO 富集分析（POST JSON body）：
#      python wheatomics.py enrich-go --genes TraesCS1A02G045300.1,TraesCS1A02G104700.1
#   4) 提交 BLAST 异步作业并轮询等待完成：
#      python wheatomics.py blast submit --database Fielder_protein --query @seq.fa --wait
#   5) 提交 PrimerServer2 引物设计作业（JSON 从文件读取）：
#      python wheatomics.py primer submit --json @design.json --wait -o primer_result.json
#
# 【与 SKILL.md 的对应关系】
#   子命令分组与 ../SKILL.md 的模块章节一一对应：
#     about / health / track-stats                     -> 「平台信息」
#     known-search / known-all / known-chrom / known-gene -> 「Known Genes 克隆基因检索」
#     gene                                             -> 「GeneHub 基因详情」
#     pfam                                             -> 「PfamSearch 结构域检索」
#     interval / genefunc-tables / genefunc-examples / genefunc-registry
#                                                      -> 「IntervalTool 区间工具」
#     expr-projects / expr-query                       -> 「Expression 表达谱」
#     coexpr-databases / coexpr-query / coexpr-projects / coexpr-project
#                                                      -> 「Coexpression 共表达」
#     ppi                                              -> 「PPI 蛋白互作」
#     homologs / synteny / id-conversion / blastp      -> 「比较基因组」
#     orthofinder / orthofinder-download / orthofinder-neighborhood
#                                                      -> 「OrthoFinder」
#     syntenyview-genomes / syntenyview-gene-search / syntenyview-status /
#     syntenyview-triticeae / syntenyview-neighborhood -> 「SynTeny Viewer」
#     seq-gene / seq-interval / seq-batch              -> 「Sequences 序列获取」
#     blast / blast-databases / blast-env              -> 「BLAST 异步比对」
#     enrich-go / enrich-kegg / go-genes / kegg-genes  -> 「GO/KEGG 富集」
#     variant-datasets / variant-dataset-info / variant-samples / variant-query
#                                                      -> 「VariantHub 变异数据」
#     papers / paper / paper-annotation / papers-stats -> 「Triticeae Papers 文献」
#     primer / primer-config / primer-databases / primer-server-info
#                                                      -> 「PrimerServer2 引物设计」
#
# 【通用行为】
#   - 默认平台地址 https://wheatomics.sdau.edu.cn，可用 --base 或环境变量
#     WHEATOMICS_BASE 覆盖；接口前缀 /api 由本工具自动拼接。
#   - 响应信封统一处理：success=false 时打印 error 并以退出码 1 退出；
#     默认把 data 部分 pretty-print 到 stdout；-o/--output 把完整 JSON 响应
#     写盘（自动创建父目录）并打印一行「已保存: 路径」。
#   - 超时默认 30 秒（--timeout 覆盖）；网络错误打印中文报错，退出码 2。
#   - BLAST / PrimerServer2 为异步作业：submit 提交 -> status 轮询 ->
#     result 取结果；submit 加 --wait 自动轮询（上限 --wait-timeout 秒）。
# ============================================================================

import argparse
import json
import os
import socket
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

DEFAULT_BASE = "https://wheatomics.sdau.edu.cn"
DEFAULT_TIMEOUT = 30
DEFAULT_WAIT_TIMEOUT = 600
POLL_INTERVAL = 3

# Windows 终端默认编码可能不是 UTF-8，尽量保证中文/特殊字符正常输出
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
if hasattr(sys.stderr, "reconfigure"):
    try:
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass


class ApiError(Exception):
    """接口返回 success=false 或 HTTP 错误。"""


class NetworkError(Exception):
    """网络/超时类错误。"""


class UsageError(Exception):
    """参数组合不合法（argparse 之外的校验）。"""


class WaitTimeout(Exception):
    """--wait 轮询超出时间上限。"""


# ---------------------------------------------------------------------------
# HTTP 客户端
# ---------------------------------------------------------------------------

class Client(object):
    def __init__(self, base, timeout, api_key=None):
        self.base = base.rstrip("/")
        self.timeout = timeout
        self.api_key = api_key

    def _request(self, method, path, params=None, body=None, headers=None):
        url = self.base + path
        if params:
            qs = urllib.parse.urlencode({k: v for k, v in params.items() if v is not None})
            if qs:
                url += "?" + qs
        req = urllib.request.Request(url, data=body, method=method)
        req.add_header("User-Agent", "wheatomics-cli/1.0 (zero-dep; WheatOmics API)")
        if self.api_key:
            req.add_header("x-api-key", self.api_key)
        if headers:
            for k, v in headers.items():
                req.add_header(k, v)
        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                raw = resp.read()
        except urllib.error.HTTPError as e:
            try:
                text = e.read().decode("utf-8", "replace")
            except Exception:
                text = ""
            detail = text[:500]
            try:
                payload = json.loads(text)
                detail = payload.get("detail") or payload.get("message") or detail
            except Exception:
                pass
            raise ApiError("HTTP %s %s -> %s" % (method, url, detail))
        except (urllib.error.URLError, socket.timeout, TimeoutError, OSError) as e:
            reason = getattr(e, "reason", e)
            raise NetworkError(
                "请求 %s 失败（%s）。请检查网络连通性，或用 --timeout 增大超时、"
                "--base 检查平台地址。" % (url, reason))
        text = raw.decode("utf-8", "replace")
        try:
            return json.loads(text)
        except ValueError:
            # 文件下载类端点（Newick/FASTA/HTML 等）可能返回非 JSON
            return {"_raw": text}

    def get(self, path, params=None):
        return self._request("GET", path, params=params)

    def post_json(self, path, obj):
        return self._request(
            "POST", path,
            body=json.dumps(obj).encode("utf-8"),
            headers={"Content-Type": "application/json"})

    def post_form(self, path, mapping):
        return self._request(
            "POST", path,
            body=urllib.parse.urlencode(mapping).encode("utf-8"),
            headers={"Content-Type": "application/x-www-form-urlencoded"})

    def delete(self, path):
        return self._request("DELETE", path)


# ---------------------------------------------------------------------------
# 输出与信封处理
# ---------------------------------------------------------------------------

def unwrap(payload):
    """统一处理响应信封。success=false 抛 ApiError；否则返回 data 部分。"""
    if isinstance(payload, dict):
        if payload.get("success") is False:
            msg = (payload.get("message") or payload.get("error")
                   or json.dumps(payload, ensure_ascii=False)[:500])
            raise ApiError(str(msg))
        if payload.get("success") is True and "data" in payload:
            return payload["data"]
    return payload


def emit(payload, output):
    """data 部分 pretty-print 到 stdout；-o 时把完整 JSON 写盘。

    先写盘后打印：即使 stdout 被管道截断（如 | head），结果文件也已落地。
    """
    if isinstance(payload, dict) and set(payload.keys()) == {"_raw"}:
        text = payload["_raw"]
        if output:
            _write_text(output, text)
        print(text)
        return
    data = unwrap(payload)
    if output:
        _write_text(output, json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(data, ensure_ascii=False, indent=2))


def _write_text(path, text):
    abspath = os.path.abspath(path)
    parent = os.path.dirname(abspath)
    if parent:
        os.makedirs(parent, exist_ok=True)
    with open(abspath, "w", encoding="utf-8") as f:
        f.write(text)
    print("已保存: %s" % abspath)


# ---------------------------------------------------------------------------
# 参数辅助
# ---------------------------------------------------------------------------

def parse_extra_params(items):
    out = {}
    for it in items or []:
        if "=" not in it:
            raise UsageError("--param 需要 KEY=VALUE 格式，收到: %r" % it)
        k, v = it.split("=", 1)
        out[k] = v
    return out


def P(args, **kw):
    """组装 query 参数：跳过 None，合并 --param 附加参数。"""
    params = {k: v for k, v in kw.items() if v is not None}
    params.update(parse_extra_params(getattr(args, "param", None)))
    return params


def split_list(text):
    """把逗号/空白分隔的字符串拆成列表。"""
    if text is None:
        return None
    parts = []
    for chunk in text.replace("\r", "\n").replace("\n", ",").replace(" ", ",").split(","):
        chunk = chunk.strip()
        if chunk:
            parts.append(chunk)
    return parts


def read_json_arg(value):
    """--json 参数：支持 JSON 字面量或 @文件路径。"""
    if value is None:
        return None
    if value.startswith("@"):
        path = value[1:]
        if not os.path.isfile(path):
            raise UsageError("找不到 JSON 文件: %s" % path)
        with open(path, "r", encoding="utf-8") as f:
            value = f.read()
    try:
        return json.loads(value)
    except ValueError as e:
        raise UsageError("--json 不是合法 JSON: %s" % e)


def read_text_arg(value):
    """支持 @文件路径 读取文本内容（如 FASTA）。"""
    if value is None:
        return None
    if value.startswith("@"):
        path = value[1:]
        if not os.path.isfile(path):
            raise UsageError("找不到文件: %s" % path)
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    return value


def extract_job_id(payload):
    if isinstance(payload, dict):
        for key in ("job_id", "jobId"):
            if payload.get(key):
                return payload[key]
        data = payload.get("data")
        if isinstance(data, dict):
            for key in ("job_id", "jobId"):
                if data.get(key):
                    return data[key]
    return None


def log(msg):
    print(msg, file=sys.stderr)


# ---------------------------------------------------------------------------
# 平台信息
# ---------------------------------------------------------------------------

def h_about(args, c):
    return c.get("/api/about", P(args))


def h_health(args, c):
    return c.get("/api/health", P(args))


def h_track_stats(args, c):
    return c.get("/api/track/stats", P(args))


# ---------------------------------------------------------------------------
# 基因检索：Known Genes / GeneHub / PfamSearch / IntervalTool
# ---------------------------------------------------------------------------

def h_known_search(args, c):
    return c.get("/api/genes/known/search", P(args, searchid=args.searchid))


def h_known_all(args, c):
    return c.get("/api/genes/known/all", P(args))


def h_known_chrom(args, c):
    return c.get("/api/genes/known/by-chromosome/" + urllib.parse.quote(args.chromosome), P(args))


def h_known_gene(args, c):
    return c.get("/api/genes/known/" + urllib.parse.quote(args.gene_id), P(args))


def h_gene(args, c):
    return c.get("/api/genes/detail/" + urllib.parse.quote(args.gene_id), P(args))


def h_pfam(args, c):
    return c.get("/api/genes/functions/pfam", P(args, ID=args.pfam_id, table=args.table))


def h_interval(args, c):
    return c.get("/api/genes/functions/interval", P(args, ID=args.region, table=args.table))


def h_genefunc_tables(args, c):
    return c.get("/api/genes/functions/tables", P(args))


def h_genefunc_examples(args, c):
    return c.get("/api/genes/functions/examples", P(args))


def h_genefunc_registry(args, c):
    return c.get("/api/genes/functions/registry", P(args))


# ---------------------------------------------------------------------------
# Expression / Coexpression / PPI
# ---------------------------------------------------------------------------

def h_expr_projects(args, c):
    return c.get("/api/expression/projects", P(args))


def h_expr_query(args, c):
    return c.get("/api/expression/query",
                 P(args, gene_ids=args.genes, project=args.project))


def h_coexpr_databases(args, c):
    return c.get("/api/coexpression/databases", P(args))


def h_coexpr_query(args, c):
    return c.get("/api/coexpression/query",
                 P(args, gene_ids=args.genes, database=args.database,
                   filter_value=args.filter))


def h_coexpr_projects(args, c):
    return c.get("/api/coexpression/projects", P(args, source=args.source, q=args.q))


def h_coexpr_project(args, c):
    return c.get("/api/coexpression/projects/" + urllib.parse.quote(args.accession), P(args))


def h_ppi(args, c):
    return c.get("/api/ppi/query",
                 P(args, gene_ids=args.genes, table=args.table, min_score=args.min_score))


# ---------------------------------------------------------------------------
# 比较基因组 / OrthoFinder / SynTeny Viewer
# ---------------------------------------------------------------------------

def h_homologs(args, c):
    return c.get("/api/homologs/wheat-rice-arabidopsis",
                 P(args, gene_id=args.gene_id, max_targets=args.max_targets))


def h_synteny(args, c):
    return c.get("/api/synteny/search", P(args, ID=args.query, table=args.table))


def h_id_conversion(args, c):
    ids = split_list(args.ids)
    if not ids:
        raise UsageError("--ids 不能为空")
    return c.get("/api/id-conversion",
                 P(args, ID="\r\n".join(ids), gene_version=args.version))


def h_blastp(args, c):
    return c.get("/api/blastp",
                 P(args, gene=args.gene_id, limit=args.limit, offset=args.offset))


def h_orthofinder(args, c):
    return c.get("/api/orthofinder/search",
                 P(args, q=args.q, action=args.action, og=args.og,
                   sub=args.sub, species=args.species))


def h_orthofinder_download(args, c):
    return c.get("/api/orthofinder/download",
                 P(args, og=args.og, type=args.type, cluster=args.cluster,
                   type_tree=args.type_tree))


def h_orthofinder_neighborhood(args, c):
    return c.get("/api/orthofinder/neighborhood", P(args, q=args.gene_id))


def h_syntenyview_genomes(args, c):
    return c.get("/api/syntenyview/genomes", P(args))


def h_syntenyview_gene_search(args, c):
    return c.get("/api/syntenyview/gene-search", P(args, q=args.q, limit=args.limit))


def h_syntenyview_status(args, c):
    return c.get("/api/syntenyview/status", P(args))


def h_syntenyview_triticeae(args, c):
    return c.get("/api/syntenyview/triticeae", P(args))


def h_syntenyview_neighborhood(args, c):
    return c.get("/api/syntenyview/neighborhood",
                 P(args, q=args.gene_id, upstream=args.upstream,
                   downstream=args.downstream, targets=args.targets,
                   window=args.window))


# ---------------------------------------------------------------------------
# Sequences
# ---------------------------------------------------------------------------

def h_seq_gene(args, c):
    return c.get("/api/sequence/by-gene",
                 P(args, gene_id=args.gene_id, gene_db=args.gene_db,
                   protein_db=args.protein_db))


def h_seq_interval(args, c):
    return c.get("/api/sequence/by-interval",
                 P(args, region=args.region, database=args.database))


def h_seq_batch(args, c):
    ids = split_list(args.ids)
    if not ids:
        raise UsageError("--ids 不能为空")
    return c.get("/api/sequence/batch",
                 P(args, ID=" ".join(ids), database=args.database))


# ---------------------------------------------------------------------------
# BLAST（异步作业）
# ---------------------------------------------------------------------------

def h_blast_databases(args, c):
    return c.get("/api/blast/databases", P(args, program=args.program))


def h_blast_env(args, c):
    return c.get("/api/blast/status", P(args))


def _blast_submit(args, c):
    if not args.database:
        raise UsageError("blast submit 需要 --database <数据库名>")
    query = read_text_arg(args.query)
    if not query:
        raise UsageError("blast submit 需要 --query <FASTA序列 或 @文件>")
    form = {"database": args.database, "query": query, "wait": "false"}
    if args.program is not None:
        form["program"] = args.program
    if args.evalue is not None:
        form["evalue"] = args.evalue
    if args.max_target_seqs is not None:
        form["max_target_seqs"] = args.max_target_seqs
    if args.word_size is not None:
        form["word_size"] = args.word_size
    if args.matrix is not None:
        form["matrix"] = args.matrix
    if args.outfmt is not None:
        form["outfmt"] = args.outfmt
    payload = c.post_form("/api/blast/search", form)
    job_id = extract_job_id(payload)
    if not args.wait:
        return payload
    if not job_id:
        raise ApiError("提交成功但未能从响应中解析 job_id: %s"
                       % json.dumps(payload, ensure_ascii=False)[:300])
    log("BLAST 作业已提交: %s，开始轮询（上限 %s 秒）..." % (job_id, args.wait_timeout))
    return _blast_wait(args, c, job_id)


def _blast_status_payload(args, c, job_id):
    return c.get("/api/blast/status/" + urllib.parse.quote(job_id))


def _blast_wait(args, c, job_id):
    deadline = time.time() + args.wait_timeout
    while True:
        payload = _blast_status_payload(args, c, job_id)
        status = payload.get("status") if isinstance(payload, dict) else None
        log("  状态: %s" % status)
        if status == "done":
            return payload
        if status in ("error", "stale"):
            msg = payload.get("message") or status
            raise ApiError("BLAST 作业 %s 失败: %s" % (job_id, msg))
        if time.time() > deadline:
            raise WaitTimeout("BLAST 作业 %s 等待超过 %s 秒仍未完成，"
                              "可稍后执行: blast status %s" % (job_id, args.wait_timeout, job_id))
        time.sleep(POLL_INTERVAL)


def h_blast(args, c):
    if args.action == "submit":
        return _blast_submit(args, c)
    if not args.job_id:
        raise UsageError("blast %s 需要 job_id" % args.action)
    payload = _blast_status_payload(args, c, args.job_id)
    if args.action == "status":
        return payload
    # result: 状态为 done 时返回（含 download_urls），否则报错
    status = payload.get("status") if isinstance(payload, dict) else None
    if status != "done":
        msg = payload.get("message") if isinstance(payload, dict) else None
        raise ApiError("BLAST 作业 %s 当前状态为 %s（%s），尚不能取结果"
                       % (args.job_id, status, msg or ""))
    return payload


# ---------------------------------------------------------------------------
# GO/KEGG 富集
# ---------------------------------------------------------------------------

def _enrich_body(args):
    body = read_json_arg(getattr(args, "json_body", None))
    if body is not None:
        return body
    genes = split_list(args.genes)
    if not genes:
        raise UsageError("需要 --genes <逗号分隔的基因ID列表> 或 --json <JSON>")
    body = {"genes": genes}
    if args.padj is not None:
        body["padj_threshold"] = args.padj
    return body


def h_enrich_go(args, c):
    return c.post_json("/api/go-kegg/go", _enrich_body(args))


def h_enrich_kegg(args, c):
    return c.post_json("/api/go-kegg/kegg", _enrich_body(args))


def h_go_genes(args, c):
    return c.get("/api/go-kegg/go-genes", P(args, go_id=args.go_id, genes=args.genes))


def h_kegg_genes(args, c):
    return c.get("/api/go-kegg/kegg-genes", P(args, pathway=args.pathway, genes=args.genes))


# ---------------------------------------------------------------------------
# VariantHub
# ---------------------------------------------------------------------------

def h_variant_datasets(args, c):
    return c.get("/api/VariantHub/datasets", P(args))


def h_variant_dataset_info(args, c):
    return c.get("/api/VariantHub/dataset_info", P(args, dataset=args.dataset))


def h_variant_samples(args, c):
    return c.get("/api/VariantHub/samples", P(args, dataset=args.dataset))


def h_variant_query(args, c):
    return c.get("/api/VariantHub/query",
                 P(args, dataset=args.dataset, region=args.region,
                   variant_id=args.variant_id, samples=args.samples,
                   limit=args.limit, offset=args.offset))


# ---------------------------------------------------------------------------
# Triticeae Papers
# ---------------------------------------------------------------------------

def h_papers(args, c):
    return c.get("/api/papers",
                 P(args, q=args.q, title=args.title, abstract=args.abstract,
                   journal=args.journal, authors=args.authors,
                   pubmed_keywords=args.pubmed_keywords, ai_tags=args.ai_tags,
                   function_gene_tags=args.function_gene_tags,
                   gene_name=args.gene_name, pmid=args.pmid,
                   functional_gene_flag=args.functional_gene_flag,
                   functional_gene_source=args.functional_gene_source,
                   function_gene_flag=args.function_gene_flag,
                   pub_date_start=args.pub_date_start,
                   pub_date_end=args.pub_date_end,
                   since_days=args.since_days,
                   limit=args.limit, offset=args.offset))


def h_paper(args, c):
    return c.get("/api/papers/" + urllib.parse.quote(args.pmid), P(args))


def h_paper_annotation(args, c):
    return c.get("/api/papers/" + urllib.parse.quote(args.pmid) + "/annotation", P(args))


def h_papers_stats(args, c):
    return c.get("/api/papers/stats", P(args))


# ---------------------------------------------------------------------------
# PrimerServer2（异步作业）
# ---------------------------------------------------------------------------

def h_primer_config(args, c):
    return c.get("/api/PrimerServer2/config", P(args))


def h_primer_databases(args, c):
    return c.get("/api/PrimerServer2/databases", P(args))


def h_primer_server_info(args, c):
    return c.get("/api/PrimerServer2/server-info", P(args))


def _primer_wait(args, c, job_id, job_type):
    deadline = time.time() + args.wait_timeout
    while True:
        payload = c.get("/api/PrimerServer2/jobs/" + urllib.parse.quote(job_id))
        status = payload.get("status") if isinstance(payload, dict) else None
        log("  状态: %s" % status)
        if status == "done":
            return c.get("/api/PrimerServer2/jobs/%s/result" % urllib.parse.quote(job_id),
                         {"job_type": job_type})
        if status in ("error", "stopped"):
            msg = payload.get("message") or status
            raise ApiError("PrimerServer2 作业 %s 失败: %s" % (job_id, msg))
        if time.time() > deadline:
            raise WaitTimeout("PrimerServer2 作业 %s 等待超过 %s 秒仍未完成，"
                              "可稍后执行: primer status %s" % (job_id, args.wait_timeout, job_id))
        time.sleep(POLL_INTERVAL)


def h_primer(args, c):
    action = args.action
    if action in ("submit", "submit-check"):
        body = read_json_arg(args.json_body)
        if body is None:
            raise UsageError("primer %s 需要 --json <JSON字符串 或 @文件>" % action)
        path = "/api/PrimerServer2/jobs" if action == "submit" else "/api/PrimerServer2/jobs/check"
        job_type = "design" if action == "submit" else "check"
        payload = c.post_json(path, body)
        if not args.wait:
            return payload
        job_id = extract_job_id(payload)
        if not job_id:
            raise ApiError("提交成功但未能从响应中解析 jobId: %s"
                           % json.dumps(payload, ensure_ascii=False)[:300])
        log("PrimerServer2 作业已提交: %s，开始轮询（上限 %s 秒）..." % (job_id, args.wait_timeout))
        return _primer_wait(args, c, job_id, job_type)
    if not args.job_id:
        raise UsageError("primer %s 需要 job_id" % action)
    jid = urllib.parse.quote(args.job_id)
    if action == "status":
        return c.get("/api/PrimerServer2/jobs/" + jid)
    if action == "progress":
        return c.get("/api/PrimerServer2/jobs/%s/progress" % jid)
    if action == "result":
        return c.get("/api/PrimerServer2/jobs/%s/result" % jid,
                     {"job_type": args.job_type})
    if action == "delete":
        return c.delete("/api/PrimerServer2/jobs/" + jid)
    if action == "result-html":
        return c.get("/api/PrimerServer2/jobs/%s/result-html" % jid)
    raise UsageError("未知 primer 动作: %s" % action)


# ---------------------------------------------------------------------------
# 命令行解析
# ---------------------------------------------------------------------------

def _add_common(sp):
    sp.add_argument("-o", "--output", metavar="FILE",
                    help="把完整 JSON 响应写入文件（自动创建父目录），并打印「已保存: 路径」")
    sp.add_argument("--timeout", type=float, default=DEFAULT_TIMEOUT,
                    help="单次请求超时秒数，默认 %(default)s")
    sp.add_argument("--base", default=None,
                    help="覆盖平台地址（默认 %s，或用环境变量 WHEATOMICS_BASE）" % DEFAULT_BASE)
    sp.add_argument("--api-key", default=None,
                    help="PrimerServer2 等接口的可选 x-api-key 请求头")
    sp.add_argument("--param", action="append", default=[], metavar="KEY=VALUE",
                    help="附加 query 参数（GET 类子命令），可重复，如 --param country=Turkey")


def _add_async(sp):
    sp.add_argument("--wait", action="store_true",
                    help="submit 后自动轮询直到作业完成并取回结果")
    sp.add_argument("--wait-timeout", type=float, default=DEFAULT_WAIT_TIMEOUT,
                    help="--wait 的最大等待秒数，默认 %(default)s")


def build_parser():
    parser = argparse.ArgumentParser(
        prog="wheatomics.py",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        description="WheatOmics 数据查询 CLI（零依赖，Python 3.8+）。"
                    "详细模块说明见同技能目录下的 SKILL.md。",
        epilog="""示例:
  python wheatomics.py health
  python wheatomics.py gene TraesCS5A02G391700 -o gene.json
  python wheatomics.py expr-query --genes TraesCS5A02G391700
  python wheatomics.py enrich-go --genes TraesCS1A02G045300.1,TraesCS1A02G104700.1
  python wheatomics.py blast submit --database Fielder_protein --query @seq.fa --wait
""")
    sub = parser.add_subparsers(dest="command", metavar="<子命令>")

    def new(name, func, help_text, async_opts=False):
        sp = sub.add_parser(name, help=help_text, description=help_text)
        _add_common(sp)
        if async_opts:
            _add_async(sp)
        sp.set_defaults(func=func)
        return sp

    # 平台信息
    new("about", h_about, "平台信息：应用名称/版本/文档地址 (GET /api/about)")
    new("health", h_health, "平台信息：服务健康检查 (GET /api/health)")
    new("track-stats", h_track_stats, "平台信息：站点访问统计 PV/UV (GET /api/track/stats)")

    # Known Genes
    sp = new("known-search", h_known_search, "克隆基因：按关键词模糊搜索 (GET /api/genes/known/search)")
    sp.add_argument("searchid", help="搜索关键词，如 VRN1")
    new("known-all", h_known_all, "克隆基因：全部已知功能基因列表 (GET /api/genes/known/all)")
    sp = new("known-chrom", h_known_chrom, "克隆基因：按染色体列出 (GET /api/genes/known/by-chromosome/{chr})")
    sp.add_argument("chromosome", help="染色体名，如 5A / chr5A")
    sp = new("known-gene", h_known_gene, "克隆基因：单个基因完整信息 (GET /api/genes/known/{gene_id})")
    sp.add_argument("gene_id", help="基因 ID，如 TraesCS5A02G391700")

    # GeneHub
    sp = new("gene", h_gene, "GeneHub：基因标准化详情，支持 v1/v2/v3 ID (GET /api/genes/detail/{gene_id})")
    sp.add_argument("gene_id", help="基因 ID，如 TraesCS5A02G391700")

    # PfamSearch / IntervalTool
    sp = new("pfam", h_pfam, "PfamSearch：按 PFAM 结构域搜基因 (GET /api/genes/functions/pfam)")
    sp.add_argument("pfam_id", help="PFAM 结构域 ID，如 PF00319")
    sp.add_argument("--table", default=None, help="查询表名，默认 Genefunc_table")
    sp = new("interval", h_interval, "IntervalTool：按染色体区间搜基因 (GET /api/genes/functions/interval)")
    sp.add_argument("region", help="染色体区间，如 chr5A:587000000..587200000")
    sp.add_argument("--table", default=None, help="查询表名，默认 Genefunc_table")
    new("genefunc-tables", h_genefunc_tables, "IntervalTool：Genefuncdb 全部表信息 (GET /api/genes/functions/tables)")
    new("genefunc-examples", h_genefunc_examples, "IntervalTool：各基因组示例查询 (GET /api/genes/functions/examples)")
    new("genefunc-registry", h_genefunc_registry, "IntervalTool：基因功能表注册元数据 (GET /api/genes/functions/registry)")

    # Expression
    new("expr-projects", h_expr_projects, "表达谱：可用表达项目列表 (GET /api/expression/projects)")
    sp = new("expr-query", h_expr_query, "表达谱：查询基因表达量，基于 IWGSC v2.1(02G)，v1/v3 自动转换 (GET /api/expression/query)")
    sp.add_argument("--genes", required=True, help="逗号分隔的基因 ID 列表")
    sp.add_argument("--project", default=None, help="表达项目表名，默认 PRJEB5314_paired_tbl")

    # Coexpression
    new("coexpr-databases", h_coexpr_databases, "共表达：数据库列表 (GET /api/coexpression/databases)")
    sp = new("coexpr-query", h_coexpr_query, "共表达：查询共表达关系对，小数=PCC 整数=MR (GET /api/coexpression/query)")
    sp.add_argument("--genes", required=True, help="逗号分隔的基因 ID 列表")
    sp.add_argument("--database", default=None, help="共表达数据库 ID，默认 CO_PRJEB25639")
    sp.add_argument("--filter", type=float, default=None, help="筛选阈值：小数=|PCC|下限，整数=MR 上限，默认 300(MR)")
    sp = new("coexpr-projects", h_coexpr_projects, "共表达：bioproject 元数据列表 (GET /api/coexpression/projects)")
    sp.add_argument("--source", default=None, help="按数据源过滤：NCBI/ENA/CNGB")
    sp.add_argument("--q", default=None, help="标题/描述/物种子串模糊搜索")
    sp = new("coexpr-project", h_coexpr_project, "共表达：单个 bioproject 元数据 (GET /api/coexpression/projects/{acc})")
    sp.add_argument("accession", help="BioProject 编号，如 PRJNA976214")

    # PPI
    sp = new("ppi", h_ppi, "PPI：蛋白互作查询，需带 .1 后缀的转录本 ID (GET /api/ppi/query)")
    sp.add_argument("--genes", required=True, help="逗号分隔的转录本 ID，如 TraesCS6D02G084800.1")
    sp.add_argument("--table", default=None, help="PPI 数据表名，默认 PPI_result")
    sp.add_argument("--min-score", type=float, default=None, help="CF-MS 得分阈值：0.5 中(默认)/0.2 低/0 全部")

    # 比较基因组
    sp = new("homologs", h_homologs, "比较基因组：小麦-水稻-拟南芥同源基因 (GET /api/homologs/wheat-rice-arabidopsis)")
    sp.add_argument("gene_id", help="小麦基因 ID，如 TraesCS5A02G391700")
    sp.add_argument("--max-targets", type=int, default=None, help="每个物种最多返回数，默认 3 (1-100)")
    sp = new("synteny", h_synteny, "比较基因组：麦族物种共线性查询 (GET /api/synteny/search)")
    sp.add_argument("query", help="基因 ID 或区间 chr5A:100000-200000")
    sp.add_argument("--table", default=None, help="共线性表名，默认 CSsymaptbl")
    sp = new("id-conversion", h_id_conversion, "比较基因组：旧版本 ID 转 IWGSC v1.1(02G)，需转录本 ID (GET /api/id-conversion)")
    sp.add_argument("--ids", required=True, help="逗号/空格分隔的转录本 ID（带 .1 后缀）")
    sp.add_argument("--version", required=True,
                    choices=["MIPS_result", "TGACv1_result", "IWGSCv1_result"],
                    help="源版本对应的数据库表名")
    sp = new("blastp", h_blastp, "比较基因组：小麦族预计算 blastp 结果 (GET /api/blastp)")
    sp.add_argument("gene_id", help="基因 ID，如 TraesCS5A02G391700")
    sp.add_argument("--limit", type=int, default=None, help="最多返回条数，默认 5000")
    sp.add_argument("--offset", type=int, default=None, help="偏移量，默认 0")

    # OrthoFinder
    sp = new("orthofinder", h_orthofinder, "OrthoFinder：按蛋白/orthogroup 搜索 (GET /api/orthofinder/search)")
    sp.add_argument("--q", default=None, help="蛋白/基因 ID 或 orthogroup ID（action=search 时）")
    sp.add_argument("--action", default=None, choices=["search", "species_catalog", "members"],
                    help="动作，默认 search")
    sp.add_argument("--og", default=None, help="Orthogroup ID（action=members 必填）")
    sp.add_argument("--sub", default=None, help="亚基因组过滤 A/B/D（配合 action=members）")
    sp.add_argument("--species", default=None, help="物种过滤（可选）")
    sp = new("orthofinder-download", h_orthofinder_download, "OrthoFinder：下载基因树(Newick)/多序列比对(FASTA) (GET /api/orthofinder/download)")
    sp.add_argument("--og", required=True, help="Orthogroup ID，如 OG0001897")
    sp.add_argument("--type", default=None, choices=["tree", "alignment"], help="文件类型，默认 tree")
    sp.add_argument("--cluster", type=int, default=None, help="Cluster 编号 1-7，0=完整 OG")
    sp.add_argument("--type-tree", default=None, choices=["type1", "type2"], help="仅 cluster 下载时的过滤")
    sp = new("orthofinder-neighborhood", h_orthofinder_neighborhood, "OrthoFinder：基因上下游各5个邻居及同源簇 (GET /api/orthofinder/neighborhood)")
    sp.add_argument("gene_id", help="基因 ID，如 TraesCS1A02G219700.1")

    # SynTeny Viewer
    new("syntenyview-genomes", h_syntenyview_genomes, "SynTeny Viewer：基因组列表 (GET /api/syntenyview/genomes)")
    sp = new("syntenyview-gene-search", h_syntenyview_gene_search, "SynTeny Viewer：基因搜索 (GET /api/syntenyview/gene-search)")
    sp.add_argument("q", help="搜索关键词（基因 ID）")
    sp.add_argument("--limit", type=int, default=None, help="返回条数，默认 20")
    new("syntenyview-status", h_syntenyview_status, "SynTeny Viewer：服务状态 (GET /api/syntenyview/status)")
    new("syntenyview-triticeae", h_syntenyview_triticeae, "SynTeny Viewer：麦族数据 (GET /api/syntenyview/triticeae)")
    sp = new("syntenyview-neighborhood", h_syntenyview_neighborhood, "SynTeny Viewer：基因邻域共线性 (GET /api/syntenyview/neighborhood)")
    sp.add_argument("gene_id", help="基因 ID")
    sp.add_argument("--upstream", type=int, default=None, help="上游邻居数，默认 5")
    sp.add_argument("--downstream", type=int, default=None, help="下游邻居数，默认 5")
    sp.add_argument("--targets", default=None, help="逗号分隔的目标基因组标签")
    sp.add_argument("--window", type=int, default=None, help="窗口大小，默认 5")

    # Sequences
    sp = new("seq-gene", h_seq_gene, "序列：按基因 ID 取 CDS+蛋白 FASTA (GET /api/sequence/by-gene)")
    sp.add_argument("gene_id", help="基因 ID（自动补 .1 后缀），如 TraesCS5A02G391700")
    sp.add_argument("--gene-db", default=None, help="基因 BLAST 库，默认 all_gene")
    sp.add_argument("--protein-db", default=None, help="蛋白 BLAST 库，默认 all_protein")
    sp = new("seq-interval", h_seq_interval, "序列：按染色体区间取基因组 FASTA (GET /api/sequence/by-interval)")
    sp.add_argument("--region", required=True, help="区间，如 chr1A:200-500（命名随基因组而异）")
    sp.add_argument("--database", required=True, help="BLAST 库名，区间查询推荐 all_genomes")
    sp = new("seq-batch", h_seq_batch, "序列：批量取多个基因/区间 FASTA (GET /api/sequence/batch)")
    sp.add_argument("--ids", required=True, help="逗号/空格分隔的基因 ID 或区间")
    sp.add_argument("--database", required=True, help="BLAST 库名，如 all_gene / all_genomes")

    # BLAST
    new("blast-databases", h_blast_databases, "BLAST：可用数据库列表 (GET /api/blast/databases)").add_argument(
        "--program", default=None, help="按程序过滤：blastp/blastn/blastx/tblastn/tblastx")
    new("blast-env", h_blast_env, "BLAST：检查 BLAST 环境 (GET /api/blast/status)")
    sp = new("blast", h_blast, "BLAST：异步比对 submit/status/result (POST /api/blast/search 等)", async_opts=True)
    sp.add_argument("action", choices=["submit", "status", "result"], help="动作")
    sp.add_argument("job_id", nargs="?", default=None, help="作业 ID（status/result 必填）")
    sp.add_argument("--database", default=None, help="数据库名，多个用逗号分隔（submit 必填）")
    sp.add_argument("--query", default=None, help="FASTA 查询序列，或 @文件路径（submit 必填）")
    sp.add_argument("--program", default=None, help="blastp/blastn/blastx/tblastn/tblastx，默认 blastp")
    sp.add_argument("--evalue", type=float, default=None, help="E-value 阈值 0-1000，默认 10")
    sp.add_argument("--max-target-seqs", type=int, default=None, help="最多返回匹配数 1-50000，默认 1000")
    sp.add_argument("--word-size", type=int, default=None, help="word_size（可选）")
    sp.add_argument("--matrix", default=None, help="打分矩阵（可选）")
    sp.add_argument("--outfmt", default=None, choices=["tabular", "traditional", "both"],
                    help="结果格式，默认 tabular")

    # GO/KEGG
    sp = new("enrich-go", h_enrich_go, "GO 富集：超几何检验+BH校正 (POST /api/go-kegg/go)")
    sp.add_argument("--genes", default=None, help="逗号分隔的基因 ID（IWGSC v1.1，如 TraesCS1A02G045300.1）")
    sp.add_argument("--padj", type=float, default=None, help="padj 阈值，默认 0.05")
    sp.add_argument("--json", dest="json_body", default=None, help="完整 JSON body，或 @文件路径")
    sp = new("enrich-kegg", h_enrich_kegg, "KEGG 富集：超几何检验+BH校正 (POST /api/go-kegg/kegg)")
    sp.add_argument("--genes", default=None, help="逗号分隔的基因 ID（IWGSC v1.1）")
    sp.add_argument("--padj", type=float, default=None, help="padj 阈值，默认 0.05")
    sp.add_argument("--json", dest="json_body", default=None, help="完整 JSON body，或 @文件路径")
    sp = new("go-genes", h_go_genes, "GO 富集：查询列表中匹配某 GO term 的基因 (GET /api/go-kegg/go-genes)")
    sp.add_argument("go_id", help="GO term ID，如 GO:0043425")
    sp.add_argument("--genes", default=None, help="逗号分隔的查询基因列表（可选）")
    sp = new("kegg-genes", h_kegg_genes, "KEGG 富集：查询列表中匹配某通路的基因 (GET /api/go-kegg/kegg-genes)")
    sp.add_argument("pathway", help="KEGG 通路 ID，如 map04110")
    sp.add_argument("--genes", default=None, help="逗号分隔的查询基因列表（可选）")

    # VariantHub
    new("variant-datasets", h_variant_datasets, "VariantHub：VCF 数据集列表（按参考基因组分组） (GET /api/VariantHub/datasets)")
    sp = new("variant-dataset-info", h_variant_dataset_info, "VariantHub：数据集 VCF 头与样本 ID (GET /api/VariantHub/dataset_info)")
    sp.add_argument("dataset", help="数据集 key（来自 variant-datasets）")
    sp = new("variant-samples", h_variant_samples, "VariantHub：数据集样本元数据，可用 --param 过滤 (GET /api/VariantHub/samples)")
    sp.add_argument("dataset", help="数据集 key")
    sp = new("variant-query", h_variant_query, "VariantHub：按区间或变异 ID 查询变异 (GET /api/VariantHub/query)")
    sp.add_argument("dataset", help="数据集 key")
    grp = sp.add_mutually_exclusive_group(required=True)
    grp.add_argument("--region", default=None, help="基因组区间，如 chr1A:1000-50000")
    grp.add_argument("--variant-id", default=None, help="变异 ID（精确匹配，大文件较慢）")
    sp.add_argument("--samples", default=None, help="逗号分隔的样本 ID，缺省为全部样本")
    sp.add_argument("--limit", type=int, default=None, help="返回条数，默认 200")
    sp.add_argument("--offset", type=int, default=None, help="偏移量，默认 0")

    # Papers
    sp = new("papers", h_papers, "文献：搜索 Triticeae 论文元数据 (GET /api/papers)")
    sp.add_argument("--q", default=None, help="全文关键词（标题/摘要/期刊/作者/关键词/AI标签）")
    sp.add_argument("--title", default=None, help="标题模糊匹配")
    sp.add_argument("--abstract", default=None, help="摘要模糊匹配")
    sp.add_argument("--journal", default=None, help="期刊模糊匹配")
    sp.add_argument("--authors", default=None, help="作者模糊匹配")
    sp.add_argument("--pubmed-keywords", default=None, help="PubMed 关键词模糊匹配")
    sp.add_argument("--ai-tags", default=None, help="AI 标签模糊匹配")
    sp.add_argument("--function-gene-tags", default=None, help="功能基因标签模糊匹配")
    sp.add_argument("--gene-name", default=None, help="基因名模糊匹配")
    sp.add_argument("--pmid", default=None, help="PubMed ID 精确匹配")
    sp.add_argument("--functional-gene-flag", default=None, help="论文级功能基因标记")
    sp.add_argument("--functional-gene-source", default=None, help="论文级功能基因来源")
    sp.add_argument("--function-gene-flag", default=None, help="第二套功能基因标记")
    sp.add_argument("--pub-date-start", default=None, help="发布年份起始")
    sp.add_argument("--pub-date-end", default=None, help="发布年份结束")
    sp.add_argument("--since-days", type=int, default=None, help="最近 N 天入库（按 created_at）")
    sp.add_argument("--limit", type=int, default=None, help="返回条数，默认 20")
    sp.add_argument("--offset", type=int, default=None, help="分页偏移，默认 0")
    sp = new("paper", h_paper, "文献：按 PMID 取单篇元数据 (GET /api/papers/{pmid})")
    sp.add_argument("pmid", help="PubMed ID")
    sp = new("paper-annotation", h_paper_annotation, "文献：按 PMID 取 LLM 标注 (GET /api/papers/{pmid}/annotation)")
    sp.add_argument("pmid", help="PubMed ID")
    new("papers-stats", h_papers_stats, "文献：数据集聚合统计 (GET /api/papers/stats)")

    # PrimerServer2
    new("primer-config", h_primer_config, "PrimerServer2：公共配置（输入限制等） (GET /api/PrimerServer2/config)")
    new("primer-databases", h_primer_databases, "PrimerServer2：特异性检查数据库列表 (GET /api/PrimerServer2/databases)")
    new("primer-server-info", h_primer_server_info, "PrimerServer2：运行时信息 (GET /api/PrimerServer2/server-info)")
    sp = new("primer", h_primer, "PrimerServer2：异步引物设计/特异性检查 (POST /api/PrimerServer2/jobs 等)", async_opts=True)
    sp.add_argument("action",
                    choices=["submit", "submit-check", "status", "progress", "result", "delete", "result-html"],
                    help="submit=设计作业 submit-check=仅特异性检查")
    sp.add_argument("job_id", nargs="?", default=None, help="作业 ID（status/progress/result/delete/result-html 必填）")
    sp.add_argument("--json", dest="json_body", default=None,
                    help="提交用的 JSON body，或 @文件路径（submit/submit-check 必填）")
    sp.add_argument("--job-type", default="design", choices=["design", "check"],
                    help="result 时的作业类型，默认 design")

    return parser


def main(argv=None):
    parser = build_parser()
    args = parser.parse_args(argv)
    if not getattr(args, "func", None):
        parser.print_help()
        return 0
    base = args.base or os.environ.get("WHEATOMICS_BASE") or DEFAULT_BASE
    client = Client(base, args.timeout, api_key=args.api_key)
    try:
        payload = args.func(args, client)
        emit(payload, args.output)
    except ApiError as e:
        print("错误: %s" % e, file=sys.stderr)
        return 1
    except NetworkError as e:
        print("网络错误: %s" % e, file=sys.stderr)
        return 2
    except UsageError as e:
        print("用法错误: %s" % e, file=sys.stderr)
        return 2
    except WaitTimeout as e:
        print("等待超时: %s" % e, file=sys.stderr)
        return 4
    except KeyboardInterrupt:
        print("已取消。", file=sys.stderr)
        return 130
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except BrokenPipeError:
        # stdout 被下游管道提前关闭（如 | head），静默退出即可
        try:
            devnull = os.open(os.devnull, os.O_WRONLY)
            os.dup2(devnull, sys.stdout.fileno())
        except Exception:
            pass
        sys.exit(0)
