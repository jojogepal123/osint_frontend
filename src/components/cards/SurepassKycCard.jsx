const SurepassKycCard = ({ data }) => {
  if (!data?.data) return null;
  const { client_id, mobile, details } = data.data;

  // Renders simple key: value on each line
  const renderKeyValueGrid = (obj) => (
    <div className="space-y-1">
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
        .map(([key, value]) => (
          <div key={key} className="text-white">
            <span className="font-semibold text-gray-300 capitalize">
              {key.replace(/_/g, " ")}:
            </span>{" "}
            {renderValue(value)}
          </div>
        ))}
    </div>
  );

  // Recursive rendering
  const renderValue = (value) => {
    if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === "object") {
        return (
          <div className="space-y-2 mt-2">
            {value.map((item, idx) => (
              <div
                key={idx}
                className="border-b border-gray-700 pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0"
              >
                {renderKeyValueGrid(item)}
              </div>
            ))}
          </div>
        );
      }
      return value
        .filter((v) => v !== null && v !== undefined && v !== "")
        .join(", ");
    } else if (typeof value === "object" && value !== null) {
      return renderKeyValueGrid(value);
    } else {
      return value ?? "N/A";
    }
  };

  return (
    <div className="w-full md:w-[48%] bg-white dark:bg-gray-800 border rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4 text-[#ABDE64]">
        Surepass KYC
      </h2>

      {/* Client ID & Mobile */}
      <div className="mb-4 space-y-1 text-white">
        <div>
          <span className="font-semibold text-gray-300">Client ID:</span>{" "}
          {client_id}
        </div>
        <div>
          <span className="font-semibold text-gray-300">Mobile:</span> {mobile}
        </div>
      </div>

      {/* Main Details */}
      <div className="text-white space-y-4">{renderKeyValueGrid(details)}</div>
    </div>
  );
};

export default SurepassKycCard;
