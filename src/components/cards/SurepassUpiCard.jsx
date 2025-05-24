import React from "react";
const SurepassUpiCard = ({ data }) => {
  if (!data?.data) return null;

  // Render key-value pairs, handling arrays specially
  const renderKeyValuePairs = (obj) => (
    <div className="space-y-1 text-white text-sm">
      {Object.entries(obj)
        .filter(
          ([, value]) =>
            value !== null &&
            value !== undefined &&
            value !== "" &&
            !(Array.isArray(value) && value.length === 0) &&
            !(
              typeof value === "object" &&
              !Array.isArray(value) &&
              Object.keys(value).length === 0
            )
        )
        .map(([key, value]) => {
          const formattedKey = key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

          if (Array.isArray(value)) {
            return (
              <div key={key} className="flex flex-col">
                <div>
                  <span className="font-semibold text-gray-300">
                    {formattedKey}:
                  </span>
                </div>
                {value.map((item, idx) => (
                  <div key={idx} className="pl-4">
                    {item}
                  </div>
                ))}
              </div>
            );
          } else {
            return (
              <div key={key}>
                <span className="font-semibold text-gray-300">
                  {formattedKey}:
                </span>{" "}
                {value}
              </div>
            );
          }
        })}
    </div>
  );

  return (
    <div className="w-full md:w-[48%] bg-white dark:bg-gray-800 border rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-2 text-[#ABDE64]">
        Surepass UPI
      </h2>
      {renderKeyValuePairs(data.data)}
    </div>
  );
};

export default SurepassUpiCard;
