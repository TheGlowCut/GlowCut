import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import Loader from '../ui/Loader';
// hello
/**
 * AuthGuard
 * Wraps routes that require a non-null userType.
 * - null        → redirect to /auth/login
 * - 'guest'     → allowed through (page-level blocks handle booking restrictions)
 * - 'authenticated' → full access
 */
export default function AuthGuard({ children }) {
  const { userType, isLoading } = useContext(AuthContext);
  const location = useLocation();

  if (isLoading) {
    return <Loader variant="full" label="Loading..." />;
  }

  if (userType === null) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
}
