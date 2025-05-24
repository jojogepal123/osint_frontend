export const GravatarCard = ({ data }) => {
  if (!data || data.length === 0) return null;

  return data.map((item, index) => (
    <div
      key={index}
      className="w-full md:w-[48%] bg-white dark:bg-gray-800 border rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 p-4"
    >
      <div className="flex items-center gap-3 mb-4">
        <img
          src="https://gravatar.com/images/favicon-192x192.png"
          alt="Gravatar"
          className="w-14 h-14 bg-[#313544] rounded-xl"
        />
        <h2 className="text-white text-xl font-semibold">Gravatar</h2>
      </div>
      <div className="text-white space-y-2">
        {item.avatar_url && (
          <img
            src={item.avatar_url}
            alt={item.username}
            className="object-cover w-32 h-32 rounded-lg bg-[#313544] p-2"
          />
        )}
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
  ));
};
