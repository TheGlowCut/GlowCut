import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  MdArrowBack,
  MdContentCut,
  MdSchedule,
  MdInfo,
  MdHourglassEmpty,
  MdStar,
} from 'react-icons/md';
import { motion } from 'framer-motion';
import { useBooking } from '../../../hooks/useBooking';
import * as bookingService from '../../../services/bookingService';
import * as salonService from '../../../services/salonService';
import ReviewCard from '../../../components/salon/ReviewCard';
import EmptyState from '../../../components/ui/EmptyState';
import Card from '../../../components/ui/Card';

const TECH_FEE = 50;

const addMinutesToTime = (time, minutesToAdd) => {
  const [hours, minutes] = time.split(':').map(Number);
  const total = hours * 60 + minutes + minutesToAdd;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

export default function ConfirmBooking() {
  const navigate = useNavigate();
  const { booking, setTimeSlot, totalPrice, totalDuration, confirmBooking } = useBooking();

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlotState] = useState(booking.timeSlot);
  const [activeDate, setActiveDate] = useState(booking.date || new Date().toISOString().split('T')[0]);
  const [activeDateLabel, setActiveDateLabel] = useState(booking.dateLabel || 'Today');
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    if (!booking.salon || !booking.stylist) {
      toast.error('Booking state lost. Please restart your booking.');
      navigate('/salons/nearby');
    }
  }, [booking.salon, booking.stylist, navigate]);

  const barber = booking.stylist;
  const hasWorkingDaysConfigured = barber?.workingDays && barber.workingDays.length > 0;
  const workingDays = hasWorkingDaysConfigured ? barber.workingDays : []; 

  const generateUpcomingDays = () => {
    const result = [];
    const today = new Date();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const isoDate = d.toISOString().split('T')[0];
      const dayEnum = dayNames[d.getDay()];
      let label = i === 0 ? "Today" : i === 1 ? "Tomorrow" : dayEnum;
      result.push({ isoDate, label, dayEnum, dateText: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) });
    }
    return result;
  };
  const upcomingDays = generateUpcomingDays();

  const handleSelectDate = (day) => {
    if (!hasWorkingDaysConfigured) {
      toast.error('This specialist has not set their working schedule yet.');
      return;
    }
    if (workingDays.length > 0 && !workingDays.includes(day.dayEnum)) {
      toast.error(`Barber is not available on ${day.dayEnum}s.`);
      return;
    }
    setActiveDate(day.isoDate);
    setActiveDateLabel(day.label);
    setSelectedSlotState(null);
  };

  const fetchSlots = (dateStr) => {
    if (!hasWorkingDaysConfigured) {
      setSlots([]);
      setLoadingSlots(false);
      return;
    }
    const salonId = booking.salon?._id || booking.salon?.id;
    const barberId = booking.stylist?._id || booking.stylist?.id;
    setLoadingSlots(true);
    bookingService.getAvailableTimeSlots(salonId, barberId, dateStr)
      .then((data) => {
        setSlots(data);
        if (!selectedSlot || dateStr !== booking.date) {
          const firstAvailable = data.find((s) => s.status === 'available');
          if (firstAvailable) {
            setSelectedSlotState(firstAvailable.time);
            setTimeSlot(dateStr, firstAvailable.time, activeDateLabel);
          } else {
            setSelectedSlotState(null);
          }
        }
      })
      .catch(() => {
        setSlots([]);
        toast.error('Could not load available time slots.');
      })
      .finally(() => setLoadingSlots(false));
  };

  useEffect(() => {
    fetchSlots(activeDate);
  }, [activeDate]);

  useEffect(() => {
    const barberId = booking.stylist?._id || booking.stylist?.id;
    if (!barberId) {
      setLoadingReviews(false);
      return;
    }
    setLoadingReviews(true);
    salonService
      .getBarberReviews(barberId)
      .then((list) => setReviews(Array.isArray(list) ? list : []))
      .catch(() => setReviews([]))
      .finally(() => setLoadingReviews(false));
  }, []);

  const handleSelectSlot = (time) => {
    setSelectedSlotState(time);
    setTimeSlot(activeDate, time, activeDateLabel);
  };

  const grandTotal = totalPrice + TECH_FEE;

  const handleProceed = async () => {
    const salonId = booking.salon?._id || booking.salon?.id;
    const barberId = booking.stylist?._id || booking.stylist?.id;

    if (!salonId) {
      toast.error('No salon selected — start from a salon page');
      navigate('/salons/nearby');
      return;
    }
    if (booking.services.length === 0) {
      toast.error('Select at least one service before confirming.');
      return;
    }
    if (!barberId) {
      toast.error('Please choose a stylist for this booking.');
      return;
    }
    if (!booking.stylist?.isAvailable || booking.stylist?.status !== 'active') {
      toast.error('Barber is not available');
      return;
    }
    if (!selectedSlot) {
      toast.error('Please pick an available time slot.');
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading('Processing your booking...');
    try {
      const createdBookings = [];
      let currentStartTime = selectedSlot;
      
      for (const service of booking.services) {
        const payload = {
          salonId,
          barberId,
          serviceId: service._id || service.id,
          bookingDate: activeDate,
          startTime: currentStartTime,
          paymentMethod: booking.paymentMethod || 'cash',
        };
        
        const created = await bookingService.createBooking(payload);
        createdBookings.push(created);
        currentStartTime = created.endTime || addMinutesToTime(currentStartTime, service.duration || 0);
      }
      
      confirmBooking(createdBookings);
      toast.success('Booking confirmed successfully!', { id: toastId });
      navigate('/booking/summary', { state: { bookingId: createdBookings[0]?._id || createdBookings[0]?.id } });
    } catch (error) {
      const backendMsg = error.response?.data?.message || error.response?.data?.error || error.message || "Booking Failed";
      toast.error(`Error: ${backendMsg}`, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="bg-background text-on-surface font-body-md min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 bg-surface/70 backdrop-blur-2xl border-b border-primary/10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 group text-on-surface-variant hover:text-primary transition-colors"
        >
          <MdArrowBack />
          <span className="font-label-md text-label-md">BACK</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="font-label-md text-label-md text-primary">
              {booking.services.length > 0 ? 'CONFIRMING BOOKING' : 'NO SERVICES YET'}
            </p>
            <p className="text-[10px] text-on-surface-variant">PREMIUM MEMBER</p>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-32 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
        <section className="mb-lg">              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter h-auto">
            <div className="md:col-span-2 relative rounded-xl overflow-hidden group">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Salon interior"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRwgRw9rJb1df1FSV7F08Kq__Y-Ue1DsjhgrcKemEgc_vjb4IWFzXFxer3GbLgvPjO1V5xyBduOBYE53DwSuI5g0Sep320kXD2fP8VnWhnArTCNwa-lez2bUG-FWgHvL28GG1po0RfmwWTdS7vwU4bv3XcMq2gQTs-nQuncMxcLhGI83alusMA5cMbfJX9Tdvdbl59gvK3ApFD26l_s8YRteG9CGhMFOvvCPA96A24ZaKq6dDoDE6k3XZJK-qqJugKtl1zkFx8eXo"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h1 className="font-display-lg text-display-lg text-on-surface">
                  {booking.salon?.name || 'Modern Cuts PECHS'}
                </h1>
                <p className="text-primary font-label-md tracking-widest uppercase">
                  Premium Grooming Hub
                </p>
              </div>
            </div>
            <div className="hidden md:grid grid-rows-2 gap-gutter">
              <div className="rounded-xl overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  alt="Barber tools"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvQKMFcQw1WXbeXBctqHxtO9_Ep-crvjKTh1vCmDqUYXjS8Shr1YWb3W5rm0Ruu7EXutFlp1bRjfnik7qWrhfl5dyVmvcRSBi7qaFRWMUm6At1np0Re9SXjjMJxrNFbiG6zPIdVEynYtWNoJKwKUzYxndQ4bQxHxYwwo1tOchdDKEkFt9tlgMGNl289PjoTT3nfbqX2xCWYWEGbRIYHNm3VJ-N2FxS9R5FC1pe-0SksfIwO-hDQNw-4N6Qksie5pzdXiBi2KzemSI"
                />
              </div>
              <div className="rounded-xl overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  alt="Salon waiting area"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqEYFeM-GZQbxXjJTCOoM-9vSsN4qlAR5rlHN5bgxNsTeFudO-Ky890abg8qdL7J4tQnziDXM2jmqI-AF8ioPYa5bnhO0E3OV9120OELtvF6DqXg-SI5G78dH3el4yLGdMQJFM4cpeIo4De3ymsr1k1bfuy5fqWeuFFCiVtiMZcfgxpfVbsy1n9QRfPC8609LzBqBm6hsZ-eSlO6-DCSWpOOqSamdnF6nLqnYkV8aFeLSNLY5yLeL2D3dwDceoiY3vgxgOJ8EKE4M"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
          <div className="lg:col-span-8 space-y-lg">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="font-headline-md text-headline-md mb-md flex items-center gap-2 text-on-surface">
                <MdContentCut className="text-primary" /> Selected Services
              </h2>
              {booking.services.length === 0 ? (
                <div className="bg-surface-container p-lg rounded-xl text-center text-on-surface-variant">
                  No services selected.{' '}
                  <button
                    onClick={() => navigate('/salons/nearby')}
                    className="text-primary underline"
                  >
                    Browse salons
                  </button>{' '}
                  to pick a service first.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                  {booking.services.map((service, i) => (
                    <div
                      key={service._id || service.id}
                      className={`bg-surface-container p-md rounded-xl flex justify-between items-center group border border-white/5 ${
                        i % 2 === 1 ? 'border-l-4 border-primary' : ''
                      }`}
                    >
                      <div>
                        <h3 className="font-headline-md text-body-lg text-on-surface">
                          {service.name}
                        </h3>
                        <p className="text-on-surface-variant text-caption uppercase tracking-wider">
                          {booking.stylist?.name || 'Assigned Stylist'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${i % 2 === 1 ? 'text-primary' : 'text-primary'}`}>
                          {service.duration} min
                        </p>
                        <p className="text-on-surface text-label-md">
                          PKR {service.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex justify-between items-end mb-md">
                <h2 className="font-headline-md text-headline-md flex items-center gap-2 text-on-surface">
                  <MdSchedule className="text-primary" /> Select Date & Time
                </h2>
                <span className="text-on-surface-variant font-label-md">
                  {new Date(activeDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()}
                </span>
              </div>                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide">
                {upcomingDays.map((day) => {
                  const isAvailable = workingDays.length === 0 || workingDays.includes(day.dayEnum);
                  const isSelected = activeDate === day.isoDate;
                  
                  return (
                    <button
                      key={day.isoDate}
                      onClick={() => handleSelectDate(day)}
                      className={`flex flex-col items-center justify-center min-w-[72px] sm:min-w-[80px] p-2 sm:p-3 rounded-xl transition-all ${
                        !isAvailable 
                          ? 'bg-surface-container text-on-surface-variant opacity-40 cursor-not-allowed'
                          : isSelected
                          ? 'bg-primary border-2 border-primary text-on-primary shadow-warm'
                          : 'bg-surface-container text-on-surface hover:border-primary/40 border border-white/10'
                      }`}
                    >
                      <span className={`text-caption uppercase ${isSelected ? 'text-on-primary' : 'text-on-surface-variant'}`}>
                        {day.label === "Today" || day.label === "Tomorrow" ? day.label : day.dayEnum.slice(0, 3)}
                      </span>
                      <span className="font-headline-md mt-1">{day.dateText.split(' ')[1]}</span>
                    </button>
                  );
                })}
              </div>

              {loadingSlots ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="h-12 rounded-xl bg-surface-container animate-pulse" />
                  ))}
                </div>
              ) : slots.length === 0 ? (
                <div className="bg-surface-container p-lg rounded-xl text-center text-on-surface-variant">
                  No available time slots on {activeDateLabel}. Try selecting another date.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
                  {slots.map((slot) => (
                    <button
                      key={slot.time}
                      disabled={slot.status === 'unavailable'}
                      onClick={() => handleSelectSlot(slot.time)}
                      className={`py-3 text-center rounded-xl font-bold transition-all ${
                        slot.status === 'unavailable'
                          ? 'bg-surface-container text-on-surface-variant opacity-40 cursor-not-allowed'
                          : selectedSlot === slot.time
                          ? 'bg-primary/20 border-2 border-primary text-primary shadow-warm-sm'
                          : 'bg-surface-container text-on-surface hover:border-primary/40 border border-white/10'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
              <p className="mt-4 text-primary text-caption flex items-center gap-1">
                <MdInfo className="text-sm" /> Your selected slot is highlighted in olive.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="font-headline-md text-headline-md mb-md text-on-surface">Community Feedback</h2>
              {loadingReviews ? (
                <div className="space-y-gutter">
                  {[1, 2].map((n) => <div key={n} className="h-20 bg-surface-container rounded-xl animate-pulse" />)}
                </div>
              ) : reviews.length === 0 ? (
                <EmptyState
                  title="No reviews yet"
                  description={booking.stylist ? `Be the first to review ${booking.stylist.name}.` : 'Select a stylist to see their reviews.'}
                />
              ) : (
                <div className="space-y-gutter">
                  {reviews.map((review) => (
                    <ReviewCard
                      key={review._id}
                      review={{
                        author: review.user?.userName || review.user?.name || 'GlowCut Customer',
                        rating: review.rating,
                        timeAgo: new Date(review.createdAt).toLocaleDateString(),
                        comment: review.comment || 'No comment left.',
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-md">
              <Card variant="elevated" className="p-lg border-t-2 border-primary/30">
                <div className="text-center relative z-10">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full border-4 border-dashed border-primary flex items-center justify-center animate-spin [animation-duration:8s]">
                    <MdHourglassEmpty className="text-[40px] text-primary" />
                  </div>
                  <h4 className="font-headline-md text-on-surface">
                    {totalDuration > 0 ? `${totalDuration} Min Slot` : 'Select Services'}
                  </h4>
                  <p className="text-on-surface-variant text-caption">
                    Total Duration: {totalDuration} Minutes
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/20 overflow-hidden rounded-b-xl">
                  <div className="w-1/2 h-full bg-primary shadow-warm" />
                </div>
              </Card>

              <Card variant="glass" className="p-md">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      className="w-16 h-16 rounded-full border-2 border-primary object-cover bg-surface-container"
                      alt={booking.stylist?.name || 'No stylist selected'}
                      src={booking.stylist?.profileImage || 'https://via.placeholder.com/150?text=?'}
                    />
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary rounded-full border-2 border-background" />
                  </div>
                  <div>
                    <h3 className="font-label-md text-on-surface">
                      {booking.stylist?.name || 'No stylist selected'}
                    </h3>
                    <p className="text-caption text-primary uppercase font-bold tracking-tight">
                      GlowCut Specialist
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <MdStar className="text-primary text-[14px]" />
                      <span className="text-caption text-on-surface">
                        {(booking.stylist?.rating ?? 0).toFixed?.(1) ?? booking.stylist?.rating ?? '—'} ({reviews.length} Reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card variant="elevated" className="p-lg border-t-4 border-primary">
                <div className="space-y-2 mb-lg">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Service Total</span>
                    <span>PKR {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Tech Fee</span>
                    <span>PKR {TECH_FEE}</span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent my-4" />
                  <div className="flex justify-between items-center">
                    <span className="font-headline-md text-on-surface">Total Amount</span>
                    <span className="font-display-lg text-primary text-3xl">
                      PKR {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleProceed}
                  disabled={submitting || booking.services.length === 0}
                  className="w-full py-4 rounded-xl bg-primary text-on-primary font-bold font-headline-md shadow-warm active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'PROCEED TO PAY'
                  )}
                </button>
                <p className="text-center text-[10px] text-on-surface-variant mt-4 uppercase tracking-[0.2em]">
                  Secure Encryption Enabled
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-xl px-6 md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-md border-t border-primary/10 bg-surface-container-lowest/80">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">
            GlowCut
          </span>
          <p className="font-body-md text-body-md text-on-surface-variant">
            © 2024 GlowCut Premium Salons. All rights reserved.
          </p>
        </div>
        <div className="flex gap-lg">
          <a className="text-on-surface-variant hover:text-primary transition-colors text-body-md" href="#">
            Privacy Policy
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-colors text-body-md" href="#">
            Terms of Service
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-colors text-body-md" href="#">
            Contact Us
          </a>
        </div>
      </footer>
    </motion.div>
  );
}
