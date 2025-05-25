import { WhatsappCard } from "../components/cards/WhatsappCard";
// import { SkypeCard } from "../components/cards/SkypeCard";
import { EyeconCard } from "../components/cards/EyeconCard";
import { SocialMediaCard } from "../components/cards/SocialMediaCard";
import { HLRCard } from "../components/cards/HLRCard";
import { TruecallerCard } from "../components/cards/TruecallerCard";
import { AllMobileCard } from "../components/cards/AllMobileCard";
import { GoogleCard } from "../components/cards/GoogleCard";
import { GravatarCard } from "../components/cards/GravatarCard";
import { ZehefCard } from "../components/cards/ZehefCard";
import { OsintCard } from "../components/cards/OsintCard";
import useAuthContext from "../context/AuthContext";
import ResultHeader from "../components/ResultHeader";
import { useLocation, useNavigate } from "react-router-dom";
// import SurepassKycCard from "../components/cards/SurepassKycCard";
// import SurepassUpiCard from "../components/cards/SurepassUpiCard";
// import SurepassBankCard from "../components/cards/SurepassBankCard";
const Results = () => {
  const location = useLocation();
  const { results, type, userInput } = location.state || {};
  const navigate = useNavigate();

  const handleNewSearch = () => navigate("/dashboard");
  const emailData = results?.emailData || null;

  const hibpResults = results?.hibpData || [];
  const zehefResults = results?.zehefData?.data || [];
  const osintDataResults = results?.osintData?.data || null;

  return (
    <>
      <ResultHeader
        userInput={userInput}
        onNewSearch={handleNewSearch}
        type={type}
        profile={emailData}
        results={results}
        hibpResults={hibpResults}
        zehefResults={zehefResults}
        osintDataResults={osintDataResults}
      />

      {type === "tel" ? (
        <>
          <div className="w-full flex flex-wrap gap-6 justify-start items-stretch max-w-7xl mx-auto mt-8 md:mt-16 py-4 px-4 md:px-24 z-10">
            {results.whatsappData && (
              <WhatsappCard data={results.whatsappData} />
            )}
            {results.eyeconData && <EyeconCard data={results.eyeconData} />}
            {/* {results.skypeData && <SkypeCard data={results.skypeData} />} */}
            {results.hlrData && <HLRCard data={results.hlrData} />}
            {results.truecallerData && (
              <TruecallerCard data={results.truecallerData} />
            )}
            {results.socialMediaData && (
              <SocialMediaCard data={results.socialMediaData} />
            )}
            {results.allMobileData && (
              <AllMobileCard data={results.allMobileData} />
            )}
            {results.osintData && <OsintCard data={results.osintData} />}
            {/* {results.surepassKyc && typeof results.surepassKyc === "object" && (
              <SurepassKycCard data={results.surepassKyc} />
            )}
            {results.surepassUpi && typeof results.surepassUpi === "object" && (
              <SurepassUpiCard data={results.surepassUpi} />
            )}
            {results.surepassBank &&
              typeof results.surepassBank === "object" && (
                <SurepassBankCard data={results.surepassBank} />
              )} */}
          </div>
        </>
      ) : (
        <>
          <div className="w-full flex flex-wrap gap-6 justify-start items-stretch max-w-7xl mx-auto mt-8 md:mt-16 py-4 px-4 md:px-24 z-10">
            <GoogleCard emailData={emailData} />
            {Array.isArray(hibpResults) && hibpResults.length > 0 && (
              <div className="w-full md:w-[48%] bg-white dark:bg-gray-800 border rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 p-4">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src="https://www.google.com/favicon.ico"
                    alt="Google"
                    className="w-14 h-14 bg-[#313544] rounded-xl"
                  />
                  <h2 className="text-white text-xl font-semibold">
                    Leaked Databases
                  </h2>
                </div>
                <ul className="list-disc pl-6 text-white space-y-2">
                  {hibpResults.map((result, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <img
                        src={
                          result.LogoPath || "https://via.placeholder.com/50"
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

            {/* {skypeResults?.data?.profiles?.length > 0 && (
                <SkypeCard data={skypeResults} />
              )} */}
            <OsintCard data={osintDataResults} />
            {zehefResults?.some(
              (item) => item.source === "Gravatar" && item.status === "found"
            ) && (
              <GravatarCard
                data={zehefResults.filter(
                  (item) =>
                    item.source === "Gravatar" && item.status === "found"
                )}
              />
            )}
            <ZehefCard data={zehefResults} />
          </div>
        </>
      )}
      {/* <div className="z-10 w-full flex justify-center items-center max-w-7xl mx-auto py-4 px-4 md:px-24">
        <button
          onClick={onBack}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
        >
          Back
        </button>
      </div> */}
    </>
  );
};

export default Results;
