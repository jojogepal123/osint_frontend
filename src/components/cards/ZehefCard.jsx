export const ZehefCard = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full bg-white dark:bg-gray-800 border rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 p-4">
      <h2 className="text-white text-xl font-semibold mb-4">
        Verified Presence
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {data
          .filter(
            (item) => item.status === "found" && item.source !== "Gravatar"
          )
          .map((item, index) => (
            <div
              key={index}
              className="bg-[#1A1F30] rounded-lg p-4 flex flex-col items-center"
            >
              <img
                src={`http://localhost:8000/assets/${item.logo
                  ?.split("/")
                  .pop()}`}
                alt={item.source}
                className="w-16 h-16 object-contain bg-[#313544] rounded-xl mb-2"
              />
              <p className="text-gray-300 text-sm text-center">{item.source}</p>
              {item.profile_url && (
                <a
                  href={item.profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 text-xs mt-2 hover:underline"
                >
                  View Profile
                </a>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};
