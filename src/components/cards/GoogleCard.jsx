import { ExternalLink } from "lucide-react";

export const GoogleCard = ({ emailData }) => {
  const profile = emailData?.PROFILE_CONTAINER?.profile;

  if (!profile) return null;

  const personId = profile.personId;
  const email = profile.emails?.PROFILE?.value;
  const name = profile.names?.PROFILE?.fullname;
  const profilePhoto = profile.profilePhotos?.PROFILE?.url;
  const sourceId = profile.sourceIds?.PROFILE?.lastUpdated;

  return (
    <div className="w-full h-full bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-lg p-5 hover:border-cyan-500/30 transition-all duration-300">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center">
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-6 h-6"
          />
        </div>
        <h2 className="text-white text-xl font-semibold">Google Profile</h2>
      </div>

      <div className="text-slate-300 flex flex-col lg:flex-row lg:items-start gap-6">
        {profilePhoto && (
          <div className="flex justify-center lg:block flex-shrink-0">
            <div className="relative group">
              <img
                src={profilePhoto}
                alt="Profile"
                referrerPolicy="no-referrer"
                className="w-28 h-28 lg:w-32 lg:h-32 rounded-2xl border-2 border-cyan-500/30 shadow-xl shadow-cyan-500/10 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        )}

        <div className="space-y-3 flex-1">
          {name && (
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-medium text-sm">Name:</span>
              <span className="text-white">{name}</span>
            </div>
          )}

          {email && (
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-medium text-sm">Email:</span>
              <span className="text-slate-300">{email}</span>
            </div>
          )}

          {personId && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-medium text-sm">Maps Profile:</span>
                <a
                  href={`https://www.google.com/maps/contrib/${personId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-sm transition-colors"
                >
                  View Maps
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-medium text-sm">Person ID:</span>
                <span className="text-slate-400 font-mono text-sm">{personId}</span>
              </div>
            </>
          )}

          {sourceId && (
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-medium text-sm">Last Updated:</span>
              <span className="text-slate-400 text-sm">{sourceId}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
