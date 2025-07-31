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
  const navigate = useNavigate();
  const handleNewSearch = () => navigate("/dashboard");
  const TelProfile = ProfileFromTelApis(results);
  const EmailProfile = ProfileFromEmailApis(results);

  const emailData = results?.emailData || null;
  const mapData = emailData?.maps_result?.reviews || null;
  const hibpResults = results?.hibpData || [];
  const zehefResults = results?.zehefData?.data || [];
  const osResults = results?.osintData?.data || null;

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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
      <div className="flex flex-col items-center justify-center h-screen z-10">
        <img
          src={no_results_image}
          className="w-96 sm:w-2/5"
          alt="no-results"
        />
        <button
          onClick={handleNewSearch}
          className="px-4 py-2 bg-lime-400 font-bold uppercase text-gray-950 rounded hover:bg-lime-500"
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
              {/* <GoogleCard emailData={emailData} /> */}
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
            {/* hibp Data Card */}
            {Array.isArray(hibpResults) && hibpResults.length > 0 && (
              <div className="h-full mt-4">
                <div className="w-full h-full bg-green border border-gray-700/60 rounded-2xl shadow-2xl p-6 backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="50"
                      height="50"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-blocks w-6 h-6"
                    >
                      <rect width="7" height="7" x="14" y="3" rx="1"></rect>
                      <path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3"></path>
                    </svg>
                    <h2 className="text-white text-xl font-bold tracking-wide">
                      Found breaches
                    </h2>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {hibpResults.map((result, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-900 hover:bg-gray-950 transition-all duration-200 shadow group"
                      >
                        <img
                          src={
                            result.LogoPath || "https://via.placeholder.com/50"
                          }
                          alt={result.Name}
                          className="w-8 h-8 rounded-full border border-gray-700 shadow-sm bg-white object-contain"
                        />
                        <span className="font-semibold text-gray-100 group-hover:text-lime-200">
                          {result.Name}
                        </span>
                        {/* Example badge for year or type */}
                        {result.BreachDate && (
                          <span className="ml-auto px-2 py-0.5 rounded-full bg-lime-700/20 text-xs text-lime-200 font-medium">
                            {new Date(result.BreachDate).getFullYear()}
                            {/* {result.BreachDate} */}
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
          <div className="z-10 w-full gap-4 max-w-6xl mx-auto mb-12 bg-green p-4 rounded-lg">
            {mapData !== null && (
              <Suspense
                fallback={
                  <div>
                    <InlineLoader />
                  </div>
                }
              >
                <h2 className="text-2xl font-bold mb-4 text-gray-200">
                  Locations
                </h2>
                <div className="">
                  <Map data={mapData} />
                </div>
              </Suspense>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Results;
