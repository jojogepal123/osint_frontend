import { Check, X } from "lucide-react";
import { useIsEmpty } from "../hook/useIsEmpty";
import { useState, useEffect } from "react";
import instance from "../api/axios";
import IconWithFallback from "./IconWithFallback";
import RcPopup from "./RcPopup";
import CreditReportModal from "./CreditReportModal";
import { toast } from "react-toastify";
import useAuthContext from "../context/AuthContext";
import { Phone, User, Mail, MapPin, CreditCard, Shield, Car, Building2, AlertTriangle, Globe, FileText, Briefcase } from "lucide-react";

const InfoList = ({ title, items, onCreditReport, icon: IconComponent }) => {
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
            <span className="text-slate-300 text-sm">
              {typeof item.value === "string" && item.value.includes("\n") ? (
                <span className="whitespace-pre-line">{item.value}</span>
              ) : (
                item.value
              )}
            </span>
            <div className="flex items-center gap-2 ml-auto flex-shrink-0">
              {item.source && (
                <span className="text-xs text-slate-500 px-2 py-0.5 rounded-full bg-slate-800/50">
                  {item.source}
                </span>
              )}
              {onCreditReport &&
                (item.key === "pan_number" || item.key === "PAN Number") &&
                item.value && (
                  <button
                    className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-semibold border border-cyan-500/30 hover:bg-cyan-500/30 transition"
                    onClick={() => onCreditReport(item.value)}
                  >
                    Credit Report
                  </button>
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

const TelProfileCard = ({
  profile,
  userInput,
  modalOpen,
  setModalOpen,
  selectedImage,
  setSelectedImage,
}) => {
  const isEmpty = useIsEmpty(profile);

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
  const [selectedRC, setSelectedRC] = useState(null);
  const [selectedUpi, setSelectedUpi] = useState(null);
  const [selectedChallan, setSelectedChallan] = useState(null);
  const [upiData, setUpiData] = useState(null);
  const [rcData, setRcData] = useState(null);
  const [challanData, setChallanData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { updateUser, hasSufficientCredits } = useAuthContext();
  const [creditModalOpen, setCreditModalOpen] = useState(false);
  const [creditModalData, setCreditModalData] = useState({
    pan: "",
    name: "",
    mobile: "",
  });

  if (isEmpty) return null;

  const handleRCClick = async (rc) => {
    setSelectedRC(rc);
    setRcData(null);
    setLoading(true);
    if (!hasSufficientCredits()) {
      toast.warning("Insufficient credits. Please upgrade your plan.");
      return;
    }
    try {
      const response = await instance.post("/api/rcfull-details", {
        id_number: rc,
      });
      const credits = response.data?.credits;
      const data = response.data?.data || {};
      if (credits !== undefined) {
        updateUser({ credits });
      }
      setRcData(data.data || {});
    } catch (err) {
      if (err.response?.status === 402) {
        const message = err.response?.data?.message || "Insufficient credits.";
        toast.warning(message);
      } else {
        toast.error("something went Wrong");
      }
      setRcData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpiClick = async (upi) => {
    setLoading(true);
    setUpiData(null);
    setSelectedUpi(upi);
    if (!hasSufficientCredits()) {
      toast.warning("Insufficient credits. Please upgrade your plan.");
      return;
    }
    try {
      const response = await instance.post("/api/upifull-details", {
        upi_id: upi,
      });
      const credits = response.data?.credits;
      const data = response.data?.data || {};
      if (credits !== undefined) {
        updateUser({ credits });
      }
      setUpiData(data.data || {});
    } catch (err) {
      if (err.response?.status === 402) {
        const message = err.response?.data?.message || "Insufficient credits.";
        toast.warning(message);
      } else {
        toast.error("something went Wrong");
      }
      setUpiData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCreditReport = (panNumber) => {
    const name =
      profile.fullNames?.find((n) => n?.source === "Gov")?.value || "";
    const mobile =
      profile.phones?.find((ph) => ph.source === "Gov")?.value || "";
    setCreditModalData({ pan: panNumber, name, mobile });
    setCreditModalOpen(true);
  };

  const handleChallanClick = async (rc) => {
    if (!hasSufficientCredits()) {
      toast.warning("Insufficient credits. Please upgrade your plan.");
      return;
    }
    setLoading(true);
    setSelectedChallan(rc);
    setChallanData(null);

    try {
      const response = await instance.post("/api/rc-challan-details", {
        rc_number: rc,
      });

      const credits = response.data?.credits;
      if (credits !== undefined) {
        updateUser({ credits });
      }
      const details = response.data?.data?.data || {};
      const isEmpty =
        !details.challan_details || details.challan_details.length === 0;

      if (isEmpty) {
        toast.warning("No data found on this RC number");
      }
      setChallanData(details || {});
    } catch (err) {
      if (err.response?.status === 402) {
        const message = err.response?.data?.message || "Insufficient credits.";
        toast.warning(message);
      } else {
        toast.error("Failed to fetch RC details");
      }
      setChallanData(null);
    } finally {
      setLoading(false);
    }
  };

  const primaryName = profile.fullNames?.find((n) => n?.source === "Gov")?.value || 
                      profile.fullNames?.[0]?.value || 
                      "Unknown";
  const primaryPhone = profile.phones?.[0]?.value || userInput;
  const primaryEmail = profile.emails?.[0]?.value;
  const primaryLocation = profile.locations?.[0]?.value || 
                         profile.verifiedAddress?.[0]?.value;

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
            className="max-w-[90vw] max-h-[90vh] w-full rounded-2xl shadow-2xl border border-slate-700/50"
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
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {primaryName}
                  </h1>
                  {profile.isSpam && (
                    <span className="inline-flex items-center gap-1 text-red-400 text-sm font-medium bg-red-500/10 px-3 py-1 rounded-full border border-red-500/30 mt-2">
                      <AlertTriangle className="w-3 h-3" />
                      Marked as Spam
                    </span>
                  )}
                </div>
              </div>
              
              {/* Contact Bar */}
              <div className="flex flex-wrap gap-4 mt-3 text-sm">
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <span>{primaryPhone}</span>
                </div>
                {primaryEmail && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-4 h-4 text-cyan-400" />
                    <span>{primaryEmail}</span>
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
                  <InfoList title="Phone Numbers" items={profile.phones} icon={Phone} />
                  <InfoList title="Emails" items={profile.emails} icon={Mail} />
                </div>
              </ResumeSection>

              <ResumeSection title="Financial Information" icon={CreditCard}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoList title="Bank Details" items={profile.bankDetails} icon={CreditCard} />
                  <InfoList title="UPI IDs" items={
                    Array.isArray(profile.upiDetails)
                      ? profile.upiDetails.map((upi, idx) => ({
                          value: (
                            <div key={idx} className="flex items-center justify-between gap-4">
                              <span className="text-slate-300 font-medium">{upi.value}</span>
                              <button
                                onClick={() => handleUpiClick(upi.value)}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/20 text-cyan-400 font-medium shadow-md hover:bg-cyan-500/30 border border-cyan-500/30 transition-all text-sm"
                              >
                                View Details
                              </button>
                            </div>
                          ),
                          source: upi.source,
                        }))
                      : profile.upiDetails
                      ? [{
                          value: (
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-slate-300 font-medium">{profile.upiDetails.value}</span>
                              <button
                                onClick={() => handleUpiClick(profile.upiDetails.value)}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/20 text-cyan-400 font-medium shadow-md hover:bg-cyan-500/30 border border-cyan-500/30 transition-all text-sm"
                              >
                                View Details
                              </button>
                            </div>
                          ),
                          source: profile.upiDetails.source,
                        }]
                      : []
                  } icon={CreditCard} />
                </div>
              </ResumeSection>

              <ResumeSection title="Identity & Address" icon={Shield}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoList title="Identity Proofs" items={profile.idProofs} onCreditReport={handleCreditReport} icon={Shield} />
                  <InfoList title="Verified Address" items={profile.verifiedAddress} icon={MapPin} />
                  <InfoList title="Locations" items={profile.locations} icon={MapPin} />
                </div>
              </ResumeSection>

              <ResumeSection title="Vehicle Information" icon={Car}>
                <InfoList title="RC Numbers" items={profile.rcNumber?.map((rc) => ({
                  value: (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <span className="text-slate-300 font-medium">{rc}</span>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleRCClick(rc)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/20 text-cyan-400 font-medium shadow-md hover:bg-cyan-500/30 border border-cyan-500/30 transition-all text-xs"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleChallanClick(rc)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium shadow-md hover:bg-emerald-500/30 border border-emerald-500/30 transition-all text-xs"
                        >
                          Challan Details
                        </button>
                      </div>
                    </div>
                  ),
                }))} icon={Car} />
              </ResumeSection>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <ResumeSection title="Basic Info" icon={User}>
                <InfoList items={profile.basicInfo} />
              </ResumeSection>

              <ResumeSection title="Carrier Info" icon={Building2}>
                <InfoList title="Carriers" items={profile.carriers} icon={Building2} />
                <InfoList title="Country Codes" items={profile.countryCodes} icon={Globe} />
              </ResumeSection>

              <ResumeSection title="Professional" icon={Briefcase}>
                <InfoList title="Job Profiles" items={profile.jobProfiles} icon={Building2} />
                <InfoList title="Bio" items={profile.telBio} icon={User} />
              </ResumeSection>

              {profile?.isBusiness && (
                <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-semibold text-white text-sm">Whatsapp Business</h4>
                  </div>
                  <p className="text-emerald-400 font-medium text-sm">Yes</p>
                </div>
              )}

              {profile?.imsi && (
                <div className="mb-4 p-3 rounded-lg bg-slate-800/50">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <h4 className="font-semibold text-white text-sm">Phone IMSI</h4>
                  </div>
                  <p className="text-cyan-400 font-mono text-sm">{profile?.imsi}</p>
                </div>
              )}

              {profile?.lastUpdated && (
                <div className="mb-4 p-3 rounded-lg bg-slate-800/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-semibold text-white text-sm">Phone Status</h4>
                  </div>
                  <p className="text-emerald-400 text-sm">{profile?.lastUpdated}</p>
                </div>
              )}

              {/* Internet Presence as Sidebar Section */}
              {profile.socialMediaPresence && Object.keys(profile.socialMediaPresence).length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700/50">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <h4 className="text-sm font-semibold text-white uppercase tracking-wide">Internet Presence</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(profile.socialMediaPresence || {}).map(
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

          {profile.facebook?.profile_url && (
            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <h4 className="text-sm font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Facebook Profile
              </h4>
              <a
                href={profile.facebook.profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 hover:underline break-all text-sm"
              >
                {profile.facebook.profile_url}
              </a>
            </div>
          )}
        </div>
      </div>

      <RcPopup
        id={selectedChallan || selectedUpi || selectedRC}
        type={selectedChallan ? "challan" : selectedUpi ? "upi" : "rc"}
        data={selectedChallan ? challanData : selectedUpi ? upiData : rcData}
        loading={loading}
        onClose={() => {
          setSelectedRC(null);
          setSelectedUpi(null);
          setSelectedChallan(null);
        }}
      />

      <CreditReportModal
        open={creditModalOpen}
        onClose={() => setCreditModalOpen(false)}
        pan={creditModalData.pan}
        name={creditModalData.name}
        mobile={creditModalData.mobile}
      />
    </>
  );
};

export default TelProfileCard;
