import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { MdArrowBack, MdFavorite, MdStore } from 'react-icons/md';
import { useAuthContext } from '../../../context/AuthContext';
import SalonCard from '../../../components/salon/SalonCard';
import EmptyState from '../../../components/ui/EmptyState';
import Button from '../../../components/ui/Button';
import * as salonService from '../../../services/salonService';

const getSalonId = (salon) => salon?._id || salon?.id;

export default function SavedSalons() {
  const navigate = useNavigate();
  const { userType } = useAuthContext();

  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  const loadSaved = () => {
    setLoading(true);
    salonService
      .getSavedSalons()
      .then((list) => setSalons(Array.isArray(list) ? list : []))
      .catch(() => setSalons([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (userType !== 'authenticated') return undefined;
    loadSaved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType]);

  const handleUnsave = async (salonId) => {
    if (!salonId || removingId) return;
    setRemovingId(salonId);
    try {
      await salonService.unsaveSalon(salonId);
      setSalons((prev) => prev.filter((salon) => getSalonId(salon) !== salonId));
      toast.success('Salon removed from your saved salons');
    } catch (error) {
      toast.error(error?.message || 'Could not remove this salon. Please try again.');
    } finally {
      setRemovingId(null);
    }
  };

  if (userType !== 'authenticated') {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <motion.main
      className="px-margin-mobile md:px-margin-desktop lg:max-w-5xl lg:mx-auto py-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        type="button"
        onClick={() => navigate('/profile')}
        className="flex items-center gap-xs text-primary font-label-md hover:underline mb-md"
      >
        <MdArrowBack className="text-base" /> Back to Profile
      </button>

      <header className="mb-xl">
        <div className="flex items-center gap-sm mb-xs">
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
            <MdFavorite />
          </div>
          <h1 className="font-display-lg text-display-lg text-on-surface">Saved Salons</h1>
        </div>
        <p className="font-body-md text-on-surface-variant">
          Your bookmarked salons — tap the heart again on any salon page to remove one.
        </p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-72 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : salons.length === 0 ? (
        <EmptyState
          icon={MdFavorite}
          title="No saved salons yet"
          description="When you tap the heart on a salon page, it will show up right here so you can find it again instantly."
          action={
            <Button variant="primary" onClick={() => navigate('/services')}>
              <MdStore className="text-base" /> Browse Salons
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
          {salons.map((salon) => {
            const salonId = getSalonId(salon);
            const removing = removingId === salonId;
            return (
              <div className="relative" key={salonId}>
                <SalonCard salon={salon} />
                <button
                  type="button"
                  disabled={removing}
                  onClick={() => handleUnsave(salonId)}
                  aria-label={`Unsave ${salon.name}`}
                  title="Unsave"
                  className="absolute top-3 left-3 w-9 h-9 rounded-full bg-background/80 backdrop-blur-md border border-primary/30 flex items-center justify-center text-primary hover:bg-background hover:scale-110 transition-all disabled:opacity-60"
                >
                  {removing ? (
                    <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <MdFavorite className="text-base" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </motion.main>
  );
}
