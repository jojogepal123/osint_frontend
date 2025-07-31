import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthContext from "../context/AuthContext";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPassswordConfirmation] = useState("");
  const { register, errors } = useAuthContext();
  const [loading, setLoading] = useState(false); // Add loading state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the register process starts
    try {
      await register({ name, email, password, password_confirmation });
    } catch (error) {
      toast.error("Register failed. Please check your credentials.");
    } finally {
      setLoading(false); // Set loading to false when login process ends
    }
  };

  if (import.meta.env.VITE_REGISTER_ENABLED === "false") {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-transparent text-gray-200">
        <h1 className="text-5xl md:text-9xl font-extrabold tracking-widest text-[#AADE63]">
          403
        </h1>
        <div className="bg-[#AADE63] py-1 px-2 text-sm rounded mt-2 text-black">
          Forbidden
        </div>
        <p className="mt-2 text-xl md:text-2xl text-[#AADE63]">
          Registration is currently disabled.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-8 px-4 py-1.5 cursor-pointer rounded bg-gradient-to-r from-lime-200 to-teal-800 shadow text-gray-900 font-bold hover:bg-gradient-to-tl transition duration-300 ease-in-out"
        >
          Go Back Home
        </button>
      </div>
    );
  }
  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <Loader />
        </div>
      )}
      <div className="flex flex-col min-h-screen">
        <section className="my-auto relative">
          <div className="flex justify-center lg:grid grid-cols-1 lg:grid-cols-5 max-w-6xl mx-auto z-90">
            <div className="relative col-span-2 hidden lg:block overflow-hidden rounded-l-[20px] bg-gray-700 bg-opacity-30 backdrop-blur-lg pl-10 pr-6 pt-16 text-black">
              <img
                src="data:image/svg+xml,%3csvg%20width='463'%20height='341'%20viewBox='0%200%20463%20341'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20opacity='0.3'%3e%3crect%20x='264'%20y='324'%20width='199.669'%20height='34'%20fill='%233DB8FA'/%3e%3crect%20y='216'%20width='36.5336'%20height='34'%20fill='%234B5563'/%3e%3crect%20y='54'%20width='115.388'%20height='34'%20fill='%234B5563'/%3e%3crect%20x='205.456'%20width='101.281'%20height='34'%20fill='%23374151'/%3e%3crect%20x='121.176'%20y='54'%20width='185.562'%20height='34'%20fill='%233DB8FA'/%3e%3crect%20x='205.456'%20y='108'%20width='171.816'%20height='34'%20fill='%2354E9E2'/%3e%3crect%20x='167.476'%20y='162'%20width='161.688'%20height='34'%20fill='%2354E9E2'/%3e%3crect%20x='126.963'%20y='270'%20width='101.281'%20height='34'%20fill='%234B5563'/%3e%3crect%20x='312.525'%20width='150.475'%20height='34'%20fill='%233DB8FA'/%3e%3crect%20x='383.06'%20y='108'%20width='79.9398'%20height='34'%20fill='%234B5563'/%3e%3crect%20x='334.952'%20y='162'%20width='128.048'%20height='34'%20fill='%233DB8FA'/%3e%3crect%20x='356.655'%20y='216'%20width='106.345'%20height='34'%20fill='%2354E9E2'/%3e%3crect%20x='234.032'%20y='270'%20width='228.968'%20height='34'%20fill='%2354E9E2'/%3e%3c/g%3e%3c/svg%3e"
                className="absolute right-0 bottom-0"
              ></img>
              <div className="mt-2 font-display text-4xl font-bold leading-tight bg-gradient-to-r from-lime-200 to-teal-800 bg-clip-text text-transparent">
                Proactive Intelligence: Uncover Threats, Secure the Future.
              </div>
            </div>
            <div className="col-start-2 col-span-2 lg:col-span-3 rounded-[20px] text-white lg:rounded-l-[0px] bg-gray-800 bg-opacity-30 backdrop-blur-lg mx-2 md:mx-0">
              <div className="w-full mx-auto flex flex-col gap-6 p-8 sm:p-12 md:p-16">
                <div className="p-3 pt-0 bg-gradient-to-r from-lime-200 to-teal-800 bg-clip-text text-transparent text-center font-semibold cursor-pointer">
                  <h1
                    className="text-4xl md:text-5xl"
                    onClick={() => navigate("/")}
                  >
                    {import.meta.env.VITE_APP_NAME}
                  </h1>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="relative mb-4">
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-300 text-lg outline-none transition"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    {errors.name && errors.name[0] && (
                      <div className="text-red-500 text-md py-1 text-start">
                        {errors.name[0]}
                      </div>
                    )}
                  </div>
                  <div className="relative mb-4">
                    <input
                      type="email"
                      className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-300 text-lg outline-none transition"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    {errors.email && errors.email[0] && (
                      <div className="text-red-500 text-md py-1 text-start">
                        {errors.email[0]}
                      </div>
                    )}
                  </div>
                  <div className="relative mb-4">
                    <input
                      type={showPassword ? "text" : "password"} // Toggle type
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-300 text-lg outline-none transition"
                      placeholder="Password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    {errors.password && errors.password[0] && (
                      <div className="text-red-500 py-1 text-md text-start">
                        {errors.password[0]}
                      </div>
                    )}
                  </div>
                  <div className="relative mb-4">
                    <input
                      type={showConfirmPassword ? "text" : "password"} // Toggle type
                      value={password_confirmation}
                      onChange={(e) => setPassswordConfirmation(e.target.value)}
                      className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-300 text-lg outline-none transition"
                      placeholder="Confirm password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-3 text-gray-400"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                    {errors.password_confirmation &&
                      errors.password_confirmation[0] && (
                        <div className="text-red-500 py-1 text-md text-start">
                          {errors.password_confirmation[0]}
                        </div>
                      )}
                  </div>
                  <div className="flex flex-col gap-6">
                    <button
                      type="submit"
                      className="items-center whitespace-nowrap text-lg transition-colors disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-lime-200 to-teal-800 hover:bg-gradient-to-tl px-4 py-2 flex justify-center gap-2 rounded-md font-semibold text-black "
                    >
                      <span> Sign Up </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-right-circle self-center"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="m10 8 4 4-4 4"></path>
                      </svg>
                    </button>
                  </div>
                </form>
                <div className="flex items-center justify-between mx-auto">
                  <p className="text-xs sm:text-sm md:text-lg text-lime-200/80">
                    Already have an account?&nbsp;
                    <Link to="/login" className="cursor-pointer">
                      <span className="hover:underline decoration-lime-200 underline-offset-2 text-xs sm:text-sm md:text-lg">
                        Sign In
                      </span>
                    </Link>
                  </p>
                </div>
              </div>
              {/* <div
                    role="region"
                    aria-label="Notifications (F8)"
                    tabIndex="-1"
                  >
                    <ol
                      tabIndex="-1"
                      className="fixed top-0 z-[100] flex h-[25%] w-full flex-col-reverse py-4 pl-4 pr-0 sm:bottom-0 sm:right-0 sm:flex-col md:max-w-[420px]"
                    ></ol>
                  </div> */}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Register;
