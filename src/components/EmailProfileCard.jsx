import { Check, X } from "lucide-react";
import { useIsEmpty } from "../hook/useIsEmpty";
import IconWithFallback from "./IconWithFallback";
import { useState, useEffect } from "react";
import { Mail, User, Phone, MapPin, Calendar, Briefcase, GraduationCap, Code, Globe } from "lucide-react";

const InfoList = ({ title, items, icon: IconComponent }) => {
  if (!items || items.length === 0) return null;

  return (
    <div>
      <h3 className="text-base font-semibold text-cyan-400 mb-3 flex items-center gap-2">
        {IconComponent && <IconComponent className="w-4 h-4" />}
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex flex-col gap-1">
            <div className="flex items-start gap-2">
              {item.key && (
                <span className="text-sm text-emerald-400 font-medium">{item.key}:</span>
              )}
              <span className="text-slate-300 text-sm">{item.value}</span>
            </div>
            <div className="flex items-center gap-3">
              {item.source && (
                <span className="text-xs text-slate-500 px-2 py-0.5 rounded-full bg-slate-800/50">
                  {item.source}
                </span>
              )}
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
                >
                  {item.urlLabel || "View"} →
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const DataCard = ({ title, items, icon: IconComponent }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl shadow-lg p-5 min-h-[120px] flex flex-col justify-between border border-slate-700/50 hover:border-cyan-500/30 hover:bg-slate-900/80 transition-all duration-300 group">
      <InfoList title={title} items={items} icon={IconComponent} />
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

const EmailProfileCard = ({
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
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);


  return (
    <>
      {modalOpen && selectedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <img
            src={selectedImage}
            alt="Full View"
            className="max-w-[90vw] max-h-[90vh] min-w-[400px] rounded-2xl shadow-2xl border border-slate-700/50"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-6 right-8 text-white text-3xl font-bold bg-slate-800/50 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-slate-700/50 transition"
            onClick={() => setModalOpen(false)}
          >
            &times;
          </button>
        </div>
      )}
      
      <div className="space-y-6 bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 text-white border border-slate-700/50">
        {/* Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-slate-700/50">
          <div className="w-1 h-14 bg-gradient-to-b from-cyan-400 to-emerald-400 rounded-full shadow-lg shadow-cyan-500/30"></div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Profile Summary
            </h2>
            <p className="flex items-center gap-2 text-cyan-400 font-medium mt-1">
              <Mail className="w-4 h-4" />
              {userInput}
            </p>
          </div>
        </div>

        {/* Profile Images */}
        <div className="flex flex-col md:flex-row items-start gap-6">
          {profile.profileImages?.length > 0 && (
            <div className="flex flex-wrap gap-4 items-center">
              {profile.profileImages.map((img, idx) => (
                <div key={idx} className="relative flex flex-col items-center group">
                  <div className="relative overflow-hidden rounded-full">
                    <img
                      src={img.value}
                      alt={`Profile ${idx}`}
                      className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-2 border-cyan-500/30 shadow-xl shadow-cyan-500/10 hover:shadow-cyan-500/30 transition-all duration-300 cursor-pointer group-hover:scale-105"
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
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                  </div>
                  <span className="mt-2 text-xs px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    {img.source}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Personal Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DataCard title="Full Names and Alias" items={profile.fullNames} icon={User} />
          <DataCard title="Usernames" items={profile.userNames} icon={User} />
          <DataCard title="Phone Numbers" items={profile.phoneNumbers} icon={Phone} />
          <DataCard title="Emails" items={profile.emails} icon={Mail} />
          <DataCard title="Basic Info" items={profile.basicInfo} icon={User} />
          <DataCard title="Locations" items={profile.locations} icon={MapPin} />
          <DataCard title="Last Updated" items={profile.lastUpdated} icon={Calendar} />
          
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
              icon={GraduationCap}
            />
          )}

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
              icon={Briefcase}
            />
          )}

          {profile.skills?.length > 0 && (
            <DataCard
              title="Skills"
              items={profile.skills.map((s) => ({
                value: s.value,
                source: s.source,
              }))}
              icon={Code}
            />
          )}
        </div>

        {/* Social Media Links */}
        {Object.keys(profile.socialMediaPresence).length > 0 && (
          <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">Internet Presence</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(profile.socialMediaPresence).map(
                ([platform, isPresent]) => (
                  <div
                    key={platform}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                      isPresent 
                        ? "bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20" 
                        : "bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isPresent ? "bg-emerald-500/20" : "bg-slate-700/50"
                      }`}>
                        <IconWithFallback platform={platform} size={24} />
                      </div>
                      <span className="capitalize font-medium text-slate-200">
                        {platform}
                      </span>
                    </div>
                    {isPresent ? (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                        <Check className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-700/50 text-slate-400 text-xs font-medium border border-slate-600/30">
                        <X className="w-3 h-3" />
                        Inactive
                      </span>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EmailProfileCard;
