import { motion } from "framer-motion";
import { Shield, Mail, Globe, Database, Share2, Lock, Activity, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";

const Privacy = () => {
  const sections = [
    {
      icon: Database,
      title: "1. Information We Collect",
      color: "cyan",
      items: [
        "Publicly Available Data — gathered from open sources and collection APIs for investigative purposes.",
        "User-Provided Information — basic details like email or name when you interact with our platform.",
        "Usage Data — non-personal information such as IP addresses, browser type, and device details.",
      ],
    },
    {
      icon: Shield,
      title: "2. How We Use Your Information",
      color: "emerald",
      items: [
        "Provide OSINT-based investigative services to law enforcement, investigators, and journalists.",
        "Enhance platform functionality, security, and user experience.",
        "Analyze usage trends to improve our analytical capabilities.",
        "Ensure compliance with legal and ethical standards.",
      ],
    },
    {
      icon: Lock,
      title: "3. Data Protection & Security",
      color: "teal",
      items: [
        "Industry-standard security measures to protect data from unauthorized access, misuse, or disclosure.",
        "While we strive to safeguard information, no system can guarantee complete security.",
      ],
    },
    {
      icon: Share2,
      title: "4. Data Sharing",
      color: "cyan",
      items: [
        "We do not sell or trade personal information.",
        "Certain publicly available data may be analyzed using third-party services.",
        "We comply with legal requests if required by law enforcement.",
      ],
    },
  ];

  const colorMap = {
    cyan:    { card: "hover:border-cyan-500/30",    icon: "bg-cyan-500/10 border-cyan-500/20",       text: "text-cyan-400",    dot: "bg-cyan-400",    bar: "from-cyan-500"    },
    emerald: { card: "hover:border-emerald-500/30", icon: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-400", dot: "bg-emerald-400", bar: "from-emerald-500" },
    teal:    { card: "hover:border-teal-500/30",    icon: "bg-teal-500/10 border-teal-500/20",       text: "text-teal-400",    dot: "bg-teal-400",    bar: "from-teal-500"    },
  };

  return (
    <div className="relative min-h-screen w-full">
      <PublicNavbar />

      {/* hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-4">
              <Activity className="w-4 h-4" />
              Legal
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mt-2 mb-6">
              Privacy
              <span className="block bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400">
              At <span className="text-cyan-400 font-semibold">{import.meta.env.VITE_APP_NAME || 'OSINT Platform'}</span>, we value your
              privacy and are committed to protecting any information collected through our platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* policy sections */}
      <section className="relative py-8 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {sections.map((sec, i) => {
              const cls = colorMap[sec.color];
              return (
                <motion.div
                  key={sec.title}
                  className={`group relative bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 ${cls.card} transition-all duration-500 overflow-hidden`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-xl ${cls.icon} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <sec.icon className={`w-6 h-6 ${cls.text}`} />
                    </div>
                    <h3 className={`text-base font-bold mb-3 ${cls.text}`}>{sec.title}</h3>
                    <ul className="space-y-2">
                      {sec.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-slate-400 text-sm leading-relaxed">
                          <div className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${cls.dot}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r ${cls.bar} to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* contact section */}
      <section className="relative py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="bg-slate-900/40 backdrop-blur-sm border border-cyan-500/20 rounded-3xl p-10 lg:p-14"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
              Questions About
              <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent"> Privacy?</span>
            </h2>
            <p className="text-slate-400 text-base mb-8">
              Reach out to our team and we'll clarify anything about how we handle your data.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-slate-500 tracking-widest uppercase">Email</p>
                  <p className="text-sm font-semibold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    info@intelltrace.com
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-slate-500 tracking-widest uppercase">Website</p>
                  <p className="text-sm font-semibold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    Intelltrace.com
                  </p>
                </div>
              </div>
            </div>
            <Link
              to="/contact-us"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold text-base overflow-hidden"
            >
              Contact Us
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
