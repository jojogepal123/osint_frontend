const InfoList = ({ title, items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <ul className="ml-5 list-disc text-md text-gray-300">
        {items.map((item, idx) => (
          <li key={idx}>
            {item.key ? item.key + " : " : ""}
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
    <div className="bg-gray-900 p-4 rounded-lg text-gray-200">
      <InfoList title={title} items={items} />
    </div>
  );
};

const TelProfileCard = ({ profile, userInput }) => {
  if (!profile) return null;

  return (
    <div className="space-y-4 bg-[#0b323d] rounded-xl shadow-md p-6 text-white border border-gray-700">
      {/* Header */}
      <div className="text-white text-center md:text-left">
        <h2 className="text-2xl font-bold">
          Profile Summary : <span>{userInput}</span>
        </h2>
        {profile.isSpam && (
          <span className="text-red-400 text-sm font-medium">
            ⚠ Marked as Spam
          </span>
        )}
      </div>
      {profile.profileImages?.length > 0 && (
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex flex-wrap gap-4 items-center">
            {profile.profileImages.map((img, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <img
                  src={img.value}
                  alt={`Profile ${idx}`}
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
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
        </div>
      )}

      {/* personal info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DataCard title="Full Names and Alias" items={profile.fullNames} />
        <DataCard title="Usernames" items={profile.userNames} />
        <DataCard title="Phone Numbers" items={profile.phones} />
        <DataCard title="Emails" items={profile.emails} />
        <DataCard title="Basic Info" items={profile.basicInfo} />
        <DataCard title="Bank Details" items={profile.bankDetails} />
        <DataCard title="Upi Ids" items={profile.upiDetails} />
        <DataCard title="Identity Proofs" items={profile.idProofs} />
        <DataCard title="Verified Address" items={profile.verifiedAddress} />
        <DataCard title="Locations" items={profile.locations} />
        <DataCard title="Last Updated" items={profile.lastUpdated} />
        <DataCard title="Country Codes" items={profile.countryCodes} />
        <DataCard title="Carriers" items={profile.carriers} />
        <DataCard title="Job Profiles" items={profile.jobProfiles} />
      </div>

      {/* Social Media Links */}
      {Object.keys(profile.socialMediaPresence).length > 0 && (
        <div className="bg-gray-900 p-4 rounded-lg">
          <div className="bg-gray-900 rounded w-full md:w-2/3 text-white">
            <h3 className="text-xl font-semibold mb-3">
              Social Media Presence
            </h3>
            <ul className="space-y-2 px-2">
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

      {/* Other single-value fields */}
      <div className="grid md:grid-cols-2 gap-6 text-white text-md p-4">
        {profile?.isBusiness && (
          <div>
            <h3 className="font-semibold">Whatsapp Business Account</h3>
            <p className="text-gray-300">
              {profile?.isBusiness ? "Yes" : "No"}
            </p>
          </div>
        )}
        {profile?.imsi && (
          <div>
            <h3 className="font-semibold">Phone IMSI</h3>
            <p className="text-gray-300">{profile?.imsi || "N/A"}</p>
          </div>
        )}

        {profile.facebook?.profile_url && (
          <div className="md:col-span-2">
            <h3 className="font-semibold">Facebook Profile</h3>

            <a
              href={profile.facebook.profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline break-all"
            >
              {profile.facebook.profile_url}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TelProfileCard;
