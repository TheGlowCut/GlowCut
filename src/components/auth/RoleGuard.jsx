import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import Loader from '../ui/Loader';

/**
 * RoleGuard
 * Restricts a route subtree to specific `profile.role` values.
 * - 'owner' also matches the backend's legacy 'admin' role, which the
 *   register/login endpoints use for salon owners (see user.model.js).
 * - 'admin' matches only the platform-level admin role.
 *
 * Usage: <RoleGuard allow={['owner']}><ShopkeeperDashboard /></RoleGuard>
 */
export default function RoleGuard({ allow = [], children, redirectTo = '/' }) {
  const { profile, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <Loader variant="full" label="Checking access..." />;
  }

  const role = profile?.role;
  const isAllowed = allow.includes(role);

  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
