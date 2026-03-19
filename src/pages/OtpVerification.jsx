import { useLocation, useNavigate } from "react-router-dom";
import instance from "../api/axios";
import { useState, useEffect, useRef } from "react";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import useAuthContext from "../context/AuthContext";
import { Shield, Mail, ArrowRight, RefreshCw } from "lucide-react";

const OtpVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const email = location.state?.email;
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const { getUser } = useAuthContext();
  const [canResend, setCanResend] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [otpExpireString, setOtpExpireString] = useState(
    location.state?.otpExpiresAt
  );
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!otpExpireString) return;

    const expiryTime = new Date(otpExpireString).getTime();

    const timer = setInterval(() => {
      const now = Date.now();
      const difference = expiryTime - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft(0);
        setCanResend(true);
      } else {
        setTimeLeft(difference);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [otpExpireString]);

  useEffect(() => {
    setCanResend(false);
  }, [otpExpireString]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleChange = (value, index) => {
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const verifyOtp = async () => {
    const otpValue = otp.join("");

    if (!/^\d{6}$/.test(otpValue)) {
      toast.error("Invalid OTP value");
      return;
    }

    setLoading(true);
    try {
      const res = await instance.post("/api/verify-email-otp", {
        email,
        otp: otpValue,
      });

      localStorage.setItem("auth_token", res.data.token);
      localStorage.setItem("token_expiry", res.data.expires_at);
      instance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.token}`;
      await getUser();
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const res = await instance.post("/api/resend-otp", { email });
      toast.success(res.data?.message || "OTP resend successfully.");
      const newExpiry = new Date(res.data?.otp_expires_at).getTime();
      setOtpExpireString(res.data?.otp_expires_at);
      setTimeLeft(newExpiry - Date.now());
      setCanResend(false);
    } catch (err) {
      toast.error("Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if (!/^\d{6}$/.test(pastedData)) return;

    const newOtp = pastedData.split("");
    setOtp(newOtp);
    inputRefs.current[5]?.focus();
  };

  const handleEnterVerify = (e) => {
    if (e.key === "Enter") {
      verifyOtp();
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <Loader />
        </div>
      )}
      
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl blur-xl opacity-20" />
            
            <div className="relative bg-gradient-to-br from-slate-900/80 via-slate-900/90 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8">
              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-white text-center mb-2">
                  Verify Your Email
                </h2>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>Enter the 6-digit OTP sent to:</span>
                </div>
                <p className="text-cyan-400 font-medium mt-1">{email}</p>
              </div>

              <div className="flex justify-center gap-2 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => {
                      handleKeyDown(e, index);
                      handleEnterVerify(e);
                    }}
                    onPaste={handlePaste}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-slate-800/50 border border-slate-700/50 text-cyan-400 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all duration-300"
                    autoComplete="one-time-code"
                  />
                ))}
              </div>

              <button
                onClick={verifyOtp}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
              >
                <span>Verify OTP</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="mt-6 text-center">
                {canResend ? (
                  <button
                    onClick={handleResendOtp}
                    className="flex items-center gap-2 mx-auto text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Resend OTP
                  </button>
                ) : (
                  <p className="text-slate-400 text-sm">
                    OTP expires in:{" "}
                    <span className="text-cyan-400 font-medium">
                      {formatTime(timeLeft)}
                    </span>
                  </p>
                )}
              </div>

              {message && (
                <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                  <p className="text-red-400 text-sm text-center">{message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OtpVerification;
