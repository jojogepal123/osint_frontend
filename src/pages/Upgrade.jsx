import { Link } from "react-router-dom";
const Upgrade = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 z-30">
      <h1 className="text-3xl font-bold text-yellow-500 mb-4 capitalize">
        Not Availabe for trial
      </h1>
      <p className="text-lg text-gray-200 mb-2">
        This feature is only available to live users. Please upgrade your
        account to access this section.
      </p>
      <Link
        to="/dashboard"
        className="px-3 py-2 bg-custom-lime text-gray-800 rounded hover:bg-lime-400 transition text-sm"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default Upgrade;
