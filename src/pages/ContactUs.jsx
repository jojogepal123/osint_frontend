import { motion } from "framer-motion";
import { Mail, Globe, Shield, MessageSquare, Clock, CheckCircle, Zap, ArrowRight, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";

const ContactUs = () => {
  const channels = [
    {
      icon: Mail,
      label: "Email",
      value: "info@intelltrace.com",
      description: "Drop us a message and we'll reply within 24 hours. Priority responses for law enforcement and verified organizations.",
      color: "cyan",
    },
    {
      icon: Globe,
      label: "Website",
      value: "Intelltrace.com",
      description: "Visit our documentation and knowledge base for guides, API references, and integration tutorials.",
      color: "emerald",
    },
  ];

  const features = [
    { icon: Clock,       text: "24h response time",           color: "cyan"    },
    { icon: CheckCircle, text: "Verified support team",        color: "emerald" },
    { icon: Shield,      text: "Confidential & secure",        color: "teal"    },
    { icon: Zap,         text: "Priority for investigators",   color: "cyan"    },
  ];

  const colorMap = {
    cyan:    { card: "hover:border-cyan-500/30",    icon: "bg-cyan-500/10 border-cyan-500/20",       text: "text-cyan-400",    bar: "from-cyan-500"    },
    emerald: { card: "hover:border-emerald-500/30", icon: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-400", bar: "from-emerald-500" },
    teal:    { card: "hover:border-teal-500/30",    icon: "bg-teal-500/10 border-teal-500/20",       text: "text-teal-400",    bar: "from-teal-500"    },
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
              Get In Touch
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mt-2 mb-6">
              Contact
              <span className="block bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Our Team
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400">
              Have questions about our OSINT solutions? We're here to help law enforcement, investigators, and journalists get the most out of our platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* contact cards */}
      <section className="relative py-8 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {channels.map((ch, i) => {
              const cls = colorMap[ch.color];
              return (
                <motion.div
                  key={ch.label}
                  className={`group relative bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-8 ${cls.card} transition-all duration-500 overflow-hidden`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-2xl ${cls.icon} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <ch.icon className={`w-7 h-7 ${cls.text}`} />
                    </div>
                    <p className="text-xs text-slate-500 tracking-widest uppercase mb-1">{ch.label}</p>
                    <h3 className={`text-xl font-bold mb-3 ${cls.text}`}>{ch.value}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{ch.description}</p>
                  </div>
                  <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${cls.bar} to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* feature badges */}
      <section className="relative py-8 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-black text-white text-center mb-10">
              Why Choose Our
              <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent"> Support</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((f, i) => {
                const cls = colorMap[f.color];
                return (
                  <motion.div
                    key={i}
                    className={`group bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-xl p-5 text-center ${cls.card} transition-all duration-300`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className={`w-10 h-10 rounded-xl ${cls.icon} border flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                      <f.icon className={`w-5 h-5 ${cls.text}`} />
                    </div>
                    <p className="text-sm font-medium text-slate-300">{f.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA section */}
      <section className="relative py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="bg-slate-900/40 backdrop-blur-sm border border-cyan-500/20 rounded-3xl p-10 lg:p-14"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-slate-400 text-base mb-8">
              Email us at{" "}
              <span className="text-cyan-400 font-semibold">info@intelltrace.com</span>{" "}
              and we'll set up your account and walk you through the platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold text-base overflow-hidden"
              >
                Create Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-slate-700 text-white font-semibold text-base hover:bg-slate-800/50 transition-all"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
