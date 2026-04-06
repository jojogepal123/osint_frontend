import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  Home,
  LogIn,
  Users,
  FileText,
  Mail,
  Shield,
  Search,
  Eye,
  ChevronRight,
  Zap,
  Globe,
} from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "HOME", icon: Home },
    { path: "/login", label: "LOGIN", icon: LogIn },
    { path: "/about", label: "WHO", icon: Users },
    { path: "/privacy", label: "PRIVACY", icon: FileText },
    { path: "/contact-us", label: "CONTACT", icon: Mail },
  ];

  return (
    <>
      <div
        id="first"
        className="flex flex-row w-full lg:w-auto justify-evenly items-center lg:flex-col bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-800/90 backdrop-blur-2xl border border-slate-700/30 md:rounded-2xl lg:rounded-none px-2 md:divide-y divide-slate-800/50 text-sm text-white self-start lg:mt-0 md:mr-2 z-10 shadow-2xl shadow-cyan-500/5"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <div
                className={`flex flex-col justify-center items-center py-3 px-1 cursor-pointer transition-all duration-300 ${
                  isActive
                    ? "text-cyan-400 font-bold"
                    : "font-medium text-slate-400 hover:text-cyan-300"
                }`}
              >
                <div className="relative">
                  {isActive && (
                    <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-full blur-lg animate-pulse" />
                  )}
                  <div className={`p-2 rounded-xl transition-all duration-300 ${
                    isActive ? "bg-cyan-500/10" : "hover:bg-slate-800/50"
                  }`}>
                    <Icon className={`size-4 ${isActive ? "drop-shadow-lg" : ""}`} />
                  </div>
                </div>
                <p className="text-[10px] mt-1 tracking-wider">{item.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div
        id="second"
        className="flex flex-col items-center min-h-48 sm:min-h-64 lg:min-h-[85vh] lg:w-[32%] md:w-[60%] w-[85%] sm:w-[75%] relative shadow-2xl rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-700/30 lg:mt-0 md:mr-2"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-emerald-500/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
        
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <div className="absolute top-0 left-0 w-1/2 h-px bg-gradient-to-r from-emerald-500/50 to-transparent" />

        <div className="absolute z-10 hidden lg:flex top-1/3 -translate-y-1/2 flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full blur-3xl opacity-30 animate-pulse" />
            <div className="relative w-44 h-44 rounded-full bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border border-cyan-500/20 flex items-center justify-center shadow-2xl shadow-cyan-500/10">
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-500/10 to-emerald-500/10" />
              <div className="relative">
                <Shield className="w-20 h-20 text-cyan-400 drop-shadow-2xl" />
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 animate-ping" />
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/80 border border-cyan-500/20 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-medium text-slate-300 tracking-wider">LIVE SCANNING</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent backdrop-blur-xl border-t border-slate-700/30 p-4 sm:p-6 md:p-8">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-cyan-400/50" />
              <ChevronRight className="w-3 h-3 text-cyan-400/50" />
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-cyan-400/50" />
            </div>
          </div>

          <div className="flex flex-col items-center space-y-3 sm:space-y-4">
            <div className="relative">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
                {import.meta.env.VITE_APP_NAME || 'OSINT Platform'}
              </h1>
              <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
            </div>

            <p className="text-[10px] sm:text-xs md:text-sm text-slate-400 font-medium tracking-[0.3em] uppercase flex items-center gap-2">
              <Globe className="w-3 h-3 text-cyan-400/60" />
              Find Your Digital Footprint
            </p>

            <div className="flex items-center gap-4 sm:gap-6 mt-3">
              <button className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-slate-300 hover:bg-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 cursor-pointer shadow-lg shadow-cyan-500/5" aria-label="OSINT search">
                <Search className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] sm:text-xs font-bold tracking-wider">OSINT</span>
                <ChevronRight className="w-3 h-3 text-cyan-400/50 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="w-px h-6 bg-gradient-to-b from-transparent via-slate-600 to-transparent" />

              <button className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-slate-300 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 cursor-pointer shadow-lg shadow-emerald-500/5" aria-label="Intelligence view">
                <Eye className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] sm:text-xs font-bold tracking-wider">Intelligence</span>
                <ChevronRight className="w-3 h-3 text-emerald-400/50 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

              <div className="flex items-center gap-3 mt-4">
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: "0ms" }} />
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: "100ms" }} />
                <div className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" style={{ animationDelay: "200ms" }} />
              </div>

            <div className="mt-4 pt-4 border-t border-slate-800/50 w-full flex justify-center">
              <div className="flex items-center gap-2 text-slate-500 text-[10px] tracking-widest">
                <span>Powered by Advanced OSINT</span>
                <span className="text-cyan-400/50">•</span>
                <span>{new Date().getFullYear()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;