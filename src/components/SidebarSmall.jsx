import useAuthContext from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";
import Loader from "./Loader";
import {
  Mail,
  Phone,
  Database,
  Building2,
  ShieldCheck,
  HelpCircle,
  LogOut,
  Search,
  Activity,
} from "lucide-react";

const SidebarSmall = () => {
  const location = useLocation();
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const navigate = useNavigate();
  const {
    user,
    logout,
    setInputType,
    inputType,
  } = useAuthContext();

  const handleLeakDataFinder = () => {
    navigate("/leak-data-finder");
  };

  const handleCorporateDataFinder = () => {
    navigate("/corporate");
  };

  const handleVerificationId = () => {
    navigate("/verification-id");
  };

  const Logout = async () => {
    setIsLogoutLoading(true);
    try {
      await logout();
      navigate("/");
    } finally {
      setIsLogoutLoading(false);
    }
  };

  const isLeakDataFinderActive = location.pathname === "/leak-data-finder";
  const isCorporateDataFinderActive = location.pathname === "/corporate";
  const isVerificationIdActive = location.pathname === "/verification-id";
  const dashboardActive = location.pathname === "/dashboard";

  const navItems = [
    {
      icon: Mail,
      label: "Email Search",
      active: inputType === "email" && dashboardActive,
      onClick: () => {
        setInputType("email");
        if (!dashboardActive) navigate("/dashboard");
      },
    },
    {
      icon: Phone,
      label: "Phone Search",
      active: inputType === "tel" && dashboardActive,
      onClick: () => {
        setInputType("tel");
        if (!dashboardActive) navigate("/dashboard");
      },
    },
    {
      icon: Database,
      label: "Leak Data Finder",
      active: isLeakDataFinderActive,
      onClick: handleLeakDataFinder,
    },
    {
      icon: Building2,
      label: "Corporate Intelligence",
      active: isCorporateDataFinderActive,
      onClick: handleCorporateDataFinder,
    },
    {
      icon: ShieldCheck,
      label: "Verified ID",
      active: isVerificationIdActive,
      onClick: handleVerificationId,
    },
  ];

  return (
    <>
      {isLogoutLoading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <Loader />
        </div>
      )}
      <aside
        className="
          fixed z-[50] top-0 bottom-0 left-0
          h-screen w-64
          bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800
          border-r border-slate-700/50 shadow-2xl
          flex flex-col
          md:hidden
        "
      >
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center h-16 px-4 gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Search className="w-5 h-5 text-cyan-400" />
            </div>
            <Link to="/" className="flex-1 overflow-hidden">
              <h1 className="text-base font-bold bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent truncate">
                {import.meta.env.VITE_APP_NAME}
              </h1>
            </Link>
          </div>

          <div className="px-4 py-1">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          </div>

          <nav className="flex-1 px-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            <div className="space-y-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className={`
                      w-full flex items-center gap-3 rounded-xl
                      transition-all duration-300 ease-out
                      ${item.active
                        ? "bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 text-cyan-400"
                        : "hover:bg-slate-800/50 border border-transparent text-slate-400 hover:text-slate-200"
                      }
                      px-3 py-3
                    `}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-800/50 group-hover:bg-slate-700/50 transition-all duration-300">
                      <Icon className={`w-5 h-5 ${item.active ? "text-cyan-400" : "text-slate-400"}`} />
                    </div>
                    <span className="flex-1 text-left text-sm font-medium">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <Link
                to={"/dashboard"}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Help & Support</span>
              </Link>
            </div>
          </nav>

          {user && (
            <div className="px-3 pb-3">
              <button
                onClick={Logout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center">
                  <LogOut className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          )}
        </div>

        <div className="px-4 pb-4">
          <div className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-medium text-slate-400">Status</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-500">Operational</span>
            </div>
          </div>
          <div className="mt-3 text-center">
            <p className="text-xs text-slate-600">
              {import.meta.env.VITE_APP_NAME} © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarSmall;
