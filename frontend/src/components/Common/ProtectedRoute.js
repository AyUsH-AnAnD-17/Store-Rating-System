import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    // Redirect based on user role
    if (user.role === 'admin') return <Navigate to="/dashboard" replace />;
    if (user.role === 'user') return <Navigate to="/stores" replace />;
    if (user.role === 'store_owner') return <Navigate to="/store-owner" replace />;
  }

  return children;
};

export default ProtectedRoute;