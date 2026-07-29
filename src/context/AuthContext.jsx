import { createContext, useState, useCallback, useEffect, useContext, useRef } from 'react';
import * as authService from '../services/authService';
import { tokenStorage } from '../services/apiClient';

export const AuthContext = createContext(null);

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

// Maps the backend's `user` object (see user.controller.js -> publicUser)
// into the flat `profile` shape the rest of the app already reads from.
const toProfile = (backendUser, extra = {}) => {
  if (extra.salon?._id) {
    try {
      window.localStorage.setItem('salonId', extra.salon._id);
    } catch (err) {
      // ignore storage errors (e.g. private browsing)
    }
  }
  return {
    id: backendUser?.id,
    name: backendUser?.name || backendUser?.userName || 'User',
    userName: backendUser?.userName || backendUser?.name || '',
    email: backendUser?.email || '',
    phone: backendUser?.phone || backendUser?.PhoneNumber || '',
    PhoneNumber: backendUser?.PhoneNumber || backendUser?.phone || '',
    cities: backendUser?.cities || '',
    role: backendUser?.role || 'user',
    isVerified: backendUser?.isVerified,
    profileImage: backendUser?.profileImage || '',
    avatar: backendUser?.profileImage || DEFAULT_AVATAR,
    status: backendUser?.status || 'active',
    hasSalon: extra.hasSalon || false,
    salon: extra.salon || null,
  };
};

export function AuthProvider({ children }) {
  const [userType, setUserType] = useState(null); // null | 'guest' | 'authenticated'
  const [user, setUser] = useState(null); // raw backend user object
  const [profile, setProfile] = useState(null); // normalized UI-friendly profile
  const [isLoading, setIsLoading] = useState(true);
  const bootstrapped = useRef(false);

  const setSession = useCallback((backendUser, extra = {}) => {
    setUser(backendUser);
    setUserType('authenticated');
    setProfile(toProfile(backendUser, extra));
  }, []);

  // On first mount: if we have a stored access token, fetch the fresh user
  // profile from GET /me instead of trusting stale localStorage data.
  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    const bootstrap = async () => {
      const token = tokenStorage.getAccessToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await authService.getMe();
        if (res?.success) {
          setSession(res.user, { hasSalon: res.hasSalon, salon: res.salon });
        } else {
          tokenStorage.clear();
        }
      } catch (err) {
        tokenStorage.clear();
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, [setSession]);

  const login = useCallback(async ({ email, password }) => {
    setIsLoading(true);
    try {
      const res = await authService.login({ email, password });
      if (!res?.success) throw new Error(res?.message || 'Login failed');
      setSession(res.user, { hasSalon: res.hasSalon, salon: res.salon });
      return res;
    } finally {
      setIsLoading(false);
    }
  }, [setSession]);

  const register = useCallback(async (payload) => {
    setIsLoading(true);
    try {
      const res = await authService.register(payload);
      if (!res?.success) throw new Error(res?.message || 'Registration failed');
      // Registration does not log the user in yet — email must be verified first.
      return res;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Backward-compatible alias used by a couple of older components.
  const signup = register;

  const verifyEmail = useCallback(async ({ email, otp }) => {
    const res = await authService.verifyEmail({ email, otp });
    if (!res?.success) throw new Error(res?.message || 'OTP verification failed');
    return res;
  }, []);

  const resendVerificationOtp = useCallback(async ({ email }) => {
    const res = await authService.resendVerificationOtp({ email });
    if (!res?.success) throw new Error(res?.message || 'Could not resend OTP');
    return res;
  }, []);

  const forgotPassword = useCallback(async ({ email }) => {
    const res = await authService.forgotPassword({ email });
    if (!res?.success) throw new Error(res?.message || 'Could not send reset OTP');
    return res;
  }, []);

  const verifyPasswordResetOtp = useCallback(async ({ email, otp }) => {
    const res = await authService.verifyPasswordResetOtp({ email, otp });
    if (!res?.success) throw new Error(res?.message || 'OTP verification failed');
    return res;
  }, []);

  const resetPassword = useCallback(async ({ email, otp, newPassword }) => {
    const res = await authService.resetPassword({ email, otp, newPassword });
    if (!res?.success) throw new Error(res?.message || 'Password reset failed');
    return res;
  }, []);

  const changePassword = useCallback(async ({ oldPassword, newPassword }) => {
    const res = await authService.changePassword({ oldPassword, newPassword });
    if (!res?.success) throw new Error(res?.message || 'Could not change password');
    // Backend revokes all sessions on password change.
    tokenStorage.clear();
    setUser(null);
    setUserType(null);
    setProfile(null);
    return res;
  }, []);

  const updateProfile = useCallback(async (updates) => {
    // If caller already passed a full backend `user` object (e.g. after an
    // image upload response), just merge it straight into state.
    if (updates && updates.__isBackendUser) {
      setUser(updates.user);
      setProfile((prev) => toProfile(updates.user, prev || {}));
      return updates.user;
    }

    const res = await authService.updateProfile(updates);
    if (!res?.success) throw new Error(res?.message || 'Profile update failed');
    setUser(res.user);
    setProfile((prev) => toProfile(res.user, prev || {}));
    return res.user;
  }, []);

  const updateProfileImage = useCallback(async (file) => {
    const res = await authService.updateProfileImage(file);
    if (!res?.success) throw new Error(res?.message || 'Image upload failed');
    setUser(res.user);
    setProfile((prev) => toProfile(res.user, prev || {}));
    return res.user;
  }, []);

  const markSalonSetupComplete = useCallback((salon) => {
    if (salon?._id) {
      window.localStorage.setItem('salonId', salon._id);
    }
    setProfile((prev) => ({
      ...prev,
      hasSalon: true,
      salon: salon || prev?.salon || null,
    }));
  }, []);

  const deleteAccount = useCallback(async () => {
    const res = await authService.deleteAccount();
    setUser(null);
    setUserType(null);
    setProfile(null);
    return res;
  }, []);

  const loginAsGuest = useCallback(() => {
    const guest = { id: 'guest', userName: 'Guest', role: 'guest', isGuest: true };
    setUser(guest);
    setUserType('guest');
    setProfile({
      name: 'Guest',
      email: '',
      phone: '',
      cities: '',
      avatar: DEFAULT_AVATAR,
      role: 'guest',
      hasSalon: false,
    });
    return guest;
  }, []);

  const continueAsGuest = loginAsGuest;

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      // Ignore network errors on logout — always clear client state.
    }
    window.localStorage.removeItem('salonId');
    setUser(null);
    setUserType(null);
    setProfile(null);
  }, []);

  const logoutAll = useCallback(async () => {
    try {
      await authService.logoutAll();
    } catch (err) {
      // ignore
    }
    window.localStorage.removeItem('salonId');
    setUser(null);
    setUserType(null);
    setProfile(null);
  }, []);

  const isAuthenticated = userType === 'authenticated';
  const isGuest = userType === 'guest';

  const value = {
    user,
    userType,
    isAuthenticated,
    isGuest,
    isLoading,
    profile,
    token: tokenStorage.getAccessToken(),
    login,
    register,
    signup,
    verifyEmail,
    resendVerificationOtp,
    forgotPassword,
    verifyPasswordResetOtp,
    resetPassword,
    changePassword,
    loginAsGuest,
    continueAsGuest,
    updateProfile,
    updateProfileImage,
    markSalonSetupComplete,
    deleteAccount,
    logout,
    logoutAll,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
