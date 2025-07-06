import axios from "axios";
import { toast } from "react-toastify";
// Create Axios instance (recommended over modifying default axios)
const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Automatically attach Authorization token from localStorage
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
let isRedirecting = false;

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isRedirecting) {
      isRedirecting = true;
      localStorage.removeItem("auth_token");
      localStorage.removeItem("token_expiry");
      toast.error("Session expired. Please log in again.");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default instance;
