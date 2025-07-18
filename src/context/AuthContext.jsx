import { createContext, useContext, useEffect, useState } from "react";
import instance from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState({});
  const [zehefResults, setZehefResults] = useState([]);
  const [inputType, setInputType] = useState("email");
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [hibpResults, setHibpResults] = useState({});
  const [osintDataResults, setOsintDataResults] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // const csrf = useCallback(() => instance.get("/sanctum/csrf-cookie"), []);

  const PUBLIC_ROUTES = [
    "/",
    "/about",
    "/contact-us",
    "/product",
    "/privacy",
    "/pricing",
    "/terms-conditions",
    "/refund-policy",
    "/shipping-policy",
    "/return-policy",
  ];
  const AUTH_ROUTE_PREFIXES = ["/password-reset", "/login", "/register"];

  const getUser = async () => {
    if (user) return;

    try {
      const { data } = await instance.get("/api/user");
      setUser(data);
    } catch (error) {
      if (error.response?.status === 401) {
        setUser(null);
        const currentPath = window.location.pathname;
        const isPublicRoute = PUBLIC_ROUTES.includes(currentPath);
        const isAuthRoute = AUTH_ROUTE_PREFIXES.some((prefix) =>
          currentPath.startsWith(prefix)
        );

        if (!isPublicRoute && !isAuthRoute) {
          navigate("/login");
        }
      } else {
        // console.error("Error fetching user:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Update the useEffect to use the constants
  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      getUser();
    } else {
      setIsLoading(false);
    }
    // 🔐 Token expiry check every minute
    const interval = setInterval(() => {
      const expiry = localStorage.getItem("token_expiry");
      // console.log("Token Expires At:", expiry);
      if (expiry && new Date(expiry) <= new Date()) {
        logout();
        toast.warning("Session expired. Please log in again.");
      }
    }, 60000); // every 60 seconds

    return () => clearInterval(interval);
    // const currentPath = window.location.pathname;
    // const isPublicRoute = PUBLIC_ROUTES.includes(currentPath);

    // if (!isPublicRoute && user === null) {
    //   getUser();
    // }
  }, []);

  const login = async ({ ...data }) => {
    try {
      setErrors([]);

      const response = await instance.post("/api/login", data); // note: use /api/login

      // Save token in localStorage
      localStorage.setItem("auth_token", response.data.token);
      localStorage.setItem("token_expiry", response.data.expires_at); // Save token expiry
      // Set the token in axios headers globally
      instance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      // Fetch user using the token
      await getUser();

      navigate("/dashboard");
    } catch (error) {
      // console.error("Login error:", error);
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      }
    }
  };

  const register = async ({ ...data }) => {
    try {
      setErrors([]);

      const response = await instance.post("/api/register", data);

      localStorage.setItem("auth_token", response.data.token);
      localStorage.setItem("token_expiry", response.data.expires_at); // save expiry
      instance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      await getUser(); // get user info after registering
      navigate("/dashboard");
    } catch (error) {
      // console.error("Register error:", error);
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      }
    }
  };

  const logout = async () => {
    try {
      await instance.post("/api/logout");
    } catch (error) {
      // console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("token_expiry");
      delete instance.defaults.headers.common["Authorization"];
      setUser(null);
      navigate("/");
    }
  };

  const validateInput = () => {
    const regex =
      inputType === "email" ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/ : /^\d{10}$/;

    if (!regex.test(inputValue)) {
      toast.error(
        inputType === "email"
          ? "Please enter a valid email address"
          : "Please enter a valid phone number"
      );
      return false;
    }
    return true;
  };

  const fetchTelData = async () => {
    const fullPhoneNumber = `${countryCode.replace(
      "+",
      ""
    )}${inputValue.trim()}`;
    setLoading(true);

    try {
      const { data } = await instance.get("/api/tel", {
        params: { number: fullPhoneNumber },
      });
      // console.log("Raw /api/tel response:", data); // ✅ Log full response
      const parsedHLR =
        typeof data.hlrData === "string"
          ? JSON.parse(data.hlrData)
          : data.hlrData;

      const newResults = {
        wpData: data.wpData || null,
        hData: parsedHLR,
        tcData: data.tcData || null,
        allMData: data.allData || null,
        smData: data.smData || null,
        osintData: data.osintData || null,
        spkData: data.sKData || null,
        spuData: data.suData || null,
        spbData: data.sbData || null,
        sprcData: data.srData || null,
        tlgData: data.telData || null,
        // srfullData: data.srfullData || null, // ✅ Make sure you access this
        errors: data.errors || {},
      };
      // console.log("Parsed srfullData:", newResults.srfullData); // ✅ Extra log
      setResults(JSON.parse(JSON.stringify(newResults)));
      return newResults;
    } catch (error) {
      // console.error("Error in fetchTelData:", error);
      toast.error("Internal server error, please try again.");
      setResults({});
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailData = async () => {
    setLoading(true);
    try {
      const { data } = await instance.get("/api/email", {
        params: { email: inputValue },
      });

      // Save to one context state
      setResults(data);

      return data;
    } catch (error) {
      toast.error("Something went wrong");
      setResults({});
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    errors,
    getUser,
    login,
    register,
    logout,
    sidebarVisible,
    setSidebarVisible,
    validateInput,
    fetchTelData,
    fetchEmailData,
    setInputValue,
    inputValue,
    results,
    setResults,
    inputType,
    setInputType,
    loading,
    setLoading,
    countryCode,
    setCountryCode,
    hibpResults,
    setHibpResults,
    isCollapsed,
    setIsCollapsed,
    isLoading,
    zehefResults,
    setZehefResults,
    osintDataResults,
    setOsintDataResults,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default function useAuthContext() {
  return useContext(AuthContext);
}
