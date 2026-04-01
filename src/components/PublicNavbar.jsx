import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Menu, X } from "lucide-react";

const navItems = [
  { path: "/",           label: "Home"    },
  { path: "/about",      label: "About"   },
  { path: "/contact-us", label: "Contact" },
  { path: "/privacy",    label: "Privacy" },
];

const PublicNavbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 bg-slate-950/70 backdrop-blur-2xl border-b border-cyan-500/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* logo */}
          <Link to="/">
            <motion.div className="flex items-center gap-3 cursor-pointer" whileHover={{ scale: 1.02 }}>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center">
                <Search className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                {import.meta.env.VITE_APP_NAME}
              </span>
            </motion.div>
          </Link>

          {/* desktop links */}
          <div className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative text-sm font-medium transition-all duration-300 ${
                    isActive ? "text-cyan-400" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-emerald-400"
                      layoutId="navIndicator"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">
              Sign In
            </Link>
            <Link
              to="/register"
              className="group relative px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm font-semibold overflow-hidden"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity" />
            </Link>
          </div>

          {/* mobile toggle */}
          <button className="lg:hidden text-slate-300 p-2" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      <motion.div
        className="lg:hidden bg-slate-950/95 backdrop-blur-xl border-t border-cyan-500/10 overflow-hidden"
        initial={false}
        animate={{ opacity: open ? 1 : 0, height: open ? "auto" : 0 }}
      >
        <div className="px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:bg-slate-800"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <Link to="/login" onClick={() => setOpen(false)} className="px-4 py-3 text-sm text-slate-300">
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm font-semibold text-center"
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default PublicNavbar;
