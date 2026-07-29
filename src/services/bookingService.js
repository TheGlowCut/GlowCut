import apiClient from './apiClient';

/**
 * bookingService — wraps /api/bookings/* (see booking.routes.js). All routes
 * require an authenticated user (protect middleware runs for the whole
 * router), so apiClient's Authorization header must be present.
 */

export async function createBooking({ salonId, barberId, serviceId, bookingDate, startTime, discount, bookingType, paymentMethod, notes }) {
  const payloadToSent = {
    salonId,
    barberId,
    serviceId,
    bookingDate,
    startTime,
    discount,
    bookingType,
    paymentMethod,
    notes,
  };
  console.log("ACTUAL BOOKING PAYLOAD BEING SENT:", payloadToSent);
  
  const { data } = await apiClient.post('/bookings', payloadToSent);
  // POST /bookings responds with { booking, queueNumber, estimatedWaitingMinutes }
  // nested under `data.data` (see createBooking in booking.controller.js) —
  // unwrap it so callers get the actual booking document (with _id, status,
  // populated salonId/barberId/serviceId), while still surfacing the queue
  // info as extra fields for anything that wants it (e.g. WaitingLounge).
  const payload = data.data ?? {};
  if (payload.booking) {
    return {
      ...payload.booking,
      queueNumber: payload.queueNumber,
      estimatedWaitingMinutes: payload.estimatedWaitingMinutes,
    };
  }
  return payload;
}

export async function getAllBookings(params = {}) {
  const { data } = await apiClient.get('/bookings', { params });
  return { bookings: data.data?.bookings ?? [], pagination: data.data?.pagination ?? null };
}

export async function getTodayBookings(params = {}) {
  const { data } = await apiClient.get('/bookings/today', { params });
  return data.data?.bookings ?? [];
}

export async function getUpcomingBookings(params = {}) {
  const { data } = await apiClient.get('/bookings/upcoming', { params });
  return data.data?.bookings ?? [];
}

export async function getCompletedBookings(params = {}) {
  const { data } = await apiClient.get('/bookings/completed', { params });
  return data.data?.bookings ?? [];
}

export async function getCancelledBookings(params = {}) {
  const { data } = await apiClient.get('/bookings/cancelled', { params });
  return data.data?.bookings ?? [];
}

export async function getBookingById(id) {
  const { data } = await apiClient.get(`/bookings/${id}`);
  return data.data;
}

// Kept as `getBookingStatus` for backward compatibility with existing pages
// (e.g. LiveTracking) that poll booking status.
export async function getBookingStatus(bookingId) {
  const { data } = await apiClient.get(`/bookings/${bookingId}`);
  return data.data;
}

export async function getQueueStatusByBookingId(bookingId) {
  const { data } = await apiClient.get(`/queues/status/${bookingId}`);
  return data.data;
}

export async function updateBooking(id, payload) {
  const { data } = await apiClient.patch(`/bookings/${id}`, payload);
  return data.data;
}

export async function cancelBooking(id) {
  const { data } = await apiClient.patch(`/bookings/${id}/cancel`);
  return data.data;
}

// The backend does not expose a dedicated "available time slots" endpoint
// (no /bookings/slots route exists). We approximate availability client-side
// using the barber's configured shift hours (see Barber model: startTime /
// endTime) minus any slots already taken by that barber on the given date.
//
// Important limitation: GET /bookings scopes results to "your own bookings,
// or bookings at salons you own" (see listBookings in booking.controller.js).
// A customer browsing a salon they don't own therefore can't see that
// salon's other bookings, so the "already taken" check below only ever
// removes the *current user's own* conflicting bookings — every slot still
// shows as available to other customers until the backend adds a proper
// availability endpoint. This is a known, backend-side gap, not a bug here.
export async function getAvailableTimeSlots(salonId, barberId, dateStr) {
  const SLOT_MINUTES = 30;
  let shiftStart = '09:00';
  let shiftEnd = '21:00';

  const toMinutes = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  };
  const toHHMM = (mins) => {
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  let takenTimes = new Set();

  try {
    if (barberId) {
      const { data: barberRes } = await apiClient.get(`/barbers/${barberId}`);
      const barber = barberRes.data;
      if (barber?.startTime) shiftStart = barber.startTime;
      if (barber?.endTime) shiftEnd = barber.endTime;
    }
  } catch (err) {
    // fall back to default shift hours
  }

  try {
    if (salonId) {
      const params = { salonId };
      if (dateStr && dateStr !== 'today') params.date = dateStr;
      const { data } = await apiClient.get('/bookings', { params });
      const bookings = data.data?.bookings ?? [];
      takenTimes = new Set(
        bookings
          .filter((b) => !barberId || (b.barberId?._id || b.barberId) === barberId)
          .filter((b) => b.status !== 'cancelled')
          .map((b) => b.startTime)
      );
    }
  } catch (err) {
    // if we can't confirm existing bookings, show every shift slot as open
  }

  const slots = [];
  const startMin = toMinutes(shiftStart);
  const endMin = toMinutes(shiftEnd);
  const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
  const isToday = !dateStr || dateStr === 'today';

  for (let t = startMin; t < endMin; t += SLOT_MINUTES) {
    const time = toHHMM(t);
    const isPast = isToday && t <= nowMin;
    slots.push({
      time,
      status: takenTimes.has(time) || isPast ? 'unavailable' : 'available',
    });
  }

  return slots;
}

export async function confirmBooking(id) {
  const { data } = await apiClient.patch(`/bookings/${id}/confirm`);
  return data.data;
}

export async function rejectBooking(id, cancelReason) {
  const { data } = await apiClient.patch(`/bookings/${id}/reject`, { cancelReason });
  return data.data;
}

// Personal booking history for the logged-in customer.
// Backend exposes GET /bookings/customer/:customerId (self or admin only) —
// this is the closest equivalent to a "/my-bookings" endpoint.
export async function getMyBookings(userId, params = {}) {
  const { data } = await apiClient.get(`/bookings/customer/${userId}`, { params });
  return data.data?.bookings ?? data.data ?? [];
}

// All bookings for a salon the current owner/admin manages.
export async function getSalonBookings(salonId, params = {}) {
  const { data } = await apiClient.get(`/bookings/salon/${salonId}`, { params });
  return data.data?.bookings ?? data.data ?? [];
}

export async function getBookingStatistics(params = {}) {
  const { data } = await apiClient.get('/bookings/statistics', { params });
  return data.data;
}

export async function completeBooking(id) {
  const { data } = await apiClient.patch(`/bookings/${id}/complete`);
  return data.data;
}

export async function deleteBooking(id) {
  const { data } = await apiClient.delete(`/bookings/${id}`);
  return data;
}

// Booking history for the logged-in user — prefer getMyBookings(userId)
// which hits the customer-scoped endpoint; this generic listing is kept
// for admin/owner contexts that pass their own filters.
export async function getBookingHistory(params = {}) {
  const { data } = await apiClient.get('/bookings', { params });
  return data.data?.bookings ?? [];
}
