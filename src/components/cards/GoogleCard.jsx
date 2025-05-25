export const GoogleCard = ({ emailData }) => {
  const profile = emailData?.PROFILE_CONTAINER?.profile;

  if (!profile) return null;

  const personId = profile.personId;
  const email = profile.emails?.PROFILE?.value;
  const name = profile.names?.PROFILE?.fullname;
  const profilePhoto = profile.profilePhotos?.PROFILE?.url;
  const sourceId = profile.sourceIds?.PROFILE?.lastUpdated;

  return (
    <div className="w-full bg-green border border-gray-700 rounded-lg shadow p-4">
      <div className="flex items-center gap-3 mb-4">
        <img
          src="https://www.google.com/favicon.ico"
          alt="Google"
          className="w-6 h-6 bg-[#313544] rounded-xl"
        />
        <h2 className="text-gray-200 text-xl font-semibold">Google Profile</h2>
      </div>

      <div className="text-gray-200 flex flex-col sm:flex-row sm:items-start sm:space-x-6 space-y-4 sm:space-y-0">
        {profilePhoto && (
          <div className="flex justify-center sm:block">
            <img
              src={profilePhoto}
              alt="Profile"
              referrerPolicy="no-referrer"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-md border-4 border-gray-400 object-cover"
            />
          </div>
        )}

        <div className="space-y-2 text-sm sm:text-base">
          {name && (
            <p>
              <strong className="text-gray-200">Name:</strong> {name}
            </p>
          )}

          {email && (
            <p>
              <strong className="text-gray-200">Email:</strong> {email}
            </p>
          )}

          {personId && (
            <>
              <p>
                <strong className="text-gray-200">Maps Profile:</strong>{" "}
                <a
                  href={`https://www.google.com/maps/contrib/${personId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline break-all"
                >
                  View Maps
                </a>
              </p>
              <p>
                <strong>Person ID:</strong> {personId}
              </p>
            </>
          )}

          {sourceId && (
            <p>
              <strong>Last Updated At:</strong> {sourceId}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
