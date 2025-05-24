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
  const [zehefResults, setZehefResults] = useState([]); // ✅ Default to empty array
  const [inputType, setInputType] = useState("email");
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [hibpResults, setHibpResults] = useState({});
  const [osintDataResults, setOsintDataResults] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // const csrf = useCallback(() => instance.get("/sanctum/csrf-cookie"), []);

  const PUBLIC_ROUTES = ["/", "/about", "/contact-us", "/product", "/privacy"];
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
        console.error("Error fetching user:", error);
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
    }

    const currentPath = window.location.pathname;
    const isPublicRoute = PUBLIC_ROUTES.includes(currentPath);

    if (!isPublicRoute && user === null) {
      getUser();
    }
  }, []);

  const login = async ({ ...data }) => {
    try {
      setErrors([]);

      const response = await instance.post("/api/login", data); // note: use /api/login

      // Save token in localStorage
      localStorage.setItem("auth_token", response.data.token);

      // Set the token in axios headers globally
      instance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      // Fetch user using the token
      await getUser();

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
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
      instance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      await getUser(); // get user info after registering
      navigate("/dashboard");
    } catch (error) {
      console.error("Register error:", error);
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      }
    }
  };

  const logout = async () => {
    try {
      await instance.post("/api/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("auth_token");
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

  // const fetchTelData = async () => {
  //   const fullPhoneNumber = ` ${countryCode.replace("+", "")}${inputValue}`;
  //   setLoading(true);

  //   try {
  //     const { data } = await instance.get("/api/tel", {
  //       params: { number: fullPhoneNumber.trim() },
  //     });

  //     let parsedHLR = null;
  //     try {
  //       parsedHLR =
  //         typeof data.hlrData === "string"
  //           ? JSON.parse(data.hlrData)
  //           : data.hlrData;
  //     } catch (err) {
  //       console.error("Failed to parse HLR data", err);
  //     }

  //     const newResults = {
  //       whatsappData: data.whatsappData || null,
  //       hlrData: parsedHLR,
  //       truecallerData: data.truecallerData || null,
  //       allMobileData: data.allMobileData || null,
  //       socialMediaData: data.socialMediaData || null,
  //       osintData: data.osintData?.data || null,
  //       // surepassKyc: data.surepassKyc || null, // <-- add this
  //       // surepassUpi: data.surepassUpi || null, // <-- add this
  //       // surepassBank: data.surepassBank || null, // <-- add this
  //       errors: data.errors || {},
  //     };

  //     setResults(JSON.parse(JSON.stringify(newResults)));

  //     if (Object.keys(data.errors || {}).length > 0) {
  //       console.log(
  //         `Some APIs failed: ${Object.keys(data.errors)
  //           .map((api) => api.toUpperCase())
  //           .join(", ")}`
  //       );
  //     } else {
  //       toast.success("Data fetched successfully");
  //     }
  //   } catch (error) {
  //     console.error("Error in fetchTelData:", error);
  //     toast.error("Internal server error, please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchEmailData = async () => {
  //   setLoading(true);

  //   try {
  //     const { data } = await instance.get("/api/email", {
  //       params: { email: inputValue },
  //     });

  //     let failedAPIs = [];

  //     // ✅ Google API check
  //     if (data.emailData) {
  //       setResults(data.emailData);
  //     } else {
  //       console.error("Google API failed or returned no data", data.emailData);
  //       failedAPIs.push("Google API");
  //     }

  //     // ✅ Have I Been Pwned (HIBP) API check
  //     if (data.hibpData && data.hibpData.length > 0) {
  //       setHibpResults(data.hibpData);
  //     } else {
  //       console.error(
  //         "Have I Been Pwned API failed or no breaches found",
  //         data.hibpData
  //       );
  //       failedAPIs.push("HIBP API");
  //     }

  //     // ✅ Zehef API check
  //     if (data.zehefData?.data && Array.isArray(data.zehefData.data)) {
  //       const zehefData = data.zehefData.data;
  //       setZehefResults(zehefData);
  //     } else {
  //       console.error("Zehef API failed or returned no data", data.zehefData);
  //       setZehefResults([]);
  //       failedAPIs.push("Zehef API");
  //     }

  //     // ✅ Osint Search API check
  //     if (data.osintData && data.osintData.data) {
  //       console.log("Setting Osint Search Data:", data.osintData.data);
  //       setOsintDataResults(data.osintData.data);
  //     } else {
  //       console.log("No valid Osint Search data found:", data.osintData);
  //       setOsintDataResults(null);
  //       failedAPIs.push("Osint Search API");
  //     }
  //     // 🚨 Log failed APIs
  //     if (failedAPIs.length > 0) {
  //       console.log(`Some APIs failed: ${failedAPIs.join(", ")}`);
  //     } else {
  //       toast.success("Data fetched successfully");
  //     }
  //   } catch (error) {
  //     console.error("Error in fetchEmailData:", error);
  //     toast.error("Error fetching data!");

  //     setZehefResults([]);
  //     setOsintDataResults(null);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

      const parsedHLR =
        typeof data.hlrData === "string"
          ? JSON.parse(data.hlrData)
          : data.hlrData;

      const newResults = {
        whatsappData: data.whatsappData || null,
        hlrData: parsedHLR,
        truecallerData: data.truecallerData || null,
        allMobileData: data.allMobileData || null,
        socialMediaData: data.socialMediaData || null,
        osintData: data.osintData?.data || null,
        // surepassKyc: data.surepassKyc || null, // <-- add this
        // surepassUpi: data.surepassUpi || null, // <-- add this
        // surepassBank: data.surepassBank || null, // <-- add this
        errors: data.errors || {},
      };

      setResults(JSON.parse(JSON.stringify(newResults)));
      return newResults;
    } catch (error) {
      console.error("Error in fetchTelData:", error);
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
    // csrf,
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
