// src/pages/NotFound.jsx
import React from "react";
import notFoundImage from "../assets/notfound.png"; // update path as per your folder

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-blur text-[#9acc14] px-4 z-10">
      <img
        src={notFoundImage}
        alt="Not Found"
        className="w-72 h-72 object-contain mb-6"
      />
      <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-400">
        The page you are looking for doesn't exist or has been moved.
      </p>
    </div>
  );
};

export default NotFound;
