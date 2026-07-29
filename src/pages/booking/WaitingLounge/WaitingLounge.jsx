import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  MdSchedule,
  MdVideogameAsset,
  MdQuiz,
  MdGridView,
  MdLeaderboard,
  MdChevronRight,
  MdTrendingUp,
  MdVisibility,
  MdFavorite,
  MdStorefront,
  MdContentCut,
  MdAttachMoney,
  MdWarning,
  MdPerson,
} from 'react-icons/md';
import { motion } from 'framer-motion';
import Card from '../../../components/ui/Card';
import { useBooking } from '../../../hooks/useBooking';
import * as bookingService from '../../../services/bookingService';

const GAMES = [
  {
    title: 'Barber Trivia',
    description: 'Test your style IQ and win loyalty points.',
    icon: MdQuiz,
  },
  {
    title: 'Style Match-3',
    description: 'Connect tools to clear the board.',
    icon: MdGridView,
  },
];

const VIDEOS = [
  {
    title: 'Classic Fade Tutorial',
    views: '12.4K',
    likes: 892,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBHghyCHZ8Mgjf-31cDlTgDu4Sd2pf7yDtBYS22C-P0eZsofUEoU177c4OdhLTd1KrQCdDywUSS32hTTlTLg7udD8NIaGkMOlvtkL7yMm9Wusl1e9CYmziljMZfRd68mjVHCqcchpUOIEjK-4XU6y7yV0xFc9obALf1uRUFo2syowoSaXlU8ez9BxjHBszG6lIofXkNq5BhclkcpwMY9LNN1gWgm09UHu_Y5Psn86k54j-47Q3Rod5DjHqCv6B8I3klGSK2Y5mC9lA',
  },
];

export default function WaitingLounge() {
  const navigate = useNavigate();
  const location = useLocation();
  const { booking } = useBooking();
  
  const bookingId = location.state?.bookingId || booking.createdBookings?.[0]?._id || booking.createdBookings?.[0]?.id;

  const [liveBooking, setLiveBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [countdownText, setCountdownText] = useState('');

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      setError(true);
      return;
    }
    
    let cancelled = false;

    const poll = async () => {
      try {
        const [updated, queueInfo] = await Promise.all([
          bookingService.getBookingStatus(bookingId),
          bookingService.getQueueStatusByBookingId(bookingId).catch(() => null)
        ]);
        if (cancelled) return;
        
        const mergedData = { ...updated, queueData: queueInfo };
        setLiveBooking(mergedData);
        setLoading(false);
        
        if (updated.status === 'confirmed' || queueInfo?.status === 'called') {
          toast.success("It's your turn! Heading to live tracking...");
          setTimeout(() => navigate('/booking/live-tracking'), 1500);
        } else if (updated.status === 'cancelled' || updated.status === 'rejected' || queueInfo?.status === 'cancelled') {
          toast.error('Your booking was cancelled by the salon.');
          navigate('/salons/nearby');
        }
      } catch (err) {
        if (!liveBooking) {
          setError(true);
          setLoading(false);
        }
      }
    };

    poll();
    const interval = setInterval(poll, 15000);
    
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [bookingId, navigate]);

  useEffect(() => {
    if (!liveBooking) return;

    let targetDate;
    
    if (liveBooking.queueData && liveBooking.queueData.estimatedWaitTime !== undefined) {
      const baseTime = new Date(liveBooking.queueData.updatedAt || liveBooking.queueData.createdAt || new Date());
      targetDate = new Date(baseTime.getTime() + (liveBooking.queueData.estimatedWaitTime * 60 * 1000));
    } else if (liveBooking.bookingDate && liveBooking.startTime) {
      const [hours, minutes] = liveBooking.startTime.split(':');
      targetDate = new Date(liveBooking.bookingDate);
      targetDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    } else {
      return;
    }

    const updateCountdown = () => {
      const qStatus = liveBooking.queueData?.status;
      const bStatus = liveBooking.status;

      if (['in-progress', 'completed'].includes(bStatus) || ['in_service', 'completed'].includes(qStatus)) {
        setCountdownText(bStatus === 'completed' || qStatus === 'completed' ? 'Completed' : 'Service In Progress');
        return;
      }
      
      const isReady = ['called', 'checked_in'].includes(qStatus);

      if (isReady) {
        setCountdownText('Your slot is ready! Please head to the chair.');
        return;
      }

      const now = new Date();
      const diff = targetDate - now;

      if (diff > 0) {
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);
        
        const pad = (num) => String(num).padStart(2, '0');
        setCountdownText(`${pad(h)}h : ${pad(m)}m : ${pad(s)}s remaining`);
      } else {
        setCountdownText('Your slot is ready! Please head to the chair.');
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [liveBooking]);

  if (loading) {
    return (
      <main className="min-h-[80vh] flex flex-col items-center justify-center pt-8 pb-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
        <div className="w-16 h-16 rounded-full border-4 border-dashed border-primary flex items-center justify-center animate-spin [animation-duration:8s]">
          <MdSchedule className="text-[32px] text-primary" />
        </div>
        <h2 className="mt-6 font-display-lg text-headline-lg text-on-surface animate-pulse">Syncing with Salon...</h2>
        <p className="text-on-surface-variant font-label-md mt-2">Retrieving your live queue status</p>
      </main>
    );
  }

  if (error || !liveBooking) {
    return (
      <main className="min-h-[80vh] flex flex-col items-center justify-center pt-8 pb-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
        <div className="bg-surface-container rounded-2xl p-xl max-w-lg text-center border border-white/10 shadow-soft">
          <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
            <MdWarning className="text-primary text-4xl" />
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Couldn't Find That Booking</h2>
          <p className="text-on-surface-variant font-body-md mb-6 leading-relaxed">
            Looks like this session expired or the booking ID isn't valid anymore. No worries — just grab a fresh slot and we'll get you sorted.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold transition-all shadow-warm-sm hover:brightness-105 active:scale-95"
          >
            Book a New Appointment
          </button>
        </div>
      </main>
    );
  }

  const stylistName = liveBooking?.barberId?.name || 'Your stylist';
  const stylistImage = liveBooking?.barberId?.profileImage || liveBooking?.barberId?.image || '';
  const queuePosition = liveBooking?.queueNumber;
  const progressPercent = liveBooking?.status === 'confirmed' ? 100 : liveBooking?.status === 'pending' ? 30 : 60;
  const salonName = liveBooking?.salonId?.name || 'GlowCut Salon';
  const serviceName = liveBooking?.serviceId?.name || 'Grooming Service';
  const finalAmount = liveBooking?.finalAmount || liveBooking?.price || 0;

  return (
    <motion.main
      className="relative z-10 pt-8 pb-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto font-body-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <section className="mb-xl">
        <Card variant="elevated" className="p-md md:p-xl flex flex-col md:flex-row items-center gap-xl border-t-2 border-primary/30">
          <div className="flex-1 w-full">
            <div className="flex items-center gap-sm mb-base text-primary">
              <MdSchedule className="text-[20px]" />
              <span className="font-label-md text-label-md uppercase tracking-widest text-primary shadow-warm-sm">
                Live Queue Status
              </span>
            </div>
            
            <h1 className="font-display-lg text-display-lg mb-md text-on-surface">
              {countdownText ? (
                <span className={countdownText.includes('ready') || countdownText.includes('Progress') ? 'text-primary' : 'text-primary'}>
                  {countdownText}
                </span>
              ) : (
                <>Status: <span className="text-primary capitalize">{liveBooking?.status || 'Pending'}</span></>
              )}
            </h1>
            
            <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden mb-base">
              <div
                className="h-full bg-primary rounded-full relative shadow-warm-sm transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 rounded-xl bg-surface border border-white/5">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Salon</span>
                <span className="font-bold text-on-surface flex items-center gap-1 text-sm"><MdStorefront className="text-primary"/> {salonName}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Service</span>
                <span className="font-bold text-on-surface flex items-center gap-1 text-sm"><MdContentCut className="text-primary"/> {serviceName}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Total</span>
                <span className="font-bold text-on-surface flex items-center gap-1 text-sm"><MdAttachMoney className="text-primary"/> PKR {finalAmount.toLocaleString()}</span>
              </div>
              <div className="flex flex-col gap-1 border-l border-white/10 pl-4">
                <span className="text-[10px] text-primary uppercase tracking-widest">Token / Queue</span>
                <span className="font-display-lg text-primary text-2xl leading-none">#{queuePosition || '--'}</span>
              </div>
            </div>
          </div>

          <div className="hidden md:block w-px h-40 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

          <div className="flex items-center gap-md w-full md:w-auto bg-surface p-4 rounded-xl border border-white/5">
            <div className="relative">
              {stylistImage ? (
                <img
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-primary p-1 object-cover bg-surface-container shadow-warm-sm"
                  alt={stylistName}
                  src={stylistImage}
                />
              ) : (
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-primary p-1 bg-surface-container shadow-warm-sm flex items-center justify-center">
                  <MdPerson className="text-on-surface-variant text-4xl" />
                </div>
              )}
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-primary rounded-full border-2 border-surface animate-pulse" />
            </div>
            <div>
              <p className="text-on-surface-variant text-caption uppercase tracking-wider mb-xs">
                Assigned To
              </p>
              <p className="font-headline-md text-headline-md leading-tight text-on-surface">{stylistName}</p>
              <p className="text-primary font-label-md text-label-md mt-xs italic">
                GlowCut Specialist
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        <div className="lg:col-span-5">
          <div className="flex items-center justify-between mb-md">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Quick Play Games</h2>
            <MdVideogameAsset className="text-primary text-2xl" />
          </div>
          <div className="grid grid-cols-2 gap-md">
            {GAMES.map((game) => {
              const Icon = game.icon;
              return (
                <Card key={game.title} variant="glass" hoverable className="p-md">
                  <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-md group-hover:scale-110 transition-transform">
                    <Icon className="text-[28px] text-primary" />
                  </div>
                  <h3 className="font-headline-md text-headline-md mb-xs text-on-surface">{game.title}</h3>
                  <p className="text-on-surface-variant text-caption mb-md leading-relaxed">{game.description}</p>
                  <button
                    onClick={() => toast('Mini-games coming soon!')}
                    className="w-full py-2 border border-white/10 rounded-xl font-label-md text-label-md hover:bg-white/10 transition-colors text-on-surface"
                  >
                    Play Now
                  </button>
                </Card>
              );
            })}
          </div>
          <div className="mt-md bg-surface-container border border-white/5 rounded-xl p-md flex items-center justify-between opacity-60 cursor-not-allowed">
            <div className="flex items-center gap-sm">
              <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center border border-white/5">
                <MdLeaderboard className="text-primary" />
              </div>
              <div>
                <p className="font-label-md text-label-md text-on-surface">Lounge Leaderboard</p>
                <p className="text-on-surface-variant text-caption">Coming soon</p>
              </div>
            </div>
            <MdChevronRight className="text-on-surface-variant" />
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-md">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Trending Styles</h2>
            <MdTrendingUp className="text-primary text-2xl" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-md">
            {Array.from({ length: 3 }).map((_, i) => {
              const video = VIDEOS[i % VIDEOS.length];
              return (
                <div
                  key={i}
                  className="relative group aspect-[9/16] rounded-xl overflow-hidden bg-surface-container border border-white/10 cursor-pointer"
                >
                  <img
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={video.title}
                    src={video.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                  <div className="absolute bottom-0 p-sm w-full">
                    <p className="font-label-md text-label-md text-on-surface line-clamp-2">
                      {video.title}
                    </p>
                    <div className="flex items-center gap-base mt-xs text-[10px] text-white/70">
                      <span className="flex items-center gap-xs">
                        <MdVisibility className="text-[12px]" /> {video.views}
                      </span>
                      <span className="flex items-center gap-xs">
                        <MdFavorite className="text-[12px]" /> {video.likes}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </motion.main>
  );
}
