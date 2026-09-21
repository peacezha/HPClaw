import { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { renderAsync } from 'docx-preview';
import { read, utils } from 'xlsx';

export function decodeBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

export function ImagePreview({ base64, mime, name }: {
  base64: string;
  mime: string;
  name: string;
}) {
  const [zoom, setZoom] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  return (
    <div className="preview-image-reader">
      <div className="preview-reader-toolbar">
        <button type="button" onClick={() => setZoom(value => Math.max(0.25, value - 0.25))} aria-label="缩小">−</button>
        <span>{Math.round(zoom * 100)}%</span>
        <button type="button" onClick={() => setZoom(value => Math.min(4, value + 0.25))} aria-label="放大">＋</button>
        <button type="button" onClick={() => setZoom(1)}>适应窗口</button>
      </div>
      {/* 容器有 min-height 占位；大图加载完成前显示提示，避免渲染抖动 */}
      <div className="preview-image-container">
        {!loaded && !error && <div className="preview-image-placeholder">加载中…</div>}
        {error && <div className="preview-error">当前系统内核无法显示该图片，可使用右上角的本机软件打开</div>}
        <img
          src={`data:${mime};base64,${base64}`}
          alt={name}
          className="preview-image"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{ transform: `scale(${zoom})`, opacity: loaded ? 1 : 0 }}
        />
      </div>
    </div>
  );
}

const HTML_PREVIEW_CSP_BASE = [
  "default-src 'none'",
  "img-src data: blob:",
  "style-src 'unsafe-inline' data:",
  "font-src data:",
  "media-src data: blob:",
  "connect-src 'none'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "navigate-to 'none'",
];

export function buildSafeHtmlPreviewDocument(html: string, allowScripts = false): string {
  const csp = [
    ...HTML_PREVIEW_CSP_BASE,
    allowScripts ? "script-src 'unsafe-inline' blob:" : "script-src 'none'",
  ].join('; ');
  const safetyHead = [
    `<meta http-equiv="Content-Security-Policy" content="${csp}">`,
    '<meta name="referrer" content="no-referrer">',
    '<style>a[href]{pointer-events:none;cursor:not-allowed}</style>',
  ].join('');
  if (/<head(?:\s[^>]*)?>/i.test(html)) {
    return html.replace(/<head(?:\s[^>]*)?>/i, match => `${match}${safetyHead}`);
  }
  if (/<html(?:\s[^>]*)?>/i.test(html)) {
    return html.replace(/<html(?:\s[^>]*)?>/i, match => `${match}<head>${safetyHead}</head>`);
  }
  return `<!doctype html><html><head>${safetyHead}</head><body>${html}</body></html>`;
}

export function HtmlPreview({ html, name }: { html: string; name: string }) {
  const [allowScripts, setAllowScripts] = useState(false);
  const document = useMemo(
    () => buildSafeHtmlPreviewDocument(html, allowScripts),
    [allowScripts, html],
  );
  return (
    <div className="preview-html-reader" data-testid="html-preview">
      <div className="preview-reader-toolbar preview-html-toolbar">
        <span>隔离预览 · 外部网络资源已禁用</span>
        <button type="button" onClick={() => setAllowScripts(value => !value)}>
          {allowScripts ? '关闭网页脚本' : '启用交互内容'}
        </button>
      </div>
      <iframe
        title={`HTML 预览 ${name}`}
        srcDoc={document}
        sandbox={allowScripts ? 'allow-scripts' : ''}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

export function MediaPreview({ base64, mime, kind, name }: {
  base64: string;
  mime: string;
  kind: 'audio' | 'video';
  name: string;
}) {
  const [error, setError] = useState(false);
  const source = `data:${mime};base64,${base64}`;
  return (
    <div className={`preview-media-reader preview-media-${kind}`}>
      {error && (
        <div className="preview-error">当前系统缺少播放“{name}”所需的解码器，可使用右上角的本机软件打开</div>
      )}
      {kind === 'audio' ? (
        <audio controls preload="metadata" src={source} onError={() => setError(true)} data-testid="audio-preview" />
      ) : (
        <video controls playsInline preload="metadata" src={source} onError={() => setError(true)} data-testid="video-preview" />
      )}
    </div>
  );
}

export function MarkdownPreview({ text }: { text: string }) {
  return <article className="preview-markdown"><ReactMarkdown>{text}</ReactMarkdown></article>;
}

export function TextPreview({ text, truncated, lineLimit }: {
  text: string;
  truncated: boolean;
  lineLimit?: number;
}) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  return (
    <div className="preview-text-reader">
      {truncated && lineLimit && (
        <div className="preview-truncated" role="status">仅预览 head -{lineLimit}</div>
      )}
      <ol className="preview-lines">
        {lines.map((line, index) => (
          <li key={`${index}-${line.slice(0, 16)}`}><code>{line || ' '}</code></li>
        ))}
      </ol>
    </div>
  );
}

export function TextEditor({ text, onChange }: {
  text: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="preview-text-reader preview-text-editor">
      <textarea
        className="preview-textarea"
        value={text}
        onChange={event => onChange(event.target.value)}
        spellCheck={false}
        data-testid="preview-textarea"
      />
    </div>
  );
}

export function SheetPreview({ bytes, text }: { bytes?: Uint8Array; text?: string }) {
  const workbook = useMemo(
    () => text === undefined
      ? read(bytes, { type: 'array' })
      : read(text, { type: 'string' }),
    [bytes, text],
  );
  const [activeSheet, setActiveSheet] = useState(workbook.SheetNames[0] || '');
  const rows = useMemo(() => {
    if (!activeSheet) return [] as unknown[][];
    return utils
      .sheet_to_json<unknown[]>(workbook.Sheets[activeSheet], { header: 1, raw: false })
      .slice(0, 2_000)
      .map(row => row.slice(0, 200));
  }, [activeSheet, workbook]);

  if (!activeSheet) return <div className="preview-empty">工作簿为空</div>;
  return (
    <div className="preview-sheet-reader">
      <div className="preview-sheet-tabs" role="tablist" aria-label="工作表">
        {workbook.SheetNames.map(sheet => (
          <button
            key={sheet}
            type="button"
            role="tab"
            aria-selected={sheet === activeSheet}
            onClick={() => setActiveSheet(sheet)}
          >
            {sheet}
          </button>
        ))}
      </div>
      <div className="preview-sheet-scroll">
        <table>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, columnIndex) => (
                  <td key={columnIndex}>{String(cell ?? '')}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DocxPreview({ bytes }: { bytes: Uint8Array }) {
  const host = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!host.current) return;
    host.current.replaceChildren();
    setError('');
    const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
    void renderAsync(buffer, host.current, undefined, {
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: false,
      breakPages: true,
    }).catch(cause => setError(cause instanceof Error ? cause.message : String(cause)));
  }, [bytes]);
  if (error) return <div role="alert" className="preview-error">DOCX 解析失败：{error}</div>;
  return <div ref={host} className="preview-docx" data-testid="docx-preview" />;
}

export function PdfPreview({ bytes }: { bytes: Uint8Array }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [documentProxy, setDocumentProxy] = useState<any>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    let loadingTask: any;
    void import('pdfjs-dist').then(pdfjs => {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url,
      ).toString();
      loadingTask = pdfjs.getDocument({ data: bytes });
      return loadingTask.promise;
    }).then(document => {
      if (!cancelled) setDocumentProxy(document);
    }).catch(cause => {
      if (!cancelled) setError(cause instanceof Error ? cause.message : String(cause));
    });
    return () => {
      cancelled = true;
      void loadingTask?.destroy();
    };
  }, [bytes]);

  useEffect(() => {
    if (!documentProxy || !canvasRef.current) return;
    let renderTask: any;
    void documentProxy.getPage(pageNumber).then((page: any) => {
      const viewport = page.getViewport({ scale: 1.25 });
      const canvas = canvasRef.current!;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas is unavailable');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      renderTask = page.render({ canvasContext: context, viewport });
      return renderTask.promise;
    }).catch((cause: unknown) => {
      if ((cause as { name?: string })?.name !== 'RenderingCancelledException') {
        setError(cause instanceof Error ? cause.message : String(cause));
      }
    });
    return () => renderTask?.cancel();
  }, [documentProxy, pageNumber]);

  if (error) return <div role="alert" className="preview-error">PDF 解析失败：{error}</div>;
  return (
    <div className="preview-pdf" data-testid="pdf-preview">
      <div className="preview-reader-toolbar">
        <button type="button" disabled={pageNumber <= 1} onClick={() => setPageNumber(value => value - 1)}>上一页</button>
        <span>{pageNumber} / {documentProxy?.numPages || 0}</span>
        <button
          type="button"
          disabled={!documentProxy || pageNumber >= documentProxy.numPages}
          onClick={() => setPageNumber(value => value + 1)}
        >下一页</button>
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
}
