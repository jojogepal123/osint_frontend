export const AllMobileCard = ({ data }) => {
  if (!data) return null;
  const { truecaller, callapp, viewcaller, eyecon } = data;

  return (
    <div className="w-full md:w-[48%] bg-white dark:bg-gray-800 border rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 p-4">
      <h2 className="text-white text-xl font-semibold mb-2">
        Alias & Aggregated Info
      </h2>
      <div className="text-white space-y-2">
        {truecaller && (
          <>
            <p>
              <strong>Country:</strong> {truecaller.country}
            </p>
            <p>
              <strong>Number:</strong> {truecaller.number}
            </p>
            <p>
              <strong>Provider:</strong> {truecaller.provider}
            </p>
            <p>
              <strong>Type:</strong> {truecaller.number_type_label}
            </p>
            <p>
              <strong>Code:</strong> {truecaller.country_code}
            </p>
            {truecaller.time_zones && (
              <p>
                <strong>Time Zone:</strong> {truecaller.time_zones[0]}
              </p>
            )}
          </>
        )}
        {callapp && (
          <p>
            <strong>CallApp Name:</strong> {callapp.name}
          </p>
        )}
        {viewcaller?.[0] && (
          <p>
            <strong>ViewCaller:</strong> {viewcaller[0].name}
          </p>
        )}
        {eyecon && (
          <p>
            <strong>Eyecon Name:</strong> {eyecon}
          </p>
        )}
      </div>
    </div>
  );
};
