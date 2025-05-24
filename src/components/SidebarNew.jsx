import React from "react";
import useAuthContext from "../context/AuthContext";
import logoMin from "../assets/web-logo.png";
import webName from "../assets/web-name-logo.png";
import { useLocation, useNavigate } from "react-router-dom";
const Sidebar = () => {
  const location = useLocation();
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
    window.location.href = "/subscription";
  };

  return (
    <>
      {sidebarVisible && (
        <button
          onClick={closeMenu}
          className={`md:hidden fixed top-5 z-[60] lg:hidden p-1 rounded-lg 
                    bg-[#212121]/90 backdrop-blur-sm hover:bg-[#8200FF]/40
                    text-white transition-all duration-300
                    left-6 translate-x-64`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      )}
      <aside
        className={`
          fixed z-50 mt-4 mb-4 h-[calc(100%-2rem)] 
          bg-gray-900 bg-opacity-30 backdrop-blur-md rounded-xl shadow-lg 
          transition-all  
          flex flex-col w-64  lg:left-4 left-4
          group cursor-pointer
          ${!sidebarVisible ? "hidden md:flex" : "flex"}
        `}
      >
        <div className="flex-1">
          <div className="flex items-center justify-center h-16 overflow-hidden relative">
            <div
              className="
          transition-all  flex items-center justify-center
          w-48
      "
            >
              <div className="relative flex items-center justify-center w-full h-8 mt-2">
                <img
                  src={webName}
                  alt="Logo"
                  className="
                      absolute h-24 w-auto object-contain
                      transition-all 
                      transform 
                      opacity-100 scale-100 translate-x-0
                  "
                />
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
                      if (window.location.pathname !== "/dashboard") {
                        window.location.href = "/dashboard";
                      }
                    }}
                    className={`
                          flex items-center rounded-lg
                          transition-all duration-100 ease-in-out
                         ${
                           inputType === "email"
                             ? "bg-gradient-to-r hover:bg-gradient-to-l from-lime-200 to-teal-800 text-teal-900"
                             : "hover:bg-gray-800 text-white hover:text-lime-200"
                         }
                          group relative
                          px-3 py-2.5 w-full
                      `}
                  >
                    <span
                      className="
                          min-w-[24px] flex items-center justify-center
                          transition-transform duration-100
                          
                      "
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
                      className="
                              whitespace-nowrap transition-all  text-sm
                              opacity-100 ml-2.5 translate-x-0
                          "
                    >
                      Email Analyzer
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
                      if (window.location.pathname !== "/dashboard") {
                        window.location.href = "/dashboard";
                      }
                    }}
                    className={`
                          flex items-center rounded-lg
                          transition-all duration-100 ease-in-out
                          ${
                            inputType === "tel"
                              ? "bg-gradient-to-r hover:bg-gradient-to-l from-lime-200 to-teal-800 text-teal-900"
                              : "hover:bg-gray-800 text-white hover:text-lime-200"
                          }
                          group relative
                          px-3 py-2.5 w-full
                      `}
                  >
                    <span
                      className="
                          min-w-[24px] flex items-center justify-center
                          transition-transform duration-100
                          
                      "
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
                      className="
                              whitespace-nowrap transition-all  text-sm
                              opacity-100 ml-2.5 translate-x-0
                          "
                    >
                      Phone Analyzer
                    </span>
                  </button>
                </li>
              </div>
              <div>
                <li>
                  <button
                    onClick={handleSubscription}
                    className={`
                          flex items-center rounded-lg
                          transition-all duration-100 ease-in-out
                         hover:bg-gray-800 text-white hover:text-lime-200 
                          group relative
                          px-3 py-2.5 w-full  
                      `}
                  >
                    <span
                      className="
                          min-w-[24px] flex items-center justify-center
                          transition-transform duration-100
                          
                      "
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
                      className="
                              whitespace-nowrap transition-all  text-sm
                              opacity-100 ml-2.5 translate-x-0
                          "
                    >
                      Subscription
                    </span>
                  </button>
                </li>
              </div>
              <div>
                {user && (
                  <li>
                    <button
                      onClick={logout}
                      className={`
                          flex items-center rounded-lg
                          transition-all duration-100 ease-in-out
                          hover:bg-gray-800 text-white hover:text-lime-200 
                          group relative
                          px-3 py-2.5 w-full
                      `}
                    >
                      <span
                        className="
                          min-w-[24px] flex items-center justify-center
                          transition-transform duration-100
                          
                      "
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
                        className="
                              whitespace-nowrap transition-all  text-sm
                              opacity-100 ml-2.5 translate-x-0
                          "
                      >
                        Logout
                      </span>
                    </button>
                  </li>
                )}
                <div className="px-1.5 py-1">
                  <hr className="border-white/5"></hr>
                </div>
              </div>
              <div>
                <li>
                  <a
                    href="/help"
                    className="
                          flex items-center rounded-lg
                          transition-all duration-100 ease-in-out
                          hover:bg-gray-800 text-white hover:text-lime-200 
                          group relative
                          px-3 py-2.5
                      "
                  >
                    <span
                      className="
                          min-w-[24px] flex items-center justify-center
                          transition-transform duration-100
                          
                      "
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
                      className="
                              whitespace-nowrap transition-all  text-sm
                              opacity-100 ml-2.5 translate-x-0
                          "
                    >
                      Help
                    </span>
                  </a>
                </li>
              </div>
            </ul>
          </nav>
        </div>
        <div className="mt-auto px-4 pb-4 overflow-hidden transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100">
          <div className="text-center transform transition-all duration-300 ease-out">
            <p className="text-xs text-gray-600 mb-1">OSINTWORK</p>
            <p className="text-xs text-gray-600">© 2025 All rights reserved</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
