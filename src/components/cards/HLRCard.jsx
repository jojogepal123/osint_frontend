import isplogo  from "../../assets/isp-logo.png";
export const HLRCard = ({ data }) => {
  if (!data) return null;
  const fields = [
    // ["ID", data.id],
    ["MSISDN", data.msisdn],
    ["MCCMNC", data.mccmnc],
    ["Connectivity Status", data.connectivity_status],
    // ["MCC", data.mcc],
    // ["MNC", data.mnc],
    ["IMSI", data.imsi],
    // ["MSIN", data.msin],
    // ["MSC", data.msc],
    ["Original Network Name", data.original_network_name],
    ["Original Country Name", data.original_country_name],
    ["Original Country Code", data.original_country_code],
    ["Original Country Prefix", data.original_country_prefix],
    ["Is Ported", data.is_ported ? "Yes" : "No"],
    // ["Cost", data.cost],
    ["Timestamp", data.timestamp],
    // ["Storage", data.storage],
    // ["Route", data.route],
    ["Processing Status", data.processing_status],
    // ["Source", data.data_source],
  ];

  return (
    <div className="w-full md:w-[48%] bg-white dark:bg-gray-800 border rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 p-4">
      <div className="flex items-center gap-3 mb-4">
        <img
          src={isplogo}
          alt="ISP"
          className="w-14 h-14 bg-[#313544] rounded-xl"
        />
        <h2 className="text-white text-xl font-semibold">ISP Lookup</h2>
      </div>
      <div className="text-white space-y-1">
        {fields.map(([label, value], index) => (
          <p key={index}>
            <strong>{label}:</strong> {value || "N/A"}
          </p>
        ))}
      </div>
    </div>
  );
};
