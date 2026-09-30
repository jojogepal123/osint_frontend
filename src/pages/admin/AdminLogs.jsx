import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import instance from "../../api/axios";

const LEVEL_COLORS = {
  emergency: "bg-red-600/30 text-red-200 border-red-500/50",
  alert:     "bg-red-600/30 text-red-200 border-red-500/50",
  critical:  "bg-red-500/20 text-red-300 border-red-500/30",
  error:     "bg-red-500/20 text-red-300 border-red-500/30",
  warning:   "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  notice:    "bg-blue-500/20 text-blue-300 border-blue-500/30",
  info:      "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  debug:     "bg-gray-500/20 text-gray-300 border-gray-500/30",
};

const LEVEL_OPTIONS = [
  { value: "error",   label: "Errors & above" },
  { value: "warning", label: "Warnings & above" },
  { value: "info",    label: "Info & above" },
  { value: "all",     label: "All levels" },
];

function formatBytes(b) {
  if (!b) return "0 B";
  const u = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(b) / Math.log(1024));
  return `${(b / Math.pow(1024, i)).toFixed(1)} ${u[i]}`;
}

export default function AdminLogs() {
  const [entries, setEntries] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, last_page: 1, file_size: 0, truncated: false });
  const [level, setLevel] = useState("error");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [level, debouncedSearch]);

  const fetchLogs = () => {
    setLoading(true);
    setError(null);
    instance
      .get("/api/admin/logs", { params: { level, search: debouncedSearch, page, per_page: 50 } })
      .then((r) => {
        setEntries(r.data.data ?? []);
        setMeta({
          total: r.data.total,
          page: r.data.page,
          last_page: r.data.last_page,
          file_size: r.data.file_size,
          truncated: r.data.truncated,
        });
      })
      .catch((e) => setError(e?.response?.data?.message || "Failed to load logs."))
      .finally(() => setLoading(false));
  };

  useEffect(fetchLogs, [level, debouncedSearch, page]);

  const clearLogs = async () => {
    if (!window.confirm("Clear the entire laravel.log file? This cannot be undone.")) return;
    setClearing(true);
    try {
      await instance.delete("/api/admin/logs");
      toast.success("Log file cleared.");
      fetchLogs();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to clear logs.");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">Logs</h1>
          <p className="text-gray-500 text-sm">
            Application errors from <code className="text-gray-400">storage/logs/laravel.log</code>
            {" · "}{formatBytes(meta.file_size)}
            {meta.truncated && <span className="text-yellow-400"> · showing last 5 MB only</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="text-xs px-3 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-40"
          >
            Refresh
          </button>
          <button
            onClick={clearLogs}
            disabled={clearing || meta.file_size === 0}
            className="text-xs px-3 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {clearing ? "Clearing…" : "Clear Log"}
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search message or stack trace…"
          className="flex-1 bg-gray-900/60 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-lime-500/50"
        />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="bg-gray-900/60 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-lime-500/50"
        >
          {LEVEL_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center gap-3 text-gray-500 text-sm p-10 justify-center">
            <div className="w-5 h-5 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
            Loading logs…
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-400 text-sm">{error}</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm">No log entries match.</div>
        ) : (
          <ul className="divide-y divide-gray-800">
            {entries.map((en, i) => {
              const key = `${meta.page}-${i}`;
              const open = expanded === key;
              return (
                <li key={key}>
                  <button
                    onClick={() => setExpanded(open ? null : key)}
                    className="w-full text-left px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 hover:bg-gray-800/40 transition-colors"
                  >
                    <span className="text-gray-500 text-xs font-mono shrink-0 w-40">{en.timestamp}</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border uppercase tracking-wider shrink-0 ${LEVEL_COLORS[en.level] ?? LEVEL_COLORS.debug}`}>
                      {en.level}
                    </span>
                    <span className="text-gray-200 text-sm truncate flex-1 font-mono">{en.message}</span>
                    {en.context && (
                      <span className="text-gray-600 text-xs shrink-0">{open ? "▲" : "▼"}</span>
                    )}
                  </button>
                  {open && (
                    <pre className="px-4 pb-4 pt-1 text-xs text-gray-400 font-mono whitespace-pre-wrap break-all bg-black/30 max-h-96 overflow-auto">
                      {en.message}
                      {en.context ? `\n\n${en.context}` : ""}
                    </pre>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {meta.last_page > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
          <span>{meta.total} entries · page {meta.page} of {meta.last_page}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={meta.page <= 1}
              className="px-3 py-1.5 rounded-lg border border-gray-700 hover:bg-gray-800 disabled:opacity-30"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, meta.last_page))}
              disabled={meta.page >= meta.last_page}
              className="px-3 py-1.5 rounded-lg border border-gray-700 hover:bg-gray-800 disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
