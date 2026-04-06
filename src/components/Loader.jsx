const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] h-screen" role="status" aria-live="polite">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-24 h-24 rounded-full border border-cyan-500/20 animate-ping" />
        <div className="absolute w-16 h-16 rounded-full border border-emerald-500/20 animate-ping [animation-delay:0.5s]" />
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-emerald-400 animate-spin" />
          <div className="absolute inset-1.5 rounded-full border-2 border-transparent border-b-cyan-400 border-l-emerald-400 animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          </div>
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
};

export default Loader;
