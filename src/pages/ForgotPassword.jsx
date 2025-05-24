import { useState } from "react";
import useAuthContext from "../context/AuthContext";
import axios from "../api/axios";

import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState(null);
  const { csrf, loading, setLoading } = useAuthContext();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true
    await csrf();
    setErrors([]);
    setStatus(null);

    try {
      const response = await axios.post("/forgot-password", { email });
      setStatus(response.data.status);
      // Show success toast when request is successful
      toast.success("Password reset link sent successfully!", {
        position: "top-right",
        autoClose: 5000, // Toast disappears after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      if (error.response.status == 422) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return (
    <>
      <section className="my-auto relative">
        <div className="container mx-auto z-90">
          <div className="flex flex-row justify-center items-center p-0 mx-4">
            <div className="rounded-[20px] text-white md:bg-gray-800 ">
              <div className="mx-auto flex flex-col w-[500px] gap-6 p-3 md:p-16">
                <div className="p-3 pt-0 font-display text-[28px] bg-gradient-to-r from-lime-200 to-teal-800 bg-clip-text text-transparent text-center font-semibold">
                  Osint Work
                </div>
                <form onSubmit={handleForgotPassword}>
                  <div className="relative mb-6">
                    <input
                      type="email"
                      className="bg-gradient-to-r from-slate-600 to-gray-700 flex w-full border border-input px-3 py-2 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-lg file:font-medium placeholder:text-muted-foreground focus:border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 h-11 rounded-md border-none pl-6 text-gray-300 placeholder-gray-300 "
                      placeholder="Enter Your email"
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

                  <div className="flex flex-col gap-6">
                    <button
                      type="submit"
                      className="items-center whitespace-nowrap text-lg ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-lime-200 to-teal-800 from-brand-blue from-0% to-brand-green to-100% hover:bg-gradient-to-tl px-4 py-2 flex h-11 justify-center gap-2.5 rounded-md font-semibold text-black "
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <span>Submitting...</span>
                          <svg
                            aria-hidden="true"
                            role="status"
                            className="inline w-6 h-6 me-3 text-gray-200 animate-spin dark:text-gray-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="#1C64F2"
                            />
                          </svg>
                        </div>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </form>
              </div>
              <div role="region" aria-label="Notifications (F8)" tabIndex="-1">
                <ol
                  tabIndex="-1"
                  className="fixed top-0 z-[100] flex h-[25%] w-full flex-col-reverse py-4 pl-4 pr-0 sm:bottom-0 sm:right-0 sm:flex-col md:max-w-[420px]"
                ></ol>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;
