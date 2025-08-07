import { useLocation, useNavigate } from "react-router-dom";
import instance from "../api/axios";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import useAuthContext from "../context/AuthContext";

const OtpVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const email = location.state?.email;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { getUser } = useAuthContext();
  const [canResend, setCanResend] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [otpExpireString, setOtpExpireString] = useState(
    location.state?.otpExpiresAt
  );

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

  const verifyOtp = async () => {
    if (!otp || !/^\d{6}$/.test(otp)) {
      toast.error("Invalid otp value");
      return;
    }
    setLoading(true);
    try {
      const res = await instance.post("/api/verify-email-otp", { email, otp });

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

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <Loader />
        </div>
      )}
      <div className="min-w-3xl flex flex-col items-center justify-center min-h-screen text-center space-y-4 z-30">
        <h2 className="text-3xl text-gray-200">Verify Your Email</h2>
        <p className="text-sm text-custom-lime">
          Enter the 6-digit OTP sent to: {email}
        </p>
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-48 md:w-96 py-1.5 px-4 border rounded-md border-lime-300 bg-transparent text-gray-200 placeholder:text-gray-200 focus:outline-none transition-all text-sm"
        />
        <button
          className="bg-gradient-to-r text-gray-900 rounded-md font-bold border-none px-4 py-1 hover:bg-gradient-to-l from-lime-200 to-teal-800 text-sm mt-1"
          onClick={verifyOtp}
        >
          Verify
        </button>
        {canResend ? (
          <button
            onClick={handleResendOtp}
            className="text-custom-lime mt-4 underline"
          >
            Resend OTP
          </button>
        ) : (
          <p className="mt-4 text-sm text-gray-500">
            OTP expires in: {formatTime(timeLeft)}
          </p>
        )}
        {message && <p style={{ color: "red" }}>{message}</p>}
      </div>
    </>
  );
};

export default OtpVerification;
