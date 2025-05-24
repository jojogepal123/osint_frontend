export const SkypeCard = ({ data }) => {
  if (
    !data?.status ||
    data.status !== "success" ||
    !data.data?.profiles?.length
  )
    return null;

  return data.data.profiles.map((profile, index) => (
    <div
      key={index}
      className="w-full md:w-[48%] bg-white dark:bg-gray-800 border rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/174/174869.png"
            alt="Skype"
            className="w-14 h-14 bg-[#313544] rounded-xl"
          />
          <h2 className="text-white text-xl font-semibold">Skype</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-48">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="object-cover w-full h-48 rounded-lg bg-[#313544] p-2"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center bg-gray-700 rounded-lg">
                <span className="text-gray-400">No Avatar</span>
              </div>
            )}
          </div>
          <div className="text-white space-y-2">
            <p>
              <strong>Full Name:</strong> {profile.display_name || "N/A"}
            </p>
            <p>
              <strong>Skype ID:</strong> {profile.skype_id || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {profile.email || "N/A"}
            </p>
            <p>
              <strong>Username:</strong> {profile.email_username || "N/A"}
            </p>
            <p>
              <strong>DOB:</strong> {profile.date_of_birth || "N/A"}
            </p>
            <p>
              <strong>City:</strong> {profile.city || "N/A"}
            </p>
            <p>
              <strong>Country:</strong> {profile.country || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  ));
};
