export const EyeconCard = ({ data }) => {
  if (!data?.response) return null;
  return (
    <div className="w-full md:w-[48%] bg-white dark:bg-gray-800 border rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <img
            src="https://www.eyecon-app.com//wp-content/uploads/2023/01/logo_icon.svg"
            alt="Eyecon"
            className="w-14 h-14 bg-[#313544] rounded-xl"
          />
          <h2 className="text-white text-xl font-semibold">Eyecon</h2>
        </div>
        <div className="text-white space-y-2">
          <p>
            <strong>Name:</strong> {data.response.name || "Not available"}
          </p>
          {data.response.picture && data.response.picture !== "NA" && (
            <img
              src={data.response.picture}
              alt="Eyecon"
              className="object-cover w-32 h-32 rounded-lg bg-[#313544] p-2"
            />
          )}
        </div>
      </div>
    </div>
  );
};
