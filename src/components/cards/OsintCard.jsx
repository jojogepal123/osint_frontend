import { FaUser, FaPhone, FaEnvelope, FaBirthdayCake, FaVenusMars, FaChevronDown } from 'react-icons/fa';
import { useState, useEffect, useCallback } from 'react';

export const OsintCard = ({ data = [], type }) => {
  const [openDropdowns, setOpenDropdowns] = useState(() => {
    const initialState = {};
    data.forEach((_, index) => {
      initialState[index] = false;
    });
    return initialState;
  });
  if (!Array.isArray(data) || data.length === 0) return null;

  // Helper function to get value safely
  const getValue = (obj, key) => {
    const keys = Array.isArray(key) ? key : [key];
    return keys.reduce((value, k) => {
      if (value) return value;
      return obj[k] || obj[k.toLowerCase()] || null;
    }, null);
  };

  const toggleDropdown = (index) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getImageUrl = useCallback((result) => {
    const possibleImageKeys = [
      'image', 'imageUrl', 'avatar', 'avatarUrl',
      'profileImage', 'profileImageUrl', 'photo',
      'photoUrl', 'picture', 'pictureUrl',
      'profileUrl'
    ];

    const imageUrl = getValue(result, possibleImageKeys);

    // Validate if URL is an actual image URL (basic check)
    const isValidImageUrl = (url) => {
      if (!url) return false;
      return url.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null ||
        url.startsWith('http') ||
        url.startsWith('data:image');
    };

    return isValidImageUrl(imageUrl) ? imageUrl : null;
  }, []);

  useEffect(() => {
    // Cleanup unused dropdown states
    setOpenDropdowns(prev => {
      const newState = {};
      data.forEach((_, index) => {
        if (prev[index] !== undefined) {
          newState[index] = prev[index];
        }
      });
      return newState;
    });
  }, [data.length]);

  return (
    <div className={`w-full mt-4 ${type === "leak-data-finder" ? "p-0" : "p-4"} rounded-lg ${type === "leak-data-finder" ? "" : "bg-green"}`}>
      <div className="flex flex-wrap gap-6">
        {data.map((result, index) => {
          // Extract priority information
          const name = getValue(result, ['name', 'fullName']);
          const phone = getValue(result, ['phone', 'phoneNumber', 'mobile']);
          const email = getValue(result, ['email', 'emailAddress']);
          const imageUrl = getImageUrl(result);

          // Filter out priority keys for remaining data
          const remainingData = Object.entries(result).filter(
            ([key]) => !['name', 'fullName', 'phone', 'phoneNumber', 'mobile',
              'email', 'emailAddress', 'image', 'imageUrl', 'avatar',
              'avatarUrl', 'profileImage', 'photo', 'picture', 'profileUrl'].includes(key.toLowerCase())
          );

          return (
            <div
              key={index}
              className="w-full md:w-[calc(50%-0.75rem)]"
            >
              <div
                className={`relative backdrop-blur-md ${type === "leak-data-finder" ? "bg-green" : "bg-gray-900/70"} border border-gray-700/50 rounded-xl shadow-xl overflow-hidden`}
                style={{ isolation: 'isolate' }}
              >
                {/* Priority Info Section */}
                <div className="p-6 min-h-40 flex flex-col items-center border-b border-gray-700/50">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-4 bg-gradient-to-r from-lime-200 to-teal-800">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={name || "User"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null; // Prevent infinite loop
                          e.target.src = ''; // Clear the broken image
                          e.target.className = 'hidden'; // Hide the img
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center">
                              <FaUser class="w-10 h-10 text-gray-900" />
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaUser className="w-10 h-10 text-gray-900" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-lime-200 mb-4">
                    {name || "Unknown User"}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {phone && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <FaPhone className="text-lime-200" />
                        <span className="text-sm">{phone}</span>
                      </div>
                    )}
                    {email && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <FaEnvelope className="text-lime-200" />
                        <span className="text-sm truncate">{email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Info Section */}
                {remainingData.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown(index)}
                      aria-expanded={openDropdowns[index]}
                      className="w-full p-4 flex items-center justify-between text-lime-200 hover:bg-gray-900/40 transition-colors duration-200 border-t border-gray-700/50"
                    >
                      <span className="text-sm font-semibold">Additional Information</span>
                      <FaChevronDown
                        className={`transform transition-transform duration-200 ${openDropdowns[index] ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Dropdown Content */}
                    <div
                      aria-hidden={!openDropdowns[index]}
                      className={`w-full bg-gray-900/95 border-t border-gray-700/50 transition-all duration-300 ease-in-out ${openDropdowns[index]
                        ? 'max-h-[500px] opacity-100'
                        : 'max-h-0 opacity-0'
                        } overflow-hidden`}
                    >
                      <div className="p-6 space-y-2">
                        {remainingData.map(([key, value], i) => (
                          <div key={i} className="text-gray-300 text-sm">
                            <span className="capitalize font-medium text-lime-200/80">
                              {key}:
                            </span>{" "}
                            <span className="break-words">
                              {typeof value === "object"
                                ? JSON.stringify(value)
                                : String(value ?? '')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};