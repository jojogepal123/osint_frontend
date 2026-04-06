import { FaUser, FaPhone, FaEnvelope, FaChevronDown } from 'react-icons/fa';
import { useState, useEffect, useCallback } from 'react';

export const OsintCard = ({ data = [], type }) => {
  const [openDropdowns, setOpenDropdowns] = useState(() => {
    const initialState = {};
    data.forEach((_, index) => {
      initialState[index] = false;
    });
    return initialState;
  });
  const [imageErrors, setImageErrors] = useState({});

  const getValue = (obj, key) => {
    const keys = Array.isArray(key) ? key : [key];
    return keys.reduce((value, k) => {
      if (value !== null && value !== undefined) return value;
      return (obj[k] !== undefined && obj[k] !== null) ? obj[k] : ((obj[k.toLowerCase()] !== undefined && obj[k.toLowerCase()] !== null) ? obj[k.toLowerCase()] : null);
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

    const isValidImageUrl = (url) => {
      if (!url) return false;
      return url.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null ||
        url.startsWith('http') ||
        url.startsWith('data:image');
    };

    return isValidImageUrl(imageUrl) ? imageUrl : null;
  }, [getValue]);

  useEffect(() => {
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

  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <div className={`w-full mt-4 ${type === "leak-data-finder" ? "p-0" : ""}`}>
      <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-700/50">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
          <FaUser className="w-4 h-4 text-cyan-400" />
        </div>
        <h3 className="text-lg font-semibold text-white uppercase tracking-wide">OSINT Data</h3>
        <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded-full">{data.length} record{data.length > 1 ? 's' : ''}</span>
      </div>
      <div className="space-y-3">
        {data.map((result, index) => {
          const name = getValue(result, ['name', 'fullName']);
          const phone = getValue(result, ['phone', 'phoneNumber', 'mobile']);
          const email = getValue(result, ['email', 'emailAddress']);
          const imageUrl = getImageUrl(result);
          const hasImageError = imageErrors[index];

          const remainingData = Object.entries(result).filter(
            ([key]) => !['name', 'fullName', 'phone', 'phoneNumber', 'mobile',
              'email', 'emailAddress', 'image', 'imageUrl', 'avatar',
              'avatarUrl', 'profileImage', 'photo', 'picture', 'profileUrl'].includes(key.toLowerCase())
          );

          return (
            <div
              key={index}
              className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden"
            >
              {/* Profile Header */}
              <div className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 flex-shrink-0 flex items-center justify-center">
                  {imageUrl && !hasImageError ? (
                    <img
                      src={imageUrl}
                      alt={name || "User"}
                      className="w-full h-full object-cover"
                      onError={() => setImageErrors(prev => ({ ...prev, [index]: true }))}
                    />
                  ) : (
                    <FaUser className="w-5 h-5 text-cyan-400" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold text-base truncate">
                    {name || "Unknown User"}
                  </h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-slate-400">
                    {phone && (
                      <span className="flex items-center gap-1.5">
                        <FaPhone className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                        <span className="truncate">{phone}</span>
                      </span>
                    )}
                    {email && (
                      <span className="flex items-center gap-1.5">
                        <FaEnvelope className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                        <span className="truncate">{email}</span>
                      </span>
                    )}
                  </div>
                </div>

                {remainingData.length > 0 && (
                  <button
                    onClick={() => toggleDropdown(index)}
                    aria-expanded={openDropdowns[index]}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 text-cyan-400 text-xs font-medium hover:bg-slate-800/70 transition-colors flex-shrink-0"
                  >
                    <span>Details</span>
                    <FaChevronDown
                      className={`w-3 h-3 transform transition-transform duration-200 ${openDropdowns[index] ? 'rotate-180' : ''}`}
                    />
                  </button>
                )}
              </div>

              {/* Expandable Details */}
              {remainingData.length > 0 && (
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${openDropdowns[index]
                    ? 'max-h-[500px] opacity-100'
                    : 'max-h-0 opacity-0'
                    }`}
                >
                  <div className="px-4 pb-4 pt-2 bg-slate-800/30 border-t border-slate-700/30">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                      {remainingData.map(([key, value], i) => (
                        <div key={i} className="flex items-start gap-2 py-1.5">
                          <span className="text-xs text-emerald-400 font-medium capitalize whitespace-nowrap">
                            {key}:
                          </span>
                          <span className="text-xs text-slate-300 break-words">
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
          );
        })}
      </div>
    </div>
  );
};
