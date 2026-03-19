import React from "react";
import { Link } from "react-router-dom";
import { Search, Twitter, Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative z-10 mt-auto" aria-labelledby="footer-heading">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
      <div className="mx-auto max-w-6xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32 relative">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-6">
            <Link
              to="/"
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors">
                <Search className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                {import.meta.env.VITE_APP_NAME}
              </span>
            </Link>
            <p className="text-sm leading-6 text-slate-400">
              Advanced OSINT platform for investigators, researchers, and security professionals.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 xl:col-span-2 xl:mt-0">
            <div>
              <h3 className="text-sm font-semibold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Support
              </h3>
              <ul className="mt-6 space-y-4">
                <li>
                  <Link
                    to="/contact-us"
                    className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Company
              </h3>
              <ul className="mt-6 space-y-4">
                <li>
                  <Link
                    to="/about"
                    className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Policy
              </h3>
              <ul className="mt-6 space-y-4">
                <li>
                  <Link
                    to="/terms-conditions"
                    className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    to="/refund-policy"
                    className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    Refund
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-slate-800 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-slate-500">
            © {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME}, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
