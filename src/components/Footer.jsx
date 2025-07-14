import React from "react";
import { Link } from "react-router-dom";
import smile from "../assets/smile.svg";

const Footer = () => {
  return (
    <footer className="bg-blur relative z-10" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        OsintWork
      </h2>
      <div className="mx-auto max-w-6xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Link
              to="/"
              className="flex text-2xl font-bold text-lime-300 items-center gap-2"
            >
              <img src={smile} alt="Logo" className="w-6 h-6" />
              OsintWork
            </Link>
            <p className="text-sm leading-6 text-gray-400">
              Osintwork that makes you smile
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 xl:col-span-2 xl:mt-0">
            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold leading-6 text-lime-300">
                Support
              </h3>
              <ul className="mt-6 space-y-4">
                <li>
                  <Link
                    to="/pricing"
                    className="text-sm leading-6 text-gray-400 hover:text-lime-300"
                  >
                    Pricing
                  </Link>
                </li>
                {/* <li>
                  <a
                    href="/"
                    className="text-sm leading-6 text-gray-400 hover:text-lime-400"
                  >
                    Documentation
                  </a>
                </li> */}
                <li>
                  <Link
                    to="/contact-us"
                    className="text-sm leading-6 text-gray-400 hover:text-lime-300"
                  >
                    Contact Us
                  </Link>
                </li>
                {/* <li>
                  <a
                    href="/"
                    className="text-sm leading-6 text-gray-400 hover:text-lime-300"
                  >
                    Status
                  </a>
                </li> */}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-semibold leading-6 text-lime-300">
                Company
              </h3>
              <ul className="mt-6 space-y-4">
                <li>
                  <Link
                    to="/about"
                    className="text-sm leading-6 text-gray-400 hover:text-lime-300"
                  >
                    About
                  </Link>
                </li>
                {/* <li>
                  <a
                    href="/"
                    className="text-sm leading-6 text-gray-400 hover:text-lime-300"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="text-sm leading-6 text-gray-400 hover:text-lime-300"
                  >
                    Partners
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="text-sm leading-6 text-gray-400 hover:text-lime-300"
                  >
                    Press
                  </a>
                </li> */}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold leading-6 text-lime-300">
                Policy
              </h3>
              <ul className="mt-6 space-y-4">
                {/* <li>
                  <Link
                    to="/return-policy"
                    className="text-sm leading-6 text-gray-400 hover:text-lime-300"
                  >
                    Return
                  </Link>
                </li> */}
                <li>
                  <Link
                    to="/terms-conditions"
                    className="text-sm leading-6 text-gray-400 hover:text-lime-300"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    to="/refund-policy"
                    className="text-sm leading-6 text-gray-400 hover:text-lime-300"
                  >
                    Refund
                  </Link>
                </li>
                {/* <li>
                  <Link
                    to="/shipping-policy"
                      className="text-sm leading-6 text-gray-400 hover:text-lime-300"
                  >
                    shipping
                  </Link>
                </li> */}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-400">
            © {new Date().getFullYear()} Osintwork, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
