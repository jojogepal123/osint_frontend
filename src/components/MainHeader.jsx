import React from "react";

const MainHeader = ({ header }) => {
  return (
    <div className="max-w-4xl mx-auto mb-6 md:mb-12 space-y-1 md:space-y-3">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-lime-200 to-teal-800 bg-clip-text text-transparent text-center">
        {import.meta.env.VITE_APP_NAME}
      </h1>
      <span
        className="block ml-1 text-lime-300 px-2 underline underline-offset-8 text-3xl sm:text-4xl font-semibold text-center mb-8"
        style={{ fontFamily: '"Times New Roman", Times, serif' }}
      >
        {header}
      </span>
    </div>
  );
};

export default MainHeader;
