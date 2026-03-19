import React from "react";

const Background = React.memo(() => {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950" />
      
      <div className="absolute inset-0">
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" className="text-cyan-400"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-teal-500/20 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
      
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-gradient-to-r from-cyan-500/10 to-transparent rounded-full blur-[100px] animate-spin" style={{ animationDuration: '20s' }} />
      <div className="absolute bottom-1/3 right-1/3 w-[350px] h-[350px] bg-gradient-to-l from-emerald-500/10 to-transparent rounded-full blur-[100px] animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-slate-950/50" />
      
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
    </div>
  );
});

export default Background;
