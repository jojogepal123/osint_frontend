import { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import instance from "../../api/axios";
import { adminUrl } from "../../utils/adminPath";
import Loader from "../../components/Loader";
import DeleteQueryModal from "../../components/DeleteQueryModal";

const TYPE_COLORS = {
  phone: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  email: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  vehicle: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  challan: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  corporate: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  social: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  verification: "bg-green-500/20 text-green-300 border-green-500/30",
  leak: "bg-red-500/20 text-red-300 border-red-500/30",
  upi: "bg-lime-500/20 text-lime-300 border-lime-500/30",
};

const TYPE_INFO = {
  phone: {
    label: "Phone Search",
    sidebar: "Phone Search",
    input: "Phone Number",
  },
  email: {
    label: "Email Search",
    sidebar: "Email Search",
    input: "Email Address",
  },
  vehicle: {
    label: "Vehicle Intell",
    sidebar: "Vehicle Intell",
    input: "RC Number",
  },
  challan: {
    label: "RC Challan",
    sidebar: "Vehicle Intell",
    input: "RC Number",
  },
  corporate: {
    label: "Corporate Intelligence",
    sidebar: "Corporate Intelligence",
    input: "Company / Person / Domain",
  },
  social: {
    label: "Social Intell",
    sidebar: "Social Intell",
    input: "Name / LinkedIn / Phone / Email",
  },
  verification: {
    label: "Verified ID",
    sidebar: "Verified ID",
    input: "ID Number / Document",
  },
  leak: {
    label: "Leak Data Finder",
    sidebar: "Leak Data Finder",
    input: "Email / Phone / Username",
  },
  upi: { label: "UPI Lookup", sidebar: "Vehicle Intell", input: "UPI ID" },
};

// Loopback / RFC1918 / link-local / CGNAT. A search logged with one of these
// was recorded behind a proxy, so it identifies the infrastructure rather than
// the user — the UI falls back to their last login IP in that case.
function isPrivateIp(ip) {
  if (!ip) return true;
  if (ip === "::1" || ip.startsWith("fc") || ip.startsWith("fd")) return true;
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some(isNaN)) return false;
  const [a, b] = parts;
  return (
    a === 10 ||
    a === 127 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 169 && b === 254) ||
    (a === 100 && b >= 64 && b <= 127)
  );
}

// Prefer whichever address actually identifies the user: the IP the search was
// logged with, or the one recorded at their last login when that is a proxy.
function ipInfo(q) {
  const requestIp = q.ip_address ?? null;
  const loginIp = q.user?.latest_ip?.ip ?? null;
  const proxied = isPrivateIp(requestIp);

  if (proxied && loginIp && !isPrivateIp(loginIp)) {
    return {
      value: loginIp,
      label: "last login",
      title: `Recorded at this user's last login. The search itself was logged as ${
        requestIp ?? "unknown"
      }, which is a proxy address.`,
    };
  }

  return {
    value: requestIp ?? "—",
    label: proxied && requestIp ? "proxy" : null,
    title:
      proxied && requestIp
        ? "Proxy address, not the user's own IP — the request reached Laravel without a trusted X-Forwarded-For header."
        : "IP the search was made from",
  };
}

function parseQuery(raw, type) {
  if (!raw) return { display: "—", fields: [] };
  if (typeof raw !== "string") {
    return {
      display: String(raw),
      fields: [{ k: TYPE_INFO[type]?.input ?? "Value", v: String(raw) }],
    };
  }
  const trimmed = raw.trim();
  // Non-JSON plain value
  if (!trimmed.startsWith("[") && !trimmed.startsWith("{")) {
    return {
      display: raw,
      fields: [{ k: TYPE_INFO[type]?.input ?? "Value", v: raw }],
    };
  }
  try {
    const parsed = JSON.parse(trimmed);
    // Array shape (e.g. leak: [{type, value}])
    if (Array.isArray(parsed)) {
      const fields = parsed
        .map((item) => {
          if (item === null || typeof item !== "object") {
            return { k: "Value", v: String(item) };
          }
          const k = item.type ?? item.key ?? "Value";
          const v = item.value ?? item.query ?? "";
          return { k: String(k), v: String(v) };
        })
        .filter((f) => f.v !== "");
      if (fields.length === 0) return { display: raw, fields: [] };
      return {
        display: fields.map((f) => `${f.k}: ${f.v}`).join(" · "),
        fields,
      };
    }
    // Plain object shape
    if (parsed && typeof parsed === "object") {
      const fields = Object.entries(parsed).map(([k, v]) => ({
        k,
        v: String(v),
      }));
      return {
        display: fields.map((f) => `${f.k}: ${f.v}`).join(" · "),
        fields,
      };
    }
    return {
      display: String(parsed),
      fields: [{ k: TYPE_INFO[type]?.input ?? "Value", v: String(parsed) }],
    };
  } catch {
    return {
      display: raw,
      fields: [{ k: TYPE_INFO[type]?.input ?? "Value", v: raw }],
    };
  }
}

export default function AdminQueries() {
  const navigate = useNavigate();
  const [queries, setQueries] = useState([]);
  const [meta, setMeta] = useState({});
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [debounced, setDebounced] = useState({ search: "", user: "" });
  const [typeFilter, setType] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [impact, setImpact] = useState(null);
  const [impactLoading, setImpactLoading] = useState(false);

  const fetchQueries = () => {
    setLoading(true);
    const params = new URLSearchParams({ page });
    if (debounced.search) params.set("search", debounced.search);
    if (debounced.user) params.set("user", debounced.user);
    if (typeFilter) params.set("type", typeFilter);
    instance
      .get(`/api/admin/queries?${params}`)
      .then((r) => {
        setQueries(r.data.data);
        setMeta(r.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleDownload = async (q) => {
    if (q.type === "leak") {
      toast.info("Download is not available for Leak Data Finder results");
      return;
    }
    if (!q.result) return;
    const key = q.public_id || q.id;
    setDownloadingId(q.id);
    try {
      const res = await instance.get(`/api/search-results/${key}/download`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `query_${key}_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download PDF");
    } finally {
      setDownloadingId(null);
    }
  };

  // Opening the dialog kicks off the impact lookup: deleting one entry purges
  // every entry for the same value, so the dialog has to say how many that is
  // before the admin commits.
  const openDeleteModal = async (q) => {
    setConfirmTarget(q);
    setImpact(null);
    setImpactLoading(true);
    try {
      const key = q.public_id || q.id;
      const r = await instance.get(`/api/admin/queries/${key}/impact`);
      setImpact(r.data);
    } catch {
      setImpact({ total_count: 1, case_count: q.case_id ? 1 : 0 });
    } finally {
      setImpactLoading(false);
    }
  };

  const closeDeleteModal = () => {
    setConfirmTarget(null);
    setImpact(null);
  };

  const confirmDelete = async () => {
    const q = confirmTarget;
    if (!q) return;

    setDeletingId(q.id);
    try {
      const res = await instance.delete(
        `/api/admin/queries/${q.public_id || q.id}`
      );
      const n = res.data?.deleted_count ?? 1;
      toast.success(
        n > 1
          ? `Deleted ${n} entries. Cache cleared \u2014 next search will be fresh.`
          : "Query deleted. Cache cleared \u2014 next search will be fresh."
      );
      closeDeleteModal();
      if (expanded === q.id) setExpanded(null);
      // meta.total / last_page drive the pager, so refetch instead of splicing.
      if (queries.length === 1 && page > 1) setPage((prev) => prev - 1);
      else fetchQueries();
    } catch (e) {
      toast.error(e?.response?.data?.error ?? "Failed to delete query");
    } finally {
      setDeletingId(null);
    }
  };

  // Both text filters are typed into, so settle them before hitting the API.
  useEffect(() => {
    const id = setTimeout(
      () =>
        // Returning the previous object when nothing changed lets React bail
        // out, so mounting doesn't cost a second fetch.
        setDebounced((prev) =>
          prev.search === search && prev.user === userFilter
            ? prev
            : { search, user: userFilter }
        ),
      350
    );
    return () => clearTimeout(id);
  }, [search, userFilter]);

  useEffect(() => {
    fetchQueries();
  }, [page, debounced, typeFilter]);

  const confirmInfo = confirmTarget
    ? (TYPE_INFO[confirmTarget.type] ?? { label: confirmTarget.type })
    : null;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
        Search Queries
      </h1>
      <p className="text-gray-500 text-sm mb-5 sm:mb-6">
        All OSINT searches across all users.
        {meta.total ? ` ${meta.total} total.` : ""}
      </p>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by query value…"
          className="flex-1 bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-lime-500/50"
        />
        <input
          value={userFilter}
          onChange={(e) => {
            setUserFilter(e.target.value);
            setPage(1);
          }}
          placeholder="Filter by user name or email…"
          className="bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-lime-500/50 sm:w-64"
        />
        <select
          value={typeFilter}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1);
          }}
          className="bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-500/50 sm:w-44"
        >
          <option value="">All types</option>
          {Object.entries(TYPE_INFO).map(([t, info]) => (
            <option key={t} value={t}>
              {info.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 mb-5 sm:mb-6 overflow-x-auto pb-1 scrollbar-none custom-scrollbar">
        <button
          onClick={() => {
            setType("");
            setPage(1);
          }}
          className={`text-xs px-3 py-1.5 rounded-full border transition-all shrink-0 ${
            typeFilter === ""
              ? "bg-lime-500/20 text-lime-300 border-lime-500/30"
              : "text-gray-500 border-white/10 hover:bg-white/5"
          }`}
        >
          All
        </button>
        {Object.entries(TYPE_INFO).map(([t, info]) => (
          <button
            key={t}
            onClick={() => {
              setType(t);
              setPage(1);
            }}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all shrink-0 ${
              typeFilter === t
                ? TYPE_COLORS[t]
                : "text-gray-500 border-white/10 hover:bg-white/5"
            }`}
          >
            {info.label}
          </button>
        ))}
      </div>

      <div className="hidden md:block bg-gray-900/60 border border-white/5 rounded-xl overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-widest">
              <th className="text-left px-4 py-3 w-36">Search Type</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">
                Sidebar Section
              </th>
              <th className="text-left px-4 py-3 hidden xl:table-cell">
                Input Field
              </th>
              <th className="text-left px-4 py-3">Searched Value</th>
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">IP</th>
              <th className="text-left px-4 py-3 w-32">Time</th>
              <th className="text-left px-4 py-3 w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
                    Loading…
                  </div>
                </td>
              </tr>
            ) : queries.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-500">
                  No queries found.
                </td>
              </tr>
            ) : (
              queries.map((q) => {
                const info = TYPE_INFO[q.type] ?? {
                  label: q.type ?? "Unknown",
                  sidebar: "—",
                  input: "—",
                };
                const { display, fields } = parseQuery(q.query, q.type);
                const isExpanded = expanded === q.id;
                return (
                  <Fragment key={q.id}>
                    <tr
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                      onClick={() => setExpanded(isExpanded ? null : q.id)}
                    >
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border whitespace-nowrap ${TYPE_COLORS[q.type] ?? "bg-white/5 text-gray-400 border-white/10"}`}
                        >
                          {info.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">
                        {info.sidebar}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs hidden xl:table-cell">
                        {info.input}
                      </td>
                      <td className="px-4 py-3 text-gray-200 max-w-[200px] truncate text-xs">
                        {display}
                      </td>
                      <td className="px-4 py-3">
                        {q.user ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(adminUrl(`/users/${q.user.id}`));
                            }}
                            className="text-left hover:text-lime-400 transition-colors"
                          >
                            <div className="text-gray-300 text-xs font-medium">
                              {q.user.name}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {q.user.email}
                            </div>
                          </button>
                        ) : (
                          <span className="text-gray-600 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {(() => {
                          const ip = ipInfo(q);
                          return (
                            <div title={ip.title}>
                              <div className="text-gray-500 text-xs font-mono">
                                {ip.value}
                              </div>
                              {ip.label && (
                                <div className="text-[10px] text-gray-600">
                                  {ip.label}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {new Date(q.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {q.result ? (
                            downloadingId === q.id ? (
                              <div className="w-4 h-4 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(q);
                                }}
                                className={`transition-colors ${
                                  q.type === "leak"
                                    ? "text-gray-600 cursor-not-allowed"
                                    : "text-lime-400 hover:text-lime-300"
                                }`}
                                title={
                                  q.type === "leak"
                                    ? "Download not available for Leak Data Finder results"
                                    : "Download PDF"
                                }
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                  />
                                </svg>
                              </button>
                            )
                          ) : (
                            <span className="text-gray-600">—</span>
                          )}
                          {deletingId === q.id ? (
                            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeleteModal(q);
                              }}
                              className="text-red-400 hover:text-red-300 transition-colors"
                              title="Delete query & clear cache"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && fields.length > 1 && (
                      <tr className="border-b border-white/5 bg-white/[0.015]">
                        <td colSpan={8} className="px-6 py-3">
                          <div className="flex flex-wrap gap-x-6 gap-y-2">
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
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-gray-500 text-sm">
            <div className="w-4 h-4 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
            Loading…
          </div>
        ) : queries.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm">
            No queries found.
          </div>
        ) : (
          queries.map((q) => {
            const info = TYPE_INFO[q.type] ?? {
              label: q.type ?? "Unknown",
              sidebar: "—",
              input: "—",
            };
            const { display, fields } = parseQuery(q.query, q.type);
            const isExpanded = expanded === q.id;
            return (
              <div
                key={q.id}
                className="bg-gray-900/60 border border-white/5 rounded-xl p-4 cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : q.id)}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${TYPE_COLORS[q.type] ?? "bg-white/5 text-gray-400 border-white/10"}`}
                  >
                    {info.label}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    {q.result &&
                      (downloadingId === q.id ? (
                        <Loader />
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(q);
                          }}
                          className={`transition-colors ${
                            q.type === "leak"
                              ? "text-gray-600 cursor-not-allowed"
                              : "text-lime-400 hover:text-lime-300"
                          }`}
                          title={
                            q.type === "leak"
                              ? "Download not available for Leak Data Finder results"
                              : "Download PDF"
                          }
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                        </button>
                      ))}
                    {deletingId === q.id ? (
                      <Loader />
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(q);
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Delete query & clear cache"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                    <span className="text-gray-600 text-xs">
                      {new Date(q.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-gray-200 text-sm mb-2 break-all">
                  {display}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                  {q.user ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(adminUrl(`/users/${q.user.id}`));
                      }}
                      className="text-gray-400 hover:text-lime-400 transition-colors text-left"
                    >
                      {q.user.name} ·{" "}
                      <span className="text-gray-600">{q.user.email}</span>
                    </button>
                  ) : (
                    <span className="text-gray-600">Unknown user</span>
                  )}
                  {(() => {
                    const ip = ipInfo(q);
                    return (
                      <span className="text-gray-600 font-mono" title={ip.title}>
                        {ip.value}
                        {ip.label ? ` (${ip.label})` : ""}
                      </span>
                    );
                  })()}
                </div>

                <div className="mt-1 text-gray-600 text-xs">
                  {info.sidebar} · {info.input}
                </div>

                {isExpanded && fields.length > 1 && (
                  <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-x-4 gap-y-2">
                    {fields.map((f, i) => (
                      <div key={i} className="text-xs">
                        <span className="text-gray-500">{f.k}: </span>
                        <span className="text-gray-200">{f.v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {meta.last_page > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500 flex-wrap gap-2">
          <span className="text-xs">
            Page {meta.current_page} of {meta.last_page} · {meta.total} total
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-white/10 disabled:opacity-40 hover:bg-white/5 transition-colors text-sm"
            >
              Prev
            </button>
            <button
              disabled={page === meta.last_page}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-white/10 disabled:opacity-40 hover:bg-white/5 transition-colors text-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <DeleteQueryModal
        open={!!confirmTarget}
        typeLabel={confirmInfo?.label ?? ""}
        typeColor={
          TYPE_COLORS[confirmTarget?.type] ??
          "bg-white/5 text-gray-400 border-white/10"
        }
        displayValue={
          confirmTarget
            ? parseQuery(confirmTarget.query, confirmTarget.type).display
            : ""
        }
        impact={impact}
        impactLoading={impactLoading}
        deleting={deletingId === confirmTarget?.id}
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
