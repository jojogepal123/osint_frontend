const InfoList = ({ title, items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <ul className="ml-5 list-disc text-md text-gray-300">
        {items.map((item, idx) => (
          <li key={idx}>
            {item.value}
            {item.source && (
              <span className="text-sm text-gray-500"> ({item.source})</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const DataCard = ({ title, items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-gray-900 p-4 rounded-lg text-gray-200 mb-4">
      <InfoList title={title} items={items} />
    </div>
  );
};

const EmailProfileCard = ({ profile, userInput }) => {
  //   console.log(profile);
  if (!profile) return null;

  return (
    <div className="space-y-4 bg-[#0b323d] rounded-xl shadow-md p-6 text-white border border-gray-700">
      {/* Header */}
      <div className="text-white text-center md:text-left">
        <h2 className="text-2xl font-bold">
          Profile Summary : <span>{userInput}</span>
        </h2>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-4">
        {profile.profileImages?.length > 0 ? (
          <div className="flex flex-wrap gap-4 items-center">
            {profile.profileImages.map((img, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <img
                  src={img.value}
                  alt={`Profile ${idx}`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-400"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/no-image.png"; // fallback image (you can add this in your public folder)
                  }}
                />
                <span className="text-xs text-gray-400 mt-1">{img.source}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full text-center text-gray-400">No Image</div>
        )}
      </div>

      {/* personal info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DataCard title="Full Names and Alias" items={profile.fullNames} />
        <DataCard title="Phone Numbers" items={profile.phones} />
        <DataCard title="Emails" items={profile.emails} />
        <DataCard title="Basic Info" items={profile.basicInfo} />
        <DataCard title="Locations" items={profile.locations} />
        <DataCard title="Last Updated" items={profile.lastUpdated} />
      </div>

      {/* Social Media Links */}
      {Object.keys(profile.socialMediaPresence).length > 0 && (
        <div className="bg-custom p-4 rounded-lg">
          <div className="bg-custom p-4 rounded w-full md:w-2/3 text-white">
            <h3 className="text-xl font-semibold mb-3">
              Social Media Presence
            </h3>
            <ul className="space-y-2">
              {Object.entries(profile.socialMediaPresence).map(
                ([platform, isPresent]) => (
                  <li
                    key={platform}
                    className="flex items-center justify-between text-md text-gray-200"
                  >
                    <span className="capitalize">{platform}</span>
                    <span
                      className={`w-3 h-3 rounded-full ${
                        isPresent ? "bg-green-500" : "bg-gray-500"
                      }`}
                    />
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailProfileCard;
