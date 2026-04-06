import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import {
  Shield,
  Search,
  Zap,
  Globe,
  ChevronDown,
  ArrowRight,
  Fingerprint,
  Network,
  Mail,
  Phone,
  Star,
  Twitter,
  Github,
  Linkedin,
  Menu,
  X,
  Eye,
  Database,
  User,
  Building2,
  Lock,
  Cpu,
  Activity,
  Target,
  LockOpen,
  Radar,
} from "lucide-react";

const Section = ({ children, id, className = "" }) => {
  return (
    <section id={id} className={`min-h-screen w-full relative ${className}`}>
      {children}
    </section>
  );
};

const InteractiveBackground = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const cyanGradient = useMotionTemplate`radial-gradient(600px circle at ${cursorX}px ${cursorY}px, rgba(34, 211, 238, 0.08), transparent 40%)`;
  const emeraldGradient = useMotionTemplate`radial-gradient(400px circle at ${cursorX}px ${cursorY}px, rgba(16, 185, 129, 0.1), transparent 40%)`;

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950" />
      
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: cyanGradient,
        }}
      />
      
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: emeraldGradient,
        }}
      />

      <div className="absolute inset-0">
        <svg className="absolute inset-0 w-full h-full opacity-[0.02]">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400"/>
            </pattern>
            <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="currentColor" className="text-cyan-400/50"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-cyan-400/30"
          initial={{ 
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
          }}
          animate={{
            x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920)],
            y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[200px]" />
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-1/4 w-[700px] h-[700px] bg-teal-500/5 rounded-full blur-[180px]" />

      <div className="absolute top-1/4 left-1/4 w-px h-32 bg-gradient-to-b from-cyan-500/0 via-cyan-500/30 to-cyan-500/0">
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-cyan-400 to-transparent"
          animate={{ y: ["0%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <div className="absolute top-1/3 right-1/3 w-px h-48 bg-gradient-to-b from-emerald-500/0 via-emerald-500/30 to-emerald-500/0">
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-emerald-400 to-transparent"
          animate={{ y: ["0%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
        />
      </div>
      <div className="absolute bottom-1/3 left-1/3 w-px h-40 bg-gradient-to-b from-teal-500/0 via-teal-500/30 to-teal-500/0">
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-teal-400 to-transparent"
          animate={{ y: ["0%", "100%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
        />
      </div>
    </div>
  );
};

const FloatingParticle = ({ delay = 0 }) => {
  const icons = [Shield, Search, Eye, Lock, Database, Cpu, Radar, Target];
  const Icon = icons[Math.floor(Math.random() * icons.length)];
  const size = Math.random() * 20 + 16;
  
  return (
    <motion.div
      className="absolute text-cyan-400/20 pointer-events-none"
      initial={{ 
        x: Math.random() * 2000 - 1000,
        y: Math.random() * 2000 - 1000,
        opacity: 0,
      }}
      animate={{
        y: [null, Math.random() * 200 - 100],
        opacity: [0, 0.3, 0],
      }}
      transition={{
        duration: 8 + Math.random() * 8,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
      style={{ fontSize: size }}
    >
      <Icon />
    </motion.div>
  );
};

const randomPhone = () => {
  const n = () => Math.floor(Math.random() * 9000 + 1000);
  return `+${Math.floor(Math.random() * 90 + 10)} ${n()} ${n()} ${Math.floor(Math.random() * 900 + 100)}`;
};

const OSINTIllustration = () => {
  const phone = useMemo(() => randomPhone(), []);
  const rows = [
    { label: "Carrier",    value: "***********",   dot: "bg-cyan-400",    text: "text-cyan-300"    },
    { label: "Location",   value: "***********",   dot: "bg-emerald-400", text: "text-emerald-300" },
    { label: "WhatsApp",   value: "***********",   dot: "bg-teal-400",    text: "text-teal-300"    },
    { label: "Truecaller", value: "***********",   dot: "bg-cyan-400",    text: "text-cyan-300"    },
    { label: "Telegram",   value: "***********",   dot: "bg-emerald-400", text: "text-emerald-300" },
    { label: "Breach DB",  value: "***********",   dot: "bg-red-400",     text: "text-red-300"     },
  ];
  const sources = [
    { label: "HLR",        done: true  },
    { label: "Truecaller", done: true  },
    { label: "OSINT Ind.", done: true  },
    { label: "Telegram",   done: true  },
    { label: "BreachDB",   done: false },
  ];
  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-[#060e1a] border border-slate-700/50 font-mono select-none">
      {/* scan line */}
      <motion.div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent z-10 pointer-events-none"
        animate={{ top: ["8%", "96%"] }} transition={{ duration: 3.5, repeat: Infinity, ease: "linear", repeatType: "loop" }} />

      {/* browser chrome */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-900/90 border-b border-slate-800/70">
        <div className="flex gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 h-5 rounded-md bg-slate-800/80 flex items-center px-2.5 mx-2">
          <span className="text-[9px] text-slate-500 tracking-wide">intel.app › lookup › phone</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
          <span className="text-[8px] text-emerald-400 font-semibold tracking-wider">LIVE</span>
        </div>
      </div>

      {/* content */}
      <div className="p-3 space-y-2.5">

        {/* search row */}
        <motion.div className="flex gap-2" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="flex-1 flex items-center gap-2 h-8 rounded-lg bg-slate-900/80 border border-cyan-500/40 px-3">
            <div className="w-3 h-3 rounded-full border border-cyan-400/70 flex-shrink-0" />
            <span className="text-[10px] text-cyan-200 tracking-wider">{phone}</span>
            <motion.div className="w-px h-3.5 bg-cyan-400 ml-0.5" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.85, repeat: Infinity }} />
          </div>
          <motion.div className="h-8 px-3.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center gap-1.5 cursor-pointer shrink-0"
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Search className="w-3 h-3 text-white" />
            <span className="text-[9px] font-bold text-white tracking-widest">SCAN</span>
          </motion.div>
        </motion.div>

        {/* profile card */}
        <motion.div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50"
          initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/30 to-emerald-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-cyan-300" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#060e1a]" />
          </div>
          <div className="flex-1 min-w-0">
            <motion.div className="h-2.5 w-24 rounded-full bg-cyan-400/80 mb-1.5"
              initial={{ width: 0 }} animate={{ width: 96 }} transition={{ delay: 0.5, duration: 0.4 }} />
            <motion.div className="h-2 w-36 rounded-full bg-slate-700"
              initial={{ width: 0 }} animate={{ width: 144 }} transition={{ delay: 0.6, duration: 0.4 }} />
          </div>
          <span className="text-[8px] font-semibold text-emerald-300 border border-emerald-500/40 bg-emerald-500/10 rounded-md px-2 py-0.5 shrink-0">FOUND</span>
        </motion.div>

        {/* data rows */}
        <div className="space-y-1">
          {rows.map((row, i) => (
            <motion.div key={row.label}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg bg-slate-900/40 border border-slate-800/50 hover:border-slate-700/70 transition-colors"
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 + i * 0.09 }}>
              <div className={`w-2 h-2 rounded-full shrink-0 ${row.dot}`} />
              <span className="text-[9px] text-slate-500 w-16 shrink-0 tracking-wide">{row.label}</span>
              <motion.span className={`text-[9px] font-medium truncate ${row.text}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 + i * 0.09 }}>
                {row.value}
              </motion.span>
            </motion.div>
          ))}
        </div>

        {/* sources + bottom row */}
        <motion.div className="flex items-center justify-between pt-0.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
          <div className="flex items-center gap-1.5">
            <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
            <span className="text-[8px] text-slate-500 tracking-widest">SOURCES: {sources.filter(s=>s.done).length}/{sources.length}</span>
          </div>
          <div className="flex gap-1">
            {sources.map((s, i) => (
              <motion.div key={i} className={`w-4 h-1.5 rounded-full ${s.done ? "bg-emerald-400" : "bg-slate-700"}`}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.8 + i * 0.1 }} />
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

const AbstractIllustration = () => {
  const phone = useMemo(() => randomPhone(), []);
  const steps = [
    {
      num: "01", icon: Search, accent: "cyan",
      title: "Enter Query",
      sub: "Phone · Email · Domain · Name",
      items: [
        { label: phone, active: true },
        { label: "***@******.***",  active: false },
        { label: "*** Corp.",       active: false },
      ],
    },
    {
      num: "02", icon: Cpu, accent: "emerald",
      title: "AI Analysis",
      sub: "Multi-source intelligence scan",
      items: [
        { label: "Truecaller lookup", done: true },
        { label: "HLR / carrier",     done: true },
        { label: "Breach databases",  loading: true },
      ],
    },
    {
      num: "03", icon: Database, accent: "teal",
      title: "Intelligence Report",
      sub: "Actionable findings exported",
      items: [
        { label: "Identity: *******",   ok: true },
        { label: "Location: *******",   ok: true },
        { label: "Risk Score: ***",     ok: true },
      ],
    },
  ];

  const accentCls = {
    cyan:    { border: "border-cyan-500/50",    bg: "bg-cyan-500/10",    icon: "text-cyan-400",    dot: "bg-cyan-400",    text: "text-cyan-400",    num: "text-cyan-400/30"    },
    emerald: { border: "border-emerald-500/50", bg: "bg-emerald-500/10", icon: "text-emerald-400", dot: "bg-emerald-400", text: "text-emerald-400", num: "text-emerald-400/30" },
    teal:    { border: "border-teal-500/50",    bg: "bg-teal-500/10",    icon: "text-teal-400",    dot: "bg-teal-400",    text: "text-teal-400",    num: "text-teal-400/30"    },
  };

  return (
    <div className="w-full h-full flex flex-col gap-2.5 font-mono p-1">
      {steps.map((step, si) => {
        const ac = accentCls[step.accent];
        return (
          <motion.div key={step.num}
            className={`flex-1 rounded-2xl bg-[#060e1a]/80 border ${ac.border} overflow-hidden`}
            initial={{ opacity: 0, x: si % 2 === 0 ? -24 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: si * 0.18, duration: 0.5 }}>

            {/* header */}
            <div className="flex items-center gap-2.5 px-3.5 py-2 border-b border-slate-800/60 bg-slate-900/40">
              <div className={`w-7 h-7 rounded-lg ${ac.bg} border ${ac.border} flex items-center justify-center shrink-0`}>
                <step.icon className={`w-3.5 h-3.5 ${ac.icon}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-bold text-white tracking-widest leading-none">{step.title}</p>
                <p className="text-[7.5px] text-slate-500 mt-0.5 truncate">{step.sub}</p>
              </div>
              <span className={`text-[11px] font-black ${ac.num} shrink-0`}>{step.num}</span>
            </div>

            {/* body */}
            <div className="px-3.5 py-2 space-y-1.5">
              {step.items.map((item, ii) => (
                <motion.div key={ii} className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + si * 0.18 + ii * 0.08 }}>
                  {item.active !== undefined && (
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.active ? ac.dot : "bg-slate-700"}`} />
                  )}
                  {item.done !== undefined && (
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.done ? "bg-emerald-400" : "bg-slate-700"}`} />
                  )}
                  {item.loading && (
                    <motion.div className="w-1.5 h-1.5 rounded-full shrink-0 bg-yellow-400"
                      animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
                  )}
                  {item.ok && (
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${ac.dot}`} />
                  )}
                  <span className={`text-[8.5px] truncate ${(item.active || item.done || item.ok) ? "text-slate-300" : "text-slate-600"}`}>
                    {item.label}
                  </span>
                  {item.loading && (
                    <motion.div className="ml-auto flex gap-px" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.9, repeat: Infinity }}>
                      {[0,1,2].map(k => <div key={k} className="w-0.5 h-2.5 rounded-full bg-yellow-400/70" />)}
                    </motion.div>
                  )}
                  {item.active && (
                    <span className={`ml-auto text-[7px] ${ac.text} border ${ac.border} rounded px-1 shrink-0`}>ACTIVE</span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

const NavDot = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className="group relative flex items-center justify-center"
    aria-label={label}
  >
    <motion.div
      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
        active
          ? "bg-cyan-400 scale-150 shadow-[0_0_10px_rgba(34,211,238,0.6)]"
          : "bg-slate-600 hover:bg-slate-400"
      }`}
    />
    {active && (
      <>
        <motion.div
          className="absolute w-12 h-12 rounded-full border border-cyan-400/20"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="absolute left-full ml-4 px-3 py-1.5 bg-slate-900/90 backdrop-blur-sm border border-cyan-500/30 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 shadow-lg shadow-cyan-500/10">
          {label}
        </span>
      </>
    )}
  </button>
);

const VerticalNavDots = ({ activeSection, navItems, onNavigate }) => {
  return (
    <div className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col gap-5 z-50">
      {navItems.map((item) => (
        <NavDot
          key={item.id}
          active={activeSection === item.id}
          onClick={() => onNavigate(item.id)}
          label={item.label}
        />
      ))}
    </div>
  );
};

const Navbar = ({ activeSection, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemRefs = useRef({});
  const [activeIndicatorPos, setActiveIndicatorPos] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const updateIndicator = () => {
      const activeEl = itemRefs.current[activeSection];
      if (activeEl) {
        const rect = activeEl.getBoundingClientRect();
        const parent = activeEl.parentElement;
        const parentRect = parent.getBoundingClientRect();
        setActiveIndicatorPos({
          left: rect.left - parentRect.left,
          width: rect.width,
        });
      }
    };
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeSection]);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "features", label: "Features" },
    { id: "how-it-works", label: "How It Works" },
    { id: "services", label: "Services" },
  ];

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <>
      <VerticalNavDots
        activeSection={activeSection}
        navItems={navItems}
        onNavigate={scrollToSection}
      />

      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 bg-slate-950/70 backdrop-blur-2xl border-b border-cyan-500/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <motion.div
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => scrollToSection("home")}
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center">
                <Search className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                {import.meta.env.VITE_APP_NAME}
              </span>
            </motion.div>

            <div className="hidden lg:flex items-center gap-10 relative">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  ref={(el) => { itemRefs.current[item.id] = el; }}
                  className={`relative text-sm font-medium transition-all duration-300 ${
                    activeSection === item.id
                      ? "text-cyan-400"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <motion.div
                className="absolute -bottom-1 h-0.5 bg-gradient-to-r from-cyan-400 to-emerald-400"
                animate={activeIndicatorPos}
              />
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
              >
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

            <button
              className="lg:hidden text-slate-300 p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <motion.div
          className="lg:hidden bg-slate-950/95 backdrop-blur-xl border-t border-cyan-500/10 overflow-hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: mobileMenuOpen ? 1 : 0, height: mobileMenuOpen ? "auto" : 0 }}
          style={{ pointerEvents: mobileMenuOpen ? "auto" : "none" }}
        >
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "text-slate-400 hover:bg-slate-800"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <Link to="/login" className="px-4 py-3 text-sm text-slate-300">Sign In</Link>
              <Link
                to="/register"
                className="px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm font-semibold text-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.nav>
    </>
  );
};

const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <Section id="home" className="relative flex items-center justify-center overflow-hidden pt-20 lg:pt-0">
      <motion.div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div style={{ y, opacity }} className="text-center lg:text-left">
            <motion.div
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Shield className="w-4 h-4" />
              Advanced OSINT Platform
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1 animate-pulse" />
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Uncover
              <span className="block bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Digital Truth
              </span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Empowering investigators, journalists, and security professionals with actionable intelligence from public data sources.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                to="/register"
                className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold text-lg overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-30 transition-opacity" />
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 rounded-xl border border-slate-700 text-white font-semibold text-lg hover:bg-slate-800/50 transition-all"
              >
                Learn More
              </Link>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {[
                { icon: Database, label: "10M+ Records" },
                { icon: Globe, label: "Global Coverage" },
                { icon: Lock, label: "Secure & Private" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-400">
                  <stat.icon className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm font-medium">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-emerald-500/20 to-teal-500/20 rounded-3xl blur-3xl" />
              <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm rounded-3xl border border-cyan-500/20 p-8 lg:p-12 shadow-2xl shadow-cyan-500/10">
                <OSINTIllustration />
                <div className="absolute -top-5 -right-5 px-4 py-2 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold backdrop-blur-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE SCANNING
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.button
          onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
          className="flex flex-col items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </Section>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: Search,
      title: "Deep Search",
      description: "Search across billions of public records, social media, and data breaches.",
      color: "cyan",
    },
    {
      icon: Fingerprint,
      title: "Identity Tracking",
      description: "Track individuals across platforms with advanced fingerprinting technology.",
      color: "emerald",
    },
    {
      icon: Network,
      title: "Network Analysis",
      description: "Map connections between entities, revealing hidden relationships.",
      color: "teal",
    },
    {
      icon: LockOpen,
      title: "Secure & Private",
      description: "Enterprise-grade security with end-to-end encryption for all queries.",
      color: "cyan",
    },
    {
      icon: Zap,
      title: "Real-time Results",
      description: "Get instant results with our optimized processing infrastructure.",
      color: "emerald",
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Access data from over 190 countries and 50+ languages.",
      color: "teal",
    },
  ];

  return (
    <Section id="features" className="relative py-20 lg:py-32">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-4">
            <Activity className="w-4 h-4" />
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-2 mb-6">
            Everything You Need for
            <span className="block bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Intelligence Gathering
            </span>
          </h2>
          <p className="text-slate-400 text-lg">
            Our platform combines cutting-edge technology with comprehensive data sources to deliver actionable insights.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="group relative bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
              
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Enter Query",
      description: "Input an email, phone number, domain, or name to start your investigation.",
      icon: Search,
    },
    {
      number: "02",
      title: "AI Analysis",
      description: "Our algorithms scan thousands of sources in seconds.",
      icon: Cpu,
    },
    {
      number: "03",
      title: "Get Results",
      description: "Receive comprehensive reports with actionable intelligence.",
      icon: Shield,
    },
  ];

  return (
    <Section id="how-it-works" className="relative py-20 lg:py-32">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-4">
            <Target className="w-4 h-4" />
            Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-2 mb-6">
            How It
            <span className="block bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative bg-gradient-to-br from-slate-900/60 to-slate-800/60 backdrop-blur-sm rounded-3xl border border-cyan-500/20 p-8 lg:p-12">
              <div className="aspect-square max-w-sm mx-auto">
<AbstractIllustration />
              </div>
            </div>
          </motion.div>

          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                className="relative flex gap-6"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center">
                    <step.icon className="w-7 h-7 text-cyan-400" />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px h-16 bg-gradient-to-b from-cyan-500/50 to-transparent" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <span className="text-cyan-400/60 text-sm font-mono">{step.number}</span>
                  <h3 className="text-2xl font-bold text-white mt-1 mb-2">{step.title}</h3>
                  <p className="text-slate-400">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

const ServicesSection = () => {
  const services = [
    {
      icon: Mail,
      title: "Email Lookup",
      description: "Uncover information linked to any email address.",
      stats: "2.5M+ queries",
    },
    {
      icon: Phone,
      title: "Phone Search",
      description: "Find carrier info, location hints, and associated accounts.",
      stats: "1.8M+ records",
    },
    {
      icon: User,
      title: "People Search",
      description: "Locate persons of interest with our comprehensive database.",
      stats: "5M+ profiles",
    },
    {
      icon: Building2,
      title: "Corporate Intel",
      description: "Research companies, subsidiaries, and key personnel.",
      stats: "12K+ companies",
    },
  ];

  return (
    <Section id="services" className="relative py-20 lg:py-32">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-4">
            <Radar className="w-4 h-4" />
            Services
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-2 mb-6">
            Comprehensive
            <span className="block bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              OSINT Solutions
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              className="group relative bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-8 hover:border-cyan-500/30 transition-all duration-500"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start justify-between">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-8 h-8 text-cyan-400" />
                </div>
                <span className="text-xs font-mono text-emerald-400/70 bg-emerald-500/10 px-3 py-1.5 rounded-full">
                  {service.stats}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mt-6 mb-3">{service.title}</h3>
              <p className="text-slate-400 mb-6">{service.description}</p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 text-cyan-400 font-medium text-sm group-hover:gap-3 transition-all"
              >
                Try Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const ContactSection = () => {
  return (
    <Section id="contact" className="relative py-20 lg:py-32">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-4">
              <Mail className="w-4 h-4" />
              Contact
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-2 mb-6">
              Ready to
              <span className="block bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Get Started?
              </span>
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              Join thousands of investigators and security professionals who trust our platform for their intelligence needs.
            </p>

            <div className="space-y-4">
              {[
                { icon: Mail, label: "support@osint.io", href: "mailto:support@osint.io" },
                { icon: Phone, label: "+1 (555) 123-4567", href: "tel:+15551234567" },
              ].map((contact, i) => (
                <motion.a
                  key={i}
                  href={contact.href}
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 hover:border-cyan-500/30 transition-colors group"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <contact.icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-slate-300 group-hover:text-white transition-colors">
                    {contact.label}
                  </span>
                </motion.a>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-8">
              <a
                href="#"
                className="w-11 h-11 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-11 h-11 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-11 h-11 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative bg-gradient-to-br from-slate-900/60 to-slate-800/60 backdrop-blur-sm rounded-3xl border border-cyan-500/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-5 h-5 text-cyan-400" />
                <span className="text-white font-semibold">Trusted by Professionals</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { value: "10K+", label: "Active Users" },
                  { value: "99.9%", label: "Uptime" },
                  { value: "50+", label: "Countries" },
                  { value: "24/7", label: "Support" },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-5 rounded-xl bg-slate-800/30 border border-slate-700/30">
                    <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
              <Link
                to="/register"
                className="group relative w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold text-lg overflow-hidden"
              >
                <span className="relative z-10">Create Free Account</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-center text-slate-500 text-xs mt-4">
                No credit card required. Start with 10 free searches.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

const Footer = () => {
  return (
    <footer className="relative z-10 bg-slate-950/80 backdrop-blur-xl border-t border-cyan-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors">
                <Search className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                {import.meta.env.VITE_APP_NAME}
              </span>
            </Link>
            <p className="text-sm leading-6 text-slate-400 max-w-md">
              Advanced OSINT platform empowering investigators, journalists, and security professionals with actionable intelligence from public data sources.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors">About</Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors">Contact</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/refund-policy" className="text-sm leading-6 text-slate-400 hover:text-cyan-400 transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs leading-5 text-slate-500">
            © {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME}. All rights reserved.
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

const Main = () => {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const navItemIds = ["home", "features", "how-it-works", "services"];
      const sections = navItemIds.map((id) => document.getElementById(id));
      const navbarOffset = 100;
      const scrollPosition = window.scrollY + navbarOffset;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && scrollPosition >= section.offsetTop) {
          setActiveSection(navItemIds[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative overflow-x-hidden">
      <InteractiveBackground />
      <Navbar activeSection={activeSection} onNavigate={() => {}} />
      <main className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ServicesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Main;