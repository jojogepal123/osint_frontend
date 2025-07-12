import { Check, Icon, X } from "lucide-react";
import { useIsEmpty } from "../hook/useIsEmpty";
import IconWithFallback from "./IconWithFallback";

const InfoList = ({ title, items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <ul className="ml-5 list-disc text-md text-gray-300">
        {items.map((item, idx) => (
          <li key={idx}>
            {item.key ? item.key + " : " : ""}
            {item.value}
            {item.source && (
              <span className="text-sm text-gray-500"> ({item.source})</span>
            )}
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-400 hover:underline"
              >
                {item.urlLabel || "View"}
              </a>
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
    <div className="bg-gray-900 p-4 rounded-lg text-gray-200 mb-4">
      <InfoList title={title} items={items} />
    </div>
  );
};

const iconMap = {
  "X (Twitter)": "twitter",
  "Chess.Com": "chesscom",
  "Google+": "googleplus",
  Picsart: "picsartstudio",
};

const getIconUrl = (platform) => {
  const key =
    iconMap[platform] || platform.toLowerCase().replace(/[\s().]/g, "");
  return `https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/${key}.svg`;
};

const EmailProfileCard = ({ profile, userInput }) => {
  //   console.log(profile);
  const isEmpty = useIsEmpty(profile);
  if (isEmpty) return null;
  // if (Object.keys(profile).length < 1) return null;

  return (
    <div className="space-y-4 bg-[#0b323d] rounded-xl shadow-md p-6 text-white border border-gray-700">
      {/* Header */}
      <div className="text-white text-center md:text-left">
        <h2 className="text-2xl font-bold">
          Profile Summary : <span>{userInput}</span>
        </h2>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-4">
        {profile.profileImages?.length > 0 && (
          <div className="flex flex-wrap gap-4 items-center">
            {profile.profileImages.map((img, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <img
                  src={img.value}
                  alt={`Profile ${idx}`}
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/no-image.png"; // fallback image (you can add this in your public folder)
                  }}
                />
                <span className="text-xs text-gray-400 mt-1">{img.source}</span>
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
        {/* Qualifications */}
        {profile.qualifications?.length > 0 && (
          <DataCard
            title="Qualifications"
            items={profile.qualifications.map((q) => ({
              key: `${q.degree} in ${q.field}`,
              value: `${q.school} (${q.startYear} - ${q.endYear})`,
              source: q.source,
              url: q.url,
              urlLabel: "View School",
            }))}
          />
        )}

        {/* Experience */}
        {profile.experience?.length > 0 && (
          <DataCard
            title="Experience"
            items={profile.experience.map((e) => ({
              key: e.title,
              value: `${e.company} (${e.startYear} - ${e.endYear})`,
              source: e.source,
              url: e.url,
              urlLabel: "View Company",
            }))}
          />
        )}

        {/* Skills */}
        {profile.skills?.length > 0 && (
          <DataCard
            title="Skills"
            items={profile.skills.map((s) => ({
              value: s.value,
              source: s.source,
            }))}
          />
        )}
      </div>
      {/* {Array.isArray(profile.qualifications) &&
        profile.qualifications.length > 0 && (
          <div className="bg-gray-900 p-4 rounded-lg text-white ">
            <h3 className="text-xl font-semibold mb-3">Qualifications</h3>
            <ul className="space-y-2 list-disc ml-6 text-gray-300">
              {profile.qualifications.map((q, idx) => (
                <li key={idx}>
                  <div className="text-md">
                    <span className="font-semibold">{q.degree}</span>
                    {q.field && ` in ${q.field}`},{" "}
                    <span className="italic">{q.school}</span>{" "}
                    {q.startYear && q.endYear && (
                      <span className="text-sm text-gray-400">
                        ({q.startYear} - {q.endYear})
                      </span>
                    )}
                    {q.url && (
                      <a
                        href={q.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-blue-400 hover:underline"
                      >
                        View School on LinkedIn
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      {Array.isArray(profile.experience) && profile.experience.length > 0 && (
        <div className="bg-gray-900 p-4 rounded-lg text-white border border-gray-700">
          <h3 className="text-xl font-semibold mb-3">Work Experience</h3>
          <ul className="space-y-2 list-disc ml-6 text-gray-300">
            {profile.experience.map((exp, idx) => (
              <li key={idx}>
                <div className="text-md">
                  <span className="font-semibold">{exp.title}</span>
                  {exp.company && ` at ${exp.company}`},{" "}
                  {exp.startYear && exp.endYear && (
                    <span className="text-sm text-gray-400">
                      ({exp.startYear} - {exp.endYear})
                    </span>
                  )}
                  {exp.url && (
                    <a
                      href={exp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-blue-400 hover:underline"
                    >
                      View Company
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {Array.isArray(profile.skills) && profile.skills.length > 0 && (
        <div className="bg-gray-900 p-4 rounded-lg text-white border border-gray-700">
          <h3 className="text-xl font-semibold mb-3">Skills</h3>
          <ul className="space-y-2 list-disc ml-6 text-gray-300">
            {profile.skills.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
        </div>
      )} */}
      {/* Social Media Links */}
      {Object.keys(profile.socialMediaPresence).length > 0 && (
        <div className="bg-gray-900 p-4 rounded-lg">
          <div className="bg-gray-900 p-4 rounded w-full md:w-2/3 text-white">
            <h3 className="text-xl font-semibold mb-3">Internet Presence</h3>
            <ul className="space-y-2">
              {Object.entries(profile.socialMediaPresence).map(
                ([platform, isPresent]) => (
                  <li
                    key={platform}
                    className="flex items-center justify-between text-md text-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <IconWithFallback platform={platform} size={20} />
                      <span className="capitalize">{platform}</span>
                    </div>
                    {isPresent ? (
                      <span className="py-0.5 px-3 bg-green rounded-xl flex gap-2 items-center">
                        <Check size={20} color="#34f000" />
                        active
                      </span>
                    ) : (
                      <X />
                    )}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailProfileCard;
