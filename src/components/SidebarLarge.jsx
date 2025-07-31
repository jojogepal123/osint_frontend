import useAuthContext from "../context/AuthContext";
import logoMin from "../assets/web-logo.png";
import webName from "../assets/web-name-logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "./Loader";

const SidebarLarge = () => {
  const location = useLocation();
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const navigate = useNavigate();
  const {
    user,
    logout,
    setInputType,
    setSidebarVisible,
    inputType,
    sidebarVisible,
  } = useAuthContext();

  const closeMenu = () => {
    setSidebarVisible(false);
  };

  const handleSubscription = () => {
    navigate("/subscription");
  };
  const handleLeakDataFinder = () => {
    navigate("/leak-data-finder");
  };

  const handleCorporateDataFinder = () => {
    navigate("/corporate");
  };
  const handleVerificationId = () => {
    navigate("/verification-id");
  };
  useEffect(() => {
    setSidebarVisible(false);
  }, [location.pathname]);

  const Logout = async () => {
    setIsLogoutLoading(true);
    try {
      await logout();
      navigate("/");
    } finally {
      setIsLogoutLoading(false);
    }
  };

  const isLeakDataFinderActive = location.pathname === "/leak-data-finder";
  const isCorporateDataFinderActive = location.pathname === "/corporate";
  const isVerificationIdActive = location.pathname === "/verification-id";
  const dashboardActive = location.pathname === "/dashboard";
  return (
    <>
      {isLogoutLoading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <Loader />
        </div>
      )}
      <aside
        className={`
        fixed z-[50] mt-4 mb-4 h-[calc(100%-2rem)] 
        bg-gray-900 bg-opacity-50 backdrop-blur-md rounded-xl shadow-lg 
        transition-all duration-700 ease-in-out 
        flex flex-col w-16 hover:w-64 lg:left-4 left-4
        group
        ${!sidebarVisible ? "hidden md:flex" : "flex"}
      `}
      >
        <div className="flex-1">
          <div className="flex items-center justify-center h-16 overflow-hidden relative">
            <div className="transition-all duration-700 ease-in-out flex items-center justify-center w-16 group-hover:w-full">
              <div className="relative flex items-center justify-center w-full h-8 mt-2">
                {/* <img
                  src={logoMin}
                  alt="Logo"
                  className="absolute h-16 w-16 object-contain transition-all duration-700 ease-in-out opacity-100 group-hover:opacity-0"
                /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-10 text-lime-300 group-hover:opacity-0 transition-all duration-300 ease-in-out opacity-100 cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m20.893 13.393-1.135-1.135a2.252 2.252 0 0 1-.421-.585l-1.08-2.16a.414.414 0 0 0-.663-.107.827.827 0 0 1-.812.21l-1.273-.363a.89.89 0 0 0-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 0 1-1.81 1.025 1.055 1.055 0 0 1-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 0 1-1.383-2.46l.007-.042a2.25 2.25 0 0 1 .29-.787l.09-.15a2.25 2.25 0 0 1 2.37-1.048l1.178.236a1.125 1.125 0 0 0 1.302-.795l.208-.73a1.125 1.125 0 0 0-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 0 1-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 0 1-1.458-1.137l1.411-2.353a2.25 2.25 0 0 0 .286-.76m11.928 9.869A9 9 0 0 0 8.965 3.525m11.928 9.868A9 9 0 1 1 8.965 3.525"
                  />
                </svg>
                <span className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-lime-200 to-teal-800 font-bold absolute w-auto object-contain transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 cursor-pointer">
                  {import.meta.env.VITE_APP_NAME}
                </span>
              </div>
            </div>
          </div>
          <div className="px-3 py-1 pb-2">
            <hr className="border-white/5" />
          </div>
          <nav className="px-1.5">
            <ul className="space-y-4">
              <div>
                <li>
                  <button
                    onClick={() => {
                      setInputType("email");
                      closeMenu();
                      if (!dashboardActive) {
                        navigate("/dashboard");
                      }
                    }}
                    className={`flex items-center rounded-lg
                    transition-all duration-100 ease-in-out
                    ${
                      inputType === "email" && dashboardActive
                        ? "bg-gradient-to-r from-lime-200 to-teal-800 text-gray-900"
                        : "hover:bg-gray-800 text-white hover:text-lime-200"
                    }
                    group relative
                    px-2.5 py-2.5 group-hover:justify-start justify-center
                    w-full`}
                  >
                    <span
                      className={`min-w-[24px] flex items-center justify-center
                                            transition-transform duration-100
                                            group-hover:scale-110`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-mail"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                      </svg>
                    </span>
                    <span
                      className={`group-hover:ml-3 whitespace-nowrap transition-all duration-700 ease-in-out text-base opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden`}
                    >
                      Email Search
                    </span>
                  </button>
                </li>
              </div>
              <div>
                <li>
                  <button
                    onClick={() => {
                      setInputType("tel");
                      closeMenu();
                      if (!dashboardActive) {
                        navigate("/dashboard");
                      }
                    }}
                    className={`flex items-center rounded-lg
                    transition-all duration-100 ease-in-out
                    ${
                      inputType === "tel" && dashboardActive
                        ? "bg-gradient-to-r from-lime-200 to-teal-800 text-gray-900"
                        : "hover:bg-gray-800 text-white hover:text-lime-200"
                    }
                    group relative
                    px-2.5 py-2.5 group-hover:justify-start justify-center
                    w-full`}
                  >
                    <span
                      className={`min-w-[24px] flex items-center justify-center transition-transform duration-100 group-hover:scale-110`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-phone"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </span>
                    <span
                      className={`group-hover:ml-3 whitespace-nowrap transition-all duration-700 ease-in-out text-base opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden`}
                    >
                      Phone Search
                    </span>
                  </button>
                </li>
              </div>
              <div>
                <li>
                  <button
                    onClick={handleLeakDataFinder}
                    className={`flex items-center rounded-lg
                    transition-all duration-100 ease-in-out
                    ${
                      isLeakDataFinderActive
                        ? "bg-gradient-to-r from-lime-200 to-teal-800 text-gray-900"
                        : "hover:bg-gray-800 text-white hover:text-lime-200"
                    }
                    group relative
                    px-2.5 py-2.5 group-hover:justify-start justify-center
                    w-full`}
                  >
                    <span
                      className={`min-w-[24px] flex items-center justify-center transition-transform duration-100 group-hover:scale-110`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-at-sign"
                      >
                        <circle cx="12" cy="12" r="4"></circle>
                        <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"></path>
                      </svg>
                    </span>
                    <span
                      className={`group-hover:ml-3 whitespace-nowrap transition-all duration-700 ease-in-out text-base opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden`}
                    >
                      Leak Data Finder
                    </span>
                  </button>
                </li>
              </div>
              <div>
                <li>
                  <button
                    onClick={handleCorporateDataFinder}
                    className={`flex items-center rounded-lg
                    transition-all duration-100 ease-in-out
                    ${
                      isCorporateDataFinderActive
                        ? "bg-gradient-to-r from-lime-200 to-teal-800 text-gray-900"
                        : "hover:bg-gray-800 text-white hover:text-lime-200"
                    }
                    group relative
                    px-2.5 py-2.5 group-hover:justify-start justify-center
                    w-full`}
                  >
                    <span
                      className={`min-w-[24px] flex items-center justify-center transition-transform duration-100 group-hover:scale-110`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                        />
                      </svg>
                    </span>
                    <span
                      className={`group-hover:ml-3 whitespace-nowrap transition-all duration-700 ease-in-out text-base opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden`}
                    >
                      Corporate Intelligence
                    </span>
                  </button>
                </li>
              </div>
              <div>
                <li>
                  <button
                    onClick={handleVerificationId}
                    className={`flex items-center rounded-lg
                    transition-all duration-100 ease-in-out
                    ${
                      isVerificationIdActive
                        ? "bg-gradient-to-r from-lime-200 to-teal-800 text-gray-900"
                        : "hover:bg-gray-800 text-white hover:text-lime-200"
                    }
                    group relative
                    px-2.5 py-2.5 group-hover:justify-start justify-center
                    w-full`}
                  >
                    <span
                      className={`min-w-[24px] flex items-center justify-center transition-transform duration-100 group-hover:scale-110`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                        />
                      </svg>
                    </span>
                    <span
                      className={`group-hover:ml-3 whitespace-nowrap transition-all duration-700 ease-in-out text-base opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden`}
                    >
                      Verified ID
                    </span>
                  </button>
                </li>
              </div>
              {/* <div>
                <li>
                  <button
                    onClick={handleSubscription}
                    className={`flex items-center rounded-lg
                                            transition-all duration-100 ease-in-out
                                           hover:bg-gray-800 text-white hover:text-lime-200 
                                            group relative w-full
                                            px-2.5 py-2.5 group-hover:justify-start justify-center
                                        `}
                  >
                    <span
                      className={`min-w-[24px] flex items-center justify-center
                                            transition-transform duration-100
                                            group-hover:scale-110`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-rocket"
                      >
                        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                      </svg>
                    </span>
                    <span
                      className={`group-hover:ml-3 whitespace-nowrap transition-all duration-700 ease-in-out text-base opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden`}
                    >
                      Subscription
                    </span>
                  </button>
                </li>
              </div> */}
              <div>
                {user && (
                  <li>
                    <button
                      onClick={Logout}
                      className={`flex items-center rounded-lg
                                            transition-all duration-100 ease-in-out
                                           hover:bg-gray-800 text-white hover:text-lime-200 
                                            group relative w-full
                                            px-2.5 py-2.5 group-hover:justify-start justify-center
                                        `}
                    >
                      <span
                        className={`min-w-[24px] flex items-center justify-center
                                            transition-transform duration-100
                                            group-hover:scale-110`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                          />
                        </svg>
                      </span>
                      <span
                        className={`group-hover:ml-3 whitespace-nowrap transition-all duration-700 ease-in-out text-base opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden`}
                      >
                        Logout
                      </span>
                    </button>
                  </li>
                )}
                <div className="px-1.5 py-1">
                  <hr className="border-white/5" />
                </div>
              </div>
              <div>
                <li>
                  <Link
                    to={"/dashboard"}
                    className={`flex items-center rounded-lg
                                            transition-all duration-100 ease-in-out
                                            hover:bg-gray-800 text-white hover:text-lime-200 
                                            group relative
                                            px-2.5 py-2.5 group-hover:justify-start justify-center
                                        `}
                  >
                    <span
                      className={`min-w-[24px] flex items-center justify-center
                                            transition-transform duration-100
                                            group-hover:scale-110`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-circle-help"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <path d="M12 17h.01"></path>
                      </svg>
                    </span>
                    <span
                      className={`group-hover:ml-3 whitespace-nowrap transition-all duration-700 ease-in-out text-base opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden`}
                    >
                      Help
                    </span>
                  </Link>
                </li>
              </div>
            </ul>
          </nav>
        </div>

        {/* Footer */}
        <div className="mt-auto px-4 pb-4 overflow-hidden transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100">
          <div className="text-center transform transition-all duration-300 ease-out">
            <p className="text-xs text-gray-400 mb-1">
              {import.meta.env.VITE_APP_NAME}
            </p>
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarLarge;
