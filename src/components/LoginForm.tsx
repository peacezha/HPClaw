import React, { useState, useEffect, useRef } from "react";
import { Terminal as TerminalIcon, Loader2, AlertCircle, KeyRound, Eye, EyeOff, ShieldCheck, Settings, Trash2, Users, ChevronDown, Check, X } from "lucide-react";
import { motion } from "motion/react";
import {
 generateTOTP,
 getStoredSecret,
 storeSecret,
 getRememberMe,
 setRememberMe,
 getSavedPassword,
 savePassword,
 clearSavedCredentials,
} from "../services/totpStorage";
import {
 listLoginProfiles,
 getProfileSecrets,
 saveLoginProfile,
 removeLoginProfile,
 findMatchingLoginProfile,
 type LoginProfile,
} from "../services/loginProfiles";
import { useI18n } from '../i18n';
import { HPCLAW_DISPLAY_NAME, IS_COMPETITION_EDITION } from '../edition';

interface LoginFormProps {
 onLogin: (info: { host: string; port: string; username: string; password: string; verificationCode: string }) => Promise<string | null | void>;
 isLoggingIn: boolean;
 loginError: string;
 /** 嵌入模式（添加集群弹窗）：去掉全屏背景与居中容器，避免样式错位 */
 embedded?: boolean;
 onCancel?: () => void;
}

export default function LoginForm({ onLogin, isLoggingIn, loginError, embedded = false, onCancel }: LoginFormProps) {
 const { t } = useI18n();
 const [host, setHost] = useState(localStorage.getItem("ssh_host") || "");
 const [port, setPort] = useState(localStorage.getItem("ssh_port") || "22");
 const [username, setUsername] = useState(localStorage.getItem("ssh_username") || "");
 const [password, setPassword] = useState("");
 const [verificationCode, setVerificationCode] = useState("");
 const [showPassword, setShowPassword] = useState(false);
 const [rememberMe, setRememberMeState] = useState(getRememberMe());
 const [autoTOTP, setAutoTOTP] = useState("");
 const [totpCountdown, setTotpCountdown] = useState(30);
 const [showSecretEditor, setShowSecretEditor] = useState(false);
 const [totpError, setTotpError] = useState("");
 // 账号档案存在时，TOTP/密码必须等待按账号解密后再填入。
 // 不在初始渲染阶段灌入历史“全局默认”，避免短暂或长期串到别的账号。
 const [secretKey, setSecretKey] = useState("");
 const [draftSecret, setDraftSecret] = useState("");
 const [profiles, setProfiles] = useState<LoginProfile[]>([]);
 const [selectedProfileId, setSelectedProfileId] = useState("");
 const [profileOpen, setProfileOpen] = useState(false);
 const totpIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
 const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
 const userEditedCode = useRef(false);
 const refreshTOTPRef = useRef<() => Promise<void>>(async () => {});
 // 当前生效的 TOTP 秘钥（可来自所选账号档案），用 ref 供定时器读取最新值
 const secretRef = useRef(secretKey);
 secretRef.current = secretKey;

 const applyProfileSecrets = async (profile: LoginProfile) => {
 const secrets = await getProfileSecrets(profile.id);
 const nextPassword = secrets?.password || '';
 const nextSecret = secrets?.totpSecret || '';
 setPassword(nextPassword);
 setRememberMeState(Boolean(nextPassword));
 secretRef.current = nextSecret;
 setSecretKey(nextSecret);
 setDraftSecret(nextSecret);
 setAutoTOTP('');
 setVerificationCode('');
 userEditedCode.current = false;
 if (nextSecret) {
 setTotpError('');
 void refreshTOTPRef.current();
 } else {
 setTotpError('该账号未保存 TOTP 秘钥；若服务器要求动态验证码，请手动输入或点齿轮配置');
 }
 };

 // 启动时先查找与当前 host/port/username 完全一致的档案。
 // 旧全局密码/TOTP 只在尚无任何档案时做一次兼容，不会覆盖其他账号。
 useEffect(() => {
 let cancelled = false;
 void (async () => {
 const loaded = await listLoginProfiles().catch(() => []);
 if (cancelled) return;
 setProfiles(loaded);
 const matching = findMatchingLoginProfile(loaded, { host, port, username });
 if (matching) {
 setSelectedProfileId(matching.id);
 await applyProfileSecrets(matching);
 return;
 }
 if (loaded.length === 0) {
 const legacySecret = getStoredSecret();
 const legacyPassword = getRememberMe() ? getSavedPassword() : '';
 secretRef.current = legacySecret;
 setSecretKey(legacySecret);
 setDraftSecret(legacySecret);
 if (legacyPassword) setPassword(legacyPassword);
 if (legacySecret) void refreshTOTPRef.current();
 return;
 }
 // 有档案但当前身份没有精确匹配：宁可空着，也不借用“最近账号”的验证码。
 setPassword('');
 secretRef.current = '';
 setSecretKey('');
 setDraftSecret('');
 setVerificationCode('');
 setAutoTOTP('');
 setRememberMeState(false);
 })();
 return () => { cancelled = true; };
 }, []);

 // TOTP auto-generation -- refresh every 30 s
 useEffect(() => {
 let cancelled = false;

 const refresh = async () => {
 const secret = secretRef.current;
 if (!secret) return;
 try {
 const code = await generateTOTP(secret);
 if (!cancelled && !userEditedCode.current) {
 setAutoTOTP(code);
 setVerificationCode(code);
 }
 } catch (e: any) {
 if (!cancelled) {
 setAutoTOTP("");
 const reason = e?.message || String(e);
 setTotpError(`TOTP failed: ${reason}`);
 }
 }
 };

 refreshTOTPRef.current = refresh;
 refresh();
 setTotpCountdown(30);

 totpIntervalRef.current = setInterval(refresh, 30_000);
 countdownRef.current = setInterval(() => {
 setTotpCountdown(prev => (prev <= 1 ? 30 : prev - 1));
 }, 1_000);

 return () => {
 cancelled = true;
 if (totpIntervalRef.current) clearInterval(totpIntervalRef.current);
 if (countdownRef.current) clearInterval(countdownRef.current);
 };
 }, []);

 // 选择已保存账号：回填主机/端口/用户名/密码/秘钥
 const handleSelectProfile = async (id: string) => {
 setSelectedProfileId(id);
 if (!id) {
 setPassword('');
 secretRef.current = '';
 setSecretKey('');
 setDraftSecret('');
 setAutoTOTP('');
 setVerificationCode('');
 setTotpError('');
 setRememberMeState(false);
 userEditedCode.current = false;
 return;
 }
 const profile = profiles.find(p => p.id === id);
 if (!profile) return;
 setHost(profile.host);
 setPort(profile.port);
 setUsername(profile.username);
 await applyProfileSecrets(profile);
 };

 const handleRemoveProfile = async () => {
 if (!selectedProfileId) return;
 await removeLoginProfile(selectedProfileId).catch(() => {});
 await handleSelectProfile("");
 setProfiles(await listLoginProfiles().catch(() => []));
 };

 const handleIdentityChange = (field: 'host' | 'port' | 'username', value: string) => {
 if (field === 'host') setHost(value);
 else if (field === 'port') setPort(value);
 else setUsername(value);
 if (!selectedProfileId) return;
 const selected = profiles.find(profile => profile.id === selectedProfileId);
 const next = {
 host: field === 'host' ? value : host,
 port: field === 'port' ? value : port,
 username: field === 'username' ? value : username,
 };
 if (!selected || !findMatchingLoginProfile([selected], next)) {
 // 身份字段一旦偏离所选档案，立即解绑与之配套的密码/TOTP。
 void handleSelectProfile('');
 }
 };

 const handleConfirmSecret = () => {
 const trimmed = draftSecret.trim();
 if (!trimmed) {
 setTotpError("Secret key is empty");
 return;
 }
 if (!/^[A-Za-z2-7]+$/.test(trimmed)) {
 setTotpError("Invalid Base32 characters in secret key");
 return;
 }
 setTotpError("");
 // 已选账号时只写入该档案；全局 secret 仅供无档案的旧版兼容。
 if (!selectedProfileId) storeSecret(trimmed);
 secretRef.current = trimmed; // 同步更新 ref，保证立即刷新用的是新秘钥
 setSecretKey(trimmed);
 // 若当前选中了账号档案，同步更新该档案的秘钥
 if (selectedProfileId) {
 const profile = profiles.find(p => p.id === selectedProfileId);
 if (profile) {
 void saveLoginProfile({
 host: profile.host,
 port: profile.port,
 username: profile.username,
 totpSecret: trimmed,
 }).then(async () => setProfiles(await listLoginProfiles().catch(() => []))).catch(() => {});
 }
 }
 // Refresh TOTP immediately with the new secret
 userEditedCode.current = false;
 refreshTOTPRef.current();
 setShowSecretEditor(false);
 };

 const handleOpenEditor = () => {
 setDraftSecret(secretKey);
 setShowSecretEditor(true);
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();

 localStorage.setItem("ssh_host", host);
 localStorage.setItem("ssh_port", port);
 localStorage.setItem("ssh_username", username);

 // Persist or clear remembered credentials
 setRememberMe(rememberMe);
 if (rememberMe) {
 savePassword(password);
 } else {
 clearSavedCredentials();
 }

 // 提交前刷新一次动态验证码：自动填充的码可能临近 30 秒窗口边界，
 // 过期或被重放（同一码 30 秒内不可复用）都会导致认证失败
 let codeToUse = verificationCode;
 if (secretRef.current && !userEditedCode.current) {
 try {
 codeToUse = await generateTOTP(secretRef.current);
 setVerificationCode(codeToUse);
 } catch { /* 生成失败则用当前值 */ }
 }

 const err = await onLogin({ host, port, username, password, verificationCode: codeToUse });
 // 登录成功：把凭据（密码+TOTP 种子）同步到服务端内存暂存，
 // 供集群直连互传时自动应答 Password:/Verification code:（不落盘，重启失效）
 if (!err) {
 void fetch('/api/transfer-credentials', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ host, port, username, password, totpSecret: secretRef.current }),
 }).catch(() => {});
 }
 if (!err && rememberMe) {
 try {
 const saved = await saveLoginProfile({
 host,
 port,
 username,
 password,
 totpSecret: secretRef.current || undefined,
 });
 setProfiles(await listLoginProfiles());
 setSelectedProfileId(saved.id);
 } catch (saveErr) {
 console.warn('[LoginForm] 保存账号档案失败:', saveErr);
 }
 }
 };

 const handleCodeChange = (val: string) => {
 userEditedCode.current = true;
 setVerificationCode(val);
 };

 return (
 <div
 className={embedded
 ? "w-full font-sans text-scholar-50"
 : "h-[100dvh] w-screen overflow-y-auto flex items-center justify-center p-4 font-sans text-scholar-50 login-bg"}
 >
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className={`w-full max-w-md bg-scholar-900 border border-scholar-700/60 rounded-lg shadow-lg overflow-hidden ${embedded ? 'mx-auto' : 'my-auto'}`}
 >
 {/* 添加集群使用紧凑标题；首次登录页保留完整品牌。 */}
 {embedded ? (
 <div className="flex h-16 items-center justify-between border-b border-scholar-700 px-5">
 <div className="flex items-center gap-3">
 <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/10 text-accent"><TerminalIcon className="h-4.5 w-4.5" /></span>
 <div>
 <h2 className="text-sm font-semibold text-scholar-50">连接计算资源</h2>
 <p className="mt-0.5 text-[10px] text-scholar-500">添加为 AI 的后台计算目标</p>
 </div>
 </div>
 {onCancel && <button type="button" onClick={onCancel} className="btn-icon" aria-label="关闭计算资源登录"><X className="h-4 w-4" /></button>}
 </div>
 ) : (
 <div className="pt-9 pb-2 px-8 flex flex-col items-center">
 <div className="bg-accent/10 p-3.5 rounded-lg mb-4">
 <TerminalIcon className="w-8 h-8 text-accent" />
 </div>
  <h2 className="text-3xl font-sans font-semibold text-center tracking-wide text-scholar-50">{HPCLAW_DISPLAY_NAME}</h2>
  {IS_COMPETITION_EDITION && (
    <span className="mt-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-medium text-accent">
      轻量竞赛版 · 不含 DSH
    </span>
  )}
 <p className="text-scholar-400 text-center text-sm mt-1.5">{t('Bioinformatics Intelligent Computing Assistant')}</p>
 </div>
 )}

 <div className={embedded ? "p-5" : "p-8 pt-6"}>
 {loginError && (
 <div className="mb-6 p-3 bg-[rgb(var(--danger-rgb)/0.08)] border border-[rgb(var(--danger-rgb)/0.3)] rounded-lg flex items-start gap-3 text-[var(--color-danger)] text-sm">
 <AlertCircle className="w-5 h-5 shrink-0" />
 <p>{t(loginError)}</p>
 </div>
 )}

 {/* 已保存账号：自绘下拉（原生 select 弹层在 Electron 中不稳定） */}
 {profiles.length > 0 && (
 <div className={embedded ? "mb-3" : "mb-5"}>
 <label className="block text-sm font-medium text-scholar-200 mb-1.5 flex items-center gap-1.5">
 <Users className="w-3.5 h-3.5" /> 已保存的账号
 </label>
 <div className="flex gap-2">
 <div className="relative flex-1 min-w-0">
 <button
 type="button"
 onClick={() => setProfileOpen(o => !o)}
 className="w-full bg-scholar-950 border border-scholar-600 rounded-lg px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent flex items-center justify-between gap-2"
 >
 <span className={`truncate ${selectedProfileId ? 'text-scholar-50' : 'text-scholar-500'}`}>
 {selectedProfileId
 ? `${profiles.find(p => p.id === selectedProfileId)?.name || '选择账号'}:${profiles.find(p => p.id === selectedProfileId)?.port || ''}`
 : '选择账号快速登录…'}
 </span>
 <ChevronDown className={`w-3.5 h-3.5 text-scholar-400 shrink-0 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
 </button>
 {profileOpen && (
 <>
 <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
 <div className="absolute left-0 right-0 top-full mt-1 z-20 max-h-44 overflow-y-auto bg-scholar-900 border border-scholar-600 rounded-lg shadow-lg">
 <button
 type="button"
 onClick={() => { void handleSelectProfile(""); setProfileOpen(false); }}
 className="w-full px-3 py-2 text-left text-sm text-scholar-500 hover:bg-scholar-800"
 >
 选择账号快速登录…
 </button>
 {profiles.map(p => (
 <button
 key={p.id}
 type="button"
 onClick={() => { void handleSelectProfile(p.id); setProfileOpen(false); }}
 className={`w-full px-3 py-2 text-left text-sm hover:bg-scholar-800 flex items-center justify-between gap-2 ${
 p.id === selectedProfileId ? 'text-accent bg-accent/10' : 'text-scholar-100'
 }`}
 >
 <span className="truncate">{p.name}:{p.port}</span>
 {p.id === selectedProfileId && <Check className="w-3.5 h-3.5 shrink-0" />}
 </button>
 ))}
 </div>
 </>
 )}
 </div>
 {selectedProfileId && (
 <button
 type="button"
 onClick={() => void handleRemoveProfile()}
 className="px-2.5 text-scholar-500 hover:text-red-500 transition-colors shrink-0"
 title="删除该账号"
 aria-label="删除该账号"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 )}
 </div>
 </div>
 )}

 <form onSubmit={handleSubmit} className={embedded ? "space-y-3" : "space-y-4"}>
 <div className="flex gap-4">
 <div className="flex-1">
 <label className="block text-sm font-medium text-scholar-200 mb-1.5">{t('Compute Resource IP')} <span className="text-red-500">*</span></label>
 <input
 type="text" required value={host}
 onChange={(e) => handleIdentityChange('host', e.target.value)}
 placeholder="e.g. 192.168.1.100"
 className="w-full bg-scholar-950 border border-scholar-600 rounded-lg px-4 py-2 text-scholar-50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
 autoComplete="off"
 />
 </div>
 <div className="w-24">
 <label className="block text-sm font-medium text-scholar-200 mb-1.5">{t('Port')}</label>
 <input
 type="text" required value={port}
 onChange={(e) => handleIdentityChange('port', e.target.value)}
 placeholder="22"
 className="w-full bg-scholar-950 border border-scholar-600 rounded-lg px-4 py-2 text-scholar-50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
 />
 </div>
 </div>
 <div>
 <label className="block text-sm font-medium text-scholar-200 mb-1.5">{t('Username')} <span className="text-red-500">*</span></label>
 <input
 type="text" required value={username}
 onChange={(e) => handleIdentityChange('username', e.target.value)}
 className="w-full bg-scholar-950 border border-scholar-600 rounded-lg px-4 py-2.5 text-scholar-50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
 autoComplete="username"
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-scholar-200 mb-1.5">{t('Password')} <span className="text-red-500">*</span></label>
 <div className="relative">
 <input
 type={showPassword ? "text" : "password"}
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 className="w-full bg-scholar-950 border border-scholar-600 rounded-lg px-4 py-2.5 pr-10 text-scholar-50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
 autoComplete="current-password"
 />
 <button
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-scholar-400 hover:text-scholar-200"
 aria-label={t(showPassword ? "Hide password" : "Show password")}
 >
 {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
 </button>
 </div>
 </div>
 <div>
 <label className="block text-sm font-medium text-scholar-200 mb-1.5 flex items-center gap-2">
 {t('Verification Code')}
 <span className="text-xs font-normal text-scholar-400">（选填）</span>
 <KeyRound className="w-3.5 h-3.5" />
 {autoTOTP && !userEditedCode.current && (
 <span className="flex items-center gap-1 text-xs text-accent ml-auto">
 <ShieldCheck className="w-3 h-3" />
 {t('Auto')} -- {totpCountdown}s
 </span>
 )}
 <button
 type="button"
 onClick={() => (showSecretEditor ? setShowSecretEditor(false) : handleOpenEditor())}
 className="ml-1 text-scholar-400 hover:text-scholar-200 transition-colors"
 title={t('TOTP Secret Settings')}
 aria-label={t('TOTP Secret Settings')}
 >
 <Settings className="w-3.5 h-3.5" />
 </button>
 </label>
 <input
 type="text" value={verificationCode}
 onChange={(e) => handleCodeChange(e.target.value)}
 placeholder="服务器无二次验证可留空"
 className="w-full bg-scholar-950 border border-scholar-600 rounded-lg px-4 py-2.5 text-scholar-50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent font-mono tracking-widest"
 />

 {totpError && (
 <p className="mt-1 text-xs text-scholar-400 flex items-center gap-1">
 <AlertCircle className="w-3 h-3" />
 {t(totpError)}
 </p>
 )}

 {/* Secret key editor -- toggled by gear icon */}
 {showSecretEditor && (
 <div className="mt-2 p-3 bg-scholar-950 border border-scholar-600 rounded-lg space-y-2">
 <label className="block text-xs font-medium text-scholar-300">
 {t('Google Authenticator Secret')}
 </label>
 <input
 type="text"
 value={draftSecret}
 onChange={(e) => setDraftSecret(e.target.value)}
 placeholder={t('Enter Base32 secret')}
 className="w-full bg-scholar-900 border border-scholar-600 rounded px-3 py-1.5 text-sm text-scholar-100 font-mono focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
 spellCheck={false}
 autoComplete="off"
 />
 <div className="flex gap-2">
 <button
 type="button"
 onClick={handleConfirmSecret}
 className="flex-1 bg-accent hover:bg-accent-dark text-white text-xs font-medium py-1.5 rounded transition-colors"
 >
 {t('Confirm')}
 </button>
 <button
 type="button"
 onClick={() => setShowSecretEditor(false)}
 className="flex-1 bg-scholar-800 hover:bg-scholar-700 text-scholar-200 text-xs font-medium py-1.5 rounded transition-colors"
 >
 {t('Cancel')}
 </button>
 </div>
 <p className="text-xs text-scholar-400">
 {t('Secret stored in browser only.')}
 </p>
 </div>
 )}
 </div>

 {/* Remember Me */}
 <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-scholar-300 hover:text-scholar-100 transition-colors">
 <input
 type="checkbox"
 checked={rememberMe}
 onChange={(e) => setRememberMeState(e.target.checked)}
 className="w-4 h-4 rounded border-scholar-600 bg-scholar-950 accent-accent focus:ring-2 focus:ring-accent/50"
 />
 {t('Remember credentials')}
 </label>

 <button
 type="submit" disabled={isLoggingIn}
 className="btn-primary w-full !py-2.5 !text-sm mt-2"
 >
 {isLoggingIn ? <><Loader2 className="w-5 h-5 animate-spin" />{t('Connecting...')}</> : t('Login')}
 </button>
 </form>
 </div>
 </motion.div>
 </div>
 );
}
