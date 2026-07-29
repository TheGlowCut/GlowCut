import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

/**
 * useAuth
 * Convenience hook that exposes everything from AuthContext in one import.
 * Components can destructure exactly what they need.
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}