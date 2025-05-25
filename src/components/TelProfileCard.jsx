const InfoList = ({ title, items }) => (
  <div className="mb-4">
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    {items?.length > 0 ? (
      <ul className="ml-5 list-disc text-md text-gray-300">
        {items.map((item, idx) => (
          <li key={idx}>
            {item.value}{" "}
            {item.source && (
              <span className="text-sm text-gray-500">({item.source})</span>
            )}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-gray-400">N/A</p>
    )}
  </div>
);

const TelProfileCard = ({ profile, userInput }) => {
  console.log(profile);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <div className="text-gray-200 bg-custom p-4 rounded-lg">
          <InfoList title="Full Names and Aliases" items={profile.fullNames} />
        </div>

        <div className="text-gray-200 bg-custom p-4 rounded-lg">
          <InfoList title="Phone Numbers" items={profile.phones} />
        </div>

        <div className="text-gray-200 bg-custom p-4 rounded-lg">
          <InfoList title="Emails" items={profile.emails} />
        </div>

        <div className="text-gray-200 bg-custom p-4 rounded-lg">
          <InfoList title="Locations" items={profile.locations} />
        </div>

        <div className="text-gray-200 bg-custom p-4 rounded-lg">
          <InfoList title="Country Codes" items={profile.countryCodes} />
        </div>

        <div className="text-gray-200 bg-custom p-4 rounded-lg">
          <InfoList title="Carriers" items={profile.carriers} />
        </div>

        <div className="text-gray-200 bg-custom p-4 rounded-lg">
          <InfoList title="Job Profiles" items={profile.jobProfiles} />
        </div>
      </div>

      {/* Social Media Links */}
      <div className="bg-custom p-4 rounded-lg">
        {profile.socialMediaPresence &&
          Object.keys(profile.socialMediaPresence).length > 0 && (
            <div className="bg-custom p-4 rounded w-full md:w-1/2 text-white">
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
          )}
      </div>

      {/* Other single-value fields */}
      <div className="grid md:grid-cols-2 gap-6 text-white text-md">
        <div>
          <h3 className="font-semibold">Whatsapp Business Account</h3>
          <p className="text-gray-300">{profile.isBusiness ? "Yes" : "No"}</p>
        </div>
        <div>
          <h3 className="font-semibold">Last number activity</h3>
          <p className="text-gray-300">{profile.lastSeen || "N/A"}</p>
        </div>
        <div>
          <h3 className="font-semibold">Phone IMSI</h3>
          <p className="text-gray-300">{profile.imsi || "N/A"}</p>
        </div>
        <div className="md:col-span-2">
          <h3 className="font-semibold">Facebook Profile</h3>
          {profile.facebook?.profile_url ? (
            <a
              href={profile.facebook.profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline break-all"
            >
              {profile.facebook.profile_url}
            </a>
          ) : (
            <p className="text-gray-300">N/A</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TelProfileCard;
