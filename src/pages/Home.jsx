import useAuthContext from "../context/AuthContext";
import { useEffect, useState, useRef } from "react";
import Options from "./Options";
import UserIcon from "../assets/userIcon.png"; // Import your user icon here
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { input } from "framer-motion/client";
const Home = () => {
  const {
    user,
    logout,
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
  } = useAuthContext();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const handleLogout = () => {
    logout().then(() => {
      window.location.href = "/"; // Redirect to login page after logout
    });
  };

  const handleSubscription = () => {
    window.location.href = "/subscription";
  };

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
        // console.log("Fetched results:", fetchedResults);
        navigate("/results", {
          state: {
            results: fetchedResults,
            type: inputType,
            userInput: inputValue,
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 -mt-28 sm:-mt-20 z-10">
      <div className="fixed right-4 top-4 z-50">
        <div className="relative">
          {/* Profile Image Button */}
          <button
            className="h-10 w-10 rounded-full shadow bg-white/10 transition-opacity duration-300"
            title={user?.name || "User"}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img
              className="h-10 w-10 rounded-full border-2 border-lime-200"
              src={UserIcon}
              alt={`${user?.name}'s profile`}
              title={user?.name || "User"}
            />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 border border-[#9acc14] bg-gray-900 bg-opacity-30 backdrop-blur-lg shadow-md rounded-lg px-4 divide-y divide-[#9acc14]">
              <div className="flex items-center justify-start space-x-4 mb-4 py-2">
                <div className="text-white">
                  <span className="">
                    <img
                      className="h-10 w-10 rounded-full border-2 border-lime-200"
                      src={UserIcon}
                      alt={`${user?.name}'s profile`}
                      title={user?.name || "User"} // Show name on hover
                    />
                  </span>
                </div>
                <div className=" text-white hover:text-lime-200 flex flex-col">
                  <span className="">
                    <span className="">{user?.name || "User"}</span>
                  </span>
                  <span className="">{user?.email || ""}</span>
                </div>
              </div>

              <button
                className="flex items-center px-4 py-3  hover:bg-gray-800 text-white hover:text-lime-200 space-x-3 w-full "
                onClick={handleSubscription}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                  />
                </svg>

                <span className=" text-sm">Subscription</span>
              </button>
              <button
                className="flex items-center px-4 py-3 space-x-3 w-full hover:bg-gray-800 text-white hover:text-lime-200"
                onClick={handleLogout}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm5.03 4.72a.75.75 0 0 1 0 1.06l-1.72 1.72h10.94a.75.75 0 0 1 0 1.5H10.81l1.72 1.72a.75.75 0 1 1-1.06 1.06l-3-3a.75.75 0 0 1 0-1.06l3-3a.75.75 0 0 1 1.06 0Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="max-w-4xl mx-auto h-full flex flex-col items-center md:-mt-20 justify-center space-y-4 mb-8">
        <h1 className="text-4xl sm:text-7xl font-bold bg-gradient-to-r from-lime-200 to-teal-800 hover:bg-gradient-to-l bg-clip-text text-transparent">
          OSINT WORK
        </h1>
        <div className="text-white text-3xl sm:text-5xl font-semibold text-center">
          Find out what's
        </div>
        <div className="text-white text-3xl sm:text-5xl font-semibold text-center pb-4">
          behind any
          <span
            className="ml-1 text-[#AADE63] px-2 underline underline-offset-8"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >{inputType === "tel" ? "Phone number" : "Email"}
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
            className="flex-grow px-4 py-3 border border-lime-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 bg-[#1e2939] text-lime-200"
            placeholder={`Enter ${
              inputType === "email" ? "email" : "phone"
            }...`}
          />
          {loading ? (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg
                aria-hidden="true"
                role="status"
                className="w-6 h-6 animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="url(#spinnerGradient)"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="url(#spinnerGradient)"
                />
                <defs>
                  <linearGradient
                    id="spinnerGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#A3E635" /> {/* Lime 200 */}
                    <stop offset="100%" stopColor="#0D9488" /> {/* Teal 800 */}
                  </linearGradient>
                </defs>
              </svg>
            </div>
          ) : (
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 flex items-center justify-center text-sm font-medium rounded-xl bg-gradient-to-r from-lime-200 to-teal-800 shadow p-2 text-white"
              disabled={loading}
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
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          )}
        </div>
        <div className="sm:mt-4 text-center text-xs flex flex-wrap justify-center">
          <label className="flex items-center cursor-pointer gap-2">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="peer sr-only"
            />
            <div className="h-4 w-4 rounded border border-lime-200 flex items-center justify-center peer-checked:bg-lime-200">
              {isChecked && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-[#1e2939]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              )}
            </div>
            <span className="text-[#CCCCCC]">
              By performing a search, you acknowledge and agree to our{" "}
              <Link
                to="/privacy"
                className="font-medium text-lime-200 hover:underline"
              >
                Terms of Services, Policies
              </Link>
            </span>
          </label>
        </div>
      </form>

      {/* <Results results={results} type={inputType} /> */}

      {/* <Results
          results={results}
          type={inputType}
          onBack={handleBack}
          onNewSearch={handleNewSearch}
          userInput={inputValue}
        /> */}
    </main>
  );
};

export default Home;
