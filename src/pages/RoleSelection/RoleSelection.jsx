import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdPerson, MdStorefront } from 'react-icons/md';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

/**
 * RoleSelection
 *
 * IMPORTANT BACKEND CONSTRAINT: there is no `/auth/update-role` (or any
 * other) endpoint in the backend — `role` is set once at registration
 * (see register() in user.controller.js) and is never mutated afterwards.
 * An earlier version of this page called a non-existent endpoint on a dead
 * ngrok tunnel using the wrong localStorage key for the access token, which
 * always sent `Authorization: Bearer null` and surfaced as an
 * "Invalid authorization format" error — that call has been removed
 * entirely rather than patched, since the backend genuinely can't fulfill
 * a role change after signup.
 *
 * This page is only reached from Login's fallback branch (an account with
 * an unrecognized/legacy role value). It no longer pretends to change the
 * role via the API: "Customer" simply continues into the app with whatever
 * role the account already has, and "Salon Owner" explains that a new
 * account must be created with the Salon Owner option at signup.
 */
export default function RoleSelection() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleContinueAsCustomer = () => {
    navigate('/');
  };

  const handleWantsSalonOwner = async () => {
    if (loading) return;
    setLoading(true);
    try {
      toast(
        'Salon Owner accounts are created at sign-up and can\u2019t be changed later. Please log out and register a new account as a Salon Owner.',
        { duration: 6000 }
      );
      await logout();
      navigate('/auth/signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-48 md:w-96 h-48 md:h-96 bg-primary-container/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-48 md:w-96 h-48 md:h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center mb-10 z-10">
        <h1 className="text-4xl font-extrabold tracking-wider text-primary mb-2 shadow-warm-sm">
          GLOWCUT
        </h1>
        <p className="text-outline text-sm uppercase tracking-widest">
          {loading ? 'One moment...' : 'Select Your Experience'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl z-10">
        {/* Customer Box */}
        <button
          disabled={loading}
          onClick={handleContinueAsCustomer}
          className={`glass-card p-8 rounded-2xl border border-white/5 text-left transition-all duration-300 ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-container/30 group hover:-translate-y-1'
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center mb-6 group-hover:bg-primary-container/20 group-hover:text-primary-container transition-colors">
            <MdPerson className="text-2xl text-outline group-hover:text-primary-container" />
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
            I'm a Customer
          </h3>
          <p className="text-sm text-outline">
            Discover elite barbers, book instant premium haircuts, and manage your appointments.
          </p>
        </button>

        {/* Shopkeeper / Salon Owner Box */}
        <button
          disabled={loading}
          onClick={handleWantsSalonOwner}
          className={`glass-card p-8 rounded-2xl border border-white/5 text-left transition-all duration-300 ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-container/30 group hover:-translate-y-1'
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center mb-6 group-hover:bg-primary-container/20 group-hover:text-primary-container transition-colors">
            <MdStorefront className="text-2xl text-outline group-hover:text-primary-container" />
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
            I'm a Salon Owner
          </h3>
          <p className="text-sm text-outline">
            Register your shop, manage your dynamic staff schedule, set service prices, and track live earnings.
          </p>
        </button>
      </div>
    </div>
  );
}
