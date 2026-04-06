import { GoogleCard } from "../components/cards/GoogleCard";
import { GravatarCard } from "../components/cards/GravatarCard";
import { OsintCard } from "../components/cards/OsintCard";
import ResultHeader from "../components/ResultHeader";
import { useLocation, useNavigate } from "react-router-dom";

import { ProfileFromTelApis } from "../utils/ProfileFromTelApis";
import { ProfileFromEmailApis } from "../utils/ProfileFromEmailApis";
import TelProfileCard from "../components/TelProfileCard";
import EmailProfileCard from "../components/EmailProfileCard";
import { useState, Suspense, lazy } from "react";
import InlineLoader from "../components/InlineLoader";

const Map = lazy(() => import("../components/Map"));

const Results = () => {
  const location = useLocation();
  const { results, type, userInput } = location.state || {};
  const actualResults = results?.data ?? results ?? {};
  const navigate = useNavigate();
  const handleNewSearch = () => navigate("/dashboard");
  const TelProfile = ProfileFromTelApis(actualResults);
  const EmailProfile = ProfileFromEmailApis(actualResults);

  const emailData = actualResults?.emailData || null;
  const mapData = emailData?.maps_result?.reviews || null;
  const hibpResults = actualResults?.hibpData || [];
  const zehefResults = actualResults?.zehefData?.data || [];
  const osResults = actualResults?.osintData?.data || null;
  // console.log("osResults:", osResults);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  // console.log("Results:", results);

  const formatBreachDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const isResultEmpty = () => {
    if (!results) return true;

    // Handle tel-based search
    if (type === "tel") {
      const telEmpty =
        !TelProfile ||
        Object.values(TelProfile).every(
          (val) =>
            val === null ||
            (Array.isArray(val) && val.length === 0) ||
            (typeof val === "object" && Object.keys(val).length === 0)
        );

      return telEmpty && (!osResults || osResults.length === 0);
    }

    // Handle email-based search
    if (type === "email") {
      const zehefFound = Array.isArray(results.zehefData?.data)
        ? results.zehefData.data.some((item) => item.status === "found")
        : false;

      const holeheUsed = Array.isArray(results.holeheData?.used)
        ? results.holeheData.used.length > 0
        : false;

      const emailEmpty =
        !emailData ||
        emailData.success === null ||
        emailData.error !== undefined;

      const hibpEmpty = !hibpResults || hibpResults.length === 0;
      const osintEmpty = !osResults || osResults.length === 0;

      return (
        emailEmpty && hibpEmpty && osintEmpty && !zehefFound && !holeheUsed
      );
    }
    return true;
  };

  if (isResultEmpty()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] z-10 px-4">
        <div className="relative mb-8">
          <div className="w-36 h-36 rounded-full bg-slate-800/60 border border-slate-700/50 flex items-center justify-center overflow-hidden">
            <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none">
              <circle cx="42" cy="42" r="22" stroke="#475569" strokeWidth="3" className="animate-[pulse_2s_ease-in-out_infinite]" />
              <line x1="58" y1="58" x2="78" y2="78" stroke="#475569" strokeWidth="4" strokeLinecap="round" className="animate-[pulse_2s_ease-in-out_infinite]" />
              <circle cx="42" cy="42" r="8" fill="#22d3ee" className="animate-[ping_2s_ease-in-out_infinite]" opacity="0.3" />
              <circle cx="42" cy="42" r="4" fill="#22d3ee" className="animate-[pulse_1.5s_ease-in-out_infinite]" />
              <circle cx="42" cy="42" r="30" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4 4" className="animate-[spin_8s_linear_infinite]" opacity="0.4" />
              <circle cx="42" cy="42" r="38" stroke="#6d758c" strokeWidth="0.5" strokeDasharray="2 6" className="animate-[spin_12s_linear_infinite_reverse]" opacity="0.3" />
            </svg>
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
          </div>
          <div className="absolute -bottom-1 -left-3 w-4 h-4 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">No Results Found</h2>
        <p className="text-slate-400 text-center max-w-md mb-2">
          We couldn't find any data for <span className="text-cyan-400 font-medium">{userInput}</span>. Try adjusting your search or check the input format.
        </p>
        <p className="text-slate-500 text-sm mb-8">
          Tip: Ensure the email or phone number is entered correctly
        </p>
        
        <button
          onClick={handleNewSearch}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-violet-500/30 text-violet-300 hover:from-violet-500/30 hover:to-cyan-500/30 hover:border-violet-400/50 transition-all font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Try Another Search
        </button>
      </div>
    );
  }

  let resultsToSend = {};

  const isEmailDataValid =
    emailData && emailData.success !== null && emailData.error === undefined;

  if (type === "tel") {
    resultsToSend = {
      profile: TelProfile || null,
      osintData: osResults || null,
    };
  } else if (type === "email") {
    resultsToSend = {
      profile: EmailProfile || null,
      emailData: isEmailDataValid
        ? emailData?.PROFILE_CONTAINER?.profile
        : null,
      breachData: hibpResults || null,
      gravatar: zehefResults?.some(
        (item) => item.source === "Gravatar" && item.status === "found"
      )
        ? zehefResults?.filter(
            (item) => item.source === "Gravatar" && item.status === "found"
          )
        : null,
      osintData: osResults || null,
      mapData: mapData || null,
    };
  }

  return (
    <>
      <ResultHeader
        userInput={userInput}
        onNewSearch={handleNewSearch}
        type={type}
        results={resultsToSend}
        modalOpen={modalOpen}
      />
      {type === "tel" ? (
        <>
          <div className="z-10 w-full max-w-6xl mx-auto my-12">
            <TelProfileCard
              profile={TelProfile}
              userInput={userInput}
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
            />
            {osResults !== null && <OsintCard data={osResults} />}
          </div>
        </>
      ) : (
        <>
          <div className="z-10 w-full max-w-6xl mx-auto my-12">
            <EmailProfileCard
              profile={EmailProfile}
              userInput={userInput}
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
            />
            {Array.isArray(mapData) && mapData.length !== 0 && (
              <div className="z-10 w-full gap-4 max-w-6xl mx-auto mt-8 mb-4 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 p-4 rounded-xl">
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center py-12">
                      <InlineLoader />
                    </div>
                  }
                >
                  <h2 className="text-2xl font-bold mb-4 text-white">
                    Locations ({mapData.length})
                  </h2>
                  <div className="">
                    <Map data={mapData} />
                  </div>
                </Suspense>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 items-stretch">
              {emailData?.PROFILE_CONTAINER?.profile?.personId && (
                <div className="h-full">
                  <GoogleCard emailData={emailData} />
                </div>
              )}
              {zehefResults?.some(
                (item) => item.source === "Gravatar" && item.status === "found"
              ) && (
                <div className="h-full">
                  <GravatarCard
                    data={zehefResults.filter(
                      (item) =>
                        item.source === "Gravatar" && item.status === "found"
                    )}
                  />
                </div>
              )}
            </div>
            {Array.isArray(hibpResults) && hibpResults.length > 0 && (
              <div className="h-full mt-4">
                <div className="w-full bg-slate-900/60 backdrop-blur-sm border border-red-500/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-5 pb-3 border-b border-red-500/20">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#f87171"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-shield-alert w-5 h-5"
                      >
                        <path d="M12 9v4"></path>
                        <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636-2.87L13.637 3.59a1.914 1.914 0 0 0-3.274 0z"></path>
                        <path d="M12 17h.01"></path>
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-white text-lg font-bold uppercase tracking-wide">
                        Found Breaches
                      </h2>
                      <p className="text-red-400 text-xs font-medium">{hibpResults.length} breach{hibpResults.length > 1 ? 'es' : ''} detected</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {hibpResults.map((result, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/40 hover:bg-slate-800/60 transition-all duration-200 group border-l-2 border-red-500/40"
                      >
                        <img
                          src={
                            result.LogoPath || "https://via.placeholder.com/50"
                          }
                          alt={result.Name}
                          className="w-8 h-8 rounded-lg bg-white object-contain p-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-slate-200 group-hover:text-red-400 transition-colors block truncate">
                            {result.Name}
                          </span>
                          {result.BreachDate && (
                            <span className="text-xs text-slate-500">
                              {formatBreachDate(result.BreachDate)}
                            </span>
                          )}
                        </div>
                        <div className="w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-500/50 flex-shrink-0"></div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {osResults !== null && <OsintCard data={osResults} />}
          </div>
        </>
      )}
    </>
  );
};

export default Results;
