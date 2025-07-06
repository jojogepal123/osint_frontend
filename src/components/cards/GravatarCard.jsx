export const GravatarCard = ({ data }) => {
  if (!data || data.length === 0) return null;

  return data.map((item, index) => (
    <div
      key={index}
      className="w-full h-full bg-green border border-gray-700 rounded-lg shadow p-4"
    >
      <div className="flex items-center gap-3 mb-4">
        <img
          src="https://gravatar.com/images/favicon-192x192.png"
          alt="Gravatar"
          className="w-6 h-6 bg-[#313544] rounded-xl"
        />
        <h2 className="text-gray-200 text-xl font-semibold">Gravatar</h2>
      </div>
      <div className="text-gray-200 flex items-start space-x-8">
        {item.avatar_url && (
          <img
            src={item.avatar_url}
            alt={item.username}
            className="object-cover w-32 h-32 rounded-xl border-2 border-gray-400"
          />
        )}
        <div className="flex flex-col space-y-2">
          <p>
            <strong>Username:</strong> {item.username}
          </p>
          {item.profile_url && (
            <p>
              <strong>Profile:</strong>{" "}
              <a
                href={item.profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                View Profile
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  ));
};
