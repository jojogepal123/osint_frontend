export const OsintCard = ({ data = [] }) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <div className="w-full md:w-[48%] bg-white dark:bg-gray-800 border rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 p-4">
      <h2 className="text-white text-xl font-semibold mb-4">Other Results</h2>
      <div className="space-y-4">
        {data.map((result, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-700 p-4 bg-gray-900"
          >
            <div className="text-white space-y-2">
              {Object.entries(result).map(([key, value], i) => (
                <p key={i} className="text-gray-400 break-words">
                  <span className="capitalize text-sm">{key}:</span>{" "}
                  <span className="text-white">
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
