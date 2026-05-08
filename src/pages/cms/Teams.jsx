import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import useAuthContext from "../../context/AuthContext";

export default function Teams() {
  const { user } = useAuthContext();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", supervisor_id: "" });
  const [users, setUsers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = user?.is_admin;

  useEffect(() => {
    fetchTeams();
    fetchUsers();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/teams");
      setTeams(Array.isArray(response.data) ? response.data : []);
    } catch {
      toast.error("Failed to fetch teams");
    } finally {
      setLoading(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post("/api/teams", formData);
      toast.success("Team created successfully");
      setShowCreateForm(false);
      setFormData({ name: "", supervisor_id: "" });
      fetchTeams();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create team");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (teamId) => {
    if (!window.confirm("Are you sure you want to delete this team?")) return;
    try {
      await axios.delete(`/api/teams/${teamId}`);
      toast.success("Team deleted successfully");
      fetchTeams();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete team");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Teams</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your investigation teams</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-lime-400 text-gray-900 font-semibold rounded-lg hover:bg-lime-300 transition-colors"
        >
          {showCreateForm ? "Cancel" : "Create Team"}
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6 bg-gray-800/50 border border-white/10 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Create New Team</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Team Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-lime-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Supervisor</label>
              <select
                value={formData.supervisor_id}
                onChange={(e) => setFormData({ ...formData, supervisor_id: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-lime-400"
                required
              >
                <option value="">Select supervisor</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-lime-400 text-gray-900 font-semibold rounded-lg hover:bg-lime-300 transition-colors disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Team"}
            </button>
          </form>
        </div>
      )}

      <div className="bg-gray-800/50 border border-white/10 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading teams...</div>
        ) : teams.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No teams found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Supervisor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Members</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {teams.map((team) => (
                  <tr key={team.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 text-sm text-white">{team.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {team.supervisor?.name || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {team.members?.length || 0} members
                    </td>
                    <td className="px-4 py-3">
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(team.id)}
                          className="text-sm text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      )}
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