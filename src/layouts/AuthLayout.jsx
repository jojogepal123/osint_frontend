import useAuthContext from "../context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import SidebarLarge from "../components/SidebarLarge";
import SidebarSmall from "../components/SidebarSmall";

const AuthLayout = () => {
  const { user, isLoading } = useAuthContext();

  const location = useLocation();

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
        <Loader />
      </div>
    );
  }

  if (!user && location.pathname.startsWith("/password-reset")) {
    return <Outlet />;
  }

  const hideSidebar =
    location.pathname.startsWith("/subscription") ||
    location.pathname.startsWith("/results") ||
    location.pathname.startsWith("/corporate-results") ||
    location.pathname.startsWith("/upgrade") ||
    location.pathname.startsWith("/verification-results");

  return user ? (
    <>
      {!hideSidebar && (
        <>
          <SidebarSmall />
          <SidebarLarge />
        </>
      )}
      <Outlet />
    </>
  ) : (
    <>
      <Navigate to="/login" replace />
    </>
  );
};

export default AuthLayout;
