import { io } from 'socket.io-client';
import { API_BASE_URL } from './apiClient';

/**
 * Derive the raw backend origin from the API base URL.
 * e.g. "https://glow-cut-product-complete-backend.vercel.app/api" → "https://glow-cut-product-complete-backend.vercel.app"
 */
const BACKEND_ORIGIN = import.meta.env.VITE_SOCKET_URL || API_BASE_URL.replace(/\/api\/?$/, '');

export const socket = io(BACKEND_ORIGIN, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
