import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

// Components
import StudentNavbar from "../components/StudentNavbar/StudentNavbar";
import StudentLayoutSkeleton from "../components/Skeletons/StudentLayoutSkeleton";

const StudentLayout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      toast.error("Unauthorized access", { toastId: "student-auth" });
      navigate("/student/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.role !== "student") {
        toast.error("Access denied", { toastId: "student-role" });
        navigate("/");
        return;
      }

    } catch (err) {
      console.error("Invalid token", err);
      navigate("/student/login");
      return;
    }

    setLoading(false);
  }, [token, navigate]);

  // ✅ Skeleton while checking auth
  if (loading) return <StudentLayoutSkeleton />;

  return (
    <>
      <StudentNavbar />

      {/* Content spacing (if navbar fixed) */}
      <div style={{ marginTop: "70px" }}>
        <Outlet />
      </div>
    </>
  );
};

export default StudentLayout;