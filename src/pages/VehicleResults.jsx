import { useLocation, useNavigate } from "react-router-dom";
import ResultHeader from "../components/ResultHeader";

const VehicleResults = () => {
  const location = useLocation();
  const data = location.state?.data;
  const searchInput = location.state?.searchInput || "";
  const type = location.state?.type || "Vehicle";
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);

  const flattenObject = (obj, parentKey = "", result = {}) => {
    for (let key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      const value = obj[key];
      if (value !== null && typeof value === "object" && !Array.isArray(value)) {
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
        result[newKey] = value === null || value === "1800-01-01" ? "N/A" : value;
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
                  d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                />
              </svg>
            </span>
            <span className="text-base transition-all duration-700 ease-in-out group-hover:ml-1">
              {type} Result:{" "}
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
                    <span className="text-white break-all">{String(value)}</span>
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

export default VehicleResults;
