import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Guards a route. `role` (optional) restricts to 'user' or 'foodPartner'.
 * While the session is being resolved, renders a lightweight loader so we
 * don't flash a redirect before /me responds.
 */
const ProtectedRoute = ({ role, children }) => {
  const { loading, isAuthenticated, role: currentRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="route-loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const loginPath = role === 'foodPartner' ? '/food-partner/login' : '/user/login';
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  if (role && currentRole !== role) {
    // Logged in but wrong role — send them to a sensible home.
    return <Navigate to={currentRole === 'foodPartner' ? '/food-partner/home' : '/home'} replace />;
  }

  return children;
};

export default ProtectedRoute;
