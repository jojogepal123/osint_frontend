import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../api/axios";
import InlineLoader from "../components/InlineLoader";
import SocialCandidateCard from "../components/SocialCandidateCard";
import no_results_image from "../assets/noresults.png";

const SocialResults = () => {
  const { publicId } = useParams();
  const navigate = useNavigate();
  const [fetched, setFetched] = useState(null);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (!publicId) return;
    let cancelled = false;
    setLoadingFetch(true);
    setFetchError(null);
    instance
      .get(`/api/search-results/${publicId}`)
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
  }, [publicId]);

  const results = fetched?.results ?? null;
  const userInput = fetched?.search_query?.query ?? null;

  const socialCandidates = useMemo(() => {
    const rows = Array.isArray(results?.results) ? results.results : [];
    return rows
      .filter((r) => r && r.candidate && r.status !== "failed")
      .map((r) => r.candidate);
  }, [results]);

  const handleBack = () => navigate(-1);
  const handleNewSearch = () => navigate("/social-intel");

  if (loadingFetch) return <InlineLoader />;

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

  if (!publicId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen z-10">
        <img src={no_results_image} className="w-96 sm:w-2/5" alt="no-results" />
        <button
          onClick={handleNewSearch}
          className="px-4 py-2 bg-lime-400 font-bold uppercase text-gray-950 rounded hover:bg-lime-500"
        >
          Open Social Intel
        </button>
      </div>
    );
  }

  if (socialCandidates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen z-10">
        <img src={no_results_image} className="w-96 sm:w-2/5" alt="no-results" />
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
    <div className="z-10 w-full min-h-screen pb-12">
      <div className="w-full max-w-5xl mx-auto pt-8 pb-4 px-4">
        <div className="rounded-xl p-3 md:p-4 bg-teal-700 bg-opacity-30 backdrop-blur-sm shadow-lg flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="px-3 py-1.5 text-xs rounded-md bg-gray-800/70 border border-white/10 text-gray-200 hover:bg-gray-700/70 transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-white text-lg sm:text-xl font-semibold">
              Social Intell
              {userInput && (
                <>
                  {" · "}
                  <span className="text-lime-400 font-mono break-all">{userInput}</span>
                </>
              )}
            </h1>
          </div>
          <button
            onClick={handleNewSearch}
            className="px-4 py-2 bg-gradient-to-r from-lime-200 to-teal-700 text-gray-900 text-xs font-bold rounded-lg hover:opacity-90 uppercase transition-opacity"
          >
            + New Social Search
          </button>
        </div>
      </div>

      <div className="z-10 w-full max-w-5xl mx-auto my-8 px-4 space-y-3">
        <p className="text-gray-500 text-sm">
          {socialCandidates.length} profile
          {socialCandidates.length !== 1 ? "s" : ""} found
        </p>
        {socialCandidates.map((c, i) => (
          <SocialCandidateCard key={i} candidate={c} />
        ))}
      </div>
    </div>
  );
};

export default SocialResults;
