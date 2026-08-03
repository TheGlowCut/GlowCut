import apiClient from './apiClient';

/**
 * salonService — wraps GET /api/salons/* endpoints exposed by salon.route.js.
 * Every backend response has the shape { success, message, data }; these
 * helpers unwrap `data` so page components can consume it directly.
 */

export async function getSalons(params = {}) {
  const { data } = await apiClient.get('/salons', { params });
  // data.data = { salons: [...], pagination: {...} }
  return data.data?.salons ?? data.data ?? [];
}

export async function getSalonById(id) {
  const { data } = await apiClient.get(`/salons/${id}`);
  return data.data;
}

export async function searchSalons(query) {
  const { data } = await apiClient.get('/salons/search', { params: { q: query } });
  return data.data?.salons ?? data.data ?? [];
}

export async function getTopRatedSalons(limit = 10) {
  const { data } = await apiClient.get('/salons/top-rated', { params: { limit } });
  return data.data?.salons ?? data.data ?? [];
}

export async function getNearbySalons({ lat, lng, maxDistance = 5000 }) {
  const { data } = await apiClient.get('/salons/nearby', { params: { lat, lng, maxDistance } });
  return data.data ?? [];
}

export async function getSalonsByCity(city) {
  const { data } = await apiClient.get(`/salons/city/${encodeURIComponent(city)}`);
  return data.data?.salons ?? data.data ?? [];
}

export async function getMySalon() {
  const { data } = await apiClient.get('/salons/my');
  return data.data;
}

export async function createSalon(payload) {
  const { data } = await apiClient.post('/salons', payload);
  return data.data;
}

export async function updateSalon(id, payload) {
  const { data } = await apiClient.patch(`/salons/${id}`, payload);
  return data.data;
}

export async function updateSalonLogo(id, file) {
  const formData = new FormData();
  formData.append('logo', file);
  const { data } = await apiClient.patch(`/salons/${id}/logo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function updateSalonCoverImage(id, file) {
  const formData = new FormData();
  formData.append('coverImage', file);
  const { data } = await apiClient.patch(`/salons/${id}/cover-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

// --- Services (menu items) for a salon: /api/services ---
export async function getSalonServices(salonId) {
  const { data } = await apiClient.get(`/services/salon/${salonId}`);
  return data.data?.services ?? data.data ?? [];
}

export async function getServiceCatalog(params = {}) {
  const { data } = await apiClient.get('/services', { params });
  return data.data?.services ?? data.data ?? [];
}

// --- Barbers/Stylists for a salon: /api/barbers ---
export async function getSalonBarbers(salonId) {
  const { data } = await apiClient.get(`/barbers/salon/${salonId}`);
  return data.data?.barbers ?? data.data ?? [];
}

export async function getStylists(params = {}) {
  const { data } = await apiClient.get('/barbers', { params });
  return data.data?.barbers ?? data.data ?? [];
}

export async function getAvailableBarbers(params = {}) {
  const { data } = await apiClient.get('/barbers/available', { params });
  return data.data?.barbers ?? data.data ?? [];
}

// --- Barber CRUD (Owner/Admin only) ---
export async function createBarber(payload) {
  const { data } = await apiClient.post('/barbers', payload);
  return data.data;
}

export async function updateBarber(id, payload) {
  const { data } = await apiClient.patch(`/barbers/${id}`, payload);
  return data.data;
}

export async function updateBarberStatus(id, status) {
  const { data } = await apiClient.patch(`/barbers/${id}/status`, { status });
  return data.data;
}

export async function updateBarberProfileImage(id, file) {
  const formData = new FormData();
  formData.append('profileImage', file);
  const { data } = await apiClient.patch(`/barbers/${id}/profile-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function deleteBarber(id) {
  const { data } = await apiClient.delete(`/barbers/${id}`);
  return data;
}

export async function getBarberById(id) {
  const { data } = await apiClient.get(`/barbers/${id}`);
  return data.data;
}

// --- Service CRUD (Owner/Admin only) ---
export async function createService(payload) {
  const { data } = await apiClient.post('/services', payload);
  return data.data;
}

export async function updateService(id, payload) {
  const { data } = await apiClient.patch(`/services/${id}`, payload);
  return data.data;
}

export async function updateServiceStatus(id, status) {
  const { data } = await apiClient.patch(`/services/${id}/status`, { status });
  return data.data;
}

export async function deleteService(id) {
  const { data } = await apiClient.delete(`/services/${id}`);
  return data;
}

// --- Reviews: /api/reviews ---
// Dedicated salon-level reviews endpoint (newest-first, populated with the
// customer's userName/profileImage and the barber's name). One request per
// salon instead of one request per barber.
export async function getSalonReviews(salonId) {
  const { data } = await apiClient.get(`/reviews/salon/${salonId}`);
  return data.data?.reviews ?? data.data ?? [];
}

// Kept for backward compatibility (legacy per-barber listing).
export async function getBarberReviews(barberId) {
  const { data } = await apiClient.get(`/reviews/${barberId}`);
  return data.data?.reviews ?? data.data ?? [];
}

// --- Saved salons (user bookmarks). Backend routes live under
// /api/auth/* (see user.route.js) and require an authenticated user. ---
export async function getSavedSalons() {
  const { data } = await apiClient.get('/auth/saved-salons');
  return data.data ?? [];
}

export async function saveSalon(salonId) {
  const { data } = await apiClient.post(`/auth/save-salon/${salonId}`);
  return data.data;
}

export async function unsaveSalon(salonId) {
  const { data } = await apiClient.delete(`/auth/save-salon/${salonId}`);
  return data.data;
}
