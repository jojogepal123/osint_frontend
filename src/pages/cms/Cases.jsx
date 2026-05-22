import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import useAuthContext from "../../context/AuthContext";

const PRIORITIES = ["low", "medium", "high", "critical"];
const CATEGORIES = ["billing", "technical", "investigation", "general"];

export default function Cases() {
  const { user, fetchActiveCase } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState([]);
  const [casesLoading, setCasesLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "",
  });

  const canCreateCase = user?.cms_role === "supervisor" || user?.is_admin;
  const canSelectCase = user?.cms_role === "supervisor" || user?.cms_role === "investigator" || user?.is_admin;

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    setCasesLoading(true);
    try {
      const response = await axios.get("/api/cases");
      const casesData = response.data?.data || response.data;
      setCases(Array.isArray(casesData) ? casesData : []);
    } catch {
      toast.error("Failed to fetch cases");
      setCases([]);
    } finally {
      setCasesLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/cases", formData);
      toast.success("Case created successfully");
      setShowCreateForm(false);
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        category: "",
      });
      fetchCases();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create case");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCase = async (caseItem) => {
    try {
      await axios.put("/api/user/set-active-case", { case_id: caseItem.id });
      await fetchActiveCase();
      toast.success(`Active case set to ${caseItem.case_number}`);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to set active case");
    }
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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Cases</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your investigation cases</p>
        </div>
        {canCreateCase && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-lime-400 text-gray-900 font-semibold rounded-lg hover:bg-lime-300 transition-colors"
          >
            {showCreateForm ? "Cancel" : "Create Case"}
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="mb-6 bg-gray-800/50 border border-white/10 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Create New Case</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-lime-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-lime-400 h-24"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-lime-400"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-lime-400"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-lime-400 text-gray-900 font-semibold rounded-lg hover:bg-lime-300 transition-colors disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Case"}
            </button>
          </form>
        </div>
      )}

      <div className="bg-gray-800/50 border border-white/10 rounded-lg overflow-hidden">
        {casesLoading ? (
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Category</th>
                  {user?.cms_role !== "auditor" && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {cases.map((caseItem) => (
                  <tr key={caseItem.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 text-sm text-lime-400">{caseItem.case_number}</td>
                    <td className="px-4 py-3 text-sm text-white">{caseItem.title}</td>
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
                    {user?.cms_role !== "auditor" && (
                      <td className="px-4 py-3">
                        {canSelectCase && (
                          <button
                            onClick={() => handleSelectCase(caseItem)}
                            className="text-sm text-lime-400 hover:text-lime-300"
                          >
                            Select
                          </button>
                        )}
                      </td>
                    )}
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