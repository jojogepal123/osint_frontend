import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthContext from "../context/AuthContext";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import Loader from "../components/Loader";
import { useGoogleLogin } from "@react-oauth/google";
import instance from "../api/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const { login, errors, getUser } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false); // Toggle state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when login process starts
    try {
      await login({ email, password });
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false); // Set loading to false when login process ends
    }
  };

  const handleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const res = await instance.post("/api/google-login", {
          token: tokenResponse.access_token,
        });

        localStorage.setItem("auth_token", res.data.token);

        // You can redirect or update UI here
        await getUser();
        navigate("/dashboard");
      } catch (err) {
        toast.error("Google login failed. Please try again.");
        // console.error("Google login failed:", err);
      } finally {
        setLoading(false);
      }
    },
    onError: (err) => {
      // console.error("Google login error:", err);
      toast.error("Google login failed.");
    },
    flow: "implicit",
    scope: "openid email profile",
  });

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <Loader />
        </div>
      )}
      {!loading && (
        <section className="my-auto relative">
          <div className="container mx-auto max-w-6xl z-90 flex items-center justify-center h-screen">
            <div className="flex flex-row p-0 mx-0 sm:mx-4">
              <div className="grid grid-cols-1 lg:grid-cols-5 mx-auto">
                <div className="relative col-span-2 hidden overflow-hidden rounded-l-[20px] bg-gray-700 bg-opacity-30 backdrop-blur-lg pl-10 pr-6 pt-16 text-black lg:block">
                  <img
                    src="data:image/svg+xml,%3csvg%20width='463'%20height='341'%20viewBox='0%200%20463%20341'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20opacity='0.3'%3e%3crect%20x='264'%20y='324'%20width='199.669'%20height='34'%20fill='%233DB8FA'/%3e%3crect%20y='216'%20width='36.5336'%20height='34'%20fill='%234B5563'/%3e%3crect%20y='54'%20width='115.388'%20height='34'%20fill='%234B5563'/%3e%3crect%20x='205.456'%20width='101.281'%20height='34'%20fill='%23374151'/%3e%3crect%20x='121.176'%20y='54'%20width='185.562'%20height='34'%20fill='%233DB8FA'/%3e%3crect%20x='205.456'%20y='108'%20width='171.816'%20height='34'%20fill='%2354E9E2'/%3e%3crect%20x='167.476'%20y='162'%20width='161.688'%20height='34'%20fill='%2354E9E2'/%3e%3crect%20x='126.963'%20y='270'%20width='101.281'%20height='34'%20fill='%234B5563'/%3e%3crect%20x='312.525'%20width='150.475'%20height='34'%20fill='%233DB8FA'/%3e%3crect%20x='383.06'%20y='108'%20width='79.9398'%20height='34'%20fill='%234B5563'/%3e%3crect%20x='334.952'%20y='162'%20width='128.048'%20height='34'%20fill='%233DB8FA'/%3e%3crect%20x='356.655'%20y='216'%20width='106.345'%20height='34'%20fill='%2354E9E2'/%3e%3crect%20x='234.032'%20y='270'%20width='228.968'%20height='34'%20fill='%2354E9E2'/%3e%3c/g%3e%3c/svg%3e"
                    className="absolute right-0 bottom-0"
                  ></img>

                  <div className="mt-2 font-display text-4xl font-bold leading-tight bg-gradient-to-r from-lime-200 to-teal-800 bg-clip-text text-transparent">
                    Proactive Intelligence: Uncover Threats, Secure the Future.
                  </div>
                </div>
                <div className="w-[350px] md:w-[600px] col-start-2 col-span-2 lg:col-span-3 rounded-[20px] text-white lg:rounded-l-[0px] bg-gray-800 bg-opacity-30 backdrop-blur-lg ">
                  <div className="mx-auto flex flex-col gap-6 p-12 md:p-16">
                    <div className="p-3 pt-0 text-[28px] bg-gradient-to-r from-lime-200 to-teal-800 bg-clip-text text-transparent text-center font-semibold cursor-pointer">
                      <h1 onClick={() => navigate("/")}>OSINT WORK</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className="relative mb-6">
                        <input
                          type="email"
                          className="bg-gradient-to-r from-slate-600 to-gray-700 flex w-full border border-input px-3 py-2 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-lg file:font-medium placeholder:text-muted-foreground focus:border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 h-11 rounded-md border-none pl-6 text-gray-300 placeholder-gray-300"
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
                      <div className="relative mb-6">
                        <input
                          type={showPassword ? "text" : "password"} // Toggle type
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-gradient-to-r from-slate-600 to-gray-700 flex w-full border border-input px-3 py-2 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-lg file:font-medium placeholder:text-muted-foreground focus:border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 h-11 rounded-md border-none pl-6 text-gray-300 placeholder-gray-300"
                          placeholder="Password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                        {errors.password && errors.password[0] && (
                          <div className="text-red-500 py-1 text-md text-start">
                            {errors.password[0]}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-6">
                        <button
                          type="submit"
                          className="items-center whitespace-nowrap text-lg ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-lime-200 to-teal-800 from-brand-blue from-0% to-brand-green to-100% hover:bg-gradient-to-tl px-4 py-2 flex h-11 justify-center gap-2.5 rounded-md font-semibold text-black "
                        >
                          <span> Sign In </span>
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

                        {/* <div className="text-center text-lg">
                          <p className="relative text-gray-300 before:absolute before:left-0 before:top-1/2 before:inline-block before:h-px before:w-[45%] before:bg-gray-500 after:absolute after:right-0 after:top-1/2 after:inline-block after:h-px after:w-[45%] after:bg-gray-500">
                            OR
                          </p>
                        </div>
                        //  google login button  
                        <button onClick={() => handleLogin()} className="whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-600 text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 gradient-background flex w-2/3 flex-row justify-center  items-center rounded-md font-bold mx-auto">
                          <img src="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='flat-color-icons:google'%3e%3cpath%20id='Vector'%20d='M21.8055%2010.0415H21V10H12V14H17.6515C16.827%2016.3285%2014.6115%2018%2012%2018C8.6865%2018%206%2015.3135%206%2012C6%208.6865%208.6865%206%2012%206C13.5295%206%2014.921%206.577%2015.9805%207.5195L18.809%204.691C17.023%203.0265%2014.634%202%2012%202C6.4775%202%202%206.4775%202%2012C2%2017.5225%206.4775%2022%2012%2022C17.5225%2022%2022%2017.5225%2022%2012C22%2011.3295%2021.931%2010.675%2021.8055%2010.0415Z'%20fill='%23FFC107'/%3e%3cpath%20id='Vector_2'%20d='M3.15295%207.3455L6.43845%209.755C7.32745%207.554%209.48045%206%2012%206C13.5295%206%2014.921%206.577%2015.9805%207.5195L18.809%204.691C17.023%203.0265%2014.634%202%2012%202C8.15895%202%204.82795%204.1685%203.15295%207.3455Z'%20fill='%23FF3D00'/%3e%3cpath%20id='Vector_3'%20d='M12%2022C14.583%2022%2016.93%2021.0115%2018.7045%2019.404L15.6095%2016.785C14.5718%2017.5742%2013.3038%2018.001%2012%2018C9.39903%2018%207.19053%2016.3415%206.35853%2014.027L3.09753%2016.5395C4.75253%2019.778%208.11353%2022%2012%2022Z'%20fill='%234CAF50'/%3e%3cpath%20id='Vector_4'%20d='M21.8055%2010.0415H21V10H12V14H17.6515C17.2571%2015.1082%2016.5467%2016.0766%2015.608%2016.7855L15.6095%2016.7845L18.7045%2019.4035C18.4855%2019.6025%2022%2017%2022%2012C22%2011.3295%2021.931%2010.675%2021.8055%2010.0415Z'%20fill='%231976D2'/%3e%3c/g%3e%3c/svg%3e"></img>
                          <span className="ml-1 md:ml-2 text-center text-xs md:text-sm lg:text-lg font-medium bg-gradient-to-r text-lime-200">
                            Continue with Google
                          </span>
                        </button> */}
                      </div>
                    </form>
                    <div className="flex items-center justify-center">
                      {/* <div className="hover:underline">
                        <Link
                          to="/forgot-password"
                          className="
                inline-block
                bg-gradient-to-r from-lime-200 to-teal-800 bg-clip-text text-transparent
                hover:underline decoration-[#34d399] underline-offset-2 text-xs sm:text-sm md:text-lg"
                        >
                          Forgot Password?
                        </Link>
                      </div> */}
                      <div className="text-xs sm:text-sm md:text-lg bg-gradient-to-l from-lime-200 to-teal-800 bg-clip-text text-transparent">
                        Not a member yet?&nbsp;
                        <Link
                          to="/register"
                          className="cursor-pointer text-xs sm:text-sm md:text-lg"
                        >
                          <span className="hover:underline decoration-[#34d399] underline-offset-2">
                            Sign Up
                          </span>
                        </Link>
                      </div>
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
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Login;
