import { Check, X } from "lucide-react";
import { useIsEmpty } from "../hook/useIsEmpty";
import React, { useState, useEffect } from "react";
import instance from "../api/axios";
import IconWithFallback from "./IconWithFallback";
import RcPopup from "./RcPopup";
import CreditReportModal from "./CreditReportModal";
import { toast } from "react-toastify";
import useAuthContext from "../context/AuthContext";
import { Phone, User, Mail, MapPin, CreditCard, Shield, Car, Building2, AlertTriangle, Globe, FileText } from "lucide-react";

const InfoList = ({ title, items, onCreditReport, icon: IconComponent }) => {
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
              <span className="text-slate-300 text-sm">
                {typeof item.value === "string" && item.value.includes("\n") ? (
                  <span className="whitespace-pre-line">{item.value}</span>
                ) : (
                  item.value
                )}
              </span>
            </div>
            <div className="flex items-center gap-3">
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

const DataCard = ({ title, items, onCreditReport, icon: IconComponent }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl shadow-lg p-5 min-h-[120px] flex flex-col justify-between border border-slate-700/50 hover:border-cyan-500/30 hover:bg-slate-900/80 transition-all duration-300 group">
      <InfoList title={title} items={items} onCreditReport={onCreditReport} icon={IconComponent} />
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
      profile.fullNames?.find((n) => n.source === "Gov")?.value || "";
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
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Profile Summary
              </h2>
              <p className="flex items-center gap-2 text-cyan-400 font-medium">
                <Phone className="w-4 h-4" />
                {userInput}
              </p>
              {profile.isSpam && (
                <span className="flex items-center gap-1 text-red-400 text-sm font-medium bg-red-500/10 px-3 py-1 rounded-full border border-red-500/30">
                  <AlertTriangle className="w-4 h-4" />
                  Marked as Spam
                </span>
              )}
            </div>
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
          <DataCard title="Phone Numbers" items={profile.phones} icon={Phone} />
          <DataCard title="Emails" items={profile.emails} icon={Mail} />
          <DataCard title="Basic Info" items={profile.basicInfo} icon={User} />
          <DataCard title="Bank Details" items={profile.bankDetails} icon={CreditCard} />
          
          <DataCard
            title="Upi Ids"
            items={
              Array.isArray(profile.upiDetails)
                ? profile.upiDetails.map((upi, idx) => ({
                    value: (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-4"
                      >
                        <span className="text-slate-300 font-medium">
                          {upi.value}
                        </span>
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
                ? [
                    {
                      value: (
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-300 font-medium">
                            {profile.upiDetails.value}
                          </span>
                          <button
                            onClick={() =>
                              handleUpiClick(profile.upiDetails.value)
                            }
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/20 text-cyan-400 font-medium shadow-md hover:bg-cyan-500/30 border border-cyan-500/30 transition-all text-sm"
                          >
                            View Details
                          </button>
                        </div>
                      ),
                      source: profile.upiDetails.source,
                    },
                  ]
                : []
            }
            icon={CreditCard}
          />
          
          <DataCard
            title="Identity Proofs"
            items={profile.idProofs}
            onCreditReport={handleCreditReport}
            icon={Shield}
          />
          <DataCard title="Verified Address" items={profile.verifiedAddress} icon={MapPin} />
          <DataCard title="Locations" items={profile.locations} icon={MapPin} />
          <DataCard title="Country Codes" items={profile.countryCodes} icon={Globe} />
          <DataCard title="Carriers" items={profile.carriers} icon={Building2} />
          <DataCard title="Job Profiles" items={profile.jobProfiles} icon={Building2} />
          <DataCard title="Bio" items={profile.telBio} icon={User} />
          
          <DataCard
            title="RC Numbers"
            items={profile.rcNumber.map((rc) => ({
              value: (
                <div
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-2"
                >
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
            }))}
            icon={Car}
          />
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

        {/* Other Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profile?.isBusiness && (
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <h3 className="font-semibold text-white text-sm">Whatsapp Business</h3>
              </div>
              <p className="text-emerald-400 font-medium">
                {profile?.isBusiness ? "Yes" : "No"}
              </p>
            </div>
          )}
          {profile?.imsi && (
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="font-semibold text-white text-sm">Phone IMSI</h3>
              </div>
              <p className="text-cyan-400 font-medium">
                {profile?.imsi || "N/A"}
              </p>
            </div>
          )}
          {profile?.lastUpdated && (
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <h3 className="font-semibold text-white text-sm">Phone Status</h3>
              </div>
              <p className="text-emerald-400 font-medium">
                {profile?.lastUpdated}
              </p>
            </div>
          )}
        </div>

        {profile.facebook?.profile_url && (
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 p-4 rounded-xl">
            <h3 className="font-semibold text-white text-sm mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              Facebook Profile
            </h3>
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
