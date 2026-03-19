import React from "react";
import notFoundImage from "../assets/notfound.png";
import { useNavigate } from "react-router-dom";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white px-4 z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-emerald-500/5" />
      
      <div className="relative z-10 text-center">
        <h1 className="text-[150px] md:text-[200px] font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 mb-4">
          404
        </h1>
        
        <div className="inline-block bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 px-6 py-2 rounded-full mb-6">
          <span className="text-cyan-400 font-semibold text-lg">Page Not Found</span>
        </div>
        
        <p className="text-lg text-slate-400 mb-8 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-bold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </button>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyan-500/10 to-transparent" />
    </div>
  );
};

export default NotFound;
