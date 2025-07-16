import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import AuthLayout from "./layouts/AuthLayout";
import GuestLayout from "./layouts/GuestLayout";
import ResetPassword from "./pages/ResetPassword";
import Results from "./pages/Results";
import useAuthContext from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ParticlesComponent from "./layouts/ParticlesComponent";
import Subscription from "./pages/Subscription";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import Main from "./pages/Main";
import Privacy from "./pages/Privacy";
import { AnimatePresence, motion } from "framer-motion";
import PageTransition from "./components/PageTransition";
import RefundPolicy from "./pages/RefundPolicy";
import TermsConditions from "./pages/TermsConditions";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import LeakDataFinder from "./pages/LeakDataFinder";
import CorporateFinder from "./pages/CorporateFinder";
import CorporateResults from "./pages/CorporateResults";
function App() {
  const { sidebarVisible, setSidebarVisible, user, isLoading } =
    useAuthContext();
  const location = useLocation();
  const hideSidebar =
    location.pathname.startsWith("/subscription") ||
    location.pathname.startsWith("/results") ||
    location.pathname.startsWith("/corporate-results");
  const openMenu = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <>
      <ToastContainer />
      <div className="relative flex flex-col min-h-screen w-full">
        <ParticlesComponent id="particle-background" />
        <div
          className={`absolute top-4 left-4 z-[9999] md:hidden ${
            sidebarVisible || hideSidebar ? "hidden" : ""
          }`}
        >
          <button
            onClick={openMenu}
            className="hover:bg-gray-800 text-white hover:text-lime-200 rounded-md p-1 focus:outline-none text-2xl"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
            >
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Protected routes */}
            <Route element={<AuthLayout />}>
              <Route path="/dashboard" element={<Home />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/results" element={<Results />} />
              <Route path="/leak-data-finder" element={<LeakDataFinder />} />
              <Route path="/corporate" element={<CorporateFinder />} />
              <Route path="/corporate-results" element={<CorporateResults />} />
            </Route>

            {/* Guest routes */}
            <Route element={<GuestLayout />}>
              <Route
                path="/login"
                element={
                  <PageTransition>
                    <Login />
                  </PageTransition>
                }
              />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/password-reset/:token"
                element={<ResetPassword />}
              />
              <Route
                path="/"
                element={
                  <PageTransition>
                    <Main />
                  </PageTransition>
                }
              />
              <Route
                path="/about"
                element={
                  <PageTransition>
                    <About />
                  </PageTransition>
                }
              />
              <Route
                path="/contact-us"
                element={
                  <PageTransition>
                    <ContactUs />
                  </PageTransition>
                }
              />
              <Route
                path="/privacy"
                element={
                  <PageTransition>
                    <Privacy />
                  </PageTransition>
                }
              />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;
