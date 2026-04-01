import { Check, X } from "lucide-react";
import { useIsEmpty } from "../hook/useIsEmpty";
import IconWithFallback from "./IconWithFallback";
import { useState, useEffect } from "react";
import { Mail, User, Phone, MapPin, Calendar, Briefcase, GraduationCap, Code, Globe } from "lucide-react";

const InfoList = ({ title, items, icon: IconComponent }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-cyan-400 mb-2 flex items-center gap-2 uppercase tracking-wide">
        {IconComponent && <IconComponent className="w-3.5 h-3.5" />}
        {title}
      </h3>
      <ul className="space-y-1.5">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">
            {item.key && (
              <span className="text-xs text-emerald-400 font-medium whitespace-nowrap">{item.key}:</span>
            )}
            <span className="text-slate-300 text-sm">{item.value}</span>
            <div className="flex items-center gap-2 ml-auto flex-shrink-0">
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

const ResumeSection = ({ title, children, icon: IconComponent }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-700/50">
        {IconComponent && <IconComponent className="w-4 h-4 text-cyan-400" />}
        <h3 className="text-lg font-semibold text-white uppercase tracking-wide">{title}</h3>
      </div>
      {children}
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

  const primaryName = profile.fullNames?.[0]?.value || "Unknown";
  const primaryEmail = profile.emails?.[0]?.value || userInput;
  const primaryPhone = profile.phoneNumbers?.[0]?.value;
  const primaryLocation = profile.locations?.[0]?.value;

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
      
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl text-white border border-slate-700/50 overflow-hidden">
        {/* Resume Header */}
        <div className="bg-gradient-to-r from-slate-900/80 to-slate-800/60 p-6 md:p-8 border-b border-slate-700/50">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              {profile.profileImages?.length > 0 ? (
                <div className="relative group cursor-pointer" onClick={() => {
                  setModalOpen(true);
                  setSelectedImage(profile.profileImages[0].value);
                }}>
                  <img
                    src={profile.profileImages[0].value}
                    alt="Profile"
                    className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-cyan-500/30 shadow-xl"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/no-image.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ) : (
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border-2 border-cyan-500/30 flex items-center justify-center">
                  <User className="w-10 h-10 text-cyan-400" />
                </div>
              )}
            </div>

            {/* Header Info */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                {primaryName}
              </h1>
              
              {/* Contact Bar */}
              <div className="flex flex-wrap gap-4 mt-3 text-sm">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>{primaryEmail}</span>
                </div>
                {primaryPhone && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-4 h-4 text-cyan-400" />
                    <span>{primaryPhone}</span>
                  </div>
                )}
                {primaryLocation && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>{primaryLocation}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Resume Body */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              <ResumeSection title="Personal Information" icon={User}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoList title="Full Names" items={profile.fullNames} icon={User} />
                  <InfoList title="Usernames" items={profile.userNames} icon={User} />
                  <InfoList title="Phone Numbers" items={profile.phoneNumbers} icon={Phone} />
                  <InfoList title="Emails" items={profile.emails} icon={Mail} />
                </div>
              </ResumeSection>

              {profile.experience?.length > 0 && (
                <ResumeSection title="Experience" icon={Briefcase}>
                  {profile.experience.map((e, idx) => (
                    <div key={idx} className="mb-4 last:mb-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="text-white font-medium">{e.title}</h4>
                        <span className="text-xs text-slate-400">{e.startYear} - {e.endYear}</span>
                      </div>
                      <p className="text-cyan-400 text-sm mb-1">{e.company}</p>
                      {e.source && (
                        <span className="text-xs text-slate-500 px-2 py-0.5 rounded-full bg-slate-800/50">
                          {e.source}
                        </span>
                      )}
                    </div>
                  ))}
                </ResumeSection>
              )}

              {profile.qualifications?.length > 0 && (
                <ResumeSection title="Education" icon={GraduationCap}>
                  {profile.qualifications.map((q, idx) => (
                    <div key={idx} className="mb-4 last:mb-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="text-white font-medium">{q.degree} in {q.field}</h4>
                        <span className="text-xs text-slate-400">{q.startYear} - {q.endYear}</span>
                      </div>
                      <p className="text-cyan-400 text-sm mb-1">{q.school}</p>
                      {q.source && (
                        <span className="text-xs text-slate-500 px-2 py-0.5 rounded-full bg-slate-800/50">
                          {q.source}
                        </span>
                      )}
                    </div>
                  ))}
                </ResumeSection>
              )}

              {profile.skills?.length > 0 && (
                <ResumeSection title="Skills" icon={Code}>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-full bg-cyan-500/20 text-cyan-400 text-sm border border-cyan-500/30"
                      >
                        {s.value}
                      </span>
                    ))}
                  </div>
                </ResumeSection>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <ResumeSection title="Basic Info" icon={User}>
                <InfoList items={profile.basicInfo} />
              </ResumeSection>

              <ResumeSection title="Locations" icon={MapPin}>
                <InfoList items={profile.locations} />
              </ResumeSection>

              {profile.lastUpdated?.length > 0 && (
                <ResumeSection title="Last Updated" icon={Calendar}>
                  <InfoList items={profile.lastUpdated} />
                </ResumeSection>
              )}

              {/* Internet Presence as Sidebar Section */}
              {Object.keys(profile.socialMediaPresence).length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700/50">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <h4 className="text-sm font-semibold text-white uppercase tracking-wide">Internet Presence</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(profile.socialMediaPresence).map(
                      ([platform, isPresent]) => (
                        <div
                          key={platform}
                          className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border transition-all duration-300 ${
                            isPresent 
                              ? "bg-slate-800/60 border-cyan-500/30" 
                              : "bg-slate-900/30 border-slate-800/50 opacity-50"
                          }`}
                        >
                          <div className={`w-6 h-6 rounded flex-shrink-0 flex items-center justify-center ${
                            isPresent ? "bg-cyan-500/20" : "bg-slate-800/50"
                          }`}>
                            <IconWithFallback platform={platform} size={14} />
                          </div>
                          <span className={`text-xs font-medium truncate ${
                            isPresent ? "text-white" : "text-slate-500"
                          }`}>
                            {platform}
                          </span>
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            isPresent ? "bg-emerald-400 shadow-sm shadow-emerald-400/50" : "bg-slate-700"
                          }`}></div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailProfileCard;
