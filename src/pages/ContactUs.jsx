import React from "react";
import Navbar from "../components/Navbar";
import { Mail, Globe, Shield } from "lucide-react";

const ContactUs = () => {
  return (
    <>
      <div className="lg:h-screen flex flex-col lg:flex-row justify-center items-center space-y-4 md:px-24 2xl:px-32 relative shadow-sm z-10">
        <Navbar />
        <div className="w-full md:max-w-[80%] lg:max-w-[60%] md:h-[75%] bg-gradient-to-br from-slate-900/80 via-slate-900/90 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 p-8 rounded-2xl shadow-2xl overflow-hidden">
          <div
            id="contact"
            className="w-full h-full flex flex-col justify-center items-start tab-content"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-4">
              <Shield className="w-3 h-3" />
              Get In Touch
            </span>
            <h1 className="text-2xl md:text-3xl px-2 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent font-bold mb-6">
              CONTACT US
            </h1>
            <div className="px-4 py-8 flex flex-col justify-center items-start h-full">
              <p className="text-lg md:text-2xl text-slate-300 mb-6">
                For more information about our solutions or services, please
                contact us at:
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-slate-800/30 p-4 rounded-xl border border-slate-700/30">
                  <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Email</p>
                    <p className="text-lg bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent font-medium">
                      Info@intelltrace.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-slate-800/30 p-4 rounded-xl border border-slate-700/30">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Website</p>
                    <p className="text-lg bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent font-medium">
                      Intelltrace.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
