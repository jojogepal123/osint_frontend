export const TruecallerCard = ({ data }) => {
  if (!data?.data) return null;
  const { addressInfo, phoneInfo, basicInfo } = data.data;

  return (
    <div className="w-full md:w-[48%] bg-white dark:bg-gray-800 border rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 p-4">
      <div className="flex items-center gap-3 mb-4">
        <img
          src="https://www.truecaller.com/pwa-192x192.png"
          className="w-14 h-14 bg-[#313544] rounded-xl"
          alt="Truecaller"
        />
        <h2 className="text-white text-xl font-semibold">Truecaller</h2>
      </div>
      <div className="text-white space-y-2">
        {basicInfo?.name?.fullName && (
          <p>
            <strong>Name:</strong> {basicInfo.name.fullName}
          </p>
        )}
        {basicInfo?.name?.altName && (
          <p>
            <strong>Alt Name:</strong> {basicInfo.name.altName}
          </p>
        )}
        {basicInfo?.jobTitle && (
          <p>
            <strong>Job Title:</strong> {basicInfo.jobTitle}
          </p>
        )}
        {basicInfo?.gender && (
          <p>
            <strong>Gender:</strong> {basicInfo.gender}
          </p>
        )}
        {addressInfo?.street && (
          <p>
            <strong>Street:</strong> {addressInfo.street}
          </p>
        )}
        {addressInfo?.address && (
          <p>
            <strong>Address:</strong> {addressInfo.address}
          </p>
        )}
        {addressInfo?.city && (
          <p>
            <strong>City:</strong> {addressInfo.city}
          </p>
        )}
        {addressInfo?.countryCode && (
          <p>
            <strong>Country Code:</strong> {addressInfo.countryCode}
          </p>
        )}
        {addressInfo?.timeZone && (
          <p>
            <strong>Time Zone:</strong> {addressInfo.timeZone}
          </p>
        )}
        {phoneInfo?.e164Format && (
          <p>
            <strong>E.164:</strong> {phoneInfo.e164Format}
          </p>
        )}
        {phoneInfo?.nationalFormat && (
          <p>
            <strong>National:</strong> {phoneInfo.nationalFormat}
          </p>
        )}
        {phoneInfo?.numberType && (
          <p>
            <strong>Type:</strong> {phoneInfo.numberType}
          </p>
        )}
        {phoneInfo?.dialingCode && (
          <p>
            <strong>Dialing Code:</strong> {phoneInfo.dialingCode}
          </p>
        )}
        {phoneInfo?.carrier && (
          <p>
            <strong>Carrier:</strong> {phoneInfo.carrier}
          </p>
        )}
      </div>
    </div>
  );
};
