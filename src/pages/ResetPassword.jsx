import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import useAuthContext from "../context/AuthContext";
import { Eye, EyeOff, Key, ArrowRight, ArrowLeft } from "lucide-react";
import { useAlert } from "../components/Alert";
import instance from "../api/axios";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState(null);
  const [password, setPassword] = useState("");
  const [password_confirmation, setPassswordConfirmation] = useState("");
  const [searchParams] = useSearchParams();
  const { token } = useParams();
  const { csrf, loading, setLoading } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const showAlert = useAlert();

  useEffect(() => {
    setEmail(searchParams.get("email") || "");
  }, [searchParams]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    await csrf();
    setErrors([]);
    setStatus(null);

    try {
      const response = await instance.post("/api/reset-password", {
        email,
        token,
        password,
        password_confirmation,
      });
      setStatus(response.data.status);
      showAlert.success(
        "Your password has been reset successfully! Click the button to go back to login.",
        { title: "Password Reset" }
      );
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        showAlert.error("Failed to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {status && (
        <div className="absolute top-6 left-6 z-10">
          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/30 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Login</span>
          </Link>
        </div>
      )}
      
      <section className="my-auto relative flex items-center justify-center flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-emerald-500/5" />
        
        <div className="w-full max-w-md mx-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl blur-xl opacity-20" />
            
            <div className="relative bg-gradient-to-br from-slate-900/80 via-slate-900/90 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8">
              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center mb-4">
                  <Key className="w-8 h-8 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent text-center">
                  {import.meta.env.VITE_APP_NAME}
                </h2>
                <p className="text-slate-400 text-sm mt-2 text-center">
                  Enter your new password to reset your account
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 pr-12"
                    placeholder="Enter your new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[42px] text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {errors.password && errors.password[0] && (
                    <div className="text-red-400 text-sm py-1 mt-1">
                      {errors.password[0]}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={password_confirmation}
                    onChange={(e) => setPassswordConfirmation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 pr-12"
                    placeholder="Confirm your new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-[42px] text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {errors.password_confirmation && errors.password_confirmation[0] && (
                    <div className="text-red-400 text-sm py-1 mt-1">
                      {errors.password_confirmation[0]}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <span>Resetting...</span>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-400 text-sm">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResetPassword;
