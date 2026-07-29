import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import instance from "../api/axios";
import FullScreenLoader from "../components/FullScreenLoader";
import UserCard from "../components/UserCard";
import MainHeader from "../components/MainHeader";
import useAuthContext from "../context/AuthContext";
import SocialCandidateCard from "../components/SocialCandidateCard";

const SEARCH_TABS = [
  {
    key: "linkedin",
    label: "LinkedIn URL",
    type: "url",
    placeholder: "https://www.linkedin.com/in/username",
  },
  {
    key: "phone",
    label: "Phone",
    type: "tel",
    placeholder: "Enter phone number",
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter email address",
  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

const SocialIntel = () => {
  const [activeTab, setActiveTab] = useState("linkedin");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const { updateUser, hasSufficientCredits } = useAuthContext();
  const navigate = useNavigate();

  const activeTabConfig = SEARCH_TABS.find((t) => t.key === activeTab);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setInputValue("");
    setResults(null);
  };

  const handleSearch = async () => {
    if (!inputValue.trim()) {
      toast.error("Please enter a value to search.");
      return;
    }
    if (!hasSufficientCredits()) {
      toast.warning("Insufficient credits. Please upgrade your plan.");
      return;
    }
    setLoading(true);
    setResults(null);
    try {
      const res = await instance.post("/api/social-intel-search", {
        type: activeTab,
        value: inputValue.trim(),
      });
      if (res.status === 200) {
        const data = res.data;
        if (data.credits !== undefined) updateUser({ credits: data.credits });
        if (data.cached && data.search_query_public_id) {
          toast.info("Showing saved result — no credits charged.");
          navigate(`/social-results/${data.search_query_public_id}`);
          return;
        }
        setResults(data.results ?? data);
      }
    } catch (err) {
      if (err.response?.status === 402)
        toast.warning(err.response?.data?.message || "Insufficient credits.");
      else
        toast.error(
          err.response?.data?.error ||
            err.response?.data?.message ||
            "Something went wrong.",
        );
    } finally {
      setLoading(false);
    }
  };

  const candidates = Array.isArray(results)
    ? results
        .filter((r) => r.candidate && r.status !== "failed")
        .map((r) => r.candidate)
    : [];

  return (
    <>
      {loading && <FullScreenLoader text="Searching social intelligence..." />}
      <UserCard />
      <div className="w-full flex flex-col items-center z-10 mt-32 sm:mt-20 pb-12">
        <MainHeader header="Social Intell" />

        <div className="w-full max-w-5xl px-4">
          {/* search type tabs — centered */}
          <div className="flex justify-center mb-5">
            <div className="flex gap-1 bg-gray-900/60 backdrop-blur-sm rounded-xl p-1.5 border border-white/10">
              {SEARCH_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`py-2 px-5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.key
                      ? "bg-gradient-to-r from-lime-200 to-teal-700 text-gray-900 shadow"
                      : "text-gray-400 hover:text-lime-200 hover:bg-gray-800/60"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* input with search button inside */}
          <div className="relative mb-8">
            <input
              type={activeTabConfig.type}
              placeholder={activeTabConfig.placeholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full py-4 pl-5 pr-36 border border-lime-300/60 rounded-xl bg-gray-900/70 text-lime-200 placeholder:text-gray-500 focus:outline-none focus:border-lime-400 text-base backdrop-blur-sm transition-colors"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-lime-200 to-teal-700 text-gray-900 font-bold rounded-lg px-5 py-2.5 hover:opacity-90 flex items-center gap-2 whitespace-nowrap disabled:opacity-60 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              Search
            </button>
          </div>

          {/* results */}
          {results !== null &&
            (candidates.length === 0 ? (
              <div className="text-center text-lime-400 text-2xl font-bold mt-10">
                No results found.
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-gray-500 text-sm">
                  {candidates.length} profile
                  {candidates.length !== 1 ? "s" : ""} found
                </p>
                {candidates.map((c, i) => (
                  <SocialCandidateCard key={i} candidate={c} />
                ))}
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default SocialIntel;
