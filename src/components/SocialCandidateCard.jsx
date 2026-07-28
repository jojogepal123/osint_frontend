/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import instance from "../api/axios";

// ─── helpers ─────────────────────────────────────────────────────────────────

export function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

// Normalise the contacts array from SignalHire
// SignalHire: { type: 'email'|'phone', subType: 'personal'|'work'|'mobile'|null, value, rating, isAvailable }
export function splitContacts(contacts = []) {
  const emails = contacts.filter((c) => c.type === "email");
  const phones = contacts.filter((c) => c.type === "phone");
  const corpEm = emails.filter((c) =>
    /work|corp|professional|business/i.test(c.subType ?? ""),
  );
  const persEm = emails.filter((c) => !corpEm.includes(c));
  const corpPh = phones.filter((c) =>
    /work|corp|office|business/i.test(c.subType ?? ""),
  );
  const persPh = phones.filter((c) => !corpPh.includes(c));
  return { corpEm, persEm, corpPh, persPh, emails, phones };
}

// Format ISO date or year number to "Mon YYYY"
function fmtYear(val) {
  if (!val) return null;
  if (typeof val === "number") return String(val);
  const d = new Date(val);
  if (isNaN(d)) return String(val);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function getLocation(c) {
  return (
    c.addresses?.[0]?.display ??
    c.locations?.[0]?.name ??
    c.locations?.[0]?.display ??
    ""
  );
}

// Pick the best photo URL — prefer embedded base64, fall back to remote URL.
export function getCandidatePhotoUrl(c) {
  if (!c) return null;
  if (c.photo?.urlBase64) return c.photo.urlBase64;
  if (c.photo?.url) return c.photo.url;
  if (c.photoUrl) return c.photoUrl;
  return null;
}

// ─── SVG icons ───────────────────────────────────────────────────────────────

export const IcLinkedIn = ({ cls = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={`${cls} fill-current`}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
export const IcFacebook = ({ cls = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={`${cls} fill-current`}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
export const IcTwitter = ({ cls = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={`${cls} fill-current`}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
export const IcGithub = ({ cls = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={`${cls} fill-current`}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);
export const IcInstagram = ({ cls = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={`${cls} fill-current`}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const SOCIAL_MAP = {
  // full names
  linkedin: { Ic: IcLinkedIn, bg: "bg-[#0077b5] text-white" },
  facebook: { Ic: IcFacebook, bg: "bg-[#1877f2] text-white" },
  twitter: {
    Ic: IcTwitter,
    bg: "bg-gray-900 text-white border border-white/20",
  },
  github: { Ic: IcGithub, bg: "bg-gray-700 text-white" },
  instagram: {
    Ic: IcInstagram,
    bg: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white",
  },
  // SignalHire abbreviated codes
  li: { Ic: IcLinkedIn, bg: "bg-[#0077b5] text-white" },
  fb: { Ic: IcFacebook, bg: "bg-[#1877f2] text-white" },
  tw: { Ic: IcTwitter, bg: "bg-gray-900 text-white border border-white/20" },
  gh: { Ic: IcGithub, bg: "bg-gray-700 text-white" },
  ig: {
    Ic: IcInstagram,
    bg: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white",
  },
};

// contact-type icons
export const IcCMail = (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 21h16.5M4.5 3h15l.75 18H3.75L4.5 3ZM9 7.5h6M9 12h6"
    />
  </svg>
);
export const IcPMail = (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
export const IcCPhone = (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
    />
  </svg>
);
export const IcPPhone = (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3"
    />
  </svg>
);

// ─── atoms ───────────────────────────────────────────────────────────────────

export const Avatar = ({ url, name, size = "md" }) => {
  const [failed, setFailed] = useState(false);
  const sz =
    size === "lg"
      ? "w-16 h-16 text-xl rounded-xl"
      : size === "sm"
        ? "w-9 h-9 text-sm rounded-full"
        : "w-12 h-12 text-base rounded-full";
  if (url && !failed)
    return (
      <img
        src={url}
        alt={name}
        className={`${sz} object-cover border-2 border-lime-400/30 shrink-0`}
        onError={() => setFailed(true)}
      />
    );
  return (
    <div
      className={`${sz} bg-gradient-to-br from-teal-700 to-lime-600 flex items-center justify-center font-bold text-gray-900 shrink-0`}
    >
      {getInitials(name)}
    </div>
  );
};

const Check = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-3.5 h-3.5 text-lime-400 fill-current shrink-0"
  >
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </svg>
);

const Badge = ({ children, cls = "" }) => (
  <span className={`px-2 py-0.5 rounded-md text-xs border ${cls}`}>
    {children}
  </span>
);

const SocialBtn = ({ s }) => {
  const key = (s.type ?? s.name ?? "").toLowerCase().replace(/[^a-z]/g, "");
  const entry = SOCIAL_MAP[key] ?? { Ic: null, bg: "bg-gray-700 text-white" };
  const { Ic } = entry;
  return (
    <a
      href={s.url ?? s.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-6 h-6 rounded flex items-center justify-center ${entry.bg} hover:opacity-80 transition-opacity`}
      title={s.type ?? s.name}
      onClick={(e) => e.stopPropagation()}
    >
      {Ic ? (
        <Ic cls="w-3.5 h-3.5" />
      ) : (
        <span className="text-[10px] font-bold">
          {(s.type ?? s.name ?? "?")[0].toUpperCase()}
        </span>
      )}
    </a>
  );
};

// ─── Contacts Popup ───────────────────────────────────────────────────────────

const ContactsPopup = ({ candidate, onViewProfile, onClose }) => {
  const ref = useRef(null);
  const { corpEm, persEm, corpPh, persPh } = splitContacts(
    candidate.contacts ?? [],
  );

  useEffect(() => {
    const fn = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [onClose]);

  const Group = ({ icon, label, colorCls, items }) => {
    if (!items.length) return null;
    return (
      <div className="mb-3 last:mb-0">
        <div
          className={`flex items-center gap-1.5 text-xs font-medium mb-1.5 ${colorCls}`}
        >
          {icon} {label}
        </div>
        <div className="space-y-1.5 pl-5">
          {items.map((c, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="text-gray-200 text-sm truncate max-w-[185px]">
                {c.value ?? c}
              </span>
              {c.isVerified && <Check />}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 z-50 w-[calc(100vw-2rem)] max-w-[288px] bg-gray-900 border border-white/15 rounded-2xl shadow-2xl p-4 backdrop-blur-md max-h-[70vh] overflow-y-auto custom-scrollbar"
    >
      <div className="absolute -top-[9px] right-8 w-4 h-4 bg-gray-900 border-l border-t border-white/15 rotate-45 rounded-tl" />
      <Group
        icon={IcCMail}
        label="Corporate mail"
        colorCls="text-blue-400"
        items={corpEm}
      />
      <Group
        icon={IcPMail}
        label="Personal mail"
        colorCls="text-lime-400"
        items={persEm}
      />
      <Group
        icon={IcCPhone}
        label="Corporate phone"
        colorCls="text-blue-400"
        items={corpPh}
      />
      <Group
        icon={IcPPhone}
        label="Personal phone"
        colorCls="text-lime-400"
        items={persPh}
      />
      {!corpEm.length && !persEm.length && !corpPh.length && !persPh.length && (
        <p className="text-gray-500 text-sm text-center py-2">
          No contact info available
        </p>
      )}
      <div className="mt-3 pt-3 border-t border-white/10">
        <button
          onClick={onViewProfile}
          className="flex items-center gap-1.5 text-lime-400 hover:text-lime-300 text-sm font-semibold transition-colors"
        >
          View profile details
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

// ─── Profile Modal ────────────────────────────────────────────────────────────

const ProfileModal = ({ candidate, onClose }) => {
  const [activeTab, setActiveTab] = useState(null);
  const [showAllContacts, setShowAllContacts] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Convert photo to base64 client-side (LinkedIn CDN blocks server-side fetches).
      // Force JPEG via canvas so the backend's dompdf can render it (WebP isn't
      // supported by GD on the server).
      let payload = { ...candidate };
      const photoUrl = candidate.photo?.url ?? candidate.photoUrl ?? null;
      if (photoUrl && !photoUrl.startsWith("data:")) {
        try {
          const imgRes = await fetch(photoUrl);
          const blob = await imgRes.blob();
          const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error("read failed"));
            reader.readAsDataURL(blob);
          });
          const img = await new Promise((resolve, reject) => {
            const i = new Image();
            i.onload = () => resolve(i);
            i.onerror = () => reject(new Error("image load failed"));
            i.src = dataUrl;
          });
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          payload._photoBase64 = canvas.toDataURL("image/jpeg", 0.9);
        } catch {
          // photo fetch failed — backend will show initials fallback
        }
      } else if (photoUrl) {
        payload._photoBase64 = photoUrl;
      }

      const res = await instance.post(
        "/api/generate-social-report",
        { data: payload },
        { responseType: "blob" },
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `social_intel_${(candidate.fullName ?? "profile").replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("PDF download failed.");
    } finally {
      setDownloading(false);
    }
  };

  const c = candidate;
  const photoUrl = c.photo?.urlBase64 ?? c.photo?.url ?? c.photoUrl ?? null;
  const location = getLocation(c);
  const { corpEm, persEm, corpPh, persPh } = splitContacts(c.contacts ?? []);
  const socialLinks = c.social ?? c.socialLinks ?? [];
  const skills = c.skills ?? []; // array of strings
  const experience = c.experience ?? [];
  const education = c.education ?? [];
  const summary = c.summary ?? c.bio ?? "";
  const languages = c.language ?? c.languages ?? [];
  const publications = c.publication ?? c.publications ?? [];
  const projects = c.project ?? c.projects ?? [];
  const patents = c.patent ?? c.patents ?? [];
  const certs = c.certification ?? c.certifications ?? [];
  const orgs = c.organization ?? c.organizations ?? [];
  const awards = c.honorAward ?? c.honorAwards ?? [];
  const expYears = c.experienceYears ?? null;

  const tabs = [
    { key: "skills", label: "Skills", show: skills.length > 0 },
    { key: "exp", label: "Work Experience", show: experience.length > 0 },
    { key: "edu", label: "Education", show: education.length > 0 },
    { key: "company", label: "Company Info", show: experience.length > 0 },
    { key: "summary", label: "Summary", show: !!summary },
    {
      key: "projects",
      label: "Job Projects",
      show: projects.length > 0 || experience.some((e) => e.description),
    },
    { key: "pubs", label: "Publications", show: publications.length > 0 },
    { key: "patents", label: "Patents", show: patents.length > 0 },
    { key: "certs", label: "Certifications", show: certs.length > 0 },
    { key: "orgs", label: "Organizations", show: orgs.length > 0 },
    { key: "awards", label: "Honor & Awards", show: awards.length > 0 },
    { key: "langs", label: "Languages", show: languages.length > 0 },
  ].filter((t) => t.show);

  useEffect(() => {
    if (tabs.length && !activeTab) setActiveTab(tabs[0].key);
  }, []);

  // contacts shown: first of each non-empty group, rest are "extra"
  const shownContacts = [corpEm[0], persEm[0], corpPh[0], persPh[0]].filter(
    Boolean,
  );
  const totalExtra =
    corpEm.length +
    persEm.length +
    corpPh.length +
    persPh.length -
    shownContacts.length;

  const ContactRow = ({ icon, colorCls, items, unit }) => {
    if (!items.length) return null;
    const first = items[0];
    const extra = items.length - 1;
    return (
      <div className="flex items-center gap-2 py-1.5">
        <span className={`shrink-0 ${colorCls}`}>{icon}</span>
        <span className="text-gray-200 text-sm truncate">
          {first.value ?? first}
        </span>
        {first.isVerified && <Check />}
        {extra > 0 && (
          <Badge cls="bg-white/10 border-white/10 text-gray-400 ml-1 shrink-0">
            +{extra} {unit}
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-2xl max-h-[92vh] bg-gray-950 border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="p-3 sm:p-5 border-b border-white/10 shrink-0">
          <div className="flex items-start gap-3">
            <Avatar url={photoUrl} name={c.fullName} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-white">{c.fullName}</h2>
                <Badge cls="bg-lime-400/15 border-lime-400/30 text-lime-300">
                  Revealed
                </Badge>
                {experience.length > 1 && (
                  <Badge cls="bg-white/10 border-white/15 text-gray-400">
                    +{experience.length - 1}
                  </Badge>
                )}
              </div>
              {c.headLine && (
                <p className="text-sm text-gray-300 mt-0.5">{c.headLine}</p>
              )}
              {location && (
                <p className="text-xs text-gray-500 mt-0.5">{location}</p>
              )}
              {c.gender && (
                <p className="text-xs text-gray-600 mt-0.5 capitalize">
                  {c.gender}
                </p>
              )}
            </div>
            {/* action btns */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="hidden sm:flex w-8 h-8 rounded-lg border border-white/15 bg-white/5 items-center justify-center text-gray-400 hover:text-lime-300 transition-colors disabled:opacity-50"
              >
                {downloading ? (
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                )}
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg border border-white/15 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors shrink-0"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* ── Contact rows ── */}
          <div className="mt-4 space-y-0.5">
            <ContactRow
              icon={IcCMail}
              colorCls="text-blue-400"
              items={corpEm}
              unit="emails"
            />
            <ContactRow
              icon={IcPMail}
              colorCls="text-lime-400"
              items={persEm}
              unit="emails"
            />
            <ContactRow
              icon={IcCPhone}
              colorCls="text-blue-400"
              items={corpPh}
              unit="phones"
            />
            <ContactRow
              icon={IcPPhone}
              colorCls="text-lime-400"
              items={persPh}
              unit="phones"
            />
          </div>

          {totalExtra > 0 && (
            <button
              onClick={() => setShowAllContacts((v) => !v)}
              className="mt-2 flex items-center gap-1.5 text-lime-400 hover:text-lime-300 text-sm font-medium transition-colors"
            >
              See more contacts ({totalExtra})
              <svg
                viewBox="0 0 24 24"
                className={`w-4 h-4 transition-transform ${showAllContacts ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19 9-7 7-7-7"
                />
              </svg>
            </button>
          )}

          {showAllContacts && (
            <div className="mt-3 p-3 bg-white/5 rounded-xl border border-white/10 space-y-3 text-sm max-h-52 overflow-y-auto custom-scrollbar">
              {[
                {
                  icon: IcCMail,
                  label: "Corporate mail",
                  cls: "text-blue-400",
                  items: corpEm,
                },
                {
                  icon: IcPMail,
                  label: "Personal mail",
                  cls: "text-lime-400",
                  items: persEm,
                },
                {
                  icon: IcCPhone,
                  label: "Corporate phone",
                  cls: "text-blue-400",
                  items: corpPh,
                },
                {
                  icon: IcPPhone,
                  label: "Personal phone",
                  cls: "text-lime-400",
                  items: persPh,
                },
              ].map(({ icon, label, cls, items }) =>
                items.length ? (
                  <div key={label}>
                    <p
                      className={`text-xs font-medium mb-1 flex items-center gap-1 ${cls}`}
                    >
                      {icon} {label}
                    </p>
                    {items.map((ct, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 pl-5 py-0.5 text-gray-200"
                      >
                        <span className="truncate">{ct.value ?? ct}</span>
                        {ct.isVerified && <Check />}
                      </div>
                    ))}
                  </div>
                ) : null,
              )}
            </div>
          )}

          {/* social badges */}
          {socialLinks.length > 0 && (
            <div className="mt-3 flex gap-2 flex-wrap">
              {socialLinks.map((s, i) => (
                <SocialBtn key={i} s={s} />
              ))}
            </div>
          )}
        </div>

        {/* ── Tabs ── */}
        {tabs.length > 0 && (
          <>
            <div className="flex border-b border-white/10 overflow-x-auto shrink-0 px-1 custom-scrollbar">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === t.key
                      ? "border-lime-400 text-lime-300"
                      : "border-transparent text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="overflow-y-auto flex-1 p-4 sm:p-5 custom-scrollbar">
              {/* Skills */}
              {activeTab === "skills" && (
                <div className="flex flex-wrap gap-2">
                  {skills.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-gray-800 border border-white/10 text-gray-200 rounded-lg text-sm hover:border-lime-400/40 transition-colors"
                    >
                      {typeof s === "string"
                        ? s
                        : (s.value ?? JSON.stringify(s))}
                    </span>
                  ))}
                </div>
              )}

              {/* Work Experience */}
              {activeTab === "exp" && (
                <div>
                  <p className="text-gray-300 font-semibold text-sm mb-4">
                    Work Experience{expYears ? ` • ${expYears} years` : ""}
                  </p>
                  <div className="relative pl-5">
                    <div className="absolute left-1 top-1 bottom-1 w-px bg-white/10" />
                    {experience.map((job, i) => {
                      const jobTitle = job.position ?? job.title ?? "—";
                      const company =
                        job.company ?? job.companyName ?? job.employer;
                      const startStr = fmtYear(
                        job.started ?? job.startDate ?? job.startYear,
                      );
                      const endStr = job.current
                        ? "Present"
                        : (fmtYear(job.ended ?? job.endDate ?? job.endYear) ??
                          "Present");
                      return (
                        <div key={i} className="relative mb-5 last:mb-0">
                          <div className="absolute -left-[18px] top-1.5 w-2.5 h-2.5 rounded-full bg-lime-400 border-2 border-gray-950" />
                          <p className="text-white text-sm font-medium">
                            {jobTitle}
                            {company && (
                              <>
                                {" "}
                                at{" "}
                                <span className="text-lime-400">{company}</span>
                              </>
                            )}
                          </p>
                          {job.location && (
                            <p className="text-gray-400 text-xs mt-0.5">
                              {job.location}
                            </p>
                          )}
                          {startStr && (
                            <p className="text-gray-500 text-xs mt-0.5">
                              {startStr} – {endStr}
                            </p>
                          )}
                          {job.description && (
                            <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">
                              {job.description}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Education */}
              {activeTab === "edu" && (
                <div className="relative pl-5">
                  <div className="absolute left-1 top-1 bottom-1 w-px bg-white/10" />
                  {education.map((edu, i) => (
                    <div key={i} className="relative mb-5 last:mb-0">
                      <div className="absolute -left-[18px] top-1.5 w-2.5 h-2.5 rounded-full bg-teal-400 border-2 border-gray-950" />
                      <p className="text-white text-sm font-medium">
                        {edu.university ?? edu.school ?? edu.institution ?? "—"}
                      </p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {[
                          edu.degree,
                          edu.faculty ?? edu.field ?? edu.fieldOfStudy,
                        ]
                          .filter(Boolean)
                          .join(" in ")}
                        {(edu.startedYear ?? edu.startDate ?? edu.startYear) &&
                          ` · ${edu.startedYear ?? edu.startDate ?? edu.startYear} – ${edu.endedYear ?? edu.endDate ?? edu.endYear ?? "Present"}`}
                      </p>
                      {edu.url && (
                        <a
                          href={edu.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lime-400 text-xs hover:underline mt-0.5 block"
                        >
                          {edu.url}
                        </a>
                      )}
                      {edu.description && (
                        <p className="text-gray-500 text-xs mt-1">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Company Info */}
              {activeTab === "company" && (
                <div className="space-y-4">
                  {experience.map((job, i) => {
                    const company =
                      job.company ?? job.companyName ?? job.employer;
                    const position = job.position ?? job.title;
                    const startStr = fmtYear(
                      job.started ?? job.startDate ?? job.startYear,
                    );
                    const endStr = job.current
                      ? "Present"
                      : (fmtYear(job.ended ?? job.endDate ?? job.endYear) ??
                        "Present");
                    return (
                      <div
                        key={i}
                        className="p-4 bg-gray-900 border border-white/10 rounded-xl space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-white font-semibold text-sm">
                              {company ?? "—"}
                            </p>
                            {position && (
                              <p className="text-lime-400 text-xs">
                                {position}
                              </p>
                            )}
                          </div>
                          {startStr && (
                            <span className="text-gray-500 text-xs shrink-0">
                              {startStr} – {endStr}
                            </span>
                          )}
                        </div>
                        {job.location && (
                          <p className="text-gray-400 text-xs flex items-center gap-1">
                            📍 {job.location}
                          </p>
                        )}
                        {job.companySize && (
                          <p className="text-gray-500 text-xs">
                            Size: {job.companySize}
                          </p>
                        )}
                        {job.industry && (
                          <p className="text-gray-500 text-xs">
                            Industry: {job.industry}
                          </p>
                        )}
                        {job.companyLinkedinUrl && (
                          <a
                            href={job.companyLinkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lime-400 text-xs hover:underline flex items-center gap-1"
                          >
                            <IcLinkedIn cls="w-3 h-3" /> View company on
                            LinkedIn
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Summary */}
              {activeTab === "summary" && (
                <p className="text-gray-300 text-sm leading-relaxed">
                  {summary}
                </p>
              )}

              {/* Job Projects */}
              {activeTab === "projects" && (
                <div className="space-y-4">
                  {projects.length > 0 &&
                    projects.map((proj, i) => (
                      <div
                        key={i}
                        className="p-4 bg-gray-900 border border-white/10 rounded-xl"
                      >
                        <p className="text-white font-semibold text-sm">
                          {proj.name ?? proj.title ?? proj}
                        </p>
                        {proj.description && (
                          <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">
                            {proj.description}
                          </p>
                        )}
                        {proj.url && (
                          <a
                            href={proj.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lime-400 text-xs mt-1 block hover:underline"
                          >
                            {proj.url}
                          </a>
                        )}
                        {(proj.startDate ?? proj.year) && (
                          <p className="text-gray-500 text-xs mt-1">
                            {proj.startDate ?? proj.year}
                          </p>
                        )}
                      </div>
                    ))}
                  {projects.length === 0 &&
                    experience
                      .filter((e) => e.description)
                      .map((job, i) => (
                        <div
                          key={i}
                          className="p-4 bg-gray-900 border border-white/10 rounded-xl"
                        >
                          <p className="text-lime-400 font-semibold text-sm">
                            {job.title} @ {job.company ?? job.companyName}
                          </p>
                          <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                            {job.description}
                          </p>
                        </div>
                      ))}
                </div>
              )}

              {/* Publications */}
              {activeTab === "pubs" && (
                <div className="space-y-3">
                  {publications.map((pub, i) => (
                    <div
                      key={i}
                      className="p-3 bg-gray-900 border border-white/10 rounded-xl"
                    >
                      <p className="text-white text-sm font-medium">
                        {pub.name ?? pub.title ?? pub}
                      </p>
                      {(pub.issue ?? pub.publisher) && (
                        <p className="text-gray-400 text-xs mt-0.5">
                          Publisher: {pub.issue ?? pub.publisher}
                        </p>
                      )}
                      {pub.date && (
                        <p className="text-gray-500 text-xs">{pub.date}</p>
                      )}
                      {pub.description && (
                        <p className="text-gray-400 text-xs mt-1">
                          {pub.description}
                        </p>
                      )}
                      {pub.url && (
                        <a
                          href={pub.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lime-400 text-xs mt-1 block hover:underline"
                        >
                          {pub.url}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Patents */}
              {activeTab === "patents" && (
                <div className="space-y-3">
                  {patents.map((p, i) => (
                    <div
                      key={i}
                      className="p-3 bg-gray-900 border border-white/10 rounded-xl"
                    >
                      <p className="text-white text-sm font-medium">
                        {p.name ?? p.title ?? p}
                      </p>
                      {p.number && (
                        <p className="text-gray-400 text-xs mt-0.5">
                          No: {p.number}
                        </p>
                      )}
                      {p.issueDate && (
                        <p className="text-gray-500 text-xs">
                          Issued: {p.issueDate}
                        </p>
                      )}
                      {p.description && (
                        <p className="text-gray-400 text-xs mt-1">
                          {p.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Certifications */}
              {activeTab === "certs" && (
                <div className="space-y-3">
                  {certs.map((cert, i) => (
                    <div
                      key={i}
                      className="p-3 bg-gray-900 border border-white/10 rounded-xl"
                    >
                      <p className="text-white text-sm font-medium">
                        {cert.name ?? cert.value ?? cert}
                      </p>
                      {cert.issuer && (
                        <p className="text-gray-400 text-xs mt-0.5">
                          {cert.issuer}
                        </p>
                      )}
                      {cert.date && (
                        <p className="text-gray-500 text-xs">{cert.date}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Organizations */}
              {activeTab === "orgs" && (
                <div className="space-y-3">
                  {orgs.map((org, i) => (
                    <div
                      key={i}
                      className="p-3 bg-gray-900 border border-white/10 rounded-xl"
                    >
                      <p className="text-white text-sm font-medium">
                        {org.name ?? org.value ?? org}
                      </p>
                      {org.role && (
                        <p className="text-gray-400 text-xs mt-0.5">
                          {org.role}
                        </p>
                      )}
                      {org.startDate && (
                        <p className="text-gray-500 text-xs">
                          {org.startDate} – {org.endDate ?? "Present"}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Honor & Awards */}
              {activeTab === "awards" && (
                <div className="space-y-3">
                  {awards.map((aw, i) => (
                    <div
                      key={i}
                      className="p-3 bg-gray-900 border border-white/10 rounded-xl flex gap-3 items-start"
                    >
                      <div className="w-7 h-7 rounded-lg bg-lime-400/15 border border-lime-400/20 flex items-center justify-center shrink-0">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-4 h-4 text-lime-400"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">
                          {aw.name ?? aw.title ?? aw.value ?? aw}
                        </p>
                        {aw.issuer && (
                          <p className="text-gray-400 text-xs mt-0.5">
                            {aw.issuer}
                          </p>
                        )}
                        {aw.date && (
                          <p className="text-gray-500 text-xs">{aw.date}</p>
                        )}
                        {aw.description && (
                          <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                            {aw.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Languages */}
              {activeTab === "langs" && (
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang, i) => (
                    <div
                      key={i}
                      className="px-4 py-2 bg-gray-900 border border-white/10 rounded-xl text-sm"
                    >
                      <span className="text-white font-medium">
                        {lang.name ?? lang.language ?? lang}
                      </span>
                      {lang.proficiency && (
                        <span className="text-gray-400 text-xs ml-2">
                          ({lang.proficiency})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Result Card (list row) ───────────────────────────────────────────────────

const SocialCandidateCard = ({ candidate, setModalOpen }) => {
  const [showContacts, setShowContacts] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const openProfile = () => {
    setShowProfile(true);
    if (typeof setModalOpen === "function") setModalOpen(true);
  };
  const closeProfile = () => {
    setShowProfile(false);
    if (typeof setModalOpen === "function") setModalOpen(false);
  };

  const c = candidate;
  const photoUrl = getCandidatePhotoUrl(c);
  const location = getLocation(c);
  const contacts = c.contacts ?? [];
  const emails = contacts.filter((ct) => /email/i.test(ct.type ?? ""));
  const totalContacts = contacts.length;
  const firstEmail = emails[0];
  const secondEmail = emails[1];
  const socialLinks = c.social ?? c.socialLinks ?? [];
  const currentExp = c.experience?.[0];

  return (
    <>
      <div className="bg-gray-900/70 border border-white/10 rounded-xl backdrop-blur-sm">
        <div className="flex items-center gap-3 p-4 sm:p-5">
          <Avatar url={photoUrl} name={c.fullName} />

          {/* middle */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm sm:text-base truncate">
              {c.fullName}
            </p>
            {c.headLine && (
              <p className="text-gray-400 text-xs sm:text-sm mt-0.5 truncate">
                {c.headLine}
              </p>
            )}
            {(currentExp?.company ?? currentExp?.companyName) && (
              <p className="text-lime-400 text-xs underline underline-offset-2 mt-0.5">
                {currentExp.company ?? currentExp.companyName}
              </p>
            )}
            {socialLinks.length > 0 && (
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {socialLinks.map((s, i) => (
                  <SocialBtn key={i} s={s} />
                ))}
              </div>
            )}
          </div>

          {/* location */}
          {location && (
            <p className="hidden md:block text-gray-400 text-xs shrink-0 max-w-[130px] text-center leading-snug">
              {location}
            </p>
          )}

          {/* right: contacts */}
          <div className="flex flex-col items-end gap-1.5 shrink-0 relative">
            {firstEmail && (
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-blue-400">{IcCMail}</span>
                <span className="text-gray-300 text-xs truncate max-w-[120px] md:max-w-[160px]">
                  {firstEmail.value ?? firstEmail}
                </span>
              </div>
            )}
            {secondEmail && (
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-lime-400">{IcPMail}</span>
                <span className="text-gray-300 text-xs truncate max-w-[120px] md:max-w-[160px]">
                  {secondEmail.value ?? secondEmail}
                </span>
                {secondEmail.isVerified && <Check />}
              </div>
            )}
            {totalContacts > 0 && (
              <button
                onClick={() => setShowContacts((v) => !v)}
                className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg border transition-all ${
                  showContacts
                    ? "border-lime-400/40 text-lime-300 bg-lime-400/10"
                    : "border-white/15 text-lime-400 hover:border-lime-400/30 hover:bg-lime-400/5"
                }`}
              >
                See more contacts ({totalContacts})
                <svg
                  viewBox="0 0 24 24"
                  className={`w-3.5 h-3.5 transition-transform ${showContacts ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19 9-7 7-7-7"
                  />
                </svg>
              </button>
            )}
            <button
              onClick={() => {
                setShowContacts(false);
                openProfile();
              }}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-lime-200 to-teal-700 text-gray-900 hover:opacity-90 transition-opacity"
            >
              Full Profile
              <svg
                viewBox="0 0 24 24"
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
            </button>

            {showContacts && (
              <ContactsPopup
                candidate={candidate}
                onViewProfile={() => {
                  setShowContacts(false);
                  openProfile();
                }}
                onClose={() => setShowContacts(false)}
              />
            )}
          </div>
        </div>

        {location && (
          <p className="md:hidden text-gray-500 text-xs px-5 pb-3">
            📍 {location}
          </p>
        )}
      </div>

      {showProfile && (
        <ProfileModal
          candidate={candidate}
          onClose={closeProfile}
        />
      )}
    </>
  );
};

export default SocialCandidateCard;
