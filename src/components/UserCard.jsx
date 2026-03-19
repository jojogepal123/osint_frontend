import React, { useState } from "react";
import useAuthContext from "../context/AuthContext";
import UserIcon from "../assets/userIcon.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import InlineLoader from "./InlineLoader";
import { LogOut, User, CreditCard } from "lucide-react";

const UserCard = () => {
  const { user, logout } = useAuthContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setLoading(true);
    setDropdownOpen(false);
    setTimeout(() => {
      logout()
        .then(() => {
          navigate("/");
        })
        .finally(() => {
          setLoading(false);
        });
    }, 1000);
  };

  return (
    <div className="flex gap-2 items-center justify-end p-4 z-20">
      {user && (
        <div className="text-xs md:text-sm text-slate-900 rounded px-3 py-1.5 bg-gradient-to-r from-cyan-400 to-emerald-400">
          Credits:{" "}
          <span className="font-semibold">
            {Number(user.credits).toFixed(2)}
          </span>
        </div>
      )}
      <div className="relative flex items-center">
        <button
          className="h-8 w-8 md:h-10 md:w-10 rounded-full shadow bg-white/10 transition-opacity duration-300"
          title={user?.name || "User"}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <User className="h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-cyan-400 p-1.5 text-cyan-400" />
        </button>
        {dropdownOpen && (
          <div className="absolute top-10 md:top-12 right-0 mt-2 w-80 border border-cyan-500/30 bg-slate-900/95 backdrop-blur-xl shadow-2xl rounded-xl overflow-hidden">
            <div className="flex items-center justify-start space-x-4 mb-4 py-4 px-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-full border-2 border-cyan-400 p-1.5">
                <User className="w-full h-full text-cyan-400" />
              </div>
              <div className="text-white hover:text-cyan-400 flex flex-col">
                <span className="text-sm font-medium">{user?.name || "User"}</span>
                <span className="text-xs text-slate-400">{user?.email || ""}</span>
              </div>
            </div>
            {loading ? (
              <div className="flex items-center px-4 py-3 space-x-3 w-full">
                <InlineLoader />
                <span className="text-sm text-white">Logging out...</span>
              </div>
            ) : (
              <button
                className="flex items-center px-4 py-3 space-x-3 w-full hover:bg-slate-800/50 text-slate-300 hover:text-red-400 border-t border-slate-800 transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm">Logout</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
