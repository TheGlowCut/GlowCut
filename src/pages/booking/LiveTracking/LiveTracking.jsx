import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MdArrowBack, MdNotifications, MdPerson, MdCall, MdNearMe } from 'react-icons/md';
import { motion } from 'framer-motion';
import BookingTimeline from '../../../components/booking/BookingTimeline';
import { useBooking } from '../../../hooks/useBooking';
import * as bookingService from '../../../services/bookingService';

export default function LiveTracking() {
  const navigate = useNavigate();
  const { booking } = useBooking();
  const createdBooking = booking.createdBookings?.[0];

  const [liveBooking, setLiveBooking] = useState(createdBooking || null);

  useEffect(() => {
    if (!createdBooking?._id) return;
    let cancelled = false;

    const poll = async () => {
      try {
        const updated = await bookingService.getBookingStatus(createdBooking._id);
        if (cancelled) return;
        setLiveBooking(updated);
        if (updated.status === 'completed') {
          setTimeout(() => navigate('/booking/payment-success'), 1500);
        }
      } catch (err) {
      }
    };

    poll();
    const interval = setInterval(poll, 10000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [createdBooking?._id, navigate]);

  const status = liveBooking?.status || 'pending';
  const progressPercent = { pending: 20, confirmed: 60, completed: 100 }[status] ?? 20;
  const stylistName = liveBooking?.barberId?.name || booking.stylist?.name || 'Your stylist';

  const steps = useMemo(() => {
    const base = [
      { title: 'Booking Confirmed', subtitle: 'Slot reserved with your salon' },
      { title: 'Checked In', subtitle: `Waiting on ${stylistName}` },
      { title: 'Service Complete', subtitle: 'Ready for payment' },
    ];
    const idx = { pending: 0, confirmed: 1, completed: 2 }[status] ?? 0;
    return base.map((step, i) => ({
      ...step,
      status: i < idx ? 'done' : i === idx ? 'active' : 'upcoming',
    }));
  }, [status, stylistName]);

  return (
    <motion.div
      className="bg-background min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-4 py-3 bg-surface/70 backdrop-blur-2xl border-b border-primary/10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-white/5 transition-colors"
          >
            <MdArrowBack className="text-primary" />
          </button>
          <span className="font-display-lg text-headline-md font-bold tracking-tight text-primary">
            GlowCut
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="hover:bg-white/5 transition-colors p-2 rounded-full text-on-surface-variant active:scale-95 duration-200">
            <MdNotifications />
          </button>
          <button className="hover:bg-white/5 transition-colors p-2 rounded-full text-on-surface-variant active:scale-95 duration-200">
            <MdPerson />
          </button>
        </div>
      </header>

      <main className="min-h-screen pt-16 pb-32 relative">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
        </div>

        <section className="relative h-[200px] md:h-[280px] w-full overflow-hidden flex items-center justify-center bg-surface">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-16 h-16 bg-primary/20 rounded-full animate-ping" />
            <div className="relative w-10 h-10 bg-primary rounded-full shadow-warm flex items-center justify-center border-2 border-white/20">
              <span className="material-symbols-outlined text-on-primary text-base">storefront</span>
            </div>
          </div>
        </section>

        <section className="px-margin-mobile -mt-12 relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container/80 backdrop-blur-2xl rounded-xl p-8 flex flex-col items-center justify-center text-center border border-primary/10 shadow-soft"
          >
            <span className="font-label-md text-primary tracking-[0.2em] mb-2">LIVE STATUS</span>
            <h1 className="font-display-lg text-on-surface mb-1 capitalize">
              {status === 'completed' ? "You're All Done!" : status}
            </h1>
            <p className="font-body-md text-on-surface-variant">
              {status === 'pending' && 'Waiting for the salon to confirm your check-in'}
              {status === 'confirmed' && `${stylistName} is working on you`}
              {status === 'completed' && 'Heading to payment...'}
            </p>
            <div className="w-full h-1 bg-white/5 mt-6 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary shadow-warm-sm transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </motion.div>

          <BookingTimeline steps={steps} />

          <div className="grid grid-cols-2 gap-4 pb-4">
            <button
              onClick={() =>
                liveBooking?.barberId?.phone
                  ? (window.location.href = `tel:${liveBooking.barberId.phone}`)
                  : toast.error('No phone number on file for this stylist.')
              }
              className="flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-surface-container border border-white/10 text-on-surface-variant font-label-md hover:bg-white/5 transition-all active:scale-95 duration-200"
            >
              <MdCall className="text-sm" />
              Call {stylistName.split(' ')[0]}
            </button>
            <button
              onClick={() => toast('Directions coming soon!')}
              className="flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-primary text-on-primary font-label-md shadow-warm hover:brightness-105 transition-all active:scale-95 duration-200"
            >
              <MdNearMe className="text-sm" />
              Directions
            </button>
          </div>
        </section>
      </main>
    </motion.div>
  );
}
