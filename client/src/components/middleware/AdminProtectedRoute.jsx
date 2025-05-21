import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  const { user } = useSelector((state) => state.user);
  return user && user.role === "admin" ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminProtectedRoute;
