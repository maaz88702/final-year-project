import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

// Components
import TeacherNavbar from "../components/TeacherNavbar/TeacherNavbar.jsx";
import TeacherLayoutSkeleton from "../components/Skeletons/TeacherLayoutSkeleton";

const TeacherLayout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      toast.error("Unauthorized access", { toastId: "teacher-auth" });
      navigate("/teacher/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.role !== "teacher") {
        toast.error("Access denied", { toastId: "teacher-role" });
        navigate("/");
        return;
      }

    } catch (err) {
      console.error("Invalid token", err);
      navigate("/teacher/login");
      return;
    }

    setLoading(false);
  }, [token, navigate]);

  // ✅ Show skeleton while validating
  if (loading) return <TeacherLayoutSkeleton />;

  return (
    <>
      <TeacherNavbar />

      {/* Adjust spacing if navbar is fixed */}
      <div style={{ marginTop: "70px" }}>
        <Outlet />
      </div>
    </>
  );
};

export default TeacherLayout;