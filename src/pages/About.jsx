import React from "react";
import Navbar from "../components/Navbar";
import { Shield } from "lucide-react";

const About = () => {
  return (
    <>
      <div className="lg:h-screen flex flex-col lg:flex-row justify-center items-center space-y-4 md:px-24 2xl:px-32 relative shadow-sm z-10">
        <Navbar />
        <div className="w-full md:max-w-[80%] lg:max-w-[60%] md:h-[75%] bg-gradient-to-br from-slate-900/80 via-slate-900/90 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 p-8 rounded-2xl shadow-2xl overflow-hidden">
          <div
            id="about"
            className="w-full h-full flex flex-col justify-center items-start tab-content"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-4">
              <Shield className="w-3 h-3" />
              About Us
            </span>
            <h1 className="text-2xl md:text-3xl px-2 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent font-bold mb-6">
              ABOUT US
            </h1>
            <div className="px-4 py-4 flex flex-col justify-center items-start h-full">
              <p className="text-md md:text-lg xl:text-xl text-slate-300 paragraph text-justify leading-relaxed">
                {import.meta.env.VITE_APP_NAME} is a dedicated open-source
                intelligence (OSINT) platform designed to assist law enforcement
                agencies, investigators, and journalists in conducting digital
                investigations efficiently. We collect and analyze publicly
                available data from various internet sources and collection APIs,
                providing professionals with the intelligence they need to uncover
                online footprints, identify potential threats, and verify critical
                information.
                <br />
                <br />
                Our goal is to bridge the gap between publicly accessible data and
                actionable insights, enabling professionals to conduct in-depth
                research, track digital trails, and enhance security measures. In
                an era where digital evidence plays a crucial role in
                investigations, {import.meta.env.VITE_APP_NAME} ensures that users
                have access to reliable, structured, and relevant data to support
                their work.
                <br />
                <br />
                With a strong commitment to ethical intelligence gathering,
                privacy protection, and data integrity,{" "}
                {import.meta.env.VITE_APP_NAME} continues to evolve, integrating
                advanced analytical capabilities to keep pace with the
                ever-changing digital landscape. Whether you're conducting an
                investigation, verifying online identities, or assessing security
                risks, {import.meta.env.VITE_APP_NAME} is your trusted partner in
                digital intelligence and investigative research.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
