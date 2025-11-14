// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = () => {
  const { user } = useAuth();

  // Check if the user is logged in
  if (!user) {
    // If not, redirect them to the /login page
    return <Navigate to="/login" replace />;
  }

  // If they are logged in, show the child route (e.g., PostFormPage)
  return <Outlet />;
};

export default ProtectedRoute;