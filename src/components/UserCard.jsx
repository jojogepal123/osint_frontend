import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useAuthContext from "../context/AuthContext";
import UserIcon from "../assets/userIcon.png";
import { useNavigate } from "react-router-dom";
import InlineLoader from "./InlineLoader";

const UserCard = () => {
  const { user, logout, activeCase } = useAuthContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropdownPos, setDropdownPos] = useState(null);
  const navigate = useNavigate();
  const avatarRef = useRef(null);
  const dropdownRef = useRef(null);

  const caseName = activeCase?.title || activeCase?.name || null;

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

  const toggleDropdown = () => {
    if (!dropdownOpen && avatarRef.current) {
      const rect = avatarRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setDropdownOpen((v) => !v);
  };

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [dropdownOpen]);

  const dropdownNode =
    dropdownOpen && dropdownPos
      ? createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: dropdownPos.top,
              right: dropdownPos.right,
              zIndex: 9999,
            }}
            className="w-80 border border-lime-300 bg-gray-900/95 backdrop-blur-lg shadow-2xl rounded-lg px-4 divide-y divide-lime-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-start space-x-4 mb-4 py-2">
              <div className="text-white">
                <img
                  className="h-8 md:h-10 w-8 md:w-10 rounded-full border-2 border-lime-300"
                  src={UserIcon}
                  alt={`${user?.name}'s profile`}
                  title={user?.name || "User"}
                />
              </div>
              <div className="text-white flex flex-col">
                <span>{user?.name || "User"}</span>
                <span>{user?.email || ""}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setDropdownOpen(false);
                navigate("/cms/cases");
              }}
              className="flex items-center px-4 py-3 space-x-3 w-full hover:bg-gray-800 text-white hover:text-lime-300"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
              <span className="text-sm">My Cases</span>
            </button>
            {user?.is_admin && (
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/admin");
                }}
                className="flex items-center px-4 py-3 space-x-3 w-full hover:bg-gray-800 text-white hover:text-lime-300"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                  />
                </svg>
                <span className="text-sm">Admin Panel</span>
              </button>
            )}
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
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="flex gap-2 items-center justify-end p-4 z-20">
      {dropdownNode}
      <div
        className="text-xs md:text-sm text-custom-lime rounded px-2 py-1.5 bg-transparent border border-custom-lime max-w-[120px] md:max-w-[200px] truncate"
        title={caseName || "selected case"}
      >
        Active:{" "}
        <span className="font-semibold">{caseName || "selected case"}</span>
      </div>
      {user && (
        <div className="text-xs md:text-sm text-gray-900 rounded p-2 bg-custom-lime">
          Credits:{" "}
          <span className="font-semibold">
            {" "}
            {Number(user.credits).toFixed(2)}
          </span>
        </div>
      )}
      <div className="relative flex items-center" ref={avatarRef}>
        <button
          className="h-8 w-8 md:h-10 md:w-10 rounded-full shadow bg-white/10 transition-opacity duration-300"
          title={user?.name || "User"}
          onClick={toggleDropdown}
        >
          <img
            className="h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-custom-lime"
            src={UserIcon}
            alt={`${user?.name}'s profile`}
            title={user?.name || "User"}
          />
        </button>
      </div>
    </div>
  );
};

export default UserCard;
