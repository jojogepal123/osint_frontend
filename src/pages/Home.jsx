import useAuthContext from "../context/AuthContext";
import { useEffect, useState, useRef } from "react";
import Options from "./Options";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "../components/Alert";
import FullScreenLoader from "../components/FullScreenLoader";
import UserCard from "../components/UserCard";
import MainHeader from "../components/MainHeader";
import { Search, Mail, Phone } from "lucide-react";

const Home = () => {
  const {
    inputValue,
    setInputValue,
    setResults,
    inputType,
    setInputType,
    validateInput,
    loading,
    setLoading,
    fetchTelData,
    countryCode,
    setCountryCode,
    fetchEmailData,
    setHibpResults,
    hasSufficientCredits,
  } = useAuthContext();

  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [isChecked, setIsChecked] = useState(false);
  const showAlert = useAlert();

  useEffect(() => {
    setResults({});
    setInputValue("");
    setHibpResults({});
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasSufficientCredits()) {
      showAlert.warning("Insufficient credits. Please upgrade your plan.");
      return;
    }
    if (!isChecked) {
      showAlert.error("Please accept the terms before submitting");
      return;
    }
    if (validateInput()) {
      setLoading(true);
      let fetchedResults = {};
      try {
        if (inputType === "tel") {
          fetchedResults = await fetchTelData();
        } else if (inputType === "email") {
          fetchedResults = await fetchEmailData();
        }
        navigate("/results", {
          state: {
            results: fetchedResults,
            type: inputType,
            userInput: inputValue,
          },
        });
      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {loading && <FullScreenLoader text="Searching..." />}
      <UserCard />
      <div className="w-full flex flex-col items-center justify-center z-10 mt-16 pl-4 md:pl-64 text-white">
        <MainHeader header="Email & Phone" />
        <div className="min-h-auto max-w-full sm:max-w-3xl lg:max-w-4xl xl:max-w-7xl w-auto sm:w-full m-4 sm:mx-auto flex flex-col gap-6 bg-transparent backdrop-blur-none border border-transparent rounded-xl p-4 md:p-8 shadow-none">
          {/* type buttons */}
          <div>
            <p className="mb-3 text-xs font-semibold text-slate-500 tracking-widest uppercase">Search Type</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => { setInputType("email"); setInputValue(""); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  inputType === "email"
                    ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-400"
                    : "bg-slate-800/40 border border-slate-700/40 text-slate-400 hover:bg-slate-800/70 hover:text-slate-200 hover:border-slate-600/60"
                }`}
              >
                <Mail size={14} />
                Email
              </button>
              <button
                type="button"
                onClick={() => { setInputType("tel"); setInputValue(""); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  inputType === "tel"
                    ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-400"
                    : "bg-slate-800/40 border border-slate-700/40 text-slate-400 hover:bg-slate-800/70 hover:text-slate-200 hover:border-slate-600/60"
                }`}
              >
                <Phone size={14} />
                Phone
              </button>
            </div>
          </div>

          <div className="w-full h-px bg-slate-700/50" />

          <form onSubmit={handleSubmit} className="w-full">
          <div className="relative w-full mb-3 flex items-center space-x-2">
            {inputType === "tel" && (
              <Options
                selectedCountryCode={countryCode}
                setSelectedCountryCode={setCountryCode}
              />
            )}
            <input
              ref={inputRef}
              type={inputType}
              value={inputValue}
              autoComplete="off"
              autoCorrect="off"
              autoFocus={true}
              maxLength={inputType === "tel" ? 10 : 100}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-grow px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
              placeholder={`Enter ${inputType === "email" ? "email" : "phone"}...`}
            />
            <button
              type="submit"
              className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 flex items-center justify-center text-sm font-medium rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 shadow p-2 text-black"
              disabled={loading}
            >
              <Search className="size-6" />
            </button>
          </div>
          <div className="sm:mt-4 text-center text-xs flex flex-wrap items-center justify-start md:justify-center">
            <label className="flex items-center cursor-pointer gap-2 text-left md:text-nowrap">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="peer sr-only"
              />
              <div className="min-w-[16px] min-h-[16px] w-4 h-4 rounded border border-cyan-400 flex items-center justify-center peer-checked:bg-cyan-400 transition-all duration-200">
                {isChecked && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-slate-900"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </div>
              <div className="text-slate-300 text-xs leading-snug">
                By performing a search, you acknowledge and agree to our{" "}
                <Link
                  to={"/terms-conditions"}
                  className="font-medium text-cyan-400 hover:underline"
                >
                  Terms of Services, Policies
                </Link>
              </div>
            </label>
          </div>
        </form>
        </div>
      </div>
    </>
  );
};

export default Home;
