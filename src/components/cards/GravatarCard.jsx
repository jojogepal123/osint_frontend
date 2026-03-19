import { ExternalLink } from "lucide-react";

export const GravatarCard = ({ data }) => {
  if (!data || data.length === 0) return null;

  return data.map((item, index) => (
    <div
      key={index}
      className="w-full h-full bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-lg p-5 hover:border-cyan-500/30 transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center">
          <img
            src="https://gravatar.com/images/favicon-192x192.png"
            alt="Gravatar"
            className="w-6 h-6"
          />
        </div>
        <h2 className="text-white text-xl font-semibold">Gravatar</h2>
      </div>
      
      <div className="text-slate-300 flex flex-col lg:flex-row lg:items-start gap-6">
        {item.avatar_url && (
          <div className="flex-shrink-0">
            <div className="relative group">
              <img
                src={item.avatar_url}
                alt={item.username}
                className="w-28 h-28 lg:w-32 lg:h-32 rounded-2xl border-2 border-cyan-500/30 shadow-xl shadow-cyan-500/10 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-medium text-sm">Username:</span>
            <span className="text-white">@{item.username}</span>
          </div>
          {item.profile_url && (
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-medium text-sm">Profile:</span>
              <a
                href={item.profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-sm transition-colors"
              >
                View Profile
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  ));
};
