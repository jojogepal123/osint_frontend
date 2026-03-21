import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Shield, Search, Zap, Globe } from "lucide-react";

const Main = () => {
  return (
    <>
      <div className="lg:h-screen flex flex-col lg:flex-row justify-center items-center space-y-4 md:px-24 2xl:px-32 relative shadow-sm z-10">
        <Navbar />
        <div className="w-full md:max-w-[80%] lg:max-w-[60%] md:h-[75%] bg-gradient-to-br from-slate-900/80 via-slate-900/90 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 p-4 sm:p-5 md:p-6 lg:p-8 rounded-2xl shadow-2xl overflow-hidden">
          <div
            id="home"
            className="w-full h-full flex flex-col justify-center items-start tab-content animate-slide-up"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-3">
              <Shield className="w-3 h-3" />
              OSINT Platform
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-2 sm:mb-3 px-1 sm:px-2">
              WELCOME TO
              <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                &nbsp;{import.meta.env.VITE_APP_NAME}
              </span>
            </h2>
            <div className="px-1 sm:px-4 py-4 sm:py-6 md:py-8 flex flex-col justify-center items-start h-full">
              <p className="text-base sm:text-lg md:text-2xl lg:text-3xl font-medium text-white">
                Empowering Decision-Makers with Actionable Intelligence
              </p>
              <br />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="flex items-center gap-1.5 sm:gap-2 text-slate-300 bg-slate-800/30 p-1.5 sm:p-2 rounded-lg border border-slate-700/30">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <Search className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
                  </div>
                  <span className="text-[10px] sm:text-xs truncate">Advanced Data</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-slate-300 bg-slate-800/30 p-1.5 sm:p-2 rounded-lg border border-slate-700/30">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
                  </div>
                  <span className="text-[10px] sm:text-xs truncate">Real-time Intel</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-slate-300 bg-slate-800/30 p-1.5 sm:p-2 rounded-lg border border-slate-700/30">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
                    <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-teal-400" />
                  </div>
                  <span className="text-[10px] sm:text-xs truncate">Global Coverage</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-slate-300 bg-slate-800/30 p-1.5 sm:p-2 rounded-lg border border-slate-700/30">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
                  </div>
                  <span className="text-[10px] sm:text-xs truncate">Secure</span>
                </div>
              </div>
              <p className="text-sm sm:text-base md:text-lg text-slate-300 paragraph text-justify">
                In the digital age, open-source intelligence (OSINT) is an
                essential resource for law enforcement, investigators, and
                journalists to uncover hidden information, track online
                activity, and analyze digital footprints.
                <span className="text-cyan-400 font-semibold">
                  &nbsp;{import.meta.env.VITE_APP_NAME}&nbsp;
                </span>
                specializes in collecting and analyzing data from publicly
                available sources and collection APIs, delivering actionable
                intelligence to support investigations, research, and security
                assessments. Whether identifying leaked personal data, tracking
                persons of interest, or mapping online connections,
                <span className="text-cyan-400 font-semibold">
                  &nbsp;{import.meta.env.VITE_APP_NAME}&nbsp;
                </span>
                provides the insights needed to navigate complex digital
                landscapes. As cyber threats, misinformation, and data
                vulnerabilities continue to evolve, having access to accurate
                and timely intelligence is critical for making informed
                decisions and strengthening investigative capabilities.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Main;
