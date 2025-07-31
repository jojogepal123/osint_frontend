import { useLocation, useNavigate } from "react-router-dom";
import ResultHeader from "../components/ResultHeader";

const VerificationResults = () => {
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
                className="size-6 text-lime-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                />
              </svg>
            </span>
            <span className="text-base transition-all duration-700 ease-in-out group-hover:ml-1">
              Identity Verified Result :{" "}
              <span className="text-lime-300">&nbsp;{searchInput}</span>
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

export default VerificationResults;
