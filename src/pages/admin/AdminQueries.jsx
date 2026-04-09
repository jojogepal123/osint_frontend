import { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
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

// Human-readable labels + which sidebar section each type belongs to
const TYPE_INFO = {
  phone:        { label: "Phone Search",           sidebar: "Phone Search",           input: "Phone Number" },
  email:        { label: "Email Search",            sidebar: "Email Search",           input: "Email Address" },
  vehicle:      { label: "Vehicle Intell",          sidebar: "Vehicle Intell",         input: "RC Number" },
  challan:      { label: "RC Challan",              sidebar: "Vehicle Intell",         input: "RC Number" },
  corporate:    { label: "Corporate Intelligence",  sidebar: "Corporate Intelligence", input: "Company / Person / Domain" },
  social:       { label: "Social Intell",           sidebar: "Social Intell",          input: "Name / LinkedIn / Phone / Email" },
  verification: { label: "Verified ID",             sidebar: "Verified ID",            input: "ID Number / Document" },
  leak:         { label: "Leak Data Finder",        sidebar: "Leak Data Finder",       input: "Email / Phone / Username" },
  upi:          { label: "UPI Lookup",              sidebar: "Vehicle Intell",         input: "UPI ID" },
};

function parseQuery(raw, type) {
  if (!raw) return { display: "—", fields: [] };
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null) {
      const fields = Object.entries(parsed).map(([k, v]) => ({ k, v: String(v) }));
      return { display: fields.map(f => `${f.k}: ${f.v}`).join(" · "), fields };
    }
    return { display: String(parsed), fields: [{ k: TYPE_INFO[type]?.input ?? "Value", v: String(parsed) }] };
  } catch {
    return { display: raw, fields: [{ k: TYPE_INFO[type]?.input ?? "Value", v: raw }] };
  }
}

export default function AdminQueries() {
  const navigate = useNavigate();
  const [queries, setQueries] = useState([]);
  const [meta, setMeta]       = useState({});
  const [search, setSearch]   = useState("");
  const [typeFilter, setType] = useState("");
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const fetchQueries = () => {
    setLoading(true);
    const params = new URLSearchParams({ page });
    if (search)     params.set("search", search);
    if (typeFilter) params.set("type", typeFilter);
    instance.get(`/api/admin/queries?${params}`)
      .then((r) => { setQueries(r.data.data); setMeta(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchQueries(); }, [page, search, typeFilter]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-1">Search Queries</h1>
      <p className="text-gray-500 text-sm mb-6">
        All OSINT searches across all users — including admin. {meta.total ? `${meta.total} total.` : ""}
      </p>

      {/* Search + filter */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by query value…"
          className="flex-1 min-w-[200px] bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-lime-500/50"
        />
        <select
          value={typeFilter}
          onChange={(e) => { setType(e.target.value); setPage(1); }}
          className="bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-500/50"
        >
          <option value="">All types</option>
          {Object.entries(TYPE_INFO).map(([t, info]) => (
            <option key={t} value={t}>{info.label}</option>
          ))}
        </select>
      </div>

      {/* Type filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => { setType(""); setPage(1); }}
          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
            typeFilter === "" ? "bg-lime-500/20 text-lime-300 border-lime-500/30" : "text-gray-500 border-white/10 hover:bg-white/5"
          }`}
        >All</button>
        {Object.entries(TYPE_INFO).map(([t, info]) => (
          <button
            key={t}
            onClick={() => { setType(t); setPage(1); }}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              typeFilter === t ? TYPE_COLORS[t] : "text-gray-500 border-white/10 hover:bg-white/5"
            }`}
          >{info.label}</button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-gray-900/60 border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-widest">
              <th className="text-left px-4 py-3 w-36">Search Type</th>
              <th className="text-left px-4 py-3">Sidebar Section</th>
              <th className="text-left px-4 py-3">Input Field</th>
              <th className="text-left px-4 py-3">Searched Value</th>
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3">IP</th>
              <th className="text-left px-4 py-3 w-32">Time</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-500">Loading…</td></tr>
            ) : queries.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-500">No queries found.</td></tr>
            ) : queries.map((q) => {
              const info = TYPE_INFO[q.type] ?? { label: q.type ?? "Unknown", sidebar: "—", input: "—" };
              const { display, fields } = parseQuery(q.query, q.type);
              const isExpanded = expanded === q.id;
              return (
                <Fragment key={q.id}>
                  <tr
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                    onClick={() => setExpanded(isExpanded ? null : q.id)}
                  >
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full border whitespace-nowrap ${TYPE_COLORS[q.type] ?? "bg-white/5 text-gray-400 border-white/10"}`}>
                        {info.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{info.sidebar}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{info.input}</td>
                    <td className="px-4 py-3 text-gray-200 max-w-[200px] truncate text-xs">{display}</td>
                    <td className="px-4 py-3">
                      {q.user ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/admin/users/${q.user.id}`); }}
                          className="text-left hover:text-lime-400 transition-colors"
                        >
                          <div className="text-gray-300 text-xs font-medium">{q.user.name}</div>
                          <div className="text-gray-500 text-xs">{q.user.email}</div>
                        </button>
                      ) : <span className="text-gray-600 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{q.ip_address ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(q.created_at).toLocaleString()}
                    </td>
                  </tr>
                  {/* Expanded row — shows all parsed fields */}
                  {isExpanded && fields.length > 1 && (
                    <tr className="border-b border-white/5 bg-white/[0.015]">
                      <td colSpan={7} className="px-6 py-3">
                        <div className="flex flex-wrap gap-3">
                          {fields.map((f, i) => (
                            <div key={i} className="text-xs">
                              <span className="text-gray-500">{f.k}: </span>
                              <span className="text-gray-200">{f.v}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta.last_page > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <span>Page {meta.current_page} of {meta.last_page} · {meta.total} total</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-white/10 disabled:opacity-40 hover:bg-white/5 transition-colors">Prev</button>
            <button disabled={page === meta.last_page} onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-white/10 disabled:opacity-40 hover:bg-white/5 transition-colors">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
