import { FaUser, FaPhone, FaEnvelope, FaBirthdayCake, FaVenusMars } from 'react-icons/fa';

export const OsintCard = ({ data = [] }) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  // Helper function to get value safely
  const getValue = (obj, key) => {
    const keys = Array.isArray(key) ? key : [key];
    return keys.reduce((value, k) => {
      if (value) return value;
      return obj[k] || obj[k.toLowerCase()] || null;
    }, null);
  };

  const getImageUrl = (result) => {
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
  };

  return (
    <div className="w-full mt-4 p-4 rounded-lg bg-green">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((result, index) => {
          // Extract priority information
          const name = getValue(result, ['name', 'fullName', 'username']);
          const phone = getValue(result, ['phone', 'phoneNumber', 'mobile']);
          const email = getValue(result, ['email', 'emailAddress']);
          const age = getValue(result, ['age', 'years']);
          const dob = getValue(result, ['dob', 'dateOfBirth']);
          const gender = getValue(result, ['gender', 'sex']);
          const imageUrl = getImageUrl(result);

          // Filter out priority keys for remaining data
          const remainingData = Object.entries(result).filter(
            ([key]) => !['name', 'fullName', 'username', 'phone', 'phoneNumber', 'mobile',
              'email', 'emailAddress', 'age', 'years', 'gender', 'sex', 'dob', 'dateOfBirth', 'image', 'imageUrl', 'avatar',
              'avatarUrl', 'profileImage', 'photo', 'picture', 'profileUrl'].includes(key.toLowerCase())
          );

          return (
            <div
              key={index}
              className="relative backdrop-blur-md bg-gray-900/70 border border-gray-700/50 rounded-xl shadow-xl overflow-hidden"
            >
              {/* Priority Info Section */}
              <div className="p-6 flex flex-col items-center border-b border-gray-700/50">
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
                  {age && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <FaBirthdayCake className="text-lime-200" />
                      <span className="text-sm">{age} years</span>
                    </div>
                  )}
                  {gender && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <FaVenusMars className="text-lime-200" />
                      <span className="text-sm capitalize">{gender}</span>
                    </div>
                  )}
                  {dob && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <FaBirthdayCake className="text-lime-200" />
                      <span className="text-sm">{dob}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Info Section */}
              {remainingData.length > 0 && (
                <div className="p-6 bg-gray-900/40">
                  <h4 className="text-lime-200 text-sm font-semibold mb-3">Additional Information</h4>
                  <div className="space-y-2">
                    {remainingData.map(([key, value], i) => (
                      <div key={i} className="text-gray-300 text-sm">
                        <span className="capitalize font-medium text-lime-200/80">{key}:</span>{" "}
                        <span className="break-words">
                          {typeof value === "object"
                            ? JSON.stringify(value, null, 2)
                            : value?.toString()}
                        </span>
                      </div>
                    ))}
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