import React from "react";
import Footer from "../components/Footer";

const RefundPolicy = () => {
  return (
    <>
      <div className="w-full min-h-screen flex justify-center items-center px-4 py-10 bg-gray-100">
        <div className="w-full md:max-w-[80%] lg:max-w-[60%] max-h-[90vh] overflow-y-auto bg-gray-700 bg-opacity-30 backdrop-blur-sm p-8 rounded-md shadow-2xl">
          <div className="w-full h-full flex flex-col justify-start items-start space-y-4 animate-slide-up text-white">
            <h1 className="text-3xl font-bold mb-2 text-[#9acc14]">
              Refund Policy
            </h1>

            <p>Thank you for choosing our services.</p>

            <p>
              Please read this Return and Refund Policy carefully. By accessing
              or using our services, you acknowledge that you have read,
              understood, and agreed to the terms outlined below.
            </p>

            <h2 className="text-xl font-semibold text-[#9acc14] mt-4">
              No Returns or Refunds
            </h2>
            <p>
              Due to the nature of our services, which are provided exclusively
              to verified law enforcement departments for investigative and
              official use, we do not offer returns, cancellations, or refunds
              under any circumstances.
            </p>
            <p>
              Once access to the portal, software, or investigation tools has
              been granted, the service is considered delivered and
              non-reversible.
            </p>

            <h2 className="text-xl font-semibold text-[#9acc14] mt-4">
              Non-Transferable
            </h2>
            <p>
              All accounts and services are assigned and licensed for specific
              authorized personnel and are non-transferable.
            </p>

            <h2 className="text-xl font-semibold text-[#9acc14] mt-4">
              Need Help?
            </h2>
            <p>
              If you believe there has been an error in provisioning or have
              concerns regarding your access, please contact us immediately at:
            </p>
            <p className="text-lime-300 font-semibold">📧 info@osintwork.com</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RefundPolicy;
