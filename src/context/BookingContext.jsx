import { createContext, useState, useCallback } from 'react';

export const BookingContext = createContext(null);

const initialBooking = {
  salon: null,
  services: [],
  stylist: null,
  date: null, // ISO date string (YYYY-MM-DD), used for the actual API call
  dateLabel: null, // human label for display, e.g. "Today" / "Wed"
  timeSlot: null,
  paymentMethod: null,
  status: 'idle', // idle | confirmed | waiting | in_progress | completed | cancelled
};

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState(initialBooking);
  const [bookingHistory, setBookingHistory] = useState([]);

  const setSalon = useCallback((salon) => {
    setBooking((prev) => ({ ...prev, salon }));
  }, []);

  const toggleService = useCallback((service) => {
    setBooking((prev) => {
      const exists = prev.services.find((s) => s.id === service.id);
      const services = exists
        ? prev.services.filter((s) => s.id !== service.id)
        : [...prev.services, service];
      return { ...prev, services };
    });
  }, []);

  const setStylist = useCallback((stylist) => {
    setBooking((prev) => ({ ...prev, stylist }));
  }, []);

  // `isoDate` should be a real 'YYYY-MM-DD' string (used for the backend
  // bookingDate field); `dateLabel` is the human-friendly display text.
  const setTimeSlot = useCallback((isoDate, timeSlot, dateLabel) => {
    setBooking((prev) => ({
      ...prev,
      date: isoDate,
      dateLabel: dateLabel ?? isoDate,
      timeSlot,
    }));
  }, []);

  const setPaymentMethod = useCallback((paymentMethod) => {
    setBooking((prev) => ({ ...prev, paymentMethod }));
  }, []);

  // `createdBookings` is the array of real booking documents returned by
  // POST /bookings (one per selected service — see ConfirmBooking.jsx).
  // Falls back to a client-only marker only if called with nothing, so
  // existing callers don't crash, but real flows should always pass data.
  const confirmBooking = useCallback((createdBookings = []) => {
    setBooking((prev) => {
      const confirmed = {
        ...prev,
        status: 'confirmed',
        createdBookings,
        id: createdBookings[0]?._id || createdBookings[0]?.id || null,
      };
      setBookingHistory((history) => [confirmed, ...history]);
      return confirmed;
    });
  }, []);

  const updateStatus = useCallback((status) => {
    setBooking((prev) => ({ ...prev, status }));
  }, []);

  const resetBooking = useCallback(() => {
    setBooking(initialBooking);
  }, []);

  const totalPrice = booking.services.reduce((sum, s) => sum + (s.price || 0), 0);
  const totalDuration = booking.services.reduce((sum, s) => sum + (s.duration || 0), 0);

  const value = {
    booking,
    bookingHistory,
    setSalon,
    toggleService,
    setStylist,
    setTimeSlot,
    setPaymentMethod,
    confirmBooking,
    updateStatus,
    resetBooking,
    totalPrice,
    totalDuration,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}
