import { useState } from "react";
import useAuthContext from "../context/AuthContext";
import axios from "../api/axios";
import { useAlert } from "../components/Alert";
import { Shield, Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState([]);
  const { csrf, loading, setLoading } = useAuthContext();
  const showAlert = useAlert();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    await csrf();
    setErrors([]);

    try {
      const response = await axios.post("/forgot-password", { email });
      showAlert.success("Password reset link sent successfully!", { title: "Email Sent" });
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        showAlert.error("Failed to send reset link. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section className="my-auto relative flex items-center justify-center flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-emerald-500/5" />
        
        <div className="w-full max-w-md mx-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl blur-xl opacity-20" />
            
            <div className="relative bg-gradient-to-br from-slate-900/80 via-slate-900/90 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8">
              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent text-center">
                  {import.meta.env.VITE_APP_NAME || 'OSINT Platform'}
                </h2>
                <p className="text-slate-400 text-sm mt-2 text-center">
                  Enter your email to receive a password reset link
                </p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="email"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  {errors.email && errors.email[0] && (
                    <div className="text-red-400 text-sm py-1 mt-1">
                      {errors.email[0]}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
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

export default ForgotPassword;
