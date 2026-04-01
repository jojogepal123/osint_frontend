const MainHeader = ({ header }) => {
  return (
    <div className="max-w-4xl mx-auto mt-24 mb-4 flex flex-col md:flex-row items-center gap-2.5">
      <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
        {import.meta.env.VITE_APP_NAME}
      </span>
      <span className="text-2xl font-bold text-cyan-400">{header}</span>
    </div>
  );
};

export default MainHeader;
