import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../api/axios";
import { toast } from "react-toastify";

const MODE_BADGE = {
  live:  "bg-lime-500/20 text-lime-300 border-lime-500/30",
  trial: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
};

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers]       = useState([]);
  const [meta, setMeta]         = useState({});
  const [search, setSearch]     = useState("");
  const [modeFilter, setMode]   = useState("");
  const [page, setPage]         = useState(1);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving]     = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", email: "", password: "", credits: 0, app_mode: "trial", is_admin: false });
  const [creating, setCreating]     = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    const params = new URLSearchParams({ page });
    if (search)     params.set("search", search);
    if (modeFilter) params.set("app_mode", modeFilter);
    instance.get(`/api/admin/users?${params}`)
      .then((r) => { setUsers(r.data.data); setMeta(r.data); setError(null); })
      .catch((e) => setError(e?.response?.data?.error ?? `Error ${e?.response?.status}`))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [page, search, modeFilter]);

  const submitCreate = async () => {
    setCreating(true);
    try {
      await instance.post("/api/admin/users", createForm);
      toast.success("User created.");
      setShowCreate(false);
      setCreateForm({ name: "", email: "", password: "", credits: 0, app_mode: "trial", is_admin: false });
      fetchUsers();
    } catch (e) {
      const errs = e?.response?.data?.errors;
      if (errs) {
        toast.error(Object.values(errs).flat().join(" "));
      } else {
        toast.error(e?.response?.data?.message ?? "Failed to create user.");
      }
    } finally { setCreating(false); }
  };

  const openEdit = (u) => {
    setEditUser(u);
    setEditForm({ name: u.name, credits: u.credits, app_mode: u.app_mode, is_admin: u.is_admin });
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      await instance.put(`/api/admin/users/${editUser.id}`, editForm);
      toast.success("User updated.");
      setEditUser(null);
      fetchUsers();
    } catch {
      toast.error("Update failed.");
    } finally { setSaving(false); }
  };

  const deleteUser = async (u) => {
    if (!confirm(`Delete ${u.name}? This cannot be undone.`)) return;
    try {
      await instance.delete(`/api/admin/users/${u.id}`);
      toast.success("User deleted.");
      fetchUsers();
    } catch (e) {
      toast.error(e?.response?.data?.error ?? "Delete failed.");
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-lime-200 to-teal-700 text-gray-900 font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New User
        </button>
      </div>
      <p className="text-gray-500 text-sm mb-6">All registered accounts.</p>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search name or email…"
          className="flex-1 min-w-[200px] bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-lime-500/50"
        />
        <select
          value={modeFilter}
          onChange={(e) => { setMode(e.target.value); setPage(1); }}
          className="bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-500/50"
        >
          <option value="">All modes</option>
          <option value="live">Live</option>
          <option value="trial">Trial</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-gray-900/60 border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-widest">
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3">Mode</th>
              <th className="text-left px-4 py-3">Credits</th>
              <th className="text-left px-4 py-3">Queries</th>
              <th className="text-left px-4 py-3">Admin</th>
              <th className="text-left px-4 py-3">Joined</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-500">Loading…</td></tr>
            ) : error ? (
              <tr><td colSpan={7} className="text-center py-10 text-red-400">{error}</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-500">No users found.</td></tr>
            ) : users.map((u) => (
              <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{u.name}</div>
                  <div className="text-gray-500 text-xs">{u.email}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${MODE_BADGE[u.app_mode] ?? "bg-white/5 text-gray-400 border-white/10"}`}>
                    {u.app_mode}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-300">{u.credits}</td>
                <td className="px-4 py-3 text-gray-300">{u.search_queries_count}</td>
                <td className="px-4 py-3">
                  {u.is_admin ? (
                    <span className="text-xs px-2 py-0.5 rounded-full border bg-blue-500/20 text-blue-300 border-blue-500/30">Admin</span>
                  ) : (
                    <span className="text-xs text-gray-600">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => navigate(`/admin/users/${u.id}`)}
                      className="text-xs px-2.5 py-1 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:border-lime-500/40 transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => openEdit(u)}
                      className="text-xs px-2.5 py-1 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:border-lime-500/40 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUser(u)}
                      className="text-xs px-2.5 py-1 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta.last_page > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <span>Page {meta.current_page} of {meta.last_page}</span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-white/10 disabled:opacity-40 hover:bg-white/5 transition-colors"
            >Prev</button>
            <button
              disabled={page === meta.last_page}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-white/10 disabled:opacity-40 hover:bg-white/5 transition-colors"
            >Next</button>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-md p-6">
            <h2 className="text-white font-semibold text-lg mb-5">Create New User</h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-widest mb-1.5 block">Name</label>
                <input
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="Full name"
                  className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-500/50"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-widest mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-500/50"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-widest mb-1.5 block">Password</label>
                <input
                  type="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  placeholder="Min 8 characters"
                  className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-500/50"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-gray-400 text-xs uppercase tracking-widest mb-1.5 block">Credits</label>
                  <input
                    type="number"
                    value={createForm.credits}
                    onChange={(e) => setCreateForm({ ...createForm, credits: e.target.value })}
                    className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-500/50"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-gray-400 text-xs uppercase tracking-widest mb-1.5 block">App Mode</label>
                  <select
                    value={createForm.app_mode}
                    onChange={(e) => setCreateForm({ ...createForm, app_mode: e.target.value })}
                    className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-500/50"
                  >
                    <option value="trial">Trial</option>
                    <option value="live">Live</option>
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={createForm.is_admin}
                  onChange={(e) => setCreateForm({ ...createForm, is_admin: e.target.checked })}
                  className="w-4 h-4 accent-lime-400"
                />
                <span className="text-sm text-gray-300">Admin access</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={submitCreate}
                disabled={creating}
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-lime-200 to-teal-700 text-gray-900 font-semibold text-sm disabled:opacity-60"
              >
                {creating ? "Creating…" : "Create User"}
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-md p-6">
            <h2 className="text-white font-semibold text-lg mb-5">Edit User</h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-widest mb-1.5 block">Name</label>
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-500/50"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-widest mb-1.5 block">Credits</label>
                <input
                  type="number"
                  value={editForm.credits}
                  onChange={(e) => setEditForm({ ...editForm, credits: e.target.value })}
                  className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-500/50"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-widest mb-1.5 block">App Mode</label>
                <select
                  value={editForm.app_mode}
                  onChange={(e) => setEditForm({ ...editForm, app_mode: e.target.value })}
                  className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-500/50"
                >
                  <option value="trial">Trial</option>
                  <option value="live">Live</option>
                </select>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.is_admin}
                  onChange={(e) => setEditForm({ ...editForm, is_admin: e.target.checked })}
                  className="w-4 h-4 accent-lime-400"
                />
                <span className="text-sm text-gray-300">Admin access</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={saveEdit}
                disabled={saving}
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-lime-200 to-teal-700 text-gray-900 font-semibold text-sm disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                onClick={() => setEditUser(null)}
                className="flex-1 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white text-sm"
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
