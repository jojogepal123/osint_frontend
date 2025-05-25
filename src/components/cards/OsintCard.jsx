export const OsintCard = ({ data = [] }) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <div className="w-full bg-green border border-gray-700 rounded-lg shadow p-4">
      <h2 className="text-gray-200 text-xl font-semibold mb-4">Other Results</h2>
      <div className="space-y-4">
        {data.map((result, index) => (
          <div
            key={index}
            className="rounded-lg bg-green"
          >
            <div className="text-gray-200 space-y-2">
              {Object.entries(result).map(([key, value], i) => (
                <p key={i} className="text-gray-200 font-bold break-words">
                  <span className="capitalize text-md">{key}:</span>{" "}
                  <span className="text-gray-200 text-md">
                    {typeof value === "object"
                      ? JSON.stringify(value, null, 2)
                      : value?.toString()}
                  </span>
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
