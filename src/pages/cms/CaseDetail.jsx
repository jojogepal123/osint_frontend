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
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [showActivities, setShowActivities] = useState(false);
  const [searchQueries, setSearchQueries] = useState([]);
  const [showSearchQueries, setShowSearchQueries] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    status: "",
    category: "",
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserSelect, setShowUserSelect] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const canEditCase = user?.is_admin || user?.cms_role === "supervisor";
  const canAssignCase = user?.is_admin || user?.cms_role === "supervisor";
  const canAccessResources = user?.is_admin || user?.cms_role === "supervisor";

  useEffect(() => {
    fetchCase();
    if (canAccessResources) {
      fetchUsers();
    }
  }, [id]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`/api/cases/${id}/assignable-users`);
      const usersData = response.data?.data || response.data || [];
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch {
      console.error("Failed to fetch users");
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await axios.get(`/api/cases/${id}/activities`);
      setActivities(Array.isArray(response.data) ? response.data : []);
    } catch {
      console.error("Failed to fetch activities");
    }
  };

  const handleShowActivities = () => {
    if (!showActivities) {
      fetchActivities();
    }
    setShowActivities(!showActivities);
  };

  const fetchSearchQueries = async () => {
    try {
      const response = await axios.get(`/api/cases/${id}/searches`);
      setSearchQueries(Array.isArray(response.data) ? response.data : []);
    } catch {
      console.error("Failed to fetch search queries");
    }
  };

  const handleShowSearchQueries = () => {
    if (!showSearchQueries) {
      fetchSearchQueries();
    }
    setShowSearchQueries(!showSearchQueries);
  };

  const handleDownloadResult = async (searchQuery) => {
    if (searchQuery.type === "leak") {
      toast.info("Download is not available for Leak Data Finder results");
      return;
    }
    const key = searchQuery.public_id || searchQuery.id;
    setDownloadingId(key);
    try {
      const response = await axios.get(
        `/api/search-results/${key}/download`,
        { responseType: "blob" },
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `search_result_${key}_${Date.now()}.pdf`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Report downloaded successfully");
    } catch {
      toast.error("Failed to download report");
    } finally {
      setDownloadingId(null);
    }
  };

  const formatQuery = (query) => {
    if (!query) return "—";
    if (typeof query !== "string") return String(query);
    const trimmed = query.trim();
    if (!trimmed.startsWith("[") && !trimmed.startsWith("{")) return query;
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        const values = parsed
          .map((item) => {
            if (item === null || typeof item !== "object") return String(item);
            return item.value ?? item.query ?? null;
          })
          .filter((v) => v !== null && v !== "");
        if (values.length > 0) return values.join(", ");
      } else if (parsed && typeof parsed === "object") {
        const values = Object.values(parsed)
          .filter((v) => v !== null && v !== "" && v !== undefined)
          .map(String);
        if (values.length > 0) return values.join(", ");
      }
      return query;
    } catch {
      return query;
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
      const response = await axios.put(`/api/cases/${id}/status`, {
        status: newStatus,
      });
      setCaseData(response.data.case);
      setFormData((prev) => ({ ...prev, status: newStatus }));
      toast.success("Status updated successfully");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleAssignUsers = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Select at least one user");
      return;
    }
    setUpdating(true);
    try {
      const res = await axios.put(`/api/cases/${id}/members`, {
        user_ids: selectedUsers,
      });
      setCaseData(res.data.case);
      setShowUserSelect(false);
      toast.success("Assignment updated");
    } catch {
      toast.error("Failed to update assignment");
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    setUpdating(true);
    try {
      const res = await axios.delete(`/api/cases/${id}/members/${userId}`);
      setCaseData(res.data.case);
      toast.success("Member removed");
    } catch {
      toast.error("Failed to remove member");
    } finally {
      setUpdating(false);
    }
  };

  const openUserSelect = () => {
    const currentIds = caseData.assigned_users?.map((u) => u.id) || [];
    setSelectedUsers(currentIds);
    setShowUserSelect(true);
  };

  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
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

  const assignedUsers = caseData.assigned_users || caseData.assignedUsers || [];

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Link to="/cms/cases" className="text-gray-400 hover:text-white">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5"
          >
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
                  <label className="block text-sm text-gray-400 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-lime-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-lime-400 h-32"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
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
                    <label className="block text-sm text-gray-400 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
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
                    <h1 className="text-xl font-bold text-white">
                      {caseData.title}
                    </h1>
                    {caseData.description && (
                      <p className="text-gray-400 mt-2">
                        {caseData.description}
                      </p>
                    )}
                  </div>
                  {canEditCase && (
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
                    Category:{" "}
                    <span className="text-white capitalize">
                      {caseData.category}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="bg-gray-800/50 border border-white/10 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-6 pb-4">
              <h3 className="text-lg font-semibold text-white">
                Search Queries
                {searchQueries.length > 0 && (
                  <span className="ml-2 text-sm text-gray-400 font-normal">
                    ({searchQueries.length})
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleShowSearchQueries}
                  className="text-sm text-lime-400 hover:text-lime-300"
                >
                  {showSearchQueries ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            {showSearchQueries && (
              <div className="overflow-x-auto custom-scrollbar">
                {searchQueries.length === 0 ? (
                  <p className="text-gray-500 text-sm p-6 pt-0">
                    No search queries yet
                  </p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-t border-white/10">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Query
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          IP Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {searchQueries.map((sq) => (
                        <tr key={sq.id} className="hover:bg-white/5">
                          <td className="px-6 py-3">
                            <span className="inline-block px-2 py-0.5 text-xs font-medium bg-cyan-400/20 text-cyan-300 rounded capitalize">
                              {sq.type}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-white font-mono text-xs max-w-[200px] truncate">
                            {formatQuery(sq.query)}
                          </td>
                          <td className="px-6 py-3 text-gray-300">
                            {sq.user?.name || "-"}
                          </td>
                          <td className="px-6 py-3 text-gray-400 font-mono text-xs">
                            {sq.ip_address || "-"}
                          </td>
                          <td className="px-6 py-3 text-gray-400 whitespace-nowrap">
                            {formatDate(sq.created_at)}
                          </td>
                          <td className="px-6 py-3">
                            {sq.result ? (
                              downloadingId === (sq.public_id || sq.id) ? (
                                <button
                                  disabled
                                  className="text-lime-400 text-xs flex items-center gap-1 cursor-not-allowed"
                                >
                                  <div className="w-4 h-4 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
                                  Downloading...
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleDownloadResult(sq)}
                                  className={`text-xs flex items-center gap-1 ${
                                    sq.type === "leak"
                                      ? "text-gray-600 cursor-not-allowed"
                                      : "text-lime-400 hover:text-lime-300"
                                  }`}
                                  title={
                                    sq.type === "leak"
                                      ? "Download not available for Leak Data Finder results"
                                      : undefined
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
                                  Download
                                </button>
                              )
                            ) : (
                              <span className="text-gray-600 text-xs">
                                No result
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800/50 border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Status & Priority
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Status
                </label>
                <select
                  value={caseData.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updating}
                  className="w-full px-4 py-2 bg-gray-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-lime-400 disabled:opacity-50"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ").charAt(0).toUpperCase() +
                        s.replace("_", " ").slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Priority
                </label>
                <div
                  className={`inline-block px-3 py-1 rounded border ${getPriorityColor(caseData.priority)}`}
                >
                  {caseData.priority}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Assigned Members
                {assignedUsers.length > 0 && (
                  <span className="ml-2 text-sm text-gray-400 font-normal">
                    ({assignedUsers.length})
                  </span>
                )}
              </h3>
              {canAssignCase && (
                <button
                  onClick={openUserSelect}
                  className="text-xs text-lime-400 hover:text-lime-300"
                >
                  Manage
                </button>
              )}
            </div>

            {assignedUsers.length === 0 ? (
              <p className="text-gray-500 text-sm">No members assigned</p>
            ) : (
              <div className="space-y-3">
                {assignedUsers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-lime-400/20 flex items-center justify-center text-lime-400 text-xs font-bold">
                        {member.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <span className="text-white text-sm">
                          {member.name}
                        </span>
                        <span className="text-gray-500 text-xs block">
                          {member.email}
                        </span>
                      </div>
                    </div>
                    {canAssignCase && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-gray-500 hover:text-red-400 p-1"
                        title="Remove member"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gray-800/50 border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Created By</span>
                <span className="text-white">{caseData.user?.name || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Created At</span>
                <span className="text-white">
                  {formatDate(caseData.created_at)}
                </span>
              </div>
              {caseData.resolved_at && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Resolved At</span>
                  <span className="text-white">
                    {formatDate(caseData.resolved_at)}
                  </span>
                </div>
              )}
              {caseData.closed_at && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Closed At</span>
                  <span className="text-white">
                    {formatDate(caseData.closed_at)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-800/50 border border-white/10 rounded-lg p-6">
            <button
              onClick={handleShowActivities}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-semibold text-white">
                Activity Timeline
              </h3>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`w-5 h-5 text-gray-400 transition-transform ${showActivities ? "rotate-180" : ""}`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {showActivities && (
              <div className="mt-4 max-h-64 overflow-y-auto custom-scrollbar">
                {activities.length === 0 ? (
                  <p className="text-gray-500 text-sm">No activities yet</p>
                ) : (
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex gap-3">
                        <div className="w-2 h-2 mt-2 rounded-full bg-lime-400 shrink-0" />
                        <div className="flex-1">
                          <p className="text-white text-sm">
                            {activity.description}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {activity.user?.name} &bull;{" "}
                            {formatDate(activity.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showUserSelect && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-white/10 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">
              Assign Members
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
              {(() => {
                const currentMemberIds = new Set(
                  (caseData?.assigned_users || []).map((u) => u.id)
                );
                const merged = [
                  ...users,
                  ...(caseData?.assigned_users || [])
                    .filter((m) => !users.some((u) => u.id === m.id))
                    .map((m) => ({ ...m, _currentMember: true })),
                ];
                return merged.map((u) => {
                  const isCurrent = currentMemberIds.has(u.id);
                  const isSelected = selectedUsers.includes(u.id);
                  return (
                    <div
                      key={u.id}
                      onClick={() => !isCurrent && toggleUser(u.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        isCurrent
                          ? "border-white/5 bg-white/[0.02] opacity-60 cursor-not-allowed"
                          : isSelected
                            ? "border-lime-400 bg-lime-400/10 cursor-pointer"
                            : "border-white/10 hover:bg-white/5 cursor-pointer"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-bold">
                        {u.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm">{u.name}</span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-600 text-gray-200">
                              Already assigned
                            </span>
                          )}
                        </div>
                        <span className="text-gray-500 text-xs block">
                          {u.email}
                        </span>
                      </div>
                      {isSelected && !isCurrent && (
                        <svg
                          className="w-5 h-5 text-lime-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAssignUsers}
                disabled={updating}
                className="flex-1 px-4 py-2 bg-lime-400 text-gray-900 font-semibold rounded-lg hover:bg-lime-300 transition-colors disabled:opacity-50"
              >
                {updating ? "Saving..." : `Assign (${selectedUsers.length})`}
              </button>
              <button
                onClick={() => setShowUserSelect(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
