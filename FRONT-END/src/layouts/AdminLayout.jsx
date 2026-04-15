import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar/AdminNavbar";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

// ✅ Skeleton
import AdminLayoutSkeleton from "../components/Skeletons/AdminLayoutSkeleton";

function AdminLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      toast.error("Unauthorized access", { toastId: "auth-error" });
      navigate("/admin/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.role !== "admin") {
        toast.error("Access denied", { toastId: "role-error" });
        navigate("/");
        return;
      }

    } catch (err) {
      console.error("Invalid token", err);
      navigate("/admin/login");
      return;
    }

    setLoading(false);
  }, [token, navigate]);

  // ✅ Show Skeleton while checking auth
  if (loading) return <AdminLayoutSkeleton />;

  return (
    <>
      <AdminNavbar />
      <div style={{ marginTop: "70px" }}>
        <Outlet />
      </div>
    </>
  );
}

export default AdminLayout;