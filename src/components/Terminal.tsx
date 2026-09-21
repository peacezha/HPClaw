import { useEffect, useRef, useImperativeHandle, forwardRef, useCallback, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import { io, Socket } from 'socket.io-client';
import 'xterm/css/xterm.css';

const cleanTerminalOutput = (str: string) => {
  let cleaned = str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
  cleaned = cleaned.replace(/\u0007/g, '');
  return cleaned.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
};

export interface TerminalHandle {
  executeCommand: (cmd: string, waitAndCapture?: boolean, silent?: boolean, hideOutput?: boolean) => Promise<string>;
  getSocket: () => Socket | null;
  writeToTerminal: (data: string) => void;
  /** 走 xterm 粘贴通道写入文本（bracketed paste 语义与 Ctrl+V 一致）；xterm 不在时退回 socket */
  pasteText: (text: string) => void;
  selectAll: () => void;
  /** 清空终端可视缓冲（xterm clear，不向前台进程发任何字符） */
  clearScreen: () => void;
  getCursorPosition: () => { x: number; y: number } | null;
  getTerminalElement: () => HTMLDivElement | null;
  focus: () => void;
}

interface Props {
  isSidebarOpen: boolean;
  isLoggedIn: boolean;
  sshSessionId: string | null;
  /** 多标签页下当前标签是否可见；从隐藏变为可见时重新 fit + 聚焦 */
  isActive?: boolean;
  onSocketReady: (socket: Socket) => void;
  onCommandInput?: (data: string) => void;
  onTerminalSelection?: (text: string, endCol: number, endRow: number) => void;
  onFileLinkClick?: (pathText: string) => void;
}

interface TerminalKeyHandlerDeps {
  /** 当前 xterm 实例（读取选区用） */
  term: Terminal;
  /** 延迟取实例：粘贴的异步回调触发时组件可能已卸载，ref 可能已置空 */
  getXterm: () => Terminal | null;
  getSocket: () => Socket | null;
}

/** Ctrl+C 复制（有选区时）/ Ctrl+V 粘贴的自定义按键处理；独立导出以便单测 */
export function createTerminalKeyHandler({ term, getXterm, getSocket }: TerminalKeyHandlerDeps) {
  return (e: KeyboardEvent): boolean => {
    // xterm 对 keyup/keypress 也会回调本处理器；只处理 keydown，
    // 否则按住 Ctrl 先松 V 时 keyup 会再触发一次粘贴（内容出现两次）
    if (e.type !== 'keydown') return true;

    const isCtrlShiftC = e.ctrlKey && e.shiftKey && e.key === 'C';
    const isCtrlC = e.ctrlKey && !e.shiftKey && e.key === 'c';

    if (isCtrlShiftC || (isCtrlC && term.hasSelection())) {
      const sel = term.getSelection();
      if (sel) {
        const desktop = (window as any).hpclawDesktop;
        if (desktop?.clipboard) {
          desktop.clipboard.writeText(sel).catch(() => {});
        } else {
          navigator.clipboard.writeText(sel).catch(() => {
            document.execCommand('copy');
          });
        }
      }
      return false; // Do not send to terminal
    }

    // 粘贴：自定义通道发送 + 阻止浏览器默认粘贴动作（preventDefault），
    // 保证恰好一次——原生路径在 Electron 里不稳定（Ctrl+V 可能无响应或双发）
    if (e.ctrlKey && e.key.toLowerCase() === 'v') {
      e.preventDefault();
      if (e.repeat) return false; // 长按自动重复只触发一次粘贴
      const desktop = (window as any).hpclawDesktop;
      const readClipboard = desktop?.clipboard
        ? () => desktop.clipboard.readText()
        : () => navigator.clipboard.readText();
      readClipboard().then(text => {
        if (!text) return;
        const xterm = getXterm();
        if (xterm) {
          // 走 xterm 粘贴通道：远端程序开启 bracketed paste 时自动包裹
          // 转义序列，与原生粘贴行为一致，避免 readline/vim 下行为分裂
          xterm.paste(text);
        } else {
          const socket = getSocket();
          if (socket) socket.emit('data', text);
        }
      }).catch(() => { /* clipboard not available */ });
      return false;
    }

    return true; // Let xterm handle other keys normally
  };
}

const TerminalComponent = forwardRef<TerminalHandle, Props>(
  function TerminalComponent({ isSidebarOpen, isLoggedIn, sshSessionId, isActive = true, onSocketReady, onCommandInput, onTerminalSelection, onFileLinkClick }, ref) {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<Terminal | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const cleanupRef = useRef<(() => void) | null>(null);
    // shell 通道死亡提示；重连会请求服务端真正重建远程 PTY。
    const [shellDead, setShellDead] = useState(false);
    const [shellRestarting, setShellRestarting] = useState(false);
    const [shellError, setShellError] = useState('');
    // Use ref to avoid stale closure in xterm event listener
    const onSelectionRef = useRef(onTerminalSelection);
    onSelectionRef.current = onTerminalSelection;
    const onFileLinkClickRef = useRef(onFileLinkClick);
    onFileLinkClickRef.current = onFileLinkClick;

    // Capture state for command execution
    // 捕获缓冲改为分片数组 push、读取时 join，避免 += 逐包不可变拼接的 O(n²) 开销
    const captureRef = useRef<{
      active: boolean;
      buffer: string[];
      resolve: ((val: string) => void) | null;
      timeoutId: NodeJS.Timeout | null;
      silent: boolean;
    }>({ active: false, buffer: [], resolve: null, timeoutId: null, silent: false });

    // Silent command mode: hides the echoed command line while still showing output and prompt.
    const silentModeRef = useRef<{
      active: boolean;
      marker: string;
      buffer: string;
      timeoutId: NodeJS.Timeout | null;
      /** true = 连输出也不回显（pwd 探测等纯内部调用） */
      hideOutput: boolean;
    }>({ active: false, marker: '', buffer: '', timeoutId: null, hideOutput: false });

    const tryResolveCapture = useCallback(() => {
      if (!captureRef.current.active) return;
      const cleanBuffer = cleanTerminalOutput(captureRef.current.buffer.join(''));
      const lines = cleanBuffer.split('\n');
      const lastLine = lines[lines.length - 1]?.trim() || '';

      if (/[\$#%>]\s*$/.test(lastLine)) {
        captureRef.current.active = false;
        if (captureRef.current.timeoutId) {
          clearTimeout(captureRef.current.timeoutId);
          captureRef.current.timeoutId = null;
        }
        if (captureRef.current.resolve) {
          let outputLines = lines;
          if (outputLines.length > 1) {
            outputLines.pop(); // remove prompt line
            if (!captureRef.current.silent) {
              outputLines.shift(); // remove echoed command line
            }
          }
          captureRef.current.resolve(outputLines.join('\n').trim());
        }
      }
    }, []);

    useImperativeHandle(ref, () => ({
      executeCommand: (cmd: string, waitAndCapture: boolean = true, silent: boolean = false, hideOutput: boolean = false): Promise<string> => {
        return new Promise((resolve) => {
          if (!socketRef.current || !socketRef.current.connected) {
            return resolve('[错误]: WebSocket 未连接');
          }
          if (/\brm\b/.test(cmd)) {
            return resolve('[安全拦截]: 禁止执行 rm 命令');
          }

          if (silent) {
            const marker = `__HPCLAW_SILENT_${Math.random().toString(36).slice(2)}__`;
            silentModeRef.current = { active: true, marker, buffer: '', timeoutId: null, hideOutput: !!hideOutput };
            socketRef.current.emit('data', `echo '${marker}'; ${cmd}\n`);
            silentModeRef.current.timeoutId = setTimeout(() => {
              if (silentModeRef.current.active) {
                const buffered = silentModeRef.current.buffer;
                silentModeRef.current.active = false;
                silentModeRef.current.buffer = '';
                if (xtermRef.current && !silentModeRef.current.hideOutput) xtermRef.current.write(buffered);
              }
            }, 10_000);
            if (waitAndCapture) {
              captureRef.current = { active: true, buffer: [], resolve, timeoutId: null, silent: true };

              setTimeout(() => {
                if (captureRef.current.active) {
                  captureRef.current.active = false;
                  resolve("[系统提示：命令执行超时，可能程序尚未结束。]");
                }
              }, 300000); // 5 minutes for long-running commands
            } else {
              resolve('');
            }
            return;
          }

          if (waitAndCapture) {
            captureRef.current = { active: true, buffer: [], resolve, timeoutId: null, silent: false };
            socketRef.current.emit('data', cmd + '\n');

            setTimeout(() => {
              if (captureRef.current.active) {
                captureRef.current.active = false;
                resolve("[系统提示：命令执行超时，可能程序尚未结束。]");
              }
            }, 300000); // 5 minutes for long-running commands
          } else {
            socketRef.current.emit('data', cmd + '\n');
            resolve('');
          }
        });
      },
      getSocket: () => socketRef.current,
      writeToTerminal: (data: string) => {
        if (xtermRef.current) xtermRef.current.write(data);
      },
      pasteText: (text: string) => {
        if (!text) return;
        if (xtermRef.current) {
          xtermRef.current.paste(text);
        } else {
          socketRef.current?.emit('data', text);
        }
      },
      selectAll: () => {
        xtermRef.current?.selectAll();
      },
      clearScreen: () => {
        xtermRef.current?.clear();
      },
      getCursorPosition: () => {
        const term = xtermRef.current;
        if (!term) return null;
        // cursorY is the absolute line in the scrollback buffer.
        // baseY is the first visible line in the viewport.
        // Subtracting gives the visible row position (0-based from viewport top).
        const visibleY = term.buffer.active.cursorY - term.buffer.active.baseY;
        return {
          x: term.buffer.active.cursorX,
          y: Math.max(0, visibleY),
        };
      },
      getTerminalElement: () => terminalRef.current,
      focus: () => {
        if (xtermRef.current) xtermRef.current.focus();
      },
    }));

    useEffect(() => {
      if (!isLoggedIn || !terminalRef.current || xtermRef.current) return;

      // hidden 保活容器（0 尺寸）下等待首次非零尺寸再 init 的观察者
      let initObserver: ResizeObserver | null = null;

      // Wait for container to have real dimensions before initializing xterm
      // This prevents "Cannot read properties of undefined (reading 'dimensions')" crash
      const initTimer = setTimeout(() => {
        const container = terminalRef.current;
        if (!container || container.clientWidth === 0 || container.clientHeight === 0) {
          // Container not ready yet, retry once
          requestAnimationFrame(() => {
            const el = terminalRef.current;
            if (!el || xtermRef.current) return;
            if (el.clientWidth > 0 && el.clientHeight > 0) {
              initTerminal();
              return;
            }
            // display:none 父级下 rAF 照常触发、容器尺寸恒为 0；此时 init 会得到
            // 0×0 终端（fit no-op，shell:ready 以 80×24 上报 pty，首切集群页闪错乱）。
            // 改为挂 ResizeObserver，等容器首次出现非零尺寸再 init。
            if (typeof ResizeObserver === 'undefined') {
              initTerminal();
              return;
            }
            initObserver = new ResizeObserver(() => {
              const target = terminalRef.current;
              if (!target || target.clientWidth === 0 || target.clientHeight === 0) return;
              initObserver?.disconnect();
              initObserver = null;
              initTerminal(); // 内部有 xtermRef 重入保护
            });
            initObserver.observe(el);
          });
          return;
        }
        initTerminal();
      }, 100);

      const initTerminal = () => {
        const container = terminalRef.current;
        if (!container || xtermRef.current) return;

        try {
          const term = new Terminal({
          cursorBlink: true,
          theme: {
            background: '#1e2026',
            foreground: '#e2e6eb',
            cursor: '#c3cad3',
            selectionBackground: '#3b82f652',
          },
          fontFamily: '"JetBrains Mono", "Sarasa Mono SC", "Noto Sans Mono CJK SC", "Microsoft YaHei", "Fira Code", monospace',
          fontSize: 16,
          allowTransparency: true,
          scrollback: 5000,
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(container);
        fitAddon.fit();

        // 可点击链接：带扩展名的文件 → 预览；绝对路径/裸目录名 → cd 进入
        // 与预览分类(shared/filePreview.ts)的文本扩展名对齐，另支持 .gz/.bz2/.xz/.zst 压缩变体
        const FILE_LINK_REGEX = /[\w.~/-]+\.(?:txt|log|out|err|md|markdown|rmd|csv|tsv|tab|json|jsonl|xml|ya?ml|toml|ini|cfg|conf|env|properties|ipynb|sh|bash|zsh|fish|ps1|bat|cmd|py|r|jl|lua|pl|pm|c|cc|cpp|h|hpp|java|js|jsx|ts|tsx|css|scss|go|rs|sql|f90?|f95|m|smk|lsf|sbatch|slurm|pbs|sge|job|fa|fna|faa|fasta|fas|fq|fastq|qual|csfasta|sam|bam|cram|vcf|bcf|gtf|gff2?|gff3|bed|bedgraph|wig|narrowpeak|broadpeak|paf|dict|fai|aln|clustal|maf|nwk|newick|sto|embl|gb|gbk|genbank|pdb|mol2|sdf|smi|xyz|gro|sbml|ped|map|bim|fam|frq|frqx|gct|rnk|cls|grp|gmt|mtx|pdf|png|apng|jpe?g|jfif|gif|svg|bmp|webp|avif|ico|tiff?|heic|heif|docx?|odt|rtf|xlsx?|xlsm|xlsb|ods|pptx?|odp|html?|xhtml|mp3|wav|ogg|oga|opus|flac|m4a|aac|mp4|m4v|webm|ogv|mov|mkv|avi)(?:\.(?:gz|bz2|xz|zst))?\b/gi;
        // 绝对路径（≥2 段），如 /public/home/user/project
        const ABS_PATH_REGEX = /(?:^|[\s"'(=|:])((?:\/[\w.~+-]+){2,}\/?)/g;
        // ls 输出里的裸名称（目录/无扩展名文件），需过滤权限串、数字、月份等噪音
        const BARE_NAME_REGEX = /(?:^|\s)(\.?[\w][\w.~+-]*)(?=\s|$)/g;
        const NOISE_WORDS = new Set(['total', 'ls', 'cd', 'pwd']);
        const MONTHS = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$/i;
        const PERMS = /^[-dlpscb][rwxstST-]{9}\+?\.?$/;
        term.registerLinkProvider({
          provideLinks: (y: number, callback: (links: any[] | undefined) => void) => {
            const line = term.buffer.active.getLine(y - 1);
            const lineText = line?.translateToString(true) ?? '';
            // 廉价预检：既无 '.' 也无 '/' 的行不可能命中文件/绝对路径链接，直接返回，
            // 避免悬停/滚动/重绘时逐行跑 3 个正则（FILE_LINK_REGEX 是上百个扩展名的大交替）
            if (!lineText.includes('.') && !lineText.includes('/')) {
              callback(undefined);
              return;
            }
            const links: any[] = [];
            const taken: Array<[number, number]> = [];
            const overlaps = (s: number, e: number) => taken.some(([ts, te]) => s < te && ts < e);
            const pushLink = (index: number, text: string) => {
              taken.push([index, index + text.length]);
              links.push({
                range: {
                  start: { x: index + 1, y },
                  end: { x: index + text.length, y },
                },
                text,
                activate: (_event: unknown, t: string) => {
                  onFileLinkClickRef.current?.(t);
                },
              });
            };
            for (const m of lineText.matchAll(FILE_LINK_REGEX)) {
              if (m[0].length < 4) continue;
              pushLink(m.index ?? 0, m[0]);
            }
            for (const m of lineText.matchAll(ABS_PATH_REGEX)) {
              const idx = (m.index ?? 0) + (m[0].length - m[1].length);
              if (!overlaps(idx, idx + m[1].length)) pushLink(idx, m[1]);
            }
            for (const m of lineText.matchAll(BARE_NAME_REGEX)) {
              const w = m[1];
              const idx = (m.index ?? 0) + (m[0].length - w.length);
              if (w.length < 2) continue;
              if (PERMS.test(w) || MONTHS.test(w) || NOISE_WORDS.has(w.toLowerCase())) continue;
              if (/^\d[\d:.-]*$/.test(w)) continue; // 纯数字/时间/日期
              if (overlaps(idx, idx + w.length)) continue;
              pushLink(idx, w);
            }
            callback(links.length > 0 ? links : undefined);
          },
        } as any);

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        const socket = io({ timeout: 60000, auth: { sessionId: sshSessionId } });
        socketRef.current = socket;
        onSocketReady(socket);

        socket.on('connect', () => {
          term.writeln('\x1b[32m[System]\x1b[0m Connected to server via WebSocket.');
        });

        socket.on('shell:ready', () => {
          setShellDead(false);
          setShellRestarting(false);
          setShellError('');
          term.writeln('\x1b[32m[System]\x1b[0m Remote shell is ready.');
          socket.emit('resize', term.cols, term.rows);
          if (isActive && !isSidebarOpen) term.focus();
        });

        // shell 通道死亡（bash 退出/通道被回收）：提示重连
        socket.on('shell:dead', () => {
          setShellDead(true);
          setShellRestarting(false);
        });

        socket.on('shell:restarting', () => {
          setShellDead(true);
          setShellRestarting(true);
          setShellError('');
        });

        socket.on('shell:respawn-error', (message: string) => {
          setShellDead(true);
          setShellRestarting(false);
          setShellError(message || '远程 Shell 重建失败');
        });

        socket.on('ssh:disconnected', (event?: { error?: string }) => {
          setShellDead(true);
          setShellRestarting(false);
          setShellError(event?.error || 'SSH 主连接已断开，请重新登录计算资源');
        });

        // socket 断开（网络抖动/服务端重启）：socket.io 会自动重连；
        // 若 3 秒内未能恢复也给出重连入口，避免用户干等
        socket.on('disconnect', () => {
          setTimeout(() => {
            // 只关心当前 socket 的断开；重启流程中旧 socket 断开不算
            if (socketRef.current === socket && !socket.connected) setShellDead(true);
          }, 3000);
        });

        socket.on('data', (data: string) => {
          if (silentModeRef.current.active) {
            silentModeRef.current.buffer += data;
            const marker = silentModeRef.current.marker;
            const normBuffer = silentModeRef.current.buffer.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            const markerEnd = marker + '\n';
            const idx = normBuffer.indexOf(markerEnd);
            if (idx !== -1) {
              const rest = normBuffer.slice(idx + markerEnd.length);
              if (xtermRef.current && !silentModeRef.current.hideOutput && rest) {
                // 被静默吞掉的命令行使光标仍停留在旧提示符后，输出必须先换行，
                // 否则内容粘在提示符同一行（排版错位）
                xtermRef.current.write(rest.startsWith('\n') ? rest : '\r\n' + rest);
              }
              silentModeRef.current.active = false;
              silentModeRef.current.buffer = '';
              if (silentModeRef.current.timeoutId) {
                clearTimeout(silentModeRef.current.timeoutId);
                silentModeRef.current.timeoutId = null;
              }
              if (captureRef.current.active) {
                captureRef.current.buffer.push(rest);
                tryResolveCapture();
              }
            }
            return;
          }

          term.write(data);
          if (captureRef.current.active) {
            captureRef.current.buffer.push(data);
            if (captureRef.current.timeoutId) {
              clearTimeout(captureRef.current.timeoutId);
            }
            captureRef.current.timeoutId = setTimeout(tryResolveCapture, 500);
          }
        });

        term.onData((data) => {
          socket.emit('data', data);
          if (onCommandInput) onCommandInput(data);
        });

        term.onSelectionChange(() => {
          const cb = onSelectionRef.current;
          if (cb) {
            const sel = term.getSelection();
            const pos = term.getSelectionPosition();
            if (!pos || !pos.end) {
              cb(sel || '', 0, 0);
            } else {
              // Convert buffer-absolute rows to viewport-relative
              // (same fix as getCursorPosition — baseY is the first visible line)
              const baseY = term.buffer.active.baseY;
              cb(sel || '', pos.end.x, pos.end.y - baseY);
            }
          }
        });

        // ── Clipboard: Ctrl+C copy (with selection)；粘贴走 xterm 原生通道 ──
        term.attachCustomKeyEventHandler(createTerminalKeyHandler({
          term,
          getXterm: () => xtermRef.current,
          getSocket: () => socketRef.current,
        }));

        // resize 在窗口/AI 侧栏拖拽时密集派发（且每个终端标签页各挂一个监听器），
        // 而 fit 是重操作（DOM 测量 + canvas 尺寸重建），用 ~120ms trailing 防抖合并
        let resizeTimer: NodeJS.Timeout | null = null;
        const doResize = () => {
          if (fitAddonRef.current && xtermRef.current && socketRef.current) {
            fitAddonRef.current.fit();
            socketRef.current.emit('resize', xtermRef.current.cols, xtermRef.current.rows);
          }
        };
        const handleResize = () => {
          if (resizeTimer) clearTimeout(resizeTimer);
          resizeTimer = setTimeout(doResize, 120);
        };
        window.addEventListener('resize', handleResize);
        setTimeout(doResize, 100);

        // 作业面板开合 / 断点跳变只改变终端容器宽度，不触发 window resize；
        // 观察外层容器 div，尺寸变化时复用同一防抖 fit + 同步远端 pty 尺寸
        let containerObserver: ResizeObserver | null = null;
        if (typeof ResizeObserver !== 'undefined') {
          containerObserver = new ResizeObserver(() => {
            const el = terminalRef.current;
            // hidden 保活容器尺寸为 0：fit 无意义，跳过（恢复可见时 isActive 兜底 refit）
            if (!el || el.clientWidth === 0 || el.clientHeight === 0) return;
            handleResize();
          });
          containerObserver.observe(container.parentElement ?? container);
        }

        // Store cleanup function
        cleanupRef.current = () => {
          containerObserver?.disconnect();
          window.removeEventListener('resize', handleResize);
          if (resizeTimer) {
            clearTimeout(resizeTimer);
            resizeTimer = null;
          }
          socket.disconnect();
          term.dispose();
          xtermRef.current = null;
          socketRef.current = null;
        };
        } catch (err) {
          console.error('[Terminal] Init error:', err);
          // Terminal failed to initialize, but don't crash the app
        }
      };

      return () => {
        clearTimeout(initTimer);
        initObserver?.disconnect();
        if (cleanupRef.current) cleanupRef.current();
      };
    }, [isLoggedIn]);

    // Refit on sidebar toggle
    useEffect(() => {
      if (isLoggedIn) {
        setTimeout(() => {
          if (fitAddonRef.current && xtermRef.current) {
            fitAddonRef.current.fit();
          }
        }, 300);
      }
    }, [isSidebarOpen, isLoggedIn]);

    // 标签页从隐藏切回可见：容器尺寸从 0 恢复，必须重新 fit 并同步远端 pty 尺寸。
    // 注意：AI 侧栏打开时不主动抢焦点，避免打断用户正在进行的聊天输入
    useEffect(() => {
      if (isActive && isLoggedIn) {
        setTimeout(() => {
          if (fitAddonRef.current && xtermRef.current) {
            fitAddonRef.current.fit();
            socketRef.current?.emit('resize', xtermRef.current.cols, xtermRef.current.rows);
            if (!isSidebarOpen) xtermRef.current.focus();
          }
        }, 60);
      }
    }, [isActive, isLoggedIn, isSidebarOpen]);

    return (
      <div className="flex-1 border border-scholar-700 rounded-lg overflow-hidden shadow-lg p-2 bg-[#1e2026] relative" onMouseDown={() => xtermRef.current?.focus()}>
        <div ref={terminalRef} className="absolute inset-2" />
        {shellDead && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 rounded-lg">
            <div className="flex flex-col items-center gap-2 px-4 text-center">
              {shellError && <p className="text-xs text-red-300 max-w-md">{shellError}</p>}
              <button
                onClick={() => {
                  setShellRestarting(true);
                  setShellError('');
                  void (async () => {
                    try {
                      const response = await fetch('/api/reconnect', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'X-SSH-Session-Id': sshSessionId,
                        },
                        body: JSON.stringify({ sessionId: sshSessionId }),
                      });
                      const body = await response.json().catch(() => ({}));
                      if (!response.ok || body?.success !== true) {
                        throw new Error(body?.error || `重连失败 (HTTP ${response.status})`);
                      }

                      // 服务端已为原 sessionId 建立新的 SSH/SFTP/PTY。重建
                      // Socket 订阅，使 data 监听器绑到新 PTY，而不是旧的死通道。
                      const socket = socketRef.current;
                      if (!socket) throw new Error('WebSocket 未初始化');
                      socket.disconnect();
                      socket.connect();
                    } catch (error) {
                      setShellRestarting(false);
                      setShellDead(true);
                      setShellError(error instanceof Error ? error.message : String(error));
                    }
                  })();
                }}
                disabled={shellRestarting}
                className="px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-colors shadow-lg disabled:opacity-60"
              >
                {shellRestarting ? '终端短暂中断，正在自动恢复…' : '终端连接已断开，点击重连'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default TerminalComponent;
