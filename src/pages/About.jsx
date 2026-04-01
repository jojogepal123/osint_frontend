import { motion } from "framer-motion";
import { Shield, Target, Lock, Zap, Globe, Database, Users, Eye, Activity, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Precision Intel",
      description: "Accurate data from verified public sources and collection APIs, cross-referenced for reliability.",
      color: "cyan",
    },
    {
      icon: Lock,
      title: "Privacy-First",
      description: "Strict ethical standards and responsible data governance built into every query we process.",
      color: "emerald",
    },
    {
      icon: Zap,
      title: "Real-time Scan",
      description: "Live intelligence across 50+ databases in seconds — no waiting, no stale data.",
      color: "teal",
    },
    {
      icon: Shield,
      title: "Verified Sources",
      description: "Every data point traced back to a verified public source — no guesswork, no hallucination.",
      color: "cyan",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Coverage across 190+ countries with localized phone, identity, and corporate intelligence.",
      color: "emerald",
    },
    {
      icon: Eye,
      title: "Deep Profiling",
      description: "Correlate phone, email, social, and breach data into a single unified intelligence report.",
      color: "teal",
    },
  ];

  const stats = [
    { icon: Globe,    value: "190+",  label: "Countries Covered" },
    { icon: Database, value: "50+",   label: "Data Sources"      },
    { icon: Users,    value: "10M+",  label: "Records Indexed"   },
    { icon: Eye,      value: "99.9%", label: "Uptime Accuracy"   },
  ];

  const colorMap = {
    cyan:    { card: "hover:border-cyan-500/30",    icon: "bg-cyan-500/10 border-cyan-500/20",    text: "text-cyan-400"    },
    emerald: { card: "hover:border-emerald-500/30", icon: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-400" },
    teal:    { card: "hover:border-teal-500/30",    icon: "bg-teal-500/10 border-teal-500/20",    text: "text-teal-400"    },
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
              About Us
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mt-2 mb-6">
              Who We
              <span className="block bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Are
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 mb-8">
              Advanced open-source intelligence for professionals who need results — law enforcement, investigators, and journalists.
            </p>
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold text-lg overflow-hidden"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* about text */}
      <section className="relative py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-4">
                <Shield className="w-4 h-4" />
                Our Mission
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-6">
                Bridging Data &amp;
                <span className="block bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Actionable Insight
                </span>
              </h2>
              <div className="space-y-4 text-slate-400 text-base leading-relaxed">
                <p>
                  <span className="text-cyan-400 font-semibold">{import.meta.env.VITE_APP_NAME}</span> is a dedicated OSINT
                  platform designed to assist law enforcement agencies, investigators, and journalists in conducting
                  digital investigations efficiently. We collect and analyze publicly available data from various
                  internet sources and collection APIs, providing professionals with the intelligence they need
                  to uncover online footprints, identify potential threats, and verify critical information.
                </p>
                <p>
                  Our goal is to bridge the gap between publicly accessible data and actionable insights —
                  enabling professionals to conduct in-depth research, track digital trails, and enhance
                  security measures. With a strong commitment to ethical intelligence gathering, privacy
                  protection, and data integrity, {import.meta.env.VITE_APP_NAME} continues to evolve with
                  advanced analytical capabilities.
                </p>
              </div>
            </motion.div>

            {/* stats */}
            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 flex flex-col items-center text-center hover:border-cyan-500/30 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-3">
                    <s.icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    {s.value}
                  </span>
                  <span className="text-xs text-slate-500 tracking-wider uppercase mt-1">{s.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* values grid */}
      <section className="relative py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-14"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-4">
              <Target className="w-4 h-4" />
              Our Values
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-2">
              Built on
              <span className="block bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Principles
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => {
              const cls = colorMap[v.color];
              return (
                <motion.div
                  key={v.title}
                  className={`group relative bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 ${cls.card} transition-all duration-500 overflow-hidden`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-2xl ${cls.icon} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <v.icon className={`w-7 h-7 ${cls.text}`} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{v.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{v.description}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* footer CTA */}
      <section className="relative py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Ready to Start Your
              <span className="block bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Investigation?
              </span>
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              Trusted by law enforcement · journalists · security professionals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold text-lg overflow-hidden"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact-us"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-slate-700 text-white font-semibold text-lg hover:bg-slate-800/50 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
