import React from "react";
import Navbar from "../components/Navbar";

const ContactUs = () => {
  return (
    <>
      <div className="lg:h-screen flex flex-col lg:flex-row justify-center items-center space-y-4 md:px-24 2xl:px-32 relative z-10">
        <Navbar />
        <div className="w-full md:max-w-[80%] lg:max-w-[60%] md:h-[75%] bg-gray-700 bg-opacity-30 backdrop-blur-lg p-8 rounded-md md:rounded-r-md overflow-hidden shadow-2xl">
          {/* <!-- Tab Contents --> */}

          <div
            id="contact"
            className="w-full min-h-[400px] md:h-full  flex flex-col justify-center items-start tab-content divide-y"
          >
            <h1 className="text-2xl md:text-3xl px-2 py-2 text-[#9acc14]">
              CONTACT US
            </h1>
            <div className="text-lg md:text-2xl xl:text-3xl text-white px-2 py-4 flex flex-col justify-center items-center self-center h-full relative">
              <p>
                For more information about our solutions or services, please
                contact us at:
              </p>
              <div className="mt-4 text-xl md:text-2xl flex flex-col justify-center items-start">
                <p>
                  <span className="text-3xl">📧</span> :{" "}
                  <span className="text-[#9acc14]">Info@osintwork.com</span>
                  <br />
                  <span className="text-3xl">🌐</span> :{" "}
                  <span className="text-[#9acc14]">osintwork.com</span>
                </p>
              </div>
              {/* <div className="md:absolute right-0 bottom-0 md:mt-16 flex gap-2 flex-row">
                <a
                  href="https://www.linkedin.com/company/redoasiss/"
                  className="text-[#9acc14]"
                >
                  <img className="w-12 h-12" src={x} alt="x.com" />
                </a>
                <a href="https://x.com/redoasiss" className="text-[#9acc14]">
                  <img className="w-12 h-12" src={linkedin} alt="linkedin" />
                </a>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
