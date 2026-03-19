import { useState } from "react";
import instance from "../api/axios";
import InlineLoader from "../components/InlineLoader";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import FullScreenLoader from "./FullScreenLoader";
import useAuthContext from "../context/AuthContext";
import { ClipboardCopy, Sparkles, FileDown, ArrowLeft } from "lucide-react";

const ResultHeader = ({ userInput, type, results, modalOpen, searchInput }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const { user } = useAuthContext();
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
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${userInput}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
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
      a.download = `ai-generated-report-${userInput}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
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
        <div className="rounded-xl mx-auto text-white p-4 md:p-5 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
          <div className="flex flex-col lg:flex-row md:items-center md:justify-between gap-4">
            <div className="w-full md:w-auto">
              <div className="flex justify-center items-center gap-3">
                <span className="text-white text-lg sm:text-xl font-medium truncate">
                  {userInput || searchInput}
                </span>
                <button
                  className="text-cyan-400 relative hover:text-cyan-300 transition-colors"
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
                  <ClipboardCopy className="w-5 h-5" />
                </button>
                {copied && (
                  <span className="text-xs text-black bg-cyan-400 px-3 py-1 rounded-full transition-opacity duration-500 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
              <button
                className="flex items-center gap-2 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 transition-all text-sm font-medium"
                onClick={handleGenerateReport}
              >
                <Sparkles className="w-4 h-4" />
                AI Report
              </button>
              
              {location.pathname !== "/corporate-results" &&
                location.pathname !== "/verification-results" && (
                  <div className="relative w-full sm:w-auto">
                    <button
                      className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:border-cyan-500/50 transition-all w-full sm:w-auto"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <FileDown className="w-4 h-4" />
                      <span>Save Results</span>
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 overflow-hidden z-50">
                        <button
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-300 hover:bg-slate-800/50 transition-colors"
                          onClick={handleSaveResults}
                        >
                          {isLoading ? (
                            <InlineLoader />
                          ) : (
                            <FileDown className="w-4 h-4 text-cyan-400" />
                          )}
                          Save as PDF
                        </button>
                      </div>
                    )}
                  </div>
                )}
              
              {user && (
                <div className="text-sm text-slate-900 rounded-xl px-4 py-2.5 bg-gradient-to-r from-cyan-400 to-emerald-400 font-medium">
                  Credits: <span className="font-semibold">{Number(user.credits).toFixed(2)}</span>
                </div>
              )}

              <button
                className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black transition-all w-full sm:w-auto"
                onClick={handleBack}
              >
                <ArrowLeft className="w-4 h-4" />
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
