import React from "react";
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
} from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  return (
    <>
      <div
        id="first"
        className="flex flex-row w-full lg:w-auto justify-evenly items-center lg:flex-col bg-gradient-to-b from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 md:rounded-2xl px-2 md:divide-y text-sm text-white self-start lg:mt-32 md:mr-2 z-10"
      >
        <Link to="/">
          <div
            className={`flex flex-col justify-center items-center py-3 px-1 cursor-pointer  ${
              location.pathname === "/"
                ? "text-cyan-400 font-bold"
                : "font-medium hover:text-cyan-300"
            }`}
          >
            <div className="p-2">
              <Home className="size-4" />
            </div>
            <p>HOME</p>
          </div>
        </Link>

        <Link to="/login">
          <div
            className={`flex flex-col justify-center items-center py-3 px-1 cursor-pointer ${
              location.pathname === "/login"
                ? "text-cyan-400 font-bold"
                : "font-medium hover:text-cyan-300"
            }`}
          >
            <div className="p-2">
              <LogIn className="size-4" />
            </div>
            <p>LOGIN</p>
          </div>
        </Link>

        <Link to="/about">
          <div
            className={`flex flex-col justify-center items-center py-3 px-1 cursor-pointer ${
              location.pathname === "/about"
                ? "text-cyan-400 font-bold"
                : "font-medium hover:text-cyan-300"
            }`}
          >
            <div className="p-2">
              <Users className="size-4" />
            </div>
            <p>WHO</p>
          </div>
        </Link>

        <Link to="/privacy">
          <div
            className={`flex flex-col justify-center items-center py-3 px-1 cursor-pointer ${
              location.pathname === "/privacy"
                ? "text-cyan-400 font-bold"
                : "font-medium hover:text-cyan-300"
            }`}
          >
            <div className="p-2">
              <FileText className="size-4" />
            </div>
            <p>PRIVACY</p>
          </div>
        </Link>

        <Link to="/contact-us">
          <div
            className={`flex flex-col justify-center items-center py-3 px-1 cursor-pointer ${
              location.pathname === "/contact-us"
                ? "text-cyan-400 font-bold"
                : "font-medium hover:text-cyan-300"
            }`}
          >
            <div className="p-2">
              <Mail className="size-4" />
            </div>
            <p>CONTACT</p>
          </div>
        </Link>
      </div>
      <div
        id="second"
        className="flex flex-col items-center min-h-48 sm:min-h-64 lg:min-h-[80%] lg:w-[30%] md:w-[60%] w-[85%] sm:w-[75%] relative shadow-2xl rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900/80 via-slate-900/90 to-slate-800/80 border border-slate-700/50 lg:mt-8 md:mr-2"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-emerald-500/5" />

        <div className="absolute z-10 hidden lg:block top-1/3 -translate-y-1/3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full blur-2xl opacity-40 animate-pulse" />
            <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500/30 flex items-center justify-center shadow-2xl shadow-cyan-500/20">
              <Shield className="w-24 h-24 text-cyan-400" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent backdrop-blur-xl border-t border-slate-700/50 p-4 sm:p-6 md:p-8">
          <div className="flex justify-center mb-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
          </div>
          
          <div className="flex flex-col items-center space-y-3 sm:space-y-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
              {import.meta.env.VITE_APP_NAME}
            </h1>
            
            <p className="text-[10px] sm:text-xs md:text-sm bg-gradient-to-r from-cyan-400/80 to-emerald-400/80 bg-clip-text text-transparent font-medium tracking-widest uppercase">
              Find Your Digital Footprint
            </p>

            <div className="flex items-center gap-3 sm:gap-5 mt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-slate-300 hover:bg-cyan-400/20 transition-colors cursor-pointer">
                <Search className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400" />
                <span className="text-[9px] sm:text-[10px] font-semibold tracking-wider">OSINT</span>
              </div>
              <div className="w-px h-5 bg-gradient-to-b from-transparent via-slate-600 to-transparent" />
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-slate-300 hover:bg-emerald-400/20 transition-colors cursor-pointer">
                <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
                <span className="text-[9px] sm:text-[10px] font-semibold tracking-wider">Intelligence</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <div className="h-1 w-1 rounded-full bg-cyan-400 animate-pulse" />
              <div className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse delay-100" />
              <div className="h-1 w-1 rounded-full bg-teal-400 animate-pulse delay-200" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
