import useAuthContext from "../context/AuthContext";
import { useEffect, useState, useRef } from "react";
import Options from "./Options";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FullScreenLoader from "../components/FullScreenLoader";
import UserCard from "../components/UserCard";
import { Search } from "lucide-react";

const Home = () => {
  const {
    inputValue,
    setInputValue,
    setResults,
    inputType,
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
      toast.warning("Insufficient credits. Please upgrade your plan.");
      return;
    }
    if (!isChecked) {
      toast.error("Please accept the terms before submitting");
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
      <main className="flex-1 flex flex-col items-center justify-center p-8 -mt-36 sm:-mt-20 z-10 md:pl-64">
        <div className="max-w-4xl mx-auto h-full flex flex-col items-center md:-mt-20 justify-center space-y-1.5 md:space-y-4 mb-2 md:mb-8 cursor-default">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
            {import.meta.env.VITE_APP_NAME}
          </h1>
          <div className="text-white text-3xl sm:text-5xl font-semibold text-center pb-4">
            Search
            <br className="block md:hidden" />
            <span
              className="ml-1 text-cyan-400 px-2 underline underline-offset-8"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              {inputType === "tel" ? "Phone number" : "Email"}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-xl lg:max-w-3xl">
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
      </main>
    </>
  );
};

export default Home;
