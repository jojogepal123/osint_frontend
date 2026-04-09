import { useEffect, useState } from "react";
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
  phone:        "Phone Search",
  email:        "Email Search",
  vehicle:      "Vehicle Intell",
  challan:      "RC Challan",
  corporate:    "Corporate Intelligence",
  social:       "Social Intell",
  verification: "Verified ID",
  leak:         "Leak Data Finder",
  upi:          "UPI Lookup",
};

function StatCard({ label, value, sub, color = "lime" }) {
  const ring = color === "lime" ? "border-lime-500/30" : color === "blue" ? "border-blue-500/30" : "border-purple-500/30";
  const text = color === "lime" ? "text-lime-400" : color === "blue" ? "text-blue-400" : "text-purple-400";
  return (
    <div className={`bg-gray-900/60 border ${ring} rounded-xl p-5`}>
      <div className="text-gray-400 text-xs uppercase tracking-widest mb-2">{label}</div>
      <div className={`text-3xl font-bold ${text}`}>{value ?? "—"}</div>
      {sub && <div className="text-gray-500 text-xs mt-1">{sub}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    instance.get("/api/admin/stats")
      .then((r) => setStats(r.data))
      .catch((e) => console.error("Admin stats error:", e?.response?.status, e?.response?.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
      <p className="text-gray-500 text-sm mb-8">Overview of all users and search activity.</p>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading stats…</div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard label="Total Users"   value={stats?.total_users}   color="lime" />
            <StatCard label="Admin Users"   value={stats?.admin_users}   color="blue" />
            <StatCard label="Total Queries" value={stats?.total_queries} color="purple" />
            <StatCard label="Queries Today" value={stats?.queries_today} color="lime" />
          </div>

          <h2 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
            Queries by Search Type
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(stats?.queries_by_type ?? {}).map(([type, count]) => (
              <div
                key={type}
                className={`border rounded-xl px-4 py-3 flex items-center justify-between ${TYPE_COLORS[type] ?? "bg-white/5 text-gray-300 border-white/10"}`}
              >
                <span className="text-xs font-semibold">{TYPE_LABELS[type] ?? type}</span>
                <span className="text-lg font-bold">{count}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
