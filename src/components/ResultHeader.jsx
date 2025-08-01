import { useState } from "react";
import instance from "../api/axios";
import InlineLoader from "../components/InlineLoader";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import FullScreenLoader from "./FullScreenLoader";

const ResultHeader = ({ userInput, type, results, modalOpen, searchInput }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const location = useLocation();
  const handleBack = () => navigate(-1);

  const handleSaveResults = async () => {
    setIsLoading(true);
    try {
      const response = await instance.post(
        "/api/generate-report",
        {
          userInput,
          type,
          results,
        },
        {
          responseType: "blob",
        }
      );
      const filename = response?.data?.filename;
      // console.log(filename);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `search-results-${userInput}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // console.error("Download failed:", error);
      toast.error("Error generating report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setIsAiLoading(true);
    try {
      const res = await instance.post(
        "/api/generate-ai-report",
        {
          userInput,
          type,
          results,
        },
        {
          responseType: "blob",
        }
      );
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${userInput}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // console.error("Download failed:", error);
      toast.error("Error generating AI report. Please try again.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <>
      {isAiLoading && <FullScreenLoader text="Generating AI Report..." />}
      <div
        className={`max-w-6xl w-full mx-auto mt-10 sm:mt-12 ${
          modalOpen ? "z-10" : "z-40"
        } transition-all duration-300 ease-in-out hide-on-pdf`}
      >
        <div className="rounded-xl mx-auto text-white p-3 md:p-4 bg-teal-700 bg-opacity-30 backdrop-blur-sm shadow-lg">
          <div className="flex flex-col lg:flex-row md:items-center md:justify-between gap-3 md:gap-4">
            <div className="w-full md:w-auto">
              <div className="flex justify-center items-center gap-3">
                <span className="text-white text-lg sm:text-xl font-medium truncate">
                  {userInput || searchInput}
                </span>
                <button
                  className="text-custom-lime relative"
                  onClick={() => {
                    if (userInput || searchInput) {
                      navigator.clipboard.writeText(userInput || searchInput);
                      setCopied(true);
                      setTimeout(() => {
                        setCopied(false);
                      }, 3000);
                    }
                  }}
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
                    className="lucide lucide-clipboard w-6 h-6 text-custom-lime"
                  >
                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  </svg>
                </button>
                {copied && (
                  <span
                    className={`text-xs text-black bg-custom-lime px-4 py-1.5 rounded-md transition-opacity duration-500 flex items-center ${
                      copied ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <svg
                      className="w-3 h-3 text-black me-1.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 16 12"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5.917 5.724 10.5 15 1.5"
                      />
                    </svg>
                    Copied!
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full md:w-auto">
              <div
                className="relative w-full sm:w-auto"
                data-headlessui-state=""
              >
                {location.pathname !== "/corporate-results" &&
                  location.pathname !== "/verification-results" && (
                    <button
                      className="flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm bg-white/10 backdrop-blur-lg w-full sm:w-auto"
                      id="headlessui-menu-button-:r2:"
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded="false"
                      data-headlessui-state=""
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      title="Copy to clipboard"
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
                        className="lucide lucide-file-down w-4 h-4 text-white"
                      >
                        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                        <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                        <path d="M12 18v-6"></path>
                        <path d="m9 15 3 3 3-3"></path>
                      </svg>
                      <span>Save Results</span>
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
                        className="lucide lucide-chevron-down w-3 h-3 text-white"
                      >
                        <path d="m6 9 6 6 6-6"></path>
                      </svg>
                    </button>
                  )}
                {/* Add dropdown menu */}

                {isDropdownOpen && (
                  <>
                    <div className="absolute left-0 mt-2 w-full rounded-md shadow-lg bg-[#1A1F30] ring-1 ring-black ring-opacity-5 focus:outline-none z-50 float-end">
                      <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                      >
                        <button
                          className="flex items-center gap-2 w-full px-4 py-2 text-xs md:text-sm text-white hover:bg-white/10 backdrop-blur-lg transition-colors"
                          onClick={handleGenerateReport}
                          role="menuitem"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          AI Report
                        </button>
                        <button
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-white hover:bg-white/10 backdrop-blur-lg transition-colors"
                          onClick={handleSaveResults}
                          role="menuitem"
                        >
                          {isLoading ? (
                            <InlineLoader />
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-2"
                            >
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                          )}
                          Save as pdf
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <button
                className="text-[#060714] flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-custom-lime transition-colors w-full sm:w-auto"
                onClick={handleBack}
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
                  className="lucide lucide-search w-4 h-4 text-[#060714]"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
                New Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultHeader;
