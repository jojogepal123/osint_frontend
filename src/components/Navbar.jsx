import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import OsintWork from "../assets/Animation.gif";
// import OsintWork from "../assets/main-video.gif";
import r from "../assets/web-logo.png";
import OsintWorkVideo from "../assets/main-video.mp4";

const Navbar = () => {
  const location = useLocation();
  return (
    <>
      <div
        id="first"
        className="flex flex-row w-full lg:w-auto justify-evenly items-center lg:flex-col bg-gray-700 bg-opacity-30 backdrop-blur-lg md:rounded-md px-2 md:divide-y text-sm text-white self-start lg:mt-32 md:mr-2 z-10"
      >
        <Link to="/">
          <div
            className={`flex flex-col justify-center items-center py-3 px-1 cursor-pointer  ${
              location.pathname === "/"
                ? "text-lime-300 font-bold"
                : "font-medium"
            }`}
          >
            <div className="p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4"
              >
                <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
              </svg>
            </div>
            <p>HOME</p>
          </div>
        </Link>

        <Link to="/login">
          <div
            className={`flex flex-col justify-center items-center py-3 px-1 cursor-pointer ${
              location.pathname === "/login"
                ? "text-lime-300 font-bold"
                : "font-medium"
            }`}
          >
            <div className="p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4"
              >
                <path
                  fillRule="evenodd"
                  d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p>LOGIN</p>
          </div>
        </Link>

        <Link to="/about">
          <div
            className={`flex flex-col justify-center items-center py-3 px-1 cursor-pointer ${
              location.pathname === "/about"
                ? "text-lime-300 font-bold"
                : "font-medium"
            }`}
          >
            <div className="p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 0 1-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 0 1-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584ZM12 18a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p>WHO</p>
          </div>
        </Link>
        <Link to="/privacy">
          <div
            className={`flex flex-col justify-center items-center py-3 px-1 cursor-pointer ${
              location.pathname === "/privacy"
                ? "text-lime-300 font-bold"
                : "font-medium"
            }`}
          >
            <div className="p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </div>
            <p>PRIVACY</p>
          </div>
        </Link>
        <Link to="/contact-us">
          <div
            className={`flex flex-col justify-center items-center py-3 px-1 cursor-pointer ${
              location.pathname === "/contact-us"
                ? "text-lime-300 font-bold"
                : "font-medium"
            }`}
          >
            <div className="p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </div>
            <p>CONTACT</p>
          </div>
        </Link>
      </div>
      <div
        id="second"
        className="flex flex-col justify-center items-center min-h-96 lg:min-h-[80%] lg:w-[30%] md:w-[60%] w-[75%] relative shadow-2xl rounded-lg"
      >
        <img
          className="w-full h-48 md:min-h-[50%] rounded-t-md absolute top-0"
          src={OsintWork}
          alt=""
        ></img>
        {/* <video
          className="w-full h-48 md:min-h-[50%] rounded-t-md absolute top-0 object-cover"
          src={OsintWorkVideo}
          autoPlay
          loop
          muted
          playsInline
        ></video> */}
        <div className="absolute z-10">
          <img
            className="w-32 h-32 sm:w-40 sm:h-40 lg:w-80 lg:h-64 rounded-full"
            src={r}
            alt="logo"
          />
        </div>
        <div className="h-48 md:min-h-[50%] bg-gray-700 bg-opacity-30 backdrop-blur-lg flex-col flex justify-center items-center w-full p-8 rounded-b-md space-y-2 text-center absolute bottom-0">
          <h1 className="text-2xl sm:text-3xl lg:text-5xl mt-4 font-bold drop-shadow-2xl text-transparent bg-clip-text bg-gradient-to-r from-lime-200 to-teal-800">
            {import.meta.env.VITE_APP_NAME}
          </h1>
          <p className="text-sm md:text-md text-lime-300 ">
            FIND YOUR DIGITAL FOOTPRINT
          </p>
        </div>
      </div>
    </>
  );
};

export default Navbar;
