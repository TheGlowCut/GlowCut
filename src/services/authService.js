import apiClient, { tokenStorage } from './apiClient';

/**
 * authService — thin wrapper around the Qitmeer backend's /api/auth routes.
 * Every function returns the parsed backend payload (res.data) so callers
 * can read `.success`, `.message`, `.user`, `.accessToken`, etc. directly.
 * All errors bubble up as Error objects with a human readable `.message`
 * (see apiClient's response interceptor).
 */

export async function register(payload) {
  try {
    console.log("ACTUAL PAYLOAD BEING SENT:", payload);
    const { data } = await apiClient.post('/auth/register', payload);
    return data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw error; // Let the component handle it exactly as instructed
    }
    throw error;
  }
}

export async function login({ email, password }) {
  const { data } = await apiClient.post('/auth/login', { email, password });
  if (data?.accessToken) tokenStorage.setAccessToken(data.accessToken);
  return data;
}

export async function logout() {
  try {
    await apiClient.post('/auth/logout');
  } finally {
    tokenStorage.clear();
  }
  return true;
}

export async function logoutAll() {
  try {
    await apiClient.post('/auth/logoutAll');
  } finally {
    tokenStorage.clear();
  }
  return true;
}

export async function getMe() {
  const { data } = await apiClient.get('/auth/me');
  return data;
}

export async function updateProfile(payload) {
  // payload: { name, userName, phone, PhoneNumber, cities }
  const { data } = await apiClient.patch('/auth/profile', payload);
  return data;
}

export async function updateProfileImage(file) {
  const formData = new FormData();
  formData.append('profileImage', file);
  const { data } = await apiClient.patch('/auth/profile-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function changePassword({ oldPassword, newPassword }) {
  const { data } = await apiClient.post('/auth/change-password', { oldPassword, newPassword });
  return data;
}

export async function deleteAccount() {
  const { data } = await apiClient.delete('/auth/account');
  tokenStorage.clear();
  return data;
}

export async function verifyEmail({ email, otp }) {
  const { data } = await apiClient.post('/auth/verifyEmail', { email, otp });
  return data;
}

export async function resendVerificationOtp({ email }) {
  const { data } = await apiClient.post('/auth/resend-verification-otp', { email });
  return data;
}

export async function forgotPassword({ email }) {
  const { data } = await apiClient.post('/auth/forgot-password', { email });
  return data;
}

export async function verifyPasswordResetOtp({ email, otp }) {
  const { data } = await apiClient.post('/auth/verify-otp', { email, otp });
  return data;
}

export async function resetPassword({ email, otp, newPassword }) {
  const { data } = await apiClient.post('/auth/reset-password', { email, otp, newPassword });
  return data;
}
