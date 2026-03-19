import { GoogleCard } from "../components/cards/GoogleCard";
import { GravatarCard } from "../components/cards/GravatarCard";
import { OsintCard } from "../components/cards/OsintCard";
import ResultHeader from "../components/ResultHeader";
import { useLocation, useNavigate } from "react-router-dom";

import { ProfileFromTelApis } from "../utils/ProfileFromTelApis";
import { ProfileFromEmailApis } from "../utils/ProfileFromEmailApis";
import TelProfileCard from "../components/TelProfileCard";
import EmailProfileCard from "../components/EmailProfileCard";
import no_results_image from "../assets/noresults.png";
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
      <div className="flex flex-col items-center justify-center h-screen z-10 md:pl-64">
        <img
          src={no_results_image}
          className="w-96 sm:w-2/5 mb-8"
          alt="no-results"
        />
        <button
          onClick={handleNewSearch}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 font-bold uppercase text-black rounded-xl shadow-lg transition-all"
        >
          Start a new search
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
                <div className="w-full h-full bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#22d3ee"
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
                    <h2 className="text-white text-xl font-bold tracking-wide">
                      Found breaches
                    </h2>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {hibpResults.map((result, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-200 shadow group border border-slate-700/50"
                      >
                        <img
                          src={
                            result.LogoPath || "https://via.placeholder.com/50"
                          }
                          alt={result.Name}
                          className="w-8 h-8 rounded-full border border-slate-600 shadow-sm bg-white object-contain"
                        />
                        <span className="font-semibold text-slate-200 group-hover:text-cyan-400">
                          {result.Name}
                        </span>
                        {result.BreachDate && (
                          <span className="ml-auto px-2 py-0.5 rounded-full bg-cyan-500/20 text-xs text-cyan-400 font-medium">
                            {new Date(result.BreachDate).getFullYear()}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {osResults !== null && <OsintCard data={osResults} />}
          </div>
          {Array.isArray(mapData) && mapData.length !== 0 && (
            <div className="z-10 w-full gap-4 max-w-6xl mx-auto mb-12 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 p-4 rounded-xl">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center py-12">
                    <InlineLoader />
                  </div>
                }
              >
                <h2 className="text-2xl font-bold mb-4 text-white">
                  Locations
                </h2>
                <div className="">
                  <Map data={mapData} />
                </div>
              </Suspense>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Results;
