import axios from "axios";

// Create Axios instance (recommended over modifying default axios)
const instance = axios.create({
  baseURL: "http://localhost:8000", // Laravel backend
  // baseURL: "https://api.osintwork.com", //laravel for production
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

export default instance;
