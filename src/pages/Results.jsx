import { GoogleCard } from "../components/cards/GoogleCard";
import { GravatarCard } from "../components/cards/GravatarCard";
import { OsintCard } from "../components/cards/OsintCard";
import ResultHeader from "../components/ResultHeader";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import instance from "../api/axios";

import { ProfileFromTelApis } from "../utils/ProfileFromTelApis";
import { ProfileFromEmailApis } from "../utils/ProfileFromEmailApis";
import TelProfileCard from "../components/TelProfileCard";
import EmailProfileCard from "../components/EmailProfileCard";
import no_results_image from "../assets/noresults.png";
import { useState, Suspense, lazy, useEffect, useMemo } from "react";
import InlineLoader from "../components/InlineLoader";

const Map = lazy(() => import("../components/Map"));

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const {
    results: stateResults,
    type: stateType,
    userInput: stateUserInput,
    searchQueryId,
    searchQueryPublicId: statePublicId,
  } = location.state || {};

  const publicIdParam = params.publicId || null;

  const [fetched, setFetched] = useState(null);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!publicIdParam || stateResults) return;
    let cancelled = false;
    setLoadingFetch(true);
    setFetchError(null);
    instance
      .get(`/api/search-results/${publicIdParam}`)
      .then((res) => {
        if (cancelled) return;
        setFetched(res.data);
      })
      .catch((err) => {
        if (cancelled) return;
        setFetchError(
          err.response?.data?.error || "Failed to load saved result.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoadingFetch(false);
      });
    return () => {
      cancelled = true;
    };
  }, [publicIdParam, stateResults]);

  const results = stateResults ?? fetched?.results ?? null;
  const type = useMemo(() => {
    if (stateType) return stateType;
    const raw = fetched?.search_type ?? fetched?.search_query?.type ?? null;
    if (raw === "phone" || raw === "tel") return "tel";
    if (raw === "email") return "email";
    return raw;
  }, [stateType, fetched]);
  const userInput = stateUserInput ?? fetched?.search_query?.query ?? null;
  const handleNewSearch = () => navigate("/dashboard");
  const isFromSavedResult = !stateResults && !!fetched?.results;
  // The saved-results endpoint returns a curated shape:
  //   - tel/email: { profile, emailData, gravatar, breachData, osintData, mapData }
  // The live endpoints return the raw per-API shape:
  //   - tel/email: { emailData, zehefData, hibpData, osintData, holeheData, ... }
  // Normalise the saved shape into the live one for tel/email so downstream
  // code (which expects the live shape) just works.
  const actualResults = useMemo(() => {
    const base = results?.data ?? results ?? {};
    if (!isFromSavedResult) return base;
    return {
      ...base,
      // Re-wrap mapData under the live emailData.maps_result.reviews path so
      // the Map component finds it.
      emailData: base.emailData
        ? { ...base.emailData, maps_result: { reviews: base.mapData } }
        : base.emailData,
      // zehefData.data drives the Gravatar card; saved uses `gravatar` instead.
      zehefData: Array.isArray(base.gravatar)
        ? { data: base.gravatar.map((g) => ({ source: "Gravatar", status: "found", ...g })) }
        : base.zehefData,
      // breachData (saved) is the HIBP list; live uses `hibpData`.
      hibpData: base.breachData ?? base.hibpData,
      // osintData: live wraps as { data: [...] }, saved stores the array directly.
      osintData: Array.isArray(base.osintData)
        ? { data: base.osintData }
        : base.osintData,
    };
  }, [results, isFromSavedResult, type]);
  // When the data came from the saved-results endpoint the response already
  // contains a curated `profile` object built from the live API; reuse it
  // directly so the profile cards render correctly. Otherwise derive it from
  // the live API response.
  const TelProfile = useMemo(
    () =>
      isFromSavedResult && results?.profile
        ? results.profile
        : ProfileFromTelApis(actualResults),
    [isFromSavedResult, results, actualResults],
  );
  const EmailProfile = useMemo(
    () =>
      isFromSavedResult && results?.profile
        ? results.profile
        : ProfileFromEmailApis(actualResults),
    [isFromSavedResult, results, actualResults],
  );

  const emailData = actualResults?.emailData || null;
  const mapData = emailData?.maps_result?.reviews || null;
  const hibpResults = useMemo(
    () => actualResults?.hibpData || [],
    [actualResults],
  );
  const zehefResults = useMemo(
    () => actualResults?.zehefData?.data || [],
    [actualResults],
  );
  const osResults = actualResults?.osintData?.data || null;

  const isEmailDataValid =
    emailData && emailData.success !== null && emailData.error === undefined;

  const resultsToSend = useMemo(() => {
    if (type === "tel") {
      return {
        profile: TelProfile || null,
        osintData: osResults || null,
      };
    }
    if (type === "email") {
      return {
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
    return {};
  }, [
    type,
    TelProfile,
    EmailProfile,
    emailData,
    hibpResults,
    zehefResults,
    osResults,
    mapData,
    isEmailDataValid,
  ]);

  useEffect(() => {
    if (
      !stateResults ||
      !userInput ||
      !type ||
      !resultsToSend ||
      Object.keys(resultsToSend).length === 0
    ) {
      return;
    }
    if (statePublicId) return;
    instance
      .post("/api/search-results", {
        type: type,
        user_input: userInput,
        results: resultsToSend,
        search_query_id: searchQueryId || null,
      })
      .catch(() => {});
  }, [userInput, type, stateResults, statePublicId, searchQueryId, resultsToSend]);

  const isResultEmpty = () => {
    if (!results) return true;

    const isFromSavedResult = !stateResults && !!fetched?.results;

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

    if (type === "email") {
      if (isFromSavedResult) {
        // Saved/cached results have a curated shape (profile, emailData,
        // gravatar, breachData, osintData, mapData). If any of them have
        // content, treat the result as non-empty.
        const profileHasContent =
          TelProfile &&
          Object.values(TelProfile).some(
            (val) =>
              val !== null &&
              val !== undefined &&
              !(Array.isArray(val) && val.length === 0) &&
              !(typeof val === "object" && Object.keys(val).length === 0),
          );
        const emailDataHasContent =
          emailData &&
          emailData.success !== null &&
          emailData.error === undefined;
        const breachHasContent =
          Array.isArray(hibpResults) && hibpResults.length > 0;
        const osintHasContent = osResults && osResults.length > 0;
        const gravatarHasContent = zehefResults?.some(
          (item) => item.source === "Gravatar" && item.status === "found",
        );

        return !(
          profileHasContent ||
          emailDataHasContent ||
          breachHasContent ||
          osintHasContent ||
          gravatarHasContent
        );
      }

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

  if (loadingFetch) {
    return <InlineLoader />;
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen z-10 text-center px-4">
        <p className="text-red-400 mb-4">{fetchError}</p>
        <button
          onClick={handleNewSearch}
          className="px-4 py-2 bg-lime-400 font-bold uppercase text-gray-950 rounded hover:bg-lime-500"
        >
          Start a new search
        </button>
      </div>
    );
  }

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
                        {result.BreachDate && (
                          <span className="ml-auto px-2 py-0.5 rounded-full bg-lime-700/20 text-xs text-lime-200 font-medium">
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
            <div className="z-10 w-full gap-4 max-w-6xl mx-auto mb-12 bg-green p-4 rounded-lg">
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
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Results;
