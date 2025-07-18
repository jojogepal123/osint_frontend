import { useLocation, useNavigate } from "react-router-dom";
import ResultHeader from "../components/ResultHeader";

const CorporateResults = () => {
  const location = useLocation();
  const data = location.state?.data;
  const searchInput = location.state?.searchInput || "";
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);

  // Flatten function inside component
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
      <div className="w-full px-4 mt-8 text-white flex flex-col items-center z-10">
        <div className="max-w-6xl w-full bg-gray-900/70 p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4 border-b border-lime-300 pb-2 flex items-center gap-2 group">
            <span className="min-w-[24px] flex items-center justify-center transition-transform duration-100 group-hover:scale-110">
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
            <span className="text-base transition-all duration-700 ease-in-out group-hover:ml-1">
              Corporate Result:{" "}
              <span className="text-lime-300">{searchInput}</span>
            </span>
          </h2>

          {data ? (
            <div className="space-y-2">
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
                  <div key={key} className="flex gap-2">
                    <span className="font-semibold text-lime-300">
                      {key.split(".").pop().replace(/_/g, " ")}:
                    </span>
                    <span className="text-white break-all">
                      {String(value)}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center text-yellow-400">
              <p>No data found for this search.</p>
              <button
                onClick={handleBack}
                className="inline-block mt-4 px-4 py-2 bg-lime-300 text-black font-bold rounded"
              >
                🔍 Try another search
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CorporateResults;
