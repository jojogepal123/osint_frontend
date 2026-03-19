import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Shield, Search, Zap, Globe } from "lucide-react";

const Main = () => {
  return (
    <>
      <div className="lg:h-screen flex flex-col lg:flex-row justify-center items-center space-y-4 md:px-24 2xl:px-32 relative shadow-sm z-10">
        <Navbar />
        <div className="w-full md:max-w-[80%] lg:max-w-[60%] md:h-[75%] bg-gradient-to-br from-slate-900/80 via-slate-900/90 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 p-8 rounded-2xl shadow-2xl overflow-hidden">
          <div
            id="home"
            className="w-full h-full flex flex-col justify-center items-start tab-content animate-slide-up"
          >
            <h2 className="text-2xl text-white md:text-3xl mb-3 px-2">
              WELCOME TO
              <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                &nbsp;{import.meta.env.VITE_APP_NAME}
              </span>
            </h2>
            <div className="px-4 py-8 flex flex-col justify-center items-start h-full">
              <p className="text-lg md:text-2xl xl:text-3xl font-medium text-white">
                Empowering Decision-Makers with Actionable Intelligence
              </p>
              <br />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 text-slate-300 bg-slate-800/30 p-3 rounded-xl border border-slate-700/30">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Search className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-sm">Advanced Data Analytics</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300 bg-slate-800/30 p-3 rounded-xl border border-slate-700/30">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-sm">Real-time Intelligence</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300 bg-slate-800/30 p-3 rounded-xl border border-slate-700/30">
                  <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-teal-400" />
                  </div>
                  <span className="text-sm">Global Coverage</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300 bg-slate-800/30 p-3 rounded-xl border border-slate-700/30">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-sm">Secure & Reliable</span>
                </div>
              </div>
              <p className="text-md md:text-lg xl:text-xl text-slate-300 paragraph text-justify">
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
