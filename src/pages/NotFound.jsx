// src/pages/NotFound.jsx
import React from "react";
import notFoundImage from "../assets/notfound.png"; // update path as per your folder
import { useNavigate } from "react-router-dom";
const NotFound = () => {
  const navigate = useNavigate();

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
      <div className="mt-6">
        <button type="button" onClick={() => navigate("/")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-12 fill-lime-400"
          >
            <g clipPath="url(#a)">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.25-7.25a.75.75 0 0 0 0-1.5H8.66l2.1-1.95a.75.75 0 1 0-1.02-1.1l-3.5 3.25a.75.75 0 0 0 0 1.1l3.5 3.25a.75.75 0 0 0 1.02-1.1l-2.1-1.95h4.59Z"
                clipRule="evenodd"
              />
            </g>
            <defs>
              <clipPath id="a">
                <path d="M0 0h20v20H0z" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NotFound;
