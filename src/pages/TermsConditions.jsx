import React from "react";
import Footer from "../components/Footer";
const TermsConditions = () => {
  return (
    <>
      <div className="w-full min-h-screen flex justify-center items-center px-4 py-10 bg-gray-100">
        <div className="w-full md:max-w-[80%] lg:max-w-[60%] h-[90vh] bg-gray-700 bg-opacity-30 backdrop-blur-sm rounded-md shadow-2xl flex flex-col">
          <div className="w-full h-full flex flex-col justify-start items-start tab-content divide-y animate-slide-up">
            <h1 className="text-3xl px-3 py-6  font-bold  text-[#9acc14]">
              Terms and Conditions
            </h1>

            {/* Scrollable Content */}
            <div className="flex-1 custom-scrollbar overflow-y-auto p-6 space-y-4 text-white">
              <p>
                This document is an electronic record in terms of Information
                Technology Act, 2000 and rules thereunder as applicable and the
                amended provisions...
              </p>
              <p>
                This document is published in accordance with the provisions of
                Rule 3 (1) of the Information Technology (Intermediaries
                guidelines) Rules, 2011...
              </p>
              <p>
                Your use of the Platform and services and tools are governed by
                the following terms and conditions...
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  To access and use the Services, you agree to provide true,
                  accurate and complete information...
                </li>
                <li>
                  Neither we nor any third parties provide any warranty or
                  guarantee as to the accuracy, timeliness...
                </li>
                <li>
                  Your use of our Services and the Platform is solely and
                  entirely at your own risk...
                </li>
                <li>
                  The contents of the Platform and the Services are proprietary
                  to us...
                </li>
                <li>
                  You acknowledge that unauthorized use may lead to action...
                </li>
                <li>
                  You agree to pay us the charges associated with availing the
                  Services...
                </li>
                <li>
                  You agree not to use the Platform and/or Services for any
                  unlawful purposes...
                </li>
                <li>
                  You acknowledge links to third party websites may be provided
                  and you are subject to their policies...
                </li>
                <li>
                  You understand that initiating a transaction binds you
                  contractually with the Platform Owner...
                </li>
                <li>
                  You shall indemnify and hold harmless the Platform Owner from
                  any third party claims...
                </li>
                <li>
                  Neither party shall be liable for delays due to force
                  majeure...
                </li>
                <li>These Terms shall be governed by Indian law...</li>
                <li>
                  All disputes are subject to courts in Gandhinagar, Gujarat...
                </li>
                <li>
                  All concerns must be communicated via the contact info on this
                  site...
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsConditions;
