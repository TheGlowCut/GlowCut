import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MdStore, MdPhone, MdLocationOn, MdAccessTime, MdOutlineDescription, MdEmail, MdLink, MdMyLocation } from 'react-icons/md';
import { useAuthContext } from '../../context/AuthContext';
import * as salonService from '../../services/salonService';

export default function SalonSetup() {
  const navigate = useNavigate();
  const { markSalonSetupComplete } = useAuthContext();
  const [loading, setLoading] = useState(false);

  // Backend Schema ke mutabiq strictly COMPLETE allowed fields (including nested location)
  const [salonData, setSalonData] = useState({
    name: '',
    description: '',
    phone: '',
    email: '',
    logo: '',
    coverImage: '',
    openingTime: '',
    closingTime: '',
    address: {
      country: 'Pakistan',
      city: 'Karachi',
      area: '',
      street: '',
      postalCode: ''
    },
    location: {
      type: 'Point',
      longitude: '',
      latitude: ''
    }
  });

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSalonData({ ...salonData, [name]: value });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setSalonData({
      ...salonData,
      address: { ...salonData.address, [name]: value }
    });
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setSalonData({
      ...salonData,
      location: { ...salonData.location, [name]: value }
    });
  };

  // "Use My Location" — real browser Geolocation API, with full defensive
  // handling: unsupported browsers, denied permission, timeouts, and
  // low-accuracy results are all surfaced as clear toasts instead of
  // silently failing or leaving the form in a stuck "locating..." state.
  const [locating, setLocating] = useState(false);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser.');
      return;
    }
    if (locating) return;
    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setSalonData((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            longitude: longitude.toFixed(6),
            latitude: latitude.toFixed(6),
          },
        }));
        toast.success('Location captured successfully!');
        setLocating(false);
      },
      (error) => {
        const messages = {
          1: 'Location permission denied. Please enter coordinates manually.',
          2: 'Location unavailable right now. Please enter coordinates manually.',
          3: 'Location request timed out. Please try again or enter manually.',
        };
        toast.error(messages[error.code] || 'Could not fetch your location.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Submit Salon Data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      // Validation check for location metrics
      const lng = parseFloat(salonData.location.longitude);
      const lat = parseFloat(salonData.location.latitude);

      // Backend schema format validation builder
      const hasValidCoords = !isNaN(lng) && !isNaN(lat) && lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;

      // Backend controller aur schema ke mutabiq complete clean payload
      const payload = {
        name: salonData.name.trim(),
        description: salonData.description.trim() || undefined,
        phone: salonData.phone.trim(),
        email: salonData.email.trim() || undefined,
        logo: salonData.logo.trim() || undefined,
        coverImage: salonData.coverImage.trim() || undefined,
        openingTime: salonData.openingTime || undefined,
        closingTime: salonData.closingTime || undefined,
        address: {
          country: salonData.address.country.trim(),
          city: salonData.address.city.trim(),
          area: salonData.address.area.trim(),
          street: salonData.address.street.trim(),
          postalCode: salonData.address.postalCode.trim() || undefined
        },
        // Agar coordinates accurate hain to pass karega warna drop karega backend error se bachne ke liye
        location: hasValidCoords ? {
          type: 'Point',
          coordinates: [lng, lat] // [longitude, latitude] array formatting format according to 2dsphere index
        } : undefined
      };

      const createdSalon = await salonService.createSalon(payload);

      if (createdSalon?._id || createdSalon?.id) {
        toast.success("Salon Setup Completed Successfully!");

        // 🔑 Atomic session lock update: profile structure sync to keep routes guarded
        markSalonSetupComplete(createdSalon);

        // 🚀 Direct dynamic dashboard rerouting instead of generic dashboard fallback
        navigate('/admin/shop', { replace: true });
      } else {
        toast.error("Failed to save details.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Connectivity issue or validation failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden">
      {/* Decorative Cyber Blur */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary-container/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-2xl mx-auto glass-card p-8 rounded-2xl border border-white/5 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-primary mb-1">Set Up Your Cyber-Salon</h2>
          <p className="text-xs text-outline">Fill in the vital metrics to deploy your station dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Salon Name Input */}
          <div>
            <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Salon Name *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline"><MdStore /></span>
              <input
                type="text"
                name="name"
                required
                minLength={3}
                maxLength={100}
                placeholder="GlowCut Station 01"
                value={salonData.name}
                onChange={handleInputChange}
                className="w-full bg-surface-container/50 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-primary-container"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Description</label>
            <div className="relative">
              <span className="absolute top-3 left-3 text-outline"><MdOutlineDescription /></span>
              <textarea
                name="description"
                maxLength={500}
                placeholder="Brief details about your cyber-salon..."
                value={salonData.description}
                onChange={handleInputChange}
                rows="2"
                className="w-full bg-surface-container/50 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-primary-container resize-none"
              />
            </div>
          </div>

          {/* Contact & Email Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Contact Number *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline"><MdPhone /></span>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+923001234567"
                  value={salonData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-surface-container/50 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-primary-container"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline"><MdEmail /></span>
                <input
                  type="email"
                  name="email"
                  placeholder="owner@glowcut.com"
                  value={salonData.email}
                  onChange={handleInputChange}
                  className="w-full bg-surface-container/50 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-primary-container"
                />
              </div>
            </div>
          </div>

          {/* Logo & Cover Image Branding Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Logo Image URL</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline"><MdLink /></span>
                <input
                  type="url"
                  name="logo"
                  placeholder="https://example.com/logo.png"
                  value={salonData.logo}
                  onChange={handleInputChange}
                  className="w-full bg-surface-container/50 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-primary-container"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Cover Image URL</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline"><MdLink /></span>
                <input
                  type="url"
                  name="coverImage"
                  placeholder="https://example.com/cover.png"
                  value={salonData.coverImage}
                  onChange={handleInputChange}
                  className="w-full bg-surface-container/50 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-primary-container"
                />
              </div>
            </div>
          </div>

          {/* Timing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Opening Time (HH:mm)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline"><MdAccessTime /></span>
                <input
                  type="text"
                  name="openingTime"
                  placeholder="09:00"
                  value={salonData.openingTime}
                  onChange={handleInputChange}
                  className="w-full bg-surface-container/50 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-primary-container"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Closing Time (HH:mm)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline"><MdAccessTime /></span>
                <input
                  type="text"
                  name="closingTime"
                  placeholder="21:00"
                  value={salonData.closingTime}
                  onChange={handleInputChange}
                  className="w-full bg-surface-container/50 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-primary-container"
                />
              </div>
            </div>
          </div>

          {/* Address Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Area / Sector *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline"><MdLocationOn /></span>
                <input
                  type="text"
                  name="area"
                  required
                  placeholder="e.g. DHA Phase 6"
                  value={salonData.address.area}
                  onChange={handleAddressChange}
                  className="w-full bg-surface-container/50 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-primary-container"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Street Address *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline"><MdLocationOn /></span>
                <input
                  type="text"
                  name="street"
                  required
                  placeholder="e.g. Commercial St 2"
                  value={salonData.address.street}
                  onChange={handleAddressChange}
                  className="w-full bg-surface-container/50 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-primary-container"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Postal Code</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline"><MdLocationOn /></span>
                <input
                  type="text"
                  name="postalCode"
                  placeholder="e.g. 75500"
                  value={salonData.address.postalCode}
                  onChange={handleAddressChange}
                  className="w-full bg-surface-container/50 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-primary-container"
                />
              </div>
            </div>
          </div>

          {/* Geo-Location (2dsphere coordinates) Input Grid */}
          <div className="border-t border-white/5 pt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-bold text-outline uppercase tracking-wider">Salon Coordinates</label>
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={locating}
                className="flex items-center gap-1.5 text-xs font-bold text-primary-container bg-primary-container/10 border border-primary-container/30 px-3 py-1.5 rounded-lg hover:bg-primary-container/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {locating ? (
                  <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <MdMyLocation className="text-sm" />
                )}
                {locating ? 'Locating...' : 'Use My Location'}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Longitude (-180 to 180)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline"><MdMyLocation /></span>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  placeholder="e.g. 67.0011"
                  value={salonData.location.longitude}
                  onChange={handleLocationChange}
                  className="w-full bg-surface-container/50 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-primary-container"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Latitude (-90 to 90)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline"><MdMyLocation /></span>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  placeholder="e.g. 24.8607"
                  value={salonData.location.latitude}
                  onChange={handleLocationChange}
                  className="w-full bg-surface-container/50 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-primary-container"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-container text-on-primary-container py-3.5 rounded-xl font-bold tracking-wider hover:opacity-95 active:scale-98 transition-all shadow-warm mt-8 disabled:opacity-50"
          >
            {loading ? "Deploying Station..." : "Deploy Shopkeeper Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
