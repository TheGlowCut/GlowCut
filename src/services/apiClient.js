import axios from 'axios';
import toast from 'react-hot-toast';

// Base URL of the backend API. Set VITE_API_BASE_URL in your .env file.
// Falls back to localhost for local development against the Qitmeer backend.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://glow-cut-product-complete-backend.vercel.app/api';

const ACCESS_TOKEN_KEY = 'glowcut_access_token';
const REFRESH_TOKEN_KEY = 'glowcut_refresh_token';

export const tokenStorage = {
  getAccessToken: () => window.localStorage.getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token) => {
    if (token) window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  getRefreshToken: () => window.localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token) => {
    if (token) window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
  clear: () => {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  withCredentials: true, // allow backend refresh-token cookie (REFRESHtOKEN) to be sent
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header automatically on every request — but never
// with an undefined/null/empty token (guards against stale or corrupted
// localStorage values ever reaching the network as "Bearer undefined").
apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers?.Authorization) {
    delete config.headers.Authorization;
  }
  return config;
});

// Handles 401s by attempting a silent refresh-token exchange once,
// then retries the original request. Also normalizes error messages
// so calling code can always read `error.message` / `error.response`.
let refreshPromise = null;

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${API_BASE_URL}/auth/refresh-token`,
        { refreshToken: tokenStorage.getRefreshToken() },
        { withCredentials: true }
      )
      .then(({ data }) => {
        if (data?.accessToken) tokenStorage.setAccessToken(data.accessToken);
        if (data?.refreshToken) tokenStorage.setRefreshToken(data.refreshToken);
        return data?.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const status = error.response?.status;
    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/refresh-token');

    if ((status === 401 || status === 403) && !originalRequest._retry && !isAuthEndpoint) {
      // Remember whether the caller *believed* they had a session before we
      // touch anything — a guest browsing public/protected-by-mistake routes
      // never had a token, so a 401 for them is not a "session expired"
      // event and shouldn't force a redirect away from whatever they were
      // doing. Only users who actually held a token get the clean-logout
      // treatment below.
      const hadSession = !!tokenStorage.getAccessToken();

      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // fall through to session cleanup below
      }

      // Refresh didn't produce a usable token — never leave a stale/invalid
      // token in storage, and never let a future request go out with an
      // undefined/null Authorization value.
      tokenStorage.clear();

      if (hadSession && typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
        window.localStorage.removeItem('salonId');
        toast.error('Session expired, please login again');
        window.location.href = '/auth/login';
      }
    }

    const message =
      error.response?.data?.message ||
      (Array.isArray(error.response?.data?.data)
        ? Object.values(error.response.data.data[0] || {})[0]
        : null) ||
      error.message ||
      'Something went wrong. Please try again.';

    const normalizedError = new Error(message);
    normalizedError.response = error.response;
    normalizedError.status = status;
    return Promise.reject(normalizedError);
  }
);

export default apiClient;
