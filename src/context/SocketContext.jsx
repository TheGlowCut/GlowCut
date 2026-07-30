import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { socket } from '../services/socket';
import AuthContext from './AuthContext';

export const SOCKET_EVENTS = {
  // Booking
  BOOKING_CREATED: 'booking-created',
  BOOKING_CONFIRMED: 'booking-confirmed',
  BOOKING_CANCELLED: 'booking-cancelled',
  BOOKING_UPDATED: 'booking-updated',

  // Queue
  QUEUE_UPDATED: 'queue-updated',
  CUSTOMER_CHECKED_IN: 'customer-checked-in',
  SERVICE_STARTED: 'service-started',
  SERVICE_COMPLETED: 'service-completed',

  // Notifications
  NOTIFICATION: 'notification',
  NOTIFICATION_READ: 'notification-read',

  // Payment
  PAYMENT_SUCCESS: 'payment-success',
  PAYMENT_FAILED: 'payment-failed',
  PAYMENT_REFUNDED: 'payment-refunded',

  // Review
  REVIEW_ADDED: 'review-added',

  // Barber Status
  BARBER_STATUS_CHANGED: 'barber-status-changed',
};

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { token } = useContext(AuthContext) || {};
  const [isConnected, setIsConnected] = useState(false);
  const isConnectedRef = useRef(false);

  useEffect(() => {
    if (!token) {
      if (isConnectedRef.current) {
        socket.disconnect();
        isConnectedRef.current = false;
        setIsConnected(false);
      }
      return;
    }

    socket.auth = { token };
    socket.connect();
    isConnectedRef.current = true;
    setIsConnected(socket.connected);

    const onConnect = () => {
      console.log('[Socket] Connected:', socket.id);
      isConnectedRef.current = true;
      setIsConnected(true);
    };
    const onDisconnect = (reason) => {
      console.log('[Socket] Disconnected:', reason);
      isConnectedRef.current = false;
      setIsConnected(false);
    };
    const onError = (error) => {
      console.error('[Socket] Error:', error);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onError);
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocketContext must be used within a SocketProvider');
  return ctx;
}

export default SocketContext;
