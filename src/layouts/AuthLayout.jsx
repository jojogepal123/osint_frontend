import useAuthContext from "../context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import SidebarLarge from "../components/SidebarLarge";
import SidebarSmall from "../components/SidebarSmall";

const AuthLayout = () => {
  const { user, setSidebarVisible, sidebarVisible, isLoading } =
    useAuthContext();

  const location = useLocation();

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
        <Loader />
      </div>
    );
  }

  // Allow access to the password reset page even if the user is not authenticated
  if (!user && location.pathname.startsWith("/password-reset")) {
    return <Outlet />;
  }

  const hideSidebar =
    location.pathname.startsWith("/subscription") ||
    location.pathname.startsWith("/results") ||
    location.pathname.startsWith("/corporate-results");

  return user ? (
    <>
      {!hideSidebar && (
        <>
          {/* Mobile Sidebar - Only visible when sidebarVisible is true */}
          {sidebarVisible && (
            <div className="block md:hidden fixed inset-0 bg-black/50 z-50">
              <SidebarSmall />
            </div>
          )}

          {/* Desktop Sidebar - Always visible on md+ screens */}
          <div className="hidden md:block">
            <SidebarLarge />
          </div>
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
