// 流程预检 API：执行/读取流程必要软件与参考数据的就绪检查；流程运行日志查看；内置管线文件部署。
import type { Express, Request, Response } from 'express';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { loadWorkflows } from './workflowStore';
import { readCachedPreflight, runPreflight } from './preflight';
import type { ExecFn, PreflightFilter } from './preflight';
import { workflowSlug } from '../../shared/flowManifest';
import { resolveAssetLocalPath } from './workflowRunService';

export interface PreflightSession {
  exec: ExecFn;
  /** 集群家目录绝对路径（日志接口的路径校验用） */
  home: string;
  /** SFTP 通道（部署内置管线文件用；未就绪时部署接口返回 503） */
  sftp?: { fastPut: (localPath: string, remotePath: string, cb: (err?: Error) => void) => void };
}

function sendError(res: Response, status: number, message: string): void {
  res.status(status).json({ success: false, error: message });
}

async function findWorkflow(id: string) {
  const workflows = await loadWorkflows();
  return workflows.find(w => w.id === id);
}

function sanitizeFilter(value: unknown): PreflightFilter | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const v = value as Record<string, unknown>;
  const filter: PreflightFilter = {};
  if (Array.isArray(v.software)) filter.software = v.software.map(s => String(s)).slice(0, 50);
  if (Array.isArray(v.references)) filter.references = v.references.map(s => String(s)).slice(0, 50);
  return filter.software || filter.references ? filter : undefined;
}

/** shell 单引号转义 */
function shq(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

/**
 * 校验并展开运行目录：仅允许 home 下 hpclaw_flows / hpclaw_runs 工作区内的路径。
 * 合法返回原 dir（供 shell 使用，可能带 ~），非法返回 null。
 */
export function resolveRunLogDir(home: string, dir: string): string | null {
  const trimmed = dir.trim();
  if (!trimmed || trimmed.includes('..')) return null;
  const normalizedHome = home.replace(/\/+$/, '');
  const expanded = trimmed.startsWith('~/') ? `${normalizedHome}/${trimmed.slice(2)}` : trimmed;
  if (expanded.startsWith(`${normalizedHome}/hpclaw_flows/`)) return trimmed;
  if (expanded.startsWith(`${normalizedHome}/hpclaw_runs/`)) return trimmed;
  return null;
}

export function registerPreflightRoutes(
  app: Express,
  resolveSession: (req: Request) => PreflightSession | undefined,
): void {
  // 执行预检（SSH 只读检查，结果缓存在集群 flow 目录）
  // body 可带 only: { software?: string[]; references?: string[] } 做单项校验（与缓存合并）
  app.post('/api/workflows/:id/preflight', async (req, res) => {
    try {
      const s = resolveSession(req);
      if (!s) return sendError(res, 401, '需要活跃的 SSH 会话');
      const workflow = await findWorkflow(String(req.params.id));
      if (!workflow) return sendError(res, 404, '流程不存在');
      const result = await runPreflight(s.exec, workflow, sanitizeFilter(req.body?.only));
      res.json({ success: true, result });
    } catch (err: any) {
      sendError(res, 500, err.message || String(err));
    }
  });

  // 读取上次预检缓存（从未预检返回 result: null）
  app.get('/api/workflows/:id/preflight', async (req, res) => {
    try {
      const s = resolveSession(req);
      if (!s) return sendError(res, 401, '需要活跃的 SSH 会话');
      const workflow = await findWorkflow(String(req.params.id));
      if (!workflow) return sendError(res, 404, '流程不存在');
      const result = await readCachedPreflight(s.exec, workflow);
      res.json({ success: true, result });
    } catch (err: any) {
      sendError(res, 500, err.message || String(err));
    }
  });

  // 部署流程的内置管线文件（pipelines/ 目录随应用分发）到集群流程家目录 01_software/
  app.post('/api/workflows/:id/deploy-assets', async (req, res) => {
    try {
      const s = resolveSession(req);
      if (!s) return sendError(res, 401, '需要活跃的 SSH 会话');
      if (!s.sftp) return sendError(res, 503, 'SFTP 通道未就绪');
      const workflow = await findWorkflow(String(req.params.id));
      if (!workflow) return sendError(res, 404, '流程不存在');
      if (!workflow.assets?.length) return sendError(res, 400, '该流程没有内置管线文件');

      const slug = workflowSlug(workflow.name);
      const base = `${s.home}/hpclaw_flows/${slug}/01_software`;
      const results: Array<{ remotePath: string; ok: boolean; error?: string }> = [];
      for (const asset of workflow.assets) {
        try {
          const localPath = resolveAssetLocalPath(asset.source);
          await fs.access(localPath);
          const remote = `${base}/${asset.remotePath}`;
          await s.exec(`mkdir -p ${shq(path.posix.dirname(remote))}`, 15_000);
          await new Promise<void>((resolve, reject) => {
            s.sftp!.fastPut(localPath, remote, err => (err ? reject(err) : resolve()));
          });
          results.push({ remotePath: asset.remotePath, ok: true });
        } catch (err: any) {
          results.push({ remotePath: asset.remotePath, ok: false, error: err?.message || String(err) });
        }
      }
      res.json({ success: true, results, base });
    } catch (err: any) {
      sendError(res, 500, err.message || String(err));
    }
  });

  // 流程运行日志：tail 运行目录 logs/ 下的输出（路径限定在 hpclaw 工作区内）
  app.get('/api/workflows/runs/log', async (req, res) => {
    try {
      const s = resolveSession(req);
      if (!s) return sendError(res, 401, '需要活跃的 SSH 会话');
      const dir = String(req.query.dir || '').trim();
      if (!dir) return sendError(res, 400, '缺少 dir 参数');
      const safeDir = resolveRunLogDir(s.home, dir);
      if (!safeDir) {
        return sendError(res, 403, '只允许查看 hpclaw 流程工作区内的日志');
      }
      let n = Number.parseInt(String(req.query.n || '200'), 10);
      if (!Number.isInteger(n) || n < 50) n = 200;
      if (n > 1000) n = 1000;
      // 动态发现日志文件（bsub 的 %J.out 可能落在 run 根目录、logs/ 或 scripts/），
      // 按修改时间取最新若干个做 tail；同时返回文件清单便于前端展示来源
      const cmd =
        `cd ${shq(safeDir)} 2>/dev/null && {\n` +
        `echo "===FILES===";\n` +
        `find . -maxdepth 3 -type f \\( -name '*.out' -o -name '*.err' -o -name '*.log' -o -name '*.summary.md' \\) -printf '%T@ %p\\n' 2>/dev/null | sort -rn | head -10 | cut -d' ' -f2-;\n` +
        `echo "===CONTENT===";\n` +
        `find . -maxdepth 3 -type f \\( -name '*.out' -o -name '*.err' -o -name '*.log' \\) -printf '%T@ %p\\n' 2>/dev/null | sort -rn | head -6 | cut -d' ' -f2- | xargs -r tail -q -n ${n} 2>/dev/null | tail -c 28000;\n` +
        `}`;
      const raw = await s.exec(cmd, 20_000);
      const filesIdx = raw.indexOf('===FILES===');
      const contentIdx = raw.indexOf('===CONTENT===');
      const files = (filesIdx >= 0 && contentIdx > filesIdx
        ? raw.slice(filesIdx + '===FILES==='.length, contentIdx)
        : ''
      ).split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const log = contentIdx >= 0 ? raw.slice(contentIdx + '===CONTENT==='.length).trim() : raw.trim();
      res.json({
        success: true,
        files,
        log: log || (files.length > 0 ? '(日志文件暂无内容)' : '(该任务目录下暂未找到日志文件，任务可能刚提交或仍在排队)'),
      });
    } catch (err: any) {
      sendError(res, 500, err.message || String(err));
    }
  });
}
