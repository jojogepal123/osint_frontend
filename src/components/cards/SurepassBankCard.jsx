import React from "react";

const SurepassBankCard = ({ data }) => {
  if (!data?.data) return null;

  // Render key-value pairs
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

          return (
            <div key={key}>
              <span className="font-semibold text-gray-300">
                {formattedKey}:
              </span>{" "}
              {value}
            </div>
          );
        })}
    </div>
  );

  return (
    <div className="w-full md:w-[48%] bg-white dark:bg-gray-800 border rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-2 text-[#ABDE64]">
        Surepass Bank
      </h2>
      {renderKeyValuePairs(data.data)}
    </div>
  );
};

export default SurepassBankCard;
