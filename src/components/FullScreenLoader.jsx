const FullScreenLoader = ({ text }) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-center items-center backdrop-blur-xl bg-black/80">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-32 h-32 rounded-full border-2 border-cyan-500/20 animate-ping" />
        <div className="absolute w-24 h-24 rounded-full border-2 border-emerald-500/20 animate-ping [animation-delay:0.5s]" />
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-emerald-400 animate-spin" />
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-cyan-400 border-l-emerald-400 animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>
        </div>
      </div>
      <span className="text-cyan-400/70 text-lg font-medium mt-6 tracking-wide">{text || 'Loading...'}</span>
    </div>
  );
};

export default FullScreenLoader;
