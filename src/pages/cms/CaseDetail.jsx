import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import useAuthContext from "../../context/AuthContext";

const STATUSES = ["open", "in_progress", "pending", "resolved", "closed"];
const PRIORITIES = ["low", "medium", "high", "critical"];

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    status: "",
    category: "",
  });

  const isSupervisor = user?.cms_role === "supervisor" || user?.is_admin;

  useEffect(() => {
    fetchCase();
    fetchTeams();
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchTeams = async () => {
    try {
      const response = await axios.get("/api/teams");
      setTeams(Array.isArray(response.data) ? response.data : []);
    } catch {
      console.error("Failed to fetch teams");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/admin/users");
      const usersData = response.data?.data || response.data || [];
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch {
      console.error("Failed to fetch users");
    }
  };

  const fetchCase = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/cases/${id}`);
      setCaseData(response.data);
      setFormData({
        title: response.data.title,
        description: response.data.description || "",
        priority: response.data.priority,
        status: response.data.status,
        category: response.data.category || "",
      });
    } catch {
      toast.error("Failed to fetch case details");
      navigate("/cms/cases");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const response = await axios.put(`/api/cases/${id}`, formData);
      setCaseData(response.data.case);
      setEditMode(false);
      toast.success("Case updated successfully");
    } catch {
      toast.error("Failed to update case");
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const response = await axios.put(`/api/cases/${id}/status`, { status: newStatus });
      setCaseData(response.data.case);
      setFormData((prev) => ({ ...prev, status: newStatus }));
      toast.success("Status updated successfully");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
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

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!caseData) return null;

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Link to="/cms/cases" className="text-gray-400 hover:text-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-lime-400 font-mono">{caseData.case_number}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800/50 border border-white/10 rounded-lg p-6">
            {editMode ? (
              <form onSubmit={handleUpdate} className="space-y-4">
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
                    className="w-full px-4 py-2 bg-gray-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-lime-400 h-32"
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
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-lime-400"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-4 py-2 bg-lime-400 text-gray-900 font-semibold rounded-lg hover:bg-lime-300 transition-colors disabled:opacity-50"
                  >
                    {updating ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-xl font-bold text-white">{caseData.title}</h1>
                    {caseData.description && (
                      <p className="text-gray-400 mt-2">{caseData.description}</p>
                    )}
                  </div>
                  {isSupervisor && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="text-lime-400 hover:text-lime-300"
                    >
                      Edit
                    </button>
                  )}
                </div>
                {caseData.category && (
                  <div className="text-sm text-gray-400">
                    Category: <span className="text-white capitalize">{caseData.category}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800/50 border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Status & Priority</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Status</label>
                <select
                  value={caseData.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updating}
                  className="w-full px-4 py-2 bg-gray-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-lime-400 disabled:opacity-50"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ").charAt(0).toUpperCase() + s.replace("_", " ").slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Priority</label>
                <div className={`inline-block px-3 py-1 rounded border ${getPriorityColor(caseData.priority)}`}>
                  {caseData.priority}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Created By</span>
                <span className="text-white">{caseData.user?.name || "-"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Assigned To</span>
                {isSupervisor ? (
                  <select
                    value={caseData.assigned_to || ""}
                    onChange={async (e) => {
                      setUpdating(true);
                      try {
                        const res = await axios.put(`/api/cases/${id}/assign`, {
                          assigned_to: e.target.value || null,
                          team_id: caseData.team_id || null
                        });
                        setCaseData(res.data.case);
                        toast.success("Assignment updated");
                      } catch {
                        toast.error("Failed to update assignment");
                      } finally {
                        setUpdating(false);
                      }
                    }}
                    disabled={updating}
                    className="bg-gray-900 border border-white/10 rounded px-2 py-1 text-white text-sm max-w-[120px]"
                  >
                    <option value="">Unassigned</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                ) : (
                  <span className="text-white">{caseData.assigned_user?.name || "-"}</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Team</span>
                {isSupervisor ? (
                  <select
                    value={caseData.team_id || ""}
                    onChange={async (e) => {
                      setUpdating(true);
                      try {
                        const res = await axios.put(`/api/cases/${id}/assign`, {
                          assigned_to: caseData.assigned_to || null,
                          team_id: e.target.value || null
                        });
                        setCaseData(res.data.case);
                        toast.success("Team updated");
                      } catch {
                        toast.error("Failed to update team");
                      } finally {
                        setUpdating(false);
                      }
                    }}
                    disabled={updating}
                    className="bg-gray-900 border border-white/10 rounded px-2 py-1 text-white text-sm max-w-[120px]"
                  >
                    <option value="">No Team</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                ) : (
                  <span className="text-white">{caseData.team?.name || "-"}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Created At</span>
                <span className="text-white">{formatDate(caseData.created_at)}</span>
              </div>
              {caseData.resolved_at && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Resolved At</span>
                  <span className="text-white">{formatDate(caseData.resolved_at)}</span>
                </div>
              )}
              {caseData.closed_at && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Closed At</span>
                  <span className="text-white">{formatDate(caseData.closed_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}