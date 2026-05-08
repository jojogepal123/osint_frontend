import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import useAuthContext from "../../context/AuthContext";

const STATUSES = ["open", "in_progress", "pending", "resolved", "closed"];
const PRIORITIES = ["low", "medium", "high", "critical"];

export default function CasesList() {
  const { user } = useAuthContext();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
  });

  // const isSupervisor = user?.cms_role === "supervisor" || user?.is_admin;

  useEffect(() => {
    fetchCases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);
      if (filters.search) params.append("search", filters.search);

      const response = await axios.get(`/api/cases?${params.toString()}`);
      const casesData = response.data?.data || response.data;
      setCases(Array.isArray(casesData) ? casesData : []);
    } catch (_error) {
      toast.error("Failed to fetch cases");
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-gray-500/20 text-gray-300 border-gray-500/30",
      medium: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      high: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      critical: "bg-red-500/20 text-red-300 border-red-500/30",
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      open: "bg-green-500/20 text-green-300 border-green-500/30",
      in_progress: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      resolved: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      closed: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    };
    return colors[status] || colors.open;
  };

  const stats = {
    total: cases.length,
    open: cases.filter((c) => c.status === "open").length,
    in_progress: cases.filter((c) => c.status === "in_progress").length,
    resolved: cases.filter((c) => c.status === "resolved").length,
    closed: cases.filter((c) => c.status === "closed").length,
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Cases Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">View and manage all cases</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-800/50 border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-sm text-gray-400">Total</div>
        </div>
        <div className="bg-gray-800/50 border border-green-500/30 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">{stats.open}</div>
          <div className="text-sm text-gray-400">Open</div>
        </div>
        <div className="bg-gray-800/50 border border-blue-500/30 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-400">{stats.in_progress}</div>
          <div className="text-sm text-gray-400">In Progress</div>
        </div>
        <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-400">{stats.resolved}</div>
          <div className="text-sm text-gray-400">Resolved</div>
        </div>
        <div className="bg-gray-800/50 border border-gray-500/30 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-400">{stats.closed}</div>
          <div className="text-sm text-gray-400">Closed</div>
        </div>
      </div>

      <div className="bg-gray-800/50 border border-white/10 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search cases..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-lime-400 flex-1 min-w-[200px]"
          />
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-lime-400"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ").charAt(0).toUpperCase() + s.replace("_", " ").slice(1)}
              </option>
            ))}
          </select>
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-lime-400"
          >
            <option value="">All Priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-gray-800/50 border border-white/10 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading cases...</div>
        ) : cases.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No cases found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Case #</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Created By</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Assigned To</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {cases.map((caseItem) => (
                  <tr key={caseItem.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 text-sm text-lime-400">{caseItem.case_number}</td>
                    <td className="px-4 py-3 text-sm text-white max-w-[200px] truncate">{caseItem.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {caseItem.user?.name || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {caseItem.assigned_user?.name || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(caseItem.priority)}`}>
                        {caseItem.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(caseItem.status)}`}>
                        {caseItem.status?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{caseItem.category || "-"}</td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/cms/cases/${caseItem.id}`}
                        className="text-sm text-lime-400 hover:text-lime-300"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}