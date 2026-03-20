import React from "react";
import Footer from "../components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const RefundPolicy = () => {
  return (
    <>
      <div className="w-full min-h-screen flex justify-center items-center px-4 py-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="w-full md:max-w-[80%] lg:max-w-[60%] max-h-[90vh] overflow-y-auto bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-8 rounded-2xl shadow-2xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </Link>

          <div className="w-full h-full flex flex-col justify-start items-start space-y-4 animate-slide-up text-slate-300">
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Refund Policy
            </h1>

            <p>Thank you for choosing our services.</p>

            <p>
              Please read this Return and Refund Policy carefully. By accessing or
              using our services, you acknowledge that you have read, understood,
              and agreed to the terms outlined below.
            </p>

            <h2 className="text-xl font-semibold text-cyan-400 mt-6">
              No Returns or Refunds
            </h2>
            <p>
              Due to the nature of our services, which are provided exclusively to
              verified law enforcement departments for investigative and official use,
              we do not offer returns, cancellations, or refunds under any
              circumstances.
            </p>
            <p>
              Once access to the portal, software, or investigation tools has been
              granted, the service is considered delivered and non-reversible.
            </p>

            <h2 className="text-xl font-semibold text-cyan-400 mt-6">
              Non-Transferable
            </h2>
            <p>
              All accounts and services are assigned and licensed for specific
              authorized personnel and are non-transferable.
            </p>

            <h2 className="text-xl font-semibold text-cyan-400 mt-6">
              Need Help?
            </h2>
            <p>
              If you believe there has been an error in provisioning or have
              concerns regarding your access, please contact us immediately at:
            </p>
            <a
              href="mailto:info@osintwork.com"
              className="text-cyan-400 hover:text-emerald-400 transition-colors font-medium"
            >
              info@osintwork.com
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RefundPolicy;
