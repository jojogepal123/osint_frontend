import { GoogleCard } from "../components/cards/GoogleCard";
import { GravatarCard } from "../components/cards/GravatarCard";
import { OsintCard } from "../components/cards/OsintCard";
import ResultHeader from "../components/ResultHeader";
import { useLocation, useNavigate } from "react-router-dom";

import { ProfileFromTelApis } from "../utils/ProfileFromTelApis";
import { ProfileFromEmailApis } from "../utils/ProfileFromEmailApis";
import TelProfileCard from "../components/TelProfileCard";
import EmailProfileCard from "../components/EmailProfileCard";

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
  const osintDataResults = results?.osintData.data || null;

  return (
    <>
      <ResultHeader
        userInput={userInput}
        onNewSearch={handleNewSearch}
        type={type}
        results={results}
      />
      {type === "tel" ? (
        <>
          <div className="z-10 w-full max-w-6xl mx-auto my-12">
            <TelProfileCard profile={TelProfile} userInput={userInput} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mt-4">
                <OsintCard data={osintDataResults} />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="z-10 w-full max-w-6xl mx-auto my-12">
            <EmailProfileCard profile={EmailProfile} userInput={userInput} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emailData && (
                <div className="mt-4">
                  <GoogleCard emailData={emailData} />
                </div>
              )}
              <div className="mt-4">
                {Array.isArray(hibpResults) && hibpResults.length > 0 && (
                  <div className="w-full bg-green  border rounded-lg shadow border-gray-700 p-4">
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
                )}
              </div>
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
              {osintDataResults && (
                <div className="mt-4">
                  <OsintCard data={osintDataResults} />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Results;
