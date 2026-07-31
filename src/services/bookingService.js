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
// We request limit: 100 because GET /bookings paginates at 10 by default —
// without this, the availability check below would only ever see the 10
// most recent bookings.
//
// A slot is marked unavailable when a booking starting at that time would be
// rejected by the backend (see bookingPayload in booking.service.js): the
// slot overlaps an existing booking or the barber's break, or the service
// would not finish within the barber's working hours (booking duration).
//
// Important limitation: GET /bookings scopes results to "your own bookings,
// or bookings at salons you own" (see listBookings in booking.controller.js).
// A customer browsing a salon they don't own therefore can't see that
// salon's other bookings, so the overlap check below only ever removes the
// *current user's own* conflicting bookings — every slot still shows as
// available to other customers until the backend adds a proper availability
// endpoint. This is a known, backend-side gap, not a bug here.
export async function getAvailableTimeSlots(salonId, barberId, dateStr, durationMinutes = 30) {
  const SLOT_MINUTES = 30;
  let shiftStart = '09:00';
  let shiftEnd = '21:00';

  const toMinutes = (hhmm) => {
    const [h, m] = String(hhmm).split(':').map(Number);
    if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
    return h * 60 + m;
  };
  const toHHMM = (mins) => {
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };
  const toISODate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const duration = Math.max(Number(durationMinutes) || SLOT_MINUTES, 1);

  // Fetch salon operating hours from DB (fallback when barber hours are absent)
  let salonStart = null;
  let salonEnd = null;
  if (salonId) {
    try {
      const { data: salonRes } = await apiClient.get(`/salons/${salonId}`);
      const salon = salonRes?.data;
      salonStart = salon?.openingTime || salon?.startTime || null;
      salonEnd = salon?.closingTime || salon?.endTime || null;
    } catch (err) {
      // salon hours not available
    }
  }

  // Fetch barber's individual working hours and break from DB
  let barberStart = null;
  let barberEnd = null;
  let breakStartMin = null;
  let breakEndMin = null;
  if (barberId) {
    try {
      const { data: barberRes } = await apiClient.get(`/barbers/${barberId}`);
      const barber = barberRes.data;
      barberStart = barber?.startTime || null;
      barberEnd = barber?.endTime || null;
      breakStartMin = toMinutes(barber?.breakStart);
      breakEndMin = toMinutes(barber?.breakEnd);
    } catch (err) {
      // barber hours not available
    }
  }

  // Calculate final shift:
  // - Barber selected → use barber's startTime/endTime directly
  // - No barber → use salon's openingTime/closingTime
  // - Fallback → defaults
  if (barberStart && barberEnd) {
    shiftStart = barberStart;
    shiftEnd = barberEnd;
  } else if (salonStart && salonEnd) {
    shiftStart = salonStart;
    shiftEnd = salonEnd;
  }
  // else keep defaults (09:00-21:00)

  // Real booked time windows for this barber/date, as [start, end) minutes.
  let takenRanges = [];
  try {
    if (salonId) {
      const params = { salonId, limit: 100 };
      if (dateStr && dateStr !== 'today') params.date = dateStr;
      const { data } = await apiClient.get('/bookings', { params });
      const bookings = data.data?.bookings ?? [];
      takenRanges = bookings
        .filter((b) => !barberId || (b.barberId?._id || b.barberId) === barberId)
        .filter((b) => !['cancelled', 'rejected'].includes(b.status))
        // The backend ignores the `date` query param, so filter client-side:
        // bookingDate is stored at UTC midnight of the chosen day, which
        // makes the first 10 chars of the serialized value the day key.
        .filter((b) => !dateStr || dateStr === 'today' || String(b.bookingDate).slice(0, 10) === dateStr)
        .map((b) => ({ start: toMinutes(b.startTime), end: toMinutes(b.endTime) }))
        .filter((r) => r.start !== null && r.end !== null && r.end > r.start);
    }
  } catch (err) {
    // if we can't confirm existing bookings, show every shift slot as open
  }

  const slots = [];
  const startMin = toMinutes(shiftStart) ?? 0;
  const endMin = toMinutes(shiftEnd) ?? 0;
  const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
  // "Today" means the selected calendar date equals the current local date —
  // callers always pass an ISO date (YYYY-MM-DD), never the string "today".
  const todayISO = toISODate(new Date());
  const isToday = !dateStr || dateStr === 'today' || dateStr === todayISO;
  const hasBreak = breakStartMin !== null && breakEndMin !== null && breakEndMin > breakStartMin;

  for (let t = startMin; t < endMin; t += SLOT_MINUTES) {
    const time = toHHMM(t);
    const slotEnd = t + duration;
    const isPast = isToday && t < nowMin;
    const fitsShift = slotEnd <= endMin;
    const inBreak = hasBreak && t < breakEndMin && slotEnd > breakStartMin;
    const overlaps = takenRanges.some((range) => t < range.end && slotEnd > range.start);
    const unavailable = isPast || !fitsShift || inBreak || overlaps;
    slots.push({ time, status: unavailable ? 'unavailable' : 'available' });
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
