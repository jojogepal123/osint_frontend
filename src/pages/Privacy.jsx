import React from "react";
import Navbar from "../components/Navbar";
import { Shield, Mail, Globe } from "lucide-react";

const Privacy = () => {
  return (
    <div className="lg:h-screen flex flex-col lg:flex-row justify-center items-center space-y-4 md:px-24 2xl:px-32 relative shadow-sm z-10">
      <Navbar />
      <div className="w-full md:max-w-[80%] lg:max-w-[60%] md:h-[75%] bg-gradient-to-br from-slate-900/80 via-slate-900/90 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 p-8 rounded-2xl shadow-2xl overflow-hidden">
        <div
          id="home"
          className="w-full h-full flex flex-col justify-start items-start tab-content animate-slide-up overflow-y-auto custom-scrollbar"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-4">
            <Shield className="w-3 h-3" />
            Legal
          </span>
          <h1 className="text-2xl md:text-3xl px-2 py-2 text-white font-bold mb-4">
            Privacy Policy –
            <span className="text-2xl md:text-3xl bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent font-bold">
              &nbsp;{import.meta.env.VITE_APP_NAME}
            </span>
          </h1>
          <div className="px-4 py-4 text-justify leading-relaxed space-y-4 custom-scrollbar overflow-y-auto max-h-full">
            <p className="text-slate-300 text-sm md:text-base">
              At {import.meta.env.VITE_APP_NAME}, we value your privacy and are
              committed to protecting any information collected through our
              platform. This Privacy Policy explains how we collect, use, and
              safeguard data when you use our services.
            </p>

            <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/30">
              <h3 className="text-cyan-400 font-semibold mb-2">1. Information We Collect</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-sm">
                <li>Publicly Available Data: We gather data from open sources and collection APIs for investigative purposes.</li>
                <li>User-Provided Information: When you interact with our platform, such as contacting us, we may collect basic details like email or name.</li>
                <li>Usage Data: We collect non-personal information such as IP addresses, browser type, and device details.</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/30">
              <h3 className="text-cyan-400 font-semibold mb-2">2. How We Use Your Information</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-sm">
                <li>Provide OSINT-based investigative services to law enforcement, investigators, and journalists.</li>
                <li>Enhance our platform's functionality and security.</li>
                <li>Improve user experience by analyzing trends and usage patterns.</li>
                <li>Ensure compliance with legal and ethical standards.</li>
              </ul>
            </div>

            <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/30">
              <h3 className="text-cyan-400 font-semibold mb-2">3. Data Protection & Security</h3>
              <p className="text-slate-300 text-sm">
                We implement industry-standard security measures to protect data from unauthorized access, misuse, or disclosure. While we strive to safeguard information, we cannot guarantee complete security.
              </p>
            </div>

            <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/30">
              <h3 className="text-cyan-400 font-semibold mb-2">4. Data Sharing</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-sm">
                <li>We do not sell or trade personal information.</li>
                <li>Certain publicly available data may be analyzed using third-party services.</li>
                <li>We comply with legal requests if required by law enforcement.</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 p-4 rounded-xl border border-cyan-500/30">
              <h3 className="text-cyan-400 font-semibold mb-2">Contact Us</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    info@intelltrace.com
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    Intelltrace.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
