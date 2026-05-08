import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../api/axios";
import { toast } from "react-toastify";
import ModalService from "../../services/ModalService.jsx";

const SCROLLBAR_STYLES = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(132, 204, 22, 0.4);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(132, 204, 22, 0.6);
  }
`;

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
  const [createForm, setCreateForm] = useState({ name: "", email: "", password: "", credits: 0, app_mode: "live", is_admin: false });
  const [showPassword, setShowPassword] = useState(false);
  const [creating, setCreating] = useState(false);
  const [apiEngines, setApiEngines] = useState([]);
  const [selectedApis, setSelectedApis] = useState([]);
  const [loadingApis, setLoadingApis] = useState(false);
  const [viewApiUser, setViewApiUser] = useState(null);
  const [teams, setTeams] = useState([]);

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
      setCreateForm({ name: "", email: "", password: "", credits: 0, app_mode: "live", is_admin: false });
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

  const openEdit = async (u) => {
    setEditUser(u);
    setEditForm({ 
      name: u.name, 
      credits: u.credits, 
      app_mode: u.app_mode, 
      is_admin: u.is_admin,
      cms_role: u.cms_role || 'auditor',
      team_id: u.team_id || ''
    });
    
    // Fetch teams and API permissions in parallel
    const [enginesRes, permsRes, teamsRes] = await Promise.all([
      instance.get("/api/admin/api-engines"),
      instance.get(`/api/admin/users/${u.id}/permissions`),
      instance.get("/api/teams").catch(() => ({ data: [] }))
    ]);
    
    setApiEngines(enginesRes.data);
    setSelectedApis(permsRes.data.permissions);
    setTeams(Array.isArray(teamsRes.data) ? teamsRes.data : []);
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const res = await instance.put(`/api/admin/users/${editUser.id}`, editForm);
      
      if (res.data.admin_change && res.data.admin_change.action === 'revoke') {
        ModalService.init(confirmRevoke);
        ModalService.show({ userId: editUser.id, name: editUser.name });
        setSaving(false);
        return;
      }
      
      if (!editForm.is_admin && selectedApis.length > 0) {
        await instance.put(`/api/admin/users/${editUser.id}/permissions`, { api_engine_ids: selectedApis });
      }
      
      // Update CMS role and team
      await instance.put("/api/user/cms-role", {
        user_id: editUser.id,
        cms_role: editForm.cms_role,
        team_id: editForm.team_id || null
      });
      
      toast.success("User updated.");
      setEditUser(null);
      fetchUsers();
    } catch (e) {
      toast.error(e?.response?.data?.error ?? e?.response?.data?.message ?? "Update failed.");
    } finally { setSaving(false); }
  };

  const confirmRevoke = async (data) => {
    setSaving(true);
    try {
      await instance.post(`/api/admin/users/${data.userId}/sync-permissions`, { action: 'revoke' });
      toast.success("User updated.");
      ModalService.hide();
      setEditUser(null);
      fetchUsers();
    } catch (e) {
      toast.error(e?.response?.data?.error ?? "Update failed.");
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
    <div className="p-4 sm:p-6 lg:p-8">
      <style>{SCROLLBAR_STYLES}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-1 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Users</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-lime-200 to-teal-700 text-gray-900 font-semibold text-xs sm:text-sm hover:opacity-90 transition-opacity shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden xs:inline sm:inline">New User</span>
          <span className="xs:hidden sm:hidden">New</span>
        </button>
      </div>
      <p className="text-gray-500 text-sm mb-5 sm:mb-6">All registered accounts.</p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-5 sm:mb-6">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search name or email…"
          className="flex-1 bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-lime-500/50"
        />
        <select
          value={modeFilter}
          onChange={(e) => { setMode(e.target.value); setPage(1); }}
          className="bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-500/50 sm:w-36"
        >
          <option value="">All modes</option>
          <option value="live">Live</option>
          <option value="trial">Trial</option>
        </select>
      </div>

      {/* ── Desktop / Tablet table ── */}
      <div className="hidden sm:block bg-gray-900/60 border border-white/5 rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-widest">
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3">Mode</th>
              <th className="text-left px-4 py-3">Credits</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Queries</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">APIs</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">Admin</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">Joined</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center py-10 text-gray-500">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
                  Loading…
                </div>
              </td></tr>
            ) : error ? (
              <tr><td colSpan={8} className="text-center py-10 text-red-400">{error}</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-10 text-gray-500">No users found.</td></tr>
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
                <td className="px-4 py-3 text-gray-300 text-sm">{u.credits}</td>
                <td className="px-4 py-3 text-gray-300 text-sm hidden md:table-cell">{u.search_queries_count}</td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  {u.has_all_apis ? (
                    <button
                      onClick={() => { if (apiEngines.length === 0) { instance.get("/api/admin/api-engines").then((r) => setApiEngines(r.data)); } setViewApiUser(u); }}
                      className="text-xs px-2 py-0.5 rounded-full border bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30 hover:border-purple-400 transition-all cursor-pointer"
                    >All</button>
                  ) : u.api_count > 0 ? (
                    <button
                      onClick={() => { if (apiEngines.length === 0) { instance.get("/api/admin/api-engines").then((r) => setApiEngines(r.data)); } setViewApiUser(u); }}
                      className="text-xs px-2 py-0.5 rounded-full border bg-lime-500/20 text-lime-300 border-lime-500/30 hover:bg-lime-500/30 hover:border-lime-400 transition-all cursor-pointer"
                    >{u.api_count}</button>
                  ) : (
                    <button
                      onClick={() => { if (apiEngines.length === 0) { instance.get("/api/admin/api-engines").then((r) => setApiEngines(r.data)); } setViewApiUser(u); }}
                      className="text-xs px-2 py-0.5 rounded-full border bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30 hover:border-gray-400 transition-all cursor-pointer"
                    >0</button>
                  )}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  {u.is_admin ? (
                    <span className="text-xs px-2 py-0.5 rounded-full border bg-blue-500/20 text-blue-300 border-blue-500/30">Admin</span>
                  ) : (
                    <span className="text-xs text-gray-600">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5 justify-end">
                    <button
                      onClick={() => navigate(`/admin/users/${u.id}`)}
                      className="text-xs px-2 sm:px-2.5 py-1 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:border-lime-500/40 transition-colors"
                    >View</button>
                    <button
                      onClick={() => openEdit(u)}
                      className="text-xs px-2 sm:px-2.5 py-1 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:border-lime-500/40 transition-colors"
                    >Edit</button>
                    <button
                      onClick={() => deleteUser(u)}
                      disabled={u.is_admin}
                      className="text-xs px-2 sm:px-2.5 py-1 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile card list ── */}
      <div className="sm:hidden space-y-3">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-gray-500 text-sm">
            <div className="w-4 h-4 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
            Loading…
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-400 text-sm">{error}</div>
        ) : users.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm">No users found.</div>
        ) : users.map((u) => (
          <div key={u.id} className="bg-gray-900/60 border border-white/5 rounded-xl p-4">
            {/* Top row */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="min-w-0">
                <div className="font-medium text-white text-sm flex items-center gap-2 flex-wrap">
                  {u.name}
                  {u.is_admin && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full border bg-blue-500/20 text-blue-300 border-blue-500/30">Admin</span>
                  )}
                </div>
                <div className="text-gray-500 text-xs truncate mt-0.5">{u.email}</div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${MODE_BADGE[u.app_mode] ?? "bg-white/5 text-gray-400 border-white/10"}`}>
                {u.app_mode}
              </span>
            </div>

            {/* Stats row */}
            <div className="flex gap-4 mb-3 text-xs text-gray-400">
              <span><span className="text-white font-medium">{u.credits}</span> credits</span>
              <span><span className="text-white font-medium">{u.search_queries_count}</span> queries</span>
              {u.has_all_apis ? (
                <button
                  onClick={() => { if (apiEngines.length === 0) { instance.get("/api/admin/api-engines").then((r) => setApiEngines(r.data)); } setViewApiUser(u); }}
                  className="text-xs px-2 py-0.5 rounded-full border bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30 transition-all cursor-pointer"
                >All</button>
              ) : u.api_count > 0 ? (
                <button
                  onClick={() => { if (apiEngines.length === 0) { instance.get("/api/admin/api-engines").then((r) => setApiEngines(r.data)); } setViewApiUser(u); }}
                  className="text-xs px-2 py-0.5 rounded-full border bg-lime-500/20 text-lime-300 border-lime-500/30 hover:bg-lime-500/30 transition-all cursor-pointer"
                >{u.api_count}</button>
              ) : (
                <button
                  onClick={() => { if (apiEngines.length === 0) { instance.get("/api/admin/api-engines").then((r) => setApiEngines(r.data)); } setViewApiUser(u); }}
                  className="text-xs px-2 py-0.5 rounded-full border bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30 transition-all cursor-pointer"
                >0</button>
              )}
              <span className="text-gray-600">{new Date(u.created_at).toLocaleDateString()}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/admin/users/${u.id}`)}
                className="flex-1 text-xs py-1.5 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:border-lime-500/40 transition-colors"
              >View</button>
              <button
                onClick={() => openEdit(u)}
                className="flex-1 text-xs py-1.5 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:border-lime-500/40 transition-colors"
              >Edit</button>
              <button
                onClick={() => deleteUser(u)}
                disabled={u.is_admin}
                className="flex-1 text-xs py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {meta.last_page > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500 flex-wrap gap-2">
          <span className="text-xs">Page {meta.current_page} of {meta.last_page}</span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-white/10 disabled:opacity-40 hover:bg-white/5 transition-colors text-sm"
            >Prev</button>
            <button
              disabled={page === meta.last_page}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-white/10 disabled:opacity-40 hover:bg-white/5 transition-colors text-sm"
            >Next</button>
          </div>
        </div>
      )}

      {/* ── Create User Modal ── */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-gray-900 border border-white/10 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[92vh] overflow-y-auto">
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>
            <div className="px-5 sm:px-6 py-4 sm:py-5">
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
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={createForm.password}
                      onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                      placeholder="Min 8 chars, mixed case + numbers"
                      className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 pr-10 text-sm text-white focus:outline-none focus:border-lime-500/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      )}
                    </button>
                  </div>
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
                  className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-lime-200 to-teal-700 text-gray-900 font-semibold text-sm disabled:opacity-60"
                >
                  {creating ? "Creating…" : "Create User"}
                </button>
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:text-white text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editUser && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-gray-900 border border-white/10 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[92vh] overflow-y-auto">
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>
            <div className="px-5 sm:px-6 py-4 sm:py-5">
              <h2 className="text-white font-semibold text-lg mb-1">Edit User</h2>
              <p className="text-gray-500 text-xs mb-5">{editUser.email}</p>
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
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-widest mb-1.5 block">CMS Role</label>
                  <select
                    value={editForm.cms_role || 'auditor'}
                    onChange={(e) => setEditForm({ ...editForm, cms_role: e.target.value })}
                    className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-500/50"
                  >
                    <option value="auditor">Auditor</option>
                    <option value="supervisor">Supervisor</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-widest mb-1.5 block">Team</label>
                  <select
                    value={editForm.team_id || ''}
                    onChange={(e) => setEditForm({ ...editForm, team_id: e.target.value })}
                    className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-500/50"
                  >
                    <option value="">No Team</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-3 cursor-pointer rounded-lg p-2 hover:bg-white/5 transition-colors">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={editForm.is_admin}
                      onChange={(e) => setEditForm({ ...editForm, is_admin: e.target.checked })}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
                      editForm.is_admin ? "bg-blue-500 border-blue-500" : "border-gray-600 bg-gray-800"
                    }`}>
                      {editForm.is_admin && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-300">Admin access</span>
                </label>
                {editForm.is_admin ? (
                  <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <span className="text-xs text-blue-300">Full access to all APIs</span>
                  </div>
                ) : loadingApis ? (
                  <div className="mt-4 flex items-center gap-2 text-gray-500 text-xs">
                    <div className="w-3 h-3 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
                    Loading APIs...
                  </div>
                ) : apiEngines.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-gray-400 text-xs uppercase tracking-widest">API Permissions</label>
                      {apiEngines.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const allApiIds = apiEngines.map((api) => api.id);
                            if (selectedApis.length === allApiIds.length) {
                              setSelectedApis([]);
                            } else {
                              setSelectedApis(allApiIds);
                            }
                          }}
                          className="text-xs text-lime-400 hover:text-lime-300 transition-colors"
                        >
                          {selectedApis.length === apiEngines.length ? "Clear all" : "Select all"}
                        </button>
                      )}
                    </div>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {Object.entries(
                        apiEngines.reduce((acc, api) => {
                          const normalizedCategory = api.category?.trim().toLowerCase() || 'other';
                          if (!acc[normalizedCategory]) {
                            acc[normalizedCategory] = { 
                              displayName: api.category?.trim() || 'Other',
                              apis: [] 
                            };
                          }
                          acc[normalizedCategory].apis.push(api);
                          return acc;
                        }, {})
                      ).map(([key, { displayName, apis }]) => (
                        <div key={key} className="bg-gray-800/50 rounded-lg p-3 border border-white/5">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-lime-400"></div>
                            <span className="text-lime-400 text-xs font-medium uppercase tracking-wider">{displayName}</span>
                          </div>
                          <div className="space-y-1.5">
                            {apis.map((api) => (
                              <label
                                key={api.id}
                                className={`flex items-center gap-3 cursor-pointer rounded-md p-1.5 transition-all duration-200 ${
                                  selectedApis.includes(api.id)
                                    ? "bg-lime-500/10 border border-lime-500/20"
                                    : "hover:bg-white/5 border border-transparent"
                                }`}
                              >
                                <div className="relative flex items-center justify-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedApis.includes(api.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedApis([...selectedApis, api.id]);
                                      } else {
                                        setSelectedApis(selectedApis.filter((id) => id !== api.id));
                                      }
                                    }}
                                    className="sr-only"
                                  />
                                  <div
                                    className={`w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
              selectedApis.includes(api.id)
                ? "bg-lime-500 border-lime-500"
                : "border-gray-600 bg-gray-800"
            }`}
                                  >
            {selectedApis.includes(api.id) && (
              <svg className="w-3 h-3 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
                                  </div>
                                </div>
                                <span className={`text-sm transition-colors ${
                                  selectedApis.includes(api.id) ? "text-white font-medium" : "text-gray-400"
                                }`}>
                                  {api.name}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={saveEdit}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-lime-200 to-teal-700 text-gray-900 font-semibold text-sm disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
                <button
                  onClick={() => setEditUser(null)}
                  className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:text-white text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── View API Permissions Modal ── */}
      {viewApiUser && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-gray-900 border border-white/10 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[92vh] overflow-y-auto">
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>
            <div className="px-5 sm:px-6 py-4 sm:py-5">
              <h2 className="text-white font-semibold text-lg mb-1">
                {viewApiUser.name}
              </h2>
              <p className="text-gray-500 text-xs mb-5">API Permissions</p>

              {viewApiUser.has_all_apis ? (
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 mb-4">
                  <span className="text-sm text-blue-300">Full access to all APIs</span>
                </div>
              ) : (
                <div className="space-y-3 mb-4">
                  {Object.entries(
                    apiEngines
                      .filter((api) => viewApiUser.api_engine_ids?.includes(api.id))
                      .reduce((acc, api) => {
                        const cat = api.category?.trim() || 'Other';
                        if (!acc[cat]) acc[cat] = [];
                        acc[cat].push(api);
                        return acc;
                      }, {})
                  ).map(([category, apis]) => (
                    <div key={category} className="bg-gray-800/30 rounded-lg p-2.5 border border-white/5">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="w-1 h-1 rounded-full bg-purple-400"></div>
                        <span className="text-purple-400 text-[10px] font-medium uppercase tracking-wider">{category}</span>
                      </div>
                      <div className="space-y-1">
                        {apis.map((api) => (
                          <div key={api.id} className="flex items-center gap-2 pl-2">
                            <svg className="w-3.5 h-3.5 text-lime-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-gray-300">{api.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {viewApiUser.api_engine_ids?.length === 0 && (
                    <span className="text-sm text-gray-500">No APIs granted</span>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setViewApiUser(null);
                    openEdit(viewApiUser);
                  }}
                  className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-lime-200 to-teal-700 text-gray-900 font-semibold text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => setViewApiUser(null)}
                  className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:text-white text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}