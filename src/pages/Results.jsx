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
          <div className="z-10 w-full max-w-6xl mx-auto mt-12">
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
          <div className="z-10 w-full max-w-6xl mx-auto mt-12">
            <EmailProfileCard profile={EmailProfile} userInput={userInput} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mt-4">
                <GoogleCard emailData={emailData} />
              </div>
              <div className="mt-4">
                {Array.isArray(hibpResults) && hibpResults.length > 0 && (
                  <div className="w-full bg-green  border rounded-lg shadow border-gray-700 p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        className="w-6 h-6 bg-[#313544] rounded-xl"
                      />
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
              <div className="">
                <OsintCard data={osintDataResults} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Results;
