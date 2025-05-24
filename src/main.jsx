import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";
import App from "./App.jsx";
import {GoogleOAuthProvider} from "@react-oauth/google";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="435727612049-73dduj4mj3lichr6ufjb8u2r3j9ibohc.apps.googleusercontent.com">
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>
);
