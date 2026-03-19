export const ZehefCard = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl hover:bg-slate-800/70 transition-all duration-300 p-6">
      <h2 className="text-cyan-400 text-xl font-bold mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center">
          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        Verified Presence
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {data
          .filter(
            (item) => item.status === "found" && item.source !== "Gravatar"
          )
          .map((item, index) => (
            <a
              key={index}
              href={item.profile_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-slate-800 to-slate-900/80 rounded-xl p-4 flex flex-col items-center border border-slate-700/50 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 group"
            >
              <img
                src={`http://localhost:8000/assets/${item.logo
                  ?.split("/")
                  .pop()}`}
                alt={item.source}
                className="w-16 h-16 object-contain bg-slate-700/50 rounded-xl mb-3 group-hover:scale-105 transition-transform duration-300"
              />
              <p className="text-slate-300 text-sm text-center font-medium">{item.source}</p>
              {item.profile_url && (
                <span className="text-cyan-400/60 text-xs mt-2 group-hover:text-cyan-400 transition-colors duration-300">
                  View Profile →
                </span>
              )}
            </a>
          ))}
      </div>
    </div>
  );
};
