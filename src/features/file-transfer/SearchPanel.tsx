import { useState, useCallback, useRef, useEffect, type KeyboardEvent } from 'react';
import { Search, X, Loader2, FileIcon, FolderIcon, ArrowRight } from 'lucide-react';
import type { FileEntry, FileSide } from '@/shared/fileTransfer';
import { searchRemote } from './api';
import { toDisplayError } from '../../utils/displayError';

export interface SearchPanelProps {
  open: boolean;
  root: string;
  side: FileSide;
  sessionId?: string;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

const MAX_VISIBLE_RESULTS = 5000;
const DEBOUNCE_MS = 300;

export default function SearchPanel({
  open,
  root,
  side,
  sessionId,
  onClose,
  onNavigate,
}: SearchPanelProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const doSearch = useCallback(
    async (q: string) => {
      // Cancel previous search
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      if (!q.trim()) {
        setResults([]);
        setTruncated(false);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (side === 'local' && window.hpclawDesktop?.localFiles?.search) {
          // Local search via desktop API
          const result = await window.hpclawDesktop.localFiles.search(root, q.trim());
          if (controller.signal.aborted) return;
          setResults(result.entries.slice(0, MAX_VISIBLE_RESULTS));
          setTruncated(result.truncated || result.entries.length > MAX_VISIBLE_RESULTS);
        } else if (side === 'remote' && sessionId) {
          // Remote search via API
          const result = await searchRemote(sessionId, root, q.trim());
          if (controller.signal.aborted) return;
          setResults(result.entries.slice(0, MAX_VISIBLE_RESULTS));
          setTruncated(result.truncated || result.entries.length > MAX_VISIBLE_RESULTS);
        }
      } catch (err: unknown) {
        if (controller.signal.aborted) return;
        setError(toDisplayError(err, '搜索失败'));
        setResults([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [root, side, sessionId],
  );

  const handleInputChange = useCallback(
    (value: string) => {
      setQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        doSearch(value);
      }, DEBOUNCE_MS);
    },
    [doSearch],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        doSearch(query);
      }
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [doSearch, query, onClose],
  );

  const handleNavigate = useCallback(
    (path: string) => {
      onNavigate(path);
      onClose();
    },
    [onNavigate, onClose],
  );

  if (!open) return null;

  return (
    <div className="file-transfer-search-panel" data-testid="search-panel">
      {/* Header */}
      <div className="search-panel-header">
        <div className="search-panel-title">
          <Search size={14} />
          <span>搜索文件</span>
        </div>
        <button
          className="search-panel-close"
          data-testid="search-panel-close"
          onClick={onClose}
        >
          <X size={14} />
        </button>
      </div>

      {/* Root directory display */}
      <div className="search-panel-root" data-testid="search-root">
        <FolderIcon size={12} />
        <span>{root}</span>
      </div>

      {/* Search input */}
      <div className="search-panel-input-wrapper">
        <Search size={14} className="search-input-icon" />
        <input
          className="search-panel-input"
          type="text"
          placeholder="输入搜索关键词..."
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          data-testid="search-input"
          autoFocus
        />
        {loading && <Loader2 size={14} className="search-spinner" />}
      </div>

      {/* Error */}
      {error && (
        <div className="search-panel-error" data-testid="search-error">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && !error && (
        <div className="search-panel-loading" data-testid="search-loading">
          <Loader2 size={20} className="search-spinner" />
          <span>搜索中...</span>
        </div>
      )}

      {/* Results */}
      {!loading && !error && (
        <div className="search-panel-results" data-testid="search-results">
          {results.length === 0 && query.trim() && (
            <div className="search-panel-empty" data-testid="search-empty">
              未找到匹配文件
            </div>
          )}

          {results.length > 0 && (
            <>
              {truncated && (
                <div className="search-panel-truncated" data-testid="search-truncated">
                  结果超过 {MAX_VISIBLE_RESULTS} 条，仅显示前 {MAX_VISIBLE_RESULTS} 条
                </div>
              )}
              <div className="search-results-table">
                {results.map((entry, idx) => (
                  <button
                    key={`${entry.path}-${idx}`}
                    className="search-result-row"
                    data-testid={`search-result-${idx}`}
                    onClick={() => handleNavigate(entry.path)}
                  >
                    {entry.kind === 'directory' ? (
                      <FolderIcon size={14} className="text-yellow-400" />
                    ) : (
                      <FileIcon size={14} className="text-blue-400" />
                    )}
                    <span className="search-result-name">{entry.name}</span>
                    <span className="search-result-path">{entry.path}</span>
                    <ArrowRight size={12} className="search-result-arrow" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
