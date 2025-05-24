export const SocialMediaCard = ({ data }) => {
  if (!data?.response) return null;
  const { fb, is_spam, name } = data.response;
  return (
    <div className="w-full md:w-[48%] bg-white dark:bg-gray-800 border rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <img
            src="/facebook.png"
            alt="Facebook"
            className="w-14 h-14 bg-[#313544] rounded-xl"
          />
          <h2 className="text-white text-xl font-semibold">Facebook</h2>
        </div>
        <div className="text-white space-y-2">
          <p>
            <strong>Name:</strong> {name || "Not available"}
          </p>
          <p>
            <strong>Spam:</strong> {is_spam === null ? "No" : "Yes"}
          </p>
          <p>
            <strong>Facebook ID:</strong> {fb?.id || "Not available"}
          </p>
          <p>
            <strong>Profile:</strong>{" "}
            <a
              href={fb?.profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              {fb?.profile_url || "Not available"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
