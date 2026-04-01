import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthContext from "../context/AuthContext";
import Loader from "../components/Loader";
import { useAlert } from "../components/Alert";
import { Eye, EyeOff, Search, Shield, ChevronRight } from "lucide-react";
import instance from "../api/axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPassswordConfirmation] = useState("");
  const { register } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationEnabled, setRegistrationEnabled] = useState(null);
  const navigate = useNavigate();
  const showAlert = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ name, email, password, password_confirmation });
    } catch (error) {
      // Alert already shown by AuthContext
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    instance
      .get("/api/registration-status")
      .then((res) => {
        setRegistrationEnabled(res.data.registration_enabled);
      })
      .catch(() => {
        setRegistrationEnabled(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
        <Loader />
      </div>
    );
  }

  if (!registrationEnabled) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-gray-200 p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5" />
        <div className="relative z-10 text-center">
          <h1 className="text-8xl md:text-9xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 mb-4">
            403
          </h1>
          <div className="inline-block bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 px-4 py-1 rounded-lg mb-4">
            <span className="text-cyan-400 font-semibold">Forbidden</span>
          </div>
          <p className="text-xl md:text-2xl text-slate-400 mb-8">
            Registration is currently disabled.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold hover:from-cyan-400 hover:to-emerald-400 transition-all duration-300 shadow-lg shadow-cyan-500/25"
          >
            Go Back Home
          </button>
        </div>
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
          <div className="flex justify-center lg:grid grid-cols-1 lg:grid-cols-5 max-w-6xl mx-auto">
            <div className="relative col-span-2 hidden lg:flex flex-col justify-center overflow-hidden rounded-l-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-700/50 p-10">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-emerald-500/5" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center">
                    <Search className="w-6 h-6 text-cyan-400" />
                  </div>
                  <Link to="/">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                      {import.meta.env.VITE_APP_NAME}
                    </h2>
                  </Link>
                </div>
                
                <h3 className="text-4xl font-bold leading-tight text-white mb-4">
                  Join Us Today
                </h3>
                <p className="text-slate-400 text-lg mb-8">
                  Create your account and start exploring powerful OSINT tools.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-sm">Secure data protection</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <Search className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-sm">Advanced search capabilities</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyan-500/10 to-transparent" />
            </div>

            <div className="col-start-2 col-span-2 lg:col-span-3 rounded-2xl lg:rounded-l-none bg-gradient-to-b from-slate-900/80 via-slate-900/90 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 shadow-2xl mx-2 md:mx-0">
              <div className="w-full mx-auto flex flex-col gap-6 p-8 sm:p-12 md:p-16">
                <div className="lg:hidden flex items-center justify-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-slate-600/50 flex items-center justify-center">
                    <Search className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h1
                    className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent cursor-pointer"
                    onClick={() => navigate("/")}
                  >
                    {import.meta.env.VITE_APP_NAME}
                  </h1>
                </div>
                
                <div className="text-center lg:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Create Account
                  </h2>
                  <p className="text-slate-400">
                    Fill in your details to get started
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="relative">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 pr-12"
                      placeholder="Create a password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-[42px] text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
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
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-[42px] text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Create Account</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </form>

                <div className="text-center pt-4 border-t border-slate-800">
                  <p className="text-slate-400 text-sm">
                    Already have an account?{" "}
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
    </>
  );
};

export default Register;
