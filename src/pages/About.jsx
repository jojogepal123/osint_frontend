import React from "react";
import Navbar from "../components/Navbar";

const About = () => {
  return (
    <>
      <div className="lg:h-screen flex flex-col lg:flex-row justify-center items-center space-y-4 md:px-24 2xl:px-32 relative z-10">
        <Navbar />
        <div className="w-full md:max-w-[80%] lg:max-w-[60%] md:h-[75%] bg-gray-700 bg-opacity-30 backdrop-blur-lg p-8 rounded-md md:rounded-r-md overflow-hidden shadow-2xl">
          {/* <!-- Tab Contents --> */}

          <div
            id="about"
            className="w-full h-full flex flex-col justify-center items-start tab-content divide-y"
          >
            <h1 className="text-2xl md:text-3xl px-2 py-2 text-[#9acc14]">
              ABOUT US
            </h1>
            <p className="text-md md:text-lg xl:text-xl text-white 2xl:text-xl px-2 py-2 paragraph text-justify">
              Osintwork is a dedicated open-source intelligence (OSINT) platform
              designed to assist law enforcement agencies, investigators, and
              journalists in conducting digital investigations efficiently. We
              collect and analyze publicly available data from various internet
              sources and collection APIs, providing professionals with the
              intelligence they need to uncover online footprints, identify
              potential threats, and verify critical information.
              <br />
              <br />
              Our goal is to bridge the gap between publicly accessible data and
              actionable insights, enabling professionals to conduct in-depth
              research, track digital trails, and enhance security measures. In
              an era where digital evidence plays a crucial role in
              investigations, Osintwork ensures that users have access to
              reliable, structured, and relevant data to support their work.
              <br />
              <br />
              With a strong commitment to ethical intelligence gathering,
              privacy protection, and data integrity, Osintwork continues to
              evolve, integrating advanced analytical capabilities to keep pace
              with the ever-changing digital landscape. Whether you’re
              conducting an investigation, verifying online identities, or
              assessing security risks, Osintwork is your trusted partner in
              digital intelligence and investigative research.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
