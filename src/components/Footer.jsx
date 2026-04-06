import { Link } from "react-router-dom";
import { Search, Twitter, Github, Linkedin, Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-slate-950 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                {import.meta.env.VITE_APP_NAME || 'OSINT Platform'}
              </span>
            </Link>
            <p className="text-sm leading-6 text-slate-400 max-w-md">
              Advanced OSINT platform empowering investigators, journalists, and security professionals with actionable intelligence from public data sources.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { label: "About", path: "/about" },
                { label: "Features", path: "/#features" },
                { label: "Services", path: "/#services" },
                { label: "Contact", path: "/#contact" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.path}
                    className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/privacy"
                  className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-conditions"
                  className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs leading-5 text-slate-500">
            © {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME || 'OSINT Platform'}. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-slate-600 text-xs">
            <Search className="w-3 h-3" />
            <span>Powered by Advanced OSINT</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;