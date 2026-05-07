export default function RevokeConfirmModal({ revokeConfirm, setRevokeConfirm, confirmRevoke, saving }) {
  if (!revokeConfirm) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-white/10 rounded-xl w-full max-w-sm">
        <div className="p-5">
          <h2 className="text-white font-semibold text-lg mb-2">Revoke Admin Access?</h2>
          <p className="text-gray-400 text-sm mb-4">
            This will reset all API permissions for <span className="text-white">{revokeConfirm.name}</span>.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setRevokeConfirm(null)}
              disabled={saving}
              className="flex-1 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white text-sm"
            >
              Cancel
            </button>
            <button
              onClick={confirmRevoke}
              disabled={saving}
              className="flex-1 py-2 rounded-lg bg-lime-500 text-gray-900 font-semibold text-sm"
            >
              {saving ? 'Processing...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}