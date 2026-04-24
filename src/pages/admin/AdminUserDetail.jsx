import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../../api/axios";

const TYPE_COLORS = {
  phone:        "bg-blue-500/20 text-blue-300 border-blue-500/30",
  email:        "bg-purple-500/20 text-purple-300 border-purple-500/30",
  vehicle:      "bg-orange-500/20 text-orange-300 border-orange-500/30",
  challan:      "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  corporate:    "bg-pink-500/20 text-pink-300 border-pink-500/30",
  social:       "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  verification: "bg-green-500/20 text-green-300 border-green-500/30",
  leak:         "bg-red-500/20 text-red-300 border-red-500/30",
  upi:          "bg-lime-500/20 text-lime-300 border-lime-500/30",
};

const TYPE_LABELS = {
  phone: "Phone", email: "Email", vehicle: "Vehicle", challan: "Challan",
  corporate: "Corporate", social: "Social", verification: "Verified ID",
  leak: "Leak Data", upi: "UPI",
};

function safeQuery(raw) {
  if (!raw) return "—";
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object") {
      return Object.entries(parsed)
        .map(([k, v]) => `${k}: ${v}`)
        .join(" · ");
    }
    return String(parsed);
  } catch {
    return raw;
  }
}

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData]       = useState(null);
  const [queries, setQueries] = useState([]);
  const [meta, setMeta]       = useState({});
  const [page, setPage]       = useState(1);
  const [typeFilter, setType] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    instance.get(`/api/admin/users/${id}`)
      .then((r) => setData(r.data));
  }, [id]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page });
    if (typeFilter) params.set("type", typeFilter);
    instance.get(`/api/admin/users/${id}/queries?${params}`)
      .then((r) => { setQueries(r.data.data); setMeta(r.data); })
      .finally(() => setLoading(false));
  }, [id, page, typeFilter]);

  if (!data) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center gap-2 text-gray-500 text-sm">
        <div className="w-4 h-4 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
        Loading…
      </div>
    );
  }

  const { user, queries_by_type } = data;

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* Back button */}
      <button
        onClick={() => navigate("/admin/users")}
        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-5 sm:mb-6 transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back to Users
      </button>

      {/* ── User info card ── */}
      <div className="bg-gray-900/60 border border-white/5 rounded-xl p-4 sm:p-6 mb-5 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* Name + email */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-lg sm:text-xl font-bold text-white">{user.name}</h1>
              {user.is_admin && (
                <span className="text-xs px-2 py-0.5 rounded-full border bg-blue-500/20 text-blue-300 border-blue-500/30">Admin</span>
              )}
            </div>
            <div className="text-gray-400 text-sm truncate">{user.email}</div>
          </div>

          {/* Stats */}
          <div className="flex gap-5 sm:gap-6 shrink-0">
            <div className="text-center">
              <div className="text-lime-400 font-bold text-xl sm:text-2xl">{user.credits}</div>
              <div className="text-gray-500 text-xs">Credits</div>
            </div>
            <div className="text-center">
              <div className="text-white font-bold text-xl sm:text-2xl">{user.search_queries_count}</div>
              <div className="text-gray-500 text-xs">Searches</div>
            </div>
            <div className="text-center">
              <div className="text-white font-bold text-xl sm:text-2xl capitalize">{user.app_mode}</div>
              <div className="text-gray-500 text-xs">Mode</div>
            </div>
          </div>
        </div>

        {/* IPs */}
        {user.ips?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="text-gray-500 text-xs uppercase tracking-widest mb-2">Login IPs</div>
            <div className="flex flex-wrap gap-2">
              {user.ips.map((ip, i) => (
                <span key={i} className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-300 font-mono">
                  {ip.ip}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Queries by type */}
        {Object.keys(queries_by_type ?? {}).length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="text-gray-500 text-xs uppercase tracking-widest mb-2">Searches by Type</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(queries_by_type).map(([type, count]) => (
                <span key={type} className={`text-xs px-2.5 py-1 rounded-full border ${TYPE_COLORS[type] ?? "bg-white/5 text-gray-300 border-white/10"}`}>
                  {TYPE_LABELS[type] ?? type}: {count}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Search history header ── */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 mb-4">
        <h2 className="text-white font-semibold">Search History</h2>
        <select
          value={typeFilter}
          onChange={(e) => { setType(e.target.value); setPage(1); }}
          className="bg-gray-900 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none xs:w-auto w-full"
        >
          <option value="">All types</option>
          {Object.keys(TYPE_LABELS).map((t) => (
            <option key={t} value={t}>{TYPE_LABELS[t]}</option>
          ))}
        </select>
      </div>

      {/* ── Desktop / Tablet table ── */}
      <div className="hidden sm:block bg-gray-900/60 border border-white/5 rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[520px]">
          <thead>
            <tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-widest">
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Query</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">IP</th>
              <th className="text-left px-4 py-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
                  Loading…
                </div>
              </td></tr>
            ) : queries.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500">No queries found.</td></tr>
            ) : queries.map((q) => (
              <tr key={q.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border whitespace-nowrap ${TYPE_COLORS[q.type] ?? "bg-white/5 text-gray-400 border-white/10"}`}>
                    {TYPE_LABELS[q.type] ?? q.type ?? "Unknown"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-300 max-w-xs truncate text-xs">{safeQuery(q.query)}</td>
                <td className="px-4 py-3 text-gray-500 text-xs font-mono hidden md:table-cell">{q.ip_address ?? "—"}</td>
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                  {new Date(q.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile card list ── */}
      <div className="sm:hidden space-y-2">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-gray-500 text-sm">
            <div className="w-4 h-4 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
            Loading…
          </div>
        ) : queries.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">No queries found.</div>
        ) : queries.map((q) => (
          <div key={q.id} className="bg-gray-900/60 border border-white/5 rounded-xl px-4 py-3">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${TYPE_COLORS[q.type] ?? "bg-white/5 text-gray-400 border-white/10"}`}>
                {TYPE_LABELS[q.type] ?? q.type ?? "Unknown"}
              </span>
              <span className="text-gray-600 text-xs">{new Date(q.created_at).toLocaleString()}</span>
            </div>
            <div className="text-gray-300 text-sm truncate">{safeQuery(q.query)}</div>
            {q.ip_address && (
              <div className="text-gray-600 text-xs font-mono mt-1">{q.ip_address}</div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {meta.last_page > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500 flex-wrap gap-2">
          <span className="text-xs">Page {meta.current_page} of {meta.last_page}</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-white/10 disabled:opacity-40 hover:bg-white/5 transition-colors text-sm">Prev</button>
            <button disabled={page === meta.last_page} onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-white/10 disabled:opacity-40 hover:bg-white/5 transition-colors text-sm">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
