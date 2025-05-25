import useAuthContext from "../context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import SidebarSherlock from "../components/Sidebar-sherlock";
import SidebarNew from "../components/SidebarNew";

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

  const hideSidebar = location.pathname.startsWith("/subscription") || location.pathname.startsWith("/results");

  return user ? (
    <>
      {!hideSidebar && (
        <>
          {/* Mobile Sidebar - Only visible when sidebarVisible is true */}
          {sidebarVisible && (
            <div className="block md:hidden fixed inset-0 bg-black/50 z-50">
              <SidebarNew />
            </div>
          )}

          {/* Desktop Sidebar - Always visible on md+ screens */}
          <div className="hidden md:block">
            <SidebarSherlock />
          </div>
        </>
      )}
      <Outlet />
    </>
  ) : (
    <>
      <Navigate to="/login" replace />
      {console.log("not authorized")}
    </>
  );
};

export default AuthLayout;
