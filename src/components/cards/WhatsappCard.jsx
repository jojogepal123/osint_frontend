export const WhatsappCard = ({ data }) => {
  if (!data) return null;

  return (
    <div className="w-full md:w-[48%] bg-white dark:bg-gray-800 border rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <img
            src="https://static.whatsapp.net/rsrc.php/v3/yP/r/rYZqPCBaG70.png"
            alt="Whatsapp"
            className="w-14 h-14 bg-[#313544] rounded-xl"
          />
          <h2 className="text-white text-xl font-semibold">Whatsapp</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-48">
            {data.profilePic ? (
              <img
                src={data.profilePic}
                alt="Profile"
                className="object-cover w-full h-48 rounded-lg bg-[#313544] p-2"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center bg-gray-700 rounded-lg">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
          </div>
          <div className="text-white space-y-2">
            <p>
              <strong>Number:</strong> {data.number || "N/A"}
            </p>
            <p>
              <strong>Country Code:</strong> {data.countryCode || "N/A"}
            </p>
            <p>
              <strong>Business Account:</strong>{" "}
              {data.isBusiness ? "Yes" : "No"}
            </p>
            <p>
              <strong>Pushname:</strong> {data.pushname || "N/A"}
            </p>
            <p>
              <strong>Is User:</strong> {data.isUser ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
