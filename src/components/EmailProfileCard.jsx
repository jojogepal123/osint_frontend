import { Check, Icon, X } from "lucide-react";
import { useIsEmpty } from "../hook/useIsEmpty";
import IconWithFallback from "./IconWithFallback";
import { useState, useEffect } from "react";

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
              {item.key ? <span className="font-semibold">{item.key}:</span> : null}{" "}
              {item.value}
            </span>
            {item.source && (
              <span className="text-xs text-gray-400 ml-2">({item.source})</span>
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


const EmailProfileCard = ({ profile, userInput, modalOpen, setModalOpen, selectedImage, setSelectedImage }) => {
  //   console.log(profile);
  const isEmpty = useIsEmpty(profile);
  if (isEmpty) return null;
  // if (Object.keys(profile).length < 1) return null;

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
            onClick={e => e.stopPropagation()} // Prevent modal close on image click
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
        <div className="mb-8 flex items-center gap-3">
          <span className="inline-block w-2 h-8 bg-lime-400 rounded-full"></span>
          <h2 className="text-3xl font-extrabold text-white tracking-wide">
            Profile Summary : <span className="text-lime-200">{userInput}</span>
          </h2>
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
          <DataCard title="Locations" items={profile.locations} />
          <DataCard title="Last Updated" items={profile.lastUpdated} />
        </div>

        {/* Social Media Links */}
        {Object.keys(profile.socialMediaPresence).length > 0 && (
          <div className="mt-8 bg-gray-900/80 p-6 rounded-2xl shadow-lg border border-gray-800">
            <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
              <svg className="w-6 h-6 text-lime-400" /* ...icon... */ />
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
                      <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center shadow group-hover:scale-110 group-hover:ring-2 group-hover:ring-lime-400 transition-all duration-200">
                        <IconWithFallback platform={platform} size={28} />
                      </div>
                      <span className="capitalize text-lg font-semibold text-gray-100 group-hover:text-lime-200 transition">
                        {platform}
                      </span>
                    </div>
                    {isPresent ? (
                      <span
                        className="flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-lime-100/30 to-lime-500/30 text-lime-200 font-bold text-base shadow-lg group-hover:scale-105 transition"
                        title="Account found and active"
                      >
                        <Check size={20} color="#34f000" />
                        Active
                      </span>
                    ) : (
                      <span
                        className="flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-red-400/30 to-red-700/30 text-red-200 font-bold text-base shadow-lg group-hover:scale-105 transition"
                        title="No account found"
                      >
                        <X size={20} color="#ff3333" />
                        Inactive
                      </span>
                    )}
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default EmailProfileCard;
