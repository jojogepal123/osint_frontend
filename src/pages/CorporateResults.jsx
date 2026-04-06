import { useLocation, useNavigate } from "react-router-dom";
import ResultHeader from "../components/ResultHeader";
import { ArrowLeft } from "lucide-react";

const CorporateResults = () => {
  const location = useLocation();
  const data = location.state?.data;
  const searchInput = location.state?.searchInput || "";
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);

  const flattenObject = (obj, parentKey = "", result = {}) => {
    for (let key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      const value = obj[key];

      if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        flattenObject(value, newKey, result);
      } else if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === "object") {
          value.forEach((item, index) => {
            flattenObject(item, `${newKey}[${index}]`, result);
          });
        } else {
          result[newKey] = value.length ? value.join(", ") : "N/A";
        }
      } else {
        result[newKey] =
          value === null || value === "1800-01-01" ? "N/A" : value;
      }
    }
    return result;
  };

  const flattenedData = data ? flattenObject(data) : {};
  return (
    <>
      {data && <ResultHeader searchInput={searchInput} />}
      <div className="w-full px-4 mt-8 text-white flex flex-col items-center z-10 md:pl-64 md:pr-8">
        <div className="max-w-6xl w-full bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 p-6 rounded-xl shadow-2xl">
          <h2 className="text-xl font-bold mb-4 border-b border-slate-700/50 pb-4 flex items-center gap-3 group">
            <span className="min-w-[32px] h-8 flex items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 transition-transform duration-100 group-hover:scale-110">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                />
              </svg>
            </span>
            <span className="text-base text-slate-300 transition-all duration-700 ease-in-out">
              Corporate Result:{" "}
              <span className="text-cyan-400 font-semibold">{searchInput}</span>
            </span>
          </h2>

          {data ? (
            <div className="space-y-3">
              {Object.entries(flattenedData)
                .filter(
                  ([, value]) =>
                    value !== null &&
                    value !== "" &&
                    value !== "N/A" &&
                    value !== "-" &&
                    value !== undefined
                )
                .map(([key, value]) => (
                  <div key={key} className="flex flex-col sm:flex-row gap-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <span className="font-semibold text-cyan-400 capitalize whitespace-nowrap">
                      {key.split(".").pop().replace(/_/g, " ")}:
                    </span>
                    <span className="text-slate-300 break-all">
                      {String(value)}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg mb-4">No data found for this search.</p>
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-bold rounded-xl shadow-lg transition-all"
              >
                <ArrowLeft size={18} />
                Try another search
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CorporateResults;
