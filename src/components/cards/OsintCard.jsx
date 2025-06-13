export const OsintCard = ({ data = [] }) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <div className="w-full mt-4 bg-green p-4 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((result, index) => (
          <div
            key={index}
            className="bg-gray-900 border border-gray-700 rounded-lg shadow p-4"
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
