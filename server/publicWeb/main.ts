import path from 'node:path';
import { createPublicGateway } from './gateway';

const origin = process.env.HPCLAW_WEB_ORIGIN || 'http://127.0.0.1:3003';
const host = process.env.HPCLAW_HOST || '127.0.0.1';
if (host !== '127.0.0.1' && !process.env.HPCLAW_WEB_ORIGIN) throw new Error('网络部署必须配置 HPCLAW_WEB_ORIGIN');
const gateway = createPublicGateway({ root: path.resolve(process.env.HPCLAW_APP_ROOT || process.cwd()), origin,
  maxWorkers: Number(process.env.HPCLAW_MAX_CLUSTER_CONNECTIONS || 16),
  allowPrivate: process.env.HPCLAW_ALLOW_PRIVATE_CLUSTERS === '1',
});
gateway.server.listen(Number(process.env.PORT || 3003), host, () => {
  console.log(`[HPClaw public web] ${origin} — 用户自带集群账号及 API Key，无统一网站口令。`);
});
let closing = false;
const close = async () => { if (closing) return; closing = true; await gateway.close(); process.exit(0); };
process.on('SIGTERM', close); process.on('SIGINT', close);
