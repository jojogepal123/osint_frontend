import { GoogleCard } from "../components/cards/GoogleCard";
import { GravatarCard } from "../components/cards/GravatarCard";
import { OsintCard } from "../components/cards/OsintCard";
import ResultHeader from "../components/ResultHeader";
import { useLocation, useNavigate } from "react-router-dom";

import { ProfileFromTelApis } from "../utils/ProfileFromTelApis";
import { ProfileFromEmailApis } from "../utils/ProfileFromEmailApis";
import TelProfileCard from "../components/TelProfileCard";
import EmailProfileCard from "../components/EmailProfileCard";
import Map from "../components/Map";

import no_results_image from "../assets/noresults.png";

const Results = () => {
  const location = useLocation();
  const { results, type, userInput } = location.state || {};
  const navigate = useNavigate();
  const handleNewSearch = () => navigate("/dashboard");
  const TelProfile = ProfileFromTelApis(results);
  const EmailProfile = ProfileFromEmailApis(results);

  const emailData = results?.emailData || null;
  const hibpResults = results?.hibpData || [];
  const zehefResults = results?.zehefData?.data || [];
  const osResults = results?.osintData?.data || null;

  console.log(results);

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
      />
      {type === "tel" ? (
        <>
          <div className="z-10 w-full max-w-6xl mx-auto my-12">
            <TelProfileCard profile={TelProfile} userInput={userInput} />
            {osintDataResults !== null && <OsintCard data={osintDataResults} />}
          </div>
        </>
      ) : (
        <>
          <div className="z-10 w-full max-w-6xl mx-auto my-12">
            <EmailProfileCard profile={EmailProfile} userInput={userInput} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {emailData?.PROFILE_CONTAINER?.profile?.personId && (
                <div className="">
                  <GoogleCard emailData={emailData} />
                </div>
              )}
              {/* <GoogleCard emailData={emailData} /> */}
              {Array.isArray(hibpResults) && hibpResults.length > 0 && (
                <div className="">
                  <div className="w-full bg-green border rounded-lg shadow border-gray-700 p-4">
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
                      <h2 className="text-gray-200 text-xl font-semibold">
                        Found breaches
                      </h2>
                    </div>
                    <ul className="list-disc pl-6 text-gray-200 space-y-2">
                      {hibpResults.map((result, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <img
                            src={
                              result.LogoPath ||
                              "https://via.placeholder.com/50"
                            }
                            alt={result.Name}
                            className="w-6 h-6 rounded-full"
                          />
                          {result.Name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {zehefResults?.some(
                (item) => item.source === "Gravatar" && item.status === "found"
              ) && (
                <div className="">
                  <GravatarCard
                    data={zehefResults.filter(
                      (item) =>
                        item.source === "Gravatar" && item.status === "found"
                    )}
                  />
                </div>
              )}
            </div>
            {/* <div className="grid grid-cols-1 gap-4"></div> */}

            {emailData &&
              (emailData?.PROFILE_CONTAINER?.maps?.failed === undefined ||
                emailData?.PROFILE_CONTAINER?.maps?.failed !== "failed") &&
              (emailData?.success === undefined ||
                emailData?.success !== null) && (
                <>
                  <h1>Leaked Locations</h1>
                  <Map data={emailData} />
                </>
              )}

            {osResults !== null && <OsintCard data={osResults} />}
          </div>
        </>
      )}
    </>
  );
};

export default Results;
