import React, { useState, useRef, useEffect } from "react";
import useAuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import InlineLoader from "./InlineLoader";
import { LogOut, User, Wallet, ChevronDown, Sparkles } from "lucide-react";

const UserCard = () => {
  const { user, logout } = useAuthContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setLoading(true);
    setDropdownOpen(false);
    setTimeout(() => {
      logout()
        .then(() => navigate("/"))
        .finally(() => setLoading(false));
    }, 1000);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const credits = user ? Number(user.credits || 0).toFixed(2) : "0.00";

  return (
    <div className="fixed top-0 right-0 z-50 flex items-center gap-3 p-3">
      {user && (
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 backdrop-blur-sm">
          <Wallet className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-medium text-slate-300">Credits</span>
          <span className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            {credits}
          </span>
        </div>
      )}

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="group flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50 transition-all duration-300"
          title={user?.name || "User"}
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-[2px]">
              <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center">
                <span className="text-xs font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  {getInitials(user?.name)}
                </span>
              </div>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-slate-200 leading-tight">
              {user?.name || "User"}
            </p>
            <p className="text-[10px] text-slate-500 leading-tight truncate max-w-[120px]">
              {user?.email || ""}
            </p>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute top-full right-0 mt-2 w-72 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/20 overflow-hidden">
              <div className="relative p-4 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 border-b border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-[2px]">
                      <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center">
                        <User className="w-6 h-6 text-cyan-400" />
                      </div>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {user?.email || ""}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/30">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs text-slate-400">Balance</span>
                  </div>
                  <span className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    {credits} credits
                  </span>
                </div>
              </div>

              <div className="p-2">
                {loading ? (
                  <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800/30">
                    <InlineLoader />
                    <span className="text-sm text-slate-300">Logging out...</span>
                  </div>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-800/50 group-hover:bg-red-500/20 flex items-center justify-center transition-all duration-300">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
