import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import AuthLayout from "./layouts/AuthLayout";
import GuestLayout from "./layouts/GuestLayout";
import ResetPassword from "./pages/ResetPassword";
import Results from "./pages/Results";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Background from "./layouts/Background";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import Main from "./pages/Main";
import Privacy from "./pages/Privacy";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/PageTransition";
import RefundPolicy from "./pages/RefundPolicy";
import TermsConditions from "./pages/TermsConditions";
import NotFound from "./pages/NotFound";
import LeakDataFinder from "./pages/LeakDataFinder";
import CorporateFinder from "./pages/CorporateFinder";
import CorporateResults from "./pages/CorporateResults";
import VerificationFinder from "./pages/VerificationFinder";
import VerificationResults from "./pages/VerificationResults";
import LiveOnlyRoute from "./components/LiveOnlyRoute";
import Upgrade from "./pages/Upgrade";
import OtpVerification from "./pages/OtpVerification";

function App() {
  const location = useLocation();

  return (
    <>
      <ToastContainer />
      <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden">
        <Background />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Protected routes */}
            <Route element={<AuthLayout />}>
              <Route path="/dashboard" element={<Home />} />
              {/* <Route path="/subscription" element={<Subscription />} /> */}
              <Route path="/results" element={<Results />} />
              <Route path="/leak-data-finder" element={<LeakDataFinder />} />
              <Route
                path="/corporate"
                element={
                  <LiveOnlyRoute>
                    <CorporateFinder />
                  </LiveOnlyRoute>
                }
              />
              <Route
                path="/verification-id"
                element={
                  <LiveOnlyRoute>
                    <VerificationFinder />
                  </LiveOnlyRoute>
                }
              />
              <Route
                path="/corporate-results"
                element={
                  <LiveOnlyRoute>
                    <CorporateResults />
                  </LiveOnlyRoute>
                }
              />
              <Route
                path="/verification-results"
                element={
                  <LiveOnlyRoute>
                    <VerificationResults />
                  </LiveOnlyRoute>
                }
              />
              <Route path="/upgrade" element={<Upgrade />} />
            </Route>
            <Route path="/otp-verification" element={<OtpVerification />} />
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
              {/* <Route path="/pricing" element={<Pricing />} /> */}
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
