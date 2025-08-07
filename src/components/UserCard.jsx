import React, { useState } from "react";
import useAuthContext from "../context/AuthContext";
import UserIcon from "../assets/userIcon.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import InlineLoader from "./InlineLoader";

const UserCard = () => {
  const { user, logout } = useAuthContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      logout()
        .then(() => {
          navigate("/");
        })
        .finally(() => {
          setLoading(false);
        });
    }, 2000);
  };

  return (
    <div className="flex gap-2 items-center justify-end p-4 z-20">
      {user && (
        <div className="text-xs md:text-sm text-gray-900 rounded p-2 bg-custom-lime">
          Credits: <span className="font-semibold">{user.credits}</span>
        </div>
      )}
      <div className="relative flex items-center">
        <button
          className="h-8 w-8 md:h-10 md:w-10 rounded-full shadow bg-white/10 transition-opacity duration-300"
          title={user?.name || "User"}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <img
            className="h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-custom-lime"
            src={UserIcon}
            alt={`${user?.name}'s profile`}
            title={user?.name || "User"}
          />
        </button>
        {dropdownOpen && (
          <div className="absolute top-8 md:top-10 right-2 md:right-0 mt-2 w-80 border border-lime-300 bg-gray-900 bg-opacity-30 backdrop-blur-lg shadow-md rounded-lg px-4 divide-y divide-lime-300">
            <div className="flex items-center justify-start space-x-4 mb-4 py-2">
              <div className="text-white">
                <img
                  className="h-8 md:h-10 w-8 md:w-10 rounded-full border-2 border-lime-300"
                  src={UserIcon}
                  alt={`${user?.name}'s profile`}
                  title={user?.name || "User"} // Show name on hover
                />
              </div>
              <div className=" text-white hover:text-lime-300 flex flex-col">
                <span className="">{user?.name || "User"}</span>
                <span className="">{user?.email || ""}</span>
              </div>
            </div>
            {loading ? (
              <div className="flex items-center px-4 py-3 space-x-3 w-full">
                <InlineLoader />
                <span className="text-sm text-white">Logging out...</span>
              </div>
            ) : (
              <button
                className="flex items-center px-4 py-3 space-x-3 w-full hover:bg-gray-800 text-white hover:text-lime-300"
                onClick={handleLogout}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm5.03 4.72a.75.75 0 0 1 0 1.06l-1.72 1.72h10.94a.75.75 0 0 1 0 1.5H10.81l1.72 1.72a.75.75 0 1 1-1.06 1.06l-3-3a.75.75 0 0 1 0-1.06l3-3a.75.75 0 0 1 1.06 0Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">Logout</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
