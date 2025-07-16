import { Check, X } from "lucide-react";
import { useIsEmpty } from "../hook/useIsEmpty";
import React, { useState, useEffect } from "react";
import instance from "../api/axios";
import IconWithFallback from "./IconWithFallback";
import RcPopup from "./RcPopup"; // ✅ OK now
import ViewDetailsIcon from "../assets/view-details.svg";

const InfoList = ({ title, items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-bold text-lime-200 mb-2 flex items-center gap-2">
        {/* Optional: Add an icon here if you want */}
        {title}
      </h3>
      <ul className="list-disc ml-5 text-gray-200 space-y-1">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <span>
              {item.key ? (
                <span className="font-semibold">{item.key}:</span>
              ) : null}{" "}
              {item.value}
            </span>
            {item.source && (
              <span className="text-xs text-gray-400 ml-2">
                ({item.source})
              </span>
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
    <div className="bg-gray-900/80 rounded-xl shadow-lg p-6 min-h-[150px] flex flex-col justify-between border border-gray-800 hover:border-lime-400 transition">
      <InfoList title={title} items={items} />
    </div>
  );
};
// const generateCreditReport = async (profile) => {
//   // Find PAN number from idProofs
//   const panProof = profile.idProofs?.find(
//     (proof) => proof.key === "PAN Number" && proof.value
//   );
//   const name = profile.fullNames?.[0]?.value || "";
//   const id_number = panProof?.value || "";
//   const mobile = profile.phones?.find((ph) => ph.source === "Gov")?.value || "";
//   console.log(name, id_number, mobile);
//   if (!name || !id_number || !mobile) {
//     alert("Missing required information for credit report.");
//     return;
//   }

//   try {
//     const response = await instance.post(
//       "/api/generate-credit-report",
//       { name, id_number, mobile },
//       { responseType: "blob" } // <--- important here
//     );

//     const blob = new Blob([response.data], { type: "application/pdf" });
//     const url = window.URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", "credit-report.pdf");

//     document.body.appendChild(link);
//     link.click();
//     link.remove();

//     window.URL.revokeObjectURL(url);

//     console.log("Credit report generated and downloaded");
//   } catch (error) {
//     console.error(
//       "Error generating credit report:",
//       error.response?.data || error.message
//     );
//   }
// };

const TelProfileCard = ({
  profile,
  userInput,
  modalOpen,
  setModalOpen,
  selectedImage,
  setSelectedImage,
}) => {
  const isEmpty = useIsEmpty(profile);
  if (isEmpty) return null;

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Clean up on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);
  // ✅ Move state here
  const [selectedRC, setSelectedRC] = useState(null);
  const [rcData, setRcData] = useState(null);
  const [loading, setLoading] = useState(false); // <-- NEW
  // Inside the handleRCClick
  const handleRCClick = async (rc) => {
    setSelectedRC(rc);
    setRcData(null);
    setLoading(true); // Start loading
    try {
      const response = await instance.post("/api/rcfull-details", {
        id_number: rc,
      });
      setRcData(response.data?.data || {});
      // console.log("RC Data:", response.data?.data);
    } catch (err) {
      // console.error("Failed to load RC data", err);
      setRcData(null);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <>
      {modalOpen && selectedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setModalOpen(false)}
        >
          <img
            src={selectedImage}
            alt="Full View"
            className="max-w-[90vw] max-h-[90vh] min-w-[400px] rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Prevent modal close on image click
          />
          <button
            className="absolute top-6 right-8 text-white text-3xl font-bold bg-black bg-opacity-50 rounded-full px-3 py-1 hover:bg-opacity-80 transition"
            onClick={() => setModalOpen(false)}
          >
            &times;
          </button>
        </div>
      )}
      <div className="space-y-4 bg-[#0b323d] rounded-xl shadow-md p-6 text-white border border-gray-700">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center text-white">
          <div className="mb-8 flex items-center gap-3">
            <span className="inline-block w-2 h-8 bg-lime-400 rounded-full"></span>
            <h2 className="text-3xl font-extrabold text-white tracking-wide">
              Profile Summary :{" "}
              <span className="text-lime-200">{userInput}</span>
            </h2>
            {profile.isSpam && (
              <span className="text-red-400 text-sm font-medium">
                ⚠ Marked as Spam
              </span>
            )}
          </div>

          {/* {profile.isCreditExists && profile.isCreditExists[0] && (
          <button
            type="button"
            className="text-[#060714] flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-[#ABDE64] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ABDE64] transition-colors w-full sm:w-auto mt-3 md:mt-0"
            onClick={() => generateCreditReport(profile)}
          >
            Credit Report
          </button>
        )} */}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          {profile.profileImages?.length > 0 && (
            <div className="flex flex-wrap gap-4 items-center">
              {profile.profileImages.map((img, idx) => (
                <div key={idx} className="relative flex flex-col items-center">
                  <img
                    src={img.value}
                    alt={`Profile ${idx}`}
                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-200 shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
                    referrerPolicy="no-referrer"
                    onClick={() => {
                      setModalOpen(true);
                      setSelectedImage(img.value);
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/no-image.png";
                    }}
                  />
                  {/* Overlay badge for source */}
                  <span className="absolute bottom-2 right-2 bg-lime-400 text-gray-900 text-xs px-2 py-0.5 rounded-full shadow group-hover:bg-lime-500 transition">
                    {img.source}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

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
          {/* <DataCard title="Last Updated" items={profile.lastUpdated} /> */}
          <DataCard title="Country Codes" items={profile.countryCodes} />
          <DataCard title="Carriers" items={profile.carriers} />
          <DataCard title="Job Profiles" items={profile.jobProfiles} />
          <DataCard
            title="RC Numbers"
            items={profile.rcNumber.map((rc) => ({
              value: (
                <div
                  key={rc}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="text-gray-300 font-medium">{rc}</span>
                  <button
                    onClick={() => handleRCClick(rc)}
                    className="inline-flex items-center gap-3 px-4 py-1 rounded-full bg-custom-lime text-black font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 text-sm"
                  >
                    <span>View Details</span>
                  </button>
                </div>
              ),
            }))}
          />
        </div>

        {/* Social Media Links */}
        {Object.keys(profile.socialMediaPresence).length > 0 && (
          <div className="bg-gray-900/80 p-6 rounded-2xl shadow-lg mb-4">
            <h3 className="text-xl font-bold mb-4 text-white">
              Internet Presence
            </h3>
            <ul className="divide-y divide-gray-800">
              {Object.entries(profile.socialMediaPresence).map(
                ([platform, isPresent]) => (
                  <li
                    key={platform}
                    className="flex items-center justify-between py-3 group transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shadow group-hover:bg-lime-900/20 transition">
                        <IconWithFallback platform={platform} size={24} />
                      </div>
                      <span className="capitalize text-lg font-medium text-gray-100 group-hover:text-lime-200 transition">
                        {platform}
                      </span>
                    </div>
                    {isPresent ? (
                      <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-lime-700/20 text-lime-200 font-semibold text-sm shadow">
                        <Check size={18} color="#34f000" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-700/20 text-red-200 font-semibold text-sm shadow">
                        <X size={18} color="#ff3333" />
                        Inactive
                      </span>
                    )}
                  </li>
                )
              )}
            </ul>
          </div>
        )}

        {/* Other single-value fields */}
        <div className="grid md:grid-cols-2 gap-6 text-white text-md ">
          {profile?.isBusiness && (
            <div className="bg-gray-900 p-4 rounded-lg text-gray-200">
              <h3 className="font-semibold">Whatsapp Business Account</h3>
              <p className="text-gray-700">
                {profile?.isBusiness ? "Yes" : "No"}
              </p>
            </div>
          )}
          {profile?.imsi && (
            <div className="bg-gray-900 p-4 rounded-lg text-gray-200">
              <h3 className="font-semibold">Phone IMSI</h3>
              <p className="text-lime-200">{profile?.imsi || "N/A"}</p>
            </div>
          )}
          {profile?.lastUpdated && (
            <div className="bg-gray-900 p-4 rounded-lg text-gray-200">
              <h3 className="font-semibold">Phone Status</h3>
              <p
                className={
                  profile?.lastUpdated ? "text-lime-200" : "text-red-500"
                }
              >
                {profile?.lastUpdated}
              </p>
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

      <RcPopup
        rc={selectedRC}
        data={rcData}
        loading={loading}
        onClose={() => setSelectedRC(null)}
      />
    </>
  );
};

export default TelProfileCard;
