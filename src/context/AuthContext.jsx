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
        wpData: data.wpData || null,
        hData: parsedHLR,
        tcData: data.tcData || null,
        allMData: data.allData || null,
        smData: data.smData || null,
        osintData: data.osintData || null,
        spkData: data.skData || null,
        spuData: data.suData || null,
        spbData: data.sbData || null,
        sprcData: data.srData || null,
        tlgData: data.telData || null,
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
