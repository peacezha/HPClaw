import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { X, Loader2, MessageCircle, CheckCircle2, XCircle } from 'lucide-react';

interface QQBotSettingsDialogProps {
  onClose: () => void;
}

/** QQ 机器人配置：AppID/AppSecret/白名单，保存后服务端热重启机器人 */
export default function QQBotSettingsDialog({ onClose }: QQBotSettingsDialogProps) {
  const [appId, setAppId] = useState('');
  const [appSecret, setAppSecret] = useState('');
  const [allowlist, setAllowlist] = useState('');
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/qqbot/config');
        const data = await res.json();
        if (data.success) {
          setAppId(data.config.appId || '');
          setAppSecret(data.config.appSecret || ''); // '******' 或 ''
          setAllowlist((data.config.allowlist || []).join(', '));
          setRunning(!!data.running);
        }
      } catch { /* 忽略，按空配置展示 */ } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setNotice('');
    try {
      const res = await fetch('/api/qqbot/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId,
          appSecret,
          allowlist: allowlist.split(/[,，;\s]+/).map(s => s.trim()).filter(Boolean),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.success) {
        setRunning(!!data.running);
        setNotice(data.running
          ? '已保存，机器人已按新配置启动'
          : '已保存（AppID/AppSecret 未填全，机器人未启动）');
      } else {
        setNotice(data.error || '保存失败');
      }
    } catch {
      setNotice('网络错误，保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-scholar-950/70 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-md bg-scholar-900 border border-scholar-700 rounded-lg shadow-lg p-5 space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-scholar-100 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-accent" /> QQ 机器人配置
            {running ? (
              <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-normal"><CheckCircle2 className="w-3 h-3" />运行中</span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] text-scholar-500 font-normal"><XCircle className="w-3 h-3" />未启动</span>
            )}
          </h3>
          <button onClick={onClose} className="text-scholar-400 hover:text-scholar-200" aria-label="关闭">
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-6 text-scholar-400"><Loader2 className="w-5 h-5 animate-spin" /></div>
        ) : (
          <>
            <p className="text-[11px] text-scholar-500 leading-relaxed">
              在 q.qq.com 注册机器人后填入凭据。AI 能力自动复用应用内"AI 设置"，无需重复配置。
            </p>
            <div>
              <label className="block text-[11px] text-scholar-400 mb-1">AppID</label>
              <input
                value={appId}
                onChange={e => setAppId(e.target.value)}
                placeholder="例如 1903000000"
                className="w-full bg-scholar-950 border border-scholar-600 rounded-lg px-3 py-2 text-sm text-scholar-100 focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <div>
              <label className="block text-[11px] text-scholar-400 mb-1">AppSecret</label>
              <input
                type="password"
                value={appSecret}
                onChange={e => setAppSecret(e.target.value)}
                placeholder="填入新密钥；显示 ****** 表示已保存"
                className="w-full bg-scholar-950 border border-scholar-600 rounded-lg px-3 py-2 text-sm text-scholar-100 focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <div>
              <label className="block text-[11px] text-scholar-400 mb-1">白名单（QQ openid，逗号分隔；留空 = 不限制）</label>
              <textarea
                rows={2}
                value={allowlist}
                onChange={e => setAllowlist(e.target.value)}
                placeholder="不填则所有人都能使用机器人"
                className="w-full bg-scholar-950 border border-scholar-600 rounded-lg px-3 py-2 text-sm text-scholar-100 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
              />
            </div>
            {notice && <p className="text-xs text-accent">{notice}</p>}
            <button onClick={() => void handleSave()} disabled={saving} className="btn-primary w-full">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} 保存并重启机器人
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
